import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lookupPali, initDictionaryPanel, showWordInDictionaryPanel } from '../../src/dictionary';
import { settings } from '../../src/state';

// Mock fetch to simulate dictionary files
const fakeCoreData = [
  { h: "Citta", freq: 100, pct: 1.0, senses: [{ id: "1", pos: "n", en: "Mind", pt: "Mente", es: "Mente" }] },
  { h: "tikamātikā", freq: 25, pct: 0.25, senses: [{ id: "tikamatika_1", pos: "f.", en: "matrix of triads", pt: "matriz de tríades", es: "matriz de tríadas" }] },
  { h: "kusala", freq: 80, pct: 0.8, senses: [{ id: "kusala_1", pos: "adj.", en: "wholesome", pt: "hábil; salutar", es: "hábil; saludable" }] },
  { h: "dhamma", freq: 120, pct: 1.2, senses: [{ id: "dhamma_1", pos: "m.", en: "phenomenon; state", pt: "fenômeno; estado", es: "fenómeno; estado" }] }
];

const fakeForms = {
  "kusalānaṃ": "kusala",
  "kusaladhammā": "kusala+dhamma"
};

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
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ entries: fakeCoreData, roots: fakeRootInfo, forms: fakeForms }) });
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

  it('lookupPali should resolve exact compound headwords like Tikamātikā and inflected/compound forms', async () => {
    const tikaRes = await lookupPali('Tikamātikā');
    expect(tikaRes?.h).toBe('tikamātikā');

    const inflectedRes = await lookupPali('kusalānaṃ');
    expect(inflectedRes?.h).toBe('kusala');

    const compRes = await lookupPali('kusaladhammā');
    expect(compRes).toBeDefined();
    expect(compRes && 'senses' in compRes && compRes.senses[0]?.grammar).toBe('kusala + dhamma');
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

  it('initDictionaryPanel should render results and respond to showWordInDictionaryPanel', async () => {
    const input = document.createElement('input');
    input.id = 'dict-search';
    const results = document.createElement('div');
    document.body.appendChild(input);
    document.body.appendChild(results);

    // Initial load
    initDictionaryPanel(input, results);
    await new Promise(r => setTimeout(r, 10));

    // Type query
    input.value = "citt";
    input.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 50));
    expect(results.innerHTML).toContain('Citta');

    // Trigger automatic word display
    showWordInDictionaryPanel('Tikamātikā');
    expect(input.value).toBe('Tikamātikā');
    expect(results.innerHTML).toContain('tikamātikā');

    // Cleanup
    document.body.innerHTML = '';
  });
});
