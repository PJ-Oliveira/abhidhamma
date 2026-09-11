# 07 — Open Issues Registry

**Format:** ID · Severity · Component · Description · Impact · Next action

Severity: **CRITICAL** (data integrity or complete feature failure) · **HIGH** (user-facing bug, significant) · **MEDIUM** (degraded experience) · **LOW** (minor/cosmetic)

---

## Active Issues

---

### OI-003 · MEDIUM · Export · PDF via sandboxed iframes always triggers file download

**Nature:** The sandboxed iframes blocks all popups unconditionally. `openPrintWindow()` detects the blocked popup and falls back to downloading the HTML file. The user must open the file manually and press Cmd+P / Ctrl+P.

**Impact:** PDF export works correctly in a real browser (Chrome, Firefox, Safari). In the sandboxed iframes, it requires an extra step.

**Root cause:** Browser pane sandbox policy; cannot be fixed in application code.

**Workaround:** Test PDF export in a real browser tab opened directly at `localhost:PORT`.

**Next action:** None required; document this limitation for users.

---

### OI-006 · MEDIUM · Dictionary · Stage 7 in progress — 69.0% coverage vs 82% target

**Nature:** `pali_core.json` currently covers 69.0% of corpus token occurrences (797 entries). The build target is 82%. The remaining ~13% requires additional entries in `build_core_dictionary.py`.

**Stage 7 progress (batches 3–5):**
- **RESOLVED:** `katatta`/`kaṭattā` disambiguation — dental form has only 2 occurrences vs 395 for retroflex; confirmed as orthographic variant, not a separate lemma
- **Added 78 new entries** in batches 3–5:
  - 10 Paṭṭhāna compound condition terms (atthipaccaya, kammapaccaya, adhipatipaccaya, etc.)
  - 16 Paṭṭhāna negation formulas (nahetu, nahetuṃ, nahetuyā, nakamme, navippayutte, etc.)
  - 13 high-frequency grammar/number words (tīṇi, tato, ceva, tayo, tasmā, cattāri, cattāro, etc.)
  - 3 technical Abhidhamma compounds (kaṭattārūpa, pahātabbahetuka, uppādakkhaṇa)
  - 9 rūpa terms (sukhindriya, dukkhindriya, āpo, tejo, vāyo, kalāpa, hadaya, etc.)
  - 7 Noble Eightfold Path factors (sammāsaṅkappa through sammāsamādhi)
  - 10 locative numerals, reflexive pronouns, and inflected forms (tīsu, dvīsu, catūsu, attano, etc.)
  - 10 discourse/commentary terms (āvuso, bhante, sādhu, yebhuyyena, etc.)

**Remaining gap:** ~244,303 token occurrences (13.0%). Reaching 82% requires ~600+ more entries with systematic DPD lookup table extraction — a multi-session effort.

**Impact:** Approximately 582,303 corpus token occurrences still have no dictionary entry.

**Next action:** Continue adding entries in subsequent sessions. Priority categories: remaining Paṭṭhāna negation formulas, high-frequency verbal inflections, and more technical compounds.

---

## Resolved Issues (Archive)

