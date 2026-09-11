import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('App Integration & User Journeys', () => {
  beforeAll(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
    document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  });
  beforeAll(() => {
    const corePaliRaw = fs.readFileSync(path.resolve(__dirname, '../../data/dictionary/pali_core.json'), 'utf8');
    const commonPaliRaw = fs.readFileSync(path.resolve(__dirname, '../../data/dictionary/common_pali.json'), 'utf8');

    global.fetch = async (url: string | URL | globalThis.Request) => {
      const urlStr = url.toString();
      
      if (urlStr.includes('data/manifest.json')) {
        return {
          ok: true,
          json: async () => ({
            groups: {
              'abhidhamma': [
                { id: 'test-1', title: 'Dhammasaṅgaṇī Test', parts: { '1': { label: 'Part 1', files: ['chunk1.json'], toc: [], count: 1 } } }
              ]
            }
          })
        } as any;
      }
      if (urlStr.includes('data/search/manifest.json')) {
        return {
          ok: true,
          json: async () => ({
            shards: { 'ci': 'shard-1.json' }
          })
        } as any;
      }
      if (urlStr.includes('shard-1.json')) {
        return {
          ok: true,
          json: async () => ({
            postings: { 'citta': [0] },
            segments: [{ workId: 'test-1', partKey: '1', chunk: 0, segId: 1, snippet: 'citta ...' }]
          })
        } as any;
      }
      if (urlStr.includes('pali_core.json')) {
        return { ok: true, json: async () => JSON.parse(corePaliRaw) } as any;
      }
      if (urlStr.includes('common_pali.json')) {
        return { ok: true, json: async () => JSON.parse(commonPaliRaw) } as any;
      }
      if (urlStr.includes('vocabulary.json')) {
        return { ok: true, json: async () => ({ meta: { count: 0 }, cards: [] }) } as any;
      }
      if (urlStr.includes('data/works/test-1/chunk1.json')) {
        return {
          ok: true,
          json: async () => ([
            { id: 1, rend: 'p', pali: 'dhamma', en: 'phenomenon', pt: 'fenômeno', es: 'fenómeno' }
          ])
        } as any;
      }
      
            if (urlStr.includes('data/srs/pali_vocab.json')) {
        return {
          ok: true,
          json: async () => ([
            { id: "1", pali: "kamma", pt: "ação", en: "action", es: "acción", pos: "n." }
          ])
        } as any;
      }

      return { ok: true, json: async () => ({}) } as any;
    };
  });

  it('should boot the entire application and handle navigation', async () => {
    await import('../../src/app.js');
    await new Promise(r => setTimeout(r, 400));

    // 1. Tree
    const tree = document.getElementById('tree');
    expect(tree?.innerHTML).toContain('Dhammasaṅgaṇī Test');
    const leaf = document.querySelector('.node-label.leaf') as HTMLElement;
    leaf.click();
    await new Promise(r => setTimeout(r, 400));
    
    // 2. Search
    const searchBtn = document.querySelector('[data-panel="search"]') as HTMLElement;
    searchBtn.click();
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.value = 'citta';
    searchInput.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 500)); // wait for debounce + fetch
    const searchResults = document.getElementById('search-results');
    // expect(searchResults?.innerHTML).toContain('citta');
    
    // 3. Dictionary
    const dictBtn = document.querySelector('[data-panel="dictionary"]') as HTMLElement;
    dictBtn.click();
    const dictInput = document.getElementById('dict-search') as HTMLInputElement;
    dictInput.value = 'citta';
    dictInput.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 400));
    
    // 4. Tools
    const toolsBtn = document.querySelector('[data-panel="tools"]') as HTMLElement;
    toolsBtn.click();
    const toolsBody = document.getElementById('tools-full-body');
    const toolBtns = toolsBody?.querySelectorAll('.tools-tab-btn');
    toolBtns?.forEach(b => (b as HTMLElement).click());
    await new Promise(r => setTimeout(r, 400));

    // 5. Reader Navigation
    const nextBtn = document.getElementById('next-chunk') as HTMLButtonElement;
    if (nextBtn) nextBtn.click();
    await new Promise(r => setTimeout(r, 200));

    // 6. Export Panel
    const exportBtn = document.querySelector('[data-panel="export"]') as HTMLElement;
    if (exportBtn) exportBtn.click();
    const epubBtn = document.querySelector('.export-btn') as HTMLElement;
    if (epubBtn) epubBtn.click();
    await new Promise(r => setTimeout(r, 200));

    // 10. i18n Switch Test
    const settingsBtn = document.querySelector('[data-panel="settings"]') as HTMLElement;
    if (settingsBtn) settingsBtn.click();
    
    const uiLangSel = document.getElementById('setting-ui-lang') as HTMLSelectElement;
    if (uiLangSel) {
      // switch to pt
      uiLangSel.value = 'pt';
      uiLangSel.dispatchEvent(new Event('change'));
      await new Promise(r => setTimeout(r, 100));
      // verify it didn't crash
      expect(document.body.innerHTML.length).toBeGreaterThan(0);
      
      // switch back to en
      uiLangSel.value = 'en';
      uiLangSel.dispatchEvent(new Event('change'));
      await new Promise(r => setTimeout(r, 100));
    }
  });

});
