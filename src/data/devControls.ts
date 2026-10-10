export type StatusOverride = 'auto' | 'on_duty' | 'on_break' | 'off_duty';

let current: StatusOverride = 'auto';
const listeners = new Set<(o: StatusOverride) => void>();

/** Dev-only status override (D7). Only the mock service honors it. */
export function getStatusOverride(): StatusOverride {
  return current;
}

export function setStatusOverride(o: StatusOverride): void {
  if (o === current) return;
  current = o;
  listeners.forEach((l) => l(o));
}

export function subscribeStatusOverride(l: (o: StatusOverride) => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
