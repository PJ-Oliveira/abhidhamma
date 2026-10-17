import { t } from "./i18n.js";
import { settings } from "./state.js";
import { createLogger } from "./logger.js";
import type { Manifest, Segment, WorkEntry, TocEntry } from "./types.js";

const log = createLogger("export");

// ── Glossary types ───────────────────────────────────────────────────────────

export interface GlossEntry {
  h: string;
  pos?: string;
  en: string;
  pt: string;
  es?: string;
  usage?: string;
  root?: string;
  entry?: GlossEntry;
}

let glossaryData: GlossEntry[] | null = null;

async function loadGlossary(): Promise<GlossEntry[]> {
  if (glossaryData) return glossaryData;
  try {
    const res = await fetch("data/dictionary/common_pali.json");
    if (!res.ok) return [];
    const data = await res.json();
    glossaryData = (data.entries ?? []) as GlossEntry[];
    return glossaryData;
  } catch {
    return [];
  }
}

export function collectUsedTerms(segs: Segment[], glossary: GlossEntry[]): GlossEntry[] {
  const found = new Set<string>();
  const wordRegex = /[\p{L}\p{M}]+/gu;
  const allPaliWords = new Set<string>();

  for (const seg of segs) {
    const paliText = (seg.pali || "").toLowerCase().normalize("NFC");
    const matches = paliText.match(wordRegex) || [];
    for (const w of matches) {
      allPaliWords.add(w.toLowerCase());
    }
  }

  const paliWordList = [...allPaliWords];

  for (const entry of glossary) {
    const key = entry.h.toLowerCase().normalize("NFC");
    if (found.has(key)) continue;
    const headwordBase = key.split(" / ")[0]!.split(" ")[0]!.trim();
    if (!headwordBase) continue;
    if (
      allPaliWords.has(headwordBase) ||
      (headwordBase.length >= 3 && paliWordList.some((w) => w.startsWith(headwordBase)))
    ) {
      found.add(key);
    }
  }

  return glossary
    .filter((g) => found.has(g.h.toLowerCase().normalize("NFC")))
    .sort((a, b) => a.h.localeCompare(b.h, "pi"))
    .map((g) => ({ ...g, entry: g }));
}

export function buildGlossaryHtml(
  terms: GlossEntry[],
  langMode: LangMode,
  termsMap: Map<string, string>
): string {
  if (terms.length === 0) return "";
  const mode = langMode as string;
  const showEn = mode.includes("en");
  const showPt = mode.includes("pt");
  const showEs = mode.includes("es");
  const rows = terms.map((term, idx) => {
    const headwordBase = term.h.split(" / ")[0]!.split(" ")[0]!.toLowerCase().normalize("NFC");
    let tId = termsMap.get(headwordBase);
    if (!tId) {
      tId = String(idx);
      termsMap.set(headwordBase, tId);
    }
    const parts: string[] = [`<strong>${escHtml(term.h)}</strong>`];
    if (term.pos) parts.push(`<em>(${escHtml(term.pos)})</em>`);
    if (showEn || (!showPt && !showEs)) parts.push(escHtml(term.en));
    if (showPt) parts.push(escHtml(term.pt));
    if (showEs && term.es) parts.push(escHtml(term.es));
    return `<p class="glossary-entry" id="dict_${tId}">${parts.join(" — ")}</p>`;
  });
  return `
<section class="glossary-appendix" epub:type="glossary" id="glossary_section">
<h2 class="chapter" style="page-break-before:always;" id="glossary_title">Pāḷi Glossary / Glossário Pāḷi</h2>
${rows.join("\n")}
</section>`;
}

export type LangMode =
  | "en"
  | "pali+en"
  | "pali+en+pt"
  | "pt"
  | "pali+pt"
  | "es"
  | "pali+es"
  | "pali+en+es";

// ── Canonical Group & Part Metadata ──────────────────────────────────────────

const CANONICAL_GROUP_ORDER = ["abhidhamma", "outros", "visuddhimagga", "comentarios"];
const CANONICAL_PART_ORDER = ["mula", "nidanakatha", "attha", "tika", "anutika", "texto"];

const GROUP_TITLES_PT: Record<string, string> = {
  abhidhamma: "Abhidhamma Piṭaka (Textos Canônicos, Comentários e Subcomentários)",
  outros: "Tratados e Compêndios de Abhidhamma",
  visuddhimagga: "Visuddhimagga (O Caminho da Purificação e Mahāṭīkā)",
  comentarios: "Comentários e Estudos Contemporâneos",
};

const PART_TITLES_PT: Record<string, string> = {
  mula: "Mūla (Texto Raiz)",
  nidanakatha: "Nidānakathā (Introdução Comentarial)",
  attha: "Aṭṭhakathā (Comentário)",
  tika: "Ṭīkā (Subcomentário)",
  anutika: "Anuṭīkā (Sub-subcomentário)",
  texto: "Texto Integral",
};

function getGroupDisplayTitle(group: string): string {
  return GROUP_TITLES_PT[group] || t(`groupTitle_${group}`, settings.uiLang) || group;
}

function getPartDisplayTitle(partKey: string, fallbackLabel?: string): string {
  return PART_TITLES_PT[partKey] || t(`part_${partKey}`, settings.uiLang) || fallbackLabel || partKey;
}

function orderedGroupEntries(manifest: Manifest): Array<[string, WorkEntry[]]> {
  const entries: Array<[string, WorkEntry[]]> = [];
  const seen = new Set<string>();
  for (const g of CANONICAL_GROUP_ORDER) {
    const works = manifest.groups[g];
    if (works && works.length > 0) {
      entries.push([g, works]);
      seen.add(g);
    }
  }
  for (const [g, works] of Object.entries(manifest.groups)) {
    if (!seen.has(g) && works && works.length > 0) {
      entries.push([g, works]);
    }
  }
  return entries;
}

function orderedPartKeys(parts: Record<string, unknown>): string[] {
  const keys = Object.keys(parts);
  return keys.sort((a, b) => {
    const ia = CANONICAL_PART_ORDER.indexOf(a);
    const ib = CANONICAL_PART_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

// ── Author mapping ───────────────────────────────────────────────────────────

const GROUP_AUTHORS: Record<string, string> = {
  abhidhamma: "Tipiṭaka (Chaṭṭha Saṅgāyana) · Ācariya Buddhaghosa · Ācariya Dhammapāla",
  visuddhimagga: "Bhadantācariya Buddhaghosa · Ācariya Dhammapāla",
  outros: "Ācariya Buddhadatta · Ācariya Anuruddha",
  comentarios: "Nina van Gorkom",
};

const WORK_AUTHORS: Record<string, string> = {
  "the-buddhas-path": "Nina van Gorkom",
  "introduction-to-the-abhidhamma": "Nina van Gorkom",
  "buddhism-in-daily-life": "Nina van Gorkom",
  "abhidhamma-in-daily-life": "Nina van Gorkom",
  "the-conditionality-of-life": "Nina van Gorkom",
  "the-buddhist-teaching-on-physical-phenomena": "Nina van Gorkom",
  "path-without-ownership": "Robert Gillam",
};

function getAuthor(workId: string, group: string): string {
  return WORK_AUTHORS[workId] ?? GROUP_AUTHORS[group] ?? "Abhidhamma Piṭaka Tradition";
}

// ── CRC32 & Minimal ZIP encoder ──────────────────────────────────────────────

const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of data) c = (CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8)) >>> 0;
  return (~c) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
  compress?: boolean;
  compressed?: boolean;
}

export function writeUint16LE(view: DataView, offset: number, value: number): void {
  view.setUint16(offset, value, true);
}
export function writeUint32LE(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, true);
}

export function buildZip(entries: ZipEntry[]): Uint8Array {
  const enc = new TextEncoder();
  const fileData: Array<{ name: Uint8Array; data: Uint8Array; crc: number; offset: number }> = [];
  const parts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = enc.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    writeUint32LE(lv, 0, 0x04034b50);
    writeUint16LE(lv, 4, 20);
    writeUint16LE(lv, 6, 0x0800); // UTF-8 filename flag
    writeUint16LE(lv, 8, 0);      // store
    writeUint16LE(lv, 10, 0);
    writeUint16LE(lv, 12, 0);
    writeUint32LE(lv, 14, crc);
    writeUint32LE(lv, 18, data.length);
    writeUint32LE(lv, 22, data.length);
    writeUint16LE(lv, 26, nameBytes.length);
    writeUint16LE(lv, 28, 0);
    localHeader.set(nameBytes, 30);

    fileData.push({ name: nameBytes, data, crc, offset });
    parts.push(localHeader, data);
    offset += localHeader.length + data.length;
  }

  const cdParts: Uint8Array[] = [];
  const cdStart = offset;
  for (const { name, data, crc, offset: fileOffset } of fileData) {
    const cd = new Uint8Array(46 + name.length);
    const cv = new DataView(cd.buffer);
    writeUint32LE(cv, 0, 0x02014b50);
    writeUint16LE(cv, 4, 20);
    writeUint16LE(cv, 6, 20);
    writeUint16LE(cv, 8, 0x0800); // UTF-8 filename flag
    writeUint16LE(cv, 10, 0);
    writeUint16LE(cv, 12, 0);
    writeUint16LE(cv, 14, 0);
    writeUint32LE(cv, 16, crc);
    writeUint32LE(cv, 20, data.length);
    writeUint32LE(cv, 24, data.length);
    writeUint16LE(cv, 28, name.length);
    writeUint16LE(cv, 30, 0);
    writeUint16LE(cv, 32, 0);
    writeUint16LE(cv, 34, 0);
    writeUint16LE(cv, 36, 0);
    writeUint32LE(cv, 38, 0);
    writeUint32LE(cv, 42, fileOffset);
    cd.set(name, 46);
    cdParts.push(cd);
    offset += cd.length;
  }

  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  writeUint32LE(ev, 0, 0x06054b50);
  writeUint16LE(ev, 4, 0);
  writeUint16LE(ev, 6, 0);
  writeUint16LE(ev, 8, fileData.length);
  writeUint16LE(ev, 10, fileData.length);
  writeUint32LE(ev, 12, offset - cdStart);
  writeUint32LE(ev, 16, cdStart);
  writeUint16LE(ev, 20, 0);

  const all = [...parts, ...cdParts, eocd];
  const total = all.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const chunk of all) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  return out;
}

