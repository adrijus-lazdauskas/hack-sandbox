import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'decks' }
  | { name: 'deck'; deckId: string }
  | { name: 'study'; deckId: string; onlyUnknown: boolean }
  | { name: 'progress' };

/** Parses a location hash like '#/stapel/abc/lernen?nur=offen'. Unknown paths fall back to the deck list. */
export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts.length === 1 && parts[0] === 'fortschritt') return { name: 'progress' };
  if (parts[0] === 'stapel' && parts[1]) {
    if (parts.length === 2) return { name: 'deck', deckId: parts[1] };
    if (parts.length === 3 && parts[2] === 'lernen') {
      const onlyUnknown = new URLSearchParams(query).get('nur') === 'offen';
      return { name: 'study', deckId: parts[1], onlyUnknown };
    }
  }
  return { name: 'decks' };
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parseHash(hash);
}

/** navigate('/stapel/abc') sets location.hash to '#/stapel/abc'. */
export function navigate(path: string): void {
  window.location.hash = path.startsWith('/') ? path : `/${path}`;
}
