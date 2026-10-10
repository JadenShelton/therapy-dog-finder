import React, { createContext, useContext, useMemo } from 'react';
import { useUniversity } from '../state/UniversityProvider';
import { buildNeutralTheme, buildTheme, type Theme } from './tokens';

const ThemeContext = createContext<Theme | null>(null);

/** Theme follows the selected university; it is neutral (unbranded) until one is chosen. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { university } = useUniversity();
  const theme = useMemo(() => (university ? buildTheme(university) : buildNeutralTheme()), [university]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside ThemeProvider');
  return theme;
}