// ── Segment → XHTML / HTML ───────────────────────────────────────────────────

export function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function linkifyText(
  text: string,
  termsMap?: Map<string, string>,
  linkPrefix: string = "glossary.xhtml"
): string {
  if (!text) return "";
  if (!termsMap || termsMap.size === 0) return escHtml(text);

  const wordRegex = /([\p{L}\p{M}]+)/gu;
  const parts = text.split(wordRegex);
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      out += escHtml(parts[i] || "");
    } else {
      const word = parts[i] || "";
      const lower = word.toLowerCase().normalize("NFC");
      const termId = termsMap.get(lower);
      if (termId) {
        out += `<a epub:type="glossref" href="${linkPrefix}#dict_${termId}">${escHtml(word)}</a>`;
      } else {
        out += escHtml(word);
      }
    }
  }
  return out;
}

export function walkNode(
  node: Node,
  termsMap?: Map<string, string>,
  linkPrefix: string = "glossary.xhtml"
): string {
  if (node.nodeType === Node.TEXT_NODE) return linkifyText(node.textContent ?? "", termsMap, linkPrefix);
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (el.classList?.contains("var-note")) return "";
  const inner = Array.from(el.childNodes)
    .map((n) => walkNode(n, termsMap, linkPrefix))
    .join("");
  if (tag === "b" || tag === "strong") return `<strong>${inner}</strong>`;
  if (tag === "i" || tag === "em") return `<em>${inner}</em>`;
  if (tag === "sup") return inner ? `<sup>${inner}</sup>` : "";
  if (tag === "br") return "<br/>";
  if (tag === "p") {
    const rend = el.getAttribute("rend");
    const cls = rend ? ` class="rend-${escHtml(rend)}"` : "";
    return inner ? `<br/><span${cls}>${inner}</span>` : "";
  }
  return inner;
}

