import type {
  FailureCause,
  FallingPiece,
  FeedbackState,
  GamePhase,
  GameState,
  Lang,
  Question,
  SessionStats,
} from "./types.js";
import type { Curriculum } from "./curriculum.js";
import {
  createInitialSchedulerState,
  loadSchedulerState,
  recordAnswer,
  saveSchedulerState,
  selectNextCard,
} from "./scheduler.js";

export interface EngineCallbacks {
  readonly onStateChange: (state: GameState) => void;
  readonly onQuestionLoaded: (question: Question) => void;
  readonly onCriticalFailure: (cause: FailureCause, question: Question | null) => void;
  readonly onCardAnswered: (cardId: string, isCorrect: boolean) => void;
}

export interface EngineConfig {
  /** Velocidade constante de descida das peças em % de altura por segundo (invariável). */
  readonly fallSpeedPercentPerSec: number;
  /** Altura de cada bloco em porcentagem da altura da matriz vertical. */
  readonly pieceHeightPercent: number;
  /** Tempo de exibição da explicação pedagógica em ms após resposta correta. */
  readonly feedbackDelayMs: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  // Queda serena e constante: leva ~18 segundos do topo ao chão.
  fallSpeedPercentPerSec: 5.0,
  pieceHeightPercent: 14,
  feedbackDelayMs: 2200,
};

export class TetrisEngine {
  private phase: GamePhase = "idle";
  private currentUnit = 1;
  private currentLang: Lang = "pt";
  private currentQuestion: Question | null = null;
  private pieces: FallingPiece[] = [];
  private feedback: FeedbackState | null = null;
  private failure: FailureCause = null;
  private stats: SessionStats = {
    rounds: 0,
    correct: 0,
    wrong: 0,
    floors: 0,
    streak: 0,
    bestStreak: 0,
  };

  private animationFrameId: number | null = null;
  private lastTimestamp = 0;
  private feedbackTimer: number | null = null;

  private scheduler = createInitialSchedulerState();
  private readonly config: EngineConfig;

  constructor(
    private readonly curriculum: Curriculum,
    private readonly callbacks: EngineCallbacks,
    config: Partial<EngineConfig> = {}
  ) {
    this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
    this.scheduler = loadSchedulerState(this.currentUnit);
  }

  public setUnit(unit: number): void {
    if (this.currentUnit === unit) return;
    this.stopLoop();
    this.currentUnit = unit;
    this.scheduler = loadSchedulerState(unit);
    this.resetGame();
  }

  public setLang(lang: Lang): void {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    if (this.currentQuestion) {
      // Recarrega a questão atual no novo idioma
      try {
        const reloaded = this.curriculum.materialize(this.currentQuestion.cardId, lang);
        this.currentQuestion = reloaded;
        // Atualiza textos das peças em queda
        this.pieces = this.pieces.map((p) => {
          const opt = reloaded.options.find((o) => o.key === p.key);
          return {
            ...p,
            text: opt ? opt.text : p.text,
          };
        });
        this.emitState();
      } catch {
        // ignore
      }
    }
  }

  public getUnit(): number {
    return this.currentUnit;
  }

  public getLang(): Lang {
    return this.currentLang;
  }

  public getScheduler() {
    return this.scheduler;
  }

  public getState(): GameState {
    return {
      phase: this.phase,
      question: this.currentQuestion,
      pieces: this.pieces,
      feedback: this.feedback,
      failure: this.failure,
      stats: { ...this.stats },
    };
  }

  public start(): void {
    if (this.phase === "falling") return;
    this.failure = null;
    this.feedback = null;
    this.loadNextQuestion();
  }

  public pause(): void {
    if (this.phase === "falling") {
      this.phase = "idle";
      this.stopLoop();
      this.emitState();
    }
  }

  public resume(): void {
    if (this.phase === "idle" && this.currentQuestion && this.pieces.length > 0) {
      this.phase = "falling";
      this.lastTimestamp = performance.now();
      this.startLoop();
      this.emitState();
    } else {
      this.start();
    }
  }

  public resetGame(): void {
    this.stopLoop();
    this.phase = "idle";
    this.currentQuestion = null;
    this.pieces = [];
    this.feedback = null;
    this.failure = null;
    this.stats = {
      rounds: 0,
      correct: 0,
      wrong: 0,
      floors: 0,
      streak: 0,
      bestStreak: this.stats.bestStreak,
    };
    this.emitState();
  }

