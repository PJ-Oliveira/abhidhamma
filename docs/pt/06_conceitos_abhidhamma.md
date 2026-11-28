# Abhidhamma Concepts in the Codebase

This document explains the Buddhist/Pāli concepts that are directly modeled or referenced in the source code.

---

## 1. Abhidhamma Piṭaka

The third "basket" (_piṭaka_) of the Theravāda Pāli Canon, focused on a systematic philosophical analysis of mind and matter. Contains seven works:

| Work | Abbr. | Content |
|---|---|---|
| Dhammasaṅgaṇī | Ds | Enumeration of dhammas by mātikā categories |
| Vibhaṅga | Vbh | Analysis of 18 topics (aggregates, sense bases, etc.) |
| Dhātukathā | Dhs | Categorization of dhammas by inclusion/non-inclusion |
| Puggalapaññatti | Pp | Designation of persons |
| Kathāvatthu | Kv | Canonical refutation of 252 disputed points |
| Yamaka | Yam | Pairs of questions testing logical consistency |
| Paṭṭhāna | Pṭṭh | 24 conditional relations (paccaya); largest Pāli work |

---

## 2. Citta (Consciousness / Mind)

Modeled in `src/ontology/citta.ts` and visualized in the Citta-Vīthi tool.

A **citta** arises for a single moment and is defined by its associated **cetasikas** (mental factors). There are 89 (or 121 in extended analyses) types of citta, categorized by:
- **Bhūmi** (plane): kāmāvacara (sensuous), rūpāvacara (fine-material), arūpāvacara (immaterial), lokuttara (supramundane)
- **Jāti** (nature): kusala (wholesome), akusala (unwholesome), vipāka (resultant), kiriyā (functional)

The Citta-Vīthi tool shows the **process** of citta arising through different sense doors (eye, ear, nose, tongue, body, mind).

---

## 3. Cetasika (Mental Factors)

Modeled in `src/tools/cetasika.ts` and `src/ontology/cetasika.ts`.

52 mental factors that arise in association with citta:
- 25 **sobhana cetasikas** (beautiful/wholesome factors)
- 14 **akusala cetasikas** (unwholesome factors)
- 13 **aññasamāna cetasikas** (ethically variable factors)

The Cetasika tool allows:
- Selecting a citta → listing all its associated cetasikas
- Comparing two cittas → Venn-diagram style (common / exclusive-A / exclusive-B)

---

## 4. Citta-Vīthi (Consciousness Process)

Modeled in `src/tools/vithi.ts`, data in `data/tools/vithi.json`.

A **vīthi** is a series of consciousness moments arising at one cognitive event:

```
(bhavaṅga) → bhavaṅgacalana → bhavaṅgupaccheda
→ (pañcadvārāvajjana / manodvārāvajjana)
→ (pañca-viññāṇa for sense doors)
→ (sampaṭicchana → santīraṇa → voṭṭhapana)
→ javana × 7
→ (tadārammaṇa × 2)
→ (bhavaṅga)
```

Different doors (eye, ear, nose, tongue, body, mind) have different sequences. The tool animates each step with color-coded types.

---

## 5. Paṭṭhāna (Conditional Relations)

Modeled in `src/tools/patthana.ts` and `src/ontology/sampayoganaya.ts`.

The 24 conditional relations (_paccaya_) that structure all causality in the Abhidhamma:

1. Hetu-paccaya (root condition)
2. Ārammaṇa-paccaya (object condition)
3. Adhipati-paccaya (predominance condition)
4. Anantara-paccaya (contiguity condition)
5. Samanantara-paccaya (immediate contiguity)
6. Sahajāta-paccaya (co-nascence)
7. Aññamaññā-paccaya (mutuality)
8. Nissaya-paccaya (support)
9. Upanissaya-paccaya (decisive support)
10. Purejāta-paccaya (pre-nascence)
11. Pacchājāta-paccaya (post-nascence)
12. Āsevana-paccaya (repetition/cultivation)
13. Kamma-paccaya (kamma condition)
14. Vipāka-paccaya (resultant condition)
15. Āhāra-paccaya (nutriment)
16. Indriya-paccaya (faculty)
17. Jhāna-paccaya (jhāna condition)
18. Magga-paccaya (path condition)
19. Sampayutta-paccaya (association)
20. Vippayutta-paccaya (dissociation)
21. Atthi-paccaya (presence)
22. Natthi-paccaya (absence)
23. Vigata-paccaya (disappearance)
24. Avigata-paccaya (non-disappearance)

---

## 6. Mātikā (Matrix / Categories)

Modeled in `src/tools/matikas.ts`.

The Dhammasaṅgaṇī opens with a **mātikā** — a matrix of classification categories:
- **Tikas** (triads): classify dhammas in three ways, e.g., wholesome/unwholesome/indeterminate
- **Dukas** (dyads): classify dhammas in pairs, e.g., conditioned/unconditioned

The Mātikās tool provides a searchable list of all 22 tikas and 100 dukas.

---

## 7. Kathāvatthu Debate Logic

Modeled in `src/ontology/kathavatthu.ts`, `src/ontology/kathavatthu_logic.ts`, `src/ontology/formal_logic.ts`.

The Kathāvatthu uses a formalized debate method with five moves:

| Pāli term | Meaning |
|---|---|
| Anuloma | Forward progression — the proponent's position |
| Paṭikamma | Counter-argument |
| Niggaha | Refutation — showing the logical contradiction |
| Upanayana | Application — restating the contradiction |
| Niṭṭhāna | Conclusion |

The debate simulator (`ai-feature/`) implements this as a rule-based engine that evaluates claims about:
- Self / Ātman (refuted via reductio ad absurdum using the Aggregates)
- Time / temporal existence (refuted via Law of Non-Contradiction)
- Consciousness transmigration (refuted via Dependent Origination / momentariness)
- Sabhāva / intrinsic nature of dhammas
- And other classical Abhidhamma controversy points

---

## 8. Khandha (Aggregates)

Referenced throughout the ontology modules. The five aggregates (_pañcakkhandha_) that constitute what is conventionally called a "person":

1. **Rūpa** — form/matter
2. **Vedanā** — feeling/sensation (pleasant/painful/neutral)
3. **Saññā** — perception
4. **Saṅkhārā** — mental formations/volitional activities
5. **Viññāṇa** — consciousness

The Debate Simulator uses these to refute claims about a permanent Self.

---

## 9. Sammuti vs. Paramattha

A key epistemological distinction in Abhidhamma:

| | Sammuti-sacca | Paramattha-sacca |
|---|---|---|
| Meaning | Conventional truth / concept | Ultimate truth / real entity |
| Examples | Person, table, self | Citta, cetasika, rūpa, nibbāna |
| In debate | Opponent confuses the two levels | Theravāda refutation targets this confusion |

---

## 10. Paññatti (Concepts)

Concepts that exist only as linguistic/cognitive constructs without ultimate reality. Time, person, self, and world are paññatti. Reifying them (treating them as having ultimate existence) is the logical error exposed in Kathāvatthu debates.

---

## 11. Khaṇikavāda (Momentariness)

The Theravāda doctrine that each citta exists for only one moment (_khaṇa_), arising and passing away with extraordinary rapidity. The citta-vīthi tool visualizes this process. The Debate Simulator uses it to refute claims that consciousness transmigrates as a single enduring entity.
