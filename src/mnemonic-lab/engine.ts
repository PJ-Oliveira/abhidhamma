/**
 * Motor Combinatório, Validador Ontológico e Agendador de Maestria do Laboratório Mnêmico.
 */

import {
  CANONICAL_CITTAS_89,
  CANONICAL_CITTAS_121,
  ONTOLOGICAL_COLLISION_RULES,
  PERIODIC_ELEMENTS_72,
  PHALANX_MAPS,
  type CanonicalCitta,
  type CittaFamilyId,
  type CognitiveBit,
  type JatiId,
  type OntologicalCollisionRule,
  type PhalanxMapSpec,
  type PhalanxSlot,
  type SabhavaElement,
  type SankharaBit,
  type VedanaBit,
} from "./data.js";
import {
  CHAPTER_2_ITEMS,
  CHAPTER_3_ITEMS,
  CHAPTER_4_ITEMS,
  CHAPTER_5_ITEMS,
  CHAPTER_6_ITEMS,
  CHAPTER_7_ITEMS,
  CHAPTER_8_ITEMS,
  CHAPTER_9_ITEMS,
  getSubmatricesForChapter,
  type CanonicalChapterNum,
  type NaryChallengeItem,
} from "./nary-chapters-data.js";

export const MNEMONIC_STORAGE_KEY = "abhidhamma_mnemonic_lab_v1";

export type DifficultyLevel = 1 | 2 | 3;

export interface MnemonicProgressState {
  readonly level: DifficultyLevel;
  readonly streak: number;
  readonly bestStreak: number;
  readonly totalCorrect: number;
  readonly totalAttempts: number;
  /** IDs de Cittas e Itens dominados no Decodificador N-ário (ex.: "citta:1", "nary:cet:1") */
  readonly masteredBinary: Readonly<Record<string, number>>;
  /** IDs de Cittas/Elementos dominados na Tabela Periódica (ex.: "chem:1") */
  readonly masteredPeriodic: Readonly<Record<string, number>>;
  /** IDs de falanges dominadas no Ábaco (ex.: "akusala12:1") */
  readonly masteredPhalanx: Readonly<Record<string, number>>;
}

export function createInitialProgress(): MnemonicProgressState {
  return {
    level: 1,
    streak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    masteredBinary: {},
    masteredPeriodic: {},
    masteredPhalanx: {},
  };
}

export function normalizeMnemonicProgress(parsed?: Partial<MnemonicProgressState> | null): MnemonicProgressState {
  if (!parsed || typeof parsed !== "object") return createInitialProgress();
  const lvl = parsed.level === 1 || parsed.level === 2 || parsed.level === 3 ? parsed.level : 1;
  return {
    level: lvl,
    streak: typeof parsed.streak === "number" ? parsed.streak : 0,
    bestStreak: typeof parsed.bestStreak === "number" ? parsed.bestStreak : 0,
    totalCorrect: typeof parsed.totalCorrect === "number" ? parsed.totalCorrect : 0,
    totalAttempts: typeof parsed.totalAttempts === "number" ? parsed.totalAttempts : 0,
    masteredBinary: parsed.masteredBinary && typeof parsed.masteredBinary === "object" ? parsed.masteredBinary : {},
    masteredPeriodic: parsed.masteredPeriodic && typeof parsed.masteredPeriodic === "object" ? parsed.masteredPeriodic : {},
    masteredPhalanx: parsed.masteredPhalanx && typeof parsed.masteredPhalanx === "object" ? parsed.masteredPhalanx : {},
  };
}

export function hasMnemonicProgressData(state: MnemonicProgressState | null | undefined): state is MnemonicProgressState {
  if (!state) return false;
  return (
    state.totalAttempts > 0 ||
    Object.keys(state.masteredBinary).length > 0 ||
    Object.keys(state.masteredPeriodic).length > 0 ||
    Object.keys(state.masteredPhalanx).length > 0
  );
}

