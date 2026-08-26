# Abhidhamma Piṭaka Trilingual Site

> The translations in this project are based in part on OpenTipitaka (https://opentipitaka.org), licensed under CC BY-NC-SA 4.0. Some translations have been revised and proofread for this project. The revised translations are also distributed under CC BY-NC-SA 4.0.

A static Single Page Application (SPA) designed for the deep, structural study of the Theravāda Abhidhamma Piṭaka. It features a fully aligned trilingual reading experience (Pāli, English, Spanish, and Portuguese) alongside a suite of interactive analytical tools.

## 🚀 Features

- **Multilingual Reader**: Read the canonical Abhidhamma texts with paragraph-by-paragraph alignment in Pāli, English, Spanish, and Portuguese.
- **Integrated Pāli Dictionary**: Instant term lookup powered by a curated core dictionary (derived from the Digital Pāli Dictionary) optimized for Abhidhamma terminology.
- **Advanced Sharded Search**: High-performance, client-side search engine utilizing pre-built JSON shards for instant querying across the massive corpus without a backend.
- **Spaced Repetition System (SRS)**: Built-in flashcard system using spaced repetition algorithms to memorize complex Pāli terminology and compounds extracted directly from the texts.
- **Abhidhamma Analytical Tools**:
  - **Mindmap**: Interactive, collapsible tree visualizing the hierarchical structure of the 4 *paramattha dhammas*.
  - **Paṭṭhāna Matrix**: Interactive 24-condition matrix correlating the 24 *paccayas* across the standard groups.
  - **Citta-Vīthi Simulator**: Animated simulator of cognitive processes across the 6 sensory doors, detailing the exact sequence of *cittas*.
  - **Mātikā Explorer**: Searchable accordion interface for studying the 22 *tikas* (triads) and 100 *dukas* (dyads).
  - **Cetasika Analyzer**: Component for inspecting individual *cittas* and comparing the common and exclusive *cetasikas* (mental factors) between any two consciousness types.

## 🏗️ Architecture

The project is built with an extreme focus on performance, longevity, and simplicity. It relies exclusively on static file hosting without any backend servers or heavy JavaScript frameworks.

- **Frontend**: Pure TypeScript compiled to vanilla JavaScript. Zero npm dependencies for the runtime.
- **Styling**: Vanilla CSS using custom properties (CSS variables) for strict thematic consistency.
- **Data Layer**: Python 3 pipeline that processes, cleans, and translates the raw texts into optimized `.json` chunks (`data/works/`), compiles the dictionaries, and generates the search shards.
- **State Management**: Client-side DOM manipulation with lazy-loaded modules for the interactive tools.

## 📝 Linguistic Revision Workflow

The Portuguese (and Spanish) translations undergo a rigorous programmatic and manual audit to adhere strictly to the canonical Theravāda ontological framework (as defined in the *Atthasālinī* and *Visuddhimagga*).

**Core Translation Tenets:**
- **Pāli Technical Preservation**: Key terms like *kamma* (never the Sanskritized *karma*), *dhamma* (never *dharma*), *nibbāna*, *citta*, *cetasika*, and *jhāna* are preserved in their native Pāli form to prevent conceptual dilution.
- **Anti-Psychologization**: Elimination of Western psychological overlays (e.g., translating *bhavaṅga* as "subconscious" or "unconscious").
- **Ontological Precision**: The term *dhamma* is strictly translated as "reality" (realidade) in ontological contexts, rejecting Kantian mappings like "phenomenon" (fenômeno).

*Refer to the project's internal `docs/abhidhamma_knowledge_base.md` for the complete terminological and doctrinal guidelines.*

## ⚙️ Build and Run Instructions

To run the project locally or prepare it for deployment to GitHub Pages:

### Prerequisites
- Node.js (for TypeScript compiler)
- Python 3.x (for data processing scripts)

### Setup & Compilation
1. **Install Dev Dependencies:**
   ```bash
   npm install
   ```
2. **Build Search Index:** (Run this whenever translation data changes)
   ```bash
   python3 scripts/build_search_index.py
   ```
3. **Compile TypeScript & Stamp Versions:**
   ```bash
   npm run build
   ```
   *This compiles all `.ts` files to `js/` and automatically runs `scripts/version_js.py` to append cache-busting hashes (`?v=hash`) to your imports.*

### Local Development Server
Serve the root directory using Python's built-in HTTP server:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

## 🌐 Deployment
The project is structurally optimized for **GitHub Pages**. Simply push the `main` branch to GitHub and configure GitHub Pages to serve from the root `/` directory. No complex CI/CD pipeline or backend server is required.

## 🤝 Feedback & Acknowledgments

If you notice any errors, typos, or similar issues, please feel free to reach out so they can be corrected. There are still some updates pending for the Spanish translation, which I hope to complete soon. Furthermore, I intend to continuously revise this project and welcome feedback to make this tool ever better, more accessible, and more rigorously accurate.

I would like to express my deep gratitude to my teachers and to Open Tipitaka.
