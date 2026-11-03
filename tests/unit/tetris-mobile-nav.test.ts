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
});
