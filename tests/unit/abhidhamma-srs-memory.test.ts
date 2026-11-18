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
  interleaveByChapter,
  isLeech,
  isRecitationCard,
  loadMnemonicNotes,
  PACE_DEFAULT_HORIZON_DAYS,
  PACE_MAX_NEW,
  PACE_MIN_NEW,
  PACE_RESERVE_DAYS,
  saveMnemonicNote,
  scheduleAnkiCard,
} from "../../src/abhidhamma-srs/scheduler.js";
import { AbhidhammaSrsUI } from "../../src/abhidhamma-srs/ui.js";
import {
  fetchDeckWithOfflineCache,
  hydrateOfflineVault,
  mergeSnapshots,
  parseProgressBackup,
  persistOfflineProgress,
  resetOfflineVault,
  serializeProgressBackup,
  type AnkiProgressSnapshot,
  type AnkiReviewLogEntry,
} from "../../src/abhidhamma-srs/offline-store.js";
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

  it("calibra a cota diária de 90 dias com reserva de 12 dias e freia acúmulo de revisões", () => {
    const cfg = ensurePaceTarget(DEFAULT_ANKI_CONFIG, now);
    expect(cfg.paceTargetMs).toBe(now + PACE_DEFAULT_HORIZON_DAYS * DAY_MS);

    const activeDays = PACE_DEFAULT_HORIZON_DAYS - PACE_RESERVE_DAYS;
    const expected = Math.min(PACE_MAX_NEW, Math.max(PACE_MIN_NEW, Math.ceil(dataset.cards.length / activeDays)));
    const q0 = computeDailyNewQuota(dataset.cards, states, stats, cfg, now);
    expect(q0).toBe(expected);

    const summary = computePlan90Summary(dataset.cards, states, stats, cfg, now);
    expect(summary.currentDay).toBe(1);
    expect(summary.totalDays).toBe(90);
    expect(summary.isConsolidationPhase).toBe(false);
    expect(summary.dailyNewTarget).toBe(expected);

    const lateSummary = computePlan90Summary(dataset.cards, states, stats, cfg, now + 82 * DAY_MS);
    expect(lateSummary.isConsolidationPhase).toBe(true);

    for (const c of dataset.cards.slice(0, 220)) {
      states[c.id] = { ...createInitialAnkiCardState(c.id), phase: "review", intervalDays: 3, dueAt: now - 1 };
    }
    expect(countDueCards(dataset.cards, states, now)).toBe(220);
    expect(computeDailyNewQuota(dataset.cards, states, stats, cfg, now)).toBeLessThan(q0);
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

    // Switch to 90-Day Track
    mount.querySelector<HTMLButtonElement>('[data-track="plan90"]')!.click();
    expect(mount.querySelector(".abhi-plan90-card")).not.toBeNull();
    expect(mount.textContent).toContain("90 Days");

    // Start today's dose directly from 90-Day Track
    mount.querySelector<HTMLButtonElement>(".abhi-btn-study-plan90")!.click();
    expect(mount.querySelector(".abhi-flashcard")).not.toBeNull();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelector(".abhi-anki-ratings")).not.toBeNull();
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

      // Simula limpeza de localStorage (ex.: limpeza de cookies / ITP)
      localStorage.clear();
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toBeNull();

      // Hidratação recupera automaticamente do cofre Cache API e restaura localStorage
      const hydrated = await hydrateOfflineVault(now + 1000);
      expect(hydrated.status.recoveredFrom).toBe("cacheAPI");
      expect(hydrated.snapshot.states["c0.paramattha_sabhava"]?.phase).toBe("review");
      expect(hydrated.snapshot.mnemonics["c0.paramattha_sabhava"]).toBe("âncora offline");
      expect(hydrated.snapshot.recentLog.length).toBe(1);
      expect(localStorage.getItem("atp.abhidhamma.anki.cards.v1")).toContain("c0.paramattha_sabhava");

      // Reset limpa o cofre explicitamente
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

      // Limpa tanto localStorage quanto Cache API — sobra só o arquivo privado OPFS da origem
      localStorage.clear();
      (globalThis as any).caches = makeMockCaches();

      const healed = await hydrateOfflineVault(now + 1000);
      expect(healed.status.hasOpfs).toBe(true);
      expect(healed.status.recoveredFrom).toBe("opfs");
      expect(healed.snapshot.states["c0.nibbana_atom"]?.phase).toBe("review");
      // Auto-curou de volta no localStorage!
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
      // 1) Online: busca e espelha no cache offline
      global.fetch = async () =>
        new Response(JSON.stringify({ version: 1, chapters: [], cards: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      const onlineDeck = await fetchDeckWithOfflineCache<AbhidhammaDataset>("data/srs/abhidhamma_cards.json");
      expect(onlineDeck.version).toBe(1);

      // 2) Offline: fetch falha, mas lê direto do cache offline
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

describe("Estudo Extra Proporcional após concluir a dose do dia", () => {
  it("não bloqueia após bater a meta diária, gera lote proporcional e protege SM-2 em revisões antecipadas", async () => {
    localStorage.clear();
    const now = 1_700_000_000_000;
    const states: Record<string, AnkiCardState> = {};
    // Memoriza 13 cartas (atingindo a meta diária Auto=13)
    const first13 = dataset.cards.filter((c) => c.chapter === 0 || c.chapter === 1).slice(0, 13);
    for (const c of first13) {
      states[c.id] = scheduleAnkiCard(createInitialAnkiCardState(c.id), 4, now);
    }
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem("atp.abhidhamma.anki.cards.v1", JSON.stringify(states));
    localStorage.setItem(
      "atp.abhidhamma.anki.stats.v1",
      JSON.stringify({ totalReviewed: 13, reviewedToday: 13, correctToday: 13, newStudiedToday: 13, streak: 1, lastSessionDate: today })
    );

    // Revisão antecipada 10 min depois de graduar (intervalDays=4) NÃO infla o intervalo para 10+ dias
    const earlyReviewed = scheduleAnkiCard(states[first13[0]!.id]!, 3, now + 600_000);
    expect(earlyReviewed.intervalDays).toBe(4);
    expect(earlyReviewed.reps).toBe(2);

    const batch = computeProportionalExtraBatch(dataset.chapters, dataset.cards, states, null, now);
    expect(batch.extraNew).toBe(10);
    expect(batch.earlyReviews).toBe(5);
    expect(buildEarlyReviewQueue(dataset.chapters, dataset.cards, states, null, 5, now).length).toBe(5);

    const raw = JSON.stringify(dataset);
    global.fetch = async () => ({ ok: true, status: 200, json: async () => JSON.parse(raw) }) as any;
    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "pt");
    await ui.init();

    // Mesmo com cota diária 100% concluída, ambos os botões permanecem DESBLOQUEADOS
    const allBtn = mount.querySelector<HTMLButtonElement>(".abhi-btn-study-all")!;
    expect(allBtn.disabled).toBe(false);

    mount.querySelector<HTMLButtonElement>('[data-track="plan90"]')!.click();
    const planBtn = mount.querySelector<HTMLButtonElement>(".abhi-btn-study-plan90")!;
    expect(planBtn.disabled).toBe(false);
    expect(mount.querySelector(".abhi-btn-review-ahead-plan90")).not.toBeNull();

    // Clicar inicia imediatamente o lote extra proporcional
    planBtn.click();
    expect(mount.querySelector(".abhi-flashcard")).not.toBeNull();
  });
});
