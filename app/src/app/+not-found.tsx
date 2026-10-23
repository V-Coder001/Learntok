import { Link, Stack } from 'expo-router';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { space } from '@/theme';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: t.notFound.title }} />
      <Screen>
        <Typo variant="h1">{t.notFound.title}</Typo>
        <Link href="/" asChild>
          <Button label={t.notFound.back} style={{ marginTop: space[4] }} />
        </Link>
      </Screen>
    </>
  );
}
