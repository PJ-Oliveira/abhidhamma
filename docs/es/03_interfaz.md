# Interfaz de Usuario

## 1. Layout General

```
┌─────────┬──────────────────────┬───┬────────────────────────────────────┐
│ #icon-  │   #side-panel        │ R │  main#reader                       │
│  rail   │  (panel activo)      │ E │                                    │
│ 56–76px │  240–320px           │ D │  #reader-header                    │
│         │                      │ I │    #breadcrumb                     │
│ [☰]     │  panel-tipitaka:     │ M │    #part-tabs   #chapter-nav       │
│ [📖]   │    Árbol de obras    │ E │                                    │
│ [⏱]   │  panel-dictionary:   │ N │  #content                          │
│ [🔍]   │    Búsqueda en dict. │ S │    .seg × N                        │
│ [⚙]   │  panel-history:      │ I │      .pali-line                    │
│ [⬇]   │    Historial+Favor.  │ O │      .translation-line             │
│ [🧠]   │  panel-search:       │ N │                                    │
│ [🔬]   │    Búsqueda completa │ A │  #toc-nav  [‹] [1/N] [›]          │
│         │  panel-settings:     │ D │                                    │
│         │    Idioma/Fuente/etc │ O │  #reader-srs  (overlay SRS)       │
│         │  panel-export:       │ R │  #reader-tools (overlay Herramientas)|
│         │    Export PDF/EPUB   │   │                                    │
│         │  panel-srs:          │   │  [💬 Debate]  (botón flotante)   │
│         │    Atajo SRS         │   │                                    │
│         │  panel-tools:        │   │                                    │
│         │    Atajo Herramientas│   │                                    │
└─────────┴──────────────────────┴───┴────────────────────────────────────┘
```

---

## 2. Rail de Íconos (#icon-rail)

Ocho botones de navegación, cada uno con `data-panel="{id}"`:

| Ícono | Panel | Función |
|---|---|---|
| ☰ | tipitaka | Navegar obras |
| 📖 (SVG) | dictionary | Diccionario Pāli |
| ⏱ | history | Historial + favoritos |
| 🔍 | search | Búsqueda de texto completo |
| ⚙ | settings | Configuraciones |
| ⬇ | export | Exportar (PDF/EPUB) |
| 🧠 | srs | Memorización Pāli |
| 🔬 | tools | Herramientas Abhidhamma |

**Comportamiento al hacer clic:**
- Si el panel del botón ya está activo Y el panel lateral está expandido → colapsa el panel.
- De lo contrario → cambia al panel + expande (excepto SRS/Tools en mobile, que van a pantalla completa).

---

## 3. Panel Lateral (#side-panel)

Solo un hijo `.panel` está activo a la vez (`class="panel active"`). Los paneles `srs` y `tools` muestran solo un marcador "Visualizando en el panel principal →" — el contenido real está en los overlays del reader.

### Colapsar / Expandir

- `collapseBtn` (‹/›) alterna el colapso.
- Al colapsar: guarda el ancho actual en `localStorage("panelW")`, define `--panel-w: 0px` después de la transición CSS de 160 ms.
- Al expandir: restaura el ancho guardado (mín. 120 px, máx. 450 px).

### Redimensionar

`#panel-resizer` es una columna de 8 px arrastrable. `mousedown` inicia el redimensionamiento; `mousemove` define `--panel-w`; `mouseup` guarda el nuevo ancho. Colapsa a 0 si se arrastra por debajo de 60 px.

---

## 4. Lector (main#reader)

### Cabecera

```
[‹]  Breadcrumb: "Abhidhamma Piṭaka › Dhammasaṅgaṇī"
     [Mūla] [Aṭṭhakathā] ...   [navegación de capítulos ▾]
```

- **Breadcrumb**: título del grupo + título de la obra.
- **Pestañas de partes**: un botón por clave de parte; hacer clic carga el fragmento 0 de esa parte.
- **Navegación de capítulos**: desplegable que lista las entradas TOC `rend=chapter`; hacer clic desplaza hasta y hace parpadear ese segmento.

### Área de Contenido (#content)

Cada segmento se renderiza como:

```html
<div class="seg" data-rend="{rend}" data-seg-id="{id}" data-pali="{texto}">
  <div class="pali-line">
    [badge paranum]  texto pali (innerHTML)  [☆ botón favorito]
  </div>
  <div class="translation-line">
    texto de traducción (innerHTML)
  </div>
</div>
```

Clases CSS agregadas según las configuraciones:
- `.no-pali` → oculta `.pali-line`
- `.no-translation` → oculta `.translation-line`

### Navegación de Fragmentos (#toc-nav)

Botones Anterior/Siguiente y un indicador `{actual} / {total}` en la parte inferior del lector.

---

## 5. Popover de Selección (#selection-popover)

Aparece cuando el usuario selecciona texto (o toca una palabra en mobile) dentro de `.pali-line` o `.translation-line`.

Contenido:
- **Cabecera**: etiqueta ("↔ Traducción" o "↔ Pāli") + botón copiar enlace + botón cerrar.
- **Texto contraparte**: si el usuario seleccionó Pāli → muestra traducción; si seleccionó traducción → muestra Pāli.
- **Sección de diccionario** (solo selecciones Pāli): hasta 3 palabras buscadas; primer resultado mostrado inline.

---

## 6. Tooltip de Notas (#note-tooltip)

Las notas de variantes de lectura (elementos superscript `.var-note` dentro del texto Pāli) muestran un tooltip flotante en `mouseenter` con el texto de la nota. Sigue la posición del cursor.

---

## 7. Panel de Configuraciones

| Control | Efecto |
|---|---|
| Selector de idioma | Cambia `translationLang` + `uiLang`; re-renderiza contenido y strings de UI |
| Botones A− / A+ | Cambia `fontSize` (12–28 px); actualiza variable CSS `--font-scale` |
| Checkbox Mostrar Pāli | Alterna clase `.no-pali` en todos los elementos `.seg` |
| Checkbox Mostrar traducción | Alterna `.no-translation` |
| Botón Instalar App | Mostrado cuando `beforeinstallprompt` dispara (instalación PWA) |

---

## 8. Overlays en Pantalla Completa (SRS y Herramientas)

Cuando el botón SRS o Herramientas del rail está activo, el lector principal se oculta (`display:none`) y el overlay correspondiente (`#reader-srs` o `#reader-tools`) se muestra como `display:flex`.

---

## 9. Simulador de Debate (flotante)

Un botón fijo `💬 Debate` en la esquina inferior derecha importa lazily `ai-feature/ui.js` en el primer clic y muestra el panel `#interlocutor-container` (flotante, desplazable, `z-index: 10001`).

---

## 10. Comportamiento Mobile (≤ 860px)

- Las etiquetas del rail se ocultan (solo íconos).
- El panel lateral colapsa automáticamente cuando se selecciona un texto.
- SRS y Tools colapsan el panel y van a pantalla completa.
- Toque para definir: tocar una palabra en el lector activa el popover de selección usando `document.caretRangeFromPoint`.
- `user-scalable=0` en el viewport meta previene el zoom accidental.
