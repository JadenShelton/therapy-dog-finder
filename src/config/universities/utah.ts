import type { UniversityConfig } from './types';

// Brand colors: brand.utah.edu/branding/colors (D6).
// Utah Red #BE0000, Black #000000, Zion Cinder Cone #707271, Salt Flat Grey #E2E6E6.
export const utah: UniversityConfig = {
  id: 'utah',
  name: 'University of Utah',
  shortName: 'Utah',
  city: 'Salt Lake City, UT',
  timezone: 'America/Denver',
  // approximate campus center (D10)
  mapRegion: {
    latitude: 40.763,
    longitude: -111.843,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  },
  theme: {
    primary: '#BE0000',
    onPrimary: '#FFFFFF',
    secondary: '#E2E6E6',
    onSecondary: '#000000',
    background: '#FFFFFF',
    surface: '#F2F2F2',
    text: '#000000',
    textMuted: '#59595B', // darker than Zion Cinder Cone (#707271) to pass 4.5:1 on surface
    mapAccent: '#BE0000',
  },
  aboutText: 'Placeholder: about the University of Utah therapy dog program.',
  contactUrl: 'https://example.edu',
};
