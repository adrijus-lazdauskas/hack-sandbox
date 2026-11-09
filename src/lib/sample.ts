import type { Deck } from '../types';
import { DECK_COLORS } from './colors';

const SAMPLE_CARDS: [question: string, answer: string][] = [
  ['Welche Aminosäure bildet Disulfidbrücken?', 'Cystein'],
  ['Wie viele proteinogene Aminosäuren gibt es?', '20 (plus Selenocystein und Pyrrolysin)'],
  ['Welche Aminosäure ist nicht chiral?', 'Glycin'],
  ['Was ist ein Zwitterion?', 'Ein Molekül mit positiver und negativer Ladung, nach außen neutral'],
  ['Welche Aminosäure hat einen Imidazolring?', 'Histidin'],
  ['Welche Aminosäuren sind aromatisch?', 'Phenylalanin, Tyrosin, Tryptophan'],
  ['Welche Bindung verknüpft Aminosäuren?', 'Die Peptidbindung'],
];

/** Deck shown on the very first start, so the app isn't empty. All cards start as 'new'. */
export function createSampleDeck(newId: () => string): Deck {
  return {
    id: newId(),
    name: 'Beispiel: Biochemie – Aminosäuren',
    color: DECK_COLORS[0],
    createdAt: new Date().toISOString(),
    cards: SAMPLE_CARDS.map(([question, answer]) => ({ id: newId(), question, answer, status: 'new' })),
  };
}
