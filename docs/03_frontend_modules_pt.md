# 03 — Módulos TypeScript do Frontend

Todos os arquivos-fonte residem em `src/`. Todos os arquivos compilados residem em `js/` com carimbos `?v={hash}` nas importações. Source maps são gerados junto a cada arquivo `.js`.

---

## `types.ts` — Definições de Tipos

**Objetivo:** Registro central de tipos. Compilado para um shim vazio (`types.js` tem 44 bytes); todas as informações de tipo são apagadas em tempo de execução.

**Principais interfaces:**

| Interface | Descrição |
|---|---|
| `Segment` | Parágrafo individual do corpus (ver doc de corpus §1) |
| `WorkEntry` / `WorkPart` / `Manifest` | Tipos da árvore de navegação |
| `Settings` | Preferências do usuário persistidas no localStorage |
| `HistoryEntry` / `BookmarkEntry` | Itens da lista da barra lateral |
| `DictEntry` / `CommonDictData` | Tipos de `common_pali.json` |
| `CoreDictEntry` / `CoreDictData` / `DictSense` / `DictRootInfo` | Tipos de `pali_core.json` |
| `SearchHit` / `SearchShard` / `SearchManifest` | Tipos do índice de busca |
| `TranslationLang` | `"en" | "pt" | "es"` |
| `UiLang` | `"pt" | "en" | "es"` |

---

## `logger.ts` — Logger de Console com Níveis

**Objetivo:** Registro no console com prefixo e controle de nível de log.

**API:**
```typescript
createLogger(name: string): { info, warn, error, debug }
```

Cada método adiciona o prefixo `[name]` à saída. Na implementação atual, todos os níveis são repassados para `console.*`. Usado por todos os outros módulos.

---

## `i18n.ts` — Localização de Strings da UI

**Objetivo:** Traduz chaves de strings da interface de usuário para PT / EN / ES.

**API:**
```typescript
t(key: string, uiLang: UiLang): string
```

Cadeia de fallback: `STRINGS[uiLang][key]` → `STRINGS.pt[key]` → chave.

**Cobertura:** 57 chaves de string × 3 idiomas = 171 strings. Cobre rótulos de navegação, rótulos de configurações, controles de exportação, nomes de campos do dicionário, mensagens de erro, tela de boas-vindas. Todas as strings são estáticas (sem interpolação).

**Nota:** O rótulo de exportação em `en` para espanhol é `"Spanish only"` (não `"Solo inglés"`) — esta é uma inconsistência de UI conhecida. Consulte [07_open_issues.md](07_open_issues.md) problema #OI-004.

---

## `state.ts` — Configurações e Listas Persistentes

**Objetivo:** Todas as operações de leitura/escrita no localStorage. Nenhuma interação com o DOM.

**Exportações:**
```typescript
settings: Settings                          // live mutable object
updateSettings(patch: Partial<Settings>): void
getHistory(): HistoryEntry[]
pushHistory(entry: Omit<HistoryEntry, "ts">): void
getBookmarks(): BookmarkEntry[]
toggleBookmark(entry: Omit<BookmarkEntry, "ts">): boolean  // returns new active state
isBookmarked(workId, partKey, segId): boolean
```

**Decisões de design:**
- `settings` é um objeto mutável em nível de módulo carregado uma única vez na importação. Todos os módulos o importam diretamente. Mutações via `updateSettings()` chamam `Object.assign(settings, patch)`, de modo que todos os módulos visualizam a alteração sem necessidade de reimportação.
- O histórico elimina duplicatas por `(workId, partKey, chunk)` antes de fazer unshift; limitado a 50 itens.
- Os favoritos eliminam duplicatas por `(workId, partKey, segId)`. Alternância (toggle): se já estiver nos favoritos → remove e retorna `false`; caso contrário → adiciona e retorna `true`.

---

## `tree.ts` — Árvore de Navegação

**Objetivo:** Renderiza a árvore de navegação do Tipiṭaka a partir do manifesto; marca a folha ativa durante a navegação.

