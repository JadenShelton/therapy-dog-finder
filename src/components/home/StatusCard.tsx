import React from 'react';
import { View } from 'react-native';
import type { DutyStatus, TimeRange } from '../../domain/types';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';
import { STATUS_LABEL, formatHours, formatNextStart, formatTimeInZone } from './format';

type Props = {
  dogName: string;
  handlerFirstName: string;
  status: DutyStatus;
  updatedAt: string | null;
  todayHours: TimeRange[];
  nextStart: string | null;
  timezone: string;
};

export function StatusCard({ dogName, handlerFirstName, status, updatedAt, todayHours, nextStart, timezone }: Props) {
  const { colors, spacing, radii } = useTheme();
  const label = STATUS_LABEL[status];
  const updated = updatedAt ? `Updated ${formatTimeInZone(updatedAt, timezone)}` : null;
  const hours = formatHours(todayHours);
  const next =
    status === 'off_duty'
      ? nextStart
        ? `Next on duty: ${formatNextStart(nextStart, timezone)}`
        : 'No upcoming shifts'
      : null;
  const a11y = [`${dogName}, with ${handlerFirstName}`, label, updated, `Today: ${hours}`, next]
    .filter(Boolean)
    .join('. ');

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={a11y}
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        padding: spacing.md,
        gap: spacing.xs,
        borderLeftWidth: 6,
        borderLeftColor: colors.mapAccent,
      }}
    >
      <ThemedText variant="title">{dogName}</ThemedText>
      <ThemedText muted>Handler: {handlerFirstName}</ThemedText>
      <ThemedText variant="title" style={{ color: colors.primary }}>
        {label}
      </ThemedText>
      {updated && (
        <ThemedText variant="caption" muted>
          {updated}
        </ThemedText>
      )}
      <ThemedText>Today: {hours}</ThemedText>
      {next && <ThemedText>{next}</ThemedText>}
    </View>
  );
}
