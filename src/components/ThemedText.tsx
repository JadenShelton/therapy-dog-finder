import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme';

type Props = TextProps & {
  variant?: 'caption' | 'body' | 'title' | 'heading';
  muted?: boolean;
};

/** Text in the theme's text color. Font scaling stays on (do not disable it). */
export function ThemedText({ variant = 'body', muted, style, ...rest }: Props) {
  const { colors, type } = useTheme();
  return <Text {...rest} style={[type[variant], { color: muted ? colors.textMuted : colors.text }, style]} />;
}
