import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';

type Props = { dogName: string; disabled: boolean; onPress: () => void };

export function RecenterButton({ dogName, disabled, onPress }: Props) {
  const { colors, spacing, radii } = useTheme();
  const label = `Where's ${dogName} now?`;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        disabled ? `${dogName} is off duty, so the location is not shown` : `Moves the map to ${dogName}`
      }
      accessibilityState={{ disabled }}
      style={{
        minHeight: 44,
        minWidth: 44,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: disabled ? colors.surface : colors.primary,
        borderWidth: 2,
        borderColor: colors.primary,
      }}
    >
      <ThemedText style={{ color: disabled ? colors.textMuted : colors.onPrimary, fontWeight: '600' }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
