import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useSession } from '@/store/session';
import { space } from '@/theme';

const options = [60, 90, 120, 180, 240];

export default function WeeklyGoalScreen() {
  const router = useRouter();
  const goal = useSession((s) => s.weeklyGoalMinutes);
  const setGoal = useSession((s) => s.setWeeklyGoal);
  const [value, setValue] = useState(goal);

  return (
    <Screen>
      <Header title={t.weeklyGoal.title} />
      <Typo variant="body" tone="muted">
        {t.weeklyGoal.body}
      </Typo>
      <View style={styles.chips}>
        {options.map((minutes) => (
          <Chip key={minutes} label={t.common.minutes(minutes)} selected={value === minutes} onPress={() => setValue(minutes)} />
        ))}
      </View>
      <View style={styles.footer}>
        <Button
          label={t.weeklyGoal.save}
          onPress={() => {
            setGoal(value);
            router.back();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  footer: { marginTop: 'auto' },
});
