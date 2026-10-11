import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';

export function HomeEmptyState({ universityName }: { universityName: string }) {
  const { colors, spacing } = useTheme();
  return (
    <View
      accessible
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
        backgroundColor: colors.background,
      }}
    >
      <ThemedText variant="title" style={{ textAlign: 'center' }}>
        No therapy dog yet
      </ThemedText>
      <ThemedText muted style={{ textAlign: 'center' }}>
        {universityName} does not have a therapy dog on the map right now. Check back soon.
      </ThemedText>
    </View>
  );
}
