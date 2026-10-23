import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Circle } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useJob } from '@/hooks/queries';
import { colors, icon, space } from '@/theme';
import type { JobStep } from '@/services/types';

const order = ['upload', 'extract', 'generate', 'done'] as const satisfies readonly JobStep[];

export default function CreateProgressScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const router = useRouter();
  const { data: job } = useJob(jobId);

  const step = job?.step ?? 'upload';
  const failed = step === 'failed';
  const currentIndex = (order as readonly JobStep[]).indexOf(step);
  const done = step === 'done';

  return (
    <Screen>
      <Header title={t.progress.title} back={false} />

      <Card style={styles.card}>
        <ProgressBar value={job?.progress ?? 0} tone={failed ? 'danger' : 'accent'} />
        {order.map((key, index) => {
          const reached = index <= currentIndex;
          const label = t.progress.steps[key];
          return (
            <View key={key} style={styles.row}>
              {reached ? (
                <Check color={colors.accent} size={icon.small} strokeWidth={icon.strokeWidth} />
              ) : (
                <Circle color={colors.textMuted} size={icon.small} strokeWidth={icon.strokeWidth} />
              )}
              <Typo variant="body" tone={reached ? 'text' : 'muted'}>
                {label}
              </Typo>
            </View>
          );
        })}
        {failed ? (
          <Typo variant="small" tone="danger">
            {t.progress.failed}
          </Typo>
        ) : null}
      </Card>

      <Typo variant="small" tone="muted">
        {t.progress.note}
      </Typo>

      <View style={styles.footer}>
        {done ? (
          <Button label={t.progress.toMaterial} onPress={() => router.replace('/my-material')} />
        ) : null}
        {failed ? <Button label={t.common.retry} variant="secondary" onPress={() => router.back()} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[4] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  footer: { marginTop: 'auto', gap: space[2] },
});
