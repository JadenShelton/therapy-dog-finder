import { getUniversity, universities } from '../../config/universities';
import type { Dog, LocationUpdate, UniversitySummary, WeeklySchedule } from '../../domain/types';
import type { DataService } from '../DataService';
import { getStatusOverride, subscribeStatusOverride } from '../devControls';
import { mockUniversityData, type MockUniversityData } from './data';
import { createLocationSimulator, realTimer, type Timer } from './simulator';

export type MockDataServiceOptions = {
  clock?: () => Date;
  timer?: Timer;
  /** Simulated network delay for getters. Use 0 in tests. */
  latencyMs?: number;
  tickMs?: number;
  data?: Record<string, MockUniversityData>;
};

export class MockDataService implements DataService {
  private clock: () => Date;
  private timer: Timer;
  private latencyMs: number;
  private tickMs?: number;
  private data: Record<string, MockUniversityData>;

  constructor(opts: MockDataServiceOptions = {}) {
    this.clock = opts.clock ?? (() => new Date());
    this.timer = opts.timer ?? realTimer;
    this.latencyMs = opts.latencyMs ?? 250;
    this.tickMs = opts.tickMs;
    this.data = opts.data ?? mockUniversityData;
  }

  private delay<T>(value: () => T): Promise<T> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        try {
          resolve(value());
        } catch (e) {
          reject(e);
        }
      }, this.latencyMs),
    );
  }

  private byDogId(dogId: string): MockUniversityData | undefined {
    return Object.values(this.data).find((d) => d.dog.id === dogId);
  }

  getUniversities(): Promise<UniversitySummary[]> {
    return this.delay(() =>
      universities.map(({ id, name, shortName, city, timezone }) => ({ id, name, shortName, city, timezone })),
    );
  }

  getDog(universityId: string): Promise<Dog | null> {
    return this.delay(() => this.data[universityId]?.dog ?? null);
  }

  getSchedule(dogId: string): Promise<WeeklySchedule> {
    return this.delay(() => {
      const d = this.byDogId(dogId);
      if (!d) throw new Error(`Unknown dog: ${dogId}`);
      return d.schedule;
    });
  }

  subscribeToLocation(dogId: string, cb: (u: LocationUpdate) => void): () => void {
    const d = this.byDogId(dogId);
    const tz = d && getUniversity(d.dog.universityId)?.timezone;
    if (!d || !tz) {
      cb({ status: 'off_duty', nextStart: null, updatedAt: this.clock().toISOString() });
      return () => {};
    }
    return createLocationSimulator({
      schedule: d.schedule,
      stops: d.stops,
      timeZone: tz,
      clock: this.clock,
      timer: this.timer,
      tickMs: this.tickMs,
      getOverride: getStatusOverride,
      subscribeOverride: subscribeStatusOverride,
    })(cb);
  }
}
