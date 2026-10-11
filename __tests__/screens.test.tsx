import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import About from '../app/(tabs)/about';
import Schedule from '../app/(tabs)/schedule';
import { ScheduleView } from '../src/components/schedule/ScheduleView';
import Select from '../app/select';
import { universities } from '../src/config/universities';
import { DataServiceProvider, getStatusOverride, setStatusOverride } from '../src/data';
import { UniversityProvider } from '../src/state';
import { STORAGE_KEY } from '../src/state/storage';
import { ThemeProvider } from '../src/theme';

const mockReplace = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: mockReplace }) }));

function renderScreen(ui: React.ReactElement) {
  return render(
    <UniversityProvider>
      <ThemeProvider>
        <DataServiceProvider>{ui}</DataServiceProvider>
      </ThemeProvider>
    </UniversityProvider>,
  );
}

beforeEach(async () => {
  await AsyncStorage.clear();
  mockReplace.mockClear();
  setStatusOverride('auto');
});

describe('Select', () => {
  it('renders a card per university and persists the choice', async () => {
    await renderScreen(<Select />);
    for (const u of universities) {
      expect(await screen.findByRole('button', { name: `Select ${u.name}` })).toBeTruthy();
    }
    fireEvent.press(screen.getByRole('button', { name: `Select ${universities[1].name}` }));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/(tabs)'));
    expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe(universities[1].id);
  });
});

describe('Schedule', () => {
  it('shows all 7 days and the recurring stops', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'csu');
    await renderScreen(<Schedule />);
    for (const d of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
      expect(await screen.findByText(d)).toBeTruthy();
    }
    expect(screen.getAllByText('Off').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Reading hour')).toBeTruthy();
    expect(screen.getByText('Oval meet-up')).toBeTruthy();
    expect(screen.getByText('Morgan Library')).toBeTruthy();
    expect(screen.getByText('Lory Student Center')).toBeTruthy();
    expect(screen.getByText('The Oval')).toBeTruthy();
    expect(screen.getAllByText('Today').length).toBe(1);
  });
});

describe('ScheduleView stop names', () => {
  it('falls back to "Campus stop" for an unknown stop id and does not crash', async () => {
    await renderScreen(
      <ScheduleView
        today={1}
        schedule={{
          shifts: {},
          stops: [],
          recurringStops: [{ weekday: 1, start: '10:00', end: '11:00', stopId: 'csu-missing', note: 'Mystery note' }],
        }}
      />,
    );
    expect(await screen.findByText('Campus stop')).toBeTruthy();
    expect(screen.getByText('Mystery note')).toBeTruthy();
    expect(screen.queryByText(/missing/i)).toBeNull();
  });
});

describe('About', () => {
  it('updates the dev status override', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'csu');
    await renderScreen(<About />);
    fireEvent.press(await screen.findByRole('button', { name: 'On break' }));
    expect(getStatusOverride()).toBe('on_break');
    await waitFor(() => expect(screen.getByRole('button', { name: 'On break', selected: true })).toBeTruthy());
  });

  it('opens the contact link', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'csu');
    const spy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
    await renderScreen(<About />);
    fireEvent.press(await screen.findByRole('link', { name: /Contact Colorado State/ }));
    expect(spy).toHaveBeenCalledWith(universities.find((u) => u.id === 'csu')!.contactUrl);
  });
});
