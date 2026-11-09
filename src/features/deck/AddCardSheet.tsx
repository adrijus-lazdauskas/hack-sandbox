import { useState, type FormEvent } from 'react';
import { Sheet } from '../../components';
import { useDecks } from '../../store';

/** Adds one card. Mount it only while open, so the form starts empty. */
export function AddCardSheet({ deckId, onClose }: { deckId: string; onClose(): void }) {
  const { addCards } = useDecks();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const valid = question.trim() !== '' && answer.trim() !== '';

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    addCards(deckId, [{ question: question.trim(), answer: answer.trim() }]);
    onClose();
  }

  return (
    <Sheet open title="Neue Karte" onClose={onClose}>
      <form onSubmit={submit}>
        <label className="field">
          Frage
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="z. B. Was ist Stagflation?" autoFocus required />
        </label>
        <label className="field">
          Antwort
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="z. B. Stagnation bei hoher Inflation" required />
        </label>
        <button className="btn primary big" disabled={!valid}>
          Karte speichern
        </button>
      </form>
    </Sheet>
  );
}
