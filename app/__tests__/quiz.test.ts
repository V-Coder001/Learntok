import { parseHighlight, scoreAnswers, formatCount, initialsOf } from '@/lib/quiz';
import { clips } from '@/data/mock';

describe('scoreAnswers', () => {
  const questions = clips[0]!.questions;

  it('zählt nur richtige Antworten', () => {
    const correct = questions.map((q) => q.correctIndex);
    expect(scoreAnswers(questions, correct)).toBe(questions.length);
  });

  it('wertet unbeantwortete Fragen als falsch', () => {
    expect(scoreAnswers(questions, [null, null, null])).toBe(0);
  });

  it('zählt Mischungen korrekt', () => {
    const answers = [questions[0]!.correctIndex, questions[1]!.correctIndex === 0 ? 1 : 0, null];
    expect(scoreAnswers(questions, answers)).toBe(1);
  });
});

describe('parseHighlight', () => {
  it('markiert Text in doppelten Sternchen', () => {
    expect(parseHighlight('Die **Energie** der Zelle')).toEqual([
      { text: 'Die ', highlight: false },
      { text: 'Energie', highlight: true },
      { text: ' der Zelle', highlight: false },
    ]);
  });

  it('lässt Text ohne Markierung unverändert', () => {
    expect(parseHighlight('ohne Markierung')).toEqual([{ text: 'ohne Markierung', highlight: false }]);
  });
});

describe('Hilfsfunktionen', () => {
  it('formatiert große Zahlen auf Deutsch', () => {
    expect(formatCount(1243)).toBe('1,2 k');
    expect(formatCount(36)).toBe('36');
  });

  it('bildet Initialen', () => {
    expect(initialsOf('Lea Müller')).toBe('LM');
    expect(initialsOf('Mika')).toBe('M');
  });
});
