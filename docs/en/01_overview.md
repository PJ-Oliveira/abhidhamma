# Abhidhamma Piṭaka Trilingual — Project Overview

## What is this project?

The **Abhidhamma Piṭaka Trilingual Site** is a client-side Progressive Web App (PWA) for reading, studying, and exporting the Pāli Abhidhamma Piṭaka — one of the three main divisions (_piṭaka_) of the Theravāda Buddhist canon — in three languages: **Pāli** (original), **English**, and **Portuguese**, with Spanish also present in the data.

The project has no server-side backend. All content, logic, and state run entirely in the browser.

---

## Scope and Content

The corpus spans **seven canonical Abhidhamma works** plus companion texts:

| Group key | Works included |
|---|---|
| `abhidhamma` | Dhammasaṅgaṇī, Vibhaṅga, Dhātukathā, Puggalapaññatti, Kathāvatthu, Yamaka, Paṭṭhāna |
| `outros` | Abhidhammatthasaṅgaha, Abhidhammāvatāra, other manuals |
| `visuddhimagga` | Visuddhimagga (Path of Purification) |
| `comentarios` | Contemporary commentaries (bilingual EN-PT) |

Each work is split into **parts** (mūla, aṭṭhakathā, ṭīkā, anuṭīkā…) and further divided into **chunk JSON files** of ~900 segments each for efficient loading.

---

## Key Features

| Feature | Description |
|---|---|
| **Trilingual reader** | Pāli aligned with EN/PT/ES translations, segment by segment |
| **Navigation tree** | Hierarchical collapsible tree of all works and parts |
| **Pāli dictionary** | 721 high-frequency lemmas (pali_core.json) + 182 general entries; morphological normalization (inflected forms) |
| **Full-text search** | Sharded inverted-index; searches across Pāli, EN, PT, ES |
| **Bookmarks & History** | Persistent via localStorage |
| **Export** | PDF (browser print) and EPUB 3 with glossary appendix |
| **SRS** | Spaced Repetition System (SM-2) for Pāli vocabulary memorization |
| **Abhidhamma Tools** | Interactive visualizations: Mind Map, Paṭṭhāna relations, Citta-Vīthi, Mātikās, Cetasika |
| **Debate Simulator** | Kathāvatthu-based canonical debate logic engine |
| **PWA / Offline** | Service Worker pre-caches all ~140 MB of content for offline reading |
| **i18n** | Interface in PT, EN, or ES; translation language independently selectable |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.6 (compiled to ES2022 modules via `tsc`) |
| Runtime | Browser (no Node.js at runtime) |
| Test framework | Vitest 4 with jsdom and coverage via V8 |
| Build | `tsc` + `scripts/version_js.py` (cache-busting hash) |
| Deployment | Static files (GitHub Pages via `.nojekyll`) |
| Font | Gentium Book Plus (bundled TTF) |
| AI dep. | `@mlc-ai/web-llm` (loaded lazily — not used in current stable build) |

---

## Quick Start

```bash
# Install dev dependencies
npm install

# Run tests
npm test

# Build (TypeScript compile + version stamp)
npm run build

# Watch mode
npm run watch
```

Open `index.html` in a browser (or serve with any static file server). No build step needed to view; the compiled `js/` files are committed.

---

## File Hierarchy (top level)

```
index.html           Entry point
css/style.css        Single stylesheet
js/                  Compiled JS modules (committed)
src/                 TypeScript source
data/
  manifest.json      Works/parts/chunks registry
  works/{id}/*.json  Content chunks
  dictionary/        Pāli dictionaries
  search/            Search shards
fonts/               Gentium Book Plus TTF
img/                 Logo
service-worker.js    PWA cache
manifest.json        Web App Manifest
tests/               Unit tests (Vitest)
scripts/             Build helpers (Python)
docs/                Documentation (this folder)
```
