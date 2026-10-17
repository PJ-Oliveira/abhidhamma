import { t } from "./i18n.js?v=546392a3";
import { settings } from "./state.js?v=546392a3";
import { createLogger } from "./logger.js?v=546392a3";
const log = createLogger("dictionary");
let dictData = [];
let coreData = [];
let coreByHeadword = new Map();
let formsMap = {};
let rootInfo = {};
let dictReady = false;
let loadPromise = null;
let activeDictInput = null;
let activeDictRender = null;
function altForms(headword) {
    return headword.split("/").map((s) => s.trim().toLowerCase());
}
async function ensureLoaded() {
    if (loadPromise)
        return loadPromise;
    loadPromise = (async () => {
        const loaded = [];
        let core = [];
        const byHead = new Map();
        let loadedForms = {};
        try {
            const res = await fetch("data/dictionary/pali_core.json");
            if (res.ok) {
                const data = (await res.json());
                core = data.entries ?? [];
                rootInfo = data.roots ?? {};
                loadedForms = data.forms ?? {};
                for (const entry of core) {
                    const hLower = entry.h.toLowerCase();
                    if (!byHead.has(hLower))
                        byHead.set(hLower, entry);
                    for (const alt of altForms(entry.h)) {
                        if (!byHead.has(alt))
                            byHead.set(alt, entry);
                    }
                }
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
            loaded.push(...data.entries.filter((e) => !altForms(e.h).some((f) => byHead.has(f))));
        }
        catch (err) {
            log.warn("dicionário de palavras comuns não disponível", err);
        }
        dictData = loaded;
        coreData = core;
        coreByHeadword = byHead;
        formsMap = loadedForms;
        dictReady = loaded.length > 0 || core.length > 0;
        if (!dictReady) {
            loadPromise = null;
        }
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
function resolveFormTarget(surface, target) {
    if (!target.includes("+")) {
        return coreByHeadword.get(target.toLowerCase()) ?? null;
    }
    const parts = target.split("+").filter(Boolean);
    const partEntries = parts.map((p) => ({
        part: p,
        entry: coreByHeadword.get(p.toLowerCase()) ?? null,
    }));
    const summarize = (lang) => partEntries
        .map(({ part, entry }) => {
        const gloss = entry?.senses[0]?.[lang]?.split(";")[0]?.trim();
        return gloss ? `${part} (${gloss})` : part;
    })
        .join(" + ");
    const senses = [
        {
            id: `${surface}_comp`,
            pos: "comp.",
            grammar: parts.join(" + "),
            en: summarize("en"),
            pt: summarize("pt"),
            es: summarize("es"),
        },
    ];
    const seenParts = new Set();
    for (const { part, entry } of partEntries) {
        const key = part.toLowerCase();
        if (!entry || seenParts.has(key))
            continue;
        seenParts.add(key);
        const s0 = entry.senses[0];
        if (s0) {
            const compSense = {
                id: entry.h,
                en: s0.en,
                pt: s0.pt,
                es: s0.es,
            };
            if (s0.pos)
                compSense.pos = s0.pos;
            if (s0.grammar)
                compSense.grammar = s0.grammar;
            if (s0.root)
                compSense.root = s0.root;
            if (s0.syn)
                compSense.syn = s0.syn;
            if (s0.ant)
                compSense.ant = s0.ant;
            senses.push(compSense);
        }
    }
    return {
        h: surface,
        freq: 1,
        pct: 0,
        senses,
    };
}
function lookupPaliSync(word) {
    const raw = word
        .toLowerCase()
        .normalize("NFC")
        .replace(/[.,;:!?()\[\]"'«»“”‘’—–\-]/g, "")
        .trim();
    if (!raw)
        return null;
    const cleaned = raw.replace(/^[’']+|[’']+$/g, "") || raw;
    if (cleaned.length < 2) {
        return coreByHeadword.get(cleaned) ?? null;
    }
    const candidates = normalizePali(cleaned);
    for (const q of candidates) {
        const exact = coreByHeadword.get(q);
        if (exact)
            return exact;
    }
    for (const q of candidates) {
        const target = formsMap[q];
        if (target) {
            const resolved = resolveFormTarget(cleaned, target);
            if (resolved)
                return resolved;
        }
    }
    for (const q of candidates) {
        const simpleExact = dictData.find((e) => altForms(e.h).includes(q));
        if (simpleExact)
            return simpleExact;
    }
    for (const q of candidates) {
        let best = null;
        for (const e of coreData) {
            const eh = e.h.toLowerCase();
            if (eh.length >= 4 && q.startsWith(eh)) {
                if (!best || eh.length > best.h.length)
                    best = e;
            }
        }
        if (best)
            return best;
    }
    if (cleaned.length >= 3) {
        let bestPrefix = null;
        for (const e of coreData) {
            if (e.h.toLowerCase().startsWith(cleaned)) {
                if (!bestPrefix || e.freq > bestPrefix.freq)
                    bestPrefix = e;
            }
        }
        if (bestPrefix)
            return bestPrefix;
    }
    for (const q of candidates) {
        const simple = dictData.find((e) => altForms(e.h).some((f) => f === q || q.startsWith(f) || (f.startsWith(q) && q.length >= 3)));
        if (simple)
            return simple;
    }
    return null;
}
export async function lookupPali(word) {
    await ensureLoaded();
    return lookupPaliSync(word);
}
export function showWordInDictionaryPanel(word) {
    const cleaned = word
        .normalize("NFC")
        .replace(/[.,;:!?()\[\]"'«»“”‘’—–\-]/g, "")
        .trim();
    if (!cleaned)
        return;
    const sidePanel = document.getElementById("side-panel");
    const collapseBtn = document.getElementById("panel-collapse");
    if (sidePanel && sidePanel.classList.contains("collapsed")) {
        const saved = localStorage.getItem("panelW");
        const w = saved ? Math.max(120, parseInt(saved, 10)) : 280;
        document.documentElement.style.setProperty("--panel-w", `${w}px`);
        sidePanel.classList.remove("collapsed");
        if (collapseBtn)
            collapseBtn.textContent = "‹";
    }
    document.querySelectorAll(".rail-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.panel === "dictionary");
    });
    document.querySelectorAll(".panel").forEach((p) => {
        p.classList.toggle("active", p.id === "panel-dictionary");
    });
    const inputEl = activeDictInput ?? document.getElementById("dict-search");
    if (inputEl) {
        inputEl.value = cleaned;
        if (activeDictRender) {
            activeDictRender();
        }
        else {
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
    if (sidePanel)
        sidePanel.scrollTop = 0;
}
export function initDictionaryPanel(inputEl, resultsEl) {
    activeDictInput = inputEl;
    const ready = ensureLoaded();
    const renderHint = (key) => {
        resultsEl.innerHTML = "";
        const p = document.createElement("p");
        p.className = "dict-hint";
        p.textContent = t(key, settings.uiLang);
        resultsEl.appendChild(p);
    };
    const render = () => {
        const rawInput = inputEl.value.trim();
        const query = rawInput
            .toLowerCase()
            .normalize("NFC")
            .replace(/[.,;:!?()\[\]"'«»“”‘’—–\-]/g, "")
            .trim();
        const activeBtn = document.querySelector(".rail-btn.active");
        if (activeBtn && activeBtn.dataset.panel === "dictionary") {
            const hashBase = location.hash.split("?")[0];
            if (query) {
                history.replaceState(null, "", `${hashBase}?q=${encodeURIComponent(query)}`);
            }
            else if (location.hash.includes("?q=")) {
                history.replaceState(null, "", hashBase);
            }
        }
        if (!dictReady) {
            renderHint("dictNotReady");
            void ensureLoaded().then(() => {
                if (dictReady)
                    render();
            });
            return;
        }
        if (!query) {
            renderHint("typeToSearch");
            return;
        }
        const resolvedHit = lookupPaliSync(query);
        const coreMatches = coreData
            .filter((entry) => entry.h.toLowerCase().startsWith(query))
            .sort((a, b) => {
            const aExact = a.h.toLowerCase() === query ? 1 : 0;
            const bExact = b.h.toLowerCase() === query ? 1 : 0;
            if (aExact !== bExact)
                return bExact - aExact;
            return b.freq - a.freq;
        })
            .slice(0, 60);
        const simpleMatches = dictData
            .filter((entry) => altForms(entry.h).some((form) => form.startsWith(query)))
            .sort((a, b) => (b.freq ?? 0) - (a.freq ?? 0))
            .slice(0, 40);
        if (!resolvedHit && !coreMatches.length && !simpleMatches.length) {
            renderHint("noResults");
            return;
        }
        resultsEl.innerHTML = "";
        const seenHeadwords = new Set();
        if (resolvedHit) {
            seenHeadwords.add(resolvedHit.h.toLowerCase());
            if ("senses" in resolvedHit) {
                resultsEl.appendChild(renderCoreEntry(resolvedHit));
            }
            else {
                resultsEl.appendChild(renderSimpleEntry(resolvedHit));
            }
        }
        for (const entry of coreMatches) {
            const key = entry.h.toLowerCase();
            if (seenHeadwords.has(key))
                continue;
            seenHeadwords.add(key);
            resultsEl.appendChild(renderCoreEntry(entry));
        }
        for (const entry of simpleMatches) {
            const key = entry.h.toLowerCase();
            if (seenHeadwords.has(key))
                continue;
            seenHeadwords.add(key);
            resultsEl.appendChild(renderSimpleEntry(entry));
        }
    };
    activeDictRender = render;
    inputEl.addEventListener("input", render);
    window.addEventListener("languageChanged", render);
    window.addEventListener("paliWordSelected", (e) => {
        const word = e.detail?.word;
        if (word && inputEl.value !== word) {
            inputEl.value = word;
        }
        render();
    });
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