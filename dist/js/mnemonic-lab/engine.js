import { CANONICAL_CITTAS_89, CANONICAL_CITTAS_121, ONTOLOGICAL_COLLISION_RULES, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=06b4ea02";
import { CHAPTER_2_ITEMS, CHAPTER_3_ITEMS, CHAPTER_4_ITEMS, CHAPTER_5_ITEMS, CHAPTER_6_ITEMS, CHAPTER_7_ITEMS, CHAPTER_8_ITEMS, CHAPTER_9_ITEMS, getSubmatricesForChapter, } from "./nary-chapters-data.js?v=06b4ea02";
export const MNEMONIC_STORAGE_KEY = "abhidhamma_mnemonic_lab_v1";
function createEmptyLevelMastery() {
    return { 1: {}, 2: {}, 3: {} };
}
export function getMasteryScoreForLevel(progress, itemKey, level = progress.level) {
    const byLvl = progress.masteredByLevel?.[level];
    if (byLvl && typeof byLvl[itemKey] === "number") {
        return byLvl[itemKey];
    }
    if (level === 1 && !progress.masteredByLevel) {
        return progress.masteredBinary[itemKey] ?? 0;
    }
    return 0;
}
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
        masteredByLevel: createEmptyLevelMastery(),
        missedQueue: [],
    };
}
export function normalizeMnemonicProgress(parsed) {
    if (!parsed || typeof parsed !== "object")
        return createInitialProgress();
    const lvl = parsed.level === 1 || parsed.level === 2 || parsed.level === 3 ? parsed.level : 1;
    const masteredBinary = parsed.masteredBinary && typeof parsed.masteredBinary === "object" ? parsed.masteredBinary : {};
    const rawByLevel = parsed.masteredByLevel;
    const sanitizeMap = (m) => {
        if (!m || typeof m !== "object")
            return {};
        const out = {};
        for (const [k, v] of Object.entries(m)) {
            if (typeof v === "number" && Number.isFinite(v) && v > 0)
                out[k] = v;
        }
        return out;
    };
    const l1Raw = rawByLevel ? sanitizeMap(rawByLevel[1]) : {};
    const l2Raw = rawByLevel ? sanitizeMap(rawByLevel[2]) : {};
    const l3Raw = rawByLevel ? sanitizeMap(rawByLevel[3]) : {};
    const hasAnyByLevel = Object.keys(l1Raw).length > 0 || Object.keys(l2Raw).length > 0 || Object.keys(l3Raw).length > 0;
    const l1 = !rawByLevel || (!hasAnyByLevel && Object.keys(masteredBinary).length > 0)
        ? sanitizeMap(masteredBinary)
        : l1Raw;
    const missedQueue = Array.isArray(parsed.missedQueue)
        ? parsed.missedQueue.filter((k) => typeof k === "string").slice(0, 40)
        : [];
    return {
        level: lvl,
        streak: typeof parsed.streak === "number" ? parsed.streak : 0,
        bestStreak: typeof parsed.bestStreak === "number" ? parsed.bestStreak : 0,
        totalCorrect: typeof parsed.totalCorrect === "number" ? parsed.totalCorrect : 0,
        totalAttempts: typeof parsed.totalAttempts === "number" ? parsed.totalAttempts : 0,
        masteredBinary,
        masteredPeriodic: parsed.masteredPeriodic && typeof parsed.masteredPeriodic === "object" ? parsed.masteredPeriodic : {},
        masteredPhalanx: parsed.masteredPhalanx && typeof parsed.masteredPhalanx === "object" ? parsed.masteredPhalanx : {},
        masteredByLevel: { 1: l1, 2: l2Raw, 3: l3Raw },
        missedQueue,
    };
}
export function hasMnemonicProgressData(state) {
    if (!state)
        return false;
    return (state.totalAttempts > 0 ||
        Object.keys(state.masteredBinary).length > 0 ||
        Object.keys(state.masteredPeriodic).length > 0 ||
        Object.keys(state.masteredPhalanx).length > 0 ||
        Object.keys(state.masteredByLevel?.[1] ?? {}).length > 0 ||
        Object.keys(state.masteredByLevel?.[2] ?? {}).length > 0 ||
        Object.keys(state.masteredByLevel?.[3] ?? {}).length > 0);
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
    const mergedMissed = Array.from(new Set([...(sa.missedQueue ?? []), ...(sb.missedQueue ?? [])])).slice(0, 40);
    return {
        level: primary.level,
        streak: primary.streak,
        bestStreak: Math.max(sa.bestStreak, sb.bestStreak, primary.streak),
        totalCorrect,
        totalAttempts,
        masteredBinary: mergeMasteredMap(sa.masteredBinary, sb.masteredBinary),
        masteredPeriodic: mergeMasteredMap(sa.masteredPeriodic, sb.masteredPeriodic),
        masteredPhalanx: mergeMasteredMap(sa.masteredPhalanx, sb.masteredPhalanx),
        masteredByLevel: {
            1: mergeMasteredMap(sa.masteredByLevel?.[1] ?? {}, sb.masteredByLevel?.[1] ?? {}),
            2: mergeMasteredMap(sa.masteredByLevel?.[2] ?? {}, sb.masteredByLevel?.[2] ?? {}),
            3: mergeMasteredMap(sa.masteredByLevel?.[3] ?? {}, sb.masteredByLevel?.[3] ?? {}),
        },
        missedQueue: mergedMissed,
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
export function recordMnemonicAttempt(state, pillar, itemKey, isCorrect, levelOverride) {
    const nextStreak = isCorrect ? state.streak + 1 : 0;
    const nextBest = Math.max(state.bestStreak, nextStreak);
    const nextCorrect = state.totalCorrect + (isCorrect ? 1 : 0);
    const nextAttempts = state.totalAttempts + 1;
    const lvl = levelOverride ?? state.level;
    const updateMap = (map) => {
        const copy = { ...map };
        const prev = copy[itemKey] ?? 0;
        copy[itemKey] = isCorrect ? prev + 1 : Math.max(0, prev - 1);
        return copy;
    };
    const prevByLevel = state.masteredByLevel ?? {
        1: { ...state.masteredBinary },
        2: {},
        3: {},
    };
    const nextByLevel = pillar === "binary"
        ? {
            1: lvl === 1 ? updateMap(prevByLevel[1] ?? {}) : { ...(prevByLevel[1] ?? {}) },
            2: lvl === 2 ? updateMap(prevByLevel[2] ?? {}) : { ...(prevByLevel[2] ?? {}) },
            3: lvl === 3 ? updateMap(prevByLevel[3] ?? {}) : { ...(prevByLevel[3] ?? {}) },
        }
        : prevByLevel;
    const prevMissed = state.missedQueue ?? [];
    const nextMissed = isCorrect
        ? prevMissed.filter((k) => k !== itemKey)
        : [...prevMissed.filter((k) => k !== itemKey), itemKey].slice(-40);
    const next = {
        ...state,
        streak: nextStreak,
        bestStreak: nextBest,
        totalCorrect: nextCorrect,
        totalAttempts: nextAttempts,
        masteredBinary: pillar === "binary" ? updateMap(state.masteredBinary) : state.masteredBinary,
        masteredPeriodic: pillar === "periodic" ? updateMap(state.masteredPeriodic) : state.masteredPeriodic,
        masteredPhalanx: pillar === "phalanx" ? updateMap(state.masteredPhalanx) : state.masteredPhalanx,
        masteredByLevel: nextByLevel,
        missedQueue: nextMissed,
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
            if (mode === 121) {
                return (CANONICAL_CITTAS_121.find((c) => c.family === "lokuttara" &&
                    c.jati === sw.jati &&
                    c.maggaStage === sw.maggaStage &&
                    c.jhanaStage === (sw.jhanaStage ?? 1)) ?? null);
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
    if (pool.length === 0)
        return CANONICAL_CITTAS_121[0];
    const missed = progress.missedQueue ?? [];
    if (missed.length > 0 && progress.totalAttempts % 2 === 1) {
        for (const key of missed) {
            if (!key.startsWith("citta:"))
                continue;
            const cid = Number(key.slice(6));
            if (cid !== currentId) {
                const hit = pool.find((c) => c.id === cid);
                if (hit)
                    return hit;
            }
        }
    }
    const lvl = progress.level;
    const sorted = [...pool].sort((a, b) => {
        const scoreA = getMasteryScoreForLevel(progress, `citta:${a.id}`, lvl);
        const scoreB = getMasteryScoreForLevel(progress, `citta:${b.id}`, lvl);
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id - b.id;
    });
    const minScore = getMasteryScoreForLevel(progress, `citta:${sorted[0].id}`, lvl);
    const lowestPool = sorted.filter((c) => getMasteryScoreForLevel(progress, `citta:${c.id}`, lvl) === minScore);
    const activePool = lowestPool.length > 1 ? lowestPool : sorted;
    if (currentId != null) {
        const curIdx = activePool.findIndex((c) => c.id === currentId);
        if (curIdx >= 0) {
            return activePool[(curIdx + 1) % activePool.length];
        }
    }
    const filtered = activePool.length > 1 && currentId != null ? activePool.filter((c) => c.id !== currentId) : activePool;
    const idx = progress.totalAttempts % filtered.length;
    return filtered[idx] ?? pool[0];
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
    const simultaneousOptionalNote = dosaSecCount > 1 || appaCount + viratiInKamaCount > 1;
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
    if (pool.length === 0)
        return CANONICAL_CITTAS_89[0];
    const sorted = [...pool].sort((a, b) => {
        const scoreA = progress.masteredPeriodic[`chem:${a.id}`] ?? 0;
        const scoreB = progress.masteredPeriodic[`chem:${b.id}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id - b.id;
    });
    const minScore = progress.masteredPeriodic[`chem:${sorted[0].id}`] ?? 0;
    const lowestPool = sorted.filter((c) => (progress.masteredPeriodic[`chem:${c.id}`] ?? 0) === minScore);
    const activePool = lowestPool.length > 1 ? lowestPool : sorted;
    if (currentCittaId != null) {
        const curIdx = activePool.findIndex((c) => c.id === currentCittaId);
        if (curIdx >= 0) {
            return activePool[(curIdx + 1) % activePool.length];
        }
    }
    const filtered = activePool.length > 1 && currentCittaId != null ? activePool.filter((c) => c.id !== currentCittaId) : activePool;
    const idx = progress.totalAttempts % filtered.length;
    return filtered[idx] ?? pool[0];
}
export function getPhalanxMapById(id) {
    return PHALANX_MAPS.find((m) => m.id === id) ?? PHALANX_MAPS[0];
}
export function pickNextPhalanxSlot(progress, mapSpec, currentSlotIndex) {
    const slots = mapSpec.slots;
    const sorted = [...slots].sort((a, b) => {
        const scoreA = progress.masteredPhalanx[`${mapSpec.id}:${a.index}`] ?? 0;
        const scoreB = progress.masteredPhalanx[`${mapSpec.id}:${b.index}`] ?? 0;
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.index - b.index;
    });
    const minScore = progress.masteredPhalanx[`${mapSpec.id}:${sorted[0].index}`] ?? 0;
    const lowestPool = sorted.filter((s) => (progress.masteredPhalanx[`${mapSpec.id}:${s.index}`] ?? 0) === minScore);
    const activePool = lowestPool.length > 1 ? lowestPool : sorted;
    if (currentSlotIndex != null) {
        const curIdx = activePool.findIndex((s) => s.index === currentSlotIndex);
        if (curIdx >= 0) {
            return activePool[(curIdx + 1) % activePool.length];
        }
    }
    const filtered = activePool.length > 1 && currentSlotIndex != null ? activePool.filter((s) => s.index !== currentSlotIndex) : activePool;
    const idx = progress.totalAttempts % filtered.length;
    return filtered[idx] ?? slots[0];
}
export function getNaryItemsForChapter(chapterNum, submatrixId) {
    let all;
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
    if (!submatrixId || submatrixId === "all")
        return all;
    const filtered = all.filter((item) => (item.submatrix ?? item.primaryGroup) === submatrixId);
    return filtered.length > 0 ? filtered : all;
}
export function pickNextNaryChapterChallenge(chapterNum, progress, currentItemId, submatrixId) {
    const items = getNaryItemsForChapter(chapterNum, submatrixId);
    if (items.length === 0)
        return CHAPTER_2_ITEMS[0];
    const missed = progress.missedQueue ?? [];
    if (missed.length > 0 && progress.totalAttempts % 2 === 1) {
        for (const key of missed) {
            if (!key.startsWith("nary:"))
                continue;
            const nid = key.slice(5);
            if (nid !== currentItemId) {
                const hit = items.find((i) => i.id === nid);
                if (hit)
                    return hit;
            }
        }
    }
    const lvl = progress.level;
    const sorted = [...items].sort((a, b) => {
        const scoreA = getMasteryScoreForLevel(progress, `nary:${a.id}`, lvl);
        const scoreB = getMasteryScoreForLevel(progress, `nary:${b.id}`, lvl);
        if (scoreA !== scoreB)
            return scoreA - scoreB;
        return a.id.localeCompare(b.id);
    });
    const minScore = getMasteryScoreForLevel(progress, `nary:${sorted[0].id}`, lvl);
    const lowestPool = sorted.filter((i) => getMasteryScoreForLevel(progress, `nary:${i.id}`, lvl) === minScore);
    const activePool = lowestPool.length > 1 ? lowestPool : sorted;
    if (currentItemId != null) {
        const curIdx = activePool.findIndex((i) => i.id === currentItemId);
        if (curIdx >= 0) {
            return activePool[(curIdx + 1) % activePool.length];
        }
    }
    const filtered = activePool.length > 1 && currentItemId != null ? activePool.filter((i) => i.id !== currentItemId) : activePool;
    const idx = progress.totalAttempts % filtered.length;
    return filtered[idx] ?? items[0];
}
export function buildReverseChoices(target, pool, count, getId, getSimilarityScore, seed) {
    const targetId = getId(target);
    const others = pool.filter((item) => getId(item) !== targetId);
    const ranked = [...others].sort((a, b) => {
        const sa = getSimilarityScore(a, target);
        const sb = getSimilarityScore(b, target);
        if (sb !== sa)
            return sb - sa;
        const ha = hashString(`${getId(a)}:${seed}`);
        const hb = hashString(`${getId(b)}:${seed}`);
        return ha - hb;
    });
    const distractors = ranked.slice(0, Math.max(0, count - 1));
    const combined = [target, ...distractors];
    return combined.sort((a, b) => hashString(`${getId(a)}:pos:${seed}`) - hashString(`${getId(b)}:pos:${seed}`));
}
function hashString(input) {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
export function defaultNarySwitchesForSubmatrix(chapterNum, submatrixId) {
    if (submatrixId && submatrixId !== "all") {
        const sm = getSubmatricesForChapter(chapterNum).find((m) => m.id === submatrixId);
        if (sm)
            return { ...sm.defaultSwitches };
    }
    return defaultNarySwitchesForChapter(chapterNum);
}
export function defaultNarySwitchesForChapter(chapterNum) {
    switch (chapterNum) {
        case 2:
            return { lens: "sampayoga", group: "aññasamana", sub: "sabbacitta", slot: 1, yogita: "niyata", sampayoga: 121 };
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
export function computeChapterProgressForLevel(progress, chapterNum, level, enumMode = 121) {
    if (chapterNum === 1) {
        const pool = enumMode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
        const mastered = pool.filter((c) => getMasteryScoreForLevel(progress, `citta:${c.id}`, level) >= 1).length;
        return computeProgressMetric(mastered, pool.length);
    }
    const items = getNaryItemsForChapter(chapterNum);
    const mastered = items.filter((it) => getMasteryScoreForLevel(progress, `nary:${it.id}`, level) >= 1).length;
    return computeProgressMetric(mastered, items.length);
}
export function computeProgressMetric(mastered, total) {
    const safeTotal = Math.max(0, total);
    const safeMastered = Math.min(safeTotal, Math.max(0, mastered));
    if (safeTotal === 0 || safeMastered === 0) {
        return { mastered: safeMastered, total: safeTotal, percent: 0 };
    }
    if (safeMastered >= safeTotal) {
        return { mastered: safeTotal, total: safeTotal, percent: 100 };
    }
    const raw = Math.round((safeMastered / safeTotal) * 1000) / 10;
    const percent = Math.min(99.9, Math.max(0.1, raw));
    return { mastered: safeMastered, total: safeTotal, percent };
}
export function computeChapterProgress(progress, chapterNum, enumMode = 121) {
    if (chapterNum === 1) {
        const pool = enumMode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
        const mastered = pool.filter((c) => (progress.masteredBinary[`citta:${c.id}`] ?? 0) >= 1).length;
        return computeProgressMetric(mastered, pool.length);
    }
    const items = getNaryItemsForChapter(chapterNum);
    const mastered = items.filter((it) => (progress.masteredBinary[`nary:${it.id}`] ?? 0) >= 1).length;
    return computeProgressMetric(mastered, items.length);
}
export function computeChapterScopeProgress(progress, chapterNum, scopeId, enumMode = 121) {
    if (chapterNum === 1) {
        const pool = getSynthesizableCittas(scopeId, enumMode);
        const mastered = pool.filter((c) => (progress.masteredBinary[`citta:${c.id}`] ?? 0) >= 1).length;
        return computeProgressMetric(mastered, pool.length);
    }
    const items = getNaryItemsForChapter(chapterNum, scopeId);
    const mastered = items.filter((it) => (progress.masteredBinary[`nary:${it.id}`] ?? 0) >= 1).length;
    return computeProgressMetric(mastered, items.length);
}
export function computePeriodicProgress(progress) {
    const mastered = CHEMICAL_CHALLENGE_CITTA_IDS.filter((id) => (progress.masteredPeriodic[`chem:${id}`] ?? 0) >= 1).length;
    return computeProgressMetric(mastered, CHEMICAL_CHALLENGE_CITTA_IDS.length);
}
export function computePhalanxMapProgress(progress, mapId) {
    const mapSpec = getPhalanxMapById(mapId);
    const mastered = mapSpec.slots.filter((sl) => (progress.masteredPhalanx[`${mapSpec.id}:${sl.index}`] ?? 0) >= 1).length;
    return computeProgressMetric(mastered, mapSpec.slots.length);
}
export function computePhalanxGlobalProgress(progress) {
    let mastered = 0;
    let total = 0;
    for (const mapSpec of PHALANX_MAPS) {
        total += mapSpec.slots.length;
        for (const sl of mapSpec.slots) {
            if ((progress.masteredPhalanx[`${mapSpec.id}:${sl.index}`] ?? 0) >= 1) {
                mastered += 1;
            }
        }
    }
    return computeProgressMetric(mastered, total);
}
export function computeMnemonicProgressSummary(progress, enumMode = 121) {
    const chapters = {
        1: computeChapterProgress(progress, 1, enumMode),
        2: computeChapterProgress(progress, 2, enumMode),
        3: computeChapterProgress(progress, 3, enumMode),
        4: computeChapterProgress(progress, 4, enumMode),
        5: computeChapterProgress(progress, 5, enumMode),
        6: computeChapterProgress(progress, 6, enumMode),
        7: computeChapterProgress(progress, 7, enumMode),
        8: computeChapterProgress(progress, 8, enumMode),
        9: computeChapterProgress(progress, 9, enumMode),
    };
    let naryMastered = 0;
    let naryTotal = 0;
    let naryChaptersCompleted = 0;
    for (const ch of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        const m = chapters[ch];
        naryMastered += m.mastered;
        naryTotal += m.total;
        if (m.total > 0 && m.mastered >= m.total) {
            naryChaptersCompleted += 1;
        }
    }
    const naryGlobal = computeProgressMetric(naryMastered, naryTotal);
    const computeLevelGlobal = (lvl) => {
        let m = 0;
        let t = 0;
        for (const ch of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            const cm = computeChapterProgressForLevel(progress, ch, lvl, enumMode);
            m += cm.mastered;
            t += cm.total;
        }
        return computeProgressMetric(m, t);
    };
    const naryByLevel = {
        1: computeLevelGlobal(1),
        2: computeLevelGlobal(2),
        3: computeLevelGlobal(3),
    };
    const periodic = computePeriodicProgress(progress);
    const phalanx = computePhalanxGlobalProgress(progress);
    const overall = computeProgressMetric(naryGlobal.mastered + periodic.mastered + phalanx.mastered, naryGlobal.total + periodic.total + phalanx.total);
    return {
        overall,
        naryGlobal,
        naryByLevel,
        naryChaptersCompleted,
        chapters,
        periodic,
        phalanx,
    };
}
//# sourceMappingURL=engine.js.map