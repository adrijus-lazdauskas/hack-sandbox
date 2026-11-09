import { useEffect, useState, type CSSProperties } from 'react';
import { deckStats } from '../../lib/stats';
import { navigate } from '../../router';
import { useDecks } from '../../store';
import type { Deck } from '../../types';
import { buildQueue, resultHeadline } from './round';
import './study.css';

type Rating = 'known' | 'unknown';

const deckPath = (deck: Deck) => `/stapel/${encodeURIComponent(deck.id)}`;

function Result({ deck, ratings, onRetry }: { deck: Deck; ratings: Rating[]; onRetry(): void }) {
  const known = ratings.filter((r) => r === 'known').length;
  const percent = Math.round((known / ratings.length) * 100);
  const stats = deckStats(deck);
  return (
    <div className="study-result">
      <div className="study-ring" style={{ '--p': percent } as CSSProperties}>
        <div>
          <b>
            {known}/{ratings.length}
          </b>
          <span>gewusst</span>
        </div>
      </div>
      <h1>{resultHeadline(percent)}</h1>
      <p className="muted">
        „{deck.name}“ steht jetzt bei {stats.percent} %.
      </p>
      <div className="row">
        {stats.unknown > 0 && (
          <button type="button" className="btn primary big" onClick={onRetry} autoFocus>
            {stats.unknown} nicht gewusste wiederholen
          </button>
        )}
        <a className="btn big" href={`#${deckPath(deck)}`}>
          Zurück zum Stapel
        </a>
      </div>
    </div>
  );
}

function Round({ deck, onlyUnknown, onRetry }: { deck: Deck; onlyUnknown: boolean; onRetry(): void }) {
  const { setCardStatus } = useDecks();
  const [queue] = useState(() => buildQueue(deck, onlyUnknown));
  const [index, setIndex] = useState(0);
  const [turned, setTurned] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const done = index >= queue.length;
  const card = done ? undefined : deck.cards.find((c) => c.id === queue[index]);

  function rate(rating: Rating) {
    if (!card || !turned) return;
    setCardStatus(deck.id, card.id, rating);
    setRatings((prev) => [...prev, rating]);
    setTurned(false);
    setIndex((i) => i + 1);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') return navigate(deckPath(deck));
      if (done) return;
      const onControl = e.target instanceof HTMLElement && e.target.closest('button, a, input, textarea');
      // A focused button already flips or rates on Space by itself.
      if (e.key === ' ' && !onControl) {
        e.preventDefault();
        setTurned((t) => !t);
      }
      const key = e.key.toLowerCase();
      if (key === 'j' || e.key === 'ArrowRight') rate('known');
      if (key === 'n' || e.key === 'ArrowLeft') rate('unknown');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!queue.length) {
    return (
      <div className="study-result">
        <h1>Nichts zu wiederholen</h1>
        <p className="muted">{onlyUnknown ? 'In diesem Stapel gibt es keine nicht gewussten Karten.' : 'Dieser Stapel hat noch keine Karten.'}</p>
        <div className="row">
          <a className="btn primary big" href={`#${deckPath(deck)}`}>
            Zurück zum Stapel
          </a>
        </div>
      </div>
    );
  }
  if (done || !card) return <Result deck={deck} ratings={ratings} onRetry={onRetry} />;

  return (
    <div className="study">
      <div className="study-head">
        <a className="icon-btn" href={`#${deckPath(deck)}`} aria-label="Abfrage beenden">✕</a>
        <div className="study-dots" aria-hidden="true">
          {queue.map((id, i) => (
            <i key={id} className={i < index ? ratings[i] : i === index ? 'current' : ''} />
          ))}
        </div>
        <span className="study-count">
          {index + 1}/{queue.length}
        </span>
      </div>

      {/* Keyed by index so the next card starts unturned without rotating back and showing its answer. */}
      <button
        key={index}
        type="button"
        className={`study-flip${turned ? ' turned' : ''}`}
        onClick={() => setTurned((t) => !t)}
        aria-label={turned ? `Antwort: ${card.answer}. Tippen, um die Frage zu zeigen` : `Frage: ${card.question}. Tippen zum Umdrehen`}
        autoFocus
      >
        <span className="study-flip-inner">
          <span className="study-face front" style={{ background: deck.color }} aria-hidden="true">
            <small>Frage</small>
            {card.question}
            <span className="study-tap">Tippen zum Umdrehen</span>
          </span>
          <span className="study-face back" aria-hidden="true">
            <small>Antwort</small>
            {card.answer}
          </span>
        </span>
      </button>

      <div className="study-judge" style={{ visibility: turned ? 'visible' : 'hidden' }}>
        <button type="button" className="no" onClick={() => rate('unknown')}>
          ✗ Nicht gewusst
        </button>
        <button type="button" className="yes" onClick={() => rate('known')}>
          ✓ Gewusst
        </button>
      </div>
      <p className="study-keys muted">Leertaste umdrehen · N nicht gewusst · J gewusst · Esc beenden</p>
    </div>
  );
}

export function StudyScreen({ deckId, onlyUnknown }: { deckId: string; onlyUnknown: boolean }) {
  const deck = useDecks().getDeck(deckId);
  const [round, setRound] = useState(0);
  if (!deck) return null;
  const retryPath = `${deckPath(deck)}/lernen?nur=offen`;

  function retry() {
    // Already on ?nur=offen the hash doesn't change, so start a fresh round via the key.
    if (onlyUnknown) setRound((r) => r + 1);
    else navigate(retryPath);
  }

  return <Round key={`${deckId}:${onlyUnknown}:${round}`} deck={deck} onlyUnknown={onlyUnknown} onRetry={retry} />;
}