export function mergeMnemonicProgress(
  a?: MnemonicProgressState | null,
  b?: MnemonicProgressState | null
): MnemonicProgressState {
  const sa = normalizeMnemonicProgress(a);
  const sb = normalizeMnemonicProgress(b);
  if (!hasMnemonicProgressData(sa)) return sb;
  if (!hasMnemonicProgressData(sb)) return sa;

  const mergeMasteredMap = (
    m1: Readonly<Record<string, number>>,
    m2: Readonly<Record<string, number>>
  ): Record<string, number> => {
    const out: Record<string, number> = { ...m1 };
    for (const [k, v] of Object.entries(m2)) {
      out[k] = Math.max(out[k] ?? 0, typeof v === "number" ? v : 0);
    }
    return out;
  };

  const primary = sa.totalAttempts >= sb.totalAttempts ? sa : sb;
  const totalCorrect = Math.max(sa.totalCorrect, sb.totalCorrect);
  const totalAttempts = Math.max(sa.totalAttempts, sb.totalAttempts, totalCorrect);

  return {
    level: primary.level,
    streak: primary.streak,
    bestStreak: Math.max(sa.bestStreak, sb.bestStreak, primary.streak),
    totalCorrect,
    totalAttempts,
    masteredBinary: mergeMasteredMap(sa.masteredBinary, sb.masteredBinary),
    masteredPeriodic: mergeMasteredMap(sa.masteredPeriodic, sb.masteredPeriodic),
    masteredPhalanx: mergeMasteredMap(sa.masteredPhalanx, sb.masteredPhalanx),
  };
}

export function loadMnemonicProgress(): MnemonicProgressState {
  try {
    const raw = localStorage.getItem(MNEMONIC_STORAGE_KEY);
    if (!raw) return createInitialProgress();
    return normalizeMnemonicProgress(JSON.parse(raw) as Partial<MnemonicProgressState>);
  } catch {
    return createInitialProgress();
  }
}

