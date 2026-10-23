import { Pressable, StyleSheet } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors, layout, radius, space } from '@/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

// Auswahl-Chip (z. B. Fach-Filter). Pill-Form, Touch-Fläche mind. 44.
export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[styles.chip, selected ? styles.selected : null]}
    >
      <Typo variant="small" tone={selected ? 'accent' : 'text'}>
        {label}
      </Typo>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: layout.minTouch,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
});
