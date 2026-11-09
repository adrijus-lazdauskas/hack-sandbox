import { useDecks } from '../../store';

// Placeholder from the scaffold, replaced by the deck screen task.
export function DeckScreen({ deckId }: { deckId: string }) {
  const deck = useDecks().getDeck(deckId);
  return (
    <div className="wrap">
      <header className="top">
        <a className="icon-btn" href="#/" aria-label="Zurück">←</a>
      </header>
      <h1>{deck?.name}</h1>
      <p className="muted">Hier erscheint bald die Stapel-Ansicht.</p>
    </div>
  );
}
