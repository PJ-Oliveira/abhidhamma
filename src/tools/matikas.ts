import { settings } from "../state.js";
import { t } from "../i18n.js";
import { registerToolModule } from "./tools.js";

interface MatikaTerm {
  pali: string;
  en: string;
  pt: string;
}

interface Matika {
  id: number;
  title: string;
  titleEn?: string;
  titlePt?: string;
  terms: MatikaTerm[];
  definition?: string;
  definitionPt?: string;
}

interface MatikasData {
  tikas: Matika[];
  dukas: Matika[];
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function initMatikas(container: HTMLElement): void {
  container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;

  fetch("data/tools/matikas.json")
    .then((r) => r.json())
    .then((data: MatikasData) => {
      const lang = settings.translationLang;
      container.innerHTML = "";

      // Search
      const searchWrap = document.createElement("div");
      searchWrap.className = "mm-search-wrap";
      searchWrap.innerHTML = `<input type="text" class="mm-search" placeholder="${t("toolSearchMatikas", settings.uiLang)}" />`;
      container.appendChild(searchWrap);

      // Tabs: Tikas | Dukas
      const tabBar = document.createElement("div");
      tabBar.className = "mat-tab-bar";
      tabBar.innerHTML = `
        <button class="mat-tab active" data-section="tikas">${t("toolTikas", settings.uiLang)} (${data.tikas.length})</button>
        <button class="mat-tab" data-section="dukas">${t("toolDukas", settings.uiLang)} (${data.dukas.length})</button>
      `;
      container.appendChild(tabBar);

      // Content sections
      const tikasDiv = document.createElement("div");
      tikasDiv.className = "mat-section";
      tikasDiv.id = "mat-tikas";
      container.appendChild(tikasDiv);

      const dukasDiv = document.createElement("div");
      dukasDiv.className = "mat-section";
      dukasDiv.id = "mat-dukas";
      dukasDiv.style.display = "none";
      container.appendChild(dukasDiv);

      function renderMatika(m: Matika): string {
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

      // Tab switching
      tabBar.querySelectorAll(".mat-tab").forEach((btn) => {
        btn.addEventListener("click", () => {
          tabBar.querySelectorAll(".mat-tab").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const section = (btn as HTMLElement).dataset.section;
          tikasDiv.style.display = section === "tikas" ? "" : "none";
          dukasDiv.style.display = section === "dukas" ? "" : "none";
        });
      });

      // Search
      const input = searchWrap.querySelector("input")!;
      input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim();
        const items = container.querySelectorAll<HTMLElement>(".mat-item");
        items.forEach((el) => {
          if (!q) { el.style.display = ""; return; }
          const text = el.textContent?.toLowerCase() || "";
          const match = text.includes(q);
          el.style.display = match ? "" : "none";
          if (match) (el as HTMLDetailsElement).open = true;
        });
        // Show both sections during search
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
