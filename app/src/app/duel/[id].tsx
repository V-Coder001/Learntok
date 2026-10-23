import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useDuels } from '@/hooks/queries';
import { initialsOf } from '@/lib/quiz';
import { mockUser } from '@/data/mock';
import { space } from '@/theme';

const ROUNDS = 3;

const statusTone = { open: 'neutral', running: 'accent', done: 'neutral' } as const;
const statusLabel = { open: t.community.duelOpen, running: t.community.duelRunning, done: t.community.duelDone } as const;

export default function DuelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: duels = [] } = useDuels();
  const duel = duels.find((d) => d.id === id) ?? duels[0];
  const [sent, setSent] = useState(false);

  if (!duel) {
    return (
      <Screen>
        <Header title={t.duel.title} />
        <Typo tone="muted">{t.common.loading}</Typo>
      </Screen>
    );
  }

  const isOpen = duel.status === 'open';
  const isDone = duel.status === 'done';
  const myRound = Math.min(ROUNDS, duel.myScore + duel.opponentScore + 1);

  return (
    <Screen scroll>
      <Header title={t.duel.title} />

      <Card style={styles.versus}>
        <View style={styles.side}>
          <Avatar initials={initialsOf(mockUser.name)} size={56} highlighted />
          <Typo variant="bodyStrong">{t.duel.you}</Typo>
          <Typo variant="h1" tone="accent">{`${duel.myScore}`}</Typo>
        </View>
        <Typo variant="small" tone="muted">{t.duel.vs}</Typo>
        <View style={styles.side}>
          <Avatar initials={initialsOf(duel.opponent)} size={56} />
          <Typo variant="bodyStrong">{duel.opponent}</Typo>
          <Typo variant="h1">{`${duel.opponentScore}`}</Typo>
        </View>
      </Card>

      <Card>
        <View style={styles.statusRow}>
          <Typo variant="bodyStrong">{t.duel.round(isDone ? ROUNDS : myRound, ROUNDS)}</Typo>
          <Badge label={statusLabel[duel.status]} tone={statusTone[duel.status]} />
        </View>
        <ProgressBar value={(duel.myScore + duel.opponentScore) / (ROUNDS * 2)} />
      </Card>

      <View style={styles.actions}>
        {isOpen && !sent ? <Button label={t.duel.invite} onPress={() => setSent(true)} /> : null}
        {isOpen && sent ? <Button label={t.duel.waiting} variant="secondary" disabled /> : null}
        {isDone ? <Button label={t.duel.rematch} variant="secondary" onPress={() => setSent(true)} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  versus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: space[6] },
  side: { alignItems: 'center', gap: space[2] },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actions: { marginTop: 'auto', gap: space[2] },
});
