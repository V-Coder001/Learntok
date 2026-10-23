import type { Question } from '@/services/types';

/** Zählt richtige Antworten. `null` steht für eine nicht beantwortete Frage. */
export function scoreAnswers(questions: readonly Question[], answers: readonly (number | null)[]): number {
  return questions.reduce((sum, question, index) => {
    return answers[index] === question.correctIndex ? sum + 1 : sum;
  }, 0);
}

/** Zerlegt einen Merksatz in normalen Text und hervorgehobene Teile (`**…**`). */
export function parseHighlight(text: string): { text: string; highlight: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { text: part.slice(2, -2), highlight: true }
        : { text: part, highlight: false },
    );
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')} k`;
  return `${n}`;
}
