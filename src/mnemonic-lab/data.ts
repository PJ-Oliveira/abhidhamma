/**
 * Canonical Trilingual Database (PT / EN / ES + Pāli) for the Mnemonic Laboratory.
 * Strictly based on the Abhidhammatthasaṅgaha (Ācariya Anuruddha),
 * A Comprehensive Manual of Abhidhamma (Bhikkhu Bodhi), and the project's Normative Glossary.
 */

import type { UiLang } from "../types.js";

export type LocalizedText = Readonly<Record<UiLang, string>>;

export type CittaBhumiId = "kama" | "rupa" | "arupa" | "lokuttara";
export type CittaFamilyId =
  | "lobha"
  | "dosa"
  | "moha"
  | "ahetuka"
  | "kamasobhana"
  | "rupavacara"
  | "arupavacara"
  | "lokuttara";

export type JatiId = "akusala" | "vipaka" | "kiriya" | "kusala";
export type VedanaBit = 1 | 0 | "domanassa" | "sukha" | "dukkha";
export type CognitiveBit = 1 | 0 | "patigha" | "vicikiccha" | "uddhacca";
export type SankharaBit = 1 | 0 | "fixed";

export interface CanonicalCitta {
  readonly id: number; // 1..89 or 1..121
  readonly code: string; // e.g., "Lobha #1 [1·1·1]", "MK3 [1·0·1]", "R-Ku J1", "Lok-Mag-Sot-J1"
  readonly family: CittaFamilyId;
  readonly bhumi: CittaBhumiId;
  readonly jati: JatiId;
  readonly pali: string;
  readonly name: LocalizedText;
  readonly bitVedana: VedanaBit;
  readonly bitCognitive: CognitiveBit;
  readonly bitSankhara: SankharaBit;
  readonly jhanaStage?: 1 | 2 | 3 | 4 | 5;
  readonly arupaBase?: 1 | 2 | 3 | 4;
  readonly maggaStage?: 1 | 2 | 3 | 4;
  readonly formulaNote: LocalizedText;
  /** IDs (1..52) of the fixed/constant Cetasikas that always arise in this Citta */
  readonly fixedCetasikas: readonly number[];
  /** IDs (1..52) of the occasional/variable (aniyata) Cetasikas that may arise in this Citta */
  readonly optionalCetasikas: readonly number[];
  /** Maximum total number of Cetasikas according to the Saṅgaha-naya (AS II.18-29) */
  readonly totalSangahaCount: number;
  readonly asRef: string;
  /** Canonical Hetu classification (AS III.5-7): ahetuka, ekahetuka, dvihetuka, tihetuka */
  readonly hetuType?: "ahetuka" | "ekahetuka" | "dvihetuka" | "tihetuka";
  /** Canonical Kicca functions (AS III.8-11) */
  readonly kiccaPali?: string;
  /** Canonical Dvāra doors (AS III.12-15) */
  readonly dvaraPali?: string;
  /** Canonical Ālambaṇa objects (AS III.16-18) */
  readonly arammanaPali?: string;
  /** Physical Vatthu bases (AS III.19-22) */
  readonly vatthuPali?: string;
  /** Jhāna factors present (Jhānaṅga) */
  readonly jhanaFactorsPali?: string;
  /** Eradication/elimination of kilesas and saṃyojanas (AS I, II) */
  readonly eradicationNote?: LocalizedText;
}

export type PeriodicBlockId =
  | "citta"
  | "sabbacitta"
  | "pakinnaka"
  | "akusala_univ"
  | "akusala_lobha"
  | "akusala_dosa"
  | "akusala_thina"
  | "akusala_vicikiccha"
  | "sobhana_univ"
  | "sobhana_virati"
  | "sobhana_appamanna"
  | "sobhana_panna"
  | "rupa_mahabhuta"
  | "rupa_pasada"
  | "rupa_gocara"
  | "rupa_bhava"
  | "rupa_hadaya"
  | "rupa_jivita"
  | "rupa_ahara"
  | "rupa_pariccheda"
  | "rupa_vinnatti"
  | "rupa_vikara"
  | "rupa_lakkhana"
  | "nibbana";

export interface SabhavaElement {
  /** Atomic number in the Periodic Table of the 82 Realities (1..72 Sabhāva + 73..82 Anipphanna-rūpa) */
  readonly atomicNumber: number;
  /** If Cetasika, its canonical ID (1..52); if Rūpa, (1..28: 1..18 Nipphanna + 19..28 Anipphanna) */
  readonly subId: number;
  readonly paramattha: "citta" | "cetasika" | "rupa" | "nibbana";
  readonly block: PeriodicBlockId;
  readonly symbol: string;
  readonly pali: string;
  readonly name: LocalizedText;
  readonly lakkhana: LocalizedText;
  /** In how many of the 89 (or 121) Cittas this element enters (for Cetasikas) or structural rule */
  readonly valenceRule: LocalizedText;
  readonly cittaCount89?: number;
  readonly cittaCount121?: number;
  readonly isAvinibbhoga?: boolean; // Inseparable material octad
  readonly isAnipphanna?: boolean; // 10 non-concrete Rūpas (AS VI.4)
}

export interface OntologicalCollisionRule {
  readonly id: string;
  readonly asRef: string;
  readonly title: LocalizedText;
  readonly explanation: LocalizedText;
}

export interface PhalanxSlot {
  /** 1..12 on the left hand, 13..24 on the right hand, or 1..14 including palm creases */
  readonly index: number;
  readonly hand: "left" | "right";
  readonly finger: "index" | "middle" | "ring" | "little";
  readonly joint: "crease" | "base" | "middle" | "tip";
  readonly code: string;
  readonly pali: string;
  readonly label: LocalizedText;
  readonly mnemonicAnchor: LocalizedText;
  readonly sandhiAfter?: LocalizedText;
}

export interface PhalanxMapSpec {
  readonly id: "akusala12" | "cetasika14" | "paticca12" | "kicca14" | "patthana24";
  readonly asRef: string;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly handsUsed: 1 | 2;
  readonly usesPalmCrease: boolean;
  readonly formulaSummary: LocalizedText;
  readonly slots: readonly PhalanxSlot[];
}

// ── Helpers for Cetasika sets (IDs 1..52) ─────────────────────────────────────
const UNIV_7 = [1, 2, 3, 4, 5, 6, 7] as const;
const PAK_ALL_6 = [8, 9, 10, 11, 12, 13] as const;
const PAK_NO_PITI_5 = [8, 9, 10, 11, 13] as const;
const AKU_UNIV_4 = [14, 15, 16, 17] as const;
const SOBHANA_UNIV_19 = [
  28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
] as const;
const VIRATI_3 = [47, 48, 49] as const;
const APPAMANNA_2 = [50, 51] as const;
const PANNA_1 = [52] as const;

function jhanaPakinnakas(stage: 1 | 2 | 3 | 4 | 5): number[] {
  switch (stage) {
    case 1:
      return [8, 9, 10, 11, 12, 13]; // Vitakka, Vicāra, Adhimokkha, Vīriya, Pīti, Chanda
    case 2:
      return [9, 10, 11, 12, 13]; // -Vitakka
    case 3:
      return [10, 11, 12, 13]; // -Vitakka, -Vicāra
    case 4:
    case 5:
      return [10, 11, 13]; // -Vitakka, -Vicāra, -Pīti
  }
}

// ── 1. THE 89 AND 121 CANONICAL CITTAS (WITH COMBINATORIAL VECTORS & SAṄGAHA-NAYA) ──

