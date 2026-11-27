import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildLocalStorageSnapshot,
  fetchDeckWithOfflineCache,
  hydrateOfflineVault,
  mergeSnapshots,
  parseProgressBackup,
  persistMnemonicOfflineVault,
  persistOfflineProgress,
  requestPersistentStorage,
  resetOfflineVault,
  serializeProgressBackup,
  VAULT_BROADCAST_CHANNEL,
  type AnkiProgressSnapshot,
} from '../../src/abhidhamma-srs/offline-store.js';
import {
  buildEarlyReviewQueue,
  buildProgressiveCloze,
  buildStudyQueue,
  computeProportionalExtraBatch,
  createInitialAnkiCardState,
  DEFAULT_ANKI_CONFIG,
  formatIntervalDuration,
  loadAnkiCardStates,
  loadAnkiConfig,
  loadAnkiStats,
  loadMnemonicNotes,
  previewAnkiIntervals,
  saveAnkiCardStates,
  saveAnkiConfig,
  saveAnkiStats,
  scheduleAnkiCard,
} from '../../src/abhidhamma-srs/scheduler.js';
import { AbhidhammaSrsUI } from '../../src/abhidhamma-srs/ui.js';
import { settings } from '../../src/state.js';
import type { AbhidhammaCard, AbhidhammaDataset, AnkiCardState } from '../../src/abhidhamma-srs/types.js';

// ── In-memory mocks for IndexedDB, Cache API, OPFS, BroadcastChannel ─────────

function createMockIdb(options: { failOpen?: boolean; failTx?: boolean } = {}) {
  const stores: Record<string, Map<string, any>> = {
    snapshots: new Map(),
    review_log: new Map(),
  };

  const makeDb = () => ({
    objectStoreNames: {
      contains: (name: string) => name in stores,
    },
    createObjectStore: (name: string) => {
      if (!stores[name]) stores[name] = new Map();
      return { createIndex: () => {} };
    },
    close: () => {},
    transaction: (_names: string[], _mode: string) => {
      const tx: any = { oncomplete: null, onerror: null };
      tx.objectStore = (name: string) => {
        const map = stores[name] ?? (stores[name] = new Map());
        return {
          get: (key: string) => {
            const r: any = { result: map.get(key) };
            return r;
          },
          count: () => ({ result: map.size }),
          put: (val: any, key?: string) => {
            map.set(key ?? val.id ?? 'k', val);
          },
          clear: () => {
            map.clear();
          },
        };
      };
      queueMicrotask(() => {
        if (options.failTx) tx.onerror?.();
        else tx.oncomplete?.();
      });
      return tx;
    },
  });

  return {
    stores,
    idb: {
      open: () => {
        const req: any = { onupgradeneeded: null, onsuccess: null, onerror: null, result: null };
        queueMicrotask(() => {
          if (options.failOpen) {
            req.onerror?.();
            return;
          }
          req.result = makeDb();
          req.onupgradeneeded?.();
          req.onsuccess?.();
        });
        return req;
      },
    },
  };
}

function createMockCaches() {
  const buckets = new Map<string, Map<string, any>>();
  const getBucket = (name: string) => {
    if (!buckets.has(name)) buckets.set(name, new Map());
    return buckets.get(name)!;
  };
  return {
    buckets,
    caches: {
      open: async (name: string) => {
        const b = getBucket(name);
        return {
          match: async (key: string) => b.get(key),
          put: async (key: string, resp: any) => {
            b.set(key, resp);
          },
          delete: async (key: string) => b.delete(key),
        };
      },
      match: async (key: string) => {
        for (const b of buckets.values()) {
          if (b.has(key)) return b.get(key);
        }
        return undefined;
      },
    },
  };
}

