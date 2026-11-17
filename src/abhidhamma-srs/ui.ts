import {
  buildStudyQueue,
  computeAllChapterProgress,
  createInitialAnkiCardState,
  loadAnkiCardStates,
  loadAnkiConfig,
  loadAnkiStats,
  previewAnkiIntervals,
  saveAnkiCardStates,
  saveAnkiConfig,
  saveAnkiStats,
  scheduleAnkiCard,
} from "./scheduler.js";
import { settings } from "../state.js";
import type {
  AbhidhammaCard,
  AbhidhammaChapterMeta,
  AbhidhammaDataset,
  AnkiCardState,
  AnkiConfig,
  AnkiRating,
  AnkiStats,
  CardTier,
  Lang,
} from "./types.js";

interface AbhiSrsStrings {
  moduleTitle: string;
  moduleSubtitle: string;
  studyAllUnlocked: string;
  studyChapter: string;
  backToChapters: string;
  memorized: string;
  dueNow: string;
  retentionToday: string;
  streak: string;
  daysUnit: string;
  newPerDay: string;
  unlimited: string;
  tierAtom: string;
  tierStructure: string;
  tierHouse: string;
  tierLegend: string;
  unlocked: string;
  locked: string;
  unlockHintPrefix: string;
  unlockHintMiddle: string;
  unlockMissingSuffix: string;
  bricksLabel: string;
  houseUnlockedLabel: string;
  houseLockedPrefix: string;
  houseLockedSuffix: string;
  countNew: string;
  countLearning: string;
  countReview: string;
  countMastered: string;
  recallPlaceholder: string;
  showAnswer: string;
  again: string;
  hard: string;
  good: string;
  easy: string;
  lakkhana: string;
  rasa: string;
  paccupatthana: string;
  padatthana: string;
  mechanicsTitle: string;
  sourceLabel: string;
  openInReader: string;
  sessionCompleteTitle: string;
  sessionCompleteDesc: string;
  reviewedTodayLabel: string;
  newTodayLabel: string;
  studyMoreNew: string;
  loadingDataset: string;
  loadError: string;
  noUnlockedCards: string;
  allScopeTitle: string;
  chapterPrefix: string;
  resetProgress: string;
  resetConfirm: string;
}

