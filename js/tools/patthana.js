import { settings } from "../state.js?v=8a580b00";
import { t } from "../i18n.js?v=8a580b00";
import { registerToolModule } from "./tools.js?v=8a580b00";
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function initPatthana(container) {
    container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;
    fetch("data/tools/patthana_matrix.json")
        .then((r) => r.json())
        .then((data) => {
        const lang = settings.translationLang;
        container.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "patt-wrap";
        const table = document.createElement("table");
        table.className = "patt-table";
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `<th class="patt-corner"></th>`;
        for (const cond of data.conditions) {
            headerRow.innerHTML += `<th class="patt-col-header" title="${escHtml(cond.label)} — ${escHtml(cond.labelEn)} — ${escHtml(cond.labelPt)}"><div class="patt-col-text">${escHtml(cond.id)}</div></th>`;
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        for (let i = 0; i < data.groups.length; i++) {
            const group = data.groups[i];
            const row = document.createElement("tr");
            const glabel = lang === "pt" && group.labelPt ? group.labelPt : group.label;
            row.innerHTML = `<td class="patt-row-label" title="${escHtml(group.label)}">${escHtml(glabel)}</td>`;
            const rowData = data.matrix[i] || [];
            for (let j = 0; j < data.conditions.length; j++) {
                const val = rowData[j] || 0;
                const cell = document.createElement("td");
                cell.className = val ? "patt-cell patt-yes" : "patt-cell patt-no";
                cell.textContent = val ? "●" : "";
                cell.title = `${group.label} × ${data.conditions[j].label}`;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        wrap.appendChild(table);
        container.appendChild(wrap);
    })
        .catch(() => {
        container.innerHTML = `<div class="mm-loading">${t("srsNoData", settings.uiLang)}</div>`;
    });
}
registerToolModule("patthana", initPatthana);
//# sourceMappingURL=patthana.js.map