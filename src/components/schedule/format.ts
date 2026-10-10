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

/** 'csu-morgan' -> 'Morgan'. Fallback only: the schedule carries stop ids, not names. */
export function humanizeStopId(id: string): string {
  const rest = id.split('-').slice(1).join(' ') || id;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}
