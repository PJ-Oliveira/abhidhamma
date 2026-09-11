# Funcionalidades

## 1. Leitor de Textos

O leitor (`reader.ts`) carrega e exibe segmentos Pāli + tradução alinhados.

**Fluxo de carregamento:**
1. `selectWork(workId, partKey, chunkIndex)` é chamado.
2. `loadChunk()` busca o JSON do fragmento; resultado armazenado em cache na memória.
3. `renderSegments()` limpa o DOM e o reconstrói.
4. Se um `segId` foi solicitado (de favorito ou resultado de busca), o segmento-alvo rola para a visualização e pisca.

---

## 2. Árvore de Navegação

`tree.ts` renderiza uma árvore UL expansível a partir do manifest. Grupos aparecem como cabeçalhos em maiúsculas; obras expandem para mostrar partes; clicar em uma folha de parte chama `selectWork(workId, partKey, 0)`.

`markActiveLeaf()` adiciona `.leaf-active` à parte exibida atualmente e abre seus nós-pai.

---

## 3. Dicionário Pāli

`dictionary.ts` fornece `lookupPali(word)` e a UI do painel de dicionário.

**Comportamento do painel:**
- Inicia o carregamento no primeiro evento de `input` (promise compartilhada única).
- Conforme o usuário digita, todas as palavras-cabeçalho iniciando com a consulta são mostradas.
- Resultados ordenados por frequência (mais comum primeiro).
- Exibe: palavra-cabeçalho, frequência, classe gramatical, todos os sentidos com gramática/raiz/sinônimos/antônimos.

**Busca no popover:** quando texto é selecionado no leitor, `lookupPali` é chamado para até 3 palavras; primeiro resultado mostrado inline no popover de seleção.

---

## 4. Busca de Texto Completo

`search.ts` implementa um índice invertido fragmentado do lado do cliente.

- Input com debounce (250 ms).
- Carrega o manifest de fragmentos na inicialização do painel, depois carrega fragmentos lazily por consulta.
- Retorna até 50 resultados como cartões de snippet; clicar em um resultado abre aquele fragmento e rola até o segmento.

---

## 5. Histórico e Favoritos

**Histórico** (`pushHistory`):
- Cada chamada `selectWork()` adiciona uma entrada.
- Deduplicação: entrada existente para mesmo `workId/partKey/chunk` é removida antes de prepend.
- Limite: 50 entradas.

**Favoritos** (`toggleBookmark`):
- Botão ☆/★ em cada linha Pāli do segmento.
- Armazena `{ workId, partKey, segId, chunk, snippet }`.
- Clicar em um favorito abre o fragmento e rola até o segmento.

---

## 6. Exportação

`export.ts` fornece exportação PDF e EPUB para qualquer obra ou o corpus completo.

### PDF de Obra Única

`buildPrintHtml()` cria HTML de página completa com CSS de impressão e chamada `window.print()`. Aberto em nova janela. Se pop-ups estiverem bloqueados, o arquivo HTML é baixado.

### EPUB de Obra Única

`buildEpub()` cria um EPUB 3 mínimo (ZIP) com:
- `mimetype` (sem compressão)
- `META-INF/container.xml`
- `OEBPS/content.opf` (pacote OPF)
- `OEBPS/toc.ncx` (navegação NCX)
- `OEBPS/style.css` (face de fonte Gentium + layout)
- `OEBPS/content.html` (todos os segmentos convertidos para HTML)

### EPUB do Corpus Completo

`buildFullCorpusEpub()` busca todos os fragmentos de todas as obras, constrói arquivos XHTML por obra, NCX hierárquico e `nav.xhtml` EPUB3, e apêndice de glossário. Fontes são buscadas e incluídas. Mensagens de progresso são mostradas durante o build.

### Modos de Idioma (`LangMode`)

| Valor | Colunas incluídas |
|---|---|
| `en` | Apenas inglês |
| `pali+en` | Pāli + inglês |
| `pali+en+pt` | Pāli + inglês + português |
| `pt` | Apenas português |
| `pali+pt` | Pāli + português |
| `es` | Apenas espanhol |
| `pali+es` | Pāli + espanhol |
| `pali+en+es` | Pāli + inglês + espanhol |

---

## 7. Sistema de Repetição Espaçada (SRS)

`srs.ts` implementa um sistema de flashcards usando o **algoritmo SM-2**.

**Fila de cartões:** cartões devidos (nextReview ≤ agora) primeiro, depois novos cartões ordenados por rank. Limite diário: 20 cartões.

**Atalhos de teclado** (quando painel SRS está ativo):
- Espaço / Enter → virar cartão
- 1 → Novamente (qualidade 0)
- 2 → Difícil (qualidade 3)
- 3 → Bom (qualidade 4)
- 4 → Fácil (qualidade 5)

**Persistência:** estados dos cartões salvos em `atp.srs.v1`; estatísticas em `atp.srs.stats.v1` no localStorage.

---

## 8. Ferramentas Abhidhamma

O painel de ferramentas (`tools/tools.ts`) é um gerenciador de abas que inicializa lazily cada sub-módulo na primeira ativação.

### Mapa Mental (`tools/mindmap.ts`)

Mapa mental hierárquico em SVG dos conceitos Abhidhamma. Pesquisável por texto do nó.

### Paṭṭhāna (`tools/patthana.ts`)

Visualização interativa das 24 relações condicionais (paccaya) do Paṭṭhāna.

### Citta-Vīthi (`tools/vithi.ts`)

Visualização animada do processo de consciência (citta-vīthi). Mostra a sequência de momentos de consciência (bhavaṅga → manodvāravajjana → javana × 7 → tadārammaṇa) para diferentes portas dos sentidos. Busca `data/tools/vithi.json` e `data/tools/citta_cetasika.json`.

### Mātikās (`tools/matikas.ts`)

Listas pesquisáveis das tríades (tikas) e díades (dukas) da matriz do Dhammasaṅgaṇī.

### Cetasika (`tools/cetasika.ts`)

Dois modos:
- **Análise individual:** selecionar um citta → ver todos os cetasikas associados.
- **Comparação:** selecionar dois cittas → ver cetasikas comuns, exclusivos de A e exclusivos de B.

---

## 9. Simulador de Debate (Recurso de IA)

`ai-feature/ui.ts` + `ai-feature/debate-scenarios.ts` + `ontology/kathavatthu_logic.ts`

Um simulador de debate baseado em regras (sem LLM) modelado no formato de debate da Kathāvatthu.

**Fluxo:**
1. Usuário seleciona um cenário de `CanonicalScenarios` (proposições codificadas de escolas históricas).
2. O texto da afirmação é mostrado.
3. Usuário clica em "Enviar Argumento".
4. `evaluateScenario(scenarioId, uiLang)` retorna uma refutação estruturada com: veredito, contexto lógico, regra meta-lógica, paradoxo reductio ad absurdum, silogismo formal, analogia pedagógica.
5. Botão "Aprofundar" revela a análise pedagógica.

A dependência `@mlc-ai/web-llm` está presente mas ainda não conectada ao simulador de debate.
