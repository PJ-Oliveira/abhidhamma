# Architecture

## 1. Module Graph

```
index.html
  └── js/app.js  (entry point)
        ├── i18n.js           — UI string literals (PT/EN/ES)
        ├── state.js          — localStorage persistence
        │     └── logger.js
        ├── tree.js           — Navigation tree rendering
        ├── reader.js         — Chunk loading + segment rendering
        ├── dictionary.js     — Pāli dictionary lookup (normalization)
        ├── search.js         — Sharded inverted-index search
        ├── export.js         — PDF / EPUB 3 builder
        ├── srs.js            — Spaced Repetition (SM-2)
        ├── selection.js      — Text selection popover + copy-link
        ├── tools/tools.js    — Tools panel tab manager
        │     ├── tools/mindmap.js
        │     ├── tools/patthana.js
        │     ├── tools/vithi.js
        │     ├── tools/matikas.js
        │     └── tools/cetasika.js
        └── ai-feature/ui.js  — Debate Simulator (lazy-loaded)
              ├── debate-scenarios.js
              └── ontology/kathavatthu_logic.js
```

No circular dependencies. `logger.ts` and `types.ts` are pure leaves.

---

## 2. CSS Layout

```css
#app {
  display: grid;
  grid-template-columns: var(--rail-w) var(--panel-w) 8px 1fr;
  height: 100vh;
}
```

Four columns:
1. `#icon-rail` — clamp(56 – 76 px) — navigation icons
2. `#side-panel` — clamp(240 – 320 px), resizable via `#panel-resizer` drag — content panels
3. `#panel-resizer` — 8 px drag handle
4. `main#reader` — remainder — text content

Responsive breakpoint at `max-width: 860px`: panel becomes a fixed overlay; rail collapses labels.

---

## 3. URL Routing

Hash-based. Format: `#/{panel}/{workId}/{partKey}/{chunkIndex}?seg={id}&q={query}`

```
#/tipitaka/dhammasangani/mula/0
#/dictionary?q=citta
#/tools/vithi
#/search
```

`parseHash()` in `app.ts` parses the hash into a `Route` object `{ panel, workId, partKey, chunkIndex, segId, q }`. On `hashchange`, the router calls `switchPanel()` and/or `selectWork()` as needed.

### Hash update flow

```
User clicks tree leaf
  → selectWork(workId, partKey, chunk)
    → loadChunk() + renderSegments()
    → updateHash()
      → location.hash = "#/{panel}/{workId}/{partKey}/{chunk}"
        → hashchange fires
          → wireRouting handler sees same state → no-op
```

---

## 4. State Management

All state lives in `state.ts` (a flat module-level singleton):

```typescript
export const settings: Settings  // mutated by updateSettings()
export function getHistory(): HistoryEntry[]
export function pushHistory(entry): void
export function getBookmarks(): BookmarkEntry[]
export function toggleBookmark(entry): boolean
export function isBookmarked(workId, partKey, segId): boolean
```

Three versioned localStorage keys:

| Key | Type | Limit |
|---|---|---|
| `atp.settings.v1` | `Settings` | single object |
| `atp.history.v1` | `HistoryEntry[]` | 50 entries, FIFO dedup |
| `atp.bookmarks.v1` | `BookmarkEntry[]` | unbounded |

Default settings: `{ translationLang: "en", uiLang: "en", fontSize: 17, showPali: true, showTranslation: true }`

---

## 5. Data Loading Strategy

| Resource | When loaded | Cache |
|---|---|---|
| `data/manifest.json` | App init (fatal if fails) | `AppState.manifest` |
| `data/works/{id}/{file}` | On `selectWork()` | `Map<string, Segment[]>` in `reader.ts` |
| `data/search/manifest.json` | On search panel init | module-level `shardManifest` |
| `data/search/shard_{ch}.json` | On first query with that char | `Map<string, SearchShard>` in `search.ts` |
| `data/dictionary/pali_core.json` | On first dict input | `coreData[]` in `dictionary.ts` |
| `data/dictionary/common_pali.json` | Same load promise | `dictData[]` in `dictionary.ts` |

All data caches are in-memory and live for the browser session.

---

## 6. Build Pipeline

```
src/*.ts  →[tsc]→  js/*.js  →[version_js.py]→  js/*.js?v={hash}
                              (rewrites imports + index.html script tag)
```

`version_js.py` computes MD5 over all `js/*.js` files, takes first 8 hex chars, and injects `?v={hash}` into every ES module import and the `<script>` in `index.html`. This forces cache invalidation after each build.

**Why not in TypeScript source:** TypeScript resolves imports as file paths; adding `?v=…` in `.ts` files would break `tsc`. The hash is applied post-compile only.

---

## 7. Service Worker / PWA

`service-worker.js` implements a cache-first strategy:

1. On `install`: caches the **app shell** (HTML, CSS, fonts, JS files, manifest, dictionary).
2. After 10 s delay: **pre-caches all corpus chunks** (~140 MB, batch of 3 files) for full offline reading.
3. On `fetch`: tries cache first; falls back to network; caches new successful responses.

Cache name is versioned (`abhidhamma-cache-v8`). Old caches are deleted on `activate`.

---

## 8. TypeScript Configuration

`tsconfig.json` key settings:
- `target: ES2022`
- `module: ES2022` (native ESM)
- `strict: true`
- `outDir: js/`
- `rootDir: src/`
- No bundler — raw `tsc` only

---

## 9. Internationalization Architecture

`i18n.ts` exports one function:

```typescript
export function t(key: string, uiLang: UiLang): string
```

All strings are static compile-time constants in a `STRINGS: Record<UiLang, Strings>` object. Fallback chain: `STRINGS[uiLang][key]` → `STRINGS.en[key]` → key.

`uiLang` (interface language) and `translationLang` (content language) are stored separately but currently kept in sync by `applySettingsToUI()`.

---

## 10. Bilingual "Comentarios" Works

Works in group `"comentarios"` (contemporary commentaries) use a different data layout:
- `pali` field stores **English original text** (not Pāli)
- `pt` field stores **Portuguese translation**

When such a work is selected:
- `showPali` is forced `true` (so the English "original" column is visible)
- `effectiveLang: "pt"` is passed to `renderSegments`, overriding `translationLang`
- Settings labels change to "Show English (original)" / "Show Portuguese"
