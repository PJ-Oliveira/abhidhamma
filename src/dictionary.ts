import { t } from "./i18n.js";
import { settings } from "./state.js";
import { createLogger } from "./logger.js";
import type { CommonDictData, CoreDictData, CoreDictEntry, DictEntry, DictRootInfo } from "./types.js";

const log = createLogger("dictionary");

let dictData: DictEntry[] = [];
let coreData: CoreDictEntry[] = [];
let rootInfo: Record<string, DictRootInfo> = {};
let dictReady = false;
let loadPromise: Promise<void> | null = null;

function altForms(headword: string): string[] {
  return headword.split("/").map((s) => s.trim().toLowerCase());
}

async function ensureLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const loaded: DictEntry[] = [];
    let core: CoreDictEntry[] = [];
    try {
      const res = await fetch("data/dictionary/pali_core.json");
      if (res.ok) {
        const data = (await res.json()) as CoreDictData;
        core = data.entries;
        rootInfo = data.roots;
      }
    } catch (err) {
      log.warn("dicionário rigoroso (pali_core.json) não disponível", err);
    }
    try {
      const res = await fetch("data/dictionary/common_pali.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as CommonDictData;
      const coreHeadwords = new Set(core.map((e) => e.h.toLowerCase()));
      loaded.push(...data.entries.filter((e) => !altForms(e.h).some((f) => coreHeadwords.has(f))));
    } catch (err) {
      log.warn("dicionário de palavras comuns não disponível", err);
    }
    dictData = loaded;
    coreData = core;
    dictReady = loaded.length > 0 || core.length > 0;
  })();
  return loadPromise;
}

// Suppletive and sandhi forms that cannot be recovered by morphological rules alone.
const SUPPLETIVE: Record<string, string> = {
  // iti quotative in sandhi: sammāsambuddha''nti → ti
  nti: "ti",
  // Sandhi/irregular verb forms
  hotī: "hoti",
  // Vocative
  bhikkhave: "bhikkhu",
  // Negation particle / 1st pl. pronoun
  no: "na",
  // Connective sandhi: ca + eva, ca + iti
  ceva: "ca",
  cāti: "ca",
  // ta (demonstrative / 3rd pers. he/she/it/that)
  so: "ta", sā: "ta", taṃ: "ta", tassa: "ta", tena: "ta",
  tesaṃ: "ta", te: "ta", tehi: "ta", tesu: "ta", tasmā: "ta",
  tāya: "ta", tāsaṃ: "ta", tā: "ta", tāhi: "ta", tāsu: "ta",
  tāni: "ta", tato: "ta", tattha: "ta", tasmiṃ: "ta",
  // ya (relative pronoun: who/which/that)
  yo: "ya", yā: "ya", yaṃ: "ya", yassa: "ya", yena: "ya",
  yesaṃ: "ya", ye: "ya", yehi: "ya", yesu: "ya", yasmā: "ya",
  yāya: "ya", yāsaṃ: "ya", yāhi: "ya", yāsu: "ya", yāni: "ya",
  yato: "ya", yattha: "ya", yasmiṃ: "ya",
  // ima (proximal demonstrative: this)
  ayaṃ: "ima", idaṃ: "ima", imaṃ: "ima", imassa: "ima", iminā: "ima",
  ime: "ima", imehi: "ima", imesu: "ima", imesaṃ: "ima", imāni: "ima",
  imasmā: "ima", imāsaṃ: "ima", imā: "ima", imāhi: "ima", imāsu: "ima",
  // aha (1st pers. sg.: I/me)
  ahaṃ: "aha", mama: "aha", mayā: "aha", amhākaṃ: "aha",
  me: "aha",
  // ka (interrogative: who?/what?)
  kiṃ: "ka", kathaṃ: "ka", kasmā: "ka", keci: "ka",
  // Short sandhi / 2-char forms
  cā: "ca", neva: "eva",
  // esa/eta (demonstrative: this/that) — all case forms
  eso: "esa", eseva: "esa",
  etena: "esa", etaṃ: "esa", ete: "esa", etesaṃ: "esa", etehi: "esa",
  etassa: "esa", etāya: "esa", etāsaṃ: "esa",
  tassā: "ta",
  arahā: "arahant",
  // iti-sandhi on non-ti-final stems: natthīti → natthi
  natthīti: "natthi",
  // Paṭṭhāna nonatthiyā: no + natthiyā (abl. of natthi)
  nonatthiyā: "natthi",
  // vant-stem suppletive: bhagavant, arahant
  bhagavatā: "bhagavant", bhagavato: "bhagavant",
  arahato: "arahant",
  // Numerals: ti (three), catu (four), dvi (two)
  tayo: "ti", tīṇi: "ti", tīhi: "ti", tiṇṇaṃ: "ti", tīsu: "ti",
  cattāro: "catu", cattāri: "catu", catunnaṃ: "catu", catūsu: "catu",
  dve: "dvi", dvinnaṃ: "dvi", dvīhi: "dvi", dvīsu: "dvi",
};

