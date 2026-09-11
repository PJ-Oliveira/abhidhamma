# 05 — Philological Corrections

## Absolute Directive

> **"Jamais traduza o termo dhamma como 'fenômeno'"**

This is an irrevocable operative directive. `dhamma` (Pāli) = paramattha-dhamma = a discrete, irreducible ultimate reality. It must NEVER be rendered as "fenômeno" (Portuguese) or "fenómeno" (Spanish) in translations, dictionary entries, UI strings, or documentation. The Greek-origin word "phenomenon" carries the connotation of an appearance or manifestation in consciousness — the opposite of the Abhidhamma ontological meaning.

---

## 1. Scope of Work Completed

### 1a. Corpus-Level Corrections (~25,470 segments)

A systematic sweep was performed across all 91,065 segments in `data/works/`. Every Portuguese occurrence of `fenômeno`/`fenômenos` and Spanish `fenómeno`/`fenómenos` used as a translation of `dhamma` was replaced with the correct equivalent:

- `fenômeno(s)` → `dhamma(s)` (when translating dhamma concepts)
- `fenómeno(s)` → `dhamma(s)` (Spanish equivalents)

**Segments affected by work:**

| Work | Segments corrected (approx.) |
|---|---|
| Dhammasaṅgaṇī | ~3,200 |
| Vibhaṅga | ~4,100 |
| Dhātukathā | ~500 |
| Puggalapaññatti | ~600 |
| Kathāvatthu | ~2,800 |
| Yamaka | ~6,000 |
| Paṭṭhāna | ~7,200 |
| Abhidhammāvatāra | ~800 |
| Visuddhimagga | ~270 |
| Others | ~residual |
| **Total** | **~25,470** |

### 1b. Data Anomaly Fixed

**File:** `data/works/yamaka/mula__9.json`, segment `id: 174`

**Problem:** Corrupted HTML entity artifact. The original text was `fenômenos &amp; dhammas indeterminados` where `&amp;` had been partially consumed, producing the string `fenômenosamp;`.

**Fix:** Segment pt field rewritten to: `"Os dhammas indeterminados são tanto dhammas quanto dhammas indeterminados."` (matching Pāli `dhammā ceva abyākatā dhammā ca`).

---

## 2. Dictionary Corrections — `pali_core.json`

721 entries audited. 22 occurrences of "fenômeno" found and corrected.

### `dhamma` entry

| Field | Before | After |
|---|---|---|
| `usage` | contained "fenômenos analisados" | Rewrote to: "O termo-chave do Abhidhamma. Paramattha-dhamma = realidade última discreta e irredutível. NÃO deve ser traduzido como 'fenômeno'..." |
| sense 1.04 `pt` | "fenômenos mentais; pensamentos" | "dhammas mentais; objetos mentais" |
| sense 1.06 `pt` | "matéria; coisa; fenômeno" | "matéria; coisa; entidade discreta" |

**One intentional occurrence remains:** The `usage` field now contains "NÃO deve ser traduzido como 'fenômeno'" — this single negative-instruction occurrence is correct and must not be deleted.

### `kamma` entry

| Field | Before | After |
|---|---|---|
| `usage` | contained `"o \"karma\""` | Note added that "kamma" is always correct; "karma" is Sanskrit cognate |
| sense 1 `pt` | "(carma)" | Removed parenthetical |
| sense 1 `es` | "(karma)" | Removed parenthetical |

### `akusala` entry

| Field | Before | After |
|---|---|---|
| sense 1 `pt` | "(de pessoa ou animal) inábil; incompetente; inexperiente" | "(Abhidhamma) moralmente insalubre; kammicamente improfícuo — qualifica dhammas (cittas e cetasikas) com raiz na avidez, aversão ou ilusão; oposto de kusala…" |

### `dhammāyatana` entry

| Field | Before | After |
|---|---|---|
| `usage` | "fenômenos mentais..." | "dhammas..." |
| senses `pt` | "fenômenos mentais" | "dhammas" |

### `nevavipākanavipākadhammadhamma` entry

| Field | Before | After |
|---|---|---|
| `usage` | "fenômeno nem resultante..." | "dhamma nem resultante..." |
| sense 1 `pt` | "fenômeno" | "dhamma" |

### Nine additional usage fields

The following entries had "fenômenos"/"fenômeno" in their `usage` field:

`paccaya`, `paññā`, `upanissayapaccaya`, `pavatti`, `pavattati`, `moha`, `aññamañña`, `nirujjhi`, `vipassanā`

All corrected: "fenômenos" → "dhammas", "fenômeno" → "dhamma".

---

## 3. Dictionary Corrections — `common_pali.json`

182 entries audited. 5 occurrences corrected.

| Entry | Field | Before | After |
|---|---|---|---|
| `dhamma` | `pt` | "fenômeno; estado mental/físico..." | "realidade última discreta (paramattha-dhamma); estado mental/físico..." |
| `dhamma` | `usage` | "fenômenos analisados" | "Nunca traduzir como 'fenômeno'. Dhamma = paramattha-dhamma..." |
| `rūpa` | `pt` | "fenômeno físico" | "rūpa" |
| `dhammāyatana` | `usage` | "sutis fenômenos mentais" | "dhammas sutis" |
| `paccaya` | `usage` | "entre os fenômenos" | "entre os dhammas" |

---

## 4. Search Index Rebuild

After all corpus and dictionary corrections, `scripts/build_search_index.py` was re-run from scratch.

**Verification:** All 50 shard files were checked for residual Portuguese `fenômeno`/`fenômenos`. Result: **0 occurrences** in Portuguese fields. Spanish `fenómeno`/`fenómenos` entries remain (correct: those are Spanish translations).

---

## 5. Vocabulary Reference Created

`data/dictionary/vocabulary_blocks.md` was created as a philological reference document. Contains 10 terminology blocks:

1. **dhamma** — paramattha-dhamma ontology, why "fenômeno" is wrong
2. **kamma** — Pāli vs Sanskrit form, intentional action
3. **nibbāna** — cessation, not annihilation
4. **jhāna** — meditative absorption, not "contemplação"
5. **saṃsāra** — cycle of conditioned existence
6. **cetasika** — mental factor, concomitant of citta
7. **dhammadhātu** — the dhamma-element (18th āyatana)
8. **psíquico** — problematic term; context-dependent
9. **estado** — problematic when used for dhamma; acceptable for avasthā/bhāva
10. **kusala/akusala** — kammically wholesome/unwholesome (not "skillful")

---

## 6. Pending Philological Work

### "psíquico" — 323 instances

A survey found 323 occurrences of "psíquico/psíquica" across the PT translation corpus. These cannot be bulk-replaced because:
- Some are correct (e.g., "sofrimento psíquico" = psychological suffering — acceptable)
- Some are problematic (e.g., "fenômeno psíquico" as a translation of nāmadhamma)
- Context-by-context review is required

**Status:** Not started. Requires manual review of each instance.

### "estado" used for `dhamma`

Some instances of "estado" appear to translate `dhamma` in contexts where "dhamma" should be kept untranslated or rendered differently. A subset was caught by the bulk correction pass, but borderline cases where "estado" legitimately translates `bhāva` or `avasthā` were preserved.

**Status:** Partially addressed. No systematic audit of borderline cases has been done.
