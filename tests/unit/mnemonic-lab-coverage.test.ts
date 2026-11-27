import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildReverseChoices,
  CHEMICAL_CHALLENGE_CITTA_IDS,
  computeChapterProgress,
  computeChapterProgressForLevel,
  computeChapterScopeProgress,
  computeMnemonicProgressSummary,
  computePeriodicProgress,
  computePhalanxGlobalProgress,
  computePhalanxMapProgress,
  computeProgressMetric,
  createInitialProgress,
  defaultNarySwitchesForChapter,
  defaultNarySwitchesForSubmatrix,
  defaultSwitchStateForFamily,
  detectOntologicalCollisions,
  evaluateChemicalSynthesis,
  evaluateNaryChallenge,
  getMasteryScoreForLevel,
  getNaryItemsForChapter,
  getPhalanxMapById,
  getSynthesizableCittas,
  hasMnemonicProgressData,
  loadMnemonicProgress,
  mergeMnemonicProgress,
  MNEMONIC_STORAGE_KEY,
  normalizeMnemonicProgress,
  pickNextBinaryChallenge,
  pickNextNaryChapterChallenge,
  pickNextPeriodicChallenge,
  pickNextPhalanxSlot,
  recordMnemonicAttempt,
  resolveCittaFromSwitches,
  saveMnemonicProgress,
} from '../../src/mnemonic-lab/engine.js';
import { CANONICAL_CITTAS_89, PHALANX_MAPS, type CittaFamilyId } from '../../src/mnemonic-lab/data.js';
import { getSubmatricesForChapter, type CanonicalChapterNum } from '../../src/mnemonic-lab/nary-chapters-data.js';
import { MnemonicLabUI } from '../../src/mnemonic-lab/ui.js';
import { VAULT_BROADCAST_CHANNEL } from '../../src/abhidhamma-srs/offline-store.js';

