# 03 — Frontend TypeScript Modules

All source files live in `src/`. All compiled outputs live in `js/` with `?v={hash}` stamps on imports. Source maps are emitted alongside each `.js` file.

---

## `types.ts` — Type Definitions

**Purpose:** Central type registry. Compiled to an empty shim (`types.js` is 44 bytes); all type information is erased at runtime.

**Key interfaces:**

| Interface | Description |
|---|---|
| `Segment` | Single corpus paragraph (see corpus doc §1) |
| `WorkEntry` / `WorkPart` / `Manifest` | Navigation tree types |
| `Settings` | User preferences persisted to localStorage |
| `HistoryEntry` / `BookmarkEntry` | Sidebar list items |
| `DictEntry` / `CommonDictData` | `common_pali.json` types |
| `CoreDictEntry` / `CoreDictData` / `DictSense` / `DictRootInfo` | `pali_core.json` types |
| `SearchHit` / `SearchShard` / `SearchManifest` | Search index types |
| `TranslationLang` | `"en" \| "pt" \| "es"` |
| `UiLang` | `"pt" \| "en" \| "es"` |

---

## `logger.ts` — Leveled Console Logger

**Purpose:** Prefixed console logging with level control.

**API:**
```typescript
createLogger(name: string): { info, warn, error, debug }
```

Each method prefixes output with `[name]`. In current implementation, all levels pass through to `console.*`. Used by every other module.

---

## `i18n.ts` — UI String Localization

**Purpose:** Translates UI string keys into PT / EN / ES.

**API:**
```typescript
t(key: string, uiLang: UiLang): string
```

Fallback chain: `STRINGS[uiLang][key]` → `STRINGS.pt[key]` → key.

**Coverage:** 57 string keys × 3 languages = 171 strings. Covers navigation labels, settings labels, export controls, dictionary field names, error messages, welcome screen. All strings are static (no interpolation).

**Note:** The `en` export label for Spanish is `"Spanish only"` (not `"Solo inglés"`) — this is a known UI inconsistency. See [07_open_issues.md](07_open_issues.md) issue #OI-004.

---

## `state.ts` — Persistent Settings & Lists

**Purpose:** All localStorage read/write. No DOM interaction.

**Exports:**
```typescript
settings: Settings                          // live mutable object
updateSettings(patch: Partial<Settings>): void
getHistory(): HistoryEntry[]
pushHistory(entry: Omit<HistoryEntry, "ts">): void
getBookmarks(): BookmarkEntry[]
toggleBookmark(entry: Omit<BookmarkEntry, "ts">): boolean  // returns new active state
isBookmarked(workId, partKey, segId): boolean
```

**Design decisions:**
- `settings` is a module-level mutable object loaded once at import time. All modules import it directly. Mutations via `updateSettings()` call `Object.assign(settings, patch)`, so all modules see the change without re-importing.
- History deduplicates by `(workId, partKey, chunk)` before unshifting; capped at 50.
- Bookmarks deduplicate by `(workId, partKey, segId)`. Toggle: if already bookmarked → remove and return `false`; else → add and return `true`.

---

## `tree.ts` — Navigation Tree

**Purpose:** Renders the Tipiṭaka navigation tree from the manifest; marks the active leaf on navigation.

**Exports:**
```typescript
renderTree(manifest, container, onSelect: SelectHandler): void
markActiveLeaf(container, workId, partKey): void
```

**Behavior:**
- Groups rendered in order: `abhidhamma → outros → visuddhimagga → comentarios`
- Each work node has a `▸` caret that toggles visibility of its parts list
- Clicking a part leaf calls `onSelect(workId, partKey, 0, null)` (always chunk 0)
- `markActiveLeaf` walks up the DOM to open all ancestor `<ul>` elements so the active item is always visible when navigating via URL hash

**DOM structure:**
```html
<ul>
  <li>
    <div class="group-title">Abhidhamma Piṭaka</div>
    <ul>
      <li>
        <div class="node-label">▸ Dhammasaṅgaṇī</div>
        <ul style="display:none">
          <li><div class="node-label leaf" data-work-id="..." data-part-key="...">Mūla</div></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

---

## `reader.ts` — Segment Rendering

**Purpose:** Fetches chunk files and renders segment arrays into the `#content` DOM element.

**Exports:**
```typescript
loadChunk(workId, partKey, fileName): Promise<Segment[]>
renderSegments(segments, container, options): void
```

**`loadChunk`:**
- Builds cache key `{workId}/{partKey}/{fileName}`
- Returns cached result if available
- Otherwise `fetch("data/works/{workId}/{fileName}")` and caches

**`renderSegments`:**

For each segment, creates:
```html
<div class="seg" data-rend="{rend}" data-seg-id="{id}">
  <div class="pali-line">
    <span class="paranum-badge">{paranum}</span>  <!-- if paranum -->
    <span><!-- innerHTML = seg.pali --></span>
    <button class="bookmark-toggle">☆/★</button>
  </div>
  <div class="translation-line">{translText}</div>  <!-- textContent, not innerHTML -->
</div>
```