export function fieldHtml(
  raw: string,
  termsMap?: Map<string, string>,
  linkPrefix: string = "glossary.xhtml"
): string {
  if (!raw) return "";
  if (!raw.includes("<")) return linkifyText(raw, termsMap, linkPrefix);
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${raw}</body>`, "text/html");
  return walkNode(doc.body, termsMap, linkPrefix);
}

function hasMappedTerm(text: string, termsMap?: Map<string, string>): boolean {
  if (!text || !termsMap || termsMap.size === 0) return false;
  const words = text.toLowerCase().normalize("NFC").match(/[\p{L}\p{M}]+/gu) || [];
  return words.some((w) => termsMap.has(w));
}

export function segToHtml(
  seg: Segment,
  langMode: LangMode,
  termsMap?: Map<string, string>,
  linkPrefix: string = "glossary.xhtml",
  anchorId?: string
): string {
  const rend = seg.rend;
  const paliText = seg.pali ?? "";
  const enText = seg.en ?? "";
  const ptText = seg.pt ?? "";
  const esText = seg.es ?? "";

  const showPali = langMode.startsWith("pali") || hasMappedTerm(paliText, termsMap);
  const showEn =
    langMode === "en" ||
    langMode === "pali+en" ||
    langMode === "pali+en+pt" ||
    langMode === "pali+en+es";
  const showPt = langMode === "pali+en+pt" || langMode === "pt" || langMode === "pali+pt";
  const showEs = langMode === "es" || langMode === "pali+es" || langMode === "pali+en+es";

  let inner = "";
  const paranumPrefix = seg.paranum
    ? `<span class="paranum-badge">${escHtml(seg.paranum)}.</span> `
    : "";

  if (showPali && paliText) {
    const linkedPali = fieldHtml(paliText, termsMap, linkPrefix);
    inner += `<div class="line pali" lang="pi">${paranumPrefix}${linkedPali}</div>`;
  }

  if (showEn) {
    const textToUse = enText || paliText;
    if (textToUse && !(showPali && textToUse === paliText)) {
      const prefix = !showPali ? paranumPrefix : "";
      inner += `<div class="line en" lang="en">${prefix}${fieldHtml(textToUse, termsMap, linkPrefix)}</div>`;
    }
  }

  if (showPt && ptText) {
    const prefix = !showPali && !showEn ? paranumPrefix : "";
    inner += `<div class="line pt" lang="pt">${prefix}${fieldHtml(ptText, termsMap, linkPrefix)}</div>`;
  }

  if (showEs && esText) {
    const prefix = !showPali && !showEn && !showPt ? paranumPrefix : "";
    inner += `<div class="line es" lang="es">${prefix}${fieldHtml(esText, termsMap, linkPrefix)}</div>`;
  }

  if (seg.notes && seg.notes.length > 0) {
    seg.notes.forEach((note, idx) => {
      const noteId = `note_${seg.id}_${idx}`;
      inner += ` <a epub:type="noteref" class="footnote-ref" href="#${noteId}"><sup>[${idx + 1}]</sup></a>`;
      inner += `<aside epub:type="footnote" id="${noteId}" class="epub-footnote"><p>${escHtml(note)}</p></aside>`;
    });
  }

  if (!inner) return "";

  const idAttr = anchorId ? ` id="${escHtml(anchorId)}"` : "";

  if (rend === "book" || rend === "title" || rend === "nikaya")
    return `<h1 class="seg title"${idAttr}>${inner}</h1>`;
  if (rend === "chapter") return `<h2 class="seg chapter"${idAttr}>${inner}</h2>`;
  if (rend === "subhead") return `<h3 class="seg subhead"${idAttr}>${inner}</h3>`;
  if (rend === "subsubhead") return `<h4 class="seg subsubhead"${idAttr}>${inner}</h4>`;
  if (rend === "hangnum") return `<div class="seg hangnum"${idAttr}>${inner}</div>`;
  if (rend === "indent") return `<blockquote class="seg indent"${idAttr}>${inner}</blockquote>`;
  if (rend === "footnote") return `<div class="seg footnote"${idAttr}>${inner}</div>`;
  if (rend === "centre") return `<div class="seg centre"${idAttr}>${inner}</div>`;
  if (rend === "glossary") return `<div class="seg glossary"${idAttr}>${inner}</div>`;
  if (rend && rend.startsWith("gatha")) return `<div class="seg gatha ${escHtml(rend)}"${idAttr}>${inner}</div>`;
  return `<p class="seg bodytext"${idAttr}><span class="seg-inner">${inner}</span></p>`;
}

// ── Heading extraction & Hierarchical TOC structures ─────────────────────────

export interface SubchapterTocNode {
  id: string;
  label: string;
  level: "subhead" | "subsubhead";
}

export interface ChapterTocNode {
  id: string;
  label: string;
  rend: string;
  subchapters: SubchapterTocNode[];
}

export interface PartExportSection {
  partKey: string;
  partTitle: string;
  fileId: string;
  href: string;
  chapters: ChapterTocNode[];
  bodyHtml: string;
}

export interface WorkExportSection {
  workId: string;
  workTitle: string;
  group: string;
  groupTitle: string;
  author: string;
  parts: PartExportSection[];
}

function cleanPlainLabel(raw: string | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/<sup[^>]*class="var-note"[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeadingLabel(seg: Segment, langMode: LangMode): string {
  const paliClean = cleanPlainLabel(seg.pali);
  const ptClean = cleanPlainLabel(seg.pt);
  const enClean = cleanPlainLabel(seg.en);
  const esClean = cleanPlainLabel(seg.es);

  const showPali = langMode.startsWith("pali");
  const showPt = langMode.includes("pt");
  const showEn = langMode.includes("en");
  const showEs = langMode.includes("es");

  let primary = "";
  let secondary = "";

  if (showPali && paliClean) {
    primary = paliClean;
    if (showPt && ptClean && ptClean.toLowerCase() !== paliClean.toLowerCase()) {
      secondary = ptClean;
    } else if (showEn && enClean && enClean.toLowerCase() !== paliClean.toLowerCase()) {
      secondary = enClean;
    } else if (showEs && esClean && esClean.toLowerCase() !== paliClean.toLowerCase()) {
      secondary = esClean;
    }
  } else if (showPt && ptClean) {
    primary = ptClean;
  } else if (showEn && enClean) {
    primary = enClean;
  } else if (showEs && esClean) {
    primary = esClean;
  } else {
    primary = paliClean || ptClean || enClean || esClean;
  }

  const combined = secondary ? `${primary} — ${secondary}` : primary;
  return combined.length > 120 ? combined.slice(0, 117) + "…" : combined;
}

export function buildSectionBodyAndToc(
  segs: Segment[],
  langMode: LangMode,
  termsMap: Map<string, string>,
  idPrefix: string,
  linkPrefix: string
): { bodyHtml: string; chapters: ChapterTocNode[] } {
  const chapters: ChapterTocNode[] = [];
  const bodyParts: string[] = [];
  let chCounter = 0;
  let subCounter = 0;

  for (const seg of segs) {
    const rend = seg.rend;
    const isChapter =
      rend === "chapter" || rend === "book" || rend === "title" || rend === "nikaya";
    const isSubchapter = rend === "subhead" || rend === "subsubhead";

    let anchorId: string | undefined;
    if (isChapter) {
      chCounter++;
      anchorId = `${idPrefix}_ch${chCounter}`;
      const label = extractHeadingLabel(seg, langMode);
      if (label) {
        chapters.push({
          id: anchorId,
          label,
          rend,
          subchapters: [],
        });
      }
    } else if (isSubchapter) {
      subCounter++;
      anchorId = `${idPrefix}_sub${subCounter}`;
      const label = extractHeadingLabel(seg, langMode);
      if (label) {
        if (chapters.length === 0) {
          // Create an implicit opening section if a subhead appears before any chapter tag
          chCounter++;
          const implicitId = `${idPrefix}_ch${chCounter}`;
          chapters.push({
            id: implicitId,
            label,
            rend: "chapter",
            subchapters: [],
          });
          anchorId = implicitId;
        } else {
          chapters[chapters.length - 1]!.subchapters.push({
            id: anchorId,
            label,
            level: rend as "subhead" | "subsubhead",
          });
        }
      }
    }

    const html = segToHtml(seg, langMode, termsMap, linkPrefix, anchorId);
    if (html) bodyParts.push(html);
  }

  return { bodyHtml: bodyParts.join("\n"), chapters };
}

// ── Shared Typographic Styles (13pt Pāli-ready font, justified, read-friendly) ──

function getBaseHref(): string {
  if (typeof window !== "undefined" && window.location && window.location.href.startsWith("http")) {
    const clean = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");
    return clean;
  }
  return "./";
}

function buildPrintCss(baseHref: string): string {
  return `
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('${baseHref}fonts/GentiumBookPlus-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('${baseHref}fonts/GentiumBookPlus-Italic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: 'Noto Serif Pali';
  src: url('${baseHref}fonts/NotoSerifPali-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Noto Serif Pali';
  src: url('${baseHref}fonts/NotoSerifPali-Italic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}

@page {
  size: A4;
  margin: 2.2cm 2cm 2.2cm 2cm;
  @bottom-center {
    content: counter(page);
    font-size: 9.5pt;
    color: #555;
    font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  }
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', 'Noto Serif', Georgia, serif;
  font-size: 13pt;
  line-height: 1.68;
  color: #181410;
  background: #ffffff;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}

.print-cover {
  text-align: center;
  padding: 2.5cm 1cm 2cm 1cm;
  margin-bottom: 1.5cm;
  border-bottom: 2px solid #8b4513;
  page-break-after: always;
}
.print-cover h1 {
  font-size: 24pt;
  font-weight: 700;
  color: #2b1d0e;
  margin: 0 0 0.4em 0;
  line-height: 1.25;
  hyphens: none;
}
.print-cover .subtitle {
  font-size: 13pt;
  font-style: italic;
  color: #5c4632;
  margin: 0.4em 0;
}
.print-cover .author {
  font-size: 13pt;
  font-weight: 600;
  color: #3d2c1e;
  margin-top: 1.2em;
}

nav.print-toc {
  margin: 0 0 2cm 0;
  padding: 0.5cm 0;
  page-break-after: always;
  text-align: left;
  hyphens: none;
}
nav.print-toc h1 {
  text-align: center;
  font-size: 18pt;
  color: #2b1d0e;
  border-bottom: 1.5px solid #bfa588;
  padding-bottom: 0.35em;
  margin-bottom: 1em;
}
nav.print-toc ol {
  list-style: none;
  padding-left: 0;
  margin: 0.35em 0;
}
nav.print-toc ol ol {
  padding-left: 1.35em;
  border-left: 1px solid #e2d5c3;
  margin: 0.25em 0 0.45em 0.35em;
}
nav.print-toc li {
  margin: 0.28em 0;
  line-height: 1.45;
  font-size: 12pt;
}
nav.print-toc .toc-group-title {
  font-size: 13.5pt;
  font-weight: 700;
  color: #7a3e18;
  margin-top: 1em;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
nav.print-toc .toc-work-title {
  font-size: 13pt;
  font-weight: 700;
  color: #2b1d0e;
}
nav.print-toc .toc-part-title {
  font-size: 12.5pt;
  font-weight: 600;
  color: #4a3520;
}
nav.print-toc .toc-ch-link {
  font-size: 12pt;
  color: #1f1914;
}
nav.print-toc .toc-sub-link {
  font-size: 11.5pt;
  font-style: italic;
  color: #4f4236;
}
nav.print-toc a {
  color: inherit;
  text-decoration: none;
}
nav.print-toc a:hover {
  text-decoration: underline;
}

.group-banner {
  page-break-before: always;
  text-align: center;
  padding: 1.8cm 0.5cm 1cm 0.5cm;
  border-bottom: 2px solid #8b4513;
  margin-bottom: 1.2cm;
  hyphens: none;
}
.group-banner h1 {
  font-size: 20pt;
  color: #7a3e18;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.work-banner {
  page-break-before: always;
  text-align: center;
  padding: 1cm 0 0.6cm 0;
  border-bottom: 1.5px solid #bfa588;
  margin-bottom: 1cm;
  hyphens: none;
}
.work-banner h1 {
  font-size: 18pt;
  color: #2b1d0e;
  margin: 0 0 0.25em 0;
}

.part-banner {
  page-break-before: always;
  text-align: center;
  padding: 0.6cm 0.4cm;
  margin: 1.2em 0 1em 0;
  background: #f9f4ec;
  border-top: 1.5px solid #cbb396;
  border-bottom: 1.5px solid #cbb396;
  page-break-after: avoid;
  break-after: avoid;
  hyphens: none;
}
.part-banner h2 {
  font-size: 15.5pt;
  color: #6b3614;
  margin: 0;
}
.part-banner .part-meta {
  font-size: 11pt;
  color: #5c4632;
  margin-top: 0.2em;
}

h1.title {
  text-align: center;
  font-size: 17pt;
  font-weight: 700;
  color: #2b1d0e;
  border-bottom: 1px solid #d8c8b4;
  padding-bottom: 0.35em;
  margin: 1.4em 0 0.9em 0;
  line-height: 1.35;
  page-break-after: avoid;
  break-after: avoid;
  hyphens: none;
}
h2.chapter {
  page-break-before: always;
  font-size: 15pt;
  font-weight: 700;
  color: #6b3614;
  margin-top: 1.4em;
  margin-bottom: 0.8em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #e6d8c5;
  line-height: 1.38;
  page-break-after: avoid;
  break-after: avoid;
  hyphens: none;
}
h2.chapter:first-of-type {
  page-break-before: avoid;
}
h3.subhead {
  font-size: 13.5pt;
  font-weight: 700;
  color: #3a2718;
  margin-top: 1.3em;
  margin-bottom: 0.5em;
  line-height: 1.4;
  page-break-after: avoid;
  break-after: avoid;
  hyphens: none;
}
h4.subsubhead {
  font-size: 13pt;
  font-weight: 600;
  font-style: italic;
  color: #4f3a28;
  margin-top: 1.1em;
  margin-bottom: 0.4em;
  line-height: 1.4;
  page-break-after: avoid;
  break-after: avoid;
  hyphens: none;
}

p.bodytext, div.seg {
  font-size: 13pt;
  line-height: 1.68;
  margin: 0.65em 0;
  text-align: justify;
  orphans: 3;
  widows: 3;
}
.seg-inner {
  display: block;
}
.paranum-badge {
  font-weight: 700;
  color: #7a3e18;
  font-style: normal;
  margin-right: 0.25em;
}
.line {
  font-size: 13pt;
  line-height: 1.68;
  text-align: justify;
  margin-bottom: 0.25em;
}
.line.pali {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', 'Noto Serif', Georgia, serif;
  font-size: 13pt;
  font-style: italic;
  color: #2b2118;
  margin-bottom: 0.25em;
}
.line.en, .line.pt, .line.es {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', 'Noto Serif', Georgia, serif;
  font-size: 13pt;
  color: #181410;
  margin-top: 0.12em;
  margin-bottom: 0.55em;
  text-align: justify;
}
.line.pali + .line.en,
.line.pali + .line.pt,
.line.pali + .line.es {
  border-left: 2.5px solid #5a7a5f;
  padding-left: 0.7em;
}

blockquote.indent {
  margin: 0.9em 1.6em;
  border-left: 3px solid #cbb396;
  padding-left: 1em;
  font-style: italic;
  color: #2c2219;
  text-align: justify;
}
div.hangnum {
  margin: 0.55em 0 0.55em 1.5em;
  text-indent: -1.5em;
  text-align: justify;
}
div.footnote, aside.epub-footnote {
  font-size: 11pt;
  color: #4d4033;
  margin: 0.35em 0;
  padding-left: 0.8em;
  border-left: 2px solid #dfd2c0;
}
div.centre {
  text-align: center;
  margin: 0.65em 0;
  hyphens: none;
}
div.gatha {
  margin: 0.6em 0 0.6em 1.8em;
  font-style: italic;
}
div.glossary {
  margin: 0.65em 0;
}
div.glossary .line.pali {
  font-weight: 700;
}
span.rend-gathalast { margin-left: 1.8em; display: block; }
span.rend-gatha1, span.rend-gatha2, span.rend-gatha3 { margin-left: 1em; display: block; }

.glossary-appendix {
  page-break-before: always;
}
.glossary-entry {
  margin: 0.45em 0;
  font-size: 12.5pt;
  line-height: 1.58;
  text-align: justify;
}
.glossary-entry strong { color: #2b1d0e; }
.glossary-entry em { color: #5c4632; }
`;
}

export const EPUB_CSS = `
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Italic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}

html, body {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', 'Noto Serif', Georgia, serif;
  font-size: 13pt;
  line-height: 1.68;
  margin: 4% 5%;
  padding: 0;
  color: #181410;
  background: #ffffff;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
  adobe-hyphenate: auto;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}

h1, h2, h3, h4 {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  hyphens: none;
  -webkit-hyphens: none;
  page-break-after: avoid;
  break-after: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
}

h1 {
  text-align: center;
  font-size: 17pt;
  font-weight: 700;
  color: #2b1d0e;
  border-bottom: 1.5px solid #bfa588;
  padding-bottom: 0.4em;
  margin: 1.2em 0 0.9em 0;
  line-height: 1.32;
}

h2, h2.chapter {
  font-size: 15pt;
  font-weight: 700;
  color: #6b3614;
  margin-top: 1.6em;
  margin-bottom: 0.75em;
  padding-top: 0.45em;
  border-top: 1px solid #dfd0bc;
  line-height: 1.36;
  text-align: left;
}

h3, h3.subhead {
  font-size: 13.5pt;
  font-weight: 700;
  color: #3a2718;
  margin-top: 1.25em;
  margin-bottom: 0.45em;
  line-height: 1.4;
  text-align: left;
}

h4, h4.subsubhead {
  font-size: 13pt;
  font-weight: 600;
  font-style: italic;
  color: #4f3a28;
  margin-top: 1.05em;
  margin-bottom: 0.35em;
  line-height: 1.4;
  text-align: left;
}

p, p.bodytext, div.seg {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  font-size: 13pt;
  line-height: 1.68;
  margin: 0.68em 0;
  text-align: justify;
  orphans: 2;
  widows: 2;
}

.seg-inner {
  display: block;
}

.paranum-badge {
  font-weight: 700;
  color: #7a3e18;
  font-style: normal;
  margin-right: 0.25em;
}

.line {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  font-size: 13pt;
  line-height: 1.68;
  text-align: justify;
  margin-bottom: 0.24em;
}

.line.pali {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  font-size: 13pt;
  font-style: italic;
  color: #2b2118;
  margin-bottom: 0.24em;
}

.line.en, .line.pt, .line.es {
  font-family: 'Gentium Book Plus', 'Noto Serif Pali', Georgia, serif;
  font-size: 13pt;
  color: #181410;
  margin-top: 0.12em;
  margin-bottom: 0.55em;
  text-align: justify;
}

.line.pali + .line.en,
.line.pali + .line.pt,
.line.pali + .line.es {
  border-left: 2.5px solid #5a7a5f;
  padding-left: 0.7em;
}

div.centre {
  text-align: center;
  margin: 0.65em 0;
  hyphens: none;
}

div.hangnum {
  margin: 0.55em 0 0.55em 1.4em;
  text-indent: -1.4em;
  text-align: justify;
}

div.gatha {
  margin: 0.6em 0 0.6em 1.6em;
  font-style: italic;
}

div.glossary .line.pali {
  font-weight: 700;
}

blockquote, blockquote.indent {
  margin: 0.9em 4%;
  padding-left: 0.9em;
  border-left: 3px solid #cbb396;
  font-style: italic;
  text-align: justify;
}

div.footnote, aside.epub-footnote {
  font-size: 11.5pt;
  line-height: 1.5;
  color: #4d4033;
  margin: 0.4em 0;
  padding: 0.3em 0.7em;
  background: #faf6f0;
  border-left: 2px solid #cbb396;
}

.part-header-box {
  text-align: center;
  padding: 0.7em 0.5em;
  margin: 0.5em 0 1.2em 0;
  background: #faf5ed;
  border-top: 1.5px solid #cbb396;
  border-bottom: 1.5px solid #cbb396;
  hyphens: none;
}
.part-header-box .breadcrumb-line {
  font-size: 11pt;
  color: #6b533b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25em;
}
.part-header-box h1 {
  margin: 0.15em 0;
  border-bottom: none;
  padding-bottom: 0;
}
.part-header-box .part-subtitle {
  font-size: 13pt;
  font-weight: 600;
  color: #7a3e18;
  margin-top: 0.2em;
}

.local-toc {
  background: #fcf9f4;
  border: 1px solid #dfd0bc;
  border-radius: 6px;
  padding: 0.8em 1.1em;
  margin: 0.8em 0 1.4em 0;
  text-align: left;
  hyphens: none;
}
.local-toc h2 {
  font-size: 13pt;
  margin: 0 0 0.5em 0;
  padding: 0;
  border: none;
  color: #6b3614;
}
.local-toc ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.local-toc ol ol {
  padding-left: 1.2em;
  border-left: 1px solid #e2d5c3;
  margin: 0.2em 0 0.35em 0.3em;
}
.local-toc li {
  margin: 0.24em 0;
  font-size: 12pt;
  line-height: 1.42;
}
.local-toc a {
  color: #2b1d0e;
  text-decoration: none;
}

.back-to-toc {
  display: block;
  text-align: center;
  margin-top: 1.8em;
  font-size: 11.5pt;
  text-decoration: none;
  color: #6b3614;
  border-top: 1px dashed #cbb396;
  padding-top: 0.8em;
  hyphens: none;
}

.toc-header {
  text-align: left;
  hyphens: none;
}
.toc-header h1 {
  margin-bottom: 0.5em;
}
nav#toc {
  text-align: left;
  hyphens: none;
}
nav#toc ol, .toc-short {
  list-style-type: none;
  padding-left: 0;
}
nav#toc ol ol, .toc-short ol {
  list-style-type: none;
  padding-left: 1.25em;
  border-left: 1px solid #dfd0bc;
  margin: 0.25em 0 0.5em 0.3em;
}
nav#toc li, .toc-short li {
  margin: 0.3em 0;
  line-height: 1.45;
  font-size: 12.5pt;
}
nav#toc a, .toc-short a {
  color: #2b1d0e;
  text-decoration: none;
}
.toc-grp-label {
  font-weight: 700;
  color: #7a3e18;
  font-size: 13.5pt;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.toc-work-label {
  font-weight: 700;
  color: #2b1d0e;
  font-size: 13pt;
}
.toc-part-label {
  font-weight: 600;
  color: #5a3d24;
  font-size: 12.5pt;
}
.toc-sub-label {
  font-style: italic;
  color: #4f4236;
  font-size: 12pt;
}

.glossary-entry {
  margin: 0.45em 0;
  font-size: 12.5pt;
  line-height: 1.58;
  text-align: justify;
}
`;

// ── Render Hierarchical TOC HTML for Print/PDF & EPUB ────────────────────────

function renderChaptersTocListHtml(
  chapters: ChapterTocNode[],
  hrefPrefix: string
): string {
  if (chapters.length === 0) return "";
  const items = chapters.map((ch) => {
    const chUrl = `${hrefPrefix}#${ch.id}`;
    if (ch.subchapters.length === 0) {
      return `<li><a class="toc-ch-link" href="${chUrl}">${escHtml(ch.label)}</a></li>`;
    }
    const subLis = ch.subchapters
      .map(
        (sub) =>
          `<li><a class="toc-sub-link toc-sub-label" href="${hrefPrefix}#${sub.id}">${escHtml(sub.label)}</a></li>`
      )
      .join("\n");
    return `<li><a class="toc-ch-link" href="${chUrl}">${escHtml(ch.label)}</a>\n<ol>\n${subLis}\n</ol>\n</li>`;
  });
  return `<ol>\n${items.join("\n")}\n</ol>`;
}

