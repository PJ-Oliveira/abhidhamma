# 05 — Correções Filológicas

## Diretriz Absoluta

> **"Jamais traduza o termo dhamma como 'fenômeno'"**

Esta é uma diretriz operativa irrevogável. `dhamma` (Pāli) = paramattha-dhamma = uma realidade última discreta e irredutível. NUNCA deve ser vertido como "fenômeno" (português) ou "fenómeno" (espanhol) em traduções, entradas de dicionário, textos da interface do usuário (UI) ou documentação. A palavra de origem grega "fenômeno" carrega a conotação de uma aparência ou manifestação na consciência — o oposto do significado ontológico no Abhidhamma.

---

## 1. Escopo do Trabalho Concluído

### 1a. Correções em Nível de Corpus (~25.470 segmentos)

Uma varredura sistemática foi realizada em todos os 91.065 segmentos em `data/works/`. Cada ocorrência em português de `fenômeno`/`fenômenos` e em espanhol de `fenómeno`/`fenómenos` usada como tradução de `dhamma` foi substituída pelo equivalente correto:

- `fenômeno(s)` → `dhamma(s)` (ao traduzir conceitos de dhamma)
- `fenómeno(s)` → `dhamma(s)` (equivalentes em espanhol)

**Segmentos afetados por obra:**

| Obra | Segmentos corrigidos (aprox.) |
|---|---|
| Dhammasaṅgaṇī | ~3.200 |
| Vibhaṅga | ~4.100 |
| Dhātukathā | ~500 |
| Puggalapaññatti | ~600 |
| Kathāvatthu | ~2.800 |
| Yamaka | ~6.000 |
| Paṭṭhāna | ~7.200 |
| Abhidhammāvatāra | ~800 |
| Visuddhimagga | ~270 |
| Outros | ~residual |
| **Total** | **~25.470** |

### 1b. Anomalia de Dados Corrigida

**Arquivo:** `data/works/yamaka/mula__9.json`, segmento `id: 174`

**Problema:** Artefato corrompido de entidade HTML. O texto original era `fenômenos &amp; dhammas indeterminados` onde `&amp;` havia sido parcialmente consumido, produzindo a string `fenômenosamp;`.

**Correção:** Campo pt do segmento reescrito para: `"Os dhammas indeterminados são tanto dhammas quanto dhammas indeterminados."` (correspondendo ao Pāli `dhammā ceva abyākatā dhammā ca`).

---

## 2. Correções no Dicionário — `pali_core.json`

721 entradas auditadas. 22 ocorrências de "fenômeno" encontradas e corrigidas.

### Entrada `dhamma`

| Campo | Antes | Depois |
|---|---|---|
| `usage` | continha "fenômenos analisados" | Reescrito para: "O termo-chave do Abhidhamma. Paramattha-dhamma = realidade última discreta e irredutível. NÃO deve ser traduzido como 'fenômeno'..." |
| sentido 1.04 `pt` | "fenômenos mentais; pensamentos" | "dhammas mentais; objetos mentais" |
| sentido 1.06 `pt` | "matéria; coisa; fenômeno" | "matéria; coisa; entidade discreta" |

**Uma ocorrência intencional permanece:** O campo `usage` agora contém "NÃO deve ser traduzido como 'fenômeno'" — esta única ocorrência de instrução negativa está correta e não deve ser excluída.

### Entrada `kamma`

| Campo | Antes | Depois |
|---|---|---|
| `usage` | continha `"o \"karma\""` | Nota adicionada de que "kamma" é sempre o correto; "karma" é o cognato em sânscrito |
| sentido 1 `pt` | "(carma)" | Parênteses removidos |
| sentido 1 `es` | "(karma)" | Parênteses removidos |

### Entrada `akusala`

| Campo | Antes | Depois |
|---|---|---|
| sentido 1 `pt` | "(de pessoa ou animal) inábil; incompetente; inexperiente" | "(Abhidhamma) moralmente insalubre; kammicamente improfícuo — qualifica dhammas (cittas e cetasikas) com raiz na avidez, aversão ou ilusão; oposto de kusala…" |

