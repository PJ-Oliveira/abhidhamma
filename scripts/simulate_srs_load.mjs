// Simula N dias de estudo com o scheduler REAL compilado do app (js/abhidhamma-srs/scheduler.js).
// Uso: node scripts/simulate_srs_load.mjs [dias=30|60|90] [retencao=0.9] [segundosPorCarta=14]
import fs from "node:fs";
import {
  buildStudyQueue,
  computeAllChapterProgress,
  createInitialAnkiCardState,
  createInitialAnkiStats,
  DAY_MS,
  DEFAULT_ANKI_CONFIG,
  isCardMemorized,
  scheduleAnkiCard,
  setPaceHorizon,
} from "../js/abhidhamma-srs/scheduler.js";

const days = Number(process.argv[2] ?? 30);
const retention = Number(process.argv[3] ?? 0.9);
const secPerCard = Number(process.argv[4] ?? 14);
const ds = JSON.parse(fs.readFileSync(new URL("../data/srs/abhidhamma_cards.json", import.meta.url), "utf8"));

let seed = 42;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

const t0 = Date.UTC(2026, 10, 18, 12, 0, 0);
const horizon = days === 30 || days === 60 || days === 90 ? days : 30;
const config = setPaceHorizon(DEFAULT_ANKI_CONFIG, horizon, t0);
const states = {};
const rows = [];

for (let d = 0; d < days; d++) {
  const dayStart = t0 + d * DAY_MS;
  let now = dayStart;
  let stats = createInitialAnkiStats(new Date(dayStart).toISOString().slice(0, 10));
  let reviews = 0;
  let news = 0;
  let safety = 0;

  for (;;) {
    const q = buildStudyQueue(ds.chapters, ds.cards, states, stats, config, null, now);
    const card = q.queue[0];
    if (!card || safety++ > 3000) break;
    const prev = states[card.id] ?? createInitialAnkiCardState(card.id, config);
    const wasNew = prev.phase === "new";
    const rating = rnd() < retention ? 3 : 1;
    states[card.id] = scheduleAnkiCard(prev, rating, now, config);
    stats = {
      ...stats,
      reviewedToday: stats.reviewedToday + 1,
      newStudiedToday: stats.newStudiedToday + (wasNew ? 1 : 0),
    };
    reviews++;
    if (wasNew) news++;
    now += secPerCard * 1000;
  }

  const mem = ds.cards.filter((c) => isCardMemorized(states[c.id])).length;
  const intro = ds.cards.filter((c) => states[c.id] && states[c.id].phase !== "new").length;
  rows.push({ d: d + 1, reviews, news, min: Math.round((reviews * secPerCard) / 60), intro, mem });
}

console.log("dia  repasses  novas  min  introduzidas  em-revisao");
for (const r of rows) {
  if (r.d === 1 || r.d % 7 === 0 || r.d === days) {
    console.log(
      String(r.d).padStart(3),
      String(r.reviews).padStart(8),
      String(r.news).padStart(6),
      String(r.min).padStart(4),
      String(r.intro).padStart(12),
      String(r.mem).padStart(10)
    );
  }
}

const prog = computeAllChapterProgress(ds.chapters, ds.cards, states, t0 + days * DAY_MS);
console.log(
  "total cartas:",
  ds.cards.length,
  "| pico repasses/dia:",
  Math.max(...rows.map((r) => r.reviews)),
  "| pico min/dia:",
  Math.max(...rows.map((r) => r.min)),
  "| media min/dia:",
  Math.round(rows.reduce((a, r) => a + r.min, 0) / rows.length)
);
for (const [ch, p] of prog) {
  console.log(`cap ${ch}: ${p.totalMemorized}/${p.totalCards} (atom ${p.atomMemorized}/${p.atomTotal}, rec ${p.recitationMemorized}/${p.recitationTotal}) ${p.unlocked ? "" : "(bloqueado)"}`);
}
