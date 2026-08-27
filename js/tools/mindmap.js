import { settings } from "../state.js?v=8a580b00";
import { t } from "../i18n.js?v=8a580b00";
import { registerToolModule } from "./tools.js?v=8a580b00";
function getLabel(n) {
    const lang = settings.translationLang;
    if (lang === "pt" && n.labelPt)
        return n.labelPt;
    if (lang === "en" && n.labelEn)
        return n.labelEn;
    return n.label;
}
function getDesc(n) {
    const lang = settings.translationLang;
    if (lang === "pt" && n.descPt)
        return n.descPt;
    return n.desc || "";
}
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function buildTree(node, depth) {
    const hasChildren = node.children && node.children.length > 0;
    const paliLabel = escHtml(node.label);
    const transLabel = escHtml(getLabel(node));
    const desc = getDesc(node);
    const countBadge = node.count ? `<span class="mm-count">${node.count}</span>` : "";
    const showBoth = paliLabel !== transLabel;
    const labelHtml = showBoth
        ? `<span class="mm-pali">${paliLabel}</span> <span class="mm-trans">— ${transLabel}</span>`
        : `<span class="mm-pali">${paliLabel}</span>`;
    if (!hasChildren) {
        return `<li class="mm-leaf">
      <span class="mm-node mm-depth-${Math.min(depth, 4)}">
        <span class="mm-bullet">●</span>
        ${labelHtml} ${countBadge}
        ${desc ? `<span class="mm-desc">${escHtml(desc)}</span>` : ""}
      </span>
    </li>`;
    }
    const childrenHtml = node.children.map((c) => buildTree(c, depth + 1)).join("");
    const expanded = depth < 2;
    return `<li class="mm-branch">
    <details ${expanded ? "open" : ""}>
      <summary class="mm-node mm-depth-${Math.min(depth, 4)}">
        ${labelHtml} ${countBadge}
        ${desc ? `<span class="mm-desc">${escHtml(desc)}</span>` : ""}
      </summary>
      <ul class="mm-children">${childrenHtml}</ul>
    </details>
  </li>`;
}
function initMindmap(container) {
    container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;
    fetch("data/tools/mindmap.json")
        .then((r) => r.json())
        .then((data) => {
        const searchWrap = document.createElement("div");
        searchWrap.className = "mm-search-wrap";
        searchWrap.innerHTML = `<input type="text" class="mm-search" placeholder="${t("toolSearchMindmap", settings.uiLang)}" />`;
        const tree = document.createElement("ul");
        tree.className = "mm-tree";
        tree.innerHTML = buildTree(data.root, 0);
        container.innerHTML = "";
        container.appendChild(searchWrap);
        container.appendChild(tree);
        const input = searchWrap.querySelector("input");
        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            const items = tree.querySelectorAll(".mm-node");
            if (!q) {
                items.forEach((el) => { el.closest("li").style.display = ""; });
                return;
            }
            items.forEach((el) => {
                const text = el.textContent?.toLowerCase() || "";
                const match = text.includes(q);
                el.closest("li").style.display = match ? "" : "none";
                if (match) {
                    let parent = el.closest("details");
                    while (parent) {
                        parent.open = true;
                        parent = parent.parentElement?.closest("details") || null;
                    }
                }
            });
        });
    })
        .catch(() => {
        container.innerHTML = `<div class="mm-loading">${t("srsNoData", settings.uiLang)}</div>`;
    });
}
registerToolModule("mindmap", initMindmap);
//# sourceMappingURL=mindmap.js.map