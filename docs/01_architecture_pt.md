# 01 — System Architecture

## 1. High-Level Design

```
Browser
│
├── index.html          ← single entry point; no server-side rendering
│     └── <script type="module" src="js/app.js?v={hash}">
│
├── css/style.css       ← single stylesheet, CSS custom properties + Grid
│
├── js/                 ← compiled ES2022 modules (TypeScript → tsc → version_js.py)
│     ├── app.js        ← bootstrap, routing, settings wiring
│     ├── reader.js     ← segment rendering
│     ├── export.js     ← PDF / EPUB export
│     ├── search.js     ← sharded inverted-index search
│     ├── dictionary.js ← Pāli dictionary lookup
│     ├── tree.js       ← navigation tree
│     ├── state.js      ← localStorage persistence
│     ├── i18n.js       ← string literals (PT / EN / ES)
│     ├── logger.js     ← leveled console logger
│     └── types.js      ← empty shim (interfaces only, stripped by tsc)
│
└── data/
      ├── manifest.json            ← navigation tree (works → parts → chunk files)
      ├── works/{id}/*.json        ← content chunks (~900 segments each)
      ├── dictionary/
      │     ├── pali_core.json     ← 721 high-frequency Pāli lemmas (multi-sense)
      │     ├── common_pali.json   ← 182 general Pāli entries (single-sense)
      │     └── vocabulary_blocks.md ← reference glossary (10 terminology blocks)
      └── search/
            ├── manifest.json      ← shard key → filename map
            └── shard_{key}.json   ← 50 shards keyed by token initial
```

## 2. Module Dependency Graph

```
app.ts
 ├── i18n.ts
 ├── state.ts
 │     └── logger.ts
 ├── tree.ts
 │     ├── i18n.ts
 │     └── state.ts
 ├── reader.ts
 │     ├── state.ts
 │     ├── logger.ts
 │     ├── i18n.ts
 │     └── types.ts
 ├── dictionary.ts
 │     ├── i18n.ts
 │     ├── state.ts
 │     └── logger.ts
 ├── search.ts
 │     ├── i18n.ts
 │     ├── state.ts
 │     └── logger.ts
 └── export.ts
       ├── i18n.ts
       ├── state.ts
       └── logger.ts
```

No circular dependencies. `logger.ts` and `types.ts` are leaves.

## 3. Layout

```
┌───────────┬─────────────────────┬──────────────────────────────┐
│  #icon-   │    #side-panel      │   main#reader                │
│  rail     │  (panel-w: 240–320) │   (flex-grow: 1)             │
│  (rail-w: │                     │                              │
│  56–76px) │  One of:            │  #reader-header              │
│           │  • panel-tipitaka   │    #breadcrumb               │
│           │  • panel-dictionary │    #part-tabs                │
│           │  • panel-history    │                              │
│           │  • panel-search     │  #content                    │
│           │  • panel-settings   │    .seg × N                  │
│           │  • panel-export     │      .pali-line              │
│           │                     │      .translation-line       │
│           │                     │                              │
│           │                     │  #toc-nav (prev/indicator/next)│
└───────────┴─────────────────────┴──────────────────────────────┘
```

CSS Grid: `grid-template-columns: var(--rail-w) var(--panel-w) 1fr`

Responsive breakpoint at `max-width: 860px`: panel becomes `position:fixed` overlay; rail labels hidden.

## 4. URL Routing

Hash-based: `#/{workId}/{partKey}/{chunkIndex}`

Examples:
- `#/dhammasangani/mula/0`
- `#/patthana/attha/3`

On `hashchange`, `parseHash()` extracts the triple and calls `selectWork()`. On page load, if a hash is present, the matching chunk is loaded immediately; otherwise the welcome screen is shown.

## 5. State Persistence

Three `localStorage` keys (versioned to allow future migration):

