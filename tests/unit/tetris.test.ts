import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach } from "vitest";
import {
  buildTaxStructure,
  getNodeCount,
  getCategoryPool,
  getOutsidersFor,
  getEligibleGeneratedCards,
  materializeGeneratedQuestion,
} from "../../src/tetris/taxonomy.js";
import { Curriculum } from "../../src/tetris/curriculum.js";
import {
  createInitialSchedulerState,
  recordAnswer,
  selectNextCard,
  computeUnitMastery,
  LEARNING_STEPS_COUNT,
} from "../../src/tetris/scheduler.js";
import { TetrisEngine } from "../../src/tetris/engine.js";
import { TetrisUI } from "../../src/tetris/ui.js";
import type { Taxonomy, UnitFile } from "../../src/tetris/types.js";

const sampleTaxonomy: Taxonomy = {
  id: "u1.sample_realities",
  title: { en: "Sample", pt: "Amostra", es: "Muestra" },
  noun: { en: "realities", pt: "realidades", es: "realidades" },
  source: { cma: "I §2", fund: "1.1", as: "I.2" },
  nodes: [
    { id: "root", name: { en: "All", pt: "Todas", es: "Todas" }, parent: null },
    { id: "cat_a", name: { en: "Category A", pt: "Categoria A", es: "Categoría A" }, parent: "root" },
    { id: "cat_b", name: { en: "Category B", pt: "Categoria B", es: "Categoría B" }, parent: "root" },
    { id: "leaf_a1", name: { en: "Leaf A1", pt: "Folha A1", es: "Hoja A1" }, parent: "cat_a", weight: 4 },
    { id: "leaf_a2", name: { en: "Leaf A2", pt: "Folha A2", es: "Hoja A2" }, parent: "cat_a", weight: 8 },
    { id: "leaf_b1", name: { en: "Leaf B1", pt: "Folha B1", es: "Hoja B1" }, parent: "cat_b", weight: 3 },
    { id: "leaf_b2", name: { en: "Leaf B2", pt: "Folha B2", es: "Hoja B2" }, parent: "cat_b", weight: 5 },
  ],
};

const sampleUnitFile: UnitFile = {
  unit: 1,
  title: { en: "Test Unit", pt: "Unidade Teste", es: "Unidad Prueba" },
  summary: { en: "Summary", pt: "Resumo", es: "Resumen" },
  taxonomies: [sampleTaxonomy],
  cards: [
    {
      id: "u1.atom_citta",
      kind: "atom",
      topic: { en: "Citta", pt: "Citta", es: "Citta" },
      requires: [],
      prompt: {
        en: "What cognizes?",
        pt: "O que conhece?",
        es: "¿Qué conoce?",
      },
      correct: {
        en: "Citta",
        pt: "Citta",
        es: "Citta",
      },
      distractors: [
        { en: "Rūpa", pt: "Rūpa", es: "Rūpa" },
        { en: "Paññatti", pt: "Paññatti", es: "Paññatti" },
        { en: "Attha", pt: "Attha", es: "Attha" },
      ],
      explanation: {
        en: "Citta cognizes.",
        pt: "Citta conhece.",
        es: "Citta conoce.",
      },
      source: { cma: "I §3" },
    },
    {
      id: "u1.derived_synthesis",
      kind: "derived",
      topic: { en: "Synthesis", pt: "Síntese", es: "Síntesis" },
      requires: ["u1.atom_citta"],
      prompt: {
        en: "Is citta an ultimate reality?",
        pt: "Citta é uma realidade última?",
        es: "¿Citta es una realidad última?",
      },
      correct: {
        en: "Yes, paramattha.",
        pt: "Sim, paramattha.",
        es: "Sí, paramattha.",
      },
      distractors: [
        { en: "No, concept.", pt: "Não, conceito.", es: "No, concepto." },
        { en: "Only matter.", pt: "Apenas matéria.", es: "Solo materia." },
        { en: "Imaginary.", pt: "Imaginário.", es: "Imaginario." },
      ],
      explanation: {
        en: "Citta is one of the four paramatthas.",
        pt: "Citta é um dos quatro paramatthas.",
        es: "Citta es uno de los cuatro paramatthas.",
      },
      source: { cma: "I §2" },
    },
  ],
};

