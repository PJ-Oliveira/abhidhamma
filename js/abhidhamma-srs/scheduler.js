export const MINUTE_MS = 60_000;
export const DAY_MS = 86_400_000;
export const DEFAULT_LEARN_AHEAD_MS = 20 * MINUTE_MS;
export const DEFAULT_ANKI_CONFIG = {
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
function round2(n) {
    return Math.round(n * 100) / 100;
}
export function createInitialAnkiCardState(id, config = DEFAULT_ANKI_CONFIG) {
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
export function createInitialAnkiStats(todayStr = new Date().toISOString().slice(0, 10)) {
    return {
        totalReviewed: 0,
        reviewedToday: 0,
        correctToday: 0,
        newStudiedToday: 0,
        streak: 0,
        lastSessionDate: todayStr,
    };
}
export function loadAnkiCardStates() {
    try {
        const raw = localStorage.getItem(STORAGE_STATES_KEY);
        if (!raw)
            return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
export function saveAnkiCardStates(states) {
    try {
        localStorage.setItem(STORAGE_STATES_KEY, JSON.stringify(states));
    }
    catch {
    }
}
export function loadAnkiStats(nowMs = Date.now()) {
    const today = new Date(nowMs).toISOString().slice(0, 10);
    const yesterday = new Date(nowMs - DAY_MS).toISOString().slice(0, 10);
    try {
        const raw = localStorage.getItem(STORAGE_STATS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
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
    }
    catch {
    }
    return createInitialAnkiStats(today);
}
export function saveAnkiStats(stats) {
    try {
        localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    }
    catch {
    }
}
export function loadAnkiConfig() {
    try {
        const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                ...DEFAULT_ANKI_CONFIG,
                ...parsed,
            };
        }
    }
    catch {
    }
    return DEFAULT_ANKI_CONFIG;
}
export function saveAnkiConfig(config) {
    try {
        localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    }
    catch {
    }
}
export function scheduleAnkiCard(prev, rating, nowMs = Date.now(), config = DEFAULT_ANKI_CONFIG) {
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
            const hardMin = currentStep === 0 && steps.length >= 2
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
        const nextEase = round2(prev.easeFactor + 0.15);
        const nextDays = Math.max(baseInterval + 2, Math.round(baseInterval * nextEase * config.easyBonus));
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
export function formatIntervalDuration(deltaMs, lang) {
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
export function previewAnkiIntervals(state, lang, nowMs = Date.now(), config = DEFAULT_ANKI_CONFIG) {
    return {
        1: formatIntervalDuration(scheduleAnkiCard(state, 1, nowMs, config).dueAt - nowMs, lang),
        2: formatIntervalDuration(scheduleAnkiCard(state, 2, nowMs, config).dueAt - nowMs, lang),
        3: formatIntervalDuration(scheduleAnkiCard(state, 3, nowMs, config).dueAt - nowMs, lang),
        4: formatIntervalDuration(scheduleAnkiCard(state, 4, nowMs, config).dueAt - nowMs, lang),
    };
}
export function isCardMemorized(state) {
    return state !== undefined && state.phase === "review";
}
export function computeAllChapterProgress(chapters, cards, states, nowMs = Date.now()) {
    const byChapter = new Map();
    for (const ch of chapters) {
        byChapter.set(ch.chapter, []);
    }
    for (const card of cards) {
        const arr = byChapter.get(card.chapter);
        if (arr)
            arr.push(card);
        else
            byChapter.set(card.chapter, [card]);
    }
    const ordered = [...chapters].sort((a, b) => a.chapter - b.chapter);
    const result = new Map();
    for (let i = 0; i < ordered.length; i++) {
        const meta = ordered[i];
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
                if (mem)
                    atomMemorized++;
            }
            else if (c.tier === "structure") {
                structureTotal++;
                if (mem)
                    structureMemorized++;
            }
            else {
                houseTotal++;
                if (mem)
                    houseMemorized++;
            }
        }
        const totalCards = chCards.length;
        const totalMemorized = atomMemorized + structureMemorized + houseMemorized;
        const atomMasteryPct = atomTotal > 0 ? Math.round((atomMemorized / atomTotal) * 100) : 100;
        const totalMasteryPct = totalCards > 0 ? Math.round((totalMemorized / totalCards) * 100) : 100;
        let unlocked = true;
        let lockedRemainingPrevAtoms = 0;
        if (i > 0) {
            const prevMeta = ordered[i - 1];
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
                }
                else if (st.phase === "learning" || st.phase === "relearning") {
                    if (st.dueAt <= nowMs) {
                        learningDueCount++;
                    }
                }
                else if (st.phase === "review") {
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
export function isCardUnlocked(card, chapterCards, chapterMeta, states, chapterIsUnlocked) {
    if (!chapterIsUnlocked)
        return false;
    for (const reqId of card.requires) {
        if (!isCardMemorized(states[reqId])) {
            return false;
        }
    }
    if (card.tier === "atom")
        return true;
    let atomTotal = 0;
    let atomMemorized = 0;
    for (const c of chapterCards) {
        if (c.tier === "atom") {
            atomTotal++;
            if (isCardMemorized(states[c.id]))
                atomMemorized++;
        }
    }
    if (atomTotal === 0)
        return true;
    const pct = Math.round((atomMemorized / atomTotal) * 100);
    if (card.tier === "house") {
        return pct >= chapterMeta.houseUnlockAtomPct;
    }
    return pct >= 25;
}
const TIER_ORDER = {
    atom: 0,
    structure: 1,
    house: 2,
};
export function buildStudyQueue(chapters, cards, states, stats, config = DEFAULT_ANKI_CONFIG, scopeChapter = null, nowMs = Date.now()) {
    const progressMap = computeAllChapterProgress(chapters, cards, states, nowMs);
    const metaByChapter = new Map(chapters.map((m) => [m.chapter, m]));
    const cardsByChapter = new Map();
    for (const c of cards) {
        const arr = cardsByChapter.get(c.chapter);
        if (arr)
            arr.push(c);
        else
            cardsByChapter.set(c.chapter, [c]);
    }
    const scopedCards = scopeChapter === null ? cards : cards.filter((c) => c.chapter === scopeChapter);
    const dueLearning = [];
    const learnAhead = [];
    const dueReview = [];
    const newUnlocked = [];
    for (const card of scopedCards) {
        const prog = progressMap.get(card.chapter);
        const meta = metaByChapter.get(card.chapter);
        const chCards = cardsByChapter.get(card.chapter) ?? [];
        if (!prog || !meta || !prog.unlocked)
            continue;
        const st = states[card.id];
        if (!st || st.phase === "new") {
            if (isCardUnlocked(card, chCards, meta, states, prog.unlocked)) {
                newUnlocked.push(card);
            }
        }
        else if (st.phase === "learning" || st.phase === "relearning") {
            if (st.dueAt <= nowMs) {
                dueLearning.push({ card, dueAt: st.dueAt });
            }
            else if (st.dueAt <= nowMs + DEFAULT_LEARN_AHEAD_MS) {
                learnAhead.push({ card, dueAt: st.dueAt });
            }
        }
        else if (st.phase === "review") {
            if (st.dueAt <= nowMs) {
                dueReview.push({ card, dueAt: st.dueAt });
            }
        }
    }
    dueLearning.sort((a, b) => a.dueAt - b.dueAt);
    learnAhead.sort((a, b) => a.dueAt - b.dueAt);
    dueReview.sort((a, b) => a.dueAt - b.dueAt);
    newUnlocked.sort((a, b) => {
        if (a.chapter !== b.chapter)
            return a.chapter - b.chapter;
        return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    });
    const remainingNewQuota = Math.max(0, config.newCardsPerDay - stats.newStudiedToday);
    const cappedNew = newUnlocked.slice(0, remainingNewQuota);
    const learningCards = dueLearning.map((x) => x.card);
    const reviewCards = dueReview.map((x) => x.card);
    const aheadCards = learnAhead.map((x) => x.card);
    const queue = [...learningCards, ...reviewCards, ...cappedNew];
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
//# sourceMappingURL=scheduler.js.map