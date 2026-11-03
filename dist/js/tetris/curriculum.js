import { getEligibleGeneratedCards, materializeGeneratedQuestion } from "./taxonomy.js?v=b6a19a3f";
function shuffle(arr, rng = Math.random) {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = res[i];
        res[i] = res[j];
        res[j] = tmp;
    }
    return res;
}
export class Curriculum {
    units = new Map();
    cardsById = new Map();
    cardsByUnit = new Map();
    registerUnit(unitFile) {
        this.units.set(unitFile.unit, unitFile);
        const unitCards = [];
        for (const ac of unitFile.cards) {
            const card = {
                id: ac.id,
                unit: unitFile.unit,
                kind: ac.kind,
                origin: "authored",
                requires: ac.requires,
                authored: ac,
            };
            this.cardsById.set(card.id, card);
            unitCards.push(card);
        }
        for (const tax of unitFile.taxonomies) {
            const genCards = getEligibleGeneratedCards(tax);
            for (const gc of genCards) {
                this.cardsById.set(gc.id, gc);
                unitCards.push(gc);
            }
        }
        this.cardsByUnit.set(unitFile.unit, unitCards);
    }
    getUnit(unit) {
        return this.units.get(unit);
    }
    getAllUnits() {
        return Array.from(this.units.values()).sort((a, b) => a.unit - b.unit);
    }
    getCard(cardId) {
        return this.cardsById.get(cardId);
    }
    getCardsForUnit(unit) {
        return this.cardsByUnit.get(unit) ?? [];
    }
    getAllCards() {
        return Array.from(this.cardsById.values());
    }
    arePrerequisitesMet(card, scheduler) {
        if (card.requires.length === 0)
            return true;
        for (const reqId of card.requires) {
            const st = scheduler.cards[reqId];
            if (!st)
                return false;
            const isMastered = st.phase === "review" || (st.phase === "learning" && st.step >= 1 && st.lapses === 0);
            if (!isMastered)
                return false;
        }
        return true;
    }
    materialize(cardId, lang, rng = Math.random) {
        const card = this.cardsById.get(cardId);
        if (!card) {
            throw new Error(`Card ${cardId} not found in curriculum.`);
        }
        if (card.origin === "authored" && card.authored) {
            return this.materializeAuthored(card.authored, card.unit, lang, rng);
        }
        if (card.origin === "generated" && card.generated) {
            return materializeGeneratedQuestion(card.generated.taxonomy, card.generated.nodeId, card.generated.template, lang, rng);
        }
        throw new Error(`Invalid card state for ${cardId}`);
    }
    materializeAuthored(ac, unit, lang, rng) {
        const correctText = ac.correct[lang];
        const rawOptions = [
            { text: correctText, isCorrect: true },
            ...ac.distractors.map((d) => ({ text: d[lang], isCorrect: false })),
        ];
        const shuffled = shuffle(rawOptions, rng);
        const keys = ["1", "2", "3", "4", "5"].slice(0, shuffled.length);
        const options = shuffled.map((opt, idx) => ({
            key: keys[idx] ?? String(idx + 1),
            text: opt.text,
            isCorrect: opt.isCorrect,
        }));
        return {
            cardId: ac.id,
            unit,
            topic: ac.topic[lang],
            prompt: ac.prompt[lang],
            options,
            explanation: ac.explanation[lang],
        };
    }
}
export async function loadCurriculum(basePath = "data/tetris") {
    const curriculum = new Curriculum();
    try {
        const idxRes = await fetch(`${basePath}/index.json`);
        if (idxRes.ok) {
            const idx = (await idxRes.json());
            for (const u of idx.units) {
                try {
                    const uRes = await fetch(`${basePath}/${u.file}`);
                    if (uRes.ok) {
                        const unitData = (await uRes.json());
                        curriculum.registerUnit(unitData);
                    }
                }
                catch {
                }
            }
        }
    }
    catch {
    }
    return curriculum;
}
//# sourceMappingURL=curriculum.js.map