import { Tabs } from 'expo-router';

import { TabBar, type TabBarProps } from '@/components/TabBar';
import { t } from '@/i18n/de';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props: TabBarProps) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="feed" options={{ title: t.tabs.feed }} />
      <Tabs.Screen name="discover" options={{ title: t.tabs.discover }} />
      <Tabs.Screen name="create-tab" options={{ title: t.tabs.create }} />
      <Tabs.Screen name="community" options={{ title: t.tabs.community }} />
      <Tabs.Screen name="profile" options={{ title: t.tabs.profile }} />
    </Tabs>
  );
}