// Generate candidate lemma forms by stripping standard Pali inflectional endings.
// Order matters: original form is tried first, then normalised forms.
export function normalizePali(token: string): string[] {
  const forms = new Set<string>([token]);

  // Phase 0: suppletive / sandhi lookup
  const supp = SUPPLETIVE[token];
  if (supp) forms.add(supp);

  // Masc./nt. a-stem nom. sg.: paccayo → paccaya
  if (token.endsWith("o") && token.length > 2)
    forms.add(token.slice(0, -1) + "a");

  // a-stem gen. pl.: dhammānaṃ → dhamma
  if (token.endsWith("ānaṃ") && token.length > 5)
    forms.add(token.slice(0, -4) + "a");

  // a-stem nom./voc. pl.: dhammā → dhamma
  if (token.endsWith("ā") && token.length > 3)
    forms.add(token.slice(0, -1) + "a");

  // a-stem loc. sg.: ārammaṇe → ārammaṇa
  if (token.endsWith("e") && token.length > 3)
    forms.add(token.slice(0, -1) + "a");

  // a-stem inst. sg.: paccayena → paccaya
  if (token.endsWith("ena") && token.length > 5)
    forms.add(token.slice(0, -3) + "a");

  // u-stem nom. pl.: hetū → hetu
  if (token.endsWith("ū") && token.length > 2)
    forms.add(token.slice(0, -1) + "u");

  // iti-sandhi after -ti: hotīti → hoti
  if (token.endsWith("tīti") && token.length > 5)
    forms.add(token.slice(0, -4) + "ti");

  // 3rd pl. present: uppajjanti → uppajjati (inserted nasal before -ti)
  if (token.endsWith("nti") && token.length > 3)
    forms.add(token.slice(0, -3) + "ti");

  // a-stem inst./abl. pl.: dhammehi → dhamma
  if (token.endsWith("ehi") && token.length > 5)
    forms.add(token.slice(0, -3) + "a");

  // u-stem inst./abl. pl.: dhātūhi → dhātu
  if (token.endsWith("ūhi") && token.length > 5)
    forms.add(token.slice(0, -3) + "u");

  // a-stem gen. pl. variant: sabbesaṃ → sabba
  if (token.endsWith("esaṃ") && token.length > 6)
    forms.add(token.slice(0, -4) + "a");

  // Dative/gen. sg. of -ā stems: vedanāya → vedanā; and -a stems: dukkhāya → dukkha
  if (token.endsWith("āya") && token.length > 5) {
    forms.add(token.slice(0, -3) + "ā");
    forms.add(token.slice(0, -3) + "a");
  }

  // Vowel lengthening in sandhi: hotī → hoti, uppajjissatī → uppajjissati
  if (token.endsWith("ī") && token.length > 3)
    forms.add(token.slice(0, -1) + "i");

  // na-prefix compounds (Paṭṭhāna negations): nahetu → hetu, naārammaṇe → ārammaṇa
  if (token.startsWith("na") && token.length > 5) {
    const rest = token.slice(2);
    forms.add(rest);
    if (rest.endsWith("e") && rest.length > 3) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("ā") && rest.length > 3) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("o") && rest.length > 2) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("ena") && rest.length > 5) forms.add(rest.slice(0, -3) + "a");
    if (rest.endsWith("ehi") && rest.length > 5) forms.add(rest.slice(0, -3) + "a");
    if (rest.endsWith("ānaṃ") && rest.length > 5) forms.add(rest.slice(0, -4) + "a");
  }

  // neva-prefix (na + eva + compound): nevadassanena → dassana
  if (token.startsWith("neva") && token.length > 7) {
    const rest = token.slice(4);
    forms.add(rest);
    if (rest.endsWith("e") && rest.length > 3) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("ā") && rest.length > 3) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("o") && rest.length > 2) forms.add(rest.slice(0, -1) + "a");
    if (rest.endsWith("ena") && rest.length > 5) forms.add(rest.slice(0, -3) + "a");
    if (rest.endsWith("ehi") && rest.length > 5) forms.add(rest.slice(0, -3) + "a");
  }

  return [...forms];
}

