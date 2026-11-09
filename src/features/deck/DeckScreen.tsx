import { useState } from 'react';
import { deckStats } from '../../lib/stats';
import { navigate } from '../../router';
import { useDecks } from '../../store';
import { ImportSheet } from '../import/ImportSheet';
import { AddCardSheet } from './AddCardSheet';
import { EditDeckSheet } from './EditDeckSheet';
import './deck.css';

type SheetName = 'add' | 'import' | 'edit' | null;

export function DeckScreen({ deckId }: { deckId: string }) {
  const deck = useDecks().getDeck(deckId);
  const [sheet, setSheet] = useState<SheetName>(null);
  const close = () => setSheet(null);

  // Briefly undefined right after deleting, before the route changes.
  if (!deck) return null;
  const stats = deckStats(deck);

  return (
    <div className="wrap">
      <header className="top">
        <a className="icon-btn" href="#/" aria-label="Zurück zur Übersicht">←</a>
        <button type="button" className="icon-btn" aria-label="Stapel bearbeiten" onClick={() => setSheet('edit')}>⋯</button>
      </header>

      <section className="deck-hero" style={{ background: deck.color }}>
        <h1>{deck.name}</h1>
        <div className="deck-meta">
          {stats.total} {stats.total === 1 ? 'Karte' : 'Karten'} · {stats.percent} % gewusst
        </div>
        <div className="deck-track" role="progressbar" aria-valuenow={stats.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
          <span style={{ width: `${stats.percent}%` }} />
        </div>
        <div className="deck-chips">
          <span>{stats.known} gewusst</span>
          <span>{stats.unknown} nicht gewusst</span>
          <span>{stats.fresh} neu</span>
        </div>
      </section>

      <button type="button" className="btn primary big" disabled={!stats.total} onClick={() => navigate(`/stapel/${encodeURIComponent(deck.id)}/lernen`)}>
        Jetzt lernen ▸
      </button>
      <div className="row deck-actions">
        <button type="button" className="btn" onClick={() => setSheet('import')}>⇣ Text importieren</button>
        <button type="button" className="btn" onClick={() => setSheet('add')}>+ Karte</button>
      </div>

      <h2>Karten</h2>
      {deck.cards.length ? (
        <ul className="deck-cards" role="list">
          {deck.cards.map((card) => (
            <li key={card.id} className="deck-card">
              <span
                className={`deck-dot ${card.status}`}
                role="img"
                aria-label={card.status === 'known' ? 'gewusst' : card.status === 'unknown' ? 'nicht gewusst' : 'neu'}
              />
              <div>
                <div className="deck-q">{card.question}</div>
                <div className="deck-a">{card.answer}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">Noch leer. Tipp auf „Text importieren“ und füge deine Notizen ein.</p>
      )}

      <ImportSheet deckId={deck.id} open={sheet === 'import'} onClose={close} />
      {sheet === 'add' && <AddCardSheet deckId={deck.id} onClose={close} />}
      {sheet === 'edit' && <EditDeckSheet deck={deck} onClose={close} />}
    </div>
  );
}
