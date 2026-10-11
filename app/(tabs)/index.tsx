import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import MapView from 'react-native-maps';
import { LoadingView } from '../../src/components/LoadingView';
import { DogMarker } from '../../src/components/home/DogMarker';
import { HomeEmptyState } from '../../src/components/home/HomeEmptyState';
import { HomeErrorState } from '../../src/components/home/HomeErrorState';
import { RecenterButton } from '../../src/components/home/RecenterButton';
import { StatusCard } from '../../src/components/home/StatusCard';
import type { UniversityConfig } from '../../src/config/universities';
import { useDog, useDogLocation, useSchedule } from '../../src/data';
import { computeStatus } from '../../src/domain/status';
import { useUniversity } from '../../src/state';
import { useTheme } from '../../src/theme';

export default function Home() {
  const { university } = useUniversity();
  const [attempt, setAttempt] = useState(0);
  if (!university) return <LoadingView />;
  // Keyed on university so switching schools resets the map region; attempt remounts for retry.
  return (
    <HomeContent
      key={`${university.id}:${attempt}`}
      university={university}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  );
}

function HomeContent({ university, onRetry }: { university: UniversityConfig; onRetry: () => void }) {
  const { colors, spacing } = useTheme();
  const { dog, loading, error } = useDog(university.id);
  const { schedule } = useSchedule(dog?.id);
  const update = useDogLocation(dog?.id);
  const mapRef = useRef<MapView>(null);

  const computed = useMemo(
    () =>
      schedule ? computeStatus(schedule, new Date(update?.updatedAt ?? Date.now()), university.timezone) : null,
    [schedule, update?.updatedAt, university.timezone],
  );

  const moving = update && update.status !== 'off_duty' ? update : null;
  const coords = moving?.coords ?? null;
  const recenter = useCallback(() => {
    if (!coords) return;
    mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.004, longitudeDelta: 0.004 }, 600);
  }, [coords]);

  if (loading) return <LoadingView label="Loading therapy dog" />;
  if (error) return <HomeErrorState onRetry={onRetry} />;
  if (!dog) return <HomeEmptyState universityName={university.name} />;

  const status = update?.status ?? computed?.status ?? 'off_duty';
  const nextStart =
    (update?.status === 'off_duty' ? update.nextStart : null) ?? computed?.nextStart ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MapView ref={mapRef} style={{ flex: 1, minHeight: 200 }} initialRegion={university.mapRegion}>
        {moving && <DogMarker dogName={dog.name} stopName={moving.stopName} coords={moving.coords} />}
      </MapView>
      <ScrollView
        style={{ flexGrow: 0, maxHeight: '60%' }}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      >
        <StatusCard
          dogName={dog.name}
          handlerFirstName={dog.handler.firstName}
          status={status}
          updatedAt={update?.updatedAt ?? null}
          todayHours={computed?.todayHours ?? []}
          nextStart={nextStart}
          timezone={university.timezone}
        />
        <RecenterButton dogName={dog.name} disabled={status === 'off_duty' || !coords} onPress={recenter} />
      </ScrollView>
    </View>
  );
}
