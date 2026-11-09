// Placeholder from the scaffold, replaced by the study mode task.
export function StudyScreen({ deckId, onlyUnknown }: { deckId: string; onlyUnknown: boolean }) {
  return (
    <div className="wrap">
      <header className="top">
        <a className="icon-btn" href={`#/stapel/${encodeURIComponent(deckId)}`} aria-label="Abbrechen">✕</a>
      </header>
      <p className="muted">Hier kommt bald der Abfrage-Modus hin{onlyUnknown ? ' (nur nicht gewusste Karten)' : ''}.</p>
    </div>
  );
}
