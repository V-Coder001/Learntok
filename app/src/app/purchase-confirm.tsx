import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useOffering, usePurchase } from '@/hooks/queries';
import type { Package } from '@/services/types';
import { space } from '@/theme';

export default function PurchaseConfirmScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: Package['identifier'] }>();
  const router = useRouter();
  const { data: offering } = useOffering();
  const purchase = usePurchase();
  const [message, setMessage] = useState<string | null>(null);

  const pkg = offering?.packages.find((p) => p.identifier === packageId);

  const confirm = async () => {
    if (!pkg) return;
    setMessage(null);
    try {
      await purchase.mutateAsync(pkg.identifier);
      setMessage(t.purchase.success);
      router.replace('/subscription');
    } catch {
      setMessage(t.errors.generic);
    }
  };

  return (
    <Screen>
      <Header title={t.purchase.title} />
      <Card>
        <Typo variant="h3">{t.purchase.summary}</Typo>
        <View style={styles.row}>
          <Typo>{pkg?.title ?? '…'}</Typo>
          <Typo variant="bodyStrong">{pkg?.priceString ?? '…'}</Typo>
        </View>
        {pkg ? (
          <Typo variant="small" tone="muted">
            {t.purchase.period(pkg.period)}
          </Typo>
        ) : null}
        <View style={styles.row}>
          <Typo variant="bodyStrong">{t.purchase.total}</Typo>
          <Typo variant="bodyStrong" tone="accent">
            {pkg?.priceString ?? '…'}
          </Typo>
        </View>
      </Card>

      {message ? (
        <Typo variant="small" tone={message === t.purchase.success ? 'accent' : 'danger'}>
          {message}
        </Typo>
      ) : null}

      <View style={styles.footer}>
        <Button label={t.purchase.confirm} loading={purchase.isPending} disabled={!pkg} onPress={confirm} />
        <Button label={t.common.cancel} variant="text" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { marginTop: 'auto', gap: space[2] },
});
