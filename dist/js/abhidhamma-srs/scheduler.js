export const MINUTE_MS = 60_000;
export const DAY_MS = 86_400_000;
export const DEFAULT_LEARN_AHEAD_MS = 20 * MINUTE_MS;
export const MAX_NEW_CARDS_PER_DAY = 12;
export const MAX_REVIEWS_PER_DAY = 9999;
export const PACE_HORIZON_OPTIONS = [30, 60, 90];
export const PACE_DEFAULT_HORIZON_DAYS = 30;
export const PACE_RESERVE_DAYS = 12;
export const PACE_MIN_NEW = 1;
export const PACE_MAX_NEW = MAX_NEW_CARDS_PER_DAY;
export const LEECH_THRESHOLD = 4;
export function normalizeHorizonDays(days) {
    if (days === 30 || days === 60 || days === 90)
        return days;
    return PACE_DEFAULT_HORIZON_DAYS;
}
export function getReserveDaysForHorizon(horizonDays) {
    if (horizonDays === 30)
        return 0;
    if (horizonDays === 60)
        return 6;
    return PACE_RESERVE_DAYS;
}
export function getMaxIntervalForHorizon(horizonDays) {
    if (horizonDays === 30)
        return 10;
    if (horizonDays === 60)
        return 15;
    return 21;
}
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
    newCardsPerDay: MAX_NEW_CARDS_PER_DAY,
    maxReviewsPerDay: MAX_REVIEWS_PER_DAY,
    adaptivePace: true,
    paceHorizonDays: PACE_DEFAULT_HORIZON_DAYS,
    paceTargetMs: 0,
    maxIntervalDays: getMaxIntervalForHorizon(PACE_DEFAULT_HORIZON_DAYS),
    strictClinicalGrading: true,
    extraNewDate: "",
    extraNewCount: 0,
};
export function normalizeAnkiConfig(raw) {
    const merged = {
        ...DEFAULT_ANKI_CONFIG,
        ...(raw ?? {}),
    };
    const paceHorizonDays = normalizeHorizonDays(merged.paceHorizonDays);
    const rawNew = Number.isFinite(merged.newCardsPerDay)
        ? Math.floor(merged.newCardsPerDay)
        : MAX_NEW_CARDS_PER_DAY;
    const newCardsPerDay = Math.max(0, Math.min(MAX_NEW_CARDS_PER_DAY, rawNew));
    const defaultMaxIv = getMaxIntervalForHorizon(paceHorizonDays);
    const rawMaxIv = Number.isFinite(merged.maxIntervalDays) && merged.maxIntervalDays > 0
        ? Math.floor(merged.maxIntervalDays)
        : defaultMaxIv;
    const maxIntervalDays = Math.max(1, Math.min(defaultMaxIv, rawMaxIv));
    const extraNewCount = Number.isFinite(merged.extraNewCount) ? Math.max(0, Math.floor(merged.extraNewCount)) : 0;
    return {
        ...merged,
        paceHorizonDays,
        newCardsPerDay,
        maxReviewsPerDay: MAX_REVIEWS_PER_DAY,
        maxIntervalDays,
        strictClinicalGrading: merged.strictClinicalGrading !== false,
        extraNewCount,
    };
}
export function setPaceHorizon(config, horizonDays, nowMs = Date.now()) {
    const safeHorizon = normalizeHorizonDays(horizonDays);
    return normalizeAnkiConfig({
        ...config,
        adaptivePace: true,
        paceHorizonDays: safeHorizon,
        paceTargetMs: nowMs + safeHorizon * DAY_MS,
        maxIntervalDays: getMaxIntervalForHorizon(safeHorizon),
    });
}
export const STORAGE_STATES_KEY = "atp.abhidhamma.anki.cards.v1";
export const STORAGE_STATS_KEY = "atp.abhidhamma.anki.stats.v1";
export const STORAGE_CONFIG_KEY = "atp.abhidhamma.anki.config.v1";
export const STORAGE_MNEMONICS_KEY = "atp.abhidhamma.anki.mnemonics.v1";
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
            return normalizeAnkiConfig(parsed);
        }
    }
    catch {
    }
    return DEFAULT_ANKI_CONFIG;
}
export function saveAnkiConfig(config) {
    try {
        localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(normalizeAnkiConfig(config)));
    }
    catch {
    }
}
export function loadMnemonicNotes() {
    try {
        const raw = localStorage.getItem(STORAGE_MNEMONICS_KEY);
        if (!raw)
            return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch {
        return {};
    }
}
export function saveMnemonicNote(cardId, note) {
    const all = loadMnemonicNotes();
    const trimmed = note.trim();
    if (trimmed)
        all[cardId] = trimmed;
    else
        delete all[cardId];
    try {
        localStorage.setItem(STORAGE_MNEMONICS_KEY, JSON.stringify(all));
    }
    catch {
    }
    return all;
}
export function isRecitationCard(card) {
    return card.axis === "recitation";
}
export function isLeech(state, threshold = LEECH_THRESHOLD) {
    return state !== undefined && state.lapses >= threshold;
}
export function countLeeches(states, threshold = LEECH_THRESHOLD) {
    let n = 0;
    for (const st of Object.values(states)) {
        if (isLeech(st, threshold))
            n++;
    }
    return n;
}
export function ensurePaceTarget(config, nowMs = Date.now()) {
    const normalized = normalizeAnkiConfig(config);
    if (!normalized.adaptivePace || normalized.paceTargetMs > 0)
        return normalized;
    return { ...normalized, paceTargetMs: nowMs + normalized.paceHorizonDays * DAY_MS };
}
function toDayString(nowMs) {
    return new Date(nowMs).toISOString().slice(0, 10);
}
export function isReviewDue(state, nowMs = Date.now()) {
    if (!state || state.phase === "new")
        return false;
    if (state.phase === "review") {
        return state.dueAt <= nowMs || toDayString(state.dueAt) <= toDayString(nowMs);
    }
    return state.dueAt <= nowMs;
}
export function countDueCards(cards, states, nowMs = Date.now()) {
    let due = 0;
    for (const c of cards) {
        if (isReviewDue(states[c.id], nowMs))
            due++;
    }
    return due;
}
export function computeDailyNewQuota(cards, states, stats, config, nowMs = Date.now()) {
    const safe = normalizeAnkiConfig(config);
    const extra = safe.extraNewDate === toDayString(nowMs) ? Math.max(0, safe.extraNewCount) : 0;
    if (!safe.adaptivePace || safe.paceTargetMs <= 0) {
        return Math.min(MAX_NEW_CARDS_PER_DAY, safe.newCardsPerDay + extra);
    }
    let remaining = 0;
    for (const c of cards) {
        const st = states[c.id];
        if (!st || st.phase === "new")
            remaining++;
    }
    if (remaining === 0)
        return 0;
    const reserveDays = getReserveDaysForHorizon(safe.paceHorizonDays);
    const msLeft = safe.paceTargetMs - reserveDays * DAY_MS - nowMs;
    let base;
    if (msLeft <= 0) {
        const totalDaysLeft = Math.max(1, Math.ceil((safe.paceTargetMs - nowMs) / DAY_MS));
        base = Math.ceil((remaining + stats.newStudiedToday) / totalDaysLeft);
    }
    else {
        const daysLeft = Math.max(1, Math.ceil(msLeft / DAY_MS));
        base = Math.ceil((remaining + stats.newStudiedToday) / daysLeft);
    }
    base = base > 0 ? Math.min(PACE_MAX_NEW, Math.max(PACE_MIN_NEW, base)) : 0;
    const due = countDueCards(cards, states, nowMs);
    if (due >= 300)
        base = Math.ceil(base * 0.4);
    else if (due >= 200)
        base = Math.ceil(base * 0.6);
    else if (due >= 120)
        base = Math.ceil(base * 0.8);
    return Math.min(MAX_NEW_CARDS_PER_DAY, base + extra);
}
export function computePlan90Summary(cards, states, stats, config, nowMs = Date.now()) {
    const effective = ensurePaceTarget({ ...config, adaptivePace: true }, nowMs);
    const totalDays = effective.paceHorizonDays;
    const reserveDays = getReserveDaysForHorizon(totalDays);
    const maxIntervalDays = effective.maxIntervalDays;
    const startMs = effective.paceTargetMs - totalDays * DAY_MS;
    const elapsedDays = Math.floor(Math.max(0, nowMs - startMs) / DAY_MS);
    const currentDay = Math.min(totalDays, elapsedDays + 1);
    const daysRemaining = Math.max(0, Math.ceil((effective.paceTargetMs - nowMs) / DAY_MS));
    let memorizedCards = 0;
    let remainingNewCards = 0;
    let dueNowCount = 0;
    for (const c of cards) {
        const st = states[c.id];
        if (!st || st.phase === "new") {
            remainingNewCards++;
        }
        else {
            if (isCardMemorized(st))
                memorizedCards++;
            if (isReviewDue(st, nowMs))
                dueNowCount++;
        }
    }
    const isConsolidationPhase = remainingNewCards === 0 || (reserveDays > 0 && daysRemaining <= reserveDays);
    const dailyNewTarget = computeDailyNewQuota(cards, states, stats, effective, nowMs);
    const newRemainingToday = Math.max(0, Math.min(remainingNewCards, dailyNewTarget - stats.newStudiedToday));
    const progressPct = cards.length > 0 ? Math.round((memorizedCards / cards.length) * 100) : 100;
    return {
        currentDay,
        totalDays,
        reserveDays,
        maxIntervalDays,
        daysRemaining,
        isConsolidationPhase,
        totalCards: cards.length,
        memorizedCards,
        remainingNewCards,
        dailyNewTarget,
        newRemainingToday,
        dueNowCount,
        progressPct,
    };
}
export const computePacePlanSummary = computePlan90Summary;
export function interleaveByChapter(items) {
    const buckets = new Map();
    for (const it of items) {
        const arr = buckets.get(it.chapter);
        if (arr)
            arr.push(it);
        else
            buckets.set(it.chapter, [it]);
    }
    const lists = [...buckets.keys()].sort((a, b) => a - b).map((k) => buckets.get(k));
    const out = [];
    for (let i = 0; out.length < items.length; i++) {
        for (const l of lists) {
            if (i < l.length)
                out.push(l[i]);
        }
    }
    return out;
}
export function buildProgressiveCloze(paliText, stage) {
    const tokens = paliText.split(/\s+/).filter(Boolean);
    if (tokens.length === 0)
        return "";
    if (stage === 3) {
        const nonSlash = tokens.filter((t) => t !== "/");
        const cueLen = Math.min(2, Math.max(1, nonSlash.length - 1));
        const cue = nonSlash.slice(0, cueLen).join(" ").replace(/[.,;:?!]+$/, "");
        return `${cue} … [${nonSlash.length}]`;
    }
    if (stage === 2) {
        return tokens
            .map((tok) => {
            if (tok === "/")
                return "/";
            const m = /^([^A-Za-zĀĪŪṄÑṬḌṆḶṂāīūṅñṭḍṇḷṃ]*)([A-Za-zĀĪŪṄÑṬḌṆḶṂāīūṅñṭḍṇḷṃ])([A-Za-zĀĪŪṄÑṬḌṆḶṂāīūṅñṭḍṇḷṃ-]*)([^A-Za-zĀĪŪṄÑṬḌṆḶṂāīūṅñṭḍṇḷṃ]*)$/.exec(tok);
            if (!m)
                return tok;
            const [, pre, first, rest, post] = m;
            return rest && rest.length > 0 ? `${pre}${first}…${post}` : tok;
        })
            .join(" ");
    }
    let masked = 0;
    const out = tokens.map((tok, idx) => {
        if (tok === "/" || idx === 0)
            return tok;
        const stripped = tok.replace(/[^A-Za-zĀĪŪṄÑṬḌṆḶṂāīūṅñṭḍṇḷṃ]/g, "");
        if (stripped.length >= 5 && idx % 2 === 1) {
            masked++;
            const trail = tok.match(/[.,;:?!]+$/)?.[0] ?? "";
            return `_____${trail}`;
        }
        return tok;
    });
    if (masked === 0 && tokens.length > 1) {
        const lastIdx = tokens.length - 1;
        const trail = tokens[lastIdx].match(/[.,;:?!]+$/)?.[0] ?? "";
        out[lastIdx] = `_____${trail}`;
    }
    return out.join(" ");
}
export function defaultClozeStage(state) {
    const reps = state?.reps ?? 0;
    if (reps <= 0)
        return 1;
    if (reps === 1)
        return 2;
    return 3;
}
export function scheduleAnkiCard(prev, rating, nowMs = Date.now(), config = DEFAULT_ANKI_CONFIG) {
    const safeCfg = normalizeAnkiConfig(config);
    const steps = safeCfg.learningStepsMin.length > 0 ? safeCfg.learningStepsMin : [1, 10];
    const relearnSteps = safeCfg.relearningStepsMin.length > 0 ? safeCfg.relearningStepsMin : [10];
    const capInterval = (days) => Math.max(1, Math.min(safeCfg.maxIntervalDays, days));
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
                const days = capInterval(safeCfg.graduatingIntervalDays);
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
        const easyDays = capInterval(safeCfg.easyIntervalDays);
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
            const nextEase = Math.max(safeCfg.minEase, round2(prev.easeFactor - 0.2));
            const nextLapsedDays = capInterval(Math.round(baseInterval * safeCfg.lapseIntervalMultiplier));
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
        if (toDayString(prev.dueAt) > toDayString(nowMs) &&
            prev.dueAt > nowMs &&
            prev.lastReviewAt > 0 &&
            prev.dueAt > prev.lastReviewAt) {
            const elapsedRatio = Math.max(0, Math.min(1, (nowMs - prev.lastReviewAt) / (prev.dueAt - prev.lastReviewAt)));
            if (rating === 2) {
                const nextEase = Math.max(safeCfg.minEase, round2(prev.easeFactor - 0.05));
                const cappedBase = capInterval(baseInterval);
                return {
                    ...prev,
                    easeFactor: nextEase,
                    reps: prev.reps + 1,
                    dueAt: Math.max(prev.dueAt, nowMs + cappedBase * DAY_MS),
                    lastReviewAt: nowMs,
                };
            }
            const fullNext = rating === 4
                ? capInterval(Math.max(baseInterval + 2, Math.round(baseInterval * round2(prev.easeFactor + 0.15) * safeCfg.easyBonus)))
                : capInterval(Math.max(baseInterval + 1, Math.round(baseInterval * prev.easeFactor)));
            const nextDays = capInterval(Math.max(baseInterval, Math.round(baseInterval + (fullNext - baseInterval) * elapsedRatio)));
            const nextEase = rating === 4 ? round2(prev.easeFactor + 0.05 * elapsedRatio) : prev.easeFactor;
            return {
                ...prev,
                intervalDays: nextDays,
                easeFactor: nextEase,
                reps: prev.reps + 1,
                dueAt: Math.max(prev.dueAt, nowMs + nextDays * DAY_MS),
                lastReviewAt: nowMs,
            };
        }
        if (rating === 2) {
            const nextEase = Math.max(safeCfg.minEase, round2(prev.easeFactor - 0.15));
            const nextDays = capInterval(Math.max(baseInterval + 1, Math.round(baseInterval * safeCfg.hardIntervalMultiplier)));
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
            const nextDays = capInterval(Math.max(baseInterval + 1, Math.round(baseInterval * prev.easeFactor)));
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
        const nextDays = capInterval(Math.max(baseInterval + 2, Math.round(baseInterval * nextEase * safeCfg.easyBonus)));
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
            const days = capInterval(prev.lapsedIntervalDays);
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
    const easyDays = capInterval(Math.max(4, prev.lapsedIntervalDays + 1));
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
        let recitationTotal = 0;
        let recitationMemorized = 0;
        let leechCount = 0;
        for (const c of chCards) {
            const st = states[c.id];
            const mem = isCardMemorized(st);
            if (isLeech(st))
                leechCount++;
            if (isRecitationCard(c)) {
                recitationTotal++;
                if (mem)
                    recitationMemorized++;
                continue;
            }
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
        const totalMemorized = atomMemorized + structureMemorized + houseMemorized + recitationMemorized;
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
                    if (isReviewDue(st, nowMs)) {
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
            recitationTotal,
            recitationMemorized,
            leechCount,
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
    if (card.tier === "atom" || isRecitationCard(card))
        return true;
    let atomTotal = 0;
    let atomMemorized = 0;
    for (const c of chapterCards) {
        if (!isRecitationCard(c) && c.tier === "atom") {
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
export function buildStudyQueue(chapters, cards, states, stats, config = DEFAULT_ANKI_CONFIG, scopeChapter = null, nowMs = Date.now(), filterMode = "all") {
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
    let scopedCards = scopeChapter === null ? cards : cards.filter((c) => c.chapter === scopeChapter);
    if (filterMode === "concepts") {
        scopedCards = scopedCards.filter((c) => !isRecitationCard(c));
    }
    else if (filterMode === "recitation") {
        scopedCards = scopedCards.filter(isRecitationCard);
    }
    else if (filterMode === "leeches") {
        scopedCards = scopedCards.filter((c) => isLeech(states[c.id]));
    }
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
        if (filterMode === "leeches") {
            dueReview.push({ card, dueAt: st?.dueAt ?? nowMs });
            continue;
        }
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
            if (isReviewDue(st, nowMs)) {
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
        const recA = isRecitationCard(a) ? 1 : 0;
        const recB = isRecitationCard(b) ? 1 : 0;
        if (recA !== recB)
            return recA - recB;
        return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    });
    const dailyQuota = computeDailyNewQuota(cards, states, stats, config, nowMs);
    const remainingNewQuota = Math.max(0, Math.min(MAX_NEW_CARDS_PER_DAY, dailyQuota) - stats.newStudiedToday);
    const cappedNew = newUnlocked.slice(0, remainingNewQuota);
    const learningCards = dueLearning.map((x) => x.card);
    const reviewCards = interleaveByChapter(dueReview.map((x) => x.card)).slice(0, MAX_REVIEWS_PER_DAY);
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
export function buildEarlyReviewQueue(chapters, cards, states, scopeChapter = null, limit = MAX_REVIEWS_PER_DAY, nowMs = Date.now()) {
    const progressMap = computeAllChapterProgress(chapters, cards, states, nowMs);
    const scoped = scopeChapter === null ? cards : cards.filter((c) => c.chapter === scopeChapter);
    const candidates = [];
    for (const card of scoped) {
        const prog = progressMap.get(card.chapter);
        if (!prog || !prog.unlocked)
            continue;
        const st = states[card.id];
        if (!st || st.phase === "new")
            continue;
        const daysUntilDue = Math.max(0, (st.dueAt - nowMs) / DAY_MS);
        const fragility = (3 - st.easeFactor) * 4 + st.lapses * 2;
        const score = (st.phase === "review" ? 10 : 0) + daysUntilDue - fragility;
        candidates.push({ card, score, dueAt: st.dueAt });
    }
    candidates.sort((a, b) => a.score - b.score || a.dueAt - b.dueAt);
    return interleaveByChapter(candidates.slice(0, Math.max(1, limit)).map((x) => x.card));
}
export function computeProportionalExtraBatch(chapters, cards, states, scopeChapter = null, nowMs = Date.now(), stats) {
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
    const scoped = scopeChapter === null ? cards : cards.filter((c) => c.chapter === scopeChapter);
    let unlockedNew = 0;
    let studied = 0;
    let fragile = 0;
    for (const card of scoped) {
        const prog = progressMap.get(card.chapter);
        const meta = metaByChapter.get(card.chapter);
        const chCards = cardsByChapter.get(card.chapter) ?? [];
        if (!prog || !meta || !prog.unlocked)
            continue;
        const st = states[card.id];
        if (!st || st.phase === "new") {
            if (isCardUnlocked(card, chCards, meta, states, prog.unlocked))
                unlockedNew++;
        }
        else {
            studied++;
            if (st.lapses >= 2 || st.easeFactor < 2.1 || st.phase !== "review")
                fragile++;
        }
    }
    const remainingCapToday = Math.max(0, MAX_NEW_CARDS_PER_DAY - (stats?.newStudiedToday ?? 0));
    const extraNew = unlockedNew === 0 || remainingCapToday === 0
        ? 0
        : Math.min(unlockedNew, remainingCapToday, fragile >= 20 ? 3 : 6);
    const earlyReviews = Math.min(studied, MAX_REVIEWS_PER_DAY);
    return {
        extraNew,
        earlyReviews,
        hasMoreNew: unlockedNew > 0 && remainingCapToday > 0,
        hasReviewable: studied > 0,
    };
}
//# sourceMappingURL=scheduler.js.map