import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initToolsPanel } from '../../src/tools/tools';
import '../../src/tools/mindmap';
import '../../src/tools/patthana';
import '../../src/tools/vithi';
import '../../src/tools/matikas';
import '../../src/tools/cetasika';

const fakeVithi = { doors: [{ id: "eye", label: "Cakkhudvāra", labelEn: "Eye Door", labelPt: "Porta do Olho", icon: "👁", sequence: [{ id: "v", label: "V", type: "bhavanga", color: "#666", count: 1 }] }] };
const fakeCittaCet = { cetasikas: [{ name: "Phassa" }] };
const fakePatthana = { conditions: [{ id: "hetu", pali: "Hetu", en: "Root", pt: "Raiz", es: "Raiz", defEn: "def", defPt: "def", defEs: "def" }], relations: [] };
const fakeMatikas = { matikas: [{ id: "tika-kusalattika", name: "Kusala Tika", type: "tika", group: "Abhidhammamātikā", en: "Kusala", pt: "Kusala", es: "Kusala", sets: [] }] };
const fakeCetasikasGroups = { groups: [{ id: "akusala", name: "Akusala", pt: "Akusala", es: "Akusala", en: "Akusala", color: "#f00", cetasikas: [{ pali: "Lobha", en: "Greed", pt: "Cobiça", es: "Codicia", meaning: "meaning", roots: [] }] }] };

describe('Tools Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.includes('vithi.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeVithi) });
      if (url.includes('citta_cetasika.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeCittaCet) });
      if (url.includes('patthana.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(fakePatthana) });
      if (url.includes('matikas.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeMatikas) });
      if (url.includes('cetasikas.json')) return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeCetasikasGroups) });
      return Promise.resolve({ ok: false, status: 404 });
    }));

    container = document.createElement('div');
    document.body.appendChild(container);
    
    const dummyBtn = document.createElement('button');
    dummyBtn.className = "rail-btn active";
    dummyBtn.dataset.panel = "tools";
    document.body.appendChild(dummyBtn);
  });

  it('should initialize and interact with all tools', async () => {
    initToolsPanel(container);
    
    // Test Mindmap
    const mmBtn = container.querySelector('.tools-tab-btn[data-tab="mindmap"]') as HTMLButtonElement;
    mmBtn.click();
    await new Promise(r => setTimeout(r, 10)); // let it render
    
    // Test Patthana
    const ptBtn = container.querySelector('.tools-tab-btn[data-tab="patthana"]') as HTMLButtonElement;
    ptBtn.click();
    await new Promise(r => setTimeout(r, 20));
    const condSel = container.querySelector('#pt-cond') as HTMLSelectElement;
    if (condSel) {
        condSel.value = "hetu";
        condSel.dispatchEvent(new Event('change'));
    }

    // Test Vithi
    const vtBtn = container.querySelector('.tools-tab-btn[data-tab="vithi"]') as HTMLButtonElement;
    vtBtn.click();
    await new Promise(r => setTimeout(r, 50));
    const playBtn = container.querySelector('#vithi-play') as HTMLButtonElement;
    if (playBtn) playBtn.click();

    // Test Matikas
    const mtBtn = container.querySelector('.tools-tab-btn[data-tab="matikas"]') as HTMLButtonElement;
    mtBtn.click();
    await new Promise(r => setTimeout(r, 20));

    // Test Cetasikas
    const ctBtn = container.querySelector('.tools-tab-btn[data-tab="cetasika"]') as HTMLButtonElement;
    ctBtn.click();
    await new Promise(r => setTimeout(r, 20));
    
    expect(container.innerHTML).not.toBe('');
  });
});
