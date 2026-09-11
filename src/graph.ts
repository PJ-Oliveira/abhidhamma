import { t } from "./i18n.js";
import { settings } from "./state.js";
import { createLogger } from "./logger.js";

const log = createLogger("graph");

// ── Types ────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  labelPt: string;
  labelEn: string;
  group: string;
  subgroup: string;
  khandha: string;
  ayatana: string;
  dhatu: string;
  // Runtime
  x: number;
  y: number;
  vx: number;
  vy: number;
  visible: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  type: string;
  label: string;
  labelPt: string;
  dir: string;
  visible: boolean;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  filters: {
    khandha: string[];
    ayatana: string[];
    dhatu: string[];
    patthana: string[];
  };
}

// ── Color Scheme ─────────────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
  citta: "#c96b32",     // orange
  cetasika: "#3a7ac2",  // blue
  rupa: "#4a8c50",      // green
  nibbana: "#c9a832",   // gold
};

const GROUP_COLORS_SOFT: Record<string, string> = {
  citta: "rgba(201,107,50,0.15)",
  cetasika: "rgba(58,122,194,0.15)",
  rupa: "rgba(74,140,80,0.15)",
  nibbana: "rgba(201,168,50,0.15)",
};

// ── Data Loading ─────────────────────────────────────────────────────────────

let graphData: GraphData | null = null;

async function loadGraphData(): Promise<GraphData | null> {
  if (graphData) return graphData;
  try {
    const res = await fetch("data/graph/dhammas.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const nodes: GraphNode[] = (raw.nodes ?? []).map((n: any) => ({
      ...n,
      x: 0, y: 0, vx: 0, vy: 0, visible: true,
    }));
    const edges: GraphEdge[] = (raw.edges ?? []).map((e: any) => ({
      ...e, visible: true,
    }));
    graphData = { nodes, edges, filters: raw.filters ?? {} };
    log.info(`Loaded graph: ${nodes.length} nodes, ${edges.length} edges`);
    return graphData;
  } catch (err) {
    log.error("Failed to load graph data", err);
    return null;
  }
}

// ── Force Layout ─────────────────────────────────────────────────────────────

function initPositions(nodes: GraphNode[], w: number, h: number): void {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.4;
  const ry = h * 0.4;
  const visible = nodes.filter((n) => n.visible);
  visible.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / visible.length;
    n.x = cx + rx * Math.cos(angle) + (Math.random() - 0.5) * 40;
    n.y = cy + ry * Math.sin(angle) + (Math.random() - 0.5) * 40;
    n.vx = 0;
    n.vy = 0;
  });
}

