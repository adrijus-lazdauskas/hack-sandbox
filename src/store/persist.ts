import type { Card, CardStatus, Deck } from '../types';

export const STORAGE_KEY = 'lernkarten.v1';

type Reader = Pick<Storage, 'getItem'>;
type Writer = Pick<Storage, 'setItem'>;

const STATUSES: CardStatus[] = ['new', 'known', 'unknown'];
const isString = (v: unknown): v is string => typeof v === 'string';
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function toCard(v: unknown): Card | null {
  if (!isObject(v) || !isString(v.id) || !isString(v.question) || !isString(v.answer)) return null;
  const status = STATUSES.includes(v.status as CardStatus) ? (v.status as CardStatus) : 'new';
  return { id: v.id, question: v.question, answer: v.answer, status };
}

function toDeck(v: unknown): Deck | null {
  if (!isObject(v) || !isString(v.id) || !isString(v.name) || !isString(v.color) || !Array.isArray(v.cards)) return null;
  return {
    id: v.id,
    name: v.name,
    color: v.color,
    cards: v.cards.map(toCard).filter((c): c is Card => c !== null),
    createdAt: isString(v.createdAt) ? v.createdAt : new Date(0).toISOString(),
  };
}

/** Reads the saved decks. Missing, broken or unreadable data gives an empty list; invalid entries are dropped. */
export function loadDecks(storage: Reader | undefined): Deck[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!isObject(data) || data.version !== 1 || !Array.isArray(data.decks)) return [];
    return data.decks.map(toDeck).filter((d): d is Deck => d !== null);
  } catch {
    return [];
  }
}

/** Saves all decks as { version: 1, decks }. Fails silently when storage is unavailable or full. */
export function saveDecks(storage: Writer | undefined, decks: Deck[]): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ version: 1, decks }));
  } catch {
    // Private mode or quota exceeded: keep working in memory.
  }
}

/** window.localStorage, or undefined where touching it throws (blocked site data). */
export function browserStorage(): Storage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
