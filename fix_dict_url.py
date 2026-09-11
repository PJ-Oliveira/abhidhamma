import re

with open("src/dictionary.ts", "r") as f:
    content = f.read()

# Add logic to initDictionaryPanel to read the query param on boot and listen to hashchange
init_logic = """export function initDictionaryPanel(inputEl: HTMLInputElement, resultsEl: HTMLElement): void {
  const ready = ensureLoaded();

  const renderHint = (key: string) => {
    resultsEl.innerHTML = "";
    const p = document.createElement("p");
    p.className = "dict-hint";
    p.textContent = t(key, settings.uiLang);
    resultsEl.appendChild(p);
  };
  
  let currentSearchTimeout: any = null;

  const render = () => {
    const query = inputEl.value.trim().toLowerCase();
    
    // Update URL if dictionary is active panel
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (activeBtn && activeBtn.dataset.panel === "dictionary") {
        const hashBase = location.hash.split('?')[0];
        if (query) {
            history.replaceState(null, "", `${hashBase}?q=${encodeURIComponent(query)}`);
        } else if (location.hash.includes('?q=')) {
            history.replaceState(null, "", hashBase);
        }
    }

    if (!dictReady) {"""

content = content.replace("""export function initDictionaryPanel(inputEl: HTMLInputElement, resultsEl: HTMLElement): void {
  const ready = ensureLoaded();

  const renderHint = (key: string) => {
    resultsEl.innerHTML = "";
    const p = document.createElement("p");
    p.className = "dict-hint";
    p.textContent = t(key, settings.uiLang);
    resultsEl.appendChild(p);
  };

  const render = () => {
    const query = inputEl.value.trim().toLowerCase();

    if (!dictReady) {""", init_logic)


hash_listener = """    }
  };

  inputEl.addEventListener("input", () => {
    render();
  });
  
  // Sync from URL
  const syncFromUrl = () => {
      const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
      const q = urlParams.get("q");
      if (q && inputEl.value !== q) {
          inputEl.value = q;
          render();
      }
  };
  window.addEventListener("hashchange", syncFromUrl);
  setTimeout(syncFromUrl, 100);

  ready
    .then(() => {"""

content = content.replace("""    }
  };

  inputEl.addEventListener("input", () => {
    render();
  });

  ready
    .then(() => {""", hash_listener)

with open("src/dictionary.ts", "w") as f:
    f.write(content)
