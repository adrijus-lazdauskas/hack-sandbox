import { useState } from 'react';
import { ProgressRing } from '../../components';
import { DECK_COLORS } from '../../lib/colors';
import { deckStats } from '../../lib/stats';
import { useDecks } from '../../store';
import type { Deck } from '../../types';
import { NewDeckSheet } from './NewDeckSheet';
import './decks.css';

function DeckTile({ deck }: { deck: Deck }) {
  const stats = deckStats(deck);
  return (
    <a className="decks-tile" href={`#/stapel/${encodeURIComponent(deck.id)}`} style={{ background: deck.color }}>
      <span className="decks-tile-ring">
        <ProgressRing percent={stats.percent} />
      </span>
      <span className="decks-tile-name">{deck.name}</span>
      <span className="decks-tile-meta">
        {stats.total} {stats.total === 1 ? 'Karte' : 'Karten'} · {stats.unknown} nicht gewusst
      </span>
    </a>
  );
}

export function DecksScreen() {
  const { decks } = useDecks();
  const [creating, setCreating] = useState(false);
  // Cycle through the colours so new decks don't all look the same.
  const nextColor = DECK_COLORS[decks.length % DECK_COLORS.length];

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <div className="muted">Hallo! Was lernst du heute?</div>
          <h1>Deine Stapel</h1>
        </div>
      </header>

      {decks.length ? (
        <div className="decks-tiles">
          {decks.map((deck) => (
            <DeckTile key={deck.id} deck={deck} />
          ))}
          <button type="button" className="decks-add" onClick={() => setCreating(true)}>
            <span className="decks-plus" aria-hidden="true">+</span>
            Neuer Stapel
          </button>
        </div>
      ) : (
        <div className="decks-empty">
          <div className="decks-empty-icon" aria-hidden="true">🗂️</div>
          <h2>Noch keine Stapel</h2>
          <p className="muted">Leg deinen ersten Stapel an und füg deine Fragen aus den Notizen ein.</p>
          <button type="button" className="btn primary big" onClick={() => setCreating(true)}>
            + Neuer Stapel
          </button>
        </div>
      )}

      {creating && <NewDeckSheet defaultColor={nextColor} onClose={() => setCreating(false)} />}
    </div>
  );
}
