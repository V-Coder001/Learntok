import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { space } from '@/theme';

export default function ResultScreen() {
  const { clipId, correct, total } = useLocalSearchParams<{ clipId: string; correct: string; total: string }>();
  const router = useRouter();
  const correctCount = Number(correct ?? 0);
  const totalCount = Number(total ?? 0);
  const ratio = totalCount > 0 ? correctCount / totalCount : 0;

  return (
    <Screen>
      <Header title={t.result.title} />
      <Card style={styles.score}>
        <Typo variant="display" tone="accent" align="center">
          {`${correctCount}/${totalCount}`}
        </Typo>
        <ProgressBar value={ratio} />
        <Typo variant="h3" align="center">
          {t.result.score(correctCount, totalCount)}
        </Typo>
        <Typo variant="small" tone="muted" align="center">
          {t.result.praise}
        </Typo>
      </Card>

      <Card>
        <Typo variant="small" tone="muted">
          {t.result.duelHint}
        </Typo>
        <Button
          label={t.result.duel}
          variant="secondary"
          onPress={() => router.push({ pathname: '/duel/[id]', params: { id: 'd-1', clipId } })}
        />
      </Card>

      <View style={styles.actions}>
        <Button label={t.result.retry} variant="secondary" onPress={() => router.replace({ pathname: '/quiz/[clipId]', params: { clipId } })} />
        <Button label={t.result.backToFeed} variant="text" onPress={() => router.replace('/(tabs)/feed')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  score: { alignItems: 'center', gap: space[3], paddingVertical: space[6] },
  actions: { marginTop: 'auto', gap: space[2] },
});
