import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/dictionary', () => ({
  lookupPali: vi.fn().mockResolvedValue({
    h: 'test',
    en: 'test',
    pt: 'test',
    es: 'test'
  })
}));
import { initSelectionHandler } from '../../src/selection';

describe('Selection UI Module', () => {
  beforeEach(() => {
    document.body.innerHTML = `

      <div id="content">
        <div class="seg" data-seg-id="123">
          <p>Some Pali text here to select.</p>
        </div>
      </div>
      <div id="selection-popover" class="selection-popover hidden"></div>
      <div id="reader-overlay"></div>

    `;
    
    // Mock getSelection
    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => "Pali text",
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 20 }),
        startContainer: document.querySelector('.seg p'),
        commonAncestorContainer: document.querySelector('.seg p')
      })
    }) as any;
  });

  it('should initialize and show popover on selection', async () => {
    initSelectionHandler(document.getElementById('content')!);
    
    // Trigger selection change
    document.getElementById('content')!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    
    // allow debounce to fire
    await new Promise(r => setTimeout(r, 400));
    
    // The popover should be created
    const popover = document.querySelector('.selection-popover') as HTMLElement;
    expect(popover).not.toBeNull();
    
    // Check if the copy link button is in there
    const btn = document.querySelector('.sp-link-btn') as HTMLElement;
    
  });
  
  it('should hide popover when selection is collapsed', async () => {
    initSelectionHandler(document.getElementById('content')!);
    
    // Mock collapsed selection
    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: true,
      rangeCount: 0,
      toString: () => ""
    }) as any;
    
    document.getElementById('content')!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
    
    const popover = document.querySelector('.selection-popover') as HTMLElement;
    if (popover) {
        expect(popover.classList.contains('hidden')).toBe(true);
    }
  });

  it('should highlight only the isolated .pali-word and activate the Dictionary panel without highlighting the whole paragraph', async () => {
    document.body.innerHTML = `
      <button class="rail-btn active" data-panel="tipitaka"></button>
      <button class="rail-btn" data-panel="dictionary"></button>
      <aside id="side-panel">
        <div id="panel-tipitaka" class="panel active"></div>
        <div id="panel-dictionary" class="panel">
          <input id="dict-search" type="search" />
          <div id="dict-results"></div>
        </div>
      </aside>
      <div id="content">
        <div class="seg" data-seg-id="1">
          <div class="pali-line">
            <span class="pali-word" data-word="Tikamātikā">Tikamātikā</span>
            <span class="pali-word" data-word="kusalā">kusalā</span>
          </div>
          <div class="translation-line">Matriz de tríades hábeis</div>
        </div>
      </div>
      <div id="selection-popover" class="selection-popover hidden"></div>
    `;

    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: true,
      rangeCount: 0,
      toString: () => ""
    }) as any;

    initSelectionHandler(document.getElementById('content')!);

    const firstWord = document.querySelector('.pali-word[data-word="Tikamātikā"]') as HTMLElement;
    const secondWord = document.querySelector('.pali-word[data-word="kusalā"]') as HTMLElement;
    const translLine = document.querySelector('.translation-line') as HTMLElement;
    const paliLine = document.querySelector('.pali-line') as HTMLElement;

    firstWord.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await new Promise(r => setTimeout(r, 50));

    expect(firstWord.classList.contains('pali-word-selected')).toBe(true);
    expect(secondWord.classList.contains('pali-word-selected')).toBe(false);
    expect(translLine.classList.contains('selection-counterpart')).toBe(false);
    expect(paliLine.classList.contains('selection-counterpart')).toBe(false);

    const dictPanel = document.getElementById('panel-dictionary') as HTMLElement;
    const dictInput = document.getElementById('dict-search') as HTMLInputElement;
    expect(dictPanel.classList.contains('active')).toBe(true);
    expect(dictInput.value).toBe('Tikamātikā');
  });

  it('should strip .bookmark-toggle from counterpart HTML and remove hidden before measuring popover', async () => {
    document.body.innerHTML = `
      <div id="content">
        <div class="seg" data-seg-id="7" data-pali="Cittaṃ">
          <div class="pali-line">Cittaṃ</div>
          <div class="translation-line">Consciência<button class="bookmark-toggle">☆</button></div>
        </div>
      </div>
      <div id="selection-popover" class="selection-popover hidden"></div>
    `;
    const paliLine = document.querySelector('.pali-line')!;
    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'Cittaṃ',
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 100, left: 100, right: 150, bottom: 120, width: 50, height: 20 }),
        startContainer: paliLine,
        endContainer: paliLine,
        intersectsNode: () => false,
      }),
    }) as any;

    initSelectionHandler(document.getElementById('content')!);
    document.getElementById('content')!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await new Promise(r => setTimeout(r, 50));

    const popover = document.getElementById('selection-popover')!;
    expect(popover.classList.contains('hidden')).toBe(false);
    expect(popover.style.visibility).toBe('');
    expect(popover.querySelector('.sp-text .bookmark-toggle')).toBeNull();
    expect(popover.querySelector('.sp-text')?.textContent).toBe('Consciência');
  });

  it('should NOT hijack the Pāli Dictionary panel when selecting English text in a Contemporary Commentary', async () => {
    document.body.innerHTML = `
      <button class="rail-btn active" data-panel="tipitaka"></button>
      <button class="rail-btn" data-panel="dictionary"></button>
      <aside id="side-panel">
        <div id="panel-tipitaka" class="panel active"></div>
        <div id="panel-dictionary" class="panel">
          <input id="dict-search" type="search" />
          <div id="dict-results"></div>
        </div>
      </aside>
      <div id="content">
        <div class="seg" data-seg-id="42" data-commentary="true" data-pali="Reality is conditioned.">
          <div class="pali-line">Reality is conditioned.</div>
          <div class="translation-line">A realidade é condicionada.</div>
        </div>
      </div>
      <div id="selection-popover" class="selection-popover hidden"></div>
    `;
    const paliLine = document.querySelector('.pali-line')!;
    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => 'Reality',
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 100, left: 100, right: 160, bottom: 120, width: 60, height: 20 }),
        startContainer: paliLine,
        endContainer: paliLine,
        intersectsNode: () => false,
      }),
    }) as any;

    initSelectionHandler(document.getElementById('content')!);
    document.getElementById('content')!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 50));

    expect(document.getElementById('panel-dictionary')!.classList.contains('active')).toBe(false);
    expect((document.getElementById('dict-search') as HTMLInputElement).value).toBe('');
    const popover = document.getElementById('selection-popover')!;
    expect(popover.classList.contains('hidden')).toBe(false);
    expect(popover.querySelector('.sp-text')?.textContent).toBe('A realidade é condicionada.');
    expect(popover.querySelector('.sp-dict-section')).toBeNull();
  });
});
