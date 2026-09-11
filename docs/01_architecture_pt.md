# 01 — Arquitetura do Sistema

## 1. Design de Alto Nível

```
Navegador
│
├── index.html          ← ponto único de entrada; sem renderização do lado do servidor (SSR)
│     └── <script type="module" src="js/app.js?v={hash}">
│
├── css/style.css       ← folha de estilo única, CSS custom properties + Grid
│
├── js/                 ← módulos ES2022 compilados (TypeScript → tsc → version_js.py)
│     ├── app.js        ← bootstrap, roteamento, ligação de configurações
│     ├── reader.js     ← renderização de segmentos
│     ├── export.js     ← exportação PDF / EPUB
│     ├── search.js     ← busca por índice invertido fragmentado (sharded)
│     ├── dictionary.js ← consulta ao dicionário Pāli
│     ├── tree.js       ← árvore de navegação
│     ├── state.js      ← persistência em localStorage
│     ├── i18n.js       ← literais de texto (PT / EN / ES)
│     ├── logger.js     ← logger de console com níveis de log
│     └── types.js      ← shim vazio (apenas interfaces, removidas pelo tsc)
│
└── data/
      ├── manifest.json            ← árvore de navegação (obras → partes → arquivos de chunk)
      ├── works/{id}/*.json        ← chunks de conteúdo (~900 segmentos cada)
      ├── dictionary/
      │     ├── pali_core.json     ← 721 lemas Pāli de alta frequência (múltiplos sentidos)
      │     ├── common_pali.json   ← 182 entradas Pāli gerais (sentido único)
      │     └── vocabulary_blocks.md ← glossário de referência (10 blocos terminológicos)
      └── search/
            ├── manifest.json      ← mapa de chave do shard → nome do arquivo
            └── shard_{key}.json   ← 50 shards indexados pela inicial do token
```

## 2. Grafo de Dependências de Módulos

```
app.ts
 ├── i18n.ts
 ├── state.ts
 │     └── logger.ts
 ├── tree.ts
 │     ├── i18n.ts
 │     └── state.ts
 ├── reader.ts
 │     ├── state.ts
 │     ├── logger.ts
 │     ├── i18n.ts
 │     └── types.ts
 ├── dictionary.ts
 │     ├── i18n.ts
 │     ├── state.ts
 │     └── logger.ts
 ├── search.ts
 │     ├── i18n.ts
 │     ├── state.ts
 │     └── logger.ts
 └── export.ts
       ├── i18n.ts
       ├── state.ts
       └── logger.ts
```

Sem dependências circulares. `logger.ts` e `types.ts` são nós-folha.

## 3. Layout

```
┌───────────┬─────────────────────┬──────────────────────────────┐
│  #icon-   │    #side-panel      │   main#reader                │
│  rail     │  (panel-w: 240–320) │   (flex-grow: 1)             │
│  (rail-w: │                     │                              │
│  56–76px) │  Um de:             │  #reader-header              │
│           │  • panel-tipitaka   │    #breadcrumb               │
│           │  • panel-dictionary │    #part-tabs                │
│           │  • panel-history    │                              │
│           │  • panel-search     │  #content                    │
│           │  • panel-settings   │    .seg × N                  │
│           │  • panel-export     │      .pali-line              │
│           │                     │      .translation-line       │
│           │                     │                              │
│           │                     │  #toc-nav (prev/indicador/next)│
└───────────┴─────────────────────┴──────────────────────────────┘
```

CSS Grid: `grid-template-columns: var(--rail-w) var(--panel-w) 1fr`

Breakpoint responsivo em `max-width: 860px`: o painel torna-se uma sobreposição com `position:fixed`; rótulos do rail ficam ocultos.

## 4. Roteamento de URL

Baseado em hash: `#/{workId}/{partKey}/{chunkIndex}`

Exemplos:
- `#/dhammasangani/mula/0`
- `#/patthana/attha/3`

No evento `hashchange`, `parseHash()` extrai a trinca de valores e chama `selectWork()`. No carregamento da página, se uma hash estiver presente, o chunk correspondente é carregado imediatamente; caso contrário, a tela de boas-vindas é exibida.

## 5. Persistência de Estado

Três chaves no `localStorage` (versionadas para permitir futuras migrações):

| Chave | Tipo | Limite |
|---|---|---|
| `atp.settings.v1` | `Settings` | Sempre 1 objeto |
| `atp.history.v1` | `HistoryEntry[]` | 50 entradas (FIFO com desduplicação por workId/partKey/chunk) |
| `atp.bookmarks.v1` | `BookmarkEntry[]` | Ilimitado |

