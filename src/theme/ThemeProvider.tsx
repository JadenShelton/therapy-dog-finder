import React, { createContext, useContext, useMemo } from 'react';
import { defaultUniversity } from '../config/universities';
import { useUniversity } from '../state/UniversityProvider';
import { buildTheme, type Theme } from './tokens';

const ThemeContext = createContext<Theme | null>(null);

/** Theme follows the selected university; falls back to the default before one is chosen. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { university } = useUniversity();
  const theme = useMemo(() => buildTheme(university ?? defaultUniversity), [university]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside ThemeProvider');
  return theme;
}
