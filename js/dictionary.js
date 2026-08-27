import { t } from "./i18n.js?v=8a580b00";
import { settings } from "./state.js?v=8a580b00";
import { createLogger } from "./logger.js?v=8a580b00";
const log = createLogger("dictionary");
let dictData = [];
let coreData = [];
let rootInfo = {};
let dictReady = false;
let loadPromise = null;
function altForms(headword) {
    return headword.split("/").map((s) => s.trim().toLowerCase());
}
async function ensureLoaded() {
    if (loadPromise)
        return loadPromise;
    loadPromise = (async () => {
        const loaded = [];
        let core = [];
        try {
            const res = await fetch("data/dictionary/pali_core.json");
            if (res.ok) {
                const data = (await res.json());
                core = data.entries;
                rootInfo = data.roots;
            }
        }
        catch (err) {
            log.warn("dicionário rigoroso (pali_core.json) não disponível", err);
        }
        try {
            const res = await fetch("data/dictionary/common_pali.json");
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const data = (await res.json());
            const coreHeadwords = new Set(core.map((e) => e.h.toLowerCase()));
            loaded.push(...data.entries.filter((e) => !altForms(e.h).some((f) => coreHeadwords.has(f))));
        }
        catch (err) {
            log.warn("dicionário de palavras comuns não disponível", err);
        }
        dictData = loaded;
        coreData = core;
        dictReady = loaded.length > 0 || core.length > 0;
    })();
    return loadPromise;
}
const SUPPLETIVE = {
    nti: "ti",
    hotī: "hoti",
    bhikkhave: "bhikkhu",
    no: "na",
    ceva: "ca",
    cāti: "ca",
    so: "ta", sā: "ta", taṃ: "ta", tassa: "ta", tena: "ta",
    tesaṃ: "ta", te: "ta", tehi: "ta", tesu: "ta", tasmā: "ta",
    tāya: "ta", tāsaṃ: "ta", tā: "ta", tāhi: "ta", tāsu: "ta",
    tāni: "ta", tato: "ta", tattha: "ta", tasmiṃ: "ta",
    yo: "ya", yā: "ya", yaṃ: "ya", yassa: "ya", yena: "ya",
    yesaṃ: "ya", ye: "ya", yehi: "ya", yesu: "ya", yasmā: "ya",
    yāya: "ya", yāsaṃ: "ya", yāhi: "ya", yāsu: "ya", yāni: "ya",
    yato: "ya", yattha: "ya", yasmiṃ: "ya",
    ayaṃ: "ima", idaṃ: "ima", imaṃ: "ima", imassa: "ima", iminā: "ima",
    ime: "ima", imehi: "ima", imesu: "ima", imesaṃ: "ima", imāni: "ima",
    imasmā: "ima", imāsaṃ: "ima", imā: "ima", imāhi: "ima", imāsu: "ima",
    ahaṃ: "aha", mama: "aha", mayā: "aha", amhākaṃ: "aha",
    me: "aha",
    kiṃ: "ka", kathaṃ: "ka", kasmā: "ka", keci: "ka",
    cā: "ca", neva: "eva",
    eso: "esa", eseva: "esa",
    etena: "esa", etaṃ: "esa", ete: "esa", etesaṃ: "esa", etehi: "esa",
    etassa: "esa", etāya: "esa", etāsaṃ: "esa",
    tassā: "ta",
    arahā: "arahant",
    natthīti: "natthi",
    nonatthiyā: "natthi",
    bhagavatā: "bhagavant", bhagavato: "bhagavant",
    arahato: "arahant",
    tayo: "ti", tīṇi: "ti", tīhi: "ti", tiṇṇaṃ: "ti", tīsu: "ti",
    cattāro: "catu", cattāri: "catu", catunnaṃ: "catu", catūsu: "catu",
    dve: "dvi", dvinnaṃ: "dvi", dvīhi: "dvi", dvīsu: "dvi",
};
export function normalizePali(token) {
    const forms = new Set([token]);
    const supp = SUPPLETIVE[token];
    if (supp)
        forms.add(supp);
    if (token.endsWith("o") && token.length > 2)
        forms.add(token.slice(0, -1) + "a");
    if (token.endsWith("ānaṃ") && token.length > 5)
        forms.add(token.slice(0, -4) + "a");
    if (token.endsWith("ā") && token.length > 3)
        forms.add(token.slice(0, -1) + "a");
    if (token.endsWith("e") && token.length > 3)
        forms.add(token.slice(0, -1) + "a");
    if (token.endsWith("ena") && token.length > 5)
        forms.add(token.slice(0, -3) + "a");
    if (token.endsWith("ū") && token.length > 2)
        forms.add(token.slice(0, -1) + "u");
    if (token.endsWith("tīti") && token.length > 5)
        forms.add(token.slice(0, -4) + "ti");
    if (token.endsWith("nti") && token.length > 3)
        forms.add(token.slice(0, -3) + "ti");
    if (token.endsWith("ehi") && token.length > 5)
        forms.add(token.slice(0, -3) + "a");
    if (token.endsWith("ūhi") && token.length > 5)
        forms.add(token.slice(0, -3) + "u");
    if (token.endsWith("esaṃ") && token.length > 6)
        forms.add(token.slice(0, -4) + "a");
    if (token.endsWith("āya") && token.length > 5) {
        forms.add(token.slice(0, -3) + "ā");
        forms.add(token.slice(0, -3) + "a");
    }
    if (token.endsWith("ī") && token.length > 3)
        forms.add(token.slice(0, -1) + "i");
    if (token.startsWith("na") && token.length > 5) {
        const rest = token.slice(2);
        forms.add(rest);
        if (rest.endsWith("e") && rest.length > 3)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("ā") && rest.length > 3)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("o") && rest.length > 2)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("ena") && rest.length > 5)
            forms.add(rest.slice(0, -3) + "a");
        if (rest.endsWith("ehi") && rest.length > 5)
            forms.add(rest.slice(0, -3) + "a");
        if (rest.endsWith("ānaṃ") && rest.length > 5)
            forms.add(rest.slice(0, -4) + "a");
    }
    if (token.startsWith("neva") && token.length > 7) {
        const rest = token.slice(4);
        forms.add(rest);
        if (rest.endsWith("e") && rest.length > 3)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("ā") && rest.length > 3)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("o") && rest.length > 2)
            forms.add(rest.slice(0, -1) + "a");
        if (rest.endsWith("ena") && rest.length > 5)
            forms.add(rest.slice(0, -3) + "a");
        if (rest.endsWith("ehi") && rest.length > 5)
            forms.add(rest.slice(0, -3) + "a");
    }
    return [...forms];
}
export async function lookupPali(word) {
    await ensureLoaded();
    const raw = word
        .toLowerCase()
        .normalize("NFC")
        .replace(/[.,;:!?()\[\]"']/g, "")
        .trim();
    if (!raw || raw.length < 2)
        return null;
    const candidates = normalizePali(raw);
    for (const q of candidates) {
        const exact = coreData.find((e) => e.h.toLowerCase() === q);
        if (exact)
            return exact;
    }
    for (const q of candidates) {
        const inflected = coreData
            .filter((e) => q.startsWith(e.h.toLowerCase()) && e.h.length >= 3)
            .sort((a, b) => b.h.length - a.h.length);
        if (inflected.length > 0)
            return inflected[0] ?? null;
    }
    if (raw.length >= 3) {
        const prefix = coreData
            .filter((e) => e.h.toLowerCase().startsWith(raw))
            .sort((a, b) => b.freq - a.freq);
        if (prefix.length > 0)
            return prefix[0] ?? null;
    }
    for (const q of candidates) {
        const simple = dictData.find((e) => altForms(e.h).some((f) => f === q || q.startsWith(f) || (f.startsWith(q) && q.length >= 3)));
        if (simple)
            return simple;
    }
    return null;
}
export function initDictionaryPanel(inputEl, resultsEl) {
    const ready = ensureLoaded();
    const renderHint = (key) => {
        resultsEl.innerHTML = "";
        const p = document.createElement("p");
        p.className = "dict-hint";
        p.textContent = t(key, settings.uiLang);
        resultsEl.appendChild(p);
    };
    const render = () => {
        const query = inputEl.value.trim().toLowerCase();
        if (!dictReady) {
            renderHint("dictNotReady");
            return;
        }
        if (!query) {
            renderHint("typeToSearch");
            return;
        }
        const coreMatches = coreData
            .filter((entry) => entry.h.toLowerCase().startsWith(query))
            .sort((a, b) => b.freq - a.freq);
        const simpleMatches = dictData
            .filter((entry) => altForms(entry.h).some((form) => form.startsWith(query)))
            .sort((a, b) => (b.freq ?? 0) - (a.freq ?? 0))
            .slice(0, 100);
        if (!coreMatches.length && !simpleMatches.length) {
            renderHint("noResults");
            return;
        }
        resultsEl.innerHTML = "";
        for (const entry of coreMatches) {
            resultsEl.appendChild(renderCoreEntry(entry));
        }
        for (const entry of simpleMatches) {
            resultsEl.appendChild(renderSimpleEntry(entry));
        }
    };
    inputEl.addEventListener("input", render);
    void ready.then(render);
    render();
}
function renderSimpleEntry(entry) {
    const div = document.createElement("div");
    div.className = "dict-entry";
    const headRow = document.createElement("div");
    headRow.className = "headword";
    headRow.textContent = entry.h;
    if (entry.pos) {
        const pos = document.createElement("span");
        pos.className = "pos";
        pos.textContent = entry.pos;
        headRow.appendChild(pos);
    }
    div.appendChild(headRow);
    const meaning = document.createElement("div");
    meaning.className = "meaning";
    meaning.textContent = entry[settings.translationLang];
    div.appendChild(meaning);
    if (entry.root) {
        div.appendChild(dictField(t("dictRoot", settings.uiLang), entry.root));
    }
    if (entry.syn?.length) {
        div.appendChild(dictField(t("dictSynonyms", settings.uiLang), entry.syn.join(", ")));
    }
    if (entry.usage) {
        div.appendChild(dictField(t("dictUsage", settings.uiLang), entry.usage));
    }
    if (entry.freq) {
        div.appendChild(dictField(t("dictFreq", settings.uiLang), String(entry.freq)));
    }
    return div;
}
function renderCoreEntry(entry) {
    const div = document.createElement("div");
    div.className = "dict-entry dict-entry-core";
    const headRow = document.createElement("div");
    headRow.className = "headword";
    headRow.textContent = entry.h;
    const pctBadge = document.createElement("span");
    pctBadge.className = "pos";
    pctBadge.textContent = `${entry.freq}× · ${entry.pct.toFixed(2)}%`;
    headRow.appendChild(pctBadge);
    div.appendChild(headRow);
    const senseList = document.createElement("div");
    senseList.className = "dict-senses";
    for (const sense of entry.senses) {
        const senseDiv = document.createElement("div");
        senseDiv.className = "dict-sense";
        const senseHead = document.createElement("div");
        senseHead.className = "dict-sense-head";
        const idSpan = document.createElement("span");
        idSpan.className = "dict-sense-id";
        idSpan.textContent = sense.id;
        senseHead.appendChild(idSpan);
        if (sense.pos) {
            const pos = document.createElement("span");
            pos.className = "pos";
            pos.textContent = sense.pos;
            senseHead.appendChild(pos);
        }
        senseDiv.appendChild(senseHead);
        if (sense.grammar) {
            senseDiv.appendChild(dictField(t("dictGrammar", settings.uiLang), sense.grammar));
        }
        const meaning = document.createElement("div");
        meaning.className = "meaning";
        meaning.textContent = sense[settings.translationLang];
        senseDiv.appendChild(meaning);
        if (sense.root) {
            const root = rootInfo[sense.root];
            if (root) {
                let text = `${sense.root} — ${root[settings.translationLang]}`;
                if (root.sanskrit) {
                    const skMeaning = root[`sanskrit_${settings.translationLang}`];
                    text += ` (skt. ${root.sanskrit}${skMeaning ? " — " + skMeaning : ""})`;
                }
                senseDiv.appendChild(dictField(t("dictRoot", settings.uiLang), text));
            }
            else {
                senseDiv.appendChild(dictField(t("dictRoot", settings.uiLang), sense.root));
            }
        }
        if (sense.syn) {
            senseDiv.appendChild(dictField(t("dictSynonyms", settings.uiLang), sense.syn));
        }
        if (sense.ant) {
            senseDiv.appendChild(dictField(t("dictAntonyms", settings.uiLang), sense.ant));
        }
        senseList.appendChild(senseDiv);
    }
    div.appendChild(senseList);
    if (entry.usage) {
        div.appendChild(dictField(t("dictUsage", settings.uiLang), entry.usage));
    }
    div.appendChild(dictField(t("dictFreq", settings.uiLang), String(entry.freq)));
    div.appendChild(dictField(t("dictPct", settings.uiLang), `${entry.pct.toFixed(2)}%`));
    return div;
}
function dictField(label, value) {
    const p = document.createElement("div");
    p.className = "dict-field";
    const strong = document.createElement("span");
    strong.className = "dict-field-label";
    strong.textContent = `${label}: `;
    p.appendChild(strong);
    p.appendChild(document.createTextNode(value));
    return p;
}
//# sourceMappingURL=dictionary.js.map