const UI_STRINGS: Record<Lang, AbhiSrsStrings> = {
  pt: {
    moduleTitle: "Abhidhammatthasaṅgaha — Repetição Espaçada (Anki SRS)",
    moduleSubtitle:
      "Memorização exaustiva de cada dhamma discreto por recordação ativa, progressão canônica condicionada e desbloqueio acumulativo (Tijolos → Casa).",
    studyAllUnlocked: "Estudar Todos Desbloqueados",
    studyChapter: "Estudar Capítulo",
    backToChapters: "← Capítulos",
    memorized: "Memorizadas",
    dueNow: "Devidas Agora",
    retentionToday: "Retenção Hoje",
    streak: "Sequência",
    daysUnit: "d",
    newPerDay: "Novas/dia",
    unlimited: "Ilimitado",
    tierAtom: "Tijolo (Átomo)",
    tierStructure: "Estrutura",
    tierHouse: "Casa (Síntese)",
    tierLegend: "🧱 Tijolos (unidades irredutíveis) → 🏗 Estruturas (agrupamentos) → 🏛 Casa (sínteses complexas)",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    unlockHintPrefix: "Exige ≥",
    unlockHintMiddle: "% dos tijolos do Cap.",
    unlockMissingSuffix: "faltam",
    bricksLabel: "tijolos",
    houseUnlockedLabel: "Casa desbloqueada",
    houseLockedPrefix: "Casa exige",
    houseLockedSuffix: "% de tijolos deste capítulo",
    countNew: "Novas",
    countLearning: "Aprendendo",
    countReview: "Revisar",
    countMastered: "Dominadas",
    recallPlaceholder: "Recordação ativa (opcional): formule mentalmente ou escreva definição, lakkhaṇa e mecânica antes de revelar…",
    showAnswer: "Mostrar Resposta [Espaço]",
    again: "Errei",
    hard: "Difícil",
    good: "Bom",
    easy: "Fácil",
    lakkhana: "Lakkhaṇa (Característica)",
    rasa: "Rasa (Função)",
    paccupatthana: "Paccupaṭṭhāna (Manifestação)",
    padatthana: "Padaṭṭhāna (Causa Próxima)",
    mechanicsTitle: "Mecânica Estrutural",
    sourceLabel: "Fonte Canônica",
    openInReader: "Ler no Abhidhammatthasaṅgaha ↗",
    sessionCompleteTitle: "Sessão Concluída!",
    sessionCompleteDesc: "Todas as cartas devidas e a cota atual deste escopo foram revisadas.",
    reviewedTodayLabel: "Revisadas hoje",
    newTodayLabel: "Novas estudadas hoje",
    studyMoreNew: "Liberar +10 Novas Hoje",
    loadingDataset: "Carregando tratado e baralho canônico…",
    loadError: "Não foi possível carregar o baralho do Abhidhammatthasaṅgaha.",
    noUnlockedCards: "Nenhuma carta desbloqueada disponível neste escopo no momento.",
    allScopeTitle: "Todos os Capítulos Desbloqueados",
    chapterPrefix: "Cap.",
    resetProgress: "Resetar Progresso",
    resetConfirm: "Tem certeza que deseja zerar todo o histórico Anki do Abhidhammatthasaṅgaha?",
  },
  en: {
    moduleTitle: "Abhidhammatthasaṅgaha — Spaced Repetition (Anki SRS)",
    moduleSubtitle:
      "Exhaustive active-recall mastery of every discrete dhamma with conditional chapter progression and cumulative unlocking (Bricks → House).",
    studyAllUnlocked: "Study All Unlocked",
    studyChapter: "Study Chapter",
    backToChapters: "← Chapters",
    memorized: "Memorized",
    dueNow: "Due Now",
    retentionToday: "Retention Today",
    streak: "Streak",
    daysUnit: "d",
    newPerDay: "New/day",
    unlimited: "Unlimited",
    tierAtom: "Brick (Atom)",
    tierStructure: "Structure",
    tierHouse: "House (Synthesis)",
    tierLegend: "🧱 Bricks (irreducible units) → 🏗 Structures (groupings) → 🏛 House (complex syntheses)",
    unlocked: "Unlocked",
    locked: "Locked",
    unlockHintPrefix: "Requires ≥",
    unlockHintMiddle: "% of Ch.",
    unlockMissingSuffix: "missing",
    bricksLabel: "bricks",
    houseUnlockedLabel: "House unlocked",
    houseLockedPrefix: "House requires",
    houseLockedSuffix: "% of this chapter's bricks",
    countNew: "New",
    countLearning: "Learning",
    countReview: "Review",
    countMastered: "Mastered",
    recallPlaceholder: "Active recall (optional): formulate or type the definition, lakkhaṇa, and mechanics before revealing…",
    showAnswer: "Show Answer [Space]",
    again: "Again",
    hard: "Hard",
    good: "Good",
    easy: "Easy",
    lakkhana: "Lakkhaṇa (Characteristic)",
    rasa: "Rasa (Function)",
    paccupatthana: "Paccupaṭṭhāna (Manifestation)",
    padatthana: "Padaṭṭhāna (Proximate Cause)",
    mechanicsTitle: "Structural Mechanics",
    sourceLabel: "Canonical Source",
    openInReader: "Open in Abhidhammatthasaṅgaha ↗",
    sessionCompleteTitle: "Session Complete!",
    sessionCompleteDesc: "All due cards and today's new card quota in this scope have been completed.",
    reviewedTodayLabel: "Reviewed today",
    newTodayLabel: "New studied today",
    studyMoreNew: "Allow +10 New Today",
    loadingDataset: "Loading canonical treatise deck…",
    loadError: "Failed to load the Abhidhammatthasaṅgaha deck.",
    noUnlockedCards: "No unlocked cards available in this scope right now.",
    allScopeTitle: "All Unlocked Chapters",
    chapterPrefix: "Ch.",
    resetProgress: "Reset Progress",
    resetConfirm: "Are you sure you want to reset all Abhidhammatthasaṅgaha Anki SRS progress?",
  },
  es: {
    moduleTitle: "Abhidhammatthasaṅgaha — Repetición Espaciada (Anki SRS)",
    moduleSubtitle:
      "Memorización exhaustiva de cada dhamma discreto mediante recuerdo activo, progresión canónica condicionada y desbloqueo acumulativo (Ladrillos → Casa).",
    studyAllUnlocked: "Estudiar Todos Desbloqueados",
    studyChapter: "Estudiar Capítulo",
    backToChapters: "← Capítulos",
    memorized: "Memorizadas",
    dueNow: "Pendientes Ahora",
    retentionToday: "Retención Hoy",
    streak: "Racha",
    daysUnit: "d",
    newPerDay: "Nuevas/día",
    unlimited: "Ilimitado",
    tierAtom: "Ladrillo (Átomo)",
    tierStructure: "Estructura",
    tierHouse: "Casa (Síntesis)",
    tierLegend: "🧱 Ladrillos (unidades irreductibles) → 🏗 Estructuras (agrupaciones) → 🏛 Casa (síntesis complejas)",
    unlocked: "Desbloqueado",
    locked: "Bloqueado",
    unlockHintPrefix: "Requiere ≥",
    unlockHintMiddle: "% de ladrillos del Cap.",
    unlockMissingSuffix: "faltan",
    bricksLabel: "ladrillos",
    houseUnlockedLabel: "Casa desbloqueada",
    houseLockedPrefix: "La casa requiere",
    houseLockedSuffix: "% de ladrillos de este capítulo",
    countNew: "Nuevas",
    countLearning: "Aprendiendo",
    countReview: "Repasar",
    countMastered: "Dominadas",
    recallPlaceholder: "Recuerdo activo (opcional): formule o escriba definición, lakkhaṇa y mecánica antes de revelar…",
    showAnswer: "Mostrar Respuesta [Espacio]",
    again: "Otra vez",
    hard: "Difícil",
    good: "Bien",
    easy: "Fácil",
    lakkhana: "Lakkhaṇa (Característica)",
    rasa: "Rasa (Función)",
    paccupatthana: "Paccupaṭṭhāna (Manifestación)",
    padatthana: "Padaṭṭhāna (Causa Próxima)",
    mechanicsTitle: "Mecánica Estructural",
    sourceLabel: "Fuente Canónica",
    openInReader: "Abrir en Abhidhammatthasaṅgaha ↗",
    sessionCompleteTitle: "¡Sesión Completada!",
    sessionCompleteDesc: "Todas las tarjetas pendientes y la cuota diaria de este ámbito se han completado.",
    reviewedTodayLabel: "Revisadas hoy",
    newTodayLabel: "Nuevas estudiadas hoy",
    studyMoreNew: "Permitir +10 Nuevas Hoy",
    loadingDataset: "Cargando baraja canónica del tratado…",
    loadError: "No se pudo cargar la baraja del Abhidhammatthasaṅgaha.",
    noUnlockedCards: "No hay tarjetas desbloqueadas disponibles en este ámbito.",
    allScopeTitle: "Todos los Capítulos Desbloqueados",
    chapterPrefix: "Cap.",
    resetProgress: "Reiniciar Progreso",
    resetConfirm: "¿Seguro que deseas borrar todo el progreso Anki del Abhidhammatthasaṅgaha?",
  },
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tierBadge(tier: CardTier, lang: Lang): string {
  const s = UI_STRINGS[lang];
  if (tier === "atom") return `🧱 ${s.tierAtom}`;
  if (tier === "structure") return `🏗 ${s.tierStructure}`;
  return `🏛 ${s.tierHouse}`;
}

function resolvePaliTerm(card: AbhidhammaCard, lang: Lang): string {
  return typeof card.paliTerm === "string" ? card.paliTerm : card.paliTerm[lang];
}

export class AbhidhammaSrsUI {
  private container: HTMLElement;
  private lang: Lang;
  private dataset: AbhidhammaDataset | null = null;
  private states: Record<string, AnkiCardState> = {};
  private stats: AnkiStats;
  private config: AnkiConfig;

  private view: "overview" | "study" = "overview";
  private scopeChapter: number | null = null;
  private activeCard: AbhidhammaCard | null = null;
  private isFlipped = false;
  private keyListenerBound = false;

  constructor(container: HTMLElement, lang: Lang = "pt") {
    this.container = container;
    this.lang = lang;
    this.states = loadAnkiCardStates();
    this.stats = loadAnkiStats();
    this.config = loadAnkiConfig();
  }

  public setLang(lang: Lang): void {
    if (this.lang === lang) return;
    this.lang = lang;
    this.render();
  }

  public async init(): Promise<void> {
    this.renderLoading();
    try {
      const res = await fetch("data/srs/abhidhamma_cards.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.dataset = (await res.json()) as AbhidhammaDataset;
      this.bindKeyboard();
      this.render();
    } catch {
      const s = UI_STRINGS[this.lang];
      this.container.innerHTML = `<div class="abhi-srs-empty">${esc(s.loadError)}</div>`;
    }
  }

  private renderLoading(): void {
    const s = UI_STRINGS[this.lang];
    this.container.innerHTML = `<div class="abhi-srs-loading">${esc(s.loadingDataset)}</div>`;
  }

  private bindKeyboard(): void {
    if (this.keyListenerBound) return;
    this.keyListenerBound = true;

    window.addEventListener("languageChanged", () => {
      const next = settings.uiLang as Lang;
      if (next === "pt" || next === "en" || next === "es") {
        this.setLang(next);
      }
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.view !== "study" || !this.activeCard) return;
      if (this.container.style.display === "none") return;
      const overlay = this.container.closest("#reader-srs") as HTMLElement | null;
      if (!overlay || overlay.style.display === "none") return;

      const activeTag = document.activeElement?.tagName;
      if (activeTag === "TEXTAREA" || activeTag === "INPUT" || activeTag === "SELECT") {
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (!this.isFlipped && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        this.flipCard();
      } else if (this.isFlipped) {
        if (e.key === "1") this.rateCard(1);
        else if (e.key === "2") this.rateCard(2);
        else if (e.key === "3") this.rateCard(3);
        else if (e.key === "4") this.rateCard(4);
      }
    });
  }

  private startStudy(chapter: number | null): void {
    this.scopeChapter = chapter;
    this.view = "study";
    this.refreshQueueAndShowNext();
  }

  private refreshQueueAndShowNext(): void {
    if (!this.dataset) return;
    const now = Date.now();
    this.stats = loadAnkiStats(now);
    const res = buildStudyQueue(
      this.dataset.chapters,
      this.dataset.cards,
      this.states,
      this.stats,
      this.config,
      this.scopeChapter,
      now
    );
    this.activeCard = res.queue[0] ?? null;
    this.isFlipped = false;
    this.render();
  }

  private flipCard(): void {
    if (this.isFlipped || !this.activeCard) return;
    this.isFlipped = true;
    this.render();
  }

  private rateCard(rating: AnkiRating): void {
    if (!this.activeCard || !this.dataset) return;
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10);
    const prevState = this.states[this.activeCard.id] ?? createInitialAnkiCardState(this.activeCard.id, this.config);
    const wasNew = prevState.phase === "new";

    const nextState = scheduleAnkiCard(prevState, rating, now, this.config);
    this.states[this.activeCard.id] = nextState;
    saveAnkiCardStates(this.states);

    const prevStats = loadAnkiStats(now);
    const isFirstToday = prevStats.reviewedToday === 0;
    this.stats = {
      totalReviewed: prevStats.totalReviewed + 1,
      reviewedToday: prevStats.reviewedToday + 1,
      correctToday: prevStats.correctToday + (rating >= 2 ? 1 : 0),
      newStudiedToday: prevStats.newStudiedToday + (wasNew ? 1 : 0),
      streak: isFirstToday ? prevStats.streak + 1 : prevStats.streak,
      lastSessionDate: today,
    };
    saveAnkiStats(this.stats);

    this.refreshQueueAndShowNext();
  }

  private render(): void {
    if (!this.dataset) {
      this.renderLoading();
      return;
    }
    if (this.view === "overview") {
      this.renderOverview(this.dataset);
    } else {
      this.renderStudy(this.dataset);
    }
  }

  private renderOverview(dataset: AbhidhammaDataset): void {
    const s = UI_STRINGS[this.lang];
    const now = Date.now();
    const progressMap = computeAllChapterProgress(dataset.chapters, dataset.cards, this.states, now);
    const globalQueue = buildStudyQueue(dataset.chapters, dataset.cards, this.states, this.stats, this.config, null, now);

    let totalCards = 0;
    let totalMemorized = 0;
    let totalDue = 0;
    for (const p of progressMap.values()) {
      totalCards += p.totalCards;
      totalMemorized += p.totalMemorized;
      totalDue += p.learningDueCount + p.reviewDueCount;
    }
    const globalPct = totalCards > 0 ? Math.round((totalMemorized / totalCards) * 100) : 0;
    const retention =
      this.stats.reviewedToday > 0
        ? Math.round((this.stats.correctToday / this.stats.reviewedToday) * 100)
        : 0;

    const chaptersHtml = dataset.chapters
      .map((meta: AbhidhammaChapterMeta) => {
        const p = progressMap.get(meta.chapter)!;
        const statusCls = p.unlocked ? "unlocked" : "locked";
        const statusText = p.unlocked ? `🔓 ${s.unlocked}` : `🔒 ${s.locked}`;
        const prevChapter = Math.max(0, meta.chapter - 1);
        const unlockReason = p.unlocked
          ? p.houseTotal > 0
            ? p.houseUnlocked
              ? `🏛 ${s.houseUnlockedLabel}`
              : `🔒 ${s.houseLockedPrefix} ${meta.houseUnlockAtomPct}% ${s.houseLockedSuffix}`
            : ""
          : `🔒 ${s.unlockHintPrefix} ${meta.unlockPrevAtomPct}% ${s.unlockHintMiddle} ${prevChapter} (${s.unlockMissingSuffix} ${p.lockedRemainingPrevAtoms} ${s.bricksLabel})`;

        return `
          <div class="abhi-chapter-card ${statusCls}" data-chapter="${meta.chapter}">
            <div class="abhi-ch-head">
              <div class="abhi-ch-title-wrap">
                <span class="abhi-ch-num">${s.chapterPrefix} ${meta.chapter}</span>
                <span class="abhi-ch-pali">${esc(meta.paliTitle)}</span>
              </div>
              <span class="abhi-ch-status ${statusCls}">${esc(statusText)}</span>
            </div>
            <div class="abhi-ch-name">${esc(meta.title[this.lang])}</div>
            <div class="abhi-ch-sub">${esc(meta.subtitle[this.lang])}</div>
            <div class="abhi-ch-progress-bar">
              <div class="abhi-ch-progress-fill" style="width:${p.totalMasteryPct}%"></div>
            </div>
            <div class="abhi-ch-tiers">
              <span class="abhi-tier-pill">🧱 ${p.atomMemorized}/${p.atomTotal} (${p.atomMasteryPct}%)</span>
              ${p.structureTotal > 0 ? `<span class="abhi-tier-pill">🏗 ${p.structureMemorized}/${p.structureTotal}</span>` : ""}
              ${p.houseTotal > 0 ? `<span class="abhi-tier-pill ${p.houseUnlocked ? "" : "muted"}">🏛 ${p.houseMemorized}/${p.houseTotal}</span>` : ""}
            </div>
            <div class="abhi-ch-counts">
              <span class="anki-cnt new" title="${esc(s.countNew)}">${esc(s.countNew)}: <b>${p.newAvailableCount}</b></span>
              <span class="anki-cnt learn" title="${esc(s.countLearning)}">${esc(s.countLearning)}: <b>${p.learningDueCount}</b></span>
              <span class="anki-cnt rev" title="${esc(s.countReview)}">${esc(s.countReview)}: <b>${p.reviewDueCount}</b></span>
              <span class="anki-cnt mast" title="${esc(s.countMastered)}">${esc(s.countMastered)}: <b>${p.totalMemorized}/${p.totalCards}</b></span>
            </div>
            <div class="abhi-ch-footer">
              <span class="abhi-ch-lock-note">${esc(unlockReason)}</span>
              <button
                type="button"
                class="abhi-btn-study-ch"
                data-study-chapter="${meta.chapter}"
                ${p.unlocked ? "" : "disabled"}
              >
                ${esc(s.studyChapter)} →
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    this.container.innerHTML = `
      <div class="abhi-srs-wrap">
        <div class="abhi-srs-header">
          <div>
            <h2 class="abhi-srs-title">${esc(s.moduleTitle)}</h2>
            <p class="abhi-srs-subtitle">${esc(s.moduleSubtitle)}</p>
          </div>
          <div class="abhi-srs-actions">
            <label class="abhi-limit-label">
              <span>${esc(s.newPerDay)}:</span>
              <select class="abhi-limit-select">
                ${[10, 20, 25, 40, 60, 9999]
                  .map(
                    (val) =>
                      `<option value="${val}" ${this.config.newCardsPerDay === val ? "selected" : ""}>${
                        val >= 9999 ? s.unlimited : val
                      }</option>`
                  )
                  .join("")}
              </select>
            </label>
            <button type="button" class="abhi-btn-primary abhi-btn-study-all" ${
              globalQueue.queue.length === 0 ? "disabled" : ""
            }>
              🧠 ${esc(s.studyAllUnlocked)} (${globalQueue.queue.length})
            </button>
          </div>
        </div>

        <div class="abhi-telemetry-bar">
          <div class="abhi-tele-pill"><span>📚 ${esc(s.memorized)}:</span><strong>${totalMemorized}/${totalCards} (${globalPct}%)</strong></div>
          <div class="abhi-tele-pill"><span>⏳ ${esc(s.dueNow)}:</span><strong>${totalDue}</strong></div>
          <div class="abhi-tele-pill"><span>🎯 ${esc(s.retentionToday)}:</span><strong>${retention}%</strong></div>
          <div class="abhi-tele-pill"><span>🔥 ${esc(s.streak)}:</span><strong>${this.stats.streak}${esc(s.daysUnit)}</strong></div>
        </div>

        <div class="abhi-tier-legend">${esc(s.tierLegend)}</div>

        <div class="abhi-chapter-grid">
          ${chaptersHtml}
        </div>

        <div class="abhi-footer-tools">
          <button type="button" class="abhi-btn-reset">${esc(s.resetProgress)}</button>
        </div>
      </div>
    `;

    this.container.querySelector(".abhi-btn-study-all")?.addEventListener("click", () => {
      this.startStudy(null);
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-study-chapter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = Number(btn.dataset.studyChapter);
        if (!Number.isNaN(ch)) this.startStudy(ch);
      });
    });

    const limitSel = this.container.querySelector<HTMLSelectElement>(".abhi-limit-select");
    limitSel?.addEventListener("change", () => {
      const val = parseInt(limitSel.value, 10);
      if (!Number.isNaN(val)) {
        this.config = { ...this.config, newCardsPerDay: val };
        saveAnkiConfig(this.config);
        this.render();
      }
    });

    this.container.querySelector(".abhi-btn-reset")?.addEventListener("click", () => {
      if (typeof window.confirm === "function" && !window.confirm(s.resetConfirm)) return;
      this.states = {};
      saveAnkiCardStates(this.states);
      this.stats = loadAnkiStats();
      this.stats = {
        totalReviewed: 0,
        reviewedToday: 0,
        correctToday: 0,
        newStudiedToday: 0,
        streak: 0,
        lastSessionDate: new Date().toISOString().slice(0, 10),
      };
      saveAnkiStats(this.stats);
      this.render();
    });
  }

  private renderStudy(dataset: AbhidhammaDataset): void {
    const s = UI_STRINGS[this.lang];
    const now = Date.now();
    const qInfo = buildStudyQueue(
      dataset.chapters,
      dataset.cards,
      this.states,
      this.stats,
      this.config,
      this.scopeChapter,
      now
    );

    const scopeLabel =
      this.scopeChapter === null
        ? s.allScopeTitle
        : (() => {
            const meta = dataset.chapters.find((c) => c.chapter === this.scopeChapter);
            return meta ? `${s.chapterPrefix} ${meta.chapter}: ${meta.paliTitle}` : `${s.chapterPrefix} ${this.scopeChapter}`;
          })();

    const topBarHtml = `
      <div class="abhi-study-topbar">
        <button type="button" class="abhi-btn-back">${esc(s.backToChapters)}</button>
        <div class="abhi-study-scope">${esc(scopeLabel)}</div>
        <div class="abhi-queue-pills">
          <span class="anki-cnt new" title="${esc(s.countNew)}">${qInfo.newUnlocked.length}</span>
          <span class="anki-cnt learn" title="${esc(s.countLearning)}">${qInfo.dueLearning.length + qInfo.learnAhead.length}</span>
          <span class="anki-cnt rev" title="${esc(s.countReview)}">${qInfo.dueReview.length}</span>
        </div>
      </div>
    `;

    if (!this.activeCard) {
      this.container.innerHTML = `
        <div class="abhi-srs-wrap abhi-study-mode">
          ${topBarHtml}
          <div class="abhi-complete-card">
            <div class="abhi-complete-icon">✅</div>
            <h3>${esc(s.sessionCompleteTitle)}</h3>
            <p>${esc(s.sessionCompleteDesc)}</p>
            <div class="abhi-complete-stats">
              <span>${esc(s.reviewedTodayLabel)}: <strong>${this.stats.reviewedToday}</strong></span>
              <span>${esc(s.newTodayLabel)}: <strong>${this.stats.newStudiedToday} / ${
        this.config.newCardsPerDay >= 9999 ? "∞" : this.config.newCardsPerDay
      }</strong></span>
            </div>
            <div class="abhi-complete-actions">
              <button type="button" class="abhi-btn-back-main abhi-btn-secondary">${esc(s.backToChapters)}</button>
              <button type="button" class="abhi-btn-more-new abhi-btn-primary">${esc(s.studyMoreNew)}</button>
            </div>
          </div>
        </div>
      `;
      this.bindStudyCommonEvents();
      this.container.querySelector(".abhi-btn-back-main")?.addEventListener("click", () => {
        this.view = "overview";
        this.render();
      });
      this.container.querySelector(".abhi-btn-more-new")?.addEventListener("click", () => {
        this.config = { ...this.config, newCardsPerDay: this.config.newCardsPerDay + 10 };
        saveAnkiConfig(this.config);
        this.refreshQueueAndShowNext();
      });
      return;
    }

    const card = this.activeCard;
    const state = this.states[card.id] ?? createInitialAnkiCardState(card.id, this.config);
    const intervals = previewAnkiIntervals(state, this.lang, now, this.config);

    let charRows = "";
    if (card.characteristics) {
      const c = card.characteristics;
      const items: [string, string | undefined][] = [
        [s.lakkhana, c.lakkhana?.[this.lang]],
        [s.rasa, c.rasa?.[this.lang]],
        [s.paccupatthana, c.paccupatthana?.[this.lang]],
        [s.padatthana, c.padatthana?.[this.lang]],
      ];
      const valid = items.filter(([, val]) => Boolean(val));
      if (valid.length > 0) {
        charRows = `
          <div class="abhi-char-grid">
            ${valid
              .map(
                ([lbl, val]) => `
              <div class="abhi-char-item">
                <span class="abhi-char-lbl">${esc(lbl)}</span>
                <span class="abhi-char-val">${esc(val!)}</span>
              </div>`
              )
              .join("")}
          </div>
        `;
      }
    }

    const mechanicsHtml = card.mechanics?.[this.lang]
      ? `<div class="abhi-mechanics-box">
           <div class="abhi-mechanics-title">⚙ ${esc(s.mechanicsTitle)}</div>
           <div class="abhi-mechanics-text">${esc(card.mechanics[this.lang])}</div>
         </div>`
      : "";

    const sourceParts: string[] = [];
    if (card.source.as) sourceParts.push(`As ${card.source.as}`);
    if (card.source.cma) sourceParts.push(`CMA ${card.source.cma}`);
    const sourceText = sourceParts.join(" · ");
    const chunkIdx = card.source.segId && card.source.segId > 913 ? 1 : 0;
    const readerHref = card.source.segId
      ? `#/tipitaka/abhidhammatthasangaha/mula/${chunkIdx}?seg=${card.source.segId}`
      : null;

    const sourceHtml = sourceText
      ? `<div class="abhi-source-row">
           <span class="abhi-source-tag">📖 ${esc(s.sourceLabel)}: ${esc(sourceText)}</span>
           ${
             readerHref
               ? `<a class="abhi-source-link" href="${esc(readerHref)}">${esc(s.openInReader)}</a>`
               : ""
           }
         </div>`
      : "";

    this.container.innerHTML = `
      <div class="abhi-srs-wrap abhi-study-mode">
        ${topBarHtml}
        <div class="abhi-flashcard">
          <div class="abhi-card-meta">
            <span class="abhi-cat-badge">${esc(card.categoryLabel[this.lang])}</span>
            <span class="abhi-tier-badge tier-${card.tier}">${esc(tierBadge(card.tier, this.lang))}</span>
          </div>

          <div class="abhi-card-pali">${esc(resolvePaliTerm(card, this.lang))}</div>
          <div class="abhi-card-prompt">${esc(card.prompt[this.lang])}</div>

          ${
            !this.isFlipped
              ? `
            <div class="abhi-recall-box">
              <textarea class="abhi-recall-input" rows="2" placeholder="${esc(s.recallPlaceholder)}"></textarea>
            </div>
            <div class="abhi-reveal-row">
              <button type="button" class="abhi-btn-reveal">${esc(s.showAnswer)}</button>
            </div>
          `
              : `
            <hr class="abhi-card-divider" />
            <div class="abhi-card-answer">${esc(card.answer[this.lang])}</div>
            ${charRows}
            ${mechanicsHtml}
            ${sourceHtml}
          `
          }
        </div>

        ${
          this.isFlipped
            ? `
          <div class="abhi-anki-ratings">
            <button type="button" class="abhi-rate-btn rate-1" data-rate="1">
              <span class="rate-lbl">[1] ${esc(s.again)}</span>
              <span class="rate-int">${esc(intervals[1])}</span>
            </button>
            <button type="button" class="abhi-rate-btn rate-2" data-rate="2">
              <span class="rate-lbl">[2] ${esc(s.hard)}</span>
              <span class="rate-int">${esc(intervals[2])}</span>
            </button>
            <button type="button" class="abhi-rate-btn rate-3" data-rate="3">
              <span class="rate-lbl">[3] ${esc(s.good)}</span>
              <span class="rate-int">${esc(intervals[3])}</span>
            </button>
            <button type="button" class="abhi-rate-btn rate-4" data-rate="4">
              <span class="rate-lbl">[4] ${esc(s.easy)}</span>
              <span class="rate-int">${esc(intervals[4])}</span>
            </button>
          </div>
        `
            : ""
        }
      </div>
    `;

    this.bindStudyCommonEvents();

    this.container.querySelector(".abhi-btn-reveal")?.addEventListener("click", () => {
      this.flipCard();
    });

    this.container.querySelectorAll<HTMLButtonElement>(".abhi-rate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = Number(btn.dataset.rate) as AnkiRating;
        if (r >= 1 && r <= 4) this.rateCard(r);
      });
    });
  }

  private bindStudyCommonEvents(): void {
    this.container.querySelector(".abhi-btn-back")?.addEventListener("click", () => {
      this.view = "overview";
      this.render();
    });
  }
}
