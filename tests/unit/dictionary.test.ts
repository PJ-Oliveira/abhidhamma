import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lookupPali, initDictionaryPanel } from '../../src/dictionary';
import { settings } from '../../src/state';

// Mock fetch to simulate dictionary files
const fakeCoreData = [
  { h: "Citta", freq: 100, pct: 1.0, senses: [{ id: "1", pos: "n", en: "Mind", pt: "Mente", es: "Mente" }] }
];

const fakeDictData = [
  { h: "Namo", pos: "indec", freq: 50, en: "Homage", pt: "Homenagem", es: "Homenaje" }
];

const fakeRootInfo = {
  "CIT": { en: "to think", pt: "pensar", es: "pensar", sanskrit: "cit", sanskrit_en: "to perceive" }
};

describe('Dictionary Module', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.includes('pali_core.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ entries: fakeCoreData, roots: fakeRootInfo }) });
      }
      if (url.includes('common_pali.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ entries: fakeDictData }) });
      }
      if (url.includes('root-info.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeRootInfo) });
      }
      return Promise.reject(new Error(`Not Found: ${url}`));
    }));
  });

  it('lookupPali should find exact match in core data', async () => {
    const res = await lookupPali('citta');
    expect(res).toBeDefined();
    expect(res?.h).toBe('Citta');
  });

  it('lookupPali should find normalized match in common data', async () => {
    const res = await lookupPali('namo');
    expect(res).toBeDefined();
    expect(res?.h).toBe('Namo');
  });

  it('lookupPali should handle unknown words', async () => {
    const res = await lookupPali('unknownword123');
    expect(res).toBeNull();
  });

  it('lookupPali should handle punctuation and casing', async () => {
    const res = await lookupPali('  "CittA",  ');
    expect(res).toBeDefined();
    expect(res?.h).toBe('Citta');
  });

  it('initDictionaryPanel should render results', async () => {
    const input = document.createElement('input');
    const results = document.createElement('div');
    document.body.appendChild(input);
    document.body.appendChild(results);

    // Initial load
    initDictionaryPanel(input, results);
    await new Promise(r => setTimeout(r, 10));

    // Type query
    input.value = "citt";
    input.dispatchEvent(new Event('input'));
    
    // Wait for debounce and fetch
    await new Promise(r => setTimeout(r, 50));
    
    expect(results.innerHTML).toContain('Citta');
    
    // Cleanup
    document.body.innerHTML = '';
  });
});
