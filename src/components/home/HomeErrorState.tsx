import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';

export function HomeErrorState({ onRetry }: { onRetry: () => void }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.background,
      }}
    >
      <ThemedText variant="title" style={{ textAlign: 'center' }}>
        Something went wrong
      </ThemedText>
      <ThemedText muted style={{ textAlign: 'center' }}>
        We could not load the therapy dog. Please try again.
      </ThemedText>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        style={{
          minHeight: 44,
          minWidth: 44,
          paddingHorizontal: spacing.lg,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: radii.pill,
          backgroundColor: colors.primary,
        }}
      >
        <ThemedText style={{ color: colors.onPrimary, fontWeight: '600' }}>Try again</ThemedText>
      </Pressable>
    </View>
  );
}
