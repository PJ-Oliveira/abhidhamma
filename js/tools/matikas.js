import { settings } from "../state.js?v=c1e87eca";
import { t } from "../i18n.js?v=c1e87eca";
import { registerToolModule } from "./tools.js?v=c1e87eca";
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function initMatikas(container) {
    container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;
    fetch("data/tools/matikas.json")
        .then((r) => r.json())
        .then((data) => {
        const lang = settings.translationLang;
        container.innerHTML = "";
        const searchWrap = document.createElement("div");
        searchWrap.className = "mm-search-wrap";
        searchWrap.innerHTML = `<input type="text" class="mm-search" placeholder="${t("toolSearchMatikas", settings.uiLang)}" />`;
        container.appendChild(searchWrap);
        const tabBar = document.createElement("div");
        tabBar.className = "mat-tab-bar";
        tabBar.innerHTML = `
        <button class="mat-tab active" data-section="tikas">${t("toolTikas", settings.uiLang)} (${data.tikas.length})</button>
        <button class="mat-tab" data-section="dukas">${t("toolDukas", settings.uiLang)} (${data.dukas.length})</button>
      `;
        container.appendChild(tabBar);
        const tikasDiv = document.createElement("div");
        tikasDiv.className = "mat-section";
        tikasDiv.id = "mat-tikas";
        container.appendChild(tikasDiv);
        const dukasDiv = document.createElement("div");
        dukasDiv.className = "mat-section";
        dukasDiv.id = "mat-dukas";
        dukasDiv.style.display = "none";
        container.appendChild(dukasDiv);
        function renderMatika(m) {
            const title = lang === "pt" && m.titlePt ? m.titlePt : (lang === "en" && m.titleEn ? m.titleEn : m.title);
            const def = lang === "pt" && m.definitionPt ? m.definitionPt : (m.definition || "");
            const termsHtml = m.terms.map((term) => {
                const trans = lang === "pt" ? term.pt : term.en;
                return `<div class="mat-term">
            <span class="mat-pali">${escHtml(term.pali)}</span>
            <span class="mat-trans">${escHtml(trans)}</span>
          </div>`;
            }).join("");
            return `<details class="mat-item">
          <summary class="mat-summary">
            <span class="mat-id">${m.id}.</span>
            <span class="mat-title-pali">${escHtml(m.title)}</span>
            <span class="mat-title-trans">— ${escHtml(title)}</span>
          </summary>
          <div class="mat-body">
            ${termsHtml}
            ${def ? `<p class="mat-def">${escHtml(def)}</p>` : ""}
          </div>
        </details>`;
        }
        tikasDiv.innerHTML = data.tikas.map(renderMatika).join("");
        dukasDiv.innerHTML = data.dukas.map(renderMatika).join("");
        tabBar.querySelectorAll(".mat-tab").forEach((btn) => {
            btn.addEventListener("click", () => {
                tabBar.querySelectorAll(".mat-tab").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const section = btn.dataset.section;
                tikasDiv.style.display = section === "tikas" ? "" : "none";
                dukasDiv.style.display = section === "dukas" ? "" : "none";
            });
        });
        const input = searchWrap.querySelector("input");
        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            const items = container.querySelectorAll(".mat-item");
            items.forEach((el) => {
                if (!q) {
                    el.style.display = "";
                    return;
                }
                const text = el.textContent?.toLowerCase() || "";
                const match = text.includes(q);
                el.style.display = match ? "" : "none";
                if (match)
                    el.open = true;
            });
            if (q) {
                tikasDiv.style.display = "";
                dukasDiv.style.display = "";
            }
        });
    })
        .catch(() => {
        container.innerHTML = `<div class="mm-loading">${t("srsNoData", settings.uiLang)}</div>`;
    });
}
registerToolModule("matikas", initMatikas);
//# sourceMappingURL=matikas.js.map