import { settings } from "../state.js?v=c1e87eca";
import { t } from "../i18n.js?v=c1e87eca";
import { registerToolModule } from "./tools.js?v=c1e87eca";
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function initCetasika(container) {
    container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;
    fetch("data/tools/citta_cetasika.json")
        .then((r) => r.json())
        .then((data) => {
        const lang = settings.translationLang;
        container.innerHTML = "";
        const modeBar = document.createElement("div");
        modeBar.className = "cet-mode-bar";
        modeBar.innerHTML = `
        <button class="cet-mode-btn active" data-mode="single">${t("toolCetSingle", settings.uiLang)}</button>
        <button class="cet-mode-btn" data-mode="compare">${t("toolCetCompare", settings.uiLang)}</button>
      `;
        container.appendChild(modeBar);
        const singleView = document.createElement("div");
        singleView.className = "cet-single";
        container.appendChild(singleView);
        const compareView = document.createElement("div");
        compareView.className = "cet-compare";
        compareView.style.display = "none";
        container.appendChild(compareView);
        modeBar.querySelectorAll(".cet-mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                modeBar.querySelectorAll(".cet-mode-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                const mode = btn.dataset.mode;
                singleView.style.display = mode === "single" ? "" : "none";
                compareView.style.display = mode === "compare" ? "" : "none";
            });
        });
        function getCittaLabel(c) {
            if (lang === "pt" && c.namePt)
                return c.namePt;
            if (lang === "en" && c.nameEn)
                return c.nameEn;
            return c.name;
        }
        function getCetLabel(c) {
            if (lang === "pt" && c.namePt)
                return c.namePt;
            if (lang === "en" && c.nameEn)
                return c.nameEn;
            return c.name;
        }
        function buildSelect(parentEl, onChange) {
            const sel = document.createElement("select");
            sel.className = "cet-select";
            sel.innerHTML = `<option value="">${t("toolCetSelect", settings.uiLang)}</option>`;
            const categories = [...new Set(data.cittas.map((c) => c.category))];
            for (const cat of categories) {
                const group = document.createElement("optgroup");
                group.label = cat;
                data.cittas.filter((c) => c.category === cat).forEach((c) => {
                    const opt = document.createElement("option");
                    opt.value = String(c.id);
                    opt.textContent = `${c.name} — ${getCittaLabel(c)}`;
                    group.appendChild(opt);
                });
                sel.appendChild(group);
            }
            sel.addEventListener("change", () => {
                const citta = data.cittas.find((c) => c.id === parseInt(sel.value, 10));
                if (citta)
                    onChange(citta);
            });
            parentEl.appendChild(sel);
        }
        function renderChecklist(citta) {
            const cetasikaSet = new Set(citta.cetasikaIds);
            let html = `<div class="cet-count">${citta.cetasikaIds.length} cetasikas</div>`;
            for (const group of data.groups) {
                const glabel = lang === "pt" && group.labelPt ? group.labelPt : (lang === "en" && group.labelEn ? group.labelEn : group.label);
                html += `<div class="cet-group-header">${escHtml(group.label)} — ${escHtml(glabel)}</div>`;
                html += `<div class="cet-grid">`;
                for (const cet of data.cetasikas.filter((c) => c.group === group.id)) {
                    const has = cetasikaSet.has(cet.id);
                    const cls = has ? "cet-item cet-yes" : "cet-item cet-no";
                    html += `<div class="${cls}">
              <span class="cet-check">${has ? "✓" : "✗"}</span>
              <span class="cet-name">${escHtml(cet.name)}</span>
              <span class="cet-trans">${escHtml(getCetLabel(cet))}</span>
            </div>`;
                }
                html += `</div>`;
            }
            return html;
        }
        const singleSelWrap = document.createElement("div");
        singleSelWrap.className = "cet-sel-wrap";
        singleView.appendChild(singleSelWrap);
        const singleResult = document.createElement("div");
        singleResult.className = "cet-result";
        singleView.appendChild(singleResult);
        buildSelect(singleSelWrap, (citta) => {
            singleResult.innerHTML = renderChecklist(citta);
        });
        const compWrap = document.createElement("div");
        compWrap.className = "cet-comp-wrap";
        compareView.appendChild(compWrap);
        const colA = document.createElement("div");
        colA.className = "cet-comp-col";
        const colB = document.createElement("div");
        colB.className = "cet-comp-col";
        compWrap.appendChild(colA);
        compWrap.appendChild(colB);
        const compResult = document.createElement("div");
        compResult.className = "cet-comp-result";
        compareView.appendChild(compResult);
        let cittaA = null;
        let cittaB = null;
        function renderComparison() {
            if (!cittaA || !cittaB)
                return;
            const setA = new Set(cittaA.cetasikaIds);
            const setB = new Set(cittaB.cetasikaIds);
            const common = data.cetasikas.filter((c) => setA.has(c.id) && setB.has(c.id));
            const onlyA = data.cetasikas.filter((c) => setA.has(c.id) && !setB.has(c.id));
            const onlyB = data.cetasikas.filter((c) => !setA.has(c.id) && setB.has(c.id));
            const lang = settings.translationLang;
            const renderList = (items, cls) => items.map((c) => {
                const trans = lang === "pt" ? c.namePt : c.nameEn;
                return `<span class="cet-tag ${cls}">
            <span class="cet-tag-pali">${escHtml(c.name)}</span>
            <span class="cet-tag-trans">${escHtml(trans)}</span>
          </span>`;
            }).join(" ");
            compResult.innerHTML = `
          <div class="cet-comp-section">
            <h4 class="cet-comp-title cet-common">${t("toolCetCommon", settings.uiLang)} (${common.length})</h4>
            <div>${renderList(common, "cet-tag-common")}</div>
          </div>
          <div class="cet-comp-section">
            <h4 class="cet-comp-title cet-only-a">${t("toolCetOnlyA", settings.uiLang)} (${onlyA.length})</h4>
            <div>${renderList(onlyA, "cet-tag-a")}</div>
          </div>
          <div class="cet-comp-section">
            <h4 class="cet-comp-title cet-only-b">${t("toolCetOnlyB", settings.uiLang)} (${onlyB.length})</h4>
            <div>${renderList(onlyB, "cet-tag-b")}</div>
          </div>
        `;
        }
        buildSelect(colA, (c) => { cittaA = c; renderComparison(); });
        buildSelect(colB, (c) => { cittaB = c; renderComparison(); });
    })
        .catch(() => {
        container.innerHTML = `<div class="mm-loading">${t("srsNoData", settings.uiLang)}</div>`;
    });
}
registerToolModule("cetasika", initCetasika);
//# sourceMappingURL=cetasika.js.map