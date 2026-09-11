# 04 — Pipeline de Build

## 1. Visão Geral

```
Source DBs (SQLite)
       │
       ▼
scripts/extract_data.py
       │ writes
       ▼
data/works/**/*.json  +  data/manifest.json
       │
       ├──► scripts/build_search_index.py
       │           │ writes
       │           ▼
       │    data/search/shard_*.json  +  data/search/manifest.json
       │
       └──► scripts/build_core_dictionary.py   (manual stage-by-stage)
       │           │ writes
       │           ▼
       │    data/dictionary/pali_core.json
       │
       └──► scripts/build_common_dictionary.py  (automated)
                   │ writes
                   ▼
            data/dictionary/common_pali.json

src/*.ts
       │
       ▼
   tsc  (TypeScript compiler)
       │ writes
       ▼
js/*.js  +  js/*.js.map
       │
       ▼
scripts/version_js.py
       │ rewrites imports + index.html script tag
       ▼
js/*.js (versioned imports ?v={hash})
index.html (versioned script src)
```

## 2. `npm run build`

```json
"build": "tsc && python3 scripts/version_js.py"
```

Este é o único comando necessário após editar TypeScript. Ele:
1. Compila todos os `src/*.ts` → `js/*.js`
2. Aplica hashes de versão em todos os imports

**Sem bundler.** Cada módulo permanece como um arquivo separado. O navegador os carrega como módulos ES2022 nativos.

## 3. `extract_data.py` — Extração do Corpus

**Quando executar:** Apenas quando um novo banco de dados de origem estiver disponível ou quando o schema de segmentos mudar. Os arquivos JSON extraídos são commitados na pasta do site.

**Bancos de dados de origem necessários (não incluídos na pasta do site):**
- `tipitaka-roman-pali.db`
- `english_tipitaka_translation_data-2026-04-28.db`
- `portuguese_tipitaka_translation_data-2026-07-22.db`
- `spanish_tipitaka_translation_data-2026-05-15.db`

**O que ele faz:**
1. Abre todas as quatro conexões SQLite
2. Para cada obra/parte no registro `WORKS`:
   - Lê linhas da(s) tabela(s) especificada(s) com filtro opcional de `id_range`
   - `clean_pali()` converte o pseudo-XML de origem em HTML para o navegador:
     - `<hi rend="bold">X</hi>` → `<b>X</b>`
     - `<note>text</note>` → `<sup class="var-note" data-note="N">[N+1]</sup>` (texto da nota armazenado no array `notes`)
     - `<hi rend="paranum|dot">` → removido
     - Marcadores de quebra de página `<pb>` → removidos
   - Constrói o TOC a partir dos cabeçalhos de `chapter`/`subhead`
   - Divide em chunks de ≤ 900 segmentos, alinhados aos limites das seções
   - Grava `{partKey}__{i}.json` ou `{partKey}.json` por chunk
3. Grava `data/manifest.json`

**Constante de tamanho do chunk:** `CHUNK_SIZE = 900` (linha 27). Ajustar isso requer reexecutar a extração.

## 4. `build_search_index.py` — Construtor do Índice de Busca

**Quando executar:** Após qualquer alteração nos arquivos JSON do corpus (`data/works/`). Os resultados de busca ficarão desatualizados até que seja reexecutado.

```bash
python3 scripts/build_search_index.py
```

**Algoritmo:**
1. Lê todos os arquivos de segmentos através do manifest
2. Tokeniza: remove tags HTML, converte para minúsculas, extrai tokens de palavras Unicode ≥ 3 caracteres
3. Para cada token, registra a qual shard (primeiro caractere ou `misc`) ele pertence
4. Constrói `shard_postings[key][token] → [segIdx...]` e `shard_segments[key] → [SearchHit...]`
5. Limita a lista de postagens de cada token a 30 entradas
6. Grava um arquivo JSON por chave de shard + `manifest.json`

**Constantes no script:**
- `MAX_POSTINGS_PER_TOKEN = 30`
- `MIN_TOKEN_LEN = 3`
- `SNIPPET_LEN = 90` (caracteres)

**Resultado da última execução:** 91.065 segmentos processados, 50 shards gravados.

**Importante:** O índice de busca remove todo o HTML dos snippets (via `TAG_RE = re.compile(r"<[^>]+")`). Os snippets são, portanto, sempre texto simples, independentemente da marcação inline na fonte.

## 5. `build_core_dictionary.py` — Construtor do Dicionário Principal