function buildCommonMundaneCittas(): CanonicalCitta[] {
  const list: CanonicalCitta[] = [];

  // A.1: 8 Lobha-mūla Cittas (#1..#8) — 2³ = 8 Generator
  const lobhaSpecs: Array<{
    id: number;
    v: 1 | 0;
    d: 1 | 0;
    s: 1 | 0;
  }> = [
    { id: 1, v: 1, d: 1, s: 1 },
    { id: 2, v: 1, d: 1, s: 0 },
    { id: 3, v: 1, d: 0, s: 1 },
    { id: 4, v: 1, d: 0, s: 0 },
    { id: 5, v: 0, d: 1, s: 1 },
    { id: 6, v: 0, d: 1, s: 0 },
    { id: 7, v: 0, d: 0, s: 1 },
    { id: 8, v: 0, d: 0, s: 0 },
  ];

  for (const sp of lobhaSpecs) {
    const vPali = sp.v === 1 ? "Somanassa-sahagataṃ" : "Upekkhā-sahagataṃ";
    const dPali = sp.d === 1 ? "diṭṭhigata-sampayuttaṃ" : "diṭṭhigata-vippayuttaṃ";
    const sPali = sp.s === 1 ? "asaṅkhārikaṃ" : "sasaṅkhārikaṃ";
    const pak = sp.v === 1 ? [...PAK_ALL_6] : [...PAK_NO_PITI_5];
    const specAku = sp.d === 1 ? [18, 19] : [18]; // Lobha + Diṭṭhi (fixed) or Lobha (with optional Māna)
    const optAku: number[] = [];
    if (sp.d === 0) optAku.push(20); // Māna is occasional in the 4 diṭṭhigata-vippayutta
    if (sp.s === 0) optAku.push(25, 26); // Thīna-middha in sasaṅkhārika

    const fixed = [...UNIV_7, ...pak, ...AKU_UNIV_4, ...specAku];
    const totalCount = fixed.length + optAku.length; // 19, 21, 19, 21, 18, 20, 18, 20

    list.push({
      id: sp.id,
      code: `Lobha #${sp.id} [${sp.v}·${sp.d}·${sp.s}]`,
      family: "lobha",
      bhumi: "kama",
      jati: "akusala",
      pali: `${vPali} ${dPali} ${sPali} lobhamūla-cittaṃ`,
      name: {
        pt: `Consciência enraizada em avidez #${sp.id}: ${sp.v ? "prazer (somanassa)" : "equanimidade (upekkhā)"}, ${sp.d ? "com visão errônea" : "sem visão errônea"}, ${sp.s ? "não-instigada" : "instigada"}`,
        en: `Greed-rooted consciousness #${sp.id}: ${sp.v ? "joy (somanassa)" : "equanimity (upekkhā)"}, ${sp.d ? "with wrong view" : "without wrong view"}, ${sp.s ? "unprompted" : "prompted"}`,
        es: `Conciencia enraizada en avidez #${sp.id}: ${sp.v ? "placer (somanassa)" : "ecuanimidad (upekkhā)"}, ${sp.d ? "con visión errónea" : "sin visión errónea"}, ${sp.s ? "no instigada" : "instigada"}`,
      },
      bitVedana: sp.v,
      bitCognitive: sp.d,
      bitSankhara: sp.s,
      formulaNote: {
        pt: `Vetor Binário [${sp.v}·${sp.d}·${sp.s}]: 7 Universais + ${pak.length} Particulares${sp.v ? " (c/ Pīti)" : " (sem Pīti)"} + 4 Akusala Universais + Lobha${sp.d ? " + Diṭṭhi" : " (+ Māna ocasional)"}${sp.s === 0 ? " (+ Thīna-Middha ocasionais)" : ""} = ${totalCount} cetasikas.`,
        en: `Binary Vector [${sp.v}·${sp.d}·${sp.s}]: 7 Universals + ${pak.length} Particulars${sp.v ? " (w/ Pīti)" : " (no Pīti)"} + 4 Universal Unwholesome + Lobha${sp.d ? " + Diṭṭhi" : " (+ occasional Māna)"}${sp.s === 0 ? " (+ occasional Thīna-Middha)" : ""} = ${totalCount} cetasikas.`,
        es: `Vector Binario [${sp.v}·${sp.d}·${sp.s}]: 7 Universales + ${pak.length} Particulares${sp.v ? " (con Pīti)" : " (sin Pīti)"} + 4 Akusala Universales + Lobha${sp.d ? " + Diṭṭhi" : " (+ Māna ocasional)"}${sp.s === 0 ? " (+ Thīna-Middha ocasionales)" : ""} = ${totalCount} cetasikas.`,
      },
      fixedCetasikas: fixed,
      optionalCetasikas: optAku,
      totalSangahaCount: totalCount,
      asRef: "AS I.4 / II.25",
    });
  }

  // A.2: 2 Dosa-mūla Cittas (#9..#10)
  for (const s of [1, 0] as const) {
    const id = s === 1 ? 9 : 10;
    const sPali = s === 1 ? "asaṅkhārikaṃ" : "sasaṅkhārikaṃ";
    const fixed = [...UNIV_7, ...PAK_NO_PITI_5, ...AKU_UNIV_4, 21]; // 17 fixed (includes Dosa=21)
    const opt = s === 1 ? [22, 23, 24] : [22, 23, 24, 25, 26]; // Issā, Macchariya, Kukkucca (1 at a time) + Thīna-Middha if sasaṅkhārika
    const totalCount = s === 1 ? 20 : 22;
    list.push({
      id,
      code: `Dosa #${id - 8} [Dom·Paṭ·${s}]`,
      family: "dosa",
      bhumi: "kama",
      jati: "akusala",
      pali: `Domanassa-sahagataṃ paṭigha-sampayuttaṃ ${sPali} dosamūla-cittaṃ`,
      name: {
        pt: `Consciência enraizada em aversão #${id - 8} (#${id}): desprazer (domanassa), com repulsa (paṭigha), ${s ? "não-instigada" : "instigada"}`,
        en: `Aversion-rooted consciousness #${id - 8} (#${id}): displeasure (domanassa), with aversion (paṭigha), ${s ? "unprompted" : "prompted"}`,
        es: `Conciencia enraizada en aversión #${id - 8} (#${id}): displacer (domanassa), con aversión (paṭigha), ${s ? "no instigada" : "instigada"}`,
      },
      bitVedana: "domanassa",
      bitCognitive: "patigha",
      bitSankhara: s,
      formulaNote: {
        pt: `Sensação fixa em Domanassa (exclui Pīti) e conexão fixa em Paṭigha: 17 fixos + 3 secundários mutuamente exclusivos (Issā, Macchariya, Kukkucca)${s === 0 ? " + 2 (Thīna-Middha)" : ""} = ${totalCount} cetasikas no total (máx. ${s === 1 ? 18 : 20} num único instante).`,
        en: `Feeling locked to Domanassa (excludes Pīti) and connection locked to Paṭigha: 17 fixed + 3 mutually exclusive secondaries (Issā, Macchariya, Kukkucca)${s === 0 ? " + 2 (Thīna-Middha)" : ""} = ${totalCount} total cetasikas (max ${s === 1 ? 18 : 20} in one instant).`,
        es: `Sensación fija en Domanassa (excluye Pīti) y conexión fija en Paṭigha: 17 fijos + 3 secundarios mutuamente exclusivos (Issā, Macchariya, Kukkucca)${s === 0 ? " + 2 (Thīna-Middha)" : ""} = ${totalCount} cetasikas en total (máx. ${s === 1 ? 18 : 20} en un solo instante).`,
      },
      fixedCetasikas: fixed,
      optionalCetasikas: opt,
      totalSangahaCount: totalCount,
      asRef: "AS I.5 / II.26",
    });
  }

  // A.3: 2 Moha-mūla Cittas (#11..#12)
  list.push({
    id: 11,
    code: "Moha #1 [Upe·Vic]",
    family: "moha",
    bhumi: "kama",
    jati: "akusala",
    pali: "Upekkhā-sahagataṃ vicikicchā-sampayuttaṃ mohamūla-cittaṃ",
    name: {
      pt: "Consciência enraizada em ilusão #1 (#11): equanimidade, associada à dúvida (vicikicchā)",
      en: "Delusion-rooted consciousness #1 (#11): equanimity, associated with doubt (vicikicchā)",
      es: "Conciencia enraizada en ilusión #1 (#11): ecuanimidad, asociada a la duda (vicikicchā)",
    },
    bitVedana: 0,
    bitCognitive: "vicikiccha",
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Exclui Adhimokkha (decisão é incompatível com dúvida), Pīti e Chanda: 7 Universais + 3 Particulares (Vitakka, Vicāra, Vīriya) + 4 Akusala Universais + Vicikicchā = 15 cetasikas.",
      en: "Excludes Adhimokkha (decision is incompatible with doubt), Pīti, and Chanda: 7 Universals + 3 Particulars (Vitakka, Vicāra, Vīriya) + 4 Universal Unwholesome + Vicikicchā = 15 cetasikas.",
      es: "Excluye Adhimokkha (la decisión es incompatible con la duda), Pīti y Chanda: 7 Universales + 3 Particulares (Vitakka, Vicāra, Vīriya) + 4 Akusala Universales + Vicikicchā = 15 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 11, ...AKU_UNIV_4, 27],
    optionalCetasikas: [],
    totalSangahaCount: 15,
    asRef: "AS I.6 / II.27",
  });

  list.push({
    id: 12,
    code: "Moha #2 [Upe·Udd]",
    family: "moha",
    bhumi: "kama",
    jati: "akusala",
    pali: "Upekkhā-sahagataṃ uddhacca-sampayuttaṃ mohamūla-cittaṃ",
    name: {
      pt: "Consciência enraizada em ilusão #2 (#12): equanimidade, associada à agitação (uddhacca)",
      en: "Delusion-rooted consciousness #2 (#12): equanimity, associated with restlessness (uddhacca)",
      es: "Conciencia enraizada en ilusión #2 (#12): ecuanimidad, asociada a la agitación (uddhacca)",
    },
    bitVedana: 0,
    bitCognitive: "uddhacca",
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Exclui Pīti e Chanda, mas possui Adhimokkha: 7 Universais + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya) + 4 Akusala Universais (onde Uddhacca já está incluso) = 15 cetasikas.",
      en: "Excludes Pīti and Chanda, but includes Adhimokkha: 7 Universals + 4 Particulars (Vitakka, Vicāra, Adhimokkha, Vīriya) + 4 Universal Unwholesome (Uddhacca already included) = 15 cetasikas.",
      es: "Excluye Pīti y Chanda, pero incluye Adhimokkha: 7 Universales + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya) + 4 Akusala Universales (Uddhacca ya incluido) = 15 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10, 11, ...AKU_UNIV_4],
    optionalCetasikas: [],
    totalSangahaCount: 15,
    asRef: "AS I.6 / II.27",
  });

  // B. 18 Ahetuka Cittas (#13..#30)
  const senses = [
    { pali: "Cakkhu-viññāṇaṃ", pt: "Consciência visual", en: "Eye-consciousness", es: "Conciencia visual" },
    { pali: "Sota-viññāṇaṃ", pt: "Consciência auditiva", en: "Ear-consciousness", es: "Conciencia auditiva" },
    { pali: "Ghāna-viññāṇaṃ", pt: "Consciência olfativa", en: "Nose-consciousness", es: "Conciencia olfativa" },
    { pali: "Jivhā-viññāṇaṃ", pt: "Consciência gustativa", en: "Tongue-consciousness", es: "Conciencia gustativa" },
    { pali: "Kāya-viññāṇaṃ", pt: "Consciência tátil", en: "Body-consciousness", es: "Conciencia táctil" },
  ];

  // #13..#17: 5 Akusala-vipāka sense-cognitions
  senses.forEach((sn, idx) => {
    const id = 13 + idx;
    const isBody = idx === 4;
    list.push({
      id,
      code: `Ahetuka #${id - 12} (Ak-Vip)`,
      family: "ahetuka",
      bhumi: "kama",
      jati: "vipaka",
      pali: `${isBody ? "Dukkha-sahagataṃ" : "Upekkhā-sahagataṃ"} ${sn.pali} (akusala-vipākaṃ)`,
      name: {
        pt: `${sn.pt} resultante insalubre (#${id}) — c/ ${isBody ? "dor física (dukkha)" : "equanimidade (upekkhā)"}`,
        en: `Unwholesome-resultant ${sn.en.toLowerCase()} (#${id}) — w/ ${isBody ? "bodily pain (dukkha)" : "equanimity (upekkhā)"}`,
        es: `${sn.es} resultante insaludable (#${id}) — con ${isBody ? "dolor físico (dukkha)" : "ecuanimidad (upekkhā)"}`,
      },
      bitVedana: isBody ? "dukkha" : 0,
      bitCognitive: 0,
      bitSankhara: "fixed",
      formulaNote: {
        pt: "Dvipañca-viññāṇa (as 10 consciências sensoriais) são as mais simples de todo o Abhidhamma: contêm APENAS os 7 Universais (Sabbacittasādhāraṇa) = 7 cetasikas.",
        en: "Dvipañca-viññāṇa (the 10 sense-consciousnesses) are the simplest in all Abhidhamma: they contain ONLY the 7 Universals (Sabbacittasādhāraṇa) = 7 cetasikas.",
        es: "Dvipañca-viññāṇa (las 10 conciencias sensoriales) son las más simples de todo el Abhidhamma: contienen SOLO los 7 Universales (Sabbacittasādhāraṇa) = 7 cetasikas.",
      },
      fixedCetasikas: [...UNIV_7],
      optionalCetasikas: [],
      totalSangahaCount: 7,
      asRef: "AS I.8 / II.24",
    });
  });

  // #18: Akusala-vipāka Sampaṭicchana, #19: Akusala-vipāka Santīraṇa
  list.push({
    id: 18,
    code: "Ahetuka #6 (Sp-Ak)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "vipaka",
    pali: "Upekkhā-sahagataṃ sampaṭicchana-cittaṃ (akusala-vipākaṃ)",
    name: {
      pt: "Consciência de recepção resultante insalubre (#18) — equanimidade",
      en: "Unwholesome-resultant receiving consciousness (#18) — equanimity",
      es: "Conciencia de recepción resultante insaludable (#18) — ecuanimidad",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Mano-dhātu (elemento mental): 7 Universais + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      en: "Mano-dhātu (mind-element): 7 Universals + 3 Particulars (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      es: "Mano-dhātu (elemento mental): 7 Universales + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10],
    optionalCetasikas: [],
    totalSangahaCount: 10,
    asRef: "AS I.8 / II.24",
  });

  list.push({
    id: 19,
    code: "Ahetuka #7 (St-Ak)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "vipaka",
    pali: "Upekkhā-sahagataṃ santīraṇa-cittaṃ (akusala-vipākaṃ)",
    name: {
      pt: "Consciência de investigação resultante insalubre (#19) — equanimidade (exerce 5 funções)",
      en: "Unwholesome-resultant investigating consciousness (#19) — equanimity (performs 5 functions)",
      es: "Conciencia de investigación resultante insaludable (#19) — ecuanimidad (ejerce 5 funciones)",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "7 Universais + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Exerce 5 funções (Paṭisandhi nos reinos de privação, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
      en: "7 Universals + 3 Particulars (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Performs 5 functions (Paṭisandhi in woeful realms, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
      es: "7 Universales + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Ejerce 5 funciones (Paṭisandhi en reinos de privación, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10],
    optionalCetasikas: [],
    totalSangahaCount: 10,
    asRef: "AS I.8 / II.24",
  });

  // #20..#24: 5 Kusala-vipāka sense-cognitions
  senses.forEach((sn, idx) => {
    const id = 20 + idx;
    const isBody = idx === 4;
    list.push({
      id,
      code: `Ahetuka #${id - 12} (Ku-Vip)`,
      family: "ahetuka",
      bhumi: "kama",
      jati: "vipaka",
      pali: `${isBody ? "Sukha-sahagataṃ" : "Upekkhā-sahagataṃ"} ${sn.pali} (kusala-vipākaṃ)`,
      name: {
        pt: `${sn.pt} resultante salubre (#${id}) — c/ ${isBody ? "prazer físico (sukha)" : "equanimidade (upekkhā)"}`,
        en: `Wholesome-resultant ${sn.en.toLowerCase()} (#${id}) — w/ ${isBody ? "bodily pleasure (sukha)" : "equanimity (upekkhā)"}`,
        es: `${sn.es} resultante saludable (#${id}) — con ${isBody ? "placer físico (sukha)" : "ecuanimidad (upekkhā)"}`,
      },
      bitVedana: isBody ? "sukha" : 0,
      bitCognitive: 0,
      bitSankhara: "fixed",
      formulaNote: {
        pt: "Dvipañca-viññāṇa: contém apenas os 7 Universais (Sabbacittasādhāraṇa) = 7 cetasikas.",
        en: "Dvipañca-viññāṇa: contains only the 7 Universals (Sabbacittasādhāraṇa) = 7 cetasikas.",
        es: "Dvipañca-viññāṇa: contiene solo los 7 Universales (Sabbacittasādhāraṇa) = 7 cetasikas.",
      },
      fixedCetasikas: [...UNIV_7],
      optionalCetasikas: [],
      totalSangahaCount: 7,
      asRef: "AS I.9 / II.24",
    });
  });

  // #25: Kusala-vipāka Sampaṭicchana, #26: Kusala-vipāka Santīraṇa (Somanassa), #27: Kusala-vipāka Santīraṇa (Upekkhā) — exact mūla order (AS I.10)
  list.push({
    id: 25,
    code: "Ahetuka #13 (Sp-Ku)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "vipaka",
    pali: "Upekkhā-sahagataṃ sampaṭicchana-cittaṃ (kusala-vipākaṃ)",
    name: {
      pt: "Consciência de recepção resultante salubre (#25) — equanimidade",
      en: "Wholesome-resultant receiving consciousness (#25) — equanimity",
      es: "Conciencia de recepción resultante saludable (#25) — ecuanimidad",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "7 Universais + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      en: "7 Universals + 3 Particulars (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      es: "7 Universales + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10],
    optionalCetasikas: [],
    totalSangahaCount: 10,
    asRef: "AS I.10 / II.56",
  });

  list.push({
    id: 26,
    code: "Ahetuka #14 (St-Ku-Som)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "vipaka",
    pali: "Somanassa-sahagataṃ santīraṇa-cittaṃ (kusala-vipākaṃ)",
    name: {
      pt: "Consciência de investigação resultante salubre c/ prazer (#26) — objetos muito desejáveis",
      en: "Wholesome-resultant investigating consciousness w/ joy (#26) — very desirable objects",
      es: "Conciencia de investigación resultante saludable con placer (#26) — objetos muy deseables",
    },
    bitVedana: 1,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Como possui Somanassa, adiciona Pīti: 7 Universais + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Pīti) = 11 cetasikas. Exerce 2 funções (Santīraṇa, Tadārammaṇa).",
      en: "Because it has Somanassa, it adds Pīti: 7 Universals + 4 Particulars (Vitakka, Vicāra, Adhimokkha, Pīti) = 11 cetasikas. Performs 2 functions (Santīraṇa, Tadārammaṇa).",
      es: "Como posee Somanassa, añade Pīti: 7 Universales + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Pīti) = 11 cetasikas. Ejerce 2 funciones (Santīraṇa, Tadārammaṇa).",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10, 12],
    optionalCetasikas: [],
    totalSangahaCount: 11,
    asRef: "AS I.10 / II.55",
  });

  list.push({
    id: 27,
    code: "Ahetuka #15 (St-Ku-Upe)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "vipaka",
    pali: "Upekkhā-sahagataṃ santīraṇa-cittaṃ (kusala-vipākaṃ)",
    name: {
      pt: "Consciência de investigação resultante salubre c/ equanimidade (#27) — exerce 5 funções",
      en: "Wholesome-resultant investigating consciousness w/ equanimity (#27) — performs 5 functions",
      es: "Conciencia de investigación resultante saludable con ecuanimidad (#27) — ejerce 5 funciones",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "7 Universais + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Exerce 5 funções (Paṭisandhi ahetuka em Kāmasugati, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
      en: "7 Universals + 3 Particulars (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Performs 5 functions (rootless Paṭisandhi in Kāmasugati, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
      es: "7 Universales + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas. Ejerce 5 funciones (Paṭisandhi ahetuka en Kāmasugati, Bhavaṅga, Cuti, Santīraṇa, Tadārammaṇa).",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10],
    optionalCetasikas: [],
    totalSangahaCount: 10,
    asRef: "AS I.10 / II.56",
  });

  // #28..#30: 3 Ahetuka-kiriya
  list.push({
    id: 28,
    code: "Ahetuka #16 (Pv-Kir)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "kiriya",
    pali: "Upekkhā-sahagataṃ pañcadvārāvajjana-cittaṃ",
    name: {
      pt: "Consciência de advertência nas cinco portas (#28) — funcional sem raiz",
      en: "Five-sense-door adverting consciousness (#28) — rootless functional",
      es: "Conciencia de advertencia en las cinco puertas (#28) — funcional sin raíz",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Mano-dhātu funcional: 7 Universais + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      en: "Functional mano-dhātu: 7 Universals + 3 Particulars (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
      es: "Mano-dhātu funcional: 7 Universales + 3 Particulares (Vitakka, Vicāra, Adhimokkha) = 10 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10],
    optionalCetasikas: [],
    totalSangahaCount: 10,
    asRef: "AS I.10 / II.24",
  });

  list.push({
    id: 29,
    code: "Ahetuka #17 (Mv-Kir)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "kiriya",
    pali: "Upekkhā-sahagataṃ manodvārāvajjana-cittaṃ",
    name: {
      pt: "Consciência de advertência na porta da mente / determinação (voṭṭhabbana) (#29)",
      en: "Mind-door adverting / determining (voṭṭhabbana) consciousness (#29)",
      es: "Conciencia de advertencia en la puerta mental / determinación (voṭṭhabbana) (#29)",
    },
    bitVedana: 0,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Adiciona Vīriya (energia): 7 Universais + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya) = 11 cetasikas.",
      en: "Adds Vīriya (energy): 7 Universals + 4 Particulars (Vitakka, Vicāra, Adhimokkha, Vīriya) = 11 cetasikas.",
      es: "Añade Vīriya (energía): 7 Universales + 4 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya) = 11 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10, 11],
    optionalCetasikas: [],
    totalSangahaCount: 11,
    asRef: "AS I.10 / II.23",
  });

  list.push({
    id: 30,
    code: "Ahetuka #18 (Has-Kir)",
    family: "ahetuka",
    bhumi: "kama",
    jati: "kiriya",
    pali: "Somanassa-sahagataṃ hasituppāda-cittaṃ",
    name: {
      pt: "Consciência produtora do sorriso do Arahant (#30) — com prazer (somanassa)",
      en: "Smile-producing consciousness of an Arahant (#30) — with joy (somanassa)",
      es: "Conciencia productora de la sonrisa del Arahant (#30) — con placer (somanassa)",
    },
    bitVedana: 1,
    bitCognitive: 0,
    bitSankhara: "fixed",
    formulaNote: {
      pt: "Possui Vīriya e Pīti (mas não Chanda): 7 Universais + 5 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya, Pīti) = 12 cetasikas.",
      en: "Has Vīriya and Pīti (but not Chanda): 7 Universals + 5 Particulars (Vitakka, Vicāra, Adhimokkha, Vīriya, Pīti) = 12 cetasikas.",
      es: "Posee Vīriya y Pīti (pero no Chanda): 7 Universales + 5 Particulares (Vitakka, Vicāra, Adhimokkha, Vīriya, Pīti) = 12 cetasikas.",
    },
    fixedCetasikas: [...UNIV_7, 8, 9, 10, 11, 12],
    optionalCetasikas: [],
    totalSangahaCount: 12,
    asRef: "AS I.10 / II.23",
  });

  // C. 24 Kāmāvacara Sobhana Cittas (#31..#54): 8 Mahā-kusala, 8 Mahā-vipāka, 8 Mahā-kiriya
  const jatiTriad: Array<{
    jati: JatiId;
    prefixPali: string;
    codePrefix: string;
    labelPt: string;
    labelEn: string;
    labelEs: string;
    baseId: number;
  }> = [
    {
      jati: "kusala",
      prefixPali: "mahā-kusala",
      codePrefix: "M-Kus",
      labelPt: "Mahā-kusala (Salubre da esfera sensorial)",
      labelEn: "Mahā-kusala (Sense-sphere wholesome)",
      labelEs: "Mahā-kusala (Saludable de la esfera sensorial)",
      baseId: 30,
    },
    {
      jati: "vipaka",
      prefixPali: "mahā-vipāka",
      codePrefix: "M-Vip",
      labelPt: "Mahā-vipāka (Resultante bela da esfera sensorial)",
      labelEn: "Mahā-vipāka (Sense-sphere beautiful resultant)",
      labelEs: "Mahā-vipāka (Resultante bella de la esfera sensorial)",
      baseId: 38,
    },
    {
      jati: "kiriya",
      prefixPali: "mahā-kiriya",
      codePrefix: "M-Kir",
      labelPt: "Mahā-kiriya (Funcional bela da esfera sensorial)",
      labelEn: "Mahā-kiriya (Sense-sphere beautiful functional)",
      labelEs: "Mahā-kiriya (Funcional bella de la esfera sensorial)",
      baseId: 46,
    },
  ];

  for (const jt of jatiTriad) {
    for (const sp of lobhaSpecs) {
      const id = jt.baseId + sp.id;
      const vPali = sp.v === 1 ? "Somanassa-sahagataṃ" : "Upekkhā-sahagataṃ";
      const nPali = sp.d === 1 ? "ñāṇa-sampayuttaṃ" : "ñāṇa-vippayuttaṃ";
      const sPali = sp.s === 1 ? "asaṅkhārikaṃ" : "sasaṅkhārikaṃ";

      const pak = sp.v === 1 ? [...PAK_ALL_6] : [...PAK_NO_PITI_5];
      const fixed: number[] = [...UNIV_7, ...pak, ...SOBHANA_UNIV_19];
      if (sp.d === 1) fixed.push(...PANNA_1);

      const opt: number[] = [];
      if (jt.jati === "kusala") {
        opt.push(...VIRATI_3, ...APPAMANNA_2); // Virati (3) + Appamaññā (2) enter Mahā-kusala
      } else if (jt.jati === "kiriya") {
        opt.push(...APPAMANNA_2); // Appamaññā (2) enter Mahā-kiriya, whereas Virati do NOT enter
      }
      // In Mahā-vipāka, neither Virati nor Appamaññā enter!

      const totalCount = fixed.length + opt.length;

      list.push({
        id,
        code: `${jt.codePrefix} #${sp.id} [${sp.v}·${sp.d}·${sp.s}]`,
        family: "kamasobhana",
        bhumi: "kama",
        jati: jt.jati,
        pali: `${vPali} ${nPali} ${sPali} ${jt.prefixPali}-cittaṃ`,
        name: {
          pt: `${jt.labelPt} #${sp.id} (#${id}): ${sp.v ? "prazer (somanassa)" : "equanimidade (upekkhā)"}, ${sp.d ? "associada a conhecimento (ñāṇa)" : "dissociada de conhecimento"}, ${sp.s ? "não-instigada" : "instigada"}`,
          en: `${jt.labelEn} #${sp.id} (#${id}): ${sp.v ? "joy (somanassa)" : "equanimity (upekkhā)"}, ${sp.d ? "associated with knowledge (ñāṇa)" : "dissociated from knowledge"}, ${sp.s ? "unprompted" : "prompted"}`,
          es: `${jt.labelEs} #${sp.id} (#${id}): ${sp.v ? "placer (somanassa)" : "ecuanimidad (upekkhā)"}, ${sp.d ? "asociada a conocimiento (ñāṇa)" : "disociada de conocimiento"}, ${sp.s ? "no instigada" : "instigada"}`,
        },
        bitVedana: sp.v,
        bitCognitive: sp.d,
        bitSankhara: sp.s,
        formulaNote: {
          pt: `Vetor [${sp.v}·${sp.d}·${sp.s}] × ${jt.prefixPali}: 7 Universais + ${pak.length} Particulares + 19 Belos Universais${sp.d ? " + 1 Paññā" : ""}${jt.jati === "kusala" ? " + 3 Virati + 2 Appamaññā (ocasionais)" : jt.jati === "kiriya" ? " + 2 Appamaññā (ocasionais, sem Virati)" : " (sem Virati nem Appamaññā em Vipāka)"} = ${totalCount} cetasikas.`,
          en: `Vector [${sp.v}·${sp.d}·${sp.s}] × ${jt.prefixPali}: 7 Universals + ${pak.length} Particulars + 19 Universal Beautiful${sp.d ? " + 1 Paññā" : ""}${jt.jati === "kusala" ? " + 3 Virati + 2 Appamaññā (occasional)" : jt.jati === "kiriya" ? " + 2 Appamaññā (occasional, no Virati)" : " (no Virati or Appamaññā in Vipāka)"} = ${totalCount} cetasikas.`,
          es: `Vector [${sp.v}·${sp.d}·${sp.s}] × ${jt.prefixPali}: 7 Universales + ${pak.length} Particulares + 19 Bellos Universales${sp.d ? " + 1 Paññā" : ""}${jt.jati === "kusala" ? " + 3 Virati + 2 Appamaññā (ocasionales)" : jt.jati === "kiriya" ? " + 2 Appamaññā (ocasionales, sin Virati)" : " (sin Virati ni Appamaññā en Vipāka)"} = ${totalCount} cetasikas.`,
        },
        fixedCetasikas: fixed,
        optionalCetasikas: opt,
        totalSangahaCount: totalCount,
        asRef: "AS I.12 / II.21-22",
      });
    }
  }

  // D. 15 Rūpāvacara Cittas (#55..#69): 5 Jhānas × 3 (Kusala, Vipāka, Kiriya)
  const rupaJatis: Array<{ jati: JatiId; pali: string; code: string; base: number; pt: string; en: string; es: string }> = [
    { jati: "kusala", pali: "rūpāvacara-kusala", code: "R-Kus", base: 54, pt: "Rūpāvacara Salubre", en: "Fine-material Wholesome", es: "Rūpāvacara Saludable" },
    { jati: "vipaka", pali: "rūpāvacara-vipāka", code: "R-Vip", base: 59, pt: "Rūpāvacara Resultante", en: "Fine-material Resultant", es: "Rūpāvacara Resultante" },
    { jati: "kiriya", pali: "rūpāvacara-kiriya", code: "R-Kir", base: 64, pt: "Rūpāvacara Funcional", en: "Fine-material Functional", es: "Rūpāvacara Funcional" },
  ];
  const jhanaPaliFormula: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: "Vitakka-vicāra-pīti-sukhekaggatā-sahitaṃ paṭhamajjhāna",
    2: "Vicāra-pīti-sukhekaggatā-sahitaṃ dutiyajjhāna",
    3: "Pīti-sukhekaggatā-sahitaṃ tatiyajjhāna",
    4: "Sukhekaggatā-sahitaṃ catutthajjhāna",
    5: "Upekkhekaggatā-sahitaṃ pañcamajjhāna",
  };

  for (const rj of rupaJatis) {
    for (const jh of [1, 2, 3, 4, 5] as const) {
      const id = rj.base + jh;
      const pak = jhanaPakinnakas(jh);
      const fixed = [...UNIV_7, ...pak, ...SOBHANA_UNIV_19, ...PANNA_1];
      // Karuṇā and Muditā are present in Jhānas 1..4, but NOT in the 5th Jhāna (which has Upekkhā)
      const opt = jh < 5 ? [...APPAMANNA_2] : [];
      const totalCount = fixed.length + opt.length; // 35, 34, 33, 32, 30
      const enOrd = jh === 1 ? "1st" : jh === 2 ? "2nd" : jh === 3 ? "3rd" : `${jh}th`;
      list.push({
        id,
        code: `${rj.code} J${jh}`,
        family: "rupavacara",
        bhumi: "rupa",
        jati: rj.jati,
        pali: `${jhanaPaliFormula[jh]}-${rj.pali}-cittaṃ`,
        name: {
          pt: `${rj.pt} — ${jh}º Jhāna (#${id})`,
          en: `${rj.en} — ${enOrd} Jhāna (#${id})`,
          es: `${rj.es} — ${jh}.º Jhāna (#${id})`,
        },
        bitVedana: jh < 5 ? 1 : 0,
        bitCognitive: 1,
        bitSankhara: "fixed",
        jhanaStage: jh,
        formulaNote: {
          pt: `Escada do ${jh}º Jhāna: 7 Universais + ${pak.length} Particulares + 19 Belos + 1 Paññā${jh < 5 ? " + 2 Appamaññā (Karuṇā/Muditā)" : " (5º Jhāna exclui Appamaññā pois já está em Upekkhā)"} = ${totalCount} cetasikas.`,
          en: `${enOrd} Jhāna Ladder: 7 Universals + ${pak.length} Particulars + 19 Beautiful + 1 Paññā${jh < 5 ? " + 2 Appamaññā (Karuṇā/Muditā)" : " (5th Jhāna excludes Appamaññā as it has Upekkhā)"} = ${totalCount} cetasikas.`,
          es: `Escalera del ${jh}.º Jhāna: 7 Universales + ${pak.length} Particulares + 19 Bellos + 1 Paññā${jh < 5 ? " + 2 Appamaññā (Karuṇā/Muditā)" : " (5.º Jhāna excluye Appamaññā pues tiene Upekkhā)"} = ${totalCount} cetasikas.`,
        },
        fixedCetasikas: fixed,
        optionalCetasikas: opt,
        totalSangahaCount: totalCount,
        asRef: "AS I.21–24 / II.38–39",
      });
    }
  }

  // E. 12 Arūpāvacara Cittas (#70..#81): 4 Bases × 3 (Kusala, Vipāka, Kiriya)
  const arupaBases: Array<{ idx: 1 | 2 | 3 | 4; pali: string; pt: string; en: string; es: string }> = [
    { idx: 1, pali: "Ākāsānañcāyatana", pt: "Base do espaço infinito", en: "Base of infinite space", es: "Base del espacio infinito" },
    { idx: 2, pali: "Viññāṇañcāyatana", pt: "Base da consciência infinita", en: "Base of infinite consciousness", es: "Base de la conciencia infinita" },
    { idx: 3, pali: "Ākiñcaññāyatana", pt: "Base do nada", en: "Base of nothingness", es: "Base de la nada" },
    { idx: 4, pali: "Nevasaññānāsaññāyatana", pt: "Base da nem-percepção-nem-não-percepção", en: "Base of neither-perception-nor-non-perception", es: "Base de ni-percepción-ni-no-percepción" },
  ];
  const arupaJatis: Array<{ jati: JatiId; pali: string; code: string; base: number; pt: string; en: string; es: string }> = [
    { jati: "kusala", pali: "kusala", code: "Ar-Kus", base: 69, pt: "Salubre", en: "Wholesome", es: "Saludable" },
    { jati: "vipaka", pali: "vipāka", code: "Ar-Vip", base: 73, pt: "Resultante", en: "Resultant", es: "Resultante" },
    { jati: "kiriya", pali: "kiriya", code: "Ar-Kir", base: 77, pt: "Funcional", en: "Functional", es: "Funcional" },
  ];

  for (const aj of arupaJatis) {
    for (const ab of arupaBases) {
      const id = aj.base + ab.idx;
      const fixed = [...UNIV_7, 10, 11, 13, ...SOBHANA_UNIV_19, ...PANNA_1]; // 30 cetasikas (identical to 5th Jhāna)
      list.push({
        id,
        code: `${aj.code} B${ab.idx}`,
        family: "arupavacara",
        bhumi: "arupa",
        jati: aj.jati,
        pali: `${ab.pali}-${aj.pali}-cittaṃ`,
        name: {
          pt: `Arūpāvacara ${aj.pt} — ${ab.idx}. ${ab.pt} (#${id})`,
          en: `Immaterial ${aj.en} — ${ab.idx}. ${ab.en} (#${id})`,
          es: `Arūpāvacara ${aj.es} — ${ab.idx}. ${ab.es} (#${id})`,
        },
        bitVedana: 0,
        bitCognitive: 1,
        bitSankhara: "fixed",
        jhanaStage: 5,
        arupaBase: ab.idx,
        formulaNote: {
          pt: "Todas as 12 Arūpāvacara Cittas possuem exatamente a mesma estrutura de fatores do 5º Jhāna (Upekkhā + Ekaggatā): 7 Universais + 3 Particulares (Adhimokkha, Vīriya, Chanda) + 19 Belos + 1 Paññā = 30 cetasikas.",
          en: "All 12 Arūpāvacara Cittas have the exact same factor structure as the 5th Jhāna (Upekkhā + Ekaggatā): 7 Universals + 3 Particulars (Adhimokkha, Vīriya, Chanda) + 19 Beautiful + 1 Paññā = 30 cetasikas.",
          es: "Las 12 Arūpāvacara Cittas tienen exactamente la misma estructura de factores que el 5.º Jhāna (Upekkhā + Ekaggatā): 7 Universales + 3 Particulares (Adhimokkha, Vīriya, Chanda) + 19 Bellos + 1 Paññā = 30 cetasikas.",
        },
        fixedCetasikas: fixed,
        optionalCetasikas: [],
        totalSangahaCount: 30,
        asRef: "AS I.16 / II.20",
      });
    }
  }

  return list;
}

function buildCanonicalCittas89(): CanonicalCitta[] {
  const list = buildCommonMundaneCittas();

  // F. 8 Lokuttara Cittas (#82..#89) — Saṅkhepa Mode (Canonical Summary AS I.18-19 / II.36)
  const maggaStages89: Array<{ idx: 1 | 2 | 3 | 4; pali: string; pt: string; en: string; es: string; eradication: LocalizedText }> = [
    {
      idx: 1,
      pali: "Sotāpatti",
      pt: "Entrada na Corrente (Sotāpatti)",
      en: "Stream-entry (Sotāpatti)",
      es: "Entrada en la Corriente (Sotāpatti)",
      eradication: {
        pt: "Erradica Diṭṭhi (todas as visões errôneas: 4 Lobha #1, #2, #5, #6) e Vicikicchā (dúvida cética: Moha #11). Fecha os 4 Apāyas. Máximo 7 vidas.",
        en: "Eradicates Diṭṭhi (all wrong views: 4 Lobha #1, #2, #5, #6) and Vicikicchā (skeptical doubt: Moha #11). Closes the 4 Apāyas. Maximum 7 rebirths.",
        es: "Erradica Diṭṭhi (todas las visiones erróneas: 4 Lobha #1, #2, #5, #6) y Vicikicchā (duda escéptica: Moha #11). Cierra los 4 Apāyas. Máximo 7 vidas.",
      },
    },
    {
      idx: 2,
      pali: "Sakadāgāmi",
      pt: "Um-Retorno (Sakadāgāmī)",
      en: "Once-return (Sakadāgāmī)",
      es: "Un-Retorno (Sakadāgāmī)",
      eradication: {
        pt: "Atenua o apego sensual grosseiro (kāmarāga) e a aversão grosseira (paṭigha). No máximo 1 retorno ao plano sensorial humano.",
        en: "Attenuates coarse sensual lust (kāmarāga) and coarse ill-will (paṭigha). At most 1 return to the human sense sphere.",
        es: "Atenúa el apego sensual grosero (kāmarāga) y la aversión grosera (paṭigha). A lo sumo 1 retorno al plano sensorial humano.",
      },
    },
    {
      idx: 3,
      pali: "Anāgāmi",
      pt: "Não-Retorno (Anāgāmī)",
      en: "Non-return (Anāgāmī)",
      es: "No-Retorno (Anāgāmī)",
      eradication: {
        pt: "Erradica completamente todo o apego sensual (kāmarāga) e a aversão (ambas as 2 Dosa-mūla #9 e #10). Jamais retorna a Kāmaloka; renasce nos reinos Brahma (em especial nos 5 Suddhāvāsa, se dotado do 5º Jhāna).",
        en: "Completely eradicates sensual craving (kāmarāga) and ill-will (both 2 Dosa-mūla #9 and #10). Never returns to Kāmaloka; reborn in Brahma realms (especially the 5 Suddhāvāsa Pure Abodes with 5th Jhāna).",
        es: "Erradica completamente el apego sensual (kāmarāga) y la aversión (ambas 2 Dosa-mūla #9 y #10). Jamás retorna a Kāmaloka; renace en los reinos Brahma (en especial en los 5 Suddhāvāsa con 5.º Jhāna).",
      },
    },
    {
      idx: 4,
      pali: "Arahatta",
      pt: "Estado de Arahant (Arahatta)",
      en: "Arahantship (Arahatta)",
      es: "Estado de Arahant (Arahatta)",
      eradication: {
        pt: "Erradica todas as amarras superiores (rūparāga, arūparāga, māna, uddhacca, avijjā). Elimina as 4 Lobha restantes (#3, #4, #7, #8) e Moha #12.",
        en: "Eradicates all higher fetters (rūparāga, arūparāga, māna, uddhacca, avijjā). Eliminates the remaining 4 Lobha (#3, #4, #7, #8) and Moha #12.",
        es: "Erradica todos los grilletes superiores (rūparāga, arūparāga, māna, uddhacca, avijjā). Elimina las 4 Lobha restantes (#3, #4, #7, #8) y Moha #12.",
      },
    },
  ];

  // #82..#85 Magga (Kusala), #86..#89 Phala (Vipāka)
  for (const kind of ["magga", "phala"] as const) {
    for (const st of maggaStages89) {
      const id = (kind === "magga" ? 81 : 85) + st.idx;
      // In the 89-count (1st Jhāna basis), all 3 Viratis are FIXED (niyata) in Lokuttara! Total = 36 cetasikas
      const fixed = [...UNIV_7, ...PAK_ALL_6, ...SOBHANA_UNIV_19, ...VIRATI_3, ...PANNA_1];
      list.push({
        id,
        code: `Lok-${kind === "magga" ? "Mag" : "Pha"} #${st.idx}`,
        family: "lokuttara",
        bhumi: "lokuttara",
        jati: kind === "magga" ? "kusala" : "vipaka",
        pali: `${st.pali}-${kind}cittaṃ`,
        name: {
          pt: `Consciência Supramundana do ${kind === "magga" ? "Caminho (Magga)" : "Fruto (Phala)"} de ${st.pt} (#${id})`,
          en: `Supramundane ${st.en} ${kind === "magga" ? "Path (Magga)" : "Fruition (Phala)"} consciousness (#${id})`,
          es: `Conciencia Supramundana del ${kind === "magga" ? "Camino (Magga)" : "Fruto (Phala)"} de ${st.es} (#${id})`,
        },
        bitVedana: 1,
        bitCognitive: 1,
        bitSankhara: "fixed",
        jhanaStage: 1,
        maggaStage: st.idx,
        formulaNote: {
          pt: "Na enumeração resumida (Saṅkhepa de 89 cittas), as 8 Lokuttara são tomadas no 1º Jhāna: 7 Universais + 6 Particulares + 19 Belos Universais + 3 Viratis (fixas e simultâneas) + 1 Paññā = 36 cetasikas (AS I.31–34 / II.36).",
          en: "In the summary enumeration (Saṅkhepa of 89 cittas), the 8 Supramundane are taken at 1st Jhāna: 7 Universals + 6 Particulars + 19 Beautiful Universals + 3 Viratis (fixed & simultaneous) + 1 Paññā = 36 cetasikas (AS I.31–34 / II.36).",
          es: "En la enumeración resumida (Saṅkhepa de 89 cittas), las 8 Supramundanas se toman en el 1.er Jhāna: 7 Universales + 6 Particulares + 19 Bellos Universales + 3 Viratis (fijas y simultáneas) + 1 Paññā = 36 cetasikas (AS I.31–34 / II.36).",
        },
        fixedCetasikas: fixed,
        optionalCetasikas: [],
        totalSangahaCount: 36,
        asRef: "AS I.31–34 / II.36",
        hetuType: "tihetuka",
        kiccaPali: kind === "magga" ? "Javana (Maggakicca)" : "Javana (Phalasamāpatti)",
        dvaraPali: "Ekadvārika (Manodvāra)",
        arammanaPali: "Asaṅkhata-dhātu (Nibbāna)",
        vatthuPali:
          kind === "magga" && st.idx === 1
            ? "Hadayavatthu (ekantena)"
            : "Hadayavatthu (nissāya vā anissāya vā)",
        jhanaFactorsPali: "Vitakka, Vicāra, Pīti, Sukha, Ekaggatā",
        eradicationNote: st.eradication,
      });
    }
  }

  return list;
}

