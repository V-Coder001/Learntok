import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors, layout, radius, space } from '@/theme';

interface FieldProps extends TextInputProps {
  label: string;
  multiline?: boolean;
}

// Eingabefeld mit Radius 14. Das Label steht immer sichtbar darüber.
export function Field({ label, multiline = false, style, ...rest }: FieldProps) {
  return (
    <View style={styles.wrap}>
      <Typo variant="small" tone="muted">
        {label}
      </Typo>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline ? styles.multiline : null, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[2] },
  input: {
    minHeight: layout.minTouch,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  multiline: { minHeight: space[16] * 2, textAlignVertical: 'top' },
});
