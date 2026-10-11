import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import Home from '../app/(tabs)/index';
import { DataServiceProvider } from '../src/data';
import type { DataService } from '../src/data/DataService';
import type { LocationUpdate } from '../src/domain/types';
import { UniversityProvider, useUniversity } from '../src/state';
import { ThemeProvider } from '../src/theme';

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MapView = React.forwardRef((props: any, _ref: any) => <View testID="map">{props.children}</View>);
  const Marker = React.forwardRef((props: any, _ref: any) => <View testID={props.testID} />);
  return { __esModule: true, default: MapView, Marker };
});

const dog = { id: 'd1', name: 'Biscuit', universityId: 'csu', handler: { firstName: 'Sam' } };
const schedule = { shifts: {}, recurringStops: [], stops: [] };

function makeService(update: LocationUpdate, dogResult: unknown = dog): DataService {
  return {
    getUniversities: async () => [],
    getDog: async () => dogResult as any,
    getSchedule: async () => schedule,
    subscribeToLocation: (_id, cb) => {
      cb(update);
      return () => {};
    },
  };
}

function Boot({ children }: { children: React.ReactNode }) {
  const { setUniversity, university } = useUniversity();
  React.useEffect(() => {
    setUniversity('csu');
  }, [setUniversity]);
  return university ? <>{children}</> : null;
}

function renderHome(service: DataService) {
  return render(
    <UniversityProvider>
      <ThemeProvider>
        <DataServiceProvider service={service}>
          <Boot>
            <Home />
          </Boot>
        </DataServiceProvider>
      </ThemeProvider>
    </UniversityProvider>,
  );
}

const onDuty: LocationUpdate = {
  status: 'on_duty',
  coords: { latitude: 40.57, longitude: -105.08 },
  stopName: 'Library',
  updatedAt: '2026-10-12T20:41:00Z',
};
const offDuty: LocationUpdate = {
  status: 'off_duty',
  nextStart: '2026-10-13T16:00:00Z',
  updatedAt: '2026-10-12T20:41:00Z',
};

it('shows the marker when on duty', async () => {
  await renderHome(makeService(onDuty));
  expect(await screen.findByTestId('dog-marker')).toBeTruthy();
  expect(screen.getByText('On duty')).toBeTruthy();
  expect(screen.getByText('Updated 2:41 PM')).toBeTruthy();
  expect(screen.getByRole('button', { name: "Where's Biscuit now?" })).toBeEnabled();
});

it('hides the marker, shows next start, and disables recenter when off duty', async () => {
  await renderHome(makeService(offDuty));
  expect(await screen.findByText('Off duty')).toBeTruthy();
  expect(screen.queryByTestId('dog-marker')).toBeNull();
  expect(screen.getByText('Next on duty: Tue 10:00 AM')).toBeTruthy();
  expect(screen.getByRole('button', { name: "Where's Biscuit now?" })).toBeDisabled();
});

it('shows the empty state when there is no dog', async () => {
  await renderHome(makeService(offDuty, null));
  await waitFor(() => expect(screen.getByText('No therapy dog yet')).toBeTruthy());
  expect(screen.queryByTestId('map')).toBeNull();
});
