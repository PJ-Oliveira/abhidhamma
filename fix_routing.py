import re

with open("src/app.ts", "r") as f:
    content = f.read()

# 1. Update Route interface
old_route = """interface Route {
  workId: string;
  partKey: string;
  chunkIndex: number;
  segId?: number;
}"""

new_route = """interface Route {
  panel: string;
  workId?: string;
  partKey?: string;
  chunkIndex?: number;
  segId?: number;
}"""
content = content.replace(old_route, new_route)

# 2. Add switchPanel to the top
content = content.replace('function wireIconRail(): void {', 'let switchPanel: (target: string, skipHashUpdate?: boolean) => void;\n\nfunction wireIconRail(): void {')

# 3. Modify wireIconRail to use switchPanel
old_wire_icon = """  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.panel;
      const isMobile = window.innerWidth <= 860;
      const isFullscreen = target && FULLSCREEN_PANELS.has(target);

      if (btn.classList.contains("active") && !sidePanel.classList.contains("collapsed")) {
        doCollapse();
        return;
      }
      
      if (isMobile && isFullscreen) {
        if (!sidePanel.classList.contains("collapsed")) doCollapse();
      } else {
        doExpand();
      }

      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      panels.forEach((p) => p.classList.toggle("active", p.id === `panel-${target}`));
      toggleReaderOverlay(target);
    });
  });"""

new_wire_icon = """  switchPanel = (target: string, skipHashUpdate = false) => {
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
      switchPanel(target);
    });
  });"""
content = content.replace(old_wire_icon, new_wire_icon)

# 4. Update parseHash
old_parse = """function parseHash(): Route | null {
  const match = location.hash.match(/^#\/([^/?]+)\/([^/?]+)\/(\d+)/);
  if (!match) return null;
  const [, workId, partKey, chunk] = match;
  if (!workId || !partKey || !chunk) return null;
  
  const route: Route = { workId, partKey, chunkIndex: Number(chunk) };
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  return route;
}"""

new_parse = """function parseHash(): Route | null {
  const hash = location.hash.replace(/^#\/?/, "");
  if (!hash) return null;
  
  const parts = hash.split('?')[0].split('/').filter(Boolean);
  if (parts.length === 0) return null;
  
  let panel = "tipitaka";
  let workId, partKey, chunkIndexStr;
  
  const knownPanels = new Set(["tipitaka", "dictionary", "history", "search", "settings", "export", "srs", "tools"]);
  if (knownPanels.has(parts[0])) {
    panel = parts.shift()!;
  }
  
  if (parts.length >= 3) {
    [workId, partKey, chunkIndexStr] = parts;
  } else if (parts.length > 0 && parts[0] !== "") {
    if (!knownPanels.has(panel) && parts.length === 3) {
       [workId, partKey, chunkIndexStr] = parts;
    }
  }

  const route: Route = { panel };
  if (workId && partKey && chunkIndexStr) {
    route.workId = workId;
    route.partKey = partKey;
    route.chunkIndex = Number(chunkIndexStr);
  }
  
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  return route;
}"""
content = content.replace(old_parse, new_parse)

# 5. Update updateHash
old_update_hash = """function updateHash(): void {
  if (!state.work || !state.partKey) return;
  location.hash = `#/${state.work.id}/${state.partKey}/${state.chunkIndex}`;
}"""

new_update_hash = """function updateHash(): void {
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
}"""
content = content.replace(old_update_hash, new_update_hash)

# 6. Update wireRouting
old_wire_routing = """function wireRouting(): void {
  window.addEventListener("hashchange", () => {
    const route = parseHash();
    if (route) void selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
  });
}"""

new_wire_routing = """function wireRouting(): void {
  window.addEventListener("hashchange", () => {
    const route = parseHash();
    if (!route) return;
    
    // Check panel switch
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (!activeBtn || activeBtn.dataset.panel !== route.panel) {
       if (switchPanel) switchPanel(route.panel, true);
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
         void selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
      }
    }
  });
}"""
content = content.replace(old_wire_routing, new_wire_routing)

# 7. Boot logic (init)
old_boot = """  const route = parseHash();
  if (route) {
    await selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
  } else {
    el("content").innerHTML = `
      <div class="welcome">"""

new_boot = """  const route = parseHash();
  if (route) {
    if (switchPanel && route.panel !== "tipitaka") {
       switchPanel(route.panel, true);
    }
    if (route.workId && route.partKey && route.chunkIndex !== undefined) {
      await selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
    } else {
      el("content").innerHTML = `
        <div class="welcome">
          <img src="img/dhammacakka.webp" alt="Dhammacakka" class="welcome-img" />
          <h1 class="welcome-title">ABHIDHAMMA</h1>
          <p class="welcome-text">${t("welcomeDesc", settings.uiLang)}</p>
        </div>`;
    }
  } else {
    el("content").innerHTML = `
      <div class="welcome">"""
content = content.replace(old_boot, new_boot)

with open("src/app.ts", "w") as f:
    f.write(content)
