import { lookupPali } from "./dictionary.js";
import { settings } from "./state.js";
import { t } from "./i18n.js";
import type { CoreDictEntry, DictEntry } from "./types.js";

let currentHighlight: Element | null = null;
let selectedWordSpans: HTMLElement[] = [];
let popoverEl: HTMLElement | null = null;
let contentEl: HTMLElement | null = null;

export function initSelectionHandler(container: HTMLElement): void {
  contentEl = container;
  popoverEl = document.getElementById("selection-popover");

  container.addEventListener("mouseup", (e) => void handleMouseUp(e));

  document.addEventListener("mousedown", (e) => {
    if (!popoverEl || !contentEl) return;
    const target = e.target as Node;
    const sidePanel = document.getElementById("side-panel");
    const iconRail = document.getElementById("icon-rail");
    if (
      !popoverEl.contains(target) &&
      !contentEl.contains(target) &&
      (!sidePanel || !sidePanel.contains(target)) &&
      (!iconRail || !iconRail.contains(target))
    ) {
      clearSelection();
    }
  });
}

export function clearSelection(): void {
  if (currentHighlight) {
    currentHighlight.classList.remove("selection-counterpart");
    currentHighlight = null;
  }
  for (const span of selectedWordSpans) {
    span.classList.remove("pali-word-selected");
  }
  selectedWordSpans = [];
  if (popoverEl) popoverEl.classList.add("hidden");
}

function highlightPaliWords(words: HTMLElement[]): void {
  for (const span of selectedWordSpans) {
    span.classList.remove("pali-word-selected");
  }
  selectedWordSpans = words;
  for (const span of selectedWordSpans) {
    span.classList.add("pali-word-selected");
  }
}

