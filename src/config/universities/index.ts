import { csu } from './csu';
import { utah } from './utah';
import type { UniversityConfig } from './types';

export type { UniversityConfig, UniversityTheme, LatLngRegion } from './types';

/** To add a school: create one config file and add it to this array. */
export const universities: readonly UniversityConfig[] = [csu, utah];

export const defaultUniversity: UniversityConfig = universities[0];

export function getUniversity(id: string | null | undefined): UniversityConfig | null {
  return universities.find((u) => u.id === id) ?? null;
}