function buildCanonicalCittas121(): CanonicalCitta[] {
  const list = buildCommonMundaneCittas();

  // F. 40 Lokuttara Cittas (#82..#121) — Vitthāra-gaṇanā (AS I.38-43 / II.36-37)
  // 4 Maggas × 5 Jhānas = 20 Maggacittāni (#82..#101)
  // 4 Phalas × 5 Jhānas = 20 Phalacittāni (#102..#121)
  const jhanaInfo: Record<
    1 | 2 | 3 | 4 | 5,
    {
      paliPrefix: string;
      factorsPt: string;
      factorsEn: string;
      factorsEs: string;
      factorsPali: string;
      cetasikaCount: number;
      vedanaBit: 1 | 0;
      pakIds: readonly number[];
    }
  > = {
    1: {
      paliPrefix: "Paṭhamajjhāna",
      factorsPt: "Vitakka, Vicāra, Pīti, Sukha, Ekaggatā",
      factorsEn: "Vitakka, Vicāra, Pīti, Sukha, Ekaggatā",
      factorsEs: "Vitakka, Vicāra, Pīti, Sukha, Ekaggatā",
      factorsPali: "Vitakka, Vicāra, Pīti, Sukha, Ekaggatā",
      cetasikaCount: 36,
      vedanaBit: 1,
      pakIds: [8, 9, 10, 11, 12, 13],
    },
    2: {
      paliPrefix: "Dutiyajjhāna",
      factorsPt: "Vicāra, Pīti, Sukha, Ekaggatā (vitakkavajjā: sem Vitakka)",
      factorsEn: "Vicāra, Pīti, Sukha, Ekaggatā (vitakkavajjā: without Vitakka)",
      factorsEs: "Vicāra, Pīti, Sukha, Ekaggatā (vitakkavajjā: sin Vitakka)",
      factorsPali: "Vicāra, Pīti, Sukha, Ekaggatā",
      cetasikaCount: 35,
      vedanaBit: 1,
      pakIds: [9, 10, 11, 12, 13],
    },
    3: {
      paliPrefix: "Tatiyajjhāna",
      factorsPt: "Pīti, Sukha, Ekaggatā (vitakkavicāravajjā: sem Vitakka e Vicāra)",
      factorsEn: "Pīti, Sukha, Ekaggatā (vitakkavicāravajjā: without Vitakka & Vicāra)",
      factorsEs: "Pīti, Sukha, Ekaggatā (vitakkavicāravajjā: sin Vitakka ni Vicāra)",
      factorsPali: "Pīti, Sukha, Ekaggatā",
      cetasikaCount: 34,
      vedanaBit: 1,
      pakIds: [10, 11, 12, 13],
    },
    4: {
      paliPrefix: "Catutthajjhāna",
      factorsPt: "Sukha, Ekaggatā (vitakkavicārapītivajjā: sem Vitakka, Vicāra e Pīti)",
      factorsEn: "Sukha, Ekaggatā (vitakkavicārapītivajjā: without Vitakka, Vicāra & Pīti)",
      factorsEs: "Sukha, Ekaggatā (vitakkavicārapītivajjā: sin Vitakka, Vicāra ni Pīti)",
      factorsPali: "Sukha, Ekaggatā",
      cetasikaCount: 33,
      vedanaBit: 1,
      pakIds: [10, 11, 13],
    },
    5: {
      paliPrefix: "Pañcamajjhāna",
      factorsPt: "Upekkhā, Ekaggatā (upekkhāsahagatā: com Upekkhā ao invés de Sukha)",
      factorsEn: "Upekkhā, Ekaggatā (upekkhāsahagatā: with Upekkhā instead of Sukha)",
      factorsEs: "Upekkhā, Ekaggatā (upekkhāsahagatā: con Upekkhā en vez de Sukha)",
      factorsPali: "Upekkhā, Ekaggatā",
      cetasikaCount: 33,
      vedanaBit: 0,
      pakIds: [10, 11, 13],
    },
  };

  const maggaStages121 = [
    {
      idx: 1 as const,
      pali: "sotāpatti",
      codeTag: "Sot",
      pt: "Entrada na Corrente (Sotāpatti)",
      en: "Stream-entry (Sotāpatti)",
      es: "Entrada en la Corriente (Sotāpatti)",
      eradication: {
        pt: "Erradica definitivamente Diṭṭhi (todas as visões errôneas: 4 Lobha #1, #2, #5, #6) e Vicikicchā (dúvida cética: Moha #11). Fecha para sempre os 4 Apāyas. Máximo 7 vidas (sattakkhattu-parama).",
        en: "Permanently eradicates Diṭṭhi (all wrong views: 4 Lobha #1, #2, #5, #6) and Vicikicchā (skeptical doubt: Moha #11). Forever seals the 4 Apāyas. Max 7 lifetimes (sattakkhattu-parama).",
        es: "Erradica definitivamente Diṭṭhi (todas las visiones erróneas: 4 Lobha #1, #2, #5, #6) y Vicikicchā (duda escéptica: Moha #11). Cierra para siempre los 4 Apāyas. Máximo 7 vidas (sattakkhattu-parama).",
      },
    },
    {
      idx: 2 as const,
      pali: "sakadāgāmi",
      codeTag: "Sak",
      pt: "Um-Retorno (Sakadāgāmī)",
      en: "Once-return (Sakadāgāmī)",
      es: "Un-Retorno (Sakadāgāmī)",
      eradication: {
        pt: "Atenua significativamente (tanukaraṇa) o apego sensorial grosseiro (kāmarāga) e a aversão/repulsa grosseira (paṭigha). Retorna no máximo mais uma única vez à esfera sensorial humana.",
        en: "Significantly attenuates (tanukaraṇa) coarse sensual lust (kāmarāga) and coarse ill-will (paṭigha). Returns at most once more to the sense-sphere.",
        es: "Atenúa significativamente (tanukaraṇa) el apego sensorial grosero (kāmarāga) y la aversión grosera (paṭigha). Retorna a lo sumo una sola vez más a la esfera sensorial.",
      },
    },
    {
      idx: 3 as const,
      pali: "anāgāmi",
      codeTag: "Ana",
      pt: "Não-Retorno (Anāgāmī)",
      en: "Non-return (Anāgāmī)",
      es: "No-Retorno (Anāgāmī)",
      eradication: {
        pt: "Erradica completamente todo o apego sensorial residual (kāmarāga) e toda aversão/irritação (paṭigha — eliminando ambas as 2 Dosa-mūla #9 e #10). Jamais retorna a Kāmaloka; renasce nos reinos Brahma (em especial nos 5 Suddhāvāsa, se dotado do 5º Jhāna).",
        en: "Completely eradicates all residual sensual craving (kāmarāga) and all ill-will (paṭigha — eliminating both 2 Dosa-mūla #9 and #10). Never returns to Kāmaloka; reborn in Brahma realms (especially the 5 Suddhāvāsa Pure Abodes with 5th Jhāna).",
        es: "Erradica completamente todo el apego sensual residual (kāmarāga) y toda aversión (paṭigha — eliminando ambas 2 Dosa-mūla #9 y #10). Jamás retorna a Kāmaloka; renace en los reinos Brahma (en especial en los 5 Suddhāvāsa con 5.º Jhāna).",
      },
    },
    {
      idx: 4 as const,
      pali: "arahatta",
      codeTag: "Ara",
      pt: "Estado de Arahant (Arahatta)",
      en: "Arahantship (Arahatta)",
      es: "Estado de Arahant (Arahatta)",
      eradication: {
        pt: "Erradica todas as amarras superiores (rūparāga, arūparāga, māna, uddhacca, avijjā). Elimina as 4 Lobha restantes (#3, #4, #7, #8) e Moha #12. Fim absoluto do saṃsāra.",
        en: "Eradicates all higher fetters (rūparāga, arūparāga, māna, uddhacca, avijjā). Eliminates the remaining 4 Lobha (#3, #4, #7, #8) and Moha #12. Absolute end of saṃsāra.",
        es: "Erradica todos los grilletes superiores (rūparāga, arūparāga, māna, uddhacca, avijjā). Elimina las 4 Lobha restantes (#3, #4, #7, #8) y Moha #12. Fin absoluto del saṃsāra.",
      },
    },
  ];

  for (const kind of ["magga", "phala"] as const) {
    for (const st of maggaStages121) {
      for (const jh of [1, 2, 3, 4, 5] as const) {
        const id = (kind === "magga" ? 81 : 101) + (st.idx - 1) * 5 + jh;
        const jhMeta = jhanaInfo[jh];
        const fixed = [...UNIV_7, ...jhMeta.pakIds, ...SOBHANA_UNIV_19, ...VIRATI_3, ...PANNA_1];
        const code = `Lok-${kind === "magga" ? "Mag" : "Pha"}-${st.codeTag}-J${jh}`;
        const pali = `${jhMeta.paliPrefix}-${st.pali}${kind}cittaṃ`;

        list.push({
          id,
          code,
          family: "lokuttara",
          bhumi: "lokuttara",
          jati: kind === "magga" ? "kusala" : "vipaka",
          pali,
          name: {
            pt: `Consciência Supramundana do ${kind === "magga" ? "Caminho (Magga)" : "Fruto (Phala)"} de ${st.pt} — ${jh}º Jhāna (#${id})`,
            en: `Supramundane ${st.en} ${kind === "magga" ? "Path (Magga)" : "Fruition (Phala)"} consciousness — ${jh}${jh === 1 ? "st" : jh === 2 ? "nd" : jh === 3 ? "rd" : "th"} Jhāna (#${id})`,
            es: `Conciencia Supramundana del ${kind === "magga" ? "Camino (Magga)" : "Fruto (Phala)"} de ${st.es} — ${jh}.º Jhāna (#${id})`,
          },
          bitVedana: jhMeta.vedanaBit,
          bitCognitive: 1,
          bitSankhara: "fixed",
          jhanaStage: jh,
          maggaStage: st.idx,
          formulaNote: {
            pt: `Na enumeração detalhada (Vitthāra de 121 cittas, AS I.38-43): o ${jh}º Jhāna de ${st.pt} (${kind === "magga" ? "Magga" : "Phala"}) contém 7 Universais + ${jhMeta.pakIds.length} Particulares + 19 Belos Universais + 3 Viratis (FIXAS e simultâneas no objeto Nibbāna) + 1 Paññindriya = ${jhMeta.cetasikaCount} cetasikas (AS II.36-37: "Chattiṃsa pañcatiṃsa ca, catuttiṃsa yathākkamaṃ. Tettiṃsadvayamiccevaṃ, pañcadhānuttare ṭhitā").`,
            en: `In the detailed enumeration (Vitthāra of 121 cittas, AS I.38-43): the ${jh}${jh === 1 ? "st" : jh === 2 ? "nd" : jh === 3 ? "rd" : "th"} Jhāna of ${st.en} (${kind === "magga" ? "Path" : "Fruition"}) contains 7 Universals + ${jhMeta.pakIds.length} Particulars + 19 Beautiful Universals + 3 Viratis (FIXED & simultaneous on Nibbāna) + 1 Paññindriya = ${jhMeta.cetasikaCount} cetasikas (AS II.36-37).`,
            es: `En la enumeración detallada (Vitthāra de 121 cittas, AS I.38-43): el ${jh}.º Jhāna de ${st.es} (${kind === "magga" ? "Camino" : "Fruto"}) contiene 7 Universales + ${jhMeta.pakIds.length} Particulares + 19 Bellos Universales + 3 Viratis (FIJAS y simultáneas en Nibbāna) + 1 Paññindriya = ${jhMeta.cetasikaCount} cetasikas (AS II.36-37).`,
          },
          fixedCetasikas: fixed,
          optionalCetasikas: [],
          totalSangahaCount: jhMeta.cetasikaCount,
          asRef: "AS I.38–40 / II.36–37",
          hetuType: "tihetuka",
          kiccaPali: kind === "magga" ? "Javana (Maggakicca)" : "Javana (Phalasamāpatti)",
          dvaraPali: "Ekadvārika (Manodvāra)",
          arammanaPali: "Asaṅkhata-dhātu (Nibbāna)",
          vatthuPali:
            kind === "magga" && st.idx === 1
              ? "Hadayavatthu (ekantena)"
              : "Hadayavatthu (nissāya vā anissāya vā)",
          jhanaFactorsPali: jhMeta.factorsPali,
          eradicationNote: st.eradication,
        });
      }
    }
  }

  return list;
}

export const CANONICAL_CITTAS_89: readonly CanonicalCitta[] = buildCanonicalCittas89();
export const CANONICAL_CITTAS_121: readonly CanonicalCitta[] = buildCanonicalCittas121();

// ── 2. THE PERIODIC TABLE OF THE 72 REALITIES (SABHĀVA-DHAMMAS — AS VII.2) ──

