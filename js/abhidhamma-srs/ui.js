import { buildEarlyReviewQueue, buildProgressiveCloze, buildStudyQueue, computeAllChapterProgress, computeDailyNewQuota, computePlan90Summary, computeProportionalExtraBatch, countLeeches, createInitialAnkiCardState, defaultClozeStage, ensurePaceTarget, getMaxIntervalForHorizon, getReserveDaysForHorizon, isLeech, isRecitationCard, loadAnkiCardStates, loadAnkiConfig, loadAnkiStats, loadMnemonicNotes, MAX_NEW_CARDS_PER_DAY, MAX_REVIEWS_PER_DAY, PACE_HORIZON_OPTIONS, previewAnkiIntervals, saveAnkiCardStates, saveAnkiConfig, saveAnkiStats, saveMnemonicNote, scheduleAnkiCard, setPaceHorizon, } from "./scheduler.js?v=d3104d40";
import { buildLocalStorageSnapshot, fetchDeckWithOfflineCache, hydrateOfflineVault, mergeSnapshots, parseProgressBackup, persistOfflineProgress, resetOfflineVault, serializeProgressBackup, VAULT_BROADCAST_CHANNEL, } from "./offline-store.js?v=d3104d40";
import { settings } from "../state.js?v=d3104d40";
const UI_STRINGS = {
    pt: {
        moduleTitle: "Abhidhammatthasaṅgaha — Repetição Espaçada (Anki SRS)",
        moduleSubtitle: "Memorização completa do Abhidhammatthasaṅgaha Mūla (357 cartas) em 30, 60 ou 90 dias: teto rígido de até 12 novas/dia e revisões máximas (9999/dia) para retenção sem falhas.",
        modeChapters: "📚 Por Capítulos",
        modePlan90: "📅 Trilha {days} Dias",
        studyAllUnlocked: "Estudar Todos Desbloqueados",
        studyTodayDose: "Estudar Dose de Hoje",
        studyChapter: "Estudar Capítulo",
        backToChapters: "← Voltar",
        memorized: "Memorizadas",
        dueNow: "Devidas Agora",
        retentionToday: "Retenção Hoje",
        streak: "Sequência",
        daysUnit: "d",
        daysWord: "dias",
        newPerDay: "Novas/dia (máx. 12)",
        reviewsPerDayLabel: "Rev./dia",
        reviewsMaxBadge: "9999 (Máx.)",
        reviewOnlyOption: "0 (Só revisão)",
        maxNewTag: "máx.",
        paceAuto: "Auto",
        unlimited: "9999 (Máx.)",
        clinicalToggleOn: "🎯 Avaliação Clínica (De novo / Bom)",
        clinicalToggleOff: "🎛 Anki Clássico (4 botões)",
        clinicalGradingHint: "Avaliação clínica: exatidão instantânea = Bom · qualquer lapso ou dúvida = De novo (sem negociar com Difícil).",
        horizonGroupLabel: "Escolher prazo da trilha de memorização",
        horizonSubFmt: "{quota} novas/d · rev. ≤{cap}d",
        horizonReserveFmt: "+{res}d só revisão",
        planReviewsMaxLabel: "Revisões máximas/dia",
        planReviewsMaxValue: "9999 (teto ≤{cap}d)",
        planProtocolSummary: "Protocolo ativo: teto de {maxNew} novas/dia · fila de revisões ilimitada (9999/dia, zerar todo dia) · intervalo máximo de {cap}d.",
        tierAtom: "Tijolo (Átomo)",
        tierStructure: "Estrutura",
        tierHouse: "Casa (Síntese)",
        tierLegend: "🧱 Tijolos (unidades) → 🏗 Estruturas, Checksums & Confundíveis → 🏛 Casa (sínteses)",
        unlocked: "Desbloqueado",
        locked: "Bloqueado",
        unlockHintPrefix: "Exige ≥",
        unlockHintMiddle: "% dos tijolos do Cap.",
        unlockMissingSuffix: "faltam",
        bricksLabel: "tijolos",
        houseUnlockedLabel: "Síntese da Casa desbloqueada",
        houseLockedPrefix: "Casa exige",
        houseLockedSuffix: "% de tijolos deste capítulo",
        countNew: "Novas",
        countLearning: "Aprendendo",
        countReview: "Revisar",
        countMastered: "Dominadas",
        showAnswer: "Mostrar Resposta [Espaço]",
        again: "De novo",
        hard: "Difícil",
        good: "Bom",
        easy: "Fácil",
        lakkhana: "Lakkhaṇa (Característica)",
        rasa: "Rasa (Função)",
        paccupatthana: "Paccupaṭṭhāna (Manifestação)",
        padatthana: "Padaṭṭhāna (Causa Próxima)",
        mechanicsTitle: "Mecânica Estrutural",
        mathStructureTitle: "Estrutura Matemática da Lista",
        translationTitle: "Tradução Canônica",
        sourceLabel: "Fonte Canônica",
        openInReader: "Ler no Abhidhammatthasaṅgaha ↗",
        sessionCompleteTitle: "Sessão Concluída!",
        sessionCompleteDesc: "Todas as cartas devidas e a cota atual deste escopo foram revisadas.",
        reviewedTodayLabel: "Revisadas hoje",
        newTodayLabel: "Novas estudadas hoje",
        studyMoreNew: "Estudar Mais (≤12 novas/d + Revisão Máxima)",
        studyExtraBatch: "⚡ Dose concluída · Estudar Mais",
        reviewAheadBtn: "🔁 Revisão Máxima",
        doseDoneLabel: "Dose do dia concluída!",
        loadingDataset: "Carregando tratado e baralho canônico…",
        loadError: "Não foi possível carregar o baralho do Abhidhammatthasaṅgaha.",
        allScopeTitle: "Todos os Capítulos Desbloqueados",
        plan90ScopeTitle: "Trilha Diária · {days} Dias",
        chapterPrefix: "Cap.",
        resetProgress: "Resetar Progresso",
        resetConfirm: "Tem certeza que deseja zerar todo o histórico Anki do Abhidhammatthasaṅgaha?",
        plan90Title: "Plano Estruturado — {days} Dias",
        plan90Desc: "Cota matemática rigorosa (máx. 12 novas/dia) com revisões máximas ilimitadas (9999/dia) e teto de intervalo ajustado ao prazo para zerar a fila de revisão todo dia sem esquecer.",
        plan90DayLabel: "Dia",
        plan90DaysLeft: "Dias restantes",
        plan90PhaseBuild: "Fase de Carga (Novas ≤12/d + Revisão Máxima)",
        plan90PhaseConsolidate: "Fase de Consolidação Final (100% Revisão)",
        plan90DailyTarget: "Novas/dia (teto 12)",
        plan90RemainingNew: "Cartas novas restantes",
        plan90DoseToday: "Dose restante de hoje",
        plan90RestartDate: "Reiniciar contagem dos {days} dias a partir de hoje",
        plan90RestartConfirm: "Redefinir o início da trilha de {days} dias para hoje (mantendo suas cartas já memorizadas)?",
        filterLeeches: "🩸 Sanguessugas",
        modeChecksum: "📐 Estrutura Matemática",
        modeEnumeration: "☑ Enumeração",
        modeSequence: "↕ Sequência",
        modeConfusable: "⚖ Confundíveis",
        modeRecitation: "🔤 Recitação Pāli",
        modeGatha: "🎵 Gāthā Âncora",
        recitationLabel: "Recitação Pāli",
        recallPlaceholder: "Recordação ativa (opcional): formule mentalmente ou escreva sua resposta antes de revelar…",
        yourRecallLabel: "Sua anotação",
        fourfoldToggle: "Quadrado de 4 campos (Lakkhaṇa · Rasa · Paccupaṭṭhāna · Padaṭṭhāna)",
        checklistPrompt: "Marque os itens que você lembrou por completo:",
        checklistIncomplete: "Enumeração incompleta — marque «Errei» ou «Difícil» até acertar 100%.",
        checklistComplete: "Enumeração 100% completa!",
        sequenceHint: "Clique nos itens abaixo na ordem canônica exata (clique no item colocado para remover):",
        sequenceReset: "Limpar ordem",
        sequenceYourOrder: "Sua ordem",
        sequenceScore: "Acertos na posição exata",
        clozeStage1: "1 · Cloze",
        clozeStage2: "2 · Iniciais",
        clozeStage3: "3 · Em branco",
        leechesLabel: "Sanguessugas",
        leechBadge: "🩸 Sanguessuga",
        leechHint: "Esta carta já falhou várias vezes. Crie uma associação mnemônica abaixo ou apoie-se na fórmula matemática da lista.",
        mnemonicTitle: "Nota mnemônica pessoal",
        mnemonicPlaceholder: "Escreva uma associação ou gancho pessoal para esta carta…",
        mnemonicSaved: "Salvo",
        vaultTitle: "Cofre Offline",
        vaultAnswersCached: "respostas em cache",
        vaultOfflineBadge: "📴 Modo Offline",
        vaultPersistentBadge: "🔒 Persistente",
        vaultExport: "⬇ Backup (.json)",
        vaultImport: "⬆ Importar / Mesclar",
        vaultImportOk: "Progresso mesclado e salvo no cofre offline!",
        vaultImportErr: "Arquivo de backup inválido.",
    },
    en: {
        moduleTitle: "Abhidhammatthasaṅgaha — Spaced Repetition (Anki SRS)",
        moduleSubtitle: "Complete mastery of the Abhidhammatthasaṅgaha Mūla (357 cards) in 30, 60, or 90 days: strict cap of 12 new/day max and unlimited reviews (9999/day) so nothing is forgotten.",
        modeChapters: "📚 By Chapters",
        modePlan90: "📅 {days}-Day Track",
        studyAllUnlocked: "Study All Unlocked",
        studyTodayDose: "Study Today's Dose",
        studyChapter: "Study Chapter",
        backToChapters: "← Back",
        memorized: "Memorized",
        dueNow: "Due Now",
        retentionToday: "Retention Today",
        streak: "Streak",
        daysUnit: "d",
        daysWord: "days",
        newPerDay: "New/day (max 12)",
        reviewsPerDayLabel: "Rev./day",
        reviewsMaxBadge: "9999 (Max)",
        reviewOnlyOption: "0 (Review only)",
        maxNewTag: "max",
        paceAuto: "Auto",
        unlimited: "9999 (Max)",
        clinicalToggleOn: "🎯 Clinical Grading (Again / Good)",
        clinicalToggleOff: "🎛 Classic Anki (4 buttons)",
        clinicalGradingHint: "Clinical grading: instant exact recall = Good · any lapse or hesitation = Again (no negotiating with Hard).",
        horizonGroupLabel: "Choose memorization track duration",
        horizonSubFmt: "{quota} new/d · rev. ≤{cap}d",
        horizonReserveFmt: "+{res}d review-only",
        planReviewsMaxLabel: "Max reviews/day",
        planReviewsMaxValue: "9999 (cap ≤{cap}d)",
        planProtocolSummary: "Active protocol: strict {maxNew} new/day cap · unlimited review queue (9999/day, clear daily) · max review interval {cap}d.",
        tierAtom: "Brick (Atom)",
        tierStructure: "Structure",
        tierHouse: "House (Synthesis)",
        tierLegend: "🧱 Bricks (units) → 🏗 Structures, Checksums & Confusables → 🏛 House (syntheses)",
        unlocked: "Unlocked",
        locked: "Locked",
        unlockHintPrefix: "Requires ≥",
        unlockHintMiddle: "% of Ch.",
        unlockMissingSuffix: "missing",
        bricksLabel: "bricks",
        houseUnlockedLabel: "House synthesis unlocked",
        houseLockedPrefix: "House requires",
        houseLockedSuffix: "% of this chapter's bricks",
        countNew: "New",
        countLearning: "Learning",
        countReview: "Review",
        countMastered: "Mastered",
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
        mathStructureTitle: "Mathematical Structure of the List",
        translationTitle: "Canonical Translation",
        sourceLabel: "Canonical Source",
        openInReader: "Open in Abhidhammatthasaṅgaha ↗",
        sessionCompleteTitle: "Session Complete!",
        sessionCompleteDesc: "All due cards and today's new card quota in this scope have been completed.",
        reviewedTodayLabel: "Reviewed today",
        newTodayLabel: "New studied today",
        studyMoreNew: "Study More (≤12 new/d + Maximum Review)",
        studyExtraBatch: "⚡ Dose Done · Study More",
        reviewAheadBtn: "🔁 Maximum Review",
        doseDoneLabel: "Today's dose complete!",
        loadingDataset: "Loading canonical treatise deck…",
        loadError: "Failed to load the Abhidhammatthasaṅgaha deck.",
        allScopeTitle: "All Unlocked Chapters",
        plan90ScopeTitle: "Daily Track · {days} Days",
        chapterPrefix: "Ch.",
        resetProgress: "Reset Progress",
        resetConfirm: "Are you sure you want to reset all Abhidhammatthasaṅgaha Anki SRS progress?",
        plan90Title: "Structured Plan — {days} Days",
        plan90Desc: "Exact mathematical daily quota (max 12 new/day) paired with unlimited reviews (9999/day) and a horizon-matched interval cap so you clear every review daily without forgetting.",
        plan90DayLabel: "Day",
        plan90DaysLeft: "Days left",
        plan90PhaseBuild: "Building Phase (New ≤12/d + Maximum Review)",
        plan90PhaseConsolidate: "Final Consolidation Phase (100% Review)",
        plan90DailyTarget: "New/day (max 12)",
        plan90RemainingNew: "Remaining new cards",
        plan90DoseToday: "Today's remaining dose",
        plan90RestartDate: "Restart {days}-day clock from today",
        plan90RestartConfirm: "Reset the {days}-day start date to today (keeping all memorized cards)?",
        filterLeeches: "🩸 Leeches",
        modeChecksum: "📐 Math Structure",
        modeEnumeration: "☑ Enumeration",
        modeSequence: "↕ Sequence",
        modeConfusable: "⚖ Confusables",
        modeRecitation: "🔤 Pāli Recitation",
        modeGatha: "🎵 Anchor Gāthā",
        recitationLabel: "Pāli Recitation",
        recallPlaceholder: "Active recall (optional): formulate mentally or type your answer before revealing…",
        yourRecallLabel: "Your recall note",
        fourfoldToggle: "4-Field Grid (Lakkhaṇa · Rasa · Paccupaṭṭhāna · Padaṭṭhāna)",
        checklistPrompt: "Tick every item you recalled completely:",
        checklistIncomplete: "Incomplete enumeration — rate 'Again' or 'Hard' until 100% complete.",
        checklistComplete: "100% complete enumeration!",
        sequenceHint: "Click the items below in exact canonical order (click a placed item to remove):",
        sequenceReset: "Reset order",
        sequenceYourOrder: "Your sequence",
        sequenceScore: "Exact position matches",
        clozeStage1: "1 · Cloze",
        clozeStage2: "2 · Initials",
        clozeStage3: "3 · Blank",
        leechesLabel: "Leeches",
        leechBadge: "🩸 Leech",
        leechHint: "This card has lapsed repeatedly. Add a personal mnemonic below or anchor it to the list's mathematical formula.",
        mnemonicTitle: "Personal mnemonic note",
        mnemonicPlaceholder: "Write a personal hook or association for this card…",
        mnemonicSaved: "Saved",
        vaultTitle: "Offline Vault",
        vaultAnswersCached: "cached answers",
        vaultOfflineBadge: "📴 Offline Mode",
        vaultPersistentBadge: "🔒 Persistent",
        vaultExport: "⬇ Backup (.json)",
        vaultImport: "⬆ Import / Merge",
        vaultImportOk: "Progress merged and saved to the offline vault!",
        vaultImportErr: "Invalid backup file.",
    },
    es: {
        moduleTitle: "Abhidhammatthasaṅgaha — Repetición Espaciada (Anki SRS)",
        moduleSubtitle: "Memorización completa del Abhidhammatthasaṅgaha Mūla (357 tarjetas) en 30, 60 o 90 días: tope estricto de 12 nuevas/día y repasos máximos (9999/día) para no olvidar.",
        modeChapters: "📚 Por Capítulos",
        modePlan90: "📅 Ruta {days} Días",
        studyAllUnlocked: "Estudiar Todos Desbloqueados",
        studyTodayDose: "Estudiar Dosis de Hoy",
        studyChapter: "Estudiar Capítulo",
        backToChapters: "← Volver",
        memorized: "Memorizadas",
        dueNow: "Pendientes Ahora",
        retentionToday: "Retención Hoy",
        streak: "Racha",
        daysUnit: "d",
        daysWord: "días",
        newPerDay: "Nuevas/día (máx. 12)",
        reviewsPerDayLabel: "Rep./día",
        reviewsMaxBadge: "9999 (Máx.)",
        reviewOnlyOption: "0 (Solo repaso)",
        maxNewTag: "máx.",
        paceAuto: "Auto",
        unlimited: "9999 (Máx.)",
        clinicalToggleOn: "🎯 Evaluación Clínica (Otra vez / Bien)",
        clinicalToggleOff: "🎛 Anki Clásico (4 botones)",
        clinicalGradingHint: "Evaluación clínica: exactitud instantánea = Bien · cualquier duda o lapso = Otra vez (sin negociar con Difícil).",
        horizonGroupLabel: "Elegir plazo de la ruta de memorización",
        horizonSubFmt: "{quota} nuevas/d · rep. ≤{cap}d",
        horizonReserveFmt: "+{res}d solo repaso",
        planReviewsMaxLabel: "Repasos máximos/día",
        planReviewsMaxValue: "9999 (tope ≤{cap}d)",
        planProtocolSummary: "Protocolo activo: tope de {maxNew} nuevas/día · cola de repasos ilimitada (9999/día, vaciar a diario) · intervalo máximo de {cap}d.",
        tierAtom: "Ladrillo (Átomo)",
        tierStructure: "Estructura",
        tierHouse: "Casa (Síntesis)",
        tierLegend: "🧱 Ladrillos (unidades) → 🏗 Estructuras, Checksums y Confundibles → 🏛 Casa (síntesis)",
        unlocked: "Desbloqueado",
        locked: "Bloqueado",
        unlockHintPrefix: "Requiere ≥",
        unlockHintMiddle: "% de ladrillos del Cap.",
        unlockMissingSuffix: "faltan",
        bricksLabel: "ladrillos",
        houseUnlockedLabel: "Síntesis de la Casa desbloqueada",
        houseLockedPrefix: "La casa requiere",
        houseLockedSuffix: "% de ladrillos de este capítulo",
        countNew: "Nuevas",
        countLearning: "Aprendiendo",
        countReview: "Repasar",
        countMastered: "Dominadas",
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
        mathStructureTitle: "Estructura Matemática de la Lista",
        translationTitle: "Traducción Canónica",
        sourceLabel: "Fuente Canónica",
        openInReader: "Abrir en Abhidhammatthasaṅgaha ↗",
        sessionCompleteTitle: "¡Sesión Completada!",
        sessionCompleteDesc: "Todas las tarjetas pendientes y la cuota diaria de este ámbito se han completado.",
        reviewedTodayLabel: "Revisadas hoy",
        newTodayLabel: "Nuevas estudiadas hoy",
        studyMoreNew: "Estudiar Más (≤12 nuevas/d + Repaso Máximo)",
        studyExtraBatch: "⚡ Dosis completada · Estudiar Más",
        reviewAheadBtn: "🔁 Repaso Máximo",
        doseDoneLabel: "¡Dosis del día completada!",
        loadingDataset: "Cargando baraja canónica del tratado…",
        loadError: "No se pudo cargar la baraja del Abhidhammatthasaṅgaha.",
        allScopeTitle: "Todos los Capítulos Desbloqueados",
        plan90ScopeTitle: "Ruta Diaria · {days} Días",
        chapterPrefix: "Cap.",
        resetProgress: "Reiniciar Progreso",
        resetConfirm: "¿Seguro que deseas borrar todo el progreso Anki del Abhidhammatthasaṅgaha?",
        plan90Title: "Plan Estructurado — {days} Días",
        plan90Desc: "Cuota matemática rigurosa (máx. 12 nuevas/día) con repasos máximos ilimitados (9999/día) y tope de intervalo ajustado al plazo para vaciar la cola de repaso cada día sin olvidar.",
        plan90DayLabel: "Día",
        plan90DaysLeft: "Días restantes",
        plan90PhaseBuild: "Fase de Carga (Nuevas ≤12/d + Repaso Máximo)",
        plan90PhaseConsolidate: "Fase de Consolidación Final (100% Repaso)",
        plan90DailyTarget: "Nuevas/día (tope 12)",
        plan90RemainingNew: "Tarjetas nuevas restantes",
        plan90DoseToday: "Dosis restante de hoy",
        plan90RestartDate: "Reiniciar conteo de {days} días desde hoy",
        plan90RestartConfirm: "¿Restablecer el inicio de la ruta de {days} días a hoy (conservando las tarjetas ya memorizadas)?",
        filterLeeches: "🩸 Sanguijuelas",
        modeChecksum: "📐 Estructura Matemática",
        modeEnumeration: "☑ Enumeración",
        modeSequence: "↕ Secuencia",
        modeConfusable: "⚖ Confundibles",
        modeRecitation: "🔤 Recitación Pāli",
        modeGatha: "🎵 Gāthā Ancla",
        recitationLabel: "Recitación Pāli",
        recallPlaceholder: "Recuerdo activo (opcional): formule mentalmente o escriba su respuesta antes de revelar…",
        yourRecallLabel: "Tu anotación",
        fourfoldToggle: "Cuadrante de 4 campos (Lakkhaṇa · Rasa · Paccupaṭṭhāna · Padaṭṭhāna)",
        checklistPrompt: "Marca los elementos que recordaste completos:",
        checklistIncomplete: "Enumeración incompleta — marca «Otra vez» o «Difícil» hasta acertar 100%.",
        checklistComplete: "¡Enumeración 100% completa!",
        sequenceHint: "Haz clic en los elementos abajo en orden canónico exacto (clic en uno colocado para quitarlo):",
        sequenceReset: "Limpiar orden",
        sequenceYourOrder: "Tu secuencia",
        sequenceScore: "Aciertos en posición exacta",
        clozeStage1: "1 · Cloze",
        clozeStage2: "2 · Iniciales",
        clozeStage3: "3 · En blanco",
        leechesLabel: "Sanguijuelas",
        leechBadge: "🩸 Sanguijuela",
        leechHint: "Esta tarjeta ha fallado varias veces. Crea una asociación mnemotécnica abajo o apóyate en la fórmula matemática de la lista.",
        mnemonicTitle: "Nota mnemotécnica personal",
        mnemonicPlaceholder: "Escribe una asociación o gancho personal para esta tarjeta…",
        mnemonicSaved: "Guardado",
        vaultTitle: "Bóveda Offline",
        vaultAnswersCached: "respuestas en caché",
        vaultOfflineBadge: "📴 Modo Offline",
        vaultPersistentBadge: "🔒 Persistente",
        vaultExport: "⬇ Respaldo (.json)",
        vaultImport: "⬆ Importar / Fusionar",
        vaultImportOk: "¡Progreso fusionado y guardado en la bóveda offline!",
        vaultImportErr: "Archivo de respaldo inválido.",
    },
};
function esc(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function fmt(template, vars) {
    return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
function tierBadge(card, lang) {
    const s = UI_STRINGS[lang];
    if (card.mode === "cloze_pali" || isRecitationCard(card)) {
        return card.isGatha ? s.modeGatha : s.modeRecitation;
    }
    if (card.mode === "checksum")
        return s.modeChecksum;
    if (card.mode === "enumeration")
        return s.modeEnumeration;
    if (card.mode === "sequence")
        return s.modeSequence;
    if (card.mode === "confusable")
        return s.modeConfusable;
    const tier = card.tier;
    if (tier === "atom")
        return `🧱 ${s.tierAtom}`;
    if (tier === "structure")
        return `🏗 ${s.tierStructure}`;
    return `🏛 ${s.tierHouse}`;
}
function resolvePaliTerm(card, lang) {
    return typeof card.paliTerm === "string" ? card.paliTerm : card.paliTerm[lang];
}
function deterministicShuffle(len, seedStr) {
    const arr = Array.from({ length: len }, (_, i) => i);
    let seed = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
        seed ^= seedStr.charCodeAt(i);
        seed = Math.imul(seed, 16777619) >>> 0;
    }
    for (let i = arr.length - 1; i > 0; i--) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const j = seed % (i + 1);
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}
export class AbhidhammaSrsUI {
    container;
    lang;
    dataset = null;
    states = {};
    stats;
    config;
    mnemonics = {};
    recentLog = [];
    vaultStatus = null;
    vaultNotice = "";
    view = "overview";
    overviewTrack = "chapters";
    scopeChapter = null;
    studyFromPlan90 = false;
    filterMode = "all";
    bonusReviewQueue = [];
    activeCard = null;
    isFlipped = false;
    keyListenerBound = false;
    recallDraft = "";
    fourfoldDraft = {
        lakkhana: "",
        rasa: "",
        paccupatthana: "",
        padatthana: "",
    };
    enumChecked = new Set();
    sequencePicked = [];
    clozeStageOverride = null;
    showMnemonicEditor = false;
    constructor(container, lang = "pt") {
        this.container = container;
        this.lang = lang;
        this.states = loadAnkiCardStates();
        this.stats = loadAnkiStats();
        this.config = ensurePaceTarget(loadAnkiConfig());
        saveAnkiConfig(this.config);
        this.mnemonics = loadMnemonicNotes();
    }
    setLang(lang) {
        if (this.lang === lang)
            return;
        this.lang = lang;
        this.render();
    }
    async init() {
        this.renderLoading();
        try {
            const [dataset, hydrated] = await Promise.all([
                fetchDeckWithOfflineCache("data/srs/abhidhamma_cards.json"),
                hydrateOfflineVault(),
            ]);
            this.dataset = dataset;
            this.states = { ...hydrated.snapshot.states };
            this.stats = hydrated.snapshot.stats;
            this.config = ensurePaceTarget(hydrated.snapshot.config);
            saveAnkiConfig(this.config);
            this.mnemonics = { ...hydrated.snapshot.mnemonics };
            this.recentLog = [...hydrated.snapshot.recentLog];
            this.vaultStatus = hydrated.status;
            this.bindKeyboard();
            this.bindOfflineEvents();
            this.render();
        }
        catch {
            const s = UI_STRINGS[this.lang];
            this.container.innerHTML = `<div class="abhi-srs-empty">${esc(s.loadError)}</div>`;
        }
    }
    bindOfflineEvents() {
        window.addEventListener("online", () => {
            if (this.vaultStatus) {
                this.vaultStatus = { ...this.vaultStatus, online: true };
                if (this.view === "overview")
                    this.render();
            }
        });
        window.addEventListener("offline", () => {
            if (this.vaultStatus) {
                this.vaultStatus = { ...this.vaultStatus, online: false };
                if (this.view === "overview")
                    this.render();
            }
        });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden" && Object.keys(this.states).length > 0) {
                void this.flushOfflineVault();
            }
        });
        try {
            if (typeof BroadcastChannel !== "undefined") {
                const ch = new BroadcastChannel(VAULT_BROADCAST_CHANNEL);
                ch.addEventListener("message", () => {
                    void hydrateOfflineVault().then((h) => {
                        this.states = { ...h.snapshot.states };
                        this.stats = h.snapshot.stats;
                        this.config = ensurePaceTarget(h.snapshot.config);
                        this.mnemonics = { ...h.snapshot.mnemonics };
                        this.recentLog = [...h.snapshot.recentLog];
                        this.vaultStatus = h.status;
                        if (this.view === "overview")
                            this.render();
                    });
                });
            }
        }
        catch {
        }
    }
    async flushOfflineVault(entry, nowMs = Date.now()) {
        const snap = await persistOfflineProgress(this.states, this.stats, this.config, this.mnemonics, this.recentLog, entry, nowMs);
        this.recentLog = [...snap.recentLog];
        if (this.vaultStatus) {
            this.vaultStatus = {
                ...this.vaultStatus,
                cachedAnswersCount: Math.max(snap.reviewLogCount, this.stats.totalReviewed),
                lastSavedAt: snap.updatedAt,
            };
        }
    }
    renderLoading() {
        const s = UI_STRINGS[this.lang];
        this.container.innerHTML = `<div class="abhi-srs-loading">${esc(s.loadingDataset)}</div>`;
    }
    bindKeyboard() {
        if (this.keyListenerBound)
            return;
        this.keyListenerBound = true;
        window.addEventListener("languageChanged", () => {
            const next = settings.uiLang;
            if (next === "pt" || next === "en" || next === "es") {
                this.setLang(next);
            }
        });
        document.addEventListener("keydown", (e) => {
            if (this.view !== "study" || !this.activeCard)
                return;
            if (this.container.style.display === "none")
                return;
            const overlay = this.container.closest("#reader-srs");
            if (!overlay || overlay.style.display === "none")
                return;
            const activeTag = document.activeElement?.tagName;
            if (activeTag === "TEXTAREA" || activeTag === "INPUT" || activeTag === "SELECT") {
                if (e.key === "Escape") {
                    document.activeElement.blur();
                }
                return;
            }
            if (!this.isFlipped && (e.key === " " || e.key === "Enter")) {
                e.preventDefault();
                this.flipCard();
            }
            else if (this.isFlipped) {
                if (this.config.strictClinicalGrading) {
                    if (e.key === "1")
                        this.rateCard(1);
                    else if (e.key === "2" || e.key === "3")
                        this.rateCard(3);
                }
                else {
                    if (e.key === "1")
                        this.rateCard(1);
                    else if (e.key === "2")
                        this.rateCard(2);
                    else if (e.key === "3")
                        this.rateCard(3);
                    else if (e.key === "4")
                        this.rateCard(4);
                }
            }
        });
    }
    resetCardInteraction() {
        this.isFlipped = false;
        this.recallDraft = "";
        this.fourfoldDraft = { lakkhana: "", rasa: "", paccupatthana: "", padatthana: "" };
        this.enumChecked = new Set();
        this.sequencePicked = [];
        this.clozeStageOverride = null;
        this.showMnemonicEditor = false;
    }
    startStudy(chapter, overrideFilter, fromPlan90 = false) {
        this.scopeChapter = chapter;
        this.studyFromPlan90 = fromPlan90;
        this.bonusReviewQueue = [];
        if (fromPlan90) {
            this.config = ensurePaceTarget({ ...this.config, adaptivePace: true });
            saveAnkiConfig(this.config);
        }
        if (overrideFilter)
            this.filterMode = overrideFilter;
        this.view = "study";
        this.refreshQueueAndShowNext();
    }
    startProportionalExtraBatch(chapter, fromPlan90) {
        if (!this.dataset)
            return;
        const now = Date.now();
        this.stats = loadAnkiStats(now);
        this.scopeChapter = chapter;
        this.studyFromPlan90 = fromPlan90;
        if (fromPlan90) {
            this.config = ensurePaceTarget({ ...this.config, adaptivePace: true }, now);
        }
        const batch = computeProportionalExtraBatch(this.dataset.chapters, this.dataset.cards, this.states, chapter, now, this.stats);
        if (batch.extraNew > 0) {
            const today = new Date(now).toISOString().slice(0, 10);
            const sameDay = this.config.extraNewDate === today;
            this.config = {
                ...this.config,
                extraNewDate: today,
                extraNewCount: Math.min(MAX_NEW_CARDS_PER_DAY, (sameDay ? this.config.extraNewCount : 0) + batch.extraNew),
            };
            saveAnkiConfig(this.config);
            void this.flushOfflineVault(undefined, now);
        }
        const early = batch.earlyReviews > 0
            ? buildEarlyReviewQueue(this.dataset.chapters, this.dataset.cards, this.states, chapter, batch.earlyReviews, now)
            : [];
        this.bonusReviewQueue = early.map((c) => c.id);
        this.view = "study";
        this.refreshQueueAndShowNext();
    }
    startEarlyReviewOnly(chapter, fromPlan90) {
        if (!this.dataset)
            return;
        const now = Date.now();
        this.scopeChapter = chapter;
        this.studyFromPlan90 = fromPlan90;
        const early = buildEarlyReviewQueue(this.dataset.chapters, this.dataset.cards, this.states, chapter, MAX_REVIEWS_PER_DAY, now);
        this.bonusReviewQueue = early.map((c) => c.id);
        this.view = "study";
        this.refreshQueueAndShowNext();
    }
    refreshQueueAndShowNext() {
        if (!this.dataset)
            return;
        const now = Date.now();
        this.stats = loadAnkiStats(now);
        const res = buildStudyQueue(this.dataset.chapters, this.dataset.cards, this.states, this.stats, this.config, this.scopeChapter, now, this.filterMode);
        let nextCard = res.dueLearning[0] ?? res.dueReview[0] ?? null;
        if (!nextCard && this.bonusReviewQueue.length > 0) {
            const nextId = this.bonusReviewQueue[0];
            nextCard = this.dataset.cards.find((c) => c.id === nextId) ?? null;
            if (!nextCard) {
                this.bonusReviewQueue.shift();
            }
        }
        if (!nextCard) {
            nextCard = res.queue[0] ?? null;
        }
        this.activeCard = nextCard;
        this.resetCardInteraction();
        this.render();
        this.container.scrollTop = 0;
    }
    flipCard() {
        if (this.isFlipped || !this.activeCard)
            return;
        const input = this.container.querySelector(".abhi-recall-input");
        if (input)
            this.recallDraft = input.value.trim();
        for (const key of ["lakkhana", "rasa", "paccupatthana", "padatthana"]) {
            const el = this.container.querySelector(`[data-fourfold="${key}"]`);
            if (el)
                this.fourfoldDraft[key] = el.value.trim();
        }
        this.isFlipped = true;
        this.render();
    }
    rateCard(rating) {
        if (!this.activeCard || !this.dataset)
            return;
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
        const logEntry = {
            id: `${now}-${this.activeCard.id}`,
            cardId: this.activeCard.id,
            rating,
            phaseBefore: prevState.phase,
            phaseAfter: nextState.phase,
            intervalDays: nextState.intervalDays,
            easeFactor: nextState.easeFactor,
            timestamp: now,
            offline: typeof navigator !== "undefined" ? navigator.onLine === false : false,
            ...(this.recallDraft ? { recallDraft: this.recallDraft } : {}),
        };
        void this.flushOfflineVault(logEntry, now);
        const bonusIdx = this.bonusReviewQueue.indexOf(this.activeCard.id);
        if (bonusIdx !== -1) {
            this.bonusReviewQueue.splice(bonusIdx, 1);
        }
        this.refreshQueueAndShowNext();
    }
    render() {
        if (!this.dataset) {
            this.renderLoading();
            return;
        }
        if (this.view === "overview") {
            this.renderOverview(this.dataset);
        }
        else {
            this.renderStudy(this.dataset);
        }
    }
    renderOverview(dataset) {
        const s = UI_STRINGS[this.lang];
        const now = Date.now();
        this.stats = loadAnkiStats(now);
        const progressMap = computeAllChapterProgress(dataset.chapters, dataset.cards, this.states, now);
        const leeches = countLeeches(this.states);
        const activeFilter = this.filterMode === "leeches" && leeches === 0 ? "all" : this.filterMode;
        this.filterMode = activeFilter;
        const globalQueue = buildStudyQueue(dataset.chapters, dataset.cards, this.states, this.stats, this.config, null, now, activeFilter);
        const plan90 = computePlan90Summary(dataset.cards, this.states, this.stats, this.config, now);
        const plan90Queue = buildStudyQueue(dataset.chapters, dataset.cards, this.states, this.stats, ensurePaceTarget({ ...this.config, adaptivePace: true }, now), null, now, activeFilter);
        const extraBatch = computeProportionalExtraBatch(dataset.chapters, dataset.cards, this.states, null, now, this.stats);
        const canStudyExtra = extraBatch.hasMoreNew || extraBatch.hasReviewable;
        const extraSummaryParts = [];
        if (extraBatch.extraNew > 0)
            extraSummaryParts.push(`+${extraBatch.extraNew} ${s.countNew.toLowerCase()}`);
        if (extraBatch.earlyReviews > 0)
            extraSummaryParts.push(`${extraBatch.earlyReviews} ${s.countReview.toLowerCase()}`);
        const extraSummaryLabel = extraSummaryParts.length > 0 ? ` (${extraSummaryParts.join(" + ")})` : "";
        const extraPrimaryLabel = extraBatch.extraNew > 0
            ? `${s.studyExtraBatch}${extraSummaryLabel}`
            : `${s.reviewAheadBtn}${extraBatch.earlyReviews > 0 ? ` (${extraBatch.earlyReviews})` : ""}`;
        const horizonQuotas = new Map();
        for (const h of PACE_HORIZON_OPTIONS) {
            const hCfg = setPaceHorizon(this.config, h, now);
            horizonQuotas.set(h, computeDailyNewQuota(dataset.cards, this.states, this.stats, hCfg, now));
        }
        const presetLimits = Array.from(new Set([0, 4, 6, 8, 10, MAX_NEW_CARDS_PER_DAY, Math.min(MAX_NEW_CARDS_PER_DAY, this.config.newCardsPerDay)])).sort((a, b) => a - b);
        let totalCards = 0;
        let totalMemorized = 0;
        let totalDue = 0;
        for (const p of progressMap.values()) {
            totalCards += p.totalCards;
            totalMemorized += p.totalMemorized;
            totalDue += p.learningDueCount + p.reviewDueCount;
        }
        const globalPct = totalCards > 0 ? Math.round((totalMemorized / totalCards) * 100) : 0;
        const retention = this.stats.reviewedToday > 0
            ? Math.round((this.stats.correctToday / this.stats.reviewedToday) * 100)
            : 0;
        const chaptersHtml = dataset.chapters
            .map((meta) => {
            const p = progressMap.get(meta.chapter);
            const statusCls = p.unlocked ? "unlocked" : "locked";
            const statusText = p.unlocked ? `🔓 ${s.unlocked}` : `🔒 ${s.locked}`;
            const prevChapter = Math.max(0, meta.chapter - 1);
            const unlockReason = p.unlocked
                ? p.houseUnlocked
                    ? `🏛 ${s.houseUnlockedLabel}`
                    : `🔒 ${s.houseLockedPrefix} ${meta.houseUnlockAtomPct}% ${s.houseLockedSuffix}`
                : `🔒 ${s.unlockHintPrefix} ${meta.unlockPrevAtomPct}${s.unlockHintMiddle} ${prevChapter} (${s.unlockMissingSuffix} ${p.lockedRemainingPrevAtoms} ${s.bricksLabel})`;
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
              <span class="abhi-tier-pill">🏗 ${p.structureMemorized}/${p.structureTotal}</span>
              <span class="abhi-tier-pill ${p.houseUnlocked ? "" : "muted"}">🏛 ${p.houseMemorized}/${p.houseTotal}</span>
              ${p.recitationTotal > 0 ? `<span class="abhi-tier-pill" title="${esc(s.recitationLabel)}">🔤 ${p.recitationMemorized}/${p.recitationTotal}</span>` : ""}
              ${p.leechCount > 0 ? `<span class="abhi-tier-pill abhi-leech-pill">🩸 ${p.leechCount}</span>` : ""}
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
        const activeHorizon = plan90.totalDays;
        const horizonButtonsHtml = PACE_HORIZON_OPTIONS.map((h) => {
            const selected = h === activeHorizon;
            const q = horizonQuotas.get(h) ?? MAX_NEW_CARDS_PER_DAY;
            const cap = getMaxIntervalForHorizon(h);
            const res = getReserveDaysForHorizon(h);
            const sub = fmt(s.horizonSubFmt, { quota: q, cap });
            const resNote = res > 0 ? ` · ${fmt(s.horizonReserveFmt, { res })}` : "";
            return `
        <button
          type="button"
          class="abhi-horizon-btn ${selected ? "active" : ""}"
          data-horizon="${h}"
          aria-pressed="${selected ? "true" : "false"}"
        >
          <span class="abhi-horizon-days">${h} ${esc(s.daysWord)}</span>
          <span class="abhi-horizon-meta">${esc(sub + resNote)}</span>
        </button>
      `;
        }).join("");
        const plan90PanelHtml = `
      <div class="abhi-plan90-card">
        <div class="abhi-plan90-head">
          <div>
            <h3 class="abhi-plan90-title">📅 ${esc(fmt(s.plan90Title, { days: activeHorizon }))}</h3>
            <p class="abhi-plan90-desc">${esc(s.plan90Desc)}</p>
          </div>
          <span class="abhi-plan90-phase ${plan90.isConsolidationPhase ? "consolidate" : ""}">
            ${esc(plan90.isConsolidationPhase ? s.plan90PhaseConsolidate : s.plan90PhaseBuild)}
          </span>
        </div>

        <div class="abhi-horizon-bar" role="group" aria-label="${esc(s.horizonGroupLabel)}">
          ${horizonButtonsHtml}
        </div>

        <div class="abhi-ch-progress-bar">
          <div class="abhi-ch-progress-fill" style="width:${plan90.progressPct}%"></div>
        </div>

        <div class="abhi-plan90-metrics">
          <div class="abhi-plan90-stat">
            <span>${esc(s.plan90DayLabel)}</span>
            <strong>${plan90.currentDay} / ${plan90.totalDays}</strong>
          </div>
          <div class="abhi-plan90-stat">
            <span>${esc(s.plan90DaysLeft)}</span>
            <strong>${plan90.daysRemaining}${esc(s.daysUnit)}</strong>
          </div>
          <div class="abhi-plan90-stat">
            <span>${esc(s.plan90DailyTarget)}</span>
            <strong>${plan90.dailyNewTarget} ${esc(s.countNew.toLowerCase())}/d</strong>
          </div>
          <div class="abhi-plan90-stat">
            <span>${esc(s.planReviewsMaxLabel)}</span>
            <strong>${esc(fmt(s.planReviewsMaxValue, { cap: plan90.maxIntervalDays }))}</strong>
          </div>
          <div class="abhi-plan90-stat">
            <span>${esc(s.plan90DoseToday)}</span>
            <strong>${plan90Queue.dueLearning.length + plan90Queue.dueReview.length} ${esc(s.countReview.toLowerCase())} + ${plan90Queue.newUnlocked.length} ${esc(s.countNew.toLowerCase())}</strong>
          </div>
          <div class="abhi-plan90-stat">
            <span>${esc(s.plan90RemainingNew)}</span>
            <strong>${plan90.remainingNewCards} / ${plan90.totalCards}</strong>
          </div>
        </div>

        <div class="abhi-plan-protocol">${esc(fmt(s.planProtocolSummary, { maxNew: MAX_NEW_CARDS_PER_DAY, cap: plan90.maxIntervalDays }))}</div>

        <div class="abhi-plan90-actions">
          <button type="button" class="abhi-btn-primary abhi-btn-study-plan90" ${plan90Queue.queue.length === 0 && !canStudyExtra ? "disabled" : ""}>
            ${plan90Queue.queue.length > 0
            ? `🧠 ${esc(s.studyTodayDose)} (${plan90Queue.queue.length})`
            : esc(extraPrimaryLabel)}
          </button>
          ${extraBatch.hasReviewable
            ? `<button type="button" class="abhi-btn-secondary abhi-btn-review-ahead-plan90">${esc(s.reviewAheadBtn)} (${extraBatch.earlyReviews})</button>`
            : ""}
          <button type="button" class="abhi-btn-link abhi-btn-restart-plan90">
            ↺ ${esc(fmt(s.plan90RestartDate, { days: activeHorizon }))}
          </button>
        </div>
      </div>
    `;
        this.container.innerHTML = `
      <div class="abhi-srs-wrap">
        <div class="abhi-srs-header">
          <div>
            <h2 class="abhi-srs-title">${esc(s.moduleTitle)}</h2>
            <p class="abhi-srs-subtitle">${esc(s.moduleSubtitle)}</p>
          </div>
          <div class="abhi-srs-actions">
            <label class="abhi-limit-label" for="abhi-limit-select">
              <span>${esc(s.newPerDay)}:</span>
              <select id="abhi-limit-select" class="abhi-limit-select">
                ${PACE_HORIZON_OPTIONS.map((h) => {
            const q = horizonQuotas.get(h) ?? MAX_NEW_CARDS_PER_DAY;
            const sel = this.config.adaptivePace && this.config.paceHorizonDays === h;
            return `<option value="auto-${h}" ${sel ? "selected" : ""}>${esc(s.paceAuto)} · ${h}${esc(s.daysUnit)} (${q}/d)</option>`;
        }).join("")}
                ${presetLimits
            .map((val) => `<option value="${val}" ${!this.config.adaptivePace && this.config.newCardsPerDay === val ? "selected" : ""}>${val === 0
            ? esc(s.reviewOnlyOption)
            : val === MAX_NEW_CARDS_PER_DAY
                ? `${val} (${esc(s.maxNewTag)})`
                : val}</option>`)
            .join("")}
              </select>
            </label>
            <button type="button" class="abhi-btn-primary abhi-btn-study-all" ${globalQueue.queue.length === 0 && !canStudyExtra ? "disabled" : ""}>
              ${globalQueue.queue.length > 0
            ? `🧠 ${esc(s.studyAllUnlocked)} (${globalQueue.queue.length})`
            : esc(extraPrimaryLabel)}
            </button>
          </div>
        </div>

        <div class="abhi-telemetry-bar">
          <div class="abhi-tele-pill"><span>📚 ${esc(s.memorized)}:</span><strong>${totalMemorized}/${totalCards} (${globalPct}%)</strong></div>
          <div class="abhi-tele-pill"><span>⏳ ${esc(s.dueNow)}:</span><strong>${totalDue}</strong></div>
          <div class="abhi-tele-pill"><span>🔁 ${esc(s.reviewsPerDayLabel)}:</span><strong>${esc(s.reviewsMaxBadge)}</strong></div>
          <div class="abhi-tele-pill"><span>🎯 ${esc(s.retentionToday)}:</span><strong>${retention}%</strong></div>
          <div class="abhi-tele-pill"><span>🔥 ${esc(s.streak)}:</span><strong>${this.stats.streak}${esc(s.daysUnit)}</strong></div>
          ${leeches > 0 ? `<div class="abhi-tele-pill abhi-tele-leech"><span>🩸 ${esc(s.leechesLabel)}:</span><strong>${leeches}</strong></div>` : ""}
        </div>

        <div class="abhi-method-strip">
          <div class="abhi-track-tabs">
            <button type="button" class="abhi-track-tab ${this.overviewTrack === "chapters" ? "active" : ""}" data-track="chapters">${esc(s.modeChapters)}</button>
            <button type="button" class="abhi-track-tab ${this.overviewTrack === "plan90" ? "active" : ""}" data-track="plan90">${esc(fmt(s.modePlan90, { days: activeHorizon }))}</button>
          </div>
          <div class="abhi-filter-group">
            <button
              type="button"
              class="abhi-filter-pill abhi-btn-clinical-toggle ${this.config.strictClinicalGrading ? "active" : ""}"
              aria-pressed="${this.config.strictClinicalGrading ? "true" : "false"}"
            >${esc(this.config.strictClinicalGrading ? s.clinicalToggleOn : s.clinicalToggleOff)}</button>
            ${leeches > 0
            ? `<button type="button" class="abhi-filter-pill" data-filter="leeches">${esc(s.filterLeeches)} (${leeches})</button>`
            : ""}
          </div>
        </div>

        ${this.overviewTrack === "plan90"
            ? plan90PanelHtml
            : `
          <div class="abhi-tier-legend">${esc(s.tierLegend)}</div>
          <div class="abhi-chapter-grid">
            ${chaptersHtml}
          </div>
        `}

        <div class="abhi-footer-tools">
          <div class="abhi-vault-bar">
            <span class="abhi-vault-status">
              💾 ${esc(s.vaultTitle)} · <strong>${Math.max(this.vaultStatus?.cachedAnswersCount ?? 0, this.stats.totalReviewed)}</strong> ${esc(s.vaultAnswersCached)}
              ${this.vaultStatus?.online === false ? ` · <span class="abhi-vault-tag offline">${esc(s.vaultOfflineBadge)}</span>` : ""}
              ${this.vaultStatus?.persistent ? ` · <span class="abhi-vault-tag">${esc(s.vaultPersistentBadge)}</span>` : ""}
            </span>
            <div class="abhi-vault-actions">
              <button type="button" class="abhi-btn-vault abhi-btn-export-vault">${esc(s.vaultExport)}</button>
              <button type="button" class="abhi-btn-vault abhi-btn-import-vault">${esc(s.vaultImport)}</button>
              <input type="file" class="abhi-vault-file-input" accept="application/json,.json" style="display:none" />
              <button type="button" class="abhi-btn-reset">${esc(s.resetProgress)}</button>
            </div>
            ${this.vaultNotice ? `<div class="abhi-vault-notice">${esc(this.vaultNotice)}</div>` : ""}
          </div>
        </div>
      </div>
    `;
        this.container.querySelector(".abhi-btn-study-all")?.addEventListener("click", () => {
            if (globalQueue.queue.length > 0)
                this.startStudy(null, undefined, false);
            else
                this.startProportionalExtraBatch(null, false);
        });
        this.container.querySelector(".abhi-btn-study-plan90")?.addEventListener("click", () => {
            if (plan90Queue.queue.length > 0)
                this.startStudy(null, undefined, true);
            else
                this.startProportionalExtraBatch(null, true);
        });
        this.container.querySelector(".abhi-btn-review-ahead-plan90")?.addEventListener("click", () => {
            this.startEarlyReviewOnly(null, true);
        });
        this.container.querySelectorAll("[data-horizon]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const h = Number(btn.dataset.horizon);
                if (h === 30 || h === 60 || h === 90) {
                    this.config = setPaceHorizon(this.config, h, Date.now());
                    saveAnkiConfig(this.config);
                    void this.flushOfflineVault();
                    this.render();
                }
            });
        });
        this.container.querySelector(".abhi-btn-clinical-toggle")?.addEventListener("click", () => {
            this.config = {
                ...this.config,
                strictClinicalGrading: !this.config.strictClinicalGrading,
            };
            saveAnkiConfig(this.config);
            void this.flushOfflineVault();
            this.render();
        });
        this.container.querySelector(".abhi-btn-restart-plan90")?.addEventListener("click", () => {
            const confirmMsg = fmt(s.plan90RestartConfirm, { days: activeHorizon });
            if (typeof window.confirm === "function" && !window.confirm(confirmMsg))
                return;
            this.config = setPaceHorizon(this.config, this.config.paceHorizonDays, Date.now());
            saveAnkiConfig(this.config);
            void this.flushOfflineVault();
            this.render();
        });
        this.container.querySelectorAll("[data-track]").forEach((btn) => {
            btn.addEventListener("click", () => {
                this.overviewTrack = btn.dataset.track === "plan90" ? "plan90" : "chapters";
                this.render();
            });
        });
        this.container.querySelectorAll("[data-study-chapter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const ch = Number(btn.dataset.studyChapter);
                if (!Number.isNaN(ch))
                    this.startStudy(ch, undefined, false);
            });
        });
        this.container.querySelectorAll("[data-filter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const fm = btn.dataset.filter;
                if (fm === "leeches") {
                    this.startStudy(null, "leeches", false);
                    return;
                }
                this.filterMode = fm;
                this.render();
            });
        });
        const limitSel = this.container.querySelector(".abhi-limit-select");
        limitSel?.addEventListener("change", () => {
            if (limitSel.value.startsWith("auto")) {
                const parsedH = parseInt(limitSel.value.replace("auto-", ""), 10);
                const nextHorizon = parsedH === 30 || parsedH === 60 || parsedH === 90 ? parsedH : this.config.paceHorizonDays;
                this.config = setPaceHorizon(this.config, nextHorizon, Date.now());
                saveAnkiConfig(this.config);
                void this.flushOfflineVault();
                this.render();
                return;
            }
            const val = parseInt(limitSel.value, 10);
            if (!Number.isNaN(val)) {
                const clamped = Math.max(0, Math.min(MAX_NEW_CARDS_PER_DAY, val));
                this.config = { ...this.config, adaptivePace: false, newCardsPerDay: clamped };
                saveAnkiConfig(this.config);
                void this.flushOfflineVault();
                this.render();
            }
        });
        this.container.querySelector(".abhi-btn-export-vault")?.addEventListener("click", () => {
            const snap = buildLocalStorageSnapshot(this.recentLog, this.vaultStatus?.cachedAnswersCount);
            const blob = new Blob([serializeProgressBackup(snap)], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `abhidhamma-anki-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
        const fileInput = this.container.querySelector(".abhi-vault-file-input");
        this.container.querySelector(".abhi-btn-import-vault")?.addEventListener("click", () => {
            fileInput?.click();
        });
        fileInput?.addEventListener("change", async () => {
            const file = fileInput.files?.[0];
            if (!file)
                return;
            try {
                const text = await file.text();
                const incoming = parseProgressBackup(text);
                const current = buildLocalStorageSnapshot(this.recentLog, this.vaultStatus?.cachedAnswersCount);
                const merged = mergeSnapshots(current, incoming);
                this.states = { ...merged.states };
                this.stats = merged.stats;
                this.config = ensurePaceTarget(merged.config);
                this.mnemonics = { ...merged.mnemonics };
                this.recentLog = [...merged.recentLog];
                await this.flushOfflineVault();
                this.vaultNotice = s.vaultImportOk;
            }
            catch {
                this.vaultNotice = s.vaultImportErr;
            }
            this.render();
        });
        this.container.querySelector(".abhi-btn-reset")?.addEventListener("click", () => {
            if (typeof window.confirm === "function" && !window.confirm(s.resetConfirm))
                return;
            this.states = {};
            this.mnemonics = {};
            this.recentLog = [];
            this.vaultNotice = "";
            saveAnkiCardStates(this.states);
            this.stats = {
                totalReviewed: 0,
                reviewedToday: 0,
                correctToday: 0,
                newStudiedToday: 0,
                streak: 0,
                lastSessionDate: new Date().toISOString().slice(0, 10),
            };
            saveAnkiStats(this.stats);
            if (this.vaultStatus) {
                this.vaultStatus = { ...this.vaultStatus, cachedAnswersCount: 0, lastSavedAt: 0 };
            }
            void resetOfflineVault();
            this.render();
        });
    }
    renderStudy(dataset) {
        const s = UI_STRINGS[this.lang];
        const now = Date.now();
        const qInfo = buildStudyQueue(dataset.chapters, dataset.cards, this.states, this.stats, this.config, this.scopeChapter, now, this.filterMode);
        const scopeLabel = this.filterMode === "leeches"
            ? s.filterLeeches
            : this.studyFromPlan90
                ? fmt(s.plan90ScopeTitle, { days: this.config.paceHorizonDays })
                : this.scopeChapter === null
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
          <span class="anki-cnt rev" title="${esc(s.countReview)}">${qInfo.dueReview.length + this.bonusReviewQueue.length}</span>
        </div>
      </div>
    `;
        if (!this.activeCard) {
            const quotaToday = computeDailyNewQuota(dataset.cards, this.states, this.stats, this.config, now);
            const scopedBatch = computeProportionalExtraBatch(dataset.chapters, dataset.cards, this.states, this.scopeChapter, now, this.stats);
            const batchParts = [];
            if (scopedBatch.extraNew > 0)
                batchParts.push(`+${scopedBatch.extraNew} ${s.countNew.toLowerCase()}`);
            if (scopedBatch.earlyReviews > 0)
                batchParts.push(`${scopedBatch.earlyReviews} ${s.countReview.toLowerCase()}`);
            const batchSuffix = batchParts.length > 0 ? ` (${batchParts.join(" + ")})` : "";
            this.container.innerHTML = `
        <div class="abhi-srs-wrap abhi-study-mode">
          ${topBarHtml}
          <div class="abhi-complete-card">
            <div class="abhi-complete-icon">✅</div>
            <h3>${esc(s.sessionCompleteTitle)}</h3>
            <p>${esc(s.sessionCompleteDesc)}</p>
            <div class="abhi-complete-stats">
              <span>${esc(s.reviewedTodayLabel)}: <strong>${this.stats.reviewedToday}</strong></span>
              <span>${esc(s.newTodayLabel)}: <strong>${this.stats.newStudiedToday} / ${quotaToday} (${esc(s.maxNewTag)} ${MAX_NEW_CARDS_PER_DAY})</strong></span>
            </div>
            <div class="abhi-complete-actions">
              <button type="button" class="abhi-btn-back-main abhi-btn-secondary">${esc(s.backToChapters)}</button>
              ${scopedBatch.hasMoreNew
                ? `<button type="button" class="abhi-btn-more-new abhi-btn-primary">⚡ ${esc(s.studyMoreNew)}${esc(batchSuffix)}</button>`
                : ""}
              ${scopedBatch.hasReviewable
                ? `<button type="button" class="abhi-btn-review-ahead ${scopedBatch.hasMoreNew ? "abhi-btn-secondary" : "abhi-btn-primary"}">${esc(s.reviewAheadBtn)} (${scopedBatch.earlyReviews})</button>`
                : ""}
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
                this.startProportionalExtraBatch(this.scopeChapter, this.studyFromPlan90);
            });
            this.container.querySelector(".abhi-btn-review-ahead")?.addEventListener("click", () => {
                this.startEarlyReviewOnly(this.scopeChapter, this.studyFromPlan90);
            });
            return;
        }
        const card = this.activeCard;
        const state = this.states[card.id] ?? createInitialAnkiCardState(card.id, this.config);
        const intervals = previewAnkiIntervals(state, this.lang, now, this.config);
        const isCloze = card.mode === "cloze_pali" && Boolean(card.paliText);
        const isSeq = card.mode === "sequence" && (card.sequenceItems?.length ?? 0) > 0;
        const isEnum = card.mode === "enumeration" && (card.checklist?.length ?? 0) > 0;
        const hasFourfold = Boolean(card.characteristics &&
            (card.characteristics.lakkhana ||
                card.characteristics.rasa ||
                card.characteristics.paccupatthana ||
                card.characteristics.padatthana));
        let frontInteractiveHtml = "";
        if (!this.isFlipped) {
            if (isCloze && card.paliText) {
                const stage = this.clozeStageOverride ?? defaultClozeStage(state);
                const clozeDisplay = buildProgressiveCloze(card.paliText, stage);
                frontInteractiveHtml = `
          <div class="abhi-cloze-bar">
            <button type="button" class="abhi-stage-pill ${stage === 1 ? "active" : ""}" data-cloze-stage="1">${esc(s.clozeStage1)}</button>
            <button type="button" class="abhi-stage-pill ${stage === 2 ? "active" : ""}" data-cloze-stage="2">${esc(s.clozeStage2)}</button>
            <button type="button" class="abhi-stage-pill ${stage === 3 ? "active" : ""}" data-cloze-stage="3">${esc(s.clozeStage3)}</button>
          </div>
          <div class="abhi-cloze-box">${esc(clozeDisplay)}</div>
          <div class="abhi-recall-box">
            <textarea class="abhi-recall-input" rows="2" placeholder="${esc(s.recallPlaceholder)}">${esc(this.recallDraft)}</textarea>
          </div>
        `;
            }
            else if (isSeq && card.sequenceItems) {
                const order = deterministicShuffle(card.sequenceItems.length, card.id);
                const pickedSet = new Set(this.sequencePicked);
                frontInteractiveHtml = `
          <div class="abhi-seq-wrap">
            <div class="abhi-seq-hint">${esc(s.sequenceHint)}</div>
            <div class="abhi-seq-placed">
              ${this.sequencePicked.length === 0
                    ? `<span class="abhi-seq-empty">…</span>`
                    : this.sequencePicked
                        .map((origIdx, pos) => `<button type="button" class="abhi-seq-chip placed" data-seq-remove="${pos}">${pos + 1}. ${esc(card.sequenceItems[origIdx][this.lang])}</button>`)
                        .join("")}
            </div>
            <div class="abhi-seq-pool">
              ${order
                    .filter((origIdx) => !pickedSet.has(origIdx))
                    .map((origIdx) => `<button type="button" class="abhi-seq-chip" data-seq-pick="${origIdx}">${esc(card.sequenceItems[origIdx][this.lang])}</button>`)
                    .join("")}
            </div>
            ${this.sequencePicked.length > 0
                    ? `<button type="button" class="abhi-btn-link abhi-seq-clear">${esc(s.sequenceReset)}</button>`
                    : ""}
          </div>
        `;
            }
            else if (hasFourfold) {
                frontInteractiveHtml = `
          <div class="abhi-fourfold-wrap">
            <div class="abhi-fourfold-title">${esc(s.fourfoldToggle)}</div>
            <div class="abhi-fourfold-grid">
              <label><span>${esc(s.lakkhana)}</span><input type="text" data-fourfold="lakkhana" value="${esc(this.fourfoldDraft.lakkhana)}" /></label>
              <label><span>${esc(s.rasa)}</span><input type="text" data-fourfold="rasa" value="${esc(this.fourfoldDraft.rasa)}" /></label>
              <label><span>${esc(s.paccupatthana)}</span><input type="text" data-fourfold="paccupatthana" value="${esc(this.fourfoldDraft.paccupatthana)}" /></label>
              <label><span>${esc(s.padatthana)}</span><input type="text" data-fourfold="padatthana" value="${esc(this.fourfoldDraft.padatthana)}" /></label>
            </div>
          </div>
        `;
            }
            else {
                frontInteractiveHtml = `
          <div class="abhi-recall-box">
            <textarea class="abhi-recall-input" rows="2" placeholder="${esc(s.recallPlaceholder)}">${esc(this.recallDraft)}</textarea>
          </div>
        `;
            }
        }
        let charRows = "";
        if (card.characteristics) {
            const c = card.characteristics;
            const items = [
                ["lakkhana", s.lakkhana, c.lakkhana?.[this.lang]],
                ["rasa", s.rasa, c.rasa?.[this.lang]],
                ["paccupatthana", s.paccupatthana, c.paccupatthana?.[this.lang]],
                ["padatthana", s.padatthana, c.padatthana?.[this.lang]],
            ];
            const valid = items.filter(([, , val]) => Boolean(val));
            if (valid.length > 0) {
                charRows = `
          <div class="abhi-char-grid">
            ${valid
                    .map(([k, lbl, val]) => `
              <div class="abhi-char-item">
                <span class="abhi-char-lbl">${esc(lbl)}</span>
                <span class="abhi-char-val">${esc(val)}</span>
                ${this.fourfoldDraft[k]
                    ? `<span class="abhi-char-user">${esc(s.yourRecallLabel)}: ${esc(this.fourfoldDraft[k])}</span>`
                    : ""}
              </div>`)
                    .join("")}
          </div>
        `;
            }
        }
        let enumHtml = "";
        if (this.isFlipped && isEnum && card.checklist) {
            const total = card.checklist.length;
            const got = this.enumChecked.size;
            const allDone = got === total;
            enumHtml = `
        <div class="abhi-enum-box">
          <div class="abhi-enum-head">
            <span>${esc(s.checklistPrompt)}</span>
            <strong>${got}/${total}</strong>
          </div>
          <ul class="abhi-enum-list">
            ${card.checklist
                .map((item, idx) => `
              <li>
                <label>
                  <input type="checkbox" data-enum-idx="${idx}" ${this.enumChecked.has(idx) ? "checked" : ""} />
                  <span>${esc(item[this.lang])}</span>
                </label>
              </li>`)
                .join("")}
          </ul>
          <div class="abhi-enum-status ${allDone ? "ok" : "warn"}">
            ${esc(allDone ? s.checklistComplete : s.checklistIncomplete)}
          </div>
        </div>
      `;
        }
        let seqResultHtml = "";
        if (this.isFlipped && isSeq && card.sequenceItems && this.sequencePicked.length > 0) {
            let exact = 0;
            const slots = card.sequenceItems
                .map((canon, pos) => {
                const pickedIdx = this.sequencePicked[pos];
                const ok = pickedIdx === pos;
                if (ok)
                    exact++;
                const pickedText = pickedIdx !== undefined ? card.sequenceItems[pickedIdx][this.lang] : "—";
                return `<span class="abhi-seq-grade ${ok ? "ok" : "bad"}">${pos + 1}. ${esc(pickedText)}${ok ? " ✓" : ` → ${esc(canon[this.lang])}`}</span>`;
            })
                .join("");
            seqResultHtml = `
        <div class="abhi-seq-result">
          <div class="abhi-seq-result-head">${esc(s.sequenceYourOrder)} · ${esc(s.sequenceScore)}: <strong>${exact}/${card.sequenceItems.length}</strong></div>
          <div class="abhi-seq-grades">${slots}</div>
        </div>
      `;
        }
        const mathHtml = card.mathStructure?.[this.lang]
            ? `<div class="abhi-math-box">
           <div class="abhi-math-title">📐 ${esc(s.mathStructureTitle)}</div>
           <div class="abhi-math-text">${esc(card.mathStructure[this.lang])}</div>
         </div>`
            : "";
        const mechanicsHtml = card.mechanics?.[this.lang]
            ? `<div class="abhi-mechanics-box">
           <div class="abhi-mechanics-title">${isRecitationCard(card) ? "🌐" : "⚙"} ${esc(isRecitationCard(card) ? s.translationTitle : s.mechanicsTitle)}</div>
           <div class="abhi-mechanics-text">${esc(card.mechanics[this.lang])}</div>
         </div>`
            : "";
        const sourceParts = [];
        if (card.source.as)
            sourceParts.push(`As ${card.source.as}`);
        if (card.source.cma)
            sourceParts.push(`CMA ${card.source.cma}`);
        const sourceText = sourceParts.join(" · ");
        const readerHref = card.source.segId
            ? `#/tipitaka/abhidhammatthasangaha/mula/${card.source.segId > 913 ? 1 : 0}?seg=${card.source.segId}`
            : null;
        const sourceHtml = sourceText || readerHref
            ? `<div class="abhi-source-row">
             <span class="abhi-source-tag">📖 ${esc(s.sourceLabel)}: ${esc(sourceText || "Abhidhammatthasaṅgaha Mūla")}</span>
             ${readerHref ? `<a class="abhi-source-link" href="${esc(readerHref)}">${esc(s.openInReader)}</a>` : ""}
           </div>`
            : "";
        const userRecallHtml = this.isFlipped && this.recallDraft
            ? `<div class="abhi-user-recall">
             <div class="abhi-user-recall-lbl">${esc(s.yourRecallLabel)}</div>
             <div class="abhi-user-recall-text">${esc(this.recallDraft)}</div>
           </div>`
            : "";
        const leechActive = isLeech(state);
        const savedMnemonic = this.mnemonics[card.id] ?? "";
        const leechHtml = leechActive
            ? `<div class="abhi-leech-box"><strong>${esc(s.leechBadge)} (${state.lapses}×)</strong> — ${esc(s.leechHint)}</div>`
            : "";
        const mnemonicHtml = this.isFlipped && (leechActive || savedMnemonic || this.showMnemonicEditor)
            ? `<div class="abhi-mnemonic-box">
             <div class="abhi-mnemonic-head"><span>💡 ${esc(s.mnemonicTitle)}</span><span class="abhi-mnemonic-saved"></span></div>
             <textarea class="abhi-mnemonic-input" rows="2" placeholder="${esc(s.mnemonicPlaceholder)}">${esc(savedMnemonic)}</textarea>
           </div>`
            : this.isFlipped
                ? `<button type="button" class="abhi-btn-link abhi-btn-open-mnemonic">+ 💡 ${esc(s.mnemonicTitle)}</button>`
                : "";
        this.container.innerHTML = `
      <div class="abhi-srs-wrap abhi-study-mode">
        ${topBarHtml}
        <div class="abhi-flashcard">
          <div class="abhi-card-meta">
            <span class="abhi-cat-badge">${esc(card.categoryLabel[this.lang])}</span>
            <span class="abhi-tier-badge tier-${card.tier}">${esc(tierBadge(card, this.lang))}</span>
          </div>

          <div class="abhi-card-pali">${esc(resolvePaliTerm(card, this.lang))}</div>
          <div class="abhi-card-prompt">${esc(card.prompt[this.lang])}</div>

          ${!this.isFlipped
            ? `
            ${frontInteractiveHtml}
            <div class="abhi-reveal-row">
              <button type="button" class="abhi-btn-reveal">${esc(s.showAnswer)}</button>
            </div>
          `
            : `
            <hr class="abhi-card-divider" />
            ${userRecallHtml}
            ${seqResultHtml}
            <div class="abhi-card-answer ${isCloze ? "abhi-pali-verbatim" : ""}">${esc(card.answer[this.lang])}</div>
            ${mathHtml}
            ${enumHtml}
            ${charRows}
            ${mechanicsHtml}
            ${sourceHtml}
            ${leechHtml}
            ${mnemonicHtml}
          `}
        </div>

        ${this.isFlipped
            ? this.config.strictClinicalGrading
                ? `
          <div class="abhi-clinical-hint">${esc(s.clinicalGradingHint)}</div>
          <div class="abhi-anki-ratings clinical-2">
            <button type="button" class="abhi-rate-btn rate-1" data-rate="1">
              <span class="rate-lbl">[1] ${esc(s.again)}</span>
              <span class="rate-int">${esc(intervals[1])}</span>
            </button>
            <button type="button" class="abhi-rate-btn rate-3" data-rate="3">
              <span class="rate-lbl">[2] ${esc(s.good)}</span>
              <span class="rate-int">${esc(intervals[3])}</span>
            </button>
          </div>
        `
                : `
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
            : ""}
      </div>
    `;
        this.bindStudyCommonEvents();
        this.container.querySelector(".abhi-btn-reveal")?.addEventListener("click", () => this.flipCard());
        this.container.querySelectorAll("[data-cloze-stage]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const stg = Number(btn.dataset.clozeStage);
                const inp = this.container.querySelector(".abhi-recall-input");
                if (inp)
                    this.recallDraft = inp.value;
                this.clozeStageOverride = stg;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-seq-pick]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.dataset.seqPick);
                if (!Number.isNaN(idx)) {
                    this.sequencePicked.push(idx);
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-seq-remove]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const pos = Number(btn.dataset.seqRemove);
                if (!Number.isNaN(pos)) {
                    this.sequencePicked.splice(pos, 1);
                    this.render();
                }
            });
        });
        this.container.querySelector(".abhi-seq-clear")?.addEventListener("click", () => {
            this.sequencePicked = [];
            this.render();
        });
        this.container.querySelectorAll("[data-enum-idx]").forEach((box) => {
            box.addEventListener("change", () => {
                const idx = Number(box.dataset.enumIdx);
                if (box.checked)
                    this.enumChecked.add(idx);
                else
                    this.enumChecked.delete(idx);
                this.render();
            });
        });
        this.container.querySelector(".abhi-btn-open-mnemonic")?.addEventListener("click", () => {
            this.showMnemonicEditor = true;
            this.render();
        });
        const mnemInput = this.container.querySelector(".abhi-mnemonic-input");
        mnemInput?.addEventListener("input", () => {
            this.mnemonics = saveMnemonicNote(card.id, mnemInput.value);
            void this.flushOfflineVault();
            const badge = this.container.querySelector(".abhi-mnemonic-saved");
            if (badge)
                badge.textContent = s.mnemonicSaved;
        });
        this.container.querySelectorAll(".abhi-rate-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const r = Number(btn.dataset.rate);
                if (r >= 1 && r <= 4)
                    this.rateCard(r);
            });
        });
    }
    bindStudyCommonEvents() {
        this.container.querySelector(".abhi-btn-back")?.addEventListener("click", () => {
            if (this.filterMode === "leeches")
                this.filterMode = "all";
            this.view = "overview";
            this.render();
            this.container.scrollTop = 0;
        });
    }
}
//# sourceMappingURL=ui.js.map