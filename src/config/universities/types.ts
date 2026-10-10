export type LatLngRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

/** Colors for one university. Text-on-background pairs are checked by a test (4.5:1). */
export type UniversityTheme = {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  /** Non-text accent (map pin, highlights). Never used for text. */
  mapAccent: string;
};

export type UniversityConfig = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  /** IANA timezone used to evaluate schedules. */
  timezone: string;
  mapRegion: LatLngRegion;
  theme: UniversityTheme;
  aboutText: string;
  contactUrl: string;
};
