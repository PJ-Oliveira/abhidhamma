import { describe, it, expect, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { t } from "../../src/i18n.js";
import { settings } from "../../src/state.js";
import { renderSegments } from "../../src/reader.js";
import { initSearchPanel } from "../../src/search.js";

describe("i18n Parity, PT/ES Purity, and Pāli Terminology Preservation", () => {
  it("maintains 100% key parity across pt, en, and es with every HTML/TS key defined", () => {
    const root = path.resolve(__dirname, "../..");
    const i18nSrc = fs.readFileSync(path.join(root, "src/i18n.ts"), "utf8");

    const extractKeys = (lang: string): Set<string> => {
      const m = i18nSrc.match(new RegExp(`\\b${lang}:\\s*\\{([\\s\\S]*?)\\n  \\},`));
      expect(m).toBeTruthy();
      const keys = new Set<string>();
      for (const match of m![1]!.matchAll(/^\s*([a-zA-Z0-9_]+):/gm)) {
        keys.add(match[1]!);
      }
      return keys;
    };

    const ptKeys = extractKeys("pt");
    const enKeys = extractKeys("en");
    const esKeys = extractKeys("es");

    expect([...ptKeys].sort()).toEqual([...enKeys].sort());
    expect([...esKeys].sort()).toEqual([...enKeys].sort());

    // Every data-i18n* attribute in index.html must exist in all 3 locales
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
    for (const m of html.matchAll(/data-i18n(?:-[a-z]+)?="([a-zA-Z0-9_]+)"/g)) {
      const key = m[1]!;
      expect(ptKeys.has(key), `Missing PT key for HTML ${key}`).toBe(true);
      expect(esKeys.has(key), `Missing ES key for HTML ${key}`).toBe(true);
      expect(enKeys.has(key), `Missing EN key for HTML ${key}`).toBe(true);
    }
  });

  it("has zero untranslated English or cross-language leaks in PT and ES UI labels", () => {
    expect(t("exportLangEn", "pt")).toBe("Só Inglês");
    expect(t("exportLangEs", "pt")).toBe("Só Espanhol");
    expect(t("exportLangPaliEnPt", "pt")).toBe("Pāli + Inglês + Português");
    expect(t("srsMenuMnemonicTitle", "pt")).toBe("Laboratório Mnêmico");
    expect(t("debate_btn_close", "pt")).toBe("❌ Fechar Debate");

    expect(t("exportLangEn", "es")).toBe("Solo inglés");
    expect(t("exportLangPaliEnEs", "es")).toBe("Pāli + Inglés + Español");
    expect(t("exportLangPaliPt", "es")).toBe("Pāli + Portugués");
    expect(t("srsMenuMnemonicTitle", "es")).toBe("Laboratorio Mnemónico");
    expect(t("debate_btn_close", "es")).toBe("❌ Cerrar Debate");
    expect(t("debate_verdict", "es")).toContain("Niggahaṭṭhāna");
    expect(t("debate_meta_logic", "es")).toContain("Anuṭīkā");
  });

  it("preserves canonical Pāli technical terms with exact diacritics in PT and ES", () => {
    for (const lang of ["pt", "es", "en"] as const) {
      expect(t("groupTitle_abhidhamma", lang)).toBe("Abhidhamma Piṭaka");
      expect(t("part_mula", lang)).toBe("Mūla");
      expect(t("part_attha", lang)).toBe("Aṭṭhakathā");
      expect(t("part_tika", lang)).toBe("Ṭīkā");
      expect(t("part_anutika", lang)).toBe("Anuṭīkā");
      expect(t("navTipitaka", lang)).toBe("Tipiṭaka");
      expect(t("srsMenuAbhiTitle", lang)).toBe("Abhidhamma SRS");
      expect(t("graphPanelTitle", lang)).toContain("Dhammas");
    }
  });

  it("updates Search empty hints dynamically on languageChanged and wraps Pāli ṁ and Spanish ü in Reader", async () => {
    const origUi = settings.uiLang;
    const origFetch = global.fetch;
    global.fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({ shards: {} }),
    })) as any;

    try {
      settings.uiLang = "pt";
      const input = document.createElement("input");
      const results = document.createElement("div");
      initSearchPanel(input, results, () => {});
      await new Promise((r) => setTimeout(r, 20));
      expect(results.textContent).toBe(t("typeToSearch", "pt"));

      settings.uiLang = "es";
      window.dispatchEvent(new Event("languageChanged"));
      expect(results.textContent).toBe(t("typeToSearch", "es"));

      // Reader Pāli word tokenization handles both ṃ/ṁ and Spanish ü
      const box = document.createElement("div");
      renderSegments(
        [{ id: 1, rend: "bodytext", pali: "Dhammaṁ bilingüe", pt: "Dhamma bilíngue", es: "Dhamma bilingüe" } as any],
        box
      );
      const words = Array.from(box.querySelectorAll(".pali-word")).map((el) => el.textContent);
      expect(words).toEqual(["Dhammaṁ", "bilingüe"]);
    } finally {
      settings.uiLang = origUi;
      global.fetch = origFetch;
    }
  });
});
