# Final QA Report: V8 Unit Coverage, Multi-Viewport Responsiveness, Live UI Walkthrough, and Fixed Bugs Registry

> [!IMPORTANT]
> **Production Deployment Status (`dist/`):** ✅ **100% APPROVED & READY FOR PRODUCTION**
> - **Automated Test Suites:** `30 / 30` passed (`175 / 175` tests passing, zero console errors, zero uncaught exceptions).
> - **Live Interactive Browser Verification (`http://127.0.0.1:8765`):** Every feature exercised end-to-end in the live browser (Welcome Screen, Trilingual Switching EN/PT/ES, Canonical Tree + Contemporary Commentaries, Parallel Reader, Chapter Dropdown Navigation, Bookmarks, Interactive Pāli Word Lookup, Pāli Dictionary, Full-Text Search, History, Settings, PDF/EPUB Export, *Kathāvatthu* Logical Debate Modal, Vocabulary SRS, Abhidhamma Anki SRS in 30/60/90-day tracks, and all 3 Pillars of the Mnemonic Laboratory: N-ary Decoder across all 9 chapters and 3 rigor levels, Periodic Table of Mind Atlas/Alchemy, and Phalanx Abacus across all 5 maps and 3 modes) with **0 console errors**.
> - **Build & Packaging:** `npm run build` (`tsc && python3 scripts/version_js.py`) and `npm run deploy` (`python3 scripts/preparar_deploy.py`) completed cleanly with uniform cache-busting hash across all 21 compiled JS modules and [index.html](file:///Users/pauloo/Desktop/abhidhamma/index.html).
> - **Global V8 Coverage (`src/**/*.ts`):** **98.25% Lines** (`6,599 / 6,716`), **98.74% Functions** (`941 / 953`), **96.90% Statements** (`7,199 / 7,429`), **84.89% Branches** (`5,058 / 5,958`) — with **35 out of 41 modules at 100% Lines and 100% Functions**.

---

## 1. UI / Interface & Multi-Viewport Responsiveness Matrix (Real Headless Google Chrome via CDP)

The integration suite [responsiveness-ui.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/integration/responsiveness-ui.test.ts) boots a real local HTTP server and drives Headless Google Chrome via the Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride`), auditing **11 screen resolutions** and **13 interface states** at each resolution:

| Device / Viewport | Resolution (`W × H`) | Category | Views Audited (13 UI states per screen) | Horiz. Overflow (`docOv`/`bodyOv`) | Clipping / Overlap | Console Errors / Exceptions | Status |
| :--- | :---: | :---: | :--- | :---: | :---: | :---: | :---: |
| **Compact Phone (iPhone SE)** | `320 × 568` | Mobile | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Standard Android Phone** | `360 × 640` | Mobile | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Modern Phone (iPhone X/14)** | `375 × 812` | Mobile | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Landscape Phone** | `667 × 375` | Mobile | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Portrait Tablet (iPad Mini/Air)** | `768 × 1024` | Tablet | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Tablet / Drawer Breakpoint** | `860 × 1024` | Tablet | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Compact Laptop (HD)** | `1280 × 720` | Laptop | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Standard Laptop (WXGA)** | `1366 × 768` | Laptop | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Full HD Desktop (1080p)** | `1920 × 1080` | Desktop | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **QHD Monitor / 2K TV (1440p)** | `2560 × 1440` | 2K TV | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |
| **Large 4K UHD Smart TV** | `3840 × 2160` | 4K TV | Welcome, 6 Panels, Reader, Chapters, Debate, 3 SRS | `0 px` | `0` | `0` | ✅ PASS |

---

## 2. Per-Module V8 Unit Test Coverage (`vitest run --coverage`)

| TypeScript Module (`src/`) | % Statements | % Branch | % Functions | % Lines | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| [src/i18n.ts](file:///Users/pauloo/Desktop/abhidhamma/src/i18n.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/logger.ts](file:///Users/pauloo/Desktop/abhidhamma/src/logger.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/state.ts](file:///Users/pauloo/Desktop/abhidhamma/src/state.ts) | **100%** | 86.95% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/tree.ts](file:///Users/pauloo/Desktop/abhidhamma/src/tree.ts) | 98.50% | 90.47% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/reader.ts](file:///Users/pauloo/Desktop/abhidhamma/src/reader.ts) | 98.21% | 85.71% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/search.ts](file:///Users/pauloo/Desktop/abhidhamma/src/search.ts) | 95.65% | 81.48% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/graph.ts](file:///Users/pauloo/Desktop/abhidhamma/src/graph.ts) | 98.44% | 81.25% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/srs.ts](file:///Users/pauloo/Desktop/abhidhamma/src/srs.ts) | 98.79% | 90.51% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/dictionary.ts](file:///Users/pauloo/Desktop/abhidhamma/src/dictionary.ts) | 99.46% | 89.60% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/selection.ts](file:///Users/pauloo/Desktop/abhidhamma/src/selection.ts) | 98.06% | 83.16% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/export.ts](file:///Users/pauloo/Desktop/abhidhamma/src/export.ts) | 96.51% | 87.01% | 96.11% | **98.12%** | ✅ High Coverage |
| [src/app.ts](file:///Users/pauloo/Desktop/abhidhamma/src/app.ts) | 93.12% | 78.73% | **97.00%** | **96.04%** | ✅ High Coverage |
| [src/ai-feature/ai-worker.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ai-feature/ai-worker.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ai-feature/debate-scenarios.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ai-feature/debate-scenarios.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ai-feature/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ai-feature/ui.ts) | 98.90% | 68.75% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/ontology/cetasika.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/cetasika.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ontology/citta.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/citta.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ontology/commentary.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/commentary.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ontology/formal_logic.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/formal_logic.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ontology/kathavatthu.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/kathavatthu.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/ontology/kathavatthu_logic.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/kathavatthu_logic.ts) | 98.75% | 79.64% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/ontology/sampayoganaya.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/sampayoganaya.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/mnemonic-lab/data.ts](file:///Users/pauloo/Desktop/abhidhamma/src/mnemonic-lab/data.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/mnemonic-lab/engine.ts](file:///Users/pauloo/Desktop/abhidhamma/src/mnemonic-lab/engine.ts) | 98.64% | 87.75% | **100%** | **100%** | ✅ 100% Lines/Funcs |
| [src/mnemonic-lab/nary-chapters-data.ts](file:///Users/pauloo/Desktop/abhidhamma/src/mnemonic-lab/nary-chapters-data.ts) | **100%** | **100%** | **100%** | **100%** | ✅ 100% |
| [src/mnemonic-lab/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/mnemonic-lab/ui.ts) | 97.48% | 80.61% | **99.57%** | **98.10%** | ✅ High Coverage |
| `src/mnemonic-lab/chapters/*.ts` (12 files) | **100%** | **100%** | **100%** | **100%** | ✅ 100% across all 12 |
| [src/abhidhamma-srs/scheduler.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/scheduler.ts) | 99.03% | 90.86% | **100%** | **99.55%** | ✅ 100% Funcs |
| [src/abhidhamma-srs/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/ui.ts) | 93.80% | 83.29% | 95.34% | **96.36%** | ✅ High Coverage |
| [src/abhidhamma-srs/offline-store.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/offline-store.ts) | 92.07% | 90.52% | **100%** | **91.57%** | ✅ 100% Funcs |

---

## 3. Complete Registry of the 28 Bugs Found, Fixed, and Guarded by Preventive Regression Tests

Every bug listed below has been fixed in the source code/corpus and is guarded by automated regression tests in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts), [responsiveness-ui.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/integration/responsiveness-ui.test.ts), [corpus-integrity.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/corpus-integrity.test.ts), and dedicated unit test suites.

### Architecture, PWA, Build & Cache-Busting
1. **BUG #001 — `service-worker.js` missing Mnemonic Lab, Abhidhamma SRS, and Ontology modules in `CORE_ASSETS`**:
   - **Issue:** `CORE_ASSETS` in [service-worker.js](file:///Users/pauloo/Desktop/abhidhamma/service-worker.js) omitted compiled modules under `js/abhidhamma-srs/*`, `js/mnemonic-lab/*`, and `js/ontology/*`, causing offline failures when opening SRS or Debate after initial load.
   - **Fix:** Added all 42 transitive runtime JS modules and SRS datasets to `CORE_ASSETS` and bumped cache version to `abhidhamma-cache-v34`.
   - **Preventive Test:** `BUG #001 & #010: Service Worker CORE_ASSETS covers 100% of transitive runtime JS imports` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L12-L38) recursively walks the import graph of `js/app.js` and `js/ai-feature/ui.js`.
2. **BUG #010 — `cacheAllForOffline` in `src/app.ts` and `APP_OFFLINE_CACHE_NAME` out of sync with Service Worker**:
   - **Issue:** The offline cache button in [src/app.ts](file:///Users/pauloo/Desktop/abhidhamma/src/app.ts#L750-L815) and [src/abhidhamma-srs/offline-store.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/offline-store.ts) used an outdated cache name (`v33`) and omitted the new JS modules.
   - **Fix:** Unified `APP_OFFLINE_CACHE_NAME = "abhidhamma-cache-v34"` and synchronized the full asset list in `cacheAllForOffline`.
   - **Preventive Test:** Verified in [app-coverage.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/app-coverage.test.ts#L295-L305) and [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L12-L38).
3. **BUG #022 — `scripts/version_js.py` skipped `?v=` cache-busting on single-quoted imports, dynamic `import()`, and `export * from`**:
   - **Issue:** [scripts/version_js.py](file:///Users/pauloo/Desktop/abhidhamma/scripts/version_js.py) only matched double-quoted `from "./..."`, leaving `import('./ai-feature/ui.js')` and `export * from './formal_logic.js'` unversioned.
   - **Fix:** Expanded the regex in [scripts/version_js.py](file:///Users/pauloo/Desktop/abhidhamma/scripts/version_js.py) to match `import/export ... from`, dynamic `import('...')`, and both single and double quotes across all subdirectories of `js/`.
   - **Preventive Test:** `BUG #022: Compiled JS production bundle stamps uniform ?v=<hash>` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L166-L176).

### UI, Multi-Viewport Responsiveness & Internationalization (i18n)
4. **BUG #002 — `<html lang="en">` in `index.html` contained hardcoded Portuguese fallback strings**:
   - **Issue:** [index.html](file:///Users/pauloo/Desktop/abhidhamma/index.html) declared `lang="en"`, but contained hardcoded Portuguese labels (`Configurações`, `Laboratório Mnêmico`, `App Offline`, etc.) prior to JS hydration.
   - **Fix:** Aligned all default strings in [index.html](file:///Users/pauloo/Desktop/abhidhamma/index.html) to English and bound them via `data-i18n`, `data-i18n-title`, `data-i18n-placeholder`, and `data-i18n-aria-label`.
   - **Preventive Test:** `BUG #002: index.html (<html lang='en'>) has zero Portuguese fallback strings` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L40-L43).
5. **BUG #003 — `#interlocutor-container` remained visible on top of the SRS view on mobile screens (`<= 768px`)**:
   - **Issue:** Opening the Debate modal and then navigating to SRS on screens `<= 768px` hid only `#btn-toggle-interlocutor`, leaving `#interlocutor-container` covering the flashcards.
   - **Fix:** Added CSS rule `body:has(#reader-srs:not([style*="display: none"]):not([style*="display:none"])) #interlocutor-container { display: none !important; }` in [css/style.css](file:///Users/pauloo/Desktop/abhidhamma/css/style.css).
   - **Preventive Test:** `BUG #003 & #004` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L45-L51).
6. **BUG #004 — Insufficient bottom padding (`.panel`) in mobile drawer (`<= 600px`) underneath the floating Debate button**:
   - **Issue:** The floating `#btn-toggle-interlocutor` button (`bottom: 66px`) could overlap the last item of the tree or side list on screens `<= 600px`.
   - **Fix:** Set `.panel { padding: 12px 12px 56px; }` inside `@media (max-width: 600px)` in [css/style.css](file:///Users/pauloo/Desktop/abhidhamma/css/style.css#L878).
   - **Preventive Test:** `BUG #003 & #004` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L45-L51).
7. **BUG #005 — URL query synchronization (`?q=`) in search and dictionary checked obsolete `#tab-search.active` selector**:
   - **Issue:** [src/search.ts](file:///Users/pauloo/Desktop/abhidhamma/src/search.ts) and [src/dictionary.ts](file:///Users/pauloo/Desktop/abhidhamma/src/dictionary.ts) queried `#tab-search.active` / `#tab-dictionary.active` (legacy IDs), preventing `?q=` URL synchronization.
   - **Fix:** Updated to check `.rail-btn.active` with `activeBtn.dataset.panel === "search"` and `"dictionary"`.
   - **Preventive Test:** Verified in [search.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/search.test.ts) and [core-full-coverage.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/core-full-coverage.test.ts#L540-L565).
8. **BUG #006 — Hardcoded Portuguese strings and `aria-label` attributes in `src/app.ts`, `src/ai-feature/ui.ts`, `src/srs.ts`, and `src/selection.ts`**:
   - **Issue:** Bookmark buttons, chapter navigation, debate modal close controls, and selectors did not update `title`/`aria-label` when switching between PT, EN, and ES.
   - **Fix:** Added translation keys in [src/i18n.ts](file:///Users/pauloo/Desktop/abhidhamma/src/i18n.ts) and dynamic synchronization in `applyStaticI18n()` / `refreshLocalizedUI()`.
   - **Preventive Test:** Verified in [i18n.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/i18n.test.ts) and [app-coverage.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/app-coverage.test.ts).
9. **BUG #007 — Contemporary commentaries missing localized PT/ES chapter titles in chunks `1..N` of `manifest.json`**:
   - **Issue:** `scripts/patch_chunk_starts.py` only extracted translated chapter titles from the first chunk (`texto__0.json`), leaving chapters in subsequent chunks without `pt`/`es` titles in the chapter dropdown menu.
   - **Fix:** Fixed [scripts/patch_chunk_starts.py](file:///Users/pauloo/Desktop/abhidhamma/scripts/patch_chunk_starts.py) and regenerated [data/manifest.json](file:///Users/pauloo/Desktop/abhidhamma/data/manifest.json) with 100% localized PT and ES chapter titles.
   - **Preventive Test:** `BUG #007: Contemporary commentaries in manifest.json carry localized PT/ES chapter titles across all chunks` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L53-L65).
10. **BUG #008 — `src/graph.ts` had mixed-language labels and broken filter state**:
    - **Issue:** [src/graph.ts](file:///Users/pauloo/Desktop/abhidhamma/src/graph.ts) contained hardcoded labels without full PT/EN/ES localization.
    - **Fix:** Localized all filter, group, and tooltip labels in [src/graph.ts](file:///Users/pauloo/Desktop/abhidhamma/src/graph.ts) and [src/i18n.ts](file:///Users/pauloo/Desktop/abhidhamma/src/i18n.ts).
    - **Preventive Test:** Verified in [graph.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/graph.test.ts).
11. **BUG #009 — Viewport clamping for `#note-tooltip` and `.chapter-nav-list` on narrow screens**:
    - **Issue:** Variant note tooltips and the chapter dropdown list could overflow the right or bottom edge on 320px viewports.
    - **Fix:** Implemented horizontal and vertical viewport clamping in `handleNoteHover` and `clampChapterNavList` in [src/app.ts](file:///Users/pauloo/Desktop/abhidhamma/src/app.ts#L267-L297).
    - **Preventive Test:** Verified in [app-coverage.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/app-coverage.test.ts#L163-L195) and [responsiveness-ui.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/integration/responsiveness-ui.test.ts).
12. **BUG #011 & #015 — Mismatched review button name («Errei» vs «De novo») and mixed Spanish register (ustedeo/tuteo) in Abhidhamma SRS**:
    - **Issue:** The clinical grading hint in PT referred to `«Errei»` whereas the actual button is labeled `«De novo»`, and Spanish mixed `formule/escriba su` with `tu`.
    - **Fix:** Standardized to `«De novo»` in PT and consistent *tuteo* (`formula mentalmente o escribe tu respuesta`) in ES in [src/abhidhamma-srs/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/ui.ts).
    - **Preventive Test:** `BUG #011 & #015` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L67-L73).
13. **BUG #023 — Race condition when rapidly collapsing and re-expanding the side panel (`#panel-collapse`)**:
    - **Issue:** A rapid double-click on `#panel-collapse` triggered a 160ms `setTimeout` that set `--panel-w: 0px` even after the panel had already been re-opened.
    - **Fix:** Added a guard `if (sidePanel.classList.contains("collapsed"))` inside the `setTimeout` callback in [src/app.ts](file:///Users/pauloo/Desktop/abhidhamma/src/app.ts).
    - **Preventive Test:** Step 11 (`Rapid collapse -> expand race condition guard`) in [app.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/app.test.ts#L149-L158).
14. **BUG #024 — `.chapter-nav-list` overflowed viewport height in mobile landscape mode (`667×375`)**:
    - **Issue:** Static CSS `max-height: calc(100dvh - 120px)` exceeded available space below the header on short viewports (`375px` height), causing a `23px` bottom clip.
    - **Fix:** `clampChapterNavList` in [src/app.ts](file:///Users/pauloo/Desktop/abhidhamma/src/app.ts#L290-L296) dynamically computes `availH = Math.floor(vh - rect.top - bottomReserve)` and sets `list.style.maxHeight = "${availH}px"`.
    - **Preventive Test:** `BUG #024` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L178-L181) and verified on `phone-landscape-667x375` in [responsiveness-ui.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/integration/responsiveness-ui.test.ts).
15. **BUG #025 — Non-deterministic post-navigation wait in responsiveness test suite under parallel CPU load**:
    - **Issue:** `tests/integration/responsiveness-ui.test.ts` used a fixed `setTimeout(750)` after `Page.navigate`; when running alongside 29 V8-instrumented Vitest workers, `document.body` could still be `null`, throwing `TypeError: Cannot read properties of null (reading 'scrollWidth')`.
    - **Fix:** Replaced with a deterministic polling loop awaiting `document.readyState === 'complete' && document.body && document.documentElement && document.getElementById('app') && document.querySelector('.node-label.leaf')`, and expanded inspection to all 13 UI views.
    - **Preventive Test:** Validated in full parallel execution (`npm test`) in [responsiveness-ui.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/integration/responsiveness-ui.test.ts#L145-L234).
16. **BUG #026 — Worker handle retention from unclosed `BroadcastChannel` in `MnemonicLabUI` and `AbhidhammaSrsUI` + dead variable in `src/selection.ts`**:
    - **Issue:** Multiple instances of `MnemonicLabUI` and `AbhidhammaSrsUI` created `new BroadcastChannel(...)` without closing the previous static channel or calling `.unref?.()`, keeping Node.js/Vitest worker threads alive for ~60s after test completion; additionally, `currentHighlight` in [src/selection.ts](file:///Users/pauloo/Desktop/abhidhamma/src/selection.ts) was dead code never assigned.
    - **Fix:** Added static `activeVaultChannel` tracking with `.close()` on re-initialization and `.unref?.()` in [src/mnemonic-lab/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/mnemonic-lab/ui.ts#L898-L929) and [src/abhidhamma-srs/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/ui.ts#L650-L741), and removed `currentHighlight` from [src/selection.ts](file:///Users/pauloo/Desktop/abhidhamma/src/selection.ts).
    - **Preventive Test:** Verified in [mnemonic-lab.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/mnemonic-lab.test.ts) and [selection-and-core-gaps.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/selection-and-core-gaps.test.ts).
17. **BUG #027 — Long unbroken Pāli compound causing slight horizontal overflow in `.side-item` / `.side-item .snippet` inside `#search-results`**:
    - **Issue:** Detected during live browser interactive testing when searching `kusala` in `#search-input`: long agglutinated Pāli compounds in `.side-item .snippet` could exceed the sidebar card width due to missing word-wrap rules.
    - **Fix:** Added `overflow-wrap: anywhere; word-break: break-word;` to `.side-item`, `.side-item .meta`, and `.side-item .snippet` in [css/style.css](file:///Users/pauloo/Desktop/abhidhamma/css/style.css#L210-L223).
    - **Preventive Test:** `BUG #027` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L183-L187).
18. **BUG #028 — Duplicate percent sign (`75% %`) in House lock message (`houseLockedSuffix`) in Abhidhamma SRS**:
    - **Issue:** Detected during live browser interactive testing in the Abhidhamma SRS tab: `unlockReason` concatenated `${meta.houseUnlockAtomPct}% ${s.houseLockedSuffix}`, while `s.houseLockedSuffix` already started with `%` across all 3 languages (`"% de tijolos deste capítulo"`, `"% of this chapter's bricks"`, `"% de ladrillos de este capítulo"`), displaying `🔒 House requires 75% % of this chapter's bricks`.
    - **Fix:** Removed the redundant `% ` on line 1093 of [src/abhidhamma-srs/ui.ts](file:///Users/pauloo/Desktop/abhidhamma/src/abhidhamma-srs/ui.ts#L1093) (`${meta.houseUnlockAtomPct}${s.houseLockedSuffix}`).
    - **Preventive Test:** `BUG #028` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L189-L193).

### Doctrinal Fidelity, Ontology, Dictionaries & Corpus (21 Works)
19. **BUG #012 — Incorrect Sutta citation for the Chariot Analogy (`Ratha-vinīta` instead of `Vajirā Sutta, SN 5.10 / Milindapañha`)**:
    - **Issue:** [src/ontology/commentary.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/commentary.ts) and [src/ontology/kathavatthu_logic.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/kathavatthu_logic.ts) cited the *Ratha-vinīta Sutta* (MN 24, which deals with the 7 stages of purification / relay of seven chariots) for the chariot disassembly analogy regarding *puggala*.
    - **Fix:** Corrected to cite the *Vajirā Sutta* (SN 5.10) and *Milindapañha* across PT, EN, and ES.
    - **Preventive Test:** `BUG #012: Chariot Analogy cites Vajirā Sutta (SN 5.10) / Milindapañha` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L75-L84).
20. **BUG #013 — `DosaMula1` missing `Chanda` cetasika in `src/ontology/citta.ts`**:
    - **Issue:** In [src/ontology/citta.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ontology/citta.ts#L45), `DosaMula1` listed only 4 Pakiṇṇakas (16 cetasikas instead of the 17 base factors excluding *aniyata*), omitting `Chanda` (which is excluded only from the 18 Ahetukas and 2 Mohamūlas per AS II.20).
    - **Fix:** Added `"Chanda"` to `DosaMula1`'s Pakiṇṇakas (totaling 5 Pakiṇṇakas = all except *Pīti*).
    - **Preventive Test:** `BUG #013: DosaMula1 includes all 5 canonical Pakiṇṇaka cetasikas including Chanda (AS II.20)` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L86-L90).
21. **BUG #014 — Spanish false cognate for *Ṭhapanīyapañha* (`Premisa Incontestable`) in `debate-scenarios.ts`**:
    - **Issue:** In [src/ai-feature/debate-scenarios.ts](file:///Users/pauloo/Desktop/abhidhamma/src/ai-feature/debate-scenarios.ts), *Unanswerable Premise (Ṭhapanīyapañha)* was translated into Spanish as `Premisa Incontestable` (which in Spanish means "irrefutable/undeniable", the opposite of a question to be set aside).
    - **Fix:** Corrected to `Pregunta que debe dejarse de lado / Premisa Inaplicable (Ṭhapanīyapañha)`.
    - **Preventive Test:** `BUG #014` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L92-L96).
22. **BUG #016 & #017 — Machine-translation corruptions (`ivirodho`, `desconsultar`, `re-arising`, `upapatti = falecimento`) in `pali_core.json`**:
    - **Issue:** [data/dictionary/pali_core.json](file:///Users/pauloo/Desktop/abhidhamma/data/dictionary/pali_core.json) contained translation artifacts (`ivirodho`, `desconsultar`, `olha beautiful`, and `upapatti`/`upapāta` mistranslated as "death" instead of "rebirth/arising").
    - **Fix:** Sanitized all affected entries in [data/dictionary/pali_core.json](file:///Users/pauloo/Desktop/abhidhamma/data/dictionary/pali_core.json) and [data/dictionary/common_pali.json](file:///Users/pauloo/Desktop/abhidhamma/data/dictionary/common_pali.json).
    - **Preventive Test:** `BUG #016 & #017` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L98-L115).
23. **BUG #018 — English term `insight` leaking into PT/ES cards in `abhidhamma_cards.json` and `vocabulary.json`**:
    - **Issue:** Portuguese and Spanish flashcards contained the English word `insight` instead of `discernimento (vipassanā)` / `visión cabal (vipassanā)`.
    - **Fix:** Replaced across 100% of PT/ES cards in [data/srs/abhidhamma_cards.json](file:///Users/pauloo/Desktop/abhidhamma/data/srs/abhidhamma_cards.json) and [data/srs/vocabulary.json](file:///Users/pauloo/Desktop/abhidhamma/data/srs/vocabulary.json).
    - **Preventive Test:** `BUG #018` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L117-L135).
24. **BUG #019, #020 & #021 — Empty PT/ES segments, residual `<p .../>` XML tags, and English technical term leaks across the 21-work corpus**:
    - **Issue:** Self-closing XML tags `<p rend="..."/>` appeared in `pali`, some segments had empty `pt` or `es`, and untranslated English technical terms, psychologizations (`inconsciente` for *bhavaṅga*), and PT-PT infinitive constructions (`continua a...`) remained in the PT/ES corpus.
    - **Fix:** Sanitized all 93,252 segments across the 21 works in `data/works/**` and rebuilt all search shards in `data/search/**`.
    - **Preventive Test:** `BUG #019, #020 & #021` in [regressions.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/regressions.test.ts#L137-L164) and [corpus-integrity.test.ts](file:///Users/pauloo/Desktop/abhidhamma/tests/unit/corpus-integrity.test.ts).
