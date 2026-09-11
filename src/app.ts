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
import { initToolsPanel } from "./tools/tools.js";
import "./tools/mindmap.js";
import "./tools/patthana.js";
import "./tools/vithi.js";
import "./tools/matikas.js";
import "./tools/cetasika.js";
import { initSelectionHandler, clearSelection } from "./selection.js";
import { createLogger } from "./logger.js";
import type { Manifest, WorkEntry, WorkPart, Segment, TranslationLang, UiLang } from "./types.js";

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

function updateSettingsLabels(): void {
  const group = state.work ? getWorkGroup(state.work.id) : null;
  const isBilingual = group === "comentarios";
  const paliLabelEl = document.getElementById("label-show-pali");
  const translationLabelEl = document.getElementById("label-show-translation");
  if (paliLabelEl) {
    paliLabelEl.textContent = isBilingual
      ? t("settingShowOriginal", settings.uiLang)
      : t("settingShowPali", settings.uiLang);
  }
  if (translationLabelEl) {
    translationLabelEl.textContent = isBilingual
      ? t("settingShowPT", settings.uiLang)
      : t("settingShowTranslation", settings.uiLang);
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
  if (state.work && state.partKey && state.chunkIndex !== undefined) {
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

  for (let i = 0; i < chapters.length; i++) {
    const entry = chapters[i]!;
    const chunkIdx = segIdToChunk(entry.id, part);
    const li = document.createElement("li");
    const numSpan = document.createElement("span");
    numSpan.className = "chap-num";
    numSpan.textContent = `${i + 1}.`;
    const textSpan = document.createElement("span");
    textSpan.className = "chap-text";
    textSpan.textContent = entry.text.replace(/^\d+\.\s*/, "");
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

  // For bilingual EN-PT works, ensure English (stored in pali field) is visible
  const workGroup = getWorkGroup(workId);
  if (workGroup === "comentarios" && !settings.showPali) {
    updateSettings({ showPali: true });
    el<HTMLInputElement>("setting-show-pali").checked = true;
  }

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

  const FULLSCREEN_PANELS = new Set(["srs", "tools"]);
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
    readerSrs.style.display = target === "srs" ? "flex" : "none";
    readerTools.style.display = target === "tools" ? "flex" : "none";
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
      panels.forEach((p) => p.classList.toggle("active", p.id === `panel-${target}`));
      toggleReaderOverlay(target);
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

  renderSegments(state.segments, content, {
    onNoteHover: handleNoteHover,
    ...(group === "comentarios" ? { effectiveLang: "pt" as const } : {}),
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

let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installContainer = document.getElementById('pwa-install-container');
  if (installContainer) installContainer.style.display = 'block';
});

function wireSettingsPanel(): void {
  const installBtn = document.getElementById('btn-install-pwa');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
        const installContainer = document.getElementById('pwa-install-container');
        if (installContainer) installContainer.style.display = 'none';
      }
    });
  }
  const langSelect = el<HTMLSelectElement>("setting-lang");
  langSelect.addEventListener("change", () => {
    updateSettings({ translationLang: langSelect.value as TranslationLang, uiLang: langSelect.value as UiLang });
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

  const showPali = el<HTMLInputElement>("setting-show-pali");
  showPali.addEventListener("change", () => {
    updateSettings({ showPali: showPali.checked });
    rerenderContent();
  });

  const showTranslation = el<HTMLInputElement>("setting-show-translation");
  showTranslation.addEventListener("change", () => {
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
}

function refreshLocalizedUI(): void {
  applyStaticI18n();
  updateSettingsLabels();
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
  
  const knownPanels = new Set(["tipitaka", "dictionary", "history", "search", "settings", "export", "srs", "tools"]);
  if (parts[0] && knownPanels.has(parts[0])) {
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
    navigator.serviceWorker.register('service-worker.js').catch((err) => {
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
