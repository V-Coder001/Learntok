import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typeScale } from '@/theme';

type Variant = keyof typeof typeScale;
type Tone = 'text' | 'muted' | 'accent' | 'danger';

interface TypoProps extends TextProps {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle['textAlign'];
}

const toneColor: Record<Tone, string> = {
  text: colors.text,
  muted: colors.textMuted,
  accent: colors.accent,
  danger: colors.danger,
};

// Einheitliche Textstile. Überschriften nutzen Space Grotesk, Fließtext Inter.
export function Typo({ variant = 'body', tone = 'text', align, style, ...rest }: TypoProps) {
  return (
    <Text
      {...rest}
      style={[typeScale[variant], styles.base, { color: toneColor[tone], textAlign: align }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { includeFontPadding: false },
});
