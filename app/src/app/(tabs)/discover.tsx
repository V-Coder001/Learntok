import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { colors, icon, space } from '@/theme';

import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useTopics } from '@/hooks/queries';
import { useState } from 'react';
import type { Topic } from '@/services/types';

export default function DiscoverScreen() {
  const router = useRouter();
  const { data: topics = [], isLoading } = useTopics();
  const [subject, setSubject] = useState<string>('all');

  const filtered = subject === 'all' ? topics : topics.filter((topic) => topic.id === subject);
  const chips = [{ id: 'all', name: t.discover.all }, ...topics.map((topic) => ({ id: topic.id, name: topic.name }))];

  return (
    <Screen padded={false} edges="top">
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Typo variant="h1">{t.discover.title}</Typo>
          <Pressable onPress={() => router.push('/search')} accessibilityRole="button" accessibilityLabel={t.search.title} hitSlop={8}>
            <Search color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />
          </Pressable>
        </View>
        <Typo variant="small" tone="muted">
          {t.discover.subjects}
        </Typo>
      </View>
      <FlatList
        horizontal
        data={chips}
        keyExtractor={(chip) => chip.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <Chip label={item.name} selected={subject === item.id} onPress={() => setSubject(item.id)} />
        )}
      />
      <FlatList
        data={filtered}
        keyExtractor={(topic) => topic.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Typo tone="muted" style={styles.empty}>
            {isLoading ? t.common.loading : t.discover.noResults}
          </Typo>
        }
        renderItem={({ item }) => <TopicTile topic={item} onPress={() => router.push({ pathname: '/topic/[id]', params: { id: item.id } })} />}
      />
    </Screen>
  );
}

function TopicTile({ topic, onPress }: { topic: Topic; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={topic.name} style={styles.tile}>
      <Card style={styles.tileCard}>
        <Typo variant="h3">{topic.name}</Typo>
        <Typo variant="caption" tone="muted">
          {t.discover.clips(topic.clipCount)}
        </Typo>
        <ProgressBar value={topic.progress} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: space[4], gap: space[1], paddingBottom: space[3] },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chips: { paddingHorizontal: space[4], gap: space[2], paddingBottom: space[4] },
  grid: { paddingHorizontal: space[4], paddingBottom: space[12], gap: space[3] },
  column: { gap: space[3] },
  tile: { flex: 1 },
  tileCard: { flex: 1, minHeight: space[16] * 2 },
  empty: { paddingTop: space[8], textAlign: 'center' },
});
