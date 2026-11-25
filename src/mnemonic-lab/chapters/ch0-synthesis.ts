// ============================================================================
// PRÓLOGO (AS 0.2), EQUAÇÕES DO CAP. 1 (AS I.14–43) & SÍNTESE INTER-CAPÍTULOS
// ============================================================================
// Cobre os 4 Paramattha-dhammas, as grandes somas canônicas do Cap. 1 e as
// pontes lógicas, exceções e análogos transversais dos 9 capítulos do Mūla.
// ============================================================================

import type { UiLang } from "../../types.js";

export type SynthesisAxisId = "prologue" | "citta_sums" | "realms_bridge" | "doctrinal_laws";

export interface SynthesisChallengeItem {
  readonly id: string;
  readonly axis: SynthesisAxisId;
  readonly asRef: string;
  readonly code: string;
  readonly pali: string;
  readonly prompt: Record<UiLang, string>;
  readonly promptPali: string;
  readonly answerPali: string;
  readonly answer: Record<UiLang, string>;
  readonly explanation: Record<UiLang, string>;
  readonly chaptersLinked: readonly number[];
}

export const SYNTHESIS_AXIS_META: readonly {
  readonly id: SynthesisAxisId;
  readonly label: Record<UiLang, string>;
}[] = [
  {
    id: "prologue",
    label: {
      pt: "Prólogo · 4 Paramatthas",
      en: "Prologue · 4 Paramatthas",
      es: "Prólogo · 4 Paramatthas",
    },
  },
  {
    id: "citta_sums",
    label: {
      pt: "Cap. 1 · Somas 89 / 121",
      en: "Ch. 1 · 89 / 121 Sums",
      es: "Cap. 1 · Sumas 89 / 121",
    },
  },
  {
    id: "realms_bridge",
    label: {
      pt: "Ponte dos 4 Planos",
      en: "4-Plane Bridge",
      es: "Puente de los 4 Planos",
    },
  },
  {
    id: "doctrinal_laws",
    label: {
      pt: "Análogos & Exceções Inter-Capítulos",
      en: "Cross-Chapter Analogues & Exceptions",
      es: "Análogos y Excepciones Inter-Capítulos",
    },
  },
];

