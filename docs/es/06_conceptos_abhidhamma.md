# Conceptos Abhidhamma

Esta página provee una referencia de los principales términos Abhidhamma tal como aparecen en el código fuente, los datos y la interfaz de usuario.

---

## 1. Piṭakas y el Canon Pāli

El Canon Pāli (Tipiṭaka) tiene tres divisiones:

| Piṭaka | Contenido |
|---|---|
| Vinaya Piṭaka | Reglas monásticas |
| Sutta Piṭaka | Discursos del Buda |
| Abhidhamma Piṭaka | Análisis psicológico y filosófico sistemático |

Este proyecto cubre principalmente el **Abhidhamma Piṭaka** y textos relacionados.

---

## 2. Los Siete Libros del Abhidhamma

| Clave `workId` | Título Pāli | Contenido |
|---|---|---|
| `dhammasangani` | Dhammasaṅgaṇī | Enumeración de los fenómenos (dhammas) |
| `vibhanga` | Vibhaṅga | Análisis de los grupos (khandhas, āyatanas, etc.) |
| `dhatukatha` | Dhātukathā | Discusión de los elementos |
| `puggalapannatti` | Puggalapaññatti | Descripción de tipos de personas |
| `kathavatthu` | Kathāvatthu | Puntos de controversia (debates inter-escuelas) |
| `yamaka` | Yamaka | Pares de cuestiones |
| `patthana` | Paṭṭhāna | Relaciones condicionales (el libro más grande del canon) |

---

## 3. Conceptos Centrales

### Sammuti vs. Paramattha

- **Sammuti** (convencional): entidades cotidianas como "persona", "montaña", "carro" — reales para propósitos prácticos, pero no en última instancia.
- **Paramattha** (último): realidades irreductibles — citta, cetasika, rūpa, nibbāna. El Abhidhamma opera principalmente en el nivel paramattha.

### Los Cuatro Paramattha Dhammas

| Término | Traducción | Descripción |
|---|---|---|
| Citta | Consciencia | Mente que conoce un objeto |
| Cetasika | Factores mentales | 52 cualidades mentales que acompañan la consciencia |
| Rūpa | Materia/Forma | 28 tipos de fenómenos materiales |
| Nibbāna | Nirvana | Cesación del sufrimiento; incondicionado |

---

## 4. Citta (Consciencia)

El Abhidhamma clasifica **89 (o 121) tipos de citta** en cuatro planos:

| Plano | Cittas |
|---|---|
| Kāmāvacara | Esfera sensual (54 tipos) |
| Rūpāvacara | Esfera de la forma (15 tipos) |
| Arūpāvacara | Esfera sin forma (12 tipos) |
| Lokuttara | Supramundano (8 o 40 tipos) |

Cada citta puede ser saludable (kusala), insalubre (akusala), resultante (vipāka) o funcional (kiriya).

---

## 5. Cetasika (Factores Mentales)

52 cetasikas surgen con cittas en combinaciones específicas:

| Grupo | Cetasikas |
|---|---|
| Universales (Sabbacittasādhāraṇa) | 7 — surgen con todos los cittas |
| Particulares (Pakiṇṇaka) | 6 — surgen con algunos cittas |
| Insalubres (Akusala) | 14 — asociados con cittas akusala |
| Hermosos (Sobhaṇa) | 25 — asociados con cittas hermosos/saludables |

La herramienta **Cetasika** (`tools/cetasika.ts`) mapea qué cetasikas surgen con cada citta y permite comparaciones lado a lado.

---

## 6. Citta-Vīthi (Proceso de Consciencia)

Los momentos de consciencia surgen en secuencias (vīthi) a través de diferentes **puertas** (dvāra):

| Puerta | Órgano sensorial | Secuencia típica |
|---|---|---|
| Cakkhu-dvāra | Ojo | Advertencia → visión × 5 → recepción → investigación → determinación → javana × 7 → registro × 2 |
| Sota-dvāra | Oído | (similar a lo anterior) |
| Ghāna-dvāra | Nariz | (similar) |
| Jivhā-dvāra | Lengua | (similar) |
| Kāya-dvāra | Cuerpo | (similar) |
| Mano-dvāra | Puerta de la mente | Bhavaṅga → interrupción → advertencia → javana × 7 → registro × 2 |

La herramienta **Citta-Vīthi** (`tools/vithi.ts`) anima estas secuencias basándose en datos de `data/tools/vithi.json`.

---

## 7. Khandha (Grupos / Agregados)

Las cinco categorías de existencia experiencial:

| Pāli | Traducción |
|---|---|
| Rūpa-khandha | Forma material |
| Vedanā-khandha | Sensación (agradable/desagradable/neutra) |
| Saññā-khandha | Percepción |
| Saṅkhāra-khandha | Formaciones volitivas |
| Viññāṇa-khandha | Consciencia |

---

## 8. Las 24 Relaciones Condicionales del Paṭṭhāna (Paccaya)

El **Paṭṭhāna** enumera 24 tipos de relaciones condicionales (paccaya) entre dhammas. La herramienta **Paṭṭhāna** (`tools/patthana.ts`) visualiza estas relaciones interactivamente.

Algunos ejemplos clave:

| # | Pāli | Traducción |
|---|---|---|
| 1 | Hetu-paccaya | Condición raíz |
| 2 | Ārammaṇa-paccaya | Condición objeto |
| 3 | Adhipati-paccaya | Condición dominante |
| 4 | Anantara-paccaya | Condición inmediatamente contigua |
| 6 | Sahajāta-paccaya | Condición co-nacida |
| 8 | Nissaya-paccaya | Condición de apoyo |
| 11 | Āhāra-paccaya | Condición nutrición |
| 17 | Magga-paccaya | Condición camino |
| 24 | Vippayutta-paccaya | Condición disociada |

---

## 9. Mātikā (Matriz de Clasificación)

El Dhammasaṅgaṇī abre con la **Mātikā** — una matriz de **122 grupos**:

- **Tika-mātikā**: 22 tríadas (agrupamientos de tres) — ej: kusala/akusala/abyākata (saludable/insalubre/inefable)
- **Duka-mātikā**: 100 díadas (agrupamientos de dos) — ej: hetu/na-hetu (con raíz/sin raíz)

La herramienta **Mātikās** (`tools/matikas.ts`) hace estos grupos buscables.

---

## 10. Kathāvatthu y el Motor Lógico de Debate

La **Kathāvatthu** (Puntos de Controversia) es un registro de debates filosóficos entre escuelas budistas. Su formato de debate tiene un patrón de 5 pasos:

1. **Afirmación** (puggalo upalabbhati): "¿La persona existe en última instancia?"
2. **Refutación** (na h'evaṃ vattabbe): "Eso no puede decirse así"
3. **Consecuencia lógica** (si X entonces Y se sigue)
4. **Reductio ad absurdum**
5. **Contraposición** (el oponente acepta el absurdo, por tanto la tesis original cae)

El módulo `ontology/kathavatthu_logic.ts` implementa este patrón como un motor basado en reglas con:
- `KathavatthuRule`: enum de tipos de reglas lógicas
- `LogicalConnective`: enum de conectivos (IMPLIES, IFF, NOT, AND, OR)
- `evaluateCustomClaim(claim)`: evalúa una afirmación arbitraria
- `evaluateScenario(scenarioId, uiLang)`: evalúa escenarios canónicos pre-codificados

---

## 11. Khaṇikavāda (Momentaneidad)

La doctrina Abhidhamma de que toda experiencia consiste en momentos de consciencia distintos (khaṇa) que surgen y pasan en rapidísima sucesión. Cada citta en la vīthi es un momento separado. Esta doctrina es uno de los temas debatidos en el simulador de la Kathāvatthu.
