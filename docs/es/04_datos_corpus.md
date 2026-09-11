# Datos y Corpus

## 1. manifest.json

`data/manifest.json` es el registro único de todo el contenido navegable. Estructura:

```typescript
interface Manifest {
  groups: Record<string, WorkEntry[]>
}

interface WorkEntry {
  id: string        // ej: "dhammasangani"
  title: string     // ej: "Dhammasaṅgaṇī"
  parts: Record<string, WorkPart>
}

interface WorkPart {
  label: string         // nombre de visualización
  files: string[]       // nombres de los fragmentos, ej: ["chunk_001.json", ...]
  toc: TocEntry[]       // entradas del sumario (capítulos, etc.)
  count: number         // total de segmentos
  chunkStarts?: number[] // ID del seg inicial de cada fragmento (para navegación)
}

interface TocEntry {
  id: number   // ID del segmento (usado como ancla)
  rend: string // "chapter" | "book" | ...
  text: string // texto del encabezado
}
```

Grupos ordenados: `abhidhamma → outros → visuddhimagga → comentarios`.

---

## 2. Formato del Segmento (Fragmento de Contenido)

Cada archivo de fragmento es un array JSON `Segment[]`:

```typescript
interface Segment {
  id: number          // ID monotónico creciente en todo el corpus
  rend: string        // pista de renderización: "chapter" | "bodytext" | "hangnum" | etc.
  paranum: string | null // badge de número de párrafo (ej: "§ 42")
  pali: string        // texto Pāli (puede contener HTML inline: <b>, <p rend="...">, <sup>)
  en: string          // traducción al inglés
  pt: string          // traducción al portugués
  es: string          // traducción al español
  notes?: string[]    // textos de notas al pie (indexados por superscripts .var-note)
}
```

### HTML Inline en el campo `pali`

El campo Pāli puede contener:

| Tag | Propósito |
|---|---|
| `<b>` | Palabras clave en negrita (~57.000 ocurrencias) |
| `<p rend="gatha1/2/3/gathalast">` | Estrofas de versos |
| `<sup class="var-note" data-note="{N}">` | Marcador de nota de variante de lectura |
| `<x_bin_42>` | Tag anómala única (inofensiva) |

---

## 3. Datos del Diccionario

### `data/dictionary/pali_core.json`

Diccionario de lemas Pāli de alta frecuencia. 721 entradas cubriendo las palabras más comunes (~70% de las ocurrencias de tokens del corpus).

```typescript
interface CoreDictEntry {
  h: string          // palabra cabecera
  freq: number       // frecuencia en el corpus
  pct: number        // % del total de tokens del corpus
  usage?: string     // nota de uso contextual
  senses: DictSense[]
}

interface DictSense {
  id: string         // ej: "citta.1", "citta.2"
  pos?: string       // clase gramatical
  grammar?: string   // nota gramatical
  root?: string      // clave de raíz
  en: string; pt: string; es: string
  syn?: string; ant?: string
}
```

### `data/dictionary/common_pali.json`

Diccionario Pāli general. 182 entradas de sentido único usadas para búsqueda y glosario de exportación.

### Normalización Morfológica (`dictionary.ts`)

`normalizePali(token)` genera formas de lema candidatas por:
1. Búsqueda supletiva/sandhi (mapa `SUPPLETIVE` con ~80 entradas para formas irregulares como `so → ta`, `bhikkhave → bhikkhu`)
2. Eliminación de terminaciones regulares: nom/gen/acc/dat/abl/loc/inst/voc para radicales en -a, -ā, -u, -ū; 3ª pl. presente `-nti → -ti`; iti-sandhi `-tīti → -ti`; compuestos con prefijo na-; compuestos con prefijo neva-

---

## 4. Índice de Búsqueda

### Fragmentación (Sharding)

El índice de búsqueda se divide en fragmentos por carácter inicial. `data/search/manifest.json`:

```json
{ "shards": { "a": "shard_a.json", "b": "shard_b.json", ... "misc": "shard_misc.json" } }
```

Existen fragmentos para `a-z`, letras latinas con diacríticos (`ā`, `ī`, `ū`, etc.) y `misc` para cualquier otra cosa.

### Formato del Fragmento

```typescript
interface SearchShard {
  postings: Record<string, number[]>  // token → array de índices de segmentos
  segments: SearchHit[]               // array plano de metadatos de resultados
}
```

### Lógica de Búsqueda

1. Normaliza consulta a minúsculas.
2. Carga fragmento para `query[0]`.
3. Recopila postings de coincidencia exacta, luego prefijo (hasta 50 resultados).
4. Mapea índices a objetos `SearchHit`; renderiza en la lista de resultados.

---

## 5. Datos de las Herramientas

Ubicados en `data/tools/`:
- `vithi.json` — secuencias de puertas/proceso de consciencia (Citta-Vīthi)
- `citta_cetasika.json` — mapeo citta-cetasika
- `patthana.json` — relaciones condicionales
- `mindmap.json` — datos de nodos del mapa mental
- `matikas.json` — listas de clasificación de tríadas/díadas

---

## 6. Volumen de Datos

| Recurso | Tamaño aproximado |
|---|---|
| manifest.json | ~50 KB |
| Todos los fragmentos del corpus | ~140 MB total |
| pali_core.json | ~400 KB |
| common_pali.json | ~80 KB |
| Todos los fragmentos de búsqueda | ~5 MB |
| Datos de herramientas | ~1 MB |
