import type { UniversityConfig, UniversityTheme } from '../config/universities';
import { relativeLuminance } from './contrast';

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { sm: 6, md: 12, lg: 20, pill: 999 } as const;
export const typeScale = {
  caption: { fontSize: 13, lineHeight: 18 },
  body: { fontSize: 16, lineHeight: 22 },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '600' as const },
  heading: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
} as const;

export type Theme = {
  universityId: string;
  colors: UniversityTheme;
  spacing: typeof spacing;
  radii: typeof radii;
  type: typeof typeScale;
  /** Status bar content style for the (primary-colored) header area. */
  statusBarStyle: 'light' | 'dark';
};

/** Pairs of [foreground, background] token names that hold text and must reach 4.5:1. */
export const textPairs: ReadonlyArray<readonly [keyof UniversityTheme, keyof UniversityTheme]> = [
  ['onPrimary', 'primary'],
  ['onSecondary', 'secondary'],
  ['text', 'background'],
  ['text', 'surface'],
  ['textMuted', 'background'],
  ['textMuted', 'surface'],
  ['primary', 'background'], // primary used as link/active tab text on background
  ['primary', 'surface'],
];

export function buildTheme(u: UniversityConfig): Theme {
  return {
    universityId: u.id,
    colors: u.theme,
    spacing,
    radii,
    type: typeScale,
    statusBarStyle: relativeLuminance(u.theme.onPrimary) > 0.5 ? 'light' : 'dark',
  };
}
