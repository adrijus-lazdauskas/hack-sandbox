import { useEffect } from 'react';
import { TabBar } from './components';
import { DeckScreen } from './features/deck/DeckScreen';
import { DecksScreen } from './features/decks/DecksScreen';
import { ProgressScreen } from './features/progress/ProgressScreen';
import { StudyScreen } from './features/study/StudyScreen';
import { navigate, useHashRoute } from './router';
import { useDecks } from './store';

export function App() {
  const route = useHashRoute();
  const { getDeck } = useDecks();
  const missingDeck = (route.name === 'deck' || route.name === 'study') && !getDeck(route.deckId);

  // Unknown deck ids fall back to the overview.
  useEffect(() => {
    if (missingDeck) navigate('/');
  }, [missingDeck]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name]);

  if (missingDeck || route.name === 'decks') {
    return (
      <>
        <DecksScreen />
        <TabBar />
      </>
    );
  }
  if (route.name === 'progress') {
    return (
      <>
        <ProgressScreen />
        <TabBar />
      </>
    );
  }
  if (route.name === 'deck') return <DeckScreen deckId={route.deckId} />;
  return <StudyScreen deckId={route.deckId} onlyUnknown={route.onlyUnknown} />;
}