function createMockOpfs() {
  const files = new Map<string, string>();
  const dir = {
    getFileHandle: async (name: string, opts?: { create?: boolean }) => {
      if (!files.has(name) && !opts?.create) throw new Error('NotFound');
      return {
        getFile: async () => ({ text: async () => files.get(name) ?? '' }),
        createWritable: async () => {
          let buf = '';
          return {
            write: async (s: string) => {
              buf = s;
            },
            close: async () => {
              files.set(name, buf);
            },
          };
        },
      };
    },
    removeEntry: async (name: string) => {
      files.delete(name);
    },
  };
  return {
    files,
    storage: {
      persisted: vi.fn(async () => false),
      persist: vi.fn(async () => true),
      getDirectory: vi.fn(async () => dir),
    },
  };
}

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];
  name: string;
  listeners: Array<(ev: MessageEvent) => void> = [];
  constructor(name: string) {
    this.name = name;
    MockBroadcastChannel.instances.push(this);
  }
  addEventListener(_type: string, cb: (ev: MessageEvent) => void) {
    this.listeners.push(cb);
  }
  postMessage(data: any) {
    for (const inst of MockBroadcastChannel.instances) {
      if (inst !== this && inst.name === this.name) {
        inst.listeners.forEach((cb) => cb({ data } as MessageEvent));
      }
    }
  }
  close() {
    MockBroadcastChannel.instances = MockBroadcastChannel.instances.filter((i) => i !== this);
  }
}

function buildRichDataset(): AbhidhammaDataset {
  const L = (s: string) => ({ pt: `${s} PT`, en: `${s} EN`, es: `${s} ES` });
  const cards: AbhidhammaCard[] = [
    {
      id: 'c-cloze',
      chapter: 1,
      tier: 'atom',
      axis: 'recitation',
      mode: 'cloze_pali',
      isGatha: true,
      categoryLabel: L('Gatha'),
      paliTerm: 'Tattha vuttābhidhammatthā',
      paliText: 'Tattha vuttābhidhammatthā catudhā paramatthato',
      prompt: L('Recite gatha'),
      answer: L('Citta Cetasika Rupa Nibbana'),
      mechanics: L('Translation of gatha'),
      source: { as: 'I.2', cma: 'I.2', segId: 10 },
      requires: [],
    },
    {
      id: 'c-seq',
      chapter: 1,
      tier: 'atom',
      mode: 'sequence',
      categoryLabel: L('Sequence'),
      paliTerm: L('Sequence Term'),
      prompt: L('Order the steps'),
      answer: L('Step 1 -> Step 2 -> Step 3'),
      sequenceItems: [L('First'), L('Second'), L('Third')],
      source: { as: 'I.3', segId: 950 },
      requires: [],
    },
    {
      id: 'c-enum',
      chapter: 1,
      tier: 'atom',
      mode: 'enumeration',
      categoryLabel: L('Enumeration'),
      paliTerm: 'Cattāro Paramatthā',
      prompt: L('List all 4'),
      answer: L('Citta, Cetasika, Rūpa, Nibbāna'),
      checklist: [L('Citta'), L('Cetasika')],
      mathStructure: L('1 + 52 + 28 + 1'),
      source: { as: 'I.2' },
      requires: [],
    },
    {
      id: 'c-fourfold',
      chapter: 1,
      tier: 'atom',
      mode: 'checksum',
      categoryLabel: L('Fourfold'),
      paliTerm: 'Phassa',
      prompt: L('Fourfold definition'),
      answer: L('Contact'),
      characteristics: {
        lakkhana: L('Touching'),
        rasa: L('Impingement'),
        paccupatthana: L('Concurrence'),
        padatthana: L('Object'),
      },
      mechanics: L('Universal mental factor'),
      source: { cma: 'II.2' },
      requires: [],
    },
    {
      id: 'c-confusable',
      chapter: 1,
      tier: 'structure',
      mode: 'confusable',
      categoryLabel: L('Confusable'),
      paliTerm: 'Sati vs Saññā',
      prompt: L('Distinguish'),
      answer: L('Mindfulness vs Perception'),
      source: {},
      requires: [],
    },
    {
      id: 'c-house',
      chapter: 1,
      tier: 'house',
      categoryLabel: L('Synthesis'),
      paliTerm: 'Cittasaṅgaha',
      prompt: L('Total cittas'),
      answer: L('89 / 121'),
      source: { as: 'I.28' },
      requires: [],
    },
    {
      id: 'c-ch2-locked',
      chapter: 2,
      tier: 'atom',
      categoryLabel: L('Ch2'),
      paliTerm: 'Cetasika',
      prompt: L('Total cetasikas'),
      answer: L('52'),
      source: { as: 'II.1' },
      requires: ['c-cloze'],
    },
  ];
  return {
    version: 1,
    chapters: [
      {
        chapter: 1,
        paliTitle: 'Cittasaṅgaha',
        title: L('Compendium of Consciousness'),
        subtitle: L('89/121 Cittas'),
        unlockPrevAtomPct: 0,
        houseUnlockAtomPct: 50,
      },
      {
        chapter: 2,
        paliTitle: 'Cetasikasaṅgaha',
        title: L('Compendium of Mental Factors'),
        subtitle: L('52 Cetasikas'),
        unlockPrevAtomPct: 80,
        houseUnlockAtomPct: 80,
      },
    ],
    cards,
  };
}

