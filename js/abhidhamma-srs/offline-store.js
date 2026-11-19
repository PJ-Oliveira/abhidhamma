import { DEFAULT_ANKI_CONFIG, loadAnkiCardStates, loadAnkiConfig, loadAnkiStats, loadMnemonicNotes, normalizeAnkiConfig, saveAnkiCardStates, saveAnkiConfig, saveAnkiStats, STORAGE_MNEMONICS_KEY, } from "./scheduler.js?v=d3104d40";
export const APP_OFFLINE_CACHE_NAME = "abhidhamma-cache-v26";
export const VAULT_CACHE_NAME = "abhidhamma-anki-vault-v1";
export const VAULT_SNAPSHOT_PATH = "/_offline_vault/abhidhamma-anki-progress.json";
export const VAULT_OPFS_FILENAME = "abhidhamma-anki-progress.json";
export const VAULT_IDB_NAME = "abhidhamma-anki-vault";
export const VAULT_IDB_VERSION = 1;
export const VAULT_BROADCAST_CHANNEL = "abhidhamma-anki-vault-sync";
const MAX_SNAPSHOT_LOG = 2000;
function isStandaloneMode() {
    try {
        return Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches ||
            navigator.standalone === true);
    }
    catch {
        return false;
    }
}
function isOnline() {
    try {
        return typeof navigator !== "undefined" ? navigator.onLine !== false : true;
    }
    catch {
        return true;
    }
}
function hasProgressData(snap) {
    if (!snap)
        return false;
    return (Object.keys(snap.states).length > 0 ||
        snap.stats.totalReviewed > 0 ||
        Object.keys(snap.mnemonics).length > 0 ||
        snap.recentLog.length > 0);
}
function snapshotKey() {
    try {
        if (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null") {
            return new URL(VAULT_SNAPSHOT_PATH, window.location.origin).href;
        }
        return new URL(VAULT_SNAPSHOT_PATH, window.location.href).href;
    }
    catch {
        return VAULT_SNAPSHOT_PATH;
    }
}
function pickNewerCardState(a, b) {
    if (a.lastReviewAt !== b.lastReviewAt) {
        return a.lastReviewAt > b.lastReviewAt ? a : b;
    }
    if (a.reps !== b.reps)
        return a.reps > b.reps ? a : b;
    return a.lapses >= b.lapses ? a : b;
}
function mergeStats(a, b) {
    const sameDay = a.lastSessionDate === b.lastSessionDate;
    if (sameDay) {
        return {
            totalReviewed: Math.max(a.totalReviewed, b.totalReviewed),
            reviewedToday: Math.max(a.reviewedToday, b.reviewedToday),
            correctToday: Math.max(a.correctToday, b.correctToday),
            newStudiedToday: Math.max(a.newStudiedToday, b.newStudiedToday),
            streak: Math.max(a.streak, b.streak),
            lastSessionDate: a.lastSessionDate,
        };
    }
    const newer = a.lastSessionDate > b.lastSessionDate ? a : b;
    return {
        ...newer,
        totalReviewed: Math.max(a.totalReviewed, b.totalReviewed),
    };
}
function mergeConfig(a, b, aUpdated, bUpdated) {
    const primary = aUpdated >= bUpdated ? a : b;
    const secondary = aUpdated >= bUpdated ? b : a;
    const paceTargetMs = primary.paceTargetMs > 0
        ? primary.paceTargetMs
        : secondary.paceTargetMs > 0
            ? secondary.paceTargetMs
            : 0;
    return normalizeAnkiConfig({
        ...DEFAULT_ANKI_CONFIG,
        ...primary,
        paceTargetMs,
    });
}
export function mergeSnapshots(a, b) {
    const states = { ...a.states };
    for (const [id, stB] of Object.entries(b.states)) {
        const stA = states[id];
        states[id] = stA ? pickNewerCardState(stA, stB) : stB;
    }
    const mnemonics = a.updatedAt >= b.updatedAt ? { ...b.mnemonics, ...a.mnemonics } : { ...a.mnemonics, ...b.mnemonics };
    const logMap = new Map();
    for (const entry of a.recentLog)
        logMap.set(entry.id, entry);
    for (const entry of b.recentLog)
        logMap.set(entry.id, entry);
    const recentLog = [...logMap.values()]
        .sort((x, y) => x.timestamp - y.timestamp)
        .slice(-MAX_SNAPSHOT_LOG);
    const stats = mergeStats(a.stats, b.stats);
    const config = mergeConfig(a.config, b.config, a.updatedAt, b.updatedAt);
    const reviewLogCount = Math.max(a.reviewLogCount, b.reviewLogCount, recentLog.length, stats.totalReviewed);
    return {
        schemaVersion: 1,
        updatedAt: Math.max(a.updatedAt, b.updatedAt),
        states,
        stats,
        config,
        mnemonics,
        reviewLogCount,
        recentLog,
    };
}
export function buildLocalStorageSnapshot(recentLog = [], reviewLogCount, nowMs = Date.now()) {
    const states = loadAnkiCardStates();
    const stats = loadAnkiStats(nowMs);
    const config = loadAnkiConfig();
    const mnemonics = loadMnemonicNotes();
    let maxCardTs = 0;
    for (const st of Object.values(states)) {
        if (st.lastReviewAt > maxCardTs)
            maxCardTs = st.lastReviewAt;
    }
    const updatedAt = maxCardTs > 0 ? maxCardTs : stats.totalReviewed > 0 ? nowMs : 0;
    return {
        schemaVersion: 1,
        updatedAt,
        states,
        stats,
        config,
        mnemonics,
        reviewLogCount: Math.max(reviewLogCount ?? 0, recentLog.length, stats.totalReviewed),
        recentLog: recentLog.slice(-MAX_SNAPSHOT_LOG),
    };
}
function writeToLocalStorage(snap) {
    saveAnkiCardStates({ ...snap.states });
    saveAnkiStats(snap.stats);
    saveAnkiConfig(snap.config);
    try {
        localStorage.setItem(STORAGE_MNEMONICS_KEY, JSON.stringify(snap.mnemonics));
    }
    catch {
    }
}
function openVaultDb() {
    if (typeof indexedDB === "undefined")
        return Promise.resolve(null);
    return new Promise((resolve) => {
        try {
            const req = indexedDB.open(VAULT_IDB_NAME, VAULT_IDB_VERSION);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains("snapshots")) {
                    db.createObjectStore("snapshots");
                }
                if (!db.objectStoreNames.contains("review_log")) {
                    const store = db.createObjectStore("review_log", { keyPath: "id" });
                    store.createIndex("cardId", "cardId", { unique: false });
                    store.createIndex("timestamp", "timestamp", { unique: false });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        }
        catch {
            resolve(null);
        }
    });
}
async function readIdbSnapshot() {
    const db = await openVaultDb();
    if (!db)
        return { snapshot: null, hasIdb: false };
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(["snapshots", "review_log"], "readonly");
            const snapReq = tx.objectStore("snapshots").get("latest");
            const countReq = tx.objectStore("review_log").count();
            tx.oncomplete = () => {
                const raw = snapReq.result;
                const cnt = typeof countReq.result === "number" ? countReq.result : 0;
                db.close();
                if (raw && raw.schemaVersion === 1) {
                    resolve({
                        snapshot: { ...raw, reviewLogCount: Math.max(raw.reviewLogCount, cnt) },
                        hasIdb: true,
                    });
                }
                else {
                    resolve({ snapshot: null, hasIdb: true });
                }
            };
            tx.onerror = () => {
                db.close();
                resolve({ snapshot: null, hasIdb: true });
            };
        }
        catch {
            db.close();
            resolve({ snapshot: null, hasIdb: false });
        }
    });
}
async function writeIdbSnapshot(snap, logEntry) {
    const db = await openVaultDb();
    if (!db)
        return false;
    return new Promise((resolve) => {
        try {
            const tx = db.transaction(["snapshots", "review_log"], "readwrite");
            tx.objectStore("snapshots").put(snap, "latest");
            if (logEntry) {
                tx.objectStore("review_log").put(logEntry);
            }
            tx.oncomplete = () => {
                db.close();
                resolve(true);
            };
            tx.onerror = () => {
                db.close();
                resolve(false);
            };
        }
        catch {
            db.close();
            resolve(false);
        }
    });
}
async function clearIdbVault() {
    const db = await openVaultDb();
    if (!db)
        return;
    await new Promise((resolve) => {
        try {
            const tx = db.transaction(["snapshots", "review_log"], "readwrite");
            tx.objectStore("snapshots").clear();
            tx.objectStore("review_log").clear();
            tx.oncomplete = () => {
                db.close();
                resolve();
            };
            tx.onerror = () => {
                db.close();
                resolve();
            };
        }
        catch {
            db.close();
            resolve();
        }
    });
}
async function readCacheVaultSnapshot() {
    if (typeof caches === "undefined")
        return { snapshot: null, hasCache: false };
    try {
        const cache = await caches.open(VAULT_CACHE_NAME);
        const match = await cache.match(snapshotKey());
        if (!match)
            return { snapshot: null, hasCache: true };
        const parsed = (await match.json());
        if (parsed && parsed.schemaVersion === 1) {
            return { snapshot: parsed, hasCache: true };
        }
        return { snapshot: null, hasCache: true };
    }
    catch {
        return { snapshot: null, hasCache: false };
    }
}
async function writeCacheVaultSnapshot(snap) {
    if (typeof caches === "undefined" || typeof Response === "undefined")
        return false;
    try {
        const cache = await caches.open(VAULT_CACHE_NAME);
        const body = JSON.stringify(snap);
        const resp = new Response(body, {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "public, max-age=31536000, immutable",
                "X-Abhidhamma-Vault-Updated": String(snap.updatedAt),
            },
        });
        await cache.put(snapshotKey(), resp);
        return true;
    }
    catch {
        return false;
    }
}
async function clearCacheVault() {
    if (typeof caches === "undefined")
        return;
    try {
        const cache = await caches.open(VAULT_CACHE_NAME);
        await cache.delete(snapshotKey());
    }
    catch {
    }
}
async function getOpfsRoot() {
    try {
        const st = navigator.storage;
        if (!st || typeof st.getDirectory !== "function")
            return null;
        return await st.getDirectory();
    }
    catch {
        return null;
    }
}
async function readOpfsSnapshot() {
    const root = await getOpfsRoot();
    if (!root)
        return { snapshot: null, hasOpfs: false };
    try {
        const fh = await root.getFileHandle(VAULT_OPFS_FILENAME);
        const file = await fh.getFile();
        const parsed = JSON.parse(await file.text());
        if (parsed && parsed.schemaVersion === 1) {
            return { snapshot: parsed, hasOpfs: true };
        }
        return { snapshot: null, hasOpfs: true };
    }
    catch {
        return { snapshot: null, hasOpfs: true };
    }
}
async function writeOpfsSnapshot(snap) {
    const root = await getOpfsRoot();
    if (!root)
        return false;
    try {
        const fh = await root.getFileHandle(VAULT_OPFS_FILENAME, { create: true });
        const writable = await fh.createWritable();
        await writable.write(JSON.stringify(snap));
        await writable.close();
        return true;
    }
    catch {
        return false;
    }
}
async function clearOpfsVault() {
    const root = await getOpfsRoot();
    if (!root)
        return;
    try {
        await root.removeEntry(VAULT_OPFS_FILENAME);
    }
    catch {
    }
}
async function isDeckCachedOffline() {
    if (typeof caches === "undefined")
        return false;
    try {
        const match = await caches.match("./data/srs/abhidhamma_cards.json", { ignoreSearch: true });
        if (match)
            return true;
        const match2 = await caches.match("data/srs/abhidhamma_cards.json", { ignoreSearch: true });
        return Boolean(match2);
    }
    catch {
        return false;
    }
}
export async function requestPersistentStorage() {
    try {
        const storage = navigator.storage;
        if (!storage)
            return false;
        if (typeof storage.persisted === "function") {
            const already = await storage.persisted();
            if (already)
                return true;
        }
        if (typeof storage.persist === "function") {
            return await storage.persist();
        }
        return false;
    }
    catch {
        return false;
    }
}
export async function hydrateOfflineVault(nowMs = Date.now()) {
    const localSnap = buildLocalStorageSnapshot([], undefined, nowMs);
    const [idbRes, cacheRes, opfsRes, persistent, deckCached] = await Promise.all([
        readIdbSnapshot(),
        readCacheVaultSnapshot(),
        readOpfsSnapshot(),
        requestPersistentStorage(),
        isDeckCachedOffline(),
    ]);
    const sources = [];
    if (hasProgressData(localSnap))
        sources.push({ name: "localStorage", snap: localSnap });
    if (hasProgressData(idbRes.snapshot))
        sources.push({ name: "indexedDB", snap: idbRes.snapshot });
    if (hasProgressData(cacheRes.snapshot))
        sources.push({ name: "cacheAPI", snap: cacheRes.snapshot });
    if (hasProgressData(opfsRes.snapshot))
        sources.push({ name: "opfs", snap: opfsRes.snapshot });
    let finalSnap = localSnap;
    let recoveredFrom = null;
    if (sources.length === 1) {
        finalSnap = sources[0].snap;
        recoveredFrom = sources[0].name;
    }
    else if (sources.length > 1) {
        finalSnap = sources.slice(1).reduce((acc, s) => mergeSnapshots(acc, s.snap), sources[0].snap);
        recoveredFrom = hasProgressData(localSnap) ? "merged" : sources[0].name;
    }
    if (hasProgressData(finalSnap)) {
        writeToLocalStorage(finalSnap);
        await Promise.all([
            writeIdbSnapshot(finalSnap),
            writeCacheVaultSnapshot(finalSnap),
            writeOpfsSnapshot(finalSnap),
        ]);
    }
    const activeLayers = 1 + (idbRes.hasIdb ? 1 : 0) + (cacheRes.hasCache ? 1 : 0) + (opfsRes.hasOpfs ? 1 : 0);
    return {
        snapshot: finalSnap,
        status: {
            online: isOnline(),
            standalone: isStandaloneMode(),
            persistent,
            hasIdb: idbRes.hasIdb,
            hasCacheVault: cacheRes.hasCache,
            hasOpfs: opfsRes.hasOpfs,
            activeLayers,
            deckCached,
            cachedAnswersCount: Math.max(finalSnap.reviewLogCount, finalSnap.stats.totalReviewed),
            lastSavedAt: finalSnap.updatedAt,
            recoveredFrom,
        },
    };
}
export async function persistOfflineProgress(states, stats, config, mnemonics, recentLog, newLogEntry, nowMs = Date.now()) {
    const nextLog = newLogEntry
        ? [...recentLog, newLogEntry].slice(-MAX_SNAPSHOT_LOG)
        : recentLog.slice(-MAX_SNAPSHOT_LOG);
    const snap = {
        schemaVersion: 1,
        updatedAt: nowMs,
        states: { ...states },
        stats,
        config,
        mnemonics: { ...mnemonics },
        reviewLogCount: Math.max(stats.totalReviewed, nextLog.length),
        recentLog: nextLog,
    };
    writeToLocalStorage(snap);
    await Promise.all([
        writeIdbSnapshot(snap, newLogEntry),
        writeCacheVaultSnapshot(snap),
        writeOpfsSnapshot(snap),
    ]);
    try {
        if (typeof BroadcastChannel !== "undefined") {
            const ch = new BroadcastChannel(VAULT_BROADCAST_CHANNEL);
            ch.postMessage({ type: "vault-updated", updatedAt: snap.updatedAt });
            ch.close();
        }
    }
    catch {
    }
    return snap;
}
export async function resetOfflineVault() {
    await Promise.all([clearIdbVault(), clearCacheVault(), clearOpfsVault()]);
}
export async function fetchDeckWithOfflineCache(url = "data/srs/abhidhamma_cards.json") {
    const tryCache = async () => {
        if (typeof caches === "undefined")
            return null;
        try {
            const cached = (await caches.match(url, { ignoreSearch: true })) ??
                (await caches.match(`./${url}`, { ignoreSearch: true }));
            if (cached && cached.ok) {
                return (await cached.json());
            }
        }
        catch {
        }
        return null;
    };
    try {
        const res = await fetch(url);
        if (res.ok) {
            const cloned = typeof caches !== "undefined" && typeof res.clone === "function" ? res.clone() : null;
            const data = (await res.json());
            if (cloned) {
                try {
                    const cache = await caches.open(APP_OFFLINE_CACHE_NAME);
                    await cache.put(url, cloned);
                }
                catch {
                }
            }
            return data;
        }
    }
    catch {
    }
    const cached = await tryCache();
    if (cached)
        return cached;
    throw new Error(`Failed to load ${url} (online and offline cache unavailable)`);
}
export function parseProgressBackup(rawJson) {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== "object" || parsed.schemaVersion !== 1) {
        throw new Error("Invalid Abhidhamma SRS backup format");
    }
    if (!parsed.states || typeof parsed.states !== "object") {
        throw new Error("Missing card states in backup");
    }
    const now = Date.now();
    return {
        schemaVersion: 1,
        updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : now,
        states: parsed.states,
        stats: parsed.stats ?? loadAnkiStats(now),
        config: normalizeAnkiConfig(parsed.config),
        mnemonics: parsed.mnemonics && typeof parsed.mnemonics === "object" ? parsed.mnemonics : {},
        reviewLogCount: typeof parsed.reviewLogCount === "number" ? parsed.reviewLogCount : Object.keys(parsed.states).length,
        recentLog: Array.isArray(parsed.recentLog) ? parsed.recentLog.slice(-MAX_SNAPSHOT_LOG) : [],
    };
}
export function serializeProgressBackup(snap) {
    return JSON.stringify(snap, null, 2);
}
//# sourceMappingURL=offline-store.js.map