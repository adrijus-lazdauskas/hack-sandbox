import { describe, expect, it } from 'vitest';
import { parseHash } from './router';

describe('parseHash', () => {
  it('maps the documented routes', () => {
    expect(parseHash('')).toEqual({ name: 'decks' });
    expect(parseHash('#/')).toEqual({ name: 'decks' });
    expect(parseHash('#/fortschritt')).toEqual({ name: 'progress' });
    expect(parseHash('#/stapel/abc')).toEqual({ name: 'deck', deckId: 'abc' });
    expect(parseHash('#/stapel/abc/lernen')).toEqual({ name: 'study', deckId: 'abc', onlyUnknown: false });
    expect(parseHash('#/stapel/abc/lernen?nur=offen')).toEqual({ name: 'study', deckId: 'abc', onlyUnknown: true });
  });

  it('falls back to the deck list for unknown routes', () => {
    expect(parseHash('#/gibts-nicht')).toEqual({ name: 'decks' });
    expect(parseHash('#/stapel')).toEqual({ name: 'decks' });
    expect(parseHash('#/stapel/abc/xyz')).toEqual({ name: 'decks' });
  });
});
