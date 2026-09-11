# Bug Report

Bugs and issues found during deep code review (September 2026).

---

## BUG-001 — Service Worker caches JS files without version query string

**Severity:** High — breaks PWA offline functionality for JavaScript modules

**File:** `service-worker.js`, lines 15–28

**Description:**
The `CORE_ASSETS` list hardcodes `'./js/app.js'`, `'./js/reader.js'`, etc. However, the actual URLs requested by the browser are `./js/app.js?v=c1e87eca` (with the cache-busting hash). The service worker cache key is the full URL including query string, so the SW will never find the versioned JS files in its cache and will always fall through to the network.

**Impact:** Offline reading works for corpus data but JS modules are re-fetched on every load even when "offline" mode should serve them from cache.

**Fix:** Update `CORE_ASSETS` to include the version query string, or add the version hash dynamically during the build pipeline.

```javascript
// Current (broken):
'./js/app.js',

// Should be (after build):
'./js/app.js?v=c1e87eca',
```

---

## BUG-002 — SRS panel keyboard shortcuts never fire

**Severity:** Medium — SRS keyboard navigation completely non-functional

**File:** `src/srs.ts`, lines 382–396

**Description:**
The keyboard shortcut handler does:
```typescript
const panel = container.closest(".panel");
if (!panel || !panel.classList.contains("active")) return;
```

But `container` is `el("srs-full-body")`, which is a child of `#reader-srs` (a `.reader-overlay` div), **not** a child of `#panel-srs` (the `.panel` div). `container.closest(".panel")` returns `null`, so the condition `!panel` is always true, and all keyboard shortcuts are skipped.

**Fix:**
```typescript
// Replace the panel check with:
const srsOverlay = document.getElementById("reader-srs");
if (!srsOverlay || srsOverlay.style.display === "none") return;
```

---

## BUG-003 — SRS vocabulary data file missing

**Severity:** Medium — SRS feature entirely non-functional

**File:** `src/srs.ts`, line 139

**Description:**
`loadVocab()` fetches `data/srs/vocabulary.json`, which does not exist in the project. The SRS panel always shows "Data not available."

**Fix:** Either create `data/srs/vocabulary.json` from the dictionary data or change the fetch URL to point to an existing vocabulary source.

---

## BUG-004 — Dead code in parseHash()

**Severity:** Low — unreachable branch, no runtime effect

**File:** `src/app.ts`, lines 645–651

**Description:**
```typescript
} else if (parts.length > 0 && parts[0] !== "") {
  if (!knownPanels.has(panel) && parts.length === 3) {
     [workId, partKey, chunkIndexStr] = parts;
  }
}
```

At this point `panel` has already been set either to a known panel value from `parts.shift()` in the first `if`, or to the default `"tipitaka"`. Both are members of `knownPanels`, so `!knownPanels.has(panel)` is always `false`. This inner `if` can never execute.

**Fix:** Remove the dead branch.

---

## BUG-005 — Export title condition is always false

**Severity:** Low — cosmetic: export filename never includes part label

**File:** `src/export.ts`, line 1086

**Description:**
```typescript
const title = partKeys.length === 1 && partLabel !== t(`part_${partKeys[0]!}`, settings.uiLang)
  ? `${work.title} — ${partLabel}`
  : work.title;
```

`partLabel` is built as `t(`part_${partKey}`, settings.uiLang)` in the loop above. The condition then compares `partLabel !== t(`part_${partKeys[0]!}`, settings.uiLang)` — i.e., it compares the same value to itself. This is always `false`, so `title` is always `work.title` and the part label is never appended.

**Fix:** The intent was likely to check whether a chapter range subset was selected. Replace with a meaningful condition such as `fromSegId !== null || toSegId !== null`.

---

## BUG-006 — Clipboard writeText has no error handler

**Severity:** Low — silent failure on clipboard permission denied

**File:** `src/selection.ts`, lines 132–139

