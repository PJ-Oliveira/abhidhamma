export type Lang = "pt" | "en" | "es";

export type Localized = Readonly<Record<Lang, string>>;

/**
 * Epistemic complexity hierarchy ("Bricks -> House"):
 * - `atom`: irreducible atomic unit (definition, characteristic, and mechanics of 1 discrete dhamma).
 * - `structure`: intermediate building block (subgroup, association relation, or operational rule).
 * - `house`: complex conceptual edifice (architectural synthesis dependent on empirical accumulation of atoms).
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

/** 1 = Again, 2 = Hard, 3 = Good, 4 = Easy */
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
  /** Daily limit of new cards (strictly capped at max 12/day). */
  readonly newCardsPerDay: number;
  /** Daily limit of reviews (fixed at maximum: 9999, never hiding pending reviews). */
  readonly maxReviewsPerDay: number;
  /** Automatic daily pace distributing the deck across the chosen horizon. */
  readonly adaptivePace: boolean;
  /** Chosen completion target horizon (30, 60, or 90 days). */
  readonly paceHorizonDays: PaceHorizonDays;
  /** Internal target timestamp (epoch ms) for automatic pacing; 0 = not yet initialized. */
  readonly paceTargetMs: number;
  /** Maximum review interval cap (in days) to sustain continuous review and high retention. */
  readonly maxIntervalDays: number;
  /** Strict clinical grading (only "Again" and "Good", without negotiating with "Hard"). */
  readonly strictClinicalGrading: boolean;
  /** Extra new cards manually unlocked only for the `extraNewDate` (YYYY-MM-DD). */
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
