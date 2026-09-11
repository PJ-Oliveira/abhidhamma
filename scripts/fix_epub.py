import re

with open('src/export.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update EPUB_CSS
new_css = """const EPUB_CSS = `
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
  font-size: 14pt;
  line-height: 1.6;
  margin: 0.5cm;
  color: #111;
  text-align: justify;
}
h1 { text-align: center; font-size: 1.8em; border-bottom: 2px solid #333; padding-bottom: 0.4em; margin-bottom: 1em; }
h2 { font-size: 1.4em; margin-top: 2em; padding-top: 0.5em; border-top: 1px solid #ccc; }
h3 { font-size: 1.1em; margin-top: 1.2em; }
h4 { font-size: 1em; font-style: italic; margin-top: 1em; }
p { margin: 0.7em 0; }
p.centre { text-align: center; }
p.glossary .line.pali { font-weight: 700; }
blockquote { margin: 1em 2em; font-style: italic; }
.pali { font-style: italic; color: #333; margin-bottom: 0.2em; }
.en, .pt, .es { margin-top: 0.1em; margin-bottom: 0.4em; }
.footnote { font-size: 0.85em; color: #555; }
aside.epub-footnote { display: none; } /* Hidden normally, EPUB3 reader shows as popup */
span.rend-gathalast { margin-left: 2em; }
span.rend-gatha1, span.rend-gatha2, span.rend-gatha3 { margin-left: 1em; }
.glossary-appendix { margin-top: 2em; page-break-before: always; }
.glossary-entry { margin: 0.3em 0; font-size: 0.95em; line-height: 1.5; }
.glossary-entry strong { color: #333; }
.glossary-entry em { color: #555; font-size: 0.9em; }
`;"""

code = re.sub(r'const EPUB_CSS = `.*?`;', new_css, code, flags=re.DOTALL)

# 2. Update segToHtml to handle seg.notes for EPUB3 Footnotes
seg_notes_code = """
  if (seg.notes && seg.notes.length > 0) {
    seg.notes.forEach((note, idx) => {
      const noteId = `note_${seg.id}_${idx}`;
      inner += ` <a epub:type="noteref" href="#${noteId}"><sup>[${idx + 1}]</sup></a>`;
      inner += `<aside epub:type="footnote" id="${noteId}" class="epub-footnote"><p>${escHtml(note)}</p></aside>`;
    });
  }

  if (!inner) return "";
"""
code = code.replace('  if (!inner) return "";', seg_notes_code)

# 3. Fetch fonts in buildFullCorpusEpub
fetch_fonts = """
  onProgress("Baixando fontes tipográficas...");
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
"""
code = code.replace('  const enc = new TextEncoder();\n  const chapters: CorpusChapter[] = [];\n  let fileIdx = 0;',
                    '  const enc = new TextEncoder();\n  const chapters: CorpusChapter[] = [];\n  let fileIdx = 0;\n' + fetch_fonts)

# 4. Add fonts to OPF Manifest
opf_fonts = """  <item id="font-reg" href="fonts/GentiumBookPlus-Regular.ttf" media-type="application/font-sfnt"/>
  <item id="font-ita" href="fonts/GentiumBookPlus-Italic.ttf" media-type="application/font-sfnt"/>"""
code = code.replace('<manifest>', '<manifest>\n' + opf_fonts)

# 5. Add fonts to ZIP
zip_fonts = """  if (fontReg.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
  if (fontIta.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });"""
code = code.replace('  for (const ch of chapters) {', zip_fonts + '\n  for (const ch of chapters) {')

with open('src/export.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("export.ts updated successfully!")
