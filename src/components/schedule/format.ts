import type { Weekday } from '../../domain/types';

export const DAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
export const DAY_NAMES: Record<Weekday, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/** '13:30' -> '1:30 PM' */
export function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatRange(r: { start: string; end: string }): string {
  return `${formatTime(r.start)} to ${formatTime(r.end)}`;
}

export const UNKNOWN_STOP_NAME = 'Campus stop';

/** Resolve a stop id to its name via the schedule's stop catalog. Never throws. */
export function stopName(stops: { id: string; name: string }[] | undefined, id: string): string {
  return stops?.find((s) => s.id === id)?.name || UNKNOWN_STOP_NAME;
}
