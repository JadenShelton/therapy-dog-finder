import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { ThemedText } from './ThemedText';

/** Themed stand-in for screens that later PRs will build. */
export function PlaceholderScreen({ title, note }: { title: string; note: string }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View style={{ flex: 1, padding: spacing.md, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.surface, gap: spacing.sm }}>
        <ThemedText variant="heading" accessibilityRole="header">{title}</ThemedText>
        <ThemedText muted>{note}</ThemedText>
      </View>
      <View style={{ height: 6, marginTop: spacing.md, borderRadius: radii.pill, backgroundColor: colors.secondary }} />
    </View>
  );
}
