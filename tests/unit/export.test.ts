import { describe, it, expect } from 'vitest';
import { buildEpub, buildPrintHtml } from '../../src/export';

describe('Export Module', () => {
  const dummyContent = [
    { id: 1, rend: "chapter", pali: "Namo", en: "Homage" },
    { id: 2, rend: "p", pali: "Citta", en: "Mind" }
  ] as any;

  it('should generate an EPUB blob', () => {
    const blob = buildEpub(dummyContent, "Test Work", "en", "");
    expect(blob).toBeInstanceOf(Uint8Array);
  });

  it('should generate a PDF html structure', () => {
    const html = buildPrintHtml(dummyContent, "Test Work", "en", "");
    expect(html).toContain("Test Work");
    expect(html).toContain("Homage");
  });
});
