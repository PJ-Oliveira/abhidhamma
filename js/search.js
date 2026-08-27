import { t } from "./i18n.js?v=8a580b00";
import { settings } from "./state.js?v=8a580b00";
import { createLogger } from "./logger.js?v=8a580b00";
const log = createLogger("search");
const MAX_RESULTS = 50;
let shardManifest = null;
let manifestReady = false;
const shardCache = new Map();
async function ensureManifest() {
    if (manifestReady)
        return;
    try {
        const res = await fetch("data/search/manifest.json");
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        shardManifest = (await res.json());
    }
    catch (err) {
        log.warn("índice de busca ainda não disponível", err);
        shardManifest = null;
    }
    finally {
        manifestReady = true;
    }
}
function shardKeyFor(token) {
    const ch = token[0] ?? "";
    return /[a-z]/i.test(ch) ? ch.toLowerCase() : "misc";
}
async function loadShard(key) {
    const cached = shardCache.get(key);
    if (cached !== undefined)
        return cached;
    const fileName = shardManifest?.shards[key];
    if (!fileName) {
        shardCache.set(key, null);
        return null;
    }
    const res = await fetch(`data/search/${fileName}`);
    const data = res.ok ? (await res.json()) : null;
    shardCache.set(key, data);
    return data;
}
async function searchQuery(query) {
    const token = query.trim().toLowerCase();
    if (!token)
        return [];
    const shard = await loadShard(shardKeyFor(token));
    if (!shard)
        return [];
    const matchedIndexes = new Set(shard.postings[token] ?? []);
    if (matchedIndexes.size < MAX_RESULTS) {
        for (const [candidate, postings] of Object.entries(shard.postings)) {
            if (candidate === token || !candidate.startsWith(token))
                continue;
            for (const idx of postings)
                matchedIndexes.add(idx);
            if (matchedIndexes.size >= MAX_RESULTS)
                break;
        }
    }
    return Array.from(matchedIndexes)
        .slice(0, MAX_RESULTS)
        .map((idx) => shard.segments[idx])
        .filter((hit) => hit !== undefined);
}
export function initSearchPanel(inputEl, resultsEl, onOpenResult) {
    void ensureManifest();
    let debounceTimer;
    const renderEmpty = (key) => {
        resultsEl.innerHTML = "";
        const p = document.createElement("p");
        p.className = "side-empty";
        p.textContent = t(key, settings.uiLang);
        resultsEl.appendChild(p);
    };
    const run = async () => {
        const query = inputEl.value.trim();
        await ensureManifest();
        if (!shardManifest) {
            renderEmpty("dictNotReady");
            return;
        }
        if (!query) {
            renderEmpty("typeToSearch");
            return;
        }
        resultsEl.innerHTML = `<p class="side-empty">${t("loading", settings.uiLang)}</p>`;
        const hits = await searchQuery(query);
        if (!hits.length) {
            renderEmpty("noResults");
            return;
        }
        resultsEl.innerHTML = "";
        for (const hit of hits) {
            const div = document.createElement("div");
            div.className = "side-item";
            div.textContent = hit.snippet;
            div.addEventListener("click", () => onOpenResult(hit));
            resultsEl.appendChild(div);
        }
    };
    inputEl.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(run, 250);
    });
    void run();
}
//# sourceMappingURL=search.js.map