describe('src/mnemonic-lab/engine.ts & nary-chapters-data.ts (~100% coverage)', () => {
  beforeEach(() => localStorage.clear());

  it('covers progress persistence, normalization, merging, missedQueue adaptive SRS, and progress metrics', () => {
    expect(hasMnemonicProgressData(null)).toBe(false);
    expect(hasMnemonicProgressData(createInitialProgress())).toBe(false);

    // Corrupt localStorage
    localStorage.setItem(MNEMONIC_STORAGE_KEY, '{broken');
    expect(loadMnemonicProgress().totalAttempts).toBe(0);

    // Legacy migration without masteredByLevel
    const legacy = normalizeMnemonicProgress({
      level: 2,
      totalAttempts: 3,
      totalCorrect: 2,
      masteredBinary: { 'citta:1': 2 },
      missedQueue: ['citta:2', 123 as any],
    });
    expect(getMasteryScoreForLevel(legacy, 'citta:1', 1)).toBe(2);
    expect(getMasteryScoreForLevel({ ...createInitialProgress(), masteredByLevel: undefined, masteredBinary: { 'citta:1': 3 } }, 'citta:1', 1)).toBe(3);
    expect(getMasteryScoreForLevel(legacy, 'missing', 3)).toBe(0);

    // Record attempts across levels 1/2/3 and all 3 pillars (correct & wrong)
    let p = createInitialProgress();
    p = recordMnemonicAttempt(p, 'binary', 'citta:1', false, 1);
    expect(p.missedQueue).toContain('citta:1');
    // Odd totalAttempts surfaces missed item in pickNextBinaryChallenge
    expect(pickNextBinaryChallenge(p, 'all', 5, 121).id).toBe(1);
    p = recordMnemonicAttempt(p, 'binary', 'citta:1', true, 1);
    p = recordMnemonicAttempt(p, 'binary', 'citta:1', true, 2);
    p = recordMnemonicAttempt(p, 'binary', 'citta:1', true, 3);
    p = recordMnemonicAttempt(p, 'periodic', 'chem:1', true);
    p = recordMnemonicAttempt(p, 'phalanx', 'akusala12:1', true);

    // Nary missedQueue resurfacing
    let pNary = recordMnemonicAttempt(createInitialProgress(), 'binary', 'nary:cet:2', false);
    expect(pickNextNaryChapterChallenge(2, pNary, 'cet:1').id).toBe('cet:2');
    expect(pickNextNaryChapterChallenge(1 as any, pNary).chapter).toBe(2);

    // Merge progress (empty + non-empty, and two non-empty)
    const m1 = mergeMnemonicProgress(null, p);
    expect(m1.totalAttempts).toBe(p.totalAttempts);
    const m2 = mergeMnemonicProgress(p, null);
    expect(m2.totalAttempts).toBe(p.totalAttempts);
    const m3 = mergeMnemonicProgress(p, pNary);
    expect(m3.totalAttempts).toBeGreaterThanOrEqual(p.totalAttempts);

    // Save & reload
    saveMnemonicProgress(p);
    expect(loadMnemonicProgress().totalAttempts).toBe(p.totalAttempts);

    // Progress metrics edge cases (0, partial, 100%)
    expect(computeProgressMetric(0, 10).percent).toBe(0);
    expect(computeProgressMetric(1, 10).percent).toBe(10);
    expect(computeProgressMetric(10, 10).percent).toBe(100);
    expect(computeChapterProgress(p, 1, 89).mastered).toBe(1);
    expect(computeChapterProgressForLevel(p, 1, 2, 89).mastered).toBe(1);
    expect(computeChapterScopeProgress(p, 1, 'lobha', 89).mastered).toBe(1);
    expect(computeChapterScopeProgress(p, 2, 'sampayoga_52').total).toBeGreaterThan(0);
    expect(computePeriodicProgress(p).mastered).toBe(1);
    expect(computePhalanxMapProgress(p, 'akusala12').mastered).toBe(1);
    expect(computePhalanxGlobalProgress(p).mastered).toBe(1);

    // Full chapter mastered increments naryChaptersCompleted
    const ch4Items = getNaryItemsForChapter(4);
    const fullCh4: Record<string, number> = {};
    for (const it of ch4Items) fullCh4[`nary:${it.id}`] = 1;
    const summary = computeMnemonicProgressSummary({ ...p, masteredBinary: fullCh4 }, 89);
    expect(summary.naryChaptersCompleted).toBeGreaterThanOrEqual(1);
  });

  it('covers all families, all 9 collision rules, reverse choices, and submatrix defaults across Ch 1-9', () => {
    const families: CittaFamilyId[] = [
      'lobha', 'dosa', 'moha', 'ahetuka', 'kamasobhana', 'rupavacara', 'arupavacara', 'lokuttara',
    ];
    for (const fam of families) {
      const sw = defaultSwitchStateForFamily(fam);
      expect(resolveCittaFromSwitches(sw, 121)).not.toBeNull();
      expect(resolveCittaFromSwitches(sw, 89)).not.toBeNull();
      expect(getSynthesizableCittas(fam, 89).length).toBeGreaterThan(0);
    }
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily('ahetuka'), ahetukaSubgroup: 'kusala_vipaka', ahetukaSlot: 2 }, 89)).not.toBeNull();
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily('ahetuka'), ahetukaSubgroup: 'kiriya', ahetukaSlot: 1 }, 89)).not.toBeNull();
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily('lobha'), family: 'unknown' as any }, 89)).toBeNull();

    // All 9 ontological collision rules
    const lobha1 = CANONICAL_CITTAS_89.find((c) => c.id === 1)!; // asaṅkhārika
    const lobha5 = CANONICAL_CITTAS_89.find((c) => c.id === 5)!; // upekkhā (forbids pīti)
    const collisions = detectOntologicalCollisions(new Set([14, 28, 19, 20, 18, 21, 10, 27, 12, 25, 22, 23, 50, 51]), lobha5);
    expect(collisions.length).toBeGreaterThanOrEqual(7);
    const colAsank = detectOntologicalCollisions(new Set([25, 26]), lobha1);
    expect(colAsank.some((r) => r.id === 'thina_asankharika')).toBe(true);

    // Chemical synthesis: exact fixed, exact full, partial optional, invalid
    const lobha2 = CANONICAL_CITTAS_89.find((c) => c.id === 2)!; // sasaṅkhārika (has optional Thīna-Middha 25, 26)
    const resFixed = evaluateChemicalSynthesis(lobha2, new Set(lobha2.fixedCetasikas));
    expect(resFixed.isExactFixedMatch).toBe(true);
    const resOpt = evaluateChemicalSynthesis(lobha2, new Set([...lobha2.fixedCetasikas, ...lobha2.optionalCetasikas]));
    expect(resOpt.selectedOptional.length).toBeGreaterThan(0);
    const resFull = evaluateChemicalSynthesis(lobha1, new Set([...lobha1.fixedCetasikas, ...lobha1.optionalCetasikas]));
    expect(resFull.isExactFullSangahaMatch).toBe(true);
    const resBad = evaluateChemicalSynthesis(lobha1, new Set([1, 28]));
    expect(resBad.isValidConfiguration).toBe(false);
    expect(resBad.missingFixed.length).toBeGreaterThan(0);
    expect(resBad.extraForbidden.length).toBeGreaterThan(0);

    // Pickers & reverse choices (including non-matching currentId filter fallback)
    const p = createInitialProgress();
    expect(pickNextBinaryChallenge(p, 'all', 9999, 121).id).toBeTruthy();
    expect(pickNextPeriodicChallenge(p, CHEMICAL_CHALLENGE_CITTA_IDS[0]).id).toBeTruthy();
    expect(pickNextPeriodicChallenge(p, 9999).id).toBeTruthy();
    expect(pickNextPhalanxSlot(p, getPhalanxMapById(PHALANX_MAPS[0]!.id), 1).index).toBe(2);
    expect(pickNextPhalanxSlot(p, getPhalanxMapById(PHALANX_MAPS[0]!.id), 999).index).toBeTruthy();
    expect(pickNextNaryChapterChallenge(2, p, 'nonexistent_id').id).toBeTruthy();
    expect(defaultNarySwitchesForSubmatrix(2, 'all')).toEqual(defaultNarySwitchesForChapter(2));
    const rev = buildReverseChoices(
      CANONICAL_CITTAS_89[0]!,
      CANONICAL_CITTAS_89,
      4,
      (c) => String(c.id),
      (a, b) => (a.family === b.family ? 2 : 0),
      7
    );
    expect(rev.length).toBe(4);

    // Submatrices & default switches for every chapter 1..9
    for (let ch = 1 as CanonicalChapterNum; ch <= 9; ch = (ch + 1) as CanonicalChapterNum) {
      const sms = getSubmatricesForChapter(ch);
      if (ch >= 2) {
        expect(sms.length).toBeGreaterThan(0);
        expect(Object.keys(defaultNarySwitchesForChapter(ch)).length).toBeGreaterThan(0);
        for (const sm of sms) {
          const dsw = defaultNarySwitchesForSubmatrix(ch, sm.id);
          expect(Object.keys(dsw).length).toBeGreaterThan(0);
        }
        const item = getNaryItemsForChapter(ch)[0]!;
        expect(evaluateNaryChallenge(item, item.switches).isCorrect).toBe(true);
      }
    }
    expect(getNaryItemsForChapter(1 as any)).toEqual([]);
  });
});

