import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typo } from '@/components/Typo';
import { t } from '@/i18n/de';
import { useClip } from '@/hooks/queries';
import { scoreAnswers } from '@/lib/quiz';
import { colors, layout, radius, space } from '@/theme';

const LETTERS = ['A', 'B', 'C'] as const;

export default function QuizScreen() {
  const { clipId } = useLocalSearchParams<{ clipId: string }>();
  const router = useRouter();
  const { data: clip, isLoading } = useClip(clipId);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  if (!clip) {
    return (
      <Screen>
        <Header title={t.quiz.title} />
        <Typo tone="muted">{isLoading ? t.common.loading : t.errors.generic}</Typo>
      </Screen>
    );
  }

  const total = clip.questions.length;
  const question = clip.questions[index];
  if (!question) return null;

  const isCorrect = revealed && current === question.correctIndex;

  const onNext = () => {
    const nextAnswers = [...answers, current];
    if (index + 1 < total) {
      setAnswers(nextAnswers);
      setIndex(index + 1);
      setCurrent(null);
      setRevealed(false);
      return;
    }
    const correct = scoreAnswers(clip.questions, nextAnswers);
    router.replace({
      pathname: '/result/[clipId]',
      params: { clipId: clip.id, correct: String(correct), total: String(total) },
    });
  };

  return (
    <Screen scroll>
      <Header title={t.quiz.title} />
      <View style={styles.progressBlock}>
        <Typo variant="caption" tone="muted">
          {t.quiz.question(index + 1, total)}
        </Typo>
        <ProgressBar value={(index + (revealed ? 1 : 0)) / total} />
      </View>

      <Typo variant="h2">{question.prompt}</Typo>

      <View style={styles.options}>
        {question.options.map((option, optionIndex) => {
          const selected = current === optionIndex;
          const isRight = revealed && optionIndex === question.correctIndex;
          const isWrong = revealed && selected && !isRight;
          const letter = LETTERS[optionIndex] ?? '';
          return (
            <Pressable
              key={option}
              disabled={revealed}
              onPress={() => setCurrent(optionIndex)}
              accessibilityRole="radio"
              accessibilityLabel={`${t.quiz.answer(letter)}: ${option}`}
              accessibilityState={{ selected, disabled: revealed }}
              style={[
                styles.option,
                selected ? styles.optionSelected : null,
                isRight ? styles.optionRight : null,
                isWrong ? styles.optionWrong : null,
              ]}
            >
              <View style={[styles.letter, selected || isRight ? styles.letterActive : null]}>
                <Typo variant="bodyStrong" tone={selected || isRight ? 'accent' : 'muted'}>
                  {letter}
                </Typo>
              </View>
              <Typo variant="body" style={styles.optionText}>
                {option}
              </Typo>
            </Pressable>
          );
        })}
      </View>

      {revealed ? (
        <Card>
          <Typo variant="bodyStrong" tone={isCorrect ? 'accent' : 'danger'}>
            {isCorrect ? t.quiz.correct : t.quiz.wrong}
          </Typo>
          <Typo variant="small" tone="muted">
            {`${t.quiz.explanation}: ${question.explanation}`}
          </Typo>
        </Card>
      ) : null}

      <View style={styles.footer}>
        {revealed ? (
          <Button label={index + 1 < total ? t.quiz.next : t.quiz.finish} onPress={onNext} />
        ) : (
          <Button label={t.quiz.submit} disabled={current === null} onPress={() => setRevealed(true)} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressBlock: { gap: space[2] },
  options: { gap: space[3] },
  option: {
    minHeight: layout.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[3],
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: { borderColor: colors.accent },
  optionRight: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionWrong: { borderColor: colors.danger },
  letter: {
    width: space[8],
    height: space[8],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterActive: { borderColor: colors.accent },
  optionText: { flex: 1 },
  footer: { marginTop: 'auto', paddingTop: space[4] },
});
