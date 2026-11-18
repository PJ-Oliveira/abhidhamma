export type Lang = "pt" | "en" | "es";

export type Localized = Readonly<Record<Lang, string>>;

/**
 * Hierarquia epistêmica de complexidade ("Tijolos -> Casa"):
 * - `atom`: unidade atômica irredutível (definição, característica e mecânica de 1 dhamma discreto).
 * - `structure`: bloco intermediário (subgrupo, relação de associação ou regra operacional).
 * - `house`: edifício conceitual complexo (síntese arquitetônica dependente do acúmulo empírico de átomos).
 */
export type CardTier = "atom" | "structure" | "house";

export type CardMode =
  | "standard"
  | "checksum"
  | "enumeration"
  | "sequence"
  | "confusable"
  | "cloze_pali";

export type StudyFilterMode = "all" | "concepts" | "recitation" | "leeches";

export type AbhidhammaAxis =
  | "paramattha"
  | "citta"
  | "cetasika"
  | "pakinnaka"
  | "vithi"
  | "vithimutta"
  | "rupa"
  | "nibbana"
  | "samuccaya"
  | "paccaya"
  | "kammatthana"
  | "recitation";

export interface CardCharacteristics {
  readonly lakkhana?: Localized;
  readonly rasa?: Localized;
  readonly paccupatthana?: Localized;
  readonly padatthana?: Localized;
}

export interface CardSourceRef {
  readonly as?: string;
  readonly cma?: string;
  readonly segId?: number;
  readonly segIds?: readonly number[];
}

export interface AbhidhammaCard {
  readonly id: string;
  readonly chapter: number;
  readonly axis: AbhidhammaAxis;
  readonly tier: CardTier;
  readonly mode?: CardMode;
  readonly requires: readonly string[];
  readonly paliTerm: Localized | string;
  readonly categoryLabel: Localized;
  readonly prompt: Localized;
  readonly answer: Localized;
  readonly characteristics?: CardCharacteristics;
  readonly mechanics?: Localized;
  readonly mathStructure?: Localized;
  readonly checklist?: readonly Localized[];
  readonly sequenceItems?: readonly Localized[];
  readonly isGatha?: boolean;
  readonly paliText?: string;
  readonly source: CardSourceRef;
}

export interface AbhidhammaChapterMeta {
  readonly chapter: number;
  readonly paliTitle: string;
  readonly title: Localized;
  readonly subtitle: Localized;
  readonly unlockPrevAtomPct: number;
  readonly houseUnlockAtomPct: number;
}

export interface AbhidhammaDataset {
  readonly version: number;
  readonly chapters: readonly AbhidhammaChapterMeta[];
  readonly cards: readonly AbhidhammaCard[];
}

// ── Anki SM-2 State & Scheduling ────────────────────────────────────────────

/** 1 = Again (Errei), 2 = Hard (Difícil), 3 = Good (Bom), 4 = Easy (Fácil) */
export type AnkiRating = 1 | 2 | 3 | 4;

export type AnkiPhase = "new" | "learning" | "review" | "relearning";

export interface AnkiCardState {
  readonly id: string;
  readonly phase: AnkiPhase;
  readonly step: number;
  readonly intervalDays: number;
  readonly lapsedIntervalDays: number;
  readonly easeFactor: number;
  readonly reps: number;
  readonly lapses: number;
  readonly dueAt: number;
  readonly lastReviewAt: number;
}

export type PaceHorizonDays = 30 | 60 | 90;

export interface AnkiConfig {
  readonly learningStepsMin: readonly number[];
  readonly relearningStepsMin: readonly number[];
  readonly graduatingIntervalDays: number;
  readonly easyIntervalDays: number;
  readonly startingEase: number;
  readonly minEase: number;
  readonly hardIntervalMultiplier: number;
  readonly easyBonus: number;
  readonly lapseIntervalMultiplier: number;
  /** Limite diário de cartas novas (sempre limitado a no máximo 12/dia). */
  readonly newCardsPerDay: number;
  /** Limite diário de revisões (fixado no máximo: 9999, nunca ocultando revisões pendentes). */
  readonly maxReviewsPerDay: number;
  /** Ritmo automático diário distribuindo o baralho ao longo da jornada. */
  readonly adaptivePace: boolean;
  /** Meta escolhida de conclusão (30, 60 ou 90 dias). */
  readonly paceHorizonDays: PaceHorizonDays;
  /** Data-alvo interna (epoch ms) do ritmo automático; 0 = ainda não inicializada. */
  readonly paceTargetMs: number;
  /** Teto máximo de intervalo (em dias) para manter revisão contínua e alta retenção. */
  readonly maxIntervalDays: number;
  /** Avaliação clínica estrita (apenas "De novo" e "Bom", sem negociar com "Difícil"). */
  readonly strictClinicalGrading: boolean;
  /** Cartas novas extras liberadas manualmente apenas para o dia `extraNewDate` (YYYY-MM-DD). */
  readonly extraNewDate: string;
  readonly extraNewCount: number;
}

export interface AnkiStats {
  readonly totalReviewed: number;
  readonly reviewedToday: number;
  readonly correctToday: number;
  readonly newStudiedToday: number;
  readonly streak: number;
  readonly lastSessionDate: string;
}

export interface Plan90Summary {
  readonly currentDay: number;
  readonly totalDays: number;
  readonly reserveDays: number;
  readonly maxIntervalDays: number;
  readonly daysRemaining: number;
  readonly isConsolidationPhase: boolean;
  readonly totalCards: number;
  readonly memorizedCards: number;
  readonly remainingNewCards: number;
  readonly dailyNewTarget: number;
  readonly newRemainingToday: number;
  readonly dueNowCount: number;
  readonly progressPct: number;
}

export type PacePlanSummary = Plan90Summary;

export interface ChapterProgress {
  readonly chapter: number;
  readonly unlocked: boolean;
  readonly totalCards: number;
  readonly atomTotal: number;
  readonly atomMemorized: number;
  readonly atomMasteryPct: number;
  readonly structureTotal: number;
  readonly structureMemorized: number;
  readonly houseTotal: number;
  readonly houseMemorized: number;
  readonly houseUnlocked: boolean;
  readonly recitationTotal: number;
  readonly recitationMemorized: number;
  readonly leechCount: number;
  readonly totalMemorized: number;
  readonly totalMasteryPct: number;
  readonly newAvailableCount: number;
  readonly learningDueCount: number;
  readonly reviewDueCount: number;
  readonly lockedRemainingPrevAtoms: number;
}
