# Paws on Campus

A prototype mobile app (Expo, React Native, TypeScript) that shows where a university's therapy dog is on campus during working hours. It runs in Expo Go on iOS and Android. All data is mocked behind one data-service interface. Supported schools today: Colorado State University and the University of Utah. Names, dogs, handlers, and pictures are placeholders; there are no official logos.

## Prerequisites
- Node.js (current LTS) and npm
- The Expo Go app on your phone (or an iOS simulator / Android emulator)

## Run it
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i` / `a` for a simulator.

## Tests and type checks
```bash
npx jest          # unit and component tests
npx tsc --noEmit  # type check
```

## Project structure
```
app/                      Expo Router routes (select, tabs: Home, Schedule, About)
src/
  config/universities/    One config file per school, plus the registry (index.ts)
  theme/                  Tokens, ThemeProvider, useTheme(), contrast helpers
  data/                   DataService interface, hooks, factory, mock/ implementation
  domain/                 Types and pure status logic (schedule + time + timezone)
  state/                  Selected-university context, saved with AsyncStorage
  components/             Shared UI (cards, empty/error/loading views, schedule/, about/)
__tests__/                Jest tests
docs/                     PLAN.md and DECISIONS.md
```
Colors come only from theme tokens. A test fails if a hex color literal appears outside `src/config` and `src/theme`.

## How to add a university
1. Create `src/config/universities/<id>.ts` exporting a `UniversityConfig` (id, names, city, IANA timezone, map region, the theme tokens, `aboutText`, `contactUrl`). Every text/background token pair must reach 4.5:1 contrast; a test checks this.
2. Add it to the `universities` array in `src/config/universities/index.ts`.
3. Add mock data (dog, stops, weekly schedule) under the same id in `src/data/mock/data.ts`.

No component changes are needed.

## How to connect real data
1. Implement the `DataService` interface in `src/data/DataService.ts` (`getUniversities`, `getDog`, `getSchedule`, `subscribeToLocation`). `getSchedule` returns `stops` (the campus stop catalog) alongside shifts and recurring stops, so the Schedule screen can show stop names.
2. Swap the implementation returned by the factory in `src/data/createDataService.ts` (re-exported from `src/data/index.ts`).
3. Off-duty updates must be coordinate-free on the server. Do not send a location when the dog is off duty; the client type has no coordinates for `off_duty`.
4. Replace the mock's polling and timers with a websocket or server-sent-events connection behind `subscribeToLocation`. Keep the same contract: call the callback right away, then on each change, and return an unsubscribe function.

## Notes
- Stop coordinates are approximate, taken from public map data.
- Brand colors come from the official brand sites (brand.colostate.edu and brand.utah.edu).
- Expo Go needs no map API key. A standalone Android build needs a Google Maps API key.
- The "Demo controls" section on the About tab only appears in development builds.
