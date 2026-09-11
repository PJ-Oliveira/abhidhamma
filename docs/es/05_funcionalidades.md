# Funcionalidades

## 1. Lector de Textos

El lector (`reader.ts`) carga y muestra segmentos Pāli + traducción alineados.

**Flujo de carga:**
1. `selectWork(workId, partKey, chunkIndex)` es llamado.
2. `loadChunk()` busca el JSON del fragmento; resultado almacenado en caché en memoria.
3. `renderSegments()` limpia el DOM y lo reconstruye.
4. Si se solicitó un `segId` (desde favorito o resultado de búsqueda), el segmento objetivo se desplaza a la vista y parpadea.

---

## 2. Árbol de Navegación

`tree.ts` renderiza un árbol UL expandible desde el manifest. Los grupos aparecen como encabezados en mayúsculas; las obras se expanden para mostrar partes; hacer clic en una hoja de parte llama a `selectWork(workId, partKey, 0)`.

`markActiveLeaf()` agrega `.leaf-active` a la parte mostrada actualmente y abre sus nodos padre.

---

## 3. Diccionario Pāli

`dictionary.ts` provee `lookupPali(word)` y la UI del panel de diccionario.

**Comportamiento del panel:**
- Inicia la carga en el primer evento de `input` (promesa compartida única).
- Conforme el usuario escribe, todas las palabras cabecera que comienzan con la consulta se muestran.
- Resultados ordenados por frecuencia (más común primero).
- Muestra: palabra cabecera, frecuencia, clase gramatical, todos los sentidos con gramática/raíz/sinónimos/antónimos.

**Búsqueda en el popover:** cuando se selecciona texto en el lector, `lookupPali` es llamado para hasta 3 palabras; el primer resultado se muestra inline en el popover de selección.

---

## 4. Búsqueda de Texto Completo

`search.ts` implementa un índice invertido fragmentado del lado del cliente.

- Input con debounce (250 ms).
- Carga el manifest de fragmentos al inicializar el panel, luego carga fragmentos lazily por consulta.
- Retorna hasta 50 resultados como tarjetas de snippet; hacer clic en un resultado abre ese fragmento y se desplaza hasta el segmento.

---

## 5. Historial y Favoritos

**Historial** (`pushHistory`):
- Cada llamada a `selectWork()` agrega una entrada.
- Deduplicación: la entrada existente para el mismo `workId/partKey/chunk` se elimina antes del prepend.
- Límite: 50 entradas.

**Favoritos** (`toggleBookmark`):
- Botón ☆/★ en cada línea Pāli del segmento.
- Almacena `{ workId, partKey, segId, chunk, snippet }`.
- Hacer clic en un favorito abre el fragmento y se desplaza hasta el segmento.

---

## 6. Exportación

`export.ts` provee exportación PDF y EPUB para cualquier obra o el corpus completo.

### PDF de Obra Única

`buildPrintHtml()` crea HTML de página completa con CSS de impresión y llamada `window.print()`. Abierto en nueva ventana. Si los pop-ups están bloqueados, el archivo HTML se descarga.

### EPUB de Obra Única

`buildEpub()` crea un EPUB 3 mínimo (ZIP) con:
- `mimetype` (sin compresión)
- `META-INF/container.xml`
- `OEBPS/content.opf` (paquete OPF)
- `OEBPS/toc.ncx` (navegación NCX)
- `OEBPS/style.css` (fuente Gentium + layout)
- `OEBPS/content.html` (todos los segmentos convertidos a HTML)

### EPUB del Corpus Completo

`buildFullCorpusEpub()` busca todos los fragmentos de todas las obras, construye archivos XHTML por obra, NCX jerárquico y `nav.xhtml` EPUB3, y apéndice de glosario. Las fuentes se buscan e incluyen. Los mensajes de progreso se muestran durante el build.

### Modos de Idioma (`LangMode`)

| Valor | Columnas incluidas |
|---|---|
| `en` | Solo inglés |
| `pali+en` | Pāli + inglés |
| `pali+en+pt` | Pāli + inglés + portugués |
| `pt` | Solo portugués |
| `pali+pt` | Pāli + portugués |
| `es` | Solo español |
| `pali+es` | Pāli + español |
| `pali+en+es` | Pāli + inglés + español |

---

## 7. Sistema de Repetición Espaciada (SRS)

`srs.ts` implementa un sistema de flashcards usando el **algoritmo SM-2**.

**Cola de tarjetas:** tarjetas debidas (nextReview ≤ ahora) primero, luego nuevas tarjetas ordenadas por rank. Límite diario: 20 tarjetas.

**Atajos de teclado** (cuando el panel SRS está activo):
- Espacio / Enter → voltear tarjeta
- 1 → De nuevo (calidad 0)
- 2 → Difícil (calidad 3)
- 3 → Bien (calidad 4)
- 4 → Fácil (calidad 5)

**Persistencia:** estados de las tarjetas guardados en `atp.srs.v1`; estadísticas en `atp.srs.stats.v1` en localStorage.

---

## 8. Herramientas Abhidhamma

El panel de herramientas (`tools/tools.ts`) es un administrador de pestañas que inicializa lazily cada submódulo en la primera activación.

### Mapa Mental (`tools/mindmap.ts`)

Mapa mental jerárquico en SVG de los conceptos Abhidhamma. Buscable por texto del nodo.

### Paṭṭhāna (`tools/patthana.ts`)

Visualización interactiva de las 24 relaciones condicionales (paccaya) del Paṭṭhāna.

### Citta-Vīthi (`tools/vithi.ts`)

Visualización animada del proceso de consciencia (citta-vīthi). Muestra la secuencia de momentos de consciencia (bhavaṅga → manodvāravajjana → javana × 7 → tadārammaṇa) para diferentes puertas de los sentidos. Busca `data/tools/vithi.json` y `data/tools/citta_cetasika.json`.

### Mātikās (`tools/matikas.ts`)

Listas buscables de las tríadas (tikas) y díadas (dukas) de la matriz del Dhammasaṅgaṇī.

### Cetasika (`tools/cetasika.ts`)

Dos modos:
- **Análisis individual:** seleccionar un citta → ver todos los cetasikas asociados.
- **Comparación:** seleccionar dos cittas → ver cetasikas comunes, exclusivos de A y exclusivos de B.

---

## 9. Simulador de Debate (Recurso de IA)

`ai-feature/ui.ts` + `ai-feature/debate-scenarios.ts` + `ontology/kathavatthu_logic.ts`

Un simulador de debate basado en reglas (sin LLM) modelado en el formato de debate de la Kathāvatthu.

**Flujo:**
1. El usuario selecciona un escenario de `CanonicalScenarios` (proposiciones codificadas de escuelas históricas).
2. El texto de la afirmación se muestra.
3. El usuario hace clic en "Enviar Argumento".
4. `evaluateScenario(scenarioId, uiLang)` retorna una refutación estructurada con: veredicto, contexto lógico, regla meta-lógica, paradoja reductio ad absurdum, silogismo formal, analogía pedagógica.
5. El botón "Profundizar" revela el análisis pedagógico.

La dependencia `@mlc-ai/web-llm` está presente pero aún no conectada al simulador de debate.