// ── PDF Builder (Single Work & Full Corpus) ──────────────────────────────────

export function buildPrintHtml(
  segs: Segment[],
  title: string,
  langMode: LangMode,
  glossaryHtml: string,
  termsMap: Map<string, string>,
  workId?: string,
  group?: string,
  partSections?: PartExportSection[]
): string {
  const author = getAuthor(workId ?? "", group ?? "");
  const baseHref = getBaseHref();
  const css = buildPrintCss(baseHref);

  let tocInnerHtml = "";
  let mainBodyHtml = "";

  if (partSections && partSections.length > 0) {
    const partTocItems: string[] = [];
    const bodyBlocks: string[] = [];

    for (const part of partSections) {
      const partAnchor = `${part.fileId}_top`;
      const chListHtml = renderChaptersTocListHtml(part.chapters, "");
      partTocItems.push(
        `<li><a class="toc-part-title" href="#${partAnchor}">${escHtml(part.partTitle)}</a>${chListHtml ? "\n" + chListHtml : ""}</li>`
      );
      bodyBlocks.push(
        `<section class="part-section" id="${partAnchor}">
          <div class="part-banner">
            <h2>${escHtml(part.partTitle)}</h2>
            <div class="part-meta">${escHtml(title)}</div>
          </div>
          ${part.bodyHtml}
        </section>`
      );
    }

    if (glossaryHtml) {
      partTocItems.push(`<li><a class="toc-part-title" href="#glossary_title">Glossário Pāḷi</a></li>`);
    }
    tocInnerHtml = `<ol>\n${partTocItems.join("\n")}\n</ol>`;
    mainBodyHtml = bodyBlocks.join("\n");
  } else {
    const { bodyHtml, chapters } = buildSectionBodyAndToc(segs, langMode, termsMap, "doc", "");
    const chListHtml = renderChaptersTocListHtml(chapters, "");
    tocInnerHtml = chListHtml;
    if (glossaryHtml) {
      tocInnerHtml += `\n<ol><li><a class="toc-part-title" href="#glossary_title">Glossário Pāḷi</a></li></ol>`;
    }
    mainBodyHtml = bodyHtml;
  }

  return `<!DOCTYPE html>
<html lang="pi">
<head>
<meta charset="utf-8"/>
<base href="${escHtml(baseHref)}"/>
<meta name="author" content="${escHtml(author)}"/>
<title>${escHtml(title)}</title>
<style>${css}</style>
</head>
<body>
<div class="print-cover">
  <h1>${escHtml(title)}</h1>
  <p class="subtitle">Edição Tipiṭaka Chaṭṭha Saṅgāyana — Pāḷi &amp; Tradução</p>
  <p class="author">${escHtml(author)}</p>
</div>
<nav class="print-toc" id="toc_top">
  <h1>Índice Geral (Obras, Comentários, Capítulos e Subcapítulos)</h1>
  ${tocInnerHtml}
</nav>
<main>
${mainBodyHtml}
</main>
${glossaryHtml}
<script>
window.addEventListener("load", function() {
  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(function() {
    setTimeout(function() { window.print(); }, 450);
  });
});
<\/script>
</body>
</html>`;
}

