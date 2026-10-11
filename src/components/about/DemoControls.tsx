import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { getStatusOverride, setStatusOverride, subscribeStatusOverride, type StatusOverride } from '../../data';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';

const OPTIONS: { value: StatusOverride; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'on_duty', label: 'On duty' },
  { value: 'on_break', label: 'On break' },
  { value: 'off_duty', label: 'Off duty' },
];

/** Dev-only. Render only when __DEV__. */
export function DemoControls() {
  const { colors, spacing, radii } = useTheme();
  const [value, setValue] = useState(getStatusOverride());
  useEffect(() => {
    setValue(getStatusOverride());
    return subscribeStatusOverride(setValue);
  }, []);

  return (
    <View style={{ gap: spacing.sm }}>
      <ThemedText variant="title" accessibilityRole="header">Demo controls</ThemedText>
      <ThemedText variant="caption" muted>Override the dog's status (development builds only).</ThemedText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {OPTIONS.map((o) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="button"
              accessibilityLabel={o.label}
              accessibilityState={{ selected }}
              onPress={() => setStatusOverride(o.value)}
              style={{
                minHeight: 44,
                minWidth: 44,
                paddingHorizontal: spacing.md,
                borderRadius: radii.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? colors.primary : colors.surface,
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              <ThemedText style={{ color: selected ? colors.onPrimary : colors.text }}>
                {selected ? `✓ ${o.label}` : o.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