export function saveMnemonicProgress(state: MnemonicProgressState): void {
  try {
    localStorage.setItem(MNEMONIC_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function recordMnemonicAttempt(
  state: MnemonicProgressState,
  pillar: "binary" | "periodic" | "phalanx",
  itemKey: string,
  isCorrect: boolean
): MnemonicProgressState {
  const nextStreak = isCorrect ? state.streak + 1 : 0;
  const nextBest = Math.max(state.bestStreak, nextStreak);
  const nextCorrect = state.totalCorrect + (isCorrect ? 1 : 0);
  const nextAttempts = state.totalAttempts + 1;

  const updateMap = (map: Readonly<Record<string, number>>): Record<string, number> => {
    const copy = { ...map };
    const prev = copy[itemKey] ?? 0;
    copy[itemKey] = isCorrect ? prev + 1 : Math.max(0, prev - 1);
    return copy;
  };

  const next: MnemonicProgressState = {
    ...state,
    streak: nextStreak,
    bestStreak: nextBest,
    totalCorrect: nextCorrect,
    totalAttempts: nextAttempts,
    masteredBinary: pillar === "binary" ? updateMap(state.masteredBinary) : state.masteredBinary,
    masteredPeriodic: pillar === "periodic" ? updateMap(state.masteredPeriodic) : state.masteredPeriodic,
    masteredPhalanx: pillar === "phalanx" ? updateMap(state.masteredPhalanx) : state.masteredPhalanx,
  };

  saveMnemonicProgress(next);
  return next;
}

// ── PILAR 1: MOTOR DO DESCOMPACTADOR & DECODIFICADOR N-ÁRIO ──────────────────

export type AhetukaSubgroupId = "akusala_vipaka" | "kusala_vipaka" | "kiriya";

export interface BinarySwitchState {
  readonly family: CittaFamilyId;
  readonly jati: JatiId;
  readonly bitVedana: VedanaBit;
  readonly bitCognitive: CognitiveBit;
  readonly bitSankhara: SankharaBit;
  readonly jhanaStage: 1 | 2 | 3 | 4 | 5;
  readonly arupaBase: 1 | 2 | 3 | 4;
  readonly maggaStage: 1 | 2 | 3 | 4;
  readonly ahetukaSubgroup: AhetukaSubgroupId;
  readonly ahetukaSlot: number;
}

export function defaultSwitchStateForFamily(family: CittaFamilyId): BinarySwitchState {
  switch (family) {
    case "lobha":
      return { family, jati: "akusala", bitVedana: 1, bitCognitive: 1, bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "dosa":
      return { family, jati: "akusala", bitVedana: "domanassa", bitCognitive: "patigha", bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "moha":
      return { family, jati: "akusala", bitVedana: 0, bitCognitive: "vicikiccha", bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "ahetuka":
      return { family, jati: "vipaka", bitVedana: 0, bitCognitive: 0, bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "kamasobhana":
      return { family, jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "rupavacara":
      return { family, jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "arupavacara":
      return { family, jati: "kusala", bitVedana: 0, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 5, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
    case "lokuttara":
    default:
      return { family: "lokuttara", jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1, ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 0 };
  }
}

export function resolveCittaFromSwitches(
  sw: BinarySwitchState,
  mode: 89 | 121 = 121
): CanonicalCitta | null {
  const pool = mode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
  switch (sw.family) {
    case "lobha":
      return (
        pool.find(
          (c) =>
            c.family === "lobha" &&
            c.bitVedana === sw.bitVedana &&
            c.bitCognitive === sw.bitCognitive &&
            c.bitSankhara === sw.bitSankhara
        ) ?? null
      );
    case "dosa":
      return (
        pool.find((c) => c.family === "dosa" && c.bitSankhara === sw.bitSankhara) ?? null
      );
    case "moha":
      return (
        pool.find((c) => c.family === "moha" && c.bitCognitive === sw.bitCognitive) ?? null
      );
    case "ahetuka": {
      const targetId =
        sw.ahetukaSubgroup === "akusala_vipaka"
          ? 13 + Math.max(0, Math.min(6, sw.ahetukaSlot))
          : sw.ahetukaSubgroup === "kusala_vipaka"
          ? 20 + Math.max(0, Math.min(7, sw.ahetukaSlot))
          : 28 + Math.max(0, Math.min(2, sw.ahetukaSlot));
      return pool.find((c) => c.id === targetId) ?? null;
    }
    case "kamasobhana":
      return (
        pool.find(
          (c) =>
            c.family === "kamasobhana" &&
            c.jati === sw.jati &&
            c.bitVedana === sw.bitVedana &&
            c.bitCognitive === sw.bitCognitive &&
            c.bitSankhara === sw.bitSankhara
        ) ?? null
      );
    case "rupavacara":
      return (
        pool.find(
          (c) => c.family === "rupavacara" && c.jati === sw.jati && c.jhanaStage === sw.jhanaStage
        ) ?? null
      );
    case "arupavacara":
      return (
        pool.find(
          (c) => c.family === "arupavacara" && c.jati === sw.jati && c.arupaBase === sw.arupaBase
        ) ?? null
      );
    case "lokuttara":
      if (mode === 121) {
        return (
          CANONICAL_CITTAS_121.find(
            (c) =>
              c.family === "lokuttara" &&
              c.jati === sw.jati &&
              c.maggaStage === sw.maggaStage &&
              c.jhanaStage === (sw.jhanaStage ?? 1)
          ) ?? null
        );
      }
      return (
        CANONICAL_CITTAS_89.find(
          (c) => c.family === "lokuttara" && c.jati === sw.jati && c.maggaStage === sw.maggaStage
        ) ?? null
      );
    default:
      return null;
  }
}

export function getSynthesizableCittas(
  familyFilter?: CittaFamilyId | "all",
  mode: 89 | 121 = 121
): CanonicalCitta[] {
  const pool = mode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
  if (!familyFilter || familyFilter === "all") return [...pool];
  return pool.filter((c) => c.family === familyFilter);
}

export function pickNextBinaryChallenge(
  progress: MnemonicProgressState,
  familyFilter: CittaFamilyId | "all",
  currentId?: number,
  mode: 89 | 121 = 121
): CanonicalCitta {
  const pool = getSynthesizableCittas(familyFilter, mode);
  if (pool.length === 0) return CANONICAL_CITTAS_121[0]!;
  const sorted = [...pool].sort((a, b) => {
    const scoreA = progress.masteredBinary[`citta:${a.id}`] ?? 0;
    const scoreB = progress.masteredBinary[`citta:${b.id}`] ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.id - b.id;
  });
  const minScore = progress.masteredBinary[`citta:${sorted[0]!.id}`] ?? 0;
  const lowestPool = sorted.filter((c) => (progress.masteredBinary[`citta:${c.id}`] ?? 0) === minScore);
  const activePool = lowestPool.length > 1 ? lowestPool : sorted;
  if (currentId != null) {
    const curIdx = activePool.findIndex((c) => c.id === currentId);
    if (curIdx >= 0) {
      return activePool[(curIdx + 1) % activePool.length]!;
    }
  }
  const filtered = activePool.length > 1 && currentId != null ? activePool.filter((c) => c.id !== currentId) : activePool;
  const idx = progress.totalAttempts % filtered.length;
  return filtered[idx] ?? pool[0]!;
}

// ── PILAR 2: MOTOR DE SÍNTESE QUÍMICA E DETECTOR DE COLISÃO ONTOLÓGICA ───────

export interface ChemicalEvaluationResult {
  readonly isExactFixedMatch: boolean;
  readonly isExactFullSangahaMatch: boolean;
  readonly isValidConfiguration: boolean;
  readonly collisions: readonly OntologicalCollisionRule[];
  readonly missingFixed: readonly SabhavaElement[];
  readonly extraForbidden: readonly SabhavaElement[];
  readonly selectedOptional: readonly SabhavaElement[];
  readonly missingOptional: readonly SabhavaElement[];
  readonly simultaneousOptionalNote: boolean;
}

export function getCetasikaElementBySubId(cetasikaId: number): SabhavaElement | undefined {
  return PERIODIC_ELEMENTS_72.find((el) => el.paramattha === "cetasika" && el.subId === cetasikaId);
}

export function detectOntologicalCollisions(
  selectedCetasikaIds: ReadonlySet<number>,
  targetCitta?: CanonicalCitta
): OntologicalCollisionRule[] {
  const rules: OntologicalCollisionRule[] = [];
  const has = (id: number) => selectedCetasikaIds.has(id);
  const hasAny = (ids: readonly number[]) => ids.some((id) => selectedCetasikaIds.has(id));

  const hasAkusala = hasAny([14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]);
  const hasSobhana = hasAny([
    28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ]);

  // 1. Akusala × Sobhana
  if (hasAkusala && hasSobhana) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.akusala_sobhana!);
  }

  // 2. Diṭṭhi (#19) × Māna (#20)
  if (has(19) && has(20)) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.ditthi_mana!);
  }

  // 3. Lobha-trika (#18..20) × Dosa-catukka (#21..24)
  if (hasAny([18, 19, 20]) && hasAny([21, 22, 23, 24])) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.lobha_dosa!);
  }

  // 4. Adhimokkha (#10) × Vicikicchā (#27)
  if (has(10) && has(27)) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.adhimokkha_vicikiccha!);
  }

  // 5. Pīti (#12) em Dosa (#21..24) ou em Citta alvo sem Somanassa / 4º-5º Jhāna
  const targetForbidsPiti =
    targetCitta != null && !targetCitta.fixedCetasikas.includes(12) && !targetCitta.optionalCetasikas.includes(12);
  if (has(12) && (hasAny([21, 22, 23, 24, 27]) || targetForbidsPiti)) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.piti_feeling!);
  }

  // 6. Thīna-Middha (#25, #26) em Citta Asaṅkhārika (não-instigada)
  if (
    hasAny([25, 26]) &&
    targetCitta != null &&
    (targetCitta.bitSankhara === 1 ||
      (!targetCitta.optionalCetasikas.includes(25) && !targetCitta.fixedCetasikas.includes(25)))
  ) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.thina_asankharika!);
  }

  // 7. Issā (#22) × Macchariya (#23) × Kukkucca (#24) quando fora do modo Saṅgaha-naya de Dosa
  const dosaSecCount = [22, 23, 24].filter((id) => has(id)).length;
  if (dosaSecCount > 1 && (!targetCitta || targetCitta.family !== "dosa")) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.dosa_secondaries!);
  }

  // 8. Karuṇā (#50) × Muditā (#51) quando em Citta que não admite Appamaññā (ex. Lokuttara, Vipāka, 5º Jhāna)
  const appaCount = [50, 51].filter((id) => has(id)).length;
  const targetAllowsAppa = targetCitta != null && targetCitta.optionalCetasikas.includes(50);
  if ((appaCount > 0 && targetCitta != null && !targetAllowsAppa) || (appaCount > 1 && !targetAllowsAppa)) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.karuna_mudita!);
  }

  // 9. Thīna (#25) e Middha (#26) separados
  if (has(25) !== has(26)) {
    rules.push(ONTOLOGICAL_COLLISION_RULES.thina_pair_split!);
  }

  return rules;
}

