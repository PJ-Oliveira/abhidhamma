import { t } from "./i18n.js?v=c1e87eca";
import { settings } from "./state.js?v=c1e87eca";
import { createLogger } from "./logger.js?v=c1e87eca";
const log = createLogger("srs");
const SRS_KEY = "atp.srs.v1";
const SRS_STATS_KEY = "atp.srs.stats.v1";
function loadSrsState() {
    try {
        const raw = localStorage.getItem(SRS_KEY);
        if (!raw)
            return new Map();
        const arr = JSON.parse(raw);
        return new Map(arr.map((c) => [c.id, c]));
    }
    catch {
        return new Map();
    }
}
function saveSrsState(state) {
    try {
        localStorage.setItem(SRS_KEY, JSON.stringify([...state.values()]));
    }
    catch (err) {
        log.warn("Failed to save SRS state", err);
    }
}
export function loadStats() {
    try {
        const raw = localStorage.getItem(SRS_STATS_KEY);
        if (raw)
            return JSON.parse(raw);
    }
    catch { }
    return { totalReviewed: 0, streak: 0, lastSessionDate: "", correctToday: 0, totalToday: 0 };
}
export function saveStats(stats) {
    try {
        localStorage.setItem(SRS_STATS_KEY, JSON.stringify(stats));
    }
    catch { }
}
export function sm2(card, quality) {
    const now = Date.now();
    let { interval, repetitions, easeFactor } = card;
    if (quality < 3) {
        repetitions = 0;
        interval = 1;
    }
    else {
        if (repetitions === 0) {
            interval = 1;
        }
        else if (repetitions === 1) {
            interval = 6;
        }
        else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    }
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3)
        easeFactor = 1.3;
    return {
        id: card.id,
        interval,
        repetitions,
        easeFactor,
        nextReview: now + interval * 86400000,
        lastReview: now,
    };
}
function getDefaultCard(id) {
    return {
        id,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: 0,
        lastReview: 0,
    };
}
let vocabData = null;
async function loadVocab() {
    if (vocabData)
        return vocabData;
    try {
        const res = await fetch("data/srs/vocabulary.json");
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const data = (await res.json());
        vocabData = data.cards;
        log.info(`Loaded ${vocabData.length} vocabulary cards`);
        return vocabData;
    }
    catch (err) {
        log.error("Failed to load SRS vocabulary", err);
        return [];
    }
}
function getDueCards(vocab, srsState, limit) {
    const now = Date.now();
    const due = [];
    const newCards = [];
    for (const card of vocab) {
        const state = srsState.get(card.id);
        if (!state) {
            newCards.push(card);
        }
        else if (state.nextReview <= now) {
            due.push(card);
        }
    }
    const result = [...due];
    if (result.length < limit) {
        result.push(...newCards.slice(0, limit - result.length));
    }
    return result.slice(0, limit);
}
const DAILY_LIMIT = 20;
export function initSrsPanel(container) {
    let srsState = loadSrsState();
    let stats = loadStats();
    let queue = [];
    let currentIndex = 0;
    let isFlipped = false;
    const today = new Date().toISOString().slice(0, 10);
    if (stats.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (stats.lastSessionDate !== yesterday)
            stats.streak = 0;
        stats.correctToday = 0;
        stats.totalToday = 0;
    }
    container.innerHTML = "";
    const statsBar = document.createElement("div");
    statsBar.className = "srs-stats";
    container.appendChild(statsBar);
    const cardWrap = document.createElement("div");
    cardWrap.className = "srs-card-wrap";
    container.appendChild(cardWrap);
    const cardEl = document.createElement("div");
    cardEl.className = "srs-card";
    cardWrap.appendChild(cardEl);
    const frontEl = document.createElement("div");
    frontEl.className = "srs-front";
    cardEl.appendChild(frontEl);
    const backEl = document.createElement("div");
    backEl.className = "srs-back";
    backEl.style.display = "none";
    cardEl.appendChild(backEl);
    const ratingBar = document.createElement("div");
    ratingBar.className = "srs-ratings";
    ratingBar.style.display = "none";
    container.appendChild(ratingBar);
    const ratings = [
        { q: 0, label: () => t("srsAgain", settings.uiLang), cls: "srs-btn-again" },
        { q: 3, label: () => t("srsHard", settings.uiLang), cls: "srs-btn-hard" },
        { q: 4, label: () => t("srsGood", settings.uiLang), cls: "srs-btn-good" },
        { q: 5, label: () => t("srsEasy", settings.uiLang), cls: "srs-btn-easy" },
    ];
    for (const r of ratings) {
        const btn = document.createElement("button");
        btn.className = `srs-btn ${r.cls}`;
        btn.textContent = r.label();
        btn.addEventListener("click", () => handleRating(r.q));
        ratingBar.appendChild(btn);
    }
    const progressWrap = document.createElement("div");
    progressWrap.className = "srs-progress-wrap";
    container.appendChild(progressWrap);
    const progressBar = document.createElement("div");
    progressBar.className = "srs-progress-bar";
    progressWrap.appendChild(progressBar);
    const progressText = document.createElement("div");
    progressText.className = "srs-progress-text";
    progressWrap.appendChild(progressText);
    const emptyEl = document.createElement("div");
    emptyEl.className = "srs-empty";
    emptyEl.style.display = "none";
    container.appendChild(emptyEl);
    function updateStatsBar() {
        const learned = srsState.size;
        const retention = stats.totalToday > 0
            ? Math.round((stats.correctToday / stats.totalToday) * 100)
            : 0;
        statsBar.innerHTML = `
      <span class="srs-stat" title="${t("srsLearned", settings.uiLang)}">📚 ${learned}</span>
      <span class="srs-stat" title="${t("srsRetention", settings.uiLang)}">🎯 ${retention}%</span>
      <span class="srs-stat" title="${t("srsStreak", settings.uiLang)}">🔥 ${stats.streak}${t("srsDays", settings.uiLang)}</span>
    `;
    }
    function updateProgress() {
        const total = queue.length;
        const done = currentIndex;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        progressBar.style.width = pct + "%";
        progressText.textContent = `${done} / ${total}`;
    }
    function showCard(vocab) {
        isFlipped = false;
        cardEl.style.display = "block";
        ratingBar.style.display = "none";
        emptyEl.style.display = "none";
        const lang = settings.translationLang;
        frontEl.innerHTML = `
      <div class="srs-headword">${escHtml(vocab.h)}</div>
      <div class="srs-pos">${escHtml(vocab.pos)}</div>
      <div class="srs-freq">${t("srsFreq", settings.uiLang)}: ${vocab.freq.toLocaleString()}</div>
      <div class="srs-tap">${t("srsTapToReveal", settings.uiLang)}</div>
    `;
        frontEl.style.display = "block";
        const meaning = lang === "es" && vocab.es ? vocab.es : (lang === "en" ? vocab.en : vocab.pt);
        let backHtml = `
      <div class="srs-headword">${escHtml(vocab.h)}</div>
      <div class="srs-meaning">${escHtml(meaning)}</div>
    `;
        if (vocab.grammar) {
            backHtml += `<div class="srs-grammar">${escHtml(vocab.grammar)}</div>`;
        }
        if (vocab.root) {
            backHtml += `<div class="srs-root">√ ${escHtml(vocab.root)}</div>`;
        }
        if (vocab.usage) {
            backHtml += `<div class="srs-usage">${escHtml(vocab.usage)}</div>`;
        }
        backEl.innerHTML = backHtml;
        backEl.style.display = "none";
    }
    function flipCard() {
        if (isFlipped)
            return;
        isFlipped = true;
        frontEl.style.display = "none";
        backEl.style.display = "block";
        ratingBar.style.display = "flex";
    }
    function handleRating(quality) {
        const vocab = queue[currentIndex];
        if (!vocab)
            return;
        const existing = srsState.get(vocab.id) ?? getDefaultCard(vocab.id);
        const updated = sm2(existing, quality);
        srsState.set(vocab.id, updated);
        saveSrsState(srsState);
        stats.totalReviewed++;
        stats.totalToday++;
        if (quality >= 3)
            stats.correctToday++;
        stats.lastSessionDate = today;
        if (stats.totalToday === 1)
            stats.streak++;
        saveStats(stats);
        currentIndex++;
        updateStatsBar();
        updateProgress();
        if (currentIndex < queue.length) {
            showCard(queue[currentIndex]);
        }
        else {
            showComplete();
        }
    }
    function showComplete() {
        cardEl.style.display = "none";
        ratingBar.style.display = "none";
        emptyEl.style.display = "block";
        emptyEl.innerHTML = `
      <div class="srs-complete-icon">✅</div>
      <div class="srs-complete-text">${t("srsComplete", settings.uiLang)}</div>
      <div class="srs-complete-stats">
        ${t("srsReviewedToday", settings.uiLang)}: ${stats.totalToday}<br/>
        ${t("srsRetention", settings.uiLang)}: ${stats.totalToday > 0 ? Math.round((stats.correctToday / stats.totalToday) * 100) : 0}%
      </div>
    `;
    }
    function showLoading() {
        cardEl.style.display = "block";
        frontEl.innerHTML = `<div class="srs-loading">${t("srsLoading", settings.uiLang)}</div>`;
        frontEl.style.display = "block";
        backEl.style.display = "none";
        ratingBar.style.display = "none";
    }
    cardEl.addEventListener("click", () => {
        if (!isFlipped)
            flipCard();
    });
    document.addEventListener("keydown", (e) => {
        const panel = container.closest(".panel");
        if (!panel || !panel.classList.contains("active"))
            return;
        if (!isFlipped && (e.key === " " || e.key === "Enter")) {
            e.preventDefault();
            flipCard();
        }
        else if (isFlipped) {
            if (e.key === "1")
                handleRating(0);
            else if (e.key === "2")
                handleRating(3);
            else if (e.key === "3")
                handleRating(4);
            else if (e.key === "4")
                handleRating(5);
        }
    });
    showLoading();
    void loadVocab().then((vocab) => {
        if (vocab.length === 0) {
            emptyEl.style.display = "block";
            emptyEl.textContent = t("srsNoData", settings.uiLang);
            cardEl.style.display = "none";
            return;
        }
        queue = getDueCards(vocab, srsState, DAILY_LIMIT);
        currentIndex = 0;
        updateStatsBar();
        updateProgress();
        if (queue.length > 0) {
            showCard(queue[0]);
        }
        else {
            showComplete();
        }
    });
}
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
//# sourceMappingURL=srs.js.map