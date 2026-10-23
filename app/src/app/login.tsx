import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { services } from '@/services';
import { useSession } from '@/store/session';
import { space } from '@/theme';
import type { AuthProvider } from '@/services/types';

export default function LoginScreen() {
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);
  const [busy, setBusy] = useState<AuthProvider | null>(null);
  const [error, setError] = useState(false);

  // Sign in with Apple steht oben: Pflicht, weil Google-Login angeboten wird (App Review 4.8).
  // Im Mock-Modus läuft der Aufruf ohne echte Apple-Anmeldung.
  const signIn = async (provider: AuthProvider) => {
    setBusy(provider);
    setError(false);
    try {
      const user = await services.auth.signIn(provider);
      setUser(user);
      router.replace('/(tabs)/feed');
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen edges="both">
      <View style={styles.head}>
        <Typo variant="display">{t.login.title}</Typo>
        <Typo variant="body" tone="muted">
          {t.login.subtitle}
        </Typo>
      </View>

      <View style={styles.actions}>
        <Button label={t.login.apple} loading={busy === 'apple'} disabled={busy !== null} onPress={() => signIn('apple')} />
        <Button
          label={t.login.google}
          variant="secondary"
          loading={busy === 'google'}
          disabled={busy !== null}
          onPress={() => signIn('google')}
        />
        {error ? (
          <Typo variant="small" tone="danger" align="center">
            {t.login.failed}
          </Typo>
        ) : null}
      </View>

      <Typo variant="caption" tone="muted" align="center" style={styles.legal}>
        {t.login.legalPrefix}
        <Link href="/legal/privacy" style={styles.link}>
          {t.login.privacy}
        </Link>
        {' & '}
        <Link href="/legal/terms" style={styles.link}>
          {t.login.terms}
        </Link>
      </Typo>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flex: 1, justifyContent: 'center', gap: space[3] },
  actions: { gap: space[3] },
  legal: { paddingTop: space[6] },
  link: { textDecorationLine: 'underline' },
});
