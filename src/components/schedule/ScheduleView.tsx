import React from 'react';
import { ScrollView, View } from 'react-native';
import type { Weekday, WeeklySchedule } from '../../domain/types';
import { useTheme } from '../../theme';
import { ThemedText } from '../ThemedText';
import { DAY_NAMES, DAY_ORDER, formatRange, humanizeStopId } from './format';

export function ScheduleView({ schedule, today }: { schedule: WeeklySchedule; today: Weekday }) {
  const { colors, spacing, radii } = useTheme();
  const stops = [...schedule.recurringStops].sort(
    (a, b) => DAY_ORDER.indexOf(a.weekday) - DAY_ORDER.indexOf(b.weekday) || a.start.localeCompare(b.start),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
    >
      <ThemedText variant="heading" accessibilityRole="header">Weekly hours</ThemedText>
      {DAY_ORDER.map((day) => {
        const shifts = schedule.shifts[day] ?? [];
        const isToday = day === today;
        const summary =
          shifts.length === 0
            ? 'Off'
            : shifts
                .map((s) => formatRange(s) + (s.breaks?.length ? `, break ${s.breaks.map(formatRange).join(', ')}` : ''))
                .join('; ');
        return (
          <View
            key={day}
            accessible
            accessibilityLabel={`${DAY_NAMES[day]}${isToday ? ', today' : ''}: ${summary}`}
            style={{
              minHeight: 44,
              padding: spacing.md,
              borderRadius: radii.md,
              backgroundColor: colors.surface,
              borderWidth: isToday ? 3 : 1,
              borderColor: isToday ? colors.primary : colors.surface,
              gap: spacing.xs,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
              <ThemedText variant="title">{DAY_NAMES[day]}</ThemedText>
              {isToday ? (
                <ThemedText
                  style={{
                    color: colors.onPrimary,
                    backgroundColor: colors.primary,
                    paddingHorizontal: spacing.sm,
                    borderRadius: radii.pill,
                    overflow: 'hidden',
                  }}
                >
                  Today
                </ThemedText>
              ) : null}
            </View>
            {shifts.length === 0 ? (
              <ThemedText muted>Off</ThemedText>
            ) : (
              shifts.map((s, i) => (
                <View key={i}>
                  <ThemedText>{formatRange(s)}</ThemedText>
                  {s.breaks?.map((b, j) => (
                    <ThemedText key={j} variant="caption" muted>
                      Break {formatRange(b)}
                    </ThemedText>
                  ))}
                </View>
              ))
            )}
          </View>
        );
      })}

      <ThemedText variant="heading" accessibilityRole="header" style={{ marginTop: spacing.md }}>
        Recurring stops
      </ThemedText>
      {stops.length === 0 ? (
        <ThemedText muted>No recurring stops.</ThemedText>
      ) : (
        stops.map((s, i) => (
          <View
            key={i}
            accessible
            style={{ minHeight: 44, padding: spacing.md, borderRadius: radii.md, backgroundColor: colors.surface }}
          >
            <ThemedText variant="title">{s.note ?? humanizeStopId(s.stopId)}</ThemedText>
            <ThemedText>{`${DAY_NAMES[s.weekday]}, ${formatRange(s)}`}</ThemedText>
            {s.note ? (
              <ThemedText variant="caption" muted>
                {humanizeStopId(s.stopId)}
              </ThemedText>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}