export const MULA_SYNTHESIS_ITEMS: readonly SynthesisChallengeItem[] = [
  // ── 1. PRÓLOGO: CATUPARAMATTHADHAMMO (AS 0.2) ─────────────────────────────
  {
    id: "syn:pro:1",
    axis: "prologue",
    asRef: "AS 0.2",
    code: "Pro-01",
    pali: "Cittaṃ (1 Paramattha)",
    promptPali: "Catudhā paramatthato: ārammaṇavijānanalakkhaṇaṃ saṅkhataṃ nāmaṃ (89 / 121)?",
    prompt: {
      pt: "Qual dos 4 Paramattha-dhammas é condicionado, mental (Nāma), uno em natureza intrínseca e se desdobra em 89 ou 121 tipos?",
      en: "Which of the 4 Paramattha-dhammas is conditioned, mental (Nāma), single in intrinsic nature, and unfolds into 89 or 121 types?",
      es: "¿Cuál de los 4 Paramattha-dhammas es condicionado, mental (Nāma), único en naturaleza intrínseca y se despliega en 89 o 121 tipos?",
    },
    answerPali: "Cittaṃ (Consciência · 1 Sabhāva)",
    answer: {
      pt: "Citta — Consciência (1 realidade intrínseca · 89 / 121 modos)",
      en: "Citta — Consciousness (1 intrinsic reality · 89 / 121 modes)",
      es: "Citta — Conciencia (1 realidad intrínseca · 89 / 121 modos)",
    },
    explanation: {
      pt: "AS 0.2: Citta é o 1.º dos 4 Paramatthas; conhece o objeto (ārammaṇa-vijānana), é condicionado (Saṅkhata) e pertence a Nāma.",
      en: "AS 0.2: Citta is the 1st of the 4 Paramatthas; cognizes an object, is conditioned (Saṅkhata), and belongs to Nāma.",
      es: "AS 0.2: Citta es el 1.º de los 4 Paramatthas; conoce el objeto, es condicionado (Saṅkhata) y pertenece a Nāma.",
    },
    chaptersLinked: [1, 2, 7],
  },
  {
    id: "syn:pro:2",
    axis: "prologue",
    asRef: "AS 0.2, II.1",
    code: "Pro-02",
    pali: "Cetasikaṃ (52 Paramattha)",
    promptPali: "Ekuppādanirodhā ekālambaṇavatthukā cetoyuttā dvipaññāsa dhammā?",
    prompt: {
      pt: "Qual dos 4 Paramattha-dhammas surge/cessa junto com Citta, compartilha o mesmo objeto e base, e totaliza 52 realidades?",
      en: "Which of the 4 Paramattha-dhammas arises/ceases with Citta, shares its object and base, and numbers 52 realities?",
      es: "¿Cuál de los 4 Paramattha-dhammas surge/cesa con Citta, comparte objeto y base, y suma 52 realidades?",
    },
    answerPali: "Cetasikaṃ (52 Fatores Mentais)",
    answer: {
      pt: "Cetasika — Fatores Mentais (52 = 13 + 14 + 25)",
      en: "Cetasika — Mental Factors (52 = 13 + 14 + 25)",
      es: "Cetasika — Factores Mentales (52 = 13 + 14 + 25)",
    },
    explanation: {
      pt: "AS 0.2 e II.1: Os 52 Cetasikas possuem as 4 marcas de Sampayoga e formam 3 agregados (Vedanā, Saññā e 50 Saṅkhāras).",
      en: "AS 0.2 & II.1: The 52 Cetasikas bear the 4 Sampayoga marks and comprise 3 aggregates (Vedanā, Saññā, and 50 Saṅkhāras).",
      es: "AS 0.2 y II.1: Los 52 Cetasikas tienen las 4 marcas de Sampayoga y forman 3 agregados (Vedanā, Saññā y 50 Saṅkhāras).",
    },
    chaptersLinked: [2, 7],
  },
  {
    id: "syn:pro:3",
    axis: "prologue",
    asRef: "AS 0.2, VI.3–18",
    code: "Pro-03",
    pali: "Rūpaṃ (18 + 10 = 28)",
    promptPali: "Ahetukaṃ anārammaṇaṃ kāmāvacaraṃ aṭṭhārasa nipphannaṃ dasa anipphannaṃ?",
    prompt: {
      pt: "Qual Paramattha é sempre sem raiz, sem objeto, condicionado e da esfera sensual, dividindo-se em 18 concretos + 10 não-concretos?",
      en: "Which Paramattha is always rootless, objectless, conditioned, and sense-sphere, dividing into 18 concrete + 10 non-concrete?",
      es: "¿Cuál Paramattha es siempre sin raíz, sin objeto, condicionado y sensual, dividiéndose en 18 concretos + 10 no concretos?",
    },
    answerPali: "Rūpaṃ (28 Matérias: 18 Nipphanna + 10 Anipphanna)",
    answer: {
      pt: "Rūpa — Materialidade (28 = 18 Nipphanna + 10 Anipphanna)",
      en: "Rūpa — Materiality (28 = 18 Nipphanna + 10 Anipphanna)",
      es: "Rūpa — Materialidad (28 = 18 Nipphanna + 10 Anipphanna)",
    },
    explanation: {
      pt: "AS 0.2 e VI.18: Somente os 18 Nipphanna-rūpas entram na contagem dos 72 Sabhāva-dhammas (AS VII.1); com os 10 Anipphannas somam 28.",
      en: "AS 0.2 & VI.18: Only the 18 Nipphanna-rūpas enter the 72 Sabhāva-dhammas (AS VII.1); with the 10 Anipphannas they total 28.",
      es: "AS 0.2 y VI.18: Solo los 18 Nipphanna-rūpas entran en los 72 Sabhāva-dhammas (AS VII.1); con los 10 Anipphannas suman 28.",
    },
    chaptersLinked: [6, 7],
  },
  {
    id: "syn:pro:4",
    axis: "prologue",
    asRef: "AS 0.2, VI.62–65",
    code: "Pro-04",
    pali: "Nibbānaṃ (Asaṅkhata-dhātu)",
    promptPali: "Ekameva asaṅkhataṃ lokuttaraṃ khandhavimuttaṃ dhammāyatanapariyāpannaṃ?",
    prompt: {
      pt: "Qual é o único Paramattha incondicionado (Asaṅkhata), fora dos 5 Agregados (Khandhavimutta), mas incluído em Nāma e Dhammāyatana?",
      en: "Which is the sole unconditioned Paramattha (Asaṅkhata), outside the 5 Aggregates (Khandhavimutta), yet included in Nāma and Dhammāyatana?",
      es: "¿Cuál es el único Paramattha incondicionado (Asaṅkhata), fuera de los 5 Agregados, pero incluido en Nāma y Dhammāyatana?",
    },
    answerPali: "Nibbānaṃ (1 Asaṅkhata · 2 Modos · 3 Aspectos)",
    answer: {
      pt: "Nibbāna — O Incondicionado (1 natureza · 2 modos · 3 aspectos)",
      en: "Nibbāna — The Unconditioned (1 nature · 2 modes · 3 aspects)",
      es: "Nibbāna — Lo Incondicionado (1 naturaleza · 2 modos · 3 aspectos)",
    },
    explanation: {
      pt: "AS 0.2, VI.62, VII.50 e VIII.38: Nibbāna é incondicionado (Asaṅkhata), supramundano, conta entre os 5 Nāmas e nos 69 de Dhammāyatana.",
      en: "AS 0.2, VI.62, VII.50 & VIII.38: Nibbāna is unconditioned, supramundane, counted among the 5 Nāmas and 69 Dhammāyatana realities.",
      es: "AS 0.2, VI.62, VII.50 y VIII.38: Nibbāna es incondicionado, supramundano, contado entre los 5 Nāmas y los 69 de Dhammāyatana.",
    },
    chaptersLinked: [6, 7, 8],
  },
  {
    id: "syn:pro:5",
    axis: "prologue",
    asRef: "AS 0.2, VII.1",
    code: "Pro-05",
    pali: "Dvāsattati Sabhāvadhammā (1+52+18+1 = 72)",
    promptPali: "1 Cittaṃ + 52 Cetasikā + 18 Nipphannarūpāni + 1 Nibbānaṃ = ?",
    prompt: {
      pt: "Qual é a equação exata das realidades com natureza intrínseca (Sabhāva / Vatthudhammā) anunciada no início do Cap. 7?",
      en: "What is the exact equation of realities with intrinsic nature (Sabhāva / Vatthudhammā) announced at the start of Ch. 7?",
      es: "¿Cuál es la ecuación exacta de las realidades con naturaleza intrínseca (Sabhāva / Vatthudhammā) al inicio del Cap. 7?",
    },
    answerPali: "72 Sabhāvadhammā (+ 10 Anipphanna = 82)",
    answer: {
      pt: "72 Sabhāva-dhammas (1 + 52 + 18 + 1) · + 10 Anipphanna = 82",
      en: "72 Sabhāva-dhammas (1 + 52 + 18 + 1) · + 10 Anipphanna = 82",
      es: "72 Sabhāva-dhammas (1 + 52 + 18 + 1) · + 10 Anipphanna = 82",
    },
    explanation: {
      pt: "AS VII.1 (Dvāsattatividhā vuttā, vatthudhammā salakkhaṇā): Citta (1), Cetasikas (52), Nipphanna-rūpa (18) e Nibbāna (1) = 72.",
      en: "AS VII.1 (Dvāsattatividhā vuttā, vatthudhammā salakkhaṇā): Citta (1), Cetasikas (52), Nipphanna-rūpa (18), Nibbāna (1) = 72.",
      es: "AS VII.1 (Dvāsattatividhā vuttā): Citta (1), Cetasikas (52), Nipphanna-rūpa (18) y Nibbāna (1) = 72.",
    },
    chaptersLinked: [1, 2, 6, 7],
  },
  {
    id: "syn:pro:6",
    axis: "prologue",
    asRef: "AS 0.2, VIII.38",
    code: "Pro-06",
    pali: "Pañcavidha Nāma vs. 1 Rūpa (Saṅkhata 3 : Asaṅkhata 1)",
    promptPali: "Cattāro arūpino khandhā + Nibbānaṃ = Pañcavidhaṃ Nāmaṃ (AS VIII.38)",
    prompt: {
      pt: "Como os 4 Paramatthas se particionam em (a) Condicionado vs. Incondicionado e (b) Nāma vs. Rūpa segundo AS VIII.38?",
      en: "How do the 4 Paramatthas partition into (a) Conditioned vs. Unconditioned and (b) Nāma vs. Rūpa per AS VIII.38?",
      es: "¿Cómo se particionan los 4 Paramatthas en (a) Condicionado vs. Incondicionado y (b) Nāma vs. Rūpa según AS VIII.38?",
    },
    answerPali: "Saṅkhata 3 : Asaṅkhata 1 · Nāma = 4 Arūpakkhandhā + Nibbāna (5)",
    answer: {
      pt: "3 Condicionados + 1 Incondicionado · Nāma = 4 agregados mentais + Nibbāna (5)",
      en: "3 Conditioned + 1 Unconditioned · Nāma = 4 mental aggregates + Nibbāna (5)",
      es: "3 Condicionados + 1 Incondicionado · Nāma = 4 agregados mentales + Nibbāna (5)",
    },
    explanation: {
      pt: "AS VIII.38 define Nāma/Arūpa como 5 fatores (Vedanā, Saññā, Saṅkhāra, Viññāṇa + Nibbāna) em oposição ao único Rūpakkhandha.",
      en: "AS VIII.38 defines Nāma/Arūpa as 5 items (4 mental aggregates + Nibbāna) as opposed to the single Rūpakkhandha.",
      es: "AS VIII.38 define Nāma/Arūpa como 5 factores (4 agregados mentales + Nibbāna) frente al único Rūpakkhandha.",
    },
    chaptersLinked: [6, 7, 8],
  },

  // ── 2. CAP. 1: EQUAÇÕES DE SÍNTESE (AS I.14, 20, 35–43) ───────────────────
  {
    id: "syn:c1:1",
    axis: "citta_sums",
    asRef: "AS I.35",
    code: "Sum-01",
    pali: "89 Cittāni (Jātivasena): 12 + 21 + 36 + 20",
    promptPali: "Saṅkhepagaṇanā (89) jātivasena: Akusala · Kusala · Vipāka · Kiriya = ?",
    prompt: {
      pt: "Na contagem resumida de 89 Cittas (AS I.35), qual é a partição exata pelas 4 naturezas (Akusala + Kusala + Vipāka + Kiriya)?",
      en: "In the brief count of 89 Cittas (AS I.35), what is the exact partition across the 4 classes (Akusala + Kusala + Vipāka + Kiriya)?",
      es: "En el conteo breve de 89 Cittas (AS I.35), ¿cuál es la partición exacta por las 4 clases (Akusala + Kusala + Vipāka + Kiriya)?",
    },
    answerPali: "12 Akusala + 21 Kusala + 36 Vipāka + 20 Kiriya = 89",
    answer: {
      pt: "12 Akusala + 21 Kusala + 36 Vipāka + 20 Kiriya = 89",
      en: "12 Akusala + 21 Kusala + 36 Vipāka + 20 Kiriya = 89",
      es: "12 Akusala + 21 Kusala + 36 Vipāka + 20 Kiriya = 89",
    },
    explanation: {
      pt: "AS I.35: Dvādasākusalānevaṃ, kusalānekavīsati; Chattiṃseva vipākāni, kiriyacittāni vīsati (12+21+36+20 = 89).",
      en: "AS I.35: 12 unwholesome, 21 wholesome (8+5+4+4), 36 resultants (7+8+8+5+4+4), 20 functional (3+8+5+4) = 89.",
      es: "AS I.35: 12 Akusala, 21 Kusala (8+5+4+4), 36 Vipāka (7+8+8+5+4+4), 20 Kiriya (3+8+5+4) = 89.",
    },
    chaptersLinked: [1],
  },
  {
    id: "syn:c1:2",
    axis: "citta_sums",
    asRef: "AS I.43",
    code: "Sum-02",
    pali: "121 Cittāni (Vitthāra Jātivasena): 12 + 37 + 52 + 20",
    promptPali: "Vitthāragaṇanā (121) jātivasena: Akusala · Kusala · Vipāka · Kiriya = ?",
    prompt: {
      pt: "Na contagem detalhada de 121 Cittas (AS I.43), como mudam os totais de Akusala, Kusala, Vipāka e Kiriya (+16 Magga, +16 Phala)?",
      en: "In the detailed count of 121 Cittas (AS I.43), how do Akusala, Kusala, Vipāka, and Kiriya shift (+16 Magga, +16 Phala)?",
      es: "En el conteo detallado de 121 Cittas (AS I.43), ¿cómo cambian Akusala, Kusala, Vipāka y Kiriya (+16 Magga, +16 Phala)?",
    },
    answerPali: "12 Akusala + 37 Kusala + 52 Vipāka + 20 Kiriya = 121",
    answer: {
      pt: "12 Akusala + 37 Kusala (+16) + 52 Vipāka (+16) + 20 Kiriya = 121",
      en: "12 Akusala + 37 Kusala (+16) + 52 Vipāka (+16) + 20 Kiriya = 121",
      es: "12 Akusala + 37 Kusala (+16) + 52 Vipāka (+16) + 20 Kiriya = 121",
    },
    explanation: {
      pt: "AS I.43: Akusala (12) e Kiriya (20) permanecem fixos; Kusala sobe 21→37 (+16 Maggas) e Vipāka sobe 36→52 (+16 Phalas).",
      en: "AS I.43: Akusala (12) and Kiriya (20) stay constant; Kusala rises 21→37 (+16 Paths) and Vipāka 36→52 (+16 Fruits).",
      es: "AS I.43: Akusala (12) y Kiriya (20) permanecen fijos; Kusala sube 21→37 y Vipāka 36→52.",
    },
    chaptersLinked: [1],
  },
  {
    id: "syn:c1:3",
    axis: "citta_sums",
    asRef: "AS I.14",
    code: "Sum-03",
    pali: "Sobhanacittaṃ: 59 (em 89) / 91 (em 121)",
    promptPali: "Pāpāhetukamuttāni sobhanānīti vuccare: kati saṅkhepato, kati vitthārato?",
    prompt: {
      pt: "Excluindo as 12 Akusalas e as 18 Ahetukas (= 30 Asobhanas), quantas são as Sobhana Cittas em 89 e em 121?",
      en: "Excluding the 12 Akusala and 18 Ahetuka (= 30 Asobhana), how many Beautiful (Sobhana) Cittas exist in 89-mode and 121-mode?",
      es: "Excluyendo 12 Akusala y 18 Ahetuka (= 30 Asobhana), ¿cuántas Cittas Sobhana existen en 89 y en 121?",
    },
    answerPali: "59 (89 − 30) · 91 (121 − 30)",
    answer: {
      pt: "59 Sobhana (em 89) · 91 Sobhana (em 121) — exatamente onde surgem os 19 Sobhanasādhāraṇas!",
      en: "59 Sobhana (of 89) · 91 Sobhana (of 121) — the exact scope of the 19 Beautiful Universals!",
      es: "59 Sobhana (en 89) · 91 Sobhana (en 121) — exactamente donde surgen los 19 Sobhanasādhāraṇas.",
    },
    explanation: {
      pt: "AS I.14: Ekūnasaṭṭhi cittāni, athekanavutīpi vā. Essa soma conecta Cap. 1 diretamente ao Sampayoga (59 / 91) dos 19 Sobhana universais no Cap. 2.",
      en: "AS I.14: 59 or 91 Beautiful Cittas. This directly links Ch. 1 to the 59/91 Sampayoga count of the 19 Beautiful Universals in Ch. 2.",
      es: "AS I.14: 59 o 91 Cittas Sobhana. Conecta directamente Cap. 1 con los 19 Sobhanasādhāraṇas en Cap. 2.",
    },
    chaptersLinked: [1, 2],
  },
  {
    id: "syn:c1:4",
    axis: "citta_sums",
    asRef: "AS I.20",
    code: "Sum-04",
    pali: "54 Kāmāvacara = 23 Vipāka + 20 Kusala/Akusala + 11 Kiriya",
    promptPali: "Catupaññāsa kāmāvacaracittāni: kati vipākāni, kati puññāpuññāni, kati kiriyāni?",
    prompt: {
      pt: "No verso resumo do Cap. 1 (AS I.20), como se agrupam as 54 Cittas da esfera sensual em Vipāka, Kamma (Aku+Kus) e Kiriya?",
      en: "In the Ch. 1 summary verse (AS I.20), how do the 54 Sense-Sphere Cittas group into Vipāka, Kamma (Aku+Kus), and Kiriya?",
      es: "En el verso resumen del Cap. 1 (AS I.20), ¿cómo se agrupan las 54 Cittas sensuales en Vipāka, Kamma (Aku+Kus) y Kiriya?",
    },
    answerPali: "23 Vipāka (7+8+8) + 20 Puññāpuñña (12+8) + 11 Kiriya (3+8) = 54",
    answer: {
      pt: "23 Vipāka (7+8+8) + 20 Kamma (12 Aku + 8 Kus) + 11 Kiriya (3+8) = 54",
      en: "23 Resultants (7+8+8) + 20 Kamma (12 Aku + 8 Kus) + 11 Functional (3+8) = 54",
      es: "23 Vipāka (7+8+8) + 20 Kamma (12 Aku + 8 Kus) + 11 Kiriya (3+8) = 54",
    },
    explanation: {
      pt: "AS I.20: Tevīsa pākapuññāni, puññāpuññāni vīsati; Ekādasa kiriyā ceti, catupaññāsa sabbathā.",
      en: "AS I.20: 23 resultants, 20 wholesome/unwholesome, and 11 functional = 54 Sense-Sphere Cittas.",
      es: "AS I.20: 23 resultantes, 20 hábiles/inhábiles y 11 funcionales = 54 Cittas Kāmāvacara.",
    },
    chaptersLinked: [1, 5],
  },
  {
    id: "syn:c1:5",
    axis: "citta_sums",
    asRef: "AS I.42",
    code: "Sum-05",
    pali: "67 Jhānacittāni (Vitthāra): 11 + 11 + 11 + 11 + 23",
    promptPali: "Paṭhamādīni cattāri jhānāni ekādasavidhāni, pañcamajjhānaṃ pana tevīsatividhaṃ = ?",
    prompt: {
      pt: "No modo detalhado de 121 Cittas (AS I.42), quantas Cittas pertencem a cada um dos 5 Jhānas (1.º, 2.º, 3.º, 4.º e 5.º)?",
      en: "In the detailed 121-Citta system (AS I.42), how many Cittas belong to each of the 5 Jhānas (1st, 2nd, 3rd, 4th, and 5th)?",
      es: "En el sistema detallado de 121 Cittas (AS I.42), ¿cuántas Cittas pertenecen a cada uno de los 5 Jhānas?",
    },
    answerPali: "11 + 11 + 11 + 11 + 23 = 67 Jhānacittas (+ 54 Kāma = 121)",
    answer: {
      pt: "11, 11, 11, 11 (3 Rūpa + 8 Lokuttara cada) e 23 no 5.º (3 Rūpa + 12 Arūpa + 8 Lokuttara) = 67",
      en: "11, 11, 11, 11 (3 Rūpa + 8 Lokuttara each) and 23 in 5th (3 Rūpa + 12 Arūpa + 8 Lokuttara) = 67",
      es: "11, 11, 11, 11 (3 Rūpa + 8 Lokuttara c/u) y 23 en el 5.º (3 Rūpa + 12 Arūpa + 8 Lokuttara) = 67",
    },
    explanation: {
      pt: "AS I.42 explica por que 12 Arūpas são contados no 5.º Jhāna (possuem apenas Upekkhā e Ekaggatā): 4×11 + 23 = 67 (+ 54 Kāma = 121).",
      en: "AS I.42 explains why the 12 Arūpas count as 5th Jhāna (having Upekkhā + Ekaggatā): 4×11 + 23 = 67 (+ 54 Kāma = 121).",
      es: "AS I.42 explica por qué las 12 Arūpas cuentan como 5.º Jhāna: 4×11 + 23 = 67 (+ 54 Kāma = 121).",
    },
    chaptersLinked: [1, 2, 3],
  },
  {
    id: "syn:c1:6",
    axis: "citta_sums",
    asRef: "AS I.36, 43",
    code: "Sum-06",
    pali: "Bhūmivasena: 54 + 15 + 12 + 8 [40] = 89 [121]",
    promptPali: "Kāma · Rūpa · Arūpa · Lokuttara — bhūmivasena gaṇanā (89 & 121)?",
    prompt: {
      pt: "Qual é a soma exata das 4 Esferas (Bhūmi) nos modos 89 e 121, e quantas são Mundanas (Lokiya) vs. Supramundanas (Lokuttara)?",
      en: "What is the exact sum of the 4 Spheres (Bhūmi) in 89 and 121 modes, and how many are Mundane (Lokiya) vs. Supramundane?",
      es: "¿Cuál es la suma exacta de las 4 Esferas (Bhūmi) en 89 y 121, y cuántas son Mundanas (Lokiya) vs. Supramundanas?",
    },
    answerPali: "54 + 15 + 12 (= 81 Lokiya) + 8 [40] Lokuttara = 89 [121]",
    answer: {
      pt: "81 Mundanas (54 Kāma + 15 Rūpa + 12 Arūpa) + 8 [40] Lokuttara = 89 [121]",
      en: "81 Mundane (54 Kāma + 15 Rūpa + 12 Arūpa) + 8 [40] Lokuttara = 89 [121]",
      es: "81 Mundanas (54 Kāma + 15 Rūpa + 12 Arūpa) + 8 [40] Lokuttara = 89 [121]",
    },
    explanation: {
      pt: "AS I.36 e VII.50: As 81 Cittas mundanas (Tebhūmaka) compõem o Viññāṇupādānakkhandha; apenas as 8 [40] Lokuttaras escapam dos Upādānakkhandhas.",
      en: "AS I.36 & VII.50: The 81 mundane Cittas form the clinging-aggregate of consciousness; only the 8 [40] Lokuttara escape it.",
      es: "AS I.36 y VII.50: Las 81 Cittas mundanas forman Viññāṇupādānakkhandha; solo las 8 [40] Lokuttara escapan a ello.",
    },
    chaptersLinked: [1, 7],
  },

  // ── 3. PONTE UNIFICADA DOS 4 PLANOS (CAP. 3 × CAP. 4 × CAP. 5 × CAP. 6) ──
  {
    id: "syn:pl:1",
    axis: "realms_bridge",
    asRef: "AS III.65, IV.49, V.4–5, VI.52, 61",
    code: "Brg-01",
    pali: "Kāmaloka: 11 Bhūmi · 80 Citta · 28 Rūpa · 6 Vatthu · 7 Dhātu",
    promptPali: "11 Planos · 80 Vīthicitta · 28 Rūpa · 6 Vatthu · 7 Viññāṇadhātu → Qual plano?",
    prompt: {
      pt: "Qual esfera cosmológica possui 11 planos, 80 Cittas (excl. 9 Mahaggata-vipāka), todos os 28 Rūpas, 6 Vatthus e 7 Viññāṇadhātus?",
      en: "Which cosmological sphere has 11 planes, 80 Cittas (excl. 9 Sublime resultants), all 28 Rūpas, 6 Vatthus, and 7 Viññāṇadhātus?",
      es: "¿Qué esfera cosmológica posee 11 planos, 80 Cittas (excl. 9 Vipāka sublimes), 28 Rūpas, 6 Vatthus y 7 Viññāṇadhātus?",
    },
    answerPali: "Kāmaloka (4 Apāya + 7 Kāmasugati = 11)",
    answer: {
      pt: "Kāmaloka — Esfera Sensual (11 planos · 80 cittas · 28 rūpas · 6 bases · 7 dhātus)",
      en: "Kāmaloka — Sense-Sphere Realm (11 planes · 80 cittas · 28 rūpas · 6 bases · 7 dhātus)",
      es: "Kāmaloka — Esfera Sensual (11 planos · 80 cittas · 28 rūpas · 6 bases · 7 dhātus)",
    },
    explanation: {
      pt: "Única esfera onde surgem todos os 28 Rūpas e os 5 sentidos completos; faltam apenas os 9 Mahaggata-vipākas (89 − 9 = 80).",
      en: "Only sphere with all 28 Rūpas and all 5 physical senses; only the 9 Sublime resultants are absent (89 − 9 = 80).",
      es: "Única esfera con los 28 Rūpas y los 5 sentidos; faltan solo los 9 Mahaggata-vipākas (89 − 9 = 80).",
    },
    chaptersLinked: [3, 4, 5, 6],
  },
  {
    id: "syn:pl:2",
    axis: "realms_bridge",
    asRef: "AS III.66, IV.50, V.7–11, VI.58, 61",
    code: "Brg-02",
    pali: "Rūpaloka (Pañcavokāra): 15 Bhūmi · 64 Citta · 23 Rūpa · 3 Vatthu · 4 Dhātu",
    promptPali: "64 Citta · 23 Rūpa (4 Kalāpa) · 3 Vatthu (Cakkhu·Sota·Hadaya) · 4 Viññāṇadhātu → ?",
    prompt: {
      pt: "Qual esfera possui 64 Cittas (sem Dosa, sem nariz/língua/tato, sem Tadārammaṇa), 23 Rūpas, 3 Vatthus e 4 Viññāṇadhātus?",
      en: "Which sphere has 64 Cittas (no Dosa, no nose/tongue/body, no Tadārammaṇa), 23 Rūpas, 3 Vatthus, and 4 Viññāṇadhātus?",
      es: "¿Qué esfera posee 64 Cittas (sin Dosa, sin olfato/gusto/tacto, sin Tadārammaṇa), 23 Rūpas, 3 Vatthus y 4 Viññāṇadhātus?",
    },
    answerPali: "Rūpaloka (15 planos com mente; +1 Asañña = 16)",
    answer: {
      pt: "Rūpaloka — Esfera da Matéria Sutil (64 cittas · 23 rūpas · 3 bases · 4 dhātus)",
      en: "Rūpaloka — Fine-Material Realm (64 cittas · 23 rūpas · 3 bases · 4 dhātus)",
      es: "Rūpaloka — Esfera de Materia Sutil (64 cittas · 23 rūpas · 3 bases · 4 dhātus)",
    },
    explanation: {
      pt: "Em Rūpaloka faltam 5 Rūpas (Ghāna, Jivhā, Kāya, Itthibhāva, Pumbhāva → 28 − 5 = 23), restando apenas 3 bases (Olho, Ouvido, Coração) e 4 dhātus.",
      en: "In Rūpaloka 5 Rūpas are absent (Nose, Tongue, Body, 2 Sexes → 28 − 5 = 23), leaving 3 bases (Eye, Ear, Heart) and 4 dhātus.",
      es: "En Rūpaloka faltan 5 Rūpas (Nariz, Lengua, Cuerpo, 2 Sexos → 23), quedando 3 bases y 4 dhātus.",
    },
    chaptersLinked: [3, 4, 5, 6],
  },
  {
    id: "syn:pl:3",
    axis: "realms_bridge",
    asRef: "AS III.67, IV.51, V.12, VI.61",
    code: "Brg-03",
    pali: "Arūpaloka (Catuvokāra): 4 Bhūmi · 42 Citta · 0 Rūpa · 0 Vatthu · 1 Dhātu",
    promptPali: "4 Planos · 42 Citta · 0 Rūpa · 0 Vatthu · 1 Manoviññāṇadhātu (sem Sotāpattimagga)?",
    prompt: {
      pt: "Qual esfera puramente mental tem 4 planos, 42 Cittas (sem 5 sentidos, sem Rūpa-jhāna, sem Sotāpattimagga), 0 Rūpa, 0 Vatthu e 1 Dhātu?",
      en: "Which purely mental sphere has 4 planes, 42 Cittas (no 5 senses, no Rūpa-jhāna, no Sotāpattimagga), 0 Rūpa, 0 Vatthu, and 1 Dhātu?",
      es: "¿Qué esfera puramente mental tiene 4 planos, 42 Cittas (sin 5 sentidos, sin Rūpa-jhāna, sin Sotāpattimagga), 0 Rūpa, 0 Vatthu y 1 Dhātu?",
    },
    answerPali: "Arūpaloka (4 planos · 42 Cittas · 0 Rūpa · 1 Dhātu)",
    answer: {
      pt: "Arūpaloka — Esfera Imaterial (4 planos · 42 cittas · 0 rūpas · 0 bases · 1 dhātu)",
      en: "Arūpaloka — Immaterial Realm (4 planes · 42 cittas · 0 rūpas · 0 bases · 1 dhātu)",
      es: "Arūpaloka — Esfera Inmaterial (4 planos · 42 cittas · 0 rūpas · 0 bases · 1 dhātu)",
    },
    explanation: {
      pt: "Sotāpattimagga requer base física (AS III.70); em Arūpaloka surgem 7 Lokuttaras + 8 Arūpa (Kus/Kir) + 10 Akusala + 16 Kāmasobhana-javana (Kus/Kir) + 1 Manodvārāvajjana = 42 Vīthicittas!",
      en: "Sotāpattimagga requires heart-base (AS III.70); thus Arūpaloka has 7 Lokuttara + 8 Arūpa (Kus/Kir) + 10 Akusala + 16 Kāmasobhana javanas (Kus/Kir) + 1 Manodvārāvajjana = 42 Vīthicittas!",
      es: "Sotāpattimagga requiere base física (AS III.70); en Arūpaloka surgen 7 Lokuttara + 8 Arūpa (Kus/Kir) + 10 Akusala + 16 Kāmasobhana-javana + 1 Manodvārāvajjana = 42 Vīthicittas.",
    },
    chaptersLinked: [3, 4, 5, 6],
  },
  {
    id: "syn:pl:4",
    axis: "realms_bridge",
    asRef: "AS IV.53, V.10, 28, 85, VI.59, 61",
    code: "Brg-04",
    pali: "Asaññasattabhūmi (Ekavokāra): 0 Citta · 17 Rūpa · Jīvitanavaka · 500 Kappas",
    promptPali: "0 Citta · 17 Rūpa · 1 Kalāpa (Jīvitanavaka) · Saññāvirāga 5.º Jhāna · 500 Kappas?",
    prompt: {
      pt: "Qual plano possui 0 Cittas, 17 Rūpas (apenas Jīvitanavaka + Utuja), dura 500 kappas, proíbe Ariyas e resulta do 5.º Jhāna com aversão à percepção?",
      en: "Which plane has 0 Cittas, 17 Rūpas (only Jīvitanavaka + Utuja), lasts 500 kappas, excludes Ariyas, and results from 5th Jhāna with aversion to perception?",
      es: "¿Qué plano posee 0 Cittas, 17 Rūpas (solo Jīvitanavaka + Utuja), dura 500 kappas, excluye Ariyas y resulta del 5.º Jhāna Saññāvirāga?",
    },
    answerPali: "Asaññasattabhūmi (Ekavokāra · 0 Citta · 17 Rūpa)",
    answer: {
      pt: "Asaññasatta — Seres Sem Percepção (0 cittas · 17 rūpas · Jīvitanavaka · 500 kappas)",
      en: "Asaññasatta — Non-Percipient Beings (0 cittas · 17 rūpas · Jīvitanavaka · 500 kappas)",
      es: "Asaññasatta — Seres Sin Percepción (0 cittas · 17 rūpas · Jīvitanavaka · 500 kappas)",
    },
    explanation: {
      pt: "Único plano de 1 agregado (Ekavokāra): apenas Rūpakkhandha (8 Avinibbhoga + Jīvita + Ākāsa + 3 Vikāra + 4 Lakkhaṇa = 17).",
      en: "Sole one-aggregate plane (Ekavokāra): Rūpakkhandha alone (8 Avinibbhoga + Life + Space + 3 Vikāra + 4 Lakkhaṇa = 17).",
      es: "Único plano de 1 agregado (Ekavokāra): solo Rūpakkhandha (8 Avinibbhoga + Jīvita + Ākāsa + 3 Vikāra + 4 Lakkhaṇa = 17).",
    },
    chaptersLinked: [4, 5, 6],
  },

  // ── 4. ANÁLOGOS, PONTES LÓGICAS & EXCEÇÕES INTER-CAPÍTULOS (16 ITENS) ────
  {
    id: "syn:law:1",
    axis: "doctrinal_laws",
    asRef: "AS II.33–34",
    code: "Law-01",
    pali: "11 Aniyatayogino (9 Nānā + 2 Saha) vs. 41 Niyatayogino",
    promptPali: "Issā·Macchera·Kukkucca (3) + Virati (3) + Appamaññā (2) + Māna (1) [nānā] + Thīna·Middha (2) [saha] = ?",
    prompt: {
      pt: "Quantos e quais Cetasikas são ocasionais (Aniyatayogino), quais surgem separadamente (nānā) e qual par surge sempre junto (saha)?",
      en: "How many and which Cetasikas are occasional (Aniyatayogino), which arise separately (nānā), and which pair always arises together (saha)?",
      es: "¿Cuántos y cuáles Cetasikas son ocasionales (Aniyatayogino), cuáles surgen por separado (nānā) y qué par surge siempre junto (saha)?",
    },
    answerPali: "11 Aniyata (9 Nānā + 2 Saha: Thīna-Middha) · 41 Niyata",
    answer: {
      pt: "11 Aniyata (9 separadamente + Thīna-Middha sempre juntos) vs. 41 Niyata fixos",
      en: "11 Occasional (9 separately + Thīna-Middha always together) vs. 41 Fixed (Niyata)",
      es: "11 Ocasionales (9 por separado + Thīna-Middha siempre juntos) vs. 41 Fijos (Niyata)",
    },
    explanation: {
      pt: "AS II.33–34: Os 9 nānā kadāci são Issā, Macchariya, Kukkucca (3), 3 Viratis, 2 Appamaññās e Māna; Thīna-Middha (2) surgem saha. Os outros 41 são Niyata.",
      en: "AS II.33–34: The 9 nānā kadāci are Envy, Stinginess, Remorse, 3 Viratis, 2 Appamaññās, and Conceit; Sloth-Torpor (2) arise saha. Remaining 41 are Niyata.",
      es: "AS II.33–34: Los 9 nānā son Issā, Macchariya, Kukkucca, 3 Viratis, 2 Appamaññās y Māna; Thīna-Middha surgen saha. Los 41 restantes son Niyata.",
    },
    chaptersLinked: [2],
  },
  {
    id: "syn:law:2",
    axis: "doctrinal_laws",
    asRef: "AS II.36–39",
    code: "Law-02",
    pali: "Lokuttara J4=J5 (33=33) vs. Mahaggata J4=32 → J5=30",
    promptPali: "Kasmā Lokuttare 4.º–5.º Jhāne 33=33, Mahaggate pana 32 → 30 (dvayaṃ hīyati)?",
    prompt: {
      pt: "Por que no 5.º Jhāna o total de Cetasikas permanece 33 em Lokuttara (33→33), mas cai em 2 unidades em Mahaggata (32→30)?",
      en: "Why does the 5th Jhāna Cetasika total stay 33 in Lokuttara (33→33), yet drop by 2 in Mahaggata (32→30)?",
      es: "¿Por qué en el 5.º Jhāna el total de Cetasikas sigue siendo 33 en Lokuttara (33→33), pero baja en 2 en Mahaggata (32→30)?",
    },
    answerPali: "Mahaggate 2 Appamaññā (Karuṇā·Muditā) apenti; Lokuttare na santi",
    answer: {
      pt: "Em Mahaggata saem Karuṇā e Muditā (incompatíveis com Upekkhā); em Lokuttara elas já não existiam (e Upekkhā substitui Somanassa na mesma Vedanā)",
      en: "In Mahaggata Karuṇā & Muditā drop (incompatible with Upekkhā); in Lokuttara they were already absent (and Upekkhā replaces Somanassa within 1 Vedanā)",
      es: "En Mahaggata salen Karuṇā y Muditā (incompatibles con Upekkhā); en Lokuttara ya faltaban (y Upekkhā sustituye a Somanassa en la misma Vedanā)",
    },
    explanation: {
      pt: "AS II.36–39: A troca Somanassa → Upekkhā não altera a contagem (ambas são o único cetasika Vedanā). Já em Mahaggata, 5.º Jhāna exclui Karuṇā e Muditā (32 − 2 = 30).",
      en: "AS II.36–39: Swapping Somanassa → Upekkhā keeps Vedanā count at 1. In Mahaggata, 5th Jhāna drops Karuṇā & Muditā (32 − 2 = 30).",
      es: "AS II.36–39: Cambiar Somanassa → Upekkhā mantiene 1 Vedanā. En Mahaggata, el 5.º Jhāna excluye Karuṇā y Muditā (32 − 2 = 30).",
    },
    chaptersLinked: [1, 2],
  },
  {
    id: "syn:law:3",
    axis: "doctrinal_laws",
    asRef: "AS III.27, 34, V.16–18",
    code: "Law-03",
    pali: "Pañcakicca: 2 Upekkhā-santīraṇa (#19 & #27)",
    promptPali: "Kāni dve cittāni pañcakiccāni (Paṭisandhi · Bhavaṅga · Cuti · Tadārammaṇa · Santīraṇa)?",
    prompt: {
      pt: "Quais são as ÚNICAS 2 Cittas de todas as 89 que exercem 5 funções (Pañcakicca) — e também geram renascimento Ahetuka?",
      en: "Which are the ONLY 2 Cittas out of 89 that perform 5 functions (Pañcakicca) — and also link Ahetuka rebirth?",
      es: "¿Cuáles son las ÚNICAS 2 Cittas de 89 que ejercen 5 funciones (Pañcakicca) — y también enlazan renacimiento Ahetuka?",
    },
    answerPali: "2 Upekkhā-santīraṇa (#19 Akusalavipāka & #27 Kusalavipāka)",
    answer: {
      pt: "As 2 Upekkhā-santīraṇas (#19 Apāya-paṭisandhi e #27 Sugati-ahetuka-paṭisandhi)",
      en: "The 2 Upekkhā-santīraṇas (#19 Woeful rebirth & #27 Blissful rootless rebirth)",
      es: "Las 2 Upekkhā-santīraṇas (#19 Apāya-paṭisandhi y #27 Sugati-ahetuka-paṭisandhi)",
    },
    explanation: {
      pt: "AS III.27 e V.16–18: Exercem Paṭisandhi, Bhavaṅga, Cuti, Tadārammaṇa e Santīraṇa (5 funções). Os 8 Mahāvipākas exercem 4 (Catukicca).",
      en: "AS III.27 & V.16–18: Perform Rebirth, Bhavaṅga, Death, Registration, and Investigation (5 functions). The 8 Mahāvipākas perform 4.",
      es: "AS III.27 y V.16–18: Ejercen Paṭisandhi, Bhavaṅga, Cuti, Tadārammaṇa y Santīraṇa (5 funciones). Los 8 Mahāvipākas ejercen 4.",
    },
    chaptersLinked: [1, 3, 5],
  },
  {
    id: "syn:law:4",
    axis: "doctrinal_laws",
    asRef: "AS III.70–71, IV.51",
    code: "Law-04",
    pali: "Sotāpattimagga: Único Lokuttara Ekantena Vatthunissita",
    promptPali: "Aṭṭhasu lokuttaresu katamaṃ ekameva ekantena hadayavatthunissitaṃ (Arūpaloke na labbhati)?",
    prompt: {
      pt: "Entre as 8 [40] Cittas Lokuttara, qual é a ÚNICA que depende exclusivamente do Hadayavatthu (e nunca surge pela 1.ª vez em Arūpaloka)?",
      en: "Among the 8 [40] Lokuttara Cittas, which is the ONLY one strictly dependent on Hadayavatthu (and never first arises in Arūpaloka)?",
      es: "Entre las 8 [40] Cittas Lokuttara, ¿cuál es la ÚNICA que depende exclusivamente de Hadayavatthu (ausente en Arūpaloka)?",
    },
    answerPali: "Paṭhamamagga / Sotāpattimagga (1 em 8 · 5 em 40)",
    answer: {
      pt: "Sotāpattimagga (Caminho do Entrante na Corrente) — requer ouvir o Dhamma (Paratoghosa)",
      en: "Sotāpattimagga (Stream-Entry Path) — requires hearing the Dhamma via physical ear",
      es: "Sotāpattimagga (Camino del Entrante en la Corriente) — requiere oír el Dhamma",
    },
    explanation: {
      pt: "AS III.70–71: As outras 7 Lokuttara (35 em 121) são nissāya vā anissāya vā (podem surgir em Arūpaloka sem base física).",
      en: "AS III.70–71: The other 7 Lokuttara (35 in 121) are nissāya vā anissāya vā (can arise in Arūpaloka without a physical base).",
      es: "AS III.70–71: Las otras 7 Lokuttara (35 en 121) son nissāya vā anissāya vā (pueden surgir en Arūpaloka).",
    },
    chaptersLinked: [1, 3, 4],
  },
  {
    id: "syn:law:5",
    axis: "doctrinal_laws",
    asRef: "AS V.69, I.6",
    code: "Law-05",
    pali: "Uddhacca-sahagata (#12): Único Akusala que NÃO dá Paṭisandhi",
    promptPali: "Dvādasasu akusalesu katamaṃ ekameva paṭisandhiṃ na janeti (pavattiyameva 7 vipāke deti)?",
    prompt: {
      pt: "Entre as 12 Cittas Akusala, qual é a ÚNICA incapaz de gerar Paṭisandhi nos Apāyas (gerando apenas os 7 Vipākas durante a vida)?",
      en: "Among the 12 Akusala Cittas, which is the ONLY one unable to produce rebirth in Apāya (producing only the 7 Vipākas during life)?",
      es: "Entre las 12 Cittas Akusala, ¿cuál es la ÚNICA incapaz de generar Paṭisandhi en Apāya (dando solo 7 Vipākas en pavatti)?",
    },
    answerPali: "Uddhacca-sampayutta (#12 Mohamūla · 11 dão Paṭisandhi)",
    answer: {
      pt: "Uddhacca-sampayutta (#12) — apenas 11 Akusalas geram Paṭisandhi; todas as 12 geram os 7 Akusala-vipākas em pavatti",
      en: "Uddhacca-sampayutta (#12) — only 11 Akusalas link rebirth; all 12 yield the 7 Akusala-vipākas during life",
      es: "Uddhacca-sampayutta (#12) — solo 11 Akusalas dan Paṭisandhi; las 12 dan los 7 Vipākas en pavatti",
    },
    explanation: {
      pt: "AS V.69: A agitação pura (Uddhacca sem Dosa/Lobha/Vicikicchā) é fraca demais para projetar renascimento (Janaka-kamma em Paṭisandhi).",
      en: "AS V.69: Pure restlessness (Uddhacca alone) is too weak to project rebirth-linking, though it ripens in pavatti.",
      es: "AS V.69: La inquietud pura (Uddhacca) es demasiado débil para proyectar Paṭisandhi, pero madura en pavatti.",
    },
    chaptersLinked: [1, 5],
  },
  {
    id: "syn:law:6",
    axis: "doctrinal_laws",
    asRef: "AS IV.8–11, VI.56",
    code: "Law-06",
    pali: "Constante 17 Cittakkhaṇa (51 Submomentos): Rūpa = Atimahanta = Morte",
    promptPali: "Sattarasa cittakkhaṇāni (51 khaṇa) — qual é o triplo análogo entre Cap. 4 e Cap. 6?",
    prompt: {
      pt: "Qual constante temporal de 17 momentos mentais (51 submomentos) unifica a vida do Rūpa, o curso Atimahanta e a cessação da matéria na morte?",
      en: "Which temporal constant of 17 mind-moments (51 sub-moments) unifies Rūpa's lifespan, the Atimahanta course, and death-cessation of matter?",
      es: "¿Qué constante temporal de 17 momentos mentales (51 submomentos) unifica la vida del Rūpa, Atimahanta y el cese material en la muerte?",
    },
    answerPali: "17 Cittakkhaṇa = Vida do Rūpa = 1+2+14 (Atimahanta) = 17.º Citta antes de Cuti",
    answer: {
      pt: "17 Cittakkhaṇas: duração de 1 Rūpa (AS IV.8), 1+2+14 no curso Atimahanta (AS IV.11) e fim do Kammaja-rūpa no 17.º citta antes de Cuti (AS VI.56)",
      en: "17 Cittakkhaṇas: lifespan of 1 Rūpa (AS IV.8), 1+2+14 in Atimahanta (AS IV.11), and halt of Kammaja-rūpa at the 17th citta before Cuti (AS VI.56)",
      es: "17 Cittakkhaṇas: vida de 1 Rūpa (AS IV.8), 1+2+14 en Atimahanta (AS IV.11) y fin del Kammaja-rūpa en el 17.º citta antes de Cuti (AS VI.56)",
    },
    explanation: {
      pt: "AS IV.8–11 e VI.56: Como o último Kammaja-rūpa nasce no 17.º citta antes de Cuti, ele dissolve exatamente junto com o último submomento de Cuti!",
      en: "AS IV.8–11 & VI.56: Because the last Kammaja-rūpa arises at the 17th citta before Cuti, it dissolves at the exact final sub-moment of Cuti!",
      es: "AS IV.8–11 y VI.56: Al nacer el último Kammaja-rūpa en el 17.º citta antes de Cuti, se disuelve justo con Cuti.",
    },
    chaptersLinked: [4, 6],
  },
  {
    id: "syn:law:7",
    axis: "doctrinal_laws",
    asRef: "AS VI.31, 34",
    code: "Law-07",
    pali: "Cittaja-rūpa (75) · Viññatti (32) · Hasana / Riso (13)",
    promptPali: "75 Cittaja-rūpa · 32 Viññatti · 13 Hasana (4 Lobha + 4 Kusala + 4 Kiriya + Hasituppāda)?",
    prompt: {
      pt: "Na cascata de Cittas que produzem matéria (AS VI.31–34), quais são os 3 números exatos para Cittaja-rūpa, Viññatti e Riso (Hasana)?",
      en: "In the cascade of matter-producing Cittas (AS VI.31–34), what are the 3 exact counts for Cittaja-rūpa, Viññatti, and Laughter (Hasana)?",
      es: "En la cascada de Cittas que producen materia (AS VI.31–34), ¿cuáles son los 3 números exactos para Cittaja-rūpa, Viññatti y Risa (Hasana)?",
    },
    answerPali: "75 Cittaja (−10 sentidos −4 Arūpavipāka) · 32 Viññatti · 13 Hasana",
    answer: {
      pt: "75 geram matéria (89 − 14) · 32 geram intimação (Viññatti) · 13 geram riso (4 Lobha + 4 Kus + 4 Kir + Hasituppāda)",
      en: "75 produce matter (89 − 14) · 32 produce intimation (Viññatti) · 13 produce laughter (4 Lobha + 4 Kus + 4 Kir + Hasituppāda)",
      es: "75 generan materia (89 − 14) · 32 generan intimación (Viññatti) · 13 generan risa (4 Lobha + 4 Kus + 4 Kir + Hasituppāda)",
    },
    explanation: {
      pt: "AS VI.31–34: O Puthujjana ri com 8 (4 Lobha + 4 Kusala), o Sekkha com 6 (excl. 2 Diṭṭhi) e o Arahant com 5 (4 Mahākiriya-som + Hasituppāda).",
      en: "AS VI.31–34: Worldlings smile with 8 (4 Lobha + 4 Kusala), Sekkhas with 6 (no Diṭṭhi), and Arahants with 5 (4 Mahākiriya-som + Hasituppāda).",
      es: "AS VI.31–34: Puthujjana ríe con 8, Sekkha con 6 y Arahant con 5 (4 Mahākiriya-som + Hasituppāda).",
    },
    chaptersLinked: [1, 6],
  },
  {
    id: "syn:law:8",
    axis: "doctrinal_laws",
    asRef: "AS VII.7–8, 14",
    code: "Law-08",
    pali: "Paradoxo Vatthuto: 4 Upādāna → 2 Reais vs. 6 Nīvaraṇa → 8 Reais",
    promptPali: "Kasmā 4 Upādānā = 2 vatthuto, 6 Nīvaraṇāni pana = 8 vatthuto (AS VII.14)?",
    prompt: {
      pt: "No Akusala-saṅgaha (Cap. 7), qual par ilustra a contração máxima (4 → 2) e a única expansão (6 → 8) ao reduzir nomes a dhammas reais?",
      en: "In Akusala-saṅgaha (Ch. 7), which pair illustrates maximum contraction (4 → 2) and the sole expansion (6 → 8) from nominal to real dhammas?",
      es: "En Akusala-saṅgaha (Cap. 7), ¿qué par ilustra la contracción máxima (4 → 2) y la única expansión (6 → 8) al reducir a dhammas reales?",
    },
    answerPali: "4 Upādāna → 2 (Lobha + 3×Diṭṭhi) · 6 Nīvaraṇa → 8 (Thīna+Middha & Uddhacca+Kukkucca)",
    answer: {
      pt: "Upādāna contrai 4 → 2 (3 são Diṭṭhi!); Nīvaraṇa expande 6 → 8 (2 pares: Thīna+Middha e Uddhacca+Kukkucca)",
      en: "Upādāna shrinks 4 → 2 (3 are Diṭṭhi!); Nīvaraṇa expands 6 → 8 (2 pairs: Thīna+Middha and Uddhacca+Kukkucca)",
      es: "Upādāna contrae 4 → 2 (3 son Diṭṭhi); Nīvaraṇa expande 6 → 8 (2 pares: Thīna+Middha y Uddhacca+Kukkucca)",
    },
    explanation: {
      pt: "AS VII.13–14: Todos os outros grupos Akusala contraem ou ficam iguais (10 Kilesas = 10); só Nīvaraṇa tem mais dhammas reais (8) do que nomes (6).",
      en: "AS VII.13–14: Every other Akusala group contracts or stays equal (10 Kilesas = 10); only Nīvaraṇa has more real dhammas (8) than names (6).",
      es: "AS VII.13–14: Solo Nīvaraṇa tiene más dhammas reales (8) que nombres (6), mientras Upādāna colapsa 3 de 4 en Diṭṭhi.",
    },
    chaptersLinked: [2, 7],
  },
  {
    id: "syn:law:9",
    axis: "doctrinal_laws",
    asRef: "AS VII.10–11, 14",
    code: "Law-09",
    pali: "Duelo Saṃyojana: Suttanta (7 reais) vs. Abhidhamma (8 reais) → União = 9",
    promptPali: "Suttante Rūparāga·Arūparāga·Uddhacca vs. Abhidhamme Bhavarāga·Issā·Macchariya → União?",
    prompt: {
      pt: "Quais 3 termos mudam entre os 10 Saṃyojanas Suttanta e os 10 Abhidhamma, e qual é a redução vatthuto de cada lista e da união?",
      en: "Which 3 terms differ between the 10 Suttanta Fetters and 10 Abhidhamma Fetters, and what is the real count of each list and their union?",
      es: "¿Qué 3 términos cambian entre los 10 Saṃyojanas Suttanta y los 10 Abhidhamma, y cuál es el conteo real de cada uno y su unión?",
    },
    answerPali: "Suttanta (7) + Abhidhamma (8: +Issā, +Macchariya, −Uddhacca) → União = 9 reais",
    answer: {
      pt: "Suttanta = 7 reais (+Uddhacca); Abhidhamma = 8 reais (+Issā, +Macchariya, funde Rūpa/Arūpa em Bhavarāga); União = 9 reais",
      en: "Suttanta = 7 real (+Uddhacca); Abhidhamma = 8 real (+Issā, +Macchariya, merges Rūpa/Arūpa into Bhavarāga); Union = 9 real",
      es: "Suttanta = 7 reales (+Uddhacca); Abhidhamma = 8 reales (+Issā, +Macchariya); Unión = 9 reales",
    },
    explanation: {
      pt: "AS VII.10–11, 14: Os 9 reais da união são Lobha, Dosa, Māna, Diṭṭhi, Vicikicchā, Uddhacca, Moha, Issā e Macchariya.",
      en: "AS VII.10–11, 14: The 9 real union dhammas are Lobha, Dosa, Māna, Diṭṭhi, Vicikicchā, Uddhacca, Moha, Issā, and Macchariya.",
      es: "AS VII.10–11, 14: Los 9 reales de la unión son Lobha, Dosa, Māna, Diṭṭhi, Vicikicchā, Uddhacca, Moha, Issā y Macchariya.",
    },
    chaptersLinked: [2, 7],
  },
  {
    id: "syn:law:10",
    axis: "doctrinal_laws",
    asRef: "AS VII.47, 52–53",
    code: "Law-10",
    pali: "Dhammāyatana = 69 (52+16+1) & Excluídos das 4 Verdades (AS VII.53)",
    promptPali: "Ekūnasattati Dhammāyatanaṃ (52+16+1) & Catusacca-vinissaṭā dhammā (AS VII.53)?",
    prompt: {
      pt: "Quais 69 dhammas formam Dhammāyatana/Dhammadhātu, e quais dhammas ficam FORA das 4 Nobres Verdades em AS VII.53?",
      en: "Which 69 dhammas form Dhammāyatana/Dhammadhātu, and which dhammas stand OUTSIDE the 4 Noble Truths in AS VII.53?",
      es: "¿Qué 69 dhammas forman Dhammāyatana/Dhammadhātu, y cuáles quedan FUERA de las 4 Nobles Verdades en AS VII.53?",
    },
    answerPali: "69 = 52 Cetasikas + 16 Sukhumarūpas + 1 Nibbāna · Fora das 4 Verdades: 29 associados ao Magga + 4 Phalas",
    answer: {
      pt: "69 = 52 Cetasikas + 16 Rūpas sutis + 1 Nibbāna · Fora das 4 Verdades: 29 associados ao Magga (incl. Maggacitta) e os 4 Phalas (+36 cetasikas)",
      en: "69 = 52 Cetasikas + 16 Subtle Rūpas + 1 Nibbāna · Outside 4 Truths: 29 Path-conjoined states (incl. Path-citta) and 4 Fruits (+36 cetasikas)",
      es: "69 = 52 Cetasikas + 16 Rūpas sutiles + 1 Nibbāna · Fuera de 4 Verdades: 29 asociados al Magga y los 4 Phalas",
    },
    explanation: {
      pt: "AS VII.47 e 53: Nas 4 Verdades, Maggasacca inclui apenas os 8 fatores do caminho; o resto do Maggacitta e os 4 Phalas são Catusacca-vinissaṭa.",
      en: "AS VII.47 & 53: In the 4 Truths, Maggasacca holds only the 8 path factors; the remaining Path states and 4 Fruits stand outside.",
      es: "AS VII.47 y 53: En las 4 Verdades, Maggasacca solo incluye los 8 factores; el resto del Magga y los 4 Phalas quedan fuera.",
    },
    chaptersLinked: [1, 2, 6, 7],
  },
  {
    id: "syn:law:11",
    axis: "doctrinal_laws",
    asRef: "AS VII.39–40",
    code: "Law-11",
    pali: "37 Bodhipakkhiyā → 14 Sabhāvadhammā (9 + 8 + 5 + 4 + 2 + 9×1 = 37)",
    promptPali: "Vīriya (9) · Sati (8) · Paññā (5) · Samādhi (4) · Saddhā (2) · Navekaṭhānā (9×1) = ?",
    prompt: {
      pt: "Como os 37 Fatores da Iluminação (4+4+4+5+5+7+8) se reduzem a 14 Sabhāva-dhammas, e qual deles é o único Citta?",
      en: "How do the 37 Wings to Awakening (4+4+4+5+5+7+8) reduce to 14 Sabhāva-dhammas, and which single one is Citta?",
      es: "¿Cómo se reducen los 37 Factores del Despertar a 14 Sabhāva-dhammas, y cuál de ellos es la única Citta?",
    },
    answerPali: "14 Sabhāva (Vīriya 9, Sati 8, Paññā 5, Samādhi 4, Saddhā 2, 9×1) · Citta = Cittiddhipāda",
    answer: {
      pt: "14 Sabhāvas: Vīriya (9), Sati (8), Paññā (5), Samādhi (4), Saddhā (2) e 9 de 1 lugar — sendo Citta (em Cittiddhipāda) a única consciência",
      en: "14 Sabhāvas: Vīriya (9), Sati (8), Paññā (5), Samādhi (4), Saddhā (2), and 9 single-place — Citta (in Cittiddhipāda) is the sole consciousness",
      es: "14 Sabhāvas: Vīriya (9), Sati (8), Paññā (5), Samādhi (4), Saddhā (2) y 9 de 1 lugar — Citta (en Cittiddhipāda) es la única conciencia",
    },
    explanation: {
      pt: "AS VII.39–40: Todos os demais 13 são Cetasikas (incluindo os 3 Viratis). Em Lokuttara J2–J5 faltam Sammāsaṅkappa (Vitakka) e/ou Pīti (AS VII.41).",
      en: "AS VII.39–40: The other 13 are Cetasikas (including 3 Viratis). In higher Lokuttara Jhānas Vitakka and/or Pīti are absent (AS VII.41).",
      es: "AS VII.39–40: Los otros 13 son Cetasikas. En Lokuttara J2–J5 faltan Vitakka y/o Pīti (AS VII.41).",
    },
    chaptersLinked: [2, 7, 9],
  },
  {
    id: "syn:law:12",
    axis: "doctrinal_laws",
    asRef: "AS VIII.11",
    code: "Law-12",
    pali: "Bhava (Elo #10): Único Elo em 2 Vaṭṭas (Kammabhava + Upapattibhava)",
    promptPali: "Dvādasaṅgesu katamaṃ ekameva ubhayavaṭṭagataṃ (Kammavaṭṭañca Vipākavaṭṭañca)?",
    prompt: {
      pt: "Nos 12 elos de Paṭiccasamuppāda, qual é o ÚNICO elo que se divide entre duas Rodas (Kammavaṭṭa e Vipākavaṭṭa) e abre Sandhi #3?",
      en: "Among the 12 links of Paṭiccasamuppāda, which is the ONLY link split across two Rounds (Kammavaṭṭa and Vipākavaṭṭa) and opening Sandhi #3?",
      es: "Entre los 12 eslabones de Paṭiccasamuppāda, ¿cuál es el ÚNICO dividido en dos Ruedas (Kammavaṭṭa y Vipākavaṭṭa) abriendo Sandhi #3?",
    },
    answerPali: "Bhava (Elo #10: Kammabhava ∈ Kamma · Upapattibhava ∈ Vipāka)",
    answer: {
      pt: "Bhava (Elo #10): Kammabhava pertence ao Kammavaṭṭa e Upapattibhava ao Vipākavaṭṭa",
      en: "Bhava (Link #10): Kammabhava belongs to Kammavaṭṭa and Upapattibhava to Vipākavaṭṭa",
      es: "Bhava (Eslabón #10): Kammabhava pertenece a Kammavaṭṭa y Upapattibhava a Vipākavaṭṭa",
    },
    explanation: {
      pt: "AS VIII.11: Kilesavaṭṭa = Avijjā, Taṇhā, Upādāna (3); Kammavaṭṭa = Saṅkhārā + Kammabhava (2); Vipākavaṭṭa = os 7 restantes + Upapattibhava.",
      en: "AS VIII.11: Kilesavaṭṭa = 3; Kammavaṭṭa = Saṅkhārā + Kammabhava (2); Vipākavaṭṭa = remaining 7 + Upapattibhava.",
      es: "AS VIII.11: Kilesavaṭṭa = 3; Kammavaṭṭa = Saṅkhārā + Kammabhava (2); Vipākavaṭṭa = los 7 restantes + Upapattibhava.",
    },
    chaptersLinked: [5, 8],
  },
  {
    id: "syn:law:13",
    axis: "doctrinal_laws",
    asRef: "AS VIII.18–19",
    code: "Law-13",
    pali: "Dualidade Única do Paṭṭhāna: Pacchājāta (#11, Nāma→Rūpa) vs. Purejāta (#10, Rūpa→Nāma)",
    promptPali: "Ekadhā nāmaṃ rūpassa (#11) vs. Ekadhā rūpaṃ nāmassa (#10) — quais 2 condições?",
    prompt: {
      pt: "Na matriz direcional 6+5+1+1+2+9 do Paṭṭhāna, qual par de condições simétricas ocupa sozinho Nāma → Rūpa (1) e Rūpa → Nāma (1)?",
      en: "In the 6+5+1+1+2+9 Paṭṭhāna directional matrix, which symmetric pair uniquely occupies Nāma → Rūpa (1) and Rūpa → Nāma (1)?",
      es: "En la matriz direccional 6+5+1+1+2+9 del Paṭṭhāna, ¿qué par simétrico ocupa en exclusiva Nāma → Rūpa (1) y Rūpa → Nāma (1)?",
    },
    answerPali: "#11 Pacchājāta (Nāma → Rūpa) & #10 Purejāta (Rūpa → Nāma)",
    answer: {
      pt: "#11 Pacchājāta (única Nāma → Rūpa) e #10 Purejāta (única Rūpa → Nāma)",
      en: "#11 Pacchājāta (sole Nāma → Rūpa) and #10 Purejāta (sole Rūpa → Nāma)",
      es: "#11 Pacchājāta (única Nāma → Rūpa) y #10 Purejāta (única Rūpa → Nāma)",
    },
    explanation: {
      pt: "AS VIII.18–19: Mente posterior sustenta matéria anterior (#11 Pacchājāta); matéria pré-nascida (6 bases + 5 objetos) condiciona mente posterior (#10 Purejāta).",
      en: "AS VIII.18–19: Later mind supports earlier body (#11 Postnascence); prenascent matter (6 bases + 5 objects) conditions later mind (#10 Prenascence).",
      es: "AS VIII.18–19: Mente posterior sostiene materia previa (#11 Pacchājāta); materia prenascente condiciona mente posterior (#10 Purejāta).",
    },
    chaptersLinked: [6, 8],
  },
  {
    id: "syn:law:14",
    axis: "doctrinal_laws",
    asRef: "AS VI.64, IX.44–48, 61–67",
    code: "Law-14",
    pali: "Espelho Cap. 6 ↔ Cap. 9: Anattā→Suññata · Anicca→Animitta · Dukkha→Appaṇihita",
    promptPali: "Tilakkhaṇa (Anattā · Anicca · Dukkha) ↔ Tayo Nibbānākārā / Vimokkhā?",
    prompt: {
      pt: "Como as 3 Marcas da Existência (Cap. 9) se espelham nos 3 Aspectos de Nibbāna (Cap. 6) e nos 3 Vimokkhas do Magga?",
      en: "How do the 3 Marks of Existence (Ch. 9) mirror the 3 Aspects of Nibbāna (Ch. 6) and the 3 Path Liberations (Vimokkha)?",
      es: "¿Cómo se reflejan las 3 Marcas de la Existencia (Cap. 9) en los 3 Aspectos de Nibbāna (Cap. 6) y los 3 Vimokkhas?",
    },
    answerPali: "Anattā → Suññata · Anicca → Animitta · Dukkha → Appaṇihita",
    answer: {
      pt: "Anattā → Suññata (Vazio) · Anicca → Animitta (Sem-Signos) · Dukkha → Appaṇihita (Sem-Desejo)",
      en: "Anattā → Suññata (Empty) · Anicca → Animitta (Signless) · Dukkha → Appaṇihita (Undirected)",
      es: "Anattā → Suññata (Vacío) · Anicca → Animitta (Sin-Signos) · Dukkha → Appaṇihita (Sin-Deseo)",
    },
    explanation: {
      pt: "AS VI.64 e IX.61–66: A porta de contemplação de Vuṭṭhānagāminī-vipassanā nomeia tanto o Magga quanto o Phala na mesma via.",
      en: "AS VI.64 & IX.61–66: The contemplation doorway of Vuṭṭhānagāminī-vipassanā names both the Path and its immediate Fruition.",
      es: "AS VI.64 y IX.61–66: La puerta de contemplación de Vuṭṭhānagāminī-vipassanā da nombre al Magga y al Phala.",
    },
    chaptersLinked: [6, 9],
  },
  {
    id: "syn:law:15",
    axis: "doctrinal_laws",
    asRef: "AS IV.22–24, IX.21–25",
    code: "Law-15",
    pali: "Matriz Appanā (32 + 12 + 8 + 6 = 58) & 30 Objetos de Appanā (11+11+3+1+4)",
    promptPali: "32 + 12 + 8 + 6 = 58 Appanā-cittas (Cap. 4) ↔ 30 Samatha Appanā (Cap. 9)?",
    prompt: {
      pt: "Como se conectam as 58 Cittas de Appanā (32+12+8+6 no Cap. 4) e os 30 objetos de Samatha que atingem Appanā (Cap. 9)?",
      en: "How do the 58 Appanā Cittas (32+12+8+6 in Ch. 4) connect to the 30 Samatha subjects reaching Appanā (Ch. 9)?",
      es: "¿Cómo se conectan las 58 Cittas de Appanā (32+12+8+6 en Cap. 4) con los 30 objetos de Samatha que alcanzan Appanā (Cap. 9)?",
    },
    answerPali: "58 Appanā (32 Som-Kus + 12 Upe-Kus + 8 Som-Kir + 6 Upe-Kir) · 30 Objetos = 11(5J) + 11(1J) + 3(4J) + 1(5J) + 4(Arūpa)",
    answer: {
      pt: "58 Appanās (32+12+8+6 por sensação e Jāti) e 30 objetos Appanā (11 cinco-jhānas + 11 1.º-jhāna + 3 quatro-jhānas + 1 só-5.º + 4 Āruppas)",
      en: "58 Appanās (32+12+8+6 by feeling & Jāti) and 30 Appanā subjects (11 five-jhāna + 11 1st-jhāna + 3 four-jhāna + 1 fifth-only + 4 Āruppas)",
      es: "58 Appanās (32+12+8+6 por sensación y Jāti) y 30 objetos Appanā (11 cinco-jhānas + 11 1.º + 3 cuatro + 1 solo-5.º + 4 Āruppas)",
    },
    explanation: {
      pt: "AS IV.22–24 e IX.19–25: Dos 40 objetos de Samatha, 10 ficam em Upacāra e 30 alcançam Appanā; a transição exige igualdade de Vedanā e Jāti.",
      en: "AS IV.22–24 & IX.19–25: Of 40 Samatha subjects, 10 stop at Upacāra and 30 reach Appanā; transition strictly matches Vedanā and Jāti.",
      es: "AS IV.22–24 y IX.19–25: De 40 objetos Samatha, 10 quedan en Upacāra y 30 logran Appanā, exigiendo igualdad de Vedanā y Jāti.",
    },
    chaptersLinked: [1, 4, 9],
  },
  {
    id: "syn:law:16",
    axis: "doctrinal_laws",
    asRef: "AS IX.60, 71",
    code: "Law-16",
    pali: "19 Paccavekkhaṇā-ñāṇas (5 + 5 + 5 + 4 nos 4 Caminhos)",
    promptPali: "Magga · Phala · Nibbāna (3 fixas) + Pahīna-kilesa · Avasesa-kilesa (2 opcionais) → Total nos 4 Maggas?",
    prompt: {
      pt: "Por que os 4 Caminhos Nobres geram no máximo 19 Conhecimentos de Revisão (Paccavekkhaṇā) em vez de 20 (AS IX.60)?",
      en: "Why do the 4 Noble Paths yield at most 19 Reviewing Knowledges (Paccavekkhaṇā) instead of 20 (AS IX.60)?",
      es: "¿Por qué los 4 Caminos Nobles generan como máximo 19 Conocimientos de Revisión (Paccavekkhaṇā) en vez de 20 (AS IX.60)?",
    },
    answerPali: "5 + 5 + 5 + 4 = 19 (Arahant não tem Avasesa-kilesa / impurezas restantes!)",
    answer: {
      pt: "19 (5 + 5 + 5 + 4): o Arahant erradicou todas as impurezas, logo não existe revisão de impurezas remanescentes (Avasesa-kilesa)",
      en: "19 (5 + 5 + 5 + 4): the Arahant has eradicated all defilements, so there is no reviewing of remaining defilements (Avasesa-kilesa)",
      es: "19 (5 + 5 + 5 + 4): el Arahant erradicó todas las impurezas, por lo que no existe revisión de impurezas restantes",
    },
    explanation: {
      pt: "AS IX.60: Magga, Phala e Nibbāna são revisados obrigatoriamente; kilesas abandonados e restantes são opcionais (e este último inexiste no Arahant).",
      en: "AS IX.60: Path, Fruit, and Nibbāna are necessarily reviewed; abandoned and remaining defilements are optional (the latter impossible for an Arahant).",
      es: "AS IX.60: Magga, Phala y Nibbāna son revisados necesariamente; kilesas abandonados y restantes son opcionales (este último no existe en el Arahant).",
    },
    chaptersLinked: [1, 9],
  },
];