export async function buildFullCorpusPrintHtml(
  manifest: Manifest,
  langMode: LangMode,
  onProgress: (msg: string) => void
): Promise<string> {
  const baseHref = getBaseHref();
  const css = buildPrintCss(baseHref);
  const rawGlossary = await loadGlossary();
  const termsMap = new Map<string, string>();
  rawGlossary.forEach((entry, idx) => {
    const headword = entry.h.split(" / ")[0]!.split(" ")[0]!.toLowerCase().normalize("NFC");
    termsMap.set(headword, String(idx));
  });

  const groupTocLis: string[] = [];
  const bodyBlocks: string[] = [];
  let workCounter = 0;

  for (const [group, works] of orderedGroupEntries(manifest)) {
    const grpTitle = getGroupDisplayTitle(group);
    const grpAnchor = `grp_${group}`;
    const workTocLis: string[] = [];

    bodyBlocks.push(`<div class="group-banner" id="${grpAnchor}"><h1>${escHtml(grpTitle)}</h1></div>`);

    for (const work of works) {
      workCounter++;
      const workPrefix = `w${String(workCounter).padStart(2, "0")}`;
      const workAnchor = `${workPrefix}_top`;
      onProgress(`Preparando PDF: ${work.title}…`);
      await new Promise((r) => setTimeout(r, 10));

      bodyBlocks.push(`<div class="work-banner" id="${workAnchor}"><h1>${escHtml(work.title)}</h1></div>`);

      const partTocLis: string[] = [];
      for (const partKey of orderedPartKeys(work.parts)) {
        const part = work.parts[partKey];
        if (!part) continue;
        const partPrefix = `${workPrefix}_${partKey}`;
        const partAnchor = `${partPrefix}_top`;
        const partTitle = getPartDisplayTitle(partKey, part.label);

        const segs: Segment[] = [];
        for (const file of part.files) {
          try {
            const res = await fetch(`data/works/${work.id}/${file}`);
            if (res.ok) {
              const chunk = (await res.json()) as Segment[];
              segs.push(...chunk);
            }
          } catch {
            // skip missing chunk
          }
        }
        if (segs.length === 0) continue;

        const { bodyHtml, chapters } = buildSectionBodyAndToc(
          segs,
          langMode,
          termsMap,
          partPrefix,
          ""
        );

        const chListHtml = renderChaptersTocListHtml(chapters, "");
        partTocLis.push(
          `<li><a class="toc-part-title" href="#${partAnchor}">${escHtml(partTitle)}</a>${chListHtml ? "\n" + chListHtml : ""}</li>`
        );

        bodyBlocks.push(
          `<section class="part-section" id="${partAnchor}">
            <div class="part-banner">
              <h2>${escHtml(work.title)} — ${escHtml(partTitle)}</h2>
              <div class="part-meta">${escHtml(grpTitle)}</div>
            </div>
            ${bodyHtml}
          </section>`
        );
      }

      workTocLis.push(
        `<li><a class="toc-work-title" href="#${workAnchor}">${escHtml(work.title)}</a>${
          partTocLis.length ? `\n<ol>\n${partTocLis.join("\n")}\n</ol>` : ""
        }</li>`
      );
    }

    groupTocLis.push(
      `<li><a class="toc-group-title" href="#${grpAnchor}">${escHtml(grpTitle)}</a>\n<ol>\n${workTocLis.join("\n")}\n</ol>\n</li>`
    );
  }

  const glossaryHtml = buildGlossaryHtml(rawGlossary, langMode, termsMap);
  if (glossaryHtml) {
    groupTocLis.push(`<li><a class="toc-group-title" href="#glossary_title">Glossário Pāḷi</a></li>`);
  }

  return `<!DOCTYPE html>
<html lang="pi">
<head>
<meta charset="utf-8"/>
<base href="${escHtml(baseHref)}"/>
<title>Abhidhamma Piṭaka — Coleção Completa</title>
<style>${css}</style>
</head>
<body>
<div class="print-cover">
  <h1>Abhidhamma Piṭaka — Coleção Completa</h1>
  <p class="subtitle">Textos Canônicos (Mūla), Comentários (Aṭṭhakathā), Subcomentários (Ṭīkā &amp; Anuṭīkā), Tratados e Visuddhimagga</p>
  <p class="author">Tipiṭaka Chaṭṭha Saṅgāyana · Buddhaghosa · Dhammapāla · Anuruddha · Buddhadatta</p>
</div>
<nav class="print-toc" id="toc_top">
  <h1>Índice Geral — Tratados, Obras, Comentários, Capítulos e Subcapítulos</h1>
  <ol>
    ${groupTocLis.join("\n")}
  </ol>
</nav>
<main>
${bodyBlocks.join("\n")}
</main>
${glossaryHtml}
<script>
window.addEventListener("load", function() {
  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(function() {
    setTimeout(function() { window.print(); }, 500);
  });
});
<\/script>
</body>
</html>`;
}

function openPrintWindow(html: string, title: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    const a = document.createElement("a");
    a.href = url;
    const slug = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_").toLowerCase();
    a.download = (slug || "export") + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    alert("Pop-up blocked. The HTML file has been downloaded — open it in your browser and press Ctrl+P (or ⌘+P) to save as PDF.");
    return;
  }
  setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

// ── EPUB 3 Builder (Single Work & Multi-Part) ────────────────────────────────

function renderNcxChapterPoints(
  chapters: ChapterTocNode[],
  hrefPrefix: string,
  nextPlayOrder: () => number,
  indent: string = "      "
): string {
  return chapters
    .map((ch) => {
      const po = nextPlayOrder();
      const subPoints = ch.subchapters
        .map((sub) => {
          const spo = nextPlayOrder();
          return `${indent}  <navPoint id="${sub.id}" playOrder="${spo}">
${indent}    <navLabel><text>${escHtml(sub.label)}</text></navLabel>
${indent}    <content src="${hrefPrefix}#${sub.id}"/>
${indent}  </navPoint>`;
        })
        .join("\n");
      return `${indent}<navPoint id="${ch.id}" playOrder="${po}">
${indent}  <navLabel><text>${escHtml(ch.label)}</text></navLabel>
${indent}  <content src="${hrefPrefix}#${ch.id}"/>
${subPoints ? subPoints + "\n" : ""}${indent}</navPoint>`;
    })
    .join("\n");
}

function renderLocalPartTocXhtml(chapters: ChapterTocNode[], hrefPrefix: string = ""): string {
  if (chapters.length === 0) return "";
  return `<div class="local-toc">
  <h2>Sumário desta Parte (Capítulos e Subcapítulos)</h2>
  ${renderChaptersTocListHtml(chapters, hrefPrefix)}
</div>`;
}

