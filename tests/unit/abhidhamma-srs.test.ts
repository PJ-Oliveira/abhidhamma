import { describe, it, expect, beforeEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  buildStudyQueue,
  computeAllChapterProgress,
  createInitialAnkiCardState,
  createInitialAnkiStats,
  DAY_MS,
  DEFAULT_ANKI_CONFIG,
  isCardMemorized,
  MINUTE_MS,
  previewAnkiIntervals,
  scheduleAnkiCard,
} from "../../src/abhidhamma-srs/scheduler.js";
import { AbhidhammaSrsUI } from "../../src/abhidhamma-srs/ui.js";
import type { AbhidhammaDataset, AnkiCardState } from "../../src/abhidhamma-srs/types.js";

const ROOT = path.resolve(__dirname, "../..");
const DATASET_PATH = path.join(ROOT, "data/srs/abhidhamma_cards.json");

describe("Abhidhammatthasaṅgaha Anki SRS Engine & Exhaustive Dataset", () => {
  let dataset: AbhidhammaDataset;

  beforeEach(() => {
    localStorage.clear();
    dataset = JSON.parse(fs.readFileSync(DATASET_PATH, "utf8")) as AbhidhammaDataset;
  });

  it("contains complete canonical coverage of all 4 Paramatthas and dynamic grids", () => {
    expect(dataset.chapters.length).toBe(10);
    expect(dataset.chapters.map((c) => c.chapter)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const ids = new Set(dataset.cards.map((c) => c.id));
    expect(ids.size).toBe(dataset.cards.length);

    const matchCount = (re: RegExp) => dataset.cards.filter((c) => re.test(c.id)).length;
    expect(matchCount(/^c1\.citta_\d+$/)).toBe(89);
    expect(matchCount(/^c2\.cet_\d+$/)).toBe(52);
    expect(matchCount(/^c6\.rupa_\d+$/)).toBe(28);
    expect(matchCount(/^c3\.hetu_\d+$/)).toBe(6);
    expect(matchCount(/^c3\.kicca_\d+$/)).toBe(14);
    expect(matchCount(/^c3\.dvara_\d+$/)).toBe(6);
    expect(matchCount(/^c3\.arammana_\d+$/)).toBe(6);
    expect(matchCount(/^c3\.vatthu_\d+$/)).toBe(6);
    expect(matchCount(/^c8\.ps_\d+$/)).toBe(12);
    expect(matchCount(/^c8\.pat_\d+$/)).toBe(24);
    expect(matchCount(/^c6\.nibbana_\d+/)).toBeGreaterThanOrEqual(4);

    // Check 121-citta expansion, 17:1 asymmetry, non-cognitive Nibbāna, 17-moment Vīthi
    expect(ids.has("c1.house_121_expansion")).toBe(true);
    expect(ids.has("c1.struct_lokuttara_nibbana_object")).toBe(true);
    expect(ids.has("c6.temporal_asymmetry_17_1")).toBe(true);
    expect(ids.has("c6.nibbana_02_non_cognitive")).toBe(true);
    expect(ids.has("c4.house_17_moment_complete")).toBe(true);
    expect(ids.has("c4.manodvara_paritta")).toBe(true);

    // Every card has non-empty PT, EN, ES paliTerm, categoryLabel, prompt, and answer
    for (const card of dataset.cards) {
      expect(typeof card.paliTerm).toBe("object");
      for (const lang of ["pt", "en", "es"] as const) {
        expect((card.paliTerm as Record<string, string>)[lang]!.trim().length).toBeGreaterThan(2);
        expect(card.prompt[lang].trim().length).toBeGreaterThan(5);
        expect(card.answer[lang].trim().length).toBeGreaterThan(5);
        expect(card.categoryLabel[lang].trim().length).toBeGreaterThan(2);
      }
      for (const req of card.requires) {
        expect(ids.has(req)).toBe(true);
      }
    }
  });

  it("replicates Anki SM-2 learning, graduation, lapse, and relearning rules", () => {
    const t0 = 1_700_000_000_000;
    let st = createInitialAnkiCardState("c0.paramattha_sabhava");
    expect(st.phase).toBe("new");

    // Previews for new card: [1 min, 6 min, 10 min, 4 d]
    const previews = previewAnkiIntervals(st, "pt", t0);
    expect(previews[1]).toBe("1 min");
    expect(previews[2]).toBe("6 min");
    expect(previews[3]).toBe("10 min");
    expect(previews[4]).toBe("4 d");

    // Good once -> learning step 1 (10 min)
    st = scheduleAnkiCard(st, 3, t0);
    expect(st.phase).toBe("learning");
    expect(st.step).toBe(1);
    expect(st.dueAt).toBe(t0 + 10 * MINUTE_MS);
    expect(isCardMemorized(st)).toBe(false);

    // Hard at step 1 -> stays step 1 (10 min)
    st = scheduleAnkiCard(st, 2, t0 + 10 * MINUTE_MS);
    expect(st.phase).toBe("learning");
    expect(st.step).toBe(1);

    // Good at step 1 -> graduates to review with 1d interval
    const t1 = t0 + 20 * MINUTE_MS;
    st = scheduleAnkiCard(st, 3, t1);
    expect(st.phase).toBe("review");
    expect(st.intervalDays).toBe(1);
    expect(st.dueAt).toBe(t1 + DAY_MS);
    expect(isCardMemorized(st)).toBe(true);

    // Review Good -> interval grows by easeFactor (2.5 -> 3d)
    const t2 = t1 + DAY_MS;
    st = scheduleAnkiCard(st, 3, t2);
    expect(st.phase).toBe("review");
    expect(st.intervalDays).toBe(3);

    // Review Easy -> ease increases (+0.15 -> 2.65) and 1.3x bonus
    const t3 = t2 + 3 * DAY_MS;
    st = scheduleAnkiCard(st, 4, t3);
    expect(st.easeFactor).toBe(2.65);
    expect(st.intervalDays).toBe(Math.round(3 * 2.65 * 1.3)); // 10

    // Review Again -> Lapse! lapses=1, ease drops by 0.20, phase=relearning
    const t4 = t3 + st.intervalDays * DAY_MS;
    st = scheduleAnkiCard(st, 1, t4);
    expect(st.phase).toBe("relearning");
    expect(st.lapses).toBe(1);
    expect(st.easeFactor).toBe(2.45);
    expect(st.lapsedIntervalDays).toBe(5); // 50% of 10
    expect(isCardMemorized(st)).toBe(false);

    // Relearning Good -> returns to review with lapsedIntervalDays (5d)
    st = scheduleAnkiCard(st, 3, t4 + 10 * MINUTE_MS);
    expect(st.phase).toBe("review");
    expect(st.intervalDays).toBe(5);
    expect(isCardMemorized(st)).toBe(true);
  });

  it("enforces conditional chapter progression and brick-to-house unlocking", () => {
    const now = 1_700_000_000_000;
    const states: Record<string, AnkiCardState> = {};

    // Initially only Chapter 0 is unlocked, and Ch 0 house is locked
    let prog = computeAllChapterProgress(dataset.chapters, dataset.cards, states, now);
    expect(prog.get(0)!.unlocked).toBe(true);
    expect(prog.get(0)!.houseUnlocked).toBe(false);
    expect(prog.get(1)!.unlocked).toBe(false);

    const stats = createInitialAnkiStats("2026-11-17");
    let q = buildStudyQueue(dataset.chapters, dataset.cards, states, stats, DEFAULT_ANKI_CONFIG, 0, now);
    expect(q.newUnlocked.every((c) => c.tier === "atom")).toBe(true);

    // Memorize 3 out of 5 atoms in Ch 0 (60%) -> Ch 1 still locked (<80%), Ch 0 house still locked (<75%)
    const ch0Atoms = dataset.cards.filter((c) => c.chapter === 0 && c.tier === "atom");
    for (const c of ch0Atoms.slice(0, 3)) {
      states[c.id] = scheduleAnkiCard(createInitialAnkiCardState(c.id), 4, now);
    }
    prog = computeAllChapterProgress(dataset.chapters, dataset.cards, states, now);
    expect(prog.get(0)!.atomMasteryPct).toBe(60);
    expect(prog.get(0)!.houseUnlocked).toBe(false);
    expect(prog.get(1)!.unlocked).toBe(false);

    // Memorize 4th atom (80%) -> Ch 0 house unlocked AND Ch 1 unlocked!
    // (Note: c0.four_paramatthas_house also requires c0.cittakkhana; memorize c0.cittakkhana too)
    states[ch0Atoms[3]!.id] = scheduleAnkiCard(createInitialAnkiCardState(ch0Atoms[3]!.id), 4, now);
    states["c0.cittakkhana"] = scheduleAnkiCard(createInitialAnkiCardState("c0.cittakkhana"), 4, now);
    prog = computeAllChapterProgress(dataset.chapters, dataset.cards, states, now);
    expect(prog.get(0)!.atomMasteryPct).toBe(80);
    expect(prog.get(0)!.houseUnlocked).toBe(true);
    expect(prog.get(1)!.unlocked).toBe(true);

    // Check c0.four_paramatthas_house requires all 4 paramatthas + cittakkhana:
    // Since ch0Atoms[4] is c0.nibbana_atom and isn't memorized yet, house card waits until nibbana_atom is memorized!
    q = buildStudyQueue(dataset.chapters, dataset.cards, states, stats, DEFAULT_ANKI_CONFIG, 0, now);
    expect(q.newUnlocked.some((c) => c.id === "c0.four_paramatthas_house")).toBe(false);

    states[ch0Atoms[4]!.id] = scheduleAnkiCard(createInitialAnkiCardState(ch0Atoms[4]!.id), 4, now);
    q = buildStudyQueue(dataset.chapters, dataset.cards, states, stats, DEFAULT_ANKI_CONFIG, 0, now);
    expect(q.newUnlocked.some((c) => c.id === "c0.four_paramatthas_house")).toBe(true);
  });

  it("renders AbhidhammaSrsUI overview, starts study, flips, and rates cards", async () => {
    const raw = fs.readFileSync(DATASET_PATH, "utf8");
    global.fetch = async (url: string | URL | globalThis.Request) => {
      if (url.toString().includes("abhidhamma_cards.json")) {
        return {
          ok: true,
          status: 200,
          json: async () => JSON.parse(raw),
        } as any;
      }
      return { ok: false, status: 404 } as any;
    };

    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "pt");
    await ui.init();

    expect(mount.querySelectorAll(".abhi-chapter-card").length).toBe(10);
    const ch0Btn = mount.querySelector<HTMLButtonElement>('[data-study-chapter="0"]')!;
    const ch1Btn = mount.querySelector<HTMLButtonElement>('[data-study-chapter="1"]')!;
    expect(ch0Btn.disabled).toBe(false);
    expect(ch1Btn.disabled).toBe(true);

    ch0Btn.click();
    expect(mount.querySelector(".abhi-flashcard")).not.toBeNull();
    expect(mount.querySelector(".abhi-anki-ratings")).toBeNull();

    const revealBtn = mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!;
    revealBtn.click();
    expect(mount.querySelector(".abhi-anki-ratings")).not.toBeNull();
    // Default is strict clinical grading: 2 buttons (De novo / Bom), no Hard button
    expect(mount.querySelectorAll(".abhi-rate-btn").length).toBe(2);
    expect(mount.querySelector('.abhi-rate-btn[data-rate="2"]')).toBeNull();

    // Rate "Bom" (3) -> saves learning state to localStorage
    const goodBtn = mount.querySelector<HTMLButtonElement>('.abhi-rate-btn[data-rate="3"]')!;
    goodBtn.click();
    const saved = JSON.parse(localStorage.getItem("atp.abhidhamma.anki.cards.v1") || "{}");
    expect(Object.keys(saved).length).toBe(1);
    const firstKey = Object.keys(saved)[0]!;
    expect(saved[firstKey].phase).toBe("learning");
    expect(saved[firstKey].step).toBe(1);

    // Go back, toggle to classic 4-button Anki mode, and rate "Fácil" (4)
    mount.querySelector<HTMLButtonElement>(".abhi-btn-back")!.click();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-clinical-toggle")!.click();
    mount.querySelector<HTMLButtonElement>('[data-study-chapter="0"]')!.click();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelectorAll(".abhi-rate-btn").length).toBe(4);
    const easyBtn = mount.querySelector<HTMLButtonElement>('.abhi-rate-btn[data-rate="4"]')!;
    easyBtn.click();
    const saved2 = JSON.parse(localStorage.getItem("atp.abhidhamma.anki.cards.v1") || "{}");
    const reviewedCards = Object.values(saved2).filter((s: any) => s.phase === "review");
    expect(reviewedCards.length).toBe(1);
    expect((reviewedCards[0] as any).intervalDays).toBe(4);
  });

  it("renders AbhidhammaSrsUI dynamically in pt, en, and es via setLang()", async () => {
    const raw = fs.readFileSync(DATASET_PATH, "utf8");
    global.fetch = async () => ({ ok: true, status: 200, json: async () => JSON.parse(raw) }) as any;

    const mount = document.createElement("div");
    document.body.appendChild(mount);
    const ui = new AbhidhammaSrsUI(mount, "en");
    await ui.init();

    expect(mount.textContent).toContain("Foundations: The Four Ultimate Realities");
    mount.querySelector<HTMLButtonElement>('[data-study-chapter="0"]')!.click();
    mount.querySelector<HTMLButtonElement>(".abhi-btn-reveal")!.click();
    expect(mount.querySelector('.abhi-rate-btn[data-rate="1"]')!.textContent).toContain("Again");
    expect(mount.querySelector('.abhi-rate-btn[data-rate="3"]')!.textContent).toContain("Good");

    ui.setLang("es");
    expect(mount.querySelector('.abhi-rate-btn[data-rate="1"]')!.textContent).toContain("Otra vez");
    expect(mount.querySelector('.abhi-rate-btn[data-rate="3"]')!.textContent).toContain("Bien");

    ui.setLang("pt");
    expect(mount.querySelector('.abhi-rate-btn[data-rate="1"]')!.textContent).toContain("De novo");
    expect(mount.querySelector('.abhi-rate-btn[data-rate="3"]')!.textContent).toContain("Bom");
  });
});
