import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  tone?: 'surface' | 'surfaceAlt';
}

// Karte mit Radius 16, Rahmen und Innenabstand 16.
export function Card({ children, style, tone = 'surface' }: CardProps) {
  return (
    <View style={[styles.card, { backgroundColor: colors[tone] }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space[4],
    gap: space[3],
  },
});
