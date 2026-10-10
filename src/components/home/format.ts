/** Formatting helpers for the Home screen. All times are shown in the campus timezone. */

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback; // e.g. Intl timeZone support missing
  }
}

/** '14:41' (campus wall clock) -> '2:41 PM'. No Intl needed. */
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatHours(ranges: { start: string; end: string }[]): string {
  if (ranges.length === 0) return 'Not working today';
  return ranges.map((r) => `${formatClock(r.start)} to ${formatClock(r.end)}`).join(', ');
}

/** ISO instant -> '2:41 PM' in `timeZone`. */
export function formatTimeInZone(iso: string, timeZone: string): string {
  const d = new Date(iso);
  return safe(
    () => new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(d),
    d.toISOString().slice(11, 16) + ' UTC',
  );
}

/** ISO instant -> 'Tue 10:00 AM' in `timeZone`. */
export function formatNextStart(iso: string, timeZone: string): string {
  const d = new Date(iso);
  return safe(() => {
    const day = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(d);
    return `${day} ${formatTimeInZone(iso, timeZone)}`;
  }, d.toISOString());
}

export const STATUS_LABEL = { on_duty: 'On duty', on_break: 'On break', off_duty: 'Off duty' } as const;
