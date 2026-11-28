# 06 — Export Module

## 1. Overview

`src/export.ts` (compiled to `js/export.js`) implements the Export panel. It provides two output formats:

- **PDF**: Generates a print-ready HTML page as a blob URL, opens it in a new tab, and auto-triggers the browser print dialog. Fallback: downloads the HTML file if the popup is blocked.
- **EPUB**: Generates a valid EPUB 3 ZIP archive (with NCX for legacy compatibility) and downloads it directly.

---

## 2. Export Panel UI

Initialized by `initExportPanel(manifest, container, getCurrentWorkId)` called from `app.ts`.

The panel renders dynamically into `#export-panel-body`:

1. **Work selector** — all works from manifest, grouped
2. **Part checkboxes** — one per part in the selected work; all checked by default
3. **Chapter range** — shown only when exactly one part is selected AND that part has TOC entries. Dropdowns populated from `toc` entries with `rend === "chapter"`.
4. **Language mode selector** — 6 options:
   - `en` — English only
   - `pali+en` — Pāli + English
   - `pali+en+pt` — Pāli + English + Português
   - `es` — Spanish only
   - `pali+es` — Pāli + Español
   - `pali+en+es` — Pāli + English + Español
5. **Export PDF** button
6. **Export EPUB** button
7. **Status text** — shows "Preparando…" during build, cleared on success, shows error on failure

When the user opens the export panel while viewing a text, the work selector pre-selects the current work.

---

## 3. Language Mode Handling

`type LangMode = "en" | "pali+en" | "pali+en+pt" | "es" | "pali+es" | "pali+en+es"`

In `segToHtml(seg, langMode)`:

```typescript
const showPali = langMode.startsWith("pali");
const showEn   = langMode.includes("en");
const showPt   = langMode === "pali+en+pt";
const showEs   = langMode.includes("es");
```

**Special case:** When `!showPali && showEn` and the `pali` field contains text (bilingual EN/PT works in the `comentarios` group), the English text is rendered from `seg.pali` with class `"en"`. This correctly handles the contemporary commentaries where English is stored in the `pali` field.

---

## 4. HTML Pipeline — `fieldHtml()` and `walkNode()`

### Problem
The `pali` field contains real inline HTML tags (`<b>`, `<p rend="gathalast">`, `<sup>`). Calling `escHtml()` on these fields would produce literal `&lt;b&gt;` in the export output — tags visible as text.

### Solution

