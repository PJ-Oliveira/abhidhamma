# 02 — Dados do Corpus

## 1. Esquema do Segmento (Segment Schema)

Cada segmento é um objeto JSON em conformidade com:

```typescript
interface Segment {
  id:       number;        // primary key from source SQLite; globally unique per work/part
  rend:     string;        // rendering hint (see §3)
  paranum:  string | null; // paragraph number badge (e.g. "§ 1", "1.")
  pali:     string;        // Pāli text — MAY contain inline HTML (see §4)
  en:       string;        // English translation (plain text)
  pt:       string;        // Portuguese translation (plain text)
  es:       string;        // Spanish translation (plain text)
  notes?:   string[];      // footnote texts, indexed by <sup data-note="N">
}
```

Os campos de tradução (`en`, `pt`, `es`) são sempre texto simples. Apenas o campo `pali` pode conter HTML inline.

## 2. Formato do Manifesto

`data/manifest.json` é a árvore de navegação única carregada na inicialização:

```json
{
  "groups": {
    "abhidhamma": [ WorkEntry, ... ],
    "outros":     [ WorkEntry, ... ],
    "visuddhimagga": [ WorkEntry, ... ],
    "comentarios":   [ WorkEntry, ... ]
  }
}
```

Cada `WorkEntry`:

```json
{
  "id":    "dhammasangani",
  "title": "Dhammasaṅgaṇī",
  "parts": {
    "mula": {
      "label": "Mūla",
      "files": ["mula__0.json", "mula__1.json", "mula__2.json"],
      "toc": [
        { "id": 4, "rend": "chapter", "text": "Mātikā" },
        ...
      ]
    },
    "attha": { ... }
  }
}
```

O array `toc` contém apenas segmentos `chapter` e `subhead` com seu texto Pāli desprovido de HTML. O painel de exportação utiliza entradas de `toc` para preencher os menus suspensos de intervalo de capítulos (de/para).

## 3. Valores de `rend`

O campo `rend` orienta tanto a estilização CSS quanto a marcação de exportação:

| Valor de rend | Tratamento CSS | Tag de exportação |
|---|---|---|
| `book`, `nikaya`, `title` | centralizado, negrito grande | `<h1>` (atualmente não mapeado na exportação) |
| `chapter` | negrito colorido, quebra de página antes na impressão (page-break-before) | `<h2 class="seg chapter">` |
| `subhead` | negrito, margem superior | `<h3 class="seg subhead">` |
| `subsubhead` | itálico em negrito | `<p class="seg bodytext">` |
| `bodytext` (padrão) | parágrafo normal | `<p class="seg bodytext">` |
| `centre` | texto centralizado | `<p class="seg bodytext">` |
| `gatha*` | itálico, recuo de 2em | `<p class="seg bodytext">` |
| `hangnum` | recuo deslocado (hanging indent) de 1.4em | `<p class="seg hangnum">` |
| `indent` | estilo blockquote | `<blockquote class="seg indent">` |
| `footnote` | 0.82em, esmaecido | `<p class="seg footnote">` |
| `glossary` | termo de entrada em negrito | `<p class="seg bodytext">` |

## 4. HTML Inline no Campo `pali`

O corpus foi extraído de bancos de dados SQLite de origem, onde o texto Pāli era armazenado como pseudo-XML. `extract_data.py::clean_pali()` converte a marcação de origem em HTML seguro para navegadores antes de gravar os arquivos JSON. Tags presentes no corpus após a extração:

| Tag | Contagem no corpus | Origem | Renderização |
|---|---|---|---|
| `<b>text</b>` | 57.283 ocorrências | `<hi rend="bold">` na origem | Termos/palavras-chave em negrito |
| `<p rend="gathalast">text</p>` | 8.125 (em todos os valores de rend) | `<p rend="...">` na origem | Formatação de versos |
| `<sup class="var-note" data-note="N">[N]</sup>` | 873 | `<note>` na origem | Nota de rodapé de leitura variante |
| `<x_bin_42>` | 1 | Artefato de codificação desconhecido | Removido sem prejuízo |

**Nota crítica:** Estas são tags HTML genuínas incorporadas nos valores de string, e não entidades escapadas. Elas são renderizadas no navegador via `.innerHTML` e devem ser analisadas com `DOMParser` na exportação (não escapadas com `escHtml()`).

## 5. Arquivos de Chunks (Fragmentos)

Partes grandes são divididas em arquivos de chunk de aproximadamente 900 segmentos. O limite de divisão (chunking) é alinhado ao próximo segmento `chapter`, `book` ou `subhead` após o limiar de tamanho, garantindo que cada chunk comece em um limite de seção lógico. Há um arquivo de chunk por parte se a parte tiver ≤ 900 segmentos.

Nomenclatura de arquivos: `{partKey}__{chunkIndex}.json` (multi-chunk) ou `{partKey}.json` (chunk único).

O leitor armazena em cache os chunks carregados na memória; o módulo de exportação busca todos os chunks para a(s) parte(s) selecionada(s) sequencialmente antes de construir o documento de saída.

## 6. Obras em Detalhe

### Abhidhamma Piṭaka (grupo: `abhidhamma`)

Sete livros canônicos do Abhidhamma. Cada um possui mūla (texto-raiz) e tipicamente aṭṭhakathā (comentário), ṭīkā (subcomentário) e anuṭīkā (comentário adicional). Os segmentos de anuṭīkā para os livros 3–7 são armazenados em tabelas SQLite compartilhadas e diferenciados por `id_range` em `extract_data.py`.

