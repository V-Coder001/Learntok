import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Field } from '@/components/Field';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useTopics } from '@/hooks/queries';
import { space } from '@/theme';
import { View } from 'react-native';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { data: topics = [] } = useTopics();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<string | null>(null);

  return (
    <Screen scroll>
      <Header title={t.createGroup.title} />
      <Field label={t.createGroup.name} value={name} onChangeText={setName} placeholder={t.createGroup.namePlaceholder} />
      <Typo variant="small" tone="muted">
        {t.createGroup.subject}
      </Typo>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space[2] }}>
        {topics.map((topic) => (
          <Chip key={topic.id} label={topic.name} selected={subject === topic.id} onPress={() => setSubject(topic.id)} />
        ))}
      </View>
      <View style={{ marginTop: 'auto' }}>
        <Button
          label={t.createGroup.submit}
          disabled={name.trim().length === 0 || !subject}
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}
