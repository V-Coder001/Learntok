import { Switch } from 'react-native';

import { colors } from '@/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

// Schalter in den Theme-Farben. Die Beschriftung kommt von der aufrufenden Zeile.
export function Toggle({ value, onValueChange, label }: ToggleProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={label}
      trackColor={{ false: colors.border, true: colors.accent }}
      thumbColor={colors.text}
      ios_backgroundColor={colors.border}
    />
  );
}
