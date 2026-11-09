import { createContext, useContext } from 'react';
import type { CardInput, CardStatus, Deck } from '../types';

export interface DecksApi {
  decks: Deck[];
  getDeck(id: string): Deck | undefined;
  createDeck(name: string, color: string): Deck;
  renameDeck(id: string, name: string): void;
  deleteDeck(id: string): void;
  /** New cards get status 'new'. */
  addCards(deckId: string, cards: CardInput[]): void;
  setCardStatus(deckId: string, cardId: string, status: CardStatus): void;
}

export const DecksContext = createContext<DecksApi | null>(null);

export function useDecks(): DecksApi {
  const api = useContext(DecksContext);
  if (!api) throw new Error('useDecks() must be used inside <DecksProvider>');
  return api;
}
