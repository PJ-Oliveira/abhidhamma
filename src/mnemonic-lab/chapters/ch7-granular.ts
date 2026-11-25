// ============================================================================
// CAPÍTULO 7 (EXPANSÃO GRANULAR) — TODOS OS DHAMMAS INDIVIDUAIS DO SAMUCCAYA
// ============================================================================
// Completa AS VII.3–53 no nível de cada dhamma individual:
// 1. Akusala Granular (34 itens): membros dos 9 grupos → Cetasika real (Vatthuto)
// 2. Missaka Granular (51 itens): 22 Indriyas + 12 Maggaṅgas + 4 Balas + 4 Adhipatis + 4 Āhāras + 5 Leis
// 3. 37 Bodhipakkhiyas Individuais (37 itens): cada fator → seu Sabhāva-dhamma real (14)
// 4. Sabba Granular (28 itens): 5 Khandhas + 12 Āyatanas + 7 Viññāṇadhātus + 4 Ariyasaccas
// Total: 150 itens individuais 100% fiéis ao mūla (AS VII.3–53).
// ============================================================================

import type { NaryChallengeItem } from "../nary-chapters-data.js";

function mkAk(
  id: string,
  asRef: string,
  code: string,
  akSet: string,
  slot: number,
  realDhamma: string,
  pali: string,
  pt: string,
  en: string,
  es: string,
  notePt: string,
  noteEn: string,
  noteEs: string
): NaryChallengeItem {
  return {
    id,
    chapter: 7,
    submatrix: "akusala_members",
    asRef,
    code,
    pali,
    name: { pt, en, es },
    formulaNote: { pt: notePt, en: noteEn, es: noteEs },
    primaryGroup: "akusala_members",
    secondaryGroup: akSet,
    switches: { compendium: "akusala_members", akSet, slot, realDhamma },
  };
}

function mkMi(
  id: string,
  asRef: string,
  code: string,
  miSet: string,
  slot: number,
  realClass: string,
  pali: string,
  pt: string,
  en: string,
  es: string,
  notePt: string,
  noteEn: string,
  noteEs: string
): NaryChallengeItem {
  return {
    id,
    chapter: 7,
    submatrix: "missaka_members",
    asRef,
    code,
    pali,
    name: { pt, en, es },
    formulaNote: { pt: notePt, en: noteEn, es: noteEs },
    primaryGroup: "missaka_members",
    secondaryGroup: miSet,
    switches: { compendium: "missaka_members", miSet, slot, realClass },
  };
}

function mkBo(
  id: string,
  asRef: string,
  code: string,
  bGroup: string,
  slot: number,
  sabhava: string,
  pali: string,
  pt: string,
  en: string,
  es: string,
  notePt: string,
  noteEn: string,
  noteEs: string
): NaryChallengeItem {
  return {
    id,
    chapter: 7,
    submatrix: "bodhi_37",
    asRef,
    code,
    pali,
    name: { pt, en, es },
    formulaNote: { pt: notePt, en: noteEn, es: noteEs },
    primaryGroup: "bodhi_37",
    secondaryGroup: bGroup,
    switches: { compendium: "bodhi_37", bGroup, slot, sabhava },
  };
}

function mkSb(
  id: string,
  asRef: string,
  code: string,
  sbSet: string,
  slot: number,
  paramatthaMap: string,
  pali: string,
  pt: string,
  en: string,
  es: string,
  notePt: string,
  noteEn: string,
  noteEs: string
): NaryChallengeItem {
  return {
    id,
    chapter: 7,
    submatrix: "sabba_members",
    asRef,
    code,
    pali,
    name: { pt, en, es },
    formulaNote: { pt: notePt, en: noteEn, es: noteEs },
    primaryGroup: "sabba_members",
    secondaryGroup: sbSet,
    switches: { compendium: "sabba_members", sbSet, slot, paramatthaMap },
  };
}

