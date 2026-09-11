# Abhidhamma Piṭaka Trilingüe — Visión General del Proyecto

## ¿Qué es este proyecto?

El **Abhidhamma Piṭaka Trilingüe** es una Progressive Web App (PWA) que corre completamente en el navegador, para leer, estudiar y exportar el Canon Pāli Abhidhamma Piṭaka — una de las tres divisiones principales (_piṭaka_) del Canon Budista Theravāda — en tres idiomas: **Pāli** (original), **Inglés** y **Portugués**, con Español también presente en los datos.

No hay backend en el servidor. Todo el contenido, la lógica y el estado corren completamente en el navegador.

---

## Alcance y Contenido

El corpus abarca **siete obras canónicas del Abhidhamma** más textos complementarios:

| Clave del grupo | Obras incluidas |
|---|---|
| `abhidhamma` | Dhammasaṅgaṇī, Vibhaṅga, Dhātukathā, Puggalapaññatti, Kathāvatthu, Yamaka, Paṭṭhāna |
| `outros` | Abhidhammatthasaṅgaha, Abhidhammāvatāra, otros manuales |
| `visuddhimagga` | Visuddhimagga (Camino de la Purificación) |
| `comentarios` | Comentarios contemporáneos (bilingüe EN-PT) |

Cada obra se divide en **partes** (mūla, aṭṭhakathā, ṭīkā, anuṭīkā…) y se subdivide en **archivos JSON de fragmentos** de ~900 segmentos para carga eficiente.

---

## Funcionalidades Principales

| Funcionalidad | Descripción |
|---|---|
| **Lector trilingüe** | Pāli alineado con traducciones EN/PT/ES, segmento por segmento |
| **Árbol de navegación** | Árbol jerárquico expandible de todas las obras y partes |
| **Diccionario Pāli** | 721 lemas de alta frecuencia + 182 entradas generales; normalización morfológica |
| **Búsqueda completa** | Índice invertido fragmentado; búsqueda en Pāli, EN, PT, ES |
| **Favoritos e Historial** | Persistentes via localStorage |
| **Exportación** | PDF (impresión del navegador) y EPUB 3 con apéndice de glosario |
| **SRS** | Sistema de Repetición Espaciada (SM-2) para memorización de vocabulario Pāli |
| **Herramientas Abhidhamma** | Visualizaciones interactivas: Mapa Mental, relaciones Paṭṭhāna, Citta-Vīthi, Mātikās, Cetasika |
| **Simulador de Debate** | Motor lógico de debate canónico basado en la Kathāvatthu |
| **PWA / Offline** | Service Worker pre-almacena todos los ~140 MB de contenido para lectura offline |
| **i18n** | Interfaz en PT, EN o ES; idioma de traducción seleccionable independientemente |

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Lenguaje | TypeScript 5.6 (compilado a módulos ES2022 via `tsc`) |
| Ejecución | Navegador (sin Node.js en runtime) |
| Framework de pruebas | Vitest 4 con jsdom y cobertura via V8 |
| Build | `tsc` + `scripts/version_js.py` (hash de cache-busting) |
| Deploy | Archivos estáticos (GitHub Pages via `.nojekyll`) |
| Fuente tipográfica | Gentium Book Plus (TTF incluido) |
| Dependencia de IA | `@mlc-ai/web-llm` (cargado de forma lazy — no usado en el build estable actual) |

---

## Inicio Rápido

```bash
# Instalar dependencias de desarrollo
npm install

# Correr pruebas
npm test

# Build (compilación TypeScript + sello de versión)
npm run build

# Modo watch
npm run watch
```

Abra `index.html` en el navegador (o sirva con cualquier servidor de archivos estáticos). No se requiere ningún paso de build para visualizar; los archivos `js/` compilados están versionados.

---

## Jerarquía de Archivos (nivel raíz)

```
index.html           Punto de entrada
css/style.css        Hoja de estilos única
js/                  Módulos JS compilados (versionados)
src/                 Código fuente TypeScript
data/
  manifest.json      Registro de obras/partes/fragmentos
  works/{id}/*.json  Fragmentos de contenido
  dictionary/        Diccionarios Pāli
  search/            Fragmentos de búsqueda
fonts/               Gentium Book Plus TTF
img/                 Logo
service-worker.js    Cache PWA
manifest.json        Web App Manifest
tests/               Pruebas unitarias (Vitest)
scripts/             Auxiliares de build (Python)
docs/                Documentación (esta carpeta)
```
