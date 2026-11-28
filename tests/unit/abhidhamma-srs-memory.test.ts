import { beforeEach, describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  buildEarlyReviewQueue,
  buildProgressiveCloze,
  buildStudyQueue,
  computeAllChapterProgress,
  computeDailyNewQuota,
  computePlan90Summary,
  computeProportionalExtraBatch,
  countDueCards,
  createInitialAnkiCardState,
  createInitialAnkiStats,
  DAY_MS,
  DEFAULT_ANKI_CONFIG,
  defaultClozeStage,
  ensurePaceTarget,
  getMaxIntervalForHorizon,
  getReserveDaysForHorizon,
  interleaveByChapter,
  isLeech,
  isRecitationCard,
  isReviewDue,
  loadMnemonicNotes,
  MAX_NEW_CARDS_PER_DAY,
  MAX_REVIEWS_PER_DAY,
  normalizeAnkiConfig,
  PACE_DEFAULT_HORIZON_DAYS,
  PACE_MAX_NEW,
  PACE_MIN_NEW,
  PACE_RESERVE_DAYS,
  saveMnemonicNote,
  scheduleAnkiCard,
  setPaceHorizon,
} from "../../src/abhidhamma-srs/scheduler.js";
import { AbhidhammaSrsUI } from "../../src/abhidhamma-srs/ui.js";
import {
  fetchDeckWithOfflineCache,
  hydrateOfflineVault,
  mergeSnapshots,
  parseProgressBackup,
  persistMnemonicOfflineVault,
  persistOfflineProgress,
  resetOfflineVault,
  serializeProgressBackup,
  type AnkiProgressSnapshot,
  type AnkiReviewLogEntry,
} from "../../src/abhidhamma-srs/offline-store.js";
import { createInitialProgress, recordMnemonicAttempt } from "../../src/mnemonic-lab/engine.js";
import { MnemonicLabUI } from "../../src/mnemonic-lab/ui.js";
import type { AbhidhammaDataset, AnkiCardState } from "../../src/abhidhamma-srs/types.js";

const ROOT = path.resolve(__dirname, "../..");
const dataset = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/srs/abhidhamma_cards.json"), "utf8")
) as AbhidhammaDataset;

describe("Baralho 100% Conceitual, Listas e Construção Matemática (sem recitação literal)", () => {
  it("não contém flashcards de recitação literal em Pāli e mantém os 5 átomos do Cap. 0", () => {
    const rec = dataset.cards.filter(isRecitationCard);
    expect(rec.length).toBe(0);
    expect(dataset.cards.every((c) => c.mode !== "cloze_pali")).toBe(true);
    const ch0Atoms = dataset.cards.filter((c) => c.chapter === 0 && c.tier === "atom");
    expect(ch0Atoms.length).toBe(5);
    expect(dataset.cards.length).toBeGreaterThanOrEqual(350);
  });

  it("cobre conceitos e estruturas matemáticas de todos os capítulos (incl. Cap. 5, 6, 7 e 9)", () => {
    const ids = new Set(dataset.cards.map((c) => c.id));
    expect(ids.has("c5.math_rupa16_planes")).toBe(true);
    expect(ids.has("c5.math_patisandhi_4_and_death_4")).toBe(true);
    expect(ids.has("c6.math_rupavibhaga_progression")).toBe(true);
    expect(ids.has("c6.math_kalapa_21_formula")).toBe(true);
    expect(ids.has("c7.math_akusala9_missaka7")).toBe(true);
    expect(ids.has("c9.math_carita6_jhana_map40")).toBe(true);
    expect(ids.has("c9.enum_vasita5_abhinna5_ariya8")).toBe(true);
  });

  it("mantém helper buildProgressiveCloze consistente caso usado no futuro", () => {
    const sample = "Cittaṃ cetasikaṃ rūpaṃ, nibbānamiti sabbathā.";
    expect(buildProgressiveCloze(sample, 1)).toContain("_____");
    expect(buildProgressiveCloze(sample, 2)).toContain("C…");
    expect(buildProgressiveCloze(sample, 3)).toContain("[5]");
    expect(defaultClozeStage(undefined)).toBe(1);
    expect(defaultClozeStage({ ...createInitialAnkiCardState("x"), reps: 1 })).toBe(2);
    expect(defaultClozeStage({ ...createInitialAnkiCardState("x"), reps: 2 })).toBe(3);
  });
});

