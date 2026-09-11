# Interface do Usuário

## 1. Layout Geral

```
┌─────────┬──────────────────────┬───┬────────────────────────────────────┐
│ #icon-  │   #side-panel        │ R │  main#reader                       │
│  rail   │  (painel ativo)      │ E │                                    │
│ 56–76px │  240–320px           │ D │  #reader-header                    │
│         │                      │ I │    #breadcrumb                     │
│ [☰]     │  panel-tipitaka:     │ M │    #part-tabs   #chapter-nav       │
│ [📖]   │    Árvore de obras   │ E │                                    │
│ [⏱]   │  panel-dictionary:   │ N │  #content                          │
│ [🔍]   │    Busca no dict.    │ S │    .seg × N                        │
│ [⚙]   │  panel-history:      │ I │      .pali-line                    │
│ [⬇]   │    Histórico+Favor.  │ O │      .translation-line             │
│ [🧠]   │  panel-search:       │ N │                                    │
│ [🔬]   │    Busca completa    │ A │  #toc-nav  [‹] [1/N] [›]          │
│         │  panel-settings:     │ D │                                    │
│         │    Idioma/Fonte/etc   │ O │  #reader-srs  (overlay SRS)       │
│         │  panel-export:       │ R │  #reader-tools (overlay Ferramentas)|
│         │    Export PDF/EPUB   │   │                                    │
│         │  panel-srs:          │   │  [💬 Debate]  (botão flutuante)  │
│         │    Atalho SRS        │   │                                    │
│         │  panel-tools:        │   │                                    │
│         │    Atalho Ferramentas│   │                                    │
└─────────┴──────────────────────┴───┴────────────────────────────────────┘
```

---

## 2. Rail de Ícones (#icon-rail)

Oito botões de navegação, cada um com `data-panel="{id}"`:

| Ícone | Painel | Função |
|---|---|---|
| ☰ | tipitaka | Navegar obras |
| 📖 (SVG) | dictionary | Dicionário Pāli |
| ⏱ | history | Histórico + favoritos |
| 🔍 | search | Busca de texto completo |
| ⚙ | settings | Configurações |
| ⬇ | export | Exportar (PDF/EPUB) |
| 🧠 | srs | Memorização Pāli |
| 🔬 | tools | Ferramentas Abhidhamma |

**Comportamento ao clicar:**
- Se o painel do botão já está ativo E o painel lateral está expandido → colapsa o painel.
- Caso contrário → muda para o painel + expande (exceto SRS/Tools no mobile, que vão em tela cheia).

---

## 3. Painel Lateral (#side-panel)

Apenas um filho `.panel` está ativo por vez (`class="panel active"`). Os painéis `srs` e `tools` mostram apenas um placeholder "Visualizando no painel principal →" — o conteúdo real fica nos overlays do reader.

### Colapsar / Expandir

- `collapseBtn` (‹/›) alterna o colapso.
- Ao colapsar: salva largura atual em `localStorage("panelW")`, define `--panel-w: 0px` após transição CSS de 160 ms.
- Ao expandir: restaura largura salva (mín. 120 px, máx. 450 px).

### Redimensionar

`#panel-resizer` é uma coluna de 8 px arrastável. `mousedown` inicia redimensionamento; `mousemove` define `--panel-w`; `mouseup` salva nova largura. Colapsa para 0 se arrastado abaixo de 60 px.

---

## 4. Leitor (main#reader)

### Cabeçalho

```
[‹]  Breadcrumb: "Abhidhamma Piṭaka › Dhammasaṅgaṇī"
     [Mūla] [Aṭṭhakathā] ...   [navegação de capítulos ▾]
```

- **Breadcrumb**: título do grupo + título da obra.
- **Abas de partes**: um botão por chave de parte; clicar carrega o fragmento 0 daquela parte.
- **Navegação de capítulos**: dropdown listando entradas TOC `rend=chapter`; clicar rola até e pisca aquele segmento.

### Área de Conteúdo (#content)

Cada segmento é renderizado como:

```html
<div class="seg" data-rend="{rend}" data-seg-id="{id}" data-pali="{texto}">
  <div class="pali-line">
    [badge paranum]  texto pali (innerHTML)  [☆ botão favorito]
  </div>
  <div class="translation-line">
    texto de tradução (innerHTML)
  </div>
</div>
```

Classes CSS adicionadas baseadas nas configurações:
- `.no-pali` → oculta `.pali-line`
- `.no-translation` → oculta `.translation-line`

### Navegação de Fragmentos (#toc-nav)

Botões Anterior/Próximo e um indicador `{atual} / {total}` na parte inferior do leitor.

---

## 5. Popover de Seleção (#selection-popover)

Aparece quando o usuário seleciona texto (ou toca uma palavra no mobile) dentro de `.pali-line` ou `.translation-line`.

Conteúdo:
- **Cabeçalho**: rótulo ("↔ Tradução" ou "↔ Pāli") + botão copiar link + botão fechar.
- **Texto contraparte**: se o usuário selecionou Pāli → mostra tradução; se selecionou tradução → mostra Pāli.
- **Seção de dicionário** (apenas seleções Pāli): até 3 palavras buscadas; primeiro resultado mostrado inline.

---

## 6. Tooltip de Notas (#note-tooltip)

Notas de variantes de leitura (elementos superscript `.var-note` dentro do texto Pāli) mostram um tooltip flutuante no `mouseenter` com o texto da nota. Segue a posição do cursor.

---

## 7. Painel de Configurações

| Controle | Efeito |
|---|---|
| Seletor de idioma | Muda `translationLang` + `uiLang`; re-renderiza conteúdo e strings de UI |
| Botões A− / A+ | Muda `fontSize` (12–28 px); atualiza variável CSS `--font-scale` |
| Checkbox Mostrar Pāli | Alterna classe `.no-pali` em todos os elementos `.seg` |
| Checkbox Mostrar tradução | Alterna `.no-translation` |
| Botão Instalar App | Mostrado quando `beforeinstallprompt` dispara (instalação PWA) |

---

## 8. Overlays em Tela Cheia (SRS e Ferramentas)

Quando o botão SRS ou Ferramentas do rail está ativo, o leitor principal se oculta (`display:none`) e o overlay correspondente (`#reader-srs` ou `#reader-tools`) é exibido como `display:flex`.

---

## 9. Simulador de Debate (flutuante)

Um botão fixo `💬 Debate` no canto inferior direito importa lazily `ai-feature/ui.js` no primeiro clique e mostra o painel `#interlocutor-container` (flutuante, rolável, `z-index: 10001`).

---

## 10. Comportamento Mobile (≤ 860px)

- Rótulos do rail são ocultados (apenas ícones).
- Painel lateral colapsa automaticamente quando um texto é selecionado.
- SRS e Tools colapsam o painel e vão em tela cheia.
- Toque para definir: tocar uma palavra no leitor aciona o popover de seleção usando `document.caretRangeFromPoint`.
- `user-scalable=0` no viewport meta previne zoom acidental.
