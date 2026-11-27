import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildEpub,
  buildEpubCss,
  buildFullCorpusEpub,
  buildFullCorpusPrintHtml,
  buildGlossaryHtml,
  buildPrintHtml,
  buildSectionBodyAndToc,
  buildZip,
  collectUsedTerms,
  crc32,
  escHtml,
  extractHeadingLabel,
  fieldHtml,
  getGroupDisplayTitle,
  getPartDisplayTitle,
  initExportPanel,
  linkifyText,
  segToHtml,
  sliceSegmentsByChapterRange,
  stripInvalidXmlChars,
  walkNode,
  type GlossEntry,
  type LangMode,
} from '../../src/export.js';
import { settings } from '../../src/state.js';
import type { Manifest, Segment } from '../../src/types.js';

const MINI_MANIFEST: Manifest = {
  groups: {
    abhidhamma: [
      {
        id: 'dhammasangani',
        title: 'Dhammasaṅgaṇī',
        parts: {
          mula: {
            label: 'Mūla',
            count: 4,
            files: ['mula__0.json'],
            toc: [
              { id: 1, rend: 'chapter', text: '1. Cittuppādakaṇḍa' },
              { id: 3, rend: 'chapter', text: '2. Rūpakaṇḍa' },
            ],
          },
          attha: {
            label: 'Aṭṭhakathā',
            count: 2,
            files: ['attha__0.json'],
            toc: [{ id: 1, rend: 'chapter', text: '1. Intro' }],
          },
        },
      },
    ],
    comentarios: [
      {
        id: 'the-buddhas-path',
        title: "The Buddha's Path",
        languages: ['en', 'pt', 'es'],
        parts: {
          texto: {
            label: 'Texto',
            count: 2,
            files: ['texto__0.json'],
            toc: [{ id: 1, rend: 'chapter', text: '1. Preface' }],
          },
        },
      },
      {
        id: 'bilingual-comm',
        title: 'Bilingual Comm',
        languages: ['en', 'pt'],
        parts: {
          texto: {
            label: 'Texto',
            count: 1,
            files: ['texto__0.json'],
            toc: [],
          },
        },
      },
    ],
    custom_group: [
      {
        id: 'extra-work',
        title: 'Extra Treatise',
        parts: {
          custom_part: {
            label: 'Custom Part',
            count: 1,
            files: ['extra__0.json'],
            toc: [],
          },
        },
      },
    ],
  },
};

const SAMPLE_SEGS: Segment[] = [
  { id: 1, rend: 'book', pali: 'Dhammasaṅgaṇī', en: 'Compendium of States', pt: 'Compêndio dos Estados', es: 'Compendio de Estados' },
  { id: 2, rend: 'subhead', pali: 'Kusalattika', en: 'Wholesome Triad', pt: 'Tríade Benéfica', es: 'Tríada Hábil' },
  { id: 3, rend: 'chapter', pali: 'Cittuppādakaṇḍa', en: 'Genesis of Citta', pt: 'Gênese do Citta', es: 'Génesis de Citta' },
  { id: 4, rend: 'subsubhead', pali: 'Kāmāvacara', en: 'Sense Sphere', pt: 'Esfera Sensual', es: 'Esfera Sensorial' },
  { id: 5, rend: 'hangnum', paranum: '1', pali: '1.', en: '1.', pt: '1.', es: '1.' },
  {
    id: 6,
    rend: 'bodytext',
    paranum: '2',
    pali: 'Kusalā dhammā <b>citta</b> <i>dhamma</i>',
    en: 'Wholesome states of citta and dhamma',
    pt: 'Estados benéficos de citta e dhamma',
    es: 'Estados hábiles de citta y dhamma',
    notes: ['sī. kusalā'],
  },
  { id: 7, rend: 'indent', pali: 'Indent line', en: 'Indent EN', pt: 'Recuo PT', es: 'Sangría ES' },
  { id: 8, rend: 'footnote', pali: 'Footnote', en: 'Footnote EN', pt: 'Nota PT', es: 'Nota ES' },
  { id: 9, rend: 'centre', pali: 'Centre', en: 'Centre EN', pt: 'Centro PT', es: 'Centro ES' },
  { id: 10, rend: 'glossary', pali: 'Glossary', en: 'Glossary EN', pt: 'Glossário PT', es: 'Glosario ES' },
  { id: 11, rend: 'gatha1', pali: 'Gāthā line', en: 'Verse EN', pt: 'Verso PT', es: 'Verso ES' },
];

