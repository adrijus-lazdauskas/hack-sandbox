import { useState, type FormEvent } from 'react';
import { Sheet } from '../../components';
import { navigate } from '../../router';
import { useDecks } from '../../store';
import type { Deck } from '../../types';

/** Rename the deck, or delete it after a second confirmation step. */
export function EditDeckSheet({ deck, onClose }: { deck: Deck; onClose(): void }) {
  const { renameDeck, deleteDeck } = useDecks();
  const [name, setName] = useState(deck.name);
  const [confirming, setConfirming] = useState(false);
  const trimmed = name.trim();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    renameDeck(deck.id, trimmed);
    onClose();
  }

  function remove() {
    deleteDeck(deck.id);
    navigate('/');
  }

  const count = deck.cards.length;
  return (
    <Sheet open title="Stapel bearbeiten" onClose={onClose}>
      <form onSubmit={submit}>
        <label className="field">
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
        </label>
        <button className="btn primary big" disabled={!trimmed || trimmed === deck.name}>
          Umbenennen
        </button>
      </form>

      <div className="deck-danger">
        {confirming ? (
          <>
            <p>
              „{deck.name}“ mit {count} {count === 1 ? 'Karte' : 'Karten'} wirklich löschen? Das lässt sich nicht rückgängig machen.
            </p>
            <div className="row">
              <button type="button" className="btn" onClick={() => setConfirming(false)}>
                Abbrechen
              </button>
              <button type="button" className="btn deck-delete-confirm" onClick={remove} autoFocus>
                Ja, löschen
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn big deck-delete" onClick={() => setConfirming(true)}>
            Stapel löschen
          </button>
        )}
      </div>
    </Sheet>
  );
}
