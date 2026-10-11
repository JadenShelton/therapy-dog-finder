import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme';
import { ThemedText } from './ThemedText';

export type MessageViewProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Generic centered message with an optional action button. */
export function MessageView({ title, message, actionLabel, onAction, role }: MessageViewProps & { role?: 'alert' }) {
  const { colors, spacing, radii } = useTheme();
  return (
    <View
      accessibilityRole={role}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background }}
    >
      <ThemedText variant="title" accessibilityRole="header" style={{ textAlign: 'center' }}>
        {title}
      </ThemedText>
      <ThemedText muted style={{ textAlign: 'center' }}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={{
            minHeight: 44,
            minWidth: 44,
            marginTop: spacing.sm,
            paddingHorizontal: spacing.lg,
            borderRadius: radii.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
          }}
        >
          <ThemedText style={{ color: colors.onPrimary }}>{actionLabel}</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyView(props: MessageViewProps) {
  return <MessageView {...props} />;
}