describe('abhidhamma-srs offline-store.ts (all 4 layers & edge cases)', () => {
  const origIdb = (globalThis as any).indexedDB;
  const origCaches = (globalThis as any).caches;
  const origStorage = (navigator as any).storage;
  const origBC = (globalThis as any).BroadcastChannel;
  const origFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    MockBroadcastChannel.instances = [];
    (globalThis as any).BroadcastChannel = MockBroadcastChannel;
  });

  afterEach(() => {
    (globalThis as any).indexedDB = origIdb;
    (globalThis as any).caches = origCaches;
    Object.defineProperty(navigator, 'storage', { value: origStorage, configurable: true, writable: true });
    (globalThis as any).BroadcastChannel = origBC;
    globalThis.fetch = origFetch;
  });

  it('hydrates, persists, auto-heals, merges, and resets across localStorage + IDB + Cache API + OPFS', async () => {
    const idbMock = createMockIdb();
    const cacheMock = createMockCaches();
    const opfsMock = createMockOpfs();
    (globalThis as any).indexedDB = idbMock.idb;
    (globalThis as any).caches = cacheMock.caches;
    Object.defineProperty(navigator, 'storage', { value: opfsMock.storage, configurable: true, writable: true });

    const now = 1_700_000_000_000;
    const cardState: AnkiCardState = {
      ...createInitialAnkiCardState('c-1'),
      phase: 'review',
      reps: 3,
      lapses: 1,
      intervalDays: 7,
      lastReviewAt: now,
      dueAt: now + 7 * 86_400_000,
    };

    const snap = await persistOfflineProgress(
      { 'c-1': cardState },
      { totalReviewed: 5, reviewedToday: 2, correctToday: 2, newStudiedToday: 1, streak: 3, lastSessionDate: '2026-01-01' },
      { ...DEFAULT_ANKI_CONFIG, paceTargetMs: now + 30 * 86_400_000 },
      { 'c-1': 'my mnemonic' },
      [],
      {
        id: 'log-1',
        cardId: 'c-1',
        rating: 3,
        phaseBefore: 'learning',
        phaseAfter: 'review',
        intervalDays: 7,
        easeFactor: 2.5,
        timestamp: now,
        offline: false,
      },
      now
    );
    expect(snap.reviewLogCount).toBe(5);
    expect(idbMock.stores.snapshots.has('latest')).toBe(true);
    expect(opfsMock.files.size).toBe(1);

    // Clear localStorage -> hydrate recovers & auto-heals from IDB/Cache/OPFS
    localStorage.clear();
    const h1 = await hydrateOfflineVault(now);
    expect(h1.status.activeLayers).toBe(4);
    expect(h1.status.persistent).toBe(true);
    expect(h1.snapshot.states['c-1']?.reps).toBe(3);

    // Persisted already true branch
    opfsMock.storage.persisted.mockResolvedValueOnce(true);
    expect(await requestPersistentStorage()).toBe(true);

    // persistMnemonicOfflineVault merges with existing layers
    const ok = await persistMnemonicOfflineVault({
      level: 2,
      streak: 4,
      bestStreak: 6,
      totalCorrect: 10,
      totalAttempts: 12,
      masteredBinary: { 'citta:1': 2 },
      masteredPeriodic: {},
      masteredPhalanx: {},
    });
    expect(ok).toBe(true);

    // Reset clears IDB, Cache, OPFS
    await resetOfflineVault();
    expect(idbMock.stores.snapshots.size).toBe(0);
    expect(opfsMock.files.size).toBe(0);

    // Hydrate with empty layers
    localStorage.clear();
    const hEmpty = await hydrateOfflineVault(now);
    expect(hEmpty.status.recoveredFrom).toBeNull();

    // Also test IDB transaction failure paths (failTx: true) on persistOfflineProgress & resetOfflineVault
    (globalThis as any).indexedDB = createMockIdb({ failTx: true }).idb;
    await persistOfflineProgress({ 'c-1': cardState }, hEmpty.snapshot.stats, DEFAULT_ANKI_CONFIG, {}, []);
    await resetOfflineVault();
  });

  it('handles mergeSnapshots tie-breakers, parseProgressBackup validation, and fetchDeckWithOfflineCache fallbacks', async () => {
    const cacheMock = createMockCaches();
    (globalThis as any).caches = cacheMock.caches;

    const baseState = createInitialAnkiCardState('c-1');
    const a: AnkiProgressSnapshot = {
      schemaVersion: 1,
      updatedAt: 1000,
      states: {
        'c-1': { ...baseState, lastReviewAt: 1000, reps: 2, lapses: 1 },
        'c-2': { ...baseState, id: 'c-2', lastReviewAt: 1000, reps: 3, lapses: 2 },
      },
      stats: { totalReviewed: 4, reviewedToday: 2, correctToday: 1, newStudiedToday: 1, streak: 2, lastSessionDate: '2026-01-01' },
      config: { ...DEFAULT_ANKI_CONFIG, paceTargetMs: 0 },
      mnemonics: { 'c-1': 'older' },
      reviewLogCount: 4,
      recentLog: [],
    };
    const b: AnkiProgressSnapshot = {
      schemaVersion: 1,
      updatedAt: 2000,
      states: {
        'c-1': { ...baseState, lastReviewAt: 1000, reps: 4, lapses: 0 },
        'c-2': { ...baseState, id: 'c-2', lastReviewAt: 1000, reps: 3, lapses: 5 },
        'c-3': { ...baseState, id: 'c-3', lastReviewAt: 2000, reps: 1, lapses: 0 },
      },
      stats: { totalReviewed: 6, reviewedToday: 3, correctToday: 3, newStudiedToday: 2, streak: 4, lastSessionDate: '2026-01-02' },
      config: { ...DEFAULT_ANKI_CONFIG, paceTargetMs: 5000 },
      mnemonics: { 'c-1': 'newer' },
      reviewLogCount: 6,
      recentLog: [],
    };

    const merged = mergeSnapshots(a, b);
    expect(merged.states['c-1']?.reps).toBe(4);
    expect(merged.states['c-2']?.lapses).toBe(5);
    expect(merged.states['c-3']?.reps).toBe(1);
    expect(merged.mnemonics['c-1']).toBe('newer');
    expect(merged.stats.lastSessionDate).toBe('2026-01-02');
    expect(merged.config.paceTargetMs).toBe(5000);

    // Same day merge
    const mergedSameDay = mergeSnapshots(a, { ...b, stats: { ...b.stats, lastSessionDate: '2026-01-01' }, updatedAt: 500 });
    expect(mergedSameDay.stats.reviewedToday).toBe(3);

    // Serialize & parse backup
    const raw = serializeProgressBackup(merged);
    const parsed = parseProgressBackup(raw);
    expect(parsed.schemaVersion).toBe(1);
    expect(() => parseProgressBackup('{"schemaVersion":2}')).toThrow(/Invalid/);
    expect(() => parseProgressBackup('{"schemaVersion":1}')).toThrow(/Missing card states/);

    // fetchDeckWithOfflineCache: network success caches it, then network fail reads from cache
    const payload = { version: 1, chapters: [], cards: [] };
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 })) as any;
    const netRes = await fetchDeckWithOfflineCache<typeof payload>('data/srs/abhidhamma_cards.json');
    expect(netRes.version).toBe(1);

    globalThis.fetch = vi.fn(async () => {
      throw new Error('offline');
    }) as any;
    const cachedRes = await fetchDeckWithOfflineCache<typeof payload>('data/srs/abhidhamma_cards.json');
    expect(cachedRes.version).toBe(1);

    // When both network and cache miss -> throws
    await expect(fetchDeckWithOfflineCache('data/srs/missing.json')).rejects.toThrow(/Failed to load/);

    // Error resilience when IDB fails to open / tx errors
    (globalThis as any).indexedDB = createMockIdb({ failOpen: true }).idb;
    expect((await hydrateOfflineVault()).status.hasIdb).toBe(false);
    (globalThis as any).indexedDB = createMockIdb({ failTx: true }).idb;
    const hTxErr = await hydrateOfflineVault();
    expect(hTxErr.status.hasIdb).toBe(true);
    expect(buildLocalStorageSnapshot().schemaVersion).toBe(1);
  });
});