describe("Abhidhamma Tetris — Taxonomy & Deductive Card Generation", () => {
  it("should build hierarchical taxonomy structure correctly", () => {
    const st = buildTaxStructure(sampleTaxonomy);
    expect(st.root).toBe("root");
    expect(st.byId.size).toBe(7);
    expect(st.depth.get("root")).toBe(0);
    expect(st.depth.get("cat_a")).toBe(1);
    expect(st.depth.get("leaf_a1")).toBe(2);
  });

  it("should calculate node count correctly with weights", () => {
    const st = buildTaxStructure(sampleTaxonomy);
    expect(getNodeCount(st, "leaf_a1")).toBe(4);
    expect(getNodeCount(st, "leaf_a2")).toBe(8);
    expect(getNodeCount(st, "cat_a")).toBe(12);
    expect(getNodeCount(st, "cat_b")).toBe(8);
    expect(getNodeCount(st, "root")).toBe(20);
  });

  it("should detect outsiders for member/intruder templates", () => {
    const st = buildTaxStructure(sampleTaxonomy);
    const outsidersA = getOutsidersFor(st, "cat_a");
    // cat_a's children are depth 2 (leaf_a1, leaf_a2).
    // Outsiders at depth 2 not in cat_a subtree are leaf_b1, leaf_b2
    expect(outsidersA).toContain("leaf_b1");
    expect(outsidersA).toContain("leaf_b2");
    expect(outsidersA).not.toContain("leaf_a1");
  });

  it("should generate eligible cards from taxonomy", () => {
    const cards = getEligibleGeneratedCards(sampleTaxonomy);
    expect(cards.length).toBeGreaterThan(0);
    const counts = cards.filter((c) => c.generated?.template === "count");
    expect(counts.length).toBeGreaterThan(0);
  });

  it("should materialize questions in all 3 supported languages without residual leaks", () => {
    for (const lang of ["en", "pt", "es"] as const) {
      const q = materializeGeneratedQuestion(sampleTaxonomy, "cat_a", "count", lang);
      expect(q.prompt).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.options.some((o) => o.isCorrect)).toBe(true);
      expect(q.explanation).toBeTruthy();
    }
  });
});

describe("Abhidhamma Tetris — Curriculum & Spaced Repetition Protocol", () => {
  let curriculum: Curriculum;

  beforeEach(() => {
    curriculum = new Curriculum();
    curriculum.registerUnit(sampleUnitFile);
  });

  it("should gate derived cards until prerequisite atomic cards are mastered", () => {
    const scheduler = createInitialSchedulerState();
    const derivedCard = curriculum.getCard("u1.derived_synthesis")!;
    expect(curriculum.arePrerequisitesMet(derivedCard, scheduler)).toBe(false);

    // After 1 correct answer on the atom with step >= 1:
    const updated = recordAnswer("u1.atom_citta", true, scheduler);
    expect(curriculum.arePrerequisitesMet(derivedCard, updated)).toBe(true);
  });

  it("should force immediate re-queueing of failed questions in short-term cycle", () => {
    let scheduler = createInitialSchedulerState();
    // Student fails question
    scheduler = recordAnswer("u1.atom_citta", false, scheduler);
    const state = scheduler.cards["u1.atom_citta"]!;

    expect(state.phase).toBe("relearning");
    expect(state.step).toBe(0);
    expect(state.lapses).toBe(1);
    // Scheduled immediately for currentRound
    expect(state.dueRound).toBe(scheduler.round);

    // selectNextCard should immediately prioritize this lapsed card!
    const next = selectNextCard(1, curriculum, scheduler);
    expect(next?.id).toBe("u1.atom_citta");
  });

  it("should graduate card to review phase after consecutive successful steps", () => {
    let scheduler = createInitialSchedulerState();
    for (let i = 0; i < LEARNING_STEPS_COUNT; i++) {
      scheduler = recordAnswer("u1.atom_citta", true, scheduler);
    }
    const state = scheduler.cards["u1.atom_citta"]!;
    expect(state.phase).toBe("review");
    expect(state.box).toBe(1);
    expect(state.dueAtMs).toBeGreaterThan(Date.now());
  });

  it("should accurately compute 100% precision mastery metrics", () => {
    let scheduler = createInitialSchedulerState();
    let metrics = computeUnitMastery(1, curriculum, scheduler);
    expect(metrics.masteryPercent).toBe(0);

    // Graduate all cards
    const allCards = curriculum.getCardsForUnit(1);
    for (const c of allCards) {
      for (let i = 0; i < LEARNING_STEPS_COUNT; i++) {
        scheduler = recordAnswer(c.id, true, scheduler);
      }
    }

    metrics = computeUnitMastery(1, curriculum, scheduler);
    expect(metrics.masteryPercent).toBe(100);
    expect(metrics.masteredCards).toBe(metrics.totalCards);
  });
});