export function evaluateChemicalSynthesis(
  targetCitta: CanonicalCitta,
  selectedCetasikaIds: ReadonlySet<number>
): ChemicalEvaluationResult {
  const allowedSet = new Set([...targetCitta.fixedCetasikas, ...targetCitta.optionalCetasikas]);

  const missingFixed: SabhavaElement[] = [];
  for (const fid of targetCitta.fixedCetasikas) {
    if (!selectedCetasikaIds.has(fid)) {
      const el = getCetasikaElementBySubId(fid);
      if (el) missingFixed.push(el);
    }
  }

  const extraForbidden: SabhavaElement[] = [];
  for (const sid of selectedCetasikaIds) {
    if (!allowedSet.has(sid)) {
      const el = getCetasikaElementBySubId(sid);
      if (el) extraForbidden.push(el);
    }
  }

  const selectedOptional: SabhavaElement[] = [];
  const missingOptional: SabhavaElement[] = [];
  for (const oid of targetCitta.optionalCetasikas) {
    const el = getCetasikaElementBySubId(oid);
    if (!el) continue;
    if (selectedCetasikaIds.has(oid)) {
      selectedOptional.push(el);
    } else {
      missingOptional.push(el);
    }
  }

  // Check if Thīna (25) and Middha (26) are split (only one selected)
  const has25 = selectedCetasikaIds.has(25);
  const has26 = selectedCetasikaIds.has(26);
  const thinaSplit = has25 !== has26;

  const collisions = detectOntologicalCollisions(selectedCetasikaIds, targetCitta);

  const isExactFixedMatch =
    missingFixed.length === 0 && extraForbidden.length === 0 && selectedOptional.length === 0;
  const isExactFullSangahaMatch =
    missingFixed.length === 0 && extraForbidden.length === 0 && missingOptional.length === 0;
  const isValidConfiguration =
    missingFixed.length === 0 && extraForbidden.length === 0 && !thinaSplit && collisions.length === 0;

  const dosaSecCount = [22, 23, 24].filter((id) => selectedCetasikaIds.has(id)).length;
  const appaCount = [50, 51].filter((id) => selectedCetasikaIds.has(id)).length;
  const viratiInKamaCount =
    targetCitta.bhumi === "kama" ? [47, 48, 49].filter((id) => selectedCetasikaIds.has(id)).length : 0;

  const simultaneousOptionalNote =
    dosaSecCount > 1 || appaCount + viratiInKamaCount > 1;

  return {
    isExactFixedMatch,
    isExactFullSangahaMatch,
    isValidConfiguration,
    collisions,
    missingFixed,
    extraForbidden,
    selectedOptional,
    missingOptional,
    simultaneousOptionalNote,
  };
}

