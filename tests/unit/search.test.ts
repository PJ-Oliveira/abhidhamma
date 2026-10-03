import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSearchPanel } from '../../src/search';

const fakeManifest = {
  shards: {
    "c": "shard_c.json",
    "m": "shard_m.json"
  }
};

const fakeShardC = {
  postings: {
    "citta": [0, 1]
  },
  segments: [
    { snippet: "Snippet about Citta 1", workId: "w1", partKey: "p1", chunkIndex: 0, segId: 10 },
    { snippet: "Snippet about Citta 2", workId: "w1", partKey: "p1", chunkIndex: 0, segId: 20 }
  ]
};

describe('Search Module', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.includes('manifest.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeManifest) });
      }
      if (url.includes('shard_c.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(fakeShardC) });
      }
      return Promise.resolve({ ok: false, status: 404 });
    }));
  });

  it('initSearchPanel should render search results', async () => {
    const input = document.createElement('input');
    const results = document.createElement('div');
    
    let openedHit = null;
    initSearchPanel(input, results, (hit) => {
      openedHit = hit;
    });

    // Type query
    input.value = "citta";
    input.dispatchEvent(new Event('input'));
    
    // Wait for debounce and fetch
    await new Promise(r => setTimeout(r, 400));
    
    expect(results.innerHTML).toContain('Snippet about Citta 1');
    expect(results.innerHTML).toContain('Snippet about Citta 2');

    // Test click on result
    const firstHitDiv = results.querySelector('.side-item') as HTMLElement;
    expect(firstHitDiv).not.toBeNull();
    firstHitDiv.click();
    
    expect(openedHit).toBeDefined();
    expect((openedHit as any).segId).toBe(10);
  });

  it('initSearchPanel should show no results for unknown shard', async () => {
    const input = document.createElement('input');
    const results = document.createElement('div');
    
    initSearchPanel(input, results, () => {});

    input.value = "unknownword";
    input.dispatchEvent(new Event('input'));
    
    await new Promise(r => setTimeout(r, 400));
    
    expect(results.innerHTML).toContain('side-empty');
  });
});
