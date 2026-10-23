import { Typo } from '@/components/Typo';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { t } from '@/i18n/de';

// Liste blockierter Nutzer. Mock: es gibt in dieser Phase keine Liste, nur den Leerzustand.
export default function BlockedScreen() {
  return (
    <Screen>
      <Header title={t.blocked.title} />
      <Typo tone="muted">{t.blocked.empty}</Typo>
    </Screen>
  );
}
