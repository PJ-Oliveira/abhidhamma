import type {
  AbhidhammaCard,
  AbhidhammaChapterMeta,
  AnkiCardState,
  AnkiConfig,
  AnkiRating,
  AnkiStats,
  ChapterProgress,
  Lang,
} from "./types.js";

export const MINUTE_MS = 60_000;
export const DAY_MS = 86_400_000;
export const DEFAULT_LEARN_AHEAD_MS = 20 * MINUTE_MS;

export const DEFAULT_ANKI_CONFIG: AnkiConfig = {
  learningStepsMin: [1, 10],
  relearningStepsMin: [10],
  graduatingIntervalDays: 1,
  easyIntervalDays: 4,
  startingEase: 2.5,
  minEase: 1.3,
  hardIntervalMultiplier: 1.2,
  easyBonus: 1.3,
  lapseIntervalMultiplier: 0.5,
  newCardsPerDay: 25,
};

export const STORAGE_STATES_KEY = "atp.abhidhamma.anki.cards.v1";
export const STORAGE_STATS_KEY = "atp.abhidhamma.anki.stats.v1";
export const STORAGE_CONFIG_KEY = "atp.abhidhamma.anki.config.v1";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function createInitialAnkiCardState(
  id: string,
  config: AnkiConfig = DEFAULT_ANKI_CONFIG
): AnkiCardState {
  return {
    id,
    phase: "new",
    step: 0,
    intervalDays: 0,
    lapsedIntervalDays: 1,
    easeFactor: config.startingEase,
    reps: 0,
    lapses: 0,
    dueAt: 0,
    lastReviewAt: 0,
  };
}

export function createInitialAnkiStats(todayStr = new Date().toISOString().slice(0, 10)): AnkiStats {
  return {
    totalReviewed: 0,
    reviewedToday: 0,
    correctToday: 0,
    newStudiedToday: 0,
    streak: 0,
    lastSessionDate: todayStr,
  };
}

