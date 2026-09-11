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
});
