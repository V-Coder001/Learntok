import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useTopics } from '@/hooks/queries';
import { space } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data: topics = [] } = useTopics();
  const results = useMemo(
    () => topics.filter((topic) => topic.name.toLowerCase().includes(query.trim().toLowerCase())),
    [topics, query],
  );

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: space[4], gap: space[3] }}>
        <Header title={t.search.title} />
        <Field label={t.discover.search} value={query} onChangeText={setQuery} placeholder={t.discover.searchPlaceholder} autoFocus />
      </View>
      <FlatList
        data={results}
        keyExtractor={(topic) => topic.id}
        contentContainerStyle={{ padding: space[4], gap: space[3] }}
        ListEmptyComponent={<Typo tone="muted">{t.discover.noResults}</Typo>}
        renderItem={({ item }) => (
          <Card>
            <Typo variant="bodyStrong">{item.name}</Typo>
            <Typo variant="small" tone="muted">
              {t.discover.clips(item.clipCount)}
            </Typo>
          </Card>
        )}
      />
    </Screen>
  );
}
