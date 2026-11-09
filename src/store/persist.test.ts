import { describe, expect, it } from 'vitest';
import type { Deck } from '../types';
import { STORAGE_KEY, loadDecks, saveDecks } from './persist';

function memoryStorage(initial?: string) {
  const data = new Map<string, string>(initial === undefined ? [] : [[STORAGE_KEY, initial]]);
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    raw: () => data.get(STORAGE_KEY),
  };
}

const deck: Deck = {
  id: 'd1',
  name: 'Makroökonomie – Klausur',
  color: '#ffcf5c',
  createdAt: '2026-11-09T12:00:00.000Z',
  cards: [
    { id: 'c1', question: 'Was ist Inflation?', answer: 'Anstieg des Preisniveaus', status: 'known' },
    { id: 'c2', question: 'Wofür steht EZB?', answer: 'Europäische Zentralbank', status: 'unknown' },
    { id: 'c3', question: 'Was misst das BIP?', answer: 'Wert aller Waren', status: 'new' },
  ],
};

describe('saveDecks / loadDecks', () => {
  it('round-trips decks, cards and ratings', () => {
    const storage = memoryStorage();
    saveDecks(storage, [deck]);
    expect(JSON.parse(storage.raw()!)).toEqual({ version: 1, decks: [deck] });
    expect(loadDecks(storage)).toEqual([deck]);
  });

  it('starts empty when nothing is stored or storage is missing', () => {
    expect(loadDecks(memoryStorage())).toEqual([]);
    expect(loadDecks(undefined)).toEqual([]);
  });

  it('starts empty on broken JSON or a wrong shape', () => {
    expect(loadDecks(memoryStorage('{kaputt'))).toEqual([]);
    expect(loadDecks(memoryStorage('[]'))).toEqual([]);
    expect(loadDecks(memoryStorage(JSON.stringify({ version: 2, decks: [deck] })))).toEqual([]);
    expect(loadDecks(memoryStorage(JSON.stringify({ version: 1, decks: 'nope' })))).toEqual([]);
  });

  it('drops invalid decks and cards and repairs unknown statuses', () => {
    const stored = {
      version: 1,
      decks: [
        { ...deck, cards: [...deck.cards, { id: 'x' }, { ...deck.cards[0], id: 'c4', status: 'maybe' }] },
        { id: 'd2', name: 42 },
        null,
      ],
    };
    const loaded = loadDecks(memoryStorage(JSON.stringify(stored)));
    expect(loaded).toHaveLength(1);
    expect(loaded[0].cards.map((c) => `${c.id}:${c.status}`)).toEqual(['c1:known', 'c2:unknown', 'c3:new', 'c4:new']);
  });

  it('survives storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(loadDecks(throwing)).toEqual([]);
    expect(() => saveDecks(throwing, [deck])).not.toThrow();
  });
});
