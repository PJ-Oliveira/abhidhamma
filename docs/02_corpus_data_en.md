# 02 — Corpus Data

## 1. Segment Schema

Every segment is a JSON object conforming to:

```typescript
interface Segment {
  id:       number;        // primary key from source SQLite; globally unique per work/part
  rend:     string;        // rendering hint (see §3)
  paranum:  string | null; // paragraph number badge (e.g. "§ 1", "1.")
  pali:     string;        // Pāli text — MAY contain inline HTML (see §4)
  en:       string;        // English translation (plain text)
  pt:       string;        // Portuguese translation (plain text)
  es:       string;        // Spanish translation (plain text)
  notes?:   string[];      // footnote texts, indexed by <sup data-note="N">
}
```

Translation fields (`en`, `pt`, `es`) are always plain text. The `pali` field alone may contain inline HTML.

## 2. Manifest Format

`data/manifest.json` is the single navigation tree loaded at startup:

```json
{
  "groups": {
    "abhidhamma": [ WorkEntry, ... ],
    "outros":     [ WorkEntry, ... ],
    "visuddhimagga": [ WorkEntry, ... ],
    "comentarios":   [ WorkEntry, ... ]
  }
}
```

Each `WorkEntry`:

```json
{
  "id":    "dhammasangani",
  "title": "Dhammasaṅgaṇī",
  "parts": {
    "mula": {
      "label": "Mūla",
      "files": ["mula__0.json", "mula__1.json", "mula__2.json"],
      "toc": [
        { "id": 4, "rend": "chapter", "text": "Mātikā" },
        ...
      ]
    },
    "attha": { ... }
  }
}
```

The `toc` array contains only `chapter` and `subhead` segments with their Pāli text stripped of HTML. The export panel uses `toc` entries to populate the chapter-range dropdowns (from/to).

## 3. `rend` Values

The `rend` field drives both CSS styling and export markup:

| rend value | CSS treatment | Export tag |
|---|---|---|
| `book`, `nikaya`, `title` | centred, large bold | `<h1>` (not currently mapped in export) |
| `chapter` | coloured bold, page-break-before in print | `<h2 class="seg chapter">` |
| `subhead` | bold, margin-top | `<h3 class="seg subhead">` |
| `subsubhead` | bold italic | `<p class="seg bodytext">` |
| `bodytext` (default) | normal paragraph | `<p class="seg bodytext">` |
| `centre` | centred text | `<p class="seg bodytext">` |
| `gatha*` | italic, indent 2em | `<p class="seg bodytext">` |
| `hangnum` | hanging indent 1.4em | `<p class="seg hangnum">` |
| `indent` | blockquote style | `<blockquote class="seg indent">` |
| `footnote` | 0.82em, muted | `<p class="seg footnote">` |
| `glossary` | bold headword | `<p class="seg bodytext">` |

## 4. Inline HTML in the `pali` Field

The corpus was extracted from source SQLite databases where Pāli text was stored as pseudo-XML. `extract_data.py::clean_pali()` converts the source markup to browser-safe HTML before writing the JSON files. Tags present in the corpus after extraction:

| Tag | Count in corpus | Origin | Rendering |
|---|---|---|---|
| `<b>text</b>` | 57,283 occurrences | `<hi rend="bold">` in source | Bold headwords/keywords |
| `<p rend="gathalast">text</p>` | 8,125 (across all rend values) | `<p rend="...">` in source | Verse formatting |
| `<sup class="var-note" data-note="N">[N]</sup>` | 873 | `<note>` in source | Variant reading footnote |
| `<x_bin_42>` | 1 | Unknown encoding artifact | Stripped harmlessly |

**Critical note:** These are genuine HTML tags embedded in string values, not escaped entities. They are rendered in the browser via `.innerHTML` and must be parsed with `DOMParser` in export (not escaped with `escHtml()`).

## 5. Chunk Files

Large parts are split into chunk files of ~900 segments. The chunking boundary is aligned to the next `chapter`, `book`, or `subhead` segment after the size threshold, so each chunk starts at a logical section boundary. One chunk file per part if the part has ≤ 900 segments.

File naming: `{partKey}__{chunkIndex}.json` (multi-chunk) or `{partKey}.json` (single-chunk).

The reader caches loaded chunks in memory; the export module fetches all chunks for the selected part(s) sequentially before building the output document.

## 6. Works in Detail

### Abhidhamma Piṭaka (group: `abhidhamma`)

Seven canonical Abhidhamma books. Each has mūla (root text) and typically aṭṭhakathā (commentary), ṭīkā (sub-commentary), and anuṭīkā (further commentary). The anuṭīkā segments for books 3–7 are stored in shared SQLite tables and differentiated by `id_range` in `extract_data.py`.

