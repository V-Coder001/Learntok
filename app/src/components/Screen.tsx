import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, gutter, space } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: 'top' | 'bottom' | 'both';
  style?: ViewStyle;
}

// Basis-Container für jeden Screen: dunkler Hintergrund, Seitenrand 16, Safe Area.
export function Screen({ children, scroll = false, padded = true, edges = 'top', style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = edges === 'top' || edges === 'both' ? insets.top : 0;
  const paddingBottom = edges === 'bottom' || edges === 'both' ? insets.bottom : 0;
  const inner: ViewStyle = {
    paddingTop,
    paddingBottom: paddingBottom + (padded ? space[6] : 0),
    paddingHorizontal: padded ? gutter : 0,
  };

  if (scroll) {
    return (
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[styles.grow, inner]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.root, inner, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  grow: { flexGrow: 1, gap: space[4] },
});