export function buildEpub(
  segs: Segment[],
  title: string,
  langMode: LangMode,
  glossaryHtml: string,
  termsMap: Map<string, string>,
  fontReg: Uint8Array,
  fontIta: Uint8Array,
  workId?: string,
  group?: string,
  partSections?: PartExportSection[]
): Uint8Array {
  const enc = new TextEncoder();
  const author = getAuthor(workId ?? "", group ?? "");
  const grpTitle = group ? getGroupDisplayTitle(group) : "Abhidhamma Piṭaka";

  const sections: PartExportSection[] =
    partSections && partSections.length > 0
      ? partSections
      : (() => {
          const { bodyHtml, chapters } = buildSectionBodyAndToc(
            segs,
            langMode,
            termsMap,
            "content",
            "glossary.xhtml"
          );
          return [
            {
              partKey: "mula",
              partTitle: title,
              fileId: "content",
              href: "content.xhtml",
              chapters,
              bodyHtml,
            },
          ];
        })();

  const xhtmlFiles: Array<{ id: string; href: string; content: string }> = [];
  const navPartLis: string[] = [];

  for (const sec of sections) {
    const localToc = renderLocalPartTocXhtml(sec.chapters, "");
    const pageXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head>
<meta charset="utf-8"/>
<title>${escHtml(title)} — ${escHtml(sec.partTitle)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="bodymatter">
<section epub:type="part" id="${sec.fileId}_top">
  <div class="part-header-box">
    <div class="breadcrumb-line">${escHtml(grpTitle)}</div>
    <h1 id="title_header">${escHtml(title)}</h1>
    <div class="part-subtitle">${escHtml(sec.partTitle)}</div>
  </div>
  <p style="text-align:center;margin:0.4em 0 1em 0;"><a class="back-to-toc" style="margin-top:0;border-top:none;padding-top:0;" href="nav.xhtml">↑ Ir para o Índice Geral</a></p>
  ${localToc}
  ${sec.bodyHtml}
  <a class="back-to-toc" href="nav.xhtml">↑ Voltar ao Índice Geral</a>
</section>
</body>
</html>`;
    xhtmlFiles.push({ id: sec.fileId, href: sec.href, content: pageXhtml });

    const chTree = renderChaptersTocListHtml(sec.chapters, sec.href);
    navPartLis.push(
      `    <li><a class="toc-part-label" href="${sec.href}">${escHtml(sec.partTitle)}</a>${
        chTree ? "\n" + chTree : ""
      }</li>`
    );
  }

  const glossaryXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head>
<meta charset="utf-8"/>
<title>Glossário Pāḷi</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="backmatter">
${glossaryHtml}
<a class="back-to-toc" href="nav.xhtml">↑ Voltar ao Índice Geral</a>
</body>
</html>`;

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head>
<meta charset="utf-8"/>
<title>${escHtml(title)} — Índice</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="frontmatter">
<div class="part-header-box">
  <div class="breadcrumb-line">${escHtml(grpTitle)}</div>
  <h1>${escHtml(title)}</h1>
  <div class="part-subtitle">${escHtml(author)}</div>
</div>
<nav epub:type="toc" id="toc">
  <h1>Índice Analítico (Partes, Capítulos e Subcapítulos)</h1>
  <ol>
${navPartLis.join("\n")}
    <li><a class="toc-part-label" href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</nav>
<nav epub:type="landmarks" hidden="hidden">
  <ol>
    <li><a epub:type="toc" href="nav.xhtml">Índice</a></li>
    <li><a epub:type="bodymatter" href="${sections[0]!.href}">Início do Texto</a></li>
    <li><a epub:type="glossary" href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</nav>
</body>
</html>`;

  const manifestItems = xhtmlFiles
    .map((f) => `  <item id="${f.id}" href="${f.href}" media-type="application/xhtml+xml"/>`)
    .join("\n");
  const spineItems = xhtmlFiles.map((f) => `  <itemref idref="${f.id}"/>`).join("\n");

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>${escHtml(title)}</dc:title>
  <dc:creator>${escHtml(author)}</dc:creator>
  <dc:language>pi</dc:language>
  <dc:identifier id="uid">abhidhamma-export-${Date.now()}</dc:identifier>
  <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
</metadata>
<manifest>
  <item id="font-reg" href="fonts/GentiumBookPlus-Regular.ttf" media-type="font/ttf"/>
  <item id="font-ita" href="fonts/GentiumBookPlus-Italic.ttf" media-type="font/ttf"/>
  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  <item id="css" href="style.css" media-type="text/css"/>
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${manifestItems}
  <item id="glossary" href="glossary.xhtml" media-type="application/xhtml+xml"/>
</manifest>
<spine toc="ncx">
  <itemref idref="nav"/>
${spineItems}
  <itemref idref="glossary"/>
</spine>
</package>`;

  let playOrder = 0;
  const nextPlayOrder = () => ++playOrder;

  const ncxPartPoints = sections
    .map((sec) => {
      const po = nextPlayOrder();
      const chPoints = renderNcxChapterPoints(sec.chapters, sec.href, nextPlayOrder, "      ");
      return `    <navPoint id="nav_${sec.fileId}" playOrder="${po}">
      <navLabel><text>${escHtml(sec.partTitle)}</text></navLabel>
      <content src="${sec.href}"/>
${chPoints ? chPoints + "\n" : ""}    </navPoint>`;
    })
    .join("\n");

  const glossPo = nextPlayOrder();
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="abhidhamma-export"/></head>
<docTitle><text>${escHtml(title)}</text></docTitle>
<navMap>
${ncxPartPoints}
  <navPoint id="glossary" playOrder="${glossPo}">
    <navLabel><text>Glossário Pāḷi</text></navLabel>
    <content src="glossary.xhtml"/>
  </navPoint>
</navMap>
</ncx>`;

  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
  <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>`;

  const zipEntries: ZipEntry[] = [
    { name: "mimetype", data: enc.encode("application/epub+zip") },
    { name: "META-INF/container.xml", data: enc.encode(container) },
    { name: "OEBPS/content.opf", data: enc.encode(opf) },
    { name: "OEBPS/toc.ncx", data: enc.encode(ncx) },
    { name: "OEBPS/nav.xhtml", data: enc.encode(navXhtml) },
    { name: "OEBPS/style.css", data: enc.encode(EPUB_CSS) },
  ];
  for (const f of xhtmlFiles) {
    zipEntries.push({ name: `OEBPS/${f.href}`, data: enc.encode(f.content) });
  }
  zipEntries.push({ name: "OEBPS/glossary.xhtml", data: enc.encode(glossaryXhtml) });
  if (fontReg.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
  if (fontIta.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });

  return buildZip(zipEntries);
}

function downloadBlob(bytes: Uint8Array, filename: string, mimeType: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Full Corpus EPUB 3 Builder (5-level hierarchical TOC: Group → Work → Part → Chapter → Subchapter) ──

interface CorpusPartChapterFile {
  fileId: string;
  href: string;
  workId: string;
  workTitle: string;
  partKey: string;
  partTitle: string;
  group: string;
  groupTitle: string;
  chapters: ChapterTocNode[];
  xhtml: string;
}

export async function buildFullCorpusEpub(
  manifest: Manifest,
  langMode: LangMode,
  onProgress: (msg: string) => void
): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const partFiles: CorpusPartChapterFile[] = [];
  let workIdx = 0;

  onProgress("Incorporando fonte tipográfica Pāḷi (Gentium Book Plus 13pt)...");
  let fontReg = new Uint8Array();
  let fontIta = new Uint8Array();
  try {
    const regRes = await fetch("fonts/GentiumBookPlus-Regular.ttf");
    if (regRes.ok) fontReg = new Uint8Array(await regRes.arrayBuffer());
    const itaRes = await fetch("fonts/GentiumBookPlus-Italic.ttf");
    if (itaRes.ok) fontIta = new Uint8Array(await itaRes.arrayBuffer());
  } catch (e) {
    console.warn("Fonts not found", e);
  }

  const rawGlossary = await loadGlossary();
  const termsMap = new Map<string, string>();
  rawGlossary.forEach((entry, idx) => {
    const headword = entry.h.split(" / ")[0]!.split(" ")[0]!.toLowerCase().normalize("NFC");
    termsMap.set(headword, String(idx));
  });

  for (const [group, works] of orderedGroupEntries(manifest)) {
    const groupTitle = getGroupDisplayTitle(group);
    for (const work of works) {
      workIdx++;
      const workCode = `work_${String(workIdx).padStart(3, "0")}`;
      onProgress(`Processando: ${work.title}…`);
      await new Promise((r) => setTimeout(r, 10));

      for (const partKey of orderedPartKeys(work.parts)) {
        const part = work.parts[partKey];
        if (!part) continue;
        const fileId = `${workCode}_${partKey}`;
        const href = `${fileId}.xhtml`;
        const partTitle = getPartDisplayTitle(partKey, part.label);

        const partSegs: Segment[] = [];
        for (const file of part.files) {
          try {
            const res = await fetch(`data/works/${work.id}/${file}`);
            if (res.ok) {
              const segs = (await res.json()) as Segment[];
              partSegs.push(...segs);
            }
          } catch {
            // skip broken chunk
          }
        }
        if (partSegs.length === 0) continue;

        const { bodyHtml, chapters } = buildSectionBodyAndToc(
          partSegs,
          langMode,
          termsMap,
          fileId,
          "glossary.xhtml"
        );

        const localToc = renderLocalPartTocXhtml(chapters, "");

        const xhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head>
<meta charset="utf-8"/>
<title>${escHtml(work.title)} — ${escHtml(partTitle)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="bodymatter">
<section epub:type="part" id="${fileId}">
  <div class="part-header-box">
    <div class="breadcrumb-line">${escHtml(groupTitle)}</div>
    <h1>${escHtml(work.title)}</h1>
    <div class="part-subtitle">${escHtml(partTitle)}</div>
  </div>
  <p style="text-align:center;margin:0.4em 0 1em 0;"><a class="back-to-toc" style="margin-top:0;border-top:none;padding-top:0;" href="nav.xhtml">↑ Ir para o Índice Geral da Coleção</a></p>
  ${localToc}
  ${bodyHtml}
  <a class="back-to-toc" href="nav.xhtml">↑ Voltar ao Índice Geral da Coleção</a>
</section>
</body>
</html>`;

        partFiles.push({
          fileId,
          href,
          workId: work.id,
          workTitle: work.title,
          partKey,
          partTitle,
          group,
          groupTitle,
          chapters,
          xhtml,
        });
      }
    }
  }

  // ── Build Glossary XHTML ──
  let glossaryRows = "";
  rawGlossary.forEach((term, idx) => {
    const parts: string[] = [`<strong>${escHtml(term.h)}</strong>`];
    if (term.pos) parts.push(`<em>(${escHtml(term.pos)})</em>`);
    parts.push(escHtml(term.en));
    parts.push(escHtml(term.pt));
    if (term.es) parts.push(escHtml(term.es));
    glossaryRows += `<p class="glossary-entry" id="dict_${idx}">${parts.join(" — ")}</p>\n`;
  });
  const glossaryXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head><meta charset="utf-8"/><title>Glossário Pāḷi</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body epub:type="backmatter">
<section epub:type="glossary" id="glossary_section">
<h1 id="glossary_title">Glossário Pāḷi</h1>
${glossaryRows}
<a class="back-to-toc" href="nav.xhtml">↑ Voltar ao Índice Geral</a>
</section>
</body></html>`;

  // ── Group partFiles by Group → Work → Part ──
  const groupMap = new Map<string, { groupTitle: string; works: Map<string, { workTitle: string; parts: CorpusPartChapterFile[] }> }>();
  for (const pf of partFiles) {
    if (!groupMap.has(pf.group)) {
      groupMap.set(pf.group, { groupTitle: pf.groupTitle, works: new Map() });
    }
    const gEntry = groupMap.get(pf.group)!;
    if (!gEntry.works.has(pf.workId)) {
      gEntry.works.set(pf.workId, { workTitle: pf.workTitle, parts: [] });
    }
    gEntry.works.get(pf.workId)!.parts.push(pf);
  }

  // ── Build hierarchical NCX (Group → Work → Part → Chapter → Subchapter) ──
  let playOrder = 0;
  const nextPlayOrder = () => ++playOrder;
  const ncxGroupPoints: string[] = [];

  for (const [grp, gData] of groupMap) {
    const grpPo = nextPlayOrder();
    const firstGroupHref = gData.works.values().next().value?.parts[0]?.href ?? "nav.xhtml";
    const ncxWorkPoints: string[] = [];

    for (const [workId, wData] of gData.works) {
      const workPo = nextPlayOrder();
      const firstWorkHref = wData.parts[0]?.href ?? "nav.xhtml";
      const ncxPartPoints: string[] = [];

      for (const pf of wData.parts) {
        const partPo = nextPlayOrder();
        const chPoints = renderNcxChapterPoints(pf.chapters, pf.href, nextPlayOrder, "          ");
        ncxPartPoints.push(`        <navPoint id="ncx_${pf.fileId}" playOrder="${partPo}">
          <navLabel><text>${escHtml(pf.partTitle)}</text></navLabel>
          <content src="${pf.href}"/>
${chPoints ? chPoints + "\n" : ""}        </navPoint>`);
      }

      ncxWorkPoints.push(`      <navPoint id="ncx_work_${workId}" playOrder="${workPo}">
        <navLabel><text>${escHtml(wData.workTitle)}</text></navLabel>
        <content src="${firstWorkHref}"/>
${ncxPartPoints.join("\n")}
      </navPoint>`);
    }

    ncxGroupPoints.push(`    <navPoint id="ncx_grp_${grp}" playOrder="${grpPo}">
      <navLabel><text>${escHtml(gData.groupTitle)}</text></navLabel>
      <content src="${firstGroupHref}"/>
${ncxWorkPoints.join("\n")}
    </navPoint>`);
  }

  const glossPo = nextPlayOrder();
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="abhidhamma-full"/></head>
<docTitle><text>Abhidhamma Piṭaka — Coleção Completa</text></docTitle>
<navMap>
${ncxGroupPoints.join("\n")}
  <navPoint id="ncx_glossary" playOrder="${glossPo}">
    <navLabel><text>Glossário Pāḷi</text></navLabel>
    <content src="glossary.xhtml"/>
  </navPoint>
</navMap>
</ncx>`;

  // ── Build EPUB 3 nav.xhtml (Short Summary Index + Full 5-Level Analytical Index) ──
  const shortNavLists: string[] = [];
  const fullNavLists: string[] = [];

  for (const [, gData] of groupMap) {
    const firstGroupHref = gData.works.values().next().value?.parts[0]?.href ?? "nav.xhtml";
    const shortWorkLis: string[] = [];
    const fullWorkLis: string[] = [];

    for (const [, wData] of gData.works) {
      const firstWorkHref = wData.parts[0]?.href ?? "nav.xhtml";
      const shortPartLinks = wData.parts
        .map((pf) => `<a href="${pf.href}">${escHtml(pf.partTitle)}</a>`)
        .join(" · ");
      shortWorkLis.push(
        `        <li><a class="toc-work-label" href="${firstWorkHref}">${escHtml(wData.workTitle)}</a> — <span>${shortPartLinks}</span></li>`
      );

      const fullPartLis = wData.parts
        .map((pf) => {
          const chTree = renderChaptersTocListHtml(pf.chapters, pf.href);
          return `          <li><a class="toc-part-label" href="${pf.href}">${escHtml(pf.partTitle)}</a>${
            chTree ? "\n" + chTree : ""
          }</li>`;
        })
        .join("\n");

      fullWorkLis.push(
        `        <li><a class="toc-work-label" href="${firstWorkHref}">${escHtml(wData.workTitle)}</a>
          <ol>
${fullPartLis}
          </ol>
        </li>`
      );
    }

    shortNavLists.push(
      `      <li><a class="toc-grp-label" href="${firstGroupHref}">${escHtml(gData.groupTitle)}</a>
        <ol>
${shortWorkLis.join("\n")}
        </ol>
      </li>`
    );

    fullNavLists.push(
      `      <li><a class="toc-grp-label" href="${firstGroupHref}">${escHtml(gData.groupTitle)}</a>
        <ol>
${fullWorkLis.join("\n")}
        </ol>
      </li>`
    );
  }

  const firstBodyHref = partFiles[0]?.href ?? "glossary.xhtml";
  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pi" xml:lang="pi">
<head>
<meta charset="utf-8"/>
<title>Abhidhamma Piṭaka — Índice Geral</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body epub:type="frontmatter">
<div class="part-header-box">
  <div class="breadcrumb-line">Tipiṭaka Chaṭṭha Saṅgāyana</div>
  <h1>Abhidhamma Piṭaka — Coleção Completa</h1>
  <div class="part-subtitle">Mūla · Aṭṭhakathā · Ṭīkā · Anuṭīkā · Tratados · Visuddhimagga</div>
</div>
<div class="toc-header">
  <h2>Visão Rápida de Tratados, Obras e Comentários</h2>
  <ol class="toc-short">
${shortNavLists.join("\n")}
    <li><a class="toc-grp-label" href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</div>
<hr/>
<nav epub:type="toc" id="toc">
  <h1>Índice Analítico Completo (Tratados, Obras, Comentários, Capítulos e Subcapítulos)</h1>
  <ol>
${fullNavLists.join("\n")}
    <li><a class="toc-grp-label" href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</nav>
<nav epub:type="landmarks" hidden="hidden">
  <ol>
    <li><a epub:type="toc" href="nav.xhtml">Índice Geral</a></li>
    <li><a epub:type="bodymatter" href="${firstBodyHref}">Início do Corpus</a></li>
    <li><a epub:type="glossary" href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</nav>
</body>
</html>`;

  // ── Build OPF manifest + spine ──
  const manifestItems = partFiles
    .map((c) => `  <item id="${c.fileId}" href="${c.href}" media-type="application/xhtml+xml"/>`)
    .join("\n");
  const spineItems = partFiles.map((c) => `  <itemref idref="${c.fileId}"/>`).join("\n");

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>Abhidhamma Piṭaka — Coleção Completa</dc:title>
  <dc:creator>Buddha; Buddhaghosa; Dhammapāla; Anuruddha; Buddhadatta; Nina van Gorkom</dc:creator>
  <dc:language>pi</dc:language>
  <dc:identifier id="uid">abhidhamma-full-${Date.now()}</dc:identifier>
  <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
</metadata>
<manifest>
  <item id="font-reg" href="fonts/GentiumBookPlus-Regular.ttf" media-type="font/ttf"/>
  <item id="font-ita" href="fonts/GentiumBookPlus-Italic.ttf" media-type="font/ttf"/>
  <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  <item id="css" href="style.css" media-type="text/css"/>
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  <item id="glossary" href="glossary.xhtml" media-type="application/xhtml+xml"/>
${manifestItems}
</manifest>
<spine toc="ncx">
  <itemref idref="nav"/>
${spineItems}
  <itemref idref="glossary"/>
</spine>
</package>`;

  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
  <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>`;

  const zipEntries: ZipEntry[] = [
    { name: "mimetype", data: enc.encode("application/epub+zip") },
    { name: "META-INF/container.xml", data: enc.encode(container) },
    { name: "OEBPS/content.opf", data: enc.encode(opf) },
    { name: "OEBPS/toc.ncx", data: enc.encode(ncx) },
    { name: "OEBPS/nav.xhtml", data: enc.encode(navXhtml) },
    { name: "OEBPS/glossary.xhtml", data: enc.encode(glossaryXhtml) },
    { name: "OEBPS/style.css", data: enc.encode(EPUB_CSS) },
  ];
  if (fontReg.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
  if (fontIta.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });

  for (const pf of partFiles) {
    zipEntries.push({ name: `OEBPS/${pf.href}`, data: enc.encode(pf.xhtml) });
  }

  onProgress("Finalizando pacote EPUB 3...");
  await new Promise((r) => setTimeout(r, 40));

  return buildZip(zipEntries);
}

// ── Fetch segments ────────────────────────────────────────────────────────────

async function fetchWorkSegments(
  workId: string,
  files: string[],
  fromSegId: number | null,
  toSegId: number | null
): Promise<Segment[]> {
  const all: Segment[] = [];
  for (const file of files) {
    const res = await fetch(`data/works/${workId}/${file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${file}`);
    const segs = (await res.json()) as Segment[];
    all.push(...segs);
  }
  if (fromSegId == null && toSegId == null) return all;
  return all.filter(
    (s) =>
      (fromSegId == null || s.id >= fromSegId) &&
      (toSegId == null || s.id <= toSegId)
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function makeSelect(id: string): HTMLSelectElement {
  const s = document.createElement("select");
  s.id = id;
  s.style.cssText =
    "width:100%;margin:.4em 0 .8em;padding:6px 8px;border-radius:5px;border:1px solid var(--border);background:var(--bg-content);color:var(--text);";
  return s;
}

function makeLabel(text: string): HTMLLabelElement {
  const l = document.createElement("label");
  l.style.cssText = "font-size:.85em;color:var(--text-muted);display:block;margin-top:.6em;";
  l.textContent = text;
  return l;
}

function makeButton(text: string, id: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.id = id;
  b.className = "export-btn";
  b.textContent = text;
  b.style.cssText =
    "width:100%;padding:8px;margin:.4em 0;background:var(--accent);color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:.95em;";
  return b;
}

// ── Panel init ────────────────────────────────────────────────────────────────

export function initExportPanel(
  manifest: Manifest,
  container: HTMLElement,
  getCurrentWorkId: () => string | null
): void {
  const allWorks: Array<{ group: string; work: WorkEntry }> = [];
  for (const [group, works] of orderedGroupEntries(manifest)) {
    for (const work of works) allWorks.push({ group, work });
  }

  container.appendChild(makeLabel(t("exportWork", settings.uiLang)));
  const workSel = makeSelect("export-work");

  const optAll = document.createElement("option");
  optAll.value = "all_works";
  optAll.textContent = "📚 " + t("exportAllWorks", settings.uiLang);
  workSel.appendChild(optAll);

  const sep = document.createElement("option");
  sep.disabled = true;
  sep.textContent = "────────────────────";
  workSel.appendChild(sep);

  for (const { group, work } of allWorks) {
    const opt = document.createElement("option");
    opt.value = work.id;
    opt.textContent = `${t(`groupTitle_${group}`, settings.uiLang)}: ${work.title}`;
    workSel.appendChild(opt);
  }
  container.appendChild(workSel);

  container.appendChild(makeLabel(t("exportPart", settings.uiLang)));
  const partsDiv = document.createElement("div");
  partsDiv.id = "export-parts";
  partsDiv.style.cssText = "margin-bottom:.8em;";
  container.appendChild(partsDiv);

  const chapDiv = document.createElement("div");
  chapDiv.id = "export-chapters";
  const chapFromLabel = makeLabel(t("exportChaptersFrom", settings.uiLang));
  const chapFromSel = makeSelect("export-from");
  const chapToLabel = makeLabel(t("exportChaptersTo", settings.uiLang));
  const chapToSel = makeSelect("export-to");
  chapDiv.appendChild(chapFromLabel);
  chapDiv.appendChild(chapFromSel);
  chapDiv.appendChild(chapToLabel);
  chapDiv.appendChild(chapToSel);
  container.appendChild(chapDiv);

  container.appendChild(makeLabel(t("exportLang", settings.uiLang)));
  const langSel = makeSelect("export-lang");
  const langOptions: Array<[LangMode, string]> = [
    ["en", t("exportLangEn", settings.uiLang)],
    ["pali+en", t("exportLangPaliEn", settings.uiLang)],
    ["pali+en+pt", t("exportLangPaliEnPt", settings.uiLang)],
    ["pt", t("exportLangPt", settings.uiLang)],
    ["pali+pt", t("exportLangPaliPt", settings.uiLang)],
    ["es", t("exportLangEs", settings.uiLang)],
    ["pali+es", t("exportLangPaliEs", settings.uiLang)],
    ["pali+en+es", t("exportLangPaliEnEs", settings.uiLang)],
  ];
  for (const [value, label] of langOptions) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    langSel.appendChild(opt);
  }
  container.appendChild(langSel);

  const pdfBtn = makeButton(t("exportPdf", settings.uiLang), "export-btn-pdf");
  const epubBtn = makeButton(t("exportEpub", settings.uiLang), "export-btn-epub");
  epubBtn.style.background = "var(--translation-bar)";
  container.appendChild(pdfBtn);
  container.appendChild(epubBtn);

  const statusDiv = document.createElement("div");
  statusDiv.style.cssText = "font-size:.8em;color:var(--text-muted);margin-top:.5em;min-height:1.2em;";
  container.appendChild(statusDiv);

  function getSelectedWork(): WorkEntry | null {
    const id = workSel.value;
    return allWorks.find((w) => w.work.id === id)?.work ?? null;
  }

  function getSelectedPartKeys(): string[] {
    return Array.from(partsDiv.querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked")).map(
      (cb) => cb.value
    );
  }

  function getChapterToc(work: WorkEntry, partKey: string): TocEntry[] {
    return (work.parts[partKey]?.toc ?? []).filter((e) => e.rend === "chapter");
  }

  function refreshChapterRange(work: WorkEntry, partKeys: string[]): void {
    if (partKeys.length !== 1) {
      chapDiv.style.display = "none";
      return;
    }
    const key = partKeys[0]!;
    const chapters = getChapterToc(work, key);
    if (chapters.length === 0) {
      chapDiv.style.display = "none";
      return;
    }
    chapDiv.style.display = "block";

    function fillSelect(sel: HTMLSelectElement): void {
      sel.innerHTML = "";
      const allOpt = document.createElement("option");
      allOpt.value = "";
      allOpt.textContent = t("exportAllChapters", settings.uiLang);
      sel.appendChild(allOpt);
      for (const ch of chapters) {
        const opt = document.createElement("option");
        opt.value = String(ch.id);
        opt.textContent = ch.text.slice(0, 60);
        sel.appendChild(opt);
      }
    }
    fillSelect(chapFromSel);
    fillSelect(chapToSel);
    chapToSel.selectedIndex = chapToSel.options.length - 1;
  }

  function refreshParts(work: WorkEntry): void {
    partsDiv.innerHTML = "";
    for (const partKey of orderedPartKeys(work.parts)) {
      const label = document.createElement("label");
      label.style.cssText = "display:flex;align-items:center;gap:6px;margin:.25em 0;cursor:pointer;";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = partKey;
      cb.checked = true;
      cb.addEventListener("change", () => {
        const keys = getSelectedPartKeys();
        refreshChapterRange(work, keys);
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(t(`part_${partKey}`, settings.uiLang) || partKey));
      partsDiv.appendChild(label);
    }
    const allKeys = getSelectedPartKeys();
    refreshChapterRange(work, allKeys);
  }

  workSel.addEventListener("change", () => {
    const isAll = workSel.value === "all_works";
    partsDiv.style.display = isAll ? "none" : "";
    chapDiv.style.display = isAll ? "none" : "";
    pdfBtn.style.display = "";
    if (!isAll) {
      const work = getSelectedWork();
      if (work) refreshParts(work);
    }
  });

  const currentId = getCurrentWorkId();
  if (currentId) {
    const opt = Array.from(workSel.options).find((o) => o.value === currentId);
    if (opt) workSel.value = currentId;
  }
  workSel.dispatchEvent(new Event("change"));

  async function runExport(format: "pdf" | "epub"): Promise<void> {
    const langMode = langSel.value as LangMode;

    // ── Full Corpus Export (EPUB or PDF) ──
    if (workSel.value === "all_works") {
      statusDiv.textContent = t("exportBuilding", settings.uiLang);
      pdfBtn.disabled = true;
      epubBtn.disabled = true;
      try {
        if (format === "epub") {
          const bytes = await buildFullCorpusEpub(manifest, langMode, (msg) => {
            statusDiv.textContent = msg;
          });
          downloadBlob(bytes, "Abhidhamma_Colecao_Completa.epub", "application/epub+zip");
        } else {
          const html = await buildFullCorpusPrintHtml(manifest, langMode, (msg) => {
            statusDiv.textContent = msg;
          });
          openPrintWindow(html, "Abhidhamma_Colecao_Completa");
        }
        statusDiv.textContent = "";
      } catch (err) {
        log.error("full corpus export failed", err);
        statusDiv.textContent = "Export failed. See console.";
      } finally {
        pdfBtn.disabled = false;
        epubBtn.disabled = false;
      }
      return;
    }

    // ── Single Work Export ──
    const work = getSelectedWork();
    if (!work) return;
    const partKeys = getSelectedPartKeys();
    if (partKeys.length === 0) {
      statusDiv.textContent = "Select at least one part.";
      return;
    }

    let fromSegId: number | null = null;
    let toSegId: number | null = null;
    if (partKeys.length === 1 && chapDiv.style.display !== "none") {
      const fromVal = chapFromSel.value;
      const toVal = chapToSel.value;
      if (fromVal) fromSegId = Number(fromVal);
      if (toVal) {
        const partKey = partKeys[0]!;
        const chapters = getChapterToc(work, partKey);
        const toIdx = chapters.findIndex((c) => String(c.id) === toVal);
        if (toIdx >= 0) {
          const nextChapter = chapters[toIdx + 1];
          toSegId = nextChapter ? nextChapter.id - 1 : null;
        }
      }
    }

    statusDiv.textContent = t("exportBuilding", settings.uiLang);
    pdfBtn.disabled = true;
    epubBtn.disabled = true;

    try {
      let allSegs: Segment[] = [];
      let partLabel = "";
      const partSegsList: Array<{ partKey: string; partTitle: string; segs: Segment[] }> = [];

      for (const partKey of partKeys) {
        const part = work.parts[partKey];
        if (!part) continue;
        const pTitle = getPartDisplayTitle(partKey, part.label);
        partLabel += (partLabel ? " + " : "") + pTitle;
        const segs = await fetchWorkSegments(
          work.id,
          part.files,
          partKeys.length === 1 ? fromSegId : null,
          partKeys.length === 1 ? toSegId : null
        );
        allSegs = allSegs.concat(segs);
        partSegsList.push({ partKey, partTitle: pTitle, segs });
      }

      const title =
        partKeys.length === 1
          ? `${work.title} — ${partLabel}`
          : work.title;

      const glossary = await loadGlossary();
      const usedTerms = collectUsedTerms(allSegs, glossary);
      const termsMap = new Map<string, string>();
      usedTerms.forEach((entry, idx) => {
        const headword = entry.h.split(" / ")[0]!.split(" ")[0]!.toLowerCase().normalize("NFC");
        termsMap.set(headword, String(idx));
      });
      const glossaryHtml = buildGlossaryHtml(usedTerms, langMode, termsMap);
      const workGroup = allWorks.find((w) => w.work.id === work.id)?.group ?? "";

      const linkTarget = format === "pdf" ? "" : "glossary.xhtml";
      const partSections: PartExportSection[] = partSegsList.map((item) => {
        const fileId = `part_${item.partKey}`;
        const { bodyHtml, chapters } = buildSectionBodyAndToc(
          item.segs,
          langMode,
          termsMap,
          fileId,
          linkTarget
        );
        return {
          partKey: item.partKey,
          partTitle: item.partTitle,
          fileId,
          href: `${fileId}.xhtml`,
          chapters,
          bodyHtml,
        };
      });

      if (format === "pdf") {
        const html = buildPrintHtml(
          allSegs,
          title,
          langMode,
          glossaryHtml,
          termsMap,
          work.id,
          workGroup,
          partSections
        );
        openPrintWindow(html, title);
      } else {
        statusDiv.textContent = "Incorporando fonte tipográfica Pāḷi (Gentium Book Plus 13pt)...";
        let fontReg = new Uint8Array();
        let fontIta = new Uint8Array();
        try {
          const regRes = await fetch("fonts/GentiumBookPlus-Regular.ttf");
          if (regRes.ok) fontReg = new Uint8Array(await regRes.arrayBuffer());
          const itaRes = await fetch("fonts/GentiumBookPlus-Italic.ttf");
          if (itaRes.ok) fontIta = new Uint8Array(await itaRes.arrayBuffer());
        } catch (e) {
          console.warn("Fonts not found", e);
        }
        statusDiv.textContent = "Gerando EPUB 3...";
        const bytes = buildEpub(
          allSegs,
          title,
          langMode,
          glossaryHtml,
          termsMap,
          fontReg,
          fontIta,
          work.id,
          workGroup,
          partSections
        );
        const slug = work.id.replace(/[^a-z0-9]/gi, "-");
        downloadBlob(bytes, `${slug}.epub`, "application/epub+zip");
      }
      statusDiv.textContent = "";
    } catch (err) {
      log.error("export failed", err);
      statusDiv.textContent = "Export failed. See console.";
    } finally {
      pdfBtn.disabled = false;
      epubBtn.disabled = false;
    }
  }

  pdfBtn.addEventListener("click", () => void runExport("pdf"));
  epubBtn.addEventListener("click", () => void runExport("epub"));
}