| Obra | Partes | Notas |
|---|---|---|
| Dhammasaṅgaṇī | mūla · attha · ṭīkā · anuṭīkā | mūla em 3 chunks |
| Vibhaṅga | mūla · attha · ṭīkā | mūla em 4 chunks, ṭīkā em 3 chunks |
| Dhātukathā | mūla · attha · ṭīkā · anuṭīkā | Partes em arquivo único |
| Puggalapaññatti | mūla · attha · ṭīkā · anuṭīkā | Partes em arquivo único |
| Kathāvatthu | mūla · attha · ṭīkā · anuṭīkā | mūla em 4 chunks |
| Yamaka | mūla · attha · ṭīkā · anuṭīkā | mūla em 16 chunks (3 tabelas de origem unificadas) |
| Paṭṭhāna | mūla · attha · ṭīkā · anuṭīkā | mūla em 31 chunks (5 tabelas de origem), maior obra |

### Outros Textos Abhidhamma (grupo: `outros`)

Tratados pós-canônicos compostos dentro da tradição do Abhidhamma:

| Obra | Partes | Notas |
|---|---|---|
| Abhidhammāvatāra | mūla · ṭīkā | mūla em 10 chunks |
| Abhidhammatthasaṅgaha | mūla | 2 chunks |
| Abhidhammamātikā | mūla | 3 chunks |

### Visuddhimagga (grupo: `visuddhimagga`)

| Obra | Partes | Notas |
|---|---|---|
| Visuddhimagga | mūla · ṭīkā · nidānakathā | mūla em 5 chunks, ṭīkā em 4 chunks |

### Comentários Contemporâneos (grupo: `comentarios`)

Obras nas quais o campo `pali` contém o texto original em inglês (não Pāli):

| Obra | Partes | Notas |
|---|---|---|
| Abhidhamma in Daily Life | texto | 2 chunks; bilíngue EN/PT |

## 7. Bancos de Dados de Origem

`extract_data.py` lê de quatro arquivos SQLite (não commitados na pasta do site):

| Idioma | Arquivo DB | Coluna da tabela |
|---|---|---|
| Pāli | `tipitaka-roman-pali.db` | `pali_text` |
| Inglês | `english_tipitaka_translation_data-2026-04-28.db` | `english_translation` |
| Português | `portuguese_tipitaka_translation_data-2026-07-22.db` | `portuguese_translation` |
| Espanhol | `spanish_tipitaka_translation_data-2026-05-15.db` | `spanish_translation` |

Estes bancos de dados são armazenados fora da pasta do site e não são necessários para executar o site. Eles são necessários apenas para reexecutar `extract_data.py` se uma nova extração for requerida.

## 8. Índice de Busca

O índice de busca é um índice invertido do lado do cliente construído por `scripts/build_search_index.py`.

### Estrutura dos shards

```json
{
  "postings": { "dhamma": [0, 3, 7, ...], "dhammas": [1, 2, ...] },
  "segments": [
    { "workId": "dhammasangani", "partKey": "mula", "chunk": 0,
      "segId": 42, "snippet": "Katame dhammā kusalā..." },
    ...
  ]
}
```

50 shards indexados pelo primeiro caractere do token (`a`–`z`, caracteres acentuados, birmanês, devanāgarī e `misc`). Os tokens são caracteres de palavras Unicode com ≥ 3 caracteres. A lista de postagens de cada token é limitada a 30 entradas para evitar shards pesados na memória para palavras extremamente comuns.

### Prioridade da fonte do snippet: Pāli > PT > EN > ES

As tags HTML são removidas dos snippets via regex antes do armazenamento. Cada segmento aparece apenas uma vez por shard, independentemente de quantos tokens correspondam a ele (desduplicação pela identidade `(workId, partKey, chunk, segId)`).

## 9. Arquivos de Dicionário

### `pali_core.json`

Dicionário de múltiplos sentidos rigorosamente estruturado para os 721 lemas Pāli de maior frequência (cobrindo 65,23% das ocorrências de tokens do corpus a partir da fase 7). Construído a partir do Digital Pāli Dictionary (dpd-mobile.db, CC BY-NC-SA 4.0) com traduções manuais em PT/ES.

```json
{
  "meta": { "version": 1, "stage": 7, "pct_covered": 65.23, "count": 721, ... },
  "roots": { "√dhā": { "en": "...", "pt": "...", "es": "...", "sanskrit": "dhā" }, ... },
  "entries": [
    {
      "h": "dhamma",
      "freq": 46038,
      "pct": 2.45,
      "usage": "...",
      "senses": [
        { "id": "1.01", "pos": "masc", "grammar": "nom. sg.", "root": "√dhā", "en": "...", "pt": "...", "es": "...", "syn": "...", "ant": "..." }
      ]
    }
  ]
}
```

### `common_pali.json`

Dicionário simples de sentido único com 182 palavras gerais em Pāli não cobertas pelo `pali_core.json` (desduplicadas no momento do carregamento pelo módulo `dictionary.ts`).

```json
{
  "meta": { "version": 1, "language": ["pt","en","es"], "source": "...", "count": 182 },
  "entries": [
    { "h": "rūpa", "pos": "n.", "en": "...", "pt": "...", "es": "...", "usage": "...", "freq": 0 }
  ]
}
```

O módulo `dictionary.ts` carrega `pali_core.json` primeiro, cria um `Set` de suas palavras-guia (headwords) e, em seguida, filtra as entradas de `common_pali.json` para excluir qualquer sobreposição, garantindo que as entradas principais sempre tenham precedência.

### `vocabulary_blocks.md`

Um documento de referência filológica com 10 blocos terminológicos cobrindo: dhamma, kamma, nibbāna, jhāna, saṃsāra, cetasika, dhammadhātu, psíquico, estado, kusala/akusala. Este arquivo é uma referência legível por humanos para tradutores; não é carregado pela aplicação.