  /**
   * Resposta do jogador acionada via teclado (1, 2, 3, 4 ou A, B, C, D) ou clique na peça/botão.
   */
  public selectOption(key: string): void {
    if (this.phase !== "falling" || !this.currentQuestion) return;

    const chosenPiece = this.pieces.find((p) => p.key === key);
    if (!chosenPiece || chosenPiece.shattered) return;

    const isCorrect = chosenPiece.isCorrect;
    const correctPiece = this.pieces.find((p) => p.isCorrect);
    const correctKey = correctPiece ? correctPiece.key : key;

    this.stopLoop();

    if (isCorrect) {
      // Resposta correta: estilhaça a peça e concede feedback de consolidação
      this.pieces = this.pieces.map((p) =>
        p.key === key ? { ...p, shattered: true } : p
      );
      this.stats = {
        ...this.stats,
        rounds: this.stats.rounds + 1,
        correct: this.stats.correct + 1,
        streak: this.stats.streak + 1,
        bestStreak: Math.max(this.stats.bestStreak, this.stats.streak + 1),
      };

      this.feedback = {
        outcome: "correct",
        chosenKey: key,
        correctKey,
        explanation: this.currentQuestion.explanation,
      };
      this.phase = "feedback";

      // Atualiza repetição espaçada
      this.scheduler = recordAnswer(this.currentQuestion.cardId, true, this.scheduler);
      saveSchedulerState(this.scheduler, this.currentUnit);
      this.callbacks.onCardAnswered(this.currentQuestion.cardId, true);
      this.emitState();

      // Transição automática para a próxima pergunta após leitura da explicação
      this.feedbackTimer = window.setTimeout(() => {
        this.loadNextQuestion();
      }, this.config.feedbackDelayMs);
    } else {
      // Resposta errada: lapso imediato e reintrodução forçada
      this.stats = {
        ...this.stats,
        rounds: this.stats.rounds + 1,
        wrong: this.stats.wrong + 1,
        streak: 0,
      };

      this.feedback = {
        outcome: "wrong",
        chosenKey: key,
        correctKey,
        explanation: this.currentQuestion.explanation,
      };
      this.phase = "feedback";

      // Registra falha no agendador (vai para relearning com dueRound = currentRound + 1)
      this.scheduler = recordAnswer(this.currentQuestion.cardId, false, this.scheduler);
      saveSchedulerState(this.scheduler, this.currentUnit);
      this.callbacks.onCardAnswered(this.currentQuestion.cardId, false);
      this.emitState();

      // Dá ao aluno tempo para ler a refutação conceitual e continuar
      this.feedbackTimer = window.setTimeout(() => {
        this.loadNextQuestion();
      }, this.config.feedbackDelayMs + 1000);
    }
  }

  private loadNextQuestion(): void {
    if (this.feedbackTimer !== null) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }

    const nextCard = selectNextCard(this.currentUnit, this.curriculum, this.scheduler);
    if (!nextCard) {
      this.phase = "completed";
      this.currentQuestion = null;
      this.pieces = [];
      this.emitState();
      return;
    }

    try {
      this.currentQuestion = this.curriculum.materialize(nextCard.id, this.currentLang);
    } catch {
      this.phase = "completed";
      this.emitState();
      return;
    }

    this.callbacks.onQuestionLoaded(this.currentQuestion);

    // Gera as peças em queda nos slots
    const opts = this.currentQuestion.options;
    const numOpts = opts.length;

    // Todas as peças iniciam perfeitamente alinhadas no topo (sem escalonamento diagonal),
    // caindo em paralelo em suas respectivas pistas verticais dedicadas para que NUNCA
    // se misturem ou se choquem umas com as outras.
    this.pieces = opts.map((opt, i) => {
      const initialTop = -this.config.pieceHeightPercent;
      return {
        key: opt.key,
        text: opt.text,
        isCorrect: opt.isCorrect,
        topRow: initialTop,
        slot: i % Math.max(1, numOpts),
        shattered: false,
      };
    });

    this.feedback = null;
    this.failure = null;
    this.phase = "falling";
    this.lastTimestamp = performance.now();
    this.emitState();
    this.startLoop();
  }

  private startLoop(): void {
    this.stopLoop();
    const tick = (timestamp: number) => {
      const dt = Math.min(100, Math.max(0, timestamp - this.lastTimestamp));
      this.lastTimestamp = timestamp;

      this.updatePhysics(dt);

      if (this.phase === "falling") {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.feedbackTimer !== null) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }
  }

  private updatePhysics(dtMs: number): void {
    if (this.phase !== "falling") return;

    // Velocidade de descida puramente constante e invariável (requisito do sistema)
    const deltaY = (this.config.fallSpeedPercentPerSec * dtMs) / 1000;
    const floorLimit = 100 - this.config.pieceHeightPercent;

    let floorCollision = false;

    const nextPieces = this.pieces.map((p) => {
      if (p.shattered) return p;
      const newTop = p.topRow + deltaY;
      if (newTop >= floorLimit) {
        floorCollision = true;
      }
      return {
        ...p,
        topRow: newTop,
      };
    });

    this.pieces = nextPieces;

    // CONDIÇÃO DE FALHA CRÍTICA NÃO-NEGOCIÁVEL:
    // "A sessão resulta em falha crítica caso qualquer peça toque o chão."
    if (floorCollision) {
      this.stopLoop();
      this.phase = "failed";
      this.failure = "floor";
      this.stats = {
        ...this.stats,
        floors: this.stats.floors + 1,
        streak: 0,
      };

      if (this.currentQuestion) {
        const correctPiece = this.pieces.find((p) => p.isCorrect);
        this.feedback = {
          outcome: "floor",
          chosenKey: null,
          correctKey: correctPiece ? correctPiece.key : "",
          explanation: this.currentQuestion.explanation,
        };

        // Penalidade máxima: registrada como falha no agendador e reintrodução forçada
        this.scheduler = recordAnswer(this.currentQuestion.cardId, false, this.scheduler);
        saveSchedulerState(this.scheduler, this.currentUnit);
        this.callbacks.onCardAnswered(this.currentQuestion.cardId, false);
      }

      this.callbacks.onCriticalFailure("floor", this.currentQuestion);
      this.emitState();
      return;
    }

    this.emitState();
  }

  private emitState(): void {
    this.callbacks.onStateChange(this.getState());
  }

  public destroy(): void {
    this.stopLoop();
  }
}