**Description:**
```typescript
navigator.clipboard.writeText(newUrl).then(() => {
  // shows ✓
});
// No .catch() handler
```

If `navigator.clipboard` is unavailable (non-HTTPS, or permission denied), the copy fails silently. The user sees no feedback.

**Fix:**
```typescript
navigator.clipboard.writeText(newUrl)
  .then(() => { linkBtn.innerHTML = "✓"; setTimeout(...); })
  .catch(() => { linkBtn.innerHTML = "✗"; setTimeout(() => linkBtn.innerHTML = origHtml, 2000); });
```

---

## BUG-007 — Font scale calculation inconsistency

**Severity:** Low — cosmetic rendering inconsistency at small viewports

**File:** `src/app.ts`, line 87

**Description:**
```typescript
document.documentElement.style.setProperty("--font-scale", String(settings.fontSize / 17));
```

The CSS uses `font-size: calc(var(--base-font) * var(--font-scale, 1))` where `--base-font: clamp(14px, 1vw + 11px, 18px)`. The scale is computed against a fixed 17 px baseline, but on narrow viewports the base font is 14 px. A user who sets `fontSize: 17` (default) will get `17/17 = 1.0` scale, resulting in `clamp(14px…) × 1.0 = 14px` on mobile — smaller than the intended 17 px.

**Fix:** Store and apply a font-size offset rather than a multiplier, or compute the scale relative to the current base font.

---

## BUG-008 — i18n fallback uses English, docs say Portuguese

**Severity:** Negligible — documentation inconsistency

**File:** `src/i18n.ts`, lines 449–451

**Description:**
The code falls back to English when a key is missing:
```typescript
return dict[key] ?? STRINGS.en[key] ?? key;
```

But `docs/01_architecture_en.md` (section 9) says: "Fallback chain: `STRINGS[uiLang][key]` → `STRINGS.pt[key]` → key itself"

**Fix:** Update the architecture doc to say English is the fallback (which makes sense as the most complete language set).

---

## BUG-009 — Tools tab uses history.replaceState instead of location.hash

**Severity:** Low — minor routing inconsistency

**File:** `src/tools/tools.ts`, lines 70–74

**Description:**
`switchTab()` calls `history.replaceState(null, "", "#/tools/{id}")` to update the URL. This does NOT trigger a `hashchange` event. The main app's `wireRouting()` only responds to `hashchange`. This means:
- URL is correctly updated when a tool tab is clicked.
- But if the user navigates via browser Back/Forward, the `hashchange` fires and the main router sees `#/tools/vithi`; it calls `switchPanel("tools")` correctly but the inner tool tab does not restore, because `syncFromUrl()` in `tools.ts` does listen to `hashchange`. Actually this works correctly for Back.
- The potential issue is if `switchPanel` is called independently from `switchTab`, the URL and state can diverge.

---

## BUG-010 — collectUsedTerms uses imprecise substring matching

**Severity:** Low — glossary may include false-positive terms

**File:** `src/export.ts`, lines 37–47

**Description:**
```typescript
const hw = headword.split(" / ")[0]!.split(" ")[0]!;  // first word only
if (!found.has(hw) && paliText.includes(hw))          // substring match
```

Short headwords (e.g., `"ma"`, `"na"`, `"ca"`) will match almost every Pāli paragraph that contains these extremely common particles. The glossary appendix will include nearly all dictionary entries.

**Fix:** Use word-boundary matching: `new RegExp("\\b" + hw + "\\b", "i").test(paliText)`.

---

## BUG-011 — Settings panel heading hardcoded in Portuguese in HTML

**Severity:** Negligible — briefly visible before JS initializes

**File:** `index.html`, line 67

**Description:**
```html
<h2 data-i18n="navSettingsTitle">Configurações</h2>
```

The hardcoded text is "Configurações" (Portuguese). Before `applyStaticI18n()` runs, English or Spanish users briefly see Portuguese text. All other panels use English hardcoded text.

**Fix:** Change to neutral placeholder like `"Settings / Configurações"` or just `"…"`.
