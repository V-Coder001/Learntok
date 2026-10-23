import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useTopics } from '@/hooks/queries';
import { space } from '@/theme';

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: topics = [] } = useTopics();
  const topic = topics.find((item) => item.id === id);

  if (!topic) {
    return (
      <Screen>
        <Header title={t.topic.title} />
        <Typo tone="muted">{t.common.loading}</Typo>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title={topic.name} />
      <Card style={styles.head}>
        <Typo variant="h1">{topic.name}</Typo>
        <Typo variant="small" tone="muted">
          {t.discover.clips(topic.clipCount)}
        </Typo>
        <Typo variant="caption" tone="muted">
          {t.topic.progress}
        </Typo>
        <ProgressBar value={topic.progress} />
      </Card>
      <Button label={t.topic.startLearn} onPress={() => router.push('/(tabs)/feed')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: space[2] },
});
