import { settings } from "./state.js?v=e06ffa67";
import { createLogger } from "./logger.js?v=e06ffa67";
import { t } from "./i18n.js?v=e06ffa67";
const log = createLogger("reader");
const chunkCache = new Map();
export async function loadChunk(workId, partKey, fileName) {
    const cacheKey = `${workId}/${partKey}/${fileName}`;
    const cached = chunkCache.get(cacheKey);
    if (cached)
        return cached;
    const res = await fetch(`data/works/${workId}/${fileName}`);
    if (!res.ok) {
        log.error(`falha ao carregar fragmento ${cacheKey}`, res.status);
        throw new Error(`Falha ao carregar ${cacheKey}`);
    }
    const data = (await res.json());
    chunkCache.set(cacheKey, data);
    return data;
}
export function renderSegments(segments, container, options = {}) {
    const { onNoteHover, onBookmarkToggle, isBookmarked } = options;
    container.innerHTML = "";
    const lang = options.effectiveLang ?? settings.translationLang;
    for (const seg of segments) {
        const div = document.createElement("div");
        div.className = "seg";
        div.dataset.rend = seg.rend;
        div.dataset.segId = String(seg.id);
        div.dataset.pali = seg.pali || "";
        if (!settings.showTranslation)
            div.classList.add("no-translation");
        if (!settings.showPali)
            div.classList.add("no-pali");
        const paliLine = document.createElement("div");
        paliLine.className = "pali-line";
        if (seg.paranum) {
            const badge = document.createElement("span");
            badge.className = "paranum-badge";
            badge.textContent = seg.paranum;
            paliLine.appendChild(badge);
        }
        const paliText = document.createElement("span");
        paliText.innerHTML = seg.pali || "";
        paliLine.appendChild(paliText);
        const bookmarkBtn = document.createElement("button");
        bookmarkBtn.className = "bookmark-toggle";
        bookmarkBtn.title = t("bookmarkParagraph", settings.uiLang);
        bookmarkBtn.style.cssText =
            "border:none;background:none;cursor:pointer;color:var(--text-muted);float:right;font-size:.85em;";
        bookmarkBtn.textContent = isBookmarked?.(seg.id) ? "★" : "☆";
        bookmarkBtn.addEventListener("click", () => {
            if (!onBookmarkToggle)
                return;
            const active = onBookmarkToggle(seg);
            bookmarkBtn.textContent = active ? "★" : "☆";
        });
        paliLine.appendChild(bookmarkBtn);
        div.appendChild(paliLine);
        const translationLine = document.createElement("div");
        translationLine.className = "translation-line";
        const translText = seg[lang] || "";
        translationLine.innerHTML = translText;
        div.appendChild(translationLine);
        if (!translText)
            translationLine.style.display = "none";
        container.appendChild(div);
        div.querySelectorAll(".var-note").forEach((sup) => {
            sup.addEventListener("mouseenter", (evt) => {
                const idx = Number(sup.dataset.note);
                const noteText = (seg.notes ?? [])[idx];
                if (noteText)
                    onNoteHover?.(evt, noteText);
            });
            sup.addEventListener("mouseleave", () => onNoteHover?.(null));
        });
    }
}
//# sourceMappingURL=reader.js.map