export async function lookupPali(word: string): Promise<CoreDictEntry | DictEntry | null> {
  await ensureLoaded();
  const raw = word
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,;:!?()\[\]"']/g, "")
    .trim();
  if (!raw || raw.length < 2) return null;

  const candidates = normalizePali(raw);

  // Phase 1: exact match across all candidate forms (original first, then normalised)
  for (const q of candidates) {
    const exact = coreData.find((e) => e.h.toLowerCase() === q);
    if (exact) return exact;
  }

  // Phase 2: inflected match across all candidates (query starts with headword, longest wins)
  for (const q of candidates) {
    const inflected = coreData
      .filter((e) => q.startsWith(e.h.toLowerCase()) && e.h.length >= 3)
      .sort((a, b) => b.h.length - a.h.length);
    if (inflected.length > 0) return inflected[0] ?? null;
  }

  // Phase 3: prefix match on original form only (headword starts with raw selection)
  if (raw.length >= 3) {
    const prefix = coreData
      .filter((e) => e.h.toLowerCase().startsWith(raw))
      .sort((a, b) => b.freq - a.freq);
    if (prefix.length > 0) return prefix[0] ?? null;
  }

  // Phase 4: common dict fallback (all candidate forms)
  for (const q of candidates) {
    const simple = dictData.find((e) =>
      altForms(e.h).some(
        (f) => f === q || q.startsWith(f) || (f.startsWith(q) && q.length >= 3)
      )
    );
    if (simple) return simple;
  }

  return null;
}

export function initDictionaryPanel(inputEl: HTMLInputElement, resultsEl: HTMLElement): void {
  const ready = ensureLoaded();

  const renderHint = (key: string) => {
    resultsEl.innerHTML = "";
    const p = document.createElement("p");
    p.className = "dict-hint";
    p.textContent = t(key, settings.uiLang);
    resultsEl.appendChild(p);
  };
  

  const render = () => {
    const query = inputEl.value.trim().toLowerCase();
    
    // Update URL if dictionary is active panel
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (activeBtn && activeBtn.dataset.panel === "dictionary") {
        const hashBase = location.hash.split('?')[0];
        if (query) {
            history.replaceState(null, "", `${hashBase}?q=${encodeURIComponent(query)}`);
        } else if (location.hash.includes('?q=')) {
            history.replaceState(null, "", hashBase);
        }
    }

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

function renderSimpleEntry(entry: DictEntry): HTMLElement {
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

function renderCoreEntry(entry: CoreDictEntry): HTMLElement {
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
          const skMeaning = root[`sanskrit_${settings.translationLang}` as keyof DictRootInfo];
          text += ` (skt. ${root.sanskrit}${skMeaning ? " — " + skMeaning : ""})`;
        }
        senseDiv.appendChild(dictField(t("dictRoot", settings.uiLang), text));
      } else {
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

function dictField(label: string, value: string): HTMLElement {
  const p = document.createElement("div");
  p.className = "dict-field";
  const strong = document.createElement("span");
  strong.className = "dict-field-label";
  strong.textContent = `${label}: `;
  p.appendChild(strong);
  p.appendChild(document.createTextNode(value));
  return p;
}