export function loadAnkiCardStates(): Record<string, AnkiCardState> {
  try {
    const raw = localStorage.getItem(STORAGE_STATES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, AnkiCardState>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveAnkiCardStates(states: Record<string, AnkiCardState>): void {
  try {
    localStorage.setItem(STORAGE_STATES_KEY, JSON.stringify(states));
  } catch {
    // ignore storage quota errors
  }
}

export function loadAnkiStats(nowMs = Date.now()): AnkiStats {
  const today = new Date(nowMs).toISOString().slice(0, 10);
  const yesterday = new Date(nowMs - DAY_MS).toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(STORAGE_STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AnkiStats;
      if (parsed.lastSessionDate === today) {
        return parsed;
      }
      return {
        totalReviewed: parsed.totalReviewed ?? 0,
        reviewedToday: 0,
        correctToday: 0,
        newStudiedToday: 0,
        streak: parsed.lastSessionDate === yesterday ? (parsed.streak ?? 0) : 0,
        lastSessionDate: today,
      };
    }
  } catch {
    // ignore
  }
  return createInitialAnkiStats(today);
}

export function saveAnkiStats(stats: AnkiStats): void {
  try {
    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function loadAnkiConfig(): AnkiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AnkiConfig>;
      return {
        ...DEFAULT_ANKI_CONFIG,
        ...parsed,
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_ANKI_CONFIG;
}

export function saveAnkiConfig(config: AnkiConfig): void {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Motor Anki SM-2:
 * - `new` / `learning`: passos intra-sessão em minutos; `Easy` gradua imediatamente (4d);
 *   `Good` avança passos e gradua ao completar (1d); `Hard` repete / média dos dois primeiros passos;
 *   `Again` reinicia para o passo 0 (1 min).
 * - `review`: `Again` provoca lapso (lapses++, ease -0.20, intervalo reduzido para relearning);
 *   `Hard` multiplica por 1.2 e reduz ease em 0.15; `Good` multiplica por easeFactor;
 *   `Easy` multiplica por easeFactor * 1.3 e aumenta ease em 0.15.
 * - `relearning`: passos de re-aprendizagem; ao graduar retorna para `review` com `lapsedIntervalDays`.
 */
export function scheduleAnkiCard(
  prev: AnkiCardState,
  rating: AnkiRating,
  nowMs = Date.now(),
  config: AnkiConfig = DEFAULT_ANKI_CONFIG
): AnkiCardState {
  const steps = config.learningStepsMin.length > 0 ? config.learningStepsMin : [1, 10];
  const relearnSteps = config.relearningStepsMin.length > 0 ? config.relearningStepsMin : [10];

  if (prev.phase === "new" || prev.phase === "learning") {
    const currentStep = Math.max(0, Math.min(prev.step, steps.length - 1));
    const step0Min = steps[0] ?? 1;
    const stepCurrMin = steps[currentStep] ?? step0Min;

    if (rating === 1) {
      return {
        ...prev,
        phase: "learning",
        step: 0,
        intervalDays: 0,
        dueAt: nowMs + step0Min * MINUTE_MS,
        lastReviewAt: nowMs,
      };
    }

    if (rating === 2) {
      const hardMin =
        currentStep === 0 && steps.length >= 2
          ? Math.max(1, Math.round((step0Min + (steps[1] ?? 10)) / 2))
          : stepCurrMin;
      return {
        ...prev,
        phase: "learning",
        step: currentStep,
        intervalDays: 0,
        dueAt: nowMs + hardMin * MINUTE_MS,
        lastReviewAt: nowMs,
      };
    }

    if (rating === 3) {
      const nextStep = prev.phase === "new" ? 1 : currentStep + 1;
      if (nextStep >= steps.length) {
        const days = Math.max(1, config.graduatingIntervalDays);
        return {
          ...prev,
          phase: "review",
          step: 0,
          intervalDays: days,
          reps: prev.reps + 1,
          dueAt: nowMs + days * DAY_MS,
          lastReviewAt: nowMs,
        };
      }
      const nextMin = steps[nextStep] ?? 10;
      return {
        ...prev,
        phase: "learning",
        step: nextStep,
        intervalDays: 0,
        dueAt: nowMs + nextMin * MINUTE_MS,
        lastReviewAt: nowMs,
      };
    }

    // rating === 4 (Easy)
    const easyDays = Math.max(1, config.easyIntervalDays);
    return {
      ...prev,
      phase: "review",
      step: 0,
      intervalDays: easyDays,
      reps: prev.reps + 1,
      dueAt: nowMs + easyDays * DAY_MS,
      lastReviewAt: nowMs,
    };
  }

  if (prev.phase === "review") {
    const baseInterval = Math.max(1, prev.intervalDays);

    if (rating === 1) {
      const nextEase = Math.max(config.minEase, round2(prev.easeFactor - 0.2));
      const nextLapsedDays = Math.max(1, Math.round(baseInterval * config.lapseIntervalMultiplier));
      const relearnMin = relearnSteps[0] ?? 10;
      return {
        ...prev,
        phase: "relearning",
        step: 0,
        intervalDays: 0,
        lapsedIntervalDays: nextLapsedDays,
        easeFactor: nextEase,
        lapses: prev.lapses + 1,
        dueAt: nowMs + relearnMin * MINUTE_MS,
        lastReviewAt: nowMs,
      };
    }

    if (rating === 2) {
      const nextEase = Math.max(config.minEase, round2(prev.easeFactor - 0.15));
      const nextDays = Math.max(baseInterval + 1, Math.round(baseInterval * config.hardIntervalMultiplier));
      return {
        ...prev,
        phase: "review",
        step: 0,
        intervalDays: nextDays,
        easeFactor: nextEase,
        reps: prev.reps + 1,
        dueAt: nowMs + nextDays * DAY_MS,
        lastReviewAt: nowMs,
      };
    }

    if (rating === 3) {
      const nextDays = Math.max(baseInterval + 1, Math.round(baseInterval * prev.easeFactor));
      return {
        ...prev,
        phase: "review",
        step: 0,
        intervalDays: nextDays,
        reps: prev.reps + 1,
        dueAt: nowMs + nextDays * DAY_MS,
        lastReviewAt: nowMs,
      };
    }

    // rating === 4 (Easy)
    const nextEase = round2(prev.easeFactor + 0.15);
    const nextDays = Math.max(
      baseInterval + 2,
      Math.round(baseInterval * nextEase * config.easyBonus)
    );
    return {
      ...prev,
      phase: "review",
      step: 0,
      intervalDays: nextDays,
      easeFactor: nextEase,
      reps: prev.reps + 1,
      dueAt: nowMs + nextDays * DAY_MS,
      lastReviewAt: nowMs,
    };
  }

  // phase === "relearning"
  const currentStep = Math.max(0, Math.min(prev.step, relearnSteps.length - 1));
  const step0Min = relearnSteps[0] ?? 10;
  const stepCurrMin = relearnSteps[currentStep] ?? step0Min;

  if (rating === 1) {
    return {
      ...prev,
      phase: "relearning",
      step: 0,
      intervalDays: 0,
      dueAt: nowMs + step0Min * MINUTE_MS,
      lastReviewAt: nowMs,
    };
  }

  if (rating === 2) {
    const hardMin = Math.max(stepCurrMin + 1, Math.round(stepCurrMin * 1.5));
    return {
      ...prev,
      phase: "relearning",
      step: currentStep,
      intervalDays: 0,
      dueAt: nowMs + hardMin * MINUTE_MS,
      lastReviewAt: nowMs,
    };
  }

  if (rating === 3) {
    const nextStep = currentStep + 1;
    if (nextStep >= relearnSteps.length) {
      const days = Math.max(1, prev.lapsedIntervalDays);
      return {
        ...prev,
        phase: "review",
        step: 0,
        intervalDays: days,
        reps: prev.reps + 1,
        dueAt: nowMs + days * DAY_MS,
        lastReviewAt: nowMs,
      };
    }
    const nextMin = relearnSteps[nextStep] ?? 10;
    return {
      ...prev,
      phase: "relearning",
      step: nextStep,
      intervalDays: 0,
      dueAt: nowMs + nextMin * MINUTE_MS,
      lastReviewAt: nowMs,
    };
  }

  // rating === 4 (Easy)
  const easyDays = Math.max(4, prev.lapsedIntervalDays + 1);
  return {
    ...prev,
    phase: "review",
    step: 0,
    intervalDays: easyDays,
    reps: prev.reps + 1,
    dueAt: nowMs + easyDays * DAY_MS,
    lastReviewAt: nowMs,
  };
}

export function formatIntervalDuration(deltaMs: number, lang: Lang): string {
  const safeMs = Math.max(MINUTE_MS, deltaMs);
  const mins = Math.round(safeMs / MINUTE_MS);
  if (mins < 60) {
    return `${mins} min`;
  }
  const hours = Math.round(safeMs / (60 * MINUTE_MS));
  if (hours < 24) {
    return `${hours} h`;
  }
  const days = Math.round(safeMs / DAY_MS);
  if (days < 30) {
    return `${days} d`;
  }
  if (days < 365) {
    const months = Math.round((days / 30) * 10) / 10;
    return `${months} ${lang === "pt" ? "m" : lang === "es" ? "mes" : "mo"}`;
  }
  const years = Math.round((days / 365) * 10) / 10;
  return `${years} ${lang === "pt" || lang === "es" ? "a" : "y"}`;
}

export function previewAnkiIntervals(
  state: AnkiCardState,
  lang: Lang,
  nowMs = Date.now(),
  config: AnkiConfig = DEFAULT_ANKI_CONFIG
): Record<AnkiRating, string> {
  return {
    1: formatIntervalDuration(scheduleAnkiCard(state, 1, nowMs, config).dueAt - nowMs, lang),
    2: formatIntervalDuration(scheduleAnkiCard(state, 2, nowMs, config).dueAt - nowMs, lang),
    3: formatIntervalDuration(scheduleAnkiCard(state, 3, nowMs, config).dueAt - nowMs, lang),
    4: formatIntervalDuration(scheduleAnkiCard(state, 4, nowMs, config).dueAt - nowMs, lang),
  };
}

// ── Conditional Progression & Brick-to-House Unlocking ──────────────────────

/**
 * Uma carta é empiricamente memorizada/consolidada quando graduou para a fase `review`
 * (ou seja, superou o ciclo inicial de aprendizado e não possui lapso pendente em `relearning`).
 */
export function isCardMemorized(state: AnkiCardState | undefined): boolean {
  return state !== undefined && state.phase === "review";
}

export function computeAllChapterProgress(
  chapters: readonly AbhidhammaChapterMeta[],
  cards: readonly AbhidhammaCard[],
  states: Readonly<Record<string, AnkiCardState>>,
  nowMs = Date.now()
): Map<number, ChapterProgress> {
  const byChapter = new Map<number, AbhidhammaCard[]>();
  for (const ch of chapters) {
    byChapter.set(ch.chapter, []);
  }
  for (const card of cards) {
    const arr = byChapter.get(card.chapter);
    if (arr) arr.push(card);
    else byChapter.set(card.chapter, [card]);
  }

  const ordered = [...chapters].sort((a, b) => a.chapter - b.chapter);
  const result = new Map<number, ChapterProgress>();

  for (let i = 0; i < ordered.length; i++) {
    const meta = ordered[i]!;
    const chCards = byChapter.get(meta.chapter) ?? [];

    let atomTotal = 0;
    let atomMemorized = 0;
    let structureTotal = 0;
    let structureMemorized = 0;
    let houseTotal = 0;
    let houseMemorized = 0;

    for (const c of chCards) {
      const mem = isCardMemorized(states[c.id]);
      if (c.tier === "atom") {
        atomTotal++;
        if (mem) atomMemorized++;
      } else if (c.tier === "structure") {
        structureTotal++;
        if (mem) structureMemorized++;
      } else {
        houseTotal++;
        if (mem) houseMemorized++;
      }
    }

    const totalCards = chCards.length;
    const totalMemorized = atomMemorized + structureMemorized + houseMemorized;
    const atomMasteryPct = atomTotal > 0 ? Math.round((atomMemorized / atomTotal) * 100) : 100;
    const totalMasteryPct = totalCards > 0 ? Math.round((totalMemorized / totalCards) * 100) : 100;

    let unlocked = true;
    let lockedRemainingPrevAtoms = 0;
    if (i > 0) {
      const prevMeta = ordered[i - 1]!;
      const prevProgress = result.get(prevMeta.chapter);
      if (prevProgress) {
        const requiredAtoms = Math.ceil((prevProgress.atomTotal * meta.unlockPrevAtomPct) / 100);
        unlocked = prevProgress.unlocked && prevProgress.atomMemorized >= requiredAtoms;
        lockedRemainingPrevAtoms = Math.max(0, requiredAtoms - prevProgress.atomMemorized);
      }
    }

    const houseUnlocked = unlocked && atomMasteryPct >= meta.houseUnlockAtomPct;

    let newAvailableCount = 0;
    let learningDueCount = 0;
    let reviewDueCount = 0;

    if (unlocked) {
      for (const c of chCards) {
        const st = states[c.id];
        if (!st || st.phase === "new") {
          if (isCardUnlocked(c, chCards, meta, states, unlocked)) {
            newAvailableCount++;
          }
        } else if (st.phase === "learning" || st.phase === "relearning") {
          if (st.dueAt <= nowMs) {
            learningDueCount++;
          }
        } else if (st.phase === "review") {
          if (st.dueAt <= nowMs) {
            reviewDueCount++;
          }
        }
      }
    }

    result.set(meta.chapter, {
      chapter: meta.chapter,
      unlocked,
      totalCards,
      atomTotal,
      atomMemorized,
      atomMasteryPct,
      structureTotal,
      structureMemorized,
      houseTotal,
      houseMemorized,
      houseUnlocked,
      totalMemorized,
      totalMasteryPct,
      newAvailableCount,
      learningDueCount,
      reviewDueCount,
      lockedRemainingPrevAtoms,
    });
  }

  return result;
}

export function isCardUnlocked(
  card: AbhidhammaCard,
  chapterCards: readonly AbhidhammaCard[],
  chapterMeta: AbhidhammaChapterMeta,
  states: Readonly<Record<string, AnkiCardState>>,
  chapterIsUnlocked: boolean
): boolean {
  if (!chapterIsUnlocked) return false;

  // 1. Explicit DAG prerequisite cards must all be empirically consolidated in `review`
  for (const reqId of card.requires) {
    if (!isCardMemorized(states[reqId])) {
      return false;
    }
  }

  // 2. Cumulative "Bricks -> House" empirical gate within the chapter
  if (card.tier === "atom") return true;

  let atomTotal = 0;
  let atomMemorized = 0;
  for (const c of chapterCards) {
    if (c.tier === "atom") {
      atomTotal++;
      if (isCardMemorized(states[c.id])) atomMemorized++;
    }
  }
  if (atomTotal === 0) return true;
  const pct = Math.round((atomMemorized / atomTotal) * 100);

  if (card.tier === "house") {
    return pct >= chapterMeta.houseUnlockAtomPct;
  }

  // `structure` requires at least 25% of chapter atoms memorized (or no atoms) plus explicit `requires`
  return pct >= 25;
}

export interface StudyQueueResult {
  readonly dueLearning: readonly AbhidhammaCard[];
  readonly dueReview: readonly AbhidhammaCard[];
  readonly newUnlocked: readonly AbhidhammaCard[];
  readonly learnAhead: readonly AbhidhammaCard[];
  readonly queue: readonly AbhidhammaCard[];
}

const TIER_ORDER: Record<AbhidhammaCard["tier"], number> = {
  atom: 0,
  structure: 1,
  house: 2,
};

/**
 * Constrói a fila Anki respeitando:
 * 1) Cartas em `learning`/`relearning` vencidas (dueAt <= nowMs)
 * 2) Cartas de `review` vencidas (dueAt <= nowMs)
 * 3) Novas cartas desbloqueadas (átomos/tijolos -> estruturas -> casa), limitadas por cota diária
 * 4) Learn-ahead para cartas em aprendizado dentro da janela de sessão caso nada mais esteja devido
 */
export function buildStudyQueue(
  chapters: readonly AbhidhammaChapterMeta[],
  cards: readonly AbhidhammaCard[],
  states: Readonly<Record<string, AnkiCardState>>,
  stats: AnkiStats,
  config: AnkiConfig = DEFAULT_ANKI_CONFIG,
  scopeChapter: number | null = null,
  nowMs = Date.now()
): StudyQueueResult {
  const progressMap = computeAllChapterProgress(chapters, cards, states, nowMs);
  const metaByChapter = new Map(chapters.map((m) => [m.chapter, m]));
  const cardsByChapter = new Map<number, AbhidhammaCard[]>();
  for (const c of cards) {
    const arr = cardsByChapter.get(c.chapter);
    if (arr) arr.push(c);
    else cardsByChapter.set(c.chapter, [c]);
  }

  const scopedCards =
    scopeChapter === null ? cards : cards.filter((c) => c.chapter === scopeChapter);

  const dueLearning: { card: AbhidhammaCard; dueAt: number }[] = [];
  const learnAhead: { card: AbhidhammaCard; dueAt: number }[] = [];
  const dueReview: { card: AbhidhammaCard; dueAt: number }[] = [];
  const newUnlocked: AbhidhammaCard[] = [];

  for (const card of scopedCards) {
    const prog = progressMap.get(card.chapter);
    const meta = metaByChapter.get(card.chapter);
    const chCards = cardsByChapter.get(card.chapter) ?? [];
    if (!prog || !meta || !prog.unlocked) continue;

    const st = states[card.id];
    if (!st || st.phase === "new") {
      if (isCardUnlocked(card, chCards, meta, states, prog.unlocked)) {
        newUnlocked.push(card);
      }
    } else if (st.phase === "learning" || st.phase === "relearning") {
      if (st.dueAt <= nowMs) {
        dueLearning.push({ card, dueAt: st.dueAt });
      } else if (st.dueAt <= nowMs + DEFAULT_LEARN_AHEAD_MS) {
        learnAhead.push({ card, dueAt: st.dueAt });
      }
    } else if (st.phase === "review") {
      if (st.dueAt <= nowMs) {
        dueReview.push({ card, dueAt: st.dueAt });
      }
    }
  }

  dueLearning.sort((a, b) => a.dueAt - b.dueAt);
  learnAhead.sort((a, b) => a.dueAt - b.dueAt);
  dueReview.sort((a, b) => a.dueAt - b.dueAt);
  newUnlocked.sort((a, b) => {
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
  });

  const remainingNewQuota = Math.max(0, config.newCardsPerDay - stats.newStudiedToday);
  const cappedNew = newUnlocked.slice(0, remainingNewQuota);

  const learningCards = dueLearning.map((x) => x.card);
  const reviewCards = dueReview.map((x) => x.card);
  const aheadCards = learnAhead.map((x) => x.card);

  const queue: AbhidhammaCard[] = [...learningCards, ...reviewCards, ...cappedNew];
  if (queue.length === 0 && aheadCards.length > 0) {
    queue.push(...aheadCards);
  }

  return {
    dueLearning: learningCards,
    dueReview: reviewCards,
    newUnlocked: cappedNew,
    learnAhead: aheadCards,
    queue,
  };
}
