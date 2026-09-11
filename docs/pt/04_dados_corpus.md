# Dados e Corpus

## 1. manifest.json

`data/manifest.json` é o registro único de todo o conteúdo navegável. Estrutura:

```typescript
interface Manifest {
  groups: Record<string, WorkEntry[]>
}

interface WorkEntry {
  id: string        // ex: "dhammasangani"
  title: string     // ex: "Dhammasaṅgaṇī"
  parts: Record<string, WorkPart>
}

interface WorkPart {
  label: string         // nome de exibição
  files: string[]       // nomes dos fragmentos, ex: ["chunk_001.json", ...]
  toc: TocEntry[]       // entradas do sumário (capítulos, etc.)
  count: number         // total de segmentos
  chunkStarts?: number[] // ID do seg inicial de cada fragmento (para navegação)
}

interface TocEntry {
  id: number   // ID do segmento (usado como âncora)
  rend: string // "chapter" | "book" | ...
  text: string // texto do cabeçalho
}
```

Grupos ordenados: `abhidhamma → outros → visuddhimagga → comentarios`.

---

## 2. Formato do Segmento (Fragmento de Conteúdo)

Cada arquivo de fragmento é um array JSON `Segment[]`:

```typescript
interface Segment {
  id: number          // ID monotônico crescente em todo o corpus
  rend: string        // dica de renderização: "chapter" | "bodytext" | "hangnum" | etc.
  paranum: string | null // badge de número de parágrafo (ex: "§ 42")
  pali: string        // texto Pāli (pode conter HTML inline: <b>, <p rend="...">, <sup>)
  en: string          // tradução em inglês
  pt: string          // tradução em português
  es: string          // tradução em espanhol
  notes?: string[]    // textos de notas de rodapé (indexados por superscripts .var-note)
}
```

### HTML Inline no campo `pali`

O campo Pāli pode conter:

| Tag | Propósito |
|---|---|
| `<b>` | Palavras-chave em negrito (~57.000 ocorrências) |
| `<p rend="gatha1/2/3/gathalast">` | Estrofes de versos |
| `<sup class="var-note" data-note="{N}">` | Marcador de nota de variante de leitura |
| `<x_bin_42>` | Tag anômala única (inofensiva) |

---

## 3. Dados do Dicionário

### `data/dictionary/pali_core.json`

Dicionário de lemas Pāli de alta frequência. 721 entradas cobrindo as palavras mais comuns (~70% das ocorrências de tokens do corpus).

```typescript
interface CoreDictEntry {
  h: string          // palavra-cabeçalho
  freq: number       // frequência no corpus
  pct: number        // % do total de tokens do corpus
  usage?: string     // nota de uso contextual
  senses: DictSense[]
}

interface DictSense {
  id: string         // ex: "citta.1", "citta.2"
  pos?: string       // classe gramatical
  grammar?: string   // nota gramatical
  root?: string      // chave de raiz
  en: string; pt: string; es: string
  syn?: string; ant?: string
}
```

### `data/dictionary/common_pali.json`

Dicionário Pāli geral. 182 entradas de sentido único usadas para busca e glossário de exportação.

### Normalização Morfológica (`dictionary.ts`)

`normalizePali(token)` gera formas de lema candidatas por:
1. Busca suppletiva/sandhi (mapa `SUPPLETIVE` com ~80 entradas para formas irregulares como `so → ta`, `bhikkhave → bhikkhu`)
2. Remoção de terminações regulares: nom/gen/acc/dat/abl/loc/inst/voc para radicais em -a, -ā, -u, -ū; 3ª pl. presente `-nti → -ti`; iti-sandhi `-tīti → -ti`; compostos com prefixo na-; compostos com prefixo neva-

---

## 4. Índice de Busca

### Fragmentação (Sharding)

O índice de busca é dividido em fragmentos por caractere inicial. `data/search/manifest.json`:

```json
{ "shards": { "a": "shard_a.json", "b": "shard_b.json", ... "misc": "shard_misc.json" } }
```

Fragmentos existem para `a-z`, letras latinas com diacríticos (`ā`, `ī`, `ū`, etc.) e `misc` para qualquer outra coisa.

### Formato do Fragmento

```typescript
interface SearchShard {
  postings: Record<string, number[]>  // token → array de índices de segmentos
  segments: SearchHit[]               // array plano de metadados de resultados
}
```

### Lógica de Busca

1. Normaliza consulta para minúsculas.
2. Carrega fragmento para `query[0]`.
3. Coleta postings de correspondência exata, depois prefixo (até 50 resultados).
4. Mapeia índices para objetos `SearchHit`; renderiza na lista de resultados.

---

## 5. Dados das Ferramentas

Localizados em `data/tools/`:
- `vithi.json` — sequências de portas/processo de consciência (Citta-Vīthi)
- `citta_cetasika.json` — mapeamento citta-cetasika
- `patthana.json` — relações condicionais
- `mindmap.json` — dados de nós do mapa mental
- `matikas.json` — listas de classificação de tríades/díades

---

## 6. Volume de Dados

| Recurso | Tamanho aproximado |
|---|---|
| manifest.json | ~50 KB |
| Todos os fragmentos do corpus | ~140 MB total |
| pali_core.json | ~400 KB |
| common_pali.json | ~80 KB |
| Todos os fragmentos de busca | ~5 MB |
| Dados de ferramentas | ~1 MB |