/** Lista curada de Cittas arquetípicas para o desafio de Síntese Química (cobrindo todas as famílias) */
export const CHEMICAL_CHALLENGE_CITTA_IDS: readonly number[] = [
  1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 18, 27, 29, 30, 31, 33, 35, 39, 47, 55, 56, 57, 58, 59, 70, 82, 86,
];

export function pickNextPeriodicChallenge(
  progress: MnemonicProgressState,
  currentCittaId?: number
): CanonicalCitta {
  const pool = CHEMICAL_CHALLENGE_CITTA_IDS.map((id) => CANONICAL_CITTAS_89.find((c) => c.id === id)!).filter(
    Boolean
  );
  if (pool.length === 0) return CANONICAL_CITTAS_89[0]!;
  const sorted = [...pool].sort((a, b) => {
    const scoreA = progress.masteredPeriodic[`chem:${a.id}`] ?? 0;
    const scoreB = progress.masteredPeriodic[`chem:${b.id}`] ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.id - b.id;
  });
  const minScore = progress.masteredPeriodic[`chem:${sorted[0]!.id}`] ?? 0;
  const lowestPool = sorted.filter((c) => (progress.masteredPeriodic[`chem:${c.id}`] ?? 0) === minScore);
  const activePool = lowestPool.length > 1 ? lowestPool : sorted;
  if (currentCittaId != null) {
    const curIdx = activePool.findIndex((c) => c.id === currentCittaId);
    if (curIdx >= 0) {
      return activePool[(curIdx + 1) % activePool.length]!;
    }
  }
  const filtered = activePool.length > 1 && currentCittaId != null ? activePool.filter((c) => c.id !== currentCittaId) : activePool;
  const idx = progress.totalAttempts % filtered.length;
  return filtered[idx] ?? pool[0]!;
}

