import { useHashRoute } from '../router';
import './TabBar.css';

/** "Stapel" and "Fortschritt" tabs. App only renders it on tab screens. */
export function TabBar() {
  const onProgress = useHashRoute().name === 'progress';
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      <a href="#/" aria-current={onProgress ? undefined : 'page'}>▦ Stapel</a>
      <a href="#/fortschritt" aria-current={onProgress ? 'page' : undefined}>◔ Fortschritt</a>
    </nav>
  );
}
