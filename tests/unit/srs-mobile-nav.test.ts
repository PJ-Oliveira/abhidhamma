import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

describe("SRS, Abhidhamma SRS & Mnemonic Lab Mobile & Desktop Navigation", () => {
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

  it("includes in-panel SRS top bar for Vocab, Abhidhamma SRS, and Mnemonic Lab (and no Tetris)", () => {
    const topBar = document.querySelector("#reader-srs .srs-top-bar");
    expect(topBar).not.toBeNull();

    expect(document.querySelector('.srs-tab-btn[data-srs-mode="vocab"]')).not.toBeNull();
    expect(document.querySelector('.srs-tab-btn[data-srs-mode="abhidhamma"]')).not.toBeNull();
    expect(document.querySelector('.srs-tab-btn[data-srs-mode="mnemonic"]')).not.toBeNull();
    expect(document.querySelector('.srs-tab-btn[data-srs-mode="tetris"]')).toBeNull();
    expect(document.querySelector('.rail-btn[data-panel="tetris"]')).toBeNull();
  });

  it("switches to Abhidhamma SRS and Mnemonic Lab via top tab buttons and back to Vocab", async () => {
    const railSrsBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="srs"]')!;
    railSrsBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    const readerSrs = document.getElementById("reader-srs")!;
    expect(readerSrs.style.display).toBe("flex");

    const abhiTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="abhidhamma"]')!;
    abhiTab.click();
    await new Promise((r) => setTimeout(r, 80));

    const abhiMain = document.getElementById("srs-abhidhamma-main")!;
    const mnemonicMain = document.getElementById("srs-mnemonic-main")!;
    const vocabBody = document.getElementById("srs-full-body")!;
    expect(abhiMain.style.display).toBe("flex");
    expect(mnemonicMain.style.display).toBe("none");
    expect(vocabBody.style.display).toBe("none");
    expect(abhiMain.querySelectorAll(".abhi-chapter-card").length).toBe(10);

    const mnemonicTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="mnemonic"]')!;
    mnemonicTab.click();
    await new Promise((r) => setTimeout(r, 80));
    expect(mnemonicMain.style.display).toBe("flex");
    expect(abhiMain.style.display).toBe("none");
    expect(vocabBody.style.display).toBe("none");
    expect(mnemonicMain.querySelector(".mnem-lab-root")).not.toBeNull();

    const vocabTab = document.querySelector<HTMLButtonElement>('.srs-tab-btn[data-srs-mode="vocab"]')!;
    vocabTab.click();
    await new Promise((r) => setTimeout(r, 50));
    expect(vocabBody.style.display).toBe("flex");
    expect(mnemonicMain.style.display).toBe("none");
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

  it("opens the side-panel drawer when tapping Dictionary or Search on mobile while reading a work", async () => {
    const origW = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 360 });
    try {
      const sidePanel = document.getElementById("side-panel")!;
      sidePanel.classList.add("collapsed");

      const dictBtn = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="dictionary"]')!;
      dictBtn.click();
      await new Promise((r) => setTimeout(r, 80));
      expect(sidePanel.classList.contains("collapsed")).toBe(false);
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: origW });
    }
  });

  it("synchronizes Abhidhamma SRS and Mnemonic Lab language across EN, PT, and ES from #setting-lang", async () => {
    const langSelect = document.getElementById("setting-lang") as HTMLSelectElement;
    const abhiMain = document.getElementById("srs-abhidhamma-main")!;
    const mnemonicMain = document.getElementById("srs-mnemonic-main")!;

    for (const [lang, expectedAbhi, expectedMnem] of [
      ["en", "Foundations: The Four Ultimate Realities", "Abhidhammatthasaṅgaha Mnemonic Lab"],
      ["es", "Fundamentos: Las Cuatro Realidades Últimas", "Laboratorio Mnemónico del Abhidhammatthasaṅgaha"],
      ["pt", "Fundamentos: As Quatro Realidades Últimas", "Laboratório Mnêmico do Abhidhammatthasaṅgaha"],
    ] as const) {
      langSelect.value = lang;
      langSelect.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 50));
      expect(abhiMain.textContent).toContain(expectedAbhi);
      expect(mnemonicMain.textContent).toContain(expectedMnem);
    }
  });
});