describe('src/mnemonic-lab/ui.ts comprehensive fast UI coverage (all 3 pillars, 9 chapters, 3 languages)', () => {
  const origCreateUrl = URL.createObjectURL;
  const origRevokeUrl = URL.revokeObjectURL;

  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    URL.createObjectURL = vi.fn(() => 'blob:mnem');
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    URL.createObjectURL = origCreateUrl;
    URL.revokeObjectURL = origRevokeUrl;
  });

  it('exercises Pillar 1 (Ch 1-9, encode/reverse/synthesis, 89/121, levels 1-3), Pillar 2 (atlas & alchemy), Pillar 3 (5 phalanx maps & 3 modes), and vault backup', async () => {
    const origAlert = window.alert;
    window.alert = vi.fn();
    try {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, 'pt');
    ui.init();

    // Language switching pt -> en -> es -> pt (including same-lang no-op)
    ui.setLang('pt');
    ui.setLang('en');
    ui.setLang('es');
    ui.setLang('pt');

    // Level switching via #mnem-rigor-select and [data-set-level]
    const rigorSel = host.querySelector<HTMLSelectElement>('#mnem-rigor-select');
    if (rigorSel) {
      rigorSel.value = '2';
      rigorSel.dispatchEvent(new Event('change'));
    }
    host.querySelector<HTMLButtonElement>('[data-set-level="3"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-set-level="1"]')?.click();

    // Export & import backup (valid + invalid)
    host.querySelector<HTMLButtonElement>('#mnem-vault-export')?.click();
    const importInput = host.querySelector<HTMLInputElement>('#mnem-vault-file-input');
    if (importInput) {
      host.querySelector<HTMLButtonElement>('#mnem-vault-import')?.click();
      Object.defineProperty(importInput, 'files', {
        value: [{ text: async () => JSON.stringify({ schemaVersion: 1, updatedAt: Date.now(), states: {}, mnemonicLab: createInitialProgress() }) }],
        configurable: true,
      });
      importInput.dispatchEvent(new Event('change'));
      await new Promise((r) => setTimeout(r, 30));
      const importInput2 = host.querySelector<HTMLInputElement>('#mnem-vault-file-input');
      if (importInput2) {
        Object.defineProperty(importInput2, 'files', {
          value: [{ text: async () => 'INVALID' }],
          configurable: true,
        });
        importInput2.dispatchEvent(new Event('change'));
        await new Promise((r) => setTimeout(r, 30));
      }
    }

    // ── PILLAR 1: Chapter 1 Explore + Challenge + Reverse + Synthesis ──
    // Toggle 121 <-> 89
    host.querySelector<HTMLButtonElement>('#mnem-bin-mode-toggle')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-bin-mode-toggle')?.click();

    // Exercise all 8 families & their switches
    for (const fam of ['lobha', 'dosa', 'moha', 'ahetuka', 'kamasobhana', 'rupavacara', 'arupavacara', 'lokuttara']) {
      host.querySelector<HTMLButtonElement>(`[data-bin-family="${fam}"]`)?.click();
      host.querySelector<HTMLButtonElement>('[data-bin-jati="vipaka"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bit-vedana="0"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bit-cog="0"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bit-sank="0"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bit-moha="uddhacca"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-ahetuka-sub="kusala_vipaka"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-ahetuka-slot="1"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bin-jhana="3"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bin-arupa="2"]')?.click();
      host.querySelector<HTMLButtonElement>('[data-bin-magga="2"]')?.click();
    }
    host.querySelector<HTMLButtonElement>('[data-load-citta]')?.click();

    // Chapter 1 Challenge mode
    host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')?.click();
    const scopeSel = host.querySelector<HTMLSelectElement>('#mnem-bin-scope');
    if (scopeSel) {
      scopeSel.value = 'lobha';
      scopeSel.dispatchEvent(new Event('change'));
    }
    const autoAlign = host.querySelector<HTMLInputElement>('#mnem-bin-autoalign-toggle');
    if (autoAlign) {
      autoAlign.checked = false;
      autoAlign.dispatchEvent(new Event('change'));
    }
    host.querySelector<HTMLButtonElement>('[data-bin-family="dosa"]')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-bin-align-btn')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-bin-verify')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-bin-next')?.click();

    // Reverse drill on Chapter 1
    host.querySelector<HTMLButtonElement>('[data-nary-drill="reverse"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-reverse-choice]')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-reverse-next')?.click();

    // Synthesis drill (Mūla 0-9)
    host.querySelector<HTMLButtonElement>('[data-nary-drill="synthesis"]')?.click();
    const synAxes = host.querySelectorAll<HTMLButtonElement>('[data-syn-axis]');
    if (synAxes.length > 1) synAxes[1]?.click();
    host.querySelector<HTMLButtonElement>('[data-syn-choice]')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-syn-next')?.click();

    // Chapters 2..9: visit each chapter, click ALL submatrices, load item, verify, next, reverse
    for (let ch = 2; ch <= 9; ch++) {
      host.querySelector<HTMLButtonElement>(`[data-bin-chapter="${ch}"]`)?.click();
      const sms = getSubmatricesForChapter(ch as CanonicalChapterNum);
      for (const sm of sms) {
        host.querySelector<HTMLButtonElement>(`[data-nary-submatrix="${sm.id}"]`)?.click();
      }
      // Click up to 2 unpressed switch buttons via real DOM click
      const unpressed = Array.from(host.querySelectorAll<HTMLButtonElement>('[data-nary-key]')).filter(
        (b) => b.getAttribute('aria-pressed') !== 'true'
      );
      for (const b of unpressed.slice(0, 2)) {
        const key = b.dataset.naryKey;
        const val = b.dataset.naryVal;
        host.querySelector<HTMLButtonElement>(`[data-nary-key="${key}"][data-nary-val="${val}"]`)?.click();
      }
      host.querySelector<HTMLButtonElement>('[data-nary-load-item]')?.click();
      host.querySelector<HTMLButtonElement>('#mnem-nary-verify')?.click();
      host.querySelector<HTMLButtonElement>('#mnem-nary-next')?.click();
      // Also test wrong verify feedback
      host.querySelector<HTMLButtonElement>('#mnem-nary-verify')?.click();
      if (ch === 2 || ch === 6) {
        host.querySelector<HTMLButtonElement>('[data-nary-drill="reverse"]')?.click();
        host.querySelector<HTMLButtonElement>('[data-reverse-choice]')?.click();
        host.querySelector<HTMLButtonElement>('#mnem-reverse-next')?.click();
        host.querySelector<HTMLButtonElement>('[data-nary-drill="encode"]')?.click();
      }
    }

    // Fast exhaustive verification of formatNaryParamKey/Val, normalizeNarySwitches, renderNarySwitchControls, and formatCanonicalGroupName across ALL 767 canonical items (Ch 2..9)
    const uiAny = ui as any;
    const seenKeys = new Set<string>();
    const seenGroups = new Set<string>();
    for (let ch = 2 as CanonicalChapterNum; ch <= 9; ch = (ch + 1) as CanonicalChapterNum) {
      const items = getNaryItemsForChapter(ch);
      for (const item of items) {
        if (!seenGroups.has(item.primaryGroup)) {
          seenGroups.add(item.primaryGroup);
          expect(uiAny.formatCanonicalGroupName(item.primaryGroup)).toBeTruthy();
        }
        if (item.subGroup && !seenGroups.has(item.subGroup)) {
          seenGroups.add(item.subGroup);
          expect(uiAny.formatCanonicalGroupName(item.subGroup)).toBeTruthy();
        }
        const ctrlHtml = uiAny.renderNarySwitchControls(ch, item.switches);
        expect(ctrlHtml.length).toBeGreaterThan(20);
        for (const [k, v] of Object.entries(item.switches)) {
          const kvSig = `${ch}:${k}=${v}`;
          if (!seenKeys.has(kvSig)) {
            seenKeys.add(kvSig);
            expect(uiAny.formatNaryParamKey(k)).toBeTruthy();
            expect(uiAny.formatNaryParamVal(k, v)).toBeTruthy();
            const normalized = uiAny.normalizeNarySwitches(ch, item.switches, k, v);
            expect(normalized).toBeDefined();
          }
        }
      }
    }
    expect(uiAny.formatCanonicalGroupName(undefined)).toBe('—');
    expect(uiAny.formatNaryParamVal('unknown_key', undefined)).toBe('—');
    expect(uiAny.formatHetuPali(undefined)).toBe('—');
    expect(uiAny.stripPromptSpoilers('Test (spoiler hint)')).toBeTruthy();

    // Exercise Levels 2 & 3 rendering paths in Challenge & N-ary modes + EN/ES catalogue & synthesis strings
    host.querySelector<HTMLButtonElement>('[data-set-level="2"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="1"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-set-level="3"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="2"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-set-level="1"]')?.click();
    ui.setLang('en');
    host.querySelector<HTMLButtonElement>('[data-nary-drill="synthesis"]')?.click();
    ui.setLang('es');
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="2"]')?.click();
    ui.setLang('pt');

    // Pillar keyboard navigation (ArrowRight/ArrowLeft)
    const firstTab = host.querySelector<HTMLButtonElement>('.mnem-pillar-tab');
    firstTab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    firstTab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    // ── PILLAR 2: Periodic Table Atlas & Alchemy ──
    host.querySelector<HTMLButtonElement>('.mnem-pillar-tab[data-pillar="periodic"]')?.click();
    for (const flt of ['citta', 'neutral', 'akusala', 'sobhana', 'rupa', 'anipphanna', 'nibbana', 'all']) {
      host.querySelector<HTMLButtonElement>(`[data-per-filter="${flt}"]`)?.click();
    }
    host.querySelector<HTMLButtonElement>('[data-atom-num="73"]')?.click(); // Anipphanna
    host.querySelector<HTMLButtonElement>('[data-atom-num="54"]')?.click(); // Avinibbhoga rupa

    // Alchemy mode
    host.querySelector<HTMLButtonElement>('[data-per-mode="alchemy"]')?.click();
    for (const macro of ['univ7', 'pak6', 'aku4', 'sob19', 'vir3']) {
      host.querySelector<HTMLButtonElement>(`[data-chem-macro="${macro}"]`)?.click();
      host.querySelector<HTMLButtonElement>(`[data-chem-macro="${macro}"]`)?.click();
    }
    host.querySelector<HTMLButtonElement>('[data-chem-toggle="14"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-chem-toggle="28"]')?.click(); // collision
    host.querySelector<HTMLButtonElement>('#mnem-chem-verify')?.click(); // invalid
    host.querySelector<HTMLButtonElement>('#mnem-chem-clear')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-chem-hint')?.click();
    host.querySelector<HTMLButtonElement>('#mnem-chem-verify')?.click(); // valid
    host.querySelector<HTMLButtonElement>('#mnem-chem-next')?.click();

    // ── PILLAR 3: Phalanx Abacus (open, blind, sequence, all maps) ──
    host.querySelector<HTMLButtonElement>('.mnem-pillar-tab[data-pillar="phalanx"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="2"]')?.click();

    const mapSel = host.querySelector<HTMLSelectElement>('#mnem-pha-map-sel');
    if (mapSel) {
      for (const m of PHALANX_MAPS) {
        mapSel.value = m.id;
        mapSel.dispatchEvent(new Event('change'));
      }
      mapSel.value = 'akusala12';
      mapSel.dispatchEvent(new Event('change'));
    }

    // Blind mode: tap wrong & right
    host.querySelector<HTMLButtonElement>('[data-pha-mode="blind"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="1"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="2"]')?.click();

    // Sequence mode: tap wrong (2), then 1..12, then restart
    host.querySelector<HTMLButtonElement>('[data-pha-mode="sequence"]')?.click();
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="2"]')?.click(); // wrong
    for (let i = 1; i <= 12; i++) {
      host.querySelector<HTMLButtonElement>(`[data-phalanx-idx="${i}"]`)?.click();
    }
    host.querySelector<HTMLButtonElement>('#mnem-pha-restart-seq')?.click();

    // Close BroadcastChannel cleanly if present
    (ui as any).vaultChannel?.close?.();
    expect(host.innerHTML.length).toBeGreaterThan(100);
    expect(VAULT_BROADCAST_CHANNEL).toBeTruthy();
    } finally {
      window.alert = origAlert;
    }
  }, 30000);
});
