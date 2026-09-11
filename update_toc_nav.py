import re

with open("src/export.ts", "r") as f:
    content = f.read()

# 1. Update the xhtml inside buildFullCorpusEpub to include a "Back to TOC" link at the end of each chapter
# The chapter is built around line 578:
#           xhtml: `<?xml version="1.0" encoding="UTF-8"?>
# <!DOCTYPE html>
# <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
# <head><meta charset="utf-8"/><title>${escHtml(work.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
# <body>
# <h1>${escHtml(work.title)}</h1>
# <h2>${escHtml(partTitle)}</h2>
# ${chapterParts.join("\n")}
# </body></html>`,

xhtml_replacement = """xhtml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>${escHtml(work.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<a id="top"></a>
<h1>${escHtml(work.title)}</h1>
<h2>${escHtml(partTitle)}</h2>
${chapterParts.join("\\n")}
<a class="back-to-toc" href="nav.xhtml#toc">↑ Voltar ao Índice Geral (Back to TOC)</a>
</body></html>`"""

content = re.sub(
    r'xhtml: `<\?xml version="1\.0" encoding="UTF-8"\?>\n<!DOCTYPE html>\n<html xmlns="http://www\.w3\.org/1999/xhtml".*?</body></html>`,',
    xhtml_replacement,
    content,
    flags=re.DOTALL
)


# 2. Update nav.xhtml generation inside buildFullCorpusEpub (around line 700)
# We need to create shortNavLists, midNavLists, and navLists.

nav_builder_old = """  // ── Build EPUB3 nav.xhtml ──
  const navLists: string[] = [];
  const shortNavLists: string[] = [];
  
  for (const [grp, chs] of groupMap) {
    const grpTitle = groupTitles[grp] || grp;
    
    // Short list (Generic)
    const shortWorkLis = chs.map((ch) => `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`).join("\\n");
    shortNavLists.push(`    <li><span>${escHtml(grpTitle)}</span>\\n      <ol>\\n${shortWorkLis}\\n      </ol>\\n    </li>`);
    
    // Detailed list
    const workLis = chs.map((ch) => {
      if (ch.anchors.length === 0) {
        return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`;
      }
      const anchorLis = ch.anchors.map(
        (a) => `          <li><a href="${ch.href}#${a.id}">${escHtml(a.label)}</a></li>`
      ).join("\\n");
      return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a>\\n        <ol>\\n${anchorLis}\\n        </ol>\\n      </li>`;
    }).join("\\n");
    
    navLists.push(`  <li><span>${escHtml(grpTitle)}</span>\\n    <ol>\\n${workLis}\\n    </ol>\\n  </li>`);
  }

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>Índice</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<div class="toc-header">
  <h1>Índice Geral</h1>
  <ol class="toc-short">
${shortNavLists.join("\\n")}
    <li><a href="glossary.xhtml">Glossário Pāḷi</a></li>
  </ol>
</div>
<hr/>
<nav epub:type="toc" id="toc">
<h1>Índice Detalhado</h1>
<ol>
${navLists.join("\\n")}
  <li><a href="glossary.xhtml">Glossário Pāḷi</a></li>
</ol>
</nav>
</body></html>`;"""

nav_builder_new = """  // ── Build EPUB3 nav.xhtml (3 Levels) ──
  const navLists: string[] = []; // Granular
  const midNavLists: string[] = []; // Intermediate
  const shortNavLists: string[] = []; // High level
  
  for (const [grp, chs] of groupMap) {
    const grpTitle = groupTitles[grp] || grp;
    
    // Deduplicate books for High Level
    const uniqueBooks = Array.from(new Set(chs.map(ch => ch.title.split(" (")[0])));
    const shortWorkLis = uniqueBooks.map(bookTitle => {
        const firstCh = chs.find(c => c.title.startsWith(bookTitle));
        return `      <li><a href="${firstCh?.href ?? ""}">${escHtml(bookTitle)}</a></li>`;
    }).join("\\n");
    shortNavLists.push(`    <li><strong>${escHtml(grpTitle)}</strong>\\n      <ol class="toc-short">\\n${shortWorkLis}\\n      </ol>\\n    </li>`);
    
    // Intermediate list (Books and Parts, but not sub-anchors)
    const midWorkLis = chs.map((ch) => `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`).join("\\n");
    midNavLists.push(`    <li><strong>${escHtml(grpTitle)}</strong>\\n      <ol class="toc-mid">\\n${midWorkLis}\\n      </ol>\\n    </li>`);
    
    // Detailed list (Granular)
    const workLis = chs.map((ch) => {
      if (ch.anchors.length === 0) {
        return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a></li>`;
      }
      const anchorLis = ch.anchors.map(
        (a) => `          <li><a href="${ch.href}#${a.id}">${escHtml(a.label)}</a></li>`
      ).join("\\n");
      return `      <li><a href="${ch.href}">${escHtml(ch.title)}</a>\\n        <ol>\\n${anchorLis}\\n        </ol>\\n      </li>`;
    }).join("\\n");
    
    navLists.push(`  <li><span>${escHtml(grpTitle)}</span>\\n    <ol>\\n${workLis}\\n    </ol>\\n  </li>`);
  }

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><meta charset="utf-8"/><title>Índice</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
<div class="toc-header">
  <h1 id="toc-high">1. Índice de Alto Nível (Livros)</h1>
  <ol class="toc-short">
${shortNavLists.join("\\n")}
  </ol>
  
  <h2 id="toc-mid">2. Índice Intermediário (Comentários e Subcomentários)</h2>
  <ol class="toc-mid">
${midNavLists.join("\\n")}
  </ol>
</div>
<hr/>
<nav epub:type="toc" id="toc">
<h1 id="toc-granular">3. Índice Granular (Árvore Completa)</h1>
<ol>
${navLists.join("\\n")}
  <li><a href="glossary.xhtml">Glossário Pāḷi</a></li>
</ol>
</nav>
</body></html>`;"""

content = content.replace(nav_builder_old, nav_builder_new)

with open("src/export.ts", "w") as f:
    f.write(content)
