import { Pressable, StyleSheet, View } from 'react-native';
import type { ComponentProps } from 'react';
import { type Href, Tabs, useRouter } from 'expo-router';
import { Compass, Home, Plus, User, Users, type LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { colors, icon, layout, radius, space } from '@/theme';

const items: Record<string, { label: string; Icon: LucideIcon }> = {
  feed: { label: t.tabs.feed, Icon: Home },
  discover: { label: t.tabs.discover, Icon: Compass },
  community: { label: t.tabs.community, Icon: Users },
  profile: { label: t.tabs.profile, Icon: User },
};

// Eigene Tab-Leiste mit grüner Pill in der Mitte. Das + öffnet Erstellen als Modal,
// statt einen Tab zu wechseln.
// Props leitet der Typ aus dem Tabs-Navigator ab, damit er zu expo-router passt.
export type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export function TabBar({ state }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const focusedName = state.routes[state.index]?.name;

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route) => {
        if (route.name === 'create-tab') {
          return (
            <Pressable
              key={route.key}
              onPress={() => router.push('/create')}
              accessibilityRole="button"
              accessibilityLabel={t.tabs.create}
              style={styles.plusSlot}
            >
              <View style={styles.plus}>
                <Plus color={colors.accentInk} size={icon.size} strokeWidth={icon.strokeWidth} />
              </View>
            </Pressable>
          );
        }
        const item = items[route.name];
        if (!item) return null;
        const focused = focusedName === route.name;
        const color = focused ? colors.accent : colors.textMuted;
        return (
          <Pressable
            key={route.key}
            onPress={() => router.navigate(`/(tabs)/${route.name}` as Href)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: focused }}
            style={styles.tab}
          >
            <item.Icon color={color} size={icon.size} strokeWidth={icon.strokeWidth} />
            <Typo variant="caption" tone={focused ? 'accent' : 'muted'}>
              {item.label}
            </Typo>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.tabBarHeight,
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: space[2],
  },
  tab: {
    flex: 1,
    minHeight: layout.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
  },
  plusSlot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  plus: {
    width: 56,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
