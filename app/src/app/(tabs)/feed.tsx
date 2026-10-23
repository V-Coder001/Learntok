import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ClipView } from '@/components/ClipView';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useFeed, useTopics } from '@/hooks/queries';
import { colors, space } from '@/theme';

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const feed = useFeed();
  const topics = useTopics();
  const [height, setHeight] = useState(0);

  const topicName = (topicId: string) => topics.data?.find((topic) => topic.id === topicId)?.name;

  return (
    <View style={styles.root} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {height > 0 && feed.data && feed.data.length > 0 ? (
        <FlatList
          data={feed.data}
          keyExtractor={(clip) => clip.id}
          pagingEnabled
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          renderItem={({ item }) => (
            <ClipView
              clip={item}
              height={height}
              topicName={topicName(item.topicId)}
              onLearn={() => router.push({ pathname: '/quiz/[clipId]', params: { clipId: item.id } })}
              onShare={() => router.push({ pathname: '/share', params: { clipId: item.id } })}
              onReport={() => router.push({ pathname: '/report', params: { clipId: item.id } })}
              header={
                <View style={[styles.header, { paddingTop: insets.top }]}>
                  <Typo variant="h3">{t.feed.forYou}</Typo>
                  <Pressable onPress={() => router.push('/my-material')} accessibilityRole="button" accessibilityLabel={t.feed.mine} hitSlop={8}>
                    <Typo variant="small" tone="accent">
                      {t.feed.mine}
                    </Typo>
                  </Pressable>
                </View>
              }
            />
          )}
        />
      ) : null}

      {feed.isLoading ? (
        <View style={styles.center}>
          <Typo tone="muted">{t.common.loading}</Typo>
        </View>
      ) : null}

      {feed.isError ? (
        <View style={styles.center}>
          <Typo tone="danger">{t.errors.generic}</Typo>
          <Button label={t.common.retry} onPress={() => feed.refetch()} fullWidth={false} />
        </View>
      ) : null}

      {feed.data && feed.data.length === 0 ? (
        <View style={styles.center}>
          <Typo tone="muted" align="center">
            {t.feed.empty}
          </Typo>
          <Button label={t.tabs.create} onPress={() => router.push('/create')} fullWidth={false} style={{ marginTop: space[4] }} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: space[3], padding: space[4] },
});
