# Bugs y Problemas Conocidos

Bugs identificados por análisis estático del código fuente. Ninguno fue confirmado por ejecución en runtime.

---

## BUG-001 — Service Worker: Cache Miss en el App Shell (ALTA)

**Archivo:** `service-worker.js`

**Problema:** `CORE_ASSETS` lista `./js/app.js` sin el sufijo `?v={hash}`. El archivo real servido por `index.html` es `./js/app.js?v=c1e87eca`. El Service Worker no encontrará el app JS en el caché, causando fallback de red y falla de inicialización offline.

**Impacto:** La app no inicializa offline. Los usuarios que abren la app sin red reciben error.

**Corrección:** Asegurarse de que `CORE_ASSETS` incluya la URL versionada, o usar la API `Cache.add()` que sigue redirecciones, o mantener un archivo de manifiesto de versión separado para que el service worker pueda construir la URL correcta.

---

## BUG-002 — SRS: Atajos de Teclado No Funcionan

**Archivo:** `src/srs.ts`

**Problema:** El listener de teclado está adjunto a `container` (el div del panel), pero usa `container.closest(".panel")` para verificación de foco. Ese método retorna null porque `.panel` es un ancestro, no un descendiente. El resultado es que los atajos (Space/Enter/1-4) nunca se disparan.

**Impacto:** Los usuarios deben hacer clic en los botones de evaluación manualmente; ninguna funcionalidad de teclado funciona en el panel SRS.

**Corrección:** Cambie el listener a `document.addEventListener("keydown", ...)` con una verificación de que el panel SRS está activo, o corrija la lógica `closest` para verificar si el panel SRS está activo via `AppState`.

---

## BUG-003 — SRS: Archivo de Vocabulario Faltante

**Archivo:** `src/srs.ts` (línea de carga de datos)

**Problema:** `srs.ts` intenta buscar `data/srs/vocabulary.json`. Ese archivo no existe en el repositorio.

**Impacto:** El panel SRS falla silenciosamente al cargar (error de red), mostrando sin tarjetas.

**Corrección:** Crear `data/srs/vocabulary.json` con datos de vocabulario Pāli, o cambiar el SRS para generar tarjetas dinámicamente desde el corpus del diccionario.

---

## BUG-004 — app.ts: Rama Muerta en `parseHash()`

**Archivo:** `src/app.ts`

**Problema:** `parseHash()` tiene una rama `if (parts[0] === "tipitaka")` que verifica el primer segmento del hash. Sin embargo, el `window.location.hash` siempre comienza con `#`, y el análisis divide por `/` después de eliminar `#` — por tanto `parts[0]` es siempre una cadena vacía `""` para URLs como `#/tipitaka/...`. La rama nunca se alcanza.

**Impacto:** Código muerto. La navegación de `#/tipitaka/...` puede no funcionar correctamente si esta rama era destinada a manejo especial.

**Corrección:** Depurar el análisis de hash y eliminar o corregir la rama muerta. Verificar que `parts[1]` se usa para el panel ID (índice después de la barra inicial).

---

## BUG-005 — export.ts: Condición del Título Siempre Falsa

**Archivo:** `src/export.ts`

**Problema:** La condición para incluir el título de la obra en el HTML de impresión verifica `if (workEntry.title && workEntry.title !== undefined)`. La segunda condición es redundante y siempre verdadera cuando la primera lo es. Probablemente pretendía verificar algo diferente (ej: si `workEntry.title !== workEntry.id`).

**Impacto:** Bajo — el título siempre se incluye donde debería. El código puede estar encubriendo un bug lógico anterior.

**Corrección:** Revisar la condición pretendida; eliminar la verificación redundante.

---

## BUG-006 — selection.ts: Promise de Clipboard sin `.catch()`

**Archivo:** `src/selection.ts`

**Problema:** `navigator.clipboard.writeText(text)` retorna una Promise que no tiene handler `.catch()`. Si copiar falla (ej: el usuario niega permiso de clipboard, contexto no-seguro), la Promise rechaza y se convierte en un rechazo de Promise no manejado.

**Impacto:** Error silencioso en la consola; ningún feedback al usuario de que copiar falló.

**Corrección:** Agregar `.catch(err => console.warn("Copy failed", err))` o actualizar la UI para indicar falla.

