# Paws on Campus: Plan

Status: **PROTOTYPE COMPLETE on `main` (2026-10-10).** All work merged via PR #7. The user verified the full demo on their phone in Expo Go. See `docs/DECISIONS.md` (D1 to D16).

## Goal
An Expo (TypeScript) prototype for iOS and Android that runs in Expo Go. It shows where a university's therapy dog is on campus during working hours. All data is mocked behind one data-service interface. Supported schools: CSU (Fort Collins) and University of Utah. A third school should need only a config entry.

## How to run
`git checkout main && git pull && npm install && npx expo start` (add `-c` if the bundle looks stale), then scan the QR code with Expo Go. Tests: `npx jest` (98 tests, 11 suites as of PR #7).

## Architecture (as built)
```
app/                      Expo Router routes
  _layout.tsx             Providers: UniversityProvider > ThemeProvider > DataServiceProvider
  index.tsx               Redirects to /select or /(tabs) based on the saved choice
  select.tsx              University select (neutral theme until a school is chosen, D15)
  (tabs)/_layout.tsx      Tabs: Home, Schedule, About (Ionicons, 13 pt scalable labels, D13)
  (tabs)/index.tsx        Home / map: pin, StatusCard, "Where's {dog} now?" recenter
  (tabs)/schedule.tsx     Weekly hours + recurring stops with names (D14)
  (tabs)/about.tsx        Program text, contact link, change university, __DEV__ "Demo controls"
src/
  config/universities/    csu.ts, utah.ts, index.ts (registry array)
  theme/                  tokens.ts, ThemeProvider.tsx, useTheme(), contrast.ts, neutral.ts
  data/                   DataService.ts, mock/, index.ts (factory), hooks.ts, devControls.ts
  domain/                 status.ts (computeStatus), types.ts
  state/                  University selection context + AsyncStorage
  components/             ThemedText, LoadingView, EmptyView, ErrorView, UniversityCard, schedule/, about/
  components/home/        StatusCard, RecenterButton, DogMarker, HomeEmptyState, HomeErrorState, format.ts
```
Mock data: CSU uses Biscuit with handler Maya, and Utah uses Juniper with handler Sam. There are 5 approximate stops per campus.

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
| # | Branch | Scope | GitHub PR | Outcome |
|---|--------|-------|-----------|---------|
| 1 | `scaffold-theming` | Shell, theme, config, persistence, tests | #1 | Merged to main |
| 2 | `data-layer` | Types, DataService, mock, status, simulator | #2 | Merged to its stacked base, reached main via #7 |
| 3 | `map-home` | Home/map screen | #3 | Same as above |
| 4 | `screens-select-schedule-about` | Select, Schedule, About, README | #4 | Same as above |
| 5 | `schedule-stop-names` | Stop names (D14) | #5 | Same as above |
| 6 | `ui-polish` | Icons, labels, neutral theme (D13, D15) | #6 | Same as above |
| 7 | `restore-merged-work` | Brought #2 to #6 + docs into main | #7 | Merged to main. User verified on device |

Rule (D16): every PR targets `main`. The old feature branches still exist on GitHub and can be deleted.

## Backlog / known gaps (not started)
1. iOS VoiceOver announcement of status changes (only the Android live region exists).
2. Test the Home error/retry path.
3. Consolidate `HomeEmptyState`/`HomeErrorState` into the generic `EmptyView`/`ErrorView`.
4. Confirm the Hermes `Intl` timezone formatting is correct on device across the DST change (Nov 1 2026). A fallback formatter exists.
5. Stop coordinates are approximate (D10). Replace them with real data when the API exists.
6. Real backend: implement `DataService`, swap the factory in `src/data/index.ts`, and have the server send `stops` and coordinate-free off-duty updates (see README).
7. Standalone Android build needs a Google Maps API key.
8. Optional cleanup: one-line fixtures in `__tests__/status.test.ts`. `jest.config` ignores `/.claude/` (affects agent worktrees only).

## Done criteria (whole project): met per the user's device test on 2026-10-10
- `npx expo start` runs in Expo Go. ✅
- Switching university re-themes the whole app. No hex outside `src/config`/`src/theme`. ✅
- All text/background pairs ≥ 4.5:1 (unit tested). ✅
- Pin only during working hours. Off duty shows the next start. ✅
- Adding a school = config + registry entry + mock data. ✅
- Labeled controls, scalable text. ✅ (VoiceOver announcement gap noted above)

## Status log
- 2026-10-10: Plan drafted. Intern research done. User approved D1 to D11.
- 2026-10-10: PRs #1 to #4 opened. User device test led to D12 to D15. #5 and #6 opened.
- 2026-10-10: User merged all six. Only #1 reached main (stacked bases, D16). Recovery PR #7 opened.
- 2026-10-10: User merged #7 and verified all features on their phone. Prototype complete. Session ended.
