# 06 — Módulo de Exportação

## 1. Visão Geral

`src/export.ts` (compilado para `js/export.js`) implementa o painel de Exportação. Ele fornece dois formatos de saída:

- **PDF**: Gera uma página HTML pronta para impressão como uma URL blob, abre-a em uma nova aba e aciona automaticamente a caixa de diálogo de impressão do navegador. Fallback: faz o download do arquivo HTML se o pop-up for bloqueado.
- **EPUB**: Gera um arquivo ZIP EPUB 3 válido (com NCX para compatibilidade legada) e faz o download diretamente.

---

## 2. Interface do Painel de Exportação

Inicializado por `initExportPanel(manifest, container, getCurrentWorkId)` chamado a partir de `app.ts`.

O painel é renderizado dinamicamente em `#export-panel-body`:

1. **Seletor de obra** — todas as obras do manifesto, agrupadas
2. **Caixas de seleção de partes** — uma por parte na obra selecionada; todas marcadas por padrão
3. **Intervalo de capítulos** — exibido apenas quando exatamente uma parte está selecionada E essa parte possui entradas de índice (TOC). Menus suspensos preenchidos a partir de entradas do `toc` com `rend === "chapter"`.
4. **Seletor de modo de idioma** — 6 opções:
   - `en` — Apenas inglês
   - `pali+en` — Pāli + Inglês
   - `pali+en+pt` — Pāli + Inglês + Português
   - `es` — Apenas espanhol
   - `pali+es` — Pāli + Espanhol
   - `pali+en+es` — Pāli + Inglês + Espanhol
5. Botão **Exportar PDF**
6. Botão **Exportar EPUB**
7. **Texto de status** — exibe "Preparando…" durante a compilação, limpo em caso de sucesso, exibe erro em caso de falha

Quando o usuário abre o painel de exportação enquanto visualiza um texto, o seletor de obra pré-seleciona a obra atual.

---

## 3. Tratamento do Modo de Idioma

`type LangMode = "en" | "pali+en" | "pali+en+pt" | "es" | "pali+es" | "pali+en+es"`

Em `segToHtml(seg, langMode)`:

```typescript
const showPali = langMode.startsWith("pali");
const showEn   = langMode.includes("en");
const showPt   = langMode === "pali+en+pt";
const showEs   = langMode.includes("es");
```

**Caso especial:** Quando `!showPali && showEn` e o campo `pali` contém texto (obras bilíngues EN/PT no grupo `comentarios`), o texto em inglês é renderizado a partir de `seg.pali` com a classe `"en"`. Isso lida corretamente com os comentários contemporâneos onde o inglês é armazenado no campo `pali`.

---

## 4. Pipeline HTML — `fieldHtml()` e `walkNode()`

### Problema
O campo `pali` contém tags HTML inline reais (`<b>`, `<p rend="gathalast">`, `<sup>`). Chamar `escHtml()` nesses campos produziria `&lt;b&gt;` literal na saída exportada — tags visíveis como texto.

### Solução

