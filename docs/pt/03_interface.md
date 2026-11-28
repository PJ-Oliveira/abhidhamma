# UI & Interface

## 1. Overall Layout

```
┌─────────┬──────────────────────┬───┬────────────────────────────────────┐
│ #icon-  │   #side-panel        │ R │  main#reader                       │
│  rail   │  (active panel)      │ E │                                    │
│ 56–76px │  240–320px           │ S │  #reader-header                    │
│         │                      │ I │    #breadcrumb                     │
│ [☰]     │  panel-tipitaka:     │ Z │    #part-tabs   #chapter-nav       │
│ [📖]   │    Tree of works     │ E │                                    │
│ [⏱]   │  panel-dictionary:   │ R │  #content                          │
│ [🔍]   │    Pāli dict search  │   │    .seg × N                        │
│ [⚙]   │  panel-history:      │   │      .pali-line                    │
│ [⬇]   │    History+Bookmarks │   │      .translation-line             │
│ [🧠]   │  panel-search:       │   │                                    │
│ [🔬]   │    Full-text search  │   │  #toc-nav  [‹] [1/N] [›]          │
│         │  panel-settings:     │   │                                    │
│         │    Lang/Font/etc      │   │  #reader-srs  (SRS overlay)        │
│         │  panel-export:       │   │  #reader-tools (Tools overlay)     │
│         │    PDF/EPUB export   │   │                                    │
│         │  panel-srs:          │   │  [💬 Debate]  (floating button)   │
│         │    SRS shortcut      │   │                                    │
│         │  panel-tools:        │   │                                    │
│         │    Tools shortcut    │   │                                    │
└─────────┴──────────────────────┴───┴────────────────────────────────────┘
```

---

## 2. Icon Rail (#icon-rail)

Eight navigation buttons, each with `data-panel="{id}"`:

| Icon | Panel | Key |
|---|---|---|
| ☰ | tipitaka | Browse works |
| 📖 (book SVG) | dictionary | Pāli dictionary |
| ⏱ | history | History + bookmarks |
| 🔍 | search | Full-text search |
| ⚙ | settings | Settings |
| ⬇ | export | Export (PDF/EPUB) |
| 🧠 | srs | Pāli memorization |
| 🔬 | tools | Abhidhamma tools |

**Click behaviour:**
- If the button's panel is already active AND the side panel is expanded → collapses side panel.
- Otherwise → switches to the panel + expands side panel (except SRS/Tools on mobile, which go fullscreen).

---

## 3. Side Panel (#side-panel)

Only one `.panel` child is active at a time (`class="panel active"`). Panels `srs` and `tools` show only a "Viewing in main panel →" placeholder — the actual content is in the reader overlays.

### Collapsing / Expanding

- `collapseBtn` (‹/›) toggles collapse.
- On collapse: saves current width to `localStorage("panelW")`, sets `--panel-w: 0px` after 160 ms CSS transition.
- On expand: restores saved width (min 120 px, max 450 px).

### Resizing

`#panel-resizer` is a draggable 8-px column. On `mousedown` starts resize; `mousemove` sets `--panel-w`; `mouseup` saves new width. Snaps to 0 (collapsed) if dragged below 60 px.

---

## 4. Reader (main#reader)

### Header

```
[‹]  Breadcrumb: "Abhidhamma Piṭaka › Dhammasaṅgaṇī"
     [Mūla] [Aṭṭhakathā] ...   [chapter nav ▾]
```

- **Breadcrumb**: group title + work title.
- **Part tabs**: one button per part key; clicking loads chunk 0 of that part.
- **Chapter nav**: dropdown listing `rend=chapter` TOC entries; clicking scrolls to and flashes that segment.

### Content Area (#content)

Each segment is rendered as:

```html
<div class="seg" data-rend="{rend}" data-seg-id="{id}" data-pali="{text}">
  <div class="pali-line">
    [paranum badge]  pali text (innerHTML)  [☆ bookmark btn]
  </div>
  <div class="translation-line">
    translation text (innerHTML)
  </div>
</div>
```

CSS classes added based on settings:
- `.no-pali` → hides `.pali-line`
- `.no-translation` → hides `.translation-line`

`rend` values and their HTML mapping:

| rend | HTML element |
|---|---|
| book / title / nikaya | `<h1>` |
| chapter | `<h2>` |
| subhead | `<h3>` |
| subsubhead | `<h4>` |
| hangnum | `<p>` |
| indent | `<blockquote>` |
| footnote | `<p>` |
| centre | `<p>` |
| glossary | `<p>` |
| (default) | `<p>` |

### Chunk Navigation (#toc-nav)

Prev/Next buttons and a `{current} / {total}` indicator at the bottom of the reader.

---

## 5. Selection Popover (#selection-popover)

Appears when the user selects text (or taps a word on mobile) inside `.pali-line` or `.translation-line`.

Content:
- **Header**: label ("↔ Translation" or "↔ Pāli") + copy-link button + close button.
- **Counterpart text**: if user selected Pāli → shows translation; if selected translation → shows Pāli.
- **Dictionary section** (Pāli selections only): up to 3 words looked up; first hit shown inline.

Position: tries to place to the right of the selection; falls back left if near viewport edge.

---

## 6. Note Tooltip (#note-tooltip)

Variant-reading footnotes (`.var-note` superscript elements inside Pāli text) show a floating tooltip on `mouseenter` with the footnote text. Follows cursor position.

---

## 7. Settings Panel

| Control | Effect |
|---|---|
| Language select | Changes `translationLang` + `uiLang`; re-renders content and UI strings |
| A− / A+ buttons | Changes `fontSize` (12–28 px); updates `--font-scale` CSS variable |
| Show Pāli checkbox | Toggles `.no-pali` class on all `.seg` elements |
| Show translation checkbox | Toggles `.no-translation` class |
| Install App button | Shown when `beforeinstallprompt` fires (PWA install); triggers `deferredPrompt.prompt()` |

---

## 8. Fullscreen Overlays (SRS and Tools)

When the SRS or Tools rail button is active, the main reader hides (`#reader-header`, `#content`, `#toc-nav` all `display:none`) and the corresponding overlay (`#reader-srs` or `#reader-tools`) is shown as `display:flex`.

---

## 9. Debate Simulator (floating)

A fixed-position `💬 Debate` button in the bottom-right corner lazily imports `ai-feature/ui.js` on first click and shows the `#interlocutor-container` panel (floating, scrollable, `z-index: 10001`).

---

## 10. Mobile Behaviour (≤ 860px)

- Rail labels are hidden (icons only).
- Side panel collapses automatically when a text is selected.
- SRS and Tools panels collapse the side panel and go fullscreen.
- Tap-to-define: tapping a word in the reader triggers the selection popover using `document.caretRangeFromPoint`.
- `user-scalable=0` in the viewport meta prevents accidental zoom.
