import { StyleSheet, View } from 'react-native';

import { Typo } from '@/components/Typo';
import { colors } from '@/theme';

interface AvatarProps {
  initials: string;
  size?: number;
  highlighted?: boolean;
}

// Kreis mit Initialen. Ohne Fotos, damit die Mock-Phase ohne Netz läuft.
export function Avatar({ initials, size = 40, highlighted = false }: AvatarProps) {
  return (
    <View
      accessibilityLabel={initials}
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: highlighted ? colors.accent : colors.border,
        },
      ]}
    >
      <Typo variant="caption" tone={highlighted ? 'accent' : 'text'} style={{ fontSize: Math.round(size * 0.36) }}>
        {initials}
      </Typo>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
  },
});
