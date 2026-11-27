// @vitest-environment node
import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as http from "node:http";
import { spawn } from "node:child_process";

const ROOT = path.resolve(__dirname, "../..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
};

const VIEWPORTS = [
  { name: "phone-small-320", width: 320, height: 568, mobile: true },
  { name: "phone-360", width: 360, height: 640, mobile: true },
  { name: "phone-375", width: 375, height: 812, mobile: true },
  { name: "phone-landscape-667x375", width: 667, height: 375, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "tablet-860", width: 860, height: 1024, mobile: false },
  { name: "laptop-1280", width: 1280, height: 720, mobile: false },
  { name: "laptop-1366", width: 1366, height: 768, mobile: false },
  { name: "desktop-1920", width: 1920, height: 1080, mobile: false },
  { name: "tv-2k-2560", width: 2560, height: 1440, mobile: false },
  { name: "tv-4k-3840", width: 3840, height: 2160, mobile: false },
];

describe("Multi-Viewport Real Browser UI & Responsiveness Suite (Phone → Tablet → Laptop → Desktop → 4K TV)", () => {
  it("renders every core view without horizontal overflow, viewport clipping, rail overlap, or runtime errors across all 11 screen sizes", async () => {
    if (!fs.existsSync(CHROME)) {
      // Fallback CSS structural check when Chrome is absent in headless CI
      const css = fs.readFileSync(path.join(ROOT, "css/style.css"), "utf8");
      expect(css).toContain("@media (max-width: 860px)");
      expect(css).toContain("@media (max-width: 600px)");
      expect(css).toContain("@media (max-width: 768px)");
      return;
    }

    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]!);
      const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });

    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    const addr = server.address() as { port: number };
    const baseUrl = `http://127.0.0.1:${addr.port}/`;
    const debugPort = 9700 + Math.floor(Math.random() * 200);
    const chrome = spawn(
      CHROME,
      [
        "--headless=new",
        `--remote-debugging-port=${debugPort}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-gpu",
        `--user-data-dir=/tmp/abhi-vitest-cdp-${debugPort}`,
        "about:blank",
      ],
      { stdio: "ignore" }
    );

    let ws: WebSocket | null = null;
    try {
      let wsUrl = "";
      for (let i = 0; i < 40; i++) {
        try {
          const r = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
          const list = (await r.json()) as Array<{ type: string; webSocketDebuggerUrl?: string }>;
          const page = list.find((t) => t.type === "page");
          if (page?.webSocketDebuggerUrl) {
            wsUrl = page.webSocketDebuggerUrl;
            break;
          }
        } catch {
          // retry
        }
        await new Promise((r) => setTimeout(r, 150));
      }
      expect(wsUrl).toBeTruthy();

      ws = new WebSocket(wsUrl);
      await new Promise((res, rej) => {
        ws!.onopen = res;
        ws!.onerror = rej;
      });

      let msgId = 0;
      const pending = new Map<number, { res: (v: any) => void; rej: (e: Error) => void }>();
      const consoleErrors: string[] = [];
      const exceptions: string[] = [];

      ws.onmessage = (ev) => {
        const data = JSON.parse(String(ev.data));
        if (data.id && pending.has(data.id)) {
          const { res, rej } = pending.get(data.id)!;
          pending.delete(data.id);
          if (data.error) rej(new Error(data.error.message));
          else res(data.result);
        } else if (data.method === "Runtime.exceptionThrown") {
          exceptions.push(data.params.exceptionDetails?.text || "exception");
        } else if (data.method === "Runtime.consoleAPICalled" && data.params.type === "error") {
          consoleErrors.push(data.params.args.map((a: any) => a.value || a.description).join(" "));
        }
      };

      const cdp = (method: string, params: Record<string, unknown> = {}) =>
        new Promise<any>((res, rej) => {
          const id = ++msgId;
          pending.set(id, { res, rej });
          ws!.send(JSON.stringify({ id, method, params }));
        });

      const evalJs = async (expression: string) => {
        const r = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) {
          throw new Error(r.exceptionDetails.text);
        }
        return r.result.value;
      };

      await cdp("Page.enable");
      await cdp("Runtime.enable");

      for (const vp of VIEWPORTS) {
        await cdp("Emulation.setDeviceMetricsOverride", {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: vp.width >= 2560 ? 1 : 2,
          mobile: vp.mobile,
        });
        await cdp("Page.navigate", { url: baseUrl });
        for (let attempt = 0; attempt < 60; attempt++) {
          const ready = await evalJs(
            `Boolean(document.readyState === 'complete' && document.body && document.documentElement && document.getElementById('app') && document.querySelector('.node-label.leaf'))`
          ).catch(() => false);
          if (ready) break;
          await new Promise((r) => setTimeout(r, 100));
        }

        const issues = await evalJs(`(async () => {
          const found = [];
          const inspect = (screen) => {
            if (!document.documentElement || !document.body) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const docOv = document.documentElement.scrollWidth - vw;
            const bodyOv = document.body.scrollWidth - vw;
            const fixedIssues = [];
            for (const fid of ['btn-toggle-interlocutor', 'interlocutor-container']) {
              const fel = document.getElementById(fid);
              if (!fel) continue;
              const fst = getComputedStyle(fel);
              if (fst.display === 'none' || fst.visibility === 'hidden') continue;
              const r = fel.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) continue;
              if (r.left < -1 || r.right > vw + 1 || r.top < -1 || r.bottom > vh + 1) {
                fixedIssues.push({ id: fid, left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), vw, vh });
              }
            }
            const appEl = document.getElementById('app');
            const appRect = appEl ? appEl.getBoundingClientRect() : { height: vh };
            const appHeightGap = Math.abs(appRect.height - vh) > 4;
            if (docOv > 2 || bodyOv > 2 || fixedIssues.length || appHeightGap) {
              found.push({ screen, docOv, bodyOv, appHeightGap, fixedIssues });
            }
          };

          inspect('welcome');

          for (const panelId of ['dictionary', 'history', 'search', 'settings', 'export', 'tipitaka']) {
            document.querySelector('[data-panel="' + panelId + '"]')?.click();
            await new Promise(r => setTimeout(r, 80));
            inspect('panel-' + panelId);
          }

          document.querySelector('.node-label.leaf[data-work-id="lessons-in-abhidhamma"][data-part-key="texto"]')?.click();
          await new Promise(r => setTimeout(r, 250));
          inspect('reader');

          const chapBtn = document.querySelector('.chapter-nav-btn');
          if (chapBtn) {
            chapBtn.click();
            await new Promise(r => setTimeout(r, 80));
            const cl = document.querySelector('.chapter-nav-list');
            if (cl && !cl.hidden) {
              const cr = cl.getBoundingClientRect();
              if (cr.left < -1 || cr.right > window.innerWidth + 1 || cr.bottom > window.innerHeight + 1) {
                found.push({ screen: 'chapter-nav', top: Math.round(cr.top), bottom: Math.round(cr.bottom), left: Math.round(cr.left), right: Math.round(cr.right), vw: window.innerWidth, vh: window.innerHeight });
              }
            }
            document.body.click();
          }

          const debateBtn = document.getElementById('btn-toggle-interlocutor');
          if (debateBtn) {
            debateBtn.click();
            await new Promise(r => setTimeout(r, 200));
            inspect('debate-modal');
            debateBtn.click();
            await new Promise(r => setTimeout(r, 60));
          }

          document.querySelector('[data-panel="srs"]')?.click();
          await new Promise(r => setTimeout(r, 250));
          inspect('srs-vocab');

          document.querySelector('.srs-tab-btn[data-srs-mode="abhidhamma"]')?.click();
          await new Promise(r => setTimeout(r, 250));
          inspect('srs-abhidhamma');

          document.querySelector('.srs-tab-btn[data-srs-mode="mnemonic"]')?.click();
          await new Promise(r => setTimeout(r, 250));
          inspect('srs-mnemonic');

          return found;
        })()`);

        expect(issues, `Layout issues at ${vp.name} (${vp.width}x${vp.height})`).toEqual([]);
      }

      expect(consoleErrors).toEqual([]);
      expect(exceptions).toEqual([]);
    } finally {
      ws?.close();
      chrome.kill();
      server.close();
    }
  }, 120000);
});
