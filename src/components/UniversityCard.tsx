import React from 'react';
import { Pressable, View } from 'react-native';
import type { UniversityConfig } from '../config/universities';
import { radii, spacing, typeScale } from '../theme/tokens';
import { ThemedText } from './ThemedText';

/** Themed with the card's OWN university tokens so users can preview its colors. */
export function UniversityCard({
  university,
  selected,
  onPress,
}: {
  university: UniversityConfig;
  selected?: boolean;
  onPress: () => void;
}) {
  const t = university.theme;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Select ${university.name}`}
      accessibilityHint={university.city}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={{
        minHeight: 88,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radii.lg,
        backgroundColor: t.primary,
        borderWidth: 3,
        borderColor: selected ? t.mapAccent : t.primary,
      }}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: 56,
          height: 56,
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.secondary,
        }}
      >
        <ThemedText style={{ fontSize: 28, lineHeight: 34, color: t.onSecondary }}>{'\u{1F43E}'}</ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={[typeScale.title, { color: t.onPrimary }]}>{university.name}</ThemedText>
        <ThemedText style={{ color: t.onPrimary }}>{university.city}</ThemedText>
      </View>
      {selected ? <ThemedText style={{ color: t.onPrimary }}>Selected</ThemedText> : null}
    </Pressable>
  );
}
