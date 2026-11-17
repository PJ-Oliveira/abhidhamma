import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

describe("Abhidhamma Tetris Mobile & Desktop Navigation", () => {
  beforeAll(async () => {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
    document.body.innerHTML = bodyMatch ? bodyMatch[1]! : "";

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
        ok: true,
        status: 200,
        text: async () => "{}",
        json: async () => ({}),
      } as any;
    };

    await import("../../src/app.js");
    await new Promise((r) => setTimeout(r, 350));
  });

  it("includes in-panel SRS top bar and rail navigation for Tetris", () => {
    const topBar = document.querySelector("#reader-srs .srs-top-bar");
    expect(topBar).not.toBeNull();

    const vocabTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="vocab"]');
    const tetrisTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="tetris"]');
    expect(vocabTab).not.toBeNull();
    expect(tetrisTab).not.toBeNull();

    const railTetrisBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="tetris"]');
    expect(railTetrisBtn).not.toBeNull();
  });

  it("switches to Tetris via top tab button even when sidebar is collapsed (mobile journey)", async () => {
    const railSrsBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="srs"]')!;
    railSrsBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const readerSrs = document.getElementById("reader-srs")!;
    expect(readerSrs.style.display).toBe("flex");

    const tetrisTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="tetris"]')!;
    tetrisTab.click();
    await new Promise((r) => setTimeout(r, 50));

    const tetrisMain = document.getElementById("srs-tetris-main")!;
    const vocabBody = document.getElementById("srs-full-body")!;
    expect(tetrisMain.style.display).toBe("flex");
    expect(vocabBody.style.display).toBe("none");
    expect(readerSrs.classList.contains("tetris-mode")).toBe(true);
    expect(document.body.classList.contains("tetris-active")).toBe(true);
    expect(tetrisTab.classList.contains("active")).toBe(true);
  });

  it("switches back to Vocab via top tab button", async () => {
    const vocabTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="vocab"]')!;
    vocabTab.click();
    await new Promise((r) => setTimeout(r, 50));

    const readerSrs = document.getElementById("reader-srs")!;
    const tetrisMain = document.getElementById("srs-tetris-main")!;
    const vocabBody = document.getElementById("srs-full-body")!;
    expect(vocabBody.style.display).toBe("flex");
    expect(tetrisMain.style.display).toBe("none");
    expect(readerSrs.classList.contains("tetris-mode")).toBe(false);
    expect(document.body.classList.contains("tetris-active")).toBe(false);
    expect(vocabTab.classList.contains("active")).toBe(true);
  });

  it("directly opens Tetris when clicking the rail Tetris button", async () => {
    const railTetrisBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="tetris"]')!;
    railTetrisBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const readerSrs = document.getElementById("reader-srs")!;
    const tetrisMain = document.getElementById("srs-tetris-main")!;
    expect(readerSrs.style.display).toBe("flex");
    expect(tetrisMain.style.display).toBe("flex");
    expect(railTetrisBtn.classList.contains("active")).toBe(true);
  });

  it("switches to Abhidhamma SRS mode via top tab button without regressing Vocab or Tetris", async () => {
    const abhiTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="abhidhamma"]')!;
    expect(abhiTab).not.toBeNull();
    abhiTab.click();
    await new Promise((r) => setTimeout(r, 80));

    const abhiMain = document.getElementById("srs-abhidhamma-main")!;
    const tetrisMain = document.getElementById("srs-tetris-main")!;
    const vocabBody = document.getElementById("srs-full-body")!;
    expect(abhiMain.style.display).toBe("flex");
    expect(tetrisMain.style.display).toBe("none");
    expect(vocabBody.style.display).toBe("none");
    expect(abhiTab.classList.contains("active")).toBe(true);
    expect(abhiMain.querySelectorAll(".abhi-chapter-card").length).toBe(10);
  });

  it("closes the side-panel drawer via #side-panel-close", async () => {
    const railTipiBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="tipitaka"]')!;
    railTipiBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const sidePanel = document.getElementById("side-panel")!;
    expect(sidePanel.classList.contains("collapsed")).toBe(false);

    const closeBtn = document.getElementById("side-panel-close") as HTMLButtonElement;
    expect(closeBtn).not.toBeNull();
    closeBtn.click();
    expect(sidePanel.classList.contains("collapsed")).toBe(true);
  });

  it("synchronizes Abhidhamma SRS language across EN, PT, and ES from #setting-lang", async () => {
    const abhiTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="abhidhamma"]')!;
    abhiTab.click();
    await new Promise((r) => setTimeout(r, 80));

    const langSelect = document.getElementById("setting-lang") as HTMLSelectElement;
    const abhiMain = document.getElementById("srs-abhidhamma-main")!;

    for (const [lang, expectedText] of [
      ["en", "Foundations: The Four Ultimate Realities"],
      ["es", "Fundamentos: Las Cuatro Realidades Últimas"],
      ["pt", "Fundamentos: As Quatro Realidades Últimas"],
    ] as const) {
      langSelect.value = lang;
      langSelect.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 50));
      expect(abhiMain.textContent).toContain(expectedText);
    }
  });
});
