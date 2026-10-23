import { StyleSheet, View } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors, radius, space } from '@/theme';

type Tone = 'accent' | 'neutral' | 'danger';

interface BadgeProps {
  label: string;
  tone?: Tone;
}

const palette: Record<Tone, { bg: string; fg: string; border: string }> = {
  accent: { bg: colors.accentSoft, fg: colors.accent, border: colors.accent },
  neutral: { bg: colors.surfaceAlt, fg: colors.textMuted, border: colors.border },
  danger: { bg: colors.surfaceAlt, fg: colors.danger, border: colors.danger },
};

// Kleines Etikett (Status, Sichtbarkeit, Live).
export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const p = palette[tone];
  return (
    <View style={[styles.badge, { backgroundColor: p.bg, borderColor: p.border }]}>
      <Typo variant="caption" style={{ color: p.fg }}>
        {label}
      </Typo>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[2],
    paddingVertical: space[1],
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
