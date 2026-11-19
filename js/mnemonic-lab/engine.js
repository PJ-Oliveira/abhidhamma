import { CANONICAL_CITTAS_89, ONTOLOGICAL_COLLISION_RULES, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=d3104d40";
export const MNEMONIC_STORAGE_KEY = "abhidhamma_mnemonic_lab_v1";
export function createInitialProgress() {
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
export function loadMnemonicProgress() {
    try {
        const raw = localStorage.getItem(MNEMONIC_STORAGE_KEY);
        if (!raw)
            return createInitialProgress();
        const parsed = JSON.parse(raw);
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
    catch {
        return createInitialProgress();
    }
}
export function saveMnemonicProgress(state) {
    try {
        localStorage.setItem(MNEMONIC_STORAGE_KEY, JSON.stringify(state));
    }
    catch {
    }
}
export function recordMnemonicAttempt(state, pillar, itemKey, isCorrect) {
    const nextStreak = isCorrect ? state.streak + 1 : 0;
    const nextBest = Math.max(state.bestStreak, nextStreak);
    const nextCorrect = state.totalCorrect + (isCorrect ? 1 : 0);
    const nextAttempts = state.totalAttempts + 1;
    const updateMap = (map) => {
        const copy = { ...map };
        const prev = copy[itemKey] ?? 0;
        copy[itemKey] = isCorrect ? prev + 1 : Math.max(0, prev - 1);
        return copy;
    };
    const next = {
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
export function defaultSwitchStateForFamily(family) {
    switch (family) {
        case "lobha":
            return { family, jati: "akusala", bitVedana: 1, bitCognitive: 1, bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "dosa":
            return { family, jati: "akusala", bitVedana: "domanassa", bitCognitive: "patigha", bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "moha":
            return { family, jati: "akusala", bitVedana: 0, bitCognitive: "vicikiccha", bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "kamasobhana":
            return { family, jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "rupavacara":
            return { family, jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "arupavacara":
            return { family, jati: "kusala", bitVedana: 0, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 5, arupaBase: 1, maggaStage: 1 };
        case "lokuttara":
            return { family, jati: "kusala", bitVedana: 1, bitCognitive: 1, bitSankhara: "fixed", jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
        case "ahetuka":
        default:
            return { family: "lobha", jati: "akusala", bitVedana: 1, bitCognitive: 1, bitSankhara: 1, jhanaStage: 1, arupaBase: 1, maggaStage: 1 };
    }
}
export function resolveCittaFromSwitches(sw) {
    switch (sw.family) {
        case "lobha":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "lobha" &&
                c.bitVedana === sw.bitVedana &&
                c.bitCognitive === sw.bitCognitive &&
                c.bitSankhara === sw.bitSankhara) ?? null);
        case "dosa":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "dosa" && c.bitSankhara === sw.bitSankhara) ?? null);
        case "moha":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "moha" && c.bitCognitive === sw.bitCognitive) ?? null);
        case "kamasobhana":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "kamasobhana" &&
                c.jati === sw.jati &&
                c.bitVedana === sw.bitVedana &&
                c.bitCognitive === sw.bitCognitive &&
                c.bitSankhara === sw.bitSankhara) ?? null);
        case "rupavacara":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "rupavacara" && c.jati === sw.jati && c.jhanaStage === sw.jhanaStage) ?? null);
        case "arupavacara":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "arupavacara" && c.jati === sw.jati && c.arupaBase === sw.arupaBase) ?? null);
        case "lokuttara":
            return (CANONICAL_CITTAS_89.find((c) => c.family === "lokuttara" && c.jati === sw.jati && c.maggaStage === sw.maggaStage) ?? null);
        default:
            return null;
    }
}
export function getSynthesizableCittas(familyFilter) {
    const pool = CANONICAL_CITTAS_89.filter((c) => c.family !== "ahetuka");
    if (!familyFilter || familyFilter === "all")
        return pool;
    return pool.filter((c) => c.family === familyFilter);
}
export function pickNextBinaryChallenge(progress, familyFilter, currentId) {
    const pool = getSynthesizableCittas(familyFilter);
    const candidates = pool.length > 1 && currentId != null ? pool.filter((c) => c.id !== currentId) : pool;
    const sorted = [...candidates].sort((a, b) => {
        const scoreA = progress.masteredBinary[`citta:${a.id}`] ?? 0;
        const scoreB = progress.masteredBinary[`citta:${b.id}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id - b.id;
    });
    const topBucket = sorted.slice(0, Math.min(4, sorted.length));
    const idx = (progress.totalAttempts + (currentId ?? 0)) % topBucket.length;
    return topBucket[idx] ?? pool[0];
}
export function getCetasikaElementBySubId(cetasikaId) {
    return PERIODIC_ELEMENTS_72.find((el) => el.paramattha === "cetasika" && el.subId === cetasikaId);
}
export function detectOntologicalCollisions(selectedCetasikaIds, targetCitta) {
    const rules = [];
    const has = (id) => selectedCetasikaIds.has(id);
    const hasAny = (ids) => ids.some((id) => selectedCetasikaIds.has(id));
    const hasAkusala = hasAny([14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]);
    const hasSobhana = hasAny([
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
    ]);
    if (hasAkusala && hasSobhana) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.akusala_sobhana);
    }
    if (has(19) && has(20)) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.ditthi_mana);
    }
    if (hasAny([18, 19, 20]) && hasAny([21, 22, 23, 24])) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.lobha_dosa);
    }
    if (has(10) && has(27)) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.adhimokkha_vicikiccha);
    }
    const targetForbidsPiti = targetCitta != null && !targetCitta.fixedCetasikas.includes(12) && !targetCitta.optionalCetasikas.includes(12);
    if (has(12) && (hasAny([21, 22, 23, 24, 27]) || targetForbidsPiti)) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.piti_feeling);
    }
    if (hasAny([25, 26]) &&
        targetCitta != null &&
        (targetCitta.bitSankhara === 1 ||
            (!targetCitta.optionalCetasikas.includes(25) && !targetCitta.fixedCetasikas.includes(25)))) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.thina_asankharika);
    }
    const dosaSecCount = [22, 23, 24].filter((id) => has(id)).length;
    if (dosaSecCount > 1 && (!targetCitta || targetCitta.family !== "dosa")) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.dosa_secondaries);
    }
    const appaCount = [50, 51].filter((id) => has(id)).length;
    const targetAllowsAppa = targetCitta != null && targetCitta.optionalCetasikas.includes(50);
    if ((appaCount > 0 && targetCitta != null && !targetAllowsAppa) || (appaCount > 1 && !targetAllowsAppa)) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.karuna_mudita);
    }
    if (has(25) !== has(26)) {
        rules.push(ONTOLOGICAL_COLLISION_RULES.thina_pair_split);
    }
    return rules;
}
export function evaluateChemicalSynthesis(targetCitta, selectedCetasikaIds) {
    const allowedSet = new Set([...targetCitta.fixedCetasikas, ...targetCitta.optionalCetasikas]);
    const missingFixed = [];
    for (const fid of targetCitta.fixedCetasikas) {
        if (!selectedCetasikaIds.has(fid)) {
            const el = getCetasikaElementBySubId(fid);
            if (el)
                missingFixed.push(el);
        }
    }
    const extraForbidden = [];
    for (const sid of selectedCetasikaIds) {
        if (!allowedSet.has(sid)) {
            const el = getCetasikaElementBySubId(sid);
            if (el)
                extraForbidden.push(el);
        }
    }
    const selectedOptional = [];
    const missingOptional = [];
    for (const oid of targetCitta.optionalCetasikas) {
        const el = getCetasikaElementBySubId(oid);
        if (!el)
            continue;
        if (selectedCetasikaIds.has(oid)) {
            selectedOptional.push(el);
        }
        else {
            missingOptional.push(el);
        }
    }
    const has25 = selectedCetasikaIds.has(25);
    const has26 = selectedCetasikaIds.has(26);
    const thinaSplit = has25 !== has26;
    const collisions = detectOntologicalCollisions(selectedCetasikaIds, targetCitta);
    const isExactFixedMatch = missingFixed.length === 0 && extraForbidden.length === 0 && selectedOptional.length === 0;
    const isExactFullSangahaMatch = missingFixed.length === 0 && extraForbidden.length === 0 && missingOptional.length === 0;
    const isValidConfiguration = missingFixed.length === 0 && extraForbidden.length === 0 && !thinaSplit && collisions.length === 0;
    const dosaSecCount = [22, 23, 24].filter((id) => selectedCetasikaIds.has(id)).length;
    const appaCount = [50, 51].filter((id) => selectedCetasikaIds.has(id)).length;
    const viratiInKamaCount = targetCitta.bhumi === "kama" ? [47, 48, 49].filter((id) => selectedCetasikaIds.has(id)).length : 0;
    const simultaneousOptionalNote = dosaSecCount > 1 || appaCount > 1 || viratiInKamaCount > 1;
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
export const CHEMICAL_CHALLENGE_CITTA_IDS = [
    1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 18, 27, 29, 30, 31, 33, 35, 39, 47, 55, 56, 57, 58, 59, 70, 82, 86,
];
export function pickNextPeriodicChallenge(progress, currentCittaId) {
    const pool = CHEMICAL_CHALLENGE_CITTA_IDS.map((id) => CANONICAL_CITTAS_89.find((c) => c.id === id)).filter(Boolean);
    const candidates = pool.length > 1 && currentCittaId != null ? pool.filter((c) => c.id !== currentCittaId) : pool;
    const sorted = [...candidates].sort((a, b) => {
        const scoreA = progress.masteredPeriodic[`chem:${a.id}`] ?? 0;
        const scoreB = progress.masteredPeriodic[`chem:${b.id}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id - b.id;
    });
    const topBucket = sorted.slice(0, Math.min(4, sorted.length));
    const idx = (progress.totalAttempts + (currentCittaId ?? 0)) % topBucket.length;
    return topBucket[idx] ?? pool[0];
}
export function getPhalanxMapById(id) {
    return PHALANX_MAPS.find((m) => m.id === id) ?? PHALANX_MAPS[0];
}
export function pickNextPhalanxSlot(progress, mapSpec, currentSlotIndex) {
    const slots = mapSpec.slots;
    const candidates = slots.length > 1 && currentSlotIndex != null ? slots.filter((s) => s.index !== currentSlotIndex) : slots;
    const sorted = [...candidates].sort((a, b) => {
        const scoreA = progress.masteredPhalanx[`${mapSpec.id}:${a.index}`] ?? 0;
        const scoreB = progress.masteredPhalanx[`${mapSpec.id}:${b.index}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.index - b.index;
    });
    const topBucket = sorted.slice(0, Math.min(4, sorted.length));
    const idx = (progress.totalAttempts + (currentSlotIndex ?? 0)) % topBucket.length;
    return topBucket[idx] ?? slots[0];
}
//# sourceMappingURL=engine.js.map