| ID | Date resolved | Issue | Resolution |
|---|---|---|---|
| OI-001 | 2026-08-23 | "psíquico" — 323 instances unaudited | Audited: all 323 translate `iddhi` (supernormal powers); "poderes psíquicos" is standard PT Buddhist terminology. No changes needed. |
| OI-002 | 2026-08-23 | "estado" as dhamma translation — partial audit | Audited: 3 remaining instances translate `dhammabhāva`/`dhammamattattā` (dhamma-nature/dhamma-ness) — metalinguistic, not translating dhamma itself. Acceptable. |
| OI-004 | 2026-08-23 | No PT-only export option | Added `"pt"` and `"pali+pt"` to `LangMode` type, `langOptions`, and `segToHtml`; added `exportLangPt`/`exportLangPaliPt` i18n keys for all 3 UI languages. |
| OI-005 | 2026-08-23 | `rend="book"/"title"/"nikaya"` not mapped in `segToHtml` | Added h1/h4/p mappings for `book`, `title`, `nikaya`, `subsubhead`, `centre`, `glossary` in `segToHtml()`; added CSS rules to `PRINT_CSS` and `EPUB_CSS`. |
| OI-007 | 2026-08-23 | Search capped at 30 postings per token | Raised `MAX_POSTINGS_PER_TOKEN` from 30 to 50 in `build_search_index.py`; rebuilt search index. |
| OI-008 | 2026-08-23 | `<x_bin_42>` anomalous tag | Located in `vibhanga/tika__0.json` seg 687 (`en` field). Restored corrupt `yogo<x_bin_42>o` to `yogova` (matching parallel clause `payogova`). |
| OI-009 | 2026-08-23 | Export panel labels stale after UI language change | Removed `const uiLang` capture; all calls now read `settings.uiLang` dynamically. Added panel re-init in `refreshLocalizedUI()` in `app.ts`. |
| OI-010 | 2026-08-23 | `dpd.json` dead code in `dictionary.ts` | Removed the dead `try/catch` block (lines 42–47); no functional impact. |
| OI-011 | 2026-08-23 | Paṭṭhāna attha range check | Audited source DB: `abh03a_att` has max ID 2421 (2422 total rows); extraction already uses all rows 1766–2421. Commentary is short at the source level — no additional data exists. |
| — | 2026-08 | `about:` URL blocked in browser pane during PDF export | Changed to `URL.createObjectURL(blob)` for popup URL |
| — | 2026-08 | Chrome not loading updated `export.js` (ES module cache) | Created `scripts/version_js.py` to stamp `?v={hash}` post-compile |
| — | 2026-08 | Raw HTML tags visible as literal text in PDF/EPUB output | Added `fieldHtml()`/`walkNode()` using `DOMParser` |
| — | 2026-08 | 22 "fenômeno" occurrences in `pali_core.json` | Corrected all 22; 1 intentional negative-instruction occurrence retained |
| — | 2026-08 | 5 "fenômeno" occurrences in `common_pali.json` | Corrected all 5 |
| — | 2026-08 | ~25,470 segment-level "fenômeno" occurrences in PT translations | Bulk-corrected across all 12 works |
| — | 2026-08 | Corrupt segment `yamaka/mula__9.json` seg 174 (`fenômenosamp;`) | Fixed to correct PT text |
| — | 2026-08 | Search index stale after corpus corrections | Rebuilt from scratch via `build_search_index.py` |

### OI-004 · RESOLVED (HIGH) · Content/Philology · Residual Abhidhamma philosophy violations in Dictionary
**Nature:** The `pali_core.json` dictionary definitions still contain un-canonical terms like "fenômenos condicionados" (in the definition of *anattā*) and "karma" (in the definition of *cetanā*, e.g., "o cetasika gerador de karma"), violating the strict ontological guidelines. Various Spanish definitions also still contain "fenómeno".
**Impact:** Misaligns the dictionary definitions with the strict philosophy of the Abhidhamma (where *dhamma* = reality, *kamma* = kamma).
**Next action:** Perform a targeted search and replace inside `data/dictionary/*.json`.

### OI-005 · RESOLVED (MEDIUM) · Content/Philology · Regex gaps for "subconsciência" and English corpus
**Nature:** The script used to clean the corpus `data/works/` used strict regex (`\bsubconsciente\b`) and missed derived forms like `subconsciência` (PT), `subconsciencia` (ES), and `subconscientes`. Furthermore, the English translations still heavily use "karma", "dharma", and "subconsciousness".
**Impact:** Residual psychological and Sanskritized terminology remains in localized spots (e.g. *Abhidhamma in Daily Life*, *Abhidhammāvatāra ṭīkā*).
**Next action:** Write a broader regex script to audit `data/works/` targeting all morphological variations of `subconsci*`, and extend the philosophical audit to the `en` language string for "kamma" and "dhamma".

### OI-006 · RESOLVED (LOW) · UI/UX · Mobile responsiveness for analytical tools
**Nature:** The `patthana` matrix and `mindmap` tree can generate very wide DOM elements. While `overflow-x: auto` is partially implemented, complex grid layouts on small mobile screens might cut off labels or lack sticky headers, making correlation difficult.
**Impact:** Degraded user experience on mobile devices when using the advanced analytical tools.
**Next action:** Test the UI on mobile viewports and implement `position: sticky` for the first column/row in the Paṭṭhāna matrix.
