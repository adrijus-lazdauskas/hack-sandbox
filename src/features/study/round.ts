import type { Deck } from '../../types';

/** Card ids for one round, fixed at the start so ratings during the round don't change the queue. */
export function buildQueue(deck: Deck, onlyUnknown: boolean): string[] {
  return deck.cards.filter((c) => !onlyUnknown || c.status === 'unknown').map((c) => c.id);
}

export function resultHeadline(percent: number): string {
  if (percent >= 80) return 'Stark!';
  if (percent >= 50) return 'Gut dabei!';
  return 'Weiter so!';
}
