# Development Guide

## Prerequisites

- Node.js ≥ 18 (for test runner and npm)
- Python 3 (for build scripts)
- A modern browser (Chrome/Firefox/Safari) for manual testing

## Install

```bash
npm install
```

Dev dependencies: TypeScript 5.6, Vitest 4, jsdom, @vitest/coverage-v8.
Runtime dependency: @mlc-ai/web-llm (loaded lazily via dynamic import).

---

## Scripts

| Command | Description |
|---|---|
| `npm test` | Run unit tests + generate coverage report (see `coverage/`) |
| `npm run build` | Compile TypeScript (`tsc`) then stamp version hash |
| `npm run watch` | `tsc --watch` for incremental compilation |
| `npm run deploy` | Run `scripts/preparar_deploy.py` |
| `npm run integrate-books` | Run `scripts/integrate_books.py` — ingests source books into data/ |
| `npm run rebuild-search` | Run `scripts/build_search_index.py` — rebuilds search shards |

---

## Build Steps Detail

### 1. TypeScript compile

```bash
npx tsc
```

Reads `tsconfig.json`. Compiles `src/**/*.ts` → `js/**/*.js`. No bundling.

### 2. Version stamp

```bash
python3 scripts/version_js.py
```

1. Reads all `js/*.js` files.
2. Computes MD5 hash; takes first 8 hex chars.
3. Rewrites all `from "./X.js"` imports to `from "./X.js?v={hash}"` in every JS file.
4. Updates `<script src="js/app.js?v={hash}">` in `index.html`.
5. Updates `<link rel="stylesheet" href="css/style.css?v={hash}">` in `index.html`.

---

## Tests

Tests live in `tests/unit/`. Run with Vitest (jsdom environment).

Test setup: `tests/setup/setup.ts` initializes the DOM from `tests/setup/dom.html` before each test.

### Test files

| File | What it tests |
|---|---|
| `app.test.ts` | Routing (parseHash), breadcrumb, panel switching |
| `ontology.test.ts` | Citta, cetasika, sampayoga data integrity |
| `formal_logic.test.ts` | KathāvatthuRule enum, evaluateCustomClaim branches |
| `srs.test.ts` | SM-2 algorithm (sm2 function) |
| `selection.test.ts` | normalizePali inflection rules |
| `state.test.ts` | settings load/save, history dedup, bookmark toggle |
| `tools.test.ts` | Tool module registration and tab switching |
| `export.test.ts` | segToHtml, buildGlossaryHtml, buildZip/CRC32 |
| `ui-export.test.ts` | initExportPanel rendering |
| `ai-feature.test.ts` | CanonicalScenarios, evaluateScenario |

### Coverage

HTML coverage report is generated at `coverage/index.html`.

---

## Adding New Content

### New work

1. Create `data/works/{workId}/` directory.
2. Add chunk JSON files (`chunk_001.json`, ...) as `Segment[]`.
3. Add the work to `data/manifest.json` under the appropriate group.
4. Rebuild search index: `npm run rebuild-search`.

### New i18n string

1. Add key-value pair in all three language blocks in `src/i18n.ts`.
2. Add `data-i18n="{key}"` attribute to the HTML element.
3. `applyStaticI18n()` will pick it up on next render.

### New tool tab

1. Create `src/tools/myTool.ts`.
2. At the end of the file, call `registerToolModule("myTool", initMyTool)`.
3. Import the module in `src/app.ts`: `import "./tools/myTool.js"`.
4. Add the tab definition in `TABS` array in `src/tools/tools.ts`.
5. Add i18n keys `toolMyTool` in `src/i18n.ts`.

---

## Python Helper Scripts

Located in `scripts/`:

| Script | Purpose |
|---|---|
| `version_js.py` | Post-compile cache-busting hash |
| `preparar_deploy.py` | Deploy preparation |
| `integrate_books.py` | Ingest source books into data/ |
| `build_search_index.py` | Build sharded search index from corpus |

Root-level fix_*.py files are one-off patch scripts used during development; not part of the build pipeline.

---

## Debugging

`logger.ts` exports `createLogger(name)` which returns a logger with `.info()`, `.warn()`, `.error()` methods. All log to `console` with the module name prefixed: `[app] ...`, `[reader] ...`, etc.

To enable verbose logs, open DevTools → Console.

---

## Deployment

The site deploys as a static directory. `.nojekyll` is present to prevent GitHub Pages from treating it as a Jekyll site. All compiled `js/` files and `data/` are committed to the repo.

Service worker cache version (`CACHE_NAME`) must be bumped manually whenever cached assets change significantly.

---

## Code Style

- TypeScript strict mode (`strict: true`)
- No bundler — raw ES modules
- No external UI framework — vanilla DOM APIs only
- DOM creation via `document.createElement` (not innerHTML except for known-safe template content)
- Inline styles used in some places (legacy; prefer CSS classes)
