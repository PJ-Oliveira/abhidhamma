import re

with open("src/tools/tools.ts", "r") as f:
    content = f.read()

# Add URL syncing to switchTab
old_switch = """  function switchTab(id: TabId): void {
    // Update button states
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === id);
    });"""

new_switch = """  function switchTab(id: TabId, skipUrlUpdate = false): void {
    if (!skipUrlUpdate) {
        const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
        if (activeBtn && activeBtn.dataset.panel === "tools") {
            history.replaceState(null, "", `#/tools/${id}`);
        }
    }
    
    // Update button states
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === id);
    });"""

content = content.replace(old_switch, new_switch)

# Add URL reading on init and hashchange
old_init = """  // Activate first tab
  switchTab("mindmap");
}"""

new_init = """  const syncFromUrl = () => {
    const parts = location.hash.replace(/^#\/?/, "").split('?')[0].split('/');
    if (parts[0] === "tools" && parts[1]) {
       const requested = parts[1] as TabId;
       if (TABS.some(t => t.id === requested)) {
           switchTab(requested, true);
           return;
       }
    }
  };
  
  window.addEventListener("hashchange", syncFromUrl);

  // Activate first tab based on URL or default
  const parts = location.hash.replace(/^#\/?/, "").split('?')[0].split('/');
  if (parts[0] === "tools" && parts[1] && TABS.some(t => t.id === parts[1])) {
      switchTab(parts[1] as TabId, true);
  } else {
      switchTab("mindmap", true);
  }
}"""

content = content.replace(old_init, new_init)

with open("src/tools/tools.ts", "w") as f:
    f.write(content)