describe("Construção Matemática das Listas & Cartas de Produção", () => {
  it("anexa mathStructure trilíngue a todas as listas canônicas principais (89 cittas, 52 cetasikas, 28 rūpas, 12 nidānas, 24 paccayas)", () => {
    const withMath = dataset.cards.filter((c) => Boolean(c.mathStructure));
    expect(withMath.length).toBeGreaterThanOrEqual(250);
    for (const c of withMath) {
      for (const lang of ["pt", "en", "es"] as const) {
        expect(c.mathStructure![lang].trim().length).toBeGreaterThan(10);
      }
    }
    const citta1 = dataset.cards.find((c) => c.id === "c1.citta_01")!;
    expect(citta1.mathStructure!.pt).toContain("2×2×2 = 8");
    const rupa25 = dataset.cards.find((c) => c.id === "c6.rupa_25")!;
    expect(rupa25.mathStructure!.pt).toContain("1 + 2 + 3 + 4");
  });

  it("contém cartas de fórmulas matemáticas, enumeração, sequência e confundíveis", () => {
    const byMode = (m: string) => dataset.cards.filter((c) => c.mode === m);
    expect(byMode("checksum").length).toBeGreaterThanOrEqual(15);
    expect(byMode("enumeration").length).toBeGreaterThanOrEqual(7);
    expect(byMode("sequence").length).toBeGreaterThanOrEqual(5);
    expect(byMode("confusable").length).toBeGreaterThanOrEqual(10);
  });
});

