# Features

## 1. Text Reader

The reader (`reader.ts`) loads and displays aligned Pāli + translation segments.

**Loading flow:**
1. `selectWork(workId, partKey, chunkIndex)` is called.
2. `loadChunk(workId, partKey, fileName)` fetches the chunk JSON; result cached in-memory.
3. `renderSegments(segments, container, options)` clears the DOM and rebuilds it.
4. If a `segId` was requested (from a bookmark or search result), the target segment is scrolled into view and flashed.

**Rendering:** each segment produces a `.seg` div with `.pali-line` (using `innerHTML` for inline HTML) and `.translation-line`. Bookmark buttons and variant-reading footnote hover events are wired per-segment.

---

## 2. Navigation Tree

`tree.ts` renders a collapsible UL tree from the manifest. Groups show as uppercase headings; works expand to show parts; clicking a part leaf calls `selectWork(workId, partKey, 0)`.

`markActiveLeaf()` adds `.leaf-active` to the currently displayed part and opens its parent nodes.

---

## 3. Pāli Dictionary

`dictionary.ts` provides `lookupPali(word)` and the dictionary panel UI.

**Panel behaviour:**
- Starts loading on first `input` event (single shared promise).
- As user types, all headwords starting with the query are shown.
- Results are sorted by frequency (most common first).
- Displays: headword, frequency, part of speech, all senses with grammar/root/synonyms/antonyms.
- URL is kept in sync: `#/dictionary?q={query}`.

**Lookup in popover:** when text is selected in the reader, `lookupPali` is called for up to 3 words; first hit is displayed inline in the selection popover.

---

## 4. Full-Text Search

`search.ts` implements a client-side sharded inverted-index.

- Debounced input (250 ms).
- Loads the shard manifest on panel init, then loads shards lazily per query.
- Returns up to 50 results as snippet cards; clicking a result opens that chunk and scrolls to the segment.

---

## 5. History & Bookmarks

**History** (`pushHistory`):
- Each `selectWork()` call adds an entry.
- Deduplication: existing entry for same `workId/partKey/chunk` is removed before prepend.
- Limit: 50 entries.
- Clicking a history entry reopens that exact chunk.

**Bookmarks** (`toggleBookmark`):
- ☆/★ bookmark button on each segment's Pāli line.
- Stores `{ workId, partKey, segId, chunk, snippet }`.
- Clicking a bookmark opens the chunk and scrolls to and flashes the segment.
- Unbounded storage (user manages manually).

---

## 6. Export

`export.ts` provides PDF and EPUB export for any work or the full corpus.

### Single Work PDF

`buildPrintHtml()` creates a full-page HTML with print CSS and a `window.print()` call. Opened in a new window. If pop-ups are blocked, the HTML file is downloaded.

### Single Work EPUB

`buildEpub()` creates a minimal EPUB 3 (ZIP) with:
- `mimetype` (uncompressed)
- `META-INF/container.xml`
- `OEBPS/content.opf` (OPF package)
- `OEBPS/toc.ncx` (NCX navigation)
- `OEBPS/style.css` (embedded Gentium font face + layout)
- `OEBPS/content.html` (all segments converted to HTML)

### Full Corpus EPUB

`buildFullCorpusEpub()` fetches all chunks for all works, builds per-work XHTML files, a hierarchical NCX and EPUB3 `nav.xhtml`, and a glossary appendix. Fonts are fetched and bundled. Progress messages are shown during build.

### Language Modes (`LangMode`)

| Value | Columns included |
|---|---|
| `en` | English only |
| `pali+en` | Pāli + English |
| `pali+en+pt` | Pāli + English + Portuguese |
| `pt` | Portuguese only |
| `pali+pt` | Pāli + Portuguese |
| `es` | Spanish only |
| `pali+es` | Pāli + Spanish |
| `pali+en+es` | Pāli + English + Spanish |

### Glossary

`collectUsedTerms()` finds Pāli headwords that appear in the exported segments and appends a sorted Pāli glossary as an appendix.

---

## 7. Spaced Repetition System (SRS)

`srs.ts` implements a flashcard system using the **SM-2 algorithm**.

**SM-2 update formula:**
```
if quality < 3: repetitions = 0; interval = 1
if quality >= 3:
  rep=0 → interval=1; rep=1 → interval=6; rep>1 → interval = round(interval × easeFactor)
  repetitions++

easeFactor = easeFactor + 0.1 − (5−quality) × (0.08 + (5−quality) × 0.02)
easeFactor = max(1.3, easeFactor)
nextReview = now + interval × 86,400,000 ms
```

**Card queue:** due cards (nextReview ≤ now) first, then new cards sorted by rank. Daily limit: 20 cards.

**Keyboard shortcuts** (when SRS panel is active):
- Space / Enter → flip card
- 1 → Again (quality 0)
- 2 → Hard (quality 3)
- 3 → Good (quality 4)
- 4 → Easy (quality 5)

**Persistence:** card states saved to `atp.srs.v1`; stats to `atp.srs.stats.v1` in localStorage.

---

## 8. Abhidhamma Tools

Tools panel (`tools/tools.ts`) is a tab manager that lazily initializes each sub-module on first activation.

### Mind Map (`tools/mindmap.ts`)

SVG-based hierarchical mind map of Abhidhamma concepts. Searchable by node text.

### Paṭṭhāna (`tools/patthana.ts`)

Interactive visualization of the 24 conditional relations (paccaya) from the Paṭṭhāna.

### Citta-Vīthi (`tools/vithi.ts`)

Animated visualization of the consciousness process (citta-vīthi). Shows the sequence of consciousness moments (bhavaṅga → manodvāravajjana → javana × 7 → tadārammaṇa) for different sense doors. Fetches `data/tools/vithi.json` and `data/tools/citta_cetasika.json`.

### Mātikās (`tools/matikas.ts`)

Searchable lists of the Dhammasaṅgaṇī matrix triads (tikas) and dyads (dukas).

### Cetasika (`tools/cetasika.ts`)

Two modes:
- **Single analysis:** select a citta → see all associated cetasikas.
- **Comparison:** select two cittas → see common cetasikas, exclusive to A, and exclusive to B.

---

## 9. Debate Simulator (AI Feature)

`ai-feature/ui.ts` + `ai-feature/debate-scenarios.ts` + `ontology/kathavatthu_logic.ts`

A rule-based (no LLM) debate simulator modeled on the Kathāvatthu debate format.

**Flow:**
1. User selects a scenario from `CanonicalScenarios` (hardcoded propositions from historical schools).
2. The claim text is shown.
3. User clicks "Submit Argument."
4. `evaluateScenario(scenarioId, uiLang)` returns a structured refutation with: verdict, logical context (vāda/aṭṭhakathā), meta-logic rule, reductio ad absurdum paradox, formal syllogism (anuloma → paṭikamma → niggaha → upanayana → niṭṭhāna), pedagogical analogy.
5. "Elaborate" button reveals the pedagogical breakdown.

The `@mlc-ai/web-llm` dependency is present but not yet wired to the debate simulator — all responses are computed deterministically from the ontology modules.
