/**
 * Tipos centrais do motor "Abhidhamma Tetris".
 *
 * Camadas:
 *   1. Dados do currículo (JSON em `data/tetris/`): `UnitFile`, `AuthoredCard`, `Taxonomy`.
 *   2. Cartas resolvidas (`Card`): unidade de aprendizagem e de agendamento.
 *   3. Estado de repetição espaçada (`CardState`) e estado do jogo (`GameState`).
 */

export type Lang = "en" | "pt" | "es";
export const LANGS: readonly Lang[] = ["en", "pt", "es"] as const;

/** Texto disponível nos três idiomas da plataforma. */
export type Localized = Readonly<Record<Lang, string>>;

/** `atom`: tijolo conceitual elementar. `derived`: dedutível a partir de átomos (requires). */
export type CardKind = "atom" | "derived";

export interface SourceRef {
  /** Bhikkhu Bodhi, A Comprehensive Manual of Abhidhamma — ex.: "I §4". */
  readonly cma?: string;
  /** Fundamentals of Abhidhamma (Watagoda Maggavihari) — ex.: "Lesson 1.4". */
  readonly fund?: string;
  /** Abhidhammatthasaṅgaha (texto primário) — ex.: "I.4". */
  readonly as?: string;
}

/** Carta escrita à mão: pergunta de múltipla escolha com 1 resposta correta. */
export interface AuthoredCard {
  /** Único no currículo; prefixo `u<N>.` igual ao da unidade. */
  readonly id: string;
  readonly kind: CardKind;
  /** Rótulo curto do tópico, exibido acima da pergunta. */
  readonly topic: Localized;
  /** Cartas (autoradas ou geradas) da MESMA unidade que devem estar dominadas antes desta ser introduzida. */
  readonly requires: readonly string[];
  readonly prompt: Localized;
  readonly correct: Localized;
  /** Pelo menos 3, distintos entre si e da resposta correta, em cada idioma. */
  readonly distractors: readonly Localized[];
  readonly explanation: Localized;
  readonly source: SourceRef;
}

export interface TaxNode {
  /** Único dentro da taxonomia. */
  readonly id: string;
  readonly name: Localized;
  /** `null` somente na raiz (exatamente uma por taxonomia). */
  readonly parent: string | null;
  /** Nº de elementos discretos que a folha representa (padrão 1). Ignorado em nós internos. */
  readonly weight?: number;
}

/** Hierarquia de classificação a partir da qual cartas dedutivas são geradas algoritmicamente. */
export interface Taxonomy {
  /** Prefixo `u<N>.` igual ao da unidade. */
  readonly id: string;
  readonly title: Localized;
  /** Substantivo plural do que se conta ("cittas", "fatores mentais"…). */
  readonly noun: Localized;
  readonly nodes: readonly TaxNode[];
  readonly source: SourceRef;
}

export interface UnitFile {
  readonly unit: number;
  readonly title: Localized;
  readonly summary: Localized;
  readonly taxonomies: readonly Taxonomy[];
  readonly cards: readonly AuthoredCard[];
}

export interface CurriculumIndex {
  readonly version: number;
  readonly units: readonly { readonly unit: number; readonly file: string }[];
}

/** Gabarito dos gabaritos geradores. */
export type GeneratedTemplate = "count" | "category" | "member" | "intruder";

/** Carta resolvida (autorada ou gerada). */
export interface Card {
  readonly id: string;
  readonly unit: number;
  readonly kind: CardKind;
  readonly origin: "authored" | "generated";
  readonly requires: readonly string[];
  readonly authored?: AuthoredCard;
  readonly generated?: {
    readonly template: GeneratedTemplate;
    readonly taxonomy: Taxonomy;
    readonly nodeId: string;
  };
}

/** Uma opção de resposta exibida ao jogador. */
export interface Option {
  readonly key: string;
  readonly text: string;
  readonly isCorrect: boolean;
}

/** Pergunta materializada (textos já no idioma pedido, opções embaralhadas). */
export interface Question {
  readonly cardId: string;
  readonly unit: number;
  readonly topic: string;
  readonly prompt: string;
  readonly options: readonly Option[];
  readonly explanation: string;
}

// ── Repetição espaçada ────────────────────────────────────────────────────────

export type CardPhase = "new" | "learning" | "review" | "relearning";

export interface CardState {
  readonly id: string;
  readonly phase: CardPhase;
  /** Passo atual em `learning`/`relearning` (0-based). */
  readonly step: number;
  /** Caixa Leitner em `review` (1..REVIEW_INTERVALS_DAYS.length). */
  readonly box: number;
  /** Rodada (da sessão atual) a partir da qual a carta está devida em learning/relearning. */
  readonly dueRound: number;
  /** Instante (ms epoch) a partir do qual a carta está devida em `review`. */
  readonly dueAtMs: number;
  readonly lapses: number;
  readonly seen: number;
  readonly correct: number;
  readonly lastRound: number;
}

export interface SchedulerState {
  readonly cards: Readonly<Record<string, CardState>>;
  readonly round: number;
}

// ── Jogo ──────────────────────────────────────────────────────────────────────

export type GamePhase = "idle" | "falling" | "feedback" | "failed" | "completed";

export type FailureCause = "floor" | null;

export interface FallingPiece {
  readonly key: string;
  readonly text: string;
  readonly isCorrect: boolean;
  /** Posição do topo da peça, em linhas da matriz (pode ser negativa ao nascer). */
  readonly topRow: number;
  /** Índice 0..n-1 dentro da pilha de peças (0 = mais alta). */
  readonly slot: number;
  readonly shattered: boolean;
}

export interface FeedbackState {
  readonly outcome: "correct" | "wrong" | "floor";
  readonly chosenKey: string | null;
  readonly correctKey: string;
  readonly explanation: string;
}

export interface SessionStats {
  readonly rounds: number;
  readonly correct: number;
  readonly wrong: number;
  readonly floors: number;
  readonly streak: number;
  readonly bestStreak: number;
}

export interface GameState {
  readonly phase: GamePhase;
  readonly question: Question | null;
  readonly pieces: readonly FallingPiece[];
  readonly feedback: FeedbackState | null;
  readonly failure: FailureCause;
  readonly stats: SessionStats;
}