// ── PILAR 3: MOTOR DO ÁBACO NAS FALANGES ─────────────────────────────────────

export function getPhalanxMapById(id: PhalanxMapSpec["id"]): PhalanxMapSpec {
  return PHALANX_MAPS.find((m) => m.id === id) ?? PHALANX_MAPS[0]!;
}

export function pickNextPhalanxSlot(
  progress: MnemonicProgressState,
  mapSpec: PhalanxMapSpec,
  currentSlotIndex?: number
): PhalanxSlot {
  const slots = mapSpec.slots;
  const sorted = [...slots].sort((a, b) => {
    const scoreA = progress.masteredPhalanx[`${mapSpec.id}:${a.index}`] ?? 0;
    const scoreB = progress.masteredPhalanx[`${mapSpec.id}:${b.index}`] ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.index - b.index;
  });
  const minScore = progress.masteredPhalanx[`${mapSpec.id}:${sorted[0]!.index}`] ?? 0;
  const lowestPool = sorted.filter((s) => (progress.masteredPhalanx[`${mapSpec.id}:${s.index}`] ?? 0) === minScore);
  const activePool = lowestPool.length > 1 ? lowestPool : sorted;
  if (currentSlotIndex != null) {
    const curIdx = activePool.findIndex((s) => s.index === currentSlotIndex);
    if (curIdx >= 0) {
      return activePool[(curIdx + 1) % activePool.length]!;
    }
  }
  const filtered = activePool.length > 1 && currentSlotIndex != null ? activePool.filter((s) => s.index !== currentSlotIndex) : activePool;
  const idx = progress.totalAttempts % filtered.length;
  return filtered[idx] ?? slots[0]!;
}

// ── N-ARY MULTI-CHAPTER ENGINE (NAVA PARICCHEDĀ 1..9) ────────────────────────

export function getNaryItemsForChapter(
  chapterNum: CanonicalChapterNum,
  submatrixId?: string
): readonly NaryChallengeItem[] {
  let all: readonly NaryChallengeItem[];
  switch (chapterNum) {
    case 2:
      all = CHAPTER_2_ITEMS;
      break;
    case 3:
      all = CHAPTER_3_ITEMS;
      break;
    case 4:
      all = CHAPTER_4_ITEMS;
      break;
    case 5:
      all = CHAPTER_5_ITEMS;
      break;
    case 6:
      all = CHAPTER_6_ITEMS;
      break;
    case 7:
      all = CHAPTER_7_ITEMS;
      break;
    case 8:
      all = CHAPTER_8_ITEMS;
      break;
    case 9:
      all = CHAPTER_9_ITEMS;
      break;
    default:
      all = [];
      break;
  }
  if (!submatrixId || submatrixId === "all") return all;
  const filtered = all.filter((item) => (item.submatrix ?? item.primaryGroup) === submatrixId);
  return filtered.length > 0 ? filtered : all;
}

