import type { Dog, Stop, WeeklySchedule } from '../../domain/types';

export type MockUniversityData = { dog: Dog; stops: Stop[]; schedule: WeeklySchedule };

// All names are placeholders (D11). All coordinates are approximate (D10).

const csuStops: Stop[] = [
  { id: 'csu-morgan', name: 'Morgan Library', coords: { latitude: 40.5738, longitude: -105.0858 } }, // approximate
  { id: 'csu-lory', name: 'Lory Student Center', coords: { latitude: 40.5733, longitude: -105.0818 } }, // approximate
  { id: 'csu-oval', name: 'The Oval', coords: { latitude: 40.5755, longitude: -105.0865 } }, // approximate
  { id: 'csu-res', name: 'Residence hall area', coords: { latitude: 40.5707, longitude: -105.0889 } }, // approximate
  { id: 'csu-class', name: 'Clark Building', coords: { latitude: 40.5728, longitude: -105.0848 } }, // approximate
];

const utahStops: Stop[] = [
  { id: 'utah-marriott', name: 'Marriott Library', coords: { latitude: 40.76248, longitude: -111.84618 } }, // approximate
  { id: 'utah-olpin', name: 'Olpin Union', coords: { latitude: 40.7655, longitude: -111.8458 } }, // approximate
  { id: 'utah-circle', name: "Presidents' Circle", coords: { latitude: 40.7609, longitude: -111.8444 } }, // approximate
  { id: 'utah-lassonde', name: 'Lassonde / Heritage area', coords: { latitude: 40.7628, longitude: -111.8365 } }, // approximate
  { id: 'utah-kahlert', name: 'Kahlert Village', coords: { latitude: 40.7677, longitude: -111.8395 } }, // approximate
];

// Weekdays: 0 Sun ... 6 Sat. Weekends are off for both schools.
const csuSchedule: WeeklySchedule = {
  shifts: {
    1: [{ start: '10:00', end: '14:00', breaks: [{ start: '12:00', end: '12:30' }] }],
    2: [{ start: '13:00', end: '17:00', breaks: [{ start: '15:00', end: '15:30' }] }],
    3: [{ start: '10:00', end: '14:00', breaks: [{ start: '12:00', end: '12:30' }] }],
    4: [{ start: '13:00', end: '17:00', breaks: [{ start: '15:00', end: '15:30' }] }],
    5: [{ start: '10:00', end: '14:00', breaks: [{ start: '12:00', end: '12:30' }] }],
  },
  recurringStops: [
    { weekday: 1, start: '10:00', end: '11:00', stopId: 'csu-morgan', note: 'Reading hour' },
    { weekday: 3, start: '10:00', end: '11:00', stopId: 'csu-lory', note: 'Study break' },
    { weekday: 4, start: '13:00', end: '14:00', stopId: 'csu-oval', note: 'Oval meet-up' },
  ],
  stops: csuStops,
};

const utahSchedule: WeeklySchedule = {
  shifts: {
    1: [{ start: '09:00', end: '13:00', breaks: [{ start: '11:00', end: '11:30' }] }],
    2: [{ start: '09:00', end: '13:00', breaks: [{ start: '11:00', end: '11:30' }] }],
    3: [{ start: '09:00', end: '13:00', breaks: [{ start: '11:00', end: '11:30' }] }],
    4: [{ start: '09:00', end: '13:00', breaks: [{ start: '11:00', end: '11:30' }] }],
    5: [{ start: '11:00', end: '15:00', breaks: [{ start: '13:00', end: '13:30' }] }],
  },
  recurringStops: [
    { weekday: 1, start: '09:00', end: '10:00', stopId: 'utah-marriott', note: 'Library visit' },
    { weekday: 4, start: '11:30', end: '12:30', stopId: 'utah-olpin', note: 'Union lunch hour' },
    { weekday: 5, start: '11:00', end: '12:00', stopId: 'utah-circle' },
  ],
  stops: utahStops,
};

/** Keyed by university id (must match a config in src/config/universities). */
export const mockUniversityData: Record<string, MockUniversityData> = {
  csu: {
    dog: { id: 'dog-csu-biscuit', name: 'Biscuit', universityId: 'csu', handler: { firstName: 'Maya' }, photo: 'placeholder-dog' },
    stops: csuStops,
    schedule: csuSchedule,
  },
  utah: {
    dog: { id: 'dog-utah-juniper', name: 'Juniper', universityId: 'utah', handler: { firstName: 'Sam' }, photo: 'placeholder-dog' },
    stops: utahStops,
    schedule: utahSchedule,
  },
};
