import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useBlockUser, useReport } from '@/hooks/queries';
import { services } from '@/services';
import { colors, icon, space } from '@/theme';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';

// Melden und Blockieren für nutzergenerierte Inhalte (App Review 1.2).
export default function ReportSheet() {
  const router = useRouter();
  const { clipId } = useLocalSearchParams<{ clipId: string }>();
  const report = useReport();
  const block = useBlockUser();
  const [reason, setReason] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!reason || !clipId) return;
    await report.mutateAsync({ clipId, reason });
    setSent(true);
  };

  const blockAuthor = async () => {
    const clip = await services.clips.clip(clipId);
    if (clip) await block.mutateAsync(clip.authorId);
    router.back();
  };

  return (
    <BottomSheet visible onClose={() => router.back()}>
      <Typo variant="h3">{t.report.title}</Typo>
      {sent ? (
        <Card>
          <Typo variant="small">{t.report.sent}</Typo>
          <Button label={t.common.done} onPress={() => router.back()} />
        </Card>
      ) : (
        <>
          <Typo variant="small" tone="muted">
            {t.report.body}
          </Typo>
          <View style={{ gap: space[1] }}>
            {t.report.reasons.map((item) => (
              <ListRow
                key={item}
                title={item}
                arrow={false}
                onPress={() => setReason(item)}
                right={reason === item ? <Check color={colors.accent} size={icon.size} strokeWidth={icon.strokeWidth} /> : null}
              />
            ))}
          </View>
          <Button label={t.report.submit} disabled={!reason} onPress={submit} />
          <Button label={t.report.block} variant="danger" onPress={blockAuthor} />
        </>
      )}
    </BottomSheet>
  );
}
