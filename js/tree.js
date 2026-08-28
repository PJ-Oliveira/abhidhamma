import { t } from "./i18n.js?v=a38f104a";
import { settings } from "./state.js?v=a38f104a";
const GROUP_ORDER = ["abhidhamma", "outros", "visuddhimagga", "comentarios"];
export function renderTree(manifest, container, onSelect) {
    container.innerHTML = "";
    const root = document.createElement("ul");
    for (const group of GROUP_ORDER) {
        const works = manifest.groups[group];
        if (!works || !works.length)
            continue;
        const groupLi = document.createElement("li");
        const groupTitle = document.createElement("div");
        groupTitle.className = "group-title";
        groupTitle.textContent = t(`groupTitle_${group}`, settings.uiLang);
        groupLi.appendChild(groupTitle);
        const workUl = document.createElement("ul");
        for (const work of works) {
            workUl.appendChild(buildWorkNode(work, onSelect));
        }
        groupLi.appendChild(workUl);
        root.appendChild(groupLi);
    }
    container.appendChild(root);
}
function buildWorkNode(work, onSelect) {
    const li = document.createElement("li");
    const label = document.createElement("div");
    label.className = "node-label";
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.textContent = "▸";
    label.appendChild(caret);
    const text = document.createElement("span");
    text.textContent = work.title;
    label.appendChild(text);
    const partsUl = document.createElement("ul");
    partsUl.style.display = "none";
    for (const partKey of Object.keys(work.parts)) {
        const part = work.parts[partKey];
        if (!part)
            continue;
        const partLi = document.createElement("li");
        const partLabel = document.createElement("div");
        partLabel.className = "node-label leaf";
        partLabel.dataset.workId = work.id;
        partLabel.dataset.partKey = partKey;
        partLabel.textContent = t(`part_${partKey}`, settings.uiLang) || part.label;
        partLabel.addEventListener("click", () => onSelect(work.id, partKey, 0, null));
        partLi.appendChild(partLabel);
        partsUl.appendChild(partLi);
    }
    label.addEventListener("click", () => {
        const open = partsUl.style.display !== "none";
        partsUl.style.display = open ? "none" : "block";
        caret.classList.toggle("open", !open);
    });
    li.appendChild(label);
    li.appendChild(partsUl);
    return li;
}
export function markActiveLeaf(container, workId, partKey) {
    container.querySelectorAll(".node-label.leaf-active").forEach((el) => {
        el.classList.remove("leaf-active");
    });
    const el = container.querySelector(`.node-label.leaf[data-work-id="${workId}"][data-part-key="${partKey}"]`);
    if (!el)
        return;
    el.classList.add("leaf-active");
    let parent = el.closest("ul");
    while (parent && parent !== container) {
        parent.style.display = "block";
        const parentLi = parent.closest("li");
        const parentCaret = parentLi?.querySelector(".caret");
        parentCaret?.classList.add("open");
        parent = parentLi?.parentElement?.closest("ul") ?? null;
    }
}
//# sourceMappingURL=tree.js.map