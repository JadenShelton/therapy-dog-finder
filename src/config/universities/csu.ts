import type { UniversityConfig } from './types';

// Brand colors: brand.colostate.edu/color (D6).
// Green #1E4D2B, Gold #C8C372, Aggie Orange #D9782D, 80% Black #59595B, Gray #CCCCCC.
// Gold is a fill/accent only. It is never text on a light background (about 1.7:1).
export const csu: UniversityConfig = {
  id: 'csu',
  name: 'Colorado State University',
  shortName: 'CSU',
  city: 'Fort Collins, CO',
  timezone: 'America/Denver',
  // approximate campus center (D10)
  mapRegion: {
    latitude: 40.5735,
    longitude: -105.085,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  },
  theme: {
    primary: '#1E4D2B',
    onPrimary: '#FFFFFF',
    secondary: '#C8C372',
    onSecondary: '#1E4D2B', // green text on gold
    background: '#FFFFFF',
    surface: '#F2F2F2',
    text: '#1A1A1A',
    textMuted: '#59595B',
    mapAccent: '#D9782D',
  },
  aboutText: 'Placeholder: about the CSU therapy dog program.',
  contactUrl: 'https://example.edu',
};
