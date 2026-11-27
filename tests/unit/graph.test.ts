import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { updateSettings } from "../../src/state.js";

describe("Dhammas Graph Panel (src/graph.ts) — Full Unit Coverage", () => {
  let rafCallback: FrameRequestCallback | null = null;
  let resizeCb: ResizeObserverCallback | null = null;

  beforeEach(() => {
    document.body.innerHTML = "";
    rafCallback = null;
    resizeCb = null;

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.stubGlobal("devicePixelRatio", 1);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: ResizeObserverCallback) {
          resizeCb = cb;
        }
        observe() {}
        disconnect() {}
      }
    );

    const mockCtx: any = {
      save: vi.fn(),
      restore: vi.fn(),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      arc: vi.fn(),
      roundRect: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn(() => ({ width: 40 })),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
      textAlign: "center",
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(mockCtx);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 600,
      height: 500,
      top: 0,
      left: 0,
      right: 600,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("loads dhammas graph, renders nodes/edges across languages, handles hover/drag/zoom/filters/resize", async () => {
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        nodes: [
          {
            id: "citta",
            label: "Citta",
            labelPt: "Consciência (muito longa para truncar)",
            labelEn: "Consciousness (very long label)",
            labelEs: "Conciencia",
            group: "citta",
            subgroup: "all",
            khandha: "vinnana",
            ayatana: "mana",
            dhatu: "manovinnana",
          },
          {
            id: "phassa",
            label: "Phassa",
            labelPt: "Contato",
            labelEn: "Contact",
            labelEs: "Contacto",
            group: "cetasika",
            subgroup: "universal",
            khandha: "sankhara",
            ayatana: "dhamma",
            dhatu: "dhamma",
          },
          {
            id: "rupa",
            label: "Rūpa",
            labelPt: "Matéria",
            labelEn: "Matter",
            group: "unknown_group",
            subgroup: "all",
            khandha: "rupa",
            ayatana: "rupa",
            dhatu: "rupa",
          },
        ],
        edges: [
          { from: "citta", to: "phassa", type: "sahajata", label: "co-nascence", labelPt: "co-nascença", dir: "bi" },
          { from: "phassa", to: "rupa", type: "arammana", label: "object", labelPt: "objeto", dir: "uni" },
          { from: "citta", to: "rupa", type: "custom_edge", label: "other", labelPt: "outro", dir: "uni" },
        ],
        filters: {
          khandha: ["rupa", "sankhara", "vinnana", "custom_khandha"],
          ayatana: [],
          dhatu: [],
          patthana: ["sahajata", "arammana", "custom_paccaya"],
        },
      }),
    }) as any;

    const { initGraphPanel } = await import("../../src/graph.js");
    const container = document.createElement("div");
    document.body.appendChild(container);

    for (const lang of ["pt", "es", "en"] as const) {
      updateSettings({ uiLang: lang, translationLang: lang });
      initGraphPanel(container);
      await new Promise((r) => setTimeout(r, 30));
    }

    // Trigger ResizeObserver + window resize (hits !hasInitialized branch on line 650)
    resizeCb?.([{ contentRect: { width: 600, height: 500 } } as any], {} as any);
    resizeCb?.([{ contentRect: { width: 640, height: 480 } } as any], {} as any);
    window.dispatchEvent(new Event("resize"));

    const canvas = container.querySelector("canvas")!;
    // Sweep across the circle where initPositions placed node 0 (angle=0 -> x ~ 300 + 175 = 475, y = 250)
    let hitX = 475;
    for (let x = 250; x <= 550; x += 15) {
      canvas.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: 250 }));
      if (canvas.style.cursor === "pointer") {
        hitX = x;
        break;
      }
    }
    expect(canvas.style.cursor).toBe("pointer");
    // Render while hoveredNode is active (covers hovered glow + tooltip lines 289-292, 330-353)
    if (rafCallback) rafCallback(16);

    // Mousedown on hovered node -> drag -> mouseup (covers dragNode lines 585-589, 603-604)
    canvas.dispatchEvent(new MouseEvent("mousedown", { clientX: hitX, clientY: 250 }));
    expect(canvas.style.cursor).toBe("grabbing");
    // Drag close to node 1 so dist < MIN_DIST (covers line 132)
    canvas.dispatchEvent(new MouseEvent("mousemove", { clientX: 215, clientY: 400 }));
    if (rafCallback) rafCallback(16);
    canvas.dispatchEvent(new MouseEvent("mouseup"));
    canvas.dispatchEvent(new MouseEvent("mouseleave"));
    canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
    canvas.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));

    // Exercise filters (specific & all)
    const selects = container.querySelectorAll<HTMLSelectElement>("select.graph-select");
    const khandhaSel = selects[0]!;
    const pattSel = selects[1]!;

    khandhaSel.value = "vinnana";
    khandhaSel.dispatchEvent(new Event("change"));
    pattSel.value = "sahajata";
    pattSel.dispatchEvent(new Event("change"));
    khandhaSel.value = "all";
    khandhaSel.dispatchEvent(new Event("change"));
    pattSel.value = "all";
    pattSel.dispatchEvent(new Event("change"));

    // Run extra simulation ticks
    if (rafCallback) rafCallback(16);
    expect(container.querySelector(".graph-legend")).not.toBeNull();
  });

  it("handles fetch error gracefully without throwing and covers deferred ResizeObserver init", async () => {
    vi.resetModules();
    // 1. Deferred ResizeObserver init when initial canvas rect is 0x0
    const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        nodes: [{ id: "n1", label: "N1", group: "citta", subgroup: "all", khandha: "vinnana", ayatana: "mana", dhatu: "mana" }],
        edges: [],
        filters: { khandha: [], ayatana: [], dhatu: [], patthana: [] },
      }),
    }) as any;
    const { initGraphPanel } = await import("../../src/graph.js");
    const container0 = document.createElement("div");
    initGraphPanel(container0);
    await new Promise((r) => setTimeout(r, 25));
    rectSpy.mockReturnValue({
      width: 600,
      height: 500,
      top: 0,
      left: 0,
      right: 600,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    resizeCb?.([{ contentRect: { width: 600, height: 500 } } as any], {} as any);

    // 2. Fetch error 500
    vi.resetModules();
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as any;
    const { initGraphPanel: initErr } = await import("../../src/graph.js");
    const container = document.createElement("div");
    initErr(container);
    await new Promise((r) => setTimeout(r, 20));
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
