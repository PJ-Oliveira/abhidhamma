# Abhidhamma Piṭaka Trilíngue — Master Project Log

**Last updated:** 2026-08-24  
**Project root:** `abhidhamma-pitaka-trilingue-site/`  
**Deployment model:** Static site — uploaded manually to GitHub; no build server or CI.  
**Governing constraint:** Never `git commit` or `git push`. All changes are prepared in the local folder; the user uploads the folder to GitHub directly.

---

## Directory Index

| Document | Scope |
|---|---|
| [01_architecture.md](01_architecture.md) | System design, module graph, data flow, CSS layout |
| [02_corpus_data.md](02_corpus_data.md) | Works catalogue, segment schema, manifest format, JSON chunks |
| [03_frontend_modules.md](03_frontend_modules.md) | All TypeScript source files — purpose, API, internals |
| [04_build_pipeline.md](04_build_pipeline.md) | TypeScript compile → version stamp → search index → dictionaries |
| [05_philological_corrections.md](05_philological_corrections.md) | Dhamma terminology audit: ~25,470 segment fixes + dictionary sweep |
| [06_export_module.md](06_export_module.md) | PDF / EPUB export system — architecture, HTML pipeline, fixes |
| [07_open_issues.md](07_open_issues.md) | Open issues registry — bugs, deficits, next steps |

---

## Project Overview

A **zero-dependency, fully static, single-page application** that presents the complete Abhidhamma Piṭaka in parallel Pāli / English / Portuguese / Spanish. All content is pre-rendered as sharded JSON; no server-side logic exists. The site is deployable to GitHub Pages by dropping the folder.

### Corpus Scale

| Metric | Value |
|---|---|
| Total works | 12 (+ 6 contemporary commentaries in progress) |
| Total segments (canonical) | 91,065 |
| Segments with inline HTML markup | 27,462 (30.2%) |
| Pāli tokens in corpus | 1,878,244 |
| Languages | Pāli · English · Português · Español |

### Works Catalogue (segment counts)

| Work | Group | Segments | Parts available |
|---|---|---|---|
| Dhammasaṅgaṇī | Abhidhamma Piṭaka | 5,930 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Vibhaṅga | Abhidhamma Piṭaka | 7,774 | mūla · aṭṭhakathā · ṭīkā |
| Dhātukathā | Abhidhamma Piṭaka | 999 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Puggalapaññatti | Abhidhamma Piṭaka | 1,044 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Kathāvatthu | Abhidhamma Piṭaka | 5,767 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Yamaka | Abhidhamma Piṭaka | 14,875 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Paṭṭhāna | Abhidhamma Piṭaka | 29,171 | mūla · aṭṭhakathā · ṭīkā · anuṭīkā |
| Abhidhammāvatāra | Outros textos | 12,536 | mūla · ṭīkā |
| Abhidhammatthasaṅgaha | Outros textos | 1,672 | mūla |
| Abhidhammamātikā | Outros textos | 2,667 | mūla |
| Visuddhimagga | Visuddhimagga | 7,726 | mūla · ṭīkā · nidānakathā |
| Abhidhamma in Daily Life | Comentários | 904 | texto (EN+PT bilíngue) ✅ |
| Buddhism in Daily Life | Comentários | TBD | texto (EN+PT) ⏳ |
| The Buddha's Path | Comentários | TBD | texto (EN+PT) ⏳ |
| Introduction to the Abhidhamma | Comentários | TBD | texto (EN+PT) ⏳ |
| The Conditionality of Life | Comentários | TBD | texto (EN+PT) ⏳ |
| The Buddhist Teaching on Physical Phenomena | Comentários | TBD | texto (EN+PT) ⏳ |
| Path Without Ownership | Comentários | TBD | texto (EN+PT) ⏳ |
| **Total** | | **91,065 + 6 em integração** | |

### Technology Stack

- **Frontend:** TypeScript 5 → ES2022 modules, no framework, no bundler
- **CSS:** Single `style.css`, CSS custom properties, CSS Grid layout
- **Data:** Static JSON, sharded for lazy loading
- **Build:** `tsc` + `scripts/version_js.py` (Python 3)
- **Search index:** Built by `scripts/build_search_index.py`
- **Dictionaries:** Built by `scripts/build_core_dictionary.py` + `scripts/build_common_dictionary.py`

### Integration Scripts for Contemporary Commentaries

| Script | Purpose |
|---|---|
| `scripts/integrate_books.py` | Extract 6 PDFs via ghostscript → JSON chunks + manifest patch |
| `scripts/translate_books.py` | Translate EN→PT via Gemini API (philologically correct, resumable) |

**Integration pipeline:**
```
npm run integrate-books
→ python3 scripts/translate_books.py (requer GEMINI_API_KEY)
→ npm run rebuild-search
→ npm run build
```

### Absolute Operative Directives

1. **NEVER translate `dhamma` as `fenômeno`** — dhamma = paramattha-dhamma (discrete ultimate reality). This applies to all corpus segments, dictionary entries, UI strings, and documentation.
2. **NEVER git commit or push** — the user uploads the folder to GitHub manually.
3. **`kamma`** is always the correct Pāli form; "karma" is the Sanskrit cognate and must not substitute it in translations.
