import { t } from "./i18n.js";
import {
  settings,
  updateSettings,
  getHistory,
  pushHistory,
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from "./state.js";
import { renderTree, markActiveLeaf } from "./tree.js";
import { loadChunk, renderSegments } from "./reader.js";
import { initDictionaryPanel } from "./dictionary.js";
import { initSearchPanel } from "./search.js";
import { initExportPanel } from "./export.js";
import { initSrsPanel } from "./srs.js";
import { TetrisUI } from "./tetris/ui.js";
import { initToolsPanel } from "./tools/tools.js";
import "./tools/mindmap.js";
import "./tools/patthana.js";
import "./tools/vithi.js";
import "./tools/matikas.js";
import "./tools/cetasika.js";
import { initSelectionHandler, clearSelection } from "./selection.js";
import { createLogger } from "./logger.js";
import type { Manifest, WorkEntry, WorkPart, Segment, TranslationLang, UiLang, CommentaryMode } from "./types.js";

const log = createLogger("app");

function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Elemento #${id} não encontrado no DOM.`);
  return found as T;
}

interface AppState {
  manifest: Manifest | null;
  work: WorkEntry | null;
  partKey: string | null;
  chunkIndex: number;
  segments: Segment[];
}

const state: AppState = {
  manifest: null,
  work: null,
  partKey: null,
  chunkIndex: 0,
  segments: [],
};

function findWork(workId: string): WorkEntry | null {
  if (!state.manifest) return null;
  for (const group of Object.values(state.manifest.groups)) {
    const found = group.find((w) => w.id === workId);
    if (found) return found;
  }
  return null;
}

function getWorkGroup(workId: string): string | null {
  if (!state.manifest) return null;
  return (
    Object.keys(state.manifest.groups).find((g) =>
      state.manifest?.groups[g]?.some((w) => w.id === workId)
    ) ?? null
  );
}

function workSupportsEs(work: WorkEntry | null): boolean {
  return Boolean(work?.languages?.includes("es"));
}

function resolveCommentaryMode(work: WorkEntry | null): CommentaryMode {
  const raw: CommentaryMode =
    settings.commentaryMode ?? (settings.translationLang === "es" ? "en+es" : "en+pt");
  if (!workSupportsEs(work)) {
    if (raw === "en+es") return "en+pt";
    if (raw === "es") return "pt";
  }
  return raw;
}

function commentaryModeToRenderFlags(mode: CommentaryMode): {
  showPaliOverride: boolean;
  showTranslationOverride: boolean;
  effectiveLang: TranslationLang;
} {
  switch (mode) {
    case "en":
      return { showPaliOverride: true, showTranslationOverride: false, effectiveLang: "en" };
    case "en+es":
      return { showPaliOverride: true, showTranslationOverride: true, effectiveLang: "es" };
    case "pt":
      return { showPaliOverride: false, showTranslationOverride: true, effectiveLang: "pt" };
    case "es":
      return { showPaliOverride: false, showTranslationOverride: true, effectiveLang: "es" };
    case "en+pt":
    default:
      return { showPaliOverride: true, showTranslationOverride: true, effectiveLang: "pt" };
  }
}

