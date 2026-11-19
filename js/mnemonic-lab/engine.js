import { CANONICAL_CITTAS_89, CANONICAL_CITTAS_121, ONTOLOGICAL_COLLISION_RULES, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=19a04341";
import { CHAPTER_2_ITEMS, CHAPTER_3_ITEMS, CHAPTER_4_ITEMS, CHAPTER_5_ITEMS, CHAPTER_6_ITEMS, CHAPTER_7_ITEMS, CHAPTER_8_ITEMS, CHAPTER_9_ITEMS, } from "./nary-chapters-data.js?v=19a04341";
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
export function normalizeMnemonicProgress(parsed) {
    if (!parsed || typeof parsed !== "object")
        return createInitialProgress();
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
export function hasMnemonicProgressData(state) {
    if (!state)
        return false;
    return (state.totalAttempts > 0 ||
        Object.keys(state.masteredBinary).length > 0 ||
        Object.keys(state.masteredPeriodic).length > 0 ||
        Object.keys(state.masteredPhalanx).length > 0);
}
export function mergeMnemonicProgress(a, b) {
    const sa = normalizeMnemonicProgress(a);
    const sb = normalizeMnemonicProgress(b);
    if (!hasMnemonicProgressData(sa))
        return sb;
    if (!hasMnemonicProgressData(sb))
        return sa;
    const mergeMasteredMap = (m1, m2) => {
        const out = { ...m1 };
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
export function loadMnemonicProgress() {
    try {
        const raw = localStorage.getItem(MNEMONIC_STORAGE_KEY);
        if (!raw)
            return createInitialProgress();
        return normalizeMnemonicProgress(JSON.parse(raw));
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
export function resolveCittaFromSwitches(sw, mode = 121) {
    const pool = mode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
    switch (sw.family) {
        case "lobha":
            return (pool.find((c) => c.family === "lobha" &&
                c.bitVedana === sw.bitVedana &&
                c.bitCognitive === sw.bitCognitive &&
                c.bitSankhara === sw.bitSankhara) ?? null);
        case "dosa":
            return (pool.find((c) => c.family === "dosa" && c.bitSankhara === sw.bitSankhara) ?? null);
        case "moha":
            return (pool.find((c) => c.family === "moha" && c.bitCognitive === sw.bitCognitive) ?? null);
        case "ahetuka": {
            const targetId = sw.ahetukaSubgroup === "akusala_vipaka"
                ? 13 + Math.max(0, Math.min(6, sw.ahetukaSlot))
                : sw.ahetukaSubgroup === "kusala_vipaka"
                    ? 20 + Math.max(0, Math.min(7, sw.ahetukaSlot))
                    : 28 + Math.max(0, Math.min(2, sw.ahetukaSlot));
            return pool.find((c) => c.id === targetId) ?? null;
        }
        case "kamasobhana":
            return (pool.find((c) => c.family === "kamasobhana" &&
                c.jati === sw.jati &&
                c.bitVedana === sw.bitVedana &&
                c.bitCognitive === sw.bitCognitive &&
                c.bitSankhara === sw.bitSankhara) ?? null);
        case "rupavacara":
            return (pool.find((c) => c.family === "rupavacara" && c.jati === sw.jati && c.jhanaStage === sw.jhanaStage) ?? null);
        case "arupavacara":
            return (pool.find((c) => c.family === "arupavacara" && c.jati === sw.jati && c.arupaBase === sw.arupaBase) ?? null);
        case "lokuttara":
            if (mode === 121 || (sw.jhanaStage != null && sw.jhanaStage > 1)) {
                return (CANONICAL_CITTAS_121.find((c) => c.family === "lokuttara" &&
                    c.jati === sw.jati &&
                    c.maggaStage === sw.maggaStage &&
                    c.jhanaStage === sw.jhanaStage) ?? null);
            }
            return (CANONICAL_CITTAS_89.find((c) => c.family === "lokuttara" && c.jati === sw.jati && c.maggaStage === sw.maggaStage) ?? null);
        default:
            return null;
    }
}
export function getSynthesizableCittas(familyFilter, mode = 121) {
    const pool = mode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
    if (!familyFilter || familyFilter === "all")
        return [...pool];
    return pool.filter((c) => c.family === familyFilter);
}
export function pickNextBinaryChallenge(progress, familyFilter, currentId, mode = 121) {
    const pool = getSynthesizableCittas(familyFilter, mode);
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
export function getNaryItemsForChapter(chapterNum) {
    switch (chapterNum) {
        case 2:
            return CHAPTER_2_ITEMS;
        case 3:
            return CHAPTER_3_ITEMS;
        case 4:
            return CHAPTER_4_ITEMS;
        case 5:
            return CHAPTER_5_ITEMS;
        case 6:
            return CHAPTER_6_ITEMS;
        case 7:
            return CHAPTER_7_ITEMS;
        case 8:
            return CHAPTER_8_ITEMS;
        case 9:
            return CHAPTER_9_ITEMS;
        default:
            return [];
    }
}
export function pickNextNaryChapterChallenge(chapterNum, progress, currentItemId) {
    const items = getNaryItemsForChapter(chapterNum);
    if (items.length === 0)
        return CHAPTER_2_ITEMS[0];
    const candidates = items.length > 1 && currentItemId != null ? items.filter((i) => i.id !== currentItemId) : items;
    const sorted = [...candidates].sort((a, b) => {
        const scoreA = progress.masteredBinary[`chap${chapterNum}:${a.id}`] ?? 0;
        const scoreB = progress.masteredBinary[`chap${chapterNum}:${b.id}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id.localeCompare(b.id);
    });
    const topBucket = sorted.slice(0, Math.min(4, sorted.length));
    const idx = (progress.totalAttempts + (currentItemId ? currentItemId.length : 0)) % topBucket.length;
    return topBucket[idx] ?? items[0];
}
export function defaultNarySwitchesForChapter(chapterNum) {
    switch (chapterNum) {
        case 2:
            return { group: "aññasamana", sub: "sabbacitta", slot: 1, sampayoga: 121 };
        case 3:
            return { category: "vedana", item: "somanassa", count: 62 };
        case 4:
            return { door: "pancadvara", vara: "tadarammana", moments: 17 };
        case 5:
            return { tetrad: "bhumi", realm: "apaya", count: 4 };
        case 6:
            return { type: "mahabhuta", status: "nipphanna", samutthana: "catusamutthana" };
        case 7:
            return { compendium: "bodhipakkhiya", group: "satipatthana", count: 4 };
        case 8:
            return { method: "patthana", index: 1, type: "sahajata" };
        case 9:
        default:
            return { wing: "samatha", group: "kasina", maxJhana: 5, carita: "all", nimitta: 3 };
    }
}
export function evaluateNaryChallenge(target, switches) {
    const targetSwitches = target.switches;
    const matchedKeys = [];
    const mismatchedKeys = [];
    for (const [key, val] of Object.entries(targetSwitches)) {
        if (String(switches[key]) === String(val)) {
            matchedKeys.push(key);
        }
        else {
            mismatchedKeys.push(key);
        }
    }
    const isCorrect = mismatchedKeys.length === 0;
    return { isCorrect, matchedKeys, mismatchedKeys };
}
//# sourceMappingURL=engine.js.map