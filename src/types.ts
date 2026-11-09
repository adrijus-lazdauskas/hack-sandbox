export type CardStatus = 'new' | 'known' | 'unknown';

export interface Card {
  id: string;
  question: string;
  answer: string;
  /** Last rating; 'new' until rated. */
  status: CardStatus;
}

export interface Deck {
  id: string;
  name: string;
  /** One of DECK_COLORS. */
  color: string;
  cards: Card[];
  /** ISO date. */
  createdAt: string;
}

export interface DeckStats {
  total: number;
  known: number;
  unknown: number;
  /** Cards with status 'new'. */
  fresh: number;
  /** Math.round(known / total * 100), 0 for an empty deck. */
  percent: number;
}

export interface CardInput {
  question: string;
  answer: string;
}

export interface ParsedImport {
  cards: CardInput[];
  /** 1-based line number and raw line text. */
  errors: { line: number; text: string }[];
}
