import { describe, it, expect, beforeEach } from 'vitest';
import { initToolsPanel } from '../../src/tools/tools';
import '../../src/tools/mindmap';
import '../../src/tools/patthana';
import '../../src/tools/vithi';
import '../../src/tools/matikas';
import '../../src/tools/cetasika';

describe('Tools Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Add active rail btn for tools to avoid location hash change error
    const dummyBtn = document.createElement('button');
    dummyBtn.className = "rail-btn active";
    dummyBtn.dataset.panel = "tools";
    document.body.appendChild(dummyBtn);
  });

  it('should initialize all tools without crashing', () => {
    initToolsPanel(container);
    
    // Click mindmap
    const mmBtn = container.querySelector('.tools-tab-btn[data-tab="mindmap"]') as HTMLButtonElement;
    if (mmBtn) mmBtn.click();
    
    // Click patthana
    const ptBtn = container.querySelector('.tools-tab-btn[data-tab="patthana"]') as HTMLButtonElement;
    if (ptBtn) ptBtn.click();
    
    // Click vithi
    const vtBtn = container.querySelector('.tools-tab-btn[data-tab="vithi"]') as HTMLButtonElement;
    if (vtBtn) vtBtn.click();
    
    // Click matikas
    const mtBtn = container.querySelector('.tools-tab-btn[data-tab="matikas"]') as HTMLButtonElement;
    if (mtBtn) mtBtn.click();
    
    // Click cetasika
    const ctBtn = container.querySelector('.tools-tab-btn[data-tab="cetasika"]') as HTMLButtonElement;
    if (ctBtn) ctBtn.click();
    
    expect(container.innerHTML).not.toBe('');
  });
});