function stripTags(html: string | undefined): string {
  return (html ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function updateSettingsLabels(): void {
  const group = state.work ? getWorkGroup(state.work.id) : null;
  const isCommentary = group === "comentarios";
  const paliLabelEl = document.getElementById("label-show-pali");
  const translationLabelEl = document.getElementById("label-show-translation");
  const paliCb = document.getElementById("setting-show-pali") as HTMLInputElement | null;
  const translCb = document.getElementById("setting-show-translation") as HTMLInputElement | null;

  if (isCommentary) {
    const mode = resolveCommentaryMode(state.work);
    const flags = commentaryModeToRenderFlags(mode);
    const isEsMode = mode === "en+es" || mode === "es" || (mode === "en" && settings.uiLang === "es" && workSupportsEs(state.work));
    if (paliLabelEl) paliLabelEl.textContent = t("settingShowOriginal", settings.uiLang);
    if (translationLabelEl) {
      translationLabelEl.textContent = isEsMode
        ? t("settingShowES", settings.uiLang)
        : t("settingShowPT", settings.uiLang);
    }
    if (paliCb) paliCb.checked = flags.showPaliOverride;
    if (translCb) translCb.checked = flags.showTranslationOverride;
  } else {
    if (paliLabelEl) paliLabelEl.textContent = t("settingShowPali", settings.uiLang);
    if (translationLabelEl) translationLabelEl.textContent = t("settingShowTranslation", settings.uiLang);
    if (paliCb) paliCb.checked = settings.showPali;
    if (translCb) translCb.checked = settings.showTranslation;
  }
}

function applySettingsToUI(): void {
  // Force sync legacy separate settings
  if (settings.uiLang !== settings.translationLang) {
    settings.uiLang = settings.translationLang;
    updateSettings({ uiLang: settings.translationLang });
  }
  document.documentElement.style.setProperty("--font-scale", String(settings.fontSize / 17));
  el<HTMLSelectElement>("setting-lang").value = settings.translationLang;
    el<HTMLInputElement>("setting-show-pali").checked = settings.showPali;
  el<HTMLInputElement>("setting-show-translation").checked = settings.showTranslation;
}

function updateHash(): void {
  const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
  const panel = activeBtn ? (activeBtn.dataset.panel || "tipitaka") : "tipitaka";
  
  let base = `#/${panel}`;
  if (panel !== "srs" && panel !== "tetris" && state.work && state.partKey && state.chunkIndex !== undefined) {
    base += `/${state.work.id}/${state.partKey}/${state.chunkIndex}`;
  }
  
  // preserve existing query params (like ?q=citta or ?seg=123) when updating hash, 
  // or maybe not. If they just switched panels, we might lose query params. 
  // To be safe, we just set the new base. (Specific tools will override via history.replaceState)
  if (location.hash !== base) {
    // Avoid triggering hashchange if we're just syncing state
    // We can't easily suppress hashchange, but our hashchange handler will be smart enough
    // to not reload the text if it's already loaded.
    location.hash = base;
  }
}

function renderBreadcrumb(): void {
  const breadcrumb = el("breadcrumb");
  breadcrumb.innerHTML = "";
  if (!state.work || !state.manifest) {
    return;
  }
  const groupKey = Object.keys(state.manifest.groups).find((g) =>
    state.manifest?.groups[g]?.some((w) => w.id === state.work?.id)
  );
  breadcrumb.textContent = `${t(`groupTitle_${groupKey}`, settings.uiLang)} › ${state.work.title}`;
}

function renderPartTabs(): void {
  const tabsEl = el("part-tabs");
  tabsEl.innerHTML = "";
  if (!state.work) return;

  const group = getWorkGroup(state.work.id);
  if (group === "comentarios") {
    const activeMode = resolveCommentaryMode(state.work);
    const hasEs = workSupportsEs(state.work);
    const modes: Array<{ mode: CommentaryMode; labelKey: string }> = hasEs
      ? [
          { mode: "en", labelKey: "verEn" },
          { mode: "en+pt", labelKey: "verEnPt" },
          { mode: "en+es", labelKey: "verEnEs" },
          { mode: "pt", labelKey: "verPt" },
          { mode: "es", labelKey: "verEs" },
        ]
      : [
          { mode: "en", labelKey: "verEn" },
          { mode: "en+pt", labelKey: "verEnPt" },
          { mode: "pt", labelKey: "verPt" },
        ];

    for (const item of modes) {
      const btn = document.createElement("button");
      btn.className = "part-tab version-tab";
      btn.dataset.versionMode = item.mode;
      btn.textContent = t(item.labelKey, settings.uiLang);
      if (item.mode === activeMode) btn.classList.add("active");
      btn.addEventListener("click", () => {
        updateSettings({ commentaryMode: item.mode });
        renderPartTabs();
        renderChapterNav();
        rerenderContent();
      });
      tabsEl.appendChild(btn);
    }
    return;
  }

  for (const partKey of Object.keys(state.work.parts)) {
    const part = state.work.parts[partKey];
    if (!part) continue;
    const btn = document.createElement("button");
    btn.className = "part-tab";
    btn.textContent = t(`part_${partKey}`, settings.uiLang) || part.label;
    if (partKey === state.partKey) btn.classList.add("active");
    btn.addEventListener("click", () => void selectWork(state.work!.id, partKey, 0));
    tabsEl.appendChild(btn);
  }
}

function renderChunkIndicator(): void {
  if (!state.work || !state.partKey) return;
  const part = state.work.parts[state.partKey];
  if (!part) return;
  const total = part.files.length;
  el("chunk-indicator").textContent = `${state.chunkIndex + 1} / ${total}`;
  el<HTMLButtonElement>("prev-chunk").disabled = state.chunkIndex <= 0;
  el<HTMLButtonElement>("next-chunk").disabled = state.chunkIndex >= total - 1;
}

function segIdToChunk(segId: number, part: WorkPart): number {
  if (part.chunkStarts && part.chunkStarts.length === part.files.length) {
    let lo = 0, hi = part.chunkStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (part.chunkStarts[mid]! <= segId) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  }
  if (part.count && part.files.length > 0) {
    const size = Math.ceil(part.count / part.files.length);
    return Math.min(Math.floor((segId - 1) / size), part.files.length - 1);
  }
  return 0;
}

function closeChapterNav(): void {
  const nav = document.getElementById("chapter-nav");
  if (!nav) return;
  const list = nav.querySelector<HTMLElement>(".chapter-nav-list");
  const btn = nav.querySelector<HTMLElement>(".chapter-nav-btn");
  if (list) list.hidden = true;
  if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
}

function renderChapterNav(): void {
  const navEl = el("chapter-nav");
  navEl.innerHTML = "";

  if (!state.work || !state.partKey) { navEl.hidden = true; return; }
  const part = state.work.parts[state.partKey];
  if (!part) { navEl.hidden = true; return; }

  const chapters = part.toc.filter((e) => e.rend === "chapter");
  if (chapters.length === 0) { navEl.hidden = true; return; }
  navEl.hidden = false;

  const btn = document.createElement("button");
  btn.className = "chapter-nav-btn";
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="3" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="3" cy="18" r="1" fill="currentColor" stroke="none"/></svg>` +
    `<span>${chapters.length}</span><span class="chap-arrow">▾</span>`;

  const list = document.createElement("ul");
  list.className = "chapter-nav-list";
  list.hidden = true;

  const isCommentary = getWorkGroup(state.work.id) === "comentarios";
  const commMode = isCommentary ? resolveCommentaryMode(state.work) : null;
  const segById =
    isCommentary && state.segments.length > 0
      ? new Map<number, Segment>(state.segments.map((s) => [s.id, s]))
      : null;

  for (let i = 0; i < chapters.length; i++) {
    const entry = chapters[i]!;
    const chunkIdx = segIdToChunk(entry.id, part);
    const li = document.createElement("li");
    const numSpan = document.createElement("span");
    numSpan.className = "chap-num";
    numSpan.textContent = `${i + 1}.`;
    const textSpan = document.createElement("span");
    textSpan.className = "chap-text";

    let chapLabel = entry.text.replace(/^\d+\.\s*/, "");
    if (commMode && segById) {
      const seg = segById.get(entry.id);
      if (seg) {
        const ptClean = stripTags(seg.pt).replace(/^\d+\.\s*/, "");
        const esClean = stripTags(seg.es).replace(/^\d+\.\s*/, "");
        if (commMode === "pt" && ptClean) chapLabel = ptClean;
        else if (commMode === "es" && esClean) chapLabel = esClean;
        else if (commMode === "en+pt" && ptClean && ptClean.toLowerCase() !== chapLabel.toLowerCase()) {
          chapLabel = `${chapLabel} · ${ptClean}`;
        } else if (commMode === "en+es" && esClean && esClean.toLowerCase() !== chapLabel.toLowerCase()) {
          chapLabel = `${chapLabel} · ${esClean}`;
        }
      }
    }
    textSpan.textContent = chapLabel;
    li.appendChild(numSpan);
    li.appendChild(textSpan);
    li.addEventListener("click", () => {
      closeChapterNav();
      void selectWork(state.work!.id, state.partKey!, chunkIdx, entry.id);
    });
    list.appendChild(li);
  }

  btn.addEventListener("click", (e) => {
    const opening = list.hidden !== false;
    list.hidden = !opening;
    btn.classList.toggle("open", opening);
    btn.setAttribute("aria-expanded", String(opening));
    e.stopPropagation();
  });

  navEl.appendChild(btn);
  navEl.appendChild(list);
}

function handleNoteHover(evt: MouseEvent | null, text?: string): void {
  const tooltip = el("note-tooltip");
  if (!evt || !text) {
    tooltip.classList.add("hidden");
    return;
  }
  tooltip.textContent = text;
  tooltip.style.left = `${evt.clientX + 12}px`;
  tooltip.style.top = `${evt.clientY + 12}px`;
  tooltip.classList.remove("hidden");
}

async function selectWork(workId: string, partKey: string, chunkIndex: number, segId?: number | null): Promise<void> {
  const work = findWork(workId);
  if (!work) {
    log.warn(`obra desconhecida: ${workId}`);
    return;
  }
  const part = work.parts[partKey];
  if (!part) {
    log.warn(`parte desconhecida: ${workId}/${partKey}`);
    return;
  }

  state.work = work;
  state.partKey = partKey;
  state.chunkIndex = Math.max(0, Math.min(chunkIndex, part.files.length - 1));
  state.segments = [];

  el("content").innerHTML = `<p class="loading">${t("loading", settings.uiLang)}</p>`;
  renderBreadcrumb();
  renderPartTabs();
  renderChapterNav();
  renderChunkIndicator();
  markActiveLeaf(el("tree"), workId, partKey);

  const fileName = part.files[state.chunkIndex];
  if (!fileName) {
    log.error(`fragmento inexistente para ${workId}/${partKey}[${state.chunkIndex}]`);
    return;
  }

  try {
    state.segments = await loadChunk(workId, partKey, fileName);
  } catch (err) {
    log.error("não foi possível carregar o fragmento", err);
    el("content").innerHTML = `<p class="loading">${t("noResults", settings.uiLang)}</p>`;
    return;
  }

  renderChapterNav();
  rerenderContent();

  if (segId != null) {
    const target = el("content").querySelector<HTMLElement>(`.seg[data-seg-id="${segId}"]`);
    if (target) {
      target.scrollIntoView({ block: "center" });
      target.classList.add("seg-flash");
      setTimeout(() => target.classList.remove("seg-flash"), 1600);
    }
  }

  pushHistory({
    workId,
    partKey,
    chunk: state.chunkIndex,
    title: `${work.title} — ${t(`part_${partKey}`, settings.uiLang)}`,
  });
  renderHistory();
  updateSettingsLabels();
  updateHash();

  if (window.innerWidth <= 860) {
    const sidePanel = document.getElementById("side-panel");
    const collapseBtn = document.getElementById("panel-collapse");
    if (sidePanel && !sidePanel.classList.contains("collapsed")) {
      sidePanel.classList.add("collapsed");
      document.documentElement.style.setProperty("--panel-w", "0px");
      if (collapseBtn) collapseBtn.textContent = "›";
    }
  }
}

function renderHistory(): void {
  const listEl = el("history-list");
  listEl.innerHTML = "";
  const history = getHistory();
  if (!history.length) {
    listEl.innerHTML = `<p class="side-empty">${t("emptyHistory", settings.uiLang)}</p>`;
    return;
  }
  for (const entry of history) {
    const div = document.createElement("div");
    div.className = "side-item";
    div.textContent = entry.title;
    div.addEventListener("click", () => void selectWork(entry.workId, entry.partKey, entry.chunk));
    listEl.appendChild(div);
  }
}

function renderBookmarks(): void {
  const listEl = el("bookmark-list");
  listEl.innerHTML = "";
  const bookmarks = getBookmarks();
  if (!bookmarks.length) {
    listEl.innerHTML = `<p class="side-empty">${t("emptyBookmarks", settings.uiLang)}</p>`;
    return;
  }
  for (const entry of bookmarks) {
    const div = document.createElement("div");
    div.className = "side-item";
    div.textContent = entry.snippet || `${entry.workId} / ${entry.partKey}`;
    div.addEventListener("click", () => void selectWork(entry.workId, entry.partKey, entry.chunk, entry.segId));
    listEl.appendChild(div);
  }
}

let switchPanel: ((target: string, skipHashUpdate?: boolean) => void) | undefined;

function wireIconRail(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".rail-btn");
  const panels = document.querySelectorAll<HTMLElement>(".panel");
  const sidePanel = el("side-panel");
  const collapseBtn = el("panel-collapse") as HTMLButtonElement;
  const root = document.documentElement;
  const MIN_W = 120;
  const MAX_W = 450;

  function currentRenderedW(): number {
    return sidePanel.getBoundingClientRect().width;
  }

  function doCollapse(): void {
    const w = currentRenderedW();
    if (w > 0) localStorage.setItem("panelW", String(Math.round(w)));
    sidePanel.classList.add("collapsed");
    collapseBtn.textContent = "›";
    setTimeout(() => root.style.setProperty("--panel-w", "0px"), 160);
  }

  function doExpand(): void {
    const saved = localStorage.getItem("panelW");
    const w = saved ? Math.max(MIN_W, parseInt(saved, 10)) : 280;
    root.style.setProperty("--panel-w", w + "px");
    sidePanel.classList.remove("collapsed");
    collapseBtn.textContent = "‹";
  }

  const savedW = localStorage.getItem("panelW");
  if (savedW) {
    const w = parseInt(savedW, 10);
    if (w >= MIN_W) root.style.setProperty("--panel-w", w + "px");
  }

  const FULLSCREEN_PANELS = new Set(["srs", "tools", "tetris"]);
  const readerHeader = el("reader-header");
  const readerContent = el("content");
  const tocNav = el("toc-nav");
  const readerSrs = el("reader-srs");
  const readerTools = el("reader-tools");

  function toggleReaderOverlay(target: string | undefined): void {
    const isFullscreen = target && FULLSCREEN_PANELS.has(target);
    readerHeader.style.display = isFullscreen ? "none" : "";
    readerContent.style.display = isFullscreen ? "none" : "";
    tocNav.style.display = isFullscreen ? "none" : "";
    const isSrsOrTetris = target === "srs" || target === "tetris";
    readerSrs.style.display = isSrsOrTetris ? "flex" : "none";
    readerTools.style.display = target === "tools" ? "flex" : "none";
    if (isSrsOrTetris) {
      const activeBtn = document.querySelector<HTMLButtonElement>(".srs-tab-btn.active, .srs-menu-item.active");
      const isTetris = target === "tetris" || (target !== "srs" && activeBtn?.dataset.srsMode === "tetris");
      readerSrs.classList.toggle("tetris-mode", isTetris);
      document.body.classList.toggle("tetris-active", isTetris);
    } else {
      document.body.classList.remove("tetris-active");
    }
  }

  switchPanel = (target: string, skipHashUpdate = false) => {
      if (!target) return;
      const isMobile = window.innerWidth <= 860;
      const isFullscreen = FULLSCREEN_PANELS.has(target);

      if (isMobile && isFullscreen) {
        if (!sidePanel.classList.contains("collapsed")) doCollapse();
      } else {
        doExpand();
      }

      buttons.forEach((b) => b.classList.toggle("active", b.dataset.panel === target));
      panels.forEach((p) => p.classList.toggle("active", p.id === (target === "tetris" ? "panel-tetris" : `panel-${target}`)));
      toggleReaderOverlay(target);
      if (target === "tetris") {
        setSrsModeGlobal?.("tetris", false);
      } else if (target === "srs") {
        setSrsModeGlobal?.("vocab", false);
      }
      if (target === "export" && state.work) {
        const exportWorkSel = document.getElementById("export-work") as HTMLSelectElement | null;
        if (exportWorkSel && Array.from(exportWorkSel.options).some((o) => o.value === state.work!.id)) {
          if (exportWorkSel.value !== state.work.id) {
            exportWorkSel.value = state.work.id;
            exportWorkSel.dispatchEvent(new Event("change"));
          }
        }
      }
      if (!skipHashUpdate) updateHash();
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.panel;
      if (!target) return;
      if (btn.classList.contains("active") && !sidePanel.classList.contains("collapsed")) {
        doCollapse();
        return;
      }
      switchPanel?.(target);
    });
  });

  collapseBtn.addEventListener("click", () => {
    if (sidePanel.classList.contains("collapsed")) doExpand();
    else doCollapse();
  });

  const resizer = el("panel-resizer");
  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartW = 0;

  resizer.addEventListener("mousedown", (e: MouseEvent) => {
    isResizing = true;
    resizeStartX = e.clientX;
    resizeStartW = currentRenderedW();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (!isResizing) return;
    const dynamicMax = Math.min(MAX_W, window.innerWidth - 120);
    const newW = Math.max(0, Math.min(dynamicMax, resizeStartW + e.clientX - resizeStartX));
    const snap = newW < 60 ? 0 : newW;
    root.style.setProperty("--panel-w", snap + "px");
    if (snap === 0) {
      sidePanel.classList.add("collapsed");
      collapseBtn.textContent = "›";
    } else {
      sidePanel.classList.remove("collapsed");
      collapseBtn.textContent = "‹";
    }
  });

  document.addEventListener("mouseup", () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    const finalW = currentRenderedW();
    if (finalW >= MIN_W) localStorage.setItem("panelW", String(Math.round(finalW)));
  });
}

function rerenderContent(): void {
  const content = el("content");
  const savedScroll = content.scrollTop;

  clearSelection();
  if (!state.work || !state.partKey || !state.segments.length) return;
  const work = state.work;
  const partKey = state.partKey;

  const group = getWorkGroup(work.id);
  const isCommentary = group === "comentarios";
  const commFlags = isCommentary ? commentaryModeToRenderFlags(resolveCommentaryMode(work)) : null;

  renderSegments(state.segments, content, {
    onNoteHover: handleNoteHover,
    isCommentary,
    ...(commFlags ?? {}),
    isBookmarked: (segId) => isBookmarked(work.id, partKey, segId),
    onBookmarkToggle: (seg) => {
      const active = toggleBookmark({
        workId: work.id,
        partKey,
        segId: seg.id,
        chunk: state.chunkIndex,
        snippet: (seg.pali || seg[settings.translationLang] || "").slice(0, 80),
      });
      renderBookmarks();
      return active;
    },
  });

  applyStaticI18n();

  // Restore scroll position after a tiny delay to let DOM settle
  setTimeout(() => { content.scrollTop = savedScroll; }, 0);
}

let deferredPrompt: any = (window as any).__deferredPwaPrompt ?? null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  (window as any).__deferredPwaPrompt = e;
  const installContainer = document.getElementById('pwa-install-container');
  if (installContainer) installContainer.style.display = 'block';
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  (window as any).__deferredPwaPrompt = null;
  const installContainer = document.getElementById('pwa-install-container');
  if (installContainer) installContainer.style.display = 'none';
});

async function cacheAllForOffline(btn: HTMLButtonElement): Promise<void> {
  if (!('caches' in window)) return;
  const origHtml = btn.innerHTML;
  btn.disabled = true;
  try {
    const cache = await caches.open('abhidhamma-cache-v14');
    const urls: string[] = [
      './',
      './index.html',
      './manifest.json',
      './css/style.css',
      './data/manifest.json',
      './data/dictionary/pali_core.json',
      './data/dictionary/common_pali.json',
    ];
    if (state.manifest?.groups) {
      for (const group of Object.values(state.manifest.groups)) {
        for (const work of group) {
          for (const part of Object.values(work.parts || {})) {
            for (const file of part.files || []) {
              urls.push(`./data/works/${work.id}/${file}`);
            }
          }
        }
      }
    }
    const total = urls.length;
    let done = 0;
    const BATCH = 6;
    for (let i = 0; i < total; i += BATCH) {
      const slice = urls.slice(i, i + BATCH);
      await Promise.all(
        slice.map(async (u) => {
          try {
            const existing = await cache.match(u);
            if (!existing) {
              const r = await fetch(u);
              if (r.ok) await cache.put(u, r.clone());
            }
          } catch {
            // ignore individual fetch errors
          }
        })
      );
      done = Math.min(total, i + slice.length);
      const pct = Math.round((done / total) * 100);
      btn.innerHTML = `<span style="font-size: 16px;">⏳</span> Offline (${pct}%)`;
    }
    btn.innerHTML = `<span style="font-size: 18px;">✅</span> Offline 100%`;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }, 3500);
  } catch {
    btn.disabled = false;
    btn.innerHTML = origHtml;
  }
}

function wireSettingsPanel(): void {
  const installContainer = document.getElementById('pwa-install-container');
  const isStandalone =
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    (navigator as any).standalone === true;
  if (installContainer && isStandalone) {
    installContainer.style.display = 'none';
  }

  const installBtn = document.getElementById('btn-install-pwa') as HTMLButtonElement | null;
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      const promptEvent = deferredPrompt || (window as any).__deferredPwaPrompt;
      if (promptEvent) {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        deferredPrompt = null;
        (window as any).__deferredPwaPrompt = null;
        if (outcome === 'accepted') {
          if (installContainer) installContainer.style.display = 'none';
          return;
        }
      }
      await cacheAllForOffline(installBtn);
    });
  }
  const langSelect = el<HTMLSelectElement>("setting-lang");
  langSelect.addEventListener("change", () => {
    const newLang = langSelect.value as TranslationLang;
    let nextCommMode = settings.commentaryMode;
    if (newLang === "es") {
      if (!nextCommMode || nextCommMode === "en+pt") nextCommMode = "en+es";
      else if (nextCommMode === "pt") nextCommMode = "es";
    } else if (newLang === "pt") {
      if (nextCommMode === "en+es") nextCommMode = "en+pt";
      else if (nextCommMode === "es") nextCommMode = "pt";
    }
    updateSettings({
      translationLang: newLang,
      uiLang: newLang as UiLang,
      ...(nextCommMode ? { commentaryMode: nextCommMode } : {}),
    });
    rerenderContent();
    refreshLocalizedUI();
    window.dispatchEvent(new Event("languageChanged"));
  });

  el("font-inc").addEventListener("click", () => {
    updateSettings({ fontSize: Math.min(settings.fontSize + 1, 28) });
    applySettingsToUI();
  });
  el("font-dec").addEventListener("click", () => {
    updateSettings({ fontSize: Math.max(settings.fontSize - 1, 12) });
    applySettingsToUI();
  });

  const handleCommentaryCheckboxChange = (changed: "pali" | "transl") => {
    const curMode = resolveCommentaryMode(state.work);
    const hasEs = workSupportsEs(state.work);
    const targetTransl: "pt" | "es" =
      hasEs && (curMode === "en+es" || curMode === "es" || settings.translationLang === "es") ? "es" : "pt";
    let pChecked = showPali.checked;
    let tChecked = showTranslation.checked;
    if (!pChecked && !tChecked) {
      if (changed === "pali") tChecked = true;
      else pChecked = true;
    }
    let nextMode: CommentaryMode = "en+pt";
    if (pChecked && tChecked) nextMode = targetTransl === "es" ? "en+es" : "en+pt";
    else if (pChecked && !tChecked) nextMode = "en";
    else nextMode = targetTransl;
    updateSettings({ commentaryMode: nextMode });
    renderPartTabs();
    renderChapterNav();
    rerenderContent();
  };

  const showPali = el<HTMLInputElement>("setting-show-pali");
  showPali.addEventListener("change", () => {
    if (state.work && getWorkGroup(state.work.id) === "comentarios") {
      handleCommentaryCheckboxChange("pali");
      return;
    }
    updateSettings({ showPali: showPali.checked });
    rerenderContent();
  });

  const showTranslation = el<HTMLInputElement>("setting-show-translation");
  showTranslation.addEventListener("change", () => {
    if (state.work && getWorkGroup(state.work.id) === "comentarios") {
      handleCommentaryCheckboxChange("transl");
      return;
    }
    updateSettings({ showTranslation: showTranslation.checked });
    rerenderContent();
  });
}

function applyStaticI18n(): void {
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key, settings.uiLang);
  });
  document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (key) node.placeholder = t(key, settings.uiLang);
  });
  document.querySelectorAll<HTMLElement>("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (key) node.title = t(key, settings.uiLang);
  });
  updateSettingsLabels();
}

let tetrisUiInstance: TetrisUI | null = null;

function refreshLocalizedUI(): void {
  applyStaticI18n();
  updateSettingsLabels();
  if (tetrisUiInstance) {
    tetrisUiInstance.setLang(settings.uiLang as any);
  }
  if (!state.manifest) return;
  renderTree(state.manifest, el("tree"), (workId, partKey, chunkIndex) => void selectWork(workId, partKey, chunkIndex));
  if (state.work && state.partKey) {
    markActiveLeaf(el("tree"), state.work.id, state.partKey);
  }
  renderBreadcrumb();
  renderPartTabs();
  renderChapterNav();
  renderHistory();
  renderBookmarks();
  const exportBody = document.getElementById("export-panel-body");
  if (exportBody) {
    exportBody.innerHTML = "";
    initExportPanel(state.manifest, exportBody, () => state.work?.id ?? null);
  }
}

function wireChunkNav(): void {
  el("prev-chunk").addEventListener("click", () => {
    if (state.work && state.partKey && state.chunkIndex > 0) {
      void selectWork(state.work.id, state.partKey, state.chunkIndex - 1);
    }
  });
  el("next-chunk").addEventListener("click", () => {
    if (!state.work || !state.partKey) return;
    const part = state.work.parts[state.partKey];
    if (part && state.chunkIndex < part.files.length - 1) {
      void selectWork(state.work.id, state.partKey, state.chunkIndex + 1);
    }
  });
}

let setSrsModeGlobal: ((mode: string, updateHashRoute?: boolean) => void) | null = null;

function wireSrsNavigation(): void {
  const menuItems = document.querySelectorAll<HTMLButtonElement>(".srs-menu-item, .srs-tab-btn");
  const vocabPanel = document.getElementById("srs-full-body");
  const tetrisPanel = document.getElementById("srs-tetris-main");
  const readerSrs = document.getElementById("reader-srs");

  const setMode = (mode: string, updateHashRoute = true) => {
    menuItems.forEach((b) => {
      const active = b.dataset.srsMode === mode;
      b.classList.toggle("active", active);
      if (b.hasAttribute("aria-selected")) {
        b.setAttribute("aria-selected", active ? "true" : "false");
      }
    });

    const railSrs = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="srs"]');
    const railTetris = document.querySelector<HTMLButtonElement>('.rail-btn[data-panel="tetris"]');
    if (railSrs && railTetris) {
      if (mode === "tetris") {
        railSrs.classList.remove("active");
        railTetris.classList.add("active");
      } else {
        railTetris.classList.remove("active");
        railSrs.classList.add("active");
      }
    }

    const panelSrs = document.getElementById("panel-srs");
    const panelTetris = document.getElementById("panel-tetris");
    if (panelSrs && panelTetris) {
      if (mode === "tetris") {
        panelSrs.classList.remove("active");
        panelTetris.classList.add("active");
      } else {
        panelTetris.classList.remove("active");
        panelSrs.classList.add("active");
      }
    }

    if (mode === "tetris") {
      readerSrs?.classList.add("tetris-mode");
      document.body.classList.add("tetris-active");
      if (vocabPanel) vocabPanel.style.display = "none";
      if (tetrisPanel) {
        tetrisPanel.style.display = "flex";
        if (!tetrisUiInstance) {
          tetrisUiInstance = new TetrisUI(tetrisPanel, settings.uiLang as any);
          void tetrisUiInstance.init();
        }
      }
      if (updateHashRoute) {
        history.replaceState(null, "", "#/tetris");
      }
    } else {
      readerSrs?.classList.remove("tetris-mode");
      document.body.classList.remove("tetris-active");
      if (tetrisPanel) tetrisPanel.style.display = "none";
      if (vocabPanel) vocabPanel.style.display = "flex";
      if (updateHashRoute) {
        history.replaceState(null, "", "#/srs");
      }
    }
  };

  setSrsModeGlobal = setMode;

  menuItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.srsMode || "vocab";
      setMode(mode, true);
    });
  });

  const activeBtn = document.querySelector<HTMLButtonElement>(".srs-tab-btn.active, .srs-menu-item.active");
  if (activeBtn?.dataset.srsMode === "tetris") {
    setMode("tetris", false);
  }
}

interface Route {
  panel: string;
  workId?: string;
  partKey?: string;
  chunkIndex?: number;
  segId?: number;
  q?: string;
}

function parseHash(): Route | null {
  const hash = location.hash.replace(/^#\/?/, "");
  if (!hash) return null;
  
  const parts = (hash.split("?")[0] || "").split("/").filter(Boolean);
  if (parts.length === 0) return null;
  
  let panel = "tipitaka";
  let workId, partKey, chunkIndexStr;
  
  const knownPanels = new Set(["tipitaka", "dictionary", "history", "search", "settings", "export", "srs", "tools", "tetris"]);
  if (parts[0] === "srs" && parts[1] === "tetris") {
    parts.shift();
    parts.shift();
    panel = "tetris";
  } else if (parts[0] && knownPanels.has(parts[0])) {
    panel = parts.shift() as string;
  }
  
  if (parts.length >= 3) {
    [workId, partKey, chunkIndexStr] = parts;
  }

  const route: Route = { panel };
  if (workId && partKey && chunkIndexStr) {
    route.workId = workId;
    route.partKey = partKey;
    route.chunkIndex = Number(chunkIndexStr);
  }
  
  const queryPart = location.hash.split('?')[1];
  const urlParams = new URLSearchParams(queryPart || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  if (urlParams.has("q")) {
    route.q = urlParams.get("q")!;
  }
  return route;
}

function wireRouting(): void {
  window.addEventListener("hashchange", () => {
    const route = parseHash();
    if (!route) return;
    
    // Check panel switch
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (!activeBtn || activeBtn.dataset.panel !== route.panel) {
       switchPanel?.(route.panel, true);
    }
    
    if (route.workId && route.partKey && route.chunkIndex !== undefined) {
      if (state.work?.id === route.workId && state.partKey === route.partKey && state.chunkIndex === route.chunkIndex) {
         if (route.segId != null) {
            const target = el("content").querySelector<HTMLElement>(`.seg[data-seg-id="${route.segId}"]`);
            if (target) {
              target.scrollIntoView({ block: "center" });
              target.classList.add("seg-flash");
              setTimeout(() => target.classList.remove("seg-flash"), 1600);
            }
         }
      } else {
         void selectWork(route.workId as string, route.partKey as string, route.chunkIndex as number, route.segId);
      }
    }
  });
}

async function init(): Promise<void> {
  if ('serviceWorker' in navigator) {
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const k of keys) {
          if (k !== 'abhidhamma-cache-v14') void caches.delete(k);
        }
      }).catch(() => {});
    }
    navigator.serviceWorker.register('service-worker.js').then((reg) => {
      void reg.update();
    }).catch((err) => {
      console.error('Service Worker registration failed: ', err);
    });
  }

  try {
    const res = await fetch("data/manifest.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.manifest = (await res.json()) as Manifest;
  } catch (err) {
    log.error("falha ao carregar manifest.json — o site não pode continuar", err);
    el("content").innerHTML = `<p class="loading">${t("noResults", settings.uiLang)}</p>`;
    return;
  }

  applySettingsToUI();
  applyStaticI18n();
  renderTree(state.manifest, el("tree"), (workId, partKey, chunkIndex) => void selectWork(workId, partKey, chunkIndex));
  renderBreadcrumb();
  renderHistory();
  renderBookmarks();
  wireIconRail();
  wireSettingsPanel();
  wireChunkNav();
  wireRouting();
  document.addEventListener("click", closeChapterNav);
  initDictionaryPanel(el<HTMLInputElement>("dict-search"), el("dict-results"));
  initSearchPanel(el<HTMLInputElement>("search-input"), el("search-results"), (hit) =>
    void selectWork(hit.workId, hit.partKey, hit.chunk || 0, hit.segId)
  );
  initSelectionHandler(el("content"));
  initExportPanel(state.manifest, el("export-panel-body"), () => state.work?.id ?? null);
  initSrsPanel(el("srs-full-body"));
  initToolsPanel(el("tools-full-body"));

  const tetrisMount = document.getElementById("srs-tetris-main");
  if (tetrisMount) {
    tetrisUiInstance = new TetrisUI(tetrisMount, settings.uiLang as any);
    void tetrisUiInstance.init();
  }
  wireSrsNavigation();

  const route = parseHash();
  if (route) {
    if (route.panel !== "tipitaka") {
       switchPanel?.(route.panel, true);
    }
    if (route.workId && route.partKey && route.chunkIndex !== undefined) {
      await selectWork(route.workId as string, route.partKey as string, route.chunkIndex as number, route.segId);
    } else {
            el("content").innerHTML = `
        <div class="welcome">
          <img src="img/logo.png" alt="Dhammacakka" class="welcome-logo" />
          <p class="welcome-text">${t("welcomeBody", settings.uiLang)}</p>
        </div>`;
    }
  } else {
          el("content").innerHTML = `
        <div class="welcome">
          <img src="img/logo.png" alt="Dhammacakka" class="welcome-logo" />
          <p class="welcome-text">${t("welcomeBody", settings.uiLang)}</p>
        </div>`;
  }
}

void init();

// --- ABHIDHAMMIKA INTERLOCUTOR LAZY LOADING ---
const toggleInterlocutorBtn = document.getElementById('btn-toggle-interlocutor');
const interlocutorContainer = document.getElementById('interlocutor-container');

if (toggleInterlocutorBtn && interlocutorContainer) {
    let isInterlocutorLoaded = false;
    toggleInterlocutorBtn.addEventListener('click', async () => {
        if (!isInterlocutorLoaded) {
            toggleInterlocutorBtn.textContent = '⏳ Loading...';
            try {
                // Dynamically import the isolated UI module
                const { initInterlocutorPanel } = await import('./ai-feature/ui.js');
                initInterlocutorPanel(interlocutorContainer);
                isInterlocutorLoaded = true;
                
                // Optional: listen to the submit event to log or connect to the actual LLM Worker
                interlocutorContainer.addEventListener('interlocutor-submit', (e: any) => {
                    console.log('[Interlocutor Event Caught by App]:', e.detail);
                });
            } catch (err) {
                console.error('Failed to load Abhidhammika Interlocutor:', err);
                toggleInterlocutorBtn.textContent = '❌ Error';
                return;
            }
        }
        
        // Toggle visibility
        if (interlocutorContainer.style.display === 'none') {
            interlocutorContainer.style.display = 'block';
            toggleInterlocutorBtn.textContent = '❌ Close Debate';
        } else {
            interlocutorContainer.style.display = 'none';
            toggleInterlocutorBtn.textContent = '💬 Debate';
        }
    });
}
// Force cache bust 1788398610
console.log('Cache Bust: 1788398640');