function activateDictionaryTabWithWord(word: string): void {
  const cleaned = word
    .normalize("NFC")
    .replace(/[.,;:!?()\[\]"'«»“”‘’—–\-]/g, "")
    .trim();
  if (!cleaned) return;

  const sidePanel = document.getElementById("side-panel");
  const collapseBtn = document.getElementById("panel-collapse");
  if (sidePanel && sidePanel.classList.contains("collapsed")) {
    const saved = localStorage.getItem("panelW");
    const w = saved ? Math.max(120, parseInt(saved, 10)) : 280;
    document.documentElement.style.setProperty("--panel-w", `${w}px`);
    sidePanel.classList.remove("collapsed");
    if (collapseBtn) collapseBtn.textContent = "‹";
  }

  document.querySelectorAll<HTMLElement>(".rail-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.panel === "dictionary");
  });
  document.querySelectorAll<HTMLElement>(".panel").forEach((p) => {
    p.classList.toggle("active", p.id === "panel-dictionary");
  });

  const inputEl = document.getElementById("dict-search") as HTMLInputElement | null;
  if (inputEl) {
    inputEl.value = cleaned;
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (sidePanel) sidePanel.scrollTop = 0;

  window.dispatchEvent(new CustomEvent("paliWordSelected", { detail: { word: cleaned } }));
}

async function handleMouseUp(e: MouseEvent): Promise<void> {
  const targetEl = e.target instanceof Element ? e.target : null;
  if (targetEl?.closest(".bookmark-toggle, .var-note")) {
    return;
  }

  const sel = window.getSelection();
  let range: Range | null = null;
  let selectedText = "";
  let clickedWordSpan = targetEl?.closest(".pali-word") as HTMLElement | null;

  if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
    range = sel.getRangeAt(0);
    selectedText = sel.toString().trim();
  } else if (clickedWordSpan) {
    range = document.createRange();
    range.selectNodeContents(clickedWordSpan);
    selectedText = (clickedWordSpan.dataset.word || clickedWordSpan.textContent || "").trim();
  } else {
    // Tap-to-define fallback (for mobile/tablets or unwrapped text)
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY);
    } else if ((document as any).caretPositionFromPoint) {
      const pos = (document as any).caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
      const parentWord = range.startContainer.parentElement?.closest(".pali-word") as HTMLElement | null;
      if (parentWord) {
        clickedWordSpan = parentWord;
        range.selectNodeContents(parentWord);
        selectedText = (parentWord.dataset.word || parentWord.textContent || "").trim();
      } else {
        const text = range.startContainer.textContent || "";
        const offset = range.startOffset;
        const wordRegex = /[A-Za-zāīūṃṅñṭḍṇḷĀĪŪṂṄÑṬḌṆḶçéáíóúãõâêô]/i;

        if (wordRegex.test(text[offset] || text[offset - 1] || "")) {
          let start = offset;
          let end = offset;
          while (start > 0 && wordRegex.test(text[start - 1] || "")) start--;
          while (end < text.length && wordRegex.test(text[end] || "")) end++;
          if (start < end) {
            range.setStart(range.startContainer, start);
            range.setEnd(range.startContainer, end);
            selectedText = range.toString().trim();
          }
        }
      }
    }
  }

  if (!range || !selectedText) {
    clearSelection();
    return;
  }

  const startNode =
    range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer.parentElement
      : (range.startContainer as Element);
  const endContainer = range.endContainer ?? range.startContainer;
  const endNode =
    endContainer.nodeType === Node.TEXT_NODE
      ? endContainer.parentElement
      : (endContainer as Element);
  const node = clickedWordSpan ?? startNode ?? endNode;
  if (!node) {
    clearSelection();
    return;
  }

  const segDiv = (node.closest(".seg") ?? endNode?.closest(".seg")) as HTMLElement | null;
  if (!segDiv) {
    clearSelection();
    return;
  }

  const intersectedWords: HTMLElement[] = [];
  if (clickedWordSpan) {
    intersectedWords.push(clickedWordSpan);
  } else {
    const allWords = segDiv.querySelectorAll<HTMLElement>(".pali-word");
    for (const wSpan of allWords) {
      try {
        if (range.intersectsNode(wSpan)) {
          intersectedWords.push(wSpan);
        }
      } catch {
        // ignore if range is detached in test environment
      }
    }
    if (intersectedWords.length === 0) {
      const closestStart = startNode?.closest(".pali-word") as HTMLElement | null;
      const closestEnd = endNode?.closest(".pali-word") as HTMLElement | null;
      if (closestStart) intersectedWords.push(closestStart);
      else if (closestEnd) intersectedWords.push(closestEnd);
    }
  }

  const inPali =
    intersectedWords.length > 0 ||
    !!startNode?.closest(".pali-line") ||
    !!endNode?.closest(".pali-line") ||
    (!startNode?.closest(".translation-line") && !segDiv.querySelector(".pali-line"));
  const inTranslation = !inPali && (!!startNode?.closest(".translation-line") || !!endNode?.closest(".translation-line"));
  if (!inPali && !inTranslation) {
    clearSelection();
    return;
  }

  // Clear any legacy macro highlight
  if (currentHighlight) {
    currentHighlight.classList.remove("selection-counterpart");
    currentHighlight = null;
  }

  if (inPali) {
    const primaryWordSpan = intersectedWords[0] ?? clickedWordSpan ?? (node.closest(".pali-word") as HTMLElement | null);
    if (primaryWordSpan) {
      highlightPaliWords([primaryWordSpan]);
      const tokenWords = selectedText.split(/\s+/).filter(Boolean);
      if (tokenWords.length <= 1 || intersectedWords.length === 1) {
        selectedText = (primaryWordSpan.dataset.word || primaryWordSpan.textContent || selectedText).trim();
      }
    } else {
      highlightPaliWords([]);
    }

    const firstWord = selectedText
      .split(/\s+/)
      .map((w) => w.replace(/[.,;:!?()\[\]"'«»“”‘’—–\-]/g, "").trim())
      .find(Boolean);
    if (firstWord) {
      activateDictionaryTabWithWord(firstWord);
    }

    // If the left Dictionary panel exists in the UI, do not cover the text with the macro paragraph popover
    if (document.getElementById("panel-dictionary")) {
      if (popoverEl) popoverEl.classList.add("hidden");
      return;
    }
  } else {
    highlightPaliWords([]);
  }

  const rect =
    typeof range.getBoundingClientRect === "function"
      ? range.getBoundingClientRect()
      : (clickedWordSpan ?? node).getBoundingClientRect();
  await buildPopover(rect, segDiv, inPali, selectedText);
}

async function buildPopover(
  rect: DOMRect,
  segDiv: Element,
  selectedInPali: boolean,
  selectedText: string
): Promise<void> {
  if (!popoverEl) return;
  popoverEl.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.className = "sp-header";
  const label = document.createElement("span");
  label.textContent = selectedInPali
    ? t("selectionTranslLabel", settings.uiLang)
    : t("selectionPaliLabel", settings.uiLang);
  const closeBtn = document.createElement("button");
  closeBtn.className = "sp-close";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.addEventListener("click", clearSelection);

  const linkBtn = document.createElement("button");
  linkBtn.className = "sp-link-btn";
  linkBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
  linkBtn.title = t("copyLink", settings.uiLang);
  linkBtn.style.cssText = "background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:4px;display:flex;align-items:center;margin-right:8px;";
  linkBtn.addEventListener("click", () => {
    const [baseHash] = window.location.hash.split("?");
    const newUrl = `${window.location.origin}${window.location.pathname}${baseHash}?seg=${(segDiv as HTMLElement).dataset.segId}`;
    const origHtml = linkBtn.innerHTML;
    navigator.clipboard.writeText(newUrl).then(() => {
      linkBtn.innerHTML = "✓";
      setTimeout(() => { linkBtn.innerHTML = origHtml; }, 2000);
    }).catch(() => {
      linkBtn.innerHTML = "✗";
      setTimeout(() => { linkBtn.innerHTML = origHtml; }, 2000);
    });
  });

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.appendChild(linkBtn);
  btnContainer.appendChild(closeBtn);

  header.appendChild(label);
  header.appendChild(btnContainer);
  popoverEl.appendChild(header);

  // Counterpart text
  const textDiv = document.createElement("div");
  textDiv.className = "sp-text";
  let counterpartText = "";
  if (selectedInPali) {
    counterpartText = segDiv.querySelector(".translation-line")?.innerHTML?.trim() ?? "";
  } else {
    counterpartText = (segDiv as HTMLElement).dataset.pali?.trim() ?? "";
  }
  if (counterpartText) {
    textDiv.innerHTML = counterpartText;
  } else {
    textDiv.textContent = "—";
    textDiv.classList.add("sp-empty");
  }
  popoverEl.appendChild(textDiv);

  // Dictionary lookup (only for Pali selections)
  if (selectedInPali) {
    const words = selectedText.split(/\s+/).filter(Boolean).slice(0, 3);
    let hit: CoreDictEntry | DictEntry | null = null;
    for (const word of words) {
      hit = await lookupPali(word);
      if (hit) break;
    }
    if (hit) {
      const divider = document.createElement("hr");
      divider.className = "sp-divider";
      popoverEl.appendChild(divider);

      const section = document.createElement("div");
      section.className = "sp-dict-section";
      section.textContent = t("selectionDictLabel", settings.uiLang);
      popoverEl.appendChild(section);

      popoverEl.appendChild(renderDictHit(hit));
    }
  }

  positionPopover(rect);
  popoverEl.classList.remove("hidden");
}

function renderDictHit(entry: CoreDictEntry | DictEntry): HTMLElement {
  const wrap = document.createElement("div");

  const headRow = document.createElement("div");
  const headWord = document.createElement("span");
  headWord.className = "sp-dict-head";
  headWord.textContent = entry.h;
  headRow.appendChild(headWord);

  // pos from first sense (CoreDictEntry) or from entry itself (DictEntry)
  const pos = isCoreEntry(entry)
    ? (entry.senses[0]?.pos ?? "")
    : (entry.pos ?? "");
  if (pos) {
    const posSpan = document.createElement("span");
    posSpan.className = "sp-dict-pos";
    posSpan.textContent = pos;
    headRow.appendChild(posSpan);
  }
  wrap.appendChild(headRow);

  const meaning = document.createElement("div");
  meaning.className = "sp-dict-meaning";
  meaning.textContent = isCoreEntry(entry)
    ? (entry.senses[0]?.[settings.translationLang] ?? "")
    : entry[settings.translationLang];
  wrap.appendChild(meaning);

  return wrap;
}

function isCoreEntry(entry: CoreDictEntry | DictEntry): entry is CoreDictEntry {
  return "senses" in entry;
}

function positionPopover(rect: DOMRect): void {
  if (!popoverEl) return;
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const popW = popoverEl.offsetWidth || 320;
  const popH = popoverEl.offsetHeight || 200;

  let left = rect.right + 14;
  if (left + popW > vpW - 8) left = rect.left - popW - 14;
  if (left < 8) left = 8;

  let top = rect.top;
  if (top + popH > vpH - 8) top = vpH - popH - 8;
  if (top < 8) top = 8;

  popoverEl.style.left = `${left}px`;
  popoverEl.style.top = `${top}px`;
}
