import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { CardInput, CardStatus, Deck } from '../types';
import { DecksContext, type DecksApi } from './context';
import { createSampleDeck } from '../lib/sample';
import { STORAGE_KEY, browserStorage, initialDecks, loadDecks, saveDecks } from './persist';

// crypto.randomUUID only exists in secure contexts; plain http on a phone in the LAN lacks it.
function newId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Decks are kept in state and mirrored to localStorage under 'lernkarten.v1'.
export function DecksProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>(() => initialDecks(browserStorage(), () => createSampleDeck(newId)));
  // Last state that matches storage, so loading never writes back (and keeps unreadable data untouched).
  const stored = useRef(decks);

  useEffect(() => {
    if (decks === stored.current) return;
    stored.current = decks;
    saveDecks(browserStorage(), decks);
  }, [decks]);

  // Another tab changed the data: take it over.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const loaded = loadDecks(browserStorage());
      stored.current = loaded;
      setDecks(loaded);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updateDeck = useCallback((id: string, change: (deck: Deck) => Deck) => {
    setDecks((prev) => prev.map((d) => (d.id === id ? change(d) : d)));
  }, []);

  const api = useMemo<DecksApi>(
    () => ({
      decks,
      getDeck: (id) => decks.find((d) => d.id === id),
      createDeck: (name, color) => {
        const deck: Deck = { id: newId(), name, color, cards: [], createdAt: new Date().toISOString() };
        setDecks((prev) => [...prev, deck]);
        return deck;
      },
      renameDeck: (id, name) => updateDeck(id, (d) => ({ ...d, name })),
      deleteDeck: (id) => setDecks((prev) => prev.filter((d) => d.id !== id)),
      addCards: (deckId, cards: CardInput[]) =>
        updateDeck(deckId, (d) => ({
          ...d,
          cards: [...d.cards, ...cards.map((c) => ({ id: newId(), ...c, status: 'new' as const }))],
        })),
      setCardStatus: (deckId, cardId, status: CardStatus) =>
        updateDeck(deckId, (d) => ({
          ...d,
          cards: d.cards.map((c) => (c.id === cardId ? { ...c, status } : c)),
        })),
    }),
    [decks, updateDeck],
  );

  return <DecksContext.Provider value={api}>{children}</DecksContext.Provider>;
}