**Exportações:**
```typescript
renderTree(manifest, container, onSelect: SelectHandler): void
markActiveLeaf(container, workId, partKey): void
```

**Comportamento:**
- Grupos renderizados na ordem: `abhidhamma → outros → visuddhimagga → comentarios`
- Cada nó de obra possui um marcador `▸` que alterna a visibilidade da lista de suas partes
- Clicar em uma folha de parte chama `onSelect(workId, partKey, 0, null)` (sempre chunk 0)
- `markActiveLeaf` percorre a árvore do DOM para cima para abrir todos os elementos `<ul>` ancestrais, garantindo que o item ativo esteja sempre visível ao navegar via hash de URL

**Estrutura do DOM:**
```html
<ul>
  <li>
    <div class="group-title">Abhidhamma Piṭaka</div>
    <ul>
      <li>
        <div class="node-label">▸ Dhammasaṅgaṇī</div>
        <ul style="display:none">
          <li><div class="node-label leaf" data-work-id="..." data-part-key="...">Mūla</div></li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

---

## `reader.ts` — Renderização de Segmentos

**Objetivo:** Busca arquivos de chunks e renderiza arrays de segmentos no elemento DOM `#content`.

**Exportações:**
```typescript
loadChunk(workId, partKey, fileName): Promise<Segment[]>
renderSegments(segments, container, options): void
```

**`loadChunk`:**
- Constrói a chave de cache `{workId}/{partKey}/{fileName}`
- Retorna o resultado em cache se disponível
- Caso contrário, executa `fetch("data/works/{workId}/{fileName}")` e armazena em cache

**`renderSegments`:**

Para cada segmento, cria:
```html
<div class="seg" data-rend="{rend}" data-seg-id="{id}">
  <div class="pali-line">
    <span class="paranum-badge">{paranum}</span>  <!-- if paranum -->
    <span><!-- innerHTML = seg.pali --></span>
    <button class="bookmark-toggle">☆/★</button>
  </div>
  <div class="translation-line">{translText}</div>  <!-- textContent, not innerHTML -->
</div>
```

**Crítico:** `paliText.innerHTML = seg.pali` — HTML bruto do corpus é deliberadamente renderizado via `innerHTML`. A `translation-line` usa `.textContent` porque os campos de tradução são texto simples.

Segmentos sem texto de tradução possuem `.translation-line { display: none }`.

**Opções:**
```typescript
interface RenderSegmentsOptions {
  onNoteHover?: (evt: MouseEvent | null, text?: string) => void;
  onBookmarkToggle?: (seg: Segment) => boolean;
  isBookmarked?: (segId: number) => boolean;
  effectiveLang?: TranslationLang;  // overrides settings.translationLang
}
```

---

## `dictionary.ts` — Painel do Dicionário Pāli

**Objetivo:** Interface de busca para o dicionário Pāli. Renderiza tanto entradas de `pali_core.json` (ricas, com múltiplos sentidos) quanto de `common_pali.json` (simples).

**Estado interno principal:**
```typescript
let dictData: DictEntry[] = [];       // common + optional dpd entries
let coreData: CoreDictEntry[] = [];   // pali_core entries
let rootInfo: Record<string, DictRootInfo> = {};
let loadPromise: Promise<void> | null = null;  // singleton guard
```

**Ordem de carregamento:**
1. `pali_core.json` → preenche `coreData` e `rootInfo`
2. `common_pali.json` → filtrado para excluir verbetes já presentes em `coreData` → anexado a `dictData`
3. `dpd.json` (opcional, ausente no build atual) → anexado a `dictData`

**Busca:** correspondência por prefixo no verbete (`.startsWith(query)`), ordenada por `freq` decrescente.

**Renderização:** Entradas principais (`dict-entry-core`) exibem distintivo de frequência, lista de múltiplos sentidos com gramática/raiz/sinônimos/antônimos por sentido e nota de uso. Entradas simples (`dict-entry`) exibem verbete, significado único, raiz/sinônimos/uso opcionais.