**Critical:** `paliText.innerHTML = seg.pali` — raw HTML from the corpus is deliberately rendered via `innerHTML`. The `translation-line` uses `.textContent` because translation fields are plain text.

Segments with no translation text have `.translation-line { display: none }`.

**Options:**
```typescript
interface RenderSegmentsOptions {
  onNoteHover?: (evt: MouseEvent | null, text?: string) => void;
  onBookmarkToggle?: (seg: Segment) => boolean;
  isBookmarked?: (segId: number) => boolean;
  effectiveLang?: TranslationLang;  // overrides settings.translationLang
}
```

---

## `dictionary.ts` — Pāli Dictionary Panel

**Purpose:** Search interface for Pāli dictionary. Renders both `pali_core.json` (rich multi-sense) and `common_pali.json` (simple) entries.

**Key internal state:**
```typescript
let dictData: DictEntry[] = [];       // common + optional dpd entries
let coreData: CoreDictEntry[] = [];   // pali_core entries
let rootInfo: Record<string, DictRootInfo> = {};
let loadPromise: Promise<void> | null = null;  // singleton guard
```

**Loading order:**
1. `pali_core.json` → populates `coreData` and `rootInfo`
2. `common_pali.json` → filtered to exclude headwords already in `coreData` → appended to `dictData`
3. `dpd.json` (optional, absent in current build) → appended to `dictData`

**Search:** prefix match on headword (`.startsWith(query)`), sorted by `freq` descending.

**Rendering:** Core entries (`dict-entry-core`) show frequency badge, multi-sense list with grammar/root/syn/ant per sense, and usage note. Simple entries (`dict-entry`) show headword, single meaning, optional root/synonyms/usage.

**Root display:** If `sense.root` exists and `rootInfo[sense.root]` is found, displays `"root — translation (skt. Sanskrit — meaning)"` formatted string.

---

## `search.ts` — Full-Text Search Panel

**Purpose:** Sharded inverted-index search across all corpus segments (Pāli + EN + PT + ES).

**Key internal state:**
```typescript
let shardManifest: SearchManifest | null = null;
const shardCache = new Map<string, SearchShard | null>();
```

**Algorithm:**
1. Normalize query to lowercase
2. Determine shard key: first char if `[a-z]`, else `"misc"`
3. Load shard from `data/search/shard_{key}.json` (cached)
4. Exact match: `shard.postings[token]` → set of segment indices
5. Prefix expansion: iterate `shard.postings` for tokens starting with query, union indices (stops at `MAX_RESULTS = 50`)
6. Map indices → `SearchHit` objects from `shard.segments`

Clicking a result calls `onOpenResult(hit)` which triggers `selectWork(hit.workId, hit.partKey, hit.chunk, hit.segId)`. The reader then scrolls to the matching segment and applies a `seg-flash` animation.

**Debounce:** 250ms on input events.

---

## `export.ts` — PDF / EPUB Export

Fully documented in [06_export_module.md](06_export_module.md). Summary:

- `initExportPanel(manifest, container, getCurrentWorkId)` — builds the export UI
- `buildPrintHtml(segs, title, langMode)` → print-ready HTML string
- `buildEpub(segs, title, langMode)` → ZIP bytes (`Uint8Array`)
- `openPrintWindow(html, title)` — opens blob URL in new tab; fallback downloads HTML file
- `fieldHtml(raw)` — safely converts inline-HTML segment fields to clean export HTML
- `segToHtml(seg, langMode)` — maps one segment to one HTML block

---

## `app.ts` — Application Bootstrap

**Purpose:** Wires everything together. Entry point loaded by `index.html`.

**AppState (module-level):**
```typescript
interface AppState {
  manifest: Manifest | null;
  work: WorkEntry | null;
  partKey: string | null;
  chunkIndex: number;
  segments: Segment[];
}
```

**`init()` sequence:**
1. Fetch `data/manifest.json`
2. `applySettingsToUI()` — sync settings to form elements
3. `applyStaticI18n()` — translate `data-i18n` attributes
4. `renderTree()` — populate navigation tree
5. `renderBreadcrumb()`, `renderHistory()`, `renderBookmarks()`
6. `wireIconRail()`, `wireSettingsPanel()`, `wireChunkNav()`, `wireRouting()`
7. `initDictionaryPanel()`, `initSearchPanel()`, `initExportPanel()`
8. Parse URL hash → `selectWork()` or show welcome screen

**`selectWork(workId, partKey, chunkIndex, segId?)`:**
- Validates work and part exist in manifest
- Forces `showPali: true` for bilingual works
- Shows loading placeholder
- Calls `loadChunk()` → `rerenderContent()`
- If `segId` provided: scrolls to segment, adds `seg-flash` class for 1600ms
- Pushes to history, updates URL hash

**Settings panel events:** Each control calls `updateSettings()` + re-renders affected content. UI language change calls `refreshLocalizedUI()` which re-renders the entire tree and all i18n'd labels.