function simulateForces(data: GraphData, w: number, h: number): void {
  const visible = data.nodes.filter((n) => n.visible);
  const nodeMap = new Map(visible.map((n) => [n.id, n]));
  const visibleEdges = data.edges.filter((e) => e.visible && nodeMap.has(e.from) && nodeMap.has(e.to));

  const area = w * h;
  const REPULSION = Math.max(20000, area * 0.25);
  const ATTRACTION = 0.002;
  const DAMPING = 0.80;
  const CENTER_PULL = 0.0008;
  const MIN_DIST = 100; // minimum distance between nodes
  const cx = w / 2;
  const cy = h / 2;

  // Repulsion between all node pairs
  for (let i = 0; i < visible.length; i++) {
    for (let j = i + 1; j < visible.length; j++) {
      const a = visible[i]!;
      const b = visible[j]!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      // Enforce minimum distance
      if (dist < MIN_DIST) dist = MIN_DIST * 0.5;
      const force = REPULSION / (dist * dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }

  // Attraction along edges
  for (const edge of visibleEdges) {
    const a = nodeMap.get(edge.from)!;
    const b = nodeMap.get(edge.to)!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - 180) * ATTRACTION;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // Center pull & damping
  for (const n of visible) {
    n.vx += (cx - n.x) * CENTER_PULL;
    n.vy += (cy - n.y) * CENTER_PULL;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx;
    n.y += n.vy;
    // Clamp to canvas
    n.x = Math.max(40, Math.min(w - 40, n.x));
    n.y = Math.max(40, Math.min(h - 40, n.y));
  }
}

// ── Rendering ────────────────────────────────────────────────────────────────

function drawGraph(
  ctx: CanvasRenderingContext2D,
  data: GraphData,
  w: number,
  h: number,
  hoveredNode: GraphNode | null,
  zoom: number,
  panX: number,
  panY: number
): void {
  ctx.save();
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = "#f8f0e5";
  ctx.fillRect(0, 0, w, h);

  ctx.translate(panX, panY);
  ctx.scale(zoom, zoom);

  const nodeMap = new Map(data.nodes.map((n) => [n.id, n]));
  const lang = settings.translationLang;

  // Edge type colors
  const EDGE_COLORS: Record<string, string> = {
    hetu: "#b33f3f",       // red
    sahajata: "#3a7ac2",   // blue
    arammana: "#4a8c50",   // green
    kamma: "#9b59b6",      // purple
    anantara: "#e67e22",   // orange
    samanantara: "#e67e22",
    nissaya: "#2c8c99",    // teal
    indriya: "#c2963a",    // gold
    jhana: "#3a7ac2",
    annamanna: "#3a7ac2",
    vipaka: "#9b59b6",
    ahara: "#4a8c50",
  };
  const DEFAULT_EDGE_COLOR = "rgba(100,80,60,0.5)";

  // Draw edges
  const visibleEdges = data.edges.filter((e) => e.visible);
  const NODE_R = 18; // must match node radius
  for (const edge of visibleEdges) {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from?.visible || !to?.visible) continue;

    const isHighlight = hoveredNode && (edge.from === hoveredNode.id || edge.to === hoveredNode.id);
    const edgeColor = EDGE_COLORS[edge.type] || DEFAULT_EDGE_COLOR;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);

    // Shorten line to stop at node edges
    const startX = from.x + Math.cos(angle) * NODE_R;
    const startY = from.y + Math.sin(angle) * NODE_R;
    const endX = to.x - Math.cos(angle) * NODE_R;
    const endY = to.y - Math.sin(angle) * NODE_R;

    // Line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = isHighlight ? edgeColor : edgeColor + "66";
    ctx.lineWidth = isHighlight ? 3 : 1.8;
    ctx.stroke();

    // Arrowhead for unidirectional
    if (edge.dir === "uni") {
      const arrowLen = isHighlight ? 16 : 12;
      const arrowW = 0.35;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - arrowLen * Math.cos(angle - arrowW), endY - arrowLen * Math.sin(angle - arrowW));
      ctx.lineTo(endX - arrowLen * Math.cos(angle + arrowW), endY - arrowLen * Math.sin(angle + arrowW));
      ctx.closePath();
      ctx.fillStyle = isHighlight ? edgeColor : edgeColor + "88";
      ctx.fill();
    }

    // Bidirectional indicator (dot at midpoint)
    if (edge.dir === "bi") {
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = isHighlight ? edgeColor : edgeColor + "88";
      ctx.fill();
    }

    // Edge label — always visible
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const shortLabel = edge.type + (edge.dir === "bi" ? " ↔" : "");
    ctx.font = isHighlight ? "bold 10px Georgia" : "9px Georgia";
    const tm = ctx.measureText(shortLabel);
    // Background for readability
    ctx.fillStyle = "rgba(248,240,229,0.92)";
    ctx.fillRect(mx - tm.width / 2 - 3, my - 12, tm.width + 6, 14);
    ctx.fillStyle = isHighlight ? edgeColor : "#6f5c48";
    ctx.textAlign = "center";
    ctx.fillText(shortLabel, mx, my - 1);
  }

  // Draw nodes
  const visible = data.nodes.filter((n) => n.visible);
  for (const node of visible) {
    const r = hoveredNode === node ? 24 : 18;
    const color = GROUP_COLORS[node.group] || "#888";
    const softColor = GROUP_COLORS_SOFT[node.group] || "rgba(128,128,128,0.15)";

    // Glow for hovered
    if (hoveredNode === node) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = softColor;
      ctx.fill();
    }

    // Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    const fullLbl = lang === "pt" && node.labelPt ? node.labelPt : (lang === "en" && node.labelEn ? node.labelEn : node.label);
    const lbl = fullLbl.length > 18 ? fullLbl.slice(0, 16) + "…" : fullLbl;
    const isHov = hoveredNode === node;
    const displayLbl = isHov ? fullLbl : lbl;
    ctx.font = isHov ? "bold 12px Georgia" : "10px Georgia";
    const tm = ctx.measureText(displayLbl);
    const lblX = node.x;
    const lblY = node.y + r + 14;
    // White halo behind text
    ctx.fillStyle = "rgba(248,240,229,0.9)";
    ctx.fillRect(lblX - tm.width / 2 - 2, lblY - 10, tm.width + 4, 14);
    ctx.fillStyle = "#33261a";
    ctx.textAlign = "center";
    ctx.fillText(displayLbl, lblX, lblY);
  }

  // Tooltip for hovered node
  if (hoveredNode) {
    const lines = [
      hoveredNode.label,
      `${t("graphGroup", settings.uiLang)}: ${hoveredNode.group}`,
      `${t("graphKhandha", settings.uiLang)}: ${hoveredNode.khandha}`,
    ];
    const tw = 160;
    const th = lines.length * 16 + 12;
    const tx = hoveredNode.x + 18;
    const ty = hoveredNode.y - th / 2;

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.strokeStyle = "#d9c3a6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#33261a";
    ctx.font = "10px Georgia";
    ctx.textAlign = "left";
    lines.forEach((line, i) => {
      ctx.fillText(line, tx + 8, ty + 14 + i * 16);
    });
  }

  ctx.restore();
}

