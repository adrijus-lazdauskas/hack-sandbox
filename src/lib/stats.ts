import type { Card, Deck, DeckStats } from '../types';

function statsOf(cards: Card[]): DeckStats {
  const known = cards.filter((c) => c.status === 'known').length;
  const unknown = cards.filter((c) => c.status === 'unknown').length;
  const total = cards.length;
  return {
    total,
    known,
    unknown,
    fresh: total - known - unknown,
    percent: total ? Math.round((known / total) * 100) : 0,
  };
}

export function deckStats(deck: Deck): DeckStats {
  return statsOf(deck.cards);
}

export function totalStats(decks: Deck[]): DeckStats {
  return statsOf(decks.flatMap((d) => d.cards));
}
