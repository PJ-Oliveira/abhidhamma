# Data & Corpus

## 1. manifest.json

`data/manifest.json` is the single registry for all navigable content. Structure:

```typescript
interface Manifest {
  groups: Record<string, WorkEntry[]>
}

interface WorkEntry {
  id: string        // e.g. "dhammasangani"
  title: string     // e.g. "Dhammasaṅgaṇī"
  parts: Record<string, WorkPart>
}

interface WorkPart {
  label: string         // display name
  files: string[]       // chunk filenames, e.g. ["chunk_001.json", ...]
  toc: TocEntry[]       // TOC entries (chapters, etc.)
  count: number         // total segment count
  chunkStarts?: number[] // segment ID of first seg in each chunk (for seeking)
}

interface TocEntry {
  id: number   // segment ID (used as anchor)
  rend: string // "chapter" | "book" | ...
  text: string // heading text
}
```

Groups are ordered: `abhidhamma → outros → visuddhimagga → comentarios`.

---

## 2. Segment (Content Chunk) Format

Each chunk file is a `Segment[]` JSON array:

```typescript
interface Segment {
  id: number          // monotonically increasing corpus-wide ID
  rend: string        // rendering hint: "chapter" | "bodytext" | "hangnum" | etc.
  paranum: string | null // paragraph number badge (e.g. "§ 42")
  pali: string        // Pāli text (may contain inline HTML: <b>, <p rend="...">, <sup>)
  en: string          // English translation
  pt: string          // Portuguese translation
  es: string          // Spanish translation
  notes?: string[]    // footnote texts (indexed by .var-note superscripts)
}
```

### Inline HTML in `pali` field

The Pāli field can contain:

| Tag | Purpose |
|---|---|
| `<b>` | Bold headwords (~57,000 occurrences) |
| `<p rend="gatha1/2/3/gathalast">` | Verse strophes |
| `<sup class="var-note" data-note="{N}">` | Variant reading footnote marker |
| `<x_bin_42>` | Single anomalous tag (harmless) |

These are rendered via `innerHTML` in the reader and sanitized through `DOMParser + walkNode()` in the export module.

### rend values

| rend | Meaning |
|---|---|
| `book` | Book-level title |
| `nikaya` | Collection title |
| `title` | Work title |
| `chapter` | Chapter heading |
| `subhead` | Section heading |
| `subsubhead` | Sub-section heading |
| `hangnum` | Paragraph with hanging number |
| `bodytext` | Main body text |
| `indent` | Indented/verse block |
| `footnote` | Footnote text |
| `centre` | Centered text |
| `glossary` | Glossary term entry |

---

## 3. Dictionary Data

### `data/dictionary/pali_core.json`

High-frequency Pāli lemma dictionary. 721 entries covering the most common words (together representing ~70 % of corpus token occurrences).

```typescript
interface CoreDictData {
  meta: {
    version: number; stage: number; pct_covered: number;
    total_corpus_tokens: number; language: string[]; count: number; ...
  }
  roots: Record<string, DictRootInfo>  // Pāli roots with EN/PT/ES glosses
  entries: CoreDictEntry[]
}

interface CoreDictEntry {
  h: string          // headword (Pāli, with diacritics)
  freq: number       // corpus frequency
  pct: number        // % of total corpus tokens
  usage?: string     // contextual usage note
  senses: DictSense[]
}

interface DictSense {
  id: string         // e.g. "citta.1", "citta.2"
  pos?: string       // part of speech
  grammar?: string   // grammatical note
  root?: string      // root key (looks up DictRootInfo)
  en: string; pt: string; es: string
  syn?: string; ant?: string
}
```

### `data/dictionary/common_pali.json`

General Pāli dictionary. 182 single-sense entries used for lookup and export glossary.

```typescript
interface DictEntry {
  h: string          // headword (may include " / " alternative forms)
  pos?: string
  en: string; pt: string; es: string
  root?: string
  syn?: string[]
  usage?: string
  freq?: number
}
```

### Morphological Normalization (`dictionary.ts`)

`normalizePali(token)` generates candidate lemma forms by:
1. Suppletive/sandhi lookup (hardcoded ~80-entry `SUPPLETIVE` map for irregular forms like `so → ta`, `bhikkhave → bhikkhu`)
2. Regular ending stripping: nom/gen/acc/dat/abl/loc/inst/voc endings for a-stems, ā-stems, u-stems, ū-stems; 3rd-pl. present `-nti → -ti`; iti-sandhi `-tīti → -ti`; na-prefix compounds; neva-prefix compounds

Lookup phases:
1. Exact match against `coreData` headwords
2. Inflected match (query starts-with headword)
3. Prefix match on original form
4. Common dict fallback

---

## 4. Search Index

### Sharding

The search index is split into per-initial-character shards. `data/search/manifest.json`:

```json
{ "shards": { "a": "shard_a.json", "b": "shard_b.json", ... "misc": "shard_misc.json" } }
```

Shards exist for `a-z`, extended Latin letters with diacritics (`ā`, `ī`, `ū`, etc.), and `misc` for anything else.

### Shard Format

```typescript
interface SearchShard {
  postings: Record<string, number[]>  // token → array of segment indexes
  segments: SearchHit[]               // flat array of hit metadata
}

interface SearchHit {
  workId: string; partKey: string; chunk: number; segId: number; snippet: string
}
```

### Search Logic (`search.ts`)

1. Normalize query to lowercase.
2. Load shard for `query[0]`.
3. Collect exact-match postings, then prefix-match postings (up to 50 results).
4. Map indexes to `SearchHit` objects; render in results list.

---

## 5. Graph Data

`data/graph/dhammas.json` — node/edge data for the Dhammas knowledge graph (used by the Graph tool). Format is specific to the graph visualization library.

---

## 6. Tools Data

Located in `data/tools/`:
- `vithi.json` — door/consciousness-process sequences (Citta-Vīthi)
- `citta_cetasika.json` — citta-to-cetasika mapping
- `patthana.json` — conditional relations
- `mindmap.json` — mind map node data
- `matikas.json` — triad/dyad classification lists

---

## 7. SRS Vocabulary Data

`data/srs/vocabulary.json` — vocabulary cards for the SRS system:

```typescript
interface VocabCard {
  id: string; h: string; pos: string; freq: number; vibFreq: number
  en: string; pt: string; es: string
  usage: string; grammar: string; root?: string; compounds?: string[]
  rank: number
}
```

Cards are sorted by `vibFreq` (corpus frequency in Vibhaṅga) for priority.

---

## 8. Data Volume

| Resource | Approximate size |
|---|---|
| manifest.json | ~50 KB |
| All corpus chunks | ~140 MB total |
| pali_core.json | ~400 KB |
| common_pali.json | ~80 KB |
| All search shards | ~5 MB |
| Tools data | ~1 MB |