describe('abhidhamma-srs scheduler.ts edge branches', () => {
  beforeEach(() => localStorage.clear());

  it('covers concepts/recitation/leeches filters, dueLearning, learnAhead, early review, and corrupt storage', () => {
    const ds = buildRichDataset();
    const now = 1_700_000_000_000;
    const states: Record<string, AnkiCardState> = {
      'c-cloze': { ...createInitialAnkiCardState('c-cloze'), phase: 'learning', dueAt: now - 1000, reps: 1 },
      'c-seq': { ...createInitialAnkiCardState('c-seq'), phase: 'learning', dueAt: now + 60_000, reps: 1 },
      'c-enum': { ...createInitialAnkiCardState('c-enum'), phase: 'review', dueAt: now - 1000, intervalDays: 3, reps: 2, lapses: 8 },
      'c-fourfold': { ...createInitialAnkiCardState('c-fourfold'), phase: 'review', dueAt: now + 5 * 86_400_000, intervalDays: 10, reps: 4 },
    };
    const stats = loadAnkiStats(now);

    const qAll = buildStudyQueue(ds.chapters, ds.cards, states, stats, DEFAULT_ANKI_CONFIG, null, now, 'all');
    expect(qAll.dueLearning.length).toBe(1);
    expect(qAll.learnAhead.length).toBe(1);
    expect(qAll.dueReview.length).toBe(1);

    const qConcepts = buildStudyQueue(ds.chapters, ds.cards, states, stats, DEFAULT_ANKI_CONFIG, null, now, 'concepts');
    expect(qConcepts.dueLearning.length).toBe(0);

    const qRec = buildStudyQueue(ds.chapters, ds.cards, states, stats, DEFAULT_ANKI_CONFIG, null, now, 'recitation');
    expect(qRec.dueLearning.length).toBe(1);

    const qLeeches = buildStudyQueue(ds.chapters, ds.cards, states, stats, DEFAULT_ANKI_CONFIG, null, now, 'leeches');
    expect(qLeeches.dueReview.length).toBe(1);

    const early = buildEarlyReviewQueue(ds.chapters, ds.cards, states, null, 10, now);
    expect(early.length).toBeGreaterThan(0);
    const earlyScoped = buildEarlyReviewQueue(ds.chapters, ds.cards, states, 1, 10, now);
    expect(earlyScoped.length).toBeGreaterThan(0);

    const extra = computeProportionalExtraBatch(ds.chapters, ds.cards, states, null, now, stats);
    expect(extra.hasMoreNew || extra.hasReviewable).toBe(true);

    // Progressive cloze stages 1/2/3, edge tokens, & interval previews in all langs
    expect(buildProgressiveCloze('', 1)).toBe('');
    expect(buildProgressiveCloze('ca ti.', 1)).toBe('ca _____.');
    expect(buildProgressiveCloze('a / ...', 1)).toContain('/');
    expect(buildProgressiveCloze('a / ...', 2)).toBe('a / ...');
    expect(buildProgressiveCloze('Tattha vuttābhidhammatthā catudhā paramatthato', 1)).toContain('_');
    expect(buildProgressiveCloze('Tattha vuttābhidhammatthā catudhā paramatthato', 2)).toContain('…');
    expect(buildProgressiveCloze('Tattha vuttābhidhammatthā catudhā paramatthato', 3)).toBeTruthy();
    for (const lang of ['pt', 'en', 'es'] as const) {
      expect(formatIntervalDuration(60 * 86_400_000, lang)).toBeTruthy();
      expect(formatIntervalDuration(400 * 86_400_000, lang)).toBeTruthy();
      const ivs = previewAnkiIntervals(states['c-enum']!, lang, now, DEFAULT_ANKI_CONFIG);
      expect(ivs[1]).toBeTruthy();
      expect(ivs[4]).toBeTruthy();
    }

    // Corrupt & non-object localStorage fallback
    localStorage.setItem('atp.abhidhamma.anki.cards.v1', 'null');
    expect(loadAnkiCardStates()).toEqual({});
    localStorage.setItem('atp.abhidhamma.anki.mnemonics.v1', '123');
    expect(loadMnemonicNotes()).toEqual({});
    localStorage.setItem('atp.abhidhamma.anki.cards.v1', '{bad');
    localStorage.setItem('atp.abhidhamma.anki.stats.v1', '{bad');
    localStorage.setItem('atp.abhidhamma.anki.config.v1', '{bad');
    localStorage.setItem('atp.abhidhamma.anki.mnemonics.v1', '{bad');
    expect(loadAnkiCardStates()).toEqual({});
    expect(loadAnkiStats(now).totalReviewed).toBe(0);
    expect(loadAnkiConfig().newCardsPerDay).toBeGreaterThan(0);
    expect(loadMnemonicNotes()).toEqual({});

    // Relearning schedule path (ratings 1, 2, 3 multi-step, 3 graduate, 4 easy)
    const lapsed = scheduleAnkiCard(states['c-enum']!, 1, now, DEFAULT_ANKI_CONFIG);
    expect(lapsed.phase).toBe('relearning');
    expect(scheduleAnkiCard(lapsed, 1, now, DEFAULT_ANKI_CONFIG).phase).toBe('relearning');
    const hardGrad = scheduleAnkiCard(lapsed, 2, now, DEFAULT_ANKI_CONFIG);
    expect(hardGrad.reps).toBeGreaterThan(0);
    const multiRelearnCfg = { ...DEFAULT_ANKI_CONFIG, relearningStepsMin: [10, 30] };
    const step1 = scheduleAnkiCard(lapsed, 3, now, multiRelearnCfg);
    expect(step1.phase).toBe('relearning');
    expect(scheduleAnkiCard(step1, 3, now, multiRelearnCfg).phase).toBe('review');
    expect(scheduleAnkiCard(lapsed, 4, now, DEFAULT_ANKI_CONFIG).phase).toBe('review');

    // formatIntervalDuration: hours (<24h), months (<365d), years (>=365d) in pt/es/en
    const highIntervalState = {
      ...states['c-enum']!,
      phase: 'review' as const,
      intervalDays: 200,
      easeFactor: 2.5,
      dueAt: now - 1000,
    };
    const multiStepLearnState = {
      ...createInitialAnkiCardState('c-enum'),
      phase: 'learning' as const,
      step: 0,
    };
    const hourCfg = { ...DEFAULT_ANKI_CONFIG, learningStepsMin: [60, 180], maxIntervalDays: 9999 };
    for (const lang of ['pt', 'en', 'es'] as const) {
      const ivHour = previewAnkiIntervals(multiStepLearnState, lang, now, hourCfg);
      expect(ivHour[2]).toContain('h');
      const ivMonthYear = previewAnkiIntervals(highIntervalState, lang, now, hourCfg);
      expect(ivMonthYear[2]).toBeTruthy();
      expect(ivMonthYear[4]).toBeTruthy();
    }

    // buildStudyQueue with 2+ dueLearning and 2+ learnAhead cards to exercise sort comparators
    const sortStates: Record<string, AnkiCardState> = {
      'c-cloze': { ...createInitialAnkiCardState('c-cloze'), phase: 'learning', dueAt: now - 1000 },
      'c-enum': { ...createInitialAnkiCardState('c-enum'), phase: 'learning', dueAt: now - 2000 },
      'c-seq': { ...createInitialAnkiCardState('c-seq'), phase: 'learning', dueAt: now + 60_000 },
      'c-fourfold': { ...createInitialAnkiCardState('c-fourfold'), phase: 'learning', dueAt: now + 30_000 },
    };
    const sortedQ = buildStudyQueue(ds.chapters, ds.cards, sortStates, stats, DEFAULT_ANKI_CONFIG, null, now);
    expect(sortedQ.dueLearning.length).toBe(2);
    expect(sortedQ.learnAhead.length).toBe(2);
  });
});

