import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { AllCittas } from "../../src/ontology/citta.js";
import { AtthakathaOntology } from "../../src/ontology/commentary.js";
import { evaluateCustomClaim, evaluateScenario } from "../../src/ontology/kathavatthu_logic.js";
import { CanonicalScenarios } from "../../src/ai-feature/debate-scenarios.js";

const ROOT = path.resolve(__dirname, "../..");

describe("Preventive Regression Guardrails — All 24 Audited Bugs", () => {
  it("BUG #001 & #010: Service Worker CORE_ASSETS covers 100% of transitive runtime JS imports", () => {
    const sw = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
    const m = sw.match(/const CORE_ASSETS = \[([\s\S]*?)\];/);
    expect(m).not.toBeNull();
    const cached = new Set(Array.from(m![1]!.matchAll(/'([^']+)'/g), (x) => x[1]!));

    const visited = new Set<string>();
    const queue = ["./js/app.js", "./js/ai-feature/ui.js"];
    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (visited.has(cur)) continue;
      visited.add(cur);
      const diskPath = path.join(ROOT, cur.slice(2));
      expect(fs.existsSync(diskPath), `Missing compiled JS module: ${cur}`).toBe(true);
      const src = fs.readFileSync(diskPath, "utf8");
      for (const im of src.matchAll(
        /(?:import|export)\s+(?:[^;]*?from\s+)?['"](\.[^"']+\.js)(?:\?v=[^"']*)?['"]|import\(['"](\.[^"']+\.js)(?:\?v=[^"']*)?['"]\)/g
      )) {
        const rel = im[1] || im[2]!;
        const next = "./" + path.posix.normalize(path.posix.join(path.posix.dirname(cur.slice(2)), rel));
        queue.push(next);
      }
    }

    const missing = [...visited].filter((f) => !cached.has(f));
    expect(missing).toEqual([]);
  });

  it("BUG #002: index.html (<html lang='en'>) has zero Portuguese fallback strings", () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    expect(html).not.toMatch(/(Configurações|Laboratório Mnêmico|Lab\. Mnêmico|Descompactação N-ária|Anterior|Próximo|App Offline)/);
  });

  it("BUG #003 & #004: CSS hides #interlocutor-container in mobile SRS (<=768px) and reserves bottom clearance in mobile .panel (<=600px)", () => {
    const css = fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8");
    expect(css).toContain(
      'body:has(#reader-srs:not([style*="display: none"]):not([style*="display:none"])) #interlocutor-container'
    );
    expect(css).toContain(".panel { padding: 12px 12px 56px; }");
  });

  it("BUG #007: Contemporary commentaries in manifest.json carry localized PT/ES chapter titles across all chunks", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "data/manifest.json"), "utf8"));
    for (const work of manifest.groups.comentarios) {
      const chaps = work.parts.texto.toc.filter((e: any) => e.rend === "chapter");
      expect(chaps.length, `${work.id} should have chapters`).toBeGreaterThan(0);
      const withPt = chaps.filter((c: any) => typeof c.pt === "string" && c.pt.trim().length > 0);
      expect(withPt.length, `${work.id} chapters missing PT titles`).toBe(chaps.length);
      if (work.languages?.includes("es")) {
        const withEs = chaps.filter((c: any) => typeof c.es === "string" && c.es.trim().length > 0);
        expect(withEs.length, `${work.id} chapters missing ES titles`).toBe(chaps.length);
      }
    }
  });

  it("BUG #011 & #015: Abhidhamma SRS UI strings match real button names in PT and consistent tuteo in ES", () => {
    const src = fs.readFileSync(path.join(ROOT, "src/abhidhamma-srs/ui.ts"), "utf8");
    expect(src).not.toContain("«Errei»");
    expect(src).toContain("«De novo»");
    expect(src).not.toContain("formule mentalmente o escriba su respuesta");
    expect(src).toContain("formula mentalmente o escribe tu respuesta");
  });

  it("BUG #012: Chariot Analogy cites Vajirā Sutta (SN 5.10) / Milindapañha, never Ratha-vinīta", () => {
    expect(AtthakathaOntology.puggala!.pedagogicalAnalogy).toContain("Vajirā Sutta");
    expect(AtthakathaOntology.puggala!.pedagogicalAnalogy).not.toContain("Ratha-vinīta");
    expect(evaluateCustomClaim("The self exists").pedagogicalAnalogy).toContain("Vajirā Sutta");
    for (const lang of ["en", "pt", "es"] as const) {
      const res = evaluateScenario("puggala_vada", lang);
      expect(res.pedagogicalAnalogy).toContain("Vajirā Sutta");
      expect(res.pedagogicalAnalogy).not.toContain("Ratha-vinīta");
    }
  });

  it("BUG #013: DosaMula1 includes all 5 canonical Pakiṇṇaka cetasikas including Chanda (AS II.20)", () => {
    expect(AllCittas.DosaMula1!.associatedCetasikas).toContain("Chanda");
    expect(AllCittas.DosaMula1!.associatedCetasikas).not.toContain("Pīti");
    expect(AllCittas.DosaMula1!.associatedCetasikas.length).toBe(17);
  });

  it("BUG #014: Spanish translation of Ṭhapanīyapañha never uses false cognate 'Premisa Incontestable'", () => {
    const kala = CanonicalScenarios.find((s) => s.id === "kāla_vada")!;
    expect(kala.metaLogic!.es).not.toMatch(/Incontestable/i);
    expect(kala.metaLogic!.es).toContain("Pregunta que debe dejarse de lado");
  });

  it("BUG #016 & #017: pali_core.json has zero ivirodho/desconsultar/re-arising corruptions, accurate upapatti, and clean freq>=10 translations", () => {
    const core = JSON.parse(fs.readFileSync(path.join(ROOT, "data/dictionary/pali_core.json"), "utf8"));
    const bad: string[] = [];
    for (const e of core.entries) {
      for (const s of e.senses ?? []) {
        for (const lang of ["pt", "es"] as const) {
          const v = String(s[lang] ?? "");
          if (/ivirodho|desconsultar|re-arising|olha beautiful|mira beautiful|olha dobrar|mira doblar|olha após|tocando intimately/i.test(v)) {
            bad.push(`${e.h}/${s.id}.${lang}: ${v}`);
          }
          if ((e.h === "upapatti" || e.h === "upapāta") && /falecimento/i.test(v)) {
            bad.push(`${e.h}/${s.id}.${lang}: ${v}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("BUG #018: abhidhamma_cards.json and vocabulary.json contain zero English 'insight' leaks in PT/ES", () => {
    const cards = JSON.parse(fs.readFileSync(path.join(ROOT, "data/srs/abhidhamma_cards.json"), "utf8"));
    for (const c of cards.cards) {
      for (const val of Object.values(c) as any[]) {
        if (val && typeof val === "object") {
          for (const lang of ["pt", "es"]) {
            if (typeof val[lang] === "string") {
              expect(val[lang], `${c.id}.${lang}`).not.toMatch(/\binsight\b/i);
            }
          }
        }
      }
    }
    const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, "data/srs/vocabulary.json"), "utf8"));
    for (const c of vocab.cards) {
      expect(c.pt).not.toMatch(/\binsight\b/i);
      expect(c.es).not.toMatch(/\binsight\b/i);
    }
  });

  it("BUG #019, #020 & #021: All 21 works have zero empty PT, zero empty ES (canonical/trilingual), zero empty <p .../> XML tags, and zero Abhidhamma English term leaks", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "data/manifest.json"), "utf8"));
    const emptyXmlRx = /^\s*<p\b[^>]*\/>\s*$/;
    const abhiLeakRx =
      /\b(rootless|unprompted|prompted|sense-sphere|fine-material|immaterial|supramundane|wholesome|unwholesome|adverting|receiving|investigating|determining|impulsion|registration|dependent origination|mental factor|mental factors)\b/i;

    const violations: string[] = [];
    for (const [group, works] of Object.entries<any[]>(manifest.groups)) {
      for (const w of works) {
        const expectEs = group !== "comentarios" || Boolean(w.languages?.includes("es"));
        for (const part of Object.values<any>(w.parts)) {
          for (const fname of part.files) {
            const segs = JSON.parse(fs.readFileSync(path.join(ROOT, "data/works", w.id, fname), "utf8"));
            for (const s of segs) {
              if (emptyXmlRx.test(s.pali || "")) violations.push(`xml:${w.id}/${fname}#${s.id}`);
              if (s.pali || s.en) {
                if (!(s.pt || "").trim()) violations.push(`emptyPT:${w.id}/${fname}#${s.id}`);
                if (expectEs && !(s.es || "").trim()) violations.push(`emptyES:${w.id}/${fname}#${s.id}`);
              }
              if (abhiLeakRx.test(s.pt || "")) violations.push(`enPT:${w.id}/${fname}#${s.id}`);
              if (abhiLeakRx.test(s.es || "")) violations.push(`enES:${w.id}/${fname}#${s.id}`);
            }
          }
        }
      }
    }
    expect(violations).toEqual([]);
  }, 30000);

  it("BUG #022: Compiled JS production bundle stamps uniform ?v=<hash> across single-quoted, double-quoted, dynamic import(), and export * from", () => {
    const appJs = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");
    const uiJs = fs.readFileSync(path.join(ROOT, "js/ai-feature/ui.js"), "utf8");
    const kvJs = fs.readFileSync(path.join(ROOT, "js/ontology/kathavatthu.js"), "utf8");
    const appStateMatch = appJs.match(/from "\.\/state\.js\?v=([a-f0-9]{8})"/);
    expect(appStateMatch).not.toBeNull();
    const ver = appStateMatch![1]!;
    expect(appJs).toContain(`import('./ai-feature/ui.js?v=${ver}')`);
    expect(uiJs).toContain(`from '../state.js?v=${ver}'`);
    expect(kvJs).toContain(`export * from './formal_logic.js?v=${ver}'`);
  });

  it("BUG #024: clampChapterNavList clamps vertical maxHeight so dropdown never overflows short landscape viewports", () => {
    const appSrc = fs.readFileSync(path.join(ROOT, "src/app.ts"), "utf8");
    expect(appSrc).toContain("list.style.maxHeight = `${availH}px`");
  });

  it("BUG #027: .side-item and .side-item .snippet enforce overflow-wrap: anywhere for long Pāli compounds in search/history results", () => {
    const css = fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8");
    expect(css).toMatch(/\.side-item\s*\{[^}]*overflow-wrap:\s*anywhere/);
    expect(css).toMatch(/\.side-item\s+\.snippet\s*\{[^}]*overflow-wrap:\s*anywhere/);
  });

  it("BUG #028: Abhidhamma SRS houseLockedPrefix/houseLockedSuffix never produces duplicate percent sign ('% %')", () => {
    const uiSrc = fs.readFileSync(path.join(ROOT, "src/abhidhamma-srs/ui.ts"), "utf8");
    expect(uiSrc).not.toContain("${meta.houseUnlockAtomPct}% ${s.houseLockedSuffix}");
    expect(uiSrc).toContain("${meta.houseUnlockAtomPct}${s.houseLockedSuffix}");
  });
});
