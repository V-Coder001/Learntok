import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors, fonts, layout, radius, space } from '@/theme';

type Variant = 'primary' | 'secondary' | 'text' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

// Haupt-Button: Pill-Form, Höhe 52. Touch-Fläche mindestens 44.
export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  fullWidth = true,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = variantStyles[variant];
  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variant === 'text' ? styles.textVariant : styles.solid,
        { backgroundColor: palette.bg, borderColor: palette.border },
        fullWidth && variant !== 'text' ? styles.full : null,
        pressed ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Typo variant="bodyStrong" tone="text" style={{ color: palette.fg, fontFamily: fonts.bodySemi }}>
          {label}
        </Typo>
      )}
    </Pressable>
  );
}

const variantStyles: Record<Variant, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.accent, fg: colors.accentInk, border: colors.accent },
  secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
  text: { bg: 'transparent', fg: colors.accent, border: 'transparent' },
  danger: { bg: colors.danger, fg: colors.accentInk, border: colors.danger },
};

const styles = StyleSheet.create({
  base: {
    height: layout.buttonHeight,
    minWidth: layout.minTouch,
    borderRadius: radius.button,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
  },
  solid: {},
  textVariant: { height: layout.minTouch, paddingHorizontal: space[3] },
  full: { alignSelf: 'stretch' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
});
