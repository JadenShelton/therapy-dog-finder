import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-native-maps';
import type { LatLng } from '../../domain/types';
import { useTheme } from '../../theme';

type Props = { dogName: string; stopName?: string; coords: LatLng };

/** Single dog pin in the theme's map accent. Glides to new coordinates on updates. */
export function DogMarker({ dogName, stopName, coords }: Props) {
  const { colors } = useTheme();
  const ref = useRef<any>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.animateMarkerToCoordinate?.(coords, 1000);
  }, [coords.latitude, coords.longitude]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Marker
      ref={ref}
      testID="dog-marker"
      coordinate={coords}
      pinColor={colors.mapAccent}
      title={dogName}
      description={stopName}
      accessibilityLabel={stopName ? `${dogName} at ${stopName}` : dogName}
    />
  );
}
