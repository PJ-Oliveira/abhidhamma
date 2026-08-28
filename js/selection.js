import { lookupPali } from "./dictionary.js?v=a38f104a";
import { settings } from "./state.js?v=a38f104a";
import { t } from "./i18n.js?v=a38f104a";
let currentHighlight = null;
let popoverEl = null;
let contentEl = null;
export function initSelectionHandler(container) {
    contentEl = container;
    popoverEl = document.getElementById("selection-popover");
    container.addEventListener("mouseup", (e) => void handleMouseUp(e));
    document.addEventListener("mousedown", (e) => {
        if (!popoverEl || !contentEl)
            return;
        const target = e.target;
        if (!popoverEl.contains(target) && !contentEl.contains(target)) {
            clearSelection();
        }
    });
}
export function clearSelection() {
    if (currentHighlight) {
        currentHighlight.classList.remove("selection-counterpart");
        currentHighlight = null;
    }
    if (popoverEl)
        popoverEl.classList.add("hidden");
}
async function handleMouseUp(e) {
    const sel = window.getSelection();
    let range = null;
    let selectedText = "";
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
        range = sel.getRangeAt(0);
        selectedText = sel.toString().trim();
    }
    else {
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(e.clientX, e.clientY);
        }
        else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
            if (pos) {
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
        }
        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
            const text = range.startContainer.textContent || "";
            const offset = range.startOffset;
            const wordRegex = /[A-Za-zāīūṃṅñṭḍṇḷĀĪŪṂṄÑṬḌṆḶçéáíóúãõâêô]/i;
            if (wordRegex.test(text[offset] || text[offset - 1] || "")) {
                let start = offset;
                let end = offset;
                while (start > 0 && wordRegex.test(text[start - 1] || ""))
                    start--;
                while (end < text.length && wordRegex.test(text[end] || ""))
                    end++;
                if (start < end) {
                    range.setStart(range.startContainer, start);
                    range.setEnd(range.startContainer, end);
                    selectedText = range.toString().trim();
                }
            }
        }
    }
    if (!range || !selectedText) {
        clearSelection();
        return;
    }
    const anchor = range.startContainer;
    const node = anchor.nodeType === Node.TEXT_NODE ? anchor.parentElement : anchor;
    if (!node) {
        clearSelection();
        return;
    }
    const segDiv = node.closest(".seg");
    if (!segDiv) {
        clearSelection();
        return;
    }
    const inPali = !!node.closest(".pali-line");
    const inTranslation = !!node.closest(".translation-line");
    if (!inPali && !inTranslation) {
        clearSelection();
        return;
    }
    if (currentHighlight)
        currentHighlight.classList.remove("selection-counterpart");
    const counterpartEl = inPali
        ? segDiv.querySelector(".translation-line")
        : segDiv.querySelector(".pali-line");
    if (counterpartEl) {
        counterpartEl.classList.add("selection-counterpart");
        currentHighlight = counterpartEl;
    }
    const rect = range.getBoundingClientRect();
    await buildPopover(rect, segDiv, inPali, selectedText);
}
async function buildPopover(rect, segDiv, selectedInPali, selectedText) {
    if (!popoverEl)
        return;
    popoverEl.innerHTML = "";
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
        const [baseHash] = window.location.hash.split('?');
        const newUrl = `${window.location.origin}${window.location.pathname}${baseHash}?seg=${segDiv.dataset.segId}`;
        navigator.clipboard.writeText(newUrl).then(() => {
            const origHtml = linkBtn.innerHTML;
            linkBtn.innerHTML = "✓";
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
    const textDiv = document.createElement("div");
    textDiv.className = "sp-text";
    let counterpartText = "";
    if (selectedInPali) {
        counterpartText = segDiv.querySelector(".translation-line")?.textContent?.trim() ?? "";
    }
    else {
        counterpartText = segDiv.dataset.pali?.trim() ?? "";
    }
    if (counterpartText) {
        textDiv.textContent = counterpartText;
    }
    else {
        textDiv.textContent = "—";
        textDiv.classList.add("sp-empty");
    }
    popoverEl.appendChild(textDiv);
    if (selectedInPali) {
        const words = selectedText.split(/\s+/).filter(Boolean).slice(0, 3);
        let hit = null;
        for (const word of words) {
            hit = await lookupPali(word);
            if (hit)
                break;
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
function renderDictHit(entry) {
    const wrap = document.createElement("div");
    const headRow = document.createElement("div");
    const headWord = document.createElement("span");
    headWord.className = "sp-dict-head";
    headWord.textContent = entry.h;
    headRow.appendChild(headWord);
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
function isCoreEntry(entry) {
    return "senses" in entry;
}
function positionPopover(rect) {
    if (!popoverEl)
        return;
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const popW = popoverEl.offsetWidth || 320;
    const popH = popoverEl.offsetHeight || 200;
    let left = rect.right + 14;
    if (left + popW > vpW - 8)
        left = rect.left - popW - 14;
    if (left < 8)
        left = 8;
    let top = rect.top;
    if (top + popH > vpH - 8)
        top = vpH - popH - 8;
    if (top < 8)
        top = 8;
    popoverEl.style.left = `${left}px`;
    popoverEl.style.top = `${top}px`;
}
//# sourceMappingURL=selection.js.map