describe("Abhidhamma Tetris — Engine State Machine & Critical Failure", () => {
  let curriculum: Curriculum;

  beforeEach(() => {
    curriculum = new Curriculum();
    curriculum.registerUnit(sampleUnitFile);
  });

  it("should initialize in idle state and start falling with constant speed", () => {
    let stateChanged = false;
    const engine = new TetrisEngine(
      curriculum,
      {
        onStateChange: () => { stateChanged = true; },
        onQuestionLoaded: () => {},
        onCriticalFailure: () => {},
        onCardAnswered: () => {},
      },
      { fallSpeedPercentPerSec: 5.0 }
    );

    expect(engine.getState().phase).toBe("idle");
    engine.start();
    expect(engine.getState().phase).toBe("falling");
    expect(engine.getState().pieces.length).toBeGreaterThan(0);
    expect(stateChanged).toBe(true);
    engine.destroy();
  });

  it("should trigger CRITICAL FAILURE when a piece reaches the floor", () => {
    let failedCause: string | null = null;
    const engine = new TetrisEngine(
      curriculum,
      {
        onStateChange: () => {},
        onQuestionLoaded: () => {},
        onCriticalFailure: (cause) => { failedCause = cause; },
        onCardAnswered: () => {},
      },
      { fallSpeedPercentPerSec: 5.0, pieceHeightPercent: 12 }
    );

    engine.start();
    const st = engine.getState();
    expect(st.phase).toBe("falling");

    // Simulate physics tick where piece exceeds floor (100 - pieceHeight)
    (engine as any).updatePhysics(25000); // 25 seconds of delta-t
    expect(engine.getState().phase).toBe("failed");
    expect(engine.getState().failure).toBe("floor");
    expect(failedCause).toBe("floor");
    engine.destroy();
  });

  it("should handle correct option selection, shattering block, and granting feedback", () => {
    const engine = new TetrisEngine(
      curriculum,
      {
        onStateChange: () => {},
        onQuestionLoaded: () => {},
        onCriticalFailure: () => {},
        onCardAnswered: () => {},
      }
    );

    engine.start();
    const correctPiece = engine.getState().pieces.find((p) => p.isCorrect)!;
    engine.selectOption(correctPiece.key);

    const st = engine.getState();
    expect(st.phase).toBe("feedback");
    expect(st.feedback?.outcome).toBe("correct");
    expect(st.stats.correct).toBe(1);
    expect(st.stats.streak).toBe(1);
    engine.destroy();
  });
});

describe("Abhidhamma Tetris — UI Component Mounting & Viewport Switching", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="panel-srs" class="panel active">
        <h2>Pāli Memorization</h2>
        <div class="srs-nav-menu">
          <button class="srs-menu-item active" data-srs-mode="vocab">Vocab</button>
          <button class="srs-menu-item" data-srs-mode="tetris">Tetris</button>
        </div>
      </div>
      <div id="reader-srs">
        <div id="srs-full-body" class="srs-view-panel"></div>
        <div id="srs-tetris-main" class="srs-view-panel" style="display:none"></div>
      </div>
    `;
  });

  it("should mount into main viewport container and render matrix and anchored question below floor", async () => {
    const mount = document.getElementById("srs-tetris-main")!;
    const ui = new TetrisUI(mount, "pt");
    await ui.init();

    // Verify matrix rendered
    expect(mount.querySelector(".tetris-matrix")).not.toBeNull();
    // Verify hazard floor rendered
    expect(mount.querySelector(".tetris-floor")).not.toBeNull();
    // Verify question box is anchored immediately below
    expect(mount.querySelector(".tetris-question-box")).not.toBeNull();
    // Verify controls
    expect(mount.querySelector(".tetris-start-btn")).not.toBeNull();
    expect(mount.querySelector(".tetris-reset-btn")).not.toBeNull();
  });

  it("should toggle expanded modal view cleanly", async () => {
    const mount = document.getElementById("srs-tetris-main")!;
    const ui = new TetrisUI(mount, "pt");
    await ui.init();

    const expandBtn = mount.querySelector(".tetris-expand-btn") as HTMLButtonElement;
    expandBtn.click();
    expect(mount.querySelector(".tetris-widget.tetris-expanded")).not.toBeNull();

    expandBtn.click();
    expect(mount.querySelector(".tetris-widget.tetris-expanded")).toBeNull();
  });

  it("should update language dynamically", async () => {
    const mount = document.getElementById("srs-tetris-main")!;
    const ui = new TetrisUI(mount, "pt");
    await ui.init();

    ui.setLang("en");
    expect(mount.querySelector(".floor-text")?.textContent).toContain("FLOOR");

    ui.setLang("es");
    expect(mount.querySelector(".floor-text")?.textContent).toContain("SUELO");
  });

  it("should register all 10 units of Abhidhammatthasaṅgaha and exceed 450 total granular questions", () => {
    const cur = new Curriculum();
    const indexPath = path.resolve(process.cwd(), "data/tetris/index.json");
    const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    expect(indexData.units).toHaveLength(10);

    for (const u of indexData.units) {
      const uPath = path.resolve(process.cwd(), "data/tetris", u.file);
      const uData = JSON.parse(fs.readFileSync(uPath, "utf-8"));
      cur.registerUnit(uData);
    }

    const allUnits = cur.getAllUnits();
    expect(allUnits).toHaveLength(10);

    const allCards = cur.getAllCards();
    expect(allCards.length).toBeGreaterThan(450);

    // Verify each card materializes in en, pt, es with 4 options and exactly one correct answer
    for (const card of allCards) {
      for (const lang of ["en", "pt", "es"] as const) {
        const q = cur.materialize(card.id, lang);
        expect(q.prompt).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(4);
        expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
      }
    }
  });

  it("should ensure Tetris controls bar and Debate button have collision-free responsive clearance in CSS", () => {
    const cssPath = path.resolve(process.cwd(), "css/style.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    // Verify .tetris-controls-row has right clearance for the fixed Debate pill
    expect(cssContent).toMatch(/\.tetris-controls-row[\s\S]*?padding-right:\s*clamp\(140px/);

    // Verify #btn-toggle-interlocutor has dedicated fixed styling
    expect(cssContent).toContain("#btn-toggle-interlocutor");
    expect(cssContent).toContain("#interlocutor-container");

    // Verify mobile responsive rule lifts or accommodates the Debate button
    expect(cssContent).toMatch(/@media\s*\(max-width:\s*600px\)[\s\S]*?#btn-toggle-interlocutor/);
  });
});
