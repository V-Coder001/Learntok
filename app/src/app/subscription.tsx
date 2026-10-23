import { Linking, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { PRO_ENTITLEMENT } from '@/services';
import { useCustomerInfo, useRestore } from '@/hooks/queries';
import { space } from '@/theme';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { data: info } = useCustomerInfo();
  const restore = useRestore();
  const pro = info?.entitlements.active[PRO_ENTITLEMENT];

  return (
    <Screen scroll>
      <Header title={t.subscription.title} />
      <Card>
        <View style={styles.row}>
          <Typo variant="bodyStrong">{t.subscription.status}</Typo>
          <Badge label={pro ? t.subscription.active : t.subscription.inactive} tone={pro ? 'accent' : 'neutral'} />
        </View>
        {pro ? (
          <>
            <Typo variant="small" tone="muted">
              {`${t.subscription.plan}: ${pro.productIdentifier === 'pro_semester' ? t.paywall.semester : t.paywall.yearly}`}
            </Typo>
            {pro.expirationDate ? (
              <Typo variant="small" tone="muted">
                {t.subscription.renews(new Date(pro.expirationDate).toLocaleDateString('de-DE'))}
              </Typo>
            ) : null}
          </>
        ) : null}
      </Card>

      {!pro ? <Button label={t.paywall.continue} onPress={() => router.push('/paywall')} /> : null}
      <Button label={t.subscription.restore} variant="secondary" loading={restore.isPending} onPress={() => restore.mutate()} />
      <Button label={t.subscription.manage} variant="text" onPress={() => Linking.openURL('itms-apps://apps.apple.com/account/subscriptions')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
