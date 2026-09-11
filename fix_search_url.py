import re

with open("src/search.ts", "r") as f:
    content = f.read()

init_logic = """export function initSearchPanel(inputEl: HTMLInputElement, resultsEl: HTMLElement): void {
  let searchTimeout: ReturnType<typeof setTimeout>;

  const performSearch = async () => {
    const q = inputEl.value.trim();
    
    // Update URL if search is active panel
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (activeBtn && activeBtn.dataset.panel === "search") {
        const hashBase = location.hash.split('?')[0];
        if (q) {
            history.replaceState(null, "", `${hashBase}?q=${encodeURIComponent(q)}`);
        } else if (location.hash.includes('?q=')) {
            history.replaceState(null, "", hashBase);
        }
    }

    if (!q) {"""

content = content.replace("""export function initSearchPanel(inputEl: HTMLInputElement, resultsEl: HTMLElement): void {
  let searchTimeout: ReturnType<typeof setTimeout>;

  const performSearch = async () => {
    const q = inputEl.value.trim();
    if (!q) {""", init_logic)

hash_listener = """  inputEl.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => void performSearch(), 500);
  });
  
  // Sync from URL
  const syncFromUrl = () => {
      const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
      const q = urlParams.get("q");
      if (q && inputEl.value !== q) {
          inputEl.value = q;
          void performSearch();
      }
  };
  window.addEventListener("hashchange", syncFromUrl);
  setTimeout(syncFromUrl, 100);
}"""

content = content.replace("""  inputEl.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => void performSearch(), 500);
  });
}""", hash_listener)

with open("src/search.ts", "w") as f:
    f.write(content)