export const CHAPTER_7_GRANULAR_ITEMS: readonly NaryChallengeItem[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 1. AKUSALA-SAṄGAHA GRANULAR (34 ITENS — AS VII.3–14)
  // ══════════════════════════════════════════════════════════════════════════
  // 4 Āsava / Ogha / Yoga (4 → 3 reais: Lobha, Lobha, Diṭṭhi, Moha)
  mkAk("sam:akm:1", "AS VII.3–5, 14", "AkM-01", "asava_ogha_yoga", 1, "lobha",
    "Kāmāsava · Kāmogha · Kāmayoga", "Efluência/Torrente/Jugo do Prazer Sensual", "Taint/Flood/Yoke of Sense-Desire", "Efluencia/Torrente/Yugo del Deseo Sensual",
    "1.º membro de Āsava, Ogha e Yoga: reduz-se em substância (vatthuto) ao cetasika Lobha.", "1st member of Āsava, Ogha & Yoga: reduces in reality (vatthuto) to Lobha.", "1.er miembro de Āsava, Ogha y Yoga: se reduce a Lobha."),
  mkAk("sam:akm:2", "AS VII.3–5, 14", "AkM-02", "asava_ogha_yoga", 2, "lobha",
    "Bhavāsava · Bhavogha · Bhavayoga", "Efluência/Torrente/Jugo da Existência", "Taint/Flood/Yoke of Becoming", "Efluencia/Torrente/Yugo de la Existencia",
    "2.º membro de Āsava, Ogha e Yoga: também é Lobha (funde-se com Kāma → 4 viram 3 reais!).", "2nd member of Āsava, Ogha & Yoga: also Lobha (merges with Kāma → 4 become 3 real!).", "2.º miembro: también es Lobha (junto con Kāma reduce 4 → 3 reales)."),
  mkAk("sam:akm:3", "AS VII.3–5, 14", "AkM-03", "asava_ogha_yoga", 3, "ditthi",
    "Diṭṭhāsava · Diṭṭhogha · Diṭṭhiyoga", "Efluência/Torrente/Jugo da Visão Errônea", "Taint/Flood/Yoke of Wrong View", "Efluencia/Torrente/Yugo de la Visión Errónea",
    "3.º membro de Āsava, Ogha e Yoga: corresponde ao cetasika Diṭṭhi (erradicado por Sotāpattimagga).", "3rd member of Āsava, Ogha & Yoga: corresponds to Diṭṭhi (eradicated by Stream-Entry).", "3.er miembro: corresponde al cetasika Diṭṭhi."),
  mkAk("sam:akm:4", "AS VII.3–5, 14", "AkM-04", "asava_ogha_yoga", 4, "moha",
    "Avijjāsava · Avijjogha · Avijjāyoga", "Efluência/Torrente/Jugo da Ignorância", "Taint/Flood/Yoke of Ignorance", "Efluencia/Torrente/Yugo de la Ignorancia",
    "4.º membro de Āsava, Ogha e Yoga: corresponde ao cetasika Moha (erradicado apenas no Arahattamagga).", "4th member of Āsava, Ogha & Yoga: corresponds to Moha (eradicated only at Arahantship).", "4.º miembro: corresponde al cetasika Moha."),

  // 4 Gantha (4 → 3 reais: Lobha, Dosa, Diṭṭhi, Diṭṭhi)
  mkAk("sam:akm:5", "AS VII.6, 13–14", "AkM-05", "gantha", 1, "lobha",
    "Abhijjhā-kāyagantha", "Nó 1 · Cobiça (Abhijjhā)", "Knot 1 · Covetousness (Abhijjhā)", "Nudo 1 · Codicia (Abhijjhā)",
    "1.º dos 4 Nós corporais: em substância real é Lobha (AS VII.13).", "1st of 4 Bodily Knots: in ultimate reality it is Lobha (AS VII.13).", "1.er Nudo corporal: en realidad última es Lobha (AS VII.13)."),
  mkAk("sam:akm:6", "AS VII.6, 13–14", "AkM-06", "gantha", 2, "dosa",
    "Byāpāda-kāyagantha", "Nó 2 · Má Vontade (Byāpāda)", "Knot 2 · Ill Will (Byāpāda)", "Nudo 2 · Mala Voluntad (Byāpāda)",
    "2.º dos 4 Nós corporais: em substância real é Dosa.", "2nd of 4 Bodily Knots: in ultimate reality it is Dosa.", "2.º Nudo corporal: en realidad última es Dosa."),
  mkAk("sam:akm:7", "AS VII.6, 13–14", "AkM-07", "gantha", 3, "ditthi",
    "Sīlabbataparāmāsa-kāyagantha", "Nó 3 · Apego a Ritos e Regras", "Knot 3 · Adherence to Rules and Rituals", "Nudo 3 · Apego a Ritos y Reglas",
    "3.º dos 4 Nós corporais: reduz-se a Diṭṭhi (junto com o 4.º nó, AS VII.13).", "3rd of 4 Bodily Knots: reduces to Diṭṭhi (along with the 4th knot, AS VII.13).", "3.er Nudo corporal: se reduce a Diṭṭhi (AS VII.13)."),
  mkAk("sam:akm:8", "AS VII.6, 13–14", "AkM-08", "gantha", 4, "ditthi",
    "Idaṃsaccābhinivesa-kāyagantha", "Nó 4 · Dogmatismo ('Só Isto é Verdade')", "Knot 4 · Dogmatic Adherence ('This Alone Is Truth')", "Nudo 4 · Dogmatismo ('Solo Esto es Verdad')",
    "4.º Nó corporal: também se reduz a Diṭṭhi → 4 Ganthas = 3 reais (Lobha, Dosa, Diṭṭhi).", "4th Bodily Knot: also reduces to Diṭṭhi → 4 Knots = 3 real (Lobha, Dosa, Diṭṭhi).", "4.º Nudo corporal: también es Diṭṭhi → 4 Nudos = 3 reales."),

  // 4 Upādāna (4 → 2 reais: Lobha + 3×Diṭṭhi)
  mkAk("sam:akm:9", "AS VII.7, 13–14", "AkM-09", "upadana", 1, "lobha",
    "Kāmupādāna", "Apego 1 · Apego aos Prazeres Sensuais", "Clinging 1 · Clinging to Sense-Pleasures", "Aferramiento 1 · Apego Sensual",
    "Único dos 4 Upādānas que é Lobha (os outros 3 são todos Diṭṭhi!).", "Sole Upādāna that is Lobha (the other 3 are all Diṭṭhi!).", "Único de los 4 Upādānas que es Lobha (los otros 3 son Diṭṭhi)."),
  mkAk("sam:akm:10", "AS VII.7, 13–14", "AkM-10", "upadana", 2, "ditthi",
    "Diṭṭhupādāna", "Apego 2 · Apego a Visões Errôneas", "Clinging 2 · Clinging to Wrong Views", "Aferramiento 2 · Apego a Visiones Erróneas",
    "2.º Upādāna: reduz-se a Diṭṭhi (visões especulativas gerais).", "2nd Clinging: reduces to Diṭṭhi (general speculative views).", "2.º Aferramiento: se reduce a Diṭṭhi."),
  mkAk("sam:akm:11", "AS VII.7, 13–14", "AkM-11", "upadana", 3, "ditthi",
    "Sīlabbatupādāna", "Apego 3 · Apego a Ritos e Observâncias", "Clinging 3 · Clinging to Rules and Rituals", "Aferramiento 3 · Apego a Ritos y Reglas",
    "3.º Upādāna: também é Diṭṭhi (crença de purificação por rituais externos).", "3rd Clinging: also Diṭṭhi (belief in purification via external rituals).", "3.er Aferramiento: también es Diṭṭhi."),
  mkAk("sam:akm:12", "AS VII.7, 13–14", "AkM-12", "upadana", 4, "ditthi",
    "Attavādupādāna", "Apego 4 · Apego à Doutrina de um Eu", "Clinging 4 · Clinging to Doctrine of Self", "Aferramiento 4 · Apego a la Doctrina del Yo",
    "4.º Upādāna: também é Diṭṭhi (Sakkāyadiṭṭhi) → 4 Upādānas colapsam em 2 reais!", "4th Clinging: also Diṭṭhi (personality view) → 4 Clingings collapse to 2 real!", "4.º Aferramiento: también es Diṭṭhi → 4 colapsan en 2 reales."),

  // 6 Nīvaraṇa (6 → 8 reais!)
  mkAk("sam:akm:13", "AS VII.8, 14", "AkM-13", "nivarana", 1, "lobha",
    "Kāmacchanda-nīvaraṇa", "Obstáculo 1 · Desejo Sensual (Kāmacchanda)", "Hindrance 1 · Sensual Desire (Kāmacchanda)", "Obstáculo 1 · Deseo Sensual (Kāmacchanda)",
    "1.º Obstáculo: em substância é Lobha (não confundir com o neutro Chanda!).", "1st Hindrance: in reality it is Lobha (not the neutral Chanda!).", "1.er Obstáculo: en realidad es Lobha (no el neutro Chanda)."),
  mkAk("sam:akm:14", "AS VII.8, 14", "AkM-14", "nivarana", 2, "dosa",
    "Byāpāda-nīvaraṇa", "Obstáculo 2 · Má Vontade (Byāpāda)", "Hindrance 2 · Ill Will (Byāpāda)", "Obstáculo 2 · Mala Voluntad (Byāpāda)",
    "2.º Obstáculo: em substância é Dosa.", "2nd Hindrance: in reality it is Dosa.", "2.º Obstáculo: en realidad es Dosa."),
  mkAk("sam:akm:15", "AS VII.8, 14", "AkM-15", "nivarana", 3, "thina_middha",
    "Thīnamiddha-nīvaraṇa", "Obstáculo 3 · Preguiça e Torpor (2 Reais)", "Hindrance 3 · Sloth and Torpor (2 Real)", "Obstáculo 3 · Pereza y Torpor (2 Reales)",
    "3.º Obstáculo: 1 nome que contém 2 cetasikas reais (Thīna + Middha) — expande 6 → 8!", "3rd Hindrance: 1 name holding 2 real cetasikas (Sloth + Torpor) — expands 6 → 8!", "3.er Obstáculo: 1 nombre con 2 cetasikas reales (Thīna + Middha)."),
  mkAk("sam:akm:16", "AS VII.8, 14", "AkM-16", "nivarana", 4, "uddhacca_kukkucca",
    "Uddhaccakukkucca-nīvaraṇa", "Obstáculo 4 · Agitação e Remorso (2 Reais)", "Hindrance 4 · Restlessness and Remorse (2 Real)", "Obstáculo 4 · Inquietud y Remordimiento (2 Reales)",
    "4.º Obstáculo: 1 nome que contém 2 cetasikas reais (Uddhacca + Kukkucca) — fecha 6 → 8!", "4th Hindrance: 1 name holding 2 real cetasikas (Restlessness + Remorse) — completes 6 → 8!", "4.º Obstáculo: 1 nombre con 2 cetasikas reales (Uddhacca + Kukkucca)."),
  mkAk("sam:akm:17", "AS VII.8, 14", "AkM-17", "nivarana", 5, "vicikiccha",
    "Vicikicchā-nīvaraṇa", "Obstáculo 5 · Dúvida Cética (Vicikicchā)", "Hindrance 5 · Sceptical Doubt (Vicikicchā)", "Obstáculo 5 · Duda Escéptica (Vicikicchā)",
    "5.º Obstáculo: corresponde 1:1 ao cetasika Vicikicchā.", "5th Hindrance: maps 1:1 to Vicikicchā.", "5.º Obstáculo: corresponde 1:1 a Vicikicchā."),
  mkAk("sam:akm:18", "AS VII.8, 14", "AkM-18", "nivarana", 6, "moha",
    "Avijjā-nīvaraṇa", "Obstáculo 6 · Ignorância (Avijjā)", "Hindrance 6 · Ignorance (Avijjā)", "Obstáculo 6 · Ignorancia (Avijjā)",
    "6.º Obstáculo (listado no Abhidhamma além dos 5 clássicos): corresponde a Moha.", "6th Hindrance (added in Abhidhamma to the classic 5): corresponds to Moha.", "6.º Obstáculo (añadido en Abhidhamma): corresponde a Moha."),

  // 7 Anusaya (7 → 6 reais)
  mkAk("sam:akm:19", "AS VII.9, 14", "AkM-19", "anusaya", 1, "lobha",
    "Kāmarāgānusaya", "Tendência 1 · Desejo Sensual Latente", "Latent Tendency 1 · Sensual Lust", "Tendencia 1 · Deseo Sensual Latente",
    "1.ª Tendência latente: reduz-se a Lobha (junto com Bhavarāga → 7 viram 6 reais).", "1st Latent Tendency: reduces to Lobha (merges with Bhavarāga → 7 become 6 real).", "1.ª Tendencia latente: se reduce a Lobha."),
  mkAk("sam:akm:20", "AS VII.9, 14", "AkM-20", "anusaya", 2, "lobha",
    "Bhavarāgānusaya", "Tendência 2 · Apego à Existência Latente", "Latent Tendency 2 · Attachment to Existence", "Tendencia 2 · Apego a la Existencia Latente",
    "2.ª Tendência latente: também é Lobha (apego à existência Rūpa/Arūpa).", "2nd Latent Tendency: also Lobha (craving for fine-material/immaterial existence).", "2.ª Tendencia latente: también es Lobha."),
  mkAk("sam:akm:21", "AS VII.9, 14", "AkM-21", "anusaya", 3, "dosa",
    "Paṭighānusaya", "Tendência 3 · Aversão Latente (Paṭigha)", "Latent Tendency 3 · Aversion (Paṭigha)", "Tendencia 3 · Aversión Latente (Paṭigha)",
    "3.ª Tendência latente: corresponde a Dosa (erradicada por Anāgāmīmagga).", "3rd Latent Tendency: corresponds to Dosa (eradicated by Non-Returner Path).", "3.ª Tendencia latente: corresponde a Dosa."),
  mkAk("sam:akm:22", "AS VII.9, 14", "AkM-22", "anusaya", 4, "mana",
    "Mānānusaya", "Tendência 4 · Presunção / Orgulho Latente", "Latent Tendency 4 · Conceit (Māna)", "Tendencia 4 · Presunción Latente (Māna)",
    "4.ª Tendência latente: corresponde a Māna (erradicada apenas por Arahattamagga).", "4th Latent Tendency: corresponds to Māna (eradicated only at Arahantship).", "4.ª Tendencia latente: corresponde a Māna."),
  mkAk("sam:akm:23", "AS VII.9, 14", "AkM-23", "anusaya", 5, "ditthi",
    "Diṭṭhānusaya", "Tendência 5 · Visão Errônea Latente", "Latent Tendency 5 · Wrong View (Diṭṭhi)", "Tendencia 5 · Visión Errónea Latente",
    "5.ª Tendência latente: corresponde a Diṭṭhi (erradicada por Sotāpattimagga).", "5th Latent Tendency: corresponds to Diṭṭhi (eradicated at Stream-Entry).", "5.ª Tendencia latente: corresponde a Diṭṭhi."),
  mkAk("sam:akm:24", "AS VII.9, 14", "AkM-24", "anusaya", 6, "vicikiccha",
    "Vicikicchānusaya", "Tendência 6 · Dúvida Latente (Vicikicchā)", "Latent Tendency 6 · Doubt (Vicikicchā)", "Tendencia 6 · Duda Latente (Vicikicchā)",
    "6.ª Tendência latente: corresponde a Vicikicchā (erradicada por Sotāpattimagga).", "6th Latent Tendency: corresponds to Vicikicchā (eradicated at Stream-Entry).", "6.ª Tendencia latente: corresponde a Vicikicchā."),
  mkAk("sam:akm:25", "AS VII.9, 14", "AkM-25", "anusaya", 7, "moha",
    "Avijjānusaya", "Tendência 7 · Ignorância Latente (Avijjā)", "Latent Tendency 7 · Ignorance (Avijjā)", "Tendencia 7 · Ignorancia Latente (Avijjā)",
    "7.ª Tendência latente: corresponde a Moha (fecha 7 Anusayas → 6 reais).", "7th Latent Tendency: corresponds to Moha (completes 7 Anusayas → 6 real).", "7.ª Tendencia latente: corresponde a Moha (7 → 6 reales)."),

  // Delta Saṃyojana Suttanta vs. Abhidhamma (6 itens distintivos)
  mkAk("sam:akm:26", "AS VII.10", "AkM-26", "samyojana_delta", 1, "lobha",
    "Rūparāga-saṃyojana (Suttanta)", "Grilhão Suttanta · Apego à Esfera Rūpa", "Suttanta Fetter · Lust for Fine-Materiality", "Grillete Suttanta · Apego a la Esfera Rūpa",
    "Exclusivo da lista Suttanta (AS VII.10); reduz-se a Lobha (no Abhidhamma funde-se em Bhavarāga).", "Exclusive to Suttanta list (AS VII.10); reduces to Lobha (merged into Bhavarāga in Abhidhamma).", "Exclusivo de Suttanta (AS VII.10); se reduce a Lobha."),
  mkAk("sam:akm:27", "AS VII.10", "AkM-27", "samyojana_delta", 2, "lobha",
    "Arūparāga-saṃyojana (Suttanta)", "Grilhão Suttanta · Apego à Esfera Arūpa", "Suttanta Fetter · Lust for Immateriality", "Grillete Suttanta · Apego a la Esfera Arūpa",
    "Exclusivo da lista Suttanta (AS VII.10); reduz-se a Lobha (no Abhidhamma funde-se em Bhavarāga).", "Exclusive to Suttanta list (AS VII.10); reduces to Lobha (merged into Bhavarāga in Abhidhamma).", "Exclusivo de Suttanta (AS VII.10); se reduce a Lobha."),
  mkAk("sam:akm:28", "AS VII.10, 14", "AkM-28", "samyojana_delta", 3, "uddhacca",
    "Uddhacca-saṃyojana (Suttanta)", "Grilhão Suttanta · Agitação (Uddhacca)", "Suttanta Fetter · Restlessness (Uddhacca)", "Grillete Suttanta · Inquietud (Uddhacca)",
    "Presente apenas na lista Suttanta; somado aos 8 reais do Abhidhamma gera a união de 9 reais (AS VII.14)!", "Present only in Suttanta list; added to Abhidhamma's 8 real fetters yields the union of 9 (AS VII.14)!", "Solo en Suttanta; sumado a los 8 del Abhidhamma da la unión de 9 reales."),
  mkAk("sam:akm:29", "AS VII.11", "AkM-29", "samyojana_delta", 4, "lobha",
    "Bhavarāga-saṃyojana (Abhidhamma)", "Grilhão Abhidhamma · Apego à Existência", "Abhidhamma Fetter · Lust for Existence", "Grillete Abhidhamma · Apego a la Existencia",
    "Na lista Abhidhamma (AS VII.11), substitui Rūparāga + Arūparāga; reduz-se a Lobha.", "In Abhidhamma list (AS VII.11), replaces Rūparāga + Arūparāga; reduces to Lobha.", "En Abhidhamma (AS VII.11) sustituye Rūparāga + Arūparāga; es Lobha."),
  mkAk("sam:akm:30", "AS VII.11, 14", "AkM-30", "samyojana_delta", 5, "issa",
    "Issā-saṃyojana (Abhidhamma)", "Grilhão Abhidhamma · Inveja (Issā)", "Abhidhamma Fetter · Envy (Issā)", "Grillete Abhidhamma · Envidia (Issā)",
    "Exclusivo da lista Abhidhamma (AS VII.11): cetasika distinto (erradicado por Sotāpattimagga).", "Exclusive to Abhidhamma list (AS VII.11): distinct cetasika (eradicated at Stream-Entry).", "Exclusivo de Abhidhamma (AS VII.11): cetasika distinto."),
  mkAk("sam:akm:31", "AS VII.11, 14", "AkM-31", "samyojana_delta", 6, "macchariya",
    "Macchariya-saṃyojana (Abhidhamma)", "Grilhão Abhidhamma · Avareza (Macchariya)", "Abhidhamma Fetter · Stinginess (Macchariya)", "Grillete Abhidhamma · Avaricia (Macchariya)",
    "Exclusivo da lista Abhidhamma (AS VII.11): cetasika distinto (erradicado por Sotāpattimagga).", "Exclusive to Abhidhamma list (AS VII.11): distinct cetasika (eradicated at Stream-Entry).", "Exclusivo de Abhidhamma (AS VII.11): cetasika distinto."),

  // 3 Kilesas que não estão nos Saṃyojanas (AS VII.12)
  mkAk("sam:akm:32", "AS VII.12, 14", "AkM-32", "kilesa_extra", 1, "thina",
    "Thīna-kilesa (#7 dos 10 Kilesas)", "Impureza 7 · Preguiça Mental (Thīna)", "Defilement 7 · Sloth (Thīna)", "Impureza 7 · Pereza Mental (Thīna)",
    "AS VII.12: Entre os 10 Kilesas (10→10), Thīna entra isoladamente (sem Middha!).", "AS VII.12: Among the 10 Kilesas (10→10), Sloth enters without Torpor!", "AS VII.12: En los 10 Kilesas, Thīna entra sin Middha."),
  mkAk("sam:akm:33", "AS VII.12, 14", "AkM-33", "kilesa_extra", 2, "ahirika",
    "Ahirika-kilesa (#9 dos 10 Kilesas)", "Impureza 9 · Impudência Moral (Ahirika)", "Defilement 9 · Shamelessness (Ahirika)", "Impureza 9 · Desvergüenza Moral (Ahirika)",
    "AS VII.12: 9.º dos 10 Kilesas (universal insalubre do Moha-catukka).", "AS VII.12: 9th of 10 Defilements (universal unwholesome factor of Moha-catukka).", "AS VII.12: 9.º de los 10 Kilesas (Moha-catukka)."),
  mkAk("sam:akm:34", "AS VII.12, 14", "AkM-34", "kilesa_extra", 3, "anottappa",
    "Anottappa-kilesa (#10 dos 10 Kilesas)", "Impureza 10 · Temeridade Moral (Anottappa)", "Defilement 10 · Fearlessness of Wrong (Anottappa)", "Impureza 10 · Temeridad Moral (Anottappa)",
    "AS VII.12: 10.º e último Kilesa (correspondência exata 10 → 10 vatthuto).", "AS VII.12: 10th & last Defilement (exact 10 → 10 vatthuto correspondence).", "AS VII.12: 10.º y último Kilesa (10 → 10 vatthuto)."),

  // ══════════════════════════════════════════════════════════════════════════
  // 2. MISSAKA-SAṄGAHA GRANULAR (51 ITENS — AS VII.15–29)
  // ══════════════════════════════════════════════════════════════════════════
  // 22 Indriyas (AS VII.18, 22–25, 29 → 16 reais)
  mkMi("sam:mim:i1", "AS VII.18", "Ind-01", "indriya22", 1, "pasada_5", "1. Cakkhundriya", "Faculdade 1 · Olho (Cakkhundriya)", "Faculty 1 · Eye (Cakkhundriya)", "Facultad 1 · Ojo (Cakkhundriya)", "1.º dos 5 Pasāda-rūpas (1 dhamma real).", "1st of 5 sense-sensitivities (1 real dhamma).", "1.º de 5 Pasāda-rūpas."),
  mkMi("sam:mim:i2", "AS VII.18", "Ind-02", "indriya22", 2, "pasada_5", "2. Sotindriya", "Faculdade 2 · Ouvido (Sotindriya)", "Faculty 2 · Ear (Sotindriya)", "Facultad 2 · Oído (Sotindriya)", "2.º dos 5 Pasāda-rūpas.", "2nd of 5 sense-sensitivities.", "2.º de 5 Pasāda-rūpas."),
  mkMi("sam:mim:i3", "AS VII.18", "Ind-03", "indriya22", 3, "pasada_5", "3. Ghānindriya", "Faculdade 3 · Nariz (Ghānindriya)", "Faculty 3 · Nose (Ghānindriya)", "Facultad 3 · Nariz (Ghānindriya)", "3.º dos 5 Pasāda-rūpas.", "3rd of 5 sense-sensitivities.", "3.º de 5 Pasāda-rūpas."),
  mkMi("sam:mim:i4", "AS VII.18", "Ind-04", "indriya22", 4, "pasada_5", "4. Jivhindriya", "Faculdade 4 · Língua (Jivhindriya)", "Faculty 4 · Tongue (Jivhindriya)", "Facultad 4 · Lengua (Jivhindriya)", "4.º dos 5 Pasāda-rūpas.", "4th of 5 sense-sensitivities.", "4.º de 5 Pasāda-rūpas."),
  mkMi("sam:mim:i5", "AS VII.18", "Ind-05", "indriya22", 5, "pasada_5", "5. Kāyindriya", "Faculdade 5 · Corpo (Kāyindriya)", "Faculty 5 · Body (Kāyindriya)", "Facultad 5 · Cuerpo (Kāyindriya)", "5.º dos 5 Pasāda-rūpas.", "5th of 5 sense-sensitivities.", "5.º de 5 Pasāda-rūpas."),
  mkMi("sam:mim:i6", "AS VII.18", "Ind-06", "indriya22", 6, "bhava_2", "6. Itthindriya", "Faculdade 6 · Feminilidade (Itthindriya)", "Faculty 6 · Femininity (Itthindriya)", "Facultad 6 · Feminidad (Itthindriya)", "1.ª das 2 faculdades sexuais (Bhāvarūpa).", "1st of 2 sex faculties (Bhāvarūpa).", "1.ª de 2 facultades sexuales."),
  mkMi("sam:mim:i7", "AS VII.18", "Ind-07", "indriya22", 7, "bhava_2", "7. Purisindriya", "Faculdade 7 · Masculinidade (Purisindriya)", "Faculty 7 · Masculinity (Purisindriya)", "Facultad 7 · Masculinidad (Purisindriya)", "2.ª das 2 faculdades sexuais (Bhāvarūpa).", "2nd of 2 sex faculties (Bhāvarūpa).", "2.ª de 2 facultades sexuales."),
  mkMi("sam:mim:i8", "AS VII.18, 25", "Ind-08", "indriya22", 8, "jivita_2", "8. Jīvitindriya (Rūpa + Nāma = 2 Reais)", "Faculdade 8 · Vida (Desdobra em 2 Reais)", "Faculty 8 · Life (Splits into 2 Real)", "Facultad 8 · Vida (Se Desdobla en 2 Reales)", "AS VII.25: 1 nome que conta como +2 dhammas reais (Rūpa-jīvitindriya + Nāma-jīvitindriya)!", "AS VII.25: 1 name counting as 2 real dhammas (Material + Mental Life Faculty)!", "AS VII.25: 1 nombre que vale 2 dhammas reales (Rūpa + Nāma)."),
  mkMi("sam:mim:i9", "AS VII.18", "Ind-09", "indriya22", 9, "citta_1", "9. Manindriya", "Faculdade 9 · Mente (Manindriya = Citta)", "Faculty 9 · Mind (Manindriya = Citta)", "Facultad 9 · Mente (Manindriya = Citta)", "Corresponde ao Paramattha Citta (1 realidade).", "Corresponds to Citta Paramattha (1 reality).", "Corresponde al Paramattha Citta."),
  mkMi("sam:mim:i10", "AS VII.18, 29", "Ind-10", "indriya22", 10, "vedana_5", "10. Sukhindriya", "Faculdade 10 · Prazer Corporal (→ Vedanā)", "Faculty 10 · Bodily Pleasure (→ Vedanā)", "Facultad 10 · Placer Corporal (→ Vedanā)", "1.ª das 5 faculdades de sensação (colapsam em 1 cetasika Vedanā: −4).", "1st of 5 feeling faculties (collapse into 1 Vedanā cetasika: −4).", "1.ª de 5 sensaciones (colapsan en 1 Vedanā)."),
  mkMi("sam:mim:i11", "AS VII.18, 29", "Ind-11", "indriya22", 11, "vedana_5", "11. Dukkhindriya", "Faculdade 11 · Dor Corporal (→ Vedanā)", "Faculty 11 · Bodily Pain (→ Vedanā)", "Facultad 11 · Dolor Corporal (→ Vedanā)", "2.ª das 5 faculdades de sensação (→ 1 Vedanā).", "2nd of 5 feeling faculties (→ 1 Vedanā).", "2.ª de 5 sensaciones (→ 1 Vedanā)."),
  mkMi("sam:mim:i12", "AS VII.18, 29", "Ind-12", "indriya22", 12, "vedana_5", "12. Somanassindriya", "Faculdade 12 · Alegria Mental (→ Vedanā)", "Faculty 12 · Mental Joy (→ Vedanā)", "Facultad 12 · Alegría Mental (→ Vedanā)", "3.ª das 5 faculdades de sensação (→ 1 Vedanā).", "3rd of 5 feeling faculties (→ 1 Vedanā).", "3.ª de 5 sensaciones (→ 1 Vedanā)."),
  mkMi("sam:mim:i13", "AS VII.18, 29", "Ind-13", "indriya22", 13, "vedana_5", "13. Domanassindriya", "Faculdade 13 · Aflição Mental (→ Vedanā)", "Faculty 13 · Mental Displeasure (→ Vedanā)", "Facultad 13 · Aflicción Mental (→ Vedanā)", "4.ª das 5 faculdades de sensação (→ 1 Vedanā).", "4th of 5 feeling faculties (→ 1 Vedanā).", "4.ª de 5 sensaciones (→ 1 Vedanā)."),
  mkMi("sam:mim:i14", "AS VII.18, 29", "Ind-14", "indriya22", 14, "vedana_5", "14. Upekkhindriya", "Faculdade 14 · Equanimidade Neutra (→ Vedanā)", "Faculty 14 · Neutral Equanimity (→ Vedanā)", "Facultad 14 · Ecuanimidad Neutra (→ Vedanā)", "5.ª das 5 faculdades de sensação (5 → 1 Vedanā).", "5th of 5 feeling faculties (5 → 1 Vedanā).", "5.ª de 5 sensaciones (5 → 1 Vedanā)."),
  mkMi("sam:mim:i15", "AS VII.18", "Ind-15", "indriya22", 15, "sobhana_5", "15. Saddhindriya", "Faculdade 15 · Fé / Confiança (Saddhā)", "Faculty 15 · Faith (Saddhā)", "Facultad 15 · Fe / Confianza (Saddhā)", "1.ª das 5 faculdades espirituais (Saddhā).", "1st of 5 spiritual faculties (Saddhā).", "1.ª de 5 facultades espirituales."),
  mkMi("sam:mim:i16", "AS VII.18", "Ind-16", "indriya22", 16, "sobhana_5", "16. Vīriyindriya", "Faculdade 16 · Energia (Vīriya)", "Faculty 16 · Energy (Vīriya)", "Facultad 16 · Energía (Vīriya)", "2.ª das 5 faculdades espirituais (Vīriya).", "2nd of 5 spiritual faculties (Vīriya).", "2.ª de 5 facultades espirituales."),
  mkMi("sam:mim:i17", "AS VII.18", "Ind-17", "indriya22", 17, "sobhana_5", "17. Satindriya", "Faculdade 17 · Atenção Plena (Sati)", "Faculty 17 · Mindfulness (Sati)", "Facultad 17 · Atención Plena (Sati)", "3.ª das 5 faculdades espirituais (Sati).", "3rd of 5 spiritual faculties (Sati).", "3.ª de 5 facultades espirituales."),
  mkMi("sam:mim:i18", "AS VII.18", "Ind-18", "indriya22", 18, "sobhana_5", "18. Samādhindriya", "Faculdade 18 · Concentração (Ekaggatā)", "Faculty 18 · Concentration (Ekaggatā)", "Facultad 18 · Concentración (Ekaggatā)", "4.ª das 5 faculdades espirituais (Ekaggatā; ausente como Indriya em #11 Vicikicchā!).", "4th of 5 spiritual faculties (Ekaggatā; not a faculty in #11 Doubt!).", "4.ª de 5 facultades espirituales (Ekaggatā)."),
  mkMi("sam:mim:i19", "AS VII.18", "Ind-19", "indriya22", 19, "sobhana_5", "19. Paññindriya", "Faculdade 19 · Sabedoria (Paññā)", "Faculty 19 · Wisdom (Paññā)", "Facultad 19 · Sabiduría (Paññā)", "5.ª das 5 faculdades espirituais (absorve as 3 supramundanas #20–#22).", "5th of 5 spiritual faculties (absorbs the 3 supramundane ones #20–#22).", "5.ª de 5 facultades espirituales (absorbe #20–#22)."),
  mkMi("sam:mim:i20", "AS VII.18, 22", "Ind-20", "indriya22", 20, "lokuttara_panna_3", "20. Anaññātaññassāmītindriya", "Faculdade 20 · 'Conhecerei o Desconhecido' (Sotāpattimagga)", "Faculty 20 · 'I Shall Know the Unknown' (Sotāpattimagga)", "Facultad 20 · 'Conoceré lo Desconocido' (Sotāpattimagga)", "AS VII.22: Paññā exclusivamente em Sotāpattimagga (1.ª das 3 supramundanas → Paññā).", "AS VII.22: Wisdom exclusively in Stream-Entry Path (1st of 3 supramundane → Paññā).", "AS VII.22: Paññā exclusivamente en Sotāpattimagga."),
  mkMi("sam:mim:i21", "AS VII.18, 23", "Ind-21", "indriya22", 21, "lokuttara_panna_3", "21. Aññindriya", "Faculdade 21 · Conhecimento Final (6 Lokuttaras Médias)", "Faculty 21 · Final Knowledge (6 Intermediate Lokuttaras)", "Facultad 21 · Conocimiento Final (6 Lokuttaras Medias)", "AS VII.23: Paññā nas 6 Cittas intermediárias (Sotāpattiphala até Arahattamagga) → Paññā.", "AS VII.23: Wisdom in the 6 middle supramundane Cittas (Stream-Entry Fruit to Arahant Path) → Paññā.", "AS VII.23: Paññā en las 6 Lokuttaras intermedias."),
  mkMi("sam:mim:i22", "AS VII.18, 24", "Ind-22", "indriya22", 22, "lokuttara_panna_3", "22. Aññātāvindriya", "Faculdade 22 · De Quem Conheceu (Arahattaphala)", "Faculty 22 · One Who Has Final Knowledge (Arahattaphala)", "Facultad 22 · De Quien Conoció (Arahattaphala)", "AS VII.24: Paññā exclusivamente em Arahattaphala → fecha 22 − 4 − 3 + 1 = 16 reais!", "AS VII.24: Wisdom exclusively in Arahantship Fruit → completes 22 − 4 − 3 + 1 = 16 real!", "AS VII.24: Paññā exclusivamente en Arahattaphala → 16 reales."),

  // 12 Maggaṅgas (8 Nobres + 4 Errôneos → 9 reais: 3 pares colapsam!)
  mkMi("sam:mim:m1", "AS VII.17", "Mag-01", "magganga12", 1, "panna", "1. Sammādiṭṭhi", "Caminho 1 · Visão Correta (→ Paññā)", "Path 1 · Right View (→ Paññā)", "Sendero 1 · Visión Recta (→ Paññā)", "1.º dos 8 fatores nobres: cetasika Paññā.", "1st of 8 noble factors: Paññā cetasika.", "1.er factor noble: Paññā."),
  mkMi("sam:mim:m2", "AS VII.17, 29", "Mag-02", "magganga12", 2, "vitakka", "2. Sammāsaṅkappa", "Caminho 2 · Pensamento Correto (→ Vitakka)", "Path 2 · Right Thought (→ Vitakka)", "Sendero 2 · Pensamiento Recto (→ Vitakka)", "Em substância é Vitakka (compartilhado com Micchāsaṅkappa!).", "In substance it is Vitakka (shared with Micchāsaṅkappa!).", "En sustancia es Vitakka (compartido con Micchāsaṅkappa)."),
  mkMi("sam:mim:m3", "AS VII.17", "Mag-03", "magganga12", 3, "virati_3", "3. Sammāvācā", "Caminho 3 · Fala Correta (→ Virati 1)", "Path 3 · Right Speech (→ Virati 1)", "Sendero 3 · Habla Recta (→ Virati 1)", "1.ª das 3 Viratis (abstenções éticas).", "1st of 3 Abstinences (Virati).", "1.ª de 3 Viratis."),
  mkMi("sam:mim:m4", "AS VII.17", "Mag-04", "magganga12", 4, "virati_3", "4. Sammākammanta", "Caminho 4 · Ação Correta (→ Virati 2)", "Path 4 · Right Action (→ Virati 2)", "Sendero 4 · Acción Recta (→ Virati 2)", "2.ª das 3 Viratis.", "2nd of 3 Abstinences.", "2.ª de 3 Viratis."),
  mkMi("sam:mim:m5", "AS VII.17", "Mag-05", "magganga12", 5, "virati_3", "5. Sammā-ājīva", "Caminho 5 · Modo de Vida Correto (→ Virati 3)", "Path 5 · Right Livelihood (→ Virati 3)", "Sendero 5 · Sustento Recto (→ Virati 3)", "3.ª das 3 Viratis.", "3rd of 3 Abstinences.", "3.ª de 3 Viratis."),
  mkMi("sam:mim:m6", "AS VII.17, 29", "Mag-06", "magganga12", 6, "viriya", "6. Sammāvāyāma", "Caminho 6 · Esforço Correto (→ Vīriya)", "Path 6 · Right Effort (→ Vīriya)", "Sendero 6 · Esfuerzo Recto (→ Vīriya)", "Em substância é Vīriya (compartilhado com Micchāvāyāma!).", "In substance it is Vīriya (shared with Micchāvāyāma!).", "En sustancia es Vīriya (compartido con Micchāvāyāma)."),
  mkMi("sam:mim:m7", "AS VII.17", "Mag-07", "magganga12", 7, "sati", "7. Sammāsati", "Caminho 7 · Atenção Plena Correta (→ Sati)", "Path 7 · Right Mindfulness (→ Sati)", "Sendero 7 · Atención Plena Recta (→ Sati)", "Cetasika Sati.", "Sati cetasika.", "Cetasika Sati."),
  mkMi("sam:mim:m8", "AS VII.17, 29", "Mag-08", "magganga12", 8, "ekaggata", "8. Sammāsamādhi", "Caminho 8 · Concentração Correta (→ Ekaggatā)", "Path 8 · Right Concentration (→ Ekaggatā)", "Sendero 8 · Concentración Recta (→ Ekaggatā)", "Em substância é Ekaggatā (compartilhado com Micchāsamādhi!).", "In substance it is Ekaggatā (shared with Micchāsamādhi!).", "En sustancia es Ekaggatā (compartido con Micchāsamādhi)."),
  mkMi("sam:mim:m9", "AS VII.17", "Mag-09", "magganga12", 9, "ditthi", "9. Micchādiṭṭhi", "Caminho Errado 1 · Visão Errônea (→ Diṭṭhi)", "Wrong Path 1 · Wrong View (→ Diṭṭhi)", "Sendero Erróneo 1 · Visión Errónea (→ Diṭṭhi)", "Único dos 4 fatores errôneos que acrescenta 1 cetasika novo (Diṭṭhi → 8+1 = 9 reais!).", "Sole wrong path factor adding a new cetasika (Diṭṭhi → 8+1 = 9 real!).", "Único factor erróneo que añade 1 cetasika nuevo (Diṭṭhi → 9 reales)."),
  mkMi("sam:mim:m10", "AS VII.17, 29", "Mag-10", "magganga12", 10, "vitakka", "10. Micchāsaṅkappa", "Caminho Errado 2 · Pensamento Errôneo (→ Vitakka)", "Wrong Path 2 · Wrong Thought (→ Vitakka)", "Sendero Erróneo 2 · Pensamiento Erróneo (→ Vitakka)", "Colapsa no mesmo cetasika Vitakka que Sammāsaṅkappa (−1).", "Collapses into the same Vitakka cetasika as Right Thought (−1).", "Colapsa en el mismo Vitakka que Sammāsaṅkappa."),
  mkMi("sam:mim:m11", "AS VII.17, 29", "Mag-11", "magganga12", 11, "viriya", "11. Micchāvāyāma", "Caminho Errado 3 · Esforço Errôneo (→ Vīriya)", "Wrong Path 3 · Wrong Effort (→ Vīriya)", "Sendero Erróneo 3 · Esfuerzo Erróneo (→ Vīriya)", "Colapsa no mesmo cetasika Vīriya que Sammāvāyāma (−1).", "Collapses into the same Vīriya cetasika as Right Effort (−1).", "Colapsa en el mismo Vīriya que Sammāvāyāma."),
  mkMi("sam:mim:m12", "AS VII.17, 29", "Mag-12", "magganga12", 12, "ekaggata", "12. Micchāsamādhi", "Caminho Errado 4 · Concentração Errônea (→ Ekaggatā)", "Wrong Path 4 · Wrong Concentration (→ Ekaggatā)", "Sendero Erróneo 4 · Concentración Errónea (→ Ekaggatā)", "Colapsa no mesmo Ekaggatā que Sammāsamādhi (−1 → 12 − 3 = 9 reais!).", "Collapses into the same Ekaggatā as Right Concentration (−1 → 12 − 3 = 9 real!).", "Colapsa en el mismo Ekaggatā → 12 − 3 = 9 reales."),

  // 4 Balas exclusivos do Missaka além dos 5 espirituais (AS VII.19)
  mkMi("sam:mim:b1", "AS VII.19", "Bal-06", "bala_extra", 1, "hiri_ottappa", "6. Hiribala", "Poder 6 · Vergonha Moral (Hiri)", "Power 6 · Moral Shame (Hiri)", "Poder 6 · Vergüenza Moral (Hiri)", "6.º dos 9 Balas (par salubre com Ottappa).", "6th of 9 Powers (wholesome pair with Ottappa).", "6.º de 9 Poderes (par hábil con Ottappa)."),
  mkMi("sam:mim:b2", "AS VII.19", "Bal-07", "bala_extra", 2, "hiri_ottappa", "7. Ottappabala", "Poder 7 · Temor Moral (Ottappa)", "Power 7 · Moral Dread (Ottappa)", "Poder 7 · Temor Moral (Ottappa)", "7.º dos 9 Balas (par salubre com Hiri).", "7th of 9 Powers (wholesome pair with Hiri).", "7.º de 9 Poderes (par hábil con Hiri)."),
  mkMi("sam:mim:b3", "AS VII.19", "Bal-08", "bala_extra", 3, "ahirika_anottappa", "8. Ahirikabala", "Poder 8 · Impudência (Ahirika)", "Power 8 · Shamelessness (Ahirika)", "Poder 8 · Desvergüenza (Ahirika)", "8.º dos 9 Balas (par insalubre com Anottappa — prova por que Bala está no Missaka/Misto!).", "8th of 9 Powers (unwholesome pair with Anottappa — proves why Bala is Mixed/Missaka!).", "8.º de 9 Poderes (par inhábil con Anottappa)."),
  mkMi("sam:mim:b4", "AS VII.19", "Bal-09", "bala_extra", 4, "ahirika_anottappa", "9. Anottappabala", "Poder 9 · Temeridade (Anottappa)", "Power 9 · Recklessness (Anottappa)", "Poder 9 · Temeridad (Anottappa)", "9.º e último Bala (9 → 9 vatthuto).", "9th & last Power (9 → 9 vatthuto).", "9.º y último Poder (9 → 9 vatthuto)."),

  // 4 Adhipatis (AS VII.20, 28)
  mkMi("sam:mim:d1", "AS VII.20", "Adh-01", "adhipati4", 1, "chanda", "1. Chandādhipati", "Predominância 1 · Zelo / Vontade (Chanda)", "Predominance 1 · Desire to Act (Chanda)", "Predominancia 1 · Celo / Voluntad (Chanda)", "1.º dos 4 Adhipatis (apenas 1 predomina por Javana Dvi/Tihetuka).", "1st of 4 Predominances (only 1 predominates per 2/3-root Javana).", "1.º de 4 Adhipatis."),
  mkMi("sam:mim:d2", "AS VII.20", "Adh-02", "adhipati4", 2, "viriya", "2. Vīriyādhipati", "Predominância 2 · Energia (Vīriya)", "Predominance 2 · Energy (Vīriya)", "Predominancia 2 · Energía (Vīriya)", "2.º dos 4 Adhipatis.", "2nd of 4 Predominances.", "2.º de 4 Adhipatis."),
  mkMi("sam:mim:d3", "AS VII.20", "Adh-03", "adhipati4", 3, "citta_1", "3. Cittādhipati", "Predominância 3 · Consciência (Citta)", "Predominance 3 · Consciousness (Citta)", "Predominancia 3 · Conciencia (Citta)", "3.º dos 4 Adhipatis (único Citta entre os 4).", "3rd of 4 Predominances (sole Citta among the 4).", "3.º de 4 Adhipatis (única Citta)."),
  mkMi("sam:mim:d4", "AS VII.20", "Adh-04", "adhipati4", 4, "panna", "4. Vīmaṃsādhipati", "Predominância 4 · Investigação (Paññā)", "Predominance 4 · Investigation (Paññā)", "Predominancia 4 · Investigación (Paññā)", "4.º dos 4 Adhipatis (apenas em Javanas Tihetuka com Paññā!).", "4th of 4 Predominances (only in Tihetuka Javanas with Paññā!).", "4.º de 4 Adhipatis (solo en Javanas Tihetuka)."),

  // 4 Āhāras (AS VII.21)
  mkMi("sam:mim:h1", "AS VII.21", "Aha-01", "ahara4", 1, "oja_rupa", "1. Kabaḷīkārāhāra", "Alimento 1 · Comida Material (Ojā)", "Nutriment 1 · Edible Food (Ojā)", "Alimento 1 · Alimento Material (Ojā)", "1.º dos 4 Āhāras (único Rūpa; sustenta a matéria corporal).", "1st of 4 Nutriments (sole Rūpa; sustains physical body).", "1.er Āhāra (único Rūpa)."),
  mkMi("sam:mim:h2", "AS VII.21", "Aha-02", "ahara4", 2, "phassa", "2. Phassāhāra", "Alimento 2 · Contato (Phassa)", "Nutriment 2 · Contact (Phassa)", "Alimento 2 · Contacto (Phassa)", "2.º Āhāra (nutre Vedanā).", "2nd Nutriment (nourishes Vedanā).", "2.º Āhāra (nutre Vedanā)."),
  mkMi("sam:mim:h3", "AS VII.21", "Aha-03", "ahara4", 3, "cetana", "3. Manosañcetanāhāra", "Alimento 3 · Volição Mental (Cetanā)", "Nutriment 3 · Mental Volition (Cetanā)", "Alimento 3 · Volición Mental (Cetanā)", "3.º Āhāra (nutre renascimento nos 3 planos).", "3rd Nutriment (nourishes rebirth across 3 realms).", "3.er Āhāra (nutre el renacimiento)."),
  mkMi("sam:mim:h4", "AS VII.21", "Aha-04", "ahara4", 4, "citta_1", "4. Viññāṇāhāra", "Alimento 4 · Consciência (Viññāṇa)", "Nutriment 4 · Consciousness (Viññāṇa)", "Alimento 4 · Conciencia (Viññāṇa)", "4.º Āhāra (nutre Nāmarūpa em Paṭisandhi).", "4th Nutriment (nourishes Nāmarūpa at rebirth).", "4.º Āhāra (nutre Nāmarūpa)."),

  // 5 Leis Individuais de Exclusão do Missaka (AS VII.26–28)
  mkMi("sam:mim:l1", "AS VII.26", "ExM-01", "excl_laws5", 1, "no_jhananga_10", "Dvipañcaviññāṇesu Jhānaṅgāni na labbhanti", "Exclusão 1 · Sem Jhānaṅga nos 10 Sentidos", "Exclusion 1 · No Jhāna Factors in 10 Sense-Cittas", "Exclusión 1 · Sin Jhānaṅga en 10 Sentidos", "AS VII.26: Nos 10 Dvipañcaviññāṇas não há fatores de Jhāna (fracos demais para absorver o objeto).", "AS VII.26: No Jhāna factors occur in the 10 sense-consciousnesses.", "AS VII.26: Sin factores de Jhāna en los 10 sentidos."),
  mkMi("sam:mim:l2", "AS VII.26", "ExM-02", "excl_laws5", 2, "no_bala_16", "Avīriyacittesu Balāni na labbhanti", "Exclusão 2 · Sem Poderes (Bala) nas 16 Avīriya", "Exclusion 2 · No Powers (Bala) in 16 Energy-Free Cittas", "Exclusión 2 · Sin Poderes en 16 Avīriya", "AS VII.26: Nas 16 Cittas sem Vīriya não há Poderes (Bala).", "AS VII.26: In the 16 energy-free Cittas no Powers (Bala) arise.", "AS VII.26: Sin Poderes en las 16 Cittas sin Vīriya."),
  mkMi("sam:mim:l3", "AS VII.26", "ExM-03", "excl_laws5", 3, "no_magga_18", "Ahetukesu Maggaṅgāni na labbhanti", "Exclusão 3 · Sem Maggaṅga nas 18 Ahetukas", "Exclusion 3 · No Path Factors in 18 Rootless Cittas", "Exclusión 3 · Sin Maggaṅga en 18 Ahetukas", "AS VII.26: Nas 18 Cittas sem raízes (Ahetuka) não há fatores do caminho (Maggaṅga).", "AS VII.26: In the 18 rootless Cittas no Path factors occur.", "AS VII.26: Sin factores del camino en las 18 Ahetukas."),
  mkMi("sam:mim:l4", "AS VII.27", "ExM-04", "excl_laws5", 4, "doubt_ekaggata", "Vicikicchācitte Ekaggatā na Magga/Indriya/Bala", "Exclusão 4 · Ekaggatā em #11 Vicikicchā", "Exclusion 4 · Ekaggatā in #11 Doubt-Citta", "Exclusión 4 · Ekaggatā en #11 Vicikicchā", "AS VII.27: Na consciência de Dúvida (#11), Ekaggatā é tão fraca que não alcança status de Magga, Indriya nem Bala!", "AS VII.27: In Doubt-Citta (#11), one-pointedness never attains Path, Faculty, or Power status!", "AS VII.27: En #11 Vicikicchā, Ekaggatā no alcanza nivel de Magga, Indriya ni Bala."),
  mkMi("sam:mim:l5", "AS VII.28", "ExM-05", "excl_laws5", 5, "one_adhipati", "Dvi/Tihetuka-javanesu Ekova Adhipati", "Exclusão 5 · Apenas 1 Adhipati por Javana Dvi/Tihetuka", "Exclusion 5 · Only 1 Adhipati per 2/3-Root Javana", "Exclusión 5 · Solo 1 Adhipati por Javana Dvi/Tihetuka", "AS VII.28: Somente 1 predominância (Adhipati) surge por vez, e apenas em Javanas de 2 ou 3 raízes (52 Cittas).", "AS VII.28: Only 1 predominance arises at a time, and only in 2- or 3-root Javanas (52 Cittas).", "AS VII.28: Solo 1 Adhipati surge a la vez, y solo en Javanas de 2 o 3 raíces."),

  // ══════════════════════════════════════════════════════════════════════════
  // 3. OS 37 BODHIPAKKHIYAS INDIVIDUAIS → 14 SABHĀVA-DHAMMAS (AS VII.30–40)
  // ══════════════════════════════════════════════════════════════════════════
  // 4 Satipaṭṭhānas → Sati
  mkBo("sam:b37:1", "AS VII.30, 37", "B37-01", "satipatthana", 1, "sati", "1. Kāyānupassanā-satipaṭṭhāna", "Satipaṭṭhāna 1 · Contemplação do Corpo", "Satipaṭṭhāna 1 · Contemplation of Body", "Satipaṭṭhāna 1 · Contemplación del Cuerpo", "Sabhāva real: Sati (1.º dos 8 lugares de Sati).", "Real Sabhāva: Sati (1st of Sati's 8 places).", "Sabhāva real: Sati (1.º de 8 lugares)."),
  mkBo("sam:b37:2", "AS VII.30, 37", "B37-02", "satipatthana", 2, "sati", "2. Vedanānupassanā-satipaṭṭhāna", "Satipaṭṭhāna 2 · Contemplação das Sensações", "Satipaṭṭhāna 2 · Contemplation of Feelings", "Satipaṭṭhāna 2 · Contemplación de Sensaciones", "Sabhāva real: Sati (2.º dos 8 lugares de Sati).", "Real Sabhāva: Sati (2nd of Sati's 8 places).", "Sabhāva real: Sati (2.º de 8 lugares)."),
  mkBo("sam:b37:3", "AS VII.30, 37", "B37-03", "satipatthana", 3, "sati", "3. Cittānupassanā-satipaṭṭhāna", "Satipaṭṭhāna 3 · Contemplação da Mente", "Satipaṭṭhāna 3 · Contemplation of Mind", "Satipaṭṭhāna 3 · Contemplación de la Mente", "Sabhāva real: Sati (3.º dos 8 lugares de Sati).", "Real Sabhāva: Sati (3rd of Sati's 8 places).", "Sabhāva real: Sati (3.º de 8 lugares)."),
  mkBo("sam:b37:4", "AS VII.30, 37", "B37-04", "satipatthana", 4, "sati", "4. Dhammānupassanā-satipaṭṭhāna", "Satipaṭṭhāna 4 · Contemplação dos Dhammas", "Satipaṭṭhāna 4 · Contemplation of Dhammas", "Satipaṭṭhāna 4 · Contemplación de Dhammas", "Sabhāva real: Sati (4.º dos 8 lugares de Sati).", "Real Sabhāva: Sati (4th of Sati's 8 places).", "Sabhāva real: Sati (4.º de 8 lugares)."),
  // 4 Sammappadhānas → Vīriya
  mkBo("sam:b37:5", "AS VII.31, 38", "B37-05", "sammappadhana", 1, "viriya", "1. Uppannānaṃ Akusalānaṃ Pahānāya Vāyāmo", "Esforço 1 · Abandonar Insalubres Surgidos", "Striving 1 · Abandon Arisen Unwholesome", "Esfuerzo 1 · Abandonar Inhábiles Surgidos", "Sabhāva real: Vīriya (1.º dos 9 lugares de Vīriya).", "Real Sabhāva: Vīriya (1st of Vīriya's 9 places).", "Sabhāva real: Vīriya (1.º de 9 lugares)."),
  mkBo("sam:b37:6", "AS VII.31, 38", "B37-06", "sammappadhana", 2, "viriya", "2. Anuppannānaṃ Akusalānaṃ Anuppādāya Vāyāmo", "Esforço 2 · Prevenir Insalubres Não-Surgidos", "Striving 2 · Prevent Unarisen Unwholesome", "Esfuerzo 2 · Prevenir Inhábiles No Surgidos", "Sabhāva real: Vīriya (2.º dos 9 lugares).", "Real Sabhāva: Vīriya (2nd of 9 places).", "Sabhāva real: Vīriya (2.º de 9 lugares)."),
  mkBo("sam:b37:7", "AS VII.31, 38", "B37-07", "sammappadhana", 3, "viriya", "3. Anuppannānaṃ Kusalānaṃ Uppādāya Vāyāmo", "Esforço 3 · Gerar Salubres Não-Surgidos", "Striving 3 · Arouse Unarisen Wholesome", "Esfuerzo 3 · Generar Hábiles No Surgidos", "Sabhāva real: Vīriya (3.º dos 9 lugares).", "Real Sabhāva: Vīriya (3rd of 9 places).", "Sabhāva real: Vīriya (3.º de 9 lugares)."),
  mkBo("sam:b37:8", "AS VII.31, 38", "B37-08", "sammappadhana", 4, "viriya", "4. Uppannānaṃ Kusalānaṃ Bhiyyobhāvāya Vāyāmo", "Esforço 4 · Cultivar Salubres Surgidos", "Striving 4 · Develop Arisen Wholesome", "Esfuerzo 4 · Cultivar Hábiles Surgidos", "Sabhāva real: Vīriya (4.º dos 9 lugares).", "Real Sabhāva: Vīriya (4th of 9 places).", "Sabhāva real: Vīriya (4.º de 9 lugares)."),
  // 4 Iddhipādas
  mkBo("sam:b37:9", "AS VII.32, 40", "B37-09", "iddhipada", 1, "chanda", "1. Chandiddhipāda", "Iddhipāda 1 · Base do Zelo (Chanda)", "Iddhipāda 1 · Base of Zeal (Chanda)", "Iddhipāda 1 · Base del Celo (Chanda)", "Sabhāva real: Chanda (1 lugar único).", "Real Sabhāva: Chanda (1 single place).", "Sabhāva real: Chanda (1 lugar)."),
  mkBo("sam:b37:10", "AS VII.32, 40", "B37-10", "iddhipada", 2, "viriya", "2. Vīriyiddhipāda", "Iddhipāda 2 · Base da Energia (Vīriya)", "Iddhipāda 2 · Base of Energy (Vīriya)", "Iddhipāda 2 · Base de Energía (Vīriya)", "Sabhāva real: Vīriya (5.º dos 9 lugares).", "Real Sabhāva: Vīriya (5th of 9 places).", "Sabhāva real: Vīriya (5.º de 9 lugares)."),
  mkBo("sam:b37:11", "AS VII.32, 40", "B37-11", "iddhipada", 3, "citta", "3. Cittiddhipāda", "Iddhipāda 3 · Base da Mente (Citta)", "Iddhipāda 3 · Base of Mind (Citta)", "Iddhipāda 3 · Base de la Mente (Citta)", "Sabhāva real: Citta (única consciência nos 37 Bodhipakkhiyas!).", "Real Sabhāva: Citta (sole consciousness in all 37 Wings!).", "Sabhāva real: Citta (única conciencia en los 37)."),
  mkBo("sam:b37:12", "AS VII.32, 40", "B37-12", "iddhipada", 4, "panna", "4. Vīmaṃsiddhipāda", "Iddhipāda 4 · Base da Investigação (Paññā)", "Iddhipāda 4 · Base of Investigation (Paññā)", "Iddhipāda 4 · Base de Investigación (Paññā)", "Sabhāva real: Paññā (1.º dos 5 lugares de Paññā).", "Real Sabhāva: Paññā (1st of Paññā's 5 places).", "Sabhāva real: Paññā (1.º de 5 lugares)."),
  // 5 Indriyas
  mkBo("sam:b37:13", "AS VII.33, 40", "B37-13", "indriya5", 1, "saddha", "1. Saddhindriya (Bodhi)", "Indriya 1 · Faculdade da Fé (Saddhā)", "Indriya 1 · Faculty of Faith (Saddhā)", "Indriya 1 · Facultad de la Fe (Saddhā)", "Sabhāva real: Saddhā (1.º de 2 lugares).", "Real Sabhāva: Saddhā (1st of 2 places).", "Sabhāva real: Saddhā (1.º de 2 lugares)."),
  mkBo("sam:b37:14", "AS VII.33, 40", "B37-14", "indriya5", 2, "viriya", "2. Vīriyindriya (Bodhi)", "Indriya 2 · Faculdade da Energia (Vīriya)", "Indriya 2 · Faculty of Energy (Vīriya)", "Indriya 2 · Facultad de Energía (Vīriya)", "Sabhāva real: Vīriya (6.º de 9 lugares).", "Real Sabhāva: Vīriya (6th of 9 places).", "Sabhāva real: Vīriya (6.º de 9 lugares)."),
  mkBo("sam:b37:15", "AS VII.33, 40", "B37-15", "indriya5", 3, "sati", "3. Satindriya (Bodhi)", "Indriya 3 · Faculdade da Atenção Plena (Sati)", "Indriya 3 · Faculty of Mindfulness (Sati)", "Indriya 3 · Facultad de Atención Plena (Sati)", "Sabhāva real: Sati (5.º de 8 lugares).", "Real Sabhāva: Sati (5th of 8 places).", "Sabhāva real: Sati (5.º de 8 lugares)."),
  mkBo("sam:b37:16", "AS VII.33, 40", "B37-16", "indriya5", 4, "samadhi", "4. Samādhindriya (Bodhi)", "Indriya 4 · Faculdade da Concentração (Samādhi)", "Indriya 4 · Faculty of Concentration (Samādhi)", "Indriya 4 · Facultad de Concentración (Samādhi)", "Sabhāva real: Samādhi / Ekaggatā (1.º de 4 lugares).", "Real Sabhāva: Samādhi / Ekaggatā (1st of 4 places).", "Sabhāva real: Samādhi (1.º de 4 lugares)."),
  mkBo("sam:b37:17", "AS VII.33, 40", "B37-17", "indriya5", 5, "panna", "5. Paññindriya (Bodhi)", "Indriya 5 · Faculdade da Sabedoria (Paññā)", "Indriya 5 · Faculty of Wisdom (Paññā)", "Indriya 5 · Facultad de Sabiduría (Paññā)", "Sabhāva real: Paññā (2.º de 5 lugares).", "Real Sabhāva: Paññā (2nd of 5 places).", "Sabhāva real: Paññā (2.º de 5 lugares)."),
  // 5 Balas
  mkBo("sam:b37:18", "AS VII.34, 40", "B37-18", "bala5", 1, "saddha", "1. Saddhābala", "Bala 1 · Poder da Fé (Saddhā)", "Bala 1 · Power of Faith (Saddhā)", "Bala 1 · Poder de la Fe (Saddhā)", "Sabhāva real: Saddhā (2.º de 2 lugares).", "Real Sabhāva: Saddhā (2nd of 2 places).", "Sabhāva real: Saddhā (2.º de 2 lugares)."),
  mkBo("sam:b37:19", "AS VII.34, 40", "B37-19", "bala5", 2, "viriya", "2. Vīriyabala", "Bala 2 · Poder da Energia (Vīriya)", "Bala 2 · Power of Energy (Vīriya)", "Bala 2 · Poder de Energía (Vīriya)", "Sabhāva real: Vīriya (7.º de 9 lugares).", "Real Sabhāva: Vīriya (7th of 9 places).", "Sabhāva real: Vīriya (7.º de 9 lugares)."),
  mkBo("sam:b37:20", "AS VII.34, 40", "B37-20", "bala5", 3, "sati", "3. Satibala", "Bala 3 · Poder da Atenção Plena (Sati)", "Bala 3 · Power of Mindfulness (Sati)", "Bala 3 · Poder de Atención Plena (Sati)", "Sabhāva real: Sati (6.º de 8 lugares).", "Real Sabhāva: Sati (6th of 8 places).", "Sabhāva real: Sati (6.º de 8 lugares)."),
  mkBo("sam:b37:21", "AS VII.34, 40", "B37-21", "bala5", 4, "samadhi", "4. Samādhibala", "Bala 4 · Poder da Concentração (Samādhi)", "Bala 4 · Power of Concentration (Samādhi)", "Bala 4 · Poder de Concentración (Samādhi)", "Sabhāva real: Samādhi (2.º de 4 lugares).", "Real Sabhāva: Samādhi (2nd of 4 places).", "Sabhāva real: Samādhi (2.º de 4 lugares)."),
  mkBo("sam:b37:22", "AS VII.34, 40", "B37-22", "bala5", 5, "panna", "5. Paññābala", "Bala 5 · Poder da Sabedoria (Paññā)", "Bala 5 · Power of Wisdom (Paññā)", "Bala 5 · Poder de Sabiduría (Paññā)", "Sabhāva real: Paññā (3.º de 5 lugares).", "Real Sabhāva: Paññā (3rd of 5 places).", "Sabhāva real: Paññā (3.º de 5 lugares)."),
  // 7 Bojjhaṅgas
  mkBo("sam:b37:23", "AS VII.35, 40", "B37-23", "bojjhanga", 1, "sati", "1. Sati-sambojjhaṅga", "Bojjhaṅga 1 · Atenção Plena (Sati)", "Bojjhaṅga 1 · Mindfulness (Sati)", "Bojjhaṅga 1 · Atención Plena (Sati)", "Sabhāva real: Sati (7.º de 8 lugares).", "Real Sabhāva: Sati (7th of 8 places).", "Sabhāva real: Sati (7.º de 8 lugares)."),
  mkBo("sam:b37:24", "AS VII.35, 40", "B37-24", "bojjhanga", 2, "panna", "2. Dhammavicaya-sambojjhaṅga", "Bojjhaṅga 2 · Investigação dos Dhammas (Paññā)", "Bojjhaṅga 2 · Investigation of States (Paññā)", "Bojjhaṅga 2 · Investigación de Dhammas (Paññā)", "Sabhāva real: Paññā (4.º de 5 lugares).", "Real Sabhāva: Paññā (4th of 5 places).", "Sabhāva real: Paññā (4.º de 5 lugares)."),
  mkBo("sam:b37:25", "AS VII.35, 40", "B37-25", "bojjhanga", 3, "viriya", "3. Vīriya-sambojjhaṅga", "Bojjhaṅga 3 · Energia (Vīriya)", "Bojjhaṅga 3 · Energy (Vīriya)", "Bojjhaṅga 3 · Energía (Vīriya)", "Sabhāva real: Vīriya (8.º de 9 lugares).", "Real Sabhāva: Vīriya (8th of 9 places).", "Sabhāva real: Vīriya (8.º de 9 lugares)."),
  mkBo("sam:b37:26", "AS VII.35, 40", "B37-26", "bojjhanga", 4, "piti", "4. Pīti-sambojjhaṅga", "Bojjhaṅga 4 · Êxtase / Júbilo (Pīti)", "Bojjhaṅga 4 · Rapture (Pīti)", "Bojjhaṅga 4 · Éxtasis / Júbilo (Pīti)", "Sabhāva real: Pīti (1 lugar único; ausente em 4.º–5.º Jhāna Lokuttara, AS VII.41).", "Real Sabhāva: Pīti (1 place; absent in 4th–5th Jhāna Lokuttara, AS VII.41).", "Sabhāva real: Pīti (1 lugar; ausente en 4.º–5.º Jhāna)."),
  mkBo("sam:b37:27", "AS VII.35, 40", "B37-27", "bojjhanga", 5, "passaddhi", "5. Passaddhi-sambojjhaṅga", "Bojjhaṅga 5 · Tranquilidade (Passaddhi)", "Bojjhaṅga 5 · Tranquility (Passaddhi)", "Bojjhaṅga 5 · Tranquilidad (Passaddhi)", "Sabhāva real: Passaddhi (1 lugar único).", "Real Sabhāva: Passaddhi (1 single place).", "Sabhāva real: Passaddhi (1 lugar)."),
  mkBo("sam:b37:28", "AS VII.35, 40", "B37-28", "bojjhanga", 6, "samadhi", "6. Samādhi-sambojjhaṅga", "Bojjhaṅga 6 · Concentração (Samādhi)", "Bojjhaṅga 6 · Concentration (Samādhi)", "Bojjhaṅga 6 · Concentración (Samādhi)", "Sabhāva real: Samādhi (3.º de 4 lugares).", "Real Sabhāva: Samādhi (3rd of 4 places).", "Sabhāva real: Samādhi (3.º de 4 lugares)."),
  mkBo("sam:b37:29", "AS VII.35, 40", "B37-29", "bojjhanga", 7, "upekkha", "7. Upekkhā-sambojjhaṅga", "Bojjhaṅga 7 · Equanimidade Mental (Tatramajjhattatā)", "Bojjhaṅga 7 · Equanimity (Tatramajjhattatā)", "Bojjhaṅga 7 · Ecuanimidad (Tatramajjhattatā)", "Sabhāva real: Tatramajjhattatā (não Vedanā! 1 lugar único).", "Real Sabhāva: Tatramajjhattatā (not Vedanā! 1 single place).", "Sabhāva real: Tatramajjhattatā (1 lugar)."),
  // 8 Maggaṅgas
  mkBo("sam:b37:30", "AS VII.36, 40", "B37-30", "magganga", 1, "panna", "1. Sammādiṭṭhi (Bodhi)", "Maggaṅga 1 · Visão Correta (Paññā)", "Maggaṅga 1 · Right View (Paññā)", "Maggaṅga 1 · Visión Recta (Paññā)", "Sabhāva real: Paññā (5.º e último de 5 lugares).", "Real Sabhāva: Paññā (5th of 5 places).", "Sabhāva real: Paññā (5.º de 5 lugares)."),
  mkBo("sam:b37:31", "AS VII.36, 40–41", "B37-31", "magganga", 2, "vitakka", "2. Sammāsaṅkappa (Bodhi)", "Maggaṅga 2 · Pensamento Correto (Vitakka)", "Maggaṅga 2 · Right Thought (Vitakka)", "Maggaṅga 2 · Pensamiento Recto (Vitakka)", "Sabhāva real: Vitakka (1 lugar único; ausente em 2.º–5.º Jhāna Lokuttara, AS VII.41).", "Real Sabhāva: Vitakka (1 place; absent in 2nd–5th Jhāna Lokuttara, AS VII.41).", "Sabhāva real: Vitakka (1 lugar; ausente en 2.º–5.º Jhāna)."),
  mkBo("sam:b37:32", "AS VII.36, 40", "B37-32", "magganga", 3, "sammavaca", "3. Sammāvācā (Bodhi)", "Maggaṅga 3 · Fala Correta (Sammāvācā)", "Maggaṅga 3 · Right Speech (Sammāvācā)", "Maggaṅga 3 · Habla Recta (Sammāvācā)", "Sabhāva real: Sammāvācā (1 lugar único).", "Real Sabhāva: Sammāvācā (1 single place).", "Sabhāva real: Sammāvācā (1 lugar)."),
  mkBo("sam:b37:33", "AS VII.36, 40", "B37-33", "magganga", 4, "sammakammanta", "4. Sammākammanta (Bodhi)", "Maggaṅga 4 · Ação Correta (Sammākammanta)", "Maggaṅga 4 · Right Action (Sammākammanta)", "Maggaṅga 4 · Acción Recta (Sammākammanta)", "Sabhāva real: Sammākammanta (1 lugar único).", "Real Sabhāva: Sammākammanta (1 single place).", "Sabhāva real: Sammākammanta (1 lugar)."),
  mkBo("sam:b37:34", "AS VII.36, 40", "B37-34", "magganga", 5, "samma_ajiva", "5. Sammā-ājīva (Bodhi)", "Maggaṅga 5 · Modo de Vida Correto (Sammā-ājīva)", "Maggaṅga 5 · Right Livelihood (Sammā-ājīva)", "Maggaṅga 5 · Sustento Recto (Sammā-ājīva)", "Sabhāva real: Sammā-ājīva (1 lugar único).", "Real Sabhāva: Sammā-ājīva (1 single place).", "Sabhāva real: Sammā-ājīva (1 lugar)."),
  mkBo("sam:b37:35", "AS VII.36, 40", "B37-35", "magganga", 6, "viriya", "6. Sammāvāyāma (Bodhi)", "Maggaṅga 6 · Esforço Correto (Vīriya)", "Maggaṅga 6 · Right Effort (Vīriya)", "Maggaṅga 6 · Esfuerzo Recto (Vīriya)", "Sabhāva real: Vīriya (9.º e último dos 9 lugares!).", "Real Sabhāva: Vīriya (9th & final of 9 places!).", "Sabhāva real: Vīriya (9.º de 9 lugares)."),
  mkBo("sam:b37:36", "AS VII.36, 40", "B37-36", "magganga", 7, "sati", "7. Sammāsati (Bodhi)", "Maggaṅga 7 · Atenção Plena Correta (Sati)", "Maggaṅga 7 · Right Mindfulness (Sati)", "Maggaṅga 7 · Atención Plena Recta (Sati)", "Sabhāva real: Sati (8.º e último dos 8 lugares!).", "Real Sabhāva: Sati (8th & final of 8 places!).", "Sabhāva real: Sati (8.º de 8 lugares)."),
  mkBo("sam:b37:37", "AS VII.36, 40", "B37-37", "magganga", 8, "samadhi", "8. Sammāsamādhi (Bodhi)", "Maggaṅga 8 · Concentração Correta (Samādhi)", "Maggaṅga 8 · Right Concentration (Samādhi)", "Maggaṅga 8 · Concentración Recta (Samādhi)", "Sabhāva real: Samādhi / Ekaggatā (4.º e último de 4 lugares!).", "Real Sabhāva: Samādhi / Ekaggatā (4th & final of 4 places!).", "Sabhāva real: Samādhi (4.º de 4 lugares)."),

  // ══════════════════════════════════════════════════════════════════════════
  // 4. SABBA-SAṄGAHA GRANULAR (28 ITENS — AS VII.42–53)
  // ══════════════════════════════════════════════════════════════════════════
  // 5 Khandhas
  mkSb("sam:sbm:k1", "AS VII.42, 49", "Kha-01", "khandha5", 1, "rupa_28", "1. Rūpakkhandha", "Agregado 1 · Materialidade (28 Rūpas)", "Aggregate 1 · Materiality (28 Rūpas)", "Agregado 1 · Materialidad (28 Rūpas)", "Abrange todos os 28 Rūpas (18 Nipphanna + 10 Anipphanna).", "Encompasses all 28 Rūpas.", "Abarca los 28 Rūpas."),
  mkSb("sam:sbm:k2", "AS VII.42, 49", "Kha-02", "khandha5", 2, "vedana_1", "2. Vedanākkhandha", "Agregado 2 · Sensação (1 Cetasika)", "Aggregate 2 · Feeling (1 Cetasika)", "Agregado 2 · Sensación (1 Cetasika)", "Corresponde ao único cetasika Vedanā.", "Corresponds to the single cetasika Vedanā.", "Corresponde al único cetasika Vedanā."),
  mkSb("sam:sbm:k3", "AS VII.42, 49", "Kha-03", "khandha5", 3, "sanna_1", "3. Saññākkhandha", "Agregado 3 · Percepção (1 Cetasika)", "Aggregate 3 · Perception (1 Cetasika)", "Agregado 3 · Percepción (1 Cetasika)", "Corresponde ao único cetasika Saññā.", "Corresponds to the single cetasika Saññā.", "Corresponde al único cetasika Saññā."),
  mkSb("sam:sbm:k4", "AS VII.42, 49", "Kha-04", "khandha5", 4, "sankhara_50", "4. Saṅkhārakkhandha", "Agregado 4 · Formações Mentais (50 Cetasikas)", "Aggregate 4 · Mental Formations (50 Cetasikas)", "Agregado 4 · Formaciones Mentales (50 Cetasikas)", "Os 50 Cetasikas restantes (52 − Vedanā − Saññā = 50).", "The remaining 50 Cetasikas (52 − Vedanā − Saññā = 50).", "Los 50 Cetasikas restantes."),
  mkSb("sam:sbm:k5", "AS VII.42, 49–50", "Kha-05", "khandha5", 5, "citta_89", "5. Viññāṇakkhandha", "Agregado 5 · Consciência (89 / 121 Cittas)", "Aggregate 5 · Consciousness (89 / 121 Cittas)", "Agregado 5 · Conciencia (89 / 121 Cittas)", "Todas as 89 [121] Cittas (em Upādānakkhandha, apenas as 81 mundanas!).", "All 89 [121] Cittas (in clinging-aggregate, only the 81 mundane!).", "Todas las 89 [121] Cittas (81 mundanas en Upādānakkhandha)."),

  // 12 Āyatanas (6 Internas + 6 Externas)
  mkSb("sam:sbm:a1", "AS VII.44", "Aya-01", "ayatana12", 1, "pasada_1", "1. Cakkhāyatana", "Base Interna 1 · Olho (Cakkhu-pasāda)", "Internal Base 1 · Eye (Cakkhu-pasāda)", "Base Interna 1 · Ojo (Cakkhu-pasāda)", "1.ª base interna = Cakkhu-pasāda (1 rūpa).", "1st internal base = Eye sensitivity (1 rūpa).", "1.ª base interna = Cakkhu-pasāda."),
  mkSb("sam:sbm:a2", "AS VII.44", "Aya-02", "ayatana12", 2, "pasada_1", "2. Sotāyatana", "Base Interna 2 · Ouvido (Sota-pasāda)", "Internal Base 2 · Ear (Sota-pasāda)", "Base Interna 2 · Oído (Sota-pasāda)", "2.ª base interna = Sota-pasāda.", "2nd internal base = Ear sensitivity.", "2.ª base interna = Sota-pasāda."),
  mkSb("sam:sbm:a3", "AS VII.44", "Aya-03", "ayatana12", 3, "pasada_1", "3. Ghānāyatana", "Base Interna 3 · Nariz (Ghāna-pasāda)", "Internal Base 3 · Nose (Ghāna-pasāda)", "Base Interna 3 · Nariz (Ghāna-pasāda)", "3.ª base interna = Ghāna-pasāda.", "3rd internal base = Nose sensitivity.", "3.ª base interna = Ghāna-pasāda."),
  mkSb("sam:sbm:a4", "AS VII.44", "Aya-04", "ayatana12", 4, "pasada_1", "4. Jivhāyatana", "Base Interna 4 · Língua (Jivhā-pasāda)", "Internal Base 4 · Tongue (Jivhā-pasāda)", "Base Interna 4 · Lengua (Jivhā-pasāda)", "4.ª base interna = Jivhā-pasāda.", "4th internal base = Tongue sensitivity.", "4.ª base interna = Jivhā-pasāda."),
  mkSb("sam:sbm:a5", "AS VII.44", "Aya-05", "ayatana12", 5, "pasada_1", "5. Kāyāyatana", "Base Interna 5 · Corpo (Kāya-pasāda)", "Internal Base 5 · Body (Kāya-pasāda)", "Base Interna 5 · Cuerpo (Kāya-pasāda)", "5.ª base interna = Kāya-pasāda.", "5th internal base = Body sensitivity.", "5.ª base interna = Kāya-pasāda."),
  mkSb("sam:sbm:a6", "AS VII.44, 48", "Aya-06", "ayatana12", 6, "citta_89", "6. Manāyatana", "Base Interna 6 · Mente (Todas 89 Cittas)", "Internal Base 6 · Mind (All 89 Cittas)", "Base Interna 6 · Mente (Las 89 Cittas)", "AS VII.48: Abrange todas as 89 Cittas; nos 18 Dhātus desdobra-se em 7 Viññāṇadhātus!", "AS VII.48: Encompasses all 89 Cittas; splits into 7 Viññāṇadhātus in the 18 Elements!", "AS VII.48: Las 89 Cittas; se divide en 7 Viññāṇadhātus."),
  mkSb("sam:sbm:a7", "AS VII.44", "Aya-07", "ayatana12", 7, "gocara_1", "7. Rūpāyatana", "Base Externa 1 · Forma Visível (Vaṇṇa)", "External Base 1 · Visible Form (Vaṇṇa)", "Base Externa 1 · Forma Visible (Vaṇṇa)", "1.ª base externa = Vaṇṇa (1 rūpa).", "1st external base = Visible form (1 rūpa).", "1.ª base externa = Vaṇṇa."),
  mkSb("sam:sbm:a8", "AS VII.44", "Aya-08", "ayatana12", 8, "gocara_1", "8. Saddāyatana", "Base Externa 2 · Som (Sadda)", "External Base 2 · Sound (Sadda)", "Base Externa 2 · Sonido (Sadda)", "2.ª base externa = Sadda.", "2nd external base = Sound.", "2.ª base externa = Sadda."),
  mkSb("sam:sbm:a9", "AS VII.44", "Aya-09", "ayatana12", 9, "gocara_1", "9. Gandhāyatana", "Base Externa 3 · Odor (Gandha)", "External Base 3 · Odor (Gandha)", "Base Externa 3 · Olor (Gandha)", "3.ª base externa = Gandha.", "3rd external base = Odor.", "3.ª base externa = Gandha."),
  mkSb("sam:sbm:a10", "AS VII.44", "Aya-10", "ayatana12", 10, "gocara_1", "10. Rasāyatana", "Base Externa 4 · Sabor (Rasa)", "External Base 4 · Taste (Rasa)", "Base Externa 4 · Sabor (Rasa)", "4.ª base externa = Rasa.", "4th external base = Taste.", "4.ª base externa = Rasa."),
  mkSb("sam:sbm:a11", "AS VII.44", "Aya-11", "ayatana12", 11, "bhuta_3", "11. Phoṭṭhabbāyatana", "Base Externa 5 · Tangível (3 Mahābhūtas)", "External Base 5 · Tangible (3 Mahābhūtas)", "Base Externa 5 · Tangible (3 Mahābhūtas)", "Composto pelos 3 elementos tangíveis: Pathavī, Tejo e Vāyo (sem Āpo!).", "Consists of the 3 tangible elements: Earth, Fire, Air (excluding Water!).", "Compuesto por Pathavī, Tejo y Vāyo (sin Āpo)."),
  mkSb("sam:sbm:a12", "AS VII.44, 47", "Aya-12", "ayatana12", 12, "dhamma_69", "12. Dhammāyatana", "Base Externa 6 · Objetos Mentais (69 Dhammas)", "External Base 6 · Mental Objects (69 Dhammas)", "Base Externa 6 · Objetos Mentales (69 Dhammas)", "AS VII.47: 52 Cetasikas + 16 Sukhumarūpas + 1 Nibbāna = 69!", "AS VII.47: 52 Cetasikas + 16 Subtle Rūpas + 1 Nibbāna = 69!", "AS VII.47: 52 Cetasikas + 16 Sukhumarūpas + 1 Nibbāna = 69."),

  // 7 Viññāṇadhātus (desdobramento exato de Manāyatana nos 18 Dhātus — AS VII.45, 48)
  mkSb("sam:sbm:d1", "AS VII.45, 48", "Dha-01", "vinnana_dhatu7", 1, "sense_pair_2", "1. Cakkhuviññāṇadhātu (2 Cittas)", "Dhātu 1 · Consciência Ocular (#13, #20)", "Element 1 · Eye-Consciousness (#13, #20)", "Dhātu 1 · Conciencia Ocular (#13, #20)", "Par Akusala/Kusala-vipāka (2 Cittas).", "Unwholesome/Wholesome resultant pair (2 Cittas).", "Par Akusala/Kusala-vipāka (2 Cittas)."),
  mkSb("sam:sbm:d2", "AS VII.45, 48", "Dha-02", "vinnana_dhatu7", 2, "sense_pair_2", "2. Sotaviññāṇadhātu (2 Cittas)", "Dhātu 2 · Consciência Auditiva (#14, #21)", "Element 2 · Ear-Consciousness (#14, #21)", "Dhātu 2 · Conciencia Auditiva (#14, #21)", "Par de 2 Cittas auditivas.", "Pair of 2 ear-consciousnesses.", "Par de 2 Cittas auditivas."),
  mkSb("sam:sbm:d3", "AS VII.45, 48", "Dha-03", "vinnana_dhatu7", 3, "sense_pair_2", "3. Ghānaviññāṇadhātu (2 Cittas)", "Dhātu 3 · Consciência Olfativa (#15, #22)", "Element 3 · Nose-Consciousness (#15, #22)", "Dhātu 3 · Conciencia Olfativa (#15, #22)", "Par de 2 Cittas olfativas (ausente em Rūpaloka).", "Pair of 2 nose-consciousnesses (absent in Rūpaloka).", "Par de 2 Cittas olfativas."),
  mkSb("sam:sbm:d4", "AS VII.45, 48", "Dha-04", "vinnana_dhatu7", 4, "sense_pair_2", "4. Jivhāviññāṇadhātu (2 Cittas)", "Dhātu 4 · Consciência Gustativa (#16, #23)", "Element 4 · Tongue-Consciousness (#16, #23)", "Dhātu 4 · Conciencia Gustativa (#16, #23)", "Par de 2 Cittas gustativas (ausente em Rūpaloka).", "Pair of 2 tongue-consciousnesses (absent in Rūpaloka).", "Par de 2 Cittas gustativas."),
  mkSb("sam:sbm:d5", "AS VII.45, 48", "Dha-05", "vinnana_dhatu7", 5, "sense_pair_2", "5. Kāyaviññāṇadhātu (2 Cittas)", "Dhātu 5 · Consciência Tátil (#17, #24)", "Element 5 · Body-Consciousness (#17, #24)", "Dhātu 5 · Conciencia Táctil (#17, #24)", "Par de 2 Cittas corporais (Dukkha #17 e Sukha #24).", "Pair of 2 body-consciousnesses (Pain #17 & Pleasure #24).", "Par de 2 Cittas táctiles (Dukkha #17 y Sukha #24)."),
  mkSb("sam:sbm:d6", "AS VII.45, 48", "Dha-06", "vinnana_dhatu7", 6, "manodhatu_3", "6. Manodhātu (3 Cittas: #18, #25, #28)", "Dhātu 6 · Elemento Mente (3 Cittas)", "Element 6 · Mind-Element (3 Cittas)", "Dhātu 6 · Elemento Mente (3 Cittas)", "Tríade Ahetuka: 2 Sampaṭicchanas (#18, #25) + 1 Pañcadvārāvajjana (#28) = 3.", "Ahetuka triad: 2 Receiving (#18, #25) + 1 Five-door adverting (#28) = 3.", "Tríada Ahetuka: 2 Sampaṭicchanas + Pañcadvārāvajjana = 3."),
  mkSb("sam:sbm:d7", "AS VII.45, 48", "Dha-07", "vinnana_dhatu7", 7, "manovinnana_76", "7. Manoviññāṇadhātu (76 [108] Cittas)", "Dhātu 7 · Consciência Mental (76 [108] Cittas)", "Element 7 · Mind-Consciousness (76 [108] Cittas)", "Dhātu 7 · Conciencia Mental (76 [108] Cittas)", "Todas as 76 [108] Cittas restantes (10 + 3 + 76 = 89). Único dhātu presente em Arūpaloka!", "All remaining 76 [108] Cittas (10 + 3 + 76 = 89). Sole element in Arūpaloka!", "Las 76 [108] Cittas restantes (10 + 3 + 76 = 89)."),

  // 4 Ariyasaccas Individuais (AS VII.46, 52–53)
  mkSb("sam:sbm:s1", "AS VII.46, 52", "Sac-01", "ariyasacca4", 1, "tebhumaka_excl_lobha", "1. Dukkha-ariyasacca", "Nobre Verdade 1 · Sofrimento (Dukkha)", "Noble Truth 1 · Suffering (Dukkha)", "Noble Verdad 1 · Sufrimiento (Dukkha)", "AS VII.52: 81 Cittas mundanas + 51 Cetasikas (excl. Lobha!) + 28 Rūpas.", "AS VII.52: 81 mundane Cittas + 51 Cetasikas (excl. Lobha!) + 28 Rūpas.", "AS VII.52: 81 Cittas mundanas + 51 Cetasikas (sin Lobha) + 28 Rūpas."),
  mkSb("sam:sbm:s2", "AS VII.46, 52", "Sac-02", "ariyasacca4", 2, "lobha_tanha", "2. Dukkhasamudaya-ariyasacca", "Nobre Verdade 2 · Origem do Sofrimento (Taṇhā)", "Noble Truth 2 · Origin of Suffering (Taṇhā)", "Noble Verdad 2 · Origen del Sufrimiento (Taṇhā)", "AS VII.52: Unicamente o cetasika Lobha (Taṇhā — desejo/sede).", "AS VII.52: Exclusively the cetasika Lobha (Craving / Taṇhā).", "AS VII.52: Únicamente el cetasika Lobha (Taṇhā)."),
  mkSb("sam:sbm:s3", "AS VII.46, 52", "Sac-03", "ariyasacca4", 3, "nibbana_1", "3. Dukkhanirodha-ariyasacca", "Nobre Verdade 3 · Cessação (Nibbāna)", "Noble Truth 3 · Cessation (Nibbāna)", "Noble Verdad 3 · Cesación (Nibbāna)", "AS VII.52: Unicamente Nibbāna (Asaṅkhata-dhātu).", "AS VII.52: Exclusively Nibbāna (the Unconditioned).", "AS VII.52: Únicamente Nibbāna."),
  mkSb("sam:sbm:s4", "AS VII.46, 52–53", "Sac-04", "ariyasacca4", 4, "magga_factors_8", "4. Dukkhanirodhagāminīpaṭipadā (Magga)", "Nobre Verdade 4 · O Caminho (8 Fatores nos 4 Maggas)", "Noble Truth 4 · The Path (8 Factors in 4 Paths)", "Noble Verdad 4 · El Sendero (8 Factores en 4 Maggas)", "AS VII.52–53: Apenas os 8 fatores nobres nos 4 Maggas (os 29 associados e 4 Phalas ficam de fora!).", "AS VII.52–53: Only the 8 path factors in the 4 Paths (29 associates & 4 Fruits stand outside!).", "AS VII.52–53: Solo los 8 factores en los 4 Maggas (29 asociados y 4 Phalas quedan fuera)."),
];
