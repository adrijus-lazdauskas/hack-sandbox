import { describe, expect, it } from 'vitest';
import { parseImport } from './import';

describe('parseImport', () => {
  it('turns valid lines into trimmed cards', () => {
    expect(parseImport('Was ist Inflation? ; Anstieg des Preisniveaus\nWofür steht EZB?;Europäische Zentralbank')).toEqual({
      cards: [
        { question: 'Was ist Inflation?', answer: 'Anstieg des Preisniveaus' },
        { question: 'Wofür steht EZB?', answer: 'Europäische Zentralbank' },
      ],
      errors: [],
    });
  });

  it('ignores empty and whitespace-only lines but keeps line numbers', () => {
    const parsed = parseImport('\nA;1\n   \n\nkaputt\n');
    expect(parsed.cards).toEqual([{ question: 'A', answer: '1' }]);
    expect(parsed.errors).toEqual([{ line: 5, text: 'kaputt' }]);
  });

  it('reports lines without a semicolon', () => {
    expect(parseImport('Nur eine Frage').errors).toEqual([{ line: 1, text: 'Nur eine Frage' }]);
  });

  it('reports lines with an empty question or answer', () => {
    const parsed = parseImport(';Antwort ohne Frage\nFrage ohne Antwort;  \n ; ');
    expect(parsed.cards).toEqual([]);
    expect(parsed.errors.map((e) => e.line)).toEqual([1, 2, 3]);
  });

  it('splits at the first semicolon so answers may contain more', () => {
    expect(parseImport('Aromatische Aminosäuren?;Phe; Tyr; Trp').cards).toEqual([
      { question: 'Aromatische Aminosäuren?', answer: 'Phe; Tyr; Trp' },
    ]);
  });

  it('handles Windows line endings', () => {
    expect(parseImport('A;1\r\nB;2\r\n').cards).toEqual([
      { question: 'A', answer: '1' },
      { question: 'B', answer: '2' },
    ]);
  });
});
