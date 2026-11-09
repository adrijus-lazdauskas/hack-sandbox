import type { ParsedImport } from '../types';

/**
 * One card per line as `Frage;Antwort`, split at the first `;` (so answers may contain `;`).
 * Empty lines are ignored; lines without `;` or with an empty side are reported with their 1-based number.
 */
export function parseImport(text: string): ParsedImport {
  const result: ParsedImport = { cards: [], errors: [] };
  text.split(/\r?\n/).forEach((raw, i) => {
    if (!raw.trim()) return;
    const at = raw.indexOf(';');
    const question = at < 0 ? '' : raw.slice(0, at).trim();
    const answer = at < 0 ? '' : raw.slice(at + 1).trim();
    if (question && answer) result.cards.push({ question, answer });
    else result.errors.push({ line: i + 1, text: raw });
  });
  return result;
}