export const PERIODIC_ELEMENTS_72: readonly SabhavaElement[] = [
  // 1. CITTA (1)
  {
    atomicNumber: 1,
    subId: 1,
    paramattha: "citta",
    block: "citta",
    symbol: "Ci",
    pali: "Citta (Viññāṇa)",
    name: { pt: "Consciência (Citta)", en: "Consciousness (Citta)", es: "Conciencia (Citta)" },
    lakkhana: {
      pt: "Cognizar o objeto (vijānana-lakkhaṇa)",
      en: "Cognizing the object (vijānana-lakkhaṇa)",
      es: "Cognizar el objeto (vijānana-lakkhaṇa)",
    },
    valenceRule: {
      pt: "1 realidade intrínseca única (sabhāva) que se diferencia em 89/121 modos conforme os cetasikas associados.",
      en: "1 single intrinsic reality (sabhāva) differentiated into 89/121 modes according to associated cetasikas.",
      es: "1 única realidad intrínseca (sabhāva) que se diferencia en 89/121 modos según los cetasikas asociados.",
    },
    cittaCount89: 89,
    cittaCount121: 121,
  },

  // 2..8: 7 UNIVERSALS (Sabbacittasādhāraṇa)
  {
    atomicNumber: 2,
    subId: 1,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Ph",
    pali: "Phassa",
    name: { pt: "Contato", en: "Contact", es: "Contacto" },
    lakkhana: { pt: "Tocar o objeto mentalmente", en: "Touching the object", es: "Tocar el objeto" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 3,
    subId: 2,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Ve",
    pali: "Vedanā",
    name: { pt: "Sensação", en: "Feeling", es: "Sensación" },
    lakkhana: { pt: "Experimentar o sabor do objeto", en: "Experiencing the taste of the object", es: "Experimentar el sabor del objeto" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas (assume 5 modos: sukha, dukkha, somanassa, domanassa, upekkhā).", en: "Universal: present in all 89 (121) cittas (takes 5 modes: sukha, dukkha, somanassa, domanassa, upekkhā).", es: "Universal: presente en los 89 (121) cittas (asume 5 modos: sukha, dukkha, somanassa, domanassa, upekkhā)." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 4,
    subId: 3,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Sñ",
    pali: "Saññā",
    name: { pt: "Percepção", en: "Perception", es: "Percepción" },
    lakkhana: { pt: "Marcar e reconhecer sinais do objeto", en: "Marking and recognizing signs of the object", es: "Marcar y reconocer signos del objeto" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 5,
    subId: 4,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Ce",
    pali: "Cetanā",
    name: { pt: "Volição", en: "Volition", es: "Volición" },
    lakkhana: { pt: "Coordenar os fatores associados (arquiteto do kamma)", en: "Coordinating associated factors (architect of kamma)", es: "Coordinar los factores asociados (arquitecto del kamma)" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 6,
    subId: 5,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Ek",
    pali: "Ekaggatā",
    name: { pt: "Unificação", en: "One-pointedness", es: "Unificación" },
    lakkhana: { pt: "Não-dispersão da mente num único objeto", en: "Non-distraction on a single object", es: "No dispersión en un único objeto" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 7,
    subId: 6,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Jv",
    pali: "Jīvitindriya",
    name: { pt: "Faculdade Vital Mental", en: "Mental Life Faculty", es: "Facultad Vital Mental" },
    lakkhana: { pt: "Sustentar a vida dos fatores conascidos", en: "Sustaining the life of co-nascent factors", es: "Sostener la vida de los factores conacidos" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },
  {
    atomicNumber: 8,
    subId: 7,
    paramattha: "cetasika",
    block: "sabbacitta",
    symbol: "Mn",
    pali: "Manasikāra",
    name: { pt: "Atenção", en: "Attention", es: "Atención" },
    lakkhana: { pt: "Conduzir a mente em direção ao objeto (como o leme)", en: "Conducting the mind toward the object (like a rudder)", es: "Conducir la mente hacia el objeto (como un timón)" },
    valenceRule: { pt: "Universal: presente em todos os 89 (121) cittas.", en: "Universal: present in all 89 (121) cittas.", es: "Universal: presente en los 89 (121) cittas." },
    cittaCount89: 89,
    cittaCount121: 121,
  },

  // 9..14: 6 PARTICULARS (Pakiṇṇaka)
  {
    atomicNumber: 9,
    subId: 8,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Vt",
    pali: "Vitakka",
    name: { pt: "Aplicação Inicial", en: "Initial Application", es: "Aplicación Inicial" },
    lakkhana: { pt: "Elevar a mente até o objeto (bater do sino)", en: "Lifting the mind onto the object (striking a bell)", es: "Elevar la mente hacia el objeto (golpear la campana)" },
    valenceRule: { pt: "Presente em 55 cittas (exclui Dvipañca-viññāṇa [10] e Jhānas superiores [24/56]).", en: "Present in 55 cittas (excludes Dvipañca-viññāṇa [10] and higher Jhānas [24/56]).", es: "Presente en 55 cittas (excluye Dvipañca-viññāṇa [10] y Jhānas superiores [24/56])." },
    cittaCount89: 55,
    cittaCount121: 55,
  },
  {
    atomicNumber: 10,
    subId: 9,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Vc",
    pali: "Vicāra",
    name: { pt: "Aplicação Sustida", en: "Sustained Application", es: "Aplicación Sostenida" },
    lakkhana: { pt: "Manter e acariciar o objeto (ressoar do sino)", en: "Continued stroking of the object (ringing of the bell)", es: "Mantener el contacto con el objeto (vibrar de la campana)" },
    valenceRule: { pt: "Presente em 58 (66) cittas (exclui Dvipañca-viññāṇa [10] e Jhānas 3–5).", en: "Present in 58 (66) cittas (excludes Dvipañca-viññāṇa [10] and Jhānas 3–5).", es: "Presente en 58 (66) cittas (excluye Dvipañca-viññāṇa [10] y Jhānas 3–5)." },
    cittaCount89: 58,
    cittaCount121: 66,
  },
  {
    atomicNumber: 11,
    subId: 10,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Ad",
    pali: "Adhimokkha",
    name: { pt: "Determinação / Decisão", en: "Decision / Resolution", es: "Determinación / Decisión" },
    lakkhana: { pt: "Convicção decisiva sobre o objeto (como um pilar)", en: "Decisive conviction regarding the object (like a pillar)", es: "Convicción decisiva sobre el objeto (como un pilar)" },
    valenceRule: { pt: "Presente em 78 (110) cittas (exclui Dvipañca-viññāṇa [10] e Vicikicchā-sampayutta [1]).", en: "Present in 78 (110) cittas (excludes Dvipañca-viññāṇa [10] and Vicikicchā-sampayutta [1]).", es: "Presente en 78 (110) cittas (excluye Dvipañca-viññāṇa [10] y Vicikicchā-sampayutta [1])." },
    cittaCount89: 78,
    cittaCount121: 110,
  },
  {
    atomicNumber: 12,
    subId: 11,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Vr",
    pali: "Vīriya",
    name: { pt: "Energia", en: "Energy", es: "Energía" },
    lakkhana: { pt: "Esforço e sustentação corajosa", en: "Exertion and courageous support", es: "Esfuerzo y sostén valeroso" },
    valenceRule: { pt: "Presente em 73 (105) cittas (exclui 16 Ahetukas: todas menos Manodvārāvajjana e Hasituppāda).", en: "Present in 73 (105) cittas (excludes 16 Ahetukas: all except Manodvārāvajjana and Hasituppāda).", es: "Presente en 73 (105) cittas (excluye 16 Ahetukas: todas menos Manodvārāvajjana y Hasituppāda)." },
    cittaCount89: 73,
    cittaCount121: 105,
  },
  {
    atomicNumber: 13,
    subId: 12,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Pī",
    pali: "Pīti",
    name: { pt: "Entusiasmo / Êxtase", en: "Zest / Rapture", es: "Entusiasmo / Júbilo" },
    lakkhana: { pt: "Deleite e interesse vivo no objeto", en: "Delighting in the object", es: "Deleite vivo en el objeto" },
    valenceRule: { pt: "Presente em 35 (51) cittas (apenas c/ Somanassa nos Jhānas 1–3; ausente no 4º Jhāna embora este tenha Somanassa!).", en: "Present in 35 (51) cittas (only w/ Somanassa in Jhānas 1–3; absent in 4th Jhāna despite Somanassa!).", es: "Presente en 35 (51) cittas (solo con Somanassa en Jhānas 1–3; ausente en el 4.º Jhāna a pesar de tener Somanassa)." },
    cittaCount89: 35,
    cittaCount121: 51,
  },
  {
    atomicNumber: 14,
    subId: 13,
    paramattha: "cetasika",
    block: "pakinnaka",
    symbol: "Ch",
    pali: "Chanda",
    name: { pt: "Desejo de Agir", en: "Desire-to-act", es: "Deseo de Actuar" },
    lakkhana: { pt: "Estender a mão da mente para realizar algo (eticamente variável)", en: "Reaching out to accomplish (ethically variable)", es: "Impulso intencional de actuar (éticamente variable)" },
    valenceRule: { pt: "Presente em 69 (101) cittas (exclui as 18 Ahetukas e as 2 Mohamūlas = 20 cittas sem Chanda).", en: "Present in 69 (101) cittas (excludes 18 Ahetukas and 2 Mohamūlas = 20 cittas without Chanda).", es: "Presente en 69 (101) cittas (excluye 18 Ahetukas y 2 Mohamūlas = 20 cittas sin Chanda)." },
    cittaCount89: 69,
    cittaCount121: 101,
  },

  // 15..28: 14 UNWHOLESOME (Akusala = 4 + 3 + 4 + 2 + 1)
  {
    atomicNumber: 15,
    subId: 14,
    paramattha: "cetasika",
    block: "akusala_univ",
    symbol: "Mo",
    pali: "Moha",
    name: { pt: "Ilusão", en: "Delusion", es: "Ilusión" },
    lakkhana: { pt: "Cegueira mental que encobre a natureza real dos dhammas", en: "Mental blindness concealing the true nature of dhammas", es: "Ceguera mental que oculta la naturaleza real de los dhammas" },
    valenceRule: { pt: "Akusala Universal (Moha-catukka): presente em todas as 12 Akusala Cittas.", en: "Universal Unwholesome (Moha-catukka): present in all 12 Akusala Cittas.", es: "Akusala Universal (Moha-catukka): presente en las 12 Akusala Cittas." },
    cittaCount89: 12,
    cittaCount121: 12,
  },
  {
    atomicNumber: 16,
    subId: 15,
    paramattha: "cetasika",
    block: "akusala_univ",
    symbol: "Ah",
    pali: "Ahirika",
    name: { pt: "Desvergonha Moral", en: "Shamelessness", es: "Desvergüenza Moral" },
    lakkhana: { pt: "Ausência de repugnância por ações insalubres", en: "Lack of disgust at bodily and verbal misconduct", es: "Ausencia de repugnancia ante la mala conducta" },
    valenceRule: { pt: "Akusala Universal (Moha-catukka): presente em todas as 12 Akusala Cittas.", en: "Universal Unwholesome (Moha-catukka): present in all 12 Akusala Cittas.", es: "Akusala Universal (Moha-catukka): presente en las 12 Akusala Cittas." },
    cittaCount89: 12,
    cittaCount121: 12,
  },
  {
    atomicNumber: 17,
    subId: 16,
    paramattha: "cetasika",
    block: "akusala_univ",
    symbol: "An",
    pali: "Anottappa",
    name: { pt: "Destemor Moral", en: "Fearlessness of Wrongdoing", es: "Falta de Temor Moral" },
    lakkhana: { pt: "Ausência de receio das consequências do mal", en: "Lack of dread regarding consequences of evil", es: "Ausencia de temor a las consecuencias del mal" },
    valenceRule: { pt: "Akusala Universal (Moha-catukka): presente em todas as 12 Akusala Cittas.", en: "Universal Unwholesome (Moha-catukka): present in all 12 Akusala Cittas.", es: "Akusala Universal (Moha-catukka): presente en las 12 Akusala Cittas." },
    cittaCount89: 12,
    cittaCount121: 12,
  },
  {
    atomicNumber: 18,
    subId: 17,
    paramattha: "cetasika",
    block: "akusala_univ",
    symbol: "Ud",
    pali: "Uddhacca",
    name: { pt: "Agitação", en: "Restlessness", es: "Agitación" },
    lakkhana: { pt: "Desassossego mental (como cinzas atingidas por uma pedra)", en: "Disquietude of mind (like ashes hit by a stone)", es: "Inquietud mental (como cenizas golpeadas por una piedra)" },
    valenceRule: { pt: "Akusala Universal (Moha-catukka): presente em todas as 12 Akusala Cittas.", en: "Universal Unwholesome (Moha-catukka): present in all 12 Akusala Cittas.", es: "Akusala Universal (Moha-catukka): presente en las 12 Akusala Cittas." },
    cittaCount89: 12,
    cittaCount121: 12,
  },
  {
    atomicNumber: 19,
    subId: 18,
    paramattha: "cetasika",
    block: "akusala_lobha",
    symbol: "Lo",
    pali: "Lobha",
    name: { pt: "Avidez", en: "Greed", es: "Avidez" },
    lakkhana: { pt: "Agarrar o objeto (como visgo de capturar macacos)", en: "Grasping the object (like monkey-lime)", es: "Aferrar el objeto (como liga pegajosa)" },
    valenceRule: { pt: "Presente nas 8 Lobhamūla Cittas (#1–#8).", en: "Present in the 8 Lobhamūla Cittas (#1–#8).", es: "Presente en las 8 Lobhamūla Cittas (#1–#8)." },
    cittaCount89: 8,
    cittaCount121: 8,
  },
  {
    atomicNumber: 20,
    subId: 19,
    paramattha: "cetasika",
    block: "akusala_lobha",
    symbol: "Di",
    pali: "Diṭṭhi",
    name: { pt: "Visão Errônea", en: "Wrong View", es: "Visión Errónea" },
    lakkhana: { pt: "Interpretação dogmática incorreta da realidade", en: "Unwise dogmatic interpretation of things", es: "Interpretación dogmática incorrecta de la realidad" },
    valenceRule: { pt: "Fixo nas 4 Lobhamūlas diṭṭhigata-sampayutta (#1, #2, #5, #6). Nunca surge com Māna nem com Dosa!", en: "Fixed in the 4 diṭṭhigata-sampayutta Lobhamūlas (#1, #2, #5, #6). Never arises with Māna or Dosa!", es: "Fijo en las 4 Lobhamūlas diṭṭhigata-sampayutta (#1, #2, #5, #6). ¡Nunca surge con Māna ni con Dosa!" },
    cittaCount89: 4,
    cittaCount121: 4,
  },
  {
    atomicNumber: 21,
    subId: 20,
    paramattha: "cetasika",
    block: "akusala_lobha",
    symbol: "Mā",
    pali: "Māna",
    name: { pt: "Presunção / Orgulho", en: "Conceit", es: "Presunción / Orgullo" },
    lakkhana: { pt: "Autoexaltação e comparação ('sou superior/igual/inferior')", en: "Haughtiness and self-comparison", es: "Autoexaltación y comparación del yo" },
    valenceRule: { pt: "Ocasional (aniyata) apenas nas 4 Lobhamūlas diṭṭhigata-vippayutta (#3, #4, #7, #8). Nunca coexiste com Diṭṭhi!", en: "Occasional (aniyata) only in the 4 diṭṭhigata-vippayutta Lobhamūlas (#3, #4, #7, #8). Never coexists with Diṭṭhi!", es: "Ocasional (aniyata) solo en las 4 Lobhamūlas diṭṭhigata-vippayutta (#3, #4, #7, #8). ¡Nunca coexiste con Diṭṭhi!" },
    cittaCount89: 4,
    cittaCount121: 4,
  },
  {
    atomicNumber: 22,
    subId: 21,
    paramattha: "cetasika",
    block: "akusala_dosa",
    symbol: "Do",
    pali: "Dosa",
    name: { pt: "Aversão", en: "Aversion / Hatred", es: "Aversión" },
    lakkhana: { pt: "Ferocidade e rejeição hostil do objeto", en: "Ferocity and hostile rejection of the object", es: "Ferocidad y rechazo hostil del objeto" },
    valenceRule: { pt: "Fixo nas 2 Dosamūla Cittas (#9–#10). Sempre acompanhado de Domanassa (exclui Pīti).", en: "Fixed in the 2 Dosamūla Cittas (#9–#10). Always accompanied by Domanassa (excludes Pīti).", es: "Fijo en las 2 Dosamūla Cittas (#9–#10). Siempre acompañado de Domanassa (excluye Pīti)." },
    cittaCount89: 2,
    cittaCount121: 2,
  },
  {
    atomicNumber: 23,
    subId: 22,
    paramattha: "cetasika",
    block: "akusala_dosa",
    symbol: "Is",
    pali: "Issā",
    name: { pt: "Inveja", en: "Envy", es: "Envidia" },
    lakkhana: { pt: "Ressentimento pelo sucesso ou qualidades alheias", en: "Jealousy at others' success", es: "Resentimiento por el éxito ajeno" },
    valenceRule: { pt: "Ocasional nas 2 Dosamūlas (#9–#10). Mutuamente exclusivo com Macchariya e Kukkucca!", en: "Occasional in the 2 Dosamūlas (#9–#10). Mutually exclusive with Macchariya and Kukkucca!", es: "Ocasional en las 2 Dosamūlas (#9–#10). ¡Mutuamente exclusivo con Macchariya y Kukkucca!" },
    cittaCount89: 2,
    cittaCount121: 2,
  },
  {
    atomicNumber: 24,
    subId: 23,
    paramattha: "cetasika",
    block: "akusala_dosa",
    symbol: "Mc",
    pali: "Macchariya",
    name: { pt: "Avareza", en: "Avarice / Stinginess", es: "Avaricia" },
    lakkhana: { pt: "Ocultar a própria prosperidade para não compartilhá-la", en: "Concealing one's own success or possessions", es: "Ocultar los propios bienes para no compartirlos" },
    valenceRule: { pt: "Ocasional nas 2 Dosamūlas (#9–#10). Mutuamente exclusivo com Issā e Kukkucca!", en: "Occasional in the 2 Dosamūlas (#9–#10). Mutually exclusive with Issā and Kukkucca!", es: "Ocasional en las 2 Dosamūlas (#9–#10). ¡Mutuamente exclusivo con Issā y Kukkucca!" },
    cittaCount89: 2,
    cittaCount121: 2,
  },
  {
    atomicNumber: 25,
    subId: 24,
    paramattha: "cetasika",
    block: "akusala_dosa",
    symbol: "Kk",
    pali: "Kukkucca",
    name: { pt: "Preocupação Moral / Remorso", en: "Remorse / Worry", es: "Preocupación Moral / Remordimiento" },
    lakkhana: { pt: "Ruminação aflita pelo mal feito ou bem não feito", en: "Remorse over wrong done and right undone", es: "Rumiación aflictiva por lo hecho o no hecho" },
    valenceRule: { pt: "Ocasional nas 2 Dosamūlas (#9–#10). Mutuamente exclusivo com Issā e Macchariya!", en: "Occasional in the 2 Dosamūlas (#9–#10). Mutually exclusive with Issā and Macchariya!", es: "Ocasional en las 2 Dosamūlas (#9–#10). ¡Mutuamente exclusivo con Issā y Macchariya!" },
    cittaCount89: 2,
    cittaCount121: 2,
  },
  {
    atomicNumber: 26,
    subId: 25,
    paramattha: "cetasika",
    block: "akusala_thina",
    symbol: "Th",
    pali: "Thīna",
    name: { pt: "Torpor (de Citta)", en: "Sloth (of Citta)", es: "Torpor (de Citta)" },
    lakkhana: { pt: "Embotamento e falta de vigor da consciência (Citta)", en: "Sluggishness and lack of driving power of Citta", es: "Embotamiento y falta de vigor de Citta" },
    valenceRule: { pt: "Ocasional inseparável de Middha apenas nas 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10).", en: "Occasional, inseparable from Middha, only in the 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10).", es: "Ocasional inseparable de Middha solo en las 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10)." },
    cittaCount89: 5,
    cittaCount121: 5,
  },
  {
    atomicNumber: 27,
    subId: 26,
    paramattha: "cetasika",
    block: "akusala_thina",
    symbol: "Md",
    pali: "Middha",
    name: { pt: "Sonolência (dos Cetasikas)", en: "Torpor (of Cetasikas)", es: "Somnolencia (de los Cetasikas)" },
    lakkhana: { pt: "Peso e inaptidão do corpo mental (cetasikas)", en: "Unwieldiness of the mental body (cetasikas)", es: "Pesadez e ineptitud del cuerpo mental (cetasikas)" },
    valenceRule: { pt: "Ocasional inseparável de Thīna apenas nas 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10).", en: "Occasional, inseparable from Thīna, only in the 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10).", es: "Ocasional inseparable de Thīna solo en las 5 Akusala Sasaṅkhārika Cittas (#2, #4, #6, #8, #10)." },
    cittaCount89: 5,
    cittaCount121: 5,
  },
  {
    atomicNumber: 28,
    subId: 27,
    paramattha: "cetasika",
    block: "akusala_vicikiccha",
    symbol: "Vk",
    pali: "Vicikicchā",
    name: { pt: "Dúvida Cética", en: "Doubt", es: "Duda Escéptica" },
    lakkhana: { pt: "Vacilação e incapacidade de decidir perante o Dhamma", en: "Wavering and inability to decide", es: "Vacilación e incapacidad de decidir" },
    valenceRule: { pt: "Exclusivo de 1 única Citta: a 1ª Mohamūla (#11). Bloqueia Adhimokkha!", en: "Exclusive to 1 single Citta: the 1st Mohamūla (#11). Blocks Adhimokkha!", es: "Exclusivo de 1 única Citta: la 1.ª Mohamūla (#11). ¡Bloquea Adhimokkha!" },
    cittaCount89: 1,
    cittaCount121: 1,
  },

  // 29..47: 19 UNIVERSAL BEAUTIFUL (Sobhana-sādhāraṇa)
  ...[
    { sub: 28, sym: "Sd", pali: "Saddhā", pt: "Confiança / Fé", en: "Confidence / Faith", es: "Confianza / Fe", lakPt: "Clarificar a mente como uma joia que purifica a água", lakEn: "Clarifying the mind like a water-purifying gem", lakEs: "Clarificar la mente como una gema que purifica el agua" },
    { sub: 29, sym: "St", pali: "Sati", pt: "Atenção Plena", en: "Mindfulness", es: "Atención Plena", lakPt: "Presença não-flutuante e não-esquecimento do objeto", lakEn: "Non-wobbling presence and non-forgetfulness", lakEs: "Presencia firme y no olvido del objeto" },
    { sub: 30, sym: "Hi", pali: "Hiri", pt: "Vergonha Moral", en: "Moral Shame", es: "Vergüenza Moral", lakPt: "Repugnância interna pelo mal (respeito próprio)", lakEn: "Internal disgust at evil (self-respect)", lakEs: "Repugnancia interna hacia el mal (autorrespeto)" },
    { sub: 31, sym: "Ot", pali: "Ottappa", pt: "Temor Moral", en: "Moral Dread", es: "Temor Moral", lakPt: "Temor das consequências kâmmicas do mal", lakEn: "Dread of kammic consequences of evil", lakEs: "Temor a las consecuencias kámmicas del mal" },
    { sub: 32, sym: "Al", pali: "Alobha", pt: "Não-Avidez", en: "Non-Greed", es: "No-Avidez", lakPt: "Desapego (como gota d'água na folha de lótus)", lakEn: "Unattachedness (like a water drop on a lotus leaf)", lakEs: "Desapego (como gota de agua en hoja de loto)" },
    { sub: 33, sym: "Ad", pali: "Adosa", pt: "Não-Aversão (Mettā)", en: "Non-Aversion (Mettā)", es: "No-Aversión (Mettā)", lakPt: "Ausência de aspereza (base da benevolência/mettā)", lakEn: "Lack of ferocity (basis of loving-kindness/mettā)", lakEs: "Ausencia de aspereza (base de la benevolencia/mettā)" },
    { sub: 34, sym: "Tm", pali: "Tatramajjhattatā", pt: "Equilíbrio Mental", en: "Neutrality of Mind", es: "Equilibrio Mental", lakPt: "Imparcialidade que mantém os fatores em proporção", lakEn: "Impartiality keeping factors balanced", lakEs: "Imparcialidad que mantiene los factores en equilibrio" },
    { sub: 35, sym: "Kp", pali: "Kāya-passaddhi", pt: "Tranquilidade do Corpo Mental", en: "Tranquillity of Mental Body", es: "Tranquilidad del Cuerpo Mental", lakPt: "Acalmar a inquietação dos cetasikas (opõe-se a Uddhacca)", lakEn: "Quieting disturbance of cetasikas (opposes Uddhacca)", lakEs: "Calmar la perturbación de los cetasikas" },
    { sub: 36, sym: "Cp", pali: "Citta-passaddhi", pt: "Tranquilidade da Consciência", en: "Tranquillity of Consciousness", es: "Tranquilidad de la Conciencia", lakPt: "Acalmar a inquietação de Citta", lakEn: "Quieting disturbance of Citta", lakEs: "Calmar la perturbación de Citta" },
    { sub: 37, sym: "Kl", pali: "Kāya-lahutā", pt: "Leveza do Corpo Mental", en: "Lightness of Mental Body", es: "Ligereza del Cuerpo Mental", lakPt: "Suprimir o peso dos cetasikas (opõe-se a Thīna-Middha)", lakEn: "Suppressing heaviness of cetasikas (opposes Thīna-Middha)", lakEs: "Suprimir la pesadez de los cetasikas" },
    { sub: 38, sym: "Cl", pali: "Citta-lahutā", pt: "Leveza da Consciência", en: "Lightness of Consciousness", es: "Ligereza de la Conciencia", lakPt: "Suprimir o peso de Citta", lakEn: "Suppressing heaviness of Citta", lakEs: "Suprimir la pesadez de Citta" },
    { sub: 39, sym: "Km", pali: "Kāya-mudutā", pt: "Maleabilidade do Corpo Mental", en: "Malleability of Mental Body", es: "Maleabilidad del Cuerpo Mental", lakPt: "Suprimir a rigidez dos cetasikas (opõe-se a Diṭṭhi e Māna)", lakEn: "Suppressing rigidity of cetasikas (opposes Diṭṭhi & Māna)", lakEs: "Suprimir la rigidez de los cetasikas" },
    { sub: 40, sym: "Cm", pali: "Citta-mudutā", pt: "Maleabilidade da Consciência", en: "Malleability of Consciousness", es: "Maleabilidad de la Conciencia", lakPt: "Suprimir a rigidez de Citta", lakEn: "Suppressing rigidity of Citta", lakEs: "Suprimir la rigidez de Citta" },
    { sub: 41, sym: "Kk", pali: "Kāya-kammaññatā", pt: "Adaptabilidade do Corpo Mental", en: "Wieldiness of Mental Body", es: "Adaptabilidad del Cuerpo Mental", lakPt: "Prontidão funcional dos cetasikas", lakEn: "Workability of cetasikas", lakEs: "Disposición funcional de los cetasikas" },
    { sub: 42, sym: "Ck", pali: "Citta-kammaññatā", pt: "Adaptabilidade da Consciência", en: "Wieldiness of Consciousness", es: "Adaptabilidad de la Conciencia", lakPt: "Prontidão funcional de Citta", lakEn: "Workability of Citta", lakEs: "Disposición funcional de Citta" },
    { sub: 43, sym: "Kg", pali: "Kāya-pāguññatā", pt: "Proficiência do Corpo Mental", en: "Proficiency of Mental Body", es: "Competencia del Cuerpo Mental", lakPt: "Saúde e destreza dos cetasikas (opõe-se a Assaddhiya)", lakEn: "Healthiness and skill of cetasikas", lakEs: "Salud y destreza de los cetasikas" },
    { sub: 44, sym: "Cg", pali: "Citta-pāguññatā", pt: "Proficiência da Consciência", en: "Proficiency of Consciousness", es: "Competencia de la Conciencia", lakPt: "Saúde e destreza de Citta", lakEn: "Healthiness and skill of Citta", lakEs: "Salud y destreza de Citta" },
    { sub: 45, sym: "Ku", pali: "Kāyujukatā", pt: "Retidão do Corpo Mental", en: "Rectitude of Mental Body", es: "Rectitud del Cuerpo Mental", lakPt: "Sinceridade e retidão dos cetasikas (opõe-se a Māyā/Sāṭheyya)", lakEn: "Straightness of cetasikas (opposes deceit)", lakEs: "Sinceridad y rectitud de los cetasikas" },
    { sub: 46, sym: "Cu", pali: "Cittujukatā", pt: "Retidão da Consciência", en: "Rectitude of Consciousness", es: "Rectitud de la Conciencia", lakPt: "Sinceridade e retidão de Citta", lakEn: "Straightness of Citta", lakEs: "Sinceridad y rectitud de Citta" },
  ].map((item): SabhavaElement => ({
    atomicNumber: item.sub + 1,
    subId: item.sub,
    paramattha: "cetasika",
    block: "sobhana_univ",
    symbol: item.sym,
    pali: item.pali,
    name: { pt: item.pt, en: item.en, es: item.es },
    lakkhana: { pt: item.lakPt, en: item.lakEn, es: item.lakEs },
    valenceRule: {
      pt: "Belo Universal (Sobhana-sādhāraṇa): os 19 surgem juntos em bloco em todas as 59 (ou 91) Sobhana Cittas!",
      en: "Universal Beautiful (Sobhana-sādhāraṇa): all 19 arise together as a block in all 59 (or 91) Sobhana Cittas!",
      es: "Bello Universal (Sobhana-sādhāraṇa): ¡los 19 surgen juntos en bloque en las 59 (o 91) Sobhana Cittas!",
    },
    cittaCount89: 59,
    cittaCount121: 91,
  })),

  // 48..50: 3 ABSTINENCES (Virati)
  ...[
    { sub: 47, sym: "Sv", pali: "Sammā-vācā", pt: "Fala Correta", en: "Right Speech", es: "Habla Correcta" },
    { sub: 48, sym: "Sk", pali: "Sammā-kammanta", pt: "Ação Correta", en: "Right Action", es: "Acción Correcta" },
    { sub: 49, sym: "Sā", pali: "Sammā-ājīva", pt: "Meio de Vida Correto", en: "Right Livelihood", es: "Medio de Vida Correcto" },
  ].map((item): SabhavaElement => ({
    atomicNumber: item.sub + 1,
    subId: item.sub,
    paramattha: "cetasika",
    block: "sobhana_virati",
    symbol: item.sym,
    pali: item.pali,
    name: { pt: item.pt, en: item.en, es: item.es },
    lakkhana: {
      pt: "Abster-se intencionalmente de transgressão quando surge oportunidade",
      en: "Intentional abstinence from transgression",
      es: "Abstenerse intencionalmente de transgresión",
    },
    valenceRule: {
      pt: "Presente em 16 (48) cittas: ocasionais e separadas (1 por vez) nas 8 Mahā-kusalas; fixas e simultâneas (todas as 3 juntas!) nas 8 (40) Lokuttaras.",
      en: "Present in 16 (48) cittas: occasional & separate (1 at a time) in 8 Mahā-kusalas; fixed & simultaneous (all 3 together!) in 8 (40) Lokuttaras.",
      es: "Presente en 16 (48) cittas: ocasionales y separadas (1 a la vez) en 8 Mahā-kusalas; fijas y simultáneas (¡las 3 juntas!) en 8 (40) Lokuttaras.",
    },
    cittaCount89: 16,
    cittaCount121: 48,
  })),

  // 51..52: 2 ILLIMITABLES (Appamaññā)
  {
    atomicNumber: 51,
    subId: 50,
    paramattha: "cetasika",
    block: "sobhana_appamanna",
    symbol: "Kr",
    pali: "Karuṇā",
    name: { pt: "Compaixão", en: "Compassion", es: "Compasión" },
    lakkhana: { pt: "Desejo de remover o sofrimento dos seres", en: "Desire to remove the suffering of beings", es: "Deseo de aliviar el sufrimiento de los seres" },
    valenceRule: {
      pt: "Ocasional em 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara dos Jhānas 1–4). Nunca coexiste com Muditā nem entra no 5º Jhāna/Lokuttara!",
      en: "Occasional in 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara of Jhānas 1–4). Never coexists with Muditā or enters 5th Jhāna/Lokuttara!",
      es: "Ocasional en 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara de Jhānas 1–4). ¡Nunca coexiste con Muditā ni entra en 5.º Jhāna/Lokuttara!",
    },
    cittaCount89: 28,
    cittaCount121: 28,
  },
  {
    atomicNumber: 52,
    subId: 51,
    paramattha: "cetasika",
    block: "sobhana_appamanna",
    symbol: "Mu",
    pali: "Muditā",
    name: { pt: "Alegria Altruísta", en: "Appreciative Joy", es: "Alegría Altruista" },
    lakkhana: { pt: "Regozijar-se com a prosperidade dos seres (opõe-se a Issā)", en: "Rejoicing in the success of beings (opposes Issā)", es: "Regocijarse por la prosperidad ajena (se opone a Issā)" },
    valenceRule: {
      pt: "Ocasional em 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara dos Jhānas 1–4). Nunca coexiste com Karuṇā!",
      en: "Occasional in 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara of Jhānas 1–4). Never coexists with Karuṇā!",
      es: "Ocasional en 28 cittas (8 Mahā-kusala + 8 Mahā-kiriya + 12 Rūpāvacara de Jhānas 1–4). ¡Nunca coexiste con Karuṇā!",
    },
    cittaCount89: 28,
    cittaCount121: 28,
  },

  // 53: 1 WISDOM (Paññindriya)
  {
    atomicNumber: 53,
    subId: 52,
    paramattha: "cetasika",
    block: "sobhana_panna",
    symbol: "Pñ",
    pali: "Paññindriya (Amoha)",
    name: { pt: "Faculdade de Sabedoria", en: "Wisdom Faculty", es: "Facultad de Sabiduría" },
    lakkhana: { pt: "Penetrar os dhammas como realmente são (yathābhūta)", en: "Penetrating dhammas as they really are", es: "Penetrar las realidades tal como son" },
    valenceRule: {
      pt: "Fixo em 47 (79) cittas: 12 Kāmasobhana ñāṇa-sampayutta + 15 Rūpāvacara + 12 Arūpāvacara + 8 (40) Lokuttara.",
      en: "Fixed in 47 (79) cittas: 12 Kāmasobhana ñāṇa-sampayutta + 15 Rūpāvacara + 12 Arūpāvacara + 8 (40) Lokuttara.",
      es: "Fijo en 47 (79) cittas: 12 Kāmasobhana ñāṇa-sampayutta + 15 Rūpāvacara + 12 Arūpāvacara + 8 (40) Lokuttara.",
    },
    cittaCount89: 47,
    cittaCount121: 79,
  },

  // 54..71: 18 CONCRETE RŪPAS (Nipphanna-rūpa = 4 + 5 + 4 + 2 + 1 + 1 + 1)
  ...[
    { sub: 1, sym: "Pṭ", block: "rupa_mahabhuta" as const, avin: true, pali: "Paṭhavī-dhātu", pt: "Elemento Terra (Solidez)", en: "Earth Element (Solidity)", es: "Elemento Tierra (Solidez)", lakPt: "Dureza/maciez; serve de suporte aos elementos conascidos", lakEn: "Hardness/softness; acts as foundation", lakEs: "Dureza/suavidad; sirve de soporte" },
    { sub: 2, sym: "Āp", block: "rupa_mahabhuta" as const, avin: true, pali: "Āpo-dhātu", pt: "Elemento Água (Coesão)", en: "Water Element (Cohesion)", es: "Elemento Agua (Cohesión)", lakPt: "Fluidez e coesão (intocável fisicamente, conhecido apenas pela mente!)", lakEn: "Fluidity and cohesion (cognized only by mind-door!)", lakEs: "Fluidez y cohesión (¡conocido solo por la puerta mental!)" },
    { sub: 3, sym: "Tj", block: "rupa_mahabhuta" as const, avin: true, pali: "Tejo-dhātu", pt: "Elemento Fogo (Temperatura)", en: "Fire Element (Temperature)", es: "Elemento Fuego (Temperatura)", lakPt: "Calor e frio (utu); amadurece a matéria", lakEn: "Heat and cold (utu); matures matter", lakEs: "Calor y frío (utu); madura la materialidad" },
    { sub: 4, sym: "Vy", block: "rupa_mahabhuta" as const, avin: true, pali: "Vāyo-dhātu", pt: "Elemento Vento (Distensão)", en: "Wind Element (Distension)", es: "Elemento Viento (Distensión)", lakPt: "Distensão, pressão e movimento dos kalāpas", lakEn: "Distension, pressure, and motion", lakEs: "Distensión, presión y movimiento" },
    { sub: 5, sym: "Ck", block: "rupa_pasada" as const, avin: false, pali: "Cakkhu-pasāda", pt: "Sensibilidade Visual", en: "Eye-sensitivity", es: "Sensibilidad Visual", lakPt: "Translucidez nascida do kamma sensível à cor/luz", lakEn: "Kamma-born sensitivity to visible form", lakEs: "Sensibilidad nacida del kamma ante el color" },
    { sub: 6, sym: "So", block: "rupa_pasada" as const, avin: false, pali: "Sota-pasāda", pt: "Sensibilidade Auditiva", en: "Ear-sensitivity", es: "Sensibilidad Auditiva", lakPt: "Translucidez nascida do kamma sensível ao som", lakEn: "Kamma-born sensitivity to sound", lakEs: "Sensibilidad nacida del kamma ante el sonido" },
    { sub: 7, sym: "Gh", block: "rupa_pasada" as const, avin: false, pali: "Ghāna-pasāda", pt: "Sensibilidade Olfativa", en: "Nose-sensitivity", es: "Sensibilidad Olfativa", lakPt: "Translucidez nascida do kamma sensível ao odor", lakEn: "Kamma-born sensitivity to odor", lakEs: "Sensibilidad nacida del kamma ante el olor" },
    { sub: 8, sym: "Ji", block: "rupa_pasada" as const, avin: false, pali: "Jivhā-pasāda", pt: "Sensibilidade Gustativa", en: "Tongue-sensitivity", es: "Sensibilidad Gustativa", lakPt: "Translucidez nascida do kamma sensível ao sabor", lakEn: "Kamma-born sensitivity to taste", lakEs: "Sensibilidad nacida del kamma ante el sabor" },
    { sub: 9, sym: "Ky", block: "rupa_pasada" as const, avin: false, pali: "Kāya-pasāda", pt: "Sensibilidade Tátil", en: "Body-sensitivity", es: "Sensibilidad Táctil", lakPt: "Translucidez espalhada pelo corpo sensível ao tangível (Terra+Fogo+Vento)", lakEn: "Sensitivity throughout body to tangibles (Earth+Fire+Wind)", lakEs: "Sensibilidad corporal a lo tangible (Tierra+Fuego+Viento)" },
    { sub: 10, sym: "Vṇ", block: "rupa_gocara" as const, avin: true, pali: "Vaṇṇa (Rūpa)", pt: "Cor / Visibilidade", en: "Visible Form / Color", es: "Color / Visibilidad", lakPt: "Impactar a sensibilidade do olho", lakEn: "Impinging on eye-sensitivity", lakEs: "Impactar la sensibilidad del ojo" },
    { sub: 11, sym: "Sd", block: "rupa_gocara" as const, avin: false, pali: "Sadda", pt: "Som", en: "Sound", es: "Sonido", lakPt: "Impactar a sensibilidade do ouvido (nascido de Citta ou Utu)", lakEn: "Impinging on ear-sensitivity (born of Citta or Utu)", lakEs: "Impactar la sensibilidad del oído (nacido de Citta o Utu)" },
    { sub: 12, sym: "Gn", block: "rupa_gocara" as const, avin: true, pali: "Gandha", pt: "Odor", en: "Odor", es: "Olor", lakPt: "Impactar a sensibilidade do nariz", lakEn: "Impinging on nose-sensitivity", lakEs: "Impactar la sensibilidad de la nariz" },
    { sub: 13, sym: "Rs", block: "rupa_gocara" as const, avin: true, pali: "Rasa", pt: "Sabor", en: "Taste", es: "Sabor", lakPt: "Impactar a sensibilidade da língua", lakEn: "Impinging on tongue-sensitivity", lakEs: "Impactar la sensibilidad de la lengua" },
    { sub: 14, sym: "It", block: "rupa_bhava" as const, avin: false, pali: "Itthatta (Itthibhāva)", pt: "Feminilidade", en: "Femininity", es: "Feminidad", lakPt: "Faculdade material nascida do kamma determinante do sexo feminino", lakEn: "Kamma-born material faculty of femininity", lakEs: "Facultad material nacida del kamma de feminidad" },
    { sub: 15, sym: "Pu", block: "rupa_bhava" as const, avin: false, pali: "Purisatta (Purisabhāva)", pt: "Masculinidade", en: "Masculinity", es: "Masculinidad", lakPt: "Faculdade material nascida do kamma determinante do sexo masculino", lakEn: "Kamma-born material faculty of masculinity", lakEs: "Facultad material nacida del kamma de masculinidad" },
    { sub: 16, sym: "Hd", block: "rupa_hadaya" as const, avin: false, pali: "Hadaya-vatthu", pt: "Base Cardíaca", en: "Heart-base", es: "Base Cardíaca", lakPt: "Suporte físico de Mano-dhātu e Mano-viññāṇa-dhātu", lakEn: "Physical support of Mano-dhātu and Mano-viññāṇa-dhātu", lakEs: "Soporte físico de Mano-dhātu y Mano-viññāṇa-dhātu" },
    { sub: 17, sym: "Jr", block: "rupa_jivita" as const, avin: false, pali: "Rūpa-jīvitindriya", pt: "Faculdade Vital Material", en: "Material Life Faculty", es: "Facultad Vital Material", lakPt: "Manter vivos os rūpas conascidos produzidos por kamma", lakEn: "Sustaining co-nascent kamma-born matter", lakEs: "Mantener vivos los rūpas nacidos del kamma" },
    { sub: 18, sym: "Oj", block: "rupa_ahara" as const, avin: true, pali: "Kabaḷīkārāhāra (Oja)", pt: "Essência Nutritiva (Nutrição)", en: "Nutritive Essence (Nutriment)", es: "Esencia Nutritiva (Alimento)", lakPt: "Sustentar e gerar novos agrupamentos materiais (kalāpas)", lakEn: "Sustaining and generating new material clusters (kalāpas)", lakEs: "Sostener y generar nuevos grupos materiales (kalāpas)" },
  ].map((item): SabhavaElement => ({
    atomicNumber: 53 + item.sub,
    subId: item.sub,
    paramattha: "rupa",
    block: item.block,
    symbol: item.sym,
    pali: item.pali,
    name: { pt: item.pt, en: item.en, es: item.es },
    lakkhana: { pt: item.lakPt, en: item.lakEn, es: item.lakEs },
    valenceRule: {
      pt: item.avin
        ? "Nipphanna-rūpa Concreto + Octeto Inseparável (Avinibbhoga-rūpa [8]): presente em TODOS os kalāpas materiais!"
        : "Nipphanna-rūpa Concreto (com natureza intrínseca sabhāva, objeto de Vipassanā).",
      en: item.avin
        ? "Concrete Nipphanna-rūpa + Inseparable Octad (Avinibbhoga-rūpa [8]): present in ALL material kalāpas!"
        : "Concrete Nipphanna-rūpa (possessing intrinsic nature sabhāva, object of Vipassanā).",
      es: item.avin
        ? "Nipphanna-rūpa Concreto + Octeto Inseparable (Avinibbhoga-rūpa [8]): ¡presente en TODOS los kalāpas materiales!"
        : "Nipphanna-rūpa Concreto (con naturaleza intrínseca sabhāva, objeto de Vipassanā).",
    },
    isAvinibbhoga: item.avin,
  })),

  // 72: 1 NIBBĀNA (The Unconditioned — completes the 72 Sabhāva/Vatthu-dhammas)
  {
    atomicNumber: 72,
    subId: 1,
    paramattha: "nibbana",
    block: "nibbana",
    symbol: "Nb",
    pali: "Nibbāna (Asaṅkhata-dhātu)",
    name: { pt: "Nibbāna (O Incondicionado)", en: "Nibbāna (The Unconditioned)", es: "Nibbāna (Lo Incondicionado)" },
    lakkhana: {
      pt: "Paz suprema (santi-lakkhaṇa), imortalidade (accuti-rasa) e ausência de sinais condicionados (animitta-paccupaṭṭhāna)",
      en: "Supreme peace (santi-lakkhaṇa), deathlessness (accuti-rasa), signlessness (animitta-paccupaṭṭhāna)",
      es: "Paz suprema (santi-lakkhaṇa), inmortalidad (accuti-rasa), ausencia de signos condicionados (animitta-paccupaṭṭhāna)",
    },
    valenceRule: {
      pt: "A 72ª realidade com natureza própria (sabhāva/vatthu-dhamma): única realidade incondicionada (asaṅkhata), objeto direto das 8 (40) Lokuttara Cittas.",
      en: "The 72nd reality with intrinsic nature (sabhāva/vatthu-dhamma): the sole unconditioned reality (asaṅkhata), direct object of the 8 (40) Lokuttara Cittas.",
      es: "La 72.ª realidad con naturaleza propia (sabhāva/vatthu-dhamma): única realidad incondicionada (asaṅkhata), objeto directo de las 8 (40) Lokuttara Cittas.",
    },
  },

  // 73..82: 10 ANIPPHANNA-RŪPAS (Non-Concrete Matter = 1 + 2 + 3 + 4 → completes the 82 Paramattha Subdivisions)
  ...[
    {
      sub: 19,
      sym: "Āk",
      block: "rupa_pariccheda" as const,
      pali: "Ākāsa-dhātu (Pariccheda-rūpa)",
      pt: "Elemento Espaço (Matéria Delimitante)",
      en: "Space Element (Delimiting Matter)",
      es: "Elemento Espacio (Materia Delimitante)",
      lakPt: "Delimitar a matéria (rūpa-paricchedana), demarcando as fronteiras entre os kalāpas para que não se fundam",
      lakEn: "Delimiting matter (rūpa-paricchedana), demarcating boundaries between kalāpas so they do not fuse",
      lakEs: "Delimitar la materia (rūpa-paricchedana), demarcando los límites entre los kalāpas para que no se fusionen",
      valPt: "Anipphanna-rūpa (1/10 · Pariccheda-rūpa 1/1): interstício entre os kalāpas das 4 origens (AS VI.4).",
      valEn: "Anipphanna-rūpa (1/10 · Pariccheda-rūpa 1/1): interstice between kalāpas born of all 4 origins (AS VI.4).",
      valEs: "Anipphanna-rūpa (1/10 · Pariccheda-rūpa 1/1): intersticio entre los kalāpas nacidos de los 4 orígenes (AS VI.4).",
    },
    {
      sub: 20,
      sym: "Kv",
      block: "rupa_vinnatti" as const,
      pali: "Kāya-viññatti",
      pt: "Intimação Corporal",
      en: "Bodily Intimation",
      es: "Intimación Corporal",
      lakPt: "Modo especial do elemento vento originado pela mente (cittaja-vāyo) que move o corpo e comunica intenção",
      lakEn: "Special mode of mind-born wind element (cittaja-vāyo) moving the body and communicating intention",
      lakEs: "Modo especial del elemento viento nacido de la mente (cittaja-vāyo) que mueve el cuerpo y comunica intención",
      valPt: "Anipphanna-rūpa (2/10 · Viññatti-rūpa 1/2): surge exclusivamente por Citta (cittaja) e dura apenas 1 cittakkhaṇa (AS VI.4).",
      valEn: "Anipphanna-rūpa (2/10 · Viññatti-rūpa 1/2): strictly mind-born (cittaja) and lasts only 1 cittakkhaṇa (AS VI.4).",
      valEs: "Anipphanna-rūpa (2/10 · Viññatti-rūpa 1/2): surge exclusivamente por Citta (cittaja) y dura solo 1 cittakkhaṇa (AS VI.4).",
    },
    {
      sub: 21,
      sym: "Vv",
      block: "rupa_vinnatti" as const,
      pali: "Vacī-viññatti",
      pt: "Intimação Vocal",
      en: "Vocal Intimation",
      es: "Intimación Vocal",
      lakPt: "Modo especial do elemento terra originado pela mente (cittaja-paṭhavī) no aparelho vocal que produz fala articulada",
      lakEn: "Special mode of mind-born earth element (cittaja-paṭhavī) striking vocal organs to produce articulated speech",
      lakEs: "Modo especial del elemento tierra nacido de la mente (cittaja-paṭhavī) en el aparato vocal que produce el habla",
      valPt: "Anipphanna-rūpa (3/10 · Viññatti-rūpa 2/2): surge exclusivamente por Citta (cittaja) junto ao som da fala e dura 1 cittakkhaṇa (AS VI.4).",
      valEn: "Anipphanna-rūpa (3/10 · Viññatti-rūpa 2/2): strictly mind-born (cittaja) alongside speech-sound and lasts 1 cittakkhaṇa (AS VI.4).",
      valEs: "Anipphanna-rūpa (3/10 · Viññatti-rūpa 2/2): surge exclusivamente por Citta (cittaja) con el sonido del habla y dura 1 cittakkhaṇa (AS VI.4).",
    },
    {
      sub: 22,
      sym: "Lh",
      block: "rupa_vikara" as const,
      pali: "Lahutā (Rūpassa lahutā)",
      pt: "Leveza da Matéria",
      en: "Lightness of Matter",
      es: "Ligereza de la Materia",
      lakPt: "Não-lentidão e agilidade física da matéria viva (adandhatā), removendo o peso corporal",
      lakEn: "Non-sluggishness and buoyancy of living matter (adandhatā), dispelling physical heaviness",
      lakEs: "No-lentitud y agilidad física de la materia viva (adandhatā), disipando la pesadez corporal",
      valPt: "Anipphanna-rūpa (4/10 · Vikāra-rūpa 1/3): mutabilidade originada por Citta, Utu e Āhāra (nunca por Kamma) (AS VI.4).",
      valEn: "Anipphanna-rūpa (4/10 · Vikāra-rūpa 1/3): mutability born of Citta, Utu, and Āhāra (never Kamma-born) (AS VI.4).",
      valEs: "Anipphanna-rūpa (4/10 · Vikāra-rūpa 1/3): mutabilidad originada por Citta, Utu y Āhāra (nunca por Kamma) (AS VI.4).",
    },
    {
      sub: 23,
      sym: "Mr",
      block: "rupa_vikara" as const,
      pali: "Mudutā (Rūpassa mudutā)",
      pt: "Maleabilidade da Matéria",
      en: "Malleability of Matter",
      es: "Maleabilidad de la Materia",
      lakPt: "Não-rigidez e flexibilidade física da matéria viva (athaddhatā), como couro bem curtido",
      lakEn: "Non-stiffness and pliancy of living matter (athaddhatā), like well-tanned leather",
      lakEs: "No-rigidez y flexibilidad física de la materia viva (athaddhatā), como cuero bien curtido",
      valPt: "Anipphanna-rūpa (5/10 · Vikāra-rūpa 2/3): surge sempre em tríade inseparável com Lahutā e Kammaññatā por Citta, Utu e Āhāra (AS VI.4).",
      valEn: "Anipphanna-rūpa (5/10 · Vikāra-rūpa 2/3): always arises as an inseparable triad with Lahutā and Kammaññatā via Citta, Utu, and Āhāra (AS VI.4).",
      valEs: "Anipphanna-rūpa (5/10 · Vikāra-rūpa 2/3): surge siempre en tríada inseparable con Lahutā y Kammaññatā por Citta, Utu y Āhāra (AS VI.4).",
    },
    {
      sub: 24,
      sym: "Kr",
      block: "rupa_vikara" as const,
      pali: "Kammaññatā (Rūpassa kammaññatā)",
      pt: "Adaptabilidade da Matéria",
      en: "Wieldiness of Matter",
      es: "Manejabilidad de la Materia",
      lakPt: "Prontidão e manejabilidade física (kammaññabhāva) favorável às ações corporais, como ouro refinado",
      lakEn: "Physical workability and serviceability (kammaññabhāva) favorable to bodily action, like refined gold",
      lakEs: "Disposición y manejabilidad física (kammaññabhāva) favorable a las acciones corporales, como oro refinado",
      valPt: "Anipphanna-rūpa (6/10 · Vikāra-rūpa 3/3): fecha os 5 Vikāra-rūpas em sentido amplo (2 Viññatti + 3 Vikāra = 5) (AS VI.4).",
      valEn: "Anipphanna-rūpa (6/10 · Vikāra-rūpa 3/3): completes the 5 Vikāra-rūpas in the broad sense (2 Viññatti + 3 Vikāra = 5) (AS VI.4).",
      valEs: "Anipphanna-rūpa (6/10 · Vikāra-rūpa 3/3): completa los 5 Vikāra-rūpas en sentido amplio (2 Viññatti + 3 Vikāra = 5) (AS VI.4).",
    },
    {
      sub: 25,
      sym: "Up",
      block: "rupa_lakkhana" as const,
      pali: "Upacaya (Rūpassa upacaya)",
      pt: "Produção / Crescimento da Matéria",
      en: "Production / Integration of Matter",
      es: "Producción / Crecimiento de la Materia",
      lakPt: "Surgimento inicial da matéria na concepção e acumulação (ācaya) até a completude das faculdades",
      lakEn: "Initial arising of matter at conception and accumulation (ācaya) until faculties are complete",
      lakEs: "Surgimiento inicial de la materia en la concepción y acumulación (ācaya) hasta completar las facultades",
      valPt: "Anipphanna-rūpa (7/10 · Lakkhaṇa-rūpa 1/4): corresponde ao submomento de surgimento (uppāda) dos 18 Nipphanna-rūpas (AS VI.4).",
      valEn: "Anipphanna-rūpa (7/10 · Lakkhaṇa-rūpa 1/4): corresponds to the arising sub-moment (uppāda) of the 18 Nipphanna-rūpas (AS VI.4).",
      valEs: "Anipphanna-rūpa (7/10 · Lakkhaṇa-rūpa 1/4): corresponde al submomento de surgimiento (uppāda) de los 18 Nipphanna-rūpas (AS VI.4).",
    },
    {
      sub: 26,
      sym: "Sn",
      block: "rupa_lakkhana" as const,
      pali: "Santati (Rūpassa santati)",
      pt: "Continuidade da Matéria",
      en: "Continuity of Matter",
      es: "Continuidad de la Materia",
      lakPt: "Surgimento contínuo e sucessivo (pavatti) de novos kalāpas após a formação completa das faculdades",
      lakEn: "Continuous successive arising (pavatti) of new kalāpas after faculties are fully developed",
      lakEs: "Surgimiento continuo y sucesivo (pavatti) de nuevos kalāpas tras el desarrollo completo de las facultades",
      valPt: "Anipphanna-rūpa (8/10 · Lakkhaṇa-rūpa 2/4): tanto Upacaya quanto Santati designam o submomento genético (uppāda) da matéria concreta (AS VI.4).",
      valEn: "Anipphanna-rūpa (8/10 · Lakkhaṇa-rūpa 2/4): both Upacaya and Santati denote the genetic sub-moment (uppāda) of concrete matter (AS VI.4).",
      valEs: "Anipphanna-rūpa (8/10 · Lakkhaṇa-rūpa 2/4): tanto Upacaya como Santati designan el submomento genético (uppāda) de la materia concreta (AS VI.4).",
    },
    {
      sub: 27,
      sym: "Ja",
      block: "rupa_lakkhana" as const,
      pali: "Jaratā (Rūpassa jaratā)",
      pt: "Envelhecimento / Decadência da Matéria",
      en: "Decay / Aging of Matter",
      es: "Envejecimiento / Decadencia de la Materia",
      lakPt: "Amadurecimento e desgaste (paripāka) da matéria concreta sem perda de sua natureza intrínseca",
      lakEn: "Maturing and aging (paripāka) of concrete matter without loss of its intrinsic nature",
      lakEs: "Maduración y desgaste (paripāka) de la materia concreta sin pérdida de su naturaleza intrínseca",
      valPt: "Anipphanna-rūpa (9/10 · Lakkhaṇa-rūpa 3/4): corresponde à fase de presença/duração (ṭhiti = 49 submomentos) dos 18 Nipphanna-rūpas (AS VI.4).",
      valEn: "Anipphanna-rūpa (9/10 · Lakkhaṇa-rūpa 3/4): corresponds to the presence/standing phase (ṭhiti = 49 sub-moments) of the 18 Nipphanna-rūpas (AS VI.4).",
      valEs: "Anipphanna-rūpa (9/10 · Lakkhaṇa-rūpa 3/4): corresponde a la fase de presencia/duración (ṭhiti = 49 submomentos) de los 18 Nipphanna-rūpas (AS VI.4).",
    },
    {
      sub: 28,
      sym: "Ac",
      block: "rupa_lakkhana" as const,
      pali: "Aniccatā (Rūpassa aniccatā)",
      pt: "Impermanência da Matéria",
      en: "Impermanence of Matter",
      es: "Impermanencia de la Materia",
      lakPt: "Dissolução e quebra completa (paribheda) dos rūpas concretos",
      lakEn: "Complete breakup and dissolution (paribheda) of concrete material dhammas",
      lakEs: "Disolución y ruptura completa (paribheda) de los rūpas concretos",
      valPt: "Anipphanna-rūpa (10/10 · Lakkhaṇa-rūpa 4/4): corresponde ao submomento de dissolução (bhaṅga) dos 18 Nipphanna-rūpas (AS VI.4).",
      valEn: "Anipphanna-rūpa (10/10 · Lakkhaṇa-rūpa 4/4): corresponds to the dissolution sub-moment (bhaṅga) of the 18 Nipphanna-rūpas (AS VI.4).",
      valEs: "Anipphanna-rūpa (10/10 · Lakkhaṇa-rūpa 4/4): corresponde al submomento de disolución (bhaṅga) de los 18 Nipphanna-rūpas (AS VI.4).",
    },
  ].map((item): SabhavaElement => ({
    atomicNumber: 54 + item.sub, // 73..82
    subId: item.sub, // 19..28
    paramattha: "rupa",
    block: item.block,
    symbol: item.sym,
    pali: item.pali,
    name: { pt: item.pt, en: item.en, es: item.es },
    lakkhana: { pt: item.lakPt, en: item.lakEn, es: item.lakEs },
    valenceRule: { pt: item.valPt, en: item.valEn, es: item.valEs },
    isAnipphanna: true,
  })),
];

export const PERIODIC_ELEMENTS_82 = PERIODIC_ELEMENTS_72;

// ── THE 8 CANONICAL LAWS OF ONTOLOGICAL COLLISION (AS II.10–17) ─────────────

export const ONTOLOGICAL_COLLISION_RULES: Readonly<Record<string, OntologicalCollisionRule>> = {
  akusala_sobhana: {
    id: "akusala_sobhana",
    asRef: "AS II.12 / II.18",
    title: {
      pt: "Colisão Ética: Insalubres (Akusala) × Belos (Sobhana)",
      en: "Ethical Collision: Unwholesome (Akusala) × Beautiful (Sobhana)",
      es: "Colisión Ética: Insaludables (Akusala) × Bellos (Sobhana)",
    },
    explanation: {
      pt: "Fatores insalubres (14 Akusalas) e fatores belos (25 Sobhanas) são diametralmente opostos (como luz e trevas) e jamais coexistem no mesmo instante mental (cittakkhaṇa).",
      en: "Unwholesome factors (14 Akusalas) and beautiful factors (25 Sobhanas) are diametrically opposed and never coexist in the same mental moment (cittakkhaṇa).",
      es: "Los factores insaludables (14 Akusalas) y los factores bellos (25 Sobhanas) son diametralmente opuestos y jamás coexisten en el mismo momento mental (cittakkhaṇa).",
    },
  },
  ditthi_mana: {
    id: "ditthi_mana",
    asRef: "AS II.13",
    title: {
      pt: "Colisão na Tríade de Lobha: Diṭṭhi (Visão Errônea) × Māna (Presunção)",
      en: "Lobha Triad Collision: Diṭṭhi (Wrong View) × Māna (Conceit)",
      es: "Colisión en la Tríada de Lobha: Diṭṭhi (Visión Errónea) × Māna (Presunción)",
    },
    explanation: {
      pt: "Diṭṭhi (#19) só surge nas 4 Lobhamūlas 'diṭṭhigata-sampayutta', enquanto Māna (#20) só surge ocasionalmente nas 4 'diṭṭhigata-vippayutta'. Segundo os Comentários, são como dois leões que não cabem na mesma caverna no mesmo instante.",
      en: "Diṭṭhi (#19) arises only in the 4 'diṭṭhigata-sampayutta' Lobhamūlas, while Māna (#20) arises occasionally only in the 4 'diṭṭhigata-vippayutta'. Commentaries compare them to two lions that cannot share one cave in the same instant.",
      es: "Diṭṭhi (#19) solo surge en las 4 Lobhamūlas 'diṭṭhigata-sampayutta', mientras que Māna (#20) solo surge ocasionalmente en las 4 'diṭṭhigata-vippayutta'. Son como dos leones que no caben en la misma cueva en el mismo instante.",
    },
  },
  lobha_dosa: {
    id: "lobha_dosa",
    asRef: "AS II.13",
    title: {
      pt: "Colisão de Raízes Opostas: Lobha (Atração) × Dosa (Repulsa)",
      en: "Opposite Roots Collision: Lobha (Attraction) × Dosa (Repulsion)",
      es: "Colisión de Raíces Opuestas: Lobha (Atracción) × Dosa (Repulsión)",
    },
    explanation: {
      pt: "O grupo da Avidez (Lobha, Diṭṭhi, Māna) adere ao objeto, enquanto o grupo da Aversão (Dosa, Issā, Macchariya, Kukkucca) ataca ou rejeita o objeto. Nunca surgem na mesma Citta.",
      en: "The Greed group (Lobha, Diṭṭhi, Māna) clings to the object, while the Aversion group (Dosa, Issā, Macchariya, Kukkucca) strikes or rejects the object. They never arise in the same Citta.",
      es: "El grupo de la Avidez (Lobha, Diṭṭhi, Māna) se adhiere al objeto, mientras que el grupo de la Aversión (Dosa, Issā, Macchariya, Kukkucca) rechaza el objeto. Nunca surgen en la misma Citta.",
    },
  },
  dosa_secondaries: {
    id: "dosa_secondaries",
    asRef: "AS II.13 (ekekavavasena)",
    title: {
      pt: "Colisão em Dosa: Issā × Macchariya × Kukkucca",
      en: "Dosa Collision: Issā × Macchariya × Kukkucca",
      es: "Colisión en Dosa: Issā × Macchariya × Kukkucca",
    },
    explanation: {
      pt: "Inveja (Issā: foca nas qualidades alheias), Avareza (Macchariya: foca nos próprios bens) e Preocupação Moral (Kukkucca: foca em ações passadas) têm objetos distintos e só entram em Dosa separadamente (um por vez, 'ekekavavasena').",
      en: "Envy (Issā: focuses on others' goods), Avarice (Macchariya: focuses on one's own goods), and Worry (Kukkucca: focuses on past deeds) have distinct objects and enter Dosa only one at a time ('ekekavavasena').",
      es: "Envidia (Issā: enfoca bienes ajenos), Avaricia (Macchariya: enfoca bienes propios) y Preocupación Moral (Kukkucca: enfoca actos pasados) tienen objetos distintos y solo entran en Dosa uno a la vez ('ekekavavasena').",
    },
  },
  piti_feeling: {
    id: "piti_feeling",
    asRef: "AS II.11",
    title: {
      pt: "Colisão de Sensação: Pīti (Entusiasmo) sem Somanassa (ou no 4º/5º Jhāna)",
      en: "Feeling Collision: Pīti (Zest) without Somanassa (or in 4th/5th Jhāna)",
      es: "Colisión de Sensación: Pīti (Entusiasmo) sin Somanassa (o en 4.º/5.º Jhāna)",
    },
    explanation: {
      pt: "Pīti (#12) jamais coexiste com Upekkhā (equanimidade), Domanassa (desprazer em Dosa), Dukkha ou Sukha físico; além disso, é abandonado a partir do 4º Jhāna.",
      en: "Pīti (#12) never coexists with Upekkhā (equanimity), Domanassa (displeasure in Dosa), bodily Dukkha/Sukha, and is abandoned from the 4th Jhāna onward.",
      es: "Pīti (#12) jamás coexiste con Upekkhā (ecuanimidad), Domanassa (displacer en Dosa), Dukkha/Sukha físico, y se abandona a partir del 4.º Jhāna.",
    },
  },
  thina_asankharika: {
    id: "thina_asankharika",
    asRef: "AS II.13",
    title: {
      pt: "Colisão de Instigação: Thīna-Middha em Citta Não-Instigada (Asaṅkhārika)",
      en: "Prompting Collision: Thīna-Middha in Unprompted (Asaṅkhārika) Citta",
      es: "Colisión de Instigación: Thīna-Middha en Citta No Instigada (Asaṅkhārika)",
    },
    explanation: {
      pt: "O par Thīna-Middha (#25–#26, torpor e sonolência) sempre surge e cessa junto, e só pode entrar nas 5 consciências insalubres instigadas (Sasaṅkhārika: #2, #4, #6, #8, #10), nunca nas espontâneas (Asaṅkhārika).",
      en: "The pair Thīna-Middha (#25–#26, sloth and torpor) always arises together and can only enter the 5 prompted unwholesome consciousnesses (Sasaṅkhārika: #2, #4, #6, #8, #10), never unprompted ones.",
      es: "El par Thīna-Middha (#25–#26, torpor y somnolencia) siempre surge junto y solo puede entrar en las 5 conciencias insaludables instigadas (Sasaṅkhārika: #2, #4, #6, #8, #10), nunca en las espontáneas.",
    },
  },
  adhimokkha_vicikiccha: {
    id: "adhimokkha_vicikiccha",
    asRef: "AS II.11 / II.13",
    title: {
      pt: "Colisão Cognitiva: Adhimokkha (Decisão) × Vicikicchā (Dúvida)",
      en: "Cognitive Collision: Adhimokkha (Decision) × Vicikicchā (Doubt)",
      es: "Colisión Cognitiva: Adhimokkha (Decisión) × Vicikicchā (Duda)",
    },
    explanation: {
      pt: "Adhimokkha (#10) tem a característica de decisão firme sobre o objeto, sendo mutuamente exclusivo com Vicikicchā (#27, vacilação/dúvida cética na 1ª Mohamūla #11).",
      en: "Adhimokkha (#10) has the characteristic of decisive resolution, making it mutually exclusive with Vicikicchā (#27, skeptical wavering/doubt in the 1st Mohamūla #11).",
      es: "Adhimokkha (#10) tiene la característica de resolución firme, siendo mutuamente exclusivo con Vicikicchā (#27, vacilación/duda en la 1.ª Mohamūla #11).",
    },
  },
  karuna_mudita: {
    id: "karuna_mudita",
    asRef: "AS II.15",
    title: {
      pt: "Colisão dos Ilimitados: Karuṇā (Compaixão) × Muditā (Alegria Altruísta)",
      en: "Illimitables Collision: Karuṇā (Compassion) × Muditā (Appreciative Joy)",
      es: "Colisión de los Ilimitados: Karuṇā (Compasión) × Muditā (Alegría Altruista)",
    },
    explanation: {
      pt: "Karuṇā (#50) toma seres em sofrimento como objeto, enquanto Muditā (#51) toma seres prósperos/felizes. Por terem objetos opostos, nunca surgem no mesmo instante (e nunca entram em Lokuttara, cujo objeto é Nibbāna).",
      en: "Karuṇā (#50) takes suffering beings as object, while Muditā (#51) takes prosperous/happy beings. Having opposite objects, they never arise together (and never enter Lokuttara, whose object is Nibbāna).",
      es: "Karuṇā (#50) toma a seres que sufren como objeto, mientras que Muditā (#51) toma a seres prósperos. Al tener objetos opuestos, nunca surgen juntos (y nunca entran en Lokuttara, cuyo objeto es Nibbāna).",
    },
  },
  thina_pair_split: {
    id: "thina_pair_split",
    asRef: "AS II.13",
    title: {
      pt: "Par Inseparável: Thīna (#25) e Middha (#26) não podem ser separados",
      en: "Inseparable Pair: Thīna (#25) and Middha (#26) cannot be split",
      es: "Par Inseparable: Thīna (#25) y Middha (#26) no pueden separarse",
    },
    explanation: {
      pt: "Thīna (torpor de Citta) e Middha (sonolência dos Cetasikas) formam a díade inseparável (Thīna-duka): sempre surgem e cessam juntos nas 5 Akusala Sasaṅkhārika Cittas.",
      en: "Thīna (sloth of Citta) and Middha (torpor of Cetasikas) form an inseparable dyad (Thīna-duka): they always arise and cease together in the 5 Akusala Sasaṅkhārika Cittas.",
      es: "Thīna (torpor de Citta) y Middha (somnolencia de los Cetasikas) forman la díada inseparable (Thīna-duka): siempre surgen y cesan juntos en las 5 Akusala Sasaṅkhārika Cittas.",
    },
  },
};

// ── 3. THE 5 PHALANX ABACUS FINGER MAPS ──────────────────────────────────────

export const PHALANX_MAPS: readonly PhalanxMapSpec[] = [
  // MAP 1: 12 Akusala Cittas (1 Hand = 12 Phalanges)
  {
    id: "akusala12",
    asRef: "AS I.4–6",
    title: {
      pt: "1. As 12 Akusala Cittas (1 Mão — 12 Falanges)",
      en: "1. The 12 Akusala Cittas (1 Hand — 12 Phalanges)",
      es: "1. Las 12 Akusala Cittas (1 Mano — 12 Falanges)",
    },
    subtitle: {
      pt: "8 Lobhamūla (4 Somanassa + 4 Upekkhā) + 2 Dosamūla + 2 Mohamūla",
      en: "8 Lobhamūla (4 Somanassa + 4 Upekkhā) + 2 Dosamūla + 2 Mohamūla",
      es: "8 Lobhamūla (4 Somanassa + 4 Upekkhā) + 2 Dosamūla + 2 Mohamūla",
    },
    handsUsed: 1,
    usesPalmCrease: false,
    formulaSummary: {
      pt: "Ind-1..3 + Méd-1 = 4 Lobha c/ Prazer [1·d·s] | Méd-2..3 + Ane-1..2 = 4 Lobha c/ Equanimidade [0·d·s] | Ane-3 + Min-1 = 2 Dosa | Min-2..3 = 2 Moha.",
      en: "Idx-1..3 + Mid-1 = 4 Joyful Lobha [1·d·s] | Mid-2..3 + Rng-1..2 = 4 Equanimous Lobha [0·d·s] | Rng-3 + Lit-1 = 2 Dosa | Lit-2..3 = 2 Moha.",
      es: "Índ-1..3 + Med-1 = 4 Lobha c/ Placer [1·d·s] | Med-2..3 + Anu-1..2 = 4 Lobha c/ Ecuanimidad [0·d·s] | Anu-3 + Meñ-1 = 2 Dosa | Meñ-2..3 = 2 Moha.",
    },
    slots: [
      { index: 1, hand: "left", finger: "index", joint: "base", code: "L1 [1·1·1]", pali: "Somanassa · Diṭṭhi-sampayutta · Asaṅkhārika", label: { pt: "Lobha #1: Prazer + Visão Errônea + Não-instigada", en: "Lobha #1: Joy + Wrong View + Unprompted", es: "Lobha #1: Placer + Visión Errónea + No instigada" }, mnemonicAnchor: { pt: "Indicador Base (1): Tudo ligado [1·1·1] (19 cetasikas)", en: "Index Base (1): All bits ON [1·1·1] (19 cetasikas)", es: "Índice Base (1): Todo activado [1·1·1] (19 cetasikas)" } },
      { index: 2, hand: "left", finger: "index", joint: "middle", code: "L2 [1·1·0]", pali: "Somanassa · Diṭṭhi-sampayutta · Sasaṅkhārika", label: { pt: "Lobha #2: Prazer + Visão Errônea + Instigada", en: "Lobha #2: Joy + Wrong View + Prompted", es: "Lobha #2: Placer + Visión Errónea + Instigada" }, mnemonicAnchor: { pt: "Indicador Meio (2): Bit 3 vira 0 [1·1·0] (+Thīna-Middha = 21)", en: "Index Middle (2): Bit 3 flips to 0 [1·1·0] (+Thīna-Middha = 21)", es: "Índice Medio (2): Bit 3 pasa a 0 [1·1·0] (+Thīna-Middha = 21)" } },
      { index: 3, hand: "left", finger: "index", joint: "tip", code: "L3 [1·0·1]", pali: "Somanassa · Diṭṭhi-vippayutta · Asaṅkhārika", label: { pt: "Lobha #3: Prazer + Sem Visão Errônea + Não-instigada", en: "Lobha #3: Joy + Without Wrong View + Unprompted", es: "Lobha #3: Placer + Sin Visión Errónea + No instigada" }, mnemonicAnchor: { pt: "Indicador Ponta (3): Bit 2 vira 0 [1·0·1] (+Māna ocasional = 19)", en: "Index Tip (3): Bit 2 flips to 0 [1·0·1] (+occasional Māna = 19)", es: "Índice Punta (3): Bit 2 pasa a 0 [1·0·1] (+Māna ocasional = 19)" } },
      { index: 4, hand: "left", finger: "middle", joint: "base", code: "L4 [1·0·0]", pali: "Somanassa · Diṭṭhi-vippayutta · Sasaṅkhārika", label: { pt: "Lobha #4: Prazer + Sem Visão Errônea + Instigada", en: "Lobha #4: Joy + Without Wrong View + Prompted", es: "Lobha #4: Placer + Sin Visión Errónea + Instigada" }, mnemonicAnchor: { pt: "Médio Base (4): Fecha as 4 Lobhas c/ Prazer [1·0·0] (21 cetasikas)", en: "Middle Base (4): Closes the 4 Joyful Lobhas [1·0·0] (21 cetasikas)", es: "Medio Base (4): Cierra las 4 Lobhas con Placer [1·0·0] (21 cetasikas)" } },
      { index: 5, hand: "left", finger: "middle", joint: "middle", code: "L5 [0·1·1]", pali: "Upekkhā · Diṭṭhi-sampayutta · Asaṅkhārika", label: { pt: "Lobha #5: Equanimidade + Visão Errônea + Não-instigada", en: "Lobha #5: Equanimity + Wrong View + Unprompted", es: "Lobha #5: Ecuanimidad + Visión Errónea + No instigada" }, mnemonicAnchor: { pt: "Médio Meio (5): Abre as 4 Lobhas c/ Upekkhā [0·1·1] (sem Pīti = 18)", en: "Middle Mid (5): Opens the 4 Equanimous Lobhas [0·1·1] (no Pīti = 18)", es: "Medio Medio (5): Abre las 4 Lobhas con Upekkhā [0·1·1] (sin Pīti = 18)" } },
      { index: 6, hand: "left", finger: "middle", joint: "tip", code: "L6 [0·1·0]", pali: "Upekkhā · Diṭṭhi-sampayutta · Sasaṅkhārika", label: { pt: "Lobha #6: Equanimidade + Visão Errônea + Instigada", en: "Lobha #6: Equanimity + Wrong View + Prompted", es: "Lobha #6: Ecuanimidad + Visión Errónea + Instigada" }, mnemonicAnchor: { pt: "Médio Ponta (6): [0·1·0] (+Thīna-Middha = 20 cetasikas)", en: "Middle Tip (6): [0·1·0] (+Thīna-Middha = 20 cetasikas)", es: "Medio Punta (6): [0·1·0] (+Thīna-Middha = 20 cetasikas)" } },
      { index: 7, hand: "left", finger: "ring", joint: "base", code: "L7 [0·0·1]", pali: "Upekkhā · Diṭṭhi-vippayutta · Asaṅkhārika", label: { pt: "Lobha #7: Equanimidade + Sem Visão Errônea + Não-instigada", en: "Lobha #7: Equanimity + Without Wrong View + Unprompted", es: "Lobha #7: Ecuanimidad + Sin Visión Errónea + No instigada" }, mnemonicAnchor: { pt: "Anelar Base (7): [0·0·1] (+Māna ocasional = 18 cetasikas)", en: "Ring Base (7): [0·0·1] (+occasional Māna = 18 cetasikas)", es: "Anular Base (7): [0·0·1] (+Māna ocasional = 18 cetasikas)" } },
      { index: 8, hand: "left", finger: "ring", joint: "middle", code: "L8 [0·0·0]", pali: "Upekkhā · Diṭṭhi-vippayutta · Sasaṅkhārika", label: { pt: "Lobha #8: Equanimidade + Sem Visão Errônea + Instigada", en: "Lobha #8: Equanimity + Without Wrong View + Prompted", es: "Lobha #8: Ecuanimidad + Sin Visión Errónea + Instigada" }, mnemonicAnchor: { pt: "Anelar Meio (8): Tudo zero [0·0·0] — fecha as 8 Lobhas (20 cetasikas)", en: "Ring Mid (8): All zeros [0·0·0] — closes the 8 Lobhas (20 cetasikas)", es: "Anular Medio (8): Todo cero [0·0·0] — cierra las 8 Lobhas (20 cetasikas)" } },
      { index: 9, hand: "left", finger: "ring", joint: "tip", code: "D1 [Dom·1]", pali: "Domanassa · Paṭigha-sampayutta · Asaṅkhārika", label: { pt: "Dosa #1 (#9): Desprazer + Repulsa + Não-instigada", en: "Dosa #1 (#9): Displeasure + Aversion + Unprompted", es: "Dosa #1 (#9): Displacer + Aversión + No instigada" }, mnemonicAnchor: { pt: "Anelar Ponta (9): 1ª Dosamūla espontânea (20 cetasikas no total)", en: "Ring Tip (9): 1st unprompted Dosamūla (20 total cetasikas)", es: "Anular Punta (9): 1.ª Dosamūla espontánea (20 cetasikas en total)" } },
      { index: 10, hand: "left", finger: "little", joint: "base", code: "D2 [Dom·0]", pali: "Domanassa · Paṭigha-sampayutta · Sasaṅkhārika", label: { pt: "Dosa #2 (#10): Desprazer + Repulsa + Instigada", en: "Dosa #2 (#10): Displeasure + Aversion + Prompted", es: "Dosa #2 (#10): Displacer + Aversión + Instigada" }, mnemonicAnchor: { pt: "Mindinho Base (10): 2ª Dosamūla instigada (+Thīna-Middha = 22 cetasikas)", en: "Little Base (10): 2nd prompted Dosamūla (+Thīna-Middha = 22 cetasikas)", es: "Meñique Base (10): 2.ª Dosamūla instigada (+Thīna-Middha = 22 cetasikas)" } },
      { index: 11, hand: "left", finger: "little", joint: "middle", code: "M1 [Vic]", pali: "Upekkhā · Vicikicchā-sampayutta", label: { pt: "Moha #1 (#11): Equanimidade + Dúvida (Vicikicchā)", en: "Moha #1 (#11): Equanimity + Doubt (Vicikicchā)", es: "Moha #1 (#11): Ecuanimidad + Duda (Vicikicchā)" }, mnemonicAnchor: { pt: "Mindinho Meio (11): Dúvida cética (sem Adhimokkha = 15 cetasikas)", en: "Little Mid (11): Skeptical doubt (no Adhimokkha = 15 cetasikas)", es: "Meñique Medio (11): Duda escéptica (sin Adhimokkha = 15 cetasikas)" } },
      { index: 12, hand: "left", finger: "little", joint: "tip", code: "M2 [Udd]", pali: "Upekkhā · Uddhacca-sampayutta", label: { pt: "Moha #2 (#12): Equanimidade + Agitação (Uddhacca)", en: "Moha #2 (#12): Equanimity + Restlessness (Uddhacca)", es: "Moha #2 (#12): Ecuanimidad + Agitación (Uddhacca)" }, mnemonicAnchor: { pt: "Mindinho Ponta (12): Agitação pura (c/ Adhimokkha = 15 cetasikas)", en: "Little Tip (12): Pure restlessness (w/ Adhimokkha = 15 cetasikas)", es: "Meñique Punta (12): Agitación pura (con Adhimokkha = 15 cetasikas)" } },
    ],
  },

  // MAP 2: 14 Akusala Cetasikas by Finger (1 Hand = 4 + 3 + 4 + 3)
  {
    id: "cetasika14",
    asRef: "AS II.3 / II.13",
    title: {
      pt: "2. Os 14 Akusala Cetasikas por Dedo (1 Mão — 4 + 3 + 4 + 3)",
      en: "2. The 14 Akusala Cetasikas by Finger (1 Hand — 4 + 3 + 4 + 3)",
      es: "2. Los 14 Akusala Cetasikas por Dedo (1 Mano — 4 + 3 + 4 + 3)",
    },
    subtitle: {
      pt: "Cada dedo guarda 1 clã exato de fatores mentais insalubres",
      en: "Each finger holds 1 exact clan of unwholesome mental factors",
      es: "Cada dedo guarda 1 clan exacto de factores mentales insaludables",
    },
    handsUsed: 1,
    usesPalmCrease: true,
    formulaSummary: {
      pt: "Indicador (4) = Moha-catukka (Universais Impuros) | Médio (3) = Lobha-trika | Anelar (4) = Dosa-catukka | Mindinho (3) = Thīna-Middha (2) + Vicikicchā (1).",
      en: "Index (4) = Moha-catukka (Universal Unwholesome) | Middle (3) = Lobha-trika | Ring (4) = Dosa-catukka | Little (3) = Thīna-Middha (2) + Vicikicchā (1).",
      es: "Índice (4) = Moha-catukka (Universales Impuros) | Medio (3) = Lobha-trika | Anular (4) = Dosa-catukka | Meñique (3) = Thīna-Middha (2) + Vicikicchā (1).",
    },
    slots: [
      { index: 1, hand: "left", finger: "index", joint: "crease", code: "#14 Mo", pali: "Moha", label: { pt: "1. Moha (Ilusão — cegueira mental)", en: "1. Moha (Delusion — mental blindness)", es: "1. Moha (Ilusión — ceguera mental)" }, mnemonicAnchor: { pt: "Dobra do Indicador: Raiz de toda insalubridade (12 cittas)", en: "Index Crease: Root of all unwholesomeness (12 cittas)", es: "Pliegue del Índice: Raíz de toda insalubridad (12 cittas)" } },
      { index: 2, hand: "left", finger: "index", joint: "base", code: "#15 Ah", pali: "Ahirika", label: { pt: "2. Ahirika (Desvergonha moral)", en: "2. Ahirika (Shamelessness)", es: "2. Ahirika (Desvergüenza moral)" }, mnemonicAnchor: { pt: "Indicador Base: 2º Universal Impuro (12 cittas)", en: "Index Base: 2nd Universal Unwholesome (12 cittas)", es: "Índice Base: 2.º Universal Impuro (12 cittas)" } },
      { index: 3, hand: "left", finger: "index", joint: "middle", code: "#16 An", pali: "Anottappa", label: { pt: "3. Anottappa (Destemor moral)", en: "3. Anottappa (Fearlessness of wrongdoing)", es: "3. Anottappa (Falta de temor moral)" }, mnemonicAnchor: { pt: "Indicador Meio: 3º Universal Impuro (12 cittas)", en: "Index Mid: 3rd Universal Unwholesome (12 cittas)", es: "Índice Medio: 3.er Universal Impuro (12 cittas)" } },
      { index: 4, hand: "left", finger: "index", joint: "tip", code: "#17 Ud", pali: "Uddhacca", label: { pt: "4. Uddhacca (Agitação)", en: "4. Uddhacca (Restlessness)", es: "4. Uddhacca (Agitación)" }, mnemonicAnchor: { pt: "Indicador Ponta: 4º Universal Impuro (12 cittas)", en: "Index Tip: 4th Universal Unwholesome (12 cittas)", es: "Índice Punta: 4.º Universal Impuro (12 cittas)" } },
      { index: 5, hand: "left", finger: "middle", joint: "base", code: "#18 Lo", pali: "Lobha", label: { pt: "5. Lobha (Avidez)", en: "5. Lobha (Greed)", es: "5. Lobha (Avidez)" }, mnemonicAnchor: { pt: "Médio Base: Líder da Tríade de Lobha (8 cittas)", en: "Middle Base: Leader of the Lobha Triad (8 cittas)", es: "Medio Base: Líder de la Tríada de Lobha (8 cittas)" } },
      { index: 6, hand: "left", finger: "middle", joint: "middle", code: "#19 Di", pali: "Diṭṭhi", label: { pt: "6. Diṭṭhi (Visão errônea)", en: "6. Diṭṭhi (Wrong view)", es: "6. Diṭṭhi (Visión errónea)" }, mnemonicAnchor: { pt: "Médio Meio: Dogmatismo (4 cittas; exclui Māna)", en: "Middle Mid: Dogmatism (4 cittas; excludes Māna)", es: "Medio Medio: Dogmatismo (4 cittas; excluye Māna)" } },
      { index: 7, hand: "left", finger: "middle", joint: "tip", code: "#20 Mā", pali: "Māna", label: { pt: "7. Māna (Presunção / Orgulho)", en: "7. Māna (Conceit)", es: "7. Māna (Presunción / Orgullo)" }, mnemonicAnchor: { pt: "Médio Ponta: Autoexaltação no topo do dedo mais alto! (4 cittas)", en: "Middle Tip: Self-exaltation at the tip of the tallest finger! (4 cittas)", es: "Medio Punta: ¡Autoexaltación en la punta del dedo más alto! (4 cittas)" } },
      { index: 8, hand: "left", finger: "ring", joint: "crease", code: "#21 Do", pali: "Dosa", label: { pt: "8. Dosa (Aversão)", en: "8. Dosa (Aversion)", es: "8. Dosa (Aversión)" }, mnemonicAnchor: { pt: "Dobra do Anelar: Raiz da Quádrupla da Aversão (2 cittas)", en: "Ring Crease: Root of the Aversion Quartet (2 cittas)", es: "Pliegue del Anular: Raíz de la Cuádrupla de Aversión (2 cittas)" } },
      { index: 9, hand: "left", finger: "ring", joint: "base", code: "#22 Is", pali: "Issā", label: { pt: "9. Issā (Inveja)", en: "9. Issā (Envy)", es: "9. Issā (Envidia)" }, mnemonicAnchor: { pt: "Anelar Base: 1º secundário solitário de Dosa (2 cittas)", en: "Ring Base: 1st solitary secondary of Dosa (2 cittas)", es: "Anular Base: 1.er secundario solitario de Dosa (2 cittas)" } },
      { index: 10, hand: "left", finger: "ring", joint: "middle", code: "#23 Mc", pali: "Macchariya", label: { pt: "10. Macchariya (Avareza)", en: "10. Macchariya (Avarice)", es: "10. Macchariya (Avaricia)" }, mnemonicAnchor: { pt: "Anelar Meio (onde vai o anel!): Avareza que esconde seus bens (2 cittas)", en: "Ring Mid (where the ring sits!): Avarice hiding its goods (2 cittas)", es: "Anular Medio (¡donde va el anillo!): Avaricia que esconde sus bienes" } },
      { index: 11, hand: "left", finger: "ring", joint: "tip", code: "#24 Kk", pali: "Kukkucca", label: { pt: "11. Kukkucca (Preocupação moral / Remorso)", en: "11. Kukkucca (Remorse / Worry)", es: "11. Kukkucca (Preocupación moral / Remordimiento)" }, mnemonicAnchor: { pt: "Anelar Ponta: 3º secundário solitário de Dosa (2 cittas)", en: "Ring Tip: 3rd solitary secondary of Dosa (2 cittas)", es: "Anular Punta: 3.er secundario solitario de Dosa (2 cittas)" } },
      { index: 12, hand: "left", finger: "little", joint: "base", code: "#25 Th", pali: "Thīna", label: { pt: "12. Thīna (Torpor de Citta)", en: "12. Thīna (Sloth of Citta)", es: "12. Thīna (Torpor de Citta)" }, mnemonicAnchor: { pt: "Mindinho Base: Par inseparável do torpor (5 sasaṅkhārika cittas)", en: "Little Base: Inseparable sloth pair (5 sasaṅkhārika cittas)", es: "Meñique Base: Par inseparable del torpor (5 sasaṅkhārika cittas)" } },
      { index: 13, hand: "left", finger: "little", joint: "middle", code: "#26 Md", pali: "Middha", label: { pt: "13. Middha (Sonolência dos Cetasikas)", en: "13. Middha (Torpor of Cetasikas)", es: "13. Middha (Somnolencia de los Cetasikas)" }, mnemonicAnchor: { pt: "Mindinho Meio: Sonolência conascida c/ Thīna (5 sasaṅkhārika cittas)", en: "Little Mid: Torpor co-nascent w/ Thīna (5 sasaṅkhārika cittas)", es: "Meñique Medio: Somnolencia conacida con Thīna (5 sasaṅkhārika cittas)" } },
      { index: 14, hand: "left", finger: "little", joint: "tip", code: "#27 Vk", pali: "Vicikicchā", label: { pt: "14. Vicikicchā (Dúvida cética)", en: "14. Vicikicchā (Skeptical doubt)", es: "14. Vicikicchā (Duda escéptica)" }, mnemonicAnchor: { pt: "Mindinho Ponta: Dúvida isolada na última ponta (1 única citta: #11)", en: "Little Tip: Doubt isolated at the final tip (1 single citta: #11)", es: "Meñique Punta: Duda aislada en la última punta (1 única citta: #11)" } },
    ],
  },

  // MAP 3: 12 Links of Paṭiccasamuppāda + 3 Sandhis (1 Hand = 12 Phalanges)
  {
    id: "paticca12",
    asRef: "AS VIII.3–10",
    title: {
      pt: "3. Os 12 Elos do Paṭiccasamuppāda + 3 Sandhis (1 Mão — 12 Falanges)",
      en: "3. The 12 Links of Paṭiccasamuppāda + 3 Sandhis (1 Hand — 12 Phalanges)",
      es: "3. Los 12 Eslabones del Paṭiccasamuppāda + 3 Sandhis (1 Mano — 12 Falanges)",
    },
    subtitle: {
      pt: "3 elos por dedo · 3 tempos · 4 grupos · 3 junções kâmmicas (Sandhi)",
      en: "3 links per finger · 3 periods · 4 groups · 3 kammic junctions (Sandhi)",
      es: "3 eslabones por dedo · 3 tiempos · 4 grupos · 3 uniones kámmicas (Sandhi)",
    },
    handsUsed: 1,
    usesPalmCrease: false,
    formulaSummary: {
      pt: "1º Sandhi (Causas Passadas [1–2] → Resultados Presentes [3–7]) no Indicador | 2º Sandhi (Resultados [7] → Causas Presentes [8–10], onde quebrar o ciclo!) no Anelar | 3º Sandhi (Causas Presentes [10] → Resultados Futuros [11–12]) no Mindinho.",
      en: "1st Sandhi (Past Causes [1–2] → Present Results [3–7]) on Index | 2nd Sandhi (Results [7] → Present Causes [8–10], where the wheel is broken!) on Ring | 3rd Sandhi (Present Causes [10] → Future Results [11–12]) on Little.",
      es: "1.er Sandhi (Causas Pasadas [1–2] → Resultados Presentes [3–7]) en Índice | 2.º Sandhi (Resultados [7] → Causas Presentes [8–10], ¡donde romper el ciclo!) en Anular | 3.er Sandhi (Causas Presentes [10] → Resultados Futuros [11–12]) en Meñique.",
    },
    slots: [
      { index: 1, hand: "left", finger: "index", joint: "base", code: "1. Avj", pali: "Avijjā", label: { pt: "1. Avijjā (Ignorância — Causa Passada)", en: "1. Avijjā (Ignorance — Past Cause)", es: "1. Avijjā (Ignorancia — Causa Pasada)" }, mnemonicAnchor: { pt: "Indicador Base (1): Kilesa-vaṭṭa no passado", en: "Index Base (1): Past Kilesa-vaṭṭa", es: "Índice Base (1): Kilesa-vaṭṭa en el pasado" } },
      { index: 2, hand: "left", finger: "index", joint: "middle", code: "2. Sṅk", pali: "Saṅkhārā", label: { pt: "2. Saṅkhārā (Formações volitivas — Causa Passada)", en: "2. Saṅkhārā (Volitional formations — Past Cause)", es: "2. Saṅkhārā (Formaciones volitivas — Causa Pasada)" }, mnemonicAnchor: { pt: "Indicador Meio (2): Kamma-vaṭṭa passado → precede o 1º Sandhi!", en: "Index Mid (2): Past Kamma-vaṭṭa → precedes 1st Sandhi!", es: "Índice Medio (2): Kamma-vaṭṭa pasado → ¡precede el 1.er Sandhi!" }, sandhiAfter: { pt: "⚡ 1º Sandhi: Causa Passada (2) → Resultado Presente (3)", en: "⚡ 1st Sandhi: Past Cause (2) → Present Result (3)", es: "⚡ 1.er Sandhi: Causa Pasada (2) → Resultado Presente (3)" } },
      { index: 3, hand: "left", finger: "index", joint: "tip", code: "3. Viñ", pali: "Viññāṇa", label: { pt: "3. Viññāṇa (Consciência resultante — Resultado Presente)", en: "3. Viññāṇa (Resultant consciousness — Present Result)", es: "3. Viññāṇa (Conciencia resultante — Resultado Presente)" }, mnemonicAnchor: { pt: "Indicador Ponta (3): Abre o Vipāka-vaṭṭa presente no renascimento", en: "Index Tip (3): Opens present Vipāka-vaṭṭa at rebirth", es: "Índice Punta (3): Abre el Vipāka-vaṭṭa presente en el renacimiento" } },
      { index: 4, hand: "left", finger: "middle", joint: "base", code: "4. N-R", pali: "Nāma-rūpa", label: { pt: "4. Nāma-rūpa (Mente-e-materialidade — Resultado Presente)", en: "4. Nāma-rūpa (Mind-and-matter — Present Result)", es: "4. Nāma-rūpa (Mente-y-materialidad — Resultado Presente)" }, mnemonicAnchor: { pt: "Médio Base (4): O dedo Médio inteiro (4, 5, 6) é 100% Resultado Presente", en: "Middle Base (4): The entire Middle finger (4, 5, 6) is 100% Present Result", es: "Medio Base (4): Todo el dedo Medio (4, 5, 6) es 100 % Resultado Presente" } },
      { index: 5, hand: "left", finger: "middle", joint: "middle", code: "5. Saḷ", pali: "Saḷāyatana", label: { pt: "5. Saḷāyatana (Seis bases sensoriais — Resultado Presente)", en: "5. Saḷāyatana (Six sense-bases — Present Result)", es: "5. Saḷāyatana (Seis bases sensoriales — Resultado Presente)" }, mnemonicAnchor: { pt: "Médio Meio (5): As 6 portas instaladas no organismo", en: "Middle Mid (5): The 6 sense doors installed", es: "Medio Medio (5): Las 6 puertas sensoriales instaladas" } },
      { index: 6, hand: "left", finger: "middle", joint: "tip", code: "6. Pha", pali: "Phassa", label: { pt: "6. Phassa (Contato — Resultado Presente)", en: "6. Phassa (Contact — Present Result)", es: "6. Phassa (Contacto — Resultado Presente)" }, mnemonicAnchor: { pt: "Médio Ponta (6): Impacto do objeto na porta sensorial", en: "Middle Tip (6): Impact of object on sense door", es: "Medio Punta (6): Impacto del objeto en la puerta sensorial" } },
      { index: 7, hand: "left", finger: "ring", joint: "base", code: "7. Ved", pali: "Vedanā", label: { pt: "7. Vedanā (Sensação — Fim do Resultado Presente)", en: "7. Vedanā (Feeling — End of Present Result)", es: "7. Vedanā (Sensación — Fin del Resultado Presente)" }, mnemonicAnchor: { pt: "Anelar Base (7): Ponto crucial! Entre 7 (Vedanā) e 8 (Taṇhā) está o 2º Sandhi!", en: "Ring Base (7): Crucial point! Between 7 (Vedanā) and 8 (Taṇhā) lies the 2nd Sandhi!", es: "Anular Base (7): ¡Punto crucial! Entre 7 (Vedanā) y 8 (Taṇhā) está el 2.º Sandhi." }, sandhiAfter: { pt: "⚡ 2º Sandhi (Libertação): Resultado Presente (7) → Causa Presente (8)", en: "⚡ 2nd Sandhi (Liberation point): Present Result (7) → Present Cause (8)", es: "⚡ 2.º Sandhi (Punto de liberación): Resultado Presente (7) → Causa Presente (8)" } },
      { index: 8, hand: "left", finger: "ring", joint: "middle", code: "8. Taṇ", pali: "Taṇhā", label: { pt: "8. Taṇhā (Sede / Desejo — Causa Presente)", en: "8. Taṇhā (Craving — Present Cause)", es: "8. Taṇhā (Sed / Deseo — Causa Presente)" }, mnemonicAnchor: { pt: "Anelar Meio (8): Reinício do Kilesa-vaṭṭa no presente", en: "Ring Mid (8): Restart of Kilesa-vaṭṭa in the present", es: "Anular Medio (8): Reinicio del Kilesa-vaṭṭa en el presente" } },
      { index: 9, hand: "left", finger: "ring", joint: "tip", code: "9. Upā", pali: "Upādāna", label: { pt: "9. Upādāna (Apego — Causa Presente)", en: "9. Upādāna (Clinging — Present Cause)", es: "9. Upādāna (Apego — Causa Presente)" }, mnemonicAnchor: { pt: "Anelar Ponta (9): 4 tipos de apego (kāma, diṭṭhi, sīlabbata, attavāda)", en: "Ring Tip (9): 4 kinds of clinging (kāma, diṭṭhi, sīlabbata, attavāda)", es: "Anular Punta (9): 4 tipos de apego (kāma, diṭṭhi, sīlabbata, attavāda)" } },
      { index: 10, hand: "left", finger: "little", joint: "base", code: "10. Bha", pali: "Bhava", label: { pt: "10. Bhava (Existência / Kamma-bhava — Causa Presente)", en: "10. Bhava (Becoming / Kamma-bhava — Present Cause)", es: "10. Bhava (Existencia / Kamma-bhava — Causa Presente)" }, mnemonicAnchor: { pt: "Mindinho Base (10): Kamma-bhava presente → precede o 3º Sandhi!", en: "Little Base (10): Present Kamma-bhava → precedes 3rd Sandhi!", es: "Meñique Base (10): Kamma-bhava presente → ¡precede el 3.er Sandhi!" }, sandhiAfter: { pt: "⚡ 3º Sandhi: Causa Presente (10) → Resultado Futuro (11)", en: "⚡ 3rd Sandhi: Present Cause (10) → Future Result (11)", es: "⚡ 3.er Sandhi: Causa Presente (10) → Resultado Futuro (11)" } },
      { index: 11, hand: "left", finger: "little", joint: "middle", code: "11. Jāt", pali: "Jāti", label: { pt: "11. Jāti (Nascimento — Resultado Futuro)", en: "11. Jāti (Birth — Future Result)", es: "11. Jāti (Nacimiento — Resultado Futuro)" }, mnemonicAnchor: { pt: "Mindinho Meio (11): Equivale aos elos 3–7 na vida futura", en: "Little Mid (11): Equivalent to links 3–7 in the future life", es: "Meñique Medio (11): Equivale a los eslabones 3–7 en la vida futura" } },
      { index: 12, hand: "left", finger: "little", joint: "tip", code: "12. J-M", pali: "Jarā-maraṇa", label: { pt: "12. Jarā-maraṇa (Envelhecimento e morte — Resultado Futuro)", en: "12. Jarā-maraṇa (Aging-and-death — Future Result)", es: "12. Jarā-maraṇa (Envejecimiento y muerte — Resultado Futuro)" }, mnemonicAnchor: { pt: "Mindinho Ponta (12): Fechamento da roda do Saṃsāra", en: "Little Tip (12): Closing of the wheel of Saṃsāra", es: "Meñique Punta (12): Cierre de la rueda del Saṃsāra" } },
    ],
  },

  // MAP 4: 14 Functions of Consciousness (Kicca — Ch. 3)
  {
    id: "kicca14",
    asRef: "AS III.8–11",
    title: {
      pt: "4. As 14 Funções da Consciência — Kicca (1 Mão — 4 + 4 + 3 + 3)",
      en: "4. The 14 Functions of Consciousness — Kicca (1 Hand — 4 + 4 + 3 + 3)",
      es: "4. Las 14 Funciones de la Conciencia — Kicca (1 Mano — 4 + 4 + 3 + 3)",
    },
    subtitle: {
      pt: "Da reconexão (Paṭisandhi) à morte (Cuti), passando pelo processo cognitivo",
      en: "From rebirth-linking (Paṭisandhi) to death (Cuti) across the cognitive process",
      es: "De la reconexión (Paṭisandhi) a la muerte (Cuti) a través del proceso cognitivo",
    },
    handsUsed: 1,
    usesPalmCrease: true,
    formulaSummary: {
      pt: "Indicador (4): Paṭisandhi, Bhavaṅga, Āvajjana, Dassana | Médio (4): Savana, Ghāyana, Sāyana, Phusana | Anelar (3): Sampaṭicchana, Santīraṇa, Voṭṭhabbana | Mindinho (3): Javana, Tadārammaṇa, Cuti.",
      en: "Index (4): Paṭisandhi, Bhavaṅga, Āvajjana, Dassana | Middle (4): Savana, Ghāyana, Sāyana, Phusana | Ring (3): Sampaṭicchana, Santīraṇa, Voṭṭhabbana | Little (3): Javana, Tadārammaṇa, Cuti.",
      es: "Índice (4): Paṭisandhi, Bhavaṅga, Āvajjana, Dassana | Medio (4): Savana, Ghāyana, Sāyana, Phusana | Anular (3): Sampaṭicchana, Santīraṇa, Voṭṭhabbana | Meñique (3): Javana, Tadārammaṇa, Cuti.",
    },
    slots: [
      { index: 1, hand: "left", finger: "index", joint: "crease", code: "1. Paṭ", pali: "Paṭisandhi", label: { pt: "1. Paṭisandhi (Reconexão / Renascimento — 19 cittas)", en: "1. Paṭisandhi (Rebirth-linking — 19 cittas)", es: "1. Paṭisandhi (Reconexión / Renacimiento — 19 cittas)" }, mnemonicAnchor: { pt: "Dobra do Indicador: 19 Vipākas (2 Upekkhā-santīraṇa + 8 Mahā-vipāka + 9 Mahaggata-vipāka)", en: "Index Crease: 19 Vipākas (2 Upekkhā-santīraṇa + 8 Mahā-vipāka + 9 Mahaggata-vipāka)", es: "Pliegue del Índice: 19 Vipākas (2 Upekkhā-santīraṇa + 8 Mahā-vipāka + 9 Mahaggata-vipāka)" } },
      { index: 2, hand: "left", finger: "index", joint: "base", code: "2. Bha", pali: "Bhavaṅga", label: { pt: "2. Bhavaṅga (Contínuo vital — as mesmas 19 cittas)", en: "2. Bhavaṅga (Life-continuum — same 19 cittas)", es: "2. Bhavaṅga (Continuo vital — las mismas 19 cittas)" }, mnemonicAnchor: { pt: "Indicador Base: As mesmas 19 cittas de Paṭisandhi e Cuti", en: "Index Base: The exact same 19 cittas as Paṭisandhi and Cuti", es: "Índice Base: Las mismas 19 cittas que Paṭisandhi y Cuti" } },
      { index: 3, hand: "left", finger: "index", joint: "middle", code: "3. Āva", pali: "Āvajjana", label: { pt: "3. Āvajjana (Advertência — 2 cittas: #28 e #29)", en: "3. Āvajjana (Adverting — 2 cittas: #28 and #29)", es: "3. Āvajjana (Advertencia — 2 cittas: #28 y #29)" }, mnemonicAnchor: { pt: "Indicador Meio: Pañcadvārāvajjana (#28) e Manodvārāvajjana (#29)", en: "Index Mid: Pañcadvārāvajjana (#28) and Manodvārāvajjana (#29)", es: "Índice Medio: Pañcadvārāvajjana (#28) y Manodvārāvajjana (#29)" } },
      { index: 4, hand: "left", finger: "index", joint: "tip", code: "4. Das", pali: "Dassana", label: { pt: "4. Dassana (Visão — 2 cittas: #13 e #20)", en: "4. Dassana (Seeing — 2 cittas: #13 and #20)", es: "4. Dassana (Visión — 2 cittas: #13 y #20)" }, mnemonicAnchor: { pt: "Indicador Ponta: As 2 Cakkhu-viññāṇas", en: "Index Tip: The 2 Cakkhu-viññāṇas", es: "Índice Punta: Las 2 Cakkhu-viññāṇas" } },
      { index: 5, hand: "left", finger: "middle", joint: "crease", code: "5. Sav", pali: "Savana", label: { pt: "5. Savana (Audição — 2 cittas: #14 e #21)", en: "5. Savana (Hearing — 2 cittas: #14 and #21)", es: "5. Savana (Audición — 2 cittas: #14 y #21)" }, mnemonicAnchor: { pt: "Dobra do Médio: As 2 Sota-viññāṇas", en: "Middle Crease: The 2 Sota-viññāṇas", es: "Pliegue del Medio: Las 2 Sota-viññāṇas" } },
      { index: 6, hand: "left", finger: "middle", joint: "base", code: "6. Ghā", pali: "Ghāyana", label: { pt: "6. Ghāyana (Olfação — 2 cittas: #15 e #22)", en: "6. Ghāyana (Smelling — 2 cittas: #15 and #22)", es: "6. Ghāyana (Olfación — 2 cittas: #15 y #22)" }, mnemonicAnchor: { pt: "Médio Base: As 2 Ghāna-viññāṇas", en: "Middle Base: The 2 Ghāna-viññāṇas", es: "Medio Base: Las 2 Ghāna-viññāṇas" } },
      { index: 7, hand: "left", finger: "middle", joint: "middle", code: "7. Sāy", pali: "Sāyana", label: { pt: "7. Sāyana (Gustação — 2 cittas: #16 e #23)", en: "7. Sāyana (Tasting — 2 cittas: #16 and #23)", es: "7. Sāyana (Gustación — 2 cittas: #16 y #23)" }, mnemonicAnchor: { pt: "Médio Meio: As 2 Jivhā-viññāṇas", en: "Middle Mid: The 2 Jivhā-viññāṇas", es: "Medio Medio: Las 2 Jivhā-viññāṇas" } },
      { index: 8, hand: "left", finger: "middle", joint: "tip", code: "8. Phu", pali: "Phusana", label: { pt: "8. Phusana (Tato — 2 cittas: #17 e #24)", en: "8. Phusana (Touching — 2 cittas: #17 and #24)", es: "8. Phusana (Tacto — 2 cittas: #17 y #24)" }, mnemonicAnchor: { pt: "Médio Ponta: As 2 Kāya-viññāṇas (Dukkha e Sukha)", en: "Middle Tip: The 2 Kāya-viññāṇas (Dukkha and Sukha)", es: "Medio Punta: Las 2 Kāya-viññāṇas (Dukkha y Sukha)" } },
      { index: 9, hand: "left", finger: "ring", joint: "base", code: "9. Smp", pali: "Sampaṭicchana", label: { pt: "9. Sampaṭicchana (Recepção — 2 cittas: #18 e #25)", en: "9. Sampaṭicchana (Receiving — 2 cittas: #18 and #25)", es: "9. Sampaṭicchana (Recepción — 2 cittas: #18 y #25)" }, mnemonicAnchor: { pt: "Anelar Base: Recebe o objeto após a consciência sensorial", en: "Ring Base: Receives object after sense-consciousness", es: "Anular Base: Recibe el objeto tras la conciencia sensorial" } },
      { index: 10, hand: "left", finger: "ring", joint: "middle", code: "10. Snt", pali: "Santīraṇa", label: { pt: "10. Santīraṇa (Investigação — 3 cittas: #19, #26, #27)", en: "10. Santīraṇa (Investigating — 3 cittas: #19, #26, #27)", es: "10. Santīraṇa (Investigación — 3 cittas: #19, #26, #27)" }, mnemonicAnchor: { pt: "Anelar Meio: As 3 Santīraṇas examinam o objeto", en: "Ring Mid: The 3 Santīraṇas examine the object", es: "Anular Medio: Las 3 Santīraṇas examinan el objeto" } },
      { index: 11, hand: "left", finger: "ring", joint: "tip", code: "11. Voṭ", pali: "Voṭṭhabbana", label: { pt: "11. Voṭṭhabbana (Determinação — 1 citta: #29 Manodvārāvajjana)", en: "11. Voṭṭhabbana (Determining — 1 citta: #29 Manodvārāvajjana)", es: "11. Voṭṭhabbana (Determinación — 1 citta: #29 Manodvārāvajjana)" }, mnemonicAnchor: { pt: "Anelar Ponta: Manodvārāvajjana exerce 2 funções (Āvajjana na porta mental e Voṭṭhabbana nas 5 portas!)", en: "Ring Tip: Manodvārāvajjana performs 2 functions (Āvajjana at mind-door and Voṭṭhabbana at 5 doors!)", es: "Anular Punta: Manodvārāvajjana ejerce 2 funciones (Āvajjana en puerta mental y Voṭṭhabbana en 5 puertas)" } },
      { index: 12, hand: "left", finger: "little", joint: "base", code: "12. Jav", pali: "Javana", label: { pt: "12. Javana (Impulso kâmmico — 55 cittas)", en: "12. Javana (Impulsion — 55 cittas)", es: "12. Javana (Impulso kámmico — 55 cittas)" }, mnemonicAnchor: { pt: "Mindinho Base: 12 Akusala + 1 Hasituppāda + 8 Mahā-kusala + 8 Mahā-kiriya + 18 Mahaggata (Kus/Kir) + 8 Lokuttara = 55!", en: "Little Base: 12 Akusala + 1 Hasituppāda + 8 Mahā-kusala + 8 Mahā-kiriya + 18 Mahaggata (Kus/Kir) + 8 Lokuttara = 55!", es: "Meñique Base: 12 Akusala + 1 Hasituppāda + 8 Mahā-kusala + 8 Mahā-kiriya + 18 Mahaggata (Kus/Kir) + 8 Lokuttara = 55" } },
      { index: 13, hand: "left", finger: "little", joint: "middle", code: "13. Tad", pali: "Tadārammaṇa", label: { pt: "13. Tadārammaṇa (Registro — 11 cittas)", en: "13. Tadārammaṇa (Registration — 11 cittas)", es: "13. Tadārammaṇa (Registro — 11 cittas)" }, mnemonicAnchor: { pt: "Mindinho Meio: 3 Santīraṇas + 8 Mahā-vipākas = 11 cittas", en: "Little Mid: 3 Santīraṇas + 8 Mahā-vipākas = 11 cittas", es: "Meñique Medio: 3 Santīraṇas + 8 Mahā-vipākas = 11 cittas" } },
      { index: 14, hand: "left", finger: "little", joint: "tip", code: "14. Cut", pali: "Cuti", label: { pt: "14. Cuti (Morte / Falecimento — as mesmas 19 cittas)", en: "14. Cuti (Death — same 19 cittas)", es: "14. Cuti (Muerte / Fallecimiento — las mismas 19 cittas)" }, mnemonicAnchor: { pt: "Mindinho Ponta: Encerra a vida exatamente com a mesma citta de Paṭisandhi e Bhavaṅga (19 cittas)", en: "Little Tip: Ends the life with the exact same citta as Paṭisandhi and Bhavaṅga (19 cittas)", es: "Meñique Punta: Cierra la vida con la misma citta que Paṭisandhi y Bhavaṅga (19 cittas)" } },
    ],
  },

  // MAP 5: 24 Conditions of Paṭṭhāna (2 Hands = 24 Phalanges)
  {
    id: "patthana24",
    asRef: "AS VIII.11–28",
    title: {
      pt: "5. As 24 Condições do Paṭṭhāna (2 Mãos — 24 Falanges)",
      en: "5. The 24 Conditions of Paṭṭhāna (2 Hands — 24 Phalanges)",
      es: "5. Las 24 Condiciones del Paṭṭhāna (2 Manos — 24 Falanges)",
    },
    subtitle: {
      pt: "Mão Esquerda (1–12: Hetu a Āsevana) + Mão Direita (13–24: Kamma a Avigata)",
      en: "Left Hand (1–12: Hetu to Āsevana) + Right Hand (13–24: Kamma to Avigata)",
      es: "Mano Izquierda (1–12: Hetu a Āsevana) + Mano Derecha (13–24: Kamma a Avigata)",
    },
    handsUsed: 2,
    usesPalmCrease: false,
    formulaSummary: {
      pt: "3 condições por dedo em 8 dedos (4 esq. + 4 dir.) = 24 paccayas na ordem canônica exata do Paṭṭhāna.",
      en: "3 conditions per finger across 8 fingers (4 left + 4 right) = 24 paccayas in the exact canonical order of the Paṭṭhāna.",
      es: "3 condiciones por dedo en 8 dedos (4 izq. + 4 der.) = 24 paccayas en el orden canónico exacto del Paṭṭhāna.",
    },
    slots: [
      { index: 1, hand: "left", finger: "index", joint: "base", code: "1. Het", pali: "Hetu-paccaya", label: { pt: "1. Hetu (Condição de Raiz — 6 raízes)", en: "1. Hetu (Root Condition — 6 roots)", es: "1. Hetu (Condición de Raíz — 6 raíces)" }, mnemonicAnchor: { pt: "Esq. Indicador Base (1): Lobha, Dosa, Moha, Alobha, Adosa, Amoha", en: "L. Index Base (1): Lobha, Dosa, Moha, Alobha, Adosa, Amoha", es: "Izq. Índice Base (1): Lobha, Dosa, Moha, Alobha, Adosa, Amoha" } },
      { index: 2, hand: "left", finger: "index", joint: "middle", code: "2. Āra", pali: "Ārammaṇa-paccaya", label: { pt: "2. Ārammaṇa (Condição de Objeto)", en: "2. Ārammaṇa (Object Condition)", es: "2. Ārammaṇa (Condición de Objeto)" }, mnemonicAnchor: { pt: "Esq. Indicador Meio (2): Todo dhamma/conceito que é cognizado", en: "L. Index Mid (2): Any dhamma/concept that is cognized", es: "Izq. Índice Medio (2): Toda realidad/concepto que es cognizado" } },
      { index: 3, hand: "left", finger: "index", joint: "tip", code: "3. Adh", pali: "Adhipati-paccaya", label: { pt: "3. Adhipati (Condição de Predominância — 4 fatores)", en: "3. Adhipati (Predominance Condition — 4 factors)", es: "3. Adhipati (Condición de Predominancia — 4 factores)" }, mnemonicAnchor: { pt: "Esq. Indicador Ponta (3): Chanda, Vīriya, Citta, Vīmaṃsā (Paññā)", en: "L. Index Tip (3): Chanda, Vīriya, Citta, Vīmaṃsā (Paññā)", es: "Izq. Índice Punta (3): Chanda, Vīriya, Citta, Vīmaṃsā (Paññā)" } },
      { index: 4, hand: "left", finger: "middle", joint: "base", code: "4. Ana", pali: "Anantara-paccaya", label: { pt: "4. Anantara (Condição de Proximidade)", en: "4. Anantara (Proximity Condition)", es: "4. Anantara (Condición de Proximidad)" }, mnemonicAnchor: { pt: "Esq. Médio Base (4): Cada citta que cessa dá lugar imediato à seguinte", en: "L. Middle Base (4): Each ceasing citta gives immediate way to the next", es: "Izq. Medio Base (4): Cada citta que cesa da paso inmediato a la siguiente" } },
      { index: 5, hand: "left", finger: "middle", joint: "middle", code: "5. Sam", pali: "Samanantara-paccaya", label: { pt: "5. Samanantara (Condição de Contiguidade)", en: "5. Samanantara (Contiguity Condition)", es: "5. Samanantara (Condición de Contigüidad)" }, mnemonicAnchor: { pt: "Esq. Médio Meio (5): Par gêmeo de Anantara (sem intervalo)", en: "L. Middle Mid (5): Twin pair of Anantara (without interval)", es: "Izq. Medio Medio (5): Par gemelo de Anantara (sin intervalo)" } },
      { index: 6, hand: "left", finger: "middle", joint: "tip", code: "6. Sah", pali: "Sahajāta-paccaya", label: { pt: "6. Sahajāta (Condição de Conascência)", en: "6. Sahajāta (Co-nascence Condition)", es: "6. Sahajāta (Condición de Conascencia)" }, mnemonicAnchor: { pt: "Esq. Médio Ponta (6): Surgem juntos no mesmo instante (como chama e luz)", en: "L. Middle Tip (6): Arising together in the same instant (like flame and light)", es: "Izq. Medio Punta (6): Surgen juntos en el mismo instante (como llama y luz)" } },
      { index: 7, hand: "left", finger: "ring", joint: "base", code: "7. Aññ", pali: "Aññamañña-paccaya", label: { pt: "7. Aññamañña (Condição de Mutualidade)", en: "7. Aññamañña (Mutuality Condition)", es: "7. Aññamañña (Condición de Mutualidad)" }, mnemonicAnchor: { pt: "Esq. Anelar Base (7): Tripé que se apoia mutuamente", en: "L. Ring Base (7): Tripod supporting each other mutually", es: "Izq. Anular Base (7): Trípode que se apoya mutuamente" } },
      { index: 8, hand: "left", finger: "ring", joint: "middle", code: "8. Nis", pali: "Nissaya-paccaya", label: { pt: "8. Nissaya (Condição de Suporte / Base)", en: "8. Nissaya (Support Condition)", es: "8. Nissaya (Condición de Soporte / Base)" }, mnemonicAnchor: { pt: "Esq. Anelar Meio (8): Como a terra ou a tela para a pintura", en: "L. Ring Mid (8): Like earth or canvas for a painting", es: "Izq. Anular Medio (8): Como la tierra o el lienzo para una pintura" } },
      { index: 9, hand: "left", finger: "ring", joint: "tip", code: "9. Upa", pali: "Upanissaya-paccaya", label: { pt: "9. Upanissaya (Condição de Suporte Decisivo)", en: "9. Upanissaya (Decisive Support Condition)", es: "9. Upanissaya (Condición de Soporte Decisivo)" }, mnemonicAnchor: { pt: "Esq. Anelar Ponta (9): Indução forte (objeto, proximidade ou natural)", en: "L. Ring Tip (9): Powerful inducement (object, proximity, or natural)", es: "Izq. Anular Punta (9): Inducción poderosa (objeto, proximidad o natural)" } },
      { index: 10, hand: "left", finger: "little", joint: "base", code: "10. Pur", pali: "Purejāta-paccaya", label: { pt: "10. Purejāta (Condição de Pré-nascença)", en: "10. Purejāta (Pre-nascence Condition)", es: "10. Purejāta (Condición de Prenascencia)" }, mnemonicAnchor: { pt: "Esq. Mindinho Base (10): Rūpa nascido antes (bases e objetos) condicionando Citta", en: "L. Little Base (10): Earlier-born Rūpa (bases & objects) conditioning Citta", es: "Izq. Meñique Base (10): Rūpa nacido antes condicionando Citta" } },
      { index: 11, hand: "left", finger: "little", joint: "middle", code: "11. Pac", pali: "Pacchājāta-paccaya", label: { pt: "11. Pacchājāta (Condição de Pós-nascença)", en: "11. Pacchājāta (Post-nascence Condition)", es: "11. Pacchājāta (Condición de Posnascencia)" }, mnemonicAnchor: { pt: "Esq. Mindinho Meio (11): Citta nascida depois sustentando o corpo já nascido", en: "L. Little Mid (11): Later-born Citta sustaining the already-born body", es: "Izq. Meñique Medio (11): Citta nacida después sosteniendo el cuerpo ya nacido" } },
      { index: 12, hand: "left", finger: "little", joint: "tip", code: "12. Āse", pali: "Āsevana-paccaya", label: { pt: "12. Āsevana (Condição de Repetição nos Javanas)", en: "12. Āsevana (Repetition Condition in Javanas)", es: "12. Āsevana (Condición de Repetición en los Javanas)" }, mnemonicAnchor: { pt: "Esq. Mindinho Ponta (12): Fecha a mão esquerda! Momentum dos 7 Javanas", en: "L. Little Tip (12): Closes left hand! Momentum across the 7 Javanas", es: "Izq. Meñique Punta (12): ¡Cierra la mano izquierda! Impulso de los 7 Javanas" } },
      { index: 13, hand: "right", finger: "index", joint: "base", code: "13. Kam", pali: "Kamma-paccaya", label: { pt: "13. Kamma (Condição de Kamma / Volição Cetanā)", en: "13. Kamma (Kamma Condition / Volition Cetanā)", es: "13. Kamma (Condición de Kamma / Volición Cetanā)" }, mnemonicAnchor: { pt: "Dir. Indicador Base (13): Abre a mão direita! Cetanā conascida ou assíncrona", en: "R. Index Base (13): Opens right hand! Co-nascent or asynchronous Cetanā", es: "Der. Índice Base (13): ¡Abre la mano derecha! Cetanā conacida o asíncrona" } },
      { index: 14, hand: "right", finger: "index", joint: "middle", code: "14. Vip", pali: "Vipāka-paccaya", label: { pt: "14. Vipāka (Condição de Resultado)", en: "14. Vipāka (Resultant Condition)", es: "14. Vipāka (Condición de Resultado)" }, mnemonicAnchor: { pt: "Dir. Indicador Meio (14): Repouso sem esforço dos fatores resultantes", en: "R. Index Mid (14): Effortless calm of resultant factors", es: "Der. Índice Medio (14): Calma sin esfuerzo de los factores resultantes" } },
      { index: 15, hand: "right", finger: "index", joint: "tip", code: "15. Āhā", pali: "Āhāra-paccaya", label: { pt: "15. Āhāra (Condição de Nutrição — 4 alimentos)", en: "15. Āhāra (Nutriment Condition — 4 nutriments)", es: "15. Āhāra (Condición de Nutrición — 4 alimentos)" }, mnemonicAnchor: { pt: "Dir. Indicador Ponta (15): Oja (físico) + Phassa, Cetanā, Viññāṇa (mentais)", en: "R. Index Tip (15): Oja (physical) + Phassa, Cetanā, Viññāṇa (mental)", es: "Der. Índice Punta (15): Oja (físico) + Phassa, Cetanā, Viññāṇa (mentales)" } },
      { index: 16, hand: "right", finger: "middle", joint: "base", code: "16. Ind", pali: "Indriya-paccaya", label: { pt: "16. Indriya (Condição de Faculdade — 20 faculdades)", en: "16. Indriya (Faculty Condition — 20 faculties)", es: "16. Indriya (Condición de Facultad — 20 facultades)" }, mnemonicAnchor: { pt: "Dir. Médio Base (16): Domínio exercido pelas faculdades em sua esfera", en: "R. Middle Base (16): Mastery exercised by faculties in their sphere", es: "Der. Medio Base (16): Dominio ejercido por las facultades en su esfera" } },
      { index: 17, hand: "right", finger: "middle", joint: "middle", code: "17. Jhā", pali: "Jhāna-paccaya", label: { pt: "17. Jhāna (Condição de Jhāna — 5 fatores)", en: "17. Jhāna (Jhāna Condition — 5 factors)", es: "17. Jhāna (Condición de Jhāna — 5 factores)" }, mnemonicAnchor: { pt: "Dir. Médio Meio (17): Vitakka, Vicāra, Pīti, Vedanā, Ekaggatā", en: "R. Middle Mid (17): Vitakka, Vicāra, Pīti, Vedanā, Ekaggatā", es: "Der. Medio Medio (17): Vitakka, Vicāra, Pīti, Vedanā, Ekaggatā" } },
      { index: 18, hand: "right", finger: "middle", joint: "tip", code: "18. Mag", pali: "Magga-paccaya", label: { pt: "18. Magga (Condição de Caminho — 9/12 fatores)", en: "18. Magga (Path Condition — 9/12 factors)", es: "18. Magga (Condición de Camino — 9/12 factores)" }, mnemonicAnchor: { pt: "Dir. Médio Ponta (18): Fatores do caminho (8 nobres + 4 errôneos)", en: "R. Middle Tip (18): Path factors (8 noble + 4 wrong)", es: "Der. Medio Punta (18): Factores del camino (8 nobles + 4 erróneos)" } },
      { index: 19, hand: "right", finger: "ring", joint: "base", code: "19. Smp", pali: "Sampayutta-paccaya", label: { pt: "19. Sampayutta (Condição de Associação — Nāma c/ Nāma)", en: "19. Sampayutta (Association Condition — Nāma w/ Nāma)", es: "19. Sampayutta (Condición de Asociación — Nāma con Nāma)" }, mnemonicAnchor: { pt: "Dir. Anelar Base (19): 4 vínculos de Citta + Cetasikas (ekuppāda, ekanirodha, ekārammaṇa, ekavatthuka)", en: "R. Ring Base (19): 4 bonds of Citta + Cetasikas (same arising, ceasing, object, base)", es: "Der. Anular Base (19): 4 vínculos de Citta + Cetasikas (mismo surgir, cesar, objeto y base)" } },
      { index: 20, hand: "right", finger: "ring", joint: "middle", code: "20. Vip", pali: "Vippayutta-paccaya", label: { pt: "20. Vippayutta (Condição de Dissociação — Nāma × Rūpa)", en: "20. Vippayutta (Dissociation Condition — Nāma × Rūpa)", es: "20. Vippayutta (Condición de Disociación — Nāma × Rūpa)" }, mnemonicAnchor: { pt: "Dir. Anelar Meio (20): Relação entre mente (Nāma) e materialidade (Rūpa)", en: "R. Ring Mid (20): Relation between mind (Nāma) and matter (Rūpa)", es: "Der. Anular Medio (20): Relación entre mente (Nāma) y materialidad (Rūpa)" } },
      { index: 21, hand: "right", finger: "ring", joint: "tip", code: "21. Att", pali: "Atthi-paccaya", label: { pt: "21. Atthi (Condição de Presença)", en: "21. Atthi (Presence Condition)", es: "21. Atthi (Condición de Presencia)" }, mnemonicAnchor: { pt: "Dir. Anelar Ponta (21): Condicionamento pela coexistência presente", en: "R. Ring Tip (21): Conditioning by present coexistence", es: "Der. Anular Punta (21): Condicionamiento por coexistencia presente" } },
      { index: 22, hand: "right", finger: "little", joint: "base", code: "22. Nat", pali: "Natthi-paccaya", label: { pt: "22. Natthi (Condição de Ausência)", en: "22. Natthi (Absence Condition)", es: "22. Natthi (Condición de Ausencia)" }, mnemonicAnchor: { pt: "Dir. Mindinho Base (22): A cessação da citta anterior abre espaço para a atual", en: "R. Little Base (22): Cessation of previous citta makes room for the present one", es: "Der. Meñique Base (22): La cesación de la citta anterior abre espacio a la actual" } },
      { index: 23, hand: "right", finger: "little", joint: "middle", code: "23. Vig", pali: "Vigata-paccaya", label: { pt: "23. Vigata (Condição de Desaparecimento)", en: "23. Vigata (Disappearance Condition)", es: "23. Vigata (Condición de Desaparición)" }, mnemonicAnchor: { pt: "Dir. Mindinho Meio (23): Par gêmeo de Natthi", en: "R. Little Mid (23): Twin pair of Natthi", es: "Der. Meñique Medio (23): Par gemelo de Natthi" } },
      { index: 24, hand: "right", finger: "little", joint: "tip", code: "24. Avg", pali: "Avigata-paccaya", label: { pt: "24. Avigata (Condição de Não-Desaparecimento)", en: "24. Avigata (Non-Disappearance Condition)", es: "24. Avigata (Condición de No-Desaparición)" }, mnemonicAnchor: { pt: "Dir. Mindinho Ponta (24): Par gêmeo de Atthi — fecha o Paṭṭhāna!", en: "R. Little Tip (24): Twin pair of Atthi — closes the Paṭṭhāna!", es: "Der. Meñique Punta (24): Par gemelo de Atthi — ¡cierra el Paṭṭhāna!" } },
    ],
  },
];
