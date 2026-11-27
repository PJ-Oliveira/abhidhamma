import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLogger } from "../../src/logger.js";
import { t } from "../../src/i18n.js";
import { renderTree, markActiveLeaf } from "../../src/tree.js";
import { getCommentaryExplanation } from "../../src/ontology/commentary.js";
import { Proposition, Operator, FinitistUniverse } from "../../src/ontology/formal_logic.js";
import { DebateStateMachine, Niggahatthana } from "../../src/ontology/kathavatthu.js";
import { evaluateScenario, evaluateCustomClaim } from "../../src/ontology/kathavatthu_logic.js";
import { AbhidhammaLogicEngine } from "../../src/ontology/sampayoganaya.js";
import { initInterlocutorPanel } from "../../src/ai-feature/ui.js";
import { loadChunk, renderSegments } from "../../src/reader.js";
import { initSearchPanel } from "../../src/search.js";
import { sm2, loadStats, saveStats, initSrsPanel } from "../../src/srs.js";
import { normalizePali, lookupPali, showWordInDictionaryPanel, initDictionaryPanel } from "../../src/dictionary.js";
import { initSelectionHandler, clearSelection } from "../../src/selection.js";
import { settings, updateSettings } from "../../src/state.js";

describe("Core Modules Full Unit Coverage (Logger, i18n, State, Tree, Ontology, AI UI, Reader, Search, SRS, Dict, Selection)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
    updateSettings({ uiLang: "en", translationLang: "en", showPali: true, showTranslation: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logger.ts: exercises info, warn, error with and without detail", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const log = createLogger("test");
    log.info("hello");
    log.info("hello", { a: 1 });
    log.warn("careful");
    log.warn("careful", 42);
    log.error("boom");
    log.error("boom", new Error("x"));

    expect(infoSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(errSpy).toHaveBeenCalledTimes(2);
  });

  it("i18n.ts: covers fallback to EN dict and fallback to raw key", () => {
    expect(t("navTipitaka", "unknown" as any)).toBe("Tipiṭaka");
    expect(t("non_existent_key_xyz", "pt")).toBe("non_existent_key_xyz");
    expect(t("non_existent_key_xyz", "unknown" as any)).toBe("non_existent_key_xyz");
  });

  it("state.ts: covers malformed JSON fallback, storage error catch, and navigator language detection", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem("atp.history.v1", "{bad-json");
    const stMod = await import("../../src/state.js");
    expect(stMod.getHistory()).toEqual([]);

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    stMod.updateSettings({ fontSize: 18 });
    expect(warnSpy).toHaveBeenCalled();
    vi.restoreAllMocks();

    // Test navigator language detection branches via dynamic re-import with resetModules
    const origLang = navigator.language;
    for (const [navLang, expected] of [
      ["pt-BR", "pt"],
      ["es-ES", "es"],
      ["en-US", "en"],
    ] as const) {
      localStorage.clear();
      vi.resetModules();
      Object.defineProperty(navigator, "language", { configurable: true, value: navLang });
      const fresh = await import("../../src/state.js");
      expect(fresh.settings.uiLang).toBe(expected);
    }
    Object.defineProperty(navigator, "language", { configurable: true, value: origLang });
  });

  it("tree.ts: expands/collapses works, auto-selects single-part work, and marks active leaf", () => {
    const manifest: any = {
      groups: {
        abhidhamma: [
          {
            id: "dhammasangani",
            title: "Dhammasaṅgaṇī",
            parts: {
              mula: { label: "Mūla", files: ["mula__0.json"], toc: [], count: 10 },
              attha: { label: "Aṭṭhakathā", files: ["attha__0.json"], toc: [], count: 10 },
            },
          },
          {
            id: "single-work",
            title: "Single Part Work",
            parts: {
              texto: { label: "Texto", files: ["texto.json"], toc: [], count: 5 },
            },
          },
        ],
      },
    };
    const container = document.createElement("div");
    const onSelect = vi.fn();
    renderTree(manifest, container, onSelect);

    // Click multi-part work label: expands then collapses without auto-selecting
    const workLabels = container.querySelectorAll<HTMLElement>(".node-label:not(.leaf)");
    workLabels[0]!.click();
    expect(onSelect).not.toHaveBeenCalled();
    workLabels[0]!.click();

    // Click single-part work label: expands and auto-selects its only part
    workLabels[1]!.click();
    expect(onSelect).toHaveBeenCalledWith("single-work", "texto", 0, null);

    // Click explicit leaf
    const leaf = container.querySelector<HTMLElement>('.node-label.leaf[data-work-id="dhammasangani"][data-part-key="mula"]')!;
    leaf.click();
    expect(onSelect).toHaveBeenCalledWith("dhammasangani", "mula", 0, null);

    markActiveLeaf(container, "dhammasangani", "mula");
    expect(leaf.classList.contains("leaf-active")).toBe(true);
    // Missing leaf does nothing safely
    markActiveLeaf(container, "unknown", "mula");
  });

  it("ontology/*: reaches 100% across commentary, formal_logic, kathavatthu, kathavatthu_logic, and sampayoganaya", () => {
    // commentary.ts unknown subject
    expect(getCommentaryExplanation("unknown_subject", Niggahatthana.NONE)).toContain("não registra");
    expect(getCommentaryExplanation("kāla", Niggahatthana.PATINNAYAVIRODHO)).toContain("Sabbatthivādins");

    // sampayoganaya.ts all branches
    expect(AbhidhammaLogicEngine.isUltimateReality("Phassa")).toBe(true);
    expect(AbhidhammaLogicEngine.isUltimateReality("kāla")).toBe(false);
    expect(AbhidhammaLogicEngine.isUltimateReality("totally_unknown_xyz")).toBe(false);

    // formal_logic.ts all error & operator branches
    expect(FinitistUniverse.getAllUltimateRealities().length).toBeGreaterThan(5);
    const pTrue = new Proposition("ATOMIC", () => true);
    const pFalse = new Proposition("ATOMIC", () => false);
    expect(new Proposition("COMPOUND", undefined, Operator.IMPLIES, pTrue, pFalse).evaluate()).toBe(false);
    expect(new Proposition("COMPOUND", undefined, Operator.EQUIVALENT, pTrue, pTrue).evaluate()).toBe(true);
    expect(() => new Proposition("ATOMIC").evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, Operator.NOT).evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, Operator.AND, pTrue).evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, Operator.OR, pTrue).evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, Operator.IMPLIES, pTrue).evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, Operator.EQUIVALENT, pTrue).evaluate()).toThrow();
    expect(() => new Proposition("COMPOUND", undefined, "BAD_OP" as any, pTrue, pFalse).evaluate()).toThrow();
    expect(new Proposition("OTHER" as any).evaluate()).toBe(false);

    // kathavatthu.ts all state machine branches
    const sm = new DebateStateMachine();
    expect(() => sm.evaluateResponse(true, false, false, true)).toThrow();
    sm.proposeThesis({ subject: "Phassa", predicate: "arises", isUltimate: true });
    expect(sm.getHistory().length).toBe(1);
    expect(() => sm.proposeThesis({ subject: "Phassa", predicate: "again", isUltimate: true })).toThrow();
    const smNonUlt = new DebateStateMachine();
    expect(smNonUlt.proposeThesis({ subject: "Puggala", predicate: "conventional", isUltimate: false }).state).toBe("QUESTIONING");
    // Error catch branch in assertAssociation
    vi.spyOn(AbhidhammaLogicEngine, "getAssociatedCetasikas").mockImplementationOnce(() => {
      throw new Error("boom");
    });
    expect(smNonUlt.assertAssociation("LobhaMula1", "Phassa").valid).toBe(false);

    // kathavatthu_logic.ts: all 7 scenarios x 3 languages
    const scenarioIds = [
      "puggala_vada",
      "kāla_vada",
      "sassata_vada",
      "ekacca_sassata_vada",
      "amara_vikkhepa_vada",
      "adhicca_samuppanna_vada",
      "vipaka_citta",
    ];
    for (const id of scenarioIds) {
      for (const lang of ["en", "pt", "es"] as const) {
        const res = evaluateScenario(id, lang);
        expect(res.verdict.length).toBeGreaterThan(0);
        expect(res.logic.length).toBeGreaterThan(0);
      }
    }
    expect(evaluateCustomClaim("soul").verdict).toContain("Paṭiññāvirodho");
  });

  it("ai-feature/ui.ts: exercises elaborate button, empty selection reset, and languageChanged", async () => {
    vi.useFakeTimers();
    const box = document.createElement("div");
    document.body.appendChild(box);
    initInterlocutorPanel(box);

    const sel = box.querySelector<HTMLSelectElement>("#scenario-select")!;
    const submitBtn = box.querySelector<HTMLButtonElement>("#interlocutor-submit")!;
    sel.value = "puggala_vada";
    sel.dispatchEvent(new Event("change"));
    expect(submitBtn.disabled).toBe(false);

    submitBtn.click();
    vi.advanceTimersByTime(1100);
    const elabBtn = box.querySelector<HTMLButtonElement>("#btn-elaborate")!;
    const peda = box.querySelector<HTMLElement>("#pedagogical-display")!;
    elabBtn.click();
    expect(peda.style.display).toBe("block");
    expect(elabBtn.style.display).toBe("none");

    // Empty value hides claim display and disables submit
    sel.value = "";
    sel.dispatchEvent(new Event("change"));
    expect(submitBtn.disabled).toBe(true);
    expect(box.querySelector<HTMLElement>("#claim-display")!.style.display).toBe("none");

    window.dispatchEvent(new Event("languageChanged"));
    vi.useRealTimers();
  });

  it("reader.ts: exercises loadChunk cache/error, bookmark toggle, var-note hover, and commentary fallback modes", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, rend: "bodytext", paranum: "1", pali: 'Dhamma <sup class="var-note" data-note="0">1</sup>', en: "Dhamma", pt: "Dhamma", es: "Dhamma", notes: ["Variant reading"] }],
    }).mockResolvedValueOnce({ ok: false, status: 500 });
    global.fetch = fetchMock as any;

    const segs = await loadChunk("test-work-cov", "mula", "mula__0.json");
    expect(segs.length).toBe(1);
    // Cache hit
    const segs2 = await loadChunk("test-work-cov", "mula", "mula__0.json");
    expect(segs2).toBe(segs);
    // Error throw
    await expect(loadChunk("test-work-cov", "mula", "bad.json")).rejects.toThrow();

    const container = document.createElement("div");
    const onNoteHover = vi.fn();
    let bookmarked = false;
    renderSegments(segs, container, {
      onNoteHover,
      isBookmarked: () => bookmarked,
      onBookmarkToggle: () => {
        bookmarked = !bookmarked;
        return bookmarked;
      },
    });

    const bmBtn = container.querySelector<HTMLButtonElement>(".bookmark-toggle")!;
    expect(bmBtn.textContent).toBe("☆");
    bmBtn.click();
    expect(bmBtn.textContent).toBe("★");

    const sup = container.querySelector<HTMLElement>(".var-note")!;
    sup.dispatchEvent(new MouseEvent("mouseenter"));
    expect(onNoteHover).toHaveBeenCalledWith(expect.any(MouseEvent), "Variant reading");
    sup.dispatchEvent(new MouseEvent("mouseleave"));
    expect(onNoteHover).toHaveBeenCalledWith(null);

    // Commentary en monolingual without pali & es fallback to pt
    renderSegments(
      [{ id: 2, rend: "bodytext", paranum: null, pali: "Orig EN", en: "Orig EN", pt: "Trad PT", es: "" }],
      container,
      { isCommentary: true, effectiveLang: "en", showPaliOverride: false, showTranslationOverride: true }
    );
    expect(container.querySelector(".translation-line")?.textContent).toContain("Orig EN");
    renderSegments(
      [{ id: 3, rend: "bodytext", paranum: null, pali: "Orig EN", en: "Orig EN", pt: "Trad PT", es: "" }],
      container,
      { isCommentary: true, effectiveLang: "es", showPaliOverride: true, showTranslationOverride: true }
    );
    expect(container.querySelector(".translation-line")?.textContent).toContain("Trad PT");
  });

  it("search.ts: covers multi-token intersection, prefix match, missing shard, and languageChanged", async () => {
    vi.resetModules();
    const { initSearchPanel: initSearchFresh } = await import("../../src/search.js");
    global.fetch = vi.fn(async (url: any) => {
      const u = String(url);
      if (u.includes("manifest.json")) {
        return { ok: true, json: async () => ({ shards: { c: "shard_c.json", d: "shard_d.json" } }) } as any;
      }
      if (u.includes("shard_c.json")) {
        return {
          ok: true,
          json: async () => ({
            postings: { citta: [0], cittuppāda: [1] },
            segments: [
              { workId: "dhammasangani", partKey: "mula", chunk: 0, segId: 1, snippet: "citta dhamma" },
              { workId: "dhammasangani", partKey: "mula", chunk: 0, segId: 2, snippet: "cittuppāda" },
            ],
          }),
        } as any;
      }
      if (u.includes("shard_d.json")) {
        return {
          ok: true,
          json: async () => ({
            postings: { dhamma: [0] },
            segments: [
              { workId: "dhammasangani", partKey: "mula", chunk: 0, segId: 1, snippet: "citta dhamma" },
            ],
          }),
        } as any;
      }
      return { ok: false, status: 404 } as any;
    }) as any;

    const input = document.createElement("input");
    const results = document.createElement("div");
    const onOpen = vi.fn();
    initSearchFresh(input, results, onOpen);
    await new Promise((r) => setTimeout(r, 30));

    // Multi-token search hits exact intersection
    input.value = "citta dhamma";
    input.dispatchEvent(new Event("input"));
    await new Promise((r) => setTimeout(r, 300));
    const item = results.querySelector<HTMLElement>(".side-item");
    expect(item).not.toBeNull();
    item!.click();
    expect(onOpen).toHaveBeenCalled();

    // Missing shard returns noResults + languageChanged re-runs empty state
    input.value = "zzzzzz";
    input.dispatchEvent(new Event("input"));
    await new Promise((r) => setTimeout(r, 300));
    expect(results.querySelector(".side-empty")).not.toBeNull();
    window.dispatchEvent(new Event("languageChanged"));

    input.value = "";
    window.dispatchEvent(new Event("languageChanged"));
    expect(results.querySelector(".side-empty")).not.toBeNull();
  });

  it("srs.ts: covers sm2 repetitions 0->1->2->3+, ease floor 1.3, keyboard 1-4, languageChanged on all viewStates", async () => {
    let card = { id: "c1", interval: 0, repetitions: 0, easeFactor: 1.3, nextReview: 0, lastReview: 0 };
    card = sm2(card, 4);
    expect(card.interval).toBe(1);
    card = sm2(card, 4);
    expect(card.interval).toBe(6);
    card = sm2(card, 4);
    expect(card.interval).toBe(Math.round(6 * card.easeFactor));
    card = sm2({ ...card, easeFactor: 1.3 }, 0);
    expect(card.easeFactor).toBe(1.3);

    // Corrupt localStorage stats & state fallback
    localStorage.setItem("atp.srs.stats.v1", "{bad");
    localStorage.setItem("atp.srs.v1", "{bad");
    expect(loadStats().totalReviewed).toBe(0);
    saveStats({ totalReviewed: 1, streak: 1, lastSessionDate: "2020-01-01", correctToday: 1, totalToday: 1 });

    // Empty vocab -> nodata viewState + languageChanged (including during loading state)
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as any;
    const srsMod = await import("../../src/srs.js");
    const overlay = document.createElement("div");
    overlay.id = "reader-srs";
    const host = document.createElement("div");
    overlay.appendChild(host);
    document.body.appendChild(overlay);
    srsMod.initSrsPanel(host);
    // Trigger languageChanged while viewState === "loading"
    window.dispatchEvent(new Event("languageChanged"));
    await new Promise((r) => setTimeout(r, 40));
    expect(host.querySelector(".srs-empty")?.textContent).toBeTruthy();
    window.dispatchEvent(new Event("languageChanged"));

    // Seed saved SRS state with 1 due card (nextReview <= now) so loadSrsState & getDueCards due branch run
    localStorage.setItem(
      "atp.srs.v1",
      JSON.stringify([{ id: "v1", interval: 1, repetitions: 1, easeFactor: 2.5, nextReview: 0, lastReview: 0 }])
    );

    // Non-empty vocab with 4 cards -> test Space flip & keys 1, 2, 3, 4 & languageChanged when flipped & complete
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        meta: { count: 4 },
        cards: [1, 2, 3, 4].map((i) => ({
          id: `v${i}`,
          h: `dhamma<${i}>`,
          pos: "m.",
          freq: 100 * i,
          vibFreq: 10,
          en: "reality",
          pt: "realidade",
          es: "realidad",
          usage: "canonical",
          grammar: "masc.",
          root: "dhar",
          rank: i,
        })),
      }),
    }) as any;
    const srsMod2 = await import("../../src/srs.js");
    const host2 = document.createElement("div");
    overlay.innerHTML = "";
    overlay.appendChild(host2);
    srsMod2.initSrsPanel(host2);
    await new Promise((r) => setTimeout(r, 40));

    for (const key of ["1", "2", "3", "4"]) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
      if (key === "1") {
        window.dispatchEvent(new Event("languageChanged"));
        // Force saveSrsState catch block (line 67) on first rating
        vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
          throw new Error("quota");
        });
      }
      document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    }
    expect(host2.querySelector(".srs-complete-text")).not.toBeNull();
    window.dispatchEvent(new Event("languageChanged"));

    // Re-init when all 4 cards are now in the future -> queue.length === 0 -> showComplete() on init (line 452)
    const host3 = document.createElement("div");
    overlay.innerHTML = "";
    overlay.appendChild(host3);
    srsMod2.initSrsPanel(host3);
    await new Promise((r) => setTimeout(r, 40));
    expect(host3.querySelector(".srs-complete-text")).not.toBeNull();
  });

  it("dictionary.ts: covers all normalizePali morphological rules, compound resolveFormTarget, showWordInDictionaryPanel, and both entry renderers", async () => {
    // Exercise every suffix and prefix rule in normalizePali
    for (const tok of [
      "paccayo",
      "dhammānaṃ",
      "dhammā",
      "ārammaṇe",
      "paccayena",
      "hetū",
      "hotīti",
      "uppajjanti",
      "dhammehi",
      "dhātūhi",
      "sabbesaṃ",
      "vedanāya",
      "uppajjissatī",
      "nahetu",
      "naārammaṇe",
      "nadhammā",
      "napaccayo",
      "napaccayena",
      "nadhammehi",
      "nadhammānaṃ",
      "nevadassanena",
      "nevadhamme",
      "nevadhammā",
      "nevadhammo",
      "nevadhammehi",
      "bhikkhave",
    ]) {
      expect(normalizePali(tok).length).toBeGreaterThanOrEqual(2);
    }

    vi.resetModules();
    global.fetch = vi.fn(async (url: any) => {
      const u = String(url);
      if (u.includes("pali_core.json")) {
        return {
          ok: true,
          json: async () => ({
            meta: { count: 2 },
            roots: {
              "√cit": {
                en: "think",
                pt: "pensar",
                es: "pensar",
                sanskrit: "√cit",
                sanskrit_en: "perceive",
                sanskrit_pt: "perceber",
                sanskrit_es: "percibir",
              },
            },
            entries: [
              {
                h: "citta",
                freq: 500,
                pct: 1.25,
                usage: "Abhidhamma",
                senses: [
                  {
                    id: "citta 1",
                    pos: "n.",
                    grammar: "nt.",
                    root: "√cit",
                    en: "consciousness",
                    pt: "consciência",
                    es: "conciencia",
                    syn: "mano",
                    ant: "rūpa",
                  },
                ],
              },
              {
                h: "dhamma",
                freq: 800,
                pct: 2.0,
                senses: [{ id: "dhamma 1", pos: "m.", root: "√unknown", en: "reality", pt: "realidade", es: "realidad" }],
              },
            ],
            forms: {
              cittadhamma: "citta+dhamma",
              cittassa: "citta",
            },
          }),
        } as any;
      }
      return {
        ok: true,
        json: async () => ({
          meta: { version: 1, language: ["en", "pt", "es"], source: "test", count: 1 },
          entries: [
            {
              h: "sīla",
              pos: "n.",
              en: "virtue",
              pt: "virtude",
              es: "virtud",
              root: "√sīl",
              syn: ["caritta"],
              usage: "ethics",
              freq: 42,
            },
            {
              h: "sīlabbata",
              pos: "n.",
              en: "rites and rituals",
              pt: "ritos e preceitos",
              es: "ritos y preceptos",
              freq: 12,
            },
          ],
        }),
      } as any;
    }) as any;

    const dictMod = await import("../../src/dictionary.js");
    document.body.innerHTML = `
      <button class="rail-btn" data-panel="dictionary"></button>
      <aside id="side-panel" class="collapsed">
        <div id="panel-dictionary" class="panel">
          <input id="dict-search" />
          <div id="dict-results"></div>
        </div>
      </aside>
      <button id="panel-collapse">›</button>
    `;
    const input = document.getElementById("dict-search") as HTMLInputElement;
    const results = document.getElementById("dict-results")!;
    dictMod.initDictionaryPanel(input, results);
    await new Promise((r) => setTimeout(r, 30));

    // Compound resolution via formsMap (citta+dhamma)
    const comp = await dictMod.lookupPali("cittadhamma");
    expect(comp?.h).toBe("cittadhamma");
    // Simple inflected form via formsMap
    const infl = await dictMod.lookupPali("cittassa");
    expect(infl?.h).toBe("citta");
    // Common dict fallback & prefix matching
    expect((await dictMod.lookupPali("sīla"))?.h).toBe("sīla");
    expect((await dictMod.lookupPali("sīl"))?.h).toBe("sīla");
    expect((await dictMod.lookupPali("cit"))?.h).toBe("citta");
    expect((await dictMod.lookupPali("cittavīthi"))?.h).toBe("citta");
    expect(await dictMod.lookupPali("x")).toBeNull();
    expect(await dictMod.lookupPali("...")).toBeNull();

    dictMod.showWordInDictionaryPanel("...");
    dictMod.showWordInDictionaryPanel("sīl");
    expect(results.textContent).toContain("virtue");
    expect(results.textContent).toContain("rites and rituals");
    dictMod.showWordInDictionaryPanel("citta");
    expect(results.textContent).toContain("consciousness");
    // Ensure .rail-btn[data-panel="dictionary"] is .active and location.hash has ?q=citta, then clear input to hit line 409
    document.querySelector(".rail-btn")?.classList.add("active");
    window.location.hash = "#/dictionary?q=citta";
    input.value = "";
    input.dispatchEvent(new Event("input"));
    window.dispatchEvent(new CustomEvent("paliWordSelected", { detail: { word: "dhamma" } }));
    expect(results.textContent).toContain("reality");

    // Also test dictionary load failure (lines 45, 49, 53) and showWordInDictionaryPanel before initDictionaryPanel (line 376)
    vi.resetModules();
    global.fetch = vi.fn(async (url: any) => {
      if (String(url).includes("pali_core.json")) throw new Error("network err");
      return { ok: false, status: 500 } as any;
    }) as any;
    const dictFailMod = await import("../../src/dictionary.js");
    dictFailMod.showWordInDictionaryPanel("citta");
    await dictFailMod.lookupPali("citta");
  });

  it("selection.ts: covers translation-line selection, copy link (success & failure), close button, outside click, and edge clamping", async () => {
    document.body.innerHTML = `
      <div id="content">
        <div class="seg" data-seg-id="9" data-pali="Cittaṃ">
          <div class="pali-line"><span class="pali-word" data-word="Cittaṃ">Cittaṃ</span><button class="bookmark-toggle">☆</button></div>
          <div class="translation-line">Consciousness</div>
        </div>
      </div>
      <div id="selection-popover" class="hidden"></div>
      <div id="outside">Outside</div>
    `;
    const transl = document.querySelector(".translation-line")!;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("denied")) },
    });
    global.window.getSelection = vi.fn().mockReturnValue({
      isCollapsed: false,
      rangeCount: 1,
      toString: () => "Consciousness",
      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 2000, left: 2000, right: 2100, bottom: 2020, width: 100, height: 20 }),
        startContainer: transl,
        endContainer: transl,
        intersectsNode: () => false,
      }),
    }) as any;

    initSelectionHandler(document.getElementById("content")!);
    // Clicking bookmark button is ignored
    document.querySelector(".bookmark-toggle")!.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    // Selecting in translation-line opens popover with Pāli counterpart
    transl.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 40));

    const pop = document.getElementById("selection-popover")!;
    expect(pop.classList.contains("hidden")).toBe(false);
    expect(pop.textContent).toContain("Cittaṃ");

    // Copy link success & failure
    const linkBtn = pop.querySelector<HTMLButtonElement>(".sp-link-btn")!;
    linkBtn.click();
    await new Promise((r) => setTimeout(r, 10));
    linkBtn.click();
    await new Promise((r) => setTimeout(r, 10));

    // Outside click clears selection
    document.getElementById("outside")!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(pop.classList.contains("hidden")).toBe(true);
    clearSelection();
  });
});
