import { campusClock, computeStatus, parseTime } from '../../domain/status';
import type { LocationUpdate, Stop, WeeklySchedule } from '../../domain/types';
import type { StatusOverride } from '../devControls';

export const TICK_MS = 15_000;

export type Timer = {
  setInterval: (fn: () => void, ms: number) => unknown;
  clearInterval: (handle: unknown) => void;
};

export const realTimer: Timer = {
  setInterval: (fn, ms) => setInterval(fn, ms),
  clearInterval: (h) => clearInterval(h as ReturnType<typeof setInterval>),
};

export type SimulatorOptions = {
  schedule: WeeklySchedule;
  stops: Stop[];
  timeZone: string;
  clock: () => Date;
  timer: Timer;
  getOverride: () => StatusOverride;
  subscribeOverride: (l: (o: StatusOverride) => void) => () => void;
  tickMs?: number;
};

/** Dwell is 1 tick at even stop indexes and 2 ticks at odd ones (D7: 1 or 2 ticks). */
export function dwellTicks(stopIndex: number): number {
  return 1 + (stopIndex % 2);
}

/**
 * Creates a subscribe function. Each subscriber gets its own walk and timer.
 * Emits immediately, then every tick, and again when the override changes.
 */
export function createLocationSimulator(opts: SimulatorOptions) {
  const { schedule, stops, timeZone, clock, timer, tickMs = TICK_MS } = opts;

  return function subscribe(cb: (u: LocationUpdate) => void): () => void {
    let stopIndex = 0;
    let dwellLeft = dwellTicks(0);
    let active = true;

    const recurringStopIndex = (now: Date): number => {
      const { weekday, minutes } = campusClock(now, timeZone);
      const r = schedule.recurringStops.find(
        (s) => s.weekday === weekday && minutes >= parseTime(s.start) && minutes < parseTime(s.end),
      );
      return r ? stops.findIndex((s) => s.id === r.stopId) : -1;
    };

    const resolveStatus = (now: Date) => {
      const override = opts.getOverride();
      const computed = computeStatus(schedule, now, timeZone);
      return {
        status: override === 'auto' ? computed.status : override,
        nextStart: computed.nextStart,
      };
    };

    const advance = (now: Date) => {
      const pinned = recurringStopIndex(now);
      if (pinned >= 0) {
        // Recurring appearance: stay at that stop for its whole window.
        if (pinned !== stopIndex) {
          stopIndex = pinned;
          dwellLeft = dwellTicks(stopIndex);
        }
        return;
      }
      dwellLeft -= 1;
      if (dwellLeft <= 0) {
        stopIndex = (stopIndex + 1) % stops.length;
        dwellLeft = dwellTicks(stopIndex);
      }
    };

    const emit = () => {
      if (!active) return;
      const now = clock();
      const { status, nextStart } = resolveStatus(now);
      const updatedAt = now.toISOString();
      if (status === 'off_duty') {
        cb({ status, nextStart, updatedAt });
        return;
      }
      const stop = stops[stopIndex];
      cb({ status, coords: stop.coords, stopName: stop.name, updatedAt });
    };

    const tick = () => {
      if (!active) return;
      const now = clock();
      // The pin stays put during breaks and while off duty.
      if (resolveStatus(now).status === 'on_duty') advance(now);
      emit();
    };

    emit();
    const handle = timer.setInterval(tick, tickMs);
    const offOverride = opts.subscribeOverride(emit);

    return () => {
      active = false;
      timer.clearInterval(handle);
      offOverride();
    };
  };
}
