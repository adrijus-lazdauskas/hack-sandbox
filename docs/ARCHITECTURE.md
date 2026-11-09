# Architecture

Flashcard web app for students (see `IDEA.md`), design direction B "Kacheln" (see `DECISIONS.md` and `mockups/b.html`).

## Stack

- Vite + React 18 + TypeScript, plain CSS (no UI library)
- Hash routing (no router library), so the GitHub Pages sub-path needs no 404 fallback
- Data lives in `localStorage`, no backend, no login
- Vitest for unit tests, ESLint from the Vite React template
- `vite.config.ts` sets `base: './'`; `npm run build` writes to `dist/`, which the preview workflow publishes

## Folder layout

Each feature owns one folder under `src/features/`. Parallel tasks stay inside their folder and talk to the rest only through the contracts below.

```
index.html
src/
  main.tsx             # mounts <App /> inside <DecksProvider>
  App.tsx              # reads the hash route and renders the screen, shows <TabBar /> on tab screens
  router.ts            # useHashRoute(), navigate()
  types.ts             # shared types (below)
  styles/global.css    # design tokens from mockups/b.html, base elements, .btn classes
  components/          # Sheet, ProgressRing, TabBar
  lib/
    colors.ts          # DECK_COLORS
    stats.ts           # deckStats(), totalStats()
    import.ts          # parseImport()  (owned by the import task)
  store/               # DecksProvider, useDecks()
  features/
    decks/             # home: deck tiles + "Neuer Stapel" sheet
    deck/              # deck screen + "Karte hinzufügen" sheet
    import/            # ImportSheet
    study/             # study mode + round result
    progress/          # "Fortschritt" tab
```

CSS: global tokens and shared classes in `src/styles/global.css`. Each feature keeps its own CSS file next to its component and prefixes its classes with the folder name (`decks-…`, `deck-…`, `import-…`, `study-…`, `progress-…`).

Tests sit next to the code as `*.test.ts(x)`.

## Routes

| Hash | Screen | Tab bar |
| --- | --- | --- |
| `#/` | `DecksScreen` | yes |
| `#/stapel/:id` | `DeckScreen({ deckId })` | no |
| `#/stapel/:id/lernen` | `StudyScreen({ deckId, onlyUnknown: false })` | no |
| `#/stapel/:id/lernen?nur=offen` | `StudyScreen({ deckId, onlyUnknown: true })` | no |
| `#/fortschritt` | `ProgressScreen` | yes |

Unknown routes and unknown deck ids fall back to `#/`.

```ts
// src/router.ts
export type Route =
  | { name: 'decks' }
  | { name: 'deck'; deckId: string }
  | { name: 'study'; deckId: string; onlyUnknown: boolean }
  | { name: 'progress' };
export function useHashRoute(): Route;
export function navigate(path: string): void; // navigate('/stapel/abc') sets location.hash = '#/stapel/abc'
```

## Data model

```ts
// src/types.ts
export type CardStatus = 'new' | 'known' | 'unknown';

export interface Card {
  id: string;          // crypto.randomUUID()
  question: string;
  answer: string;
  status: CardStatus;  // last rating; 'new' until rated
}

export interface Deck {
  id: string;
  name: string;
  color: string;       // one of DECK_COLORS
  cards: Card[];
  createdAt: string;   // ISO date
}

export interface DeckStats {
  total: number;
  known: number;
  unknown: number;
  fresh: number;       // status 'new'
  percent: number;     // Math.round(known / total * 100), 0 for an empty deck
}

export interface CardInput {
  question: string;
  answer: string;
}

export interface ParsedImport {
  cards: CardInput[];
  errors: { line: number; text: string }[]; // 1-based line number, raw line text
}
```

Progress of a deck is the share of cards whose last rating is `known` (see `DECISIONS.md`).

## Contracts

### Store (`src/store/`)

```ts
export function DecksProvider(props: { children: React.ReactNode }): JSX.Element;
export function useDecks(): {
  decks: Deck[];
  getDeck(id: string): Deck | undefined;
  createDeck(name: string, color: string): Deck;
  renameDeck(id: string, name: string): void;
  deleteDeck(id: string): void;
  addCards(deckId: string, cards: CardInput[]): void; // new cards get status 'new'
  setCardStatus(deckId: string, cardId: string, status: CardStatus): void;
};
```

The scaffold keeps decks in memory. The persistence task adds `localStorage` under the key `lernkarten.v1`, stored as `{ "version": 1, "decks": Deck[] }`, without changing this API. Broken or missing data starts an empty app.

### Helpers (`src/lib/`)

```ts
export const DECK_COLORS: string[];                 // '#ffcf5c', '#7be0c3', '#ff9fb5', '#a8b8ff', '#ffb27a'
export function deckStats(deck: Deck): DeckStats;
export function totalStats(decks: Deck[]): DeckStats;
export function parseImport(text: string): ParsedImport;
```

`parseImport` splits every line at the first `;`, trims both parts, ignores empty lines and reports lines without `;` or with an empty question or answer in `errors`.

### Components (`src/components/`)

```ts
export function Sheet(props: { open: boolean; title: string; onClose(): void; children: React.ReactNode }): JSX.Element | null;
export function ProgressRing(props: { percent: number; size?: number; color?: string }): JSX.Element;
export function TabBar(): JSX.Element; // "Stapel" (#/) and "Fortschritt" (#/fortschritt); bottom on phones, top from 900 px
```

`Sheet` is the bottom sheet from the mockup: dark backdrop, closes on backdrop click and Escape.

### Feature entry points

Each feature exports exactly one component. The scaffold creates them as placeholders.

```ts
// src/features/decks/DecksScreen.tsx
export function DecksScreen(): JSX.Element;
// src/features/deck/DeckScreen.tsx
export function DeckScreen(props: { deckId: string }): JSX.Element;
// src/features/import/ImportSheet.tsx
export function ImportSheet(props: { deckId: string; open: boolean; onClose(): void }): JSX.Element | null;
// src/features/study/StudyScreen.tsx
export function StudyScreen(props: { deckId: string; onlyUnknown: boolean }): JSX.Element;
// src/features/progress/ProgressScreen.tsx
export function ProgressScreen(): JSX.Element;
```

Features import from `types`, `router`, `store`, `lib` and `components`, and from other features only through these entry points (the deck screen opens `ImportSheet`).

## UI language

All UI text is German. Code, comments, commits and PRs are English.
