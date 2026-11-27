import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');

const MINI_MANIFEST = {
  groups: {
    abhidhamma: [
      {
        id: 'dhammasangani',
        title: 'Dhammasaṅgaṇī',
        parts: {
          mula: {
            label: 'Mūla',
            count: 20,
            files: ['mula__0.json', 'mula__1.json'],
            toc: [
              { id: 1, rend: 'chapter', text: '1. Cittuppādakaṇḍa' },
              { id: 12, rend: 'chapter', text: '2. Rūpakaṇḍa' },
            ],
          },
          attha: {
            label: 'Aṭṭhakathā',
            count: 5,
            chunkStarts: [1],
            files: ['attha__0.json'],
            toc: [{ id: 1, rend: 'chapter', text: '1. Nidānakathā' }],
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
            count: 4,
            files: ['texto__0.json'],
            toc: [
              { id: 1, rend: 'chapter', text: '1. Preface', pt: 'Prefácio', es: 'Prefacio', chunk: 0 },
              { id: 3, rend: 'chapter', text: '2. Chapter Two', pt: 'Capítulo Dois', es: 'Capítulo Dos', chunk: 0 },
            ],
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
            count: 2,
            files: ['texto__0.json'],
            toc: [{ id: 1, rend: 'chapter', text: '1. Intro', pt: 'Introdução', chunk: 0 }],
          },
        },
      },
    ],
  },
};

const MULA_CHUNK_0 = [
  { id: 1, rend: 'chapter', pali: 'Cittuppādakaṇḍa', en: 'Genesis of Consciousness', pt: 'Gênese da Consciência', es: 'Génesis' },
  {
    id: 2,
    rend: 'bodytext',
    paranum: '1',
    pali: 'Kusalā dhammā <sup class="var-note" data-note="0">1</sup>',
    en: 'Wholesome states',
    pt: 'Estados benéficos',
    es: 'Estados benéficos',
    notes: ['sī. kusalā'],
  },
];

const MULA_CHUNK_1 = [
  { id: 12, rend: 'chapter', pali: 'Rūpakaṇḍa', en: 'Materiality', pt: 'Materialidade', es: 'Materialidad' },
];

const COMM_CHUNK = [
  { id: 1, rend: 'chapter', pali: '1. Preface', en: '1. Preface', pt: '1. Prefácio', es: '1. Prefacio' },
  { id: 2, rend: 'bodytext', pali: 'Dhamma is real.', en: 'Dhamma is real.', pt: 'O Dhamma é real.', es: 'El Dhamma es real.' },
  { id: 3, rend: 'chapter', pali: '2. Chapter Two', en: '2. Chapter Two', pt: '2. Capítulo Dois', es: '2. Capítulo Dos' },
];

