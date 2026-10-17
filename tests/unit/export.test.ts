import { describe, it, expect } from 'vitest';
import { 
  EPUB_CSS,
  buildEpub, 
  buildSectionBodyAndToc,
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
    { id: 1, rend: "chapter", pali: "1. Cittakaṇḍaṃ", en: "1. Chapter on Consciousness", pt: "1. Capítulo da Consciência", es: "1. Capítulo de la Conciencia" },
    { id: 2, rend: "subhead", pali: "Kāmāvacarakusalacittaṃ", en: "Sensuous-Sphere Wholesome Consciousness", pt: "Consciência Saudável da Esfera Sensual", es: "Conciencia Saludable de la Esfera Sensual" },
    { id: 3, rend: "p", pali: "Cittaṃ", en: "Mind is pure", pt: "A mente é pura", es: "La mente es pura" }
  ] as any;

  const dummyGlossary = [
    { h: "Citta", pt: "Mente", en: "Mind", es: "Mente", root: "CIT", pos: "n" }
  ] as any;

  it('collectUsedTerms should find and filter words present in text', () => {
    const terms = collectUsedTerms(dummyContent, dummyGlossary);
    expect(terms.length).toBe(1);
    expect(terms[0].entry.h).toBe("Citta");
  });

  it('buildGlossaryHtml should generate anchors correctly', () => {
    const termsMap = new Map<string, string>();
    const html = buildGlossaryHtml(dummyGlossary, 'en', termsMap);
    expect(html).toContain('id="dict_');
    expect(html).toContain('Citta');
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
    const html = segToHtml(dummyContent[2], 'pt', termsMap, '');
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

  it('EPUB_CSS and PDF CSS should enforce Gentium Book Plus font at 13pt and justified layout', () => {
    expect(EPUB_CSS).toContain("font-family: 'Gentium Book Plus'");
    expect(EPUB_CSS).toContain("font-size: 13pt");
    expect(EPUB_CSS).toContain("text-align: justify");
    expect(EPUB_CSS).toContain("hyphens: auto");

    const pdfHtml = buildPrintHtml(dummyContent, "Test Work", "pt", "", new Map());
    expect(pdfHtml).toContain("font-family: 'Gentium Book Plus'");
    expect(pdfHtml).toContain("font-size: 13pt");
    expect(pdfHtml).toContain("text-align: justify");
  });

  it('should generate an EPUB 3 with nav.xhtml, toc.ncx, and chapter + subchapter anchors', () => {
    const termsMap = new Map<string, string>();
    const mulaSec = buildSectionBodyAndToc(dummyContent, "pali+pt", termsMap, "part_mula", "glossary.xhtml");
    const atthaSec = buildSectionBodyAndToc(dummyContent, "pali+pt", termsMap, "part_attha", "glossary.xhtml");

    const partSections = [
      {
        partKey: "mula",
        partTitle: "Mūla (Texto Raiz)",
        fileId: "part_mula",
        href: "part_mula.xhtml",
        chapters: mulaSec.chapters,
        bodyHtml: mulaSec.bodyHtml,
      },
      {
        partKey: "attha",
        partTitle: "Aṭṭhakathā (Comentário)",
        fileId: "part_attha",
        href: "part_attha.xhtml",
        chapters: atthaSec.chapters,
        bodyHtml: atthaSec.bodyHtml,
      }
    ];
    const epubBytes = buildEpub(
      dummyContent,
      "Dhammasaṅgaṇī",
      "pali+pt",
      "",
      termsMap,
      new Uint8Array([1, 2]),
      new Uint8Array([3, 4]),
      "dhammasangani",
      "abhidhamma",
      partSections
    );
    expect(epubBytes).toBeInstanceOf(Uint8Array);
    const decoded = new TextDecoder().decode(epubBytes);
    expect(decoded).toContain("OEBPS/nav.xhtml");
    expect(decoded).toContain("OEBPS/toc.ncx");
    expect(decoded).toContain("Mūla (Texto Raiz)");
    expect(decoded).toContain("Aṭṭhakathā (Comentário)");
    expect(decoded).toContain("1. Cittakaṇḍaṃ");
    expect(decoded).toContain("Kāmāvacarakusalacittaṃ");
    expect(decoded).toContain("part_mula_ch1");
    expect(decoded).toContain("part_mula_sub1");
  });

  it('should generate a single-work PDF html structure with functional chapter and subchapter TOC', () => {
    const html = buildPrintHtml(dummyContent, "Test Work", "en", "", new Map());
    expect(html).toContain("Test Work");
    expect(html).toContain("1. Chapter on Consciousness");
    expect(html).toContain("Sensuous-Sphere Wholesome Consciousness");
    expect(html).toContain("print-toc");
    expect(html).toContain('href="#doc_ch1"');
    expect(html).toContain('href="#doc_sub1"');
  });
});