| Key | Type | Limit |
|---|---|---|
| `atp.settings.v1` | `Settings` | Always 1 object |
| `atp.history.v1` | `HistoryEntry[]` | 50 entries (FIFO dedup by workId/partKey/chunk) |
| `atp.bookmarks.v1` | `BookmarkEntry[]` | Unbounded |

Settings default: `{ translationLang: "pt", uiLang: "pt", fontSize: 17, showPali: true, showTranslation: true }`

## 6. Data Loading Strategy

### Manifest
Fetched once at `init()` time from `data/manifest.json`. Failure is fatal (content cannot be navigated).

### Chunks
Fetched on demand via `loadChunk(workId, partKey, fileName)`. Results are held in a `Map<string, Segment[]>` in-memory cache (no TTL; cache lives for the browser session). Size of largest work (Paṭṭhāna mūla) is ~27,746 segments split into 31 chunk files.

### Search index
Shards are fetched lazily — only the shard matching the first character of the query. `shardManifest` is loaded once on panel init; individual shards are cached in `shardCache: Map<string, SearchShard | null>`.

### Dictionary
Loaded once on first input event: `pali_core.json` → `common_pali.json` → `dpd.json` (optional, not present in current build). A single `loadPromise` prevents double-fetching.

## 7. Versioning / Cache Busting

ES modules are cached by the browser at absolute URL level. To force cache invalidation after a build:

1. `tsc` compiles `src/*.ts` → `js/*.js`
2. `scripts/version_js.py` computes an MD5 of all `js/*.js` files, takes the first 8 hex chars, and:
   - Rewrites every `from "./X.js"` import in all `js/*.js` files to `from "./X.js?v={hash}"`
   - Rewrites the `<script>` tag in `index.html` to `src="js/app.js?v={hash}"`

Current hash: `5df634f9` (set 2026-08-23).

**Why post-compile only:** TypeScript's module resolver treats import paths literally. Adding `?v=...` in `.ts` files would cause `tsc` to look for a file named `export.js?v=...`, which does not exist. The version stamp is therefore applied only to compiled `.js` output.

## 8. Segment Rendering (inline HTML handling)

The raw corpus data in the `pali` field contains real inline HTML inherited from the source SQLite databases:

| Tag | Frequency | Semantic |
|---|---|---|
| `<b>` | 57,283 | Bold headwords |
| `<p rend="gathalast">` | varies | Second hemistich of verse dístico |
| `<p rend="gatha1/2/3">` | varies | Verse strophes |
| `<sup class="var-note">` | 873 | Variant readings footnote marker |
| `<x_bin_42>` | 1 | Anomalous tag (harmless) |

**In the reader (`reader.ts`):** `paliText.innerHTML = seg.pali` — the browser parses and renders the inline HTML natively. Translation lines use `.textContent` (plain text only).

**In export (`export.ts`):** `fieldHtml(raw)` uses `DOMParser` to parse inline HTML and re-serialize as clean export markup via `walkNode()`. See [06_export_module.md](06_export_module.md) for full details.

## 9. Internationalization

`i18n.ts` exports a single `t(key, uiLang)` function. All UI strings are static — defined in a `STRINGS` record keyed by `UiLang` (`"pt" | "en" | "es"`). Fallback chain: `STRINGS[uiLang][key]` → `STRINGS.pt[key]` → key itself.

Translation language (`translationLang`) is separate from UI language (`uiLang`): the user can read the content in Portuguese while the interface labels are in English.

## 10. Bilingual Works (Contemporary Commentaries)

Works in the `"comentarios"` group (currently: Abhidhamma in Daily Life) store English text in the `pali` field and Portuguese in the `pt` field. When such a work is opened:

- `showPali` is forced `true` so the "Pāli" (actually English original) column is visible.
- `effectiveLang: "pt"` is passed to `renderSegments`, so the translation line shows Portuguese.
- Settings panel labels change from "Mostrar Pāli" → "Mostrar inglês (original)".