| Work | Parts | Notes |
|---|---|---|
| Dhammasaṅgaṇī | mūla · attha · ṭīkā · anuṭīkā | 3-chunk mūla |
| Vibhaṅga | mūla · attha · ṭīkā | 4-chunk mūla, 3-chunk ṭīkā |
| Dhātukathā | mūla · attha · ṭīkā · anuṭīkā | Single-file parts |
| Puggalapaññatti | mūla · attha · ṭīkā · anuṭīkā | Single-file parts |
| Kathāvatthu | mūla · attha · ṭīkā · anuṭīkā | 4-chunk mūla |
| Yamaka | mūla · attha · ṭīkā · anuṭīkā | 16-chunk mūla (3 source tables merged) |
| Paṭṭhāna | mūla · attha · ṭīkā · anuṭīkā | 31-chunk mūla (5 source tables), largest work |

### Outros Textos Abhidhamma (group: `outros`)

Post-canonical treatises composed within the Abhidhamma tradition:

| Work | Parts | Notes |
|---|---|---|
| Abhidhammāvatāra | mūla · ṭīkā | 10-chunk mūla |
| Abhidhammatthasaṅgaha | mūla | 2-chunk |
| Abhidhammamātikā | mūla | 3-chunk |

### Visuddhimagga (group: `visuddhimagga`)

| Work | Parts | Notes |
|---|---|---|
| Visuddhimagga | mūla · ṭīkā · nidānakathā | 5-chunk mūla, 4-chunk ṭīkā |

### Comentários Contemporâneos (group: `comentarios`)

Works where the `pali` field contains the English original text (not Pāli):

| Work | Parts | Notes |
|---|---|---|
| Abhidhamma in Daily Life | texto | 2-chunk; bilingual EN/PT |

## 7. Source Databases

`extract_data.py` reads from four SQLite files (not committed to the site folder):

| Language | DB file | Table column |
|---|---|---|
| Pāli | `tipitaka-roman-pali.db` | `pali_text` |
| English | `english_tipitaka_translation_data-2026-04-28.db` | `english_translation` |
| Portuguese | `portuguese_tipitaka_translation_data-2026-07-22.db` | `portuguese_translation` |
| Spanish | `spanish_tipitaka_translation_data-2026-05-15.db` | `spanish_translation` |

These databases are stored outside the site folder and are not needed to run the site. They are only needed to re-run `extract_data.py` if a new extraction is required.

## 8. Search Index

The search index is a client-side inverted index built by `scripts/build_search_index.py`.

### Shard structure

```json
{
  "postings": { "dhamma": [0, 3, 7, ...], "dhammas": [1, 2, ...] },
  "segments": [
    { "workId": "dhammasangani", "partKey": "mula", "chunk": 0,
      "segId": 42, "snippet": "Katame dhammā kusalā..." },
    ...
  ]
}
```

50 shards keyed by the first character of the token (`a`–`z`, accented characters, Burmese, Devanāgarī, and `misc`). Tokens are Unicode word characters of ≥ 3 characters. Each token's postings list is capped at 30 entries to prevent memory-heavy shards for extremely common words.

### Snippet source priority: Pāli > PT > EN > ES

HTML tags are stripped from snippets via a regex before storage. Each segment appears only once per shard regardless of how many tokens match it (deduplication by `(workId, partKey, chunk, segId)` identity).

## 9. Dictionary Files

### `pali_core.json`

Rigorously structured multi-sense dictionary for the 721 highest-frequency Pāli lemmas (covering 65.23% of corpus token occurrences as of stage 7). Built from the Digital Pāli Dictionary (dpd-mobile.db, CC BY-NC-SA 4.0) with manual PT/ES translations.

```json
{
  "meta": { "version": 1, "stage": 7, "pct_covered": 65.23, "count": 721, ... },
  "roots": { "√dhā": { "en": "...", "pt": "...", "es": "...", "sanskrit": "dhā" }, ... },
  "entries": [
    {
      "h": "dhamma",
      "freq": 46038,
      "pct": 2.45,
      "usage": "...",
      "senses": [
        { "id": "1.01", "pos": "masc", "grammar": "nom. sg.", "root": "√dhā", "en": "...", "pt": "...", "es": "...", "syn": "...", "ant": "..." }
      ]
    }
  ]
}
```

### `common_pali.json`

Simple single-sense dictionary with 182 general Pāli words not covered by `pali_core.json` (deduplicated at load time by the `dictionary.ts` module).

```json
{
  "meta": { "version": 1, "language": ["pt","en","es"], "source": "...", "count": 182 },
  "entries": [
    { "h": "rūpa", "pos": "n.", "en": "...", "pt": "...", "es": "...", "usage": "...", "freq": 0 }
  ]
}
```

The `dictionary.ts` module loads `pali_core.json` first, builds a `Set` of its headwords, then filters `common_pali.json` entries to exclude any overlap, ensuring core entries always take precedence.

### `vocabulary_blocks.md`

A philological reference document with 10 terminology blocks covering: dhamma, kamma, nibbāna, jhāna, saṃsāra, cetasika, dhammadhātu, psíquico, estado, kusala/akusala. This file is a human-readable reference for translators; it is not loaded by the application.
