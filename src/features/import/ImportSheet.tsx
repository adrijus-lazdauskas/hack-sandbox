import { useMemo, useState, type FormEvent } from 'react';
import { Sheet } from '../../components';
import { parseImport } from '../../lib/import';
import { useDecks } from '../../store';
import './import.css';

const PLACEHOLDER = 'Was ist Inflation?;Ein anhaltender Anstieg des Preisniveaus\nWofür steht EZB?;Europäische Zentralbank';
const MAX_LISTED = 5;

const cardsLabel = (n: number) => `${n} ${n === 1 ? 'Karte' : 'Karten'}`;

// Lives inside the sheet, so the text resets every time the sheet opens again.
function ImportForm({ deckId, onDone }: { deckId: string; onDone(): void }) {
  const { addCards } = useDecks();
  const [text, setText] = useState('');
  const { cards, errors } = useMemo(() => parseImport(text), [text]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!cards.length) return;
    addCards(deckId, cards);
    onDone();
  }

  return (
    <form onSubmit={submit}>
      <label className="field">
        Füge deine Notizen ein
        <small>Eine Karte pro Zeile, Frage und Antwort mit ; getrennt</small>
        <textarea className="import-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={PLACEHOLDER} spellCheck={false} autoFocus />
      </label>

      {text.trim() && (
        <div className="import-status" aria-live="polite">
          <span className="import-pill ok">✓ {cardsLabel(cards.length)} erkannt</span>
          {errors.length > 0 && (
            <span className="import-pill err">
              {errors.length === 1 ? 'Zeile' : 'Zeilen'} {errors.map((e) => e.line).join(', ')} übersprungen
            </span>
          )}
        </div>
      )}
      {errors.length > 0 && (
        <ul className="import-skipped" aria-label="Übersprungene Zeilen">
          {errors.slice(0, MAX_LISTED).map((e) => (
            <li key={e.line}>
              <b>Zeile {e.line}</b>
              <span className="import-reason">{e.text.includes(';') ? 'Frage oder Antwort fehlt' : 'kein ;'}</span>
              <code title={e.text}>{e.text.trim()}</code>
            </li>
          ))}
          {errors.length > MAX_LISTED && <li className="muted">… und {errors.length - MAX_LISTED} weitere</li>}
        </ul>
      )}

      <button className="btn primary big" disabled={!cards.length}>
        {cardsLabel(cards.length)} importieren
      </button>
    </form>
  );
}

export function ImportSheet({ deckId, open, onClose }: { deckId: string; open: boolean; onClose(): void }) {
  return (
    <Sheet open={open} title="Text importieren" onClose={onClose}>
      <ImportForm deckId={deckId} onDone={onClose} />
    </Sheet>
  );
}
