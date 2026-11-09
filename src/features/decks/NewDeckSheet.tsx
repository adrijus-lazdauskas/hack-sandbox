import { useState, type FormEvent } from 'react';
import { Sheet } from '../../components';
import { DECK_COLORS } from '../../lib/colors';
import { navigate } from '../../router';
import { useDecks } from '../../store';

const COLOR_NAMES = ['Gelb', 'Mint', 'Rosa', 'Blau', 'Orange'];

/** Creates a deck with name and colour, then opens the new deck. Mount it only while open, so the form starts fresh. */
export function NewDeckSheet({ defaultColor, onClose }: { defaultColor: string; onClose(): void }) {
  const { createDeck } = useDecks();
  const [name, setName] = useState('');
  const [color, setColor] = useState(defaultColor);
  const trimmed = name.trim();

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;
    const deck = createDeck(trimmed, color);
    onClose();
    navigate(`/stapel/${encodeURIComponent(deck.id)}`);
  }

  return (
    <Sheet open title="Neuer Stapel" onClose={onClose}>
      <form onSubmit={submit}>
        <label className="field">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Makroökonomie – Klausur"
            maxLength={80}
            autoFocus
            required
          />
        </label>
        <div className="field" id="decks-color-label">Farbe</div>
        <div className="decks-swatches" role="group" aria-labelledby="decks-color-label">
          {DECK_COLORS.map((c, i) => (
            <button
              key={c}
              type="button"
              className="decks-swatch"
              style={{ background: c }}
              aria-label={COLOR_NAMES[i] ?? c}
              aria-pressed={c === color}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <button className="btn primary big" disabled={!trimmed}>
          Stapel anlegen
        </button>
      </form>
    </Sheet>
  );
}
