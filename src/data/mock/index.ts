// Adding a third school only needs:
//  1. a config file + registry entry in src/config/universities/
//  2. one entry in `mockUniversityData` (src/data/mock/data.ts), keyed by that
//     university id: a dog, 4-5 stops, and a weekly schedule.
// No component, hook, or service changes.
export { MockDataService } from './MockDataService';
export type { MockDataServiceOptions } from './MockDataService';
export { mockUniversityData } from './data';
