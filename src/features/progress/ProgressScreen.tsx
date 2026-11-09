import { deckStats, totalStats } from '../../lib/stats';
import { useDecks } from '../../store';
import type { Deck } from '../../types';
import './progress.css';

const share = (part: number, total: number) => (total ? `${(part / total) * 100}%` : '0%');

function DeckProgress({ deck }: { deck: Deck }) {
  const s = deckStats(deck);
  return (
    <a className="progress-deck" href={`#/stapel/${encodeURIComponent(deck.id)}`}>
      <div className="progress-head">
        <span className="progress-name">
          <span className="progress-swatch" style={{ background: deck.color }} aria-hidden="true" />
          {deck.name}
        </span>
        <span className="progress-percent">{s.percent} %</span>
      </div>
      <div className="progress-bar" role="img" aria-label={`${s.known} gewusst, ${s.unknown} nicht gewusst, ${s.fresh} neu`}>
        <span className="known" style={{ width: share(s.known, s.total) }} />
        <span className="unknown" style={{ width: share(s.unknown, s.total) }} />
      </div>
      <div className="progress-legend" aria-hidden="true">
        <span><i className="known" />{s.known} gewusst</span>
        <span><i className="unknown" />{s.unknown} nicht gewusst</span>
        <span><i className="fresh" />{s.fresh} neu</span>
      </div>
    </a>
  );
}

export function ProgressScreen() {
  const { decks } = useDecks();
  const total = totalStats(decks);

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <div className="muted">Über alle Stapel</div>
          <h1>Fortschritt</h1>
        </div>
      </header>

      <div className="progress-kpis">
        <div className="progress-kpi">
          <b>{total.total}</b>
          <span>Karten</span>
        </div>
        <div className="progress-kpi">
          <b className="known">{total.known}</b>
          <span>gewusst</span>
        </div>
        <div className="progress-kpi">
          <b className="unknown">{total.unknown}</b>
          <span>nicht gewusst</span>
        </div>
      </div>

      {decks.length ? (
        <ul className="progress-list">
          {decks.map((deck) => (
            <li key={deck.id}>
              <DeckProgress deck={deck} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="progress-empty">
          <p className="muted">Noch keine Stapel. Leg einen an und lern eine Runde, dann siehst du hier deinen Fortschritt.</p>
          <a className="btn primary" href="#/">Zu den Stapeln</a>
        </div>
      )}
    </div>
  );
}
