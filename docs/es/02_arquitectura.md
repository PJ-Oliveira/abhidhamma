# Arquitectura

## 1. Grafo de Módulos

```
index.html
  └── js/app.js  (punto de entrada)
        ├── i18n.js           — Strings de UI (PT/EN/ES)
        ├── state.js          — Persistencia localStorage
        │     └── logger.js
        ├── tree.js           — Renderización del árbol de navegación
        ├── reader.js         — Carga de fragmentos + renderización de segmentos
        ├── dictionary.js     — Búsqueda en diccionario Pāli (normalización morfológica)
        ├── search.js         — Búsqueda por índice invertido fragmentado
        ├── export.js         — Constructor de PDF / EPUB 3
        ├── srs.js            — Repetición Espaciada (SM-2)
        ├── selection.js      — Popover de selección de texto + copiar enlace
        ├── tools/tools.js    — Administrador de pestañas del panel de herramientas
        │     ├── tools/mindmap.js
        │     ├── tools/patthana.js
        │     ├── tools/vithi.js
        │     ├── tools/matikas.js
        │     └── tools/cetasika.js
        └── ai-feature/ui.js  — Simulador de Debate (carga lazy)
              ├── debate-scenarios.js
              └── ontology/kathavatthu_logic.js
```

Sin dependencias circulares. `logger.ts` y `types.ts` son hojas puras.

---

## 2. Layout CSS

```css
#app {
  display: grid;
  grid-template-columns: var(--rail-w) var(--panel-w) 8px 1fr;
  height: 100vh;
}
```

Cuatro columnas:
1. `#icon-rail` — clamp(56–76 px) — íconos de navegación
2. `#side-panel` — clamp(240–320 px), redimensionable via arrastrar `#panel-resizer` — paneles de contenido
3. `#panel-resizer` — 8 px de manija de arrastre
4. `main#reader` — resto — contenido de texto

Breakpoint responsivo en `max-width: 860px`: el panel se convierte en overlay fijo; las etiquetas del rail se ocultan.

---

## 3. Enrutamiento via URL

Basado en hash. Formato: `#/{panel}/{workId}/{partKey}/{chunkIndex}?seg={id}&q={query}`

```
#/tipitaka/dhammasangani/mula/0
#/dictionary?q=citta
#/tools/vithi
#/search
```

`parseHash()` en `app.ts` analiza el hash en un objeto `Route { panel, workId, partKey, chunkIndex, segId, q }`. En el evento `hashchange`, el enrutador llama `switchPanel()` y/o `selectWork()` según sea necesario.

---

## 4. Gestión de Estado

Todo el estado vive en `state.ts` (singleton a nivel de módulo):

```typescript
export const settings: Settings
export function getHistory(): HistoryEntry[]
export function pushHistory(entry): void
export function getBookmarks(): BookmarkEntry[]
export function toggleBookmark(entry): boolean
export function isBookmarked(workId, partKey, segId): boolean
```

Tres claves localStorage versionadas:

| Clave | Tipo | Límite |
|---|---|---|
| `atp.settings.v1` | `Settings` | objeto único |
| `atp.history.v1` | `HistoryEntry[]` | 50 entradas, dedup FIFO |
| `atp.bookmarks.v1` | `BookmarkEntry[]` | ilimitado |

Configuración predeterminada: `{ translationLang: "en", uiLang: "en", fontSize: 17, showPali: true, showTranslation: true }`

---

## 5. Estrategia de Carga de Datos

| Recurso | Cuándo se carga | Caché |
|---|---|---|
| `data/manifest.json` | Init de la app (falla fatal si falla) | `AppState.manifest` |
| `data/works/{id}/{file}` | En cada `selectWork()` | `Map<string, Segment[]>` en `reader.ts` |
| `data/search/manifest.json` | Al inicializar el panel de búsqueda | `shardManifest` a nivel de módulo |
| `data/search/shard_{ch}.json` | En la primera consulta con ese carácter | `Map<string, SearchShard>` en `search.ts` |
| `data/dictionary/pali_core.json` | En el primer evento de input del dict | `coreData[]` en `dictionary.ts` |
| `data/dictionary/common_pali.json` | Misma promesa de carga | `dictData[]` en `dictionary.ts` |

Todos los cachés de datos son en memoria y viven durante la sesión del navegador.

---

## 6. Pipeline de Build

```
src/*.ts  →[tsc]→  js/*.js  →[version_js.py]→  js/*.js?v={hash}
                              (reescribe imports + tag script de index.html)
```

`version_js.py` calcula MD5 sobre todos los archivos `js/*.js`, toma los primeros 8 caracteres hex e inyecta `?v={hash}` en cada import de módulo ES y en la etiqueta `<script>` de `index.html`.

---

## 7. Service Worker / PWA

`service-worker.js` implementa estrategia cache-first:

1. En `install`: almacena en caché el **app shell** (HTML, CSS, fuentes, JS, manifest, diccionario).
2. Después de 10 s de delay: **pre-almacena todos los fragmentos del corpus** (~140 MB, lote de 3 archivos) para lectura offline completa.
3. En `fetch`: intenta el caché primero; cae a la red; almacena en caché las nuevas respuestas exitosas.

---

## 8. Internacionalización (i18n)

`i18n.ts` exporta una única función:

```typescript
export function t(key: string, uiLang: UiLang): string
```

Todas las strings son constantes estáticas en tiempo de compilación en un objeto `STRINGS: Record<UiLang, Strings>`. Cadena de fallback: `STRINGS[uiLang][key]` → `STRINGS.en[key]` → clave.

`uiLang` (idioma de la interfaz) y `translationLang` (idioma del contenido) se almacenan separadamente pero se mantienen sincronizados por `applySettingsToUI()`.

---

## 9. Obras Bilingües ("Comentarios")

Las obras en el grupo `"comentarios"` usan un layout de datos diferente:
- campo `pali` almacena el **texto original en inglés** (no Pāli)
- campo `pt` almacena la **traducción al portugués**

Cuando se selecciona tal obra:
- `showPali` se fuerza como `true` (para que la columna "Pāli"/inglés original sea visible)
- `effectiveLang: "pt"` se pasa a `renderSegments`, reemplazando `translationLang`
- Las etiquetas de configuración cambian a "Mostrar inglés (original)" / "Mostrar portugués"
