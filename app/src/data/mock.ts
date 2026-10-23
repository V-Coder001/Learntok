import type { Clip, Duel, Group, MaterialItem, Topic, User } from '@/services/types';

export const mockUser: User = { id: 'u-lea', name: 'Lea', initials: 'LM' };

export const topics: Topic[] = [
  { id: 'bio', name: 'Biologie', progress: 0.62, clipCount: 24 },
  { id: 'geschichte', name: 'Geschichte', progress: 0.35, clipCount: 18 },
  { id: 'mathe', name: 'Mathe', progress: 0.8, clipCount: 31 },
  { id: 'englisch', name: 'Englisch', progress: 0.14, clipCount: 12 },
  { id: 'physik', name: 'Physik', progress: 0.5, clipCount: 22 },
  { id: 'chemie', name: 'Chemie', progress: 0.22, clipCount: 16 },
];

export const clips: Clip[] = [
  {
    id: 'c-zelle',
    topicId: 'bio',
    title: 'Die Zelle: Die Kraftwerke',
    merksatz: 'Mitochondrien liefern die **Energie** der Zelle in Form von ATP.',
    durationSec: 58,
    likes: 1243,
    comments: 36,
    author: 'Mika',
    authorId: 'u-mika',
    visibility: 'public',
    questions: [
      {
        prompt: 'Welche Struktur liefert die meiste Energie der Zelle?',
        options: ['Ribosom', 'Mitochondrium', 'Zellkern'],
        correctIndex: 1,
        explanation: 'Mitochondrien bauen in der Atmung ATP auf.',
      },
      {
        prompt: 'In welcher Form speichert die Zelle kurzfristig Energie?',
        options: ['Als ATP', 'Als DNA', 'Als Glukose-Membran'],
        correctIndex: 0,
        explanation: 'ATP ist der universelle Energieträger der Zelle.',
      },
      {
        prompt: 'Welche Membran hat Mitochondrien zusätzlich?',
        options: ['Eine Doppelmembran', 'Keine Membran', 'Eine Zellwand'],
        correctIndex: 0,
        explanation: 'Innere und äußere Membran schaffen zwei Räume für die Atmung.',
      },
    ],
  },
  {
    id: 'c-revolution',
    topicId: 'geschichte',
    title: 'Der Sturm auf die Bastille',
    merksatz: 'Am **14. Juli 1789** begann die Französische Revolution in Paris.',
    durationSec: 64,
    likes: 882,
    comments: 12,
    author: 'Sophie',
    authorId: 'u-sophie',
    visibility: 'group',
    questions: [
      {
        prompt: 'Wann stürmten Pariser die Bastille?',
        options: ['14. Juli 1789', '1. Mai 1800', '9. November 1918'],
        correctIndex: 0,
        explanation: 'Der 14. Juli ist bis heute Nationalfeiertag in Frankreich.',
      },
      {
        prompt: 'Was war die Bastille zu dieser Zeit?',
        options: ['Ein Gefängnis', 'Ein Kloster', 'Eine Universität'],
        correctIndex: 0,
        explanation: 'Die Bastille war ein Staatsgefängnis und Symbol der Monarchie.',
      },
      {
        prompt: 'Welche Parole gehört zur Revolution?',
        options: ['Freiheit, Gleichheit, Brüderlichkeit', 'Ein Volk, ein Reich', 'Mit Gott für König'],
        correctIndex: 0,
        explanation: 'Die Trias steht bis heute auf französischen Gebäuden.',
      },
    ],
  },
  {
    id: 'c-ableitung',
    topicId: 'mathe',
    title: 'Die Kettenregel in 60 Sekunden',
    merksatz: 'Äußere Ableitung mal **innere Ableitung**, nie vergessen.',
    durationSec: 49,
    likes: 2310,
    comments: 88,
    author: 'Jonas',
    authorId: 'u-jonas',
    visibility: 'public',
    questions: [
      {
        prompt: 'Was ist die Ableitung von sin(x²)?',
        options: ['cos(x²)', '2x · cos(x²)', '2x · sin(x²)'],
        correctIndex: 1,
        explanation: 'Äußere Ableitung cos, innere Ableitung 2x.',
      },
      {
        prompt: 'Wofür steht „innere Ableitung“?',
        options: ['Ableitung des Arguments', 'Zweite Ableitung', 'Ableitung der Konstanten'],
        correctIndex: 0,
        explanation: 'Die innere Funktion ist das, was in der äußeren steht.',
      },
      {
        prompt: 'Ableitung von e^(3x)?',
        options: ['e^(3x)', '3e^(3x)', 'e^3'],
        correctIndex: 1,
        explanation: 'Die innere Ableitung 3 kommt als Faktor dazu.',
      },
    ],
  },
  {
    id: 'c-present-perfect',
    topicId: 'englisch',
    title: 'Present Perfect vs. Simple Past',
    merksatz: 'Present Perfect verbindet **Vergangenheit mit Gegenwart**.',
    durationSec: 52,
    likes: 540,
    comments: 9,
    author: 'Lea',
    authorId: 'u-lea',
    visibility: 'private',
    questions: [
      {
        prompt: 'Welche Form passt zu „I ___ my homework already.“?',
        options: ['have finished', 'finished', 'finish'],
        correctIndex: 0,
        explanation: '„already“ mit Bezug zur Gegenwart verlangt Present Perfect.',
      },
      {
        prompt: 'Welche Zeitangabe passt zum Simple Past?',
        options: ['yesterday', 'so far', 'recently'],
        correctIndex: 0,
        explanation: 'Abgeschlossene Zeitpunkte wie „yesterday“ gehören ins Simple Past.',
      },
      {
        prompt: 'Wie lautet das Partizip II von „write“?',
        options: ['wrote', 'written', 'writed'],
        correctIndex: 1,
        explanation: 'Write, wrote, written ist unregelmäßig.',
      },
    ],
  },
];

export const groups: Group[] = [
  { id: 'g-bio', name: 'Bio Klausur 12b', subject: 'Biologie', members: 14, liveCount: 3, joined: true },
  { id: 'g-mathe', name: 'Analysis Crew', subject: 'Mathe', members: 9, liveCount: 0, joined: false },
  { id: 'g-gesch', name: 'Abi Geschichte', subject: 'Geschichte', members: 22, liveCount: 5, joined: false },
];

export const duels: Duel[] = [
  { id: 'd-1', opponent: 'Mika', clipId: 'c-zelle', status: 'open', myScore: 0, opponentScore: 0 },
  { id: 'd-2', opponent: 'Jonas', clipId: 'c-ableitung', status: 'running', myScore: 2, opponentScore: 1 },
  { id: 'd-3', opponent: 'Sophie', clipId: 'c-revolution', status: 'done', myScore: 3, opponentScore: 2 },
];

export const material: MaterialItem[] = [
  { id: 'm-1', title: 'Zellbiologie Skript.pdf', status: 'ready', visibility: 'private', clipId: 'c-zelle' },
  { id: 'm-2', title: 'Fotos Tafelbild Analysis', status: 'processing', visibility: 'private' },
  { id: 'm-3', title: 'Englisch Grammatik (Text)', status: 'private', visibility: 'private', clipId: 'c-present-perfect' },
];
