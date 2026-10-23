import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';

export default function TermsScreen() {
  return (
    <Screen scroll>
      <Header title={t.legal.termsTitle} />
      <Typo variant="body" tone="muted">
        {t.legal.placeholder}
      </Typo>
    </Screen>
  );
}
