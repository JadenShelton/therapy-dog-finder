import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, renderHook, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import TabsLayout from '../app/(tabs)/_layout';
import Select from '../app/select';
import { csu } from '../src/config/universities/csu';
import { UniversityProvider, useUniversity } from '../src/state';
import { STORAGE_KEY } from '../src/state/storage';
import {
  MIN_TEXT_CONTRAST,
  ThemeProvider,
  buildNeutralTheme,
  contrast,
  neutralColors,
  textPairs,
  typeScale,
  useTheme,
} from '../src/theme';

// Minimal Tabs stand-in that renders each screen's title and icon and records screenOptions.
let mockScreenOptions: any;
jest.mock('expo-router', () => {
  const R = require('react');
  const { View, Text } = require('react-native');
  const Tabs: any = ({ children, screenOptions }: any) => {
    mockScreenOptions = screenOptions;
    return (
      <View>
        {R.Children.map(children, (c: any) => (
          <View key={c.props.name}>
            <Text>{c.props.options.title}</Text>
            {c.props.options.tabBarIcon({ color: 'red', size: 24, focused: false })}
          </View>
        ))}
      </View>
    );
  };
  Tabs.Screen = () => null;
  return { Tabs, useRouter: () => ({ replace: jest.fn() }) };
});

const wrap = ({ children }: { children: React.ReactNode }) => (
  <UniversityProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UniversityProvider>
);

beforeEach(() => AsyncStorage.clear());

describe('neutral theme', () => {
  for (const [fg, bg] of textPairs) {
    it(`${fg} on ${bg} >= ${MIN_TEXT_CONTRAST}:1`, () => {
      expect(contrast(neutralColors[fg], neutralColors[bg])).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    });
  }

  it('is unbranded', () => {
    expect(buildNeutralTheme().universityId).toBeNull();
    expect(Object.values(neutralColors)).not.toContain(csu.theme.primary);
  });

  it('applies with no selection, re-themes on select, and returns to neutral on clear', async () => {
    const { result } = await renderHook(() => ({ theme: useTheme(), uni: useUniversity() }), { wrapper: wrap });
    await waitFor(() => expect(result.current.uni.loading).toBe(false));
    expect(result.current.theme.colors.primary).toBe(neutralColors.primary);
    await React.act(async () => result.current.uni.setUniversity('csu'));
    expect(result.current.theme.colors.primary).toBe(csu.theme.primary);
    await React.act(async () => result.current.uni.clearUniversity());
    expect(result.current.theme.colors.primary).toBe(neutralColors.primary);
  });
});

describe('select screen with no selection', () => {
  it('uses neutral tokens', async () => {
    await render(<Select />, { wrapper: wrap });
    const heading = await screen.findByRole('header', { name: 'Choose your university' });
    expect(heading).toHaveStyle({ color: neutralColors.text });
    const root: any = screen.toJSON();
    expect(JSON.stringify(root.props.style)).toContain(neutralColors.background);
  });
});

describe('tab layout', () => {
  it('renders decorative icons and labels at a readable, scalable size', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'csu');
    await render(<TabsLayout />, { wrapper: wrap });
    for (const label of ['Home', 'Schedule', 'About']) expect(screen.getByText(label)).toBeTruthy();
    for (const name of ['map', 'calendar', 'information-circle']) {
      expect(screen.getByTestId(`tab-icon-${name}`)).toBeTruthy();
    }
    expect(mockScreenOptions.tabBarLabelStyle.fontSize).toBe(typeScale.caption.fontSize);
    expect(mockScreenOptions.tabBarLabelStyle.fontSize).toBeGreaterThanOrEqual(13);
    expect(mockScreenOptions.tabBarAllowFontScaling).toBe(true);
    expect(mockScreenOptions.tabBarInactiveTintColor).toBe(csu.theme.textMuted);
    expect(mockScreenOptions.tabBarActiveTintColor).toBe(csu.theme.primary);
  });
});
