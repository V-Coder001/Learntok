import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { colors, icon, layout, space } from '@/theme';

interface HeaderProps {
  title?: string;
  right?: ReactNode;
  /** Zeigt den Zurück-Pfeil. Standard: an. */
  back?: boolean;
  onBack?: () => void;
}

export function Header({ title, right, back = true, onBack }: HeaderProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {back ? (
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t.common.back}
            hitSlop={8}
            style={styles.touch}
          >
            <ChevronLeft color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
          </Pressable>
        ) : null}
      </View>
      {title ? (
        <Typo variant="h3" align="center" style={styles.title} numberOfLines={1}>
          {title}
        </Typo>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.minTouch,
    gap: space[2],
  },
  side: { width: layout.minTouch, alignItems: 'flex-start', justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1 },
  touch: {
    width: layout.minTouch,
    height: layout.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -space[2],
  },
});
