import { Pressable, StyleSheet, View } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors, layout, radius, space } from '@/theme';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Segment-Control in Pill-Form. Jede Option hat mindestens 44 Touch-Höhe.
export function SegmentControl<T extends string>({ options, value, onChange }: SegmentControlProps<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            style={[styles.segment, selected ? styles.selected : null]}
          >
            <Typo variant="small" tone={selected ? 'accent' : 'muted'} style={selected ? styles.bold : undefined}>
              {option.label}
            </Typo>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space[1],
    gap: space[1],
  },
  segment: {
    flex: 1,
    minHeight: layout.minTouch,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[2],
  },
  selected: { backgroundColor: colors.accentSoft },
  bold: { fontWeight: '600' },
});
