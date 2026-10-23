import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Field } from '@/components/Field';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { SegmentControl } from '@/components/SegmentControl';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useCreateJob } from '@/hooks/queries';
import type { ClipStyle, UploadSource, Visibility } from '@/services/types';
import { useUploadDraft } from '@/store/upload';
import { colors, icon, radius, space } from '@/theme';

type SourceKind = UploadSource['kind'];

const sourceOptions = [
  { value: 'pdf', label: t.create.sources.pdf },
  { value: 'photo', label: t.create.sources.photo },
  { value: 'text', label: t.create.sources.text },
] as const;

const styleOptions = [
  { value: 'short', label: t.create.styles.short },
  { value: 'detailed', label: t.create.styles.detailed },
  { value: 'quiz', label: t.create.styles.quiz },
] as const;

const visibilityOptions = [
  { value: 'private', label: t.create.visibilities.private },
  { value: 'group', label: t.create.visibilities.group },
  { value: 'public', label: t.create.visibilities.public },
] as const;

export default function CreateScreen() {
  const router = useRouter();
  const draft = useUploadDraft();
  const createJob = useCreateJob();
  const [kind, setKind] = useState<SourceKind>(draft.source?.kind ?? 'pdf');
  const [text, setText] = useState(draft.source?.kind === 'text' ? draft.source.value : '');
  const [pickError, setPickError] = useState<string | null>(null);

  const needsRights = draft.visibility !== 'private';
  const rightsMissing = needsRights && !draft.rightsConfirmed;
  const sourceReady = kind === 'text' ? text.trim().length > 0 : draft.source !== null && draft.source.kind === kind;
  const canSubmit = sourceReady && !rightsMissing && !createJob.isPending;

  const pickPdf = async () => {
    setPickError(null);
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    draft.setSource({ kind: 'pdf', value: asset.name });
  };

  const pickPhoto = async () => {
    setPickError(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    draft.setSource({ kind: 'photo', value: asset.fileName ?? asset.uri });
  };

  const submit = async () => {
    const source: UploadSource = kind === 'text' ? { kind: 'text', value: text.trim() } : draft.source!;
    const jobId = await createJob.mutateAsync({
      source,
      style: draft.style,
      visibility: draft.visibility,
      rightsConfirmed: draft.rightsConfirmed,
    });
    draft.reset();
    router.replace({ pathname: '/create-progress', params: { jobId } });
  };

  return (
    <Screen scroll>
      <Header title={t.create.title} />

      <Typo variant="small" tone="muted">
        {t.create.source}
      </Typo>
      <SegmentControl
        options={sourceOptions}
        value={kind}
        onChange={(value) => {
          setKind(value);
          draft.setSource(null);
        }}
      />

      {kind === 'pdf' ? (
        <Card>
          <Typo variant="small" tone="muted">
            {draft.source?.kind === 'pdf' ? draft.source.value : t.create.noSource}
          </Typo>
          <Button label={t.create.pickFile} variant="secondary" onPress={pickPdf} />
        </Card>
      ) : null}

      {kind === 'photo' ? (
        <Card>
          <Typo variant="small" tone="muted">
            {draft.source?.kind === 'photo' ? draft.source.value : t.create.noSource}
          </Typo>
          <Button label={t.create.pickPhoto} variant="secondary" onPress={pickPhoto} />
        </Card>
      ) : null}

      {kind === 'text' ? (
        <Field
          label={t.create.sources.text}
          value={text}
          onChangeText={setText}
          placeholder={t.create.textPlaceholder}
          multiline
        />
      ) : null}

      {pickError ? (
        <Typo variant="small" tone="danger">
          {pickError}
        </Typo>
      ) : null}

      <Typo variant="small" tone="muted">
        {t.create.style}
      </Typo>
      <SegmentControl options={styleOptions} value={draft.style} onChange={(value: ClipStyle) => draft.setStyle(value)} />

      <Typo variant="small" tone="muted">
        {t.create.visibility}
      </Typo>
      <SegmentControl
        options={visibilityOptions}
        value={draft.visibility}
        onChange={(value: Visibility) => draft.setVisibility(value)}
      />
      <Typo variant="caption" tone="muted">
        {t.create.visibilityHint}
      </Typo>

      {needsRights ? (
        <Pressable
          onPress={() => draft.setRightsConfirmed(!draft.rightsConfirmed)}
          accessibilityRole="checkbox"
          accessibilityLabel={t.create.rights}
          accessibilityState={{ checked: draft.rightsConfirmed }}
          style={styles.rights}
        >
          <View style={[styles.box, draft.rightsConfirmed ? styles.boxChecked : null]}>
            {draft.rightsConfirmed ? <Check color={colors.accentInk} size={icon.small} strokeWidth={icon.strokeWidth} /> : null}
          </View>
          <Typo variant="small" style={styles.rightsText}>
            {t.create.rights}
          </Typo>
        </Pressable>
      ) : null}

      {rightsMissing ? (
        <Typo variant="caption" tone="danger">
          {t.create.rightsRequired}
        </Typo>
      ) : null}

      <View style={styles.footer}>
        <Button label={t.create.submit} disabled={!canSubmit} loading={createJob.isPending} onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  rightsText: { flex: 1 },
  footer: { marginTop: 'auto', paddingTop: space[4] },
});
