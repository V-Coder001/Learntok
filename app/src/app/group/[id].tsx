import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useGroup } from '@/hooks/queries';
import { space } from '@/theme';

export default function GroupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group, isLoading } = useGroup(id);
  const [joined, setJoined] = useState<boolean | null>(null);

  if (!group) {
    return (
      <Screen>
        <Header title={t.group.title} />
        <Typo tone="muted">{isLoading ? t.common.loading : t.errors.generic}</Typo>
      </Screen>
    );
  }

  const isJoined = joined ?? group.joined;

  return (
    <Screen scroll>
      <Header title={t.group.title} />
      <Card style={styles.head}>
        <Typo variant="h1">{group.name}</Typo>
        <Typo variant="small" tone="muted">
          {`${group.subject} · ${t.community.members(group.members)}`}
        </Typo>
        <View style={styles.badges}>
          {isJoined ? <Badge label={t.group.joined} tone="accent" /> : null}
          {group.liveCount > 0 ? <Badge label={t.community.liveNow(group.liveCount)} tone="accent" /> : null}
        </View>
      </Card>

      {!isJoined ? <Button label={t.group.join} onPress={() => setJoined(true)} /> : null}
      <Button
        label={t.group.liveRoom}
        variant="secondary"
        onPress={() => router.push({ pathname: '/live/[id]', params: { id: group.id } })}
      />

      <Typo variant="h3">{t.group.clips}</Typo>
      <Typo variant="small" tone="muted">
        {t.group.clipsHint}
      </Typo>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { gap: space[2] },
  badges: { flexDirection: 'row', gap: space[2] },
});
