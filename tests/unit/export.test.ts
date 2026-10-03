import { describe, it, expect } from 'vitest';
import { 
  buildEpub, 
  buildPrintHtml, 
  collectUsedTerms, 
  buildGlossaryHtml, 
  linkifyText, 
  segToHtml, 
  crc32, 
  buildZip 
} from '../../src/export';

describe('Export Module', () => {
  const dummyContent = [
    { id: 1, rend: "chapter", pali: "Namo", en: "Homage", pt: "Homenagem", es: "Homenaje" },
    { id: 2, rend: "p", pali: "Cittaṃ", en: "Mind is pure", pt: "A mente é pura", es: "La mente es pura" }
  ] as any;

  const dummyGlossary = [
    { h: "Citta", pt: "Mente", en: "Mind", es: "Mente", root: "CIT", pos: "n" }
  ] as any;

  it('collectUsedTerms should find and filter words present in text', () => {
    // The word "citta" is present as "cittaṃ"
    const terms = collectUsedTerms(dummyContent, dummyGlossary);
    expect(terms.length).toBe(1);
    expect(terms[0].entry.h).toBe("Citta");
  });

  it('buildGlossaryHtml should generate anchors correctly', () => {
    const termsMap = new Map<string, string>();
    const html = buildGlossaryHtml(dummyGlossary, 'en', termsMap);
    expect(html).toContain('id="dict_');
    expect(html).toContain('Citta');
    // It should have mapped 'citta'
    expect(termsMap.get('citta')).toBeDefined();
  });

  it('linkifyText should wrap words in glossary anchors', () => {
    const termsMap = new Map<string, string>();
    termsMap.set('cittaṃ', '1234');
    const html = linkifyText('cittaṃ is pure', termsMap, '');
    expect(html).toContain('<a epub:type="glossref" href="#dict_1234">cittaṃ</a>');
  });

  it('segToHtml should correctly format paragraphs and links', () => {
    const termsMap = new Map<string, string>();
    termsMap.set('cittaṃ', '1234');
    const html = segToHtml(dummyContent[1], 'pt', termsMap, '');
    expect(html).toContain('Cittaṃ');
    expect(html).toContain('href="#dict_1234"');
    expect(html).toContain('A mente é pura');
  });

  it('crc32 should compute correct checksum', () => {
    const data = new TextEncoder().encode('hello world');
    expect(crc32(data)).toBe(0x0d4a1185);
  });

  it('buildZip should create a valid zip buffer', () => {
    const buf = buildZip([
      { name: 'test.txt', data: new TextEncoder().encode('content'), compressed: false }
    ]);
    expect(buf).toBeInstanceOf(Uint8Array);
    expect(buf.length).toBeGreaterThan(0);
  });

  it('should generate an EPUB blob', () => {
    const blob = buildEpub(dummyContent, "Test Work", "en", "", new Map(), new Uint8Array(), new Uint8Array());
    expect(blob).toBeInstanceOf(Uint8Array);
  });

  it('should generate a PDF html structure', () => {
    const html = buildPrintHtml(dummyContent, "Test Work", "en", "", new Map());
    expect(html).toContain("Test Work");
    expect(html).toContain("Homage");
  });
});
