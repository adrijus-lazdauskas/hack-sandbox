import { useState, type FormEvent } from 'react';
import { Sheet } from '../../components';
import { useDecks } from '../../store';
import type { Card } from '../../types';

/** Edit question and answer of one card, or delete it after a second confirmation step. Mount it only while open. */
export function EditCardSheet({ deckId, card, onClose }: { deckId: string; card: Card; onClose(): void }) {
  const { updateCard, deleteCard } = useDecks();
  const [question, setQuestion] = useState(card.question);
  const [answer, setAnswer] = useState(card.answer);
  const [confirming, setConfirming] = useState(false);
  const q = question.trim();
  const a = answer.trim();
  const changed = q !== card.question || a !== card.answer;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!q || !a || !changed) return;
    updateCard(deckId, card.id, { question: q, answer: a });
    onClose();
  }

  function remove() {
    deleteCard(deckId, card.id);
    onClose();
  }

  return (
    <Sheet open title="Karte bearbeiten" onClose={onClose}>
      <form onSubmit={submit}>
        <label className="field">
          Frage
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
        </label>
        <label className="field">
          Antwort
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
        </label>
        <button className="btn primary big" disabled={!q || !a || !changed}>
          Änderungen speichern
        </button>
      </form>

      <div className="deck-danger">
        {confirming ? (
          <>
            <p>Diese Karte wirklich löschen? Das lässt sich nicht rückgängig machen.</p>
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
            Karte löschen
          </button>
        )}
      </div>
    </Sheet>
  );
}