// ── Filtering ────────────────────────────────────────────────────────────────

interface FilterState {
  khandha: string;
  patthana: string;
}

function applyFilters(data: GraphData, filter: FilterState): void {
  // Apply node filter (khandha)
  for (const node of data.nodes) {
    if (filter.khandha === "all") {
      node.visible = true;
    } else {
      node.visible = node.khandha === filter.khandha;
    }
  }

  // Apply edge filter (patthana)
  const visibleNodeIds = new Set(data.nodes.filter((n) => n.visible).map((n) => n.id));
  for (const edge of data.edges) {
    const nodeOk = visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to);
    if (filter.patthana === "all") {
      edge.visible = nodeOk;
    } else {
      edge.visible = nodeOk && edge.type === filter.patthana;
    }
  }
}

// ── Panel Init ───────────────────────────────────────────────────────────────

export function initGraphPanel(container: HTMLElement): void {
  container.innerHTML = "";

  // Filter controls
  const filterRow = document.createElement("div");
  filterRow.className = "graph-filters";
  container.appendChild(filterRow);

  // Khandha filter
  const khandhaLabel = document.createElement("label");
  khandhaLabel.className = "graph-filter-label";
  khandhaLabel.textContent = t("graphFilterKhandha", settings.uiLang);
  filterRow.appendChild(khandhaLabel);

  const khandhaSel = document.createElement("select");
  khandhaSel.className = "graph-select";
  filterRow.appendChild(khandhaSel);

  // Patthana filter
  const pattLabel = document.createElement("label");
  pattLabel.className = "graph-filter-label";
  pattLabel.textContent = t("graphFilterPatthana", settings.uiLang);
  filterRow.appendChild(pattLabel);

  const pattSel = document.createElement("select");
  pattSel.className = "graph-select";
  filterRow.appendChild(pattSel);

  // Canvas
  const canvasWrap = document.createElement("div");
  canvasWrap.className = "graph-canvas-wrap";
  container.appendChild(canvasWrap);

  const canvas = document.createElement("canvas");
  canvas.className = "graph-canvas";
  canvasWrap.appendChild(canvas);

  // Legend
  const legend = document.createElement("div");
  legend.className = "graph-legend";
  legend.innerHTML = [
    `<span style="color:${GROUP_COLORS.citta}">● Citta</span>`,
    `<span style="color:${GROUP_COLORS.cetasika}">● Cetasika</span>`,
    `<span style="color:${GROUP_COLORS.rupa}">● Rūpa</span>`,
    `<span style="color:${GROUP_COLORS.nibbana}">● Nibbāna</span>`,
  ].join("  ");
  container.appendChild(legend);

  // State
  let data: GraphData | null = null;
  let hoveredNode: GraphNode | null = null;
  let dragNode: GraphNode | null = null;
  let zoom = 1;
  let panX = 0;
  let panY = 0;
  let animFrame = 0;
  let simIterations = 0;
  const MAX_SIM = 400;

  const filterState: FilterState = { khandha: "all", patthana: "all" };

  function resize(): void {
    const rect = canvasWrap.getBoundingClientRect();
    const w = Math.max(200, rect.width);
    const h = Math.max(200, rect.height);
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(devicePixelRatio, devicePixelRatio);
    return;
  }

  function getW(): number { return canvas.width / devicePixelRatio; }
  function getH(): number { return canvas.height / devicePixelRatio; }

  const PACCAYA_LABELS: Record<string, { en: string; pt: string }> = {
    hetu: { en: "Root Condition", pt: "Condição de Raiz" },
    arammana: { en: "Object Condition", pt: "Condição de Objeto" },
    adhipati: { en: "Predominance", pt: "Predominância" },
    anantara: { en: "Proximity", pt: "Proximidade" },
    samanantara: { en: "Contiguity", pt: "Contiguidade" },
    sahajata: { en: "Co-nascence", pt: "Co-nascença" },
    annamanna: { en: "Mutuality", pt: "Mutualidade" },
    nissaya: { en: "Support", pt: "Suporte" },
    upanissaya: { en: "Decisive Support", pt: "Suporte Decisivo" },
    purejata: { en: "Pre-nascence", pt: "Pré-nascença" },
    pacchajata: { en: "Post-nascence", pt: "Pós-nascença" },
    asevana: { en: "Repetition", pt: "Repetição" },
    kamma: { en: "Kamma", pt: "Kamma" },
    vipaka: { en: "Result", pt: "Resultado" },
    ahara: { en: "Nutriment", pt: "Nutrição" },
    indriya: { en: "Faculty", pt: "Faculdade" },
    jhana: { en: "Jhāna", pt: "Jhāna" },
    magga: { en: "Path", pt: "Caminho" },
    sampayutta: { en: "Association", pt: "Associação" },
    vippayutta: { en: "Dissociation", pt: "Dissociação" },
    atthi: { en: "Presence", pt: "Presença" },
    natthi: { en: "Absence", pt: "Ausência" },
    vigata: { en: "Disappearance", pt: "Desaparecimento" },
    avigata: { en: "Non-disappearance", pt: "Não-desaparecimento" },
  };

  const KHANDHA_LABELS: Record<string, { en: string; pt: string }> = {
    rupa: { en: "Materiality", pt: "Materialidade" },
    vedana: { en: "Feeling", pt: "Sensação" },
    sanna: { en: "Perception", pt: "Percepção" },
    sankhara: { en: "Formations", pt: "Formações" },
    vinnana: { en: "Consciousness", pt: "Consciência" },
  };

  function populateFilters(): void {
    if (!data) return;
    const lang = settings.translationLang;

    // Khandha
    khandhaSel.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = t("graphAll", settings.uiLang);
    khandhaSel.appendChild(allOpt);
    for (const k of (data.filters.khandha ?? [])) {
      const opt = document.createElement("option");
      opt.value = k;
      const lbl = KHANDHA_LABELS[k];
      if (lbl) {
        const tr = lang === "pt" ? lbl.pt : lbl.en;
        opt.textContent = `${k} — ${tr}`;
      } else {
        opt.textContent = k;
      }
      khandhaSel.appendChild(opt);
    }

    // Patthana
    pattSel.innerHTML = "";
    const allPatt = document.createElement("option");
    allPatt.value = "all";
    allPatt.textContent = t("graphAll", settings.uiLang);
    pattSel.appendChild(allPatt);
    for (const p of (data.filters.patthana ?? [])) {
      const opt = document.createElement("option");
      opt.value = p;
      const lbl = PACCAYA_LABELS[p];
      if (lbl) {
        opt.textContent = `${p}-paccaya — ${lbl.en} — ${lbl.pt}`;
      } else {
        opt.textContent = p + "-paccaya";
      }
      pattSel.appendChild(opt);
    }
  }

  function startSimulation(): void {
    simIterations = 0;
    cancelAnimationFrame(animFrame);
    tick();
  }

  function tick(): void {
    if (!data) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (simIterations < MAX_SIM) {
      simulateForces(data, getW(), getH());
      simIterations++;
    }

    drawGraph(ctx, data, getW(), getH(), hoveredNode, zoom, panX, panY);
    animFrame = requestAnimationFrame(tick);
  }

  function findNodeAt(mx: number, my: number): GraphNode | null {
    if (!data) return null;
    const x = (mx - panX) / zoom;
    const y = (my - panY) / zoom;
    for (const node of data.nodes) {
      if (!node.visible) continue;
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy < 576) return node; // radius ~24
    }
    return null;
  }

  // Events
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragNode) {
      dragNode.x = (mx - panX) / zoom;
      dragNode.y = (my - panY) / zoom;
      dragNode.vx = 0;
      dragNode.vy = 0;
      return;
    }

    const node = findNodeAt(mx, my);
    hoveredNode = node;
    canvas.style.cursor = node ? "pointer" : "grab";
  });

  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = findNodeAt(mx, my);
    if (node) {
      dragNode = node;
      canvas.style.cursor = "grabbing";
    }
  });

  canvas.addEventListener("mouseup", () => {
    dragNode = null;
    simIterations = Math.max(0, MAX_SIM - 50); // resume settling
  });

  canvas.addEventListener("mouseleave", () => {
    hoveredNode = null;
    dragNode = null;
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoom = Math.max(0.3, Math.min(3, zoom * delta));
  }, { passive: false });

  khandhaSel.addEventListener("change", () => {
    filterState.khandha = khandhaSel.value;
    if (data) {
      applyFilters(data, filterState);
      initPositions(data.nodes, getW(), getH());
      startSimulation();
    }
  });

  pattSel.addEventListener("change", () => {
    filterState.patthana = pattSel.value;
    if (data) {
      applyFilters(data, filterState);
      startSimulation();
    }
  });

  // Use ResizeObserver to detect when canvasWrap gets real dimensions
  let hasInitialized = false;
  const resizeObs = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const cr = entry.contentRect;
      if (cr.width > 100 && cr.height > 100) {
        resize();
        if (data) {
          if (!hasInitialized) {
            hasInitialized = true;
            initPositions(data.nodes, getW(), getH());
          }
          startSimulation();
        }
      }
    }
  });
  resizeObs.observe(canvasWrap);

  window.addEventListener("resize", () => {
    resize();
    if (data) startSimulation();
  });

  // Load
  void loadGraphData().then((d) => {
    if (!d) return;
    data = d;
    populateFilters();
    // If canvas already has dimensions, init immediately
    const rect = canvasWrap.getBoundingClientRect();
    if (rect.width > 100 && rect.height > 100) {
      resize();
      hasInitialized = true;
      initPositions(data.nodes, getW(), getH());
      startSimulation();
    }
    // Otherwise ResizeObserver will trigger when overlay becomes visible
  });
}
