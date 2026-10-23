import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useMaterial } from '@/hooks/queries';
import type { MaterialItem } from '@/services/types';
import { space } from '@/theme';

const statusTone = { ready: 'accent', processing: 'neutral', private: 'neutral' } as const;

export default function MyMaterialScreen() {
  const router = useRouter();
  const { data: items = [], isLoading } = useMaterial();

  return (
    <Screen scroll>
      <Header title={t.myMaterial.title} />
      {items.length === 0 ? (
        <Typo tone="muted">{isLoading ? t.common.loading : t.myMaterial.empty}</Typo>
      ) : null}
      {items.map((item: MaterialItem) => (
        <Card key={item.id} style={styles.card}>
          <Typo variant="bodyStrong">{item.title}</Typo>
          <View style={styles.row}>
            <Badge
              label={t.myMaterial.status[item.status]}
              tone={statusTone[item.status]}
            />
            {item.visibility === 'private' && item.status !== 'private' ? <Badge label={t.myMaterial.status.private} /> : null}
          </View>
          {item.status === 'ready' && item.clipId ? (
            <Typo
              variant="small"
              tone="accent"
              onPress={() => router.push({ pathname: '/quiz/[clipId]', params: { clipId: item.clipId! } })}
              accessibilityRole="link"
            >
              {t.feed.learn}
            </Typo>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[2] },
  row: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap' },
});
