import type { DutyStatus, Shift, TimeOfDay, TimeRange, Weekday, WeeklySchedule } from './types';

export type StatusResult = {
  status: DutyStatus;
  /** ISO instant of the next shift start after `now`, or null if the schedule has no shifts. */
  nextStart: string | null;
  /** Today's shifts in campus time (empty if none). */
  todayHours: TimeRange[];
};

type Zoned = { year: number; month: number; day: number; weekday: Weekday; minutes: number };

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'short',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

const WEEKDAYS: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function zonedParts(date: Date, timeZone: string) {
  const p: Record<string, string> = {};
  for (const part of getFormatter(timeZone).formatToParts(date)) p[part.type] = part.value;
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour) % 24,
    minute: Number(p.minute),
    second: Number(p.second),
    weekday: WEEKDAYS[p.weekday],
  };
}

function toZoned(date: Date, timeZone: string): Zoned {
  const z = zonedParts(date, timeZone);
  return {
    year: z.year,
    month: z.month,
    day: z.day,
    weekday: z.weekday,
    minutes: z.hour * 60 + z.minute,
  };
}

/** Offset (ms) such that local wall time = UTC instant + offset. */
function offsetAt(instantMs: number, timeZone: string): number {
  const z = zonedParts(new Date(instantMs), timeZone);
  const asUtc = Date.UTC(z.year, z.month - 1, z.day, z.hour, z.minute, z.second);
  return asUtc - Math.floor(instantMs / 1000) * 1000;
}

/** Converts a wall-clock time in `timeZone` to a UTC instant. Handles DST changes. */
function zonedToInstant(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): Date {
  const wall = Date.UTC(year, month - 1, day, Math.floor(minutes / 60), minutes % 60);
  let guess = wall - offsetAt(wall, timeZone);
  // Re-check once: the offset at the guess may differ across a DST boundary.
  guess = wall - offsetAt(guess, timeZone);
  return new Date(guess);
}

export function parseTime(t: TimeOfDay): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function shiftsFor(schedule: WeeklySchedule, weekday: Weekday): Shift[] {
  return [...(schedule.shifts[weekday] ?? [])].sort((a, b) => parseTime(a.start) - parseTime(b.start));
}

/**
 * Pure duty status for `now`, evaluated in the campus `timeZone` (IANA name).
 * Shift and break ranges are start-inclusive, end-exclusive.
 */
export function computeStatus(schedule: WeeklySchedule, now: Date, timeZone: string): StatusResult {
  const z = toZoned(now, timeZone);
  const today = shiftsFor(schedule, z.weekday);

  let status: DutyStatus = 'off_duty';
  for (const shift of today) {
    if (z.minutes >= parseTime(shift.start) && z.minutes < parseTime(shift.end)) {
      const inBreak = (shift.breaks ?? []).some(
        (b) => z.minutes >= parseTime(b.start) && z.minutes < parseTime(b.end),
      );
      status = inBreak ? 'on_break' : 'on_duty';
      break;
    }
  }

  return {
    status,
    nextStart: findNextStart(schedule, z, timeZone),
    todayHours: today.map(({ start, end }) => ({ start, end })),
  };
}

function findNextStart(schedule: WeeklySchedule, z: Zoned, timeZone: string): string | null {
  // Offset 0 = rest of today; 1..7 = following days (7 wraps to the same weekday next week).
  for (let offset = 0; offset <= 7; offset++) {
    const weekday = ((z.weekday + offset) % 7) as Weekday;
    const starts = shiftsFor(schedule, weekday)
      .map((s) => parseTime(s.start))
      .filter((s) => offset > 0 || s > z.minutes);
    if (starts.length === 0) continue;
    // Calendar-day arithmetic in UTC avoids any DST effect on the date.
    const d = new Date(Date.UTC(z.year, z.month - 1, z.day + offset));
    return zonedToInstant(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      starts[0],
      timeZone,
    ).toISOString();
  }
  return null;
}

/** Campus weekday and minute-of-day for `now`. Used by the simulator for recurring stops. */
export function campusClock(now: Date, timeZone: string): { weekday: Weekday; minutes: number } {
  const z = toZoned(now, timeZone);
  return { weekday: z.weekday, minutes: z.minutes };
}