export function pickNextNaryChapterChallenge(
  chapterNum: CanonicalChapterNum,
  progress: MnemonicProgressState,
  currentItemId?: string,
  submatrixId?: string
): NaryChallengeItem {
  const items = getNaryItemsForChapter(chapterNum, submatrixId);
  if (items.length === 0) return CHAPTER_2_ITEMS[0]!;
  const sorted = [...items].sort((a, b) => {
    const scoreA = progress.masteredBinary[`nary:${a.id}`] ?? 0;
    const scoreB = progress.masteredBinary[`nary:${b.id}`] ?? 0;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.id.localeCompare(b.id);
  });
  const minScore = progress.masteredBinary[`nary:${sorted[0]!.id}`] ?? 0;
  const lowestPool = sorted.filter((i) => (progress.masteredBinary[`nary:${i.id}`] ?? 0) === minScore);
  const activePool = lowestPool.length > 1 ? lowestPool : sorted;
  if (currentItemId != null) {
    const curIdx = activePool.findIndex((i) => i.id === currentItemId);
    if (curIdx >= 0) {
      return activePool[(curIdx + 1) % activePool.length]!;
    }
  }
  const filtered = activePool.length > 1 && currentItemId != null ? activePool.filter((i) => i.id !== currentItemId) : activePool;
  const idx = progress.totalAttempts % filtered.length;
  return filtered[idx] ?? items[0]!;
}

export function defaultNarySwitchesForSubmatrix(
  chapterNum: CanonicalChapterNum,
  submatrixId?: string
): Record<string, string | number> {
  if (submatrixId && submatrixId !== "all") {
    const sm = getSubmatricesForChapter(chapterNum).find((m) => m.id === submatrixId);
    if (sm) return { ...sm.defaultSwitches };
  }
  return defaultNarySwitchesForChapter(chapterNum);
}

export function defaultNarySwitchesForChapter(
  chapterNum: CanonicalChapterNum
): Record<string, string | number> {
  switch (chapterNum) {
    case 2:
      return { lens: "sampayoga", group: "aññasamana", sub: "sabbacitta", slot: 1, sampayoga: 121 };
    case 3:
      return { category: "vedana", item: "somanassa", count: 62 };
    case 4:
      return { door: "pancadvara", vara: "tadarammana", vithicittas: 14 };
    case 5:
      return { tetrad: "bhumi_31", planeGroup: "apaya", slot: 1, lifespan: "unfixed" };
    case 6:
      return { section: "rupa_28", heading: "mahabhuta", slot: 1, samutthana: "catusamutthana" };
    case 7:
      return { compendium: "akusala_9", group: "asava", vatthuto: 3 };
    case 8:
      return { method: "paticcasamuppada", psMode: "links12", slot: 1, addha: "atita", vatta: "kilesavatta" };
    case 9:
    default:
      return { wing: "samatha_40", group: "kasina", slot: 1, reach: "jhana_5", nimitta: 3 };
  }
}

export function evaluateNaryChallenge(
  target: NaryChallengeItem,
  switches: Record<string, string | number>
): { isCorrect: boolean; matchedKeys: string[]; mismatchedKeys: string[] } {
  const targetSwitches = target.switches;
  const matchedKeys: string[] = [];
  const mismatchedKeys: string[] = [];

  for (const [key, val] of Object.entries(targetSwitches)) {
    if (String(switches[key]) === String(val)) {
      matchedKeys.push(key);
    } else {
      mismatchedKeys.push(key);
    }
  }

  const isCorrect = mismatchedKeys.length === 0;
  return { isCorrect, matchedKeys, mismatchedKeys };
}
