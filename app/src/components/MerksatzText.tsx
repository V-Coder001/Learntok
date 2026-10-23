import { Text, StyleSheet } from 'react-native';

import { Typo } from '@/components/Typo';
import { parseHighlight } from '@/lib/quiz';
import { colors, radius } from '@/theme';

interface MerksatzTextProps {
  text: string;
}

// Merksatz mit grün markiertem Wort. Markierung per `**Wort**` im Text.
export function MerksatzText({ text }: MerksatzTextProps) {
  const parts = parseHighlight(text);
  return (
    <Typo variant="merksatz">
      {parts.map((part, index) =>
        part.highlight ? (
          <Text key={index} style={styles.highlight}>
            {part.text}
          </Text>
        ) : (
          <Text key={index}>{part.text}</Text>
        ),
      )}
    </Typo>
  );
}

const styles = StyleSheet.create({
  highlight: {
    color: colors.accentInk,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    overflow: 'hidden',
  },
});
