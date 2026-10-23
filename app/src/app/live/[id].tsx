import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mic, MicOff } from 'lucide-react-native';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Toggle } from '@/components/Toggle';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useGroup } from '@/hooks/queries';
import { formatDuration, initialsOf } from '@/lib/quiz';
import { colors, icon, space } from '@/theme';

const participants = ['Mika', 'Sophie', 'Jonas', 'Lea'];

export default function LiveRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: group } = useGroup(id);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Screen scroll>
      <Header title={group?.name ?? t.live.title} />
      <Card style={styles.timer}>
        <Badge label={t.live.title} tone="accent" />
        <Typo variant="display" align="center">
          {formatDuration(seconds)}
        </Typo>
        <Typo variant="small" tone="muted" align="center">
          {t.live.timer}
        </Typo>
      </Card>

      <Typo variant="h3">{t.live.participants}</Typo>
      <View style={styles.grid}>
        {participants.map((name) => (
          <View key={name} style={styles.person}>
            <Avatar initials={initialsOf(name)} size={56} highlighted={name === 'Mika'} />
            <Typo variant="small">{name}</Typo>
          </View>
        ))}
      </View>

      <Card style={styles.row}>
        <View style={styles.rowText}>
          {muted ? <MicOff color={colors.textMuted} size={icon.small} strokeWidth={icon.strokeWidth} /> : <Mic color={colors.accent} size={icon.small} strokeWidth={icon.strokeWidth} />}
          <Typo variant="small" tone="muted">
            {t.live.mute}
          </Typo>
        </View>
        <Toggle value={muted} onValueChange={setMuted} label={t.live.mute} />
      </Card>
      <Typo variant="caption" tone="muted">
        {t.live.hint}
      </Typo>

      <Button label={t.live.leave} variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  timer: { alignItems: 'center', gap: space[2], paddingVertical: space[6] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  person: { alignItems: 'center', gap: space[2], width: space[16] + space[4] },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
});
