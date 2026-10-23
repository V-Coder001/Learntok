import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Typo } from '@/components/Typo';
import { colors, icon, layout, space } from '@/theme';

interface ListRowProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  value?: string;
  /** Zeigt den Pfeil rechts. Standard: an, wenn onPress gesetzt ist. */
  arrow?: boolean;
  danger?: boolean;
  right?: ReactNode;
  onPress?: () => void;
}

// Listenzeile mit optionalem Pfeil. Mindesthöhe 44 für Touch.
export function ListRow({ title, subtitle, leading, value, arrow, danger, right, onPress }: ListRowProps) {
  const showArrow = arrow ?? Boolean(onPress);
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.texts}>
        <Typo variant="bodyStrong" tone={danger ? 'danger' : 'text'}>
          {title}
        </Typo>
        {subtitle ? (
          <Typo variant="small" tone="muted">
            {subtitle}
          </Typo>
        ) : null}
      </View>
      {value ? (
        <Typo variant="small" tone="muted">
          {value}
        </Typo>
      ) : null}
      {right}
      {showArrow ? <ChevronRight color={colors.textMuted} size={icon.small} strokeWidth={icon.strokeWidth} /> : null}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.minTouch + space[2],
    gap: space[3],
    paddingVertical: space[2],
  },
  pressed: { opacity: 0.7 },
  leading: { width: space[8], alignItems: 'center' },
  texts: { flex: 1, gap: space[1] },
});
