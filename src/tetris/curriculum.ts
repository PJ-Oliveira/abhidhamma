import type {
  AuthoredCard,
  Card,
  CurriculumIndex,
  Lang,
  Option,
  Question,
  SchedulerState,
  UnitFile,
} from "./types.js";
import { getEligibleGeneratedCards, materializeGeneratedQuestion } from "./taxonomy.js";

function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = res[i]!;
    res[i] = res[j]!;
    res[j] = tmp;
  }
  return res;
}

export class Curriculum {
  private readonly units = new Map<number, UnitFile>();
  private readonly cardsById = new Map<string, Card>();
  private readonly cardsByUnit = new Map<number, Card[]>();

  public registerUnit(unitFile: UnitFile): void {
    this.units.set(unitFile.unit, unitFile);
    const unitCards: Card[] = [];

    // 1. Cartas autoradas
    for (const ac of unitFile.cards) {
      const card: Card = {
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

    // 2. Cartas geradas via taxonomia
    for (const tax of unitFile.taxonomies) {
      const genCards = getEligibleGeneratedCards(tax);
      for (const gc of genCards) {
        this.cardsById.set(gc.id, gc);
        unitCards.push(gc);
      }
    }

    this.cardsByUnit.set(unitFile.unit, unitCards);
  }

  public getUnit(unit: number): UnitFile | undefined {
    return this.units.get(unit);
  }

  public getAllUnits(): readonly UnitFile[] {
    return Array.from(this.units.values()).sort((a, b) => a.unit - b.unit);
  }

  public getCard(cardId: string): Card | undefined {
    return this.cardsById.get(cardId);
  }

  public getCardsForUnit(unit: number): readonly Card[] {
    return this.cardsByUnit.get(unit) ?? [];
  }

  public getAllCards(): readonly Card[] {
    return Array.from(this.cardsById.values());
  }

  /**
   * Verifica se os pré-requisitos da carta foram cumpridos.
   * Uma dependência é considerada satisfeita se o cartão já foi assimilado
   * (fase 'review' ou 'learning' com ao menos 1 acerto sem lapso pendente).
   */
  public arePrerequisitesMet(card: Card, scheduler: SchedulerState): boolean {
    if (card.requires.length === 0) return true;

    for (const reqId of card.requires) {
      const st = scheduler.cards[reqId];
      if (!st) return false;
      // Para avançar a um conceito derivado, o átomo ou dependência
      // precisa estar consolidado (fase "review" ou passo >= 1 em learning sem lapses recentes)
      const isMastered = st.phase === "review" || (st.phase === "learning" && st.step >= 1 && st.lapses === 0);
      if (!isMastered) return false;
    }
    return true;
  }

  /**
   * Materializa uma carta num objeto Question pronto para a interface,
   * no idioma especificado, com opções embaralhadas.
   */
  public materialize(cardId: string, lang: Lang, rng: () => number = Math.random): Question {
    const card = this.cardsById.get(cardId);
    if (!card) {
      throw new Error(`Card ${cardId} not found in curriculum.`);
    }

    if (card.origin === "authored" && card.authored) {
      return this.materializeAuthored(card.authored, card.unit, lang, rng);
    }

    if (card.origin === "generated" && card.generated) {
      return materializeGeneratedQuestion(
        card.generated.taxonomy,
        card.generated.nodeId,
        card.generated.template,
        lang,
        rng
      );
    }

    throw new Error(`Invalid card state for ${cardId}`);
  }

  private materializeAuthored(
    ac: AuthoredCard,
    unit: number,
    lang: Lang,
    rng: () => number
  ): Question {
    const correctText = ac.correct[lang];
    const rawOptions: { text: string; isCorrect: boolean }[] = [
      { text: correctText, isCorrect: true },
      ...ac.distractors.map((d) => ({ text: d[lang], isCorrect: false })),
    ];

    const shuffled = shuffle(rawOptions, rng);
    const keys = ["1", "2", "3", "4", "5"].slice(0, shuffled.length);

    const options: Option[] = shuffled.map((opt, idx) => ({
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

/** Carrega os dados do currículo via fetch na web ou de caminhos locais. */
export async function loadCurriculum(basePath = "data/tetris"): Promise<Curriculum> {
  const curriculum = new Curriculum();
  try {
    const idxRes = await fetch(`${basePath}/index.json`);
    if (idxRes.ok) {
      const idx = (await idxRes.json()) as CurriculumIndex;
      for (const u of idx.units) {
        try {
          const uRes = await fetch(`${basePath}/${u.file}`);
          if (uRes.ok) {
            const unitData = (await uRes.json()) as UnitFile;
            curriculum.registerUnit(unitData);
          }
        } catch {
          // ignore individual fetch errors
        }
      }
    }
  } catch {
    // index not available or offline fallback
  }
  return curriculum;
}