**Exibição de raiz:** Se `sense.root` existir e `rootInfo[sense.root]` for encontrado, exibe a string formatada `"root — tradução (skt. Sânscrito — significado)"`.

---

## `search.ts` — Painel de Busca Textual Completa (Full-Text)

**Objetivo:** Busca em índice invertido particionado (sharded) em todos os segmentos do corpus (Pāli + EN + PT + ES).

**Estado interno principal:**
```typescript
let shardManifest: SearchManifest | null = null;
const shardCache = new Map<string, SearchShard | null>();
```

**Algoritmo:**
1. Normaliza a consulta para minúsculas
2. Determina a chave do fragmento (shard): primeiro caractere se `[a-z]`, senão `"misc"`
3. Carrega o fragmento de `data/search/shard_{key}.json` (em cache)
4. Correspondência exata: `shard.postings[token]` → conjunto de índices de segmento
5. Expansão de prefixo: itera sobre `shard.postings` para tokens que começam com a consulta, unindo os índices (interrompe em `MAX_RESULTS = 50`)
6. Mapeia índices → objetos `SearchHit` de `shard.segments`

Clicar em um resultado chama `onOpenResult(hit)`, o que dispara `selectWork(hit.workId, hit.partKey, hit.chunk, hit.segId)`. O leitor então rola até o segmento correspondente e aplica uma animação `seg-flash`.

**Debounce:** 250ms em eventos de entrada (input).

---

## `export.ts` — Exportação para PDF / EPUB

Totalmente documentado em [06_export_module.md](06_export_module.md). Resumo:

- `initExportPanel(manifest, container, getCurrentWorkId)` — constrói a UI de exportação
- `buildPrintHtml(segs, title, langMode)` → string HTML pronta para impressão
- `buildEpub(segs, title, langMode)` → bytes ZIP (`Uint8Array`)
- `openPrintWindow(html, title)` — abre URL de blob em nova aba; fallback faz download do arquivo HTML
- `fieldHtml(raw)` — converte com segurança campos de segmento com HTML inline para HTML limpo de exportação
- `segToHtml(seg, langMode)` — mapeia um segmento para um bloco HTML

---

## `app.ts` — Inicialização (Bootstrap) da Aplicação

**Objetivo:** Conecta todos os módulos. Ponto de entrada carregado por `index.html`.

**AppState (nível de módulo):**
```typescript
interface AppState {
  manifest: Manifest | null;
  work: WorkEntry | null;
  partKey: string | null;
  chunkIndex: number;
  segments: Segment[];
}
```

**Sequência de `init()`:**
1. Busca `data/manifest.json`
2. `applySettingsToUI()` — sincroniza configurações com os elementos do formulário
3. `applyStaticI18n()` — traduz atributos `data-i18n`
4. `renderTree()` — preenche a árvore de navegação
5. `renderBreadcrumb()`, `renderHistory()`, `renderBookmarks()`
6. `wireIconRail()`, `wireSettingsPanel()`, `wireChunkNav()`, `wireRouting()`
7. `initDictionaryPanel()`, `initSearchPanel()`, `initExportPanel()`
8. Processa hash da URL → `selectWork()` ou exibe tela de boas-vindas

**`selectWork(workId, partKey, chunkIndex, segId?)`:**
- Valida se obra e parte existem no manifesto
- Força `showPali: true` para obras bilíngues
- Exibe placeholder de carregamento
- Chama `loadChunk()` → `rerenderContent()`
- Se `segId` for fornecido: rola até o segmento, adiciona a classe `seg-flash` por 1600ms
- Adiciona ao histórico, atualiza o hash da URL

**Eventos do painel de configurações:** Cada controle chama `updateSettings()` + renderiza novamente o conteúdo afetado. A alteração de idioma da interface chama `refreshLocalizedUI()`, que renderiza novamente toda a árvore e todos os rótulos internacionalizados.
