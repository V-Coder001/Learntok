import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Swords, Users } from 'lucide-react-native';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { SegmentControl } from '@/components/SegmentControl';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useDuels, useGroups } from '@/hooks/queries';
import type { Duel, Group } from '@/services/types';
import { colors, icon, space } from '@/theme';

type Segment = 'groups' | 'questions' | 'duels';

const segments = [
  { value: 'groups', label: t.community.segments.groups },
  { value: 'questions', label: t.community.segments.questions },
  { value: 'duels', label: t.community.segments.duels },
] as const;

export default function CommunityScreen() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('groups');
  const groups = useGroups();
  const duels = useDuels();

  return (
    <Screen scroll>
      <Typo variant="h1">{t.community.title}</Typo>
      <SegmentControl options={segments} value={segment} onChange={setSegment} />

      {segment === 'groups' ? (
        <>
          {(groups.data ?? []).map((group: Group) => (
            <Pressable
              key={group.id}
              onPress={() => router.push({ pathname: '/group/[id]', params: { id: group.id } })}
              accessibilityRole="button"
              accessibilityLabel={group.name}
            >
              <Card>
                <View style={styles.rowBetween}>
                  <Typo variant="h3">{group.name}</Typo>
                  {group.liveCount > 0 ? <Badge label={t.community.liveNow(group.liveCount)} tone="accent" /> : null}
                </View>
                <Typo variant="small" tone="muted">
                  {`${group.subject} · ${t.community.members(group.members)}`}
                </Typo>
              </Card>
            </Pressable>
          ))}
          <Button
            label={t.community.newGroup}
            variant="secondary"
            onPress={() => router.push('/create-group')}
            style={styles.gap}
          />
        </>
      ) : null}

      {segment === 'questions' ? (
        <Card>
          <Typo variant="bodyStrong">{t.community.askQuestion}</Typo>
          <Typo variant="small" tone="muted">
            {t.community.questionsHint}
          </Typo>
          <Button label={t.community.askQuestion} variant="secondary" onPress={() => undefined} />
        </Card>
      ) : null}

      {segment === 'duels' ? (
        <FlatList
          data={duels.data ?? []}
          scrollEnabled={false}
          keyExtractor={(duel) => duel.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <DuelRow duel={item} onPress={() => router.push({ pathname: '/duel/[id]', params: { id: item.id } })} />
          )}
        />
      ) : null}

      <Pressable
        onPress={() => router.push('/live/g-bio')}
        accessibilityRole="button"
        accessibilityLabel={t.group.liveRoom}
        style={styles.liveLink}
      >
        <Users color={colors.accent} size={icon.small} strokeWidth={icon.strokeWidth} />
        <Typo variant="small" tone="accent">
          {t.group.liveRoom}
        </Typo>
        <Plus color={colors.accent} size={icon.small} strokeWidth={icon.strokeWidth} />
      </Pressable>
    </Screen>
  );
}

function DuelRow({ duel, onPress }: { duel: Duel; onPress: () => void }) {
  const label = { open: t.community.duelOpen, running: t.community.duelRunning, done: t.community.duelDone }[duel.status];
  return (
    <ListRow
      title={`${t.duel.you} ${t.duel.vs} ${duel.opponent}`}
      subtitle={`${duel.myScore}:${duel.opponentScore}`}
      leading={<Swords color={colors.accent} size={icon.size} strokeWidth={icon.strokeWidth} />}
      right={<Badge label={label} tone={duel.status === 'running' ? 'accent' : 'neutral'} />}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space[2] },
  gap: { marginTop: space[2] },
  separator: { height: space[2] },
  liveLink: { flexDirection: 'row', alignItems: 'center', gap: space[2], minHeight: space[11], alignSelf: 'center' },
});