describe('abhidhamma-srs ui.ts (full interactive coverage)', () => {
  const origFetch = globalThis.fetch;
  const origConfirm = window.confirm;
  const origCreateUrl = URL.createObjectURL;
  const origRevokeUrl = URL.revokeObjectURL;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    MockBroadcastChannel.instances = [];
    (globalThis as any).BroadcastChannel = MockBroadcastChannel;
    URL.createObjectURL = vi.fn(() => 'blob:mock');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    window.confirm = origConfirm;
    URL.createObjectURL = origCreateUrl;
    URL.revokeObjectURL = origRevokeUrl;
  });

  it('exercises all overview controls, study card modes, keyboard shortcuts, vault import/export, and offline events', async () => {
    const ds = buildRichDataset();
    // Seed a leech so leech badge & filter render
    saveAnkiCardStates({
      'c-confusable': {
        ...createInitialAnkiCardState('c-confusable'),
        phase: 'review',
        lapses: 8,
        reps: 2,
        intervalDays: 1,
        dueAt: Date.now() + 86_400_000,
      },
    });
    saveAnkiStats({
      totalReviewed: 5,
      reviewedToday: 2,
      correctToday: 1,
      newStudiedToday: 0,
      streak: 1,
      lastSessionDate: new Date().toISOString().slice(0, 10),
    });

    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify(ds), { status: 200 })) as any;

    const overlay = document.createElement('div');
    overlay.id = 'reader-srs';
    overlay.style.display = 'flex';
    const host = document.createElement('div');
    overlay.appendChild(host);
    document.body.appendChild(overlay);

    const ui = new AbhidhammaSrsUI(host, 'pt');
    await ui.init();

    // Language switch & languageChanged event
    ui.setLang('en');
    settings.uiLang = 'es';
    window.dispatchEvent(new Event('languageChanged'));
    expect(host.textContent).toContain('Abhidhammatthasaṅgaha');

    // Switch to Plan 90 track, change horizon 30 -> 60 -> 90, restart plan90 (cancel & confirm)
    host.querySelector<HTMLButtonElement>('[data-track="plan90"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-horizon="30"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-horizon="60"]')?.click();
    window.confirm = vi.fn(() => false);
    host.querySelector<HTMLButtonElement>('.abhi-btn-restart-plan90')?.click();
    window.confirm = vi.fn(() => true);
    host.querySelector<HTMLButtonElement>('.abhi-btn-restart-plan90')?.click();

    // Clinical grading toggle (off -> 4 buttons, then back on)
    host.querySelector<HTMLButtonElement>('.abhi-btn-clinical-toggle')?.click();

    // Limit selector: auto-90 and fixed 8
    const limitSel = host.querySelector<HTMLSelectElement>('.abhi-limit-select')!;
    limitSel.value = 'auto-90';
    limitSel.dispatchEvent(new Event('change'));
    const limitSel2 = host.querySelector<HTMLSelectElement>('.abhi-limit-select')!;
    limitSel2.value = '8';
    limitSel2.dispatchEvent(new Event('change'));

    // Export vault button
    host.querySelector<HTMLButtonElement>('.abhi-btn-export-vault')?.click();
    expect(URL.createObjectURL).toHaveBeenCalled();

    // Import vault (valid & invalid JSON)
    const fileInput = host.querySelector<HTMLInputElement>('.abhi-vault-file-input')!;
    host.querySelector<HTMLButtonElement>('.abhi-btn-import-vault')?.click();
    const validBackup = serializeProgressBackup(buildLocalStorageSnapshot());
    Object.defineProperty(fileInput, 'files', {
      value: [{ text: async () => validBackup }],
      configurable: true,
    });
    fileInput.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 20));
    expect(host.querySelector('.abhi-vault-notice')).not.toBeNull();

    const fileInput2 = host.querySelector<HTMLInputElement>('.abhi-vault-file-input')!;
    Object.defineProperty(fileInput2, 'files', {
      value: [{ text: async () => 'NOT_JSON' }],
      configurable: true,
    });
    fileInput2.dispatchEvent(new Event('change'));
    await new Promise((r) => setTimeout(r, 20));

    // Offline / online / visibilitychange / BroadcastChannel events
    window.dispatchEvent(new Event('offline'));
    window.dispatchEvent(new Event('online'));
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const peer = new MockBroadcastChannel(VAULT_BROADCAST_CHANNEL);
    peer.postMessage({ type: 'vault-updated' });
    peer.close();
    await new Promise((r) => setTimeout(r, 10));

    // Study leeches filter
    host.querySelector<HTMLButtonElement>('[data-filter="leeches"]')?.click();
    expect(host.querySelector('.abhi-flashcard')).not.toBeNull();
    // Flip via keyboard Space, rate via keyboard 3 (classic 4-button mode)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(host.querySelector('.abhi-leech-box')).not.toBeNull();
    const mnemInput = host.querySelector<HTMLTextAreaElement>('.abhi-mnemonic-input');
    if (mnemInput) {
      mnemInput.value = 'Remember mindfulness';
      mnemInput.dispatchEvent(new Event('input'));
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }));
    // Return to overview
    host.querySelector<HTMLButtonElement>('.abhi-btn-back')?.click();

    // Study Chapter 1 to walk through sequence, enumeration, fourfold, cloze_pali
    host.querySelector<HTMLButtonElement>('[data-track="chapters"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-study-chapter="1"]')?.click();

    for (let step = 0; step < 6; step++) {
      if (!host.querySelector('.abhi-flashcard')) break;
      // Cloze stage switching
      host.querySelector<HTMLButtonElement>('[data-cloze-stage="2"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-cloze-stage="3"]')?.click();
      // Sequence picking, removing, clearing, re-picking
      const seqPicks = host.querySelectorAll<HTMLButtonElement>('[data-seq-pick]');
      if (seqPicks.length >= 2) {
        seqPicks[0]?.click();
        host.querySelector<HTMLButtonElement>('[data-seq-remove="0"]')?.click();
        host.querySelector<HTMLButtonElement>('[data-seq-pick]')?.click();
        host.querySelector<HTMLButtonElement>('.abhi-seq-clear')?.click();
        host.querySelectorAll<HTMLButtonElement>('[data-seq-pick]').forEach((b) => b.click());
      }
      // Fourfold inputs
      host.querySelectorAll<HTMLInputElement>('[data-fourfold]').forEach((inp) => {
        inp.value = 'test recall';
      });
      // Textarea recall draft
      const ta = host.querySelector<HTMLTextAreaElement>('.abhi-recall-input');
      if (ta) {
        ta.value = 'my draft';
        ta.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      }
      // Reveal
      host.querySelector<HTMLButtonElement>('.abhi-btn-reveal')?.click();
      // Enumeration checkboxes
      host.querySelectorAll<HTMLInputElement>('[data-enum-idx]').forEach((cb) => {
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
      });
      // Open mnemonic editor if collapsed
      host.querySelector<HTMLButtonElement>('.abhi-btn-open-mnemonic')?.click();
      // Rate Easy (4) or Good (3)
      const rateBtn = host.querySelector<HTMLButtonElement>('.abhi-rate-btn[data-rate="4"]')
        ?? host.querySelector<HTMLButtonElement>('.abhi-rate-btn[data-rate="3"]');
      rateBtn?.click();
    }

    // Complete screen actions: more-new, review-ahead & back-main
    host.querySelector<HTMLButtonElement>('.abhi-btn-more-new')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-back')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-study-all')?.click();
    // Test clinical mode keyboard shortcuts (1 and 2/3)
    host.querySelector<HTMLButtonElement>('.abhi-btn-back')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-clinical-toggle')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-study-all')?.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    host.querySelector<HTMLButtonElement>('.abhi-btn-back-main')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-review-ahead')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-back')?.click();

    // Study plan90 dose & review-ahead-plan90
    host.querySelector<HTMLButtonElement>('[data-track="plan90"]')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-review-ahead-plan90')?.click();
    host.querySelector<HTMLButtonElement>('.abhi-btn-back')?.click();

    // Reset progress (cancel then confirm)
    window.confirm = vi.fn(() => false);
    host.querySelector<HTMLButtonElement>('.abhi-btn-reset')?.click();
    window.confirm = vi.fn(() => true);
    host.querySelector<HTMLButtonElement>('.abhi-btn-reset')?.click();

    // Error state on init
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as any;
    const hostErr = document.createElement('div');
    const uiErr = new AbhidhammaSrsUI(hostErr, 'en');
    await uiErr.init();
    expect(hostErr.querySelector('.abhi-srs-empty')).not.toBeNull();
  });
});
