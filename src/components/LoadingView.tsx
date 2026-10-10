import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../theme';
import { ThemedText } from './ThemedText';

export function LoadingView({ label = 'Loading' }: { label?: string }) {
  const { colors, spacing } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: colors.background }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <ThemedText muted>{label}</ThemedText>
    </View>
  );
}
