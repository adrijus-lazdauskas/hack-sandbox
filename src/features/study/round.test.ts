import { describe, expect, it } from 'vitest';
import type { CardStatus, Deck } from '../../types';
import { buildQueue, resultHeadline } from './round';

const deck = (...statuses: CardStatus[]): Deck => ({
  id: 'd',
  name: 'Test',
  color: '#ffcf5c',
  createdAt: '2026-11-09T00:00:00.000Z',
  cards: statuses.map((status, i) => ({ id: `c${i}`, question: 'F', answer: 'A', status })),
});

describe('buildQueue', () => {
  it('takes all cards in deck order', () => {
    expect(buildQueue(deck('known', 'new', 'unknown'), false)).toEqual(['c0', 'c1', 'c2']);
  });

  it('takes only unknown cards for a retry round', () => {
    expect(buildQueue(deck('unknown', 'known', 'new', 'unknown'), true)).toEqual(['c0', 'c3']);
  });
});

describe('resultHeadline', () => {
  it('praises by share of known cards', () => {
    expect(resultHeadline(100)).toBe('Stark!');
    expect(resultHeadline(80)).toBe('Stark!');
    expect(resultHeadline(50)).toBe('Gut dabei!');
    expect(resultHeadline(49)).toBe('Weiter so!');
  });
});