const SAMPLE_GLOSSARY: GlossEntry[] = [
  { h: 'citta / ceto', pos: 'nt.', en: 'consciousness', pt: 'consciência', es: 'conciencia' },
  { h: 'citta', pos: 'nt.', en: 'mind', pt: 'mente', es: 'mente' },
  { h: 'dhamma', pos: 'm.', en: 'phenomenon', pt: 'fenômeno', es: 'fenómeno' },
  { h: 'mano', pos: 'm.', en: 'mind', pt: 'mente', es: 'mente' },
  { h: 'unused_term', en: 'unused', pt: 'não usado' },
];

describe('src/export.ts comprehensive unit coverage', () => {
  const origFetch = globalThis.fetch;
  const origOpen = window.open;
  const origCreateUrl = URL.createObjectURL;
  const origRevokeUrl = URL.revokeObjectURL;

  beforeEach(() => {
    document.body.innerHTML = '';
    URL.createObjectURL = vi.fn(() => 'blob:mock-export');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    window.open = origOpen;
    URL.createObjectURL = origCreateUrl;
    URL.revokeObjectURL = origRevokeUrl;
  });

  it('covers helpers: walkNode, fieldHtml, linkifyText, segToHtml, glossary, headings, TOC, ZIP, and slicing', () => {
    expect(stripInvalidXmlChars('a\u0000b\uFFFDc')).toBe('abc');
    expect(escHtml('<a&"b>')).toBe('&lt;a&amp;&quot;b&gt;');
    expect(crc32(new TextEncoder().encode('hello'))).toBeGreaterThan(0);

    // buildZip with ASCII and non-ASCII UTF-8 filenames
    const zip = buildZip([
      { name: 'mimetype', data: new TextEncoder().encode('application/epub+zip') },
      { name: 'OEBPS/pāḷi.xhtml', data: new TextEncoder().encode('<html/>') },
    ]);
    expect(zip.length).toBeGreaterThan(50);

    // walkNode across element types & comment node
    const div = document.createElement('div');
    div.innerHTML =
      'citta <b>bold</b> <i>ital</i> <sup>1</sup><sup></sup> <sup class="var-note">skip</sup> <br><p rend="gatha">verse</p><span>plain</span><!--comment-->';
    const termsMap = new Map<string, string>([['citta', '0'], ['dhamma', '1']]);
    const walked = walkNode(div, termsMap, 'glossary.xhtml', false);
    expect(walked).toContain('<strong>bold</strong>');
    expect(walked).toContain('<em>ital</em>');
    expect(walked).toContain('<sup>1</sup>');
    expect(walked).toContain('<br/>');
    expect(walked).toContain('class="rend-gatha"');
    expect(walked).not.toContain('skip');

    // fieldHtml stack-balanced sanitizer (unclosed tags, mismatched closing, <p rend>)
    const sanitized = fieldHtml(
      '<b>unclosed <i>nested</b> <sup class="var-note">drop</sup><p rend="indent">indented</p><sup>2</sup><br>plain',
      termsMap,
      'glossary.xhtml',
      true
    );
    expect(sanitized).toContain('<strong>');
    expect(sanitized).toContain('</strong>');
    expect(sanitized).not.toContain('drop');
    expect(linkifyText('', termsMap)).toBe('');
    expect(linkifyText('citta mano dhamma', termsMap, 'g.xhtml', true)).toContain('glossref');

    // collectUsedTerms & buildGlossaryHtml across lang modes & duplicate headwords
    const usedCanon = collectUsedTerms(SAMPLE_SEGS, SAMPLE_GLOSSARY, false);
    const usedComm = collectUsedTerms(SAMPLE_SEGS, SAMPLE_GLOSSARY, true);
    expect(usedCanon.length).toBeGreaterThan(0);
    expect(usedComm.length).toBeGreaterThan(0);
    expect(buildGlossaryHtml([], 'pt', new Map())).toBe('');
    for (const lm of ['en', 'pt', 'es', 'pali+en+pt', 'pali+en+es'] as LangMode[]) {
      const m = new Map<string, string>([['citta', '0']]);
      const gHtml = buildGlossaryHtml(usedCanon, lm, m);
      expect(gHtml).toContain('glossary-entry');
    }

    // segToHtml across all rends and lang modes
    const modes: LangMode[] = ['en', 'pali+en', 'pali+en+pt', 'pt', 'pali+pt', 'es', 'pali+es', 'pali+en+es'];
    for (const seg of SAMPLE_SEGS) {
      for (const m of modes) {
        const html = segToHtml(seg, m, termsMap, 'glossary.xhtml', `a_${seg.id}`, 'np', false);
        expect(html.length).toBeGreaterThan(0);
      }
    }
    expect(segToHtml({ id: 99, rend: 'bodytext' } as Segment, 'pt')).toBe('');

    // extractHeadingLabel long truncation & all lang modes
    const longSeg: Segment = {
      id: 100,
      rend: 'chapter',
      pali: 'A'.repeat(130),
      en: 'B'.repeat(130),
      pt: 'C'.repeat(130),
      es: 'D'.repeat(130),
    };
    for (const m of modes) {
      const lbl = extractHeadingLabel(longSeg, m);
      expect(lbl.length).toBeLessThanOrEqual(120);
      expect(lbl.endsWith('…')).toBe(true);
    }

    // buildSectionBodyAndToc: implicit opening section + duplicate running title skipped
    const tocTestSegs: Segment[] = [
      { id: 1, rend: 'subhead', pali: 'Opening Subhead', pt: 'Subtítulo' },
      { id: 2, rend: 'title', pali: 'Running Title', pt: 'Título' },
      { id: 3, rend: 'title', pali: 'Running Title', pt: 'Título' },
      { id: 4, rend: 'subsubhead', pali: 'Nested Sub', pt: 'Sub-sub' },
    ];
    const built = buildSectionBodyAndToc(tocTestSegs, 'pali+pt', termsMap, 'p1', 'glossary.xhtml');
    expect(built.chapters.length).toBe(2);
    expect(built.chapters[1]?.subchapters.length).toBe(1);

    // sliceSegmentsByChapterRange edge cases (reversed from>to, id-only fallback, null range)
    const chToc = [
      { id: 1, rend: 'chapter', text: 'Ch1' },
      { id: 3, rend: 'chapter', text: 'Ch2' },
    ];
    expect(sliceSegmentsByChapterRange(SAMPLE_SEGS, chToc, null, null).length).toBe(SAMPLE_SEGS.length);
    expect(sliceSegmentsByChapterRange(SAMPLE_SEGS, chToc, 1, 0).length).toBeGreaterThan(0);
    expect(sliceSegmentsByChapterRange([], chToc, 0, 1)).toEqual([]);

    // Display titles & CSS
    expect(getGroupDisplayTitle('abhidhamma', 'en')).toContain('Abhidhamma');
    expect(getGroupDisplayTitle('custom_unknown', 'es')).toBeTruthy();
    expect(getPartDisplayTitle('mula', 'Mula', 'pt')).toContain('Mūla');
    expect(getPartDisplayTitle('unknown_part', 'Fallback', 'en')).toBeTruthy();
    expect(buildEpubCss(true, true)).toContain('@font-face');
    expect(buildEpubCss(false, false)).not.toContain('GentiumBookPlus-Regular.ttf');
  });

  it('builds full corpus PDF & EPUB and drives initExportPanel UI (single work, full corpus, popup fallback, error handling)', async () => {
    const fakeTtf = new Uint8Array([0x00, 0x01, 0x00, 0x00, 0x00, 0x0f]);
    globalThis.fetch = vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url);
      if (u.includes('common_pali.json')) {
        return new Response(JSON.stringify({ entries: SAMPLE_GLOSSARY }), { status: 200 });
      }
      if (u.includes('.ttf')) {
        return new Response(fakeTtf, { status: 200 });
      }
      if (u.includes('data/works/')) {
        return new Response(JSON.stringify(SAMPLE_SEGS), { status: 200 });
      }
      return new Response('not found', { status: 404 });
    }) as any;

    const progressMsgs: string[] = [];
    const fullPrintEn = await buildFullCorpusPrintHtml(MINI_MANIFEST, 'en', (m) => progressMsgs.push(m));
    expect(fullPrintEn).toContain('Abhidhamma Piṭaka');
    expect(progressMsgs.length).toBeGreaterThan(0);

    const fullEpubEs = await buildFullCorpusEpub(MINI_MANIFEST, 'pali+es', (m) => progressMsgs.push(m));
    expect(fullEpubEs.length).toBeGreaterThan(200);

    // Single-work buildPrintHtml & buildEpub directly
    const singlePrint = buildPrintHtml(SAMPLE_SEGS, 'Test Work', 'pali+en+pt', '', new Map(), 'dhammasangani', 'abhidhamma');
    expect(singlePrint).toContain('Test Work');
    const singleEpub = buildEpub(SAMPLE_SEGS, 'Test Work', 'pali+pt', '', new Map(), fakeTtf, fakeTtf, 'dhammasangani', 'abhidhamma');
    expect(singleEpub.length).toBeGreaterThan(200);

    // Mount initExportPanel and test UI flows
    const container = document.createElement('div');
    document.body.appendChild(container);
    settings.commentaryMode = 'en+es';
    initExportPanel({ groups: { comentarios: MINI_MANIFEST.groups.comentarios } } as any, container, () => 'the-buddhas-path');
    container.innerHTML = '';
    initExportPanel(MINI_MANIFEST, container, () => 'the-buddhas-path');

    const workSel = container.querySelector<HTMLSelectElement>('#export-work')!;
    const pdfBtn = container.querySelector<HTMLButtonElement>('#export-btn-pdf')!;
    const epubBtn = container.querySelector<HTMLButtonElement>('#export-btn-epub')!;

    // Mock window.open returning a printable window
    const fakeWin = { closed: false };
    window.open = vi.fn(() => fakeWin as any);
    const origAlert = window.alert;
    window.alert = vi.fn();

    // 1. Export trilingual commentary as PDF and EPUB
    pdfBtn.click();
    await new Promise((r) => setTimeout(r, 80));
    expect(window.open).toHaveBeenCalled();

    epubBtn.click();
    await new Promise((r) => setTimeout(r, 80));
    expect(URL.createObjectURL).toHaveBeenCalled();

    // 2. Switch to bilingual commentary & canonical work with chapter range
    workSel.value = 'bilingual-comm';
    workSel.dispatchEvent(new Event('change'));
    workSel.value = 'dhammasangani';
    workSel.dispatchEvent(new Event('change'));

    // Uncheck all parts -> shows select part message
    const partCbs = container.querySelectorAll<HTMLInputElement>('#export-parts input[type=checkbox]');
    partCbs.forEach((cb) => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change'));
    });
    pdfBtn.click();
    await new Promise((r) => setTimeout(r, 20));

    // Check only 1 part -> chapter range visible -> select range 0..1 -> export PDF with popup blocked fallback
    partCbs[0]!.checked = true;
    partCbs[0]!.dispatchEvent(new Event('change'));
    const fromSel = container.querySelector<HTMLSelectElement>('#export-from')!;
    const toSel = container.querySelector<HTMLSelectElement>('#export-to')!;
    fromSel.value = '0';
    toSel.value = '1';
    window.open = vi.fn(() => null); // popup blocked -> fallback downloadBlob
    pdfBtn.click();
    await new Promise((r) => setTimeout(r, 80));

    // 3. Switch to all_works and export both EPUB and PDF
    workSel.value = 'all_works';
    workSel.dispatchEvent(new Event('change'));
    epubBtn.click();
    await new Promise((r) => setTimeout(r, 120));
    pdfBtn.click();
    await new Promise((r) => setTimeout(r, 120));

    // 4. Error paths for single work and full corpus
    globalThis.fetch = vi.fn(async () => new Response('boom', { status: 500 })) as any;
    workSel.value = 'dhammasangani';
    workSel.dispatchEvent(new Event('change'));
    epubBtn.click();
    await new Promise((r) => setTimeout(r, 50));
  });
});
