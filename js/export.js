import { t } from "./i18n.js?v=a38f104a";
import { settings } from "./state.js?v=a38f104a";
import { createLogger } from "./logger.js?v=a38f104a";
const log = createLogger("export");
let glossaryData = null;
async function loadGlossary() {
    if (glossaryData)
        return glossaryData;
    try {
        const res = await fetch("data/dictionary/common_pali.json");
        if (!res.ok)
            return [];
        const data = await res.json();
        glossaryData = (data.entries ?? []);
        return glossaryData;
    }
    catch {
        return [];
    }
}
export function collectUsedTerms(segs, glossary) {
    const headwords = new Set(glossary.map((g) => g.h.toLowerCase()));
    const found = new Set();
    for (const seg of segs) {
        const paliText = (seg.pali || "").toLowerCase();
        for (const hw of headwords) {
            if (!found.has(hw) && paliText.includes(hw.split(" / ")[0].split(" ")[0])) {
                found.add(hw);
            }
        }
    }
    return glossary
        .filter((g) => found.has(g.h.toLowerCase()))
        .sort((a, b) => a.h.localeCompare(b.h, "pi"));
}
export function buildGlossaryHtml(terms, langMode) {
    if (terms.length === 0)
        return "";
    const mode = langMode;
    const showEn = mode.includes("en");
    const showPt = mode.includes("pt");
    const showEs = mode.includes("es");
    const rows = terms.map((term) => {
        const parts = [`<strong>${escHtml(term.h)}</strong>`];
        if (term.pos)
            parts.push(`<em>(${escHtml(term.pos)})</em>`);
        if (showEn || (!showPt && !showEs))
            parts.push(escHtml(term.en));
        if (showPt)
            parts.push(escHtml(term.pt));
        if (showEs && term.es)
            parts.push(escHtml(term.es));
        return `<p class="glossary-entry">${parts.join(" — ")}</p>`;
    });
    return `
<div class="glossary-appendix">
<h2 class="chapter" style="page-break-before:always;">Pāḷi Glossary / Glossário Pāḷi</h2>
${rows.join("\n")}
</div>`;
}
const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++)
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[i] = c;
    }
    return t;
})();
export function crc32(data) {
    let c = 0xffffffff;
    for (const b of data)
        c = (CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)) >>> 0;
    return (~c) >>> 0;
}
export function writeUint16LE(view, offset, value) {
    view.setUint16(offset, value, true);
}
export function writeUint32LE(view, offset, value) {
    view.setUint32(offset, value, true);
}
export function buildZip(entries) {
    const enc = new TextEncoder();
    const fileData = [];
    const parts = [];
    let offset = 0;
    for (const entry of entries) {
        const nameBytes = enc.encode(entry.name);
        const data = entry.data;
        const crc = crc32(data);
        const localHeader = new Uint8Array(30 + nameBytes.length);
        const lv = new DataView(localHeader.buffer);
        writeUint32LE(lv, 0, 0x04034b50);
        writeUint16LE(lv, 4, 20);
        writeUint16LE(lv, 6, 0);
        writeUint16LE(lv, 8, 0);
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
    const cdParts = [];
    const cdStart = offset;
    for (const { name, data, crc, offset: fileOffset } of fileData) {
        const cd = new Uint8Array(46 + name.length);
        const cv = new DataView(cd.buffer);
        writeUint32LE(cv, 0, 0x02014b50);
        writeUint16LE(cv, 4, 20);
        writeUint16LE(cv, 6, 20);
        writeUint16LE(cv, 8, 0);
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
export function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function linkifyText(text, termsMap) {
    if (!text)
        return "";
    if (!termsMap || termsMap.size === 0)
        return escHtml(text);
    const wordRegex = /([\p{L}\p{M}]+)/gu;
    const parts = text.split(wordRegex);
    let out = "";
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            out += escHtml(parts[i] || "");
        }
        else {
            const word = parts[i] || "";
            const lower = word.toLowerCase();
            const termId = termsMap.get(lower);
            if (termId) {
                out += `<a epub:type="glossref" href="glossary.xhtml#dict_${termId}">${escHtml(word)}</a>`;
            }
            else {
                out += escHtml(word);
            }
        }
    }
    return out;
}
export function walkNode(node, termsMap) {
    if (node.nodeType === Node.TEXT_NODE)
        return linkifyText(node.textContent ?? "", termsMap);
    if (node.nodeType !== Node.ELEMENT_NODE)
        return "";
    const el = node;
    const tag = el.tagName.toLowerCase();
    const inner = Array.from(el.childNodes).map(n => walkNode(n, termsMap)).join("");
    if (tag === "b" || tag === "strong")
        return `<strong>${inner}</strong>`;
    if (tag === "i" || tag === "em")
        return `<em>${inner}</em>`;
    if (tag === "sup")
        return `<sup>${inner}</sup>`;
    if (tag === "br")
        return "<br>";
    if (tag === "p") {
        const rend = el.getAttribute("rend");
        const cls = rend ? ` class="rend-${escHtml(rend)}"` : "";
        return inner ? `<br><span${cls}>${inner}</span>` : "";
    }
    return inner;
}
export function fieldHtml(raw, termsMap) {
    if (!raw)
        return "";
    if (!raw.includes("<"))
        return linkifyText(raw, termsMap);
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${raw}</body>`, "text/html");
    return walkNode(doc.body, termsMap);
}
export function segToHtml(seg, langMode, termsMap) {
    const rend = seg.rend;
    const paliText = seg.pali ?? "";
    const enText = seg.en ?? "";
    const ptText = seg.pt ?? "";
    const esText = seg.es ?? "";
    const showPali = langMode.startsWith("pali");
    const showEn = langMode === "en" || langMode === "pali+en" || langMode === "pali+en+pt" || langMode === "pali+en+es";
    const showPt = langMode === "pali+en+pt" || langMode === "pt" || langMode === "pali+pt";
    const showEs = langMode === "es" || langMode === "pali+es" || langMode === "pali+en+es";
    let inner = "";
    if (showPali && paliText) {
        inner += `<div class="line pali">${fieldHtml(paliText)}</div>`;
    }
    if (showEn) {
        const textToUse = enText || paliText;
        if (textToUse && !(showPali && textToUse === paliText)) {
            inner += `<div class="line en">${fieldHtml(textToUse, termsMap)}</div>`;
        }
    }
    if (showPt && ptText) {
        inner += `<div class="line pt">${fieldHtml(ptText, termsMap)}</div>`;
    }
    if (showEs && esText) {
        inner += `<div class="line es">${fieldHtml(esText, termsMap)}</div>`;
    }
    if (seg.notes && seg.notes.length > 0) {
        seg.notes.forEach((note, idx) => {
            const noteId = `note_${seg.id}_${idx}`;
            inner += ` <a epub:type="noteref" href="#${noteId}"><sup>[${idx + 1}]</sup></a>`;
            inner += `<aside epub:type="footnote" id="${noteId}" class="epub-footnote"><p>${escHtml(note)}</p></aside>`;
        });
    }
    if (!inner)
        return "";
    if (rend === "book" || rend === "title" || rend === "nikaya")
        return `<h1 class="seg title">${inner}</h1>`;
    if (rend === "chapter")
        return `<h2 class="seg chapter">${inner}</h2>`;
    if (rend === "subhead")
        return `<h3 class="seg subhead">${inner}</h3>`;
    if (rend === "subsubhead")
        return `<h4 class="seg subsubhead">${inner}</h4>`;
    if (rend === "hangnum")
        return `<p class="seg hangnum">${inner}</p>`;
    if (rend === "indent")
        return `<blockquote class="seg indent">${inner}</blockquote>`;
    if (rend === "footnote")
        return `<p class="seg footnote">${inner}</p>`;
    if (rend === "centre")
        return `<p class="seg centre">${inner}</p>`;
    if (rend === "glossary")
        return `<p class="seg glossary">${inner}</p>`;
    return `<p class="seg bodytext">${inner}</p>`;
}
const PRINT_CSS = `
body{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:14pt;line-height:1.6;color:#111;background:#fff;}
h1.title{text-align:center;font-size:1.8em;border-bottom:2px solid #333;padding-bottom:.5em;margin-bottom:1em;page-break-before:always;}
h1.title:first-of-type{page-break-before:avoid;}
h2.chapter{page-break-before:always;font-size:1.5em;border-bottom:1px solid #ccc;padding-bottom:.4em;margin-top:0;}
h2.chapter:first-of-type{page-break-before:avoid;}
h3.subhead{font-size:1.1em;margin-top:1.4em;}
h4.subsubhead{font-size:1em;font-style:italic;margin-top:1em;}
p.bodytext{margin:.5em 0;}
blockquote.indent{margin:1em 2em;border-left:3px solid #999;padding-left:1em;font-style:italic;}
p.hangnum{margin:.4em 0 .4em 1.5em;}
p.footnote{font-size:.85em;color:#555;margin:.3em 0;}
p.centre{text-align:center;margin:.5em 0;}
p.glossary{margin:.5em 0;}
p.glossary .line.pali{font-weight:700;}
.line.pali{font-style:italic;color:#444;}
.line.en,.line.pt,.line.es{margin:.15em 0;}
span.rend-gathalast{margin-left:2em;}
span.rend-gatha1,span.rend-gatha2,span.rend-gatha3{margin-left:1em;}
@page{margin:1.8cm;@top-center{content:string(bookTitle);font-size:9pt;color:#666;}}
h2.chapter{string-set:bookTitle content();}
.glossary-appendix{page-break-before:always;}
.glossary-entry{margin:.3em 0;font-size:.95em;line-height:1.5;}
.glossary-entry strong{color:#333;}
.glossary-entry em{color:#666;font-size:.9em;}
`;
export function buildPrintHtml(segs, title, langMode, glossaryHtml) {
    const bodyParts = segs.map((s) => segToHtml(s, langMode)).filter(Boolean);
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escHtml(title)}</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<h1 style="font-size:1.8em;border-bottom:2px solid #333;padding-bottom:.5em;">${escHtml(title)}</h1>
${bodyParts.join("\n")}
${glossaryHtml}
<script>window.addEventListener("load",function(){setTimeout(function(){window.print();},600);});<\/script>
</body>
</html>`;
}
function openPrintWindow(html, title) {
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
const EPUB_CSS = `
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Regular.ttf');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Italic.ttf');
  font-weight: normal;
  font-style: italic;
}
body {
  font-family: 'Gentium Book Plus', Georgia, serif;
  font-size: 1.1em;
  line-height: 1.6;
  margin: 5% 5%;
  color: #111;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
}
h1 { text-align: center; font-size: 1.8em; border-bottom: 2px solid #333; padding-bottom: 0.4em; margin-bottom: 1em; hyphens: none; }
h2 { font-size: 1.4em; margin-top: 2em; padding-top: 0.5em; border-top: 1px solid #ccc; hyphens: none; }
h3 { font-size: 1.2em; margin-top: 1.2em; hyphens: none; }
h4 { font-size: 1em; font-style: italic; margin-top: 1em; }
p { margin: 0.8em 0; }
p.centre { text-align: center; }
p.glossary .line.pali { font-weight: 700; }
blockquote { margin: 1em 5%; font-style: italic; }
.pali { font-style: italic; color: #333; margin-bottom: 0.2em; }
.en, .pt, .es { margin-top: 0.1em; margin-bottom: 0.4em; }
.back-to-toc { display: block; text-align: center; margin-top: 2em; font-size: 0.9em; text-decoration: none; color: #555; border-top: 1px dashed #ccc; padding-top: 1em; }
.toc-header h1 { margin-bottom: 0.5em; border-bottom: none; }
.toc-header h2 { font-size: 1.3em; margin-top: 1.5em; border-top: none; }
.toc-short, .toc-mid { list-style-type: none; padding-left: 0; }
.toc-short li, .toc-mid li { margin-bottom: 0.5em; }
.toc-mid ol { list-style-type: disc; padding-left: 1.5em; margin-top: 0.3em; }
`;
export function buildEpub(segs, title, langMode, glossaryHtml) {
    const enc = new TextEncoder();
    const bodyParts = segs.map((s) => segToHtml(s, langMode)).filter(Boolean);
    const contentHtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
<meta charset="utf-8"/>
<title>${escHtml(title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
<h1>${escHtml(title)}</h1>
${bodyParts.join("\n")}
${glossaryHtml}
</body>
</html>`;
    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>${escHtml(title)}</dc:title>
  <dc:language>pi</dc:language>
  <dc:identifier id="uid">abhidhamma-export-${Date.now()}</dc:identifier>
</metadata>
<manifest>
  <item id="font-reg" href="fonts/GentiumBookPlus-Regular.ttf" media-type="application/font-sfnt"/>
  <item id="font-ita" href="fonts/GentiumBookPlus-Italic.ttf" media-type="application/font-sfnt"/>
  <item id="content" href="content.html" media-type="application/xhtml+xml"/>
  <item id="css" href="style.css" media-type="text/css"/>
  <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
</manifest>
<spine toc="ncx">
  <itemref idref="content"/>
</spine>
</package>`;
    const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="abhidhamma-export"/></head>
<docTitle><text>${escHtml(title)}</text></docTitle>
<navMap>
  <navPoint id="content" playOrder="1">
    <navLabel><text>${escHtml(title)}</text></navLabel>
    <content src="content.html"/>
  </navPoint>
</navMap>
</ncx>`;
    const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
  <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>`;
    return buildZip([
        { name: "mimetype", data: enc.encode("application/epub+zip") },
        { name: "META-INF/container.xml", data: enc.encode(container) },
        { name: "OEBPS/content.opf", data: enc.encode(opf) },
        { name: "OEBPS/toc.ncx", data: enc.encode(ncx) },
        { name: "OEBPS/style.css", data: enc.encode(EPUB_CSS) },
        { name: "OEBPS/content.html", data: enc.encode(contentHtml) },
    ]);
}
function downloadBlob(bytes, filename, mimeType) {
    const blob = new Blob([bytes.buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}
async function buildFullCorpusEpub(manifest, langMode, onProgress) {
    const enc = new TextEncoder();
    const chapters = [];
    let fileIdx = 0;
    onProgress("Baixando fontes tipográficas...");
    let fontReg = new Uint8Array();
    let fontIta = new Uint8Array();
    try {
        const regRes = await fetch("fonts/GentiumBookPlus-Regular.ttf");
        if (regRes.ok)
            fontReg = new Uint8Array(await regRes.arrayBuffer());
        const itaRes = await fetch("fonts/GentiumBookPlus-Italic.ttf");
        if (itaRes.ok)
            fontIta = new Uint8Array(await itaRes.arrayBuffer());
    }
    catch (e) {
        console.warn("Fonts not found", e);
    }
    const rawGlossary = await loadGlossary();
    const termsMap = new Map();
    rawGlossary.forEach((entry, idx) => {
        const headword = entry.h.split(" / ")[0].split(" ")[0].toLowerCase();
        termsMap.set(headword, String(idx));
    });
    for (const [group, works] of Object.entries(manifest.groups)) {
        for (const work of works) {
            fileIdx++;
            const fileId = `work_${String(fileIdx).padStart(3, "0")}`;
            const href = `${fileId}.xhtml`;
            onProgress(`Processando: ${work.title}…`);
            await new Promise(r => setTimeout(r, 10));
            const allSegs = [];
            for (const part of Object.values(work.parts)) {
                for (const file of part.files) {
                    try {
                        const res = await fetch(`data/works/${work.id}/${file}`);
                        if (res.ok) {
                            const segs = (await res.json());
                            allSegs.push(...segs);
                        }
                    }
                    catch { }
                }
            }
            const anchors = [];
            let chIdx = 0;
            const bodyParts = [];
            for (const seg of allSegs) {
                const html = segToHtml(seg, langMode, termsMap);
                if (!html)
                    continue;
                const rend = seg.rend;
                if (rend === "chapter" || rend === "book" || rend === "title" || rend === "nikaya") {
                    chIdx++;
                    const anchorId = `${fileId}_ch${chIdx}`;
                    const label = (seg.pali || seg.en || seg.pt || "").replace(/<[^>]*>/g, "").slice(0, 80);
                    if (label)
                        anchors.push({ id: anchorId, label });
                    bodyParts.push(html.replace(/^<h([1-4])/, `<h$1 id="${anchorId}"`));
                }
                else {
                    bodyParts.push(html);
                }
            }
            const xhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>${escHtml(work.title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<h1 id="${fileId}">${escHtml(work.title)}</h1>
${bodyParts.join("\n")}
</body></html>`;
            chapters.push({ fileId, href, title: work.title, group, anchors, xhtml });
        }
    }
    let glossaryRows = "";
    rawGlossary.forEach((term, idx) => {
        const parts = [`<strong>${escHtml(term.h)}</strong>`];
        if (term.pos)
            parts.push(`<em>(${escHtml(term.pos)})</em>`);
        parts.push(escHtml(term.en));
        parts.push(escHtml(term.pt));
        if (term.es)
            parts.push(escHtml(term.es));
        glossaryRows += `<p class="glossary-entry" id="dict_${idx}">${parts.join(" — ")}</p>\n`;
    });
    const glossaryXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>Glossário Pāḷi</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<h1 id="glossary_title">Glossário Pāḷi</h1>
${glossaryRows}
</body></html>`;
    const manifestItems = chapters.map((c) => `  <item id="${c.fileId}" href="${c.href}" media-type="application/xhtml+xml"/>`).join("\n");
    const spineItems = chapters.map((c) => `  <itemref idref="${c.fileId}"/>`).join("\n");
    const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>Abhidhamma Piṭaka — Coleção Completa</dc:title>
  <dc:language>pi</dc:language>
  <dc:identifier id="uid">abhidhamma-full-${Date.now()}</dc:identifier>
</metadata>
<manifest>
  <item id="font-reg" href="fonts/GentiumBookPlus-Regular.ttf" media-type="application/font-sfnt"/>
  <item id="font-ita" href="fonts/GentiumBookPlus-Italic.ttf" media-type="application/font-sfnt"/>
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
    let playOrder = 0;
    const ncxPoints = [];
    const groupMap = new Map();
    for (const ch of chapters) {
        if (!groupMap.has(ch.group))
            groupMap.set(ch.group, []);
        groupMap.get(ch.group).push(ch);
    }
    const groupTitles = {
        abhidhamma: "Abhidhamma Piṭaka",
        outros: "Manuais e Comentários",
        visuddhimagga: "Visuddhimagga",
        comentarios: "Comentários Contemporâneos",
    };
    for (const [grp, chs] of groupMap) {
        playOrder++;
        const grpTitle = groupTitles[grp] || grp;
        const innerPoints = [];
        for (const ch of chs) {
            playOrder++;
            const chapterPoints = ch.anchors.map((a) => {
                playOrder++;
                return `      <navPoint id="${a.id}" playOrder="${playOrder}">
        <navLabel><text>${escHtml(a.label)}</text></navLabel>
        <content src="${ch.href}#${a.id}"/>
      </navPoint>`;
            }).join("\n");
            innerPoints.push(`    <navPoint id="${ch.fileId}" playOrder="${playOrder}">
      <navLabel><text>${escHtml(ch.title)}</text></navLabel>
      <content src="${ch.href}"/>
${chapterPoints}
    </navPoint>`);
        }
        ncxPoints.push(`  <navPoint id="grp_${grp}" playOrder="${playOrder}">
    <navLabel><text>${escHtml(grpTitle)}</text></navLabel>
    <content src="${chs[0].href}"/>
${innerPoints.join("\n")}
  </navPoint>`);
    }
    const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head><meta name="dtb:uid" content="abhidhamma-full"/></head>
<docTitle><text>Abhidhamma Piṭaka — Coleção Completa</text></docTitle>
<navMap>
${ncxPoints.join("\n")}
</navMap>
</ncx>`;
    const navLists = [];
    const shortNavLists = [];
    for (const [grp, chs] of groupMap) {
        const grpTitle = groupTitles[grp] || grp;
        const shortWorkLis = chs.map((ch) => `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`).join("\n");
        shortNavLists.push(`    <li><span>${escHtml(grpTitle)}</span>\n      <ol>\n${shortWorkLis}\n      </ol>\n    </li>`);
        const workLis = chs.map((ch) => {
            if (ch.anchors.length === 0) {
                return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`;
            }
            const anchorLis = ch.anchors.map((a) => `          <li><a href="${ch.href}#${a.id}">${escHtml(a.label)}</a></li>`).join("\n");
            return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a>
        <ol>
${anchorLis}
        </ol>
      </li>`;
        }).join("\n");
        navLists.push(`    <li><span>${escHtml(grpTitle)}</span>
      <ol>
${workLis}
      </ol>
    </li>`);
    }
    const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>Índice</title>
<link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<div class="toc-header">
  <h1>Índice Geral</h1>
  <ol class="toc-short">
${shortNavLists.join("\n")}
    <li><a href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</div>
<hr/>
<nav epub:type="toc" id="toc">
<h1>Índice Detalhado</h1>
<ol>
${navLists.join("\n")}
  <li><a href="glossary.xhtml">Glossário Pāḷi</a></li>
</ol>
</nav>
</body></html>`;
    const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
  <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>`;
    const zipEntries = [
        { name: "mimetype", data: enc.encode("application/epub+zip") },
        { name: "META-INF/container.xml", data: enc.encode(container) },
        { name: "OEBPS/content.opf", data: enc.encode(opf) },
        { name: "OEBPS/toc.ncx", data: enc.encode(ncx) },
        { name: "OEBPS/nav.xhtml", data: enc.encode(navXhtml) },
        { name: "OEBPS/glossary.xhtml", data: enc.encode(glossaryXhtml) },
        { name: "OEBPS/style.css", data: enc.encode(EPUB_CSS) },
    ];
    if (fontReg.length > 0)
        zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
    if (fontIta.length > 0)
        zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });
    for (const ch of chapters) {
        zipEntries.push({ name: `OEBPS/${ch.href}`, data: enc.encode(ch.xhtml) });
    }
    onProgress("Finalizando EPUB (isso pode levar alguns instantes)...");
    await new Promise(r => setTimeout(r, 50));
    return buildZip(zipEntries);
}
async function fetchWorkSegments(workId, files, fromSegId, toSegId) {
    const all = [];
    for (const file of files) {
        const res = await fetch(`data/works/${workId}/${file}`);
        if (!res.ok)
            throw new Error(`HTTP ${res.status} fetching ${file}`);
        const segs = (await res.json());
        all.push(...segs);
    }
    if (fromSegId == null && toSegId == null)
        return all;
    return all.filter((s) => (fromSegId == null || s.id >= fromSegId) &&
        (toSegId == null || s.id <= toSegId));
}
function makeSelect(id) {
    const s = document.createElement("select");
    s.id = id;
    s.style.cssText = "width:100%;margin:.4em 0 .8em;padding:6px 8px;border-radius:5px;border:1px solid var(--border);background:var(--bg-content);color:var(--text);";
    return s;
}
function makeLabel(text) {
    const l = document.createElement("label");
    l.style.cssText = "font-size:.85em;color:var(--text-muted);display:block;margin-top:.6em;";
    l.textContent = text;
    return l;
}
function makeButton(text, id) {
    const b = document.createElement("button");
    b.id = id;
    b.textContent = text;
    b.style.cssText =
        "width:100%;padding:8px;margin:.4em 0;background:var(--accent);color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:.95em;";
    return b;
}
export function initExportPanel(manifest, container, getCurrentWorkId) {
    const allWorks = [];
    for (const [group, works] of Object.entries(manifest.groups)) {
        for (const work of works)
            allWorks.push({ group, work });
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
    const langOptions = [
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
    function getSelectedWork() {
        const id = workSel.value;
        return allWorks.find((w) => w.work.id === id)?.work ?? null;
    }
    function getSelectedPartKeys() {
        return Array.from(partsDiv.querySelectorAll("input[type=checkbox]:checked")).map((cb) => cb.value);
    }
    function getChapterToc(work, partKey) {
        return (work.parts[partKey]?.toc ?? []).filter((e) => e.rend === "chapter");
    }
    function refreshChapterRange(work, partKeys) {
        if (partKeys.length !== 1) {
            chapDiv.style.display = "none";
            return;
        }
        const key = partKeys[0];
        const chapters = getChapterToc(work, key);
        if (chapters.length === 0) {
            chapDiv.style.display = "none";
            return;
        }
        chapDiv.style.display = "block";
        function fillSelect(sel) {
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
    function refreshParts(work) {
        partsDiv.innerHTML = "";
        for (const partKey of Object.keys(work.parts)) {
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
        pdfBtn.style.display = isAll ? "none" : "";
        if (!isAll) {
            const work = getSelectedWork();
            if (work)
                refreshParts(work);
        }
    });
    const currentId = getCurrentWorkId();
    if (currentId) {
        const opt = Array.from(workSel.options).find((o) => o.value === currentId);
        if (opt)
            workSel.value = currentId;
    }
    workSel.dispatchEvent(new Event("change"));
    async function runExport(format) {
        const langMode = langSel.value;
        if (workSel.value === "all_works") {
            statusDiv.textContent = t("exportBuilding", settings.uiLang);
            epubBtn.disabled = true;
            try {
                const bytes = await buildFullCorpusEpub(manifest, langMode, (msg) => {
                    statusDiv.textContent = msg;
                });
                downloadBlob(bytes, "Abhidhamma_Colecao_Completa.epub", "application/epub+zip");
                statusDiv.textContent = "";
            }
            catch (err) {
                log.error("full corpus export failed", err);
                statusDiv.textContent = "Export failed. See console.";
            }
            finally {
                epubBtn.disabled = false;
            }
            return;
        }
        const work = getSelectedWork();
        if (!work)
            return;
        const partKeys = getSelectedPartKeys();
        if (partKeys.length === 0) {
            statusDiv.textContent = "Select at least one part.";
            return;
        }
        let fromSegId = null;
        let toSegId = null;
        if (partKeys.length === 1 && chapDiv.style.display !== "none") {
            const fromVal = chapFromSel.value;
            const toVal = chapToSel.value;
            if (fromVal)
                fromSegId = Number(fromVal);
            if (toVal) {
                const partKey = partKeys[0];
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
            let allSegs = [];
            let partLabel = "";
            for (const partKey of partKeys) {
                const part = work.parts[partKey];
                if (!part)
                    continue;
                partLabel += (partLabel ? " + " : "") + (t(`part_${partKey}`, settings.uiLang) || partKey);
                const segs = await fetchWorkSegments(work.id, part.files, partKeys.length === 1 ? fromSegId : null, partKeys.length === 1 ? toSegId : null);
                allSegs = allSegs.concat(segs);
            }
            const title = partKeys.length === 1 && partLabel !== t(`part_${partKeys[0]}`, settings.uiLang)
                ? `${work.title} — ${partLabel}`
                : work.title;
            const glossary = await loadGlossary();
            const usedTerms = collectUsedTerms(allSegs, glossary);
            const glossaryHtml = buildGlossaryHtml(usedTerms, langMode);
            if (format === "pdf") {
                const html = buildPrintHtml(allSegs, title, langMode, glossaryHtml);
                openPrintWindow(html, title);
            }
            else {
                const bytes = buildEpub(allSegs, title, langMode, glossaryHtml);
                const slug = work.id.replace(/[^a-z0-9]/gi, "-");
                downloadBlob(bytes, `${slug}.epub`, "application/epub+zip");
            }
            statusDiv.textContent = "";
        }
        catch (err) {
            log.error("export failed", err);
            statusDiv.textContent = "Export failed. See console.";
        }
        finally {
            pdfBtn.disabled = false;
            epubBtn.disabled = false;
        }
    }
    pdfBtn.addEventListener("click", () => void runExport("pdf"));
    epubBtn.addEventListener("click", () => void runExport("epub"));
}
//# sourceMappingURL=export.js.map