---

## BUG-007 — reader.ts: XSS via `innerHTML` en Contenido Pāli

**Archivo:** `src/reader.ts`

**Problema:** `paliText.innerHTML = seg.pali` establece innerHTML directamente desde datos JSON. Aunque los datos del corpus son confiables y controlados, cualquier corrupción de datos o ataque de supply chain puede inyectar HTML/JS arbitrario. Lo mismo sucede con los campos de traducción (`translationEl.innerHTML = seg.en`).

**Impacto:** Riesgo de seguridad teórico (bajo para una app puramente offline/local). Si los datos del corpus son comprometidos, XSS es posible.

**Corrección:** Para el campo Pāli (que requiere etiquetas inline como `<b>` y `<sup>`): sanitizar con DOMPurify o una allowlist HTML estricta. Para campos de traducción, si no hay HTML pretendido, usar `textContent` en lugar de `innerHTML`.

---

## BUG-008 — i18n.ts: Fallback Documentado Incorrectamente

**Archivo:** `src/i18n.ts` (vs. `docs/01_architecture_en.md`)

**Problema:** La documentación de arquitectura antigua afirma que la cadena de fallback es `STRINGS[uiLang][key]` → `STRINGS.pt[key]`. El código real hace fallback a `STRINGS.en[key]`. La documentación está equivocada, no el código.

**Impacto:** Problema de documentación. Los usuarios de PT pueden ver strings en EN para claves faltantes en lugar de PT.

**Corrección:** Actualizar la documentación (hecho en este conjunto de docs). Considerar si el fallback a EN es la elección correcta o si debería haber un fallback a PT para hablantes de portugués.

---

## BUG-009 — tools.ts: `history.replaceState` Rompe Enrutamiento Hash

**Archivo:** `src/tools/tools.ts`

**Problema:** `switchTab()` usa `history.replaceState(null, "", "#/tools/{tabId}")` para sincronizar la URL con la pestaña de herramienta activa. Sin embargo, cuando el usuario navega lejos de las herramientas y vuelve usando los botones Atrás/Adelante del navegador, el event listener `hashchange` del enrutador principal puede no re-inicializar el panel de herramientas correctamente porque `replaceState` no dispara `hashchange`.

**Impacto:** El botón Atrás del navegador puede llevar a un estado inconsistente en el panel de herramientas.

**Corrección:** Usar `location.hash = "#/tools/{tabId}"` en lugar de `replaceState`, o sincronizar la inicialización de herramientas con el evento `popstate`.

---

## BUG-010 — export.ts: `collectUsedTerms()` con Coincidencia Imprecisa

**Archivo:** `src/export.ts`

**Problema:** `collectUsedTerms()` recopila entradas del diccionario usadas en el texto del corpus para el apéndice de glosario del EPUB. Hace coincidencia de subcadena para verificar si un término del diccionario aparece en los segmentos Pāli. La coincidencia de subcadena puede producir falsos positivos (ej: el término "ti" coincidiendo con cualquier palabra que contenga "ti") y falsos negativos para formas infletidas.

**Impacto:** El glosario del EPUB puede incluir términos irrelevantes u omitir términos usados.

**Corrección:** Usar coincidencia basada en token con normalización morfológica (ya disponible en `normalizePali` de `dictionary.ts`).

---

## BUG-011 — index.html: Texto Hardcodeado en Portugués

**Archivo:** `index.html`

**Problema:** El encabezado `<h2>` del panel de configuraciones está hardcodeado como "Configurações" en lugar de usar el sistema `t()`. Si la UI está configurada para EN o ES, ese encabezado permanece en PT.

**Impacto:** Cosmético/NEGLIGIBLE. Solo un elemento de UI no es traducido.

**Corrección:** Mover la etiqueta a `STRINGS` en `i18n.ts` y renderizarla dinámicamente con `t("settings", uiLang)`.

---

## Resumen de Bugs por Severidad

| Severidad | IDs de los Bugs |
|---|---|
| ALTA | BUG-001, BUG-003 |
| MEDIA | BUG-002, BUG-007, BUG-009 |
| BAJA | BUG-004, BUG-005, BUG-006, BUG-010 |
| NEGLIGIBLE | BUG-008, BUG-011 |
