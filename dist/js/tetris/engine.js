import { createInitialSchedulerState, loadSchedulerState, recordAnswer, saveSchedulerState, selectNextCard, } from "./scheduler.js?v=b6a19a3f";
export const DEFAULT_ENGINE_CONFIG = {
    fallSpeedPercentPerSec: 5.0,
    pieceHeightPercent: 14,
    feedbackDelayMs: 2200,
};
export class TetrisEngine {
    curriculum;
    callbacks;
    phase = "idle";
    currentUnit = 1;
    currentLang = "pt";
    currentQuestion = null;
    pieces = [];
    feedback = null;
    failure = null;
    stats = {
        rounds: 0,
        correct: 0,
        wrong: 0,
        floors: 0,
        streak: 0,
        bestStreak: 0,
    };
    animationFrameId = null;
    lastTimestamp = 0;
    feedbackTimer = null;
    scheduler = createInitialSchedulerState();
    config;
    constructor(curriculum, callbacks, config = {}) {
        this.curriculum = curriculum;
        this.callbacks = callbacks;
        this.config = { ...DEFAULT_ENGINE_CONFIG, ...config };
        this.scheduler = loadSchedulerState(this.currentUnit);
    }
    setUnit(unit) {
        if (this.currentUnit === unit)
            return;
        this.stopLoop();
        this.currentUnit = unit;
        this.scheduler = loadSchedulerState(unit);
        this.resetGame();
    }
    setLang(lang) {
        if (this.currentLang === lang)
            return;
        this.currentLang = lang;
        if (this.currentQuestion) {
            try {
                const reloaded = this.curriculum.materialize(this.currentQuestion.cardId, lang);
                this.currentQuestion = reloaded;
                this.pieces = this.pieces.map((p) => {
                    const opt = reloaded.options.find((o) => o.key === p.key);
                    return {
                        ...p,
                        text: opt ? opt.text : p.text,
                    };
                });
                this.emitState();
            }
            catch {
            }
        }
    }
    getUnit() {
        return this.currentUnit;
    }
    getLang() {
        return this.currentLang;
    }
    getScheduler() {
        return this.scheduler;
    }
    getState() {
        return {
            phase: this.phase,
            question: this.currentQuestion,
            pieces: this.pieces,
            feedback: this.feedback,
            failure: this.failure,
            stats: { ...this.stats },
        };
    }
    start() {
        if (this.phase === "falling")
            return;
        this.failure = null;
        this.feedback = null;
        this.loadNextQuestion();
    }
    pause() {
        if (this.phase === "falling") {
            this.phase = "idle";
            this.stopLoop();
            this.emitState();
        }
    }
    resume() {
        if (this.phase === "idle" && this.currentQuestion && this.pieces.length > 0) {
            this.phase = "falling";
            this.lastTimestamp = performance.now();
            this.startLoop();
            this.emitState();
        }
        else {
            this.start();
        }
    }
    resetGame() {
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
    selectOption(key) {
        if (this.phase !== "falling" || !this.currentQuestion)
            return;
        const chosenPiece = this.pieces.find((p) => p.key === key);
        if (!chosenPiece || chosenPiece.shattered)
            return;
        const isCorrect = chosenPiece.isCorrect;
        const correctPiece = this.pieces.find((p) => p.isCorrect);
        const correctKey = correctPiece ? correctPiece.key : key;
        this.stopLoop();
        if (isCorrect) {
            this.pieces = this.pieces.map((p) => p.key === key ? { ...p, shattered: true } : p);
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
            this.scheduler = recordAnswer(this.currentQuestion.cardId, true, this.scheduler);
            saveSchedulerState(this.scheduler, this.currentUnit);
            this.callbacks.onCardAnswered(this.currentQuestion.cardId, true);
            this.emitState();
            this.feedbackTimer = window.setTimeout(() => {
                this.loadNextQuestion();
            }, this.config.feedbackDelayMs);
        }
        else {
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
            this.scheduler = recordAnswer(this.currentQuestion.cardId, false, this.scheduler);
            saveSchedulerState(this.scheduler, this.currentUnit);
            this.callbacks.onCardAnswered(this.currentQuestion.cardId, false);
            this.emitState();
            this.feedbackTimer = window.setTimeout(() => {
                this.loadNextQuestion();
            }, this.config.feedbackDelayMs + 1000);
        }
    }
    loadNextQuestion() {
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
        }
        catch {
            this.phase = "completed";
            this.emitState();
            return;
        }
        this.callbacks.onQuestionLoaded(this.currentQuestion);
        const opts = this.currentQuestion.options;
        const numOpts = opts.length;
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
    startLoop() {
        this.stopLoop();
        const tick = (timestamp) => {
            const dt = Math.min(100, Math.max(0, timestamp - this.lastTimestamp));
            this.lastTimestamp = timestamp;
            this.updatePhysics(dt);
            if (this.phase === "falling") {
                this.animationFrameId = requestAnimationFrame(tick);
            }
        };
        this.animationFrameId = requestAnimationFrame(tick);
    }
    stopLoop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.feedbackTimer !== null) {
            clearTimeout(this.feedbackTimer);
            this.feedbackTimer = null;
        }
    }
    updatePhysics(dtMs) {
        if (this.phase !== "falling")
            return;
        const deltaY = (this.config.fallSpeedPercentPerSec * dtMs) / 1000;
        const floorLimit = 100 - this.config.pieceHeightPercent;
        let floorCollision = false;
        const nextPieces = this.pieces.map((p) => {
            if (p.shattered)
                return p;
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
    emitState() {
        this.callbacks.onStateChange(this.getState());
    }
    destroy() {
        this.stopLoop();
    }
}
//# sourceMappingURL=engine.js.map