### Entrada `dhammāyatana`

| Campo | Antes | Depois |
|---|---|---|
| `usage` | "fenômenos mentais..." | "dhammas..." |
| sentidos `pt` | "fenômenos mentais" | "dhammas" |

### Entrada `nevavipākanavipākadhammadhamma`

| Campo | Antes | Depois |
|---|---|---|
| `usage` | "fenômeno nem resultante..." | "dhamma nem resultante..." |
| sentido 1 `pt` | "fenômeno" | "dhamma" |

### Nove campos de uso adicionais

As seguintes entradas tinham "fenômenos"/"fenômeno" em seu campo `usage`:

`paccaya`, `paññā`, `upanissayapaccaya`, `pavatti`, `pavattati`, `moha`, `aññamañña`, `nirujjhi`, `vipassanā`

Todas corrigidas: "fenômenos" → "dhammas", "fenômeno" → "dhamma".

---

## 3. Correções no Dicionário — `common_pali.json`

182 entradas auditadas. 5 ocorrências corrigidas.

| Entrada | Campo | Antes | Depois |
|---|---|---|---|
| `dhamma` | `pt` | "fenômeno; estado mental/físico..." | "realidade última discreta (paramattha-dhamma); estado mental/físico..." |
| `dhamma` | `usage` | "fenômenos analisados" | "Nunca traduzir como 'fenômeno'. Dhamma = paramattha-dhamma..." |
| `rūpa` | `pt` | "fenômeno físico" | "rūpa" |
| `dhammāyatana` | `usage` | "sutis fenômenos mentais" | "dhammas sutis" |
| `paccaya` | `usage` | "entre os fenômenos" | "entre os dhammas" |

---

## 4. Reconstrução do Índice de Busca

Após todas as correções no corpus e nos dicionários, `scripts/build_search_index.py` foi reexecutado do zero.

**Verificação:** Todos os 50 arquivos shard foram verificados quanto a resíduos de `fenômeno`/`fenômenos` em português. Resultado: **0 ocorrências** em campos em português. Entradas em espanhol de `fenómeno`/`fenómenos` permanecem (correto: são traduções em espanhol).

---

## 5. Referência de Vocabulário Criada

`data/dictionary/vocabulary_blocks.md` foi criado como um documento de referência filológica. Contém 10 blocos terminológicos:

1. **dhamma** — ontologia de paramattha-dhamma, por que "fenômeno" está incorreto
2. **kamma** — forma Pāli vs. Sânscrito, ação intencional
3. **nibbāna** — cessação, não aniquilação
4. **jhāna** — absorção meditativa, não "contemplação"
5. **saṃsāra** — ciclo de existência condicionada
6. **cetasika** — fator mental, concomitante de citta
7. **dhammadhātu** — o elemento-dhamma (18º āyatana)
8. **psíquico** — termo problemático; dependente de contexto
9. **estado** — problemático quando usado para dhamma; aceitável para avasthā/bhāva
10. **kusala/akusala** — kammicamente salutar/insalubre (não "habilidoso")

---

## 6. Trabalho Filológico Pendente

### "psíquico" — 323 instâncias

Um levantamento encontrou 323 ocorrências de "psíquico/psíquica" em todo o corpus de tradução em PT. Estas não podem ser substituídas em lote porque:
- Algumas estão corretas (ex.: "sofrimento psíquico" = sofrimento psicológico — aceitável)
- Algumas são problemáticas (ex.: "fenômeno psíquico" como tradução de nāmadhamma)
- É necessária uma revisão contexto a contexto

**Status:** Não iniciado. Requer revisão manual de cada instância.

### "estado" usado para `dhamma`

Algumas instâncias de "estado" parecem traduzir `dhamma` em contextos onde "dhamma" deveria ser mantido sem tradução ou vertido de forma diferente. Um subconjunto foi capturado pela etapa de correção em lote, mas casos limítrofes onde "estado" legitimamente traduz `bhāva` ou `avasthā` foram preservados.

**Status:** Parcialmente abordado. Nenhuma auditoria sistemática de casos limítrofes foi realizada.