```typescript
function fieldHtml(raw: string): string {
    if (!raw) return "";
    if (!raw.includes("<")) return escHtml(raw);   // fast path: no tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${raw}</body>`, "text/html");
    return walkNode(doc.body);
}
```

`walkNode()` serializa recursivamente o DOM analisado:

```typescript
function walkNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return escHtml(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const inner = Array.from(el.childNodes).map(walkNode).join("");
    if (tag === "b" || tag === "strong") return `<strong>${inner}</strong>`;
    if (tag === "i" || tag === "em")     return `<em>${inner}</em>`;
    if (tag === "sup")                   return `<sup>${inner}</sup>`;
    if (tag === "br")                    return "<br>";
    if (tag === "p") {
        const rend = el.getAttribute("rend");
        const cls  = rend ? ` class="rend-${escHtml(rend)}"` : "";
        return inner ? `<br><span${cls}>${inner}</span>` : "";
    }
    return inner;  // unknown tags: strip tag, preserve inner text
}
```

**Tabela de conversão:**

| Entrada | Saída |
|---|---|
| `<b>text</b>` | `<strong>text</strong>` |
| `<i>text</i>` | `<em>text</em>` |
| `<sup>1</sup>` | `<sup>1</sup>` |
| `<p rend="gathalast">text</p>` | `<br><span class="rend-gathalast">text</span>` |
| `<p rend="gatha1">text</p>` | `<br><span class="rend-gatha1">text</span>` |
| `<x_bin_42>text</x_bin_42>` | `text` (removido) |
| `plain text` | `plain text` (escapado) |

### Resultado da verificação

Varredura completa de todo o corpus de 91.065 segmentos (27.462 com HTML) no navegador:

```
{ segsTotal: 91065, htmlSegsProcessed: 27462, badTagsFound: 0 }
```

Zero tags inesperadas na saída de exportação em todas as 12 obras.

---

## 5. `segToHtml()` — Segmento para Bloco de Exportação

```typescript
function segToHtml(seg: Segment, langMode: LangMode): string
```

Mapeia o campo `rend` para um elemento HTML de exportação:

| rend | Elemento de exportação |
|---|---|
| `chapter` | `<h2 class="seg chapter">` |
| `subhead` | `<h3 class="seg subhead">` |
| `hangnum` | `<p class="seg hangnum">` |
| `indent` | `<blockquote class="seg indent">` |
| `footnote` | `<p class="seg footnote">` |
| qualquer outro | `<p class="seg bodytext">` |

Cada linha de idioma é envolvida em `<div class="line {lang}">`. Segmentos vazios (nenhuma linha seria exibida) retornam `""` e são filtrados.

---

## 6. Exportação para PDF

### `buildPrintHtml(segs, title, langMode)`

Gera uma string de documento HTML completa:
- `<!DOCTYPE html>` com `<meta charset="utf-8">`
- `PRINT_CSS` embutido (otimizado para impressão: Georgia serif, 11pt, margens de 2cm, CSS `@page` para cabeçalhos contínuos)
- Título como `<h1>` no topo
- Todos os blocos HTML de segmentos unidos por `\n`
- Script de auto-impressão: `window.addEventListener("load", () => setTimeout(() => window.print(), 600))`

### `PRINT_CSS` inclui formatação de versos:
```css
span.rend-gathalast { margin-left: 2em; }
span.rend-gatha1, span.rend-gatha2, span.rend-gatha3 { margin-left: 1em; }
```

### `openPrintWindow(html, title)`

```typescript
function openPrintWindow(html: string, title: string): void {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
        // Popup blocked — download file instead
        const a = document.createElement("a");
        a.href = url;
        const slug = title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_").toLowerCase();
        a.download = (slug || "export") + ".html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        alert("Pop-up blocked. The HTML file has been downloaded...");
        return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
}
```

**Por que URL blob (e não `window.open("", "_blank")`):** Abrir uma janela em branco e escrever nela cria uma página `about:blank`. URLs `about:` são bloqueadas no iframes em modo sandbox e em alguns contextos estritos de navegadores. Usar `URL.createObjectURL()` cria uma URL `blob:` que é sempre válida na mesma origem.

**O iframes em modo sandbox sempre bloqueia pop-ups.** O fallback (download do arquivo HTML) é acionado automaticamente nesse ambiente.

---

## 7. Exportação para EPUB

### Estrutura

```
mimetype                          (uncompressed, must be first entry)
META-INF/container.xml
OEBPS/content.opf                 (OPF manifest + spine)
OEBPS/toc.ncx                     (NCX navigation — EPUB 2 compatibility)
OEBPS/style.css                   (EPUB_CSS)
OEBPS/content.html                (all segments as XHTML)
```

### `buildZip(entries)` — Implementação de ZIP em JavaScript puro

Gera um arquivo ZIP válido sem qualquer biblioteca. Implementado a partir da especificação do ZIP:
- Cabeçalho local de arquivo (30 bytes + nome do arquivo)
- Dados do arquivo (não compactados, método 0)
- Entradas do diretório central
- Registro de fim do diretório central (end-of-central-directory)

Usa CRC-32 com polinômio padrão `0xedb88320`.

### `buildEpub(segs, title, langMode)`

- O documento de conteúdo é XHTML (declaração XML, `xmlns` no `<html>`)
- O OPF inclui `<dc:language>pi</dc:language>` (código ISO 639-3 para Pāli)
- O `dc:identifier` é `abhidhamma-export-{Date.now()}` — único por exportação

### `EPUB_CSS` inclui formatação de versos (mesma que `PRINT_CSS`).

### `downloadBlob(bytes, filename, mimeType)`

Cria um elemento de link temporário, define o `href` para uma URL blob, aciona o clique e realiza a limpeza após 5 segundos.

---

## 8. Filtragem por Intervalo de Capítulos

Quando exatamente uma parte está selecionada e essa parte possui capítulos no TOC:
- Menus suspensos de intervalo de capítulos são exibidos
- `fromSegId` = `chapFromSel.value` (ID do segmento do capítulo "de" selecionado)
- `toSegId` = calculado como `nextChapter.id - 1` onde `nextChapter` é o capítulo imediatamente seguinte à seleção "até" no TOC; `null` se "até" for o último capítulo (busca todos os segmentos restantes)

`fetchWorkSegments(workId, files, fromSegId, toSegId)` busca todos os arquivos de partes em sequência e filtra: `s.id >= fromSegId && s.id <= toSegId`.

---

## 9. Histórico de Problemas

| Data | Problema | Correção |
|---|---|---|
| 2026-08 | `window.open("", "_blank")` criava aba `about:blank`, bloqueada no painel do navegador | Alterado para `URL.createObjectURL(blob)` → `window.open(blobUrl)` |
| 2026-08 | Chrome não carregava o `export.js` atualizado (cache de módulos ES) | Criado `version_js.py` para inserir `?v={hash}` em todas as importações pós-build |
| 2026-08 | Tags HTML brutas (`<b>`, `<p rend="gathalast">`) aparecendo como texto literal no PDF/EPUB | Adicionado `walkNode()` + `fieldHtml()` usando `DOMParser` |
