# Paws on Campus: Plan

Status: **RECOVERY IN PROGRESS.** PRs #1 to #6 were merged on GitHub, but only #1 reached `main` (see D16). PR `restore-merged-work` → `main` is being prepared. It also commits these docs.

## Goal
An Expo (TypeScript) prototype for iOS and Android that runs in Expo Go. It shows where a university's therapy dog is on campus during working hours. All data is mocked behind one data-service interface. Supported schools: CSU (Fort Collins) and University of Utah. A third school should need only a config entry.

## Architecture
```
app/                      Expo Router routes
  _layout.tsx             Providers: UniversityProvider > ThemeProvider > DataServiceProvider
  index.tsx               Redirects to /select or /(tabs) based on the saved choice
  select.tsx              University select (neutral theme until a school is chosen, D15)
  (tabs)/_layout.tsx      Tabs: Home, Schedule, About (Ionicons, 13 pt scalable labels, D13)
  (tabs)/index.tsx        Home / map
  (tabs)/schedule.tsx     Weekly hours + recurring stops with names (D14)
  (tabs)/about.tsx        Includes the __DEV__-only "Demo controls" status override
src/
  config/universities/    csu.ts, utah.ts, index.ts (registry array)
  theme/                  tokens.ts, ThemeProvider.tsx, useTheme(), contrast.ts, neutral.ts (D15)
  data/                   DataService.ts, mock/, index.ts (factory), hooks.ts, devControls.ts
  domain/                 status.ts (computeStatus), types.ts
  state/                  University selection context + AsyncStorage
  components/             ThemedText, LoadingView, EmptyView, ErrorView, UniversityCard, schedule/, about/
  components/home/        StatusCard, RecenterButton, DogMarker, HomeEmptyState, HomeErrorState, format.ts
```

### Data-service interface
```ts
interface DataService {
  getUniversities(): Promise<UniversitySummary[]>;
  getDog(universityId: string): Promise<Dog | null>;            // null means empty state
  getSchedule(dogId: string): Promise<WeeklySchedule>;          // includes stops: Stop[] (D14)
  subscribeToLocation(dogId: string, cb: (u: LocationUpdate) => void): () => void;
}
type LocationUpdate =
  | { status: 'on_duty' | 'on_break'; coords: LatLng; stopName?: string; updatedAt: string }
  | { status: 'off_duty'; nextStart: string | null; updatedAt: string };
```

## Work history
| # | Branch | Original base | Scope | GitHub PR | Reached main? |
|---|--------|---------------|-------|-----------|---------------|
| 1 | `scaffold-theming` | main | Shell, theme, config, persistence, tests | #1 | Yes |
| 2 | `data-layer` | `scaffold-theming` | Types, DataService, mock, status, simulator | #2 | No |
| 3 | `map-home` | `data-layer` | Home/map screen | #3 | No |
| 4 | `screens-select-schedule-about` | `data-layer` | Select, Schedule, About, README | #4 | No |
| 5 | `schedule-stop-names` | `screens-select-schedule-about` | Stop names (D14) | #5 | No |
| 6 | `ui-polish` | `screens-select-schedule-about` | Icons, labels, neutral theme (D13, D15) | #6 | No |
| 7 | `restore-merged-work` | **main** | Bring 2 to 6 + docs into main | TBD | IN PROGRESS |

Rule from now on (D16): every PR targets `main`.

## Open risks / unverified
- Until #7 merges, `main` only has the placeholder scaffold.
- After #7: verify on device: map/pin, icons, neutral select, stop names, large-font tab labels, Hermes `Intl` timezone.
- iOS VoiceOver status announcements are not implemented. The PR 3 error/retry path is untested.
- Duplication: `HomeEmptyState`/`HomeErrorState` vs `EmptyView`/`ErrorView`.
- `jest.config` ignores `/.claude/` (affects agent worktrees only).

## Done criteria (whole project)
- `npx expo start` runs in Expo Go on iOS and Android.
- Switching university re-themes the whole app right away. No hex literals outside `src/config` and `src/theme`.
- Every text/background token pair passes 4.5:1.
- The pin appears only during working hours. Off duty shows "Off duty" and the next start time.
- Adding a school = config file plus registry entry plus mock data.
- Controls are labeled. Text scales.

## Status log
- 2026-10-10: Plan drafted. Intern research done. User approved D1 to D11.
- 2026-10-10: PRs #1 to #4 opened. User device test led to D12 to D15. #5 and #6 opened.
- 2026-10-10: User merged all six. Only #1 reached main (stacked bases). The uncommitted docs were overwritten by the PR-1 versions and restored by the PM from context. Recovery PR dispatched.