**Quando executar:** Ao adicionar novas entradas lexicais ao `pali_core.json`. Este é um processo manual, estágio por estágio.

**Escala:** 14.420 linhas. O arquivo serve tanto como script quanto como documentação oficial de cada decisão lexicográfica tomada para cada uma das 721 entradas.

**Metodologia:**
1. Lê o `dpd-mobile.db` (Digital Pāli Dictionary, CC BY-NC-SA 4.0)
2. Agrupa formas de superfície (flexões) aos lemas usando a tabela `dpd_headwords.lookup`
3. Conta frequências de tokens no corpus a partir de `data/works/`
4. Atribui formas de superfície aos lemas pela leitura dominante (documentada por lema)
5. Extrai acepções (pos, grammar, root, syn, ant, en) do DPD
6. Traduções manuais em PT e ES são hardcoded no script
7. Grava `data/dictionary/pali_core.json`

**Estágio atual:** Estágio 7 (65,23% de cobertura de tokens do corpus, meta de 82%). 721 entradas, 120 entradas de raízes.

**Histórico de estágios:**
- Estágio 1: 4 lemas — ta, ca, na, dhamma (10,79%)
- Estágio 2: +8 lemas — ti, pe, uppajjati, ya, paccaya, vā, hoti, pana (21,68%)
- Estágio 3: +17 lemas — khandha, tattha, paṭicca, eka, vutta, ... (total ~30%)
- Estágio 4: +lemas atingindo ~40%
- Estágio 5: +lemas atingindo ~50%
- Estágio 6: +lemas atingindo ~55%
- Estágio 7: 205 novos lemas atingindo 65,23%

**Pendente conhecido:** Desambiguação de `katatta`/`kaṭatta` (dental vs retroflexo); consulte o docstring do script de build.

## 6. `build_common_dictionary.py` — Construtor do Dicionário Comum

**Quando executar:** Ao adicionar entradas simples que não justificam tratamento com múltiplos sentidos.

241 linhas. Lê de uma tabela simples de verbetes e grava `common_pali.json`.

## 7. `version_js.py` — Carimbador de Versão de Imports

**Objetivo:** Invalidar o cache de módulos ES anexando `?v={hash}` a todos os caminhos de importação.

**Algoritmo:**
```python
ROOT = Path(__file__).resolve().parent.parent
JS_DIR = ROOT / "js"
INDEX = ROOT / "index.html"

# 1. Compute MD5 of all .js files (sorted, deterministic)
h = hashlib.md5()
for f in sorted(JS_DIR.glob("*.js")):
    h.update(f.read_bytes())
VERSION = h.hexdigest()[:8]

# 2. Rewrite imports in all .js files
PAT = re.compile(r'((?:from|import)\s+")(\.\/[^"?]+\.js)(?:\?v=[^"]*)?(")')
# Replaces: from "./export.js" → from "./export.js?v=5df634f9"
# Also handles: from "./export.js?v=old" → from "./export.js?v=5df634f9"

# 3. Rewrite <script> tag in index.html
```

**Por que pós-compilação:** O TypeScript resolve caminhos de importação literalmente. `from "./export.js?v=..."` faria com que o `tsc` procurasse por um arquivo nomeado literalmente `export.js?v=...`. O carimbo de versão é, portanto, aplicado apenas à saída compilada.

**Hash da versão atual:** `5df634f9` (calculado em 23-08-2026).

## 8. Configurações do `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "rootDir": "src",
    "outDir": "js",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "sourceMap": true,
    "removeComments": true,
    "isolatedModules": true,
    "skipLibCheck": true
  }
}
```

Configurações principais:
- `noUncheckedIndexedAccess`: o acesso a arrays retorna `T | undefined`, forçando checagens de nulo. É por isso que o código usa `?.` extensivamente em resultados de arrays.
- `exactOptionalPropertyTypes`: distingue `{ x?: string }` de `{ x?: string | undefined }`.
- `removeComments`: arquivos de saída não contêm comentários (mantém o JS enxuto).
- `sourceMap`: arquivos `.js.map` permitem que o DevTools do navegador exiba o código-fonte TypeScript.

## 9. Análise de Frequência de Palavras

`scripts/word_frequency.py` conta as frequências de tokens em todo o corpus e grava `pali_word_freq.tsv`. Este TSV é usado por `build_core_dictionary.py` para determinar quais lemas incluir em cada estágio. `pali_word_freq.tsv` está commitado na pasta do site como um arquivo de referência estático.

O corpus possui um total de 1.878.244 ocorrências de tokens em Pāli.