```typescript
function fieldHtml(raw: string): string {
    if (!raw) return "";
    if (!raw.includes("<")) return escHtml(raw);   // fast path: no tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${raw}</body>`, "text/html");
    return walkNode(doc.body);
}
```

`walkNode()` recursively serializes the parsed DOM:

```typescript
function walkNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return escHtml(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const inner = Array.from(el.childNodes).map(walkNode).join("");
    if (tag === "b" || tag === "strong") return `<strong>${inner}</strong>`;
    if (tag === "i" || tag === "em")     return `<em>${inner}</em>`;
    if (tag === "sup")                   return `<sup>${inner}</sup>`;
    if (tag === "br")                    return "<br>";
    if (tag === "p") {
        const rend = el.getAttribute("rend");
        const cls  = rend ? ` class="rend-${escHtml(rend)}"` : "";
        return inner ? `<br><span${cls}>${inner}</span>` : "";
    }
    return inner;  // unknown tags: strip tag, preserve inner text
}
```

**Conversion table:**

| Input | Output |
|---|---|
| `<b>text</b>` | `<strong>text</strong>` |
| `<i>text</i>` | `<em>text</em>` |
| `<sup>1</sup>` | `<sup>1</sup>` |
| `<p rend="gathalast">text</p>` | `<br><span class="rend-gathalast">text</span>` |
| `<p rend="gatha1">text</p>` | `<br><span class="rend-gatha1">text</span>` |
| `<x_bin_42>text</x_bin_42>` | `text` (stripped) |
| `plain text` | `plain text` (escaped) |

### Verification result

Full corpus sweep of 91,065 segments (27,462 with HTML) in the browser:

```
{ segsTotal: 91065, htmlSegsProcessed: 27462, badTagsFound: 0 }
```

Zero unexpected tags in export output across all 12 works.

---

## 5. `segToHtml()` — Segment to Export Block

```typescript
function segToHtml(seg: Segment, langMode: LangMode): string
```

Maps the `rend` field to an export HTML element:

| rend | Export element |
|---|---|
| `chapter` | `<h2 class="seg chapter">` |
| `subhead` | `<h3 class="seg subhead">` |
| `hangnum` | `<p class="seg hangnum">` |
| `indent` | `<blockquote class="seg indent">` |
| `footnote` | `<p class="seg footnote">` |
| any other | `<p class="seg bodytext">` |

Each language line is wrapped in `<div class="line {lang}">`. Empty segments (no lines would be shown) return `""` and are filtered out.

---

## 6. PDF Export

### `buildPrintHtml(segs, title, langMode)`

Produces a full HTML document string:
- `<!DOCTYPE html>` with `<meta charset="utf-8">`
- Embedded `PRINT_CSS` (print-optimized: Georgia serif, 11pt, 2cm margins, `@page` CSS for running headers)
- Title as `<h1>` at top
- All segment HTML blocks joined by `\n`
- Auto-print script: `window.addEventListener("load", () => setTimeout(() => window.print(), 600))`

### `PRINT_CSS` includes verse formatting:
```css
span.rend-gathalast { margin-left: 2em; }
span.rend-gatha1, span.rend-gatha2, span.rend-gatha3 { margin-left: 1em; }
```

### `openPrintWindow(html, title)`

```typescript
function openPrintWindow(html: string, title: string): void {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
        // Popup blocked — download file instead
        const a = document.createElement("a");
        a.href = url;
        const slug = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_").toLowerCase();
        a.download = (slug || "export") + ".html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        alert("Pop-up blocked. The HTML file has been downloaded...");
        return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
}
```

**Why blob URL (not `window.open("", "_blank")`):** Opening a blank window and writing to it creates an `about:blank` page. `about:` URLs are blocked in the sandboxed iframes and in some strict-mode browser contexts. Using `URL.createObjectURL()` creates a `blob:` URL which is always valid in the same origin.

**The sandboxed iframes always blocks popups.** The fallback (download HTML file) fires automatically in that environment.

---

## 7. EPUB Export

### Structure

```
mimetype                          (uncompressed, must be first entry)
META-INF/container.xml
OEBPS/content.opf                 (OPF manifest + spine)
OEBPS/toc.ncx                     (NCX navigation — EPUB 2 compatibility)
OEBPS/style.css                   (EPUB_CSS)
OEBPS/content.html                (all segments as XHTML)
```

### `buildZip(entries)` — Pure JS ZIP implementation

Builds a valid ZIP archive without any library. Implemented from the ZIP specification:
- Local file header (30 bytes + filename)
- File data (uncompressed, method 0)
- Central directory entries
- End-of-central-directory record

Uses CRC-32 with standard polynomial `0xedb88320`.

### `buildEpub(segs, title, langMode)`

- Content document is XHTML (XML declaration, `xmlns` on `<html>`)
- OPF includes `<dc:language>pi</dc:language>` (Pāli ISO 639-3 code)
- The `dc:identifier` is `abhidhamma-export-{Date.now()}` — unique per export

### `EPUB_CSS` includes verse formatting (same as `PRINT_CSS`).

### `downloadBlob(bytes, filename, mimeType)`

Creates a temporary anchor element, sets `href` to a blob URL, triggers click, cleans up after 5 seconds.

---

## 8. Chapter Range Filtering

When exactly one part is selected and that part has TOC chapters:
- Chapter-range dropdowns appear
- `fromSegId` = `chapFromSel.value` (seg ID of the selected "from" chapter)
- `toSegId` = computed as `nextChapter.id - 1` where `nextChapter` is the chapter immediately following the "to" selection in the TOC; `null` if "to" is the last chapter (fetch all remaining segments)

`fetchWorkSegments(workId, files, fromSegId, toSegId)` fetches all chunk files sequentially and filters: `s.id >= fromSegId && s.id <= toSegId`.

---

## 9. Issue History

| Date | Issue | Fix |
|---|---|---|
| 2026-08 | `window.open("", "_blank")` created `about:blank` tab, blocked in browser pane | Changed to `URL.createObjectURL(blob)` → `window.open(blobUrl)` |
| 2026-08 | Chrome not loading updated `export.js` (ES module cache) | Created `version_js.py` to stamp `?v={hash}` on all imports post-build |
| 2026-08 | Raw HTML tags (`<b>`, `<p rend="gathalast">`) appearing as literal text in PDF/EPUB | Added `walkNode()` + `fieldHtml()` using `DOMParser` |
