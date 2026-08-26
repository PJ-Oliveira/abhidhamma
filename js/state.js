import { createLogger } from "./logger.js?v=e06ffa67";
const log = createLogger("state");
const SETTINGS_KEY = "atp.settings.v1";
const HISTORY_KEY = "atp.history.v1";
const BOOKMARKS_KEY = "atp.bookmarks.v1";
const HISTORY_LIMIT = 50;
const DEFAULT_SETTINGS = {
    translationLang: "pt",
    uiLang: "pt",
    fontSize: 17,
    showPali: true,
    showTranslation: true,
};
function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch (err) {
        log.warn(`falha ao ler "${key}" do localStorage, usando padrão`, err);
        return fallback;
    }
}
function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch (err) {
        log.warn(`falha ao salvar "${key}" no localStorage`, err);
    }
}
export const settings = load(SETTINGS_KEY, DEFAULT_SETTINGS);
export function updateSettings(patch) {
    Object.assign(settings, patch);
    save(SETTINGS_KEY, settings);
}
export function getHistory() {
    return load(HISTORY_KEY, []);
}
export function pushHistory(entry) {
    const list = getHistory();
    const filtered = list.filter((e) => !(e.workId === entry.workId && e.partKey === entry.partKey && e.chunk === entry.chunk));
    filtered.unshift({ ...entry, ts: Date.now() });
    save(HISTORY_KEY, filtered.slice(0, HISTORY_LIMIT));
}
export function getBookmarks() {
    return load(BOOKMARKS_KEY, []);
}
export function toggleBookmark(entry) {
    const list = getBookmarks();
    const key = `${entry.workId}/${entry.partKey}/${entry.segId}`;
    const idx = list.findIndex((e) => `${e.workId}/${e.partKey}/${e.segId}` === key);
    if (idx >= 0) {
        list.splice(idx, 1);
        save(BOOKMARKS_KEY, list);
        return false;
    }
    list.unshift({ ...entry, ts: Date.now() });
    save(BOOKMARKS_KEY, list);
    return true;
}
export function isBookmarked(workId, partKey, segId) {
    return getBookmarks().some((e) => e.workId === workId && e.partKey === partKey && e.segId === segId);
}
//# sourceMappingURL=state.js.map