import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';

export default function PrivacyScreen() {
  return (
    <Screen scroll>
      <Header title={t.legal.privacyTitle} />
      <Typo variant="body" tone="muted">
        {t.legal.placeholder}
      </Typo>
    </Screen>
  );
}
