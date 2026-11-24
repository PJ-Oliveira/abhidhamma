import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { 
  EPUB_CSS,
  buildEpubCss,
  buildEpub, 
  buildFullCorpusEpub,
  buildSectionBodyAndToc,
  buildPrintHtml, 
  collectUsedTerms, 
  buildGlossaryHtml, 
  getGroupDisplayTitle,
  getPartDisplayTitle,
  linkifyText, 
  segToHtml, 
  fieldHtml,
  stripInvalidXmlChars,
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

  it('ships only valid TrueType fonts with full Pāli/PT/ES diacritic glyph coverage and emits clean @font-face rules', () => {
    const fontsDir = path.resolve(__dirname, '../../fonts');
    const ttfFiles = fs.readdirSync(fontsDir).filter((f) => f.endsWith('.ttf'));
    expect(ttfFiles).toContain('GentiumBookPlus-Regular.ttf');
    expect(ttfFiles).toContain('GentiumBookPlus-Italic.ttf');

    const parseTtfCmap = (buf: Buffer): Set<number> => {
      const cps = new Set<number>();
      const numTables = buf.readUInt16BE(4);
      let cmapOff = -1;
      for (let i = 0; i < numTables; i++) {
        const off = 12 + i * 16;
        if (buf.subarray(off, off + 4).toString('ascii') === 'cmap') {
          cmapOff = buf.readUInt32BE(off + 8);
          break;
        }
      }
      if (cmapOff < 0) return cps;
      const numSub = buf.readUInt16BE(cmapOff + 2);
      for (let i = 0; i < numSub; i++) {
        const sub = cmapOff + buf.readUInt32BE(cmapOff + 4 + i * 8 + 4);
        const fmt = buf.readUInt16BE(sub);
        if (fmt === 4) {
          const segCountX2 = buf.readUInt16BE(sub + 6);
          const segCount = segCountX2 / 2;
          for (let s = 0; s < segCount; s++) {
            const endCode = buf.readUInt16BE(sub + 14 + s * 2);
            const startCode = buf.readUInt16BE(sub + 16 + segCountX2 + s * 2);
            const idDelta = buf.readInt16BE(sub + 16 + 2 * segCountX2 + s * 2);
            const idRangeOff = buf.readUInt16BE(sub + 16 + 3 * segCountX2 + s * 2);
            if (startCode === 0xffff && endCode === 0xffff) continue;
            for (let cp = startCode; cp <= endCode; cp++) {
              let gid = 0;
              if (idRangeOff === 0) {
                gid = (cp + idDelta) & 0xffff;
              } else {
                const roPos = sub + 16 + 3 * segCountX2 + s * 2;
                const gPos = roPos + idRangeOff + (cp - startCode) * 2;
                gid = buf.readUInt16BE(gPos);
                if (gid !== 0) gid = (gid + idDelta) & 0xffff;
              }
              if (gid !== 0) cps.add(cp);
            }
          }
        }
      }
      return cps;
    };

    const requiredChars = 'āīūṅñṭḍṇḷṃṁĀĪŪṄÑṬḌṆḶṂṀáéíóúâêôãõçü¿¡—–…↑↔→‘’“”';
    for (const file of ttfFiles) {
      const buf = fs.readFileSync(path.join(fontsDir, file));
      // Must have genuine TrueType sfnt magic (0x00010000), never HTML!
      expect(buf.readUInt32BE(0)).toBe(0x00010000);
      const cmap = parseTtfCmap(buf);
      for (const ch of requiredChars) {
        expect(cmap.has(ch.codePointAt(0)!), `Missing glyph ${ch} in ${file}`).toBe(true);
      }
    }

    const pdfHtml = buildPrintHtml(dummyContent, "Pāli Diacritics Test", "pt", "", new Map());
    expect(pdfHtml).not.toContain('NotoSerifPali');
    expect(pdfHtml).toContain('GentiumBookPlus-Regular.ttf');
    expect(pdfHtml).toContain('a[href*="#dict_"]');

    // When fonts are omitted, buildEpubCss & buildEpub must not emit dangling @font-face rules
    expect(buildEpubCss(false, false)).not.toContain('@font-face');
    expect(buildEpubCss(true, false)).toContain('GentiumBookPlus-Regular.ttf');
    expect(buildEpubCss(true, false)).not.toContain('GentiumBookPlus-Italic.ttf');
    const epubNoFonts = new TextDecoder().decode(
      buildEpub(dummyContent, "No Fonts", "pt", "", new Map(), new Uint8Array(), new Uint8Array())
    );
    expect(epubNoFonts).not.toContain('@font-face');
  });

  it('localizes group/part titles in PT/EN/ES, strips C1 controls, handles short English commentary headings, glossary ES fallback, and avoids blank PDF separator pages', async () => {
    // 1. Group & part titles localized across PT / EN / ES without Portuguese leaks in EN/ES
    expect(getGroupDisplayTitle('abhidhamma', 'es')).toContain('Textos Canónicos');
    expect(getGroupDisplayTitle('abhidhamma', 'en')).toContain('Canonical Texts');
    expect(getGroupDisplayTitle('visuddhimagga', 'es')).toContain('El Camino de la Purificación');
    expect(getPartDisplayTitle('mula', undefined, 'es')).toBe('Mūla (Texto Raíz)');
    expect(getPartDisplayTitle('mula', undefined, 'en')).toBe('Mūla (Root Text)');
    expect(getPartDisplayTitle('attha', undefined, 'es')).toBe('Aṭṭhakathā (Comentario)');

    const esEpubText = new TextDecoder().decode(
      buildEpub(dummyContent, 'Dhammasaṅgaṇī', 'pali+es', '', new Map(), new Uint8Array(), new Uint8Array(), 'dhammasangani', 'abhidhamma')
    );
    expect(esEpubText).toContain('<dc:language>es</dc:language>');
    expect(esEpubText).toContain('Textos Canónicos');
    expect(esEpubText).not.toContain('Textos Canônicos');
    expect(esEpubText).toContain('Índice Analítico');

    const enEpubText = new TextDecoder().decode(
      buildEpub(dummyContent, 'Dhammasaṅgaṇī', 'pali+en', '', new Map(), new Uint8Array(), new Uint8Array(), 'dhammasangani', 'abhidhamma')
    );
    expect(enEpubText).toContain('<dc:language>en</dc:language>');
    expect(enEpubText).toContain('Canonical Texts');
    expect(enEpubText).not.toContain('Textos Canônicos');

    // 2. C1 controls and replacement character U+FFFD stripped
    expect(stripInvalidXmlChars('Dhamma\x81\x92\x93\uFFFD ok')).toBe('Dhamma ok');

    // 3. Short English commentary heading without 'the/and/is/of/to' gets lang="en" when isCommentary=true
    const shortHeading = { id: 1, rend: 'chapter', pali: 'Preface', pt: 'Prefácio', es: 'Prefacio' } as any;
    const commHtml = segToHtml(shortHeading, 'pali+es', undefined, '', 'ch1', '', true);
    expect(commHtml).toContain('lang="en"');
    expect(commHtml).not.toContain('lang="pi"');

    // 4. Glossary in ES falls back cleanly to EN if term.es is missing
    const noEsGloss = [{ h: 'citta', pos: 'n.', en: 'consciousness', pt: 'consciência' }] as any;
    const gEs = buildGlossaryHtml(noEsGloss, 'es', new Map());
    expect(gEs).toContain('consciousness');

    // 5. PDF CSS avoids blank separator pages between consecutive banners
    const pdfHtml = buildPrintHtml(dummyContent, 'Test', 'es', '', new Map());
    expect(pdfHtml).toContain('.group-banner + .work-banner');
    expect(pdfHtml).toContain('.work-banner + .part-section .part-banner');
    expect(pdfHtml).toContain('<html lang="es">');

    // 6. Full-corpus EPUB with empty manifest produces non-empty valid <ol> in nav.xhtml
    const emptyCorpusBytes = await buildFullCorpusEpub({ groups: {} } as any, 'es', () => {});
    const emptyCorpusText = new TextDecoder().decode(emptyCorpusBytes);
    expect(emptyCorpusText).toContain('<dc:language>es</dc:language>');
    expect(emptyCorpusText).toContain('<li><a href="nav.xhtml">Índice</a></li>');
  });

  it('embeds self-contained base64 Gentium Book Plus TTF fonts in PDF print HTML when provided', () => {
    const htmlWithEmbedded = buildPrintHtml(
      dummyContent,
      'Dhammasaṅgaṇī',
      'pali+es',
      '',
      new Map(),
      'dhammasangani',
      'abhidhamma',
      undefined,
      {
        regDataUri: 'data:font/ttf;base64,AAEAAA==',
        itaDataUri: 'data:font/ttf;base64,AAEAAB==',
      }
    );
    expect(htmlWithEmbedded).toContain("src: url('data:font/ttf;base64,AAEAAA==') format('truetype');");
    expect(htmlWithEmbedded).toContain("src: url('data:font/ttf;base64,AAEAAB==') format('truetype');");
    expect(htmlWithEmbedded).not.toContain('fonts/GentiumBookPlus-Regular.ttf');
    expect(htmlWithEmbedded).not.toContain('fonts/GentiumBookPlus-Italic.ttf');

    // Without embeddedFonts, falls back gracefully to URL paths
    const htmlFallback = buildPrintHtml(dummyContent, 'Dhammasaṅgaṇī', 'pali+pt', '', new Map());
    expect(htmlFallback).toContain('fonts/GentiumBookPlus-Regular.ttf');
    expect(htmlFallback).toContain('fonts/GentiumBookPlus-Italic.ttf');
  });

  it('prevents false-positive Pāli glossary hyperlinks on PT/ES/EN stopwords while preserving genuine Pāli term links in translations', () => {
    const termsMap = new Map<string, string>([
      ['no', '1'],
      ['na', '2'],
      ['ka', '3'],
      ['yo', '4'],
      ['mano', '5'],
      ['tato', '6'],
      ['dhamma', '7'],
      ['nibbāna', '8'],
      ['bhikkhu', '9'],
    ]);
    const seg = {
      id: 1,
      rend: 'bodytext',
      pali: 'No ca kho bhikkhu nibbānaṃ.',
      es: '(Ka) Oír y ver no ocurren en la mano del bhikkhu, yo estudio dhamma y nibbāna.',
      pt: 'O tato na mente não nega dhamma nem nibbāna.',
    } as any;

    const htmlEs = segToHtml(seg, 'pali+es', termsMap, '');
    // Translation must NOT link Spanish stopwords (no, ka, yo, mano)
    expect(htmlEs).not.toContain('href="#dict_1">no</a>');
    expect(htmlEs).not.toContain('href="#dict_3">Ka</a>');
    expect(htmlEs).not.toContain('href="#dict_4">yo</a>');
    expect(htmlEs).not.toContain('href="#dict_5">mano</a>');
    // Translation MUST still link genuine Pāli technical terms
    expect(htmlEs).toContain('href="#dict_7">dhamma</a>');
    expect(htmlEs).toContain('href="#dict_8">nibbāna</a>');
    expect(htmlEs).toContain('href="#dict_9">bhikkhu</a>');

    const htmlPt = segToHtml(seg, 'pali+pt', termsMap, '');
    expect(htmlPt).not.toContain('href="#dict_2">na</a>');
    expect(htmlPt).not.toContain('href="#dict_6">tato</a>');
    expect(htmlPt).toContain('href="#dict_7">dhamma</a>');
  });
});


