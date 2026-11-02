import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

describe("Contemporary Commentaries — Full Integration (3 New Works & 5 Versions)", () => {
  beforeAll(() => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
    document.body.innerHTML = bodyMatch ? bodyMatch[1]! : "";
    (Element.prototype as any).scrollIntoView = () => {};

    global.fetch = async (url: string | URL | globalThis.Request) => {
      const rawUrl = url.toString().replace(/^\.\//, "").replace(/^\//, "").split("?")[0]!;
      const decoded = decodeURIComponent(rawUrl);
      const diskPath = path.join(ROOT, decoded);
      if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
        const text = fs.readFileSync(diskPath, "utf8");
        return {
          ok: true,
          status: 200,
          text: async () => text,
          json: async () => JSON.parse(text),
        } as any;
      }
      return {
        ok: false,
        status: 404,
        text: async () => "",
        json: async () => ({}),
      } as any;
    };
  });

  it("renders all 10 Contemporary Commentaries works in exact order, supports all 5 reading & export modes, indexes search, and preserves non-regression", async () => {
    await import("../../src/app.js");
    await new Promise((r) => setTimeout(r, 350));

    // Switch UI language to English first to verify exact English group title & order
    const langSel = document.getElementById("setting-lang") as HTMLSelectElement;
    langSel.value = "en";
    langSel.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 100));

    const groups = Array.from(document.querySelectorAll("#tree > ul > li"));
    expect(groups.length).toBe(4);
    const commGroup = groups[3]!;
    expect(commGroup.querySelector(".group-title")?.textContent?.trim()).toBe(
      "Contemporary Commentaries"
    );

    const commTitles = Array.from(
      commGroup.querySelectorAll(":scope > ul > li > .node-label > span:nth-child(2)")
    ).map((s) => s.textContent?.trim());

    expect(commTitles).toEqual([
      "Buddhism in Daily Life",
      "The Buddha's Path",
      "Introduction to the Abhidhamma",
      "Abhidhamma in Daily Life",
      "The Conditionality of Life",
      "The Buddhist Teaching on Physical Phenomena",
      "Path Without Ownership",
      "Lessons in Abhidhamma",
      "Dhamma Now",
      "Dhamma Now 2",
    ]);

    const newBooks = [
      {
        id: "lessons-in-abhidhamma",
        expectedCount: 455,
        expectedChaps: 8,
        enTitle: "Lessons in Abhidhamma",
        ptTitle: "Lições de Abhidhamma",
        esTitle: "Lecciones de Abhidhamma",
      },
      {
        id: "dhamma-now",
        expectedCount: 686,
        expectedChaps: 12,
        enTitle: "Dhamma Now",
        ptTitle: "Dhamma Agora",
        esTitle: "Dhamma Ahora",
      },
      {
        id: "dhamma-now-2",
        expectedCount: 846,
        expectedChaps: 13,
        enTitle: "Dhamma Now 2",
        ptTitle: "Dhamma Agora 2",
        esTitle: "Dhamma Ahora 2",
      },
    ];

    for (const book of newBooks) {
      const leaf = document.querySelector<HTMLElement>(
        `.node-label.leaf[data-work-id="${book.id}"][data-part-key="texto"]`
      );
      expect(leaf).toBeTruthy();
      leaf!.click();
      await new Promise((r) => setTimeout(r, 150));

      const segs = document.querySelectorAll("#content .seg");
      expect(segs.length).toBe(book.expectedCount);

      const chaps = document.querySelectorAll("#chapter-nav .chapter-nav-list li");
      expect(chaps.length).toBe(book.expectedChaps);

      const versionTabs = Array.from(
        document.querySelectorAll<HTMLButtonElement>("#part-tabs .version-tab")
      );
      expect(versionTabs.map((b) => b.dataset.versionMode)).toEqual([
        "en",
        "en+pt",
        "en+es",
        "pt",
        "es",
      ]);

      // 1. Inglês (Original formatado)
      document.querySelector<HTMLElement>('#part-tabs .version-tab[data-version-mode="en"]')!.click();
      let firstSeg = document.querySelector("#content .seg")!;
      expect(firstSeg.classList.contains("no-translation")).toBe(true);
      expect(firstSeg.querySelector(".pali-line")?.textContent).toContain(book.enTitle);
      expect((firstSeg.querySelector(".translation-line") as HTMLElement)?.style.display).toBe("none");
      expect((document.getElementById("setting-show-pali") as HTMLInputElement).checked).toBe(true);
      expect((document.getElementById("setting-show-translation") as HTMLInputElement).checked).toBe(false);

      // 2. Bilíngue: Inglês – Português
      document.querySelector<HTMLElement>('#part-tabs .version-tab[data-version-mode="en+pt"]')!.click();
      firstSeg = document.querySelector("#content .seg")!;
      expect(firstSeg.classList.contains("no-pali")).toBe(false);
      expect(firstSeg.classList.contains("no-translation")).toBe(false);
      expect(firstSeg.querySelector(".pali-line")?.textContent).toContain(book.enTitle);
      expect(firstSeg.querySelector(".translation-line")?.textContent).toContain(book.ptTitle);

      // 3. Bilíngue: Inglês – Espanhol
      document.querySelector<HTMLElement>('#part-tabs .version-tab[data-version-mode="en+es"]')!.click();
      firstSeg = document.querySelector("#content .seg")!;
      expect(firstSeg.querySelector(".pali-line")?.textContent).toContain(book.enTitle);
      expect(firstSeg.querySelector(".translation-line")?.textContent).toContain(book.esTitle);

      // 4. Português (Monolíngue)
      document.querySelector<HTMLElement>('#part-tabs .version-tab[data-version-mode="pt"]')!.click();
      firstSeg = document.querySelector("#content .seg")!;
      expect(firstSeg.classList.contains("no-pali")).toBe(true);
      expect(firstSeg.querySelector(".pali-line .bookmark-toggle")).toBeNull();
      expect(firstSeg.querySelector(".translation-line")?.textContent).toContain(book.ptTitle);
      expect(firstSeg.querySelector(".translation-line .bookmark-toggle")).not.toBeNull();
      expect((document.getElementById("setting-show-pali") as HTMLInputElement).checked).toBe(false);
      expect((document.getElementById("setting-show-translation") as HTMLInputElement).checked).toBe(true);

      // 5. Espanhol (Monolíngue)
      document.querySelector<HTMLElement>('#part-tabs .version-tab[data-version-mode="es"]')!.click();
      firstSeg = document.querySelector("#content .seg")!;
      expect(firstSeg.classList.contains("no-pali")).toBe(true);
      expect(firstSeg.querySelector(".pali-line .bookmark-toggle")).toBeNull();
      expect(firstSeg.querySelector(".translation-line")?.textContent).toContain(book.esTitle);
      expect(firstSeg.querySelector(".translation-line .bookmark-toggle")).not.toBeNull();
    }

    // Non-regression A: Legacy commentary (`buddhism-in-daily-life`) shows 3 modes and falls back cleanly from `es` -> `pt`
    const legacyLeaf = document.querySelector<HTMLElement>(
      '.node-label.leaf[data-work-id="buddhism-in-daily-life"][data-part-key="texto"]'
    )!;
    legacyLeaf.click();
    await new Promise((r) => setTimeout(r, 150));
    const legacyModes = Array.from(
      document.querySelectorAll<HTMLButtonElement>("#part-tabs .version-tab")
    ).map((b) => b.dataset.versionMode);
    expect(legacyModes).toEqual(["en", "en+pt", "pt"]);
    expect(document.querySelector("#content .seg .translation-line")?.textContent?.trim().length).toBeGreaterThan(0);

    // Non-regression B: Canonical Pāli work (`dhammasangani`) shows Pāli + Translation intact even after viewing monolingual mode
    const paliLeaf = document.querySelector<HTMLElement>(
      '.node-label.leaf[data-work-id="dhammasangani"][data-part-key="mula"]'
    )!;
    paliLeaf.click();
    await new Promise((r) => setTimeout(r, 150));
    const paliSeg = document.querySelector("#content .seg")!;
    expect(paliSeg.querySelector(".pali-line")).not.toBeNull();
    expect(paliSeg.querySelector(".translation-line")).not.toBeNull();
    expect(document.querySelectorAll("#part-tabs .version-tab").length).toBe(0);

    // Search index check across all 3 new books (EN, PT, ES, Pāli diacritics)
    document.querySelector<HTMLElement>('[data-panel="search"]')!.click();
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    for (const term of ["subhūti", "procter", "cajita", "mclanche"]) {
      searchInput.value = term;
      searchInput.dispatchEvent(new Event("input"));
      await new Promise((r) => setTimeout(r, 380));
      const hitItems = document.querySelectorAll("#search-results .side-item");
      expect(hitItems.length).toBeGreaterThan(0);
    }

    // Export panel auto-selection & 5 commentary options
    document
      .querySelector<HTMLElement>(
        '.node-label.leaf[data-work-id="lessons-in-abhidhamma"][data-part-key="texto"]'
      )!
      .click();
    await new Promise((r) => setTimeout(r, 120));
    document.querySelector<HTMLElement>('[data-panel="export"]')!.click();

    const exportWork = document.getElementById("export-work") as HTMLSelectElement;
    const exportLang = document.getElementById("export-lang") as HTMLSelectElement;
    expect(exportWork.value).toBe("lessons-in-abhidhamma");
    expect(Array.from(exportLang.options).map((o) => o.value)).toEqual([
      "en",
      "pali+pt",
      "pali+es",
      "pt",
      "es",
    ]);
  }, 60000);
});
