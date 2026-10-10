import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { csu } from '../src/config/universities/csu';
import { utah } from '../src/config/universities/utah';
import { UniversityProvider, useUniversity } from '../src/state';
import { ThemeProvider, useTheme } from '../src/theme';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UniversityProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UniversityProvider>
);

it('re-themes immediately when the university changes', async () => {
  const { result } = await renderHook(() => ({ theme: useTheme(), uni: useUniversity() }), { wrapper });
  await waitFor(() => expect(result.current.uni.loading).toBe(false));
  await act(async () => result.current.uni.setUniversity('utah'));
  expect(result.current.theme.colors.primary).toBe(utah.theme.primary);
  await act(async () => result.current.uni.setUniversity('csu'));
  expect(result.current.theme.colors.primary).toBe(csu.theme.primary);
});
