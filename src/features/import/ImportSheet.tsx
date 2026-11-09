import { Sheet } from '../../components';

// Placeholder from the scaffold, replaced by the import task.
export function ImportSheet({ open, onClose }: { deckId: string; open: boolean; onClose(): void }) {
  return (
    <Sheet open={open} title="Text importieren" onClose={onClose}>
      <p className="muted">Hier kommt bald der Import hin.</p>
    </Sheet>
  );
}
