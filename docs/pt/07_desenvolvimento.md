# Desenvolvimento

## 1. Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9
- Python 3 (para `scripts/version_js.py`)

---

## 2. Scripts npm

| Script | Comando | Descrição |
|---|---|---|
| `test` | `vitest run` | Roda todos os testes unitários uma vez |
| `build` | `tsc && python3 scripts/version_js.py` | Compila TypeScript + adiciona hash de versão |
| `deploy` | `build + git push` | Build completo e publicação |
| `watch` | `tsc --watch` | Recompilação incremental |
| `integrate-books` | `python3 scripts/integrate_books.py` | Integra novos textos no corpus |
| `rebuild-search` | `python3 scripts/build_search_index.py` | Reconstrói índice de busca fragmentado |

---

## 3. Pipeline de Build

```
src/*.ts
  │
  ▼ tsc (tsconfig.json: target=ES2022, module=ESNext, outDir=js)
  │
js/*.js (módulos ES sem versionamento)
  │
  ▼ python3 scripts/version_js.py
  │   - calcula MD5 de todos os js/*.js
  │   - reescreve imports relativos em todos os .js para adicionar ?v={hash}
  │   - atualiza tag <script src="js/app.js?v={hash}"> em index.html
  │
js/*.js?v={hash} + index.html atualizado
```

---

## 4. Configuração TypeScript

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "js",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

---

## 5. Testes (Vitest 4)

**Localização:** `tests/` com ambiente jsdom.

**Executar:**
```bash
npm test
```

**Cobertura:**
```bash
npx vitest run --coverage
```

### Módulos Testados

| Arquivo de teste | Cobre |
|---|---|
| `srs.spec.ts` | Algoritmo SM-2, fila de cartões, limites diários |
| `dictionary.spec.ts` | `normalizePali`, lookup de 4 fases |
| `search.spec.ts` | Carregamento de fragmentos, correspondência exata/prefixo |
| `state.spec.ts` | Persistência localStorage, deduplicação de histórico |
| `export.spec.ts` | `crc32`, geração de manifesto EPUB, serialização de HTML |
| `i18n.spec.ts` | `t()` com todas as línguas, fallback |
| `kathavatthu_logic.spec.ts` | `evaluateCustomClaim`, `evaluateScenario` |
| `reader.spec.ts` | `renderSegments`, tratamento de rend |

---

## 6. Adicionando um Novo Texto

1. Prepare fragmentos JSON: arrays `Segment[]` em `data/works/{id}/`.
2. Adicione entrada em `data/manifest.json` sob o grupo correto.
3. Execute `npm run rebuild-search` para adicionar o novo texto ao índice de busca.
4. (Opcional) Execute `npm run integrate-books` se usar o script de integração de pipeline.

---

## 7. Adicionando uma Nova Ferramenta

1. Crie `src/tools/mytool.ts` exportando `init(container: HTMLElement)`.
2. Adicione à array `TABS` em `src/tools/tools.ts`:
   ```typescript
   { id: "mytool", label: "Minha Ferramenta", init: () => import("./mytool.js").then(m => m.init) }
   ```
3. Crie arquivo de dados JSON em `data/tools/mytool.json` se necessário.

---

## 8. Adicionando Strings de UI

Em `src/i18n.ts`, adicione a nova chave ao objeto `STRINGS` para `pt`, `en` e `es`:

```typescript
const STRINGS = {
  pt: { ..., myKey: "Meu Texto" },
  en: { ..., myKey: "My Text" },
  es: { ..., myKey: "Mi Texto" },
}
```

Use com `t("myKey", state.settings.uiLang)`.

---

## 9. Atualização do Service Worker

Ao fazer push de novos ativos do corpus, incremente `CACHE_NAME` em `service-worker.js`:

```javascript
const CACHE_NAME = 'abhidhamma-cache-v9';  // era v8
```

Isso invalida o cache do cliente e força nova instalação.

**Nota:** Certifique-se de que `CORE_ASSETS` inclui os arquivos JS versionados (com sufixo `?v={hash}`) — veja BUG-001 nos docs de bugs.

---

## 10. Estrutura de Diretórios do Código-Fonte

```
src/
  app.ts              Ponto de entrada principal e roteamento
  types.ts            Interfaces TypeScript compartilhadas
  i18n.ts             Strings de UI trilíngues
  state.ts            Persistência localStorage
  logger.ts           Logger utilitário
  reader.ts           Renderização de fragmentos/segmentos
  dictionary.ts       Dicionário Pāli e normalização
  search.ts           Busca por índice invertido
  srs.ts              Repetição Espaçada (SM-2)
  tree.ts             Árvore de navegação de obras
  selection.ts        Popover de seleção de texto
  export.ts           Exportação PDF/EPUB
  tools/
    tools.ts          Gerenciador de abas das ferramentas
    mindmap.ts        Mapa mental SVG
    patthana.ts       Visualização Paṭṭhāna
    vithi.ts          Animação Citta-Vīthi
    matikas.ts        Tríades/díades da Mātikā
    cetasika.ts       Mapeamento Citta-Cetasika
  ai-feature/
    ui.ts             UI do Simulador de Debate
    debate-scenarios.ts  Cenários canônicos
  ontology/
    kathavatthu_logic.ts  Motor lógico de debate
```

---

## 11. Deploy

O projeto é hospedado como site de arquivos estáticos (GitHub Pages). `.nojekyll` na raiz desabilita o processamento Jekyll. O deploy é feito pelo script `deploy` (build + git push para a branch gh-pages ou main, dependendo da configuração do repositório).

Não há servidor backend; nenhuma variável de ambiente é necessária em runtime.
