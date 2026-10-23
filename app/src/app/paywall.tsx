import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useOffering, useRestore } from '@/hooks/queries';
import type { Package } from '@/services/types';
import { colors, icon, space } from '@/theme';

// Preise kommen ausschließlich aus dem Offering. Keine Preise im Code.
export default function PaywallScreen() {
  const router = useRouter();
  const { data: offering, isLoading, isError } = useOffering();
  const restore = useRestore();
  const [selected, setSelected] = useState<Package['identifier']>('pro_yearly');

  const packages = offering?.packages ?? [];
  const chosen = packages.find((p) => p.identifier === selected);

  return (
    <Screen scroll>
      <Header title={t.paywall.title} />
      <Typo variant="h1">{t.paywall.title}</Typo>
      <Typo variant="body" tone="muted">
        {t.paywall.subtitle}
      </Typo>

      {isLoading ? <Typo tone="muted">{t.paywall.loading}</Typo> : null}
      {isError || (!isLoading && packages.length === 0) ? <Typo tone="danger">{t.paywall.unavailable}</Typo> : null}

      <View style={styles.packages}>
        {packages.map((pkg) => {
          const isSelected = pkg.identifier === selected;
          const isYearly = pkg.identifier === 'pro_yearly';
          return (
            <Pressable
              key={pkg.identifier}
              onPress={() => setSelected(pkg.identifier)}
              accessibilityRole="radio"
              accessibilityLabel={`${pkg.title}, ${pkg.priceString}`}
              accessibilityState={{ selected: isSelected }}
              style={[styles.tariff, isSelected ? styles.tariffSelected : null]}
            >
              <Card tone="surfaceAlt" style={styles.tariffCard}>
                {isYearly ? <Badge label={t.paywall.bestValue} tone="accent" /> : null}
                <View style={styles.tariffRow}>
                  <Typo variant="h3">{pkg.identifier === 'pro_yearly' ? t.paywall.yearly : t.paywall.semester}</Typo>
                  {isSelected ? <Check color={colors.accent} size={icon.size} strokeWidth={icon.strokeWidth} /> : null}
                </View>
                <Typo variant="h2" tone="accent">
                  {pkg.priceString}
                </Typo>
                <Typo variant="small" tone="muted">
                  {t.paywall.perMonth(pkg.perMonthString)} · {pkg.period}
                </Typo>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Button
        label={t.paywall.continue}
        disabled={!chosen}
        onPress={() => router.push({ pathname: '/purchase-confirm', params: { packageId: selected } })}
      />
      <Button label={t.paywall.restore} variant="text" loading={restore.isPending} onPress={() => restore.mutate()} />
      <Typo variant="caption" tone="muted" align="center">
        {t.paywall.terms}
      </Typo>
    </Screen>
  );
}

const styles = StyleSheet.create({
  packages: { gap: space[3] },
  tariff: { borderRadius: 16 },
  tariffSelected: { borderRadius: 16, borderWidth: 1, borderColor: colors.accent },
  tariffCard: { gap: space[2] },
  tariffRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
