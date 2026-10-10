import type { Dog, LocationUpdate, UniversitySummary, WeeklySchedule } from '../domain/types';

/** The only data surface the UI imports. Swap the implementation in `src/data/index.ts`. */
export interface DataService {
  getUniversities(): Promise<UniversitySummary[]>;
  /** Resolves null when the university has no dog (empty state). */
  getDog(universityId: string): Promise<Dog | null>;
  getSchedule(dogId: string): Promise<WeeklySchedule>;
  /** Calls `cb` immediately, then on every change. Returns an unsubscribe function. */
  subscribeToLocation(dogId: string, cb: (u: LocationUpdate) => void): () => void;
}
