import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import type { Visibility } from '@/services/types';
import { colors, icon, radius, space } from '@/theme';
import { ListRow } from '@/components/ListRow';
import { Card } from '@/components/Card';

// Teilen in Gruppe oder öffentlich braucht die Rechte-Bestätigung. Standard bleibt privat.
export default function ShareSheet() {
  const router = useRouter();
  const [target, setTarget] = useState<Visibility>('private');
  const [rights, setRights] = useState(false);
  const needsRights = target !== 'private';
  const canSubmit = !needsRights || rights;

  const close = () => router.back();

  return (
    <BottomSheet visible onClose={close}>
      <Typo variant="h3">{t.share.title}</Typo>
      <Typo variant="small" tone="muted">
        {t.share.target}
      </Typo>

      <Card tone="surfaceAlt" style={styles.options}>
        <ShareOption label={t.share.private} selected={target === 'private'} onPress={() => setTarget('private')} />
        <ShareOption label={t.share.group} selected={target === 'group'} onPress={() => setTarget('group')} />
        <ShareOption label={t.share.public} selected={target === 'public'} onPress={() => setTarget('public')} />
      </Card>

      {needsRights ? (
        <Pressable
          onPress={() => setRights(!rights)}
          accessibilityRole="checkbox"
          accessibilityLabel={t.share.rights}
          accessibilityState={{ checked: rights }}
          style={styles.rights}
        >
          <View style={[styles.box, rights ? styles.boxChecked : null]}>
            {rights ? <Check color={colors.accentInk} size={icon.small} strokeWidth={icon.strokeWidth} /> : null}
          </View>
          <Typo variant="small" style={styles.flex}>
            {t.share.rights}
          </Typo>
        </Pressable>
      ) : null}

      <Button label={t.share.submit} disabled={!canSubmit} onPress={close} />
    </BottomSheet>
  );
}

function ShareOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <ListRow
      title={label}
      onPress={onPress}
      arrow={false}
      right={selected ? <Check color={colors.accent} size={icon.size} strokeWidth={icon.strokeWidth} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  options: { padding: space[2] },
  rights: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start', minHeight: space[11] },
  box: {
    width: space[6],
    height: space[6],
    borderRadius: space[1],
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  flex: { flex: 1 },
});
