# 04 — Build Pipeline

## 1. Overview

```
Source DBs (SQLite)
       │
       ▼
scripts/extract_data.py
       │ writes
       ▼
data/works/**/*.json  +  data/manifest.json
       │
       ├──► scripts/build_search_index.py
       │           │ writes
       │           ▼
       │    data/search/shard_*.json  +  data/search/manifest.json
       │
       └──► scripts/build_core_dictionary.py   (manual stage-by-stage)
       │           │ writes
       │           ▼
       │    data/dictionary/pali_core.json
       │
       └──► scripts/build_common_dictionary.py  (automated)
                   │ writes
                   ▼
            data/dictionary/common_pali.json

src/*.ts
       │
       ▼
   tsc  (TypeScript compiler)
       │ writes
       ▼
js/*.js  +  js/*.js.map
       │
       ▼
scripts/version_js.py
       │ rewrites imports + index.html script tag
       ▼
js/*.js (versioned imports ?v={hash})
index.html (versioned script src)
```

## 2. `npm run build`

```json
"build": "tsc && python3 scripts/version_js.py"
```

This is the only command needed after editing TypeScript. It:
1. Compiles all `src/*.ts` → `js/*.js`
2. Stamps version hashes on all imports

**No bundler.** Each module remains a separate file. The browser loads them as native ES2022 modules.

## 3. `extract_data.py` — Corpus Extraction

**When to run:** Only when a new source database is available or when the segment schema changes. The extracted JSON files are committed to the site folder.

**Source databases required (not in site folder):**
- `tipitaka-roman-pali.db`
- `english_tipitaka_translation_data-2026-04-28.db`
- `portuguese_tipitaka_translation_data-2026-07-22.db`
- `spanish_tipitaka_translation_data-2026-05-15.db`

**What it does:**
1. Opens all four SQLite connections
2. For each work/part in `WORKS` registry:
   - Reads rows from specified table(s) with optional `id_range` filter
   - `clean_pali()` converts source pseudo-XML to browser HTML:
     - `<hi rend="bold">X</hi>` → `<b>X</b>`
     - `<note>text</note>` → `<sup class="var-note" data-note="N">[N+1]</sup>` (note text stored in `notes` array)
     - `<hi rend="paranum|dot">` → removed
     - `<pb>` page-break markers → removed
   - Builds TOC from `chapter`/`subhead` headings
   - Splits into chunks ≤ 900 segments, aligned to section boundaries
   - Writes `{partKey}__{i}.json` or `{partKey}.json` per chunk
3. Writes `data/manifest.json`

**Chunk size constant:** `CHUNK_SIZE = 900` (line 27). Adjusting this requires re-running extraction.

## 4. `build_search_index.py` — Search Index Builder

**When to run:** After any change to corpus JSON files (`data/works/`). Search results will be stale until re-run.

```bash
python3 scripts/build_search_index.py
```

**Algorithm:**
1. Reads all segment files via manifest
2. Tokenizes: strips HTML tags, lowercases, extracts Unicode word tokens ≥ 3 chars
3. For each token, records which shard (first char or `misc`) it belongs to
4. Builds `shard_postings[key][token] → [segIdx...]` and `shard_segments[key] → [SearchHit...]`
5. Caps each token's posting list at 30 entries
6. Writes one JSON file per shard key + `manifest.json`

**Constants in the script:**
- `MAX_POSTINGS_PER_TOKEN = 30`
- `MIN_TOKEN_LEN = 3`
- `SNIPPET_LEN = 90` (chars)

**Last run result:** 91,065 segments processed, 50 shards written.

**Important:** The search index strips all HTML from snippets (via `TAG_RE = re.compile(r"<[^>]+")`). Snippets are therefore always plain text regardless of inline markup in the source.

## 5. `build_core_dictionary.py` — Core Dictionary Builder

**When to run:** When adding new lexical entries to `pali_core.json`. This is a manual, stage-by-stage process.

**Scale:** 14,420 lines. The file serves as both the script and the authoritative documentation of every lexicographic decision made for each of the 721 entries.

**Methodology:**
1. Reads `dpd-mobile.db` (Digital Pāli Dictionary, CC BY-NC-SA 4.0)
2. Groups surface forms (inflections) to lemmas using `dpd_headwords.lookup` table
3. Counts corpus token frequencies from `data/works/`
4. Assigns surface forms to lemmas by dominant reading (documented per-lemma)
5. Extracts senses (pos, grammar, root, syn, ant, en) from DPD
6. Manual PT and ES translations are hardcoded in the script
7. Writes `data/dictionary/pali_core.json`

**Current stage:** Stage 7 (65.23% corpus token coverage, target 82%). 721 entries, 120 root entries.

**Stage history:**
- Stage 1: 4 lemmas — ta, ca, na, dhamma (10.79%)
- Stage 2: +8 lemmas — ti, pe, uppajjati, ya, paccaya, vā, hoti, pana (21.68%)
- Stage 3: +17 lemmas — khandha, tattha, paṭicca, eka, vutta, ... (total ~30%)
- Stage 4: +lemmas reaching ~40%
- Stage 5: +lemmas reaching ~50%
- Stage 6: +lemmas reaching ~55%
- Stage 7: 205 new lemmas reaching 65.23%

**Known pending:** `katatta`/`kaṭatta` disambiguation (dental vs retroflex); see build script docstring.

## 6. `build_common_dictionary.py` — Common Dictionary Builder

**When to run:** When adding simple entries that do not warrant multi-sense treatment.

241 lines. Reads from a simple headword table and writes `common_pali.json`.

## 7. `version_js.py` — Import Version Stamper

**Purpose:** Bust ES module cache by appending `?v={hash}` to all import paths.

**Algorithm:**
```python
ROOT = Path(__file__).resolve().parent.parent
JS_DIR = ROOT / "js"
INDEX = ROOT / "index.html"

# 1. Compute MD5 of all .js files (sorted, deterministic)
h = hashlib.md5()
for f in sorted(JS_DIR.glob("*.js")):
    h.update(f.read_bytes())
VERSION = h.hexdigest()[:8]

# 2. Rewrite imports in all .js files
PAT = re.compile(r'((?:from|import)\s+")(\.\/[^"?]+\.js)(?:\?v=[^"]*)?(")')
# Replaces: from "./export.js" → from "./export.js?v=5df634f9"
# Also handles: from "./export.js?v=old" → from "./export.js?v=5df634f9"

# 3. Rewrite <script> tag in index.html
```

**Why post-compile:** TypeScript resolves import paths literally. `from "./export.js?v=..."` would cause `tsc` to look for a file named literally `export.js?v=...`. The version stamp is therefore applied only to compiled output.

**Current version hash:** `5df634f9` (computed 2026-08-23).

## 8. `tsconfig.json` Settings

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "rootDir": "src",
    "outDir": "js",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "sourceMap": true,
    "removeComments": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

Key settings:
- `noUncheckedIndexedAccess`: array access returns `T | undefined`, forcing null checks. This is why the code uses `?.` extensively on array results.
- `exactOptionalPropertyTypes`: distinguishes `{ x?: string }` from `{ x?: string | undefined }`.
- `removeComments`: output files contain no comments (keeps JS lean).
- `sourceMap`: `.js.map` files allow browser DevTools to show TypeScript source.

## 9. Word Frequency Analysis

`scripts/word_frequency.py` counts token frequencies across the corpus and writes `pali_word_freq.tsv`. This TSV is used by `build_core_dictionary.py` to determine which lemmas to include in each stage. `pali_word_freq.tsv` is committed to the site folder as a static reference file.

The corpus has 1,878,244 total Pāli token occurrences.
