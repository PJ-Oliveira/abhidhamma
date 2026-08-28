import { t } from "../i18n.js?v=a38f104a";
import { settings } from "../state.js?v=a38f104a";
import { createLogger } from "../logger.js?v=a38f104a";
const log = createLogger("tools");
const TABS = [
    { id: "mindmap", icon: "🗺", i18nKey: "toolMindmap", init: null, loaded: false },
    { id: "patthana", icon: "📊", i18nKey: "toolPatthana", init: null, loaded: false },
    { id: "vithi", icon: "🔄", i18nKey: "toolVithi", init: null, loaded: false },
    { id: "matikas", icon: "📖", i18nKey: "toolMatikas", init: null, loaded: false },
    { id: "cetasika", icon: "🧬", i18nKey: "toolCetasika", init: null, loaded: false },
];
export function registerToolModule(id, initFn) {
    const tab = TABS.find((t) => t.id === id);
    if (tab)
        tab.init = initFn;
}
export function initToolsPanel(container) {
    container.innerHTML = "";
    const tabBar = document.createElement("div");
    tabBar.className = "tools-tab-bar";
    container.appendChild(tabBar);
    const contentArea = document.createElement("div");
    contentArea.className = "tools-content";
    container.appendChild(contentArea);
    const panels = new Map();
    for (const tab of TABS) {
        const panel = document.createElement("div");
        panel.className = "tools-panel";
        panel.id = `tools-panel-${tab.id}`;
        panel.style.display = "none";
        contentArea.appendChild(panel);
        panels.set(tab.id, panel);
    }
    const buttons = [];
    for (const tab of TABS) {
        const btn = document.createElement("button");
        btn.className = "tools-tab-btn";
        btn.dataset.tab = tab.id;
        btn.innerHTML = `<span class="tools-tab-icon">${tab.icon}</span><span class="tools-tab-label">${t(tab.i18nKey, settings.uiLang)}</span>`;
        btn.addEventListener("click", () => switchTab(tab.id));
        tabBar.appendChild(btn);
        buttons.push(btn);
    }
    function switchTab(id, skipUrlUpdate = false) {
        if (!skipUrlUpdate) {
            const activeBtn = document.querySelector(".rail-btn.active");
            if (activeBtn && activeBtn.dataset.panel === "tools") {
                history.replaceState(null, "", `#/tools/${id}`);
            }
        }
        buttons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.tab === id);
        });
        panels.forEach((panel, panelId) => {
            panel.style.display = panelId === id ? "flex" : "none";
        });
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
            const requested = p1;
            if (TABS.some(t => t.id === requested)) {
                switchTab(requested, true);
                return;
            }
        }
    };
    window.addEventListener("hashchange", syncFromUrl);
    const parts = (location.hash.replace(/^#\/?/, "").split('?')[0] || "").split('/');
    const p1_init = parts[1];
    if ((parts[0] || "") === "tools" && p1_init && TABS.some(t => t.id === p1_init)) {
        switchTab(p1_init, true);
    }
    else {
        switchTab("mindmap", true);
    }
}
//# sourceMappingURL=tools.js.map