import { t } from "./i18n.js?v=ed8676ed";
import { settings } from "./state.js?v=ed8676ed";
import { createLogger } from "./logger.js?v=ed8676ed";
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
    const ch = token.normalize("NFC")[0] ?? "";
    return /\p{L}/u.test(ch) ? ch.toLowerCase() : "misc";
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
    const res = await fetch(`data/search/${encodeURIComponent(fileName)}`);
    const data = res.ok ? (await res.json()) : null;
    shardCache.set(key, data);
    return data;
}
async function searchSingleToken(token) {
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
async function searchQuery(query) {
    const tokens = query
        .trim()
        .normalize("NFC")
        .toLowerCase()
        .split(/[^\p{L}]+/u)
        .filter((w) => w.length > 0);
    if (tokens.length === 0)
        return [];
    if (tokens.length === 1)
        return searchSingleToken(tokens[0]);
    const uniqueTokens = Array.from(new Set(tokens)).slice(0, 6);
    const perTokenHits = await Promise.all(uniqueTokens.map((tok) => searchSingleToken(tok)));
    const hitByKey = new Map();
    for (const list of perTokenHits) {
        const seenInToken = new Set();
        for (const hit of list) {
            const k = `${hit.workId}|${hit.partKey}|${hit.chunk ?? 0}|${hit.segId}`;
            if (seenInToken.has(k))
                continue;
            seenInToken.add(k);
            const prev = hitByKey.get(k);
            if (prev)
                prev.count += 1;
            else
                hitByKey.set(k, { hit, count: 1 });
        }
    }
    const allMatches = Array.from(hitByKey.values());
    const exactAll = allMatches.filter((x) => x.count === uniqueTokens.length);
    const ranked = (exactAll.length > 0 ? exactAll : allMatches).sort((a, b) => b.count - a.count);
    return ranked.slice(0, MAX_RESULTS).map((x) => x.hit);
}
export function initSearchPanel(inputEl, resultsEl, onOpenResult) {
    void ensureManifest();
    let debounceTimer;
    let searchSeq = 0;
    const renderEmpty = (key) => {
        resultsEl.innerHTML = "";
        const p = document.createElement("p");
        p.className = "side-empty";
        p.textContent = t(key, settings.uiLang);
        resultsEl.appendChild(p);
    };
    const run = async () => {
        const reqSeq = ++searchSeq;
        const query = inputEl.value.trim();
        await ensureManifest();
        if (reqSeq !== searchSeq)
            return;
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
        if (reqSeq !== searchSeq)
            return;
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
    window.addEventListener("languageChanged", () => {
        if (!inputEl.value.trim()) {
            renderEmpty(shardManifest ? "typeToSearch" : "dictNotReady");
        }
        else if (resultsEl.querySelector(".side-empty")) {
            void run();
        }
    });
    void run();
}
//# sourceMappingURL=search.js.map