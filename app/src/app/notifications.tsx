import { FlatList, View } from 'react-native';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { space } from '@/theme';

export default function NotificationsScreen() {
  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: space[4] }}>
        <Header title={t.notifications.title} />
      </View>
      <FlatList
        data={t.notifications.items}
        keyExtractor={(item) => item.title}
        contentContainerStyle={{ padding: space[4], gap: space[3] }}
        ListEmptyComponent={<Typo tone="muted">{t.notifications.empty}</Typo>}
        renderItem={({ item }) => (
          <Card>
            <Typo variant="bodyStrong">{item.title}</Typo>
            <Typo variant="small" tone="muted">
              {item.body}
            </Typo>
          </Card>
        )}
      />
    </Screen>
  );
}