Padrão de configurações (`Settings`): `{ translationLang: "pt", uiLang: "pt", fontSize: 17, showPali: true, showTranslation: true }`

## 6. Estratégia de Carregamento de Dados

### Manifest
Buscado uma única vez na inicialização (`init()`) a partir de `data/manifest.json`. Falhas são fatais (o conteúdo não poderá ser navegado).

### Chunks
Buscados sob demanda via `loadChunk(workId, partKey, fileName)`. Os resultados são mantidos em cache em memória em um `Map<string, Segment[]>` (sem TTL; o cache persiste durante a sessão do navegador). O tamanho da maior obra (Paṭṭhāna mūla) é de ~27.746 segmentos divididos em 31 arquivos de chunk.

### Índice de busca
Os shards são buscados de forma lazy (sob demanda) — apenas o shard correspondente ao primeiro caractere da consulta. O `shardManifest` é carregado uma vez na inicialização do painel; shards individuais são armazenados em cache em `shardCache: Map<string, SearchShard | null>`.

### Dicionário
Carregado uma única vez no primeiro evento de entrada (`input`): `pali_core.json` → `common_pali.json` → `dpd.json` (opcional, não presente na versão atual). Uma única `loadPromise` evita buscas duplicadas.

## 7. Versionamento / Cache Busting

Módulos ES são armazenados em cache pelo navegador no nível de URL absoluta. Para forçar a invalidação do cache após um build:

1. O `tsc` compila `src/*.ts` → `js/*.js`
2. O script `scripts/version_js.py` calcula o hash MD5 de todos os arquivos `js/*.js`, extrai os primeiros 8 caracteres hexadecimais e:
   - Reescreve todas as importações `from "./X.js"` em todos os arquivos `js/*.js` para `from "./X.js?v={hash}"`
   - Reescreve a tag `<script>` em `index.html` para `src="js/app.js?v={hash}"`

Hash atual: `5df634f9` (definido em 23/08/2026).

**Por que apenas pós-compilação:** O resolvedor de módulos do TypeScript trata os caminhos de importação literalmente. Adicionar `?v=...` nos arquivos `.ts` faria com que o `tsc` procurasse um arquivo chamado `export.js?v=...`, que não existe. Portanto, a marcação de versão é aplicada apenas à saída compilada em `.js`.

## 8. Renderização de Segmentos (Tratamento de HTML Inline)

Os dados brutos do corpus no campo `pali` contêm HTML inline real herdado dos bancos de dados SQLite originais:

| Tag | Frequência | Semântica |
|---|---|---|
| `<b>` | 57.283 | Palavras-chave em negrito (*headwords*) |
| `<p rend="gathalast">` | varia | Segundo hemistíquio de dístico de verso |
| `<p rend="gatha1/2/3">` | varia | Estrofes de verso |
| `<sup class="var-note">` | 873 | Marcador de nota de rodapé de variantes de leitura |
| `<x_bin_42>` | 1 | Tag anômala (inofensiva) |

**No leitor (`reader.ts`):** `paliText.innerHTML = seg.pali` — o navegador analisa e renderiza o HTML inline nativamente. As linhas de tradução usam `.textContent` (apenas texto puro).

**Na exportação (`export.ts`):** `fieldHtml(raw)` usa `DOMParser` para analisar o HTML inline e resserializá-lo como marcação limpa de exportação via `walkNode()`. Consulte [06_export_module.md](06_export_module.md) para detalhes completos.

## 9. Internacionalização

O arquivo `i18n.ts` exporta uma única função `t(key, uiLang)`. Todas as strings da interface são estáticas — definidas em um registro `STRINGS` indexado por `UiLang` (`"pt" | "en" | "es"`). Cadeia de fallback: `STRINGS[uiLang][key]` → `STRINGS.pt[key]` → a própria chave.

O idioma da tradução (`translationLang`) é independente do idioma da interface (`uiLang`): o usuário pode ler o conteúdo em português enquanto os rótulos da interface estão em inglês.

## 10. Obras Bilíngues (Comentários Contemporâneos)

As obras no grupo `"comentarios"` (atualmente: *Abhidhamma in Daily Life*) armazenam o texto em inglês no campo `pali` e em português no campo `pt`. Quando uma obra desse tipo é aberta:

- `showPali` é forçado para `true` para que a coluna "Pāli" (na verdade o original em inglês) fique visível.
- `effectiveLang: "pt"` é passado para `renderSegments`, para que a linha de tradução exiba o português.
- Os rótulos do painel de configurações mudam de "Mostrar Pāli" → "Mostrar inglês (original)".
