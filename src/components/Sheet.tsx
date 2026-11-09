import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import './Sheet.css';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// autoFocus inside a sheet moves focus before any effect runs, so remember the last element focused outside.
let lastFocusOutside: HTMLElement | null = null;
if (typeof document !== 'undefined') {
  document.addEventListener('focusin', (e) => {
    if (e.target instanceof HTMLElement && !e.target.closest('.sheet')) lastFocusOutside = e.target;
  });
}

/**
 * Bottom sheet over the current screen. Closes on backdrop click and Escape,
 * keeps Tab inside while open and gives focus back to the opener on close.
 */
export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose(): void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const opener = lastFocusOutside;
    // Fields with autoFocus already took focus; otherwise start on the panel itself.
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  function trapTab(e: KeyboardEvent) {
    if (e.key !== 'Tab' || !panel.current) return;
    const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;
  return (
    <div className="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} onKeyDown={trapTab}>
        <div className="sheet-grab" />
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