describe("Trilha de 90 Dias, Freio de Revisões, Sanguessugas e Intercalação", () => {
  const now = 1_700_000_000_000;
  const stats = createInitialAnkiStats("2026-11-18");
  let states: Record<string, AnkiCardState>;

  beforeEach(() => {
    localStorage.clear();
    states = {};
  });

  it("calibra trilhas de 30, 60 e 90 dias com teto estrito de 12 novas/dia, revisões 9999/dia e freio de acúmulo", () => {
    expect(MAX_NEW_CARDS_PER_DAY).toBe(12);
    expect(PACE_MAX_NEW).toBe(12);
    expect(MAX_REVIEWS_PER_DAY).toBe(9999);

    // Default (30 days): 357 / 30 = 11.9 -> 12 new/day, 0d reserve, 10d max interval cap
    const cfg30 = ensurePaceTarget(DEFAULT_ANKI_CONFIG, now);
    expect(cfg30.paceHorizonDays).toBe(30);
    expect(cfg30.paceTargetMs).toBe(now + 30 * DAY_MS);
    expect(computeDailyNewQuota(dataset.cards, states, stats, cfg30, now)).toBe(12);
    const sum30 = computePlan90Summary(dataset.cards, states, stats, cfg30, now);
    expect(sum30.totalDays).toBe(30);
    expect(sum30.reserveDays).toBe(0);
    expect(sum30.maxIntervalDays).toBe(10);
    expect(sum30.dailyNewTarget).toBe(12);

    // 60 days: 54 active days + 6 consolidation days -> 7 new/day, 15d max interval cap
    const cfg60 = setPaceHorizon(DEFAULT_ANKI_CONFIG, 60, now);
    const expected60 = Math.min(12, Math.ceil(dataset.cards.length / (60 - getReserveDaysForHorizon(60))));
    expect(computeDailyNewQuota(dataset.cards, states, stats, cfg60, now)).toBe(expected60);
    const sum60 = computePlan90Summary(dataset.cards, states, stats, cfg60, now);
    expect(sum60.totalDays).toBe(60);
    expect(sum60.reserveDays).toBe(6);
    expect(sum60.maxIntervalDays).toBe(15);

    // 90 days: 78 active days + 12 consolidation days -> 5 new/day, 21d max interval cap
    const cfg90 = setPaceHorizon(DEFAULT_ANKI_CONFIG, 90, now);
    const activeDays90 = 90 - PACE_RESERVE_DAYS;
    const expected90 = Math.min(PACE_MAX_NEW, Math.max(PACE_MIN_NEW, Math.ceil(dataset.cards.length / activeDays90)));
    const q90 = computeDailyNewQuota(dataset.cards, states, stats, cfg90, now);
    expect(q90).toBe(expected90);

    const summary90 = computePlan90Summary(dataset.cards, states, stats, cfg90, now);
    expect(summary90.currentDay).toBe(1);
    expect(summary90.totalDays).toBe(90);
    expect(summary90.isConsolidationPhase).toBe(false);
    expect(summary90.dailyNewTarget).toBe(expected90);

    const lateSummary90 = computePlan90Summary(dataset.cards, states, stats, cfg90, now + 82 * DAY_MS);
    expect(lateSummary90.isConsolidationPhase).toBe(true);

    // Legacy manual config with 9999 or 25 new/day is always clamped to 12 new/day and 9999 reviews
    const legacyCfg = normalizeAnkiConfig({ adaptivePace: false, newCardsPerDay: 9999, extraNewCount: 50 });
    expect(legacyCfg.newCardsPerDay).toBe(12);
    expect(legacyCfg.maxReviewsPerDay).toBe(9999);
    expect(computeDailyNewQuota(dataset.cards, states, stats, legacyCfg, now)).toBe(12);

    // Horizon-specific SM-2 interval cap prevents overly long intervals before the target deadline
    let st = createInitialAnkiCardState("c0.citta_atom", cfg30);
    st = { ...st, phase: "review", intervalDays: 8, easeFactor: 2.5, dueAt: now - 1000, lastReviewAt: now - 8 * DAY_MS };
    const next30 = scheduleAnkiCard(st, 3, now, cfg30);
    expect(next30.intervalDays).toBe(getMaxIntervalForHorizon(30)); // 10d max in 30d
    const next60 = scheduleAnkiCard(st, 3, now, cfg60);
    expect(next60.intervalDays).toBe(getMaxIntervalForHorizon(60)); // 15d max in 60d

    // Daily rollover: card graduated last night is already due this morning
    const yesterdayNight = Date.UTC(2026, 10, 17, 22, 0, 0);
    const todayMorning = Date.UTC(2026, 10, 18, 8, 0, 0);
    const revSt: AnkiCardState = {
      ...createInitialAnkiCardState("c0.rupa_atom"),
      phase: "review",
      intervalDays: 1,
      dueAt: yesterdayNight + DAY_MS,
      lastReviewAt: yesterdayNight,
    };
    expect(isReviewDue(revSt, todayMorning)).toBe(true);

    // Automatic throttling when there is a large backlog of due reviews
    for (const c of dataset.cards.slice(0, 220)) {
      states[c.id] = { ...createInitialAnkiCardState(c.id), phase: "review", intervalDays: 3, dueAt: now - 1 };
    }
    expect(countDueCards(dataset.cards, states, now)).toBe(220);
    expect(computeDailyNewQuota(dataset.cards, states, stats, cfg90, now)).toBeLessThan(q90);
  });

  it("detecta sanguessugas, persiste notas mnemônicas, filtra fila e intercala capítulos", () => {
    const st = createInitialAnkiCardState("c0.citta_atom");
    expect(isLeech(st)).toBe(false);
    const leechSt: AnkiCardState = { ...st, phase: "review", lapses: 4, dueAt: now + 5 * DAY_MS };
    expect(isLeech(leechSt)).toBe(true);
    states["c0.citta_atom"] = leechSt;

    const leechQ = buildStudyQueue(dataset.chapters, dataset.cards, states, stats, DEFAULT_ANKI_CONFIG, null, now, "leeches");
    expect(leechQ.queue.map((c) => c.id)).toEqual(["c0.citta_atom"]);

    saveMnemonicNote("c0.citta_atom", "Luz que ilumina a sala");
    expect(loadMnemonicNotes()["c0.citta_atom"]).toBe("Luz que ilumina a sala");
    saveMnemonicNote("c0.citta_atom", "   ");
    expect(loadMnemonicNotes()["c0.citta_atom"]).toBeUndefined();

    const mixed = interleaveByChapter([
      { chapter: 1, v: "a" },
      { chapter: 1, v: "b" },
      { chapter: 2, v: "c" },
      { chapter: 3, v: "d" },
    ]).map((x) => x.v);
    expect(mixed).toEqual(["a", "c", "d", "b"]);
  });

  it("UI oferece Por Capítulos e Trilha 90 Dias sem os botões removidos, e exibe Estrutura Matemática nas cartas", async () => {
    localStorage.clear();
    const raw = JSON.stringify(dataset);
    global.fetch = async () => ({ ok: true, status: 200, json: async () => JSON.parse(raw) }) as any;

    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "en");
    await ui.init();

    // Removed extra tool buttons and redundant content filters must NOT exist
    expect(mount.querySelector(".abhi-btn-recall")).toBeNull();
    expect(mount.querySelector(".abhi-btn-palaces")).toBeNull();
    expect(mount.querySelector(".abhi-btn-audio")).toBeNull();
    expect(mount.querySelector(".abhi-btn-teach")).toBeNull();
    expect(mount.querySelector('[data-filter="all"]')).toBeNull();
    expect(mount.querySelector('[data-filter="concepts"]')).toBeNull();
    expect(mount.querySelector('[data-filter="recitation"]')).toBeNull();
    expect(mount.querySelector(".abhi-vault-bar")).not.toBeNull();

    // Default track is Chapters (10 chapter cards)
    expect(mount.querySelectorAll(".abhi-chapter-card").length).toBe(10);

    // Switch to Track (default 30 Days) and test switching 30 -> 60 -> 90 -> 30
    mount.querySelector<HTMLButtonElement>('[data-track="plan90"]')!.click();
    expect(mount.querySelector(".abhi-plan90-card")).not.toBeNull();
    expect(mount.textContent).toContain("30 Days");
    expect(mount.querySelectorAll("[data-horizon]").length).toBe(3);

    // Select dropdown must never offer > 12 new cards/day
    const selectOpts = Array.from(mount.querySelectorAll<HTMLOptionElement>(".abhi-limit-select option")).map(
      (o) => o.value
    );
    for (const v of selectOpts) {
      if (!v.startsWith("auto")) {
        expect(Number(v)).toBeLessThanOrEqual(12);
      }
    }

    mount.querySelector<HTMLButtonElement>('[data-horizon="60"]')!.click();
    expect(mount.textContent).toContain("60 Days");
    mount.querySelector<HTMLButtonElement>('[data-horizon="90"]')!.click();
    expect(mount.textContent).toContain("90 Days");
    mount.querySelector<HTMLButtonElement>('[data-horizon="30"]')!.click();
    expect(mount.textContent).toContain("30 Days");

    // Start today's dose directly from Track (default clinical mode = 2 buttons: Again / Good)
    mount.querySelector<HTMLButtonElement>(".abhi-btn-study-plan90")!.click();
    expect(mount.querySelector(".abhi-flashcard")).not.toBeNull();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelector(".abhi-anki-ratings")).not.toBeNull();
    expect(mount.querySelectorAll(".abhi-rate-btn").length).toBe(2);
  });
});

