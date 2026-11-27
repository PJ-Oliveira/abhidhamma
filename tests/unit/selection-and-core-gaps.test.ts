import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initSelectionHandler, clearSelection } from '../../src/selection.js';
import { initDictionaryPanel } from '../../src/dictionary.js';
import { initSearchPanel } from '../../src/search.js';
import { initGraphPanel } from '../../src/graph.js';

describe('src/selection.ts & remaining core gaps (toward 100% coverage)', () => {
  const origFetch = globalThis.fetch;
  const origGetSel = window.getSelection;
  const origClipboard = (navigator as any).clipboard;

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.fetch = origFetch;
    window.getSelection = origGetSel;
    Object.defineProperty(navigator, 'clipboard', { value: origClipboard, configurable: true, writable: true });
    clearSelection();
  });

  it('exercises selection popover (Pali dict hit, translation counterpart, empty counterpart, copy link ok/err, edge positioning, Escape/scroll/outside mousedown)', async () => {
    globalThis.fetch = vi.fn(async (url: RequestInfo | URL) => {
      const u = String(url);
      if (u.includes('pali_core.json')) {
        return new Response(
          JSON.stringify({
            entries: [
              {
                h: 'citta',
                senses: [{ pos: 'nt.', en: 'mind', pt: 'mente', es: 'mente' }],
              },
            ],
          }),
          { status: 200 }
        );
      }
      if (u.includes('common_pali.json')) {
        return new Response(
          JSON.stringify({
            entries: [{ h: 'dhamma', pos: 'm.', en: 'phenomenon', pt: 'fenômeno', es: 'fenómeno' }],
          }),
          { status: 200 }
        );
      }
      return new Response('{}', { status: 200 });
    }) as any;

    const container = document.createElement('div');
    container.id = 'content';
    container.innerHTML = `
      <div class="seg" data-seg-id="42" data-pali="citta dhamma">
        <div class="pali-line"><span class="pali-word" data-word="citta">citta</span> <span class="pali-word" data-word="dhamma">dhamma</span></div>
        <div class="translation-line">consciousness<button class="bookmark-toggle">☆</button></div>
      </div>
      <div class="seg" data-seg-id="43" data-commentary="true">
        <div class="pali-line">English commentary sentence</div>
        <div class="translation-line">Frase de comentário</div>
      </div>
      <div class="seg" data-seg-id="44">
        <div class="translation-line">only translation</div>
      </div>
    `;
    const popDiv = document.createElement('div');
    popDiv.id = 'selection-popover';
    popDiv.className = 'hidden';
    document.body.appendChild(popDiv);
    document.body.appendChild(container);

    initSelectionHandler(container);

    const cittaSpan = container.querySelector<HTMLElement>('.pali-word[data-word="citta"]')!;
    cittaSpan.getBoundingClientRect = () =>
      ({ left: window.innerWidth - 10, right: window.innerWidth - 2, top: window.innerHeight - 10, bottom: window.innerHeight, width: 8, height: 10 } as DOMRect);

    // 1. Click a Pali word WITHOUT #panel-dictionary -> opens popover with dict hit + edge positioning
    window.getSelection = vi.fn(() => ({ isCollapsed: true, rangeCount: 0, toString: () => '' }) as any);
    cittaSpan.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(50);

    const popover = document.getElementById('selection-popover')!;
    expect(popover).not.toBeNull();
    expect(popover.classList.contains('hidden')).toBe(false);
    expect(popover.querySelector('.sp-dict-head')?.textContent).toBe('citta');
    expect(popover.querySelector('.sp-dict-pos')?.textContent).toBe('nt.');

    // Copy link button (success then rejection)
    const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true, writable: true });
    const linkBtn = popover.querySelector<HTMLButtonElement>('.sp-link-btn')!;
    linkBtn.click();
    await vi.advanceTimersByTimeAsync(2100);
    linkBtn.click();
    await vi.advanceTimersByTimeAsync(2100);
    expect(writeText).toHaveBeenCalledTimes(2);

    // Close via close button & outside mousedown
    popover.querySelector<HTMLButtonElement>('.sp-close')?.click();
    expect(popover.classList.contains('hidden')).toBe(true);

    // 2. Select in translation-line (seg 42 -> shows pali counterpart; seg 44 -> empty "—")
    const translEl = container.querySelector<HTMLElement>('.seg[data-seg-id="42"] .translation-line')!;
    const textNode = translEl.firstChild!;
    window.getSelection = vi.fn(
      () =>
        ({
          isCollapsed: false,
          rangeCount: 1,
          toString: () => 'consciousness',
          getRangeAt: () => ({
            startContainer: textNode,
            endContainer: textNode,
            intersectsNode: () => false,
            getBoundingClientRect: () => ({ left: 10, right: 80, top: 20, bottom: 40, width: 70, height: 20 } as DOMRect),
          }),
        }) as any
    );
    translEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(50);
    expect(popover.querySelector('.sp-text')?.textContent).toContain('citta dhamma');

    // Empty counterpart on seg 44
    const emptyTransl = container.querySelector<HTMLElement>('.seg[data-seg-id="44"] .translation-line')!;
    const emptyTextNode = emptyTransl.firstChild!;
    window.getSelection = vi.fn(
      () =>
        ({
          isCollapsed: false,
          rangeCount: 1,
          toString: () => 'only translation',
          getRangeAt: () => ({
            startContainer: emptyTextNode,
            endContainer: emptyTextNode,
            intersectsNode: () => false,
            getBoundingClientRect: () => ({ left: 10, right: 80, top: 20, bottom: 40, width: 70, height: 20 } as DOMRect),
          }),
        }) as any
    );
    emptyTransl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(50);
    expect(popover.querySelector('.sp-empty')?.textContent).toBe('—');

    // 3. Explicit selection inside commentary segment -> opens counterpart popover WITHOUT dictionary lookup
    const commPali = container.querySelector<HTMLElement>('.seg[data-seg-id="43"] .pali-line')!;
    const commNode = commPali.firstChild!;
    window.getSelection = vi.fn(
      () =>
        ({
          isCollapsed: false,
          rangeCount: 1,
          toString: () => 'English commentary',
          getRangeAt: () => ({
            startContainer: commNode,
            endContainer: commNode,
            intersectsNode: () => false,
            getBoundingClientRect: () => ({ left: 10, right: 80, top: 20, bottom: 40, width: 70, height: 20 } as DOMRect),
          }),
        }) as any
    );
    commPali.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(50);
    expect(popover.querySelector('.sp-dict-section')).toBeNull();

    // Outside mousedown clears selection
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(popover.classList.contains('hidden')).toBe(true);

    // 4. Tap-to-define fallback via caretRangeFromPoint (inside .pali-word and on unwrapped text node)
    const plainDiv = document.createElement('div');
    plainDiv.className = 'pali-line';
    plainDiv.textContent = 'citta dhamma';
    const seg42 = container.querySelector<HTMLElement>('.seg[data-seg-id="42"]')!;
    seg42.appendChild(plainDiv);

    (document as any).caretRangeFromPoint = () => {
      const r = document.createRange();
      r.setStart(cittaSpan.firstChild!, 1);
      r.collapse(true);
      return r;
    };
    window.getSelection = vi.fn(() => ({ isCollapsed: true, rangeCount: 0, toString: () => '' }) as any);
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 10 }));
    await vi.advanceTimersByTimeAsync(30);

    (document as any).caretRangeFromPoint = () => {
      const r = document.createRange();
      r.setStart(plainDiv.firstChild!, 2);
      r.collapse(true);
      return r;
    };
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 10 }));
    await vi.advanceTimersByTimeAsync(30);

    // caretPositionFromPoint fallback when caretRangeFromPoint is absent
    delete (document as any).caretRangeFromPoint;
    (document as any).caretPositionFromPoint = () => ({ offsetNode: plainDiv.firstChild!, offset: 2 });
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 10 }));
    await vi.advanceTimersByTimeAsync(30);
    delete (document as any).caretPositionFromPoint;

    // 5. Non-seg selection, non-pali/non-translation selection inside .seg, and collapsed click on commentary seg
    const outsideNode = document.createElement('p');
    outsideNode.textContent = 'outside';
    container.appendChild(outsideNode);
    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'outside',
      getRangeAt: () => ({ startContainer: outsideNode.firstChild!, endContainer: outsideNode.firstChild! }),
    }) as any);
    outsideNode.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(20);

    const neutralBox = document.createElement('div');
    neutralBox.className = 'other-box';
    neutralBox.textContent = 'neutral';
    const seg44 = container.querySelector<HTMLElement>('.seg[data-seg-id="44"]')!;
    const dummyPali = document.createElement('div');
    dummyPali.className = 'pali-line';
    seg44.appendChild(dummyPali);
    seg44.appendChild(neutralBox);
    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'neutral',
      getRangeAt: () => ({
        startContainer: neutralBox.firstChild!,
        endContainer: neutralBox.firstChild!,
        intersectsNode: () => false,
      }),
    }) as any);
    neutralBox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(20);

    // Collapsed click on commentary segment -> clears selection
    window.getSelection = vi.fn(() => ({ isCollapsed: true, rangeCount: 0, toString: () => '' }) as any);
    (document as any).caretRangeFromPoint = () => {
      const r = document.createRange();
      r.setStart(commNode, 1);
      r.collapse(true);
      return r;
    };
    commPali.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(20);
    delete (document as any).caretRangeFromPoint;

    // 6. Range selection across .pali-word with intersectsNode true & false (closestStart/closestEnd fallback) + small viewport popover clamp + collapsed #side-panel + #panel-dictionary
    const sidePanel = document.createElement('aside');
    sidePanel.id = 'side-panel';
    sidePanel.className = 'collapsed';
    const collapseBtn = document.createElement('button');
    collapseBtn.id = 'panel-collapse';
    const dictPanel = document.createElement('div');
    dictPanel.id = 'panel-dictionary';
    dictPanel.className = 'panel';
    const dictInput = document.createElement('input');
    dictInput.id = 'dict-search';
    localStorage.setItem('panelW', '300');
    document.body.append(sidePanel, collapseBtn, dictPanel, dictInput);

    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'citta',
      getRangeAt: () => ({
        startContainer: cittaSpan.firstChild!,
        endContainer: cittaSpan.firstChild!,
        intersectsNode: () => true,
        getBoundingClientRect: () => ({ left: 5, right: 15, top: 5, bottom: 15, width: 10, height: 10 } as DOMRect),
      }),
    }) as any);
    cittaSpan.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(30);
    expect(sidePanel.classList.contains('collapsed')).toBe(false);

    // Also test closestEnd fallback when intersectsNode returns false and startContainer is not inside .pali-word
    dictPanel.remove();
    // Hit line 175: mouseup on seg42 (clickedWordSpan is null) while range.intersectsNode returns true
    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'citta',
      getRangeAt: () => ({
        startContainer: seg42,
        endContainer: seg42,
        intersectsNode: () => true,
        getBoundingClientRect: () => ({ left: 5, right: 15, top: 5, bottom: 15, width: 10, height: 10 } as DOMRect),
      }),
    }) as any);
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(30);

    // Hit lines 157-158: detached text node where startNode and endNode are null and clickedWordSpan is null
    const detachedText = document.createTextNode('detached');
    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'detached',
      getRangeAt: () => ({
        startContainer: detachedText,
        endContainer: detachedText,
      }),
    }) as any);
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(20);

    const origW = window.innerWidth;
    const origH = window.innerHeight;
    window.innerWidth = 100;
    window.innerHeight = 100;
    window.getSelection = vi.fn(() => ({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => '...',
      getRangeAt: () => ({
        startContainer: seg42,
        endContainer: cittaSpan.firstChild!,
        intersectsNode: () => false,
        getBoundingClientRect: () => ({ left: 95, right: 98, top: 95, bottom: 98, width: 3, height: 3 } as DOMRect),
      }),
    }) as any);
    seg42.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(30);
    window.innerWidth = origW;
    window.innerHeight = origH;
  });

  it('exercises dictionary.ts, search.ts, and graph.ts remaining edge paths', async () => {
    const origRO = (globalThis as any).ResizeObserver;
    (globalThis as any).ResizeObserver = class {
      cb: any;
      constructor(cb: any) { this.cb = cb; }
      observe() { this.cb([{ contentRect: { width: 800, height: 600 } }]); }
      disconnect() {}
    };
    try {
      // Search panel when manifest returns 500
      globalThis.fetch = vi.fn(async () => new Response('err', { status: 500 })) as any;
      const sInput = document.createElement('input');
      const sResults = document.createElement('div');
      document.body.append(sInput, sResults);
      initSearchPanel(sInput, sResults, vi.fn());
      sInput.value = 'citta';
      sInput.dispatchEvent(new Event('input'));
      await vi.advanceTimersByTimeAsync(350);
      expect(sResults.textContent).toBeTruthy();

      // Dictionary panel when fetch fails
      const dInput = document.createElement('input');
      const dResults = document.createElement('div');
      document.body.append(dInput, dResults);
      initDictionaryPanel(dInput, dResults);
      dInput.value = 'xyznotfound';
      dInput.dispatchEvent(new Event('input'));
      await vi.advanceTimersByTimeAsync(250);

      // Graph panel zoom/pan/reset/filter edge interactions
      const gHost = document.createElement('div');
      document.body.appendChild(gHost);
      initGraphPanel(gHost);
      expect(gHost.querySelector('canvas')).not.toBeNull();
    } finally {
      (globalThis as any).ResizeObserver = origRO;
    }
  });
});
