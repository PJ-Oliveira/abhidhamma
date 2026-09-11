# Arquitetura

## 1. Grafo de Módulos

```
index.html
  └── js/app.js  (ponto de entrada)
        ├── i18n.js           — Strings de UI (PT/EN/ES)
        ├── state.js          — Persistência localStorage
        │     └── logger.js
        ├── tree.js           — Renderização da árvore de navegação
        ├── reader.js         — Carregamento de fragmentos + renderização de segmentos
        ├── dictionary.js     — Busca no dicionário Pāli (normalização morfológica)
        ├── search.js         — Busca por índice invertido fragmentado
        ├── export.js         — Construtor de PDF / EPUB 3
        ├── srs.js            — Repetição Espaçada (SM-2)
        ├── selection.js      — Popover de seleção de texto + copiar link
        ├── tools/tools.js    — Gerenciador de abas do painel de ferramentas
        │     ├── tools/mindmap.js
        │     ├── tools/patthana.js
        │     ├── tools/vithi.js
        │     ├── tools/matikas.js
        │     └── tools/cetasika.js
        └── ai-feature/ui.js  — Simulador de Debate (carregamento lazy)
              ├── debate-scenarios.js
              └── ontology/kathavatthu_logic.js
```

Sem dependências circulares. `logger.ts` e `types.ts` são folhas puras.

---

## 2. Layout CSS

```css
#app {
  display: grid;
  grid-template-columns: var(--rail-w) var(--panel-w) 8px 1fr;
  height: 100vh;
}
```

Quatro colunas:
1. `#icon-rail` — clamp(56–76 px) — ícones de navegação
2. `#side-panel` — clamp(240–320 px), redimensionável via arrastar `#panel-resizer` — painéis de conteúdo
3. `#panel-resizer` — 8 px de alça de arrastar
4. `main#reader` — restante — conteúdo de texto

Breakpoint responsivo em `max-width: 860px`: painel vira overlay fixo; rótulos do rail são ocultados.

---

## 3. Roteamento via URL

Baseado em hash. Formato: `#/{panel}/{workId}/{partKey}/{chunkIndex}?seg={id}&q={query}`

```
#/tipitaka/dhammasangani/mula/0
#/dictionary?q=citta
#/tools/vithi
#/search
```

`parseHash()` em `app.ts` analisa o hash em um objeto `Route { panel, workId, partKey, chunkIndex, segId, q }`. No evento `hashchange`, o roteador chama `switchPanel()` e/ou `selectWork()` conforme necessário.

---

## 4. Gerenciamento de Estado

Todo o estado vive em `state.ts` (singleton em nível de módulo):

```typescript
export const settings: Settings
export function getHistory(): HistoryEntry[]
export function pushHistory(entry): void
export function getBookmarks(): BookmarkEntry[]
export function toggleBookmark(entry): boolean
export function isBookmarked(workId, partKey, segId): boolean
```

Três chaves localStorage versionadas:

| Chave | Tipo | Limite |
|---|---|---|
| `atp.settings.v1` | `Settings` | objeto único |
| `atp.history.v1` | `HistoryEntry[]` | 50 entradas, dedup FIFO |
| `atp.bookmarks.v1` | `BookmarkEntry[]` | ilimitado |

Configurações padrão: `{ translationLang: "en", uiLang: "en", fontSize: 17, showPali: true, showTranslation: true }`

---

## 5. Estratégia de Carregamento de Dados

| Recurso | Quando carregado | Cache |
|---|---|---|
| `data/manifest.json` | Init do app (falha fatal se falhar) | `AppState.manifest` |
| `data/works/{id}/{file}` | Em cada `selectWork()` | `Map<string, Segment[]>` em `reader.ts` |
| `data/search/manifest.json` | Na inicialização do painel de busca | `shardManifest` nível de módulo |
| `data/search/shard_{ch}.json` | Na primeira consulta com aquele caractere | `Map<string, SearchShard>` em `search.ts` |
| `data/dictionary/pali_core.json` | No primeiro evento de input do dict | `coreData[]` em `dictionary.ts` |
| `data/dictionary/common_pali.json` | Mesma promise de carregamento | `dictData[]` em `dictionary.ts` |

Todos os caches de dados são em memória e vivem pela sessão do navegador.

---

## 6. Pipeline de Build

```
src/*.ts  →[tsc]→  js/*.js  →[version_js.py]→  js/*.js?v={hash}
                              (reescreve imports + tag script do index.html)
```

`version_js.py` computa MD5 sobre todos os arquivos `js/*.js`, pega os primeiros 8 caracteres hex e injeta `?v={hash}` em cada import de módulo ES e na tag `<script>` do `index.html`.

---

## 7. Service Worker / PWA

`service-worker.js` implementa estratégia cache-first:

1. No `install`: armazena em cache o **app shell** (HTML, CSS, fontes, JS, manifest, dicionário).
2. Após 10 s de delay: **pré-armazena todos os fragmentos do corpus** (~140 MB, lote de 3 arquivos) para leitura offline completa.
3. No `fetch`: tenta o cache primeiro; cai para a rede; armazena em cache novas respostas bem-sucedidas.

---

## 8. Internacionalização (i18n)

`i18n.ts` exporta uma única função:

```typescript
export function t(key: string, uiLang: UiLang): string
```

Todas as strings são constantes estáticas em tempo de compilação em um objeto `STRINGS: Record<UiLang, Strings>`. Cadeia de fallback: `STRINGS[uiLang][key]` → `STRINGS.en[key]` → chave.

`uiLang` (idioma da interface) e `translationLang` (idioma do conteúdo) são armazenados separadamente mas mantidos sincronizados por `applySettingsToUI()`.

---

## 9. Obras Bilíngues ("Comentários")

Obras no grupo `"comentarios"` usam layout de dados diferente:
- campo `pali` armazena o **texto original em inglês** (não Pāli)
- campo `pt` armazena a **tradução em português**

Quando tal obra é selecionada:
- `showPali` é forçado como `true` (para que a coluna "Pāli"/inglês original fique visível)
- `effectiveLang: "pt"` é passado para `renderSegments`, substituindo `translationLang`
- Rótulos de configurações mudam para "Mostrar inglês (original)" / "Mostrar português"
