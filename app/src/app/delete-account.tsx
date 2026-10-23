import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { services } from '@/services';
import { queryClient } from '@/lib/queryClient';
import { useSession } from '@/store/session';
import { colors, icon, space } from '@/theme';

// Kontolöschung in der App (Pflicht laut App Review 5.1.1(v)).
export default function DeleteAccountScreen() {
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const remove = async () => {
    setBusy(true);
    await services.auth.deleteAccount();
    queryClient.clear();
    setUser(null);
    setDone(true);
    setBusy(false);
  };

  if (done) {
    return (
      <Screen>
        <Header back={false} title={t.deleteAccount.title} />
        <Typo variant="h2">{t.deleteAccount.done}</Typo>
        <Button label={t.onboarding.start} onPress={() => router.replace('/login')} style={styles.cta} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title={t.deleteAccount.title} />
      <Card>
        <Typo variant="body">{t.deleteAccount.body}</Typo>
      </Card>

      <Pressable
        onPress={() => setConfirmed(!confirmed)}
        accessibilityRole="checkbox"
        accessibilityLabel={t.deleteAccount.confirmLabel}
        accessibilityState={{ checked: confirmed }}
        style={styles.check}
      >
        <View style={[styles.box, confirmed ? styles.boxChecked : null]}>
          {confirmed ? <Check color={colors.accentInk} size={icon.small} strokeWidth={icon.strokeWidth} /> : null}
        </View>
        <Typo variant="small" style={styles.flex}>
          {t.deleteAccount.confirmLabel}
        </Typo>
      </Pressable>

      <View style={styles.footer}>
        <Button label={t.deleteAccount.confirm} variant="danger" disabled={!confirmed} loading={busy} onPress={remove} />
        <Button label={t.common.cancel} variant="text" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  check: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start', minHeight: space[11] },
  box: {
    width: space[6],
    height: space[6],
    borderRadius: space[1],
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.danger, borderColor: colors.danger },
  flex: { flex: 1 },
  footer: { marginTop: 'auto', gap: space[2] },
  cta: { marginTop: space[4] },
});
