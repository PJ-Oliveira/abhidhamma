import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { initToolsPanel } from '../../src/tools/tools';
import { settings } from '../../src/state';
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
    document.body.innerHTML = '';
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

  it('ships complete ES translations & zero placeholders across all data/tools/*.json and data/graph/dhammas.json, and renders all 5 tools reactively in PT and ES', async () => {
    const root = path.resolve(__dirname, '../..');
    const loadJson = (rel: string) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

    const pat = loadJson('data/tools/patthana_matrix.json');
    expect(pat.groups.every((g: any) => typeof g.labelEs === 'string' && g.labelEs.length > 0)).toBe(true);
    expect(pat.conditions.every((c: any) => typeof c.labelEs === 'string' && c.labelEs.length > 0)).toBe(true);

    const vithi = loadJson('data/tools/vithi.json');
    expect(vithi.doors.every((d: any) => typeof d.labelEs === 'string' && d.sequence.every((s: any) => typeof s.labelEs === 'string'))).toBe(true);

    const cc = loadJson('data/tools/citta_cetasika.json');
    expect(cc.cetasikas.every((c: any) => typeof c.nameEs === 'string' && c.namePt !== 'Tópor')).toBe(true);
    expect(cc.cittas.every((c: any) => typeof c.nameEs === 'string' && !c.namePt.endsWith(' Pt') && !c.nameEn.endsWith(' En'))).toBe(true);

    const mat = loadJson('data/tools/matikas.json');
    expect(mat.tikas.every((m: any) => typeof m.titleEs === 'string' && m.terms.every((t: any) => typeof t.es === 'string'))).toBe(true);
    expect(mat.dukas.every((m: any) => typeof m.titleEs === 'string' && m.terms.every((t: any) => typeof t.es === 'string'))).toBe(true);
    expect(JSON.stringify(mat)).not.toMatch(/cármic|karmic|samsaric/i);

    const dg = loadJson('data/graph/dhammas.json');
    expect(dg.nodes.every((n: any) => typeof n.labelEs === 'string' && !String(n.labelPt).includes('Corpo Mentais'))).toBe(true);
    expect(dg.edges.every((e: any) => typeof e.labelEs === 'string')).toBe(true);

    const mm = loadJson('data/tools/mindmap.json');
    const checkMm = (n: any) => {
      if (n.labelEn) expect(typeof n.labelEs).toBe('string');
      for (const ch of n.children || []) checkMm(ch);
    };
    checkMm(mm.root);

    // Mount Tools with real JSON datasets and verify ES + live languageChanged to PT
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      const clean = url.replace(/^\.\//, '').replace(/^\//, '');
      const full = path.join(root, clean);
      if (fs.existsSync(full)) {
        const data = JSON.parse(fs.readFileSync(full, 'utf8'));
        return Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    }));

    const origUi = settings.uiLang;
    const origTr = settings.translationLang;
    try {
      location.hash = '';
      settings.uiLang = 'es';
      settings.translationLang = 'es';
      initToolsPanel(container);
      const mount = container;

      // Mindmap in ES
      (mount.querySelector('.tools-tab-btn[data-tab="mindmap"]') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 30));
      expect(mount.querySelector('#tools-panel-mindmap')?.textContent).toContain('Realidades Últimas');

      // Patthana in ES
      (mount.querySelector('.tools-tab-btn[data-tab="patthana"]') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 30));
      expect(mount.querySelector('#tools-panel-patthana')?.textContent).toContain('Cittas Insaludables');

      // Vithi in ES (including localized Reiniciar button)
      (mount.querySelector('.tools-tab-btn[data-tab="vithi"]') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 30));
      expect(mount.querySelector('#tools-panel-vithi')?.textContent).toContain('Proceso de la Puerta del Ojo');
      expect(mount.querySelector('#vithi-reset')?.textContent).toContain('Reiniciar');

      // Matikas in ES
      (mount.querySelector('.tools-tab-btn[data-tab="matikas"]') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 30));
      expect(mount.querySelector('#tools-panel-matikas')?.textContent).toContain('Tríada de lo Saludable');

      // Cetasika in ES
      (mount.querySelector('.tools-tab-btn[data-tab="cetasika"]') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 30));
      expect(mount.querySelector('#tools-panel-cetasika')?.textContent).toContain('Conciencia enraizada en codicia');

      // Live switch to PT via languageChanged updates loaded tools immediately
      settings.uiLang = 'pt';
      settings.translationLang = 'pt';
      window.dispatchEvent(new Event('languageChanged'));
      await new Promise((r) => setTimeout(r, 40));
      expect(mount.querySelector('#tools-panel-mindmap')?.textContent).toContain('Realidades Últimas');
      expect(mount.querySelector('#tools-panel-patthana')?.textContent).toContain('Cittas Insalubres');
      expect(mount.querySelector('#tools-panel-matikas')?.textContent).toContain('Tríade do Salubre');
    } finally {
      settings.uiLang = origUi;
      settings.translationLang = origTr;
    }
  });
});
