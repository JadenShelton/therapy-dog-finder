import type { DataService } from './DataService';
import { MockDataService } from './mock';

/** Factory. Returns the mock today; swap here for a real service later. */
export function createDataService(): DataService {
  return new MockDataService();
}
