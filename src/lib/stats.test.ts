import { describe, expect, it } from 'vitest';
import type { CardStatus, Deck } from '../types';
import { deckStats, totalStats } from './stats';

function deck(...statuses: CardStatus[]): Deck {
  return {
    id: 'd',
    name: 'Test',
    color: '#ffcf5c',
    createdAt: '2026-11-09T00:00:00.000Z',
    cards: statuses.map((status, i) => ({ id: String(i), question: 'F', answer: 'A', status })),
  };
}

describe('deckStats', () => {
  it('counts statuses and rounds the known share', () => {
    expect(deckStats(deck('known', 'known', 'unknown', 'new', 'new', 'new'))).toEqual({
      total: 6,
      known: 2,
      unknown: 1,
      fresh: 3,
      percent: 33,
    });
  });

  it('returns 0 percent for an empty deck', () => {
    expect(deckStats(deck()).percent).toBe(0);
  });
});

describe('totalStats', () => {
  it('sums the cards of all decks', () => {
    expect(totalStats([deck('known'), deck('unknown', 'known', 'new')])).toEqual({
      total: 4,
      known: 2,
      unknown: 1,
      fresh: 1,
      percent: 50,
    });
  });
});
