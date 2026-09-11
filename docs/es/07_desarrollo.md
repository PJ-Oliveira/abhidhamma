# Desarrollo

## 1. Prerrequisitos

- Node.js ≥ 18
- npm ≥ 9
- Python 3 (para `scripts/version_js.py`)

---

## 2. Scripts npm

| Script | Comando | Descripción |
|---|---|---|
| `test` | `vitest run` | Corre todas las pruebas unitarias una vez |
| `build` | `tsc && python3 scripts/version_js.py` | Compila TypeScript + agrega hash de versión |
| `deploy` | `build + git push` | Build completo y publicación |
| `watch` | `tsc --watch` | Recompilación incremental |
| `integrate-books` | `python3 scripts/integrate_books.py` | Integra nuevos textos en el corpus |
| `rebuild-search` | `python3 scripts/build_search_index.py` | Reconstruye el índice de búsqueda fragmentado |

---

## 3. Pipeline de Build

```
src/*.ts
  │
  ▼ tsc (tsconfig.json: target=ES2022, module=ESNext, outDir=js)
  │
js/*.js (módulos ES sin versionamiento)
  │
  ▼ python3 scripts/version_js.py
  │   - calcula MD5 de todos los js/*.js
  │   - reescribe imports relativos en todos los .js para agregar ?v={hash}
  │   - actualiza la etiqueta <script src="js/app.js?v={hash}"> en index.html
  │
js/*.js?v={hash} + index.html actualizado
```

---

## 4. Configuración TypeScript

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

## 5. Pruebas (Vitest 4)

**Ubicación:** `tests/` con entorno jsdom.

**Ejecutar:**
```bash
npm test
```

**Cobertura:**
```bash
npx vitest run --coverage
```

### Módulos Probados

| Archivo de prueba | Cubre |
|---|---|
| `srs.spec.ts` | Algoritmo SM-2, cola de tarjetas, límites diarios |
| `dictionary.spec.ts` | `normalizePali`, lookup de 4 fases |
| `search.spec.ts` | Carga de fragmentos, coincidencia exacta/prefijo |
| `state.spec.ts` | Persistencia localStorage, deduplicación de historial |
| `export.spec.ts` | `crc32`, generación de manifiesto EPUB, serialización de HTML |
| `i18n.spec.ts` | `t()` con todos los idiomas, fallback |
| `kathavatthu_logic.spec.ts` | `evaluateCustomClaim`, `evaluateScenario` |
| `reader.spec.ts` | `renderSegments`, manejo de rend |

---

## 6. Agregando un Nuevo Texto

1. Prepare fragmentos JSON: arrays `Segment[]` en `data/works/{id}/`.
2. Agregue entrada en `data/manifest.json` bajo el grupo correcto.
3. Ejecute `npm run rebuild-search` para agregar el nuevo texto al índice de búsqueda.
4. (Opcional) Ejecute `npm run integrate-books` si usa el script de integración de pipeline.

---

## 7. Agregando una Nueva Herramienta

1. Cree `src/tools/mytool.ts` exportando `init(container: HTMLElement)`.
2. Agregue al array `TABS` en `src/tools/tools.ts`:
   ```typescript
   { id: "mytool", label: "Mi Herramienta", init: () => import("./mytool.js").then(m => m.init) }
   ```
3. Cree archivo de datos JSON en `data/tools/mytool.json` si es necesario.

---

## 8. Agregando Strings de UI

En `src/i18n.ts`, agregue la nueva clave al objeto `STRINGS` para `pt`, `en` y `es`:

```typescript
const STRINGS = {
  pt: { ..., myKey: "Meu Texto" },
  en: { ..., myKey: "My Text" },
  es: { ..., myKey: "Mi Texto" },
}
```

Use con `t("myKey", state.settings.uiLang)`.

---

## 9. Actualización del Service Worker

Al hacer push de nuevos activos del corpus, incremente `CACHE_NAME` en `service-worker.js`:

```javascript
const CACHE_NAME = 'abhidhamma-cache-v9';  // era v8
```

Esto invalida el caché del cliente y fuerza una nueva instalación.

**Nota:** Asegúrese de que `CORE_ASSETS` incluya los archivos JS versionados (con sufijo `?v={hash}`) — vea BUG-001 en los docs de bugs.

---

## 10. Estructura de Directorios del Código Fuente

```
src/
  app.ts              Punto de entrada principal y enrutamiento
  types.ts            Interfaces TypeScript compartidas
  i18n.ts             Strings de UI trilingüe
  state.ts            Persistencia localStorage
  logger.ts           Logger utilitario
  reader.ts           Renderización de fragmentos/segmentos
  dictionary.ts       Diccionario Pāli y normalización
  search.ts           Búsqueda por índice invertido
  srs.ts              Repetición Espaciada (SM-2)
  tree.ts             Árbol de navegación de obras
  selection.ts        Popover de selección de texto
  export.ts           Exportación PDF/EPUB
  tools/
    tools.ts          Administrador de pestañas de herramientas
    mindmap.ts        Mapa mental SVG
    patthana.ts       Visualización Paṭṭhāna
    vithi.ts          Animación Citta-Vīthi
    matikas.ts        Tríadas/díadas de la Mātikā
    cetasika.ts       Mapeo Citta-Cetasika
  ai-feature/
    ui.ts             UI del Simulador de Debate
    debate-scenarios.ts  Escenarios canónicos
  ontology/
    kathavatthu_logic.ts  Motor lógico de debate
```

---

## 11. Deploy

El proyecto está hospedado como sitio de archivos estáticos (GitHub Pages). `.nojekyll` en la raíz deshabilita el procesamiento Jekyll. El deploy se realiza por el script `deploy` (build + git push a la rama gh-pages o main, dependiendo de la configuración del repositorio).

No hay servidor backend; no se requieren variables de entorno en runtime.