describe("Cofre Offline de Respostas (Cache API, Merge e Fallback sem Rede)", () => {
  const makeMockCaches = () => {
    const stores = new Map<string, Map<string, Response>>();
    const getStore = (name: string) => {
      let s = stores.get(name);
      if (!s) {
        s = new Map<string, Response>();
        stores.set(name, s);
      }
      return s;
    };
    const api = {
      open: async (name: string) => {
        const s = getStore(name);
        return {
          match: async (req: string) => s.get(req)?.clone(),
          put: async (req: string, res: Response) => {
            s.set(req, res.clone());
          },
          delete: async (req: string) => s.delete(req),
        };
      },
      match: async (req: string) => {
        for (const s of stores.values()) {
          const hit = s.get(req);
          if (hit) return hit.clone();
        }
        return undefined;
      },
      keys: async () => [...stores.keys()],
      delete: async (name: string) => stores.delete(name),
    };
    return api;
  };

  it("salva respostas no cofre Cache API e recupera tudo automaticamente após limpar localStorage", async () => {
    localStorage.clear();
    const prevCaches = (globalThis as any).caches;
    (globalThis as any).caches = makeMockCaches();
    try {
      const now = 1_700_000_100_000;
      const st = scheduleAnkiCard(createInitialAnkiCardState("c0.paramattha_sabhava"), 4, now);
      const stats = { ...createInitialAnkiStats("2026-11-18"), totalReviewed: 1, reviewedToday: 1, correctToday: 1, newStudiedToday: 1, streak: 1 };
      const entry: AnkiReviewLogEntry = {
        id: `${now}-c0.paramattha_sabhava`,
        cardId: "c0.paramattha_sabhava",
        rating: 4,
        phaseBefore: "new",
        phaseAfter: "review",
        intervalDays: 4,
        easeFactor: 2.5,
        timestamp: now,
        offline: true,
      };
      await persistOfflineProgress(
        { "c0.paramattha_sabhava": st },
        stats,
        DEFAULT_ANKI_CONFIG,
        { "c0.paramattha_sabhava": "âncora offline" },
        [],
        entry,
        now
      );

      // Simulate localStorage wipe (e.g., cookie clearing / ITP)
      localStorage.clear();
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toBeNull();

      // Hydration automatically recovers from the Cache API vault and restores localStorage
      const hydrated = await hydrateOfflineVault(now + 1000);
      expect(hydrated.status.recoveredFrom).toBe("cacheAPI");
      expect(hydrated.snapshot.states["c0.paramattha_sabhava"]?.phase).toBe("review");
      expect(hydrated.snapshot.mnemonics["c0.paramattha_sabhava"]).toBe("âncora offline");
      expect(hydrated.snapshot.recentLog.length).toBe(1);
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toContain("c0.paramattha_sabhava");

      // Reset explicitly clears the vault
      await resetOfflineVault();
      localStorage.clear();
      const afterReset = await hydrateOfflineVault(now + 2000);
      expect(Object.keys(afterReset.snapshot.states).length).toBe(0);
    } finally {
      (globalThis as any).caches = prevCaches;
    }
  });

  it("auto-cura o progresso a partir do OPFS da origem mesmo se localStorage e Cache API forem limpos", async () => {
    localStorage.clear();
    const prevCaches = (globalThis as any).caches;
    const prevStorage = (navigator as any).storage;
    const opfsFiles = new Map<string, string>();
    (globalThis as any).caches = makeMockCaches();
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: {
        persisted: async () => true,
        persist: async () => true,
        getDirectory: async () => ({
          getFileHandle: async (name: string, opts?: { create?: boolean }) => {
            if (!opfsFiles.has(name) && !opts?.create) throw new Error("NotFound");
            return {
              getFile: async () => ({ text: async () => opfsFiles.get(name) ?? "" }),
              createWritable: async () => ({
                write: async (d: string) => {
                  opfsFiles.set(name, d);
                },
                close: async () => {},
              }),
            };
          },
          removeEntry: async (name: string) => {
            opfsFiles.delete(name);
          },
        }),
      },
    });
    try {
      const now = 1_700_000_500_000;
      const st = scheduleAnkiCard(createInitialAnkiCardState("c0.nibbana_atom"), 4, now);
      const stats = { ...createInitialAnkiStats("2026-11-18"), totalReviewed: 1, reviewedToday: 1, correctToday: 1, newStudiedToday: 1, streak: 1 };
      await persistOfflineProgress({ "c0.nibbana_atom": st }, stats, DEFAULT_ANKI_CONFIG, {}, [], undefined, now);
      expect(opfsFiles.size).toBe(1);

      // Clear both localStorage and Cache API — leaving only the site-origin private OPFS file
      localStorage.clear();
      (globalThis as any).caches = makeMockCaches();

      const healed = await hydrateOfflineVault(now + 1000);
      expect(healed.status.hasOpfs).toBe(true);
      expect(healed.status.recoveredFrom).toBe("opfs");
      expect(healed.snapshot.states["c0.nibbana_atom"]?.phase).toBe("review");
      // Self-healed back into localStorage!
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toContain("c0.nibbana_atom");
    } finally {
      (globalThis as any).caches = prevCaches;
      Object.defineProperty(navigator, "storage", { configurable: true, value: prevStorage });
    }
  });

  it("mescla snapshots de dois dispositivos mantendo as respostas mais recentes e valida backup JSON", () => {
    const t1 = 1_700_000_000_000;
    const t2 = t1 + DAY_MS;
    const stOld = scheduleAnkiCard(createInitialAnkiCardState("c0.citta_atom"), 3, t1);
    const stNew = scheduleAnkiCard(stOld, 4, t2);
    const stOther = scheduleAnkiCard(createInitialAnkiCardState("c0.rupa_atom"), 4, t1);

    const snapA: AnkiProgressSnapshot = {
      schemaVersion: 1,
      updatedAt: t1,
      states: { "c0.citta_atom": stOld, "c0.rupa_atom": stOther },
      stats: { ...createInitialAnkiStats("2026-11-18"), totalReviewed: 2 },
      config: DEFAULT_ANKI_CONFIG,
      mnemonics: { "c0.rupa_atom": "nota A" },
      reviewLogCount: 2,
      recentLog: [
        { id: `${t1}-c0.citta_atom`, cardId: "c0.citta_atom", rating: 3, phaseBefore: "new", phaseAfter: "learning", intervalDays: 0, easeFactor: 2.5, timestamp: t1, offline: true },
      ],
    };
    const snapB: AnkiProgressSnapshot = {
      schemaVersion: 1,
      updatedAt: t2,
      states: { "c0.citta_atom": stNew },
      stats: { ...createInitialAnkiStats("2026-11-19"), totalReviewed: 3 },
      config: ensurePaceTarget(DEFAULT_ANKI_CONFIG, t1),
      mnemonics: { "c0.citta_atom": "nota B" },
      reviewLogCount: 3,
      recentLog: [
        { id: `${t1}-c0.citta_atom`, cardId: "c0.citta_atom", rating: 3, phaseBefore: "new", phaseAfter: "learning", intervalDays: 0, easeFactor: 2.5, timestamp: t1, offline: true },
        { id: `${t2}-c0.citta_atom`, cardId: "c0.citta_atom", rating: 4, phaseBefore: "learning", phaseAfter: "review", intervalDays: 4, easeFactor: 2.5, timestamp: t2, offline: false },
      ],
    };

    const merged = mergeSnapshots(snapA, snapB);
    expect(merged.states["c0.citta_atom"]?.lastReviewAt).toBe(t2);
    expect(merged.states["c0.rupa_atom"]?.phase).toBe("review");
    expect(merged.mnemonics["c0.rupa_atom"]).toBe("nota A");
    expect(merged.mnemonics["c0.citta_atom"]).toBe("nota B");
    expect(merged.recentLog.length).toBe(2);
    expect(merged.config.paceTargetMs).toBeGreaterThan(0);

    const roundTrip = parseProgressBackup(serializeProgressBackup(merged));
    expect(roundTrip.states["c0.citta_atom"]?.intervalDays).toBe(4);
    expect(() => parseProgressBackup('{"schemaVersion":99}')).toThrow();
  });

  it("carrega o baralho do Cache API quando o dispositivo está sem rede", async () => {
    const prevCaches = (globalThis as any).caches;
    const prevFetch = global.fetch;
    (globalThis as any).caches = makeMockCaches();
    try {
      // 1) Online: fetches and mirrors into the offline cache
      global.fetch = async () =>
        new Response(JSON.stringify({ version: 1, chapters: [], cards: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      const onlineDeck = await fetchDeckWithOfflineCache<AbhidhammaDataset>("data/srs/abhidhamma_cards.json");
      expect(onlineDeck.version).toBe(1);

      // 2) Offline: fetch fails, but reads directly from the offline cache
      global.fetch = async () => {
        throw new Error("Network offline");
      };
      const offlineDeck = await fetchDeckWithOfflineCache<AbhidhammaDataset>("data/srs/abhidhamma_cards.json");
      expect(offlineDeck.version).toBe(1);
    } finally {
      (globalThis as any).caches = prevCaches;
      global.fetch = prevFetch;
    }
  });
});

describe("Teto Estrito de 12 Novas/Dia e Revisão Máxima após concluir a dose do dia", () => {
  it("bloqueia novas acima de 12/dia, libera TODAS as estudadas para revisão máxima e protege SM-2 em revisões antecipadas", async () => {
    localStorage.clear();
    const now = Date.now();
    const states: Record<string, AnkiCardState> = {};
    // Memorize 12 cards today (reaching the absolute daily cap of 12 new/day)
    const first12 = dataset.cards.filter((c) => c.chapter === 0 || c.chapter === 1).slice(0, 12);
    for (const c of first12) {
      states[c.id] = scheduleAnkiCard(createInitialAnkiCardState(c.id), 4, now);
    }
    const today = new Date(now).toISOString().slice(0, 10);
    const statsAtCap = {
      totalReviewed: 12,
      reviewedToday: 12,
      correctToday: 12,
      newStudiedToday: 12,
      streak: 1,
      lastSessionDate: today,
    };
    localStorage.setItem("atp.abhidhamma.anki.cards.v1", JSON.stringify(states));
    localStorage.setItem("atp.abhidhamma.anki.stats.v1", JSON.stringify(statsAtCap));

    // Early review 10 min after graduation (intervalDays=4) does NOT inflate the interval to 10+ days
    const earlyReviewed = scheduleAnkiCard(states[first12[0]!.id]!, 3, now + 600_000);
    expect(earlyReviewed.intervalDays).toBe(4);
    expect(earlyReviewed.reps).toBe(2);

    // With 12 new cards already done today: 0 extra new cards and ALL 12 studied cards unlocked for maximum review
    const batchAtCap = computeProportionalExtraBatch(dataset.chapters, dataset.cards, states, null, now, statsAtCap);
    expect(batchAtCap.extraNew).toBe(0);
    expect(batchAtCap.hasMoreNew).toBe(false);
    expect(batchAtCap.earlyReviews).toBe(12);
    expect(buildEarlyReviewQueue(dataset.chapters, dataset.cards, states, null, undefined, now).length).toBe(12);

    // With only 5 new cards done today (e.g., 90d track): can add up to the 12/day cap + ALL reviews
    const statsUnderCap = { ...statsAtCap, newStudiedToday: 5 };
    const batchUnderCap = computeProportionalExtraBatch(dataset.chapters, dataset.cards, states, null, now, statsUnderCap);
    expect(batchUnderCap.extraNew).toBeGreaterThan(0);
    expect(statsUnderCap.newStudiedToday + batchUnderCap.extraNew).toBeLessThanOrEqual(12);
    expect(batchUnderCap.earlyReviews).toBe(12);

    const raw = JSON.stringify(dataset);
    global.fetch = async () => ({ ok: true, status: 200, json: async () => JSON.parse(raw) }) as any;
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "pt");
    await ui.init();

    // Even with 12/12 new cards completed, both buttons remain UNLOCKED for Maximum Review
    const allBtn = mount.querySelector<HTMLButtonElement>(".abhi-btn-study-all")!;
    expect(allBtn.disabled).toBe(false);
    expect(allBtn.textContent).toContain("Revisão Máxima");

    mount.querySelector<HTMLButtonElement>('[data-track="plan90"]')!.click();
    const planBtn = mount.querySelector<HTMLButtonElement>(".abhi-btn-study-plan90")!;
    expect(planBtn.disabled).toBe(false);
    expect(mount.querySelector(".abhi-btn-review-ahead-plan90")).not.toBeNull();

    // Clicking immediately starts maximum review
    planBtn.click();
    expect(mount.querySelector(".abhi-flashcard")).not.toBeNull();
  });

  it("renderiza e valida interações de todos os tipos de carta (4 campos, mathStructure, enumeração, sequência, sanguessuga)", async () => {
    localStorage.clear();
    const now = 1_700_000_000_000;
    const states: Record<string, AnkiCardState> = {};
    // Unlock chapters 0..4 by marking atoms as memorized in the future
    for (const c of dataset.cards) {
      if (c.tier === "atom" && c.chapter <= 4) {
        states[c.id] = {
          id: c.id,
          phase: "review",
          step: 0,
          intervalDays: 10,
          lapsedIntervalDays: 1,
          easeFactor: 2.5,
          reps: 2,
          lapses: 0,
          dueAt: now + 10 * DAY_MS,
          lastReviewAt: now - DAY_MS,
        };
      }
    }
    // 1) Card with 4 fields + mathStructure + leech: c2.cet_01 (Phassa)
    states["c2.cet_01"] = { ...states["c2.cet_01"]!, lapses: 5, dueAt: now - 3000 };
    // 2) Enumeration card: c2.enum_universal_7 (forced due in review for immediate testing)
    states["c2.enum_universal_7"] = {
      id: "c2.enum_universal_7",
      phase: "review",
      step: 0,
      intervalDays: 1,
      lapsedIntervalDays: 1,
      easeFactor: 2.5,
      reps: 1,
      lapses: 0,
      dueAt: now - 2000,
      lastReviewAt: now - DAY_MS,
    };
    // 3) Sequence card: c4.seq_vithi_17
    states["c4.seq_vithi_17"] = {
      id: "c4.seq_vithi_17",
      phase: "review",
      step: 0,
      intervalDays: 1,
      lapsedIntervalDays: 1,
      easeFactor: 2.5,
      reps: 1,
      lapses: 0,
      dueAt: now - 1000,
      lastReviewAt: now - DAY_MS,
    };
    localStorage.setItem("atp.abhidhamma.anki.cards.v1", JSON.stringify(states));

    const raw = JSON.stringify(dataset);
    global.fetch = async () => ({ ok: true, status: 200, json: async () => JSON.parse(raw) }) as any;
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "pt");
    await ui.init();

    // Open Ch. 2 -> 1st card is c2.cet_01 (4 fields + mathStructure + leech)
    mount.querySelector<HTMLButtonElement>('[data-study-chapter="2"]')!.click();
    const lakInput = mount.querySelector<HTMLInputElement>('[data-fourfold="lakkhana"]')!;
    expect(lakInput).not.toBeNull();
    lakInput.value = "tocar o objeto";
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelector(".abhi-math-box")).not.toBeNull();
    expect(mount.querySelector(".abhi-leech-box")).not.toBeNull();
    expect(mount.querySelector(".abhi-char-user")?.textContent).toContain("tocar o objeto");

    // Save mnemonic note
    const mnem = mount.querySelector<HTMLTextAreaElement>(".abhi-mnemonic-input")!;
    mnem.value = "Contato = fósforo riscando";
    mnem.dispatchEvent(new Event("input"));
    expect(loadMnemonicNotes()["c2.cet_01"]).toBe("Contato = fósforo riscando");

    // Rate Good -> advances to c2.enum_universal_7 (Enumeration with checklist)
    mount.querySelector<HTMLButtonElement>('.abhi-rate-btn[data-rate="3"]')!.click();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    const enumBoxes = mount.querySelectorAll<HTMLInputElement>("[data-enum-idx]");
    expect(enumBoxes.length).toBe(7);
    expect(mount.querySelector(".abhi-enum-status.warn")).not.toBeNull();
    // Check all 7 items -> transitions to complete (ok)
    enumBoxes.forEach((b) => {
      b.checked = true;
      b.dispatchEvent(new Event("change"));
    });
    expect(mount.querySelector(".abhi-enum-status.ok")).not.toBeNull();

    // Open Ch. 4 -> c4.seq_vithi_17 (Interactive sequence)
    mount.querySelector<HTMLButtonElement>(".abhi-btn-back")!.click();
    mount.querySelector<HTMLButtonElement>('[data-study-chapter="4"]')!.click();
    const chips = mount.querySelectorAll<HTMLButtonElement>("[data-seq-pick]");
    expect(chips.length).toBe(10);
    chips[0]!.click();
    expect(mount.querySelectorAll("[data-seq-remove]").length).toBe(1);
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelector(".abhi-seq-result")).not.toBeNull();
  });

  it("persistMnemonicOfflineVault preserva recentLog e reviewLogCount do Abhidhamma SRS no cofre offline", async () => {
    localStorage.clear();
    const cacheMap = new Map<string, string>();
    const prevCaches = (globalThis as any).caches;
    (globalThis as any).caches = {
      open: async () => ({
        match: async (url: string) => {
          const body = cacheMap.get(url);
          if (!body) return undefined;
          return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
        },
        put: async (url: string, resp: Response) => {
          cacheMap.set(url, await resp.text());
        },
        delete: async (url: string) => {
          cacheMap.delete(url);
        },
      }),
    };

    try {
      const logEntry: AnkiReviewLogEntry = {
        id: "rev-1",
        cardId: "c0.citta_atom",
        rating: 3,
        phaseBefore: "new",
        phaseAfter: "learning",
        intervalDays: 0,
        easeFactor: 2.5,
        timestamp: 1_700_000_000_000,
        offline: true,
      };
      const st = { ...createInitialAnkiCardState("c0.citta_atom"), reps: 1, lastReviewAt: 1_700_000_000_000 };
      const stats = { ...createInitialAnkiStats("2026-11-25"), totalReviewed: 1, reviewedToday: 1 };
      await persistOfflineProgress({ "c0.citta_atom": st }, stats, DEFAULT_ANKI_CONFIG, {}, [], logEntry, 1_700_000_000_000);

      let lab = createInitialProgress();
      lab = recordMnemonicAttempt(lab, "binary", "citta:1", true);
      const ok = await persistMnemonicOfflineVault(lab);
      expect(ok).toBe(true);

      const hydrated = await hydrateOfflineVault();
      expect(hydrated.snapshot.recentLog.length).toBe(1);
      expect(hydrated.snapshot.recentLog[0]?.id).toBe("rev-1");
      expect(hydrated.snapshot.reviewLogCount).toBeGreaterThanOrEqual(1);
      expect(hydrated.snapshot.mnemonicLab?.masteredBinary["citta:1"]).toBe(1);
      expect(hydrated.snapshot.updatedAt).toBeGreaterThan(1_700_000_000_000);
    } finally {
      (globalThis as any).caches = prevCaches;
    }
  });

  it("importação de backup JSON no Laboratório Mnêmico restaura também estados e notas do Abhidhamma SRS", async () => {
    localStorage.clear();
    const prevAlert = globalThis.alert;
    globalThis.alert = () => {};
    try {
      const host = document.createElement("div");
      document.body.appendChild(host);
      const ui = new MnemonicLabUI(host, "pt");
      ui.init();

      let lab = createInitialProgress();
      lab = recordMnemonicAttempt(lab, "binary", "citta:3", true);
      const backup: AnkiProgressSnapshot = {
        schemaVersion: 1,
        updatedAt: 1_700_000_000_500,
        states: {
          "c0.citta_atom": { ...createInitialAnkiCardState("c0.citta_atom"), reps: 2, lastReviewAt: 1_700_000_000_500 },
        },
        stats: { ...createInitialAnkiStats("2026-11-25"), totalReviewed: 2, reviewedToday: 2 },
        config: DEFAULT_ANKI_CONFIG,
        mnemonics: { "c0.citta_atom": "Nota importada" },
        mnemonicLab: lab,
        reviewLogCount: 1,
        recentLog: [],
      };
      const fileInput = host.querySelector<HTMLInputElement>("#mnem-vault-file-input")!;
      const mockFile = { text: async () => serializeProgressBackup(backup) } as unknown as File;
      Object.defineProperty(fileInput, "files", { value: [mockFile], configurable: true });
      fileInput.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 50));

      expect(loadMnemonicNotes()["c0.citta_atom"]).toBe("Nota importada");
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toContain("c0.citta_atom");
      expect(localStorage.getItem("abhidhamma_mnemonic_lab_v1")).toContain("citta:3");
      host.remove();
    } finally {
      globalThis.alert = prevAlert;
    }
  });
});
