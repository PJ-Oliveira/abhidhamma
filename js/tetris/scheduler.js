export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30, 90];
export const LEARNING_STEPS_COUNT = 3;
const STORAGE_KEY_PREFIX = "atp.tetris.scheduler.v1";
export function createInitialCardState(id) {
    return {
        id,
        phase: "new",
        step: 0,
        box: 0,
        dueRound: 0,
        dueAtMs: 0,
        lapses: 0,
        seen: 0,
        correct: 0,
        lastRound: 0,
    };
}
export function createInitialSchedulerState() {
    return {
        cards: {},
        round: 0,
    };
}
export function loadSchedulerState(unit) {
    try {
        const key = unit !== undefined ? `${STORAGE_KEY_PREFIX}.u${unit}` : STORAGE_KEY_PREFIX;
        const raw = localStorage.getItem(key);
        if (!raw)
            return createInitialSchedulerState();
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.round === "number" && parsed.cards) {
            return parsed;
        }
    }
    catch {
    }
    return createInitialSchedulerState();
}
export function saveSchedulerState(state, unit) {
    try {
        const key = unit !== undefined ? `${STORAGE_KEY_PREFIX}.u${unit}` : STORAGE_KEY_PREFIX;
        localStorage.setItem(key, JSON.stringify(state));
    }
    catch {
    }
}
export function selectNextCard(unit, curriculum, scheduler, nowMs = Date.now()) {
    const unitCards = curriculum.getCardsForUnit(unit);
    if (unitCards.length === 0)
        return null;
    const cardsState = scheduler.cards;
    const currentRound = scheduler.round;
    const dueLearning = [];
    const futureLearning = [];
    const dueReview = [];
    const newCards = [];
    for (const card of unitCards) {
        const st = cardsState[card.id];
        if (!st || st.phase === "new") {
            newCards.push(card);
        }
        else if (st.phase === "learning" || st.phase === "relearning") {
            if (st.dueRound <= currentRound) {
                dueLearning.push({ card, state: st });
            }
            else {
                futureLearning.push({ card, state: st });
            }
        }
        else if (st.phase === "review") {
            if (st.dueAtMs <= nowMs) {
                dueReview.push({ card, state: st });
            }
        }
    }
    if (dueLearning.length > 0) {
        dueLearning.sort((a, b) => {
            if (b.state.lapses !== a.state.lapses)
                return b.state.lapses - a.state.lapses;
            return a.state.step - b.state.step;
        });
        return dueLearning[0]?.card ?? null;
    }
    if (dueReview.length > 0) {
        dueReview.sort((a, b) => a.state.dueAtMs - b.state.dueAtMs);
        return dueReview[0]?.card ?? null;
    }
    const eligibleNewAtoms = [];
    const eligibleNewDerived = [];
    for (const nc of newCards) {
        if (curriculum.arePrerequisitesMet(nc, scheduler)) {
            if (nc.kind === "atom") {
                eligibleNewAtoms.push(nc);
            }
            else {
                eligibleNewDerived.push(nc);
            }
        }
    }
    if (eligibleNewAtoms.length > 0) {
        return eligibleNewAtoms[0] ?? null;
    }
    if (eligibleNewDerived.length > 0) {
        return eligibleNewDerived[0] ?? null;
    }
    if (futureLearning.length > 0) {
        futureLearning.sort((a, b) => a.state.dueRound - b.state.dueRound);
        return futureLearning[0]?.card ?? null;
    }
    return unitCards[0] ?? null;
}
export function recordAnswer(cardId, isCorrect, scheduler, nowMs = Date.now()) {
    const currentRound = scheduler.round + 1;
    const existing = scheduler.cards[cardId] ?? createInitialCardState(cardId);
    let newPhase = existing.phase;
    let newStep = existing.step;
    let newBox = existing.box;
    let newDueRound = existing.dueRound;
    let newDueAtMs = existing.dueAtMs;
    let newLapses = existing.lapses;
    const newSeen = existing.seen + 1;
    const newCorrect = existing.correct + (isCorrect ? 1 : 0);
    if (isCorrect) {
        if (existing.phase === "new" || existing.phase === "learning" || existing.phase === "relearning") {
            newStep = existing.step + 1;
            if (newStep >= LEARNING_STEPS_COUNT) {
                newPhase = "review";
                newBox = 1;
                newDueRound = 0;
                const intervalDays = REVIEW_INTERVALS_DAYS[0] ?? 1;
                newDueAtMs = nowMs + intervalDays * 86400000;
            }
            else {
                newPhase = existing.phase === "relearning" ? "relearning" : "learning";
                newDueRound = currentRound + 2;
            }
        }
        else if (existing.phase === "review") {
            newBox = Math.min(existing.box + 1, REVIEW_INTERVALS_DAYS.length);
            const days = REVIEW_INTERVALS_DAYS[newBox - 1] ?? 30;
            newDueAtMs = nowMs + days * 86400000;
        }
    }
    else {
        newPhase = "relearning";
        newStep = 0;
        newLapses = existing.lapses + 1;
        newBox = 0;
        newDueRound = currentRound;
    }
    const updatedCard = {
        id: cardId,
        phase: newPhase,
        step: newStep,
        box: newBox,
        dueRound: newDueRound,
        dueAtMs: newDueAtMs,
        lapses: newLapses,
        seen: newSeen,
        correct: newCorrect,
        lastRound: currentRound,
    };
    return {
        round: currentRound,
        cards: {
            ...scheduler.cards,
            [cardId]: updatedCard,
        },
    };
}
export function computeUnitMastery(unit, curriculum, scheduler) {
    const cards = curriculum.getCardsForUnit(unit);
    const total = cards.length;
    if (total === 0) {
        return {
            totalCards: 0,
            newCards: 0,
            learningCards: 0,
            reviewCards: 0,
            masteredCards: 0,
            masteryPercent: 0,
            totalLapses: 0,
        };
    }
    let countNew = 0;
    let countLearning = 0;
    let countReview = 0;
    let countMastered = 0;
    let totalLapses = 0;
    for (const c of cards) {
        const st = scheduler.cards[c.id];
        if (!st || st.phase === "new") {
            countNew++;
        }
        else {
            totalLapses += st.lapses;
            if (st.phase === "learning" || st.phase === "relearning") {
                countLearning++;
            }
            else if (st.phase === "review") {
                countReview++;
                if (st.box >= 1) {
                    countMastered++;
                }
            }
        }
    }
    const masteryPercent = Math.round((countMastered / total) * 100);
    return {
        totalCards: total,
        newCards: countNew,
        learningCards: countLearning,
        reviewCards: countReview,
        masteredCards: countMastered,
        masteryPercent,
        totalLapses,
    };
}
//# sourceMappingURL=scheduler.js.map