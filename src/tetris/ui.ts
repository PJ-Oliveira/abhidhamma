import type { GameState, Lang, Question } from "./types.js";
import { TetrisEngine } from "./engine.js";
import { Curriculum, loadCurriculum } from "./curriculum.js";
import { computeUnitMastery } from "./scheduler.js";

const LABELS = {
  pt: {
    title: "Abhidhamma Tetris",
    subtitle: "Domínio 100% do Abhidhammatthasaṅgaha",
    unitLabel: "Unidade",
    mastery: "Domínio",
    streak: "Sequência",
    rounds: "Rodadas",
    start: "Iniciar",
    pause: "Pausar",
    resume: "Continuar",
    reset: "Reiniciar",
    floorWarning: "CHÃO: COLISÃO = FALHA CRÍTICA",
    criticalFailureTitle: "FALHA CRÍTICA!",
    criticalFailureDesc: "Uma peça colidiu com o chão antes da validação.",
    retryBtn: "Tentar Novamente",
    correctTitle: "Correto!",
    wrongTitle: "Incorreto!",
    waitingPrompt: "Pressione 'Iniciar' para começar a queda das peças.",
    expand: "Expandir",
    collapse: "Recolher",
    keyboardHint: "Responda clicando na peça ou teclando [1–4] • [Espaço] Iniciar/Pausar",
    pausedTitle: "Jogo Pausado",
    pausedDesc: "Pressione 'Continuar' ou a barra de espaço para prosseguir.",
    unitCompletedTitle: "Unidade Concluída!",
    unitCompletedDesc: "Você alcançou 100% de precisão nos conceitos desta unidade.",
    continuePracticeBtn: "Continuar Prática",
  },
  en: {
    title: "Abhidhamma Tetris",
    subtitle: "100% Mastery of Abhidhammatthasaṅgaha",
    unitLabel: "Unit",
    mastery: "Mastery",
    streak: "Streak",
    rounds: "Rounds",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    floorWarning: "FLOOR: COLLISION = CRITICAL FAILURE",
    criticalFailureTitle: "CRITICAL FAILURE!",
    criticalFailureDesc: "A piece touched the floor before validation.",
    retryBtn: "Try Again",
    correctTitle: "Correct!",
    wrongTitle: "Incorrect!",
    waitingPrompt: "Press 'Start' to begin the falling pieces.",
    expand: "Expand",
    collapse: "Collapse",
    keyboardHint: "Answer by clicking the piece or pressing [1–4] • [Space] Start/Pause",
    pausedTitle: "Game Paused",
    pausedDesc: "Press 'Resume' or Spacebar to continue.",
    unitCompletedTitle: "Unit Completed!",
    unitCompletedDesc: "You reached 100% precision on this unit's concepts.",
    continuePracticeBtn: "Continue Practice",
  },
  es: {
    title: "Abhidhamma Tetris",
    subtitle: "Dominio 100% del Abhidhammatthasaṅgaha",
    unitLabel: "Unidad",
    mastery: "Dominio",
    streak: "Racha",
    rounds: "Rondas",
    start: "Iniciar",
    pause: "Pausar",
    resume: "Continuar",
    reset: "Reiniciar",
    floorWarning: "SUELO: COLISIÓN = FALLA CRÍTICA",
    criticalFailureTitle: "¡FALLA CRÍTICA!",
    criticalFailureDesc: "Una pieza colisionó con el suelo antes de la validación.",
    retryBtn: "Intentar de Nuevo",
    correctTitle: "¡Correcto!",
    wrongTitle: "¡Incorrecto!",
    waitingPrompt: "Presione 'Iniciar' para comenzar la caída de piezas.",
    expand: "Expandir",
    collapse: "Contraer",
    keyboardHint: "Responda haciendo clic en la pieza o tecleando [1–4] • [Espacio] Iniciar/Pausar",
    pausedTitle: "Juego Pausado",
    pausedDesc: "Presione 'Continuar' o la barra espaciadora para proseguir.",
    unitCompletedTitle: "¡Unidad Completada!",
    unitCompletedDesc: "Alcanzaste 100% de precisión en los conceptos de esta unidad.",
    continuePracticeBtn: "Continuar Práctica",
  },
} as const;

export class TetrisUI {
  private container: HTMLElement;
  private engine!: TetrisEngine;
  private curriculum!: Curriculum;
  private lang: Lang = "pt";
  private isExpanded = false;

  // Elementos do DOM
  private wrapperEl!: HTMLElement;
  private piecesContainerEl!: HTMLElement;
  private topicEl!: HTMLElement;
  private promptEl!: HTMLElement;
  private overlayEl!: HTMLElement;
  private masteryValEl!: HTMLElement;
  private streakValEl!: HTMLElement;
  private startPauseBtn!: HTMLButtonElement;
  private unitSelectEl!: HTMLSelectElement;

  constructor(targetContainer: HTMLElement, lang: Lang = "pt") {
    this.container = targetContainer;
    this.lang = lang;
  }

  public async init(): Promise<void> {
    this.curriculum = await loadCurriculum();
    this.renderSkeleton();

    this.engine = new TetrisEngine(
      this.curriculum,
      {
        onStateChange: (state) => this.onStateChange(state),
        onQuestionLoaded: (q) => this.onQuestionLoaded(q),
        onCriticalFailure: () => this.onCriticalFailure(),
        onCardAnswered: () => this.updateMasteryDisplay(),
      },
      {
        fallSpeedPercentPerSec: 5.0, // Velocidade constante razoável
        pieceHeightPercent: 14,
        feedbackDelayMs: 2200,
      }
    );
    this.engine.setLang(this.lang);

    this.bindEvents();
    this.populateUnits();
    this.updateMasteryDisplay();
  }

  public setLang(lang: Lang): void {
    if (this.lang === lang) return;
    this.lang = lang;
    if (this.engine) {
      this.engine.setLang(lang);
    }
    this.updateStaticLabels();
    this.populateUnits();
    this.updateMasteryDisplay();
  }

  private renderSkeleton(): void {
    this.container.innerHTML = "";

    const strings = LABELS[this.lang];

    this.wrapperEl = document.createElement("div");
    this.wrapperEl.className = "tetris-widget";

    this.wrapperEl.innerHTML = `
      <div class="tetris-header">
        <div class="tetris-title-row">
          <div class="tetris-brand">
            <span class="tetris-icon">☸</span>
            <span class="tetris-title-text">${strings.title}</span>
          </div>
        </div>
        <div class="tetris-unit-row">
          <select class="tetris-unit-select"></select>
        </div>
        <div class="tetris-stats-row">
          <span class="tetris-stat-pill" title="100% Target Precision">
            <span class="stat-lbl tetris-mastery-lbl">${strings.mastery}:</span>
            <strong class="tetris-mastery-val">0%</strong>
          </span>
          <span class="tetris-stat-pill">
            <span class="stat-lbl tetris-streak-lbl">🔥 ${strings.streak}:</span>
            <strong class="tetris-streak-val">0</strong>
          </span>
          <button class="tetris-expand-btn" title="${strings.expand}">⤢</button>
        </div>
      </div>

      <div class="tetris-arena">
        <div class="tetris-matrix">
          <div class="tetris-matrix-grid-lines">
            <div class="tetris-lane-guide"></div>
            <div class="tetris-lane-guide"></div>
            <div class="tetris-lane-guide"></div>
            <div class="tetris-lane-guide"></div>
          </div>
          <div class="tetris-pieces-container"></div>
          <div class="tetris-floor">
            <span class="floor-hazard-stripe"></span>
            <span class="floor-text">${strings.floorWarning}</span>
          </div>
        </div>

        <div class="tetris-question-box">
          <div class="tetris-topic-badge">...</div>
          <div class="tetris-prompt-text">${strings.waitingPrompt}</div>
        </div>

        <div class="tetris-overlay" style="display: none;"></div>
      </div>

      <div class="tetris-controls-row">
        <span class="tetris-kb-hint">${strings.keyboardHint}</span>
        <div class="tetris-controls-btns">
          <button class="tetris-btn tetris-btn-primary tetris-start-btn">${strings.start}</button>
          <button class="tetris-btn tetris-btn-secondary tetris-reset-btn">${strings.reset}</button>
        </div>
      </div>
    `;

    this.container.appendChild(this.wrapperEl);

    this.piecesContainerEl = this.wrapperEl.querySelector(".tetris-pieces-container")!;
    this.topicEl = this.wrapperEl.querySelector(".tetris-topic-badge")!;
    this.promptEl = this.wrapperEl.querySelector(".tetris-prompt-text")!;
    this.overlayEl = this.wrapperEl.querySelector(".tetris-overlay")!;
    this.masteryValEl = this.wrapperEl.querySelector(".tetris-mastery-val")!;
    this.streakValEl = this.wrapperEl.querySelector(".tetris-streak-val")!;
    this.startPauseBtn = this.wrapperEl.querySelector(".tetris-start-btn")!;
    this.unitSelectEl = this.wrapperEl.querySelector(".tetris-unit-select")!;
  }

  private updateStaticLabels(): void {
    const s = LABELS[this.lang];
    const titleText = this.wrapperEl.querySelector(".tetris-title-text");
    if (titleText) titleText.textContent = s.title;

    const masteryLbl = this.wrapperEl.querySelector(".tetris-mastery-lbl");
    if (masteryLbl) masteryLbl.textContent = `${s.mastery}:`;

    const streakLbl = this.wrapperEl.querySelector(".tetris-streak-lbl");
    if (streakLbl) streakLbl.textContent = `🔥 ${s.streak}:`;

    const floorText = this.wrapperEl.querySelector(".floor-text");
    if (floorText) floorText.textContent = s.floorWarning;

    const expandBtn = this.wrapperEl.querySelector(".tetris-expand-btn");
    if (expandBtn) expandBtn.setAttribute("title", this.isExpanded ? s.collapse : s.expand);

    const resetBtn = this.wrapperEl.querySelector(".tetris-reset-btn");
    if (resetBtn) resetBtn.textContent = s.reset;

    const kbHint = this.wrapperEl.querySelector(".tetris-kb-hint");
    if (kbHint) kbHint.textContent = s.keyboardHint;

    if (this.engine.getState().phase === "idle" && !this.engine.getState().question) {
      this.promptEl.textContent = s.waitingPrompt;
      this.startPauseBtn.textContent = s.start;
    }
  }

  private populateUnits(): void {
    const units = this.curriculum.getAllUnits();
    const currentVal = this.engine ? this.engine.getUnit() : 1;
    this.unitSelectEl.innerHTML = "";

    for (const u of units) {
      const opt = document.createElement("option");
      opt.value = String(u.unit);
      opt.textContent = `U${u.unit}: ${u.title[this.lang]}`;
      if (u.unit === currentVal) opt.selected = true;
      this.unitSelectEl.appendChild(opt);
    }
  }

  private updateMasteryDisplay(): void {
    if (!this.engine || !this.curriculum) return;
    const unit = this.engine.getUnit();
    const metrics = computeUnitMastery(unit, this.curriculum, this.engine.getScheduler());
    this.masteryValEl.textContent = `${metrics.masteryPercent}%`;
    if (metrics.masteryPercent === 100) {
      this.masteryValEl.style.color = "#10b981"; // Gold / green mastery glow
    } else {
      this.masteryValEl.style.color = "";
    }
  }

  private bindEvents(): void {
    this.startPauseBtn.addEventListener("click", () => {
      const state = this.engine.getState();
      const s = LABELS[this.lang];
      if (state.phase === "idle") {
        this.engine.resume();
        this.startPauseBtn.textContent = s.pause;
      } else if (state.phase === "falling") {
        this.engine.pause();
        this.startPauseBtn.textContent = s.resume;
      } else if (state.phase === "failed" || state.phase === "completed") {
        this.engine.resetGame();
        this.engine.start();
        this.startPauseBtn.textContent = s.pause;
      }
    });

    const resetBtn = this.wrapperEl.querySelector(".tetris-reset-btn")!;
    resetBtn.addEventListener("click", () => {
      this.engine.resetGame();
      this.overlayEl.style.display = "none";
      this.piecesContainerEl.innerHTML = "";
      this.promptEl.textContent = LABELS[this.lang].waitingPrompt;
      this.startPauseBtn.textContent = LABELS[this.lang].start;
    });

    this.unitSelectEl.addEventListener("change", () => {
      const u = parseInt(this.unitSelectEl.value, 10);
      this.engine.setUnit(u);
      this.overlayEl.style.display = "none";
      this.piecesContainerEl.innerHTML = "";
      this.updateMasteryDisplay();
      this.promptEl.textContent = LABELS[this.lang].waitingPrompt;
      this.startPauseBtn.textContent = LABELS[this.lang].start;
    });

    const expandBtn = this.wrapperEl.querySelector(".tetris-expand-btn")!;
    expandBtn.addEventListener("click", () => {
      this.toggleExpand();
    });

    // Keyboard listener for instant response
    window.addEventListener("keydown", (e) => {
      // Don't intercept if user is typing in an input
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;

      if (!this.container.offsetParent) return; // not visible

      const key = e.key.toUpperCase();
      if (key === "1" || key === "2" || key === "3" || key === "4" || key === "5") {
        this.engine.selectOption(key);
      } else if (key === "A" || key === "B" || key === "C" || key === "D") {
        this.engine.selectOption(key);
      } else if (key === " ") {
        if (this.engine.getState().phase === "falling") {
          this.engine.pause();
          this.startPauseBtn.textContent = LABELS[this.lang].resume;
        } else if (this.engine.getState().phase === "idle") {
          this.engine.resume();
          this.startPauseBtn.textContent = LABELS[this.lang].pause;
        }
      }
    });
  }

  private toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.wrapperEl.classList.toggle("tetris-expanded", this.isExpanded);
    const expandBtn = this.wrapperEl.querySelector(".tetris-expand-btn");
    const s = LABELS[this.lang];
    if (expandBtn) {
      expandBtn.setAttribute("title", this.isExpanded ? s.collapse : s.expand);
      expandBtn.textContent = this.isExpanded ? "⤓" : "⤢";
    }
  }

  private onStateChange(state: GameState): void {
    this.streakValEl.textContent = String(state.stats.streak);

    if (state.phase === "falling") {
      this.renderFallingPieces(state);
      this.overlayEl.style.display = "none";
    } else if (state.phase === "feedback" && state.feedback) {
      this.renderFeedbackOverlay(state.feedback);
    } else if (state.phase === "failed") {
      this.renderFailureOverlay();
    } else if (state.phase === "completed") {
      this.renderCompletedOverlay();
    } else if (state.phase === "idle" && state.question && state.pieces.length > 0) {
      this.renderPausedOverlay();
    } else if (state.phase === "idle") {
      this.overlayEl.style.display = "none";
    }
  }

  private onQuestionLoaded(question: Question): void {
    this.topicEl.textContent = question.topic;
    this.promptEl.textContent = question.prompt;
    this.overlayEl.style.display = "none";
    this.startPauseBtn.textContent = LABELS[this.lang].pause;
    // Limpa o contêiner de peças para renderizar com frescor na matriz
    this.piecesContainerEl.innerHTML = "";
  }

  private onCriticalFailure(): void {
    this.renderFailureOverlay();
  }

  private renderFallingPieces(state: GameState): void {
    const pieces = state.pieces;
    const numPieces = pieces.length;

    // Remove peças que sumiram
    const existingDom = Array.from(this.piecesContainerEl.children) as HTMLElement[];
    const activeKeys = new Set(pieces.map((p) => p.key));
    for (const el of existingDom) {
      if (!activeKeys.has(el.dataset.key ?? "")) {
        el.remove();
      }
    }

    const colWidth = 100 / Math.max(1, numPieces);
    // Margens adaptativas para garantir separação visual sem comprimir texto no mobile
    const containerW = this.piecesContainerEl.clientWidth || this.container.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
    const gutter = containerW < 600 ? 5 : 14;

    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i]!;
      let pieceEl = this.piecesContainerEl.querySelector(`[data-key="${p.key}"]`) as HTMLElement | null;

      if (!pieceEl) {
        pieceEl = document.createElement("div");
        pieceEl.className = `tetris-piece tetris-piece-slot-${i % 4}`;
        pieceEl.dataset.key = p.key;
        pieceEl.innerHTML = `
          <div class="piece-header">
            <span class="piece-key-badge">${p.key}</span>
          </div>
          <div class="piece-body">${p.text}</div>
        `;
        pieceEl.addEventListener("click", () => {
          this.engine.selectOption(p.key);
        });
        this.piecesContainerEl.appendChild(pieceEl);
      } else {
        const bodyEl = pieceEl.querySelector(".piece-body");
        if (bodyEl && bodyEl.textContent !== p.text) {
          bodyEl.textContent = p.text;
        }
      }

      // Posicionamento vertical contínuo com separação lateral estrita
      pieceEl.style.top = `calc(${p.topRow}% + 4px)`;
      pieceEl.style.left = `calc(${p.slot * colWidth}% + ${gutter}px)`;
      pieceEl.style.width = `calc(${colWidth}% - ${gutter * 2}px)`;

      if (p.shattered) {
        pieceEl.classList.add("piece-shattered");
      }
    }
  }

  private renderPausedOverlay(): void {
    const s = LABELS[this.lang];
    this.overlayEl.className = "tetris-overlay overlay-paused";
    this.overlayEl.style.display = "flex";

    this.overlayEl.innerHTML = `
      <div class="overlay-card paused-card">
        <div class="overlay-icon">⏸</div>
        <h3 class="overlay-title">${s.pausedTitle}</h3>
        <p class="overlay-explanation">${s.pausedDesc}</p>
        <button class="tetris-btn tetris-btn-primary resume-overlay-btn">${s.resume}</button>
      </div>
    `;

    const resumeBtn = this.overlayEl.querySelector(".resume-overlay-btn");
    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => {
        this.engine.resume();
        this.startPauseBtn.textContent = s.pause;
      });
    }
  }

  private renderFeedbackOverlay(fb: NonNullable<GameState["feedback"]>): void {
    const s = LABELS[this.lang];
    const isCorrect = fb.outcome === "correct";
    this.overlayEl.className = `tetris-overlay ${isCorrect ? "overlay-correct" : "overlay-wrong"}`;
    this.overlayEl.style.display = "flex";

    this.overlayEl.innerHTML = `
      <div class="overlay-card">
        <div class="overlay-icon">${isCorrect ? "✓" : "✗"}</div>
        <h3 class="overlay-title">${isCorrect ? s.correctTitle : s.wrongTitle}</h3>
        <p class="overlay-explanation">${fb.explanation}</p>
      </div>
    `;
  }

  private renderFailureOverlay(): void {
    const s = LABELS[this.lang];
    this.overlayEl.className = "tetris-overlay overlay-failed";
    this.overlayEl.style.display = "flex";

    this.overlayEl.innerHTML = `
      <div class="overlay-card failure-card">
        <div class="overlay-icon">⚡</div>
        <h3 class="overlay-title">${s.criticalFailureTitle}</h3>
        <p class="overlay-explanation">${s.criticalFailureDesc}</p>
        <button class="tetris-btn tetris-btn-primary retry-fail-btn">${s.retryBtn}</button>
      </div>
    `;

    const retryBtn = this.overlayEl.querySelector(".retry-fail-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        this.engine.start();
      });
    }
  }

  private renderCompletedOverlay(): void {
    const s = LABELS[this.lang];
    this.overlayEl.className = "tetris-overlay overlay-completed";
    this.overlayEl.style.display = "flex";

    this.overlayEl.innerHTML = `
      <div class="overlay-card">
        <div class="overlay-icon">☸</div>
        <h3 class="overlay-title">${s.unitCompletedTitle}</h3>
        <p class="overlay-explanation">${s.unitCompletedDesc}</p>
        <button class="tetris-btn tetris-btn-primary replay-btn">${s.continuePracticeBtn}</button>
      </div>
    `;

    const replayBtn = this.overlayEl.querySelector(".replay-btn");
    if (replayBtn) {
      replayBtn.addEventListener("click", () => {
        this.engine.start();
      });
    }
  }
}
