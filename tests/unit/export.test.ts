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
  fieldHtml,
  sliceSegmentsByChapterRange,
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

  it('should safely handle numeric paranum values in segments without throwing', () => {
    const numericParanumSeg = {
      id: 99,
      rend: "p",
      paranum: 1 as any,
      pali: "Dhamma",
      en: "Phenomena <sup class=\"var-note\" data-note=\"0\">[1]</sup> <b>bold</b>",
      pt: "Fenômenos"
    } as any;
    const html = segToHtml(numericParanumSeg, "pali+en");
    expect(html).toContain('<span class="paranum-badge">1.</span>');
    expect(html).toContain("<strong>bold</strong>");
    expect(html).not.toContain("var-note");
  });

  it('produces strict XHTML5 (no <div> or <aside> nested inside <p> or <h1..h4>), strips illegal XML control chars, and balances inline tags', () => {
    const segWithNotesAndCtrl = {
      id: 7,
      rend: "bodytext",
      pali: "Cittaṃ\x01\x10 <b>unclosed bold <i>italics</b>",
      pt: "Consciência\x02 pura",
      notes: ["Nota canônica 1"],
    } as any;
    const html = segToHtml(segWithNotesAndCtrl, "pali+pt", undefined, "glossary.xhtml", "sec_a1", "part_mula_s0");
    expect(html).not.toMatch(/[\x00-\x08\x0b\x0c\x0e-\x1f]/);
    expect(html).not.toMatch(/<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<div\b/);
    expect(html).not.toMatch(/<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<aside\b/);
    expect(html).toContain('<aside epub:type="footnote" id="part_mula_s0_note_7_0"');
    expect(fieldHtml("<b><i>abc</b>")).toBe("<strong><em>abc</em></strong>");

    const headingHtml = segToHtml(dummyContent[0], "pali+pt", undefined, "glossary.xhtml", "ch1");
    expect(headingHtml).not.toMatch(/<h2\b[^>]*>[\s\S]*?<div\b/);
    expect(headingHtml).toContain('<span class="line pali"');
  });

  it('guarantees EPUB 3 OCF mimetype flags=0, matching OPF/NCX UIDs, conditional fonts/glossary, and deduplicated consecutive running titles in TOC', () => {
    const dupHeadings = [
      { id: 1, rend: "title", pali: "2. Dutiyavaggo", pt: "2. Segundo Capítulo" },
      { id: 2, rend: "subhead", pali: "(11) Aññāṇakathā", pt: "(11) Debate" },
      { id: 3, rend: "title", pali: "2. Dutiyavaggo", pt: "2. Segundo Capítulo" },
      { id: 4, rend: "subhead", pali: "(12) Kaṅkhākathā", pt: "(12) Dúvida" },
    ] as any;
    const built = buildSectionBodyAndToc(dupHeadings, "pali+pt", new Map(), "part_mula", "");
    expect(built.chapters.length).toBe(1);
    expect(built.chapters[0]!.subchapters.length).toBe(2);

    // Build EPUB with empty fonts & empty glossary -> must NOT declare font/glossary in OPF manifest
    const epub = buildEpub(dupHeadings, "Kathāvatthu", "en", "", new Map(), new Uint8Array(), new Uint8Array(), "kathavatthu", "abhidhamma");
    const view = new DataView(epub.buffer, epub.byteOffset, epub.byteLength);
    expect(view.getUint16(6, true)).toBe(0); // OCF 3.2 mimetype flags === 0
    const text = new TextDecoder().decode(epub);
    expect(text).not.toContain('id="font-reg"');
    expect(text).not.toContain('id="glossary"');
    expect(text).toContain("<dc:language>en</dc:language>");
    const opfUid = text.match(/<dc:identifier id="uid">([^<]+)<\/dc:identifier>/)?.[1];
    const ncxUid = text.match(/<meta name="dtb:uid" content="([^"]+)"\/>/)?.[1];
    expect(opfUid).toBeTruthy();
    expect(ncxUid).toBe(opfUid);

    // Glossary duplicate headwordBase must produce unique IDs
    const dupGlossary = [
      { h: "dhamma", pt: "realidade", en: "reality" },
      { h: "dhamma / dhammā", pt: "realidades", en: "realities" },
    ] as any;
    const gMap = new Map<string, string>();
    const gHtml = buildGlossaryHtml(dupGlossary, "pt", gMap);
    const ids = [...gHtml.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('slices chapter ranges accurately across multi-volume ID resets and reversed selections', () => {
    const multiVolSegs = [
      { id: 1, rend: "chapter", pali: "Vol 1 Ch 1" },
      { id: 2, rend: "bodytext", pali: "V1C1 body" },
      { id: 3, rend: "chapter", pali: "Vol 1 Ch 2" },
      { id: 4, rend: "bodytext", pali: "V1C2 body" },
      // Volume 2 resets seg.id back to 1!
      { id: 1, rend: "chapter", pali: "Vol 2 Ch 1" },
      { id: 2, rend: "bodytext", pali: "V2C1 body" },
    ] as any;
    const toc = [
      { id: 1, rend: "chapter", text: "Vol 1 Ch 1" },
      { id: 3, rend: "chapter", text: "Vol 1 Ch 2" },
      { id: 1, rend: "chapter", text: "Vol 2 Ch 1" },
    ] as any;

    const onlyVol2 = sliceSegmentsByChapterRange(multiVolSegs, toc, 2, 2);
    expect(onlyVol2.map((s) => s.pali)).toEqual(["Vol 2 Ch 1", "V2C1 body"]);

    const reversed = sliceSegmentsByChapterRange(multiVolSegs, toc, 2, 1);
    expect(reversed.map((s) => s.pali)).toEqual(["Vol 1 Ch 2", "V1C2 body", "Vol 2 Ch 1", "V2C1 body"]);
  });
});


