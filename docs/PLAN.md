# Paws on Campus: Plan

Status: **APPROVED 2026-10-10.** See `docs/DECISIONS.md` (D1 to D11).

## Goal
An Expo (TypeScript) prototype for iOS and Android that runs in Expo Go. It shows where a university's therapy dog is on campus during working hours. All data is mocked behind one data-service interface. Supported schools: CSU (Fort Collins) and University of Utah. A third school should need only a config entry.

## Architecture
```
app/                      Expo Router routes
  _layout.tsx             Providers: UniversityProvider > ThemeProvider > DataServiceProvider
  index.tsx               Redirects to /select or /(tabs) based on the saved choice
  select.tsx              University select
  (tabs)/_layout.tsx      Tabs: Home, Schedule, About
  (tabs)/index.tsx        Home / map
  (tabs)/schedule.tsx
  (tabs)/about.tsx
src/
  config/universities/    csu.ts, utah.ts, index.ts (registry array)
  theme/                  tokens.ts, ThemeProvider.tsx, useTheme(), contrast.ts
  data/
    DataService.ts        Interface (the only thing the UI imports)
    mock/                 MockDataService, mock dogs, schedules, movement simulator
    index.ts              Factory (returns the mock today)
  domain/
    status.ts             Pure: (schedule, now, tz) -> {status, nextStart}
    types.ts
  state/                  University selection context + AsyncStorage
  components/             StatusCard, RecenterButton, UniversityCard, LoadingView, EmptyView
```

### Data-service interface
```ts
interface DataService {
  getUniversities(): Promise<UniversitySummary[]>;
  getDog(universityId: string): Promise<Dog | null>;            // null means empty state
  getSchedule(dogId: string): Promise<WeeklySchedule>;
  subscribeToLocation(dogId: string, cb: (u: LocationUpdate) => void): () => void;
}
type LocationUpdate =
  | { status: 'on_duty' | 'on_break'; coords: LatLng; stopName?: string; updatedAt: string }
  | { status: 'off_duty'; nextStart: string | null; updatedAt: string };
```

### University config
```ts
{ id, name, shortName, city, timezone, mapRegion, theme: {primary, onPrimary, secondary,
  onSecondary, background, surface, text, textMuted, mapAccent}, aboutText, contactUrl }
```

## Work breakdown (one branch and one PR each, never merged)
| # | Branch | Base | Scope | Status |
|---|--------|------|-------|--------|
| 0 | (intern) | n/a | Brand colors and coordinates | DONE (see D6, D10) |
| 1 | `scaffold-theming` | main | Expo shell, router, placeholder screens, theme, university config, persistence, Jest, contrast test | IN PROGRESS |
| 2 | `data-layer` | `scaffold-theming` | Types, DataService, mock, status logic, simulator, tests | TODO |
| 3 | `map-home` | `data-layer` | Home screen: map, pin, status card, recenter, states | TODO |
| 4 | `screens-select-schedule-about` | `data-layer` | Select, Schedule, About screens, and the README | TODO |

## Done criteria (whole project)
- `npx expo start` runs in Expo Go on iOS and Android.
- Switching university re-themes the whole app right away. No hex literals outside `src/config` and `src/theme` (a test enforces this).
- Every text/background token pair passes 4.5:1 (unit test).
- The pin appears only during working hours. Off duty shows "Off duty" and the next start time.
- Adding a school = config file plus registry entry plus mock data. No component changes.
- Controls are labeled. Text scales with the system font size.

## Status log
- 2026-10-10: Plan drafted, intern research done, user approved all decisions. Dispatched PR 1.
