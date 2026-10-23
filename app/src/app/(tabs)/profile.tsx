import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Crown, Flame, Folder, Settings, Target } from 'lucide-react-native';

import { Avatar } from '@/components/Avatar';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { mockUser } from '@/data/mock';
import { useIsPro } from '@/hooks/queries';
import { initialsOf } from '@/lib/quiz';
import { useSession } from '@/store/session';
import { colors, icon, space } from '@/theme';

// Mock-Wert für den Lernfortschritt dieser Woche (Minuten).
const minutesThisWeek = 74;
const streakDays = 5;

export default function ProfileScreen() {
  const router = useRouter();
  const weeklyGoal = useSession((s) => s.weeklyGoalMinutes);
  const user = useSession((s) => s.user) ?? mockUser;
  const isPro = useIsPro();

  return (
    <Screen scroll>
      <View style={styles.head}>
        <Avatar initials={initialsOf(user.name)} size={64} highlighted />
        <View style={styles.headText}>
          <Typo variant="h2">{user.name}</Typo>
          <Typo variant="small" tone="muted">
            {t.profile.streak(streakDays)}
          </Typo>
        </View>
        <Flame color={colors.accent} size={icon.size} strokeWidth={icon.strokeWidth} />
      </View>

      <Card>
        <View style={styles.rowBetween}>
          <Typo variant="h3">{t.profile.weeklyGoal}</Typo>
          <Target color={colors.accent} size={icon.small} strokeWidth={icon.strokeWidth} />
        </View>
        <ProgressBar value={minutesThisWeek / weeklyGoal} />
        <Typo variant="small" tone="muted">
          {t.profile.goalProgress(minutesThisWeek, weeklyGoal)}
        </Typo>
        <ListRow title={t.profile.editGoal} onPress={() => router.push('/weekly-goal')} />
      </Card>

      <Card>
        <ListRow
          title={t.profile.myMaterial}
          leading={<Folder color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />}
          onPress={() => router.push('/my-material')}
        />
        <ListRow
          title={t.profile.subscription}
          subtitle={isPro ? t.subscription.active : t.subscription.inactive}
          leading={<Crown color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />}
          onPress={() => router.push(isPro ? '/subscription' : '/paywall')}
        />
        <ListRow
          title={t.profile.notifications}
          leading={<Bell color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />}
          onPress={() => router.push('/notifications')}
        />
        <ListRow
          title={t.profile.settings}
          leading={<Settings color={colors.text} size={icon.size} strokeWidth={icon.strokeWidth} />}
          onPress={() => router.push('/settings')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  headText: { flex: 1, gap: space[1] },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
