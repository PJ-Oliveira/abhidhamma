export type Lang = "pt" | "en" | "es";

export type Localized = Readonly<Record<Lang, string>>;

/**
 * Hierarquia epistêmica de complexidade ("Tijolos -> Casa"):
 * - `atom`: unidade atômica irredutível (definição, característica e mecânica de 1 dhamma discreto).
 * - `structure`: bloco intermediário (subgrupo, relação de associação ou regra operacional).
 * - `house`: edifício conceitual complexo (síntese arquitetônica dependente do acúmulo empírico de átomos).
 */
export type CardTier = "atom" | "structure" | "house";

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
  | "kammatthana";

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
}

export interface AbhidhammaCard {
  readonly id: string;
  readonly chapter: number;
  readonly axis: AbhidhammaAxis;
  readonly tier: CardTier;
  readonly requires: readonly string[];
  readonly paliTerm: Localized | string;
  readonly categoryLabel: Localized;
  readonly prompt: Localized;
  readonly answer: Localized;
  readonly characteristics?: CardCharacteristics;
  readonly mechanics?: Localized;
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
  readonly newCardsPerDay: number;
}

export interface AnkiStats {
  readonly totalReviewed: number;
  readonly reviewedToday: number;
  readonly correctToday: number;
  readonly newStudiedToday: number;
  readonly streak: number;
  readonly lastSessionDate: string;
}

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
  readonly totalMemorized: number;
  readonly totalMasteryPct: number;
  readonly newAvailableCount: number;
  readonly learningDueCount: number;
  readonly reviewDueCount: number;
  readonly lockedRemainingPrevAtoms: number;
}
