import type { Settings, HistoryEntry, BookmarkEntry } from "./types.js";
import { createLogger } from "./logger.js";

const log = createLogger("state");

const SETTINGS_KEY = "atp.settings.v1";
const HISTORY_KEY = "atp.history.v1";
const BOOKMARKS_KEY = "atp.bookmarks.v1";
const HISTORY_LIMIT = 50;

const DEFAULT_SETTINGS: Settings = {
  translationLang: "en",
  uiLang: "en",
  fontSize: 17,
  showPali: true,
  showTranslation: true,
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    log.warn(`falha ao ler "${key}" do localStorage, usando padrão`, err);
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    log.warn(`falha ao salvar "${key}" no localStorage`, err);
  }
}

export const settings: Settings = load(SETTINGS_KEY, DEFAULT_SETTINGS);

export function updateSettings(patch: Partial<Settings>): void {
  Object.assign(settings, patch);
  save(SETTINGS_KEY, settings);
}

export function getHistory(): HistoryEntry[] {
  return load(HISTORY_KEY, [] as HistoryEntry[]);
}

export function pushHistory(entry: Omit<HistoryEntry, "ts">): void {
  const list = getHistory();
  const filtered = list.filter(
    (e) => !(e.workId === entry.workId && e.partKey === entry.partKey && e.chunk === entry.chunk)
  );
  filtered.unshift({ ...entry, ts: Date.now() });
  save(HISTORY_KEY, filtered.slice(0, HISTORY_LIMIT));
}

export function getBookmarks(): BookmarkEntry[] {
  return load(BOOKMARKS_KEY, [] as BookmarkEntry[]);
}

export function toggleBookmark(entry: Omit<BookmarkEntry, "ts">): boolean {
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

export function isBookmarked(workId: string, partKey: string, segId: number): boolean {
  return getBookmarks().some((e) => e.workId === workId && e.partKey === partKey && e.segId === segId);
}
