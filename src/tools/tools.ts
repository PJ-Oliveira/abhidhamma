import { t } from "../i18n.js";
import { settings } from "../state.js";
import { createLogger } from "../logger.js";

const log = createLogger("tools");

type TabId = "mindmap" | "patthana" | "vithi" | "matikas" | "cetasika";

interface Tab {
  id: TabId;
  icon: string;
  i18nKey: string;
  init: ((container: HTMLElement) => void) | null;
  loaded: boolean;
}

const TABS: Tab[] = [
  { id: "mindmap",  icon: "🗺", i18nKey: "toolMindmap",  init: null, loaded: false },
  { id: "patthana", icon: "📊", i18nKey: "toolPatthana", init: null, loaded: false },
  { id: "vithi",    icon: "🔄", i18nKey: "toolVithi",    init: null, loaded: false },
  { id: "matikas",  icon: "📖", i18nKey: "toolMatikas",  init: null, loaded: false },
  { id: "cetasika", icon: "🧬", i18nKey: "toolCetasika", init: null, loaded: false },
];

// Module registrations (called from each module's init)
export function registerToolModule(id: TabId, initFn: (container: HTMLElement) => void): void {
  const tab = TABS.find((t) => t.id === id);
  if (tab) tab.init = initFn;
}

export function initToolsPanel(container: HTMLElement): void {
  container.innerHTML = "";

  // Tab bar
  const tabBar = document.createElement("div");
  tabBar.className = "tools-tab-bar";
  container.appendChild(tabBar);

  // Tab content area
  const contentArea = document.createElement("div");
  contentArea.className = "tools-content";
  container.appendChild(contentArea);

  // Create tab panels
  const panels = new Map<TabId, HTMLElement>();
  for (const tab of TABS) {
    const panel = document.createElement("div");
    panel.className = "tools-panel";
    panel.id = `tools-panel-${tab.id}`;
    panel.style.display = "none";
    contentArea.appendChild(panel);
    panels.set(tab.id, panel);
  }

  // Create tab buttons
  const buttons: HTMLButtonElement[] = [];

  for (const tab of TABS) {
    const btn = document.createElement("button");
    btn.className = "tools-tab-btn";
    btn.dataset.tab = tab.id;
    btn.innerHTML = `<span class="tools-tab-icon">${tab.icon}</span><span class="tools-tab-label">${t(tab.i18nKey, settings.uiLang)}</span>`;
    btn.addEventListener("click", () => switchTab(tab.id));
    tabBar.appendChild(btn);
    buttons.push(btn);
  }

  function switchTab(id: TabId, skipUrlUpdate = false): void {
    if (!skipUrlUpdate) {
        const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
        if (activeBtn && activeBtn.dataset.panel === "tools") {
            location.hash = `#/tools/${id}`;
        }
    }
    
    // Update button states
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === id);
    });
    // Show/hide panels
    panels.forEach((panel, panelId) => {
      panel.style.display = panelId === id ? "flex" : "none";
    });
    // Lazy-load module
    const tab = TABS.find((t) => t.id === id);
    const panel = panels.get(id);
    if (tab && panel && tab.init && !tab.loaded) {
      tab.loaded = true;
      tab.init(panel);
      log.info(`Loaded tool module: ${id}`);
    }
  }

  const syncFromUrl = () => {
    const parts = (location.hash.replace(/^#\/?/, "").split('?')[0] || "").split('/');
    const p1 = parts[1];
    if ((parts[0] || "") === "tools" && p1) {
       const requested = p1 as TabId;
       if (TABS.some(t => t.id === requested)) {
           switchTab(requested, true);
           return;
       }
    }
  };
  
  window.addEventListener("hashchange", syncFromUrl);

  // Activate first tab based on URL or default
  const parts = (location.hash.replace(/^#\/?/, "").split('?')[0] || "").split('/');
  const p1_init = parts[1];
  if ((parts[0] || "") === "tools" && p1_init && TABS.some(t => t.id === p1_init)) {
      switchTab(p1_init as TabId, true);
  } else {
      switchTab("mindmap", true);
  }
}