describe('src/app.ts full interactive coverage', () => {
  const origFetch = globalThis.fetch;
  const origCaches = (globalThis as any).caches;
  const origSw = (navigator as any).serviceWorker;

  function setupDom() {
    document.documentElement.innerHTML = indexHtml;
    localStorage.clear();
    localStorage.setItem('panelW', '260');
    Element.prototype.scrollIntoView = vi.fn();
  }

  beforeEach(() => {
    vi.resetModules();
    setupDom();
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    if (origCaches === undefined) delete (globalThis as any).caches;
    else (globalThis as any).caches = origCaches;
    if (origSw === undefined) delete (navigator as any).serviceWorker;
    else Object.defineProperty(navigator, 'serviceWorker', { value: origSw, configurable: true, writable: true });
    window.location.hash = '';
  });

  it('exercises SW cleanup, work selection, chunk nav, chapter nav clamping, note tooltip clamping, commentary checkboxes, panel resizer, PWA install & offline cache, routing, and debate modal', async () => {
    const deletedCaches: string[] = [];
    const storedUrls = new Set<string>();
    (globalThis as any).caches = {
      keys: async () => ['old-cache-v1', 'abhidhamma-cache-v34', 'abhidhamma-anki-vault-v1'],
      delete: async (k: string) => {
        deletedCaches.push(k);
        return true;
      },
      open: async () => ({
        match: async (u: string) => (storedUrls.has(u) ? new Response('ok') : undefined),
        put: async (u: string) => {
          storedUrls.add(u);
        },
      }),
      match: async () => undefined,
    };

    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn(async () => ({ update: vi.fn(async () => {}) })),
      },
      configurable: true,
      writable: true,
    });

    globalThis.fetch = vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url);
      if (u.endsWith('data/manifest.json')) return new Response(JSON.stringify(MINI_MANIFEST), { status: 200 });
      if (u.includes('data/search/manifest.json')) return new Response(JSON.stringify({ shards: { c: 'shard_c.json' } }), { status: 200 });
      if (u.includes('shard_c.json')) {
        return new Response(
          JSON.stringify({
            postings: { citta: [0] },
            segments: [{ workId: 'dhammasangani', partKey: 'mula', chunk: 0, segId: 1, snippet: 'citta' }],
          }),
          { status: 200 }
        );
      }
      if (u.includes('dhammasangani/mula__0.json')) return new Response(JSON.stringify(MULA_CHUNK_0), { status: 200 });
      if (u.includes('dhammasangani/mula__1.json')) return new Response(JSON.stringify(MULA_CHUNK_1), { status: 200 });
      if (u.includes('dhammasangani/attha__0.json')) return new Response('fail', { status: 500 });
      if (u.includes('texto__0.json')) return new Response(JSON.stringify(COMM_CHUNK), { status: 200 });
      if (u.includes('abhidhamma_cards.json')) return new Response(JSON.stringify({ version: 1, chapters: [], cards: [] }), { status: 200 });
      if (u.includes('vocabulary.json')) return new Response(JSON.stringify({ cards: [] }), { status: 200 });
      if (u.includes('pali_core.json') || u.includes('common_pali.json')) return new Response(JSON.stringify({ entries: [] }), { status: 200 });
      return new Response('ok', { status: 200 });
    }) as any;

    window.location.hash = '#/tipitaka/dhammasangani/mula/0?seg=2';
    await import('../../src/app.js');
    await new Promise((r) => setTimeout(r, 60));

    expect(deletedCaches).toContain('old-cache-v1');
    expect(document.getElementById('breadcrumb')?.textContent).toContain('Dhammasaṅgaṇī');

    // Note hover tooltip clamping near right/bottom viewport edge & mouseleave hide
    const varNote = document.querySelector<HTMLElement>('.var-note');
    if (varNote) {
      varNote.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX: window.innerWidth - 5, clientY: window.innerHeight - 5 }));
      expect(document.getElementById('note-tooltip')?.classList.contains('hidden')).toBe(false);
      varNote.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      expect(document.getElementById('note-tooltip')?.classList.contains('hidden')).toBe(true);
    }

    // Bookmark toggle & click bookmark item
    const bmBtn = document.querySelector<HTMLButtonElement>('.bookmark-toggle');
    bmBtn?.click();
    const bmItem = document.querySelector<HTMLElement>('#bookmark-list .side-item');
    bmItem?.click();
    await new Promise((r) => setTimeout(r, 30));

    // Search panel query & result click (covers search result callback on line 1231)
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.value = 'citta';
    searchInput.dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 300));
    document.querySelector<HTMLElement>('#search-results .side-item')?.click();
    await new Promise((r) => setTimeout(r, 30));

    // Chapter nav open & clampChapterNavList (left overflow & right overflow)
    const chapBtn = document.querySelector<HTMLButtonElement>('.chapter-nav-btn')!;
    const chapList = document.querySelector<HTMLElement>('.chapter-nav-list')!;
    chapList.getBoundingClientRect = () =>
      ({ left: -20, right: 200, top: 100, bottom: 500, width: 220, height: 400 } as DOMRect);
    chapBtn.click();
    expect(chapList.style.transform).toContain('translateX');
    expect(chapList.style.maxHeight).toContain('px');
    // Close & re-open with right overflow
    document.body.click();
    chapList.getBoundingClientRect = () =>
      ({ left: window.innerWidth - 100, right: window.innerWidth + 120, top: 100, bottom: 500, width: 220, height: 400 } as DOMRect);
    chapBtn.click();
    expect(chapList.style.transform).toContain('translateX');
    // Click chapter item #2 (loads chunk 1 via segIdToChunk count fallback)
    chapList.querySelectorAll('li')[1]?.click();
    await new Promise((r) => setTimeout(r, 30));
    expect(document.getElementById('chunk-indicator')?.textContent).toBe('2 / 2');

    // Prev / Next chunk buttons
    document.getElementById('prev-chunk')?.click();
    await new Promise((r) => setTimeout(r, 30));
    expect(document.getElementById('chunk-indicator')?.textContent).toBe('1 / 2');
    document.getElementById('next-chunk')?.click();
    await new Promise((r) => setTimeout(r, 30));

    // Part tab click that triggers HTTP 500 error branch in selectWork
    const partTabs = document.querySelectorAll<HTMLButtonElement>('#part-tabs .part-tab');
    partTabs[1]?.click();
    await new Promise((r) => setTimeout(r, 30));

    // Switch to trilingual commentary via hashchange + test commentary mode tabs & checkboxes guard
    window.location.hash = '#/tipitaka/the-buddhas-path/texto/0';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await new Promise((r) => setTimeout(r, 40));

    const versionTabs = document.querySelectorAll<HTMLButtonElement>('#part-tabs .version-tab');
    expect(versionTabs.length).toBe(5);
    versionTabs[2]?.click(); // en+es
    versionTabs[3]?.click(); // pt
    versionTabs[4]?.click(); // es
    versionTabs[0]?.click(); // en

    // Test commentary checkbox guard when unchecking both
    const showPaliCb = document.getElementById('setting-show-pali') as HTMLInputElement;
    const showTransCb = document.getElementById('setting-show-translation') as HTMLInputElement;
    showPaliCb.checked = false;
    showTransCb.checked = false;
    showPaliCb.dispatchEvent(new Event('change'));
    expect(showTransCb.checked).toBe(true);
    showPaliCb.checked = false;
    showTransCb.checked = false;
    showTransCb.dispatchEvent(new Event('change'));
    expect(showPaliCb.checked).toBe(true);

    // Language switch pt -> es -> pt -> en + font inc/dec
    const langSel = document.getElementById('setting-lang') as HTMLSelectElement;
    langSel.value = 'es';
    langSel.dispatchEvent(new Event('change'));
    langSel.value = 'pt';
    langSel.dispatchEvent(new Event('change'));
    langSel.value = 'en';
    langSel.dispatchEvent(new Event('change'));
    document.getElementById('font-inc')?.click();
    document.getElementById('font-dec')?.click();

    // Switch to bilingual commentary (no es) to cover fallback
    window.location.hash = '#/tipitaka/bilingual-comm/texto/0';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelectorAll('#part-tabs .version-tab').length).toBe(3);

    // Unknown work / unknown part via hashchange
    window.location.hash = '#/tipitaka/nonexistent/mula/0';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.location.hash = '#/tipitaka/dhammasangani/nonexistent/0';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    // Same work/part/chunk with segId & mobile width collapse
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true, writable: true });
    window.location.hash = '#/tipitaka/bilingual-comm/texto/0?seg=2';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await new Promise((r) => setTimeout(r, 30));

    // History item click
    document.querySelector<HTMLElement>('#history-list .side-item')?.click();
    await new Promise((r) => setTimeout(r, 20));

    // Panel resizer drag (snap to 0, expand to 240, mouseup) & collapse/close buttons
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true, writable: true });
    const sidePanel = document.getElementById('side-panel')!;
    sidePanel.getBoundingClientRect = () => ({ width: 260 } as DOMRect);
    const resizer = document.getElementById('panel-resizer')!;
    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: 260, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, bubbles: true }));
    expect(sidePanel.classList.contains('collapsed')).toBe(true);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, bubbles: true }));
    expect(sidePanel.classList.contains('collapsed')).toBe(false);
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    document.getElementById('panel-collapse')?.click();
    document.getElementById('panel-collapse')?.click();
    document.getElementById('side-panel-close')?.click();

    // Rail buttons: click active panel to collapse, click export panel to sync work selector
    document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="export"]')?.click();
    document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="export"]')?.click();

    // SRS routing hashchanges (abhidhamma, mnemonic, vocab)
    window.location.hash = '#/srs/abhidhamma';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.location.hash = '#/srs/mnemonic';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    window.location.hash = '#/srs';
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    // PWA beforeinstallprompt (dismissed -> falls through to cacheAllForOffline), then accepted, then appinstalled
    const installBtn = document.getElementById('btn-install-pwa') as HTMLButtonElement;
    const promptDismiss = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    });
    window.dispatchEvent(promptDismiss);
    installBtn.click();
    await new Promise((r) => setTimeout(r, 120));
    expect(storedUrls.size).toBeGreaterThan(10);

    installBtn.disabled = false;
    const promptAccept = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });
    window.dispatchEvent(promptAccept);
    installBtn.click();
    await new Promise((r) => setTimeout(r, 20));
    window.dispatchEvent(new Event('appinstalled'));
    expect(document.getElementById('pwa-install-container')?.style.display).toBe('none');

    // Debate modal lazy-load toggle open -> submit event -> close
    const debateBtn = document.getElementById('btn-toggle-interlocutor') as HTMLButtonElement;
    const debateBox = document.getElementById('interlocutor-container') as HTMLElement;
    debateBtn.click();
    await vi.waitFor(() => expect(debateBox.style.display).toBe('block'), { timeout: 4000 });
    debateBox.dispatchEvent(new CustomEvent('interlocutor-submit', { detail: { text: 'test' } }));
    debateBtn.click();
    expect(debateBox.style.display).toBe('none');
  }, 15000);

  it('handles manifest.json load failure, SW rejection, and panel-only initial hash route gracefully', async () => {
    const consoleErr = vi.spyOn(console, 'error').mockImplementation(() => {});
    (globalThis as any).caches = {
      keys: async () => {
        throw new Error('caches error');
      },
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn(async () => {
          throw new Error('sw error');
        }),
      },
      configurable: true,
      writable: true,
    });
    globalThis.fetch = vi.fn(async () => new Response('err', { status: 500 })) as any;
    await import('../../src/app.js');
    await new Promise((r) => setTimeout(r, 30));
    expect(document.getElementById('content')?.textContent).toBeTruthy();

    // Panel-only initial hash route (#/export without workId)
    vi.resetModules();
    setupDom();
    window.location.hash = '#/export';
    globalThis.fetch = vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url);
      if (u.endsWith('data/manifest.json')) return new Response(JSON.stringify(MINI_MANIFEST), { status: 200 });
      return new Response(JSON.stringify({ entries: [], cards: [], shards: {} }), { status: 200 });
    }) as any;
    await import('../../src/app.js');
    await new Promise((r) => setTimeout(r, 30));
    expect(document.querySelector('#content .welcome')).not.toBeNull();
    consoleErr.mockRestore();
  });
});
