import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Toggle } from '@/components/Toggle';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { services } from '@/services';
import { useSession } from '@/store/session';
import { queryClient } from '@/lib/queryClient';
import { space } from '@/theme';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const router = useRouter();
  const reminder = useSession((s) => s.reminderEnabled);
  const setReminder = useSession((s) => s.setReminder);
  const setUser = useSession((s) => s.setUser);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const signOut = async () => {
    await services.auth.signOut();
    setUser(null);
    queryClient.clear();
    router.replace('/login');
  };

  return (
    <Screen scroll>
      <Header title={t.settings.title} />

      <Typo variant="caption" tone="muted">
        {t.settings.notifications.toUpperCase()}
      </Typo>
      <Card>
        <View style={styles.row}>
          <Typo variant="bodyStrong">{t.settings.reminder}</Typo>
          <Toggle value={reminder} onValueChange={setReminder} label={t.settings.reminder} />
        </View>
      </Card>

      <Typo variant="caption" tone="muted">
        {t.settings.account.toUpperCase()}
      </Typo>
      <Card>
        <ListRow title={t.settings.blocked} onPress={() => router.push('/blocked')} />
        <ListRow title={t.settings.privacyPage} onPress={() => router.push('/legal/privacy')} />
        <ListRow title={t.settings.terms} onPress={() => router.push('/legal/terms')} />
        <ListRow title={t.settings.deleteAccount} danger onPress={() => router.push('/delete-account')} />
      </Card>

      <Button label={t.settings.signOut} variant="secondary" onPress={signOut} />
      <Typo variant="caption" tone="muted" align="center">
        {`${t.settings.version} ${version}`}
      </Typo>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: space[11] },
});
