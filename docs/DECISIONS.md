# Decisions

Each entry: status (PROPOSED / APPROVED / REJECTED), the choice, and why.
**2026-10-10: User approved D1 to D11, then D12 to D15.**

## D1: Navigation: Expo Router (file-based, tabs + stack). APPROVED
Default in current Expo templates and works in Expo Go.

## D2: Map: `react-native-maps`. APPROVED
Bundled in Expo Go, so no API key is needed for dev (Apple Maps on iOS, Google on Android). A standalone Android build would later need a Google Maps key.

## D3: Persistence: `@react-native-async-storage/async-storage`. APPROVED
Stores only the selected university id.

## D4: State: React Context only (University, Theme, DataService). No Redux/Zustand. APPROVED

## D5: Data model and service interface as drafted in PLAN.md. APPROVED
Off-duty `LocationUpdate`s contain no coordinates. Schedules are evaluated in the campus timezone (`America/Denver` for both) using `Intl`. No date library.

## D6: Brand colors and accessibility. APPROVED
- CSU (brand.colostate.edu/color): Green `#1E4D2B`, Gold `#C8C372`, Aggie Orange `#D9782D`, 80% Black `#59595B`, Gray `#CCCCCC`.
- Utah (brand.utah.edu/branding/colors): Utah Red `#BE0000`, Black `#000000`, Zion Cinder Cone `#707271`, Salt Flat Grey `#E2E6E6`.
- CSU Gold is never used as text or icons on light backgrounds (≈1.7:1). It is used only as a fill or accent, or as text on green.
- Every text/background token pair must pass 4.5:1, enforced by a unit test.
- PR 1 outcome: Utah `textMuted` = `#59595B` instead of Zion `#707271`. Zion measured 4.33:1 on the `#F2F2F2` surface. CSU green-on-gold measured 5.35:1.

## D7: Movement simulation. APPROVED
4 or 5 stops, a 15 s tick, a dwell of 1 or 2 ticks at each stop, and one mid-shift break. A dev-only override (Auto / On duty / On break / Off duty).

## D8: Testing: Jest + `jest-expo` + `@testing-library/react-native`. APPROVED

## D9: Git workflow: stacked PRs. APPROVED, then SUPERSEDED by D16
See D16 for what went wrong.

## D10: Campus coordinates: approximate, from public map data, with a `// approximate` comment on each. APPROVED
Third-party reference points: CSU center 40.57377, -105.09093 / 40.57326, -105.08679; Utah center 40.76037, -111.84145; Marriott Library 40.76248, -111.84618.

## D11: Placeholders. APPROVED
Placeholder names (app, dog, handler), logos, and pictures are fine. App name is "Paws on Campus". No official logos or trademarks.

## D12: Keep the extra dependencies added in PR 1. APPROVED (user, 2026-10-10)
`react-native-gesture-handler`, `react-native-reanimated`, `react-native-worklets`, `react-dom`, `react-native-web` (Expo Router peers), and `@types/jest`.

## D13: Tab icons via `@expo/vector-icons` (Ionicons). APPROVED (user, 2026-10-10)
Generic map, calendar, and info icons. Tab labels use the 13 pt caption size and scale with the system font size (the user found the original labels too small on device).

## D14: Stop names: `stops: Stop[]` on `WeeklySchedule` (option a). APPROVED (user, 2026-10-10)
`getSchedule` returns the stop catalog. The Schedule screen resolves `recurringStops[].stopId` to names, falling back to "Campus stop".

## D15: Neutral theme before a university is chosen. APPROVED (user request, 2026-10-10)
`src/theme/neutral.ts`. Used whenever no university is selected (the select header, status bar, and loading view). The lowest pair is 6.26:1.

## D16: Git workflow fix: every PR targets `main`. APPROVED (implied by the user's fix request, 2026-10-10)
What happened: PRs #2 to #6 were stacked (based on their predecessor branches). When the user merged them on GitHub, each merged into its base branch, not `main`. Only PR #1 reached `main`. The PM gave a merge order without warning about retargeting.

Going forward: every PR targets `main`. If a stack is ever needed, the PM must tell the user to retarget each PR to `main` before merging (or the engineer does it).

Recovery: a single PR `restore-merged-work` → `main` brings in the content of all the branches.
