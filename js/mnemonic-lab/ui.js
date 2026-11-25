import { settings } from "../state.js?v=ec96663c";
import { CANONICAL_CITTAS_89, CANONICAL_CITTAS_121, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=ec96663c";
import { CANONICAL_CHAPTERS_META, getSubmatricesForChapter, } from "./nary-chapters-data.js?v=ec96663c";
import { MULA_SYNTHESIS_ITEMS, SYNTHESIS_AXIS_META, } from "./chapters/ch0-synthesis.js?v=ec96663c";
import { buildReverseChoices, computeChapterScopeProgress, computeMnemonicProgressSummary, computePhalanxMapProgress, computeProgressMetric, defaultNarySwitchesForChapter, defaultNarySwitchesForSubmatrix, evaluateNaryChallenge, getMasteryScoreForLevel, getNaryItemsForChapter, pickNextNaryChapterChallenge, defaultSwitchStateForFamily, evaluateChemicalSynthesis, getPhalanxMapById, getSynthesizableCittas, loadMnemonicProgress, mergeMnemonicProgress, pickNextBinaryChallenge, pickNextPeriodicChallenge, pickNextPhalanxSlot, recordMnemonicAttempt, resolveCittaFromSwitches, saveMnemonicProgress, } from "./engine.js?v=ec96663c";
import { buildLocalStorageSnapshot, hydrateOfflineVault, mergeSnapshots, parseProgressBackup, persistMnemonicOfflineVault, serializeProgressBackup, VAULT_BROADCAST_CHANNEL, } from "../abhidhamma-srs/offline-store.js?v=ec96663c";
const LAB_STRINGS = {
    pt: {
        title: "🧮 Laboratório Mnêmico do Abhidhammatthasaṅgaha",
        subtitle: "1. Descompactação N-ária (9 Capítulos · 89/121) · 2. Tabela Periódica (72 Sabhāva + 10 Anipphanna = 82) · 3. Ábaco Tátil nas Falanges",
        memoryAidNotice: "Isto não é o Abhidhamma em si, mas apenas um auxílio de memorização.",
        binAidNotice: "Auxílio de memorização (não o Abhidhamma em si): matrizes combinatórias para reconstruir as 89/121 Cittas e os 9 Capítulos.",
        perAidNotice: "Auxílio de memorização (não o Abhidhamma em si): atlas visual das 82 realidades (72 Sabhāva + 10 Anipphanna) e síntese do Saṅgaha-naya.",
        phaAidNotice: "Auxílio de memorização (não o Abhidhamma em si): ábaco espacial nas falanges para recordar listas canônicas em ordem.",
        streak: "Sequência",
        bestStreak: "Recorde",
        mastered: "Dominados",
        accuracy: "Precisão",
        rigorLevel: "Nível de Rigor:",
        lvl1: "1 · Guiado (Fórmulas & Pistas)",
        lvl2: "2 · Canônico (Tradução ↔ Estrutura)",
        lvl3: "3 · Rigor Pāli (Sem Dicas / Mão Cega)",
        tabBinary: "⚡ 1. Descompactador N-ário (Nava Paricchedā · 89/121)",
        tabPeriodic: "🧪 2. Tabela Periódica (72 / 82 Realidades)",
        tabPhalanx: "🖐 3. Ábaco das Falanges (5 Mapas)",
        binModeExplore: "🔬 Explorador de Matrizes & Gerador",
        binModeChallenge: "🎯 Desafio: Decodificador N-ário",
        binFamilyLabel: "Família Geradora (Matriz):",
        binJatiLabel: "Natureza (Jāti ×3):",
        binBit1Label: "Bit 1 — Sensação (Vedanā):",
        binBit2Label: "Bit 2 — Conexão Cognitiva:",
        binBit3Label: "Bit 3 — Instigação (Saṅkhāra):",
        binJhanaLabel: "Escada dos 5 Jhānas (Subtração de Fatores):",
        binArupaLabel: "4 Bases Imateriais (Arūpa — 5º Jhāna):",
        binMaggaLabel: "4 Graus Supramundanos (Lokuttara):",
        binSynthesizedTitle: "Citta Gerada pelas Chaves Atuais:",
        binChallengeTitle: "Missão de Codificação Combinatória:",
        binVerifyBtn: "⚡ Verificar Codificação",
        binNextBtn: "Próximo Desafio →",
        binLoadIntoSwitches: "Carregar nas Chaves",
        binMatrixHeader: "Grade Combinatória desta Família (clique para inspecionar):",
        binCorrectMsg: "✅ Codificação Exata! Você reconstruiu a realidade canônica pela fórmula geradora.",
        binWrongMsg: "❌ As chaves atuais geram outra realidade. Compare os parâmetros abaixo:",
        binEquationBoxTitle: "Equação de Descompactação Canônica (54 + 15 + 12 + 8 [40] = 89 [121]):",
        binMode121Label: "Modo: 121 Cittas (Vitthāra · 40 Lokuttara)",
        binMode89Label: "Modo: 89 Cittas (Saṅkhepa · 8 Lokuttara)",
        binScopeAll121: "🌐 Todas 121 (Vitthāra)",
        binScopeAll89: "🌐 Todas 89 (Saṅkhepa)",
        binJhanaLokuttaraLabel: "Fatores dos 5 Jhānas em Lokuttara (Vitthāra):",
        binRelBhumi: "Plano (Bhūmi)",
        binRelJati: "Natureza (Jāti)",
        binRelVedana: "Sensação (Vedanā)",
        binRelHetu: "Raízes (Hetu)",
        binRelKicca: "Função (Kicca)",
        binRelDvara: "Porta (Dvāra)",
        binRelArammana: "Objeto (Ālambaṇa)",
        binRelVatthu: "Base Física (Vatthu)",
        binRelEradication: "Erradicação Canônica (Samuccheda)",
        binRelSangaha: "Cetasikas (Saṅgaha)",
        perModeAtlas: "🗺 Atlas Interativo das 82 Realidades (72 Sabhāva + 10 Anipphanna)",
        perModeAlchemy: "⚗️ Jogo: Alquimia do Saṅgaha-naya & Colisões",
        perFilterAll: "Todas as 82 (72 Sabhāva + 10 Anipphanna)",
        perFilterCitta: "1 Citta",
        perFilterNeutral: "13 Cetasikas Neutros (7+6)",
        perFilterAkusala: "14 Cetasikas Insalubres (4+3+4+2+1)",
        perFilterSobhana: "25 Cetasikas Belos (19+3+2+1)",
        perFilterRupa: "18 Nipphanna-Rūpas Concretos (Octeto ★)",
        perFilterAnipphanna: "10 Anipphanna-Rūpas Não-Concretos (1+2+3+4)",
        perFilterNibbana: "1 Nibbāna",
        perWhy72Title: "Por que 72 Realidades (Sabhāva-dhammas) e 82 Subdivisões Totais? (AS VI.2–5 / VII.41)",
        perWhy72Body: "1 Citta (#1) + 52 Cetasikas (#2–#53) + 18 Nipphanna-Rūpas concretos (#54–#71) + 1 Nibbāna (#72) = 72 realidades com natureza própria (sabhāva-dhammas / vatthu-dhammas). Somando os 10 Anipphanna-rūpas (#73–#82: 1 espaço delimitante [Pariccheda] + 2 intimações [Viññatti] + 3 mutabilidades [Vikāra] + 4 fases temporais [Lakkhaṇa]), completam-se todas as 82 subdivisões dos 4 Paramatthas (1 + 52 + 28 + 1 = 82)!",
        perTargetTitle: "Sintetize os Cetasikas desta Citta (Saṅgaha-naya):",
        perMacroBlocks: "Atalhos de Blocos Químicos (Liga/Desliga família inteira):",
        perBlockUniv7: "+7 Universais (Sabbacitta)",
        perBlockPak6: "+6 Particulares (Pakiṇṇaka)",
        perBlockAkuUniv4: "+4 Insalubres Universais (Moha-catukka)",
        perBlockSobUniv19: "+19 Belos Universais (Sobhana)",
        perBlockVirati3: "+3 Abstinências (Virati)",
        perClearMix: "🗑 Limpar Mistura",
        perFillFixedHint: "💡 Revelar Base Fixa",
        perVerifyMix: "⚗️ Validar Síntese (Saṅgaha-naya)",
        perNextChallenge: "Próxima Citta →",
        perActiveCount: "Cetasikas na mistura:",
        perCollisionsTitle: "⚠️ Detector de Curto-Circuito Ontológico (Leis de Exclusão do Cap. 2):",
        perNoCollisions: "✓ Nenhuma colisão ontológica entre os fatores selecionados.",
        perSuccessFixed: "✅ Síntese Perfeita (Núcleo Fixo / Niyata)! Todos os fatores obrigatórios estão presentes sem nenhuma colisão.",
        perSuccessFull: "✅ Síntese Perfeita (Saṅgaha-naya Completo)! Todos os fatores fixos e ocasionais desta Citta foram reunidos.",
        perMissingFixed: "Faltam fatores obrigatórios (fixos):",
        perExtraForbidden: "Fatores incompatíveis com esta Citta:",
        perOptionalNote: "Nota Canônica (Aniyata / Ekekavavasena): Esta Citta admite fatores ocasionais (como Issā/Macchariya/Kukkucca, Karuṇā/Muditā ou as 3 Viratis no plano sensual) que entram no total do Saṅgaha-naya, mas só surgem um de cada vez num único instante mental!",
        phaMapSelectLabel: "Mapa Canônico nas Falanges:",
        phaModeOpen: "👁 Mapa Aberto (Estudo Tátil)",
        phaModeBlind: "🎯 Mão Cega (Desafio Espacial)",
        phaModeSequence: "🔢 Percurso Sequencial (1 → N)",
        phaLeftHand: "🤚 Mão Esquerda",
        phaRightHand: "✋ Mão Direita",
        phaFingerIndex: "Indicador",
        phaFingerMiddle: "Médio",
        phaFingerRing: "Anelar",
        phaFingerLittle: "Mindinho",
        phaJointCrease: "Dobra",
        phaJointBase: "1ª (Base)",
        phaJointMiddle: "2ª (Meio)",
        phaJointTip: "3ª (Ponta)",
        phaPromptFind: "Toque na falange exata onde mora:",
        phaPromptSeq: "Toque na próxima falange da sequência canônica:",
        phaTapHint: "Toque em qualquer falange (ou use os números/setas) para ver sua âncora mnêmica.",
        phaCorrectTap: "✅ Memória Espacial Exata!",
        phaWrongTap: "❌ Posição incorreta. Veja a falange destacada em dourado:",
        phaSeqComplete: "🎉 Percurso completo! Você percorreu todas as falanges na ordem canônica exata.",
        phaRestartSeq: "🔄 Reiniciar Percurso",
        targetLabel: "Alvo:",
        currentLabel: "Atual:",
        jatiKusala: "1 · Kusala (Salubre)",
        jatiVipaka: "2 · Vipāka (Resultante)",
        jatiKiriya: "3 · Kiriya (Funcional)",
        dosaFixedNote: "(Vedanā = Domanassa · Conexão = Paṭigha fixos)",
        mohaFixedNote: "(Vedanā = Upekkhā fixa)",
        mohaDoubt: "1 · Vicikicchā-sampayutta (Dúvida — #11)",
        mohaRestlessness: "2 · Uddhacca-sampayutta (Agitação — #12)",
        jhanaWord: "Jhāna",
        maggaBtn: "Magga (Caminho — Kusala)",
        phalaBtn: "Phala (Fruto — Vipāka)",
        eqSenses: "10 Sentidos",
        eqStages: "4 Graus × 2 (× 5 Jhānas)",
        avinTag: "★ Avinibbhoga-rūpa (Octeto Inseparável)",
        anipphannaTag: "◇ Anipphanna-rūpa (Não-Concreto · 10 de 82)",
        valenceLabel: "Sampayoga / Valência:",
        fixedCoreLabel: "Base Fixa:",
        totalSangahaLabel: "Total Saṅgaha:",
        anchorLabel: "Âncora Mnêmica:",
        vaultPillLabel: "Cofre Local",
        vaultPillTitle: "Respostas salvas em 4 camadas locais (localStorage, IndexedDB, Cache Storage e OPFS)",
        binScopeLabel: "Filtrar Família do Desafio:",
        binScopeAll: "🌐 Todas as 89",
        familyMismatchNotice: "Atenção: o alvo pertence à matriz",
        alignFamilyBtn: "Alinhar Chaves com o Alvo",
        autoAlignToggleLabel: "Auto-alinhar matriz ao avançar",
        exportVaultBtn: "Exportar",
        exportVaultTitle: "Exportar cópia completa em JSON (Cofre Local em 4 camadas)",
        importVaultBtn: "Restaurar",
        importVaultTitle: "Importar cópia (.json) e mesclar com o cofre local",
        vaultImportOk: "✅ Cópia restaurada e sincronizada nas 4 camadas com sucesso!",
        vaultImportErr: "❌ Arquivo de cópia inválido.",
        navaParicchedaTitle: "Nava Paricchedā (9 Capítulos do Abhidhammatthasaṅgaha):",
        binModeToggleTitle: "Alternar entre contagem resumida (89) e detalhada (121)",
        naryCorrectParams: "Parâmetros Corretos:",
        naryDivergentParams: "Parâmetros Divergentes:",
        naryNone: "Nenhum",
        naryExpected: "esperado",
        naryCurrent: "atual",
        naryGroupLabel: "Grupo:",
        narySubdivisionLabel: "Subdivisão:",
        naryFormulaAnchor: "Fórmula Canônica / Âncora Mnêmica:",
        narySynthKicker: "Realidade Sintetizada pelas Chaves Atuais (Assinatura N-ária):",
        naryEditingConfig: "Configuração em Edição",
        naryCurrentCombo: "Combinação atual:",
        naryLoadIntoSwitches: "Carregar nas Chaves",
        naryCatalogueTitle: (ch, count) => `Catálogo Canônico do Capítulo ${ch} (${count} Itens Mūla):`,
        narySubmatrixScopeLabel: "Lente Matemática (Submatriz):",
        narySubmatrixAll: (count) => `🌐 Todas (${count})`,
        narySubmatrixEqLabel: "Fórmula da Submatriz:",
        globalProgressLabel: "Progresso Global do Laboratório",
        pillarShortNary: "Decodificador N-ário",
        pillarShortAlchemy: "Alquimia",
        pillarShortPhalanx: "Falanges",
        naryGlobalProgressLabel: "Avanço Global — Decodificador N-ário (9 Capítulos)",
        naryChaptersCompleted: (done, total) => `${done}/${total} capítulos concluídos`,
        naryChapterProgressLabel: (ch) => `Avanço do Cap. ${ch}`,
        naryScopeProgressLabel: "Escopo Atual",
        naryGlobalShortLabel: "Global (9 Cap.)",
        naryChallengesMastered: (mastered, total) => `${mastered} de ${total} desafios dominados`,
        perAlchemyProgressLabel: "Avanço da Alquimia (Saṅgaha-naya)",
        phaMapProgressLabel: "Avanço deste Mapa",
        phaAllMapsProgressLabel: "Global dos 5 Mapas",
        sealEasy: "Fácil",
        sealMedium: "Médio",
        sealHard: "Difícil",
        drillEncodeBtn: "🎛️ Codificar (Dhamma → Chaves)",
        drillReverseBtn: "🔄 Reverso (Chaves → Dhamma)",
        drillSynthesisBtn: "🌐 Prólogo & Síntese (Mūla 0–9)",
        catalogueToggleLabel: "Explorar Catálogo Canônico",
        level2CueHidden: "Nível 2 (Canônico): pistas estruturais e fórmula reveladas após verificar.",
        level3BlindCue: "Nível 3 (Rigor Pāli): decodificação cega sem tradução nem pré-visualização.",
        level3SynthMasked: "Pré-visualização oculta no Nível 3 — clique em Verificar Codificação para revelar.",
        reverseKicker: "Decodificação Reversa (Assinatura N-ária → Dhamma):",
        reverseInstruction: "Dado este vetor canônico de chaves, identifique exatamente qual dhamma do Mūla ele codifica:",
        reverseCorrectMsg: "✅ Decodificação Reversa Exata! Você reconheceu o dhamma pela sua assinatura estrutural.",
        reverseWrongMsg: "❌ Dhamma diferente. Confira a correspondência canônica abaixo:",
        synthesisTitle: "Prólogo (4 Paramatthas), Somas do Cap. 1 & Análogos Inter-Capítulos:",
        synthesisAllAxes: (count) => `🌐 Todos (${count})`,
        synthesisProgressLabel: "Avanço em Prólogo & Síntese",
        synthesisChaptersLinked: "Capítulos conectados:",
        synthesisCorrectMsg: "✅ Síntese Doutrinária Exata!",
        synthesisWrongMsg: "❌ Resposta incorreta. Veja a lei canônica abaixo:",
        srsReviewBadge: "🔁 Revisão Adaptativa",
    },
    en: {
        title: "🧮 Abhidhammatthasaṅgaha Mnemonic Lab",
        subtitle: "1. N-ary Decompression (9 Chapters · 89/121) · 2. Periodic Table (72 Sabhāva + 10 Anipphanna = 82) · 3. Phalanx Tactile Abacus",
        memoryAidNotice: "This is not the Abhidhamma itself, but memory aids only.",
        binAidNotice: "Memory aid only (not the Abhidhamma itself): combinatorial matrices to reconstruct all 89/121 Cittas and all 9 Chapters.",
        perAidNotice: "Memory aid only (not the Abhidhamma itself): visual atlas of the 82 realities (72 Sabhāva + 10 Anipphanna) and Saṅgaha-naya synthesis.",
        phaAidNotice: "Memory aid only (not the Abhidhamma itself): finger-phalanx spatial abacus for recalling canonical lists in order.",
        streak: "Streak",
        bestStreak: "Best",
        mastered: "Mastered",
        accuracy: "Accuracy",
        rigorLevel: "Rigor Level:",
        lvl1: "1 · Guided (Formulas & Cues)",
        lvl2: "2 · Canonical (Translation ↔ Structure)",
        lvl3: "3 · Pāli Rigor (No Hints / Blind Hand)",
        tabBinary: "⚡ 1. N-ary Decompressor (Nava Paricchedā · 89/121)",
        tabPeriodic: "🧪 2. Periodic Table (72 / 82 Realities)",
        tabPhalanx: "🖐 3. Phalanx Abacus (5 Maps)",
        binModeExplore: "🔬 Matrix Explorer & Live Generator",
        binModeChallenge: "🎯 Challenge: N-ary Decoder",
        binFamilyLabel: "Generator Family (Matrix):",
        binJatiLabel: "Nature (Jāti ×3):",
        binBit1Label: "Bit 1 — Feeling (Vedanā):",
        binBit2Label: "Bit 2 — Cognitive Connection:",
        binBit3Label: "Bit 3 — Prompting (Saṅkhāra):",
        binJhanaLabel: "5-Step Jhāna Ladder (Factor Subtraction):",
        binArupaLabel: "4 Immaterial Bases (Arūpa — 5th Jhāna):",
        binMaggaLabel: "4 Supramundane Stages (Lokuttara):",
        binSynthesizedTitle: "Citta Generated by Current Switches:",
        binChallengeTitle: "Combinatorial Encoding Mission:",
        binVerifyBtn: "⚡ Verify Encoding",
        binNextBtn: "Next Challenge →",
        binLoadIntoSwitches: "Load into Switches",
        binMatrixHeader: "Combinatorial Grid of this Family (click to inspect):",
        binCorrectMsg: "✅ Exact Encoding! You reconstructed the canonical reality via its generator formula.",
        binWrongMsg: "❌ Current switches generate a different reality. Compare the parameters below:",
        binEquationBoxTitle: "Canonical Decompression Equation (54 + 15 + 12 + 8 [40] = 89 [121]):",
        binMode121Label: "Mode: 121 Cittas (Vitthāra · 40 Lokuttara)",
        binMode89Label: "Mode: 89 Cittas (Saṅkhepa · 8 Lokuttara)",
        binScopeAll121: "🌐 All 121 (Vitthāra)",
        binScopeAll89: "🌐 All 89 (Saṅkhepa)",
        binJhanaLokuttaraLabel: "5 Jhāna Factors in Lokuttara (Vitthāra):",
        binRelBhumi: "Plane (Bhūmi)",
        binRelJati: "Nature (Jāti)",
        binRelVedana: "Feeling (Vedanā)",
        binRelHetu: "Roots (Hetu)",
        binRelKicca: "Function (Kicca)",
        binRelDvara: "Door (Dvāra)",
        binRelArammana: "Object (Ālambaṇa)",
        binRelVatthu: "Physical Base (Vatthu)",
        binRelEradication: "Canonical Eradication (Samuccheda)",
        binRelSangaha: "Mental Factors (Saṅgaha)",
        perModeAtlas: "🗺 Interactive Atlas of the 82 Realities (72 Sabhāva + 10 Anipphanna)",
        perModeAlchemy: "⚗️ Game: Saṅgaha-naya Alchemy & Collisions",
        perFilterAll: "All 82 (72 Sabhāva + 10 Anipphanna)",
        perFilterCitta: "1 Citta",
        perFilterNeutral: "13 Ethically Variable Cetasikas (7+6)",
        perFilterAkusala: "14 Unwholesome Cetasikas (4+3+4+2+1)",
        perFilterSobhana: "25 Beautiful Cetasikas (19+3+2+1)",
        perFilterRupa: "18 Concrete Nipphanna-Rūpas (Octad ★)",
        perFilterAnipphanna: "10 Non-Concrete Anipphanna-Rūpas (1+2+3+4)",
        perFilterNibbana: "1 Nibbāna",
        perWhy72Title: "Why 72 Realities (Sabhāva-dhammas) and 82 Total Subdivisions? (AS VI.2–5 / VII.41)",
        perWhy72Body: "1 Citta (#1) + 52 Cetasikas (#2–#53) + 18 concrete Nipphanna-Rūpas (#54–#71) + 1 Nibbāna (#72) = 72 realities possessing intrinsic nature (sabhāva-dhammas / vatthu-dhammas). Adding the 10 Anipphanna-rūpas (#73–#82: 1 delimiting space [Pariccheda] + 2 intimations [Viññatti] + 3 mutabilities [Vikāra] + 4 temporal phases [Lakkhaṇa]) completes all 82 subdivisions of the 4 Paramatthas (1 + 52 + 28 + 1 = 82)!",
        perTargetTitle: "Synthesize the Cetasikas of this Citta (Saṅgaha-naya):",
        perMacroBlocks: "Chemical Block Shortcuts (Toggle entire family at once):",
        perBlockUniv7: "+7 Universals (Sabbacitta)",
        perBlockPak6: "+6 Particulars (Pakiṇṇaka)",
        perBlockAkuUniv4: "+4 Universal Unwholesome (Moha-catukka)",
        perBlockSobUniv19: "+19 Universal Beautiful (Sobhana)",
        perBlockVirati3: "+3 Abstinences (Virati)",
        perClearMix: "🗑 Clear Mixture",
        perFillFixedHint: "💡 Reveal Fixed Core",
        perVerifyMix: "⚗️ Validate Synthesis (Saṅgaha-naya)",
        perNextChallenge: "Next Citta →",
        perActiveCount: "Cetasikas in mixture:",
        perCollisionsTitle: "⚠️ Ontological Short-Circuit Detector (Chapter 2 Exclusion Laws):",
        perNoCollisions: "✓ No ontological collisions among selected factors.",
        perSuccessFixed: "✅ Perfect Synthesis (Fixed Core / Niyata)! All mandatory factors are present with zero collisions.",
        perSuccessFull: "✅ Perfect Synthesis (Full Saṅgaha-naya)! All fixed and occasional factors of this Citta are assembled.",
        perMissingFixed: "Missing mandatory (fixed) factors:",
        perExtraForbidden: "Factors incompatible with this Citta:",
        perOptionalNote: "Canonical Note (Aniyata / Ekekavavasena): This Citta admits occasional factors (such as Issā/Macchariya/Kukkucca, Karuṇā/Muditā, or the 3 Viratis in the sense sphere) counted in the Saṅgaha-naya total, though they arise only one at a time in any single mental moment!",
        phaMapSelectLabel: "Canonical Phalanx Map:",
        phaModeOpen: "👁 Open Map (Tactile Study)",
        phaModeBlind: "🎯 Blind Hand (Spatial Recall)",
        phaModeSequence: "🔢 Sequential Path (1 → N)",
        phaLeftHand: "🤚 Left Hand",
        phaRightHand: "✋ Right Hand",
        phaFingerIndex: "Index",
        phaFingerMiddle: "Middle",
        phaFingerRing: "Ring",
        phaFingerLittle: "Little",
        phaJointCrease: "Crease",
        phaJointBase: "1st (Base)",
        phaJointMiddle: "2nd (Mid)",
        phaJointTip: "3rd (Tip)",
        phaPromptFind: "Tap the exact phalanx where this resides:",
        phaPromptSeq: "Tap the next phalanx in the canonical sequence:",
        phaTapHint: "Tap any phalanx to inspect its mnemonic anchor and canonical formula.",
        phaCorrectTap: "✅ Exact Spatial Memory!",
        phaWrongTap: "❌ Incorrect joint. See the phalanx highlighted in gold:",
        phaSeqComplete: "🎉 Full path completed! You traversed all phalanges in exact canonical order.",
        phaRestartSeq: "🔄 Restart Path",
        targetLabel: "Target:",
        currentLabel: "Current:",
        jatiKusala: "1 · Kusala (Wholesome)",
        jatiVipaka: "2 · Vipāka (Resultant)",
        jatiKiriya: "3 · Kiriya (Functional)",
        dosaFixedNote: "(Vedanā = Domanassa · Connection = Paṭigha fixed)",
        mohaFixedNote: "(Vedanā = Upekkhā fixed)",
        mohaDoubt: "1 · Vicikicchā-sampayutta (Doubt — #11)",
        mohaRestlessness: "2 · Uddhacca-sampayutta (Restlessness — #12)",
        jhanaWord: "Jhāna",
        maggaBtn: "Magga (Path — Kusala)",
        phalaBtn: "Phala (Fruition — Vipāka)",
        eqSenses: "10 Senses",
        eqStages: "4 Stages × 2 (× 5 Jhānas)",
        avinTag: "★ Avinibbhoga-rūpa (Inseparable Octad)",
        anipphannaTag: "◇ Anipphanna-rūpa (Non-Concrete · 10 of 82)",
        valenceLabel: "Sampayoga / Valence:",
        fixedCoreLabel: "Fixed Core:",
        totalSangahaLabel: "Total Saṅgaha:",
        anchorLabel: "Mnemonic Anchor:",
        vaultPillLabel: "Offline Vault",
        vaultPillTitle: "Answers cached across 4 layers (localStorage, IndexedDB, Cache Storage & OPFS)",
        binScopeLabel: "Filter Challenge Family:",
        binScopeAll: "🌐 All 89",
        familyMismatchNotice: "Notice: target belongs to matrix",
        alignFamilyBtn: "Align Controls with Target",
        autoAlignToggleLabel: "Auto-sync matrix on next",
        exportVaultBtn: "Backup",
        exportVaultTitle: "Export full backup in JSON (4-layer Offline Vault)",
        importVaultBtn: "Restore",
        importVaultTitle: "Import backup (.json) and merge with offline vault",
        vaultImportOk: "✅ Backup restored and synced across all 4 layers successfully!",
        vaultImportErr: "❌ Invalid backup file.",
        navaParicchedaTitle: "Nava Paricchedā (9 Chapters of the Abhidhammatthasaṅgaha):",
        binModeToggleTitle: "Toggle between summary (89) and detailed (121) count",
        naryCorrectParams: "Correct Parameters:",
        naryDivergentParams: "Divergent Parameters:",
        naryNone: "None",
        naryExpected: "expected",
        naryCurrent: "current",
        naryGroupLabel: "Group:",
        narySubdivisionLabel: "Subdivision:",
        naryFormulaAnchor: "Canonical Formula / Mnemonic Anchor:",
        narySynthKicker: "Reality Synthesized by Current Switches (N-ary Signature):",
        naryEditingConfig: "Configuration in Editing",
        naryCurrentCombo: "Current combination:",
        naryLoadIntoSwitches: "Load into Switches",
        naryCatalogueTitle: (ch, count) => `Canonical Catalogue of Chapter ${ch} (${count} Mūla Items):`,
        narySubmatrixScopeLabel: "Mathematical Lens (Submatrix):",
        narySubmatrixAll: (count) => `🌐 All (${count})`,
        narySubmatrixEqLabel: "Submatrix Formula:",
        globalProgressLabel: "Global Lab Progress",
        pillarShortNary: "N-ary Decoder",
        pillarShortAlchemy: "Alchemy",
        pillarShortPhalanx: "Phalanges",
        naryGlobalProgressLabel: "Global Progress — N-ary Decoder (9 Chapters)",
        naryChaptersCompleted: (done, total) => `${done}/${total} chapters completed`,
        naryChapterProgressLabel: (ch) => `Ch. ${ch} Progress`,
        naryScopeProgressLabel: "Current Scope",
        naryGlobalShortLabel: "Global (9 Ch.)",
        naryChallengesMastered: (mastered, total) => `${mastered} of ${total} challenges mastered`,
        perAlchemyProgressLabel: "Alchemy Progress (Saṅgaha-naya)",
        phaMapProgressLabel: "Current Map Progress",
        phaAllMapsProgressLabel: "All 5 Maps Global",
        sealEasy: "Easy",
        sealMedium: "Medium",
        sealHard: "Hard",
        drillEncodeBtn: "🎛️ Encode (Dhamma → Switches)",
        drillReverseBtn: "🔄 Reverse (Switches → Dhamma)",
        drillSynthesisBtn: "🌐 Prologue & Synthesis (Mūla 0–9)",
        catalogueToggleLabel: "Explore Canonical Catalogue",
        level2CueHidden: "Level 2 (Canonical): structural cues and formula revealed after verification.",
        level3BlindCue: "Level 3 (Pāli Rigor): blind decoding without translation or live preview.",
        level3SynthMasked: "Live preview hidden on Level 3 — click Verify Encoding to reveal.",
        reverseKicker: "Reverse Decoding (N-ary Signature → Dhamma):",
        reverseInstruction: "Given this canonical switch vector, identify which exact Mūla dhamma it encodes:",
        reverseCorrectMsg: "✅ Exact Reverse Decoding! You recognized the dhamma from its structural signature.",
        reverseWrongMsg: "❌ Different dhamma. Review the canonical match below:",
        synthesisTitle: "Prologue (4 Paramatthas), Ch. 1 Sums & Cross-Chapter Analogues:",
        synthesisAllAxes: (count) => `🌐 All (${count})`,
        synthesisProgressLabel: "Prologue & Synthesis Progress",
        synthesisChaptersLinked: "Linked chapters:",
        synthesisCorrectMsg: "✅ Exact Doctrinal Synthesis!",
        synthesisWrongMsg: "❌ Incorrect choice. Review the canonical law below:",
        srsReviewBadge: "🔁 Adaptive Review",
    },
    es: {
        title: "🧮 Laboratorio Mnemónico del Abhidhammatthasaṅgaha",
        subtitle: "1. Descompresión N-aria (9 Capítulos · 89/121) · 2. Tabla Periódica (72 Sabhāva + 10 Anipphanna = 82) · 3. Ábaco Táctil en las Falanges",
        memoryAidNotice: "Esto no es el Abhidhamma en sí, sino solo una ayuda de memorización.",
        binAidNotice: "Solo ayuda de memorización (no el Abhidhamma en sí): matrices combinatorias para reconstruir las 89/121 Cittas y los 9 Capítulos.",
        perAidNotice: "Solo ayuda de memorización (no el Abhidhamma en sí): atlas visual de las 82 realidades (72 Sabhāva + 10 Anipphanna) y síntesis del Saṅgaha-naya.",
        phaAidNotice: "Solo ayuda de memorización (no el Abhidhamma en sí): ábaco espacial en las falanges para recordar listas canónicas en orden.",
        streak: "Racha",
        bestStreak: "Récord",
        mastered: "Dominados",
        accuracy: "Precisión",
        rigorLevel: "Nivel de Rigor:",
        lvl1: "1 · Guiado (Fórmulas y Pistas)",
        lvl2: "2 · Canónico (Traducción ↔ Estructura)",
        lvl3: "3 · Rigor Pāli (Sin Pistas / Mano Ciega)",
        tabBinary: "⚡ 1. Descompresor N-ario (Nava Paricchedā · 89/121)",
        tabPeriodic: "🧪 2. Tabla Periódica (72 / 82 Realidades)",
        tabPhalanx: "🖐 3. Ábaco de Falanges (5 Mapas)",
        binModeExplore: "🔬 Explorador de Matrices y Generador",
        binModeChallenge: "🎯 Desafío: Decodificador N-ario",
        binFamilyLabel: "Familia Generadora (Matriz):",
        binJatiLabel: "Naturaleza (Jāti ×3):",
        binBit1Label: "Bit 1 — Sensación (Vedanā):",
        binBit2Label: "Bit 2 — Conexión Cognitiva:",
        binBit3Label: "Bit 3 — Instigación (Saṅkhāra):",
        binJhanaLabel: "Escalera de los 5 Jhānas (Sustracción de Factores):",
        binArupaLabel: "4 Bases Inmateriales (Arūpa — 5.º Jhāna):",
        binMaggaLabel: "4 Grados Supramundanos (Lokuttara):",
        binSynthesizedTitle: "Citta Generada por los Interruptores Actuales:",
        binChallengeTitle: "Misión de Codificación Combinatoria:",
        binVerifyBtn: "⚡ Verificar Codificación",
        binNextBtn: "Siguiente Desafío →",
        binLoadIntoSwitches: "Cargar en Interruptores",
        binMatrixHeader: "Cuadrícula Combinatoria de esta Familia (clic para inspeccionar):",
        binCorrectMsg: "✅ ¡Codificación Exacta! Reconstruiste la realidad canónica mediante su fórmula generadora.",
        binWrongMsg: "❌ Los interruptores actuales generan otra realidad. Compara los parámetros abajo:",
        binEquationBoxTitle: "Ecuación de Descompresión Canónica (54 + 15 + 12 + 8 [40] = 89 [121]):",
        binMode121Label: "Modo: 121 Cittas (Vitthāra · 40 Lokuttara)",
        binMode89Label: "Modo: 89 Cittas (Saṅkhepa · 8 Lokuttara)",
        binScopeAll121: "🌐 Todas 121 (Vitthāra)",
        binScopeAll89: "🌐 Todas 89 (Saṅkhepa)",
        binJhanaLokuttaraLabel: "Factores de los 5 Jhānas en Lokuttara (Vitthāra):",
        binRelBhumi: "Plano (Bhūmi)",
        binRelJati: "Naturaleza (Jāti)",
        binRelVedana: "Sensación (Vedanā)",
        binRelHetu: "Raíces (Hetu)",
        binRelKicca: "Función (Kicca)",
        binRelDvara: "Puerta (Dvāra)",
        binRelArammana: "Objeto (Ālambaṇa)",
        binRelVatthu: "Base Física (Vatthu)",
        binRelEradication: "Erradicación Canónica (Samuccheda)",
        binRelSangaha: "Factores Mentales (Saṅgaha)",
        perModeAtlas: "🗺 Atlas Interactivo de las 82 Realidades (72 Sabhāva + 10 Anipphanna)",
        perModeAlchemy: "⚗️ Juego: Alquimia del Saṅgaha-naya y Colisiones",
        perFilterAll: "Todas las 82 (72 Sabhāva + 10 Anipphanna)",
        perFilterCitta: "1 Citta",
        perFilterNeutral: "13 Cetasikas Neutros (7+6)",
        perFilterAkusala: "14 Cetasikas Insaludables (4+3+4+2+1)",
        perFilterSobhana: "25 Cetasikas Bellos (19+3+2+1)",
        perFilterRupa: "18 Nipphanna-Rūpas Concretos (Octeto ★)",
        perFilterAnipphanna: "10 Anipphanna-Rūpas No Concretos (1+2+3+4)",
        perFilterNibbana: "1 Nibbāna",
        perWhy72Title: "¿Por qué 72 Realidades (Sabhāva-dhammas) y 82 Subdivisiones Totales? (AS VI.2–5 / VII.41)",
        perWhy72Body: "1 Citta (#1) + 52 Cetasikas (#2–#53) + 18 Nipphanna-Rūpas concretos (#54–#71) + 1 Nibbāna (#72) = 72 realidades con naturaleza propia (sabhāva-dhammas / vatthu-dhammas). Sumando los 10 Anipphanna-rūpas (#73–#82: 1 espacio delimitante [Pariccheda] + 2 intimaciones [Viññatti] + 3 mutabilidades [Vikāra] + 4 fases temporales [Lakkhaṇa]), se completan todas las 82 subdivisiones de los 4 Paramatthas (1 + 52 + 28 + 1 = 82)!",
        perTargetTitle: "Sintetiza los Cetasikas de esta Citta (Saṅgaha-naya):",
        perMacroBlocks: "Atajos de Bloques Químicos (Activa/Desactiva familia entera):",
        perBlockUniv7: "+7 Universales (Sabbacitta)",
        perBlockPak6: "+6 Particulares (Pakiṇṇaka)",
        perBlockAkuUniv4: "+4 Insaludables Universales (Moha-catukka)",
        perBlockSobUniv19: "+19 Bellos Universales (Sobhana)",
        perBlockVirati3: "+3 Abstinencias (Virati)",
        perClearMix: "🗑 Limpiar Mezcla",
        perFillFixedHint: "💡 Revelar Base Fija",
        perVerifyMix: "⚗️ Validar Síntesis (Saṅgaha-naya)",
        perNextChallenge: "Siguiente Citta →",
        perActiveCount: "Cetasikas en la mezcla:",
        perCollisionsTitle: "⚠️ Detector de Cortocircuito Ontológico (Leyes de Exclusión del Cap. 2):",
        perNoCollisions: "✓ Ninguna colisión ontológica entre los factores seleccionados.",
        perSuccessFixed: "✅ ¡Síntesis Perfecta (Núcleo Fijo / Niyata)! Todos los factores obligatorios están presentes sin colisiones.",
        perSuccessFull: "✅ ¡Síntesis Perfecta (Saṅgaha-naya Completo)! Todos los factores fijos y ocasionales de esta Citta fueron reunidos.",
        perMissingFixed: "Faltan factores obligatorios (fijos):",
        perExtraForbidden: "Factores incompatibles con esta Citta:",
        perOptionalNote: "Nota Canónica (Aniyata / Ekekavavasena): Esta Citta admite factores ocasionales (como Issā/Macchariya/Kukkucca, Karuṇā/Muditā o las 3 Viratis en el plano sensorial) que entran en el total del Saṅgaha-naya, ¡pero solo surgen uno a la vez en un único instante mental!",
        phaMapSelectLabel: "Mapa Canónico en las Falanges:",
        phaModeOpen: "👁 Mapa Abierto (Estudio Táctil)",
        phaModeBlind: "🎯 Mano Ciega (Desafío Espacial)",
        phaModeSequence: "🔢 Recorrido Secuencial (1 → N)",
        phaLeftHand: "🤚 Mano Izquierda",
        phaRightHand: "✋ Mano Derecha",
        phaFingerIndex: "Índice",
        phaFingerMiddle: "Medio",
        phaFingerRing: "Anular",
        phaFingerLittle: "Meñique",
        phaJointCrease: "Pliegue",
        phaJointBase: "1.ª (Base)",
        phaJointMiddle: "2.ª (Medio)",
        phaJointTip: "3.ª (Punta)",
        phaPromptFind: "Toca la falange exacta donde reside:",
        phaPromptSeq: "Toca la siguiente falange en la secuencia canónica:",
        phaTapHint: "Toca cualquier falange para inspeccionar su ancla mnemónica y fórmula canónica.",
        phaCorrectTap: "✅ ¡Memoria Espacial Exacta!",
        phaWrongTap: "❌ Posición incorrecta. Observa la falange destacada en dorado:",
        phaSeqComplete: "🎉 ¡Recorrido completo! Recorriste todas las falanges en el orden canónico exacto.",
        phaRestartSeq: "🔄 Reiniciar Recorrido",
        targetLabel: "Objetivo:",
        currentLabel: "Actual:",
        jatiKusala: "1 · Kusala (Saludable)",
        jatiVipaka: "2 · Vipāka (Resultante)",
        jatiKiriya: "3 · Kiriya (Funcional)",
        dosaFixedNote: "(Vedanā = Domanassa · Conexión = Paṭigha fijos)",
        mohaFixedNote: "(Vedanā = Upekkhā fija)",
        mohaDoubt: "1 · Vicikicchā-sampayutta (Duda — #11)",
        mohaRestlessness: "2 · Uddhacca-sampayutta (Agitación — #12)",
        jhanaWord: "Jhāna",
        maggaBtn: "Magga (Camino — Kusala)",
        phalaBtn: "Phala (Fruto — Vipāka)",
        eqSenses: "10 Sentidos",
        eqStages: "4 Grados × 2 (× 5 Jhānas)",
        avinTag: "★ Avinibbhoga-rūpa (Octeto Inseparable)",
        anipphannaTag: "◇ Anipphanna-rūpa (No Concreto · 10 de 82)",
        valenceLabel: "Sampayoga / Valencia:",
        fixedCoreLabel: "Base Fija:",
        totalSangahaLabel: "Total Saṅgaha:",
        anchorLabel: "Ancla Mnemónica:",
        vaultPillLabel: "Bóveda Local",
        vaultPillTitle: "Respuestas guardadas en 4 capas locales (localStorage, IndexedDB, Cache Storage y OPFS)",
        binScopeLabel: "Filtrar Familia del Desafío:",
        binScopeAll: "🌐 Todas las 89",
        familyMismatchNotice: "Aviso: el objetivo pertenece a la matriz",
        alignFamilyBtn: "Alinear Controles con Objetivo",
        autoAlignToggleLabel: "Auto-sincronizar matriz al avanzar",
        exportVaultBtn: "Exportar",
        exportVaultTitle: "Exportar copia completa en JSON (Bóveda Local de 4 capas)",
        importVaultBtn: "Restaurar",
        importVaultTitle: "Importar copia (.json) y fusionar con la bóveda local",
        vaultImportOk: "✅ ¡Copia restaurada y sincronizada en las 4 capas con éxito!",
        vaultImportErr: "❌ Archivo de copia inválido.",
        navaParicchedaTitle: "Nava Paricchedā (9 Capítulos del Abhidhammatthasaṅgaha):",
        binModeToggleTitle: "Alternar entre conteo resumido (89) y detallado (121)",
        naryCorrectParams: "Parámetros Correctos:",
        naryDivergentParams: "Parámetros Divergentes:",
        naryNone: "Ninguno",
        naryExpected: "esperado",
        naryCurrent: "actual",
        naryGroupLabel: "Grupo:",
        narySubdivisionLabel: "Subdivisión:",
        naryFormulaAnchor: "Fórmula Canónica / Ancla Mnemónica:",
        narySynthKicker: "Realidad Sintetizada por los Interruptores Actuales (Firma N-aria):",
        naryEditingConfig: "Configuración en Edición",
        naryCurrentCombo: "Combinación actual:",
        naryLoadIntoSwitches: "Cargar en Interruptores",
        naryCatalogueTitle: (ch, count) => `Catálogo Canónico del Capítulo ${ch} (${count} Ítems Mūla):`,
        narySubmatrixScopeLabel: "Lente Matemática (Submatriz):",
        narySubmatrixAll: (count) => `🌐 Todas (${count})`,
        narySubmatrixEqLabel: "Fórmula de la Submatriz:",
        globalProgressLabel: "Progreso Global del Laboratorio",
        pillarShortNary: "Decodificador N-ario",
        pillarShortAlchemy: "Alquimia",
        pillarShortPhalanx: "Falanges",
        naryGlobalProgressLabel: "Avance Global — Decodificador N-ario (9 Capítulos)",
        naryChaptersCompleted: (done, total) => `${done}/${total} capítulos completados`,
        naryChapterProgressLabel: (ch) => `Avance del Cap. ${ch}`,
        naryScopeProgressLabel: "Ámbito Actual",
        naryGlobalShortLabel: "Global (9 Cap.)",
        naryChallengesMastered: (mastered, total) => `${mastered} de ${total} desafíos dominados`,
        perAlchemyProgressLabel: "Avance de la Alquimia (Saṅgaha-naya)",
        phaMapProgressLabel: "Avance de este Mapa",
        phaAllMapsProgressLabel: "Global de los 5 Mapas",
        sealEasy: "Fácil",
        sealMedium: "Medio",
        sealHard: "Difícil",
        drillEncodeBtn: "🎛️ Codificar (Dhamma → Interruptores)",
        drillReverseBtn: "🔄 Reverso (Interruptores → Dhamma)",
        drillSynthesisBtn: "🌐 Prólogo y Síntesis (Mūla 0–9)",
        catalogueToggleLabel: "Explorar Catálogo Canónico",
        level2CueHidden: "Nivel 2 (Canónico): pistas estructurales y fórmula reveladas al verificar.",
        level3BlindCue: "Nivel 3 (Rigor Pāli): decodificación ciega sin traducción ni vista previa.",
        level3SynthMasked: "Vista previa oculta en Nivel 3 — pulsa Verificar Codificación para revelar.",
        reverseKicker: "Decodificación Reversa (Firma N-aria → Dhamma):",
        reverseInstruction: "Dado este vector canónico de interruptores, identifica exactamente qué dhamma del Mūla codifica:",
        reverseCorrectMsg: "✅ ¡Decodificación Reversa Exacta! Reconociste el dhamma por su firma estructural.",
        reverseWrongMsg: "❌ Dhamma distinto. Revisa la correspondencia canónica abajo:",
        synthesisTitle: "Prólogo (4 Paramatthas), Sumas del Cap. 1 y Análogos Inter-Capítulos:",
        synthesisAllAxes: (count) => `🌐 Todos (${count})`,
        synthesisProgressLabel: "Avance en Prólogo y Síntesis",
        synthesisChaptersLinked: "Capítulos conectados:",
        synthesisCorrectMsg: "✅ ¡Síntesis Doctrinal Exacta!",
        synthesisWrongMsg: "❌ Respuesta incorrecta. Revisa la ley canónica abajo:",
        srsReviewBadge: "🔁 Revisión Adaptativa",
    },
};
let mnemonicInstanceSeq = 0;
function esc(s) {
    return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export class MnemonicLabUI {
    uid = ++mnemonicInstanceSeq;
    container;
    lang;
    progress;
    activePillar = "binary";
    binMode = "explore";
    naryDrillMode = "encode";
    binEnumMode = 121;
    binActiveChapter = 1;
    switches = defaultSwitchStateForFamily("lobha");
    binTargetCitta;
    binFamilyScope = "all";
    autoAlignFamily = true;
    binFeedback = null;
    binTargetNaryItem;
    narySubmatrixScope = "all";
    narySwitches;
    naryFeedback = null;
    reverseFeedback = null;
    synthesisAxis = "all";
    synthesisTarget = MULA_SYNTHESIS_ITEMS[0];
    synthesisFeedback = null;
    perMode = "atlas";
    perFilter = "all";
    selectedAtom = PERIODIC_ELEMENTS_72[0];
    chemTargetCitta;
    activeChemSet = new Set([1, 2, 3, 4, 5, 6, 7]);
    chemVerified = false;
    phaMapId = "akusala12";
    phaMode = "open";
    selectedSlotIndex = 1;
    blindTargetSlot;
    blindFeedback = null;
    sequenceStep = 1;
    vaultChannel = null;
    constructor(container, lang = settings.uiLang) {
        this.container = container;
        this.lang = lang;
        this.progress = loadMnemonicProgress();
        this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
        this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
        this.chemTargetCitta = pickNextPeriodicChallenge(this.progress);
        this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(this.phaMapId));
        this.binTargetNaryItem = pickNextNaryChapterChallenge(2, this.progress);
        this.narySwitches = defaultNarySwitchesForChapter(2);
    }
    init() {
        this.render();
        void this.hydrateFromVault();
        try {
            if (typeof BroadcastChannel !== "undefined") {
                this.vaultChannel?.close();
                this.vaultChannel = new BroadcastChannel(VAULT_BROADCAST_CHANNEL);
                this.vaultChannel.addEventListener("message", () => {
                    this.progress = mergeMnemonicProgress(this.progress, loadMnemonicProgress());
                    this.render();
                });
            }
        }
        catch {
        }
    }
    async hydrateFromVault() {
        try {
            const res = await hydrateOfflineVault();
            if (res.snapshot.mnemonicLab) {
                const merged = mergeMnemonicProgress(this.progress, res.snapshot.mnemonicLab);
                if (merged.totalAttempts !== this.progress.totalAttempts || merged.level !== this.progress.level) {
                    this.progress = merged;
                    saveMnemonicProgress(merged);
                    this.render();
                }
            }
        }
        catch {
        }
    }
    syncVault() {
        void persistMnemonicOfflineVault(this.progress);
    }
    setLang(lang) {
        if (this.lang === lang)
            return;
        this.lang = lang;
        this.render();
    }
    loc(pt, en, es) {
        return this.lang === "en" ? en : this.lang === "es" ? es : pt;
    }
    formatBhumiPali(bhumi) {
        switch (bhumi) {
            case "kama":
                return "Kāmāvacara";
            case "rupa":
                return "Rūpāvacara";
            case "arupa":
                return "Arūpāvacara";
            case "lokuttara":
                return "Lokuttara";
        }
    }
    formatJatiPali(jati) {
        switch (jati) {
            case "akusala":
                return "Akusala";
            case "kusala":
                return "Kusala";
            case "vipaka":
                return "Vipāka";
            case "kiriya":
                return "Kiriya";
        }
    }
    formatHetuPali(hetu) {
        switch (hetu) {
            case "ahetuka":
                return "Ahetuka";
            case "ekahetuka":
                return "Ekahetuka";
            case "dvihetuka":
                return "Dvihetuka";
            case "tihetuka":
                return "Tihetuka";
            default:
                return "—";
        }
    }
    formatParamatthaPali(p) {
        switch (p) {
            case "citta":
                return "CITTA";
            case "cetasika":
                return "CETASIKA";
            case "rupa":
                return "RŪPA";
            case "nibbana":
                return "NIBBĀNA";
        }
    }
    formatCanonicalGroupName(name) {
        if (!name)
            return "—";
        const map = {
            aññasamana: "Aññasamāna",
            sabbacitta: "Sabbacittasādhāraṇa",
            pakinnaka: "Pakiṇṇaka",
            akusala: "Akusala",
            moha: "Moha-catukka",
            moha_catukka: "Moha-catukka",
            lobha: "Lobha-tika",
            lobha_tika: "Lobha-tika",
            dosa: "Dosa-catukka",
            dosa_catukka: "Dosa-catukka",
            thina: "Thīna-duka",
            thina_middha: "Thīna-duka",
            vicikiccha: "Vicikicchā",
            sobhana: "Sobhana",
            sadharana: "Sobhanasādhāraṇa",
            sobhana_sadharana: "Sobhanasādhāraṇa",
            virati: "Virati",
            appamanna: "Appamaññā",
            panna: "Paññindriya",
            pannindriya: "Paññindriya",
            vedana: "Vedanā",
            hetu: "Hetu",
            kicca: "Kicca",
            dvara: "Dvāra",
            arammana: "Ālambaṇa",
            vatthu: "Vatthu",
            pancadvara: "Pañcadvāra",
            manodvara: "Manodvāra",
            appana: "Appanāvīthi",
            bhumi: "Bhūmi",
            kamma: "Kamma",
            patisandhi: "Paṭisandhi",
            marana: "Maraṇuppatti",
            mahabhuta: "Mahābhūta",
            upada: "Upādā-rūpa",
            pasada: "Pasāda-rūpa",
            gocara: "Gocara-rūpa",
            bhava: "Bhāva-rūpa",
            hadaya: "Hadaya-rūpa",
            jivita: "Jīvita-rūpa",
            ahara: "Āhāra-rūpa",
            pariccheda: "Pariccheda-rūpa",
            vinnatti: "Viññatti-rūpa",
            vikara: "Vikāra-rūpa",
            lakkhana: "Lakkhaṇa-rūpa",
            nibbana: "Nibbāna",
            bodhipakkhiya: "Bodhipakkhiya",
            akusala_sangaha: "Akusala-saṅgaha",
            missaka: "Missaka-saṅgaha",
            sabba: "Sabba-saṅgaha",
            patthana: "Paṭṭhāna",
            paticcasamuppada: "Paṭiccasamuppāda",
            samatha: "Samatha",
            vipassana: "Vipassanā",
            kasina: "Kasiṇa",
            asubha: "Asubha",
            anussati: "Anussati",
            brahmavihara: "Brahmavihāra",
            aruppa: "Āruppa",
            visuddhi: "Visuddhi",
            nana: "Vipassanā-ñāṇa",
            samapatti: "Samāpatti",
            sangaha_lokuttara: "Lokuttara-saṅgaha",
            sangaha_mahaggata: "Mahaggata-saṅgaha",
            sangaha_kamasobhana: "Kāmāvacara-sobhana-saṅgaha",
            sangaha_akusala: "Akusala-saṅgaha",
            sangaha_ahetuka: "Ahetuka-saṅgaha",
            lokuttara_jhana: "Pañcakajjhāna (Lokuttara)",
            mahaggata_jhana: "Pañcakajjhāna (Mahaggata)",
            kamasobhana_kusala: "Mahākusala (4 Dvaya)",
            kamasobhana_kiriya: "Mahākiriya (4 Dvaya)",
            kamasobhana_vipaka: "Mahāvipāka (4 Dvaya)",
            akusala_class: "Akusala (Sattadhā)",
            ahetuka_class: "Ahetuka (Catubbidha)",
            vedana_5: "Pañcavidha Vedanā",
            hetu_partition: "Hetu-vibhāga (89)",
            hetu_6: "Cha Hetū",
            kicca_14: "Cuddasa Kiccāni (10 Ṭhāna)",
            kicca_mult: "Kicca-ṭhāna (68+2+9+8+2)",
            dvara_totals: "Dvāra-saṅgaha (54 / 67 / 19)",
            dvara_partition: "Pañcadhā Dvāra (36+3+31+10+9)",
            arammana_7: "Sattadhā Ālambaṇa (91)",
            arammana_6: "Chabbidha Dhammārammaṇa",
            vatthu_partition: "Vatthu-nissaya (43+42+4)",
            vatthu_realms: "Loka-vatthu (6 / 3 / 0)",
            vara_4: "Cattāro Vārā",
            vithi_summary: "Pañcadvāra-saṅgaha",
            paritta_javana: "Parittajavanavāro",
            appana_vithi: "Appanājavanavāro",
            niyama: "Tadārammaṇa & Javana-niyama",
            tadarammana_niyama: "Tadārammaṇa-niyama",
            javana_niyama: "Javana-niyama",
            puggala_bhumi: "Puggalabheda & Bhūmivibhāga",
            puggalabheda: "Puggalabheda (44 / 56 / 54)",
            bhumivibhaga: "Bhūmivibhāga (80 / 64 / 42 / 0)",
            bhumi_31: "31 Bhūmiyo",
            apaya: "Apāyabhūmi",
            kamasugati: "Kāmasugatibhūmi",
            rupa_j1_3: "Rūpāvacara (Jhāna 1–3)",
            rupa_j4: "Rūpāvacara (Catutthajjhāna · Suddhāvāsa)",
            arupa: "Arūpāvacarabhūmi",
            patisandhi_4: "Catubbidha Paṭisandhi",
            patisandhi_laws: "Paṭisandhi-ārammaṇa",
            kamma_16: "Soḷasa Kammāni (4×4)",
            kamma_kicca: "Kicca-catukka",
            kamma_pakadana: "Pākadānapariyāya-catukka",
            kamma_pakakala: "Pākakāla-catukka",
            kamma_pakathana: "Pākaṭhāna-catukka",
            kamma_ripening: "Vipāka-niyama",
            kammapatha_20: "10 Akusala & 10 Puñña",
            akusala_kaya: "Kāyakamma (3)",
            akusala_vaci: "Vacīkamma (4)",
            akusala_mano: "Manokamma (3)",
            punna_10: "Dasa Puññakiriyavatthu",
            marana_cuti: "Maraṇuppatti & Cuti→Paṭisandhi",
            marana_4: "Catudhā Maraṇuppatti",
            nimitta_3: "Tividha Maraṇanimitta",
            cuti_matrix: "Cutipaṭisandhikkamo",
            rupa_28: "Aṭṭhavīsa Rūpāni",
            vibhaga_10: "Rūpavibhāga & Samuṭṭhāna",
            dyad_10: "Dasa Rūpavibhāgā",
            samutthana_4: "Cattāri Samuṭṭhānāni",
            kalapa_21: "Ekavīsa Rūpakalāpā",
            kal_kamma: "Kammasamuṭṭhāna-kalāpa (9)",
            kal_citta: "Cittasamuṭṭhāna-kalāpa (6)",
            kal_utu: "Utusamuṭṭhāna-kalāpa (4)",
            kal_ahara: "Āhārasamuṭṭhāna-kalāpa (2)",
            pavatti_nibbana: "Rūpapavatti & Nibbāna",
            pavattikkama: "Rūpapavattikkamo",
            akusala_9: "Akusala-saṅgaha (9)",
            missaka_7: "Missaka-saṅgaha (7)",
            bodhipakkhiya_21: "Bodhipakkhiya (37 → 14)",
            bodhi_groups: "Satta Bodhipakkhiya-gaṇā (37)",
            bodhi_sabhava14: "Cuddasa Sabhāva-dhammā",
            sabba_7: "Sabba-saṅgaha (5)",
            sabba_laws: "Sabba-saṅgaha Niyama",
            ps_links12: "Dvādasaṅgāni (12)",
            ps_analysis6: "Paṭiccasamuppāda-vibhāga (6)",
            patthana_24: "Catuvīsati Paccayā",
            dir_nama_nama: "Nāma → Nāma (6)",
            dir_nama_namarupa: "Nāma → Nāmarūpa (5)",
            dir_nama_rupa: "Nāma → Rūpa (1)",
            dir_rupa_nama: "Rūpa → Nāma (1)",
            dir_pannatti_nama: "Paññatti/Nāmarūpa → Nāma (2)",
            dir_namarupa_namarupa: "Nāmarūpa → Nāmarūpa (9)",
            samodhana_4: "Samodhāna (4)",
            pannatti_8: "Paññattibheda (2 + 6)",
            pannatti_class: "Duvidhā Paññatti",
            namapannatti_6: "Chabbidhā Nāmapaññatti",
            samatha_40: "Samatha (40 Kammaṭṭhāna)",
            sanna_vavatthana: "Saññā & Vavatthāna (2)",
            samatha_carita_abhinna: "Carita · Vasitā · Abhiññā (16)",
            carita_6: "Cha Caritāni (6)",
            vasita_5: "Pañca Vasitā (5)",
            abhinna_5: "Pañca Abhiññā (5)",
            vipassana_visuddhi_nana: "Visuddhi · Ñāṇa · Vimokkha (21)",
            visuddhi_7: "Satta Visuddhiyo (7)",
            nana_10: "Dasa Vipassanā-ñāṇāni (10)",
            vimokkha_4: "Vimokkha (3) & Upakkilesa (10)",
            ariya_samapatti: "Ariyapuggala & Samāpatti (6)",
            puggala_4: "Cattāro Ariyapuggalā (4)",
            samapatti_2: "Samāpattibheda (2)",
            sampayoga_52: "Sampayoga-naya (52)",
            cetasika_laws: "Cetasika-niyama (12)",
            sampayoga_marks4: "Catulakkhaṇa (AS II.1)",
            pakinnaka_excl6: "Pakiṇṇaka-vajjita (6)",
            regularity_laws: "Aniyata / Niyata (11 / 41)",
            vedana_3: "Tividhā Vedanā (3)",
            dhammarammana_sub: "Chabbidha Dhammārammaṇa",
            arammana_time: "Kāla-niyama (Ālambaṇa)",
            chakka_6: "Cha Chakkāni (6 Hêxades)",
            chakka_hexads: "Cha Chakkāni",
            puggala_bheda: "Puggalabheda",
            bhumi_vibhaga: "Bhūmivibhāga",
            rupa_laws: "Rūpa & Nibbāna Niyama",
            rupa_laws_core: "Rūpa-sabhāva Niyama",
            rupa_laws_origins: "Rūpa-samuṭṭhāna Niyama",
            akusala_members: "Akusala-saṅgaha (34 Membros)",
            missaka_members: "Missaka-saṅgaha (51 Membros)",
            bodhi_37: "Sattatiṃsa Bodhipakkhiyā (37)",
            sabba_members: "Sabba-saṅgaha (28 Membros)",
            asava_ogha_yoga: "Āsava · Ogha · Yoga",
            samyojana_delta: "Saṃyojana (Suttanta vs. Abhidhamma)",
            kilesa_extra: "Kilesa (Extras · 10)",
            bala_extra: "Bala (6–9)",
            excl_laws5: "Missaka-niyama (5)",
            khandha5: "Pañcakkhandhā (5)",
            ayatana12: "Dvādasāyatanāni (12)",
            vinnana_dhatu7: "Satta Viññāṇadhātuyo (7)",
            ariyasacca4: "Cattāri Ariyasaccāni (4)",
            patthana_submodes: "Paṭṭhāna & Atthapaññatti",
            paccaya_modes: "Paccaya-vibhāga (12)",
            atthapannatti_6: "Chabbidhā Atthapaññatti (6)",
            kammatthana_details: "Bhāvanā · Sīla · Upakkilesa",
            bhavana_3: "Tividhā Bhāvanā (3)",
            parisuddhisila_4: "Catupārisuddhisīla (4)",
            upakkilesa_10: "Dasa Vipassanupakkilesā (10)",
            paccavekkhana_aruppa: "Paccavekkhaṇā & Āruppa",
        };
        const hit = map[name];
        if (hit)
            return hit;
        const cleaned = name.replace(/_/g, " ");
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    stripPromptSpoilers(text) {
        const stripped = text
            .replace(/\s*\([^)]*(?:\d|→|−|Vatthuto|Cittas?|Rūpas?|Jhāna|Sabhāva|Real|Reais|Reales|Niyata|Aniyata|Akusala|Sobhana|Kāma|Rūpa|Arūpa|Ahetuka|Tihetuka|Dvihetuka|Upacāra|Appanā|Suttanta|Abhidhamma|Excl\.|Sem |Sin |No |Só |Solo |Only)[^)]*\)/gi, "")
            .replace(/\s*\[[^\]]*\d[^\]]*\]/g, "")
            .replace(/\s+—\s*(?:\d.*|Tríade.*|Triad.*|Tríada.*)/gi, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        return stripped.length >= 3 ? stripped : text;
    }
    formatNaryParamKey(key) {
        const map = {
            lens: ["Método (Naya)", "Method (Naya)", "Método (Naya)"],
            sphere: ["Esfera / Classe", "Sphere / Class", "Esfera / Clase"],
            cetasikas: ["Cetasikas (Saṅgaha)", "Cetasikas (Saṅgaha)", "Cetasikas (Saṅgaha)"],
            group: ["Grupo", "Group", "Grupo"],
            sub: ["Subfamília", "Subfamily", "Subfamilia"],
            slot: ["Posição", "Position", "Posición"],
            yogita: ["Regularidade (Yogitā)", "Regularity (Yogitā)", "Regularidad (Yogitā)"],
            sampayoga: ["Sampayoga", "Sampayoga", "Sampayoga"],
            lawGroup: ["Grupo de Leis", "Law Group", "Grupo de Leyes"],
            metric: ["Métrica Canônica", "Canonical Metric", "Métrica Canónica"],
            category: ["Categoria", "Category", "Categoría"],
            item: ["Fator", "Factor", "Factor"],
            count: ["Contagem", "Count", "Conteo"],
            door: ["Dvāra", "Dvāra", "Dvāra"],
            vara: ["Vāra", "Vāra", "Vāra"],
            vithicittas: ["Vīthicittas", "Vīthicittas", "Vīthicittas"],
            tetrad: ["Tétrade (Catukka)", "Tetrad (Catukka)", "Tétrada (Catukka)"],
            planeGroup: ["Grupo de Planos", "Plane Group", "Grupo de Planos"],
            lifespan: ["Longevidade (Āyu)", "Lifespan (Āyu)", "Longevidad (Āyu)"],
            kammaGroup: ["Eixo de Kamma", "Kamma Axis", "Eje de Kamma"],
            kpathGroup: ["Porta / Classe", "Door / Class", "Puerta / Clase"],
            root: ["Raiz / Pilar", "Root / Pillar", "Raíz / Pilar"],
            mGroup: ["Seção (Morte/Transição)", "Section (Death/Transition)", "Sección (Muerte/Transición)"],
            rule: ["Regra Canônica", "Canonical Rule", "Regla Canónica"],
            subtype: ["Subtipo", "Subtype", "Subtipo"],
            type: ["Natureza", "Nature", "Naturaleza"],
            heading: ["Rūpa / Classe", "Rūpa / Class", "Rūpa / Clase"],
            status: ["Estado", "Status", "Estado"],
            samutthana: ["Samuṭṭhāna", "Samuṭṭhāna", "Samuṭṭhāna"],
            dyad: ["Díade / Origem", "Dyad / Origin", "Díada / Origen"],
            origin: ["Origem do Kalāpa", "Kalāpa Origin", "Origen del Kalāpa"],
            size: ["Rūpas no Kalāpa", "Rūpas in Kalāpa", "Rūpas en Kalāpa"],
            topic: ["Tópico / Plano", "Topic / Plane", "Tema / Plano"],
            law: ["Lei Canônica", "Canonical Law", "Ley Canónica"],
            value: ["Valor Canônico", "Canonical Value", "Valor Canónico"],
            compendium: ["Saṅgaha", "Compendium", "Compendio"],
            vatthuto: ["Real (Vatthuto)", "Real (Vatthuto)", "Real (Vatthuto)"],
            bodhiMode: ["Eixo Bodhipakkhiya", "Bodhipakkhiya Axis", "Eje Bodhipakkhiya"],
            akSet: ["Conjunto Akusala", "Unwholesome Set", "Conjunto Akusala"],
            realDhamma: ["Dhamma Real (Vatthuto)", "Real Dhamma (Vatthuto)", "Dhamma Real (Vatthuto)"],
            miSet: ["Conjunto Missaka", "Mixed Set", "Conjunto Missaka"],
            realClass: ["Classe Real (Vatthuto)", "Real Class (Vatthuto)", "Clase Real (Vatthuto)"],
            bGroup: ["Grupo Bodhipakkhiya", "Bodhipakkhiya Group", "Grupo Bodhipakkhiya"],
            sabhava: ["Sabhāva-dhamma (14)", "Sabhāva-dhamma (14)", "Sabhāva-dhamma (14)"],
            sbSet: ["Conjunto Sabba", "Universal Set", "Conjunto Sabba"],
            paramatthaMap: ["Mapeamento Paramattha", "Paramattha Mapping", "Mapeo Paramattha"],
            method: ["Método", "Method", "Método"],
            psMode: ["Eixo Paṭiccasamuppāda", "Paṭiccasamuppāda Axis", "Eje Paṭiccasamuppāda"],
            addha: ["Período (Addhā)", "Time Period (Addhā)", "Período (Addhā)"],
            vatta: ["Roda (Vaṭṭa)", "Round (Vaṭṭa)", "Rueda (Vaṭṭa)"],
            direction: ["Matriz Direcional", "Directional Matrix", "Matriz Direccional"],
            panType: ["Tipo de Paññatti", "Paññatti Type", "Tipo de Paññatti"],
            arity: ["Aridade / Modos", "Arity / Modes", "Aridad / Modos"],
            subGroup: ["Subgrupo", "Subgroup", "Subgrupo"],
            modes: ["Modos / Índice", "Modes / Index", "Modos / Índice"],
            index: ["Índice", "Index", "Índice"],
            wing: ["Bhāvanā", "Bhāvanā Wing", "Bhāvanā"],
            reach: ["Alcance (Bhāvanā)", "Reach (Bhāvanā)", "Alcance (Bhāvanā)"],
            topicGroup: ["Subgrupo Samatha", "Samatha Subgroup", "Subgrupo Samatha"],
            vipGroup: ["Subgrupo Vipassanā", "Vipassanā Subgroup", "Subgrupo Vipassanā"],
            ariyaGroup: ["Subgrupo Ariya", "Ariya Subgroup", "Subgrupo Ariya"],
            prop: ["Propriedade Canônica", "Canonical Property", "Propiedad Canónica"],
            detGroup: ["Eixo Detalhado", "Detail Axis", "Eje Detallado"],
            role: ["Função / Escopo", "Role / Scope", "Función / Ámbito"],
            maxJhana: ["Jhāna máx.", "Max Jhāna", "Jhāna máx."],
            carita: ["Carita", "Carita", "Carita"],
            nimitta: ["Nimitta", "Nimitta", "Nimitta"],
            visuddhi: ["Visuddhi", "Visuddhi", "Visuddhi"],
            stage: ["Estágio (Visuddhi)", "Stage (Visuddhi)", "Etapa (Visuddhi)"],
            section: ["Seção", "Section", "Sección"],
        };
        const entry = map[key];
        return entry ? this.loc(entry[0], entry[1], entry[2]) : key;
    }
    formatNaryParamVal(key, val) {
        if (val === undefined || val === null)
            return "—";
        const s = String(val);
        const valMap = {
            sampayoga: "Sampayoga-naya (52)",
            sangaha: "Saṅgaha-naya (33)",
            lokuttara: "Lokuttara",
            somanassa: "Somanassa",
            domanassa: "Domanassa",
            sukha: "Sukha",
            dukkha: "Dukkha",
            upekkha: "Upekkhā",
            ahetuka: "Ahetuka",
            ekahetuka: "Ekahetuka",
            dvihetuka: "Dvihetuka",
            tihetuka: "Tihetuka",
            hetu_lobha: "Lobha-hetu",
            hetu_dosa: "Dosa-hetu",
            hetu_moha: "Moha-hetu",
            hetu_alobha: "Alobha-hetu",
            hetu_adosa: "Adosa-hetu",
            hetu_amoha: "Amoha-hetu",
            patisandhi: "Paṭisandhi",
            bhavanga: "Bhavaṅga",
            avajjana: "Āvajjana",
            dassana: "Dassana",
            savana: "Savana",
            ghayana: "Ghāyana",
            sayana: "Sāyana",
            phusana: "Phusana",
            sampaticchana: "Sampaṭicchana",
            santirana: "Santīraṇa",
            javana: "Javana",
            tadarammana: "Tadārammaṇa",
            cuti: "Cuti",
            ekakicca: "Ekakicca (1)",
            dukicca: "Dukicca (2)",
            tikicca: "Tikicca (3)",
            catukicca: "Catukicca (4)",
            pancakicca: "Pañcakicca (5)",
            dvaravimutta: "Dvāravimutta",
            ekadvarika: "Ekadvārika (1)",
            pancadvarika_3: "Pañcadvārika (5)",
            chadvarika: "Chadvārika (6)",
            chadvarika_vimutta: "Chadvārika-dvāravimutta",
            sabbatha_vimutta: "Sabbathā Dvāravimutta",
            paritta: "Parittārammaṇa",
            mahaggata: "Mahaggatārammaṇa",
            pannatti: "Paññattārammaṇa",
            nibbana_obj: "Nibbānārammaṇa",
            lokuttara_vajjita: "Lokuttaravajjita",
            arahatta_vajjita: "Arahattamaggaphalavajjita",
            sabbarammana: "Sabbārammaṇa",
            dhammarammana_6: "Dhammārammaṇa (6)",
            nissaya: "Nissāya",
            nissaya_anissaya: "Nissāya vā Anissāya vā",
            anissita: "Anissita",
            vatthu_kamaloka: "Kāmaloka (6 Vatthu)",
            vatthu_rupaloka: "Rūpaloka (3 Vatthu)",
            vatthu_arupaloka: "Arūpaloka (0 Vatthu)",
            votthabbana: "Voṭṭhabbana",
            mogha: "Moghavāra",
            summary_54: "Pañcadvāra (7·14·54)",
            appana_som_kus: "Somanassa-kusala → Appanā",
            appana_upe_kus: "Upekkhā-kusala → Appanā",
            appana_som_kir: "Somanassa-kiriya → Appanā",
            appana_upe_kir: "Upekkhā-kiriya → Appanā",
            tad_quality: "Aniṭṭha / Iṭṭha / Ati-iṭṭha",
            agantuka_bhavanga: "Āgantuka-bhavaṅga",
            tad_3cond: "Kāma: Javana·Satta·Ālambaṇa",
            jav_normal: "Parittajavana (7/6)",
            jav_death: "Maraṇakāla (5)",
            jav_twin: "Yamakapāṭihāriya (4–5)",
            jav_single: "Ādikammika / Abhiññā / Magga (1)",
            jav_nirodha: "Nirodhasamāpatti (2)",
            jav_samapatti: "Samāpattivīthi (∞)",
            pug_asekkha: "Asekkha (44)",
            pug_sekkha: "Sekkha (56)",
            pug_puthujjana: "Puthujjana (54)",
            bhu_kama: "Kāmāvacarabhūmi (80)",
            bhu_rupa: "Rūpāvacarabhūmi (64)",
            bhu_arupa: "Arūpāvacarabhūmi (42)",
            bhu_asanna: "Asaññasattabhūmi (0)",
            apaya: "Apāyabhūmi",
            kamasugati: "Kāmasugatibhūmi",
            rupabhumi: "Rūpāvacarabhūmi",
            arupabhumi: "Arūpāvacarabhūmi",
            apaya_patisandhi: "Apāya-paṭisandhi",
            kamasugati_patisandhi: "Kāmasugati-paṭisandhi",
            rupa_patisandhi: "Rūpāvacara-paṭisandhi",
            arupa_patisandhi: "Arūpāvacara-paṭisandhi",
            kamma_kicca: "Kicca-catukka",
            kamma_pakadana: "Pākadānapariyāya",
            kamma_pakakala: "Pākakāla",
            kamma_pakathana: "Pākaṭhāna",
            pakadana: "Pākadānapariyāya",
            pakakala: "Pākakāla",
            pakathana: "Pākaṭhāna",
            ripening: "Vipāka-niyama",
            ayukkhaya: "Āyukkhaya",
            kammakkhaya: "Kammakkhaya",
            ubhayakkhaya: "Ubhayakkhaya",
            upacchedaka: "Upacchedakakamma",
            unfixed: ["Sem limite fixo", "Unfixed", "Sin límite fijo"],
            "9m": ["9 milhões", "9M yrs", "9 millones"],
            "36m": ["36 milhões", "36M yrs", "36 millones"],
            "144m": ["144 milhões", "144M yrs", "144 millones"],
            "576m": ["576 milhões", "576M yrs", "576 millones"],
            "2304m": ["2.304 milhões", "2,304M yrs", "2.304 millones"],
            "9216m": ["9.216 milhões", "9,216M yrs", "9.216 millones"],
            k_1_3: "1/3 kappa",
            k_1_2: "1/2 kappa",
            k_1: "1 kappa",
            k_2: "2 kappas",
            k_4: "4 kappas",
            k_8: "8 kappas",
            k_16: "16 kappas",
            k_32: "32 kappas",
            k_64: "64 kappas",
            k_500: "500 kappas",
            k_1000: "1.000 kappas",
            k_2000: "2.000 kappas",
            k_4000: "4.000 kappas",
            k_8000: "8.000 kappas",
            k_16000: "16.000 kappas",
            k_20000: "20.000 kappas",
            k_40000: "40.000 kappas",
            k_60000: "60.000 kappas",
            k_84000: "84.000 kappas",
            pat_ara_kama: "Kāma-paṭisandhi Ārammaṇa",
            pat_ara_mah: "Mahaggata-paṭisandhi Ārammaṇa",
            pat_const3: "Tividhā Paṭisandhi",
            janaka: "Janaka",
            upatthambhaka: "Upatthambhaka",
            upapilaka: "Upapīḷaka",
            upaghataka: "Upaghātaka",
            garuka: "Garuka",
            asanna: "Āsanna",
            acinna: "Āciṇṇa",
            katatta: "Kaṭattā",
            ditthadhamma: "Diṭṭhadhammavedanīya",
            upapajja: "Upapajjavedanīya",
            aparapariya: "Aparāpariyavedanīya",
            ahosi: "Ahosi",
            place_akusala: "Akusala (12)",
            place_kama: "Kāmāvacara-kusala (8)",
            place_rupa: "Rūpāvacara-kusala (5)",
            place_arupa: "Arūpāvacara-kusala (4)",
            rip_akusala: "Akusala (7 Vipāka)",
            rip_ti_ukk: "Tihetuka-ukkaṭṭha (16)",
            rip_dvi_12: "Tihetuka-omaka / Dvihetuka-ukkaṭṭha (12)",
            rip_ahe_8: "Dvihetuka-omaka (8)",
            two_roots: ["2 Raízes (Lobha/Dosa)", "2 Roots (Lobha/Dosa)", "2 Raíces (Lobha/Dosa)"],
            dana: "Dāna",
            sila: "Sīla",
            bhavana: "Bhāvanā",
            sign_kamma: "Kamma",
            sign_kammanimitta: "Kammanimitta",
            sign_gatinimitta: "Gatinimitta",
            cuti_arupa: "Arūpa-cuti",
            cuti_rupa: "Rūpa-cuti",
            cuti_kama3: "Kāma-tihetuka-cuti",
            cuti_kama_other: "Itara-kāma-cuti",
            pathavi: "Pathavī-dhātu",
            apo: "Āpo-dhātu",
            tejo: "Tejo-dhātu",
            vayo: "Vāyo-dhātu",
            gocara_avin: "Gocara (Vaṇṇa/Gandha/Rasa)",
            sadda: "Sadda",
            nipphanna: "Nipphanna",
            anipphanna: "Anipphanna",
            santi: "Santilakkhaṇa",
            asankhata: "Asaṅkhata",
            catusamutthana: "Catusamuṭṭhāna (4)",
            kammaja: "Kammaja",
            cittaja: "Cittaja",
            cittotuja: "Cittotuja (Citta + Utu)",
            utucittahara: "Utu + Citta + Āhāra",
            none_lakkhana: ["Sem origem (Lakkhaṇa)", "No origin (Lakkhaṇa)", "Sin origen (Lakkhaṇa)"],
            ajjhattika: "Ajjhattika (5) / Bāhira (23)",
            vatthu_r: "Vatthu (6) / Avatthu (22)",
            dvara_r: "Dvāra (7) / Advāra (21)",
            indriya_r: "Indriya (8) / Anindriya (20)",
            olarika: "Oḷārika (12) / Sukhuma (16)",
            upadinna: "Upādinna (18) / Anupādinna (10)",
            sanidassana: "Sanidassana (1) / Anidassana (27)",
            gocaraggahika: "Gocaraggāhika (5) / Agocaraggāhika (23)",
            avinibbhoga: "Avinibbhoga (8) / Vinibbhoga (20)",
            nipphanna_d: "Nipphanna (18) / Anipphanna (10)",
            sam_kamma: "Kammasamuṭṭhāna (18)",
            sam_citta: "Cittasamuṭṭhāna (15)",
            sam_utu: "Utusamuṭṭhāna (13)",
            sam_ahara: "Āhārasamuṭṭhāna (12)",
            utu: "Utu",
            pav_kama: "Kāmaloka (28)",
            pav_rupa: "Rūpaloka (23)",
            pav_asanna: "Asaññasatta (17)",
            pav_arupa: "Arūpaloka (0)",
            pav_start4: "Catusamuṭṭhāna-santati (4)",
            pav_death17: "Maraṇakāla (17)",
            pav_absent4: "Upapattiyaṃ Alabbhamāna (4)",
            nib_one: "Ekavidha Sabhāvato (1)",
            nib_two: "Sa-upādisesa / Anupādisesa (2)",
            nib_three: "Suññata / Animitta / Appaṇihita (3)",
            asava: "Āsava",
            ogha: "Ogha",
            yoga: "Yoga",
            gantha: "Gantha",
            upadana: "Upādāna",
            nivarana: "Nīvaraṇa",
            anusaya: "Anusaya",
            samyojana: "Saṃyojana",
            samyojana_sutta: "Saṃyojana (Suttanta)",
            samyojana_abhi: "Saṃyojana (Abhidhamma)",
            kilesa: "Kilesa",
            hetu6: "6 Hetu",
            jhananga: "Jhānaṅga",
            magganga12: "12 Maggaṅga",
            indriya22: "22 Indriya",
            bala9: "9 Bala",
            adhipati4: "4 Adhipati",
            ahara4: "4 Āhāra",
            missaka_laws: "Missaka-niyama (5)",
            groups: ["7 Grupos (37 Fatores)", "7 Groups (37 Factors)", "7 Grupos (37 Factores)"],
            sabhava14: ["14 Sabhāva-dhammas (Ṭhāna)", "14 Sabhāva-dhammas (Ṭhāna)", "14 Sabhāva-dhammas (Ṭhāna)"],
            satipatthana: "Satipaṭṭhāna",
            sammappadhana: "Sammappadhāna",
            iddhipada: "Iddhipāda",
            indriya5: "5 Indriya",
            bala5: "5 Bala",
            bojjhanga: "Bojjhaṅga",
            magganga: "8 Maggaṅga",
            sb_viriya: "Vīriya (9 Ṭhāna)",
            sb_sati: "Sati (8 Ṭhāna)",
            sb_panna: "Paññā (5 Ṭhāna)",
            sb_samadhi: "Samādhi (4 Ṭhāna)",
            sb_saddha: "Saddhā (2 Ṭhāna)",
            sb_sankappa: "Sammāsaṅkappa (1)",
            sb_passaddhi: "Passaddhi (1)",
            sb_piti: "Pīti (1)",
            sb_upekkha: "Upekkhā / Tatramajjhattatā (1)",
            sb_chanda: "Chanda (1)",
            sb_citta: "Citta (1)",
            sb_vaca: "Sammāvācā (1)",
            sb_kammanta: "Sammākammanta (1)",
            sb_ajiva: "Sammā-ājīva (1)",
            khandha: "5 Khandha",
            upadanakkhandha: "5 Upādānakkhandha",
            ayatana: "12 Āyatana",
            dhatu: "18 Dhātu",
            ariyasacca: "4 Ariyasacca",
            dhammayatana_69: "Dhammāyatana / Dhātu (69)",
            sacca_excl: "Catusacca-vinissaṭa (29)",
            anga12: "12 Aṅga",
            vatta3: "3 Vaṭṭa",
            akara20: "20 Ākāra",
            links12: ["12 Elos Individuais", "12 Individual Links", "12 Eslabones Individuales"],
            analysis6: ["6 Análises Estruturais", "6 Structural Analyses", "6 Análisis Estructurales"],
            atita: ["Atīta (Passado)", "Atīta (Past)", "Atīta (Pasado)"],
            paccuppanna: ["Paccuppanna (Presente)", "Paccuppanna (Present)", "Paccuppanna (Presente)"],
            anagata: ["Anāgata (Futuro)", "Anāgata (Future)", "Anāgata (Futuro)"],
            kilesavatta: "Kilesavaṭṭa",
            kammavatta: "Kammavaṭṭa",
            vipakavatta: "Vipākavaṭṭa",
            kamma_vipaka: "Kamma + Vipākavaṭṭa",
            addha_3: "3 Addhā (2+8+2)",
            akara_20: "20 Ākārā (5+5+5+5)",
            sandhi_3: "3 Sandhi",
            sankhepa_4: "4 Saṅkhepa",
            vatta_3: "3 Vaṭṭāni",
            mula_2: "2 Mūlāni (Avijjā & Taṇhā)",
            nama_nama: "Nāma → Nāma (6)",
            nama_namarupa: "Nāma → Nāmarūpa (5)",
            rupa_nama: "Rūpa → Nāma (1)",
            pannatti_nama: "Paññatti/Nāmarūpa → Nāma (2)",
            namarupa_namarupa: "Nāmarūpa → Nāmarūpa (9)",
            atthapannatti: "Atthapaññatti (6)",
            namapannatti: "Nāmapaññatti (6)",
            v_only: "Vijjamānapaññatti",
            a_only: "Avijjamānapaññatti",
            v_to_a: "Vijjamānena Avijjamāna",
            a_to_v: "Avijjamānena Vijjamāna",
            v_to_v: "Vijjamānena Vijjamāna",
            a_to_a: "Avijjamānena Avijjamāna",
            sahajata: "Sahajāta",
            anantara: "Anantara",
            nissaya_pac: "Nissaya",
            purejata: "Purejāta",
            atthi: "Atthi",
            all: ["Todos (Sabba)", "All (Sabba)", "Todos (Sabba)"],
            raga: "Rāgacarita",
            dosa: "Dosacarita",
            moha_vitakka: "Moha / Vitakkacarita",
            saddha: "Saddhācarita",
            buddhi: "Buddhicarita",
            nama_rupa: "Nāmarūpapariccheda",
            paccaya: "Paccayapariggaha",
            maggamagga: "Maggāmagga (10 Upakkilesa)",
            udayabbaya: "Udayabbayañāṇa",
            sankharupekkha: "Saṅkhārupekkhāñāṇa",
            magga: "Catumagga",
            nirodha: "Nirodhasamāpatti",
            upacara: "Upacāra-samādhi",
            jhana_1: "Paṭhamajjhāna (1)",
            jhana_4: "Catukkajjhāna (1–4)",
            jhana_5_only: "Pañcamajjhāna (5)",
            jhana_5: "Pañcakajjhāna (1–5)",
            aruppa_4: "Āruppajjhāna (4)",
            laws: ["Leis do Cap. 2 (12)", "Ch. 2 Laws (12)", "Leyes del Cap. 2 (12)"],
            niyata: ["Niyata (Fixo · 41)", "Niyata (Fixed · 41)", "Niyata (Fijo · 41)"],
            aniyata_nana: ["Aniyata Separado (9)", "Aniyata Separate (9)", "Aniyata Separado (9)"],
            aniyata_saha: ["Aniyata Conjunto (2)", "Aniyata Paired (2)", "Aniyata Conjunto (2)"],
            triad_sukha: "Sukhavedanā (Tríade)",
            triad_dukkha: "Dukkhavedanā (Tríade)",
            triad_adukkhamasukha: "Adukkhamasukhā-vedanā",
            thana_10: "Dasa Ṭhānāni (10)",
            per_sense_46: ["46 por Porta Sensorial", "46 per Sense-Door", "46 por Puerta Sensorial"],
            dh_pasada: "Pasādarūpa (5)",
            dh_sukhuma: "Sukhumarūpa (16)",
            dh_citta: "Citta (89)",
            dh_cetasika: "Cetasika (52)",
            dh_nibbana: "Nibbāna (1)",
            dh_pannatti: "Paññatti (0)",
            time_5doors: ["5 Portas (Só Presente)", "5 Doors (Present Only)", "5 Puertas (Solo Presente)"],
            time_mind: ["Porta Mental (4 Modos)", "Mind-Door (4 Modes)", "Puerta Mental (4 Modos)"],
            time_vimutta: ["Livres de Porta (3 Signos)", "Door-Free (3 Signs)", "Libres de Puerta (3 Signos)"],
            dhatu_kama: "Kāmaloka (7 Dhātus)",
            dhatu_rupa: "Rūpaloka (4 Dhātus)",
            dhatu_arupa: "Arūpaloka (1 Dhātu)",
            ch_vatthu: "Vatthuchakka (6)",
            ch_dvara: "Dvārachakka (6)",
            ch_arammana: "Ārammaṇachakka (6)",
            ch_vinnana: "Viññāṇachakka (6)",
            ch_vithi: "Vīthichakka (6)",
            ch_visaya: "Visayappavattichakka (6)",
            gotrabhu_vodana: "Gotrabhū / Vodāna",
            magga_phala_ratio: "1 Magga → 2/3 Phala",
            pug_ahetuka: "Ahetuka-puggala",
            pug_dvihetuka: "Dvihetuka-puggala",
            pug_sotapanna: "Sotāpanna / Sakadāgāmī",
            pug_anagami: "Anāgāmī-puggala",
            excl_kama: "Kāmaloka-vajjita",
            excl_rupa: "Rūpaloka-vajjita",
            excl_arupa: "Arūpaloka-vajjita",
            ariya_plane_rules: "Suddhāvāsa / Apāya / Asañña",
            pat_bha_cuti_unity: "Paṭisandhi = Bhavaṅga = Cuti",
            kecana_12_10_8: "Kecana-vāda (12/10/8)",
            jhana_degrees_9: "Paritta·Majjhima·Paṇīta (9)",
            jhana5_vehapphala: "Pañcamajjhāna → Vehapphala",
            sannaviraga_asanna: "Saññāvirāga → Asaññasatta",
            anagami_suddhavasa: "Anāgāmī → 5 Suddhāvāsā",
            wick_ends: ["Pavio acaba (Āyu)", "Wick expires (Āyu)", "Mecha agotada (Āyu)"],
            oil_ends: ["Óleo acaba (Kamma)", "Oil expires (Kamma)", "Aceite agotado (Kamma)"],
            both_end: ["Pavio e Óleo acabam", "Wick & Oil expire", "Mecha y Aceite agotados"],
            wind_gust: ["Rajada de vento (Corte)", "Gust of wind (Cutoff)", "Ráfaga de viento (Corte)"],
            past_mind_only: ["Passado · Só Porta Mental", "Past · Mind-Door Only", "Pasado · Solo Puerta Mental"],
            six_doors_any: ["6 Portas · Qualquer Tempo", "6 Doors · Any Time", "6 Puertas · Cualquier Tiempo"],
            present_kama_only: ["Presente · Só Kāmaloka", "Present · Kāmaloka Only", "Presente · Solo Kāmaloka"],
            dest_arupa_kama3: ["Arūpa Sup./Igual ou Kāma 3r", "Same/Higher Arūpa or 3-Root Kāma", "Arūpa Igual/Sup. o Kāma 3r"],
            dest_no_ahetuka: ["Qualquer exceto Ahetuka", "Any except Rootless", "Cualquiera excepto Ahetuka"],
            dest_all_4: ["Todos os 4 Planos", "All 4 Planes", "Los 4 Planos"],
            dest_kama_only: ["Somente Kāmaloka", "Kāmaloka Only", "Solo Kāmaloka"],
            univ_8: ["8 Atributos Universais", "8 Universal Attributes", "8 Atributos Universales"],
            syn_5: ["5 Sinônimos Nipphanna", "5 Nipphanna Synonyms", "5 Sinónimos Nipphanna"],
            kamma_25: "25 Kammaja-cetanā",
            citta_75: "75 Cittaja-cittas",
            vinnatti_32: "32 Viññatti-cittas",
            hasana_13: "13 Hasana-cittas",
            iriyapatha_26: "26 Appanā-iriyāpatha",
            birth_4: ["4 Modos de Nascimento", "4 Birth Modes", "4 Modos de Nacimiento"],
            ext_kalapa_2: ["2 Kalāpas Externos", "2 External Kalāpas", "2 Kalāpas Externos"],
            nib_epithets_4: ["4 Epítetos de Nibbāna", "4 Nibbāna Epithets", "4 Epítetos de Nibbāna"],
            jati_2: "Jāti = Upacaya + Santati",
            ditthi: "Diṭṭhi",
            mana: "Māna",
            uddhacca: "Uddhacca",
            uddhacca_kukkucca: "Uddhacca + Kukkucca (2)",
            issa: "Issā",
            macchariya: "Macchariya",
            ahirika: "Ahirika",
            anottappa: "Anottappa",
            pasada_5: "5 Pasādarūpa",
            bhava_2: "2 Bhāvarūpa",
            jivita_2: "Jīvita (Rūpa + Nāma = 2)",
            citta_1: "Citta (1)",
            sobhana_5: "5 Indriya (Saddhā..Paññā)",
            lokuttara_panna_3: "3 Lokuttara → Paññā",
            vitakka: "Vitakka",
            virati_3: "3 Virati",
            viriya: "Vīriya",
            sati: "Sati",
            ekaggata: "Ekaggatā",
            hiri_ottappa: "Hiri / Ottappa (Sobhana)",
            ahirika_anottappa: "Ahirika / Anottappa (Akusala)",
            chanda: "Chanda",
            oja_rupa: "Ojā (Rūpa)",
            phassa: "Phassa",
            cetana: "Cetanā",
            no_jhananga_10: "10 Sentidos → 0 Jhānaṅga",
            no_bala_16: "16 Avīriya → 0 Bala",
            no_magga_18: "18 Ahetuka → 0 Maggaṅga",
            doubt_ekaggata: "#11 Vicikicchā (Ekaggatā)",
            one_adhipati: "1 Adhipati / 52 Javana",
            citta: "Citta",
            samadhi: "Samādhi (Ekaggatā)",
            piti: "Pīti",
            passaddhi: "Passaddhi",
            sammavaca: "Sammāvācā",
            sammakammanta: "Sammākammanta",
            samma_ajiva: "Sammā-ājīva",
            vedana_1: "Vedanā (1)",
            sanna_1: "Saññā (1)",
            sankhara_50: "Saṅkhāra (50)",
            citta_89: "Citta (89 / 121)",
            pasada_1: "Pasādarūpa (1)",
            gocara_1: "Gocararūpa (1)",
            bhuta_3: "3 Mahābhūta (Pathavī·Tejo·Vāyo)",
            dhamma_69: "69 (52+16+1)",
            sense_pair_2: "Par Sensorial (2)",
            manodhatu_3: "Manodhātu (3)",
            manovinnana_76: "Manoviññāṇadhātu (76)",
            tebhumaka_excl_lobha: "81 Citta + 51 Cet + 28 Rūpa",
            lobha_tanha: "Lobha / Taṇhā (1)",
            nibbana_1: "Nibbāna (1)",
            magga_factors_8: "8 Maggaṅga (4 Magga)",
            sub_upanissaya: "Upanissaya (3)",
            sub_adhipati: "Adhipati (2)",
            sub_kamma: "Kamma (2)",
            sub_sahajata: "Sahajāta (3)",
            sub_annamanna: "Aññamañña (3)",
            sub_nissaya: "Nissaya (3)",
            sub_ahara: "Āhāra (2)",
            sub_indriya: "Indriya (3)",
            sub_vippayutta: "Vippayutta (3)",
            sub_atthi5: "Atthi / Avigata (5)",
            sub_sahajatarupa2: "Sahajāta-rūpa (2)",
            sub_nama5: "Pañcavidha Nāma (5)",
            att_bhumi: "Bhūmi / Pabbata",
            att_geha: "Geha / Ratha",
            att_purisa: "Purisa / Puggala",
            att_disa: "Disā / Kāla",
            att_kupa: "Kūpa / Guhā",
            att_kasina: "Kasiṇa-nimitta",
            sappaya_11: ["11 (10 Asubha + Kāyagatā)", "11 (10 Asubha + Kāyagatā)", "11 (10 Asubha + Kāyagatā)"],
            sappaya_8: ["8 (4 Brahmavihāra + 4 Cor)", "8 (4 Brahmavihāra + 4 Color)", "8 (4 Brahmavihāra + 4 Color)"],
            sappaya_anapana_large: ["Ānāpāna · Kasiṇa Grande", "Ānāpāna · Large Kasiṇa", "Ānāpāna · Kasiṇa Grande"],
            sappaya_6: ["6 Primeiras Anussatis", "First 6 Anussatis", "Primeras 6 Anussatis"],
            sappaya_4: ["4 (Maraṇa·Upasama·Āhāra·Dhātu)", "4 (Maraṇa·Upasama·Āhāra·Dhātu)", "4 (Maraṇa·Upasama·Āhāra·Dhātu)"],
            sappaya_anapana_small: ["Ānāpāna · Kasiṇa Pequeno", "Ānāpāna · Small Kasiṇa", "Ānāpāna · Kasiṇa Pequeño"],
            v5_maggamagga: "Visuddhi #5 (Maggāmagga)",
            v5_v6_bridge: ["Ponte Visuddhi #5 → #6", "Visuddhi #5 → #6 Bridge", "Puente Visuddhi #5 → #6"],
            v6_patipada: "Visuddhi #6 (Paṭipadā)",
            v6_vutthanagamini: "Visuddhi #6 (Vuṭṭhānagāminī)",
            cut_ditthi_vicikiccha: ["Corta Diṭṭhi + Vicikicchā", "Cuts Diṭṭhi + Vicikicchā", "Corta Diṭṭhi + Vicikicchā"],
            attenuate_3: ["Atenua Rāga·Dosa·Moha", "Attenuates Rāga·Dosa·Moha", "Atenúa Rāga·Dosa·Moha"],
            cut_kamaraga_byapada: ["Corta Kāmarāga + Byāpāda", "Cuts Kāmarāga + Byāpāda", "Corta Kāmarāga + Byāpāda"],
            cut_all_remaining: ["Corta Todas as Impurezas", "Cuts All Remaining Defilements", "Corta Todas las Impurezas"],
            access_4_ariyas: ["Todos os 4 Ariyas", "All 4 Noble Ones", "Los 4 Ariyas"],
            access_anagami_arahant: ["Só Anāgāmī & Arahant (8 Jhānas)", "Anāgāmī & Arahant Only (8 Jhānas)", "Solo Anāgāmī y Arahant (8 Jhānas)"],
            all_40: ["Todos os 40 Objetos", "All 40 Subjects", "Los 40 Objetos"],
            upacara_10: ["10 Só Upacāra", "10 Upacāra Only", "10 Solo Upacāra"],
            appana_30: ["30 Alcançam Appanā", "30 Reach Appanā", "30 Alcanzan Appanā"],
            patibhaga_22: ["22 Geram Paṭibhāga", "22 Yield Paṭibhāga", "22 Generan Paṭibhāga"],
            sila_visuddhi: "Sīla-visuddhi (#1)",
            upakkilesa_v5: "Visuddhi #5 (Upakkilesa)",
            upakkilesa_akusala: ["Visuddhi #5 (Único Akusala)", "Visuddhi #5 (Sole Unwholesome)", "Visuddhi #5 (Único Akusala)"],
            review_mandatory: ["Obrigatórias (3)", "Mandatory (3)", "Obligatorias (3)"],
            review_optional_19: ["Opcionais (2 · Total 19)", "Optional (2 · Total 19)", "Opcionales (2 · Total 19)"],
            aruppa_9_kasinas: ["9 Kasiṇas (Sem Ākāsa)", "9 Kasiṇas (Excl. Space)", "9 Kasiṇas (Sin Ākāsa)"],
        };
        if (key === "maxJhana" && s === "0") {
            return "Upacāra-samādhi";
        }
        if (key === "sphere" && s === "mahaggata") {
            return "Mahaggata";
        }
        if (key === "sub" && s === "dosa") {
            return "Dosa-catukka";
        }
        if (key === "root" && s === "dosa") {
            return "Dosa-mūla";
        }
        if (key === "root" && s === "lobha") {
            return "Lobha-mūla";
        }
        if ((key === "realDhamma" || key === "realClass" || key === "sabhava") && s === "dosa") {
            return "Dosa";
        }
        if ((key === "realDhamma" || key === "realClass" || key === "sabhava") && s === "lobha") {
            return "Lobha";
        }
        if ((key === "realDhamma" || key === "realClass" || key === "sabhava") && s === "moha") {
            return "Moha";
        }
        if ((key === "realDhamma" || key === "realClass" || key === "sabhava") && s === "thina") {
            return "Thīna";
        }
        if ((key === "realDhamma" || key === "realClass" || key === "sabhava") && s === "panna") {
            return "Paññā";
        }
        if (key === "sabhava" && s === "saddha") {
            return "Saddhā";
        }
        if (key === "carita" && s === "saddha") {
            return "Saddhācarita";
        }
        if (key === "kammaGroup" && s === "kicca") {
            return "Kicca-catukka";
        }
        if (key === "origin" && s === "ahara") {
            return "Āhāra";
        }
        if (key === "direction" && s === "nama_rupa") {
            return "Nāma → Rūpa (1)";
        }
        const mapped = valMap[s];
        if (mapped) {
            return Array.isArray(mapped) ? this.loc(mapped[0], mapped[1], mapped[2]) : mapped;
        }
        return this.formatCanonicalGroupName(s);
    }
    normalizeNarySwitches(chapter, prev, key, val) {
        const next = { ...prev, [key]: val };
        if (chapter === 2) {
            if (key === "lens") {
                if (val === "sangaha") {
                    return { lens: "sangaha", sphere: "lokuttara", slot: 1, cetasikas: 36 };
                }
                if (val === "laws") {
                    return { lens: "laws", lawGroup: "sampayoga_marks4", slot: 1, metric: 4 };
                }
                return { lens: "sampayoga", group: "aññasamana", sub: "sabbacitta", slot: 1, yogita: "niyata", sampayoga: 121 };
            }
            const curLens = String(next.lens ?? "sampayoga");
            if (curLens === "laws") {
                if (key === "lawGroup") {
                    next.slot = 1;
                    next.metric = val === "sampayoga_marks4" ? 4 : val === "pakinnaka_excl6" ? 66 : 11;
                }
            }
            else if (curLens === "sangaha") {
                if (key === "sphere") {
                    const spDefaults = {
                        lokuttara: 36,
                        mahaggata: 35,
                        kamasobhana_kusala: 38,
                        kamasobhana_kiriya: 35,
                        kamasobhana_vipaka: 33,
                        akusala: 19,
                        ahetuka: 12,
                    };
                    next.slot = 1;
                    next.cetasikas = spDefaults[String(val)] ?? 36;
                }
            }
            else {
                if (key === "group") {
                    const subDefault = val === "aññasamana" ? "sabbacitta" : val === "akusala" ? "moha" : "sadharana";
                    next.sub = subDefault;
                    next.slot = 1;
                    next.yogita = "niyata";
                    next.sampayoga = val === "aññasamana" ? 121 : val === "akusala" ? 12 : 91;
                }
                else if (key === "sub") {
                    next.slot = 1;
                }
            }
        }
        else if (chapter === 3 && key === "category") {
            const defaults = {
                vedana: { item: "somanassa", count: 62 },
                hetu: { item: "ahetuka", count: 18 },
                kicca: { item: "patisandhi", count: 19 },
                dvara: { item: "pancadvara", count: 54 },
                arammana: { item: "paritta", count: 25 },
                vatthu: { item: "nissaya", count: 43 },
            };
            const d = defaults[String(val)];
            if (d) {
                next.item = d.item;
                next.count = d.count;
            }
        }
        else if (chapter === 4 && key === "door") {
            if (val === "chakka_6") {
                next.vara = "ch_vatthu";
                next.vithicittas = 6;
            }
            else if (val === "pancadvara") {
                next.vara = "tadarammana";
                next.vithicittas = 14;
            }
            else if (val === "manodvara") {
                next.vara = "tadarammana";
                next.vithicittas = 10;
            }
            else if (val === "niyama") {
                next.vara = "jav_normal";
                next.vithicittas = 7;
            }
            else {
                next.vara = "bhu_kama";
                next.vithicittas = 80;
            }
        }
        else if (chapter === 5) {
            if (key === "tetrad") {
                if (val === "bhumi_31")
                    return { tetrad: "bhumi_31", planeGroup: "apaya", slot: 1, lifespan: "unfixed" };
                if (val === "patisandhi")
                    return { tetrad: "patisandhi", subtype: "apaya_patisandhi", count: 1 };
                if (val === "kamma_16")
                    return { tetrad: "kamma_16", kammaGroup: "kicca", subtype: "janaka", count: 1 };
                if (val === "kammapatha_20")
                    return { tetrad: "kammapatha_20", kpathGroup: "akusala_kaya", slot: 1, root: "dosa" };
                return { tetrad: "marana_cuti", mGroup: "marana_4", subtype: "ayukkhaya", rule: "wick_ends" };
            }
            if (key === "planeGroup") {
                next.slot = 1;
                next.lifespan =
                    val === "apaya" || val === "kamasugati"
                        ? "unfixed"
                        : val === "rupa_j1_3"
                            ? "k_1_3"
                            : val === "rupa_j4"
                                ? "k_500"
                                : "k_20000";
            }
            else if (key === "kammaGroup") {
                const kgDef = {
                    kicca: { subtype: "janaka", count: 1 },
                    pakadana: { subtype: "garuka", count: 1 },
                    pakakala: { subtype: "ditthadhamma", count: 1 },
                    pakathana: { subtype: "place_akusala", count: 12 },
                    ripening: { subtype: "rip_akusala", count: 7 },
                };
                const d = kgDef[String(val)];
                if (d) {
                    next.subtype = d.subtype;
                    next.count = d.count;
                }
            }
            else if (key === "kpathGroup") {
                next.slot = 1;
                next.root = val === "punna_10" ? "dana" : val === "akusala_kaya" ? "dosa" : val === "akusala_vaci" ? "two_roots" : "lobha";
            }
            else if (key === "mGroup") {
                if (val === "marana_4") {
                    next.subtype = "ayukkhaya";
                    next.rule = "wick_ends";
                }
                else if (val === "nimitta_3") {
                    next.subtype = "sign_kamma";
                    next.rule = "past_mind_only";
                }
                else {
                    next.subtype = "cuti_arupa";
                    next.rule = "dest_arupa_kama3";
                }
            }
        }
        else if (chapter === 6) {
            if (key === "section") {
                if (val === "rupa_28")
                    return { section: "rupa_28", heading: "mahabhuta", slot: 1, samutthana: "catusamutthana" };
                if (val === "vibhaga_10")
                    return { section: "vibhaga_10", dyad: "ajjhattika", count: 5 };
                if (val === "kalapa_21")
                    return { section: "kalapa_21", origin: "kamma", slot: 1, size: 10 };
                if (val === "rupa_laws")
                    return { section: "rupa_laws", law: "univ_8", value: 8 };
                return { section: "pavatti_nibbana", topic: "pav_kama", value: 28 };
            }
            if (key === "heading") {
                next.slot = 1;
                const samDef = {
                    mahabhuta: "catusamutthana",
                    pasada: "kammaja",
                    gocara: "catusamutthana",
                    bhava: "kammaja",
                    hadaya: "kammaja",
                    jivita: "kammaja",
                    ahara: "catusamutthana",
                    pariccheda: "catusamutthana",
                    vinnatti: "cittaja",
                    vikara: "utucittahara",
                    lakkhana: "none_lakkhana",
                };
                next.samutthana = samDef[String(val)] ?? "catusamutthana";
            }
            else if (key === "origin") {
                next.slot = 1;
                next.size = val === "kamma" ? 10 : 8;
            }
        }
        else if (chapter === 7) {
            if (key === "compendium") {
                if (val === "akusala_9")
                    return { compendium: "akusala_9", group: "asava", vatthuto: 3 };
                if (val === "akusala_members")
                    return { compendium: "akusala_members", akSet: "asava_ogha_yoga", slot: 1, realDhamma: "lobha" };
                if (val === "missaka_7")
                    return { compendium: "missaka_7", group: "hetu6", vatthuto: 6 };
                if (val === "missaka_members")
                    return { compendium: "missaka_members", miSet: "indriya22", slot: 1, realClass: "pasada_5" };
                if (val === "bodhipakkhiya_21")
                    return { compendium: "bodhipakkhiya_21", bodhiMode: "groups", item: "satipatthana", count: 4 };
                if (val === "bodhi_37")
                    return { compendium: "bodhi_37", bGroup: "satipatthana", slot: 1, sabhava: "sati" };
                if (val === "sabba_members")
                    return { compendium: "sabba_members", sbSet: "khandha5", slot: 1, paramatthaMap: "rupa_28" };
                return { compendium: "sabba_7", group: "khandha", count: 5 };
            }
            if (key === "bodhiMode") {
                if (val === "sabhava14") {
                    next.item = "sb_viriya";
                    next.count = 9;
                }
                else {
                    next.item = "satipatthana";
                    next.count = 4;
                }
            }
            else if (key === "akSet") {
                next.slot = 1;
                next.realDhamma = val === "kilesa_extra" ? "thina" : "lobha";
            }
            else if (key === "miSet") {
                next.slot = 1;
                const miDef = {
                    indriya22: "pasada_5",
                    magganga12: "panna",
                    bala_extra: "hiri_ottappa",
                    adhipati4: "chanda",
                    ahara4: "oja_rupa",
                    excl_laws5: "no_jhananga_10",
                };
                next.realClass = miDef[String(val)] ?? "pasada_5";
            }
            else if (key === "bGroup") {
                next.slot = 1;
                const bDef = {
                    satipatthana: "sati",
                    sammappadhana: "viriya",
                    iddhipada: "chanda",
                    indriya5: "saddha",
                    bala5: "saddha",
                    bojjhanga: "sati",
                    magganga: "panna",
                };
                next.sabhava = bDef[String(val)] ?? "sati";
            }
            else if (key === "sbSet") {
                next.slot = 1;
                const sbDef = {
                    khandha5: "rupa_28",
                    ayatana12: "pasada_1",
                    vinnana_dhatu7: "sense_pair_2",
                    ariyasacca4: "tebhumaka_excl_lobha",
                };
                next.paramatthaMap = sbDef[String(val)] ?? "rupa_28";
            }
        }
        else if (chapter === 8) {
            if (key === "method") {
                if (val === "paticcasamuppada") {
                    return { method: "paticcasamuppada", psMode: "links12", slot: 1, addha: "atita", vatta: "kilesavatta" };
                }
                if (val === "patthana_24") {
                    return { method: "patthana_24", direction: "nama_nama", index: 4 };
                }
                if (val === "patthana_submodes") {
                    return { method: "patthana_submodes", subGroup: "paccaya_modes", topic: "sub_upanissaya", modes: 3 };
                }
                return { method: "pannatti_8", panType: "atthapannatti", arity: 6 };
            }
            if (key === "psMode") {
                if (val === "analysis6") {
                    return { method: "paticcasamuppada", psMode: "analysis6", topic: "addha_3", count: 3 };
                }
                return { method: "paticcasamuppada", psMode: "links12", slot: 1, addha: "atita", vatta: "kilesavatta" };
            }
            if (key === "subGroup") {
                if (val === "atthapannatti_6") {
                    next.topic = "att_bhumi";
                    next.modes = 1;
                }
                else {
                    next.topic = "sub_upanissaya";
                    next.modes = 3;
                }
            }
            if (key === "direction") {
                if (this.progress.level < 3 || val === "samodhana_4") {
                    const dirDef = {
                        nama_nama: 4,
                        nama_namarupa: 1,
                        nama_rupa: 11,
                        rupa_nama: 10,
                        pannatti_nama: 2,
                        namarupa_namarupa: 3,
                        samodhana_4: 2,
                    };
                    next.index = dirDef[String(val)] ?? 4;
                }
            }
        }
        else if (chapter === 9) {
            if (key === "wing") {
                if (val === "samatha_40") {
                    return { wing: "samatha_40", group: "kasina", slot: 1, reach: "jhana_5", nimitta: 3 };
                }
                if (val === "samatha_carita_abhinna") {
                    return { wing: "samatha_carita_abhinna", topicGroup: "carita_6", slot: 1, prop: "sappaya_11" };
                }
                if (val === "vipassana_visuddhi_nana") {
                    return { wing: "vipassana_visuddhi_nana", vipGroup: "visuddhi_7", slot: 1 };
                }
                if (val === "kammatthana_details") {
                    return { wing: "kammatthana_details", detGroup: "bhavana_3", slot: 1, role: "all_40" };
                }
                return { wing: "ariya_samapatti", ariyaGroup: "puggala_4", slot: 1, prop: "cut_ditthi_vicikiccha" };
            }
            if (key === "group") {
                next.slot = 1;
                const grpDef = {
                    kasina: { reach: "jhana_5", nimitta: 3 },
                    asubha: { reach: "jhana_1", nimitta: 3 },
                    anussati: { reach: "upacara", nimitta: 2 },
                    brahmavihara: { reach: "jhana_4", nimitta: 2 },
                    sanna_vavatthana: { reach: "upacara", nimitta: 2 },
                    aruppa: { reach: "aruppa_4", nimitta: 2 },
                };
                const d = grpDef[String(val)];
                if (d) {
                    next.reach = d.reach;
                    next.nimitta = d.nimitta;
                }
            }
            else if (key === "topicGroup") {
                next.slot = 1;
                if (val === "carita_6") {
                    next.prop = "sappaya_11";
                }
                else {
                    delete next.prop;
                }
            }
            else if (key === "vipGroup") {
                next.slot = 1;
                if (val === "nana_10") {
                    next.stage = "v5_maggamagga";
                }
                else {
                    delete next.stage;
                }
            }
            else if (key === "ariyaGroup") {
                next.slot = 1;
                next.prop = val === "puggala_4" ? "cut_ditthi_vicikiccha" : "access_4_ariyas";
            }
            else if (key === "detGroup") {
                next.slot = 1;
                const detDef = {
                    bhavana_3: "all_40",
                    nimitta_3: "all_40",
                    parisuddhisila_4: "sila_visuddhi",
                    upakkilesa_10: "upakkilesa_v5",
                    paccavekkhana_aruppa: "review_mandatory",
                };
                next.role = detDef[String(val)] ?? "all_40";
            }
        }
        return next;
    }
    formatPercent(percent) {
        const rounded = Math.round(percent * 10) / 10;
        if (Number.isInteger(rounded))
            return `${rounded}%`;
        const str = rounded.toFixed(1);
        return this.lang === "en" ? `${str}%` : `${str.replace(".", ",")}%`;
    }
    renderProgressMeter(idSuffix, roleKey, label, metric, extraMeta, compact = false) {
        const lblId = `mnem-prog-${this.uid}-${idSuffix}`;
        const isComplete = metric.total > 0 && metric.mastered >= metric.total;
        const pctText = this.formatPercent(metric.percent);
        return `
      <div class="mnem-progress-meter ${compact ? "compact" : ""} ${isComplete ? "is-complete" : ""}" data-progress-role="${esc(roleKey)}">
        <div class="mnem-progress-head">
          <span class="mnem-progress-lbl" id="${esc(lblId)}">${esc(label)}</span>
          <span class="mnem-progress-vals">
            <strong class="mnem-progress-pct">${esc(pctText)}</strong>
            <span class="mnem-progress-frac">(${metric.mastered}/${metric.total})</span>
            ${extraMeta ? `<span class="mnem-progress-meta">· ${esc(extraMeta)}</span>` : ""}
          </span>
        </div>
        <progress class="mnem-progress-bar ${isComplete ? "is-complete" : ""}" max="${Math.max(1, metric.total)}" value="${metric.mastered}" aria-labelledby="${esc(lblId)}"></progress>
      </div>
    `;
    }
    render() {
        const s = LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt;
        const acc = this.progress.totalAttempts > 0
            ? Math.round((this.progress.totalCorrect / this.progress.totalAttempts) * 100)
            : 100;
        const summary = computeMnemonicProgressSummary(this.progress, this.binEnumMode);
        this.container.innerHTML = `
      <div class="mnem-lab-root">
        <header class="mnem-header">
          <div class="mnem-title-block">
            <h2 class="mnem-title">${esc(s.title)}</h2>
            <p class="mnem-subtitle">${esc(s.subtitle)}</p>
            <p class="mnem-aid-disclaimer"><strong>ℹ️ ${esc(s.memoryAidNotice)}</strong></p>
          </div>
          <div class="mnem-stats-row">
            <div class="mnem-stat-pill" title="${esc(s.bestStreak)}: ${this.progress.bestStreak}">
              <span class="mnem-stat-lbl">🔥 ${esc(s.streak)}</span>
              <strong class="mnem-stat-val">${this.progress.streak}</strong>
            </div>
            <div class="mnem-stat-pill" title="${esc(s.naryChallengesMastered(summary.overall.mastered, summary.overall.total))}">
              <span class="mnem-stat-lbl">⭐ ${esc(s.mastered)}</span>
              <strong class="mnem-stat-val">${summary.overall.mastered}/${summary.overall.total}</strong>
            </div>
            <div class="mnem-stat-pill">
              <span class="mnem-stat-lbl">🎯 ${esc(s.accuracy)}</span>
              <strong class="mnem-stat-val">${acc}%</strong>
            </div>
            <div class="mnem-stat-pill" title="${esc(s.vaultPillTitle)}">
              <span class="mnem-stat-lbl">🔒 ${esc(s.vaultPillLabel)}</span>
              <strong class="mnem-stat-val">${this.progress.totalAttempts}</strong>
            </div>
            <div class="mnem-vault-actions">
              <button type="button" class="mnem-vault-btn" id="mnem-vault-export" title="${esc(s.exportVaultTitle)}">
                💾 ${esc(s.exportVaultBtn)}
              </button>
              <button type="button" class="mnem-vault-btn" id="mnem-vault-import" title="${esc(s.importVaultTitle)}">
                📂 ${esc(s.importVaultBtn)}
              </button>
              <input type="file" id="mnem-vault-file-input" accept=".json" style="display:none;" />
            </div>
            <div class="mnem-level-ctrl">
              <label for="mnem-rigor-select" class="mnem-level-lbl">${esc(s.rigorLevel)}</label>
              <select id="mnem-rigor-select" class="mnem-level-select">
                <option value="1" ${this.progress.level === 1 ? "selected" : ""}>${esc(s.lvl1)}</option>
                <option value="2" ${this.progress.level === 2 ? "selected" : ""}>${esc(s.lvl2)}</option>
                <option value="3" ${this.progress.level === 3 ? "selected" : ""}>${esc(s.lvl3)}</option>
              </select>
            </div>
          </div>
          <div class="mnem-global-progress-strip">
            ${this.renderProgressMeter("global-lab", "global-lab", `📊 ${s.globalProgressLabel}`, summary.overall, s.naryChallengesMastered(summary.overall.mastered, summary.overall.total))}
            <div class="mnem-pillar-progress-chips">
              <span class="mnem-pillar-prog-chip ${summary.naryGlobal.percent >= 100 ? "is-complete" : ""}">
                ⚡ ${esc(s.pillarShortNary)}: <strong>${esc(this.formatPercent(summary.naryGlobal.percent))}</strong> (${summary.naryGlobal.mastered}/${summary.naryGlobal.total})
              </span>
              <span class="mnem-pillar-prog-chip ${summary.periodic.percent >= 100 ? "is-complete" : ""}">
                🧪 ${esc(s.pillarShortAlchemy)}: <strong>${esc(this.formatPercent(summary.periodic.percent))}</strong> (${summary.periodic.mastered}/${summary.periodic.total})
              </span>
              <span class="mnem-pillar-prog-chip ${summary.phalanx.percent >= 100 ? "is-complete" : ""}">
                🖐 ${esc(s.pillarShortPhalanx)}: <strong>${esc(this.formatPercent(summary.phalanx.percent))}</strong> (${summary.phalanx.mastered}/${summary.phalanx.total})
              </span>
            </div>
          </div>
        </header>

        <div class="mnem-pillar-tabs" role="tablist" aria-label="${esc(s.title)}">
          <button type="button" role="tab" id="mnem-tab-binary" class="mnem-pillar-tab" data-pillar="binary" aria-selected="${this.activePillar === "binary"}">
            ${esc(s.tabBinary)}
          </button>
          <button type="button" role="tab" id="mnem-tab-periodic" class="mnem-pillar-tab" data-pillar="periodic" aria-selected="${this.activePillar === "periodic"}">
            ${esc(s.tabPeriodic)}
          </button>
          <button type="button" role="tab" id="mnem-tab-phalanx" class="mnem-pillar-tab" data-pillar="phalanx" aria-selected="${this.activePillar === "phalanx"}">
            ${esc(s.tabPhalanx)}
          </button>
        </div>

        <div class="mnem-panel-host">
          <div role="tabpanel" aria-labelledby="mnem-tab-binary" class="mnem-tabpanel" ${this.activePillar === "binary" ? "" : "hidden"}>
            <div class="mnem-tabpanel-inner">${this.activePillar === "binary" ? this.renderBinaryPillar(s, summary) : ""}</div>
          </div>
          <div role="tabpanel" aria-labelledby="mnem-tab-periodic" class="mnem-tabpanel" ${this.activePillar === "periodic" ? "" : "hidden"}>
            <div class="mnem-tabpanel-inner">${this.activePillar === "periodic" ? this.renderPeriodicPillar(s, summary) : ""}</div>
          </div>
          <div role="tabpanel" aria-labelledby="mnem-tab-phalanx" class="mnem-tabpanel" ${this.activePillar === "phalanx" ? "" : "hidden"}>
            <div class="mnem-tabpanel-inner">${this.activePillar === "phalanx" ? this.renderPhalanxPillar(s, summary) : ""}</div>
          </div>
        </div>
      </div>
    `;
        this.wireEvents();
    }
    renderBinaryPillar(s, summary) {
        const levelSealsHtml = `
      <div class="mnem-level-seals" role="group" aria-label="${esc(s.rigorLevel)}">
        ${([
            { lvl: 1, medal: "🥉", lbl: s.sealEasy },
            { lvl: 2, medal: "🥈", lbl: s.sealMedium },
            { lvl: 3, medal: "🥇", lbl: s.sealHard },
        ]).map(({ lvl, medal, lbl }) => {
            const m = summary.naryByLevel[lvl];
            const isCurrent = this.progress.level === lvl;
            const isDone = m.total > 0 && m.mastered >= m.total;
            return `
            <button type="button" class="mnem-level-seal ${isCurrent ? "active" : ""} ${isDone ? "is-complete" : ""}" data-set-level="${lvl}" aria-pressed="${isCurrent}">
              <span class="mnem-seal-medal">${medal}</span>
              <span class="mnem-seal-lbl">${lvl} · ${esc(lbl)}</span>
              <strong class="mnem-seal-pct">${esc(this.formatPercent(m.percent))}</strong>
              <span class="mnem-seal-frac">(${m.mastered}/${m.total})</span>
            </button>`;
        }).join("")}
      </div>
    `;
        const chapterBarHtml = `
      <div class="mnem-chapter-bar" role="navigation" aria-label="${esc(s.navaParicchedaTitle)}">
        <div class="mnem-chapter-bar-title">🏛️ <strong>${esc(s.navaParicchedaTitle)}</strong></div>
        <div class="mnem-nary-global-bar">
          ${this.renderProgressMeter("nary-global", "nary-global", `🧭 ${s.naryGlobalProgressLabel}`, summary.naryGlobal, s.naryChaptersCompleted(summary.naryChaptersCompleted, 9))}
          ${levelSealsHtml}
        </div>
        <div class="mnem-chapter-btn-group">
          ${CANONICAL_CHAPTERS_META.map((ch) => {
            const chProg = summary.chapters[ch.num];
            const isDone = chProg.total > 0 && chProg.mastered >= chProg.total;
            const chLabel = ch.num === 1 ? `1. Cittas (${this.binEnumMode})` : ch.shortLabel[this.lang];
            return `
            <button type="button" class="mnem-chapter-btn ${this.binActiveChapter === ch.num && this.naryDrillMode !== "synthesis" ? "active" : ""} ${isDone ? "is-complete" : ""}" data-bin-chapter="${ch.num}" aria-pressed="${this.binActiveChapter === ch.num && this.naryDrillMode !== "synthesis"}">
              <span class="mnem-chapter-btn-lbl">${esc(chLabel)}</span>
              <span class="mnem-chapter-btn-prog">${isDone ? "✓ " : ""}${chProg.mastered}/${chProg.total} · ${esc(this.formatPercent(chProg.percent))}</span>
            </button>`;
        }).join("")}
        </div>
        <div class="mnem-drill-mode-bar" role="group" aria-label="${esc(s.pillarShortNary)}">
          <button type="button" class="mnem-drill-mode-btn ${this.naryDrillMode === "encode" ? "active" : ""}" data-nary-drill="encode" aria-pressed="${this.naryDrillMode === "encode"}">
            ${esc(s.drillEncodeBtn)}
          </button>
          <button type="button" class="mnem-drill-mode-btn ${this.naryDrillMode === "reverse" ? "active" : ""}" data-nary-drill="reverse" aria-pressed="${this.naryDrillMode === "reverse"}">
            ${esc(s.drillReverseBtn)}
          </button>
          <button type="button" class="mnem-drill-mode-btn ${this.naryDrillMode === "synthesis" ? "active" : ""}" data-nary-drill="synthesis" aria-pressed="${this.naryDrillMode === "synthesis"}">
            ${esc(s.drillSynthesisBtn)}
          </button>
        </div>
      </div>
    `;
        if (this.naryDrillMode === "synthesis") {
            return `
        ${chapterBarHtml}
        ${this.renderSynthesisMode(s, summary)}
      `;
        }
        if (this.naryDrillMode === "reverse") {
            return `
        ${chapterBarHtml}
        ${this.renderReverseChallenge(s, summary)}
      `;
        }
        if (this.binActiveChapter > 1) {
            return `
        ${chapterBarHtml}
        ${this.renderNaryChapterDecoder(s, summary)}
      `;
        }
        const currentCitta = resolveCittaFromSwitches(this.switches, this.binEnumMode);
        const familyCittas = getSynthesizableCittas(this.switches.family, this.binEnumMode);
        const sw = this.switches;
        const lvl = this.progress.level;
        const isChallengeActive = this.binMode === "challenge";
        const isChallengeRevealed = this.binFeedback !== null;
        const familyLabels = {
            lobha: { pt: "Lobha-mūla (8 = 2³)", en: "Lobha-mūla (8 = 2³)", es: "Lobha-mūla (8 = 2³)" },
            dosa: { pt: "Dosa-mūla (2 = 1×1×2)", en: "Dosa-mūla (2 = 1×1×2)", es: "Dosa-mūla (2 = 1×1×2)" },
            moha: { pt: "Moha-mūla (2 = 1×2)", en: "Moha-mūla (2 = 1×2)", es: "Moha-mūla (2 = 1×2)" },
            ahetuka: { pt: "Ahetuka (18 = 7 + 8 + 3)", en: "Ahetuka (18 = 7 + 8 + 3)", es: "Ahetuka (18 = 7 + 8 + 3)" },
            kamasobhana: { pt: "Kāmasobhana (24 = 2³ × 3)", en: "Kāmasobhana (24 = 2³ × 3)", es: "Kāmasobhana (24 = 2³ × 3)" },
            rupavacara: { pt: "Rūpāvacara (15 = 5 × 3)", en: "Rūpāvacara (15 = 5 × 3)", es: "Rūpāvacara (15 = 5 × 3)" },
            arupavacara: { pt: "Arūpāvacara (12 = 4 × 3)", en: "Arūpāvacara (12 = 4 × 3)", es: "Arūpāvacara (12 = 4 × 3)" },
            lokuttara: {
                pt: this.binEnumMode === 121 ? "Lokuttara (40 = 4×2×5)" : "Lokuttara (8 = 4×2)",
                en: this.binEnumMode === 121 ? "Lokuttara (40 = 4×2×5)" : "Lokuttara (8 = 4×2)",
                es: this.binEnumMode === 121 ? "Lokuttara (40 = 4×2×5)" : "Lokuttara (8 = 4×2)",
            },
        };
        const showThreeBits = sw.family === "lobha" || sw.family === "kamasobhana";
        const showJatiTriad = sw.family === "kamasobhana" || sw.family === "rupavacara" || sw.family === "arupavacara";
        let challengeHtml = "";
        if (isChallengeActive) {
            const target = this.binTargetCitta;
            const isSrsTarget = (this.progress.missedQueue ?? []).includes(`citta:${target.id}`);
            const showCh1Cues = lvl === 1 || isChallengeRevealed;
            const promptTitle = lvl === 3
                ? `<span lang="pi" class="mnem-pali-badge">${esc(target.pali)}</span>`
                : lvl === 2
                    ? `<strong>${esc(target.name[this.lang])}</strong>`
                    : `<strong>${esc(target.name[this.lang])}</strong><div class="mnem-hint-line">💡 <span lang="pi">${esc(target.code)}</span> — ${esc(target.pali)}</div>`;
            let feedbackHtml = "";
            if (this.binFeedback) {
                if (this.binFeedback.isCorrect) {
                    feedbackHtml = `
            <div class="mnem-feedback mnem-feedback-ok" aria-live="polite">
              <div><strong>${esc(s.binCorrectMsg)}</strong></div>
              <div><strong>#${target.id} ${esc(target.code)}</strong> · <span lang="pi">${esc(target.pali)}</span> — ${esc(target.name[this.lang])}</div>
              <div class="mnem-formula-note">${esc(target.formulaNote[this.lang])}</div>
            </div>
          `;
                }
                else {
                    const got = this.binFeedback.synthesized;
                    feedbackHtml = `
            <div class="mnem-feedback mnem-feedback-err" aria-live="polite">
              <div><strong>${esc(s.binWrongMsg)}</strong></div>
              <div>${esc(s.targetLabel)} <strong>#${target.id} ${esc(target.code)}</strong> (<span lang="pi">${esc(target.pali)}</span> — ${esc(target.name[this.lang])})</div>
              <div>${esc(s.currentLabel)} <strong>${got ? `#${got.id} ${esc(got.code)}` : "—"}</strong></div>
              <div class="mnem-formula-note">${esc(target.formulaNote[this.lang])}</div>
            </div>
          `;
                }
            }
            const getFamLabel = (f) => familyLabels[f]?.[this.lang] ?? f;
            const getFamShortLabel = (f) => getFamLabel(f).split("(")[0]?.trim() ?? f;
            let mismatchHtml = "";
            if (sw.family !== target.family && (lvl === 1 || isChallengeRevealed)) {
                mismatchHtml = `
          <div class="mnem-family-mismatch-banner" role="alert">
            <div class="mnem-mismatch-text">
              ⚠️ ${esc(s.familyMismatchNotice)}: <strong>${esc(getFamLabel(target.family))}</strong>
            </div>
            <button type="button" class="mnem-btn mnem-btn-secondary mnem-btn-sm" id="mnem-bin-align-family">
              ⚡ ${esc(s.alignFamilyBtn)} (${esc(getFamShortLabel(target.family))})
            </button>
          </div>
        `;
            }
            const ch1Prog = summary.chapters[1];
            const ch1ScopeProg = computeChapterScopeProgress(this.progress, 1, this.binFamilyScope, this.binEnumMode);
            const ch1ProgressStripHtml = `
        <div class="mnem-challenge-progress-strip">
          ${this.binFamilyScope !== "all"
                ? this.renderProgressMeter("ch1-scope", "nary-scope", `${s.naryScopeProgressLabel}: ${getFamShortLabel(this.binFamilyScope)}`, ch1ScopeProg, undefined, true)
                : ""}
          ${this.renderProgressMeter("ch1-chapter", "nary-chapter", s.naryChapterProgressLabel(1), ch1Prog, undefined, true)}
          ${this.renderProgressMeter("ch1-global", "nary-challenge-global", s.naryGlobalShortLabel, summary.naryGlobal, undefined, true)}
        </div>
      `;
            const ch1RelCuesHtml = showCh1Cues
                ? `
            <div class="mnem-challenge-rel-grid">
              <span class="mnem-rel-chip">🏛️ <strong>${esc(s.binRelBhumi)}:</strong> <span lang="pi">${esc(this.formatBhumiPali(target.bhumi))}</span></span>
              <span class="mnem-rel-chip">⚖️ <strong>${esc(s.binRelJati)}:</strong> <span lang="pi">${esc(this.formatJatiPali(target.jati))}</span></span>
              ${target.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${target.jhanaStage}${this.loc("º Jhāna", target.jhanaStage === 1 ? "st Jhāna" : target.jhanaStage === 2 ? "nd Jhāna" : target.jhanaStage === 3 ? "rd Jhāna" : "th Jhāna", ".º Jhāna")}</span>` : ""}
              <span class="mnem-rel-chip">🌊 <strong>${esc(s.binRelVedana)}:</strong> <span lang="pi">${target.bitVedana === 1 ? "Somanassa" : target.bitVedana === "domanassa" ? "Domanassa" : target.bitVedana === "dukkha" ? "Dukkha" : target.bitVedana === "sukha" ? "Sukha" : "Upekkhā"}</span></span>
              ${target.hetuType ? `<span class="mnem-rel-chip">🌱 <strong>${esc(s.binRelHetu)}:</strong> <span lang="pi">${esc(this.formatHetuPali(target.hetuType))}</span></span>` : ""}
              ${target.kiccaPali ? `<span class="mnem-rel-chip">⚙️ <strong>${esc(s.binRelKicca)}:</strong> <span lang="pi">${esc(target.kiccaPali)}</span></span>` : ""}
              ${target.dvaraPali ? `<span class="mnem-rel-chip">🚪 <strong>${esc(s.binRelDvara)}:</strong> <span lang="pi">${esc(target.dvaraPali)}</span></span>` : ""}
              ${target.arammanaPali ? `<span class="mnem-rel-chip">🎯 <strong>${esc(s.binRelArammana)}:</strong> <span lang="pi">${esc(target.arammanaPali)}</span></span>` : ""}
              ${target.vatthuPali ? `<span class="mnem-rel-chip">🫀 <strong>${esc(s.binRelVatthu)}:</strong> <span lang="pi">${esc(target.vatthuPali)}</span></span>` : ""}
              <span class="mnem-rel-chip highlight">🧪 <strong>${esc(s.binRelSangaha)}:</strong> ${target.totalSangahaCount} cetasikas</span>
            </div>
            ${target.eradicationNote ? `
              <div class="mnem-rel-eradication-box">
                ⚔️ <strong>${esc(s.binRelEradication)}:</strong> ${esc(target.eradicationNote[this.lang])}
              </div>` : ""}
        `
                : `<div class="mnem-rigor-cue-banner">🔒 ${esc(lvl === 3 ? s.level3BlindCue : s.level2CueHidden)}</div>`;
            challengeHtml = `
        <div class="mnem-challenge-box">
          ${ch1ProgressStripHtml}
          <div class="mnem-challenge-scope-bar">
            <span class="mnem-scope-label">${esc(s.binScopeLabel)}</span>
            <button type="button" class="mnem-scope-btn ${this.binFamilyScope === "all" ? "active" : ""}" data-bin-scope="all">
              ${this.binEnumMode === 121 ? esc(s.binScopeAll121) : esc(s.binScopeAll89)} (${ch1Prog.mastered}/${ch1Prog.total})
            </button>
            ${["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"]
                .map((fam) => {
                const famProg = computeChapterScopeProgress(this.progress, 1, fam, this.binEnumMode);
                return `
                <button type="button" class="mnem-scope-btn ${this.binFamilyScope === fam ? "active" : ""} ${famProg.percent >= 100 ? "is-complete" : ""}" data-bin-scope="${fam}">
                  ${esc(getFamShortLabel(fam))} (${famProg.mastered}/${famProg.total})
                </button>`;
            })
                .join("")}
          </div>
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">
              🎯 ${esc(s.binChallengeTitle)} (${esc(target.asRef)})
              ${isSrsTarget ? `<span class="mnem-srs-badge">${esc(s.srsReviewBadge)}</span>` : ""}
            </span>
            <div class="mnem-challenge-prompt">${promptTitle}</div>
            ${ch1RelCuesHtml}
          </div>
          <div class="mnem-challenge-actions">
            <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-bin-verify">${esc(s.binVerifyBtn)}</button>
            <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-bin-next">${esc(s.binNextBtn)}</button>
            <label class="mnem-autoalign-label" title="${esc(s.autoAlignToggleLabel)}">
              <input type="checkbox" id="mnem-bin-autoalign-toggle" ${this.autoAlignFamily ? "checked" : ""} />
              <span>${esc(s.autoAlignToggleLabel)}</span>
            </label>
          </div>
          ${mismatchHtml}
          ${feedbackHtml}
        </div>
      `;
        }
        const maskCh1Synth = isChallengeActive && lvl === 3 && !isChallengeRevealed;
        const ch1MatrixGridHtml = `
        <div class="mnem-matrix-grid">
          ${familyCittas
            .map((c) => {
            const isSelected = currentCitta?.id === c.id;
            const isMastered = (this.progress.masteredBinary[`citta:${c.id}`] ?? 0) >= 1;
            return `
                <button type="button" class="mnem-matrix-cell ${isSelected ? "selected" : ""} ${isMastered ? "mastered" : ""}" data-load-citta="${c.id}">
                  <span class="mnem-cell-top">
                    <span class="mnem-cell-id">#${c.id}</span>
                    <span class="mnem-cell-code">${esc(c.code)}</span>
                  </span>
                  <span class="mnem-cell-pali" lang="pi">${esc(c.pali)}</span>
                  <span class="mnem-cell-count">${c.totalSangahaCount} cetasikas ${isMastered ? "★" : ""}</span>
                </button>
              `;
        })
            .join("")}
        </div>
    `;
        const ch1CatalogueSectionHtml = isChallengeActive && lvl === 3 && !isChallengeRevealed
            ? ""
            : isChallengeActive && lvl === 2
                ? `
      <div class="mnem-matrix-section">
        <details class="mnem-catalogue-details">
          <summary class="mnem-catalogue-summary"><span>📚 ${esc(s.catalogueToggleLabel)} — ${esc(s.binMatrixHeader)}</span></summary>
          <div class="mnem-catalogue-body">${ch1MatrixGridHtml}</div>
        </details>
      </div>`
                : `
      <div class="mnem-matrix-section">
        <h3 class="mnem-section-h3">${esc(s.binMatrixHeader)}</h3>
        ${ch1MatrixGridHtml}
      </div>`;
        return `
      ${chapterBarHtml}
      <div class="mnem-submode-bar">
        <button type="button" class="mnem-submode-btn ${this.binMode === "explore" ? "active" : ""}" data-bin-mode="explore" aria-pressed="${this.binMode === "explore"}">
          ${esc(s.binModeExplore)}
        </button>
        <button type="button" class="mnem-submode-btn ${this.binMode === "challenge" ? "active" : ""}" data-bin-mode="challenge" aria-pressed="${this.binMode === "challenge"}">
          ${esc(s.binModeChallenge)}
        </button>
        <button type="button" class="mnem-submode-btn mnem-enum-mode-btn ${this.binEnumMode === 121 ? "mode-121" : "mode-89"}" id="mnem-bin-mode-toggle" title="${esc(s.binModeToggleTitle)}">
          ${this.binEnumMode === 121 ? esc(s.binMode121Label) : esc(s.binMode89Label)}
        </button>
      </div>
      <div class="mnem-aid-note"><strong>ℹ️ ${esc(s.binAidNotice)}</strong></div>

      <div class="mnem-equation-banner">
        <div class="mnem-eq-title">${esc(s.binEquationBoxTitle)}</div>
        <div class="mnem-eq-chips">
          <span class="mnem-eq-chip"><strong>12 Akusala</strong> = 2³ (8 Lobha) + 2 Dosa + 2 Moha</span>
          <span class="mnem-eq-chip"><strong>18 Ahetuka</strong> = 5×2 (${esc(s.eqSenses)}) + 5 Vipāka + 3 Kiriya</span>
          <span class="mnem-eq-chip"><strong>24 Kāmasobhana</strong> = 2³ (8) × 3 (Kus/Vip/Kir)</span>
          <span class="mnem-eq-chip"><strong>15 Rūpa</strong> = 5 Jhānas × 3</span>
          <span class="mnem-eq-chip"><strong>12 Arūpa</strong> = 4 Bases × 3</span>
          <span class="mnem-eq-chip"><strong>8 (40) Lokuttara</strong> = ${esc(s.eqStages)}</span>
        </div>
      </div>

      ${challengeHtml}

      <div class="mnem-switchboard">
        <div class="mnem-switch-group">
          <span class="mnem-switch-label">${esc(s.binFamilyLabel)}</span>
          <div class="mnem-switch-row">
            ${["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"]
            .map((fam) => {
            const isTargetFam = isChallengeActive && lvl === 1 && this.binTargetCitta.family === fam;
            const isMismatched = isTargetFam && sw.family !== fam;
            return `
                  <button type="button" class="mnem-bit-btn ${sw.family === fam ? "active" : ""} ${isTargetFam ? "target-family" : ""}" data-bin-family="${fam}" aria-pressed="${sw.family === fam}">
                    ${esc(familyLabels[fam][this.lang])}${isMismatched ? " 🎯" : ""}
                  </button>`;
        })
            .join("")}
          </div>
        </div>

        ${showJatiTriad
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binJatiLabel)}</span>
            <div class="mnem-switch-row">
              <button type="button" class="mnem-bit-btn ${sw.jati === "kusala" ? "active" : ""}" data-bin-jati="kusala" aria-pressed="${sw.jati === "kusala"}">
                ${esc(s.jatiKusala)}
              </button>
              <button type="button" class="mnem-bit-btn ${sw.jati === "vipaka" ? "active" : ""}" data-bin-jati="vipaka" aria-pressed="${sw.jati === "vipaka"}">
                ${esc(s.jatiVipaka)}
              </button>
              <button type="button" class="mnem-bit-btn ${sw.jati === "kiriya" ? "active" : ""}" data-bin-jati="kiriya" aria-pressed="${sw.jati === "kiriya"}">
                ${esc(s.jatiKiriya)}
              </button>
            </div>
          </div>`
            : ""}

        ${showThreeBits
            ? `
          <div class="mnem-bits-grid">
            <div class="mnem-bit-card">
              <span class="mnem-switch-label">${esc(s.binBit1Label)}</span>
              <div class="mnem-bit-toggle-pair">
                <button type="button" class="mnem-bit-btn ${sw.bitVedana === 1 ? "active" : ""}" data-bit-vedana="1" aria-pressed="${sw.bitVedana === 1}">
                  <span class="mnem-bit-num">1</span> Somanassa
                </button>
                <button type="button" class="mnem-bit-btn ${sw.bitVedana === 0 ? "active" : ""}" data-bit-vedana="0" aria-pressed="${sw.bitVedana === 0}">
                  <span class="mnem-bit-num">0</span> Upekkhā
                </button>
              </div>
            </div>

            <div class="mnem-bit-card">
              <span class="mnem-switch-label">${esc(s.binBit2Label)}</span>
              <div class="mnem-bit-toggle-pair">
                <button type="button" class="mnem-bit-btn ${sw.bitCognitive === 1 ? "active" : ""}" data-bit-cog="1" aria-pressed="${sw.bitCognitive === 1}">
                  <span class="mnem-bit-num">1</span> ${sw.family === "lobha" ? "Diṭṭhi-sampayutta" : "Ñāṇa-sampayutta"}
                </button>
                <button type="button" class="mnem-bit-btn ${sw.bitCognitive === 0 ? "active" : ""}" data-bit-cog="0" aria-pressed="${sw.bitCognitive === 0}">
                  <span class="mnem-bit-num">0</span> ${sw.family === "lobha" ? "Diṭṭhi-vippayutta" : "Ñāṇa-vippayutta"}
                </button>
              </div>
            </div>

            <div class="mnem-bit-card">
              <span class="mnem-switch-label">${esc(s.binBit3Label)}</span>
              <div class="mnem-bit-toggle-pair">
                <button type="button" class="mnem-bit-btn ${sw.bitSankhara === 1 ? "active" : ""}" data-bit-sank="1" aria-pressed="${sw.bitSankhara === 1}">
                  <span class="mnem-bit-num">1</span> Asaṅkhārika
                </button>
                <button type="button" class="mnem-bit-btn ${sw.bitSankhara === 0 ? "active" : ""}" data-bit-sank="0" aria-pressed="${sw.bitSankhara === 0}">
                  <span class="mnem-bit-num">0</span> Sasaṅkhārika
                </button>
              </div>
            </div>
          </div>`
            : ""}

        ${sw.family === "dosa"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binBit3Label)} ${esc(s.dosaFixedNote)}</span>
            <div class="mnem-switch-row">
              <button type="button" class="mnem-bit-btn ${sw.bitSankhara === 1 ? "active" : ""}" data-bit-sank="1" aria-pressed="${sw.bitSankhara === 1}">
                <span class="mnem-bit-num">1</span> Asaṅkhārika (#9)
              </button>
              <button type="button" class="mnem-bit-btn ${sw.bitSankhara === 0 ? "active" : ""}" data-bit-sank="0" aria-pressed="${sw.bitSankhara === 0}">
                <span class="mnem-bit-num">0</span> Sasaṅkhārika (#10)
              </button>
            </div>
          </div>`
            : ""}

        ${sw.family === "moha"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binBit2Label)} ${esc(s.mohaFixedNote)}</span>
            <div class="mnem-switch-row">
              <button type="button" class="mnem-bit-btn ${sw.bitCognitive === "vicikiccha" ? "active" : ""}" data-bit-moha="vicikiccha" aria-pressed="${sw.bitCognitive === "vicikiccha"}">
                ${esc(s.mohaDoubt)}
              </button>
              <button type="button" class="mnem-bit-btn ${sw.bitCognitive === "uddhacca" ? "active" : ""}" data-bit-moha="uddhacca" aria-pressed="${sw.bitCognitive === "uddhacca"}">
                ${esc(s.mohaRestlessness)}
              </button>
            </div>
          </div>`
            : ""}

        ${sw.family === "ahetuka"
            ? (() => {
                const subLabels = {
                    akusala_vipaka: { pt: "1 · Akusala-vipāka (7)", en: "1 · Akusala-vipāka (7)", es: "1 · Akusala-vipāka (7)" },
                    kusala_vipaka: { pt: "2 · Kusala-vipāka (8)", en: "2 · Kusala-vipāka (8)", es: "2 · Kusala-vipāka (8)" },
                    kiriya: { pt: "3 · Ahetuka-kiriya (3)", en: "3 · Ahetuka-kiriya (3)", es: "3 · Ahetuka-kiriya (3)" },
                };
                const senseDoors = [
                    { pt: "1. Cakkhu (Olho · Upe)", en: "1. Cakkhu (Eye · Upe)", es: "1. Cakkhu (Ojo · Upe)" },
                    { pt: "2. Sota (Ouvido · Upe)", en: "2. Sota (Ear · Upe)", es: "2. Sota (Oído · Upe)" },
                    { pt: "3. Ghāna (Nariz · Upe)", en: "3. Ghāna (Nose · Upe)", es: "3. Ghāna (Nariz · Upe)" },
                    { pt: "4. Jivhā (Língua · Upe)", en: "4. Jivhā (Tongue · Upe)", es: "4. Jivhā (Lengua · Upe)" },
                ];
                const slotOpts = sw.ahetukaSubgroup === "akusala_vipaka"
                    ? [
                        ...senseDoors.map((d) => d[this.lang]),
                        this.lang === "en" ? "5. Kāya (Body · Dukkha)" : this.lang === "es" ? "5. Kāya (Cuerpo · Dukkha)" : "5. Kāya (Corpo · Dukkha)",
                        "6. Sampaṭicchana (Upe)",
                        "7. Santīraṇa (Upe)",
                    ]
                    : sw.ahetukaSubgroup === "kusala_vipaka"
                        ? [
                            ...senseDoors.map((d) => d[this.lang]),
                            this.lang === "en" ? "5. Kāya (Body · Sukha)" : this.lang === "es" ? "5. Kāya (Cuerpo · Sukha)" : "5. Kāya (Corpo · Sukha)",
                            "6. Sampaṭicchana (Upe)",
                            "7. Santīraṇa (Som)",
                            "8. Santīraṇa (Upe)",
                        ]
                        : [
                            "1. Pañcadvārāvajjana (Upe)",
                            "2. Manodvārāvajjana (Upe)",
                            "3. Hasituppāda (Som)",
                        ];
                return `
                  <div class="mnem-switch-group">
                    <span class="mnem-switch-label">${esc(s.binJatiLabel)}</span>
                    <div class="mnem-switch-row">
                      ${["akusala_vipaka", "kusala_vipaka", "kiriya"]
                    .map((sg) => `
                          <button type="button" class="mnem-bit-btn ${sw.ahetukaSubgroup === sg ? "active" : ""}" data-ahetuka-sub="${sg}" aria-pressed="${sw.ahetukaSubgroup === sg}">
                            ${esc(subLabels[sg][this.lang])}
                          </button>`)
                    .join("")}
                    </div>
                    <div class="mnem-switch-row" style="margin-top:8px;">
                      ${slotOpts
                    .map((lbl, idx) => `
                          <button type="button" class="mnem-bit-btn ${sw.ahetukaSlot === idx ? "active" : ""}" data-ahetuka-slot="${idx}" aria-pressed="${sw.ahetukaSlot === idx}">
                            ${esc(lbl)}
                          </button>`)
                    .join("")}
                    </div>
                  </div>`;
            })()
            : ""}

        ${sw.family === "rupavacara"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binJhanaLabel)}</span>
            <div class="mnem-switch-row">
              ${[
                { st: 1, lbl: this.loc("1º Jhāna (5: Vt·Vc·Pī·Su·Ek)", "1st Jhāna (5: Vt·Vc·Pī·Su·Ek)", "1.º Jhāna (5: Vt·Vc·Pī·Su·Ek)") },
                { st: 2, lbl: this.loc("2º Jhāna (4: −Vitakka)", "2nd Jhāna (4: −Vitakka)", "2.º Jhāna (4: −Vitakka)") },
                { st: 3, lbl: this.loc("3º Jhāna (3: −Vicāra)", "3rd Jhāna (3: −Vicāra)", "3.º Jhāna (3: −Vicāra)") },
                { st: 4, lbl: this.loc("4º Jhāna (2: −Pīti → Su·Ek)", "4th Jhāna (2: −Pīti → Su·Ek)", "4.º Jhāna (2: −Pīti → Su·Ek)") },
                { st: 5, lbl: this.loc("5º Jhāna (2: Upekkhā·Ek)", "5th Jhāna (2: Upekkhā·Ek)", "5.º Jhāna (2: Upekkhā·Ek)") },
            ]
                .map((j) => `
                  <button type="button" class="mnem-bit-btn ${sw.jhanaStage === j.st ? "active" : ""}" data-bin-jhana="${j.st}" aria-pressed="${sw.jhanaStage === j.st}">
                    ${esc(j.lbl)}
                  </button>`)
                .join("")}
            </div>
          </div>`
            : ""}

        ${sw.family === "arupavacara"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binArupaLabel)}</span>
            <div class="mnem-switch-row">
              ${[
                { b: 1, lbl: "1. Ākāsānañcāyatana" },
                { b: 2, lbl: "2. Viññāṇañcāyatana" },
                { b: 3, lbl: "3. Ākiñcaññāyatana" },
                { b: 4, lbl: "4. Nevasaññānāsaññāyatana" },
            ]
                .map((ab) => `
                  <button type="button" class="mnem-bit-btn ${sw.arupaBase === ab.b ? "active" : ""}" data-bin-arupa="${ab.b}" aria-pressed="${sw.arupaBase === ab.b}">
                    ${esc(ab.lbl)}
                  </button>`)
                .join("")}
            </div>
          </div>`
            : ""}

        ${sw.family === "lokuttara"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binMaggaLabel)}</span>
            <div class="mnem-switch-row">
              <button type="button" class="mnem-bit-btn ${sw.jati === "kusala" ? "active" : ""}" data-bin-jati="kusala" aria-pressed="${sw.jati === "kusala"}">
                ${esc(s.maggaBtn)}
              </button>
              <button type="button" class="mnem-bit-btn ${sw.jati === "vipaka" ? "active" : ""}" data-bin-jati="vipaka" aria-pressed="${sw.jati === "vipaka"}">
                ${esc(s.phalaBtn)}
              </button>
            </div>
            <div class="mnem-switch-row" style="margin-top:8px;">
              ${[
                { m: 1, lbl: "1. Sotāpatti" },
                { m: 2, lbl: "2. Sakadāgāmī" },
                { m: 3, lbl: "3. Anāgāmī" },
                { m: 4, lbl: "4. Arahatta" },
            ]
                .map((mg) => `
                  <button type="button" class="mnem-bit-btn ${sw.maggaStage === mg.m ? "active" : ""}" data-bin-magga="${mg.m}" aria-pressed="${sw.maggaStage === mg.m}">
                    ${esc(mg.lbl)}
                  </button>`)
                .join("")}
            </div>
            ${this.binEnumMode === 121
                ? `
            <div style="margin-top:10px;">
              <span class="mnem-switch-label">${esc(s.binJhanaLokuttaraLabel)}</span>
              <div class="mnem-switch-row" style="margin-top:4px;">
                ${[
                    { st: 1, lbl: this.loc("1º Jhāna (36: Vt·Vc·Pī·Su·Ek)", "1st Jhāna (36: Vt·Vc·Pī·Su·Ek)", "1.º Jhāna (36: Vt·Vc·Pī·Su·Ek)") },
                    { st: 2, lbl: this.loc("2º Jhāna (35: −Vitakka)", "2nd Jhāna (35: −Vitakka)", "2.º Jhāna (35: −Vitakka)") },
                    { st: 3, lbl: this.loc("3º Jhāna (34: −Vicāra)", "3rd Jhāna (34: −Vicāra)", "3.º Jhāna (34: −Vicāra)") },
                    { st: 4, lbl: this.loc("4º Jhāna (33: −Pīti)", "4th Jhāna (33: −Pīti)", "4.º Jhāna (33: −Pīti)") },
                    { st: 5, lbl: this.loc("5º Jhāna (33: Upekkhā·Ek)", "5th Jhāna (33: Upekkhā·Ek)", "5.º Jhāna (33: Upekkhā·Ek)") },
                ]
                    .map((j) => `
                    <button type="button" class="mnem-bit-btn ${sw.jhanaStage === j.st ? "active" : ""}" data-bin-jhana="${j.st}" aria-pressed="${sw.jhanaStage === j.st}">
                      ${esc(j.lbl)}
                    </button>`)
                    .join("")}
              </div>
            </div>`
                : ""}
          </div>`
            : ""}
      </div>

      ${maskCh1Synth
            ? `
        <div class="mnem-synthesized-card mnem-synth-masked">
          <div class="mnem-synth-header">
            <span class="mnem-synth-kicker">${esc(s.binSynthesizedTitle)}</span>
            <span class="mnem-synth-code">🔒 L3</span>
          </div>
          <div class="mnem-synth-name" style="color:var(--text-muted, #6f5c48);font-style:italic;">
            ${esc(s.level3SynthMasked)}
          </div>
        </div>`
            : currentCitta
                ? `
        <div class="mnem-synthesized-card">
          <div class="mnem-synth-header">
            <span class="mnem-synth-kicker">${esc(s.binSynthesizedTitle)}</span>
            <span class="mnem-synth-code">${esc(currentCitta.code)} · Citta #${currentCitta.id} (${esc(currentCitta.asRef)})</span>
          </div>
          <div class="mnem-synth-pali" lang="pi">${esc(currentCitta.pali)}</div>
          <div class="mnem-synth-name">${esc(currentCitta.name[this.lang])}</div>
          <div class="mnem-synth-formula">📐 ${esc(currentCitta.formulaNote[this.lang])}</div>
          <div class="mnem-challenge-rel-grid" style="margin-top:10px;">
            <span class="mnem-rel-chip">🏛️ <strong>${esc(s.binRelBhumi)}:</strong> <span lang="pi">${esc(this.formatBhumiPali(currentCitta.bhumi))}</span></span>
            <span class="mnem-rel-chip">⚖️ <strong>${esc(s.binRelJati)}:</strong> <span lang="pi">${esc(this.formatJatiPali(currentCitta.jati))}</span></span>
            ${currentCitta.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${currentCitta.jhanaStage}${this.loc("º Jhāna", currentCitta.jhanaStage === 1 ? "st Jhāna" : currentCitta.jhanaStage === 2 ? "nd Jhāna" : currentCitta.jhanaStage === 3 ? "rd Jhāna" : "th Jhāna", ".º Jhāna")}</span>` : ""}
            <span class="mnem-rel-chip">🌊 <strong>${esc(s.binRelVedana)}:</strong> <span lang="pi">${currentCitta.bitVedana === 1 ? "Somanassa" : currentCitta.bitVedana === "domanassa" ? "Domanassa" : currentCitta.bitVedana === "dukkha" ? "Dukkha" : currentCitta.bitVedana === "sukha" ? "Sukha" : "Upekkhā"}</span></span>
            ${currentCitta.hetuType ? `<span class="mnem-rel-chip">🌱 <strong>${esc(s.binRelHetu)}:</strong> <span lang="pi">${esc(this.formatHetuPali(currentCitta.hetuType))}</span></span>` : ""}
            ${currentCitta.kiccaPali ? `<span class="mnem-rel-chip">⚙️ <strong>${esc(s.binRelKicca)}:</strong> <span lang="pi">${esc(currentCitta.kiccaPali)}</span></span>` : ""}
            ${currentCitta.dvaraPali ? `<span class="mnem-rel-chip">🚪 <strong>${esc(s.binRelDvara)}:</strong> <span lang="pi">${esc(currentCitta.dvaraPali)}</span></span>` : ""}
            ${currentCitta.arammanaPali ? `<span class="mnem-rel-chip">🎯 <strong>${esc(s.binRelArammana)}:</strong> <span lang="pi">${esc(currentCitta.arammanaPali)}</span></span>` : ""}
            ${currentCitta.vatthuPali ? `<span class="mnem-rel-chip">🫀 <strong>${esc(s.binRelVatthu)}:</strong> <span lang="pi">${esc(currentCitta.vatthuPali)}</span></span>` : ""}
            <span class="mnem-rel-chip highlight">🧪 <strong>${esc(s.binRelSangaha)}:</strong> ${currentCitta.totalSangahaCount} cetasikas</span>
          </div>
          ${currentCitta.eradicationNote ? `
            <div class="mnem-rel-eradication-box" style="margin-top:8px;">
              ⚔️ <strong>${esc(s.binRelEradication)}:</strong> ${esc(currentCitta.eradicationNote[this.lang])}
            </div>` : ""}
        </div>`
                : ""}

      ${ch1CatalogueSectionHtml}
    `;
    }
    renderNaryChapterDecoder(s, summary) {
        const meta = CANONICAL_CHAPTERS_META.find((m) => m.num === this.binActiveChapter) ??
            CANONICAL_CHAPTERS_META[1];
        const submatrices = getSubmatricesForChapter(this.binActiveChapter);
        const allChapterItems = getNaryItemsForChapter(this.binActiveChapter);
        const chapterItems = getNaryItemsForChapter(this.binActiveChapter, this.narySubmatrixScope);
        let target = this.binTargetNaryItem;
        const targetInScope = target &&
            target.chapter === this.binActiveChapter &&
            (this.narySubmatrixScope === "all" ||
                (target.submatrix ?? target.primaryGroup) === this.narySubmatrixScope);
        if (!targetInScope) {
            target = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, undefined, this.narySubmatrixScope);
            this.binTargetNaryItem = target;
            this.narySwitches = defaultNarySwitchesForSubmatrix(this.binActiveChapter, this.narySubmatrixScope);
            this.naryFeedback = null;
        }
        const activeSubmatrixMeta = this.narySubmatrixScope !== "all"
            ? submatrices.find((sm) => sm.id === this.narySubmatrixScope)
            : submatrices.find((sm) => sm.id === (target.submatrix ?? target.primaryGroup));
        const synthItem = allChapterItems.find((item) => {
            return Object.entries(item.switches).every(([k, v]) => String(this.narySwitches[k]) === String(v));
        });
        const lvl = this.progress.level;
        const isRevealed = this.naryFeedback !== null;
        const isSrsTarget = (this.progress.missedQueue ?? []).includes(`nary:${target.id}`);
        let feedbackHtml = "";
        if (this.naryFeedback) {
            if (this.naryFeedback.isCorrect) {
                feedbackHtml = `
          <div class="mnem-challenge-feedback ok" style="margin-top:12px;">
            <div style="font-size:1.05rem;font-weight:700;">${esc(s.binCorrectMsg)}</div>
            <div style="margin-top:4px;">
              <strong>${esc(target.code)}</strong> · <span lang="pi"><strong>${esc(target.pali)}</strong></span> — ${esc(target.name[this.lang])}
            </div>
            <div style="margin-top:4px;font-size:0.88rem;opacity:0.9;">
              📐 <em>${esc(target.formulaNote[this.lang])}</em> (${esc(target.asRef)})
            </div>
          </div>
        `;
            }
            else {
                feedbackHtml = `
          <div class="mnem-challenge-feedback err" style="margin-top:12px;">
            <div style="font-weight:700;">${esc(s.binWrongMsg)}</div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.82rem;font-weight:600;">${esc(s.naryCorrectParams)}</span>
              ${this.naryFeedback.matchedKeys.length > 0
                    ? this.naryFeedback.matchedKeys
                        .map((k) => `<span class="mnem-rel-chip mnem-param-ok">✓ ${esc(this.formatNaryParamKey(k))}</span>`)
                        .join("")
                    : `<span style="font-size:0.8rem;color:var(--text-muted, #6f5c48);">${esc(s.naryNone)}</span>`}
            </div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.82rem;font-weight:600;">${esc(s.naryDivergentParams)}</span>
              ${this.naryFeedback.mismatchedKeys
                    .map((k) => `
                <span class="mnem-rel-chip mnem-param-err">
                  ✗ ${esc(this.formatNaryParamKey(k))} (${esc(s.naryCurrent)}: ${esc(this.formatNaryParamVal(k, this.narySwitches[k]))} · ${esc(s.naryExpected)}: ${esc(this.formatNaryParamVal(k, target.switches[k]))})
                </span>`)
                    .join("")}
            </div>
            <div style="margin-top:8px;font-size:0.86rem;opacity:0.95;">
              📐 <strong>${esc(target.code)}</strong> · <span lang="pi">${esc(target.pali)}</span> — ${esc(target.name[this.lang])}<br/>
              <em>${esc(target.formulaNote[this.lang])}</em> (${esc(target.asRef)})
            </div>
          </div>
        `;
            }
        }
        const submatrixBarHtml = submatrices.length > 0
            ? `
      <div class="mnem-scope-bar" style="margin-bottom:14px;">
        <span class="mnem-switch-label">${esc(s.narySubmatrixScopeLabel)}</span>
        <div class="mnem-switch-row">
          <button type="button" class="mnem-bit-btn ${this.narySubmatrixScope === "all" ? "active" : ""}" data-nary-submatrix="all" aria-pressed="${this.narySubmatrixScope === "all"}">
            ${esc(s.narySubmatrixAll(allChapterItems.length))}
          </button>
          ${submatrices
                .map((sm) => {
                const smItems = getNaryItemsForChapter(this.binActiveChapter, sm.id);
                const mastered = smItems.filter((it) => (this.progress.masteredBinary[`nary:${it.id}`] ?? 0) >= 1).length;
                const isActive = this.narySubmatrixScope === sm.id;
                return `
                <button type="button" class="mnem-bit-btn ${isActive ? "active" : ""}" data-nary-submatrix="${esc(sm.id)}" aria-pressed="${isActive}">
                  ${esc(sm.label[this.lang])} (${mastered}/${smItems.length})
                </button>`;
            })
                .join("")}
        </div>
      </div>`
            : "";
        const promptHtml = lvl === 3
            ? `<span lang="pi" class="mnem-pali-badge" style="font-weight:700;">${esc(this.stripPromptSpoilers(target.pali))}</span>`
            : lvl === 2
                ? `<span lang="pi" style="font-weight:700;">${esc(this.stripPromptSpoilers(target.pali))}</span> — ${esc(this.stripPromptSpoilers(target.name[this.lang]))}`
                : `<span lang="pi" style="font-weight:700;">${esc(target.pali)}</span> — ${esc(target.name[this.lang])}`;
        const showCues = lvl === 1 || isRevealed;
        const cuesHtml = showCues
            ? `
          <div class="mnem-challenge-rel-grid" style="margin-top:8px;">
            <span class="mnem-rel-chip">🏷️ <strong>${esc(s.naryGroupLabel)}</strong> ${esc(this.formatCanonicalGroupName(target.primaryGroup))}</span>
            <span class="mnem-rel-chip">📂 <strong>${esc(s.narySubdivisionLabel)}</strong> ${esc(this.formatCanonicalGroupName(target.secondaryGroup))}</span>
          </div>
          <div class="mnem-rel-eradication-box" style="margin-top:8px;">
            📐 <strong>${esc(s.naryFormulaAnchor)}</strong> ${esc(target.formulaNote[this.lang])}
          </div>
      `
            : `<div class="mnem-rigor-cue-banner">🔒 ${esc(lvl === 3 ? s.level3BlindCue : s.level2CueHidden)}</div>`;
        const maskSynth = lvl === 3 && !isRevealed;
        const catalogueCardsHtml = `
        <div class="mnem-matrix-grid">
          ${chapterItems
            .map((item) => {
            const isTarget = lvl === 1 && target.id === item.id;
            const isSelected = !maskSynth && synthItem?.id === item.id;
            const isMastered = (this.progress.masteredBinary[`nary:${item.id}`] ?? 0) >= 1;
            return `
                <div class="mnem-matrix-cell ${isTarget ? "target-family" : ""} ${isSelected ? "selected" : ""} ${isMastered ? "mastered" : ""}">
                  <span class="mnem-cell-top">
                    <span class="mnem-cell-id">${esc(item.code)}</span>
                    <span class="mnem-cell-code">${esc(item.asRef)}</span>
                  </span>
                  <span class="mnem-cell-pali" lang="pi">${esc(item.pali)}</span>
                  <div style="font-size:0.75rem;color:var(--text-muted, #6f5c48);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${esc(item.name[this.lang])}">
                    ${esc(item.name[this.lang])}
                  </div>
                  <div style="margin-top:6px;">
                    <button type="button" class="mnem-bit-btn" style="padding:4px 8px;font-size:0.74rem;min-height:30px;width:100%;" data-nary-load-item="${esc(item.id)}">
                      ${esc(s.naryLoadIntoSwitches)}
                    </button>
                  </div>
                </div>
              `;
        })
            .join("")}
        </div>
    `;
        const catalogueSectionHtml = lvl === 3 && !isRevealed
            ? ""
            : lvl === 2
                ? `
      <div class="mnem-matrix-section" style="margin-top:20px;">
        <details class="mnem-catalogue-details">
          <summary class="mnem-catalogue-summary"><span>📚 ${esc(s.catalogueToggleLabel)} — ${esc(s.naryCatalogueTitle(this.binActiveChapter, chapterItems.length))}</span></summary>
          <div class="mnem-catalogue-body">${catalogueCardsHtml}</div>
        </details>
      </div>`
                : `
      <div class="mnem-matrix-section" style="margin-top:20px;">
        <h3 class="mnem-section-h3">${esc(s.naryCatalogueTitle(this.binActiveChapter, chapterItems.length))}</h3>
        ${catalogueCardsHtml}
      </div>`;
        return `
      <div class="mnem-equation-banner">
        <div class="mnem-eq-title">🏛️ ${esc(meta.title[this.lang])} · <span lang="pi">${esc(meta.paliTitle)}</span> (${esc(meta.asRef)})</div>
        <div class="mnem-eq-chips">
          <span class="mnem-eq-chip highlight">📐 <strong>${esc(meta.equation[this.lang])}</strong></span>
          ${activeSubmatrixMeta && (lvl === 1 || this.narySubmatrixScope !== "all" || isRevealed)
            ? `<span class="mnem-eq-chip">🧮 <strong>${esc(s.narySubmatrixEqLabel)}</strong> ${esc(activeSubmatrixMeta.equation[this.lang])} (${esc(activeSubmatrixMeta.asRef)})</span>`
            : ""}
        </div>
      </div>
      ${submatrixBarHtml}

      <div class="mnem-challenge-card" style="margin-bottom:16px;">
        <div class="mnem-challenge-progress-strip">
          ${this.narySubmatrixScope !== "all" && activeSubmatrixMeta
            ? this.renderProgressMeter(`ch${this.binActiveChapter}-scope`, "nary-scope", `${s.naryScopeProgressLabel}: ${activeSubmatrixMeta.label[this.lang]}`, computeChapterScopeProgress(this.progress, this.binActiveChapter, this.narySubmatrixScope, this.binEnumMode), undefined, true)
            : ""}
          ${this.renderProgressMeter(`ch${this.binActiveChapter}-chapter`, "nary-chapter", s.naryChapterProgressLabel(this.binActiveChapter), summary.chapters[this.binActiveChapter], undefined, true)}
          ${this.renderProgressMeter(`ch${this.binActiveChapter}-global`, "nary-challenge-global", s.naryGlobalShortLabel, summary.naryGlobal, undefined, true)}
        </div>
        <div class="mnem-challenge-head">
          <span class="mnem-challenge-kicker">
            🎯 ${esc(meta.shortLabel[this.lang])}${lvl < 3 ? ` · ${esc(target.code)}` : ""} (${esc(target.asRef)})
            ${isSrsTarget ? `<span class="mnem-srs-badge">${esc(s.srsReviewBadge)}</span>` : ""}
          </span>
          <div class="mnem-challenge-prompt">${promptHtml}</div>
          ${cuesHtml}
        </div>
        <div class="mnem-challenge-actions">
          <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-nary-verify">${esc(s.binVerifyBtn)}</button>
          <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-nary-next">${esc(s.binNextBtn)}</button>
        </div>
        ${feedbackHtml}
      </div>

      <div class="mnem-switchboard">
        ${this.renderNarySwitchControls(this.binActiveChapter, this.narySwitches, s)}
      </div>

      <div class="mnem-synthesized-card ${maskSynth ? "mnem-synth-masked" : ""}" style="margin-top:16px;">
        <div class="mnem-synth-header">
          <span class="mnem-synth-kicker">${esc(s.narySynthKicker)}</span>
          <span class="mnem-synth-code">${maskSynth ? "🔒 L3" : synthItem ? `${esc(synthItem.code)} (${esc(synthItem.asRef)})` : esc(s.naryEditingConfig)}</span>
        </div>
        ${maskSynth
            ? `
          <div class="mnem-synth-name" style="color:var(--text-muted, #6f5c48);font-style:italic;">
            ${esc(s.level3SynthMasked)}<br/>
            ${esc(s.naryCurrentCombo)} ${Object.entries(this.narySwitches)
                .map(([k, v]) => `<strong>${esc(this.formatNaryParamKey(k))}</strong>: ${esc(this.formatNaryParamVal(k, v))}`)
                .join(" · ")}
          </div>`
            : synthItem
                ? `
          <div class="mnem-synth-pali" lang="pi">${esc(synthItem.pali)}</div>
          <div class="mnem-synth-name">${esc(synthItem.name[this.lang])}</div>
          <div class="mnem-synth-formula">📐 ${esc(synthItem.formulaNote[this.lang])}</div>
          <div class="mnem-challenge-rel-grid" style="margin-top:8px;">
            <span class="mnem-rel-chip">🏷️ <strong>${esc(s.naryGroupLabel)}</strong> ${esc(this.formatCanonicalGroupName(synthItem.primaryGroup))}</span>
            <span class="mnem-rel-chip">📂 <strong>${esc(s.narySubdivisionLabel)}</strong> ${esc(this.formatCanonicalGroupName(synthItem.secondaryGroup))}</span>
          </div>
        `
                : `
          <div class="mnem-synth-name" style="color:var(--text-muted, #6f5c48);font-style:italic;">
            ${esc(s.naryCurrentCombo)} ${Object.entries(this.narySwitches)
                    .map(([k, v]) => `<strong>${esc(this.formatNaryParamKey(k))}</strong>: ${esc(this.formatNaryParamVal(k, v))}`)
                    .join(" · ")}
          </div>
        `}
      </div>

      ${catalogueSectionHtml}
    `;
    }
    renderReverseChallenge(s, summary) {
        const lvl = this.progress.level;
        const choiceCount = lvl === 3 ? 6 : 4;
        const seed = this.progress.totalAttempts + this.binActiveChapter * 97 + lvl * 31;
        if (this.binActiveChapter === 1) {
            const pool = getSynthesizableCittas(this.binFamilyScope, this.binEnumMode);
            const target = this.binTargetCitta;
            const choices = buildReverseChoices(target, pool.length >= choiceCount ? pool : this.binEnumMode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89, choiceCount, (c) => String(c.id), (cand, tgt) => {
                let score = 0;
                if (cand.family === tgt.family)
                    score += 4;
                if (cand.jati === tgt.jati)
                    score += 2;
                if (cand.bitVedana === tgt.bitVedana)
                    score += 1;
                if (cand.jhanaStage && cand.jhanaStage === tgt.jhanaStage)
                    score += 1;
                return score;
            }, seed);
            const fb = this.reverseFeedback;
            return `
        <div class="mnem-challenge-card mnem-reverse-card">
          <div class="mnem-challenge-progress-strip">
            ${this.renderProgressMeter("rev-ch1", "nary-chapter", s.naryChapterProgressLabel(1), summary.chapters[1], undefined, true)}
            ${this.renderProgressMeter("rev-global", "nary-challenge-global", s.naryGlobalShortLabel, summary.naryGlobal, undefined, true)}
          </div>
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">🔄 ${esc(s.reverseKicker)} (${esc(target.asRef)})</span>
            <p class="mnem-reverse-instruction">${esc(s.reverseInstruction)}</p>
          </div>
          <div class="mnem-reverse-vector-card">
            <span class="mnem-rel-chip">🏛️ <strong>${esc(s.binRelBhumi)}:</strong> <span lang="pi">${esc(this.formatBhumiPali(target.bhumi))}</span></span>
            <span class="mnem-rel-chip">⚖️ <strong>${esc(s.binRelJati)}:</strong> <span lang="pi">${esc(this.formatJatiPali(target.jati))}</span></span>
            <span class="mnem-rel-chip">🌊 <strong>${esc(s.binRelVedana)}:</strong> <span lang="pi">${target.bitVedana === 1 ? "Somanassa" : target.bitVedana === "domanassa" ? "Domanassa" : target.bitVedana === "dukkha" ? "Dukkha" : target.bitVedana === "sukha" ? "Sukha" : "Upekkhā"}</span></span>
            ${target.bitCognitive === 1 || target.bitCognitive === 0 ? `<span class="mnem-rel-chip">🧠 <strong>${esc(s.binBit2Label)}</strong> <span lang="pi">${target.family === "lobha" ? (target.bitCognitive === 1 ? "Diṭṭhi-sampayutta" : "Diṭṭhi-vippayutta") : (target.bitCognitive === 1 ? "Ñāṇa-sampayutta" : "Ñāṇa-vippayutta")}</span></span>` : target.bitCognitive === "patigha" ? `<span class="mnem-rel-chip">🧠 <span lang="pi">Paṭigha-sampayutta</span></span>` : target.bitCognitive === "vicikiccha" ? `<span class="mnem-rel-chip">🧠 <span lang="pi">Vicikicchā-sampayutta</span></span>` : target.bitCognitive === "uddhacca" ? `<span class="mnem-rel-chip">🧠 <span lang="pi">Uddhacca-sampayutta</span></span>` : ""}
            ${target.bitSankhara === 1 || target.bitSankhara === 0 ? `<span class="mnem-rel-chip">⚡ <strong>Saṅkhāra:</strong> <span lang="pi">${target.bitSankhara === 1 ? "Asaṅkhārika" : "Sasaṅkhārika"}</span></span>` : ""}
            ${target.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${target.jhanaStage}</span>` : ""}
            ${target.arupaBase ? `<span class="mnem-rel-chip">🌌 <strong>Arūpa:</strong> #${target.arupaBase}</span>` : ""}
            ${target.maggaStage ? `<span class="mnem-rel-chip">✨ <strong>Magga/Phala:</strong> #${target.maggaStage}</span>` : ""}
            ${target.hetuType ? `<span class="mnem-rel-chip">🌱 <strong>${esc(s.binRelHetu)}:</strong> <span lang="pi">${esc(this.formatHetuPali(target.hetuType))}</span></span>` : ""}
            <span class="mnem-rel-chip highlight">🧪 <strong>${esc(s.binRelSangaha)}:</strong> ${target.totalSangahaCount} cetasikas</span>
          </div>
          <div class="mnem-choice-grid" role="group" aria-label="${esc(s.reverseKicker)}">
            ${choices
                .map((c) => {
                const cid = String(c.id);
                const isSelected = fb?.selectedId === cid;
                const isTarget = cid === String(target.id);
                const stateCls = fb ? (isTarget ? "is-correct" : isSelected ? "is-wrong" : "is-muted") : "";
                return `
                  <button type="button" class="mnem-choice-btn ${stateCls}" data-reverse-choice="${esc(cid)}" ${fb ? "disabled" : ""}>
                    <span class="mnem-choice-pali" lang="pi">${esc(c.pali)}</span>
                    ${lvl < 3 ? `<span class="mnem-choice-name">${esc(c.name[this.lang])}</span>` : ""}
                  </button>`;
            })
                .join("")}
          </div>
          ${fb
                ? `
            <div class="mnem-challenge-feedback ${fb.isCorrect ? "ok" : "err"}" style="margin-top:12px;" aria-live="polite">
              <div style="font-weight:700;">${esc(fb.isCorrect ? s.reverseCorrectMsg : s.reverseWrongMsg)}</div>
              <div style="margin-top:4px;"><strong>#${target.id} ${esc(target.code)}</strong> · <span lang="pi"><strong>${esc(target.pali)}</strong></span> — ${esc(target.name[this.lang])}</div>
              <div style="margin-top:4px;font-size:0.88rem;">📐 <em>${esc(target.formulaNote[this.lang])}</em> (${esc(target.asRef)})</div>
            </div>`
                : ""}
          <div class="mnem-challenge-actions" style="margin-top:12px;">
            <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-reverse-next">${esc(s.binNextBtn)}</button>
          </div>
        </div>
      `;
        }
        const meta = CANONICAL_CHAPTERS_META.find((m) => m.num === this.binActiveChapter) ?? CANONICAL_CHAPTERS_META[1];
        const allItems = getNaryItemsForChapter(this.binActiveChapter);
        const scopeItems = getNaryItemsForChapter(this.binActiveChapter, this.narySubmatrixScope);
        let target = this.binTargetNaryItem;
        if (!target || target.chapter !== this.binActiveChapter) {
            target = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, undefined, this.narySubmatrixScope);
            this.binTargetNaryItem = target;
            this.reverseFeedback = null;
        }
        const choicePool = scopeItems.length >= choiceCount ? scopeItems : allItems;
        const choices = buildReverseChoices(target, choicePool, choiceCount, (it) => it.id, (cand, tgt) => {
            let score = 0;
            if (cand.submatrix === tgt.submatrix)
                score += 4;
            if (cand.secondaryGroup === tgt.secondaryGroup)
                score += 3;
            if (cand.primaryGroup === tgt.primaryGroup)
                score += 2;
            return score;
        }, seed);
        const fb = this.reverseFeedback;
        return `
      <div class="mnem-challenge-card mnem-reverse-card">
        <div class="mnem-challenge-progress-strip">
          ${this.renderProgressMeter(`rev-ch${this.binActiveChapter}`, "nary-chapter", s.naryChapterProgressLabel(this.binActiveChapter), summary.chapters[this.binActiveChapter], undefined, true)}
          ${this.renderProgressMeter("rev-global", "nary-challenge-global", s.naryGlobalShortLabel, summary.naryGlobal, undefined, true)}
        </div>
        <div class="mnem-challenge-head">
          <span class="mnem-challenge-kicker">🔄 ${esc(s.reverseKicker)} ${esc(meta.shortLabel[this.lang])} (${esc(target.asRef)})</span>
          <p class="mnem-reverse-instruction">${esc(s.reverseInstruction)}</p>
        </div>
        <div class="mnem-reverse-vector-card">
          ${Object.entries(target.switches)
            .map(([k, v]) => `
            <span class="mnem-rel-chip">
              <strong>${esc(this.formatNaryParamKey(k))}:</strong> ${esc(this.formatNaryParamVal(k, v))}
            </span>`)
            .join("")}
        </div>
        ${lvl === 1
            ? `<div class="mnem-rel-eradication-box" style="margin-top:8px;">📐 <strong>${esc(s.naryFormulaAnchor)}</strong> ${esc(target.formulaNote[this.lang])}</div>`
            : ""}
        <div class="mnem-choice-grid" role="group" aria-label="${esc(s.reverseKicker)}">
          ${choices
            .map((it) => {
            const isSelected = fb?.selectedId === it.id;
            const isTarget = it.id === target.id;
            const stateCls = fb ? (isTarget ? "is-correct" : isSelected ? "is-wrong" : "is-muted") : "";
            return `
                <button type="button" class="mnem-choice-btn ${stateCls}" data-reverse-choice="${esc(it.id)}" ${fb ? "disabled" : ""}>
                  <span class="mnem-choice-pali" lang="pi">${esc(lvl === 3 ? this.stripPromptSpoilers(it.pali) : it.pali)}</span>
                  ${lvl < 3 ? `<span class="mnem-choice-name">${esc(lvl === 2 ? this.stripPromptSpoilers(it.name[this.lang]) : it.name[this.lang])}</span>` : ""}
                </button>`;
        })
            .join("")}
        </div>
        ${fb
            ? `
          <div class="mnem-challenge-feedback ${fb.isCorrect ? "ok" : "err"}" style="margin-top:12px;" aria-live="polite">
            <div style="font-weight:700;">${esc(fb.isCorrect ? s.reverseCorrectMsg : s.reverseWrongMsg)}</div>
            <div style="margin-top:4px;"><strong>${esc(target.code)}</strong> · <span lang="pi"><strong>${esc(target.pali)}</strong></span> — ${esc(target.name[this.lang])}</div>
            <div style="margin-top:4px;font-size:0.88rem;">📐 <em>${esc(target.formulaNote[this.lang])}</em> (${esc(target.asRef)})</div>
          </div>`
            : ""}
        <div class="mnem-challenge-actions" style="margin-top:12px;">
          <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-reverse-next">${esc(s.binNextBtn)}</button>
        </div>
      </div>
    `;
    }
    getSynthesisPool() {
        if (this.synthesisAxis === "all")
            return MULA_SYNTHESIS_ITEMS;
        const filtered = MULA_SYNTHESIS_ITEMS.filter((it) => it.axis === this.synthesisAxis);
        return filtered.length > 0 ? filtered : MULA_SYNTHESIS_ITEMS;
    }
    pickNextSynthesisItem(currentId) {
        const pool = this.getSynthesisPool();
        const lvl = this.progress.level;
        const sorted = [...pool].sort((a, b) => {
            const sa = getMasteryScoreForLevel(this.progress, a.id, lvl);
            const sb = getMasteryScoreForLevel(this.progress, b.id, lvl);
            if (sa !== sb)
                return sa - sb;
            return a.id.localeCompare(b.id);
        });
        const minScore = getMasteryScoreForLevel(this.progress, sorted[0].id, lvl);
        const lowest = sorted.filter((it) => getMasteryScoreForLevel(this.progress, it.id, lvl) === minScore);
        const active = lowest.length > 1 ? lowest : sorted;
        if (currentId) {
            const idx = active.findIndex((it) => it.id === currentId);
            if (idx >= 0)
                return active[(idx + 1) % active.length];
        }
        return active[this.progress.totalAttempts % active.length] ?? pool[0];
    }
    renderSynthesisMode(s, summary) {
        const pool = this.getSynthesisPool();
        if (!pool.some((it) => it.id === this.synthesisTarget.id)) {
            this.synthesisTarget = this.pickNextSynthesisItem();
            this.synthesisFeedback = null;
        }
        const target = this.synthesisTarget;
        const lvl = this.progress.level;
        const synMastered = MULA_SYNTHESIS_ITEMS.filter((it) => (this.progress.masteredBinary[it.id] ?? 0) >= 1).length;
        const synMetric = computeProgressMetric(synMastered, MULA_SYNTHESIS_ITEMS.length);
        const choiceCount = lvl === 3 ? 5 : 4;
        const choices = buildReverseChoices(target, MULA_SYNTHESIS_ITEMS, choiceCount, (it) => it.id, (cand, tgt) => (cand.axis === tgt.axis ? 5 : 1), this.progress.totalAttempts + lvl * 17);
        const fb = this.synthesisFeedback;
        return `
      <div class="mnem-challenge-card mnem-synthesis-card">
        <div class="mnem-challenge-progress-strip">
          ${this.renderProgressMeter("syn-progress", "nary-synthesis", `🌐 ${s.synthesisProgressLabel}`, synMetric, undefined, true)}
          ${this.renderProgressMeter("syn-global", "nary-challenge-global", s.naryGlobalShortLabel, summary.naryGlobal, undefined, true)}
        </div>
        <div class="mnem-scope-bar" style="margin-bottom:12px;">
          <div class="mnem-switch-row">
            <button type="button" class="mnem-bit-btn ${this.synthesisAxis === "all" ? "active" : ""}" data-syn-axis="all" aria-pressed="${this.synthesisAxis === "all"}">
              ${esc(s.synthesisAllAxes(MULA_SYNTHESIS_ITEMS.length))}
            </button>
            ${SYNTHESIS_AXIS_META.map((ax) => {
            const axItems = MULA_SYNTHESIS_ITEMS.filter((it) => it.axis === ax.id);
            const axDone = axItems.filter((it) => (this.progress.masteredBinary[it.id] ?? 0) >= 1).length;
            return `
                <button type="button" class="mnem-bit-btn ${this.synthesisAxis === ax.id ? "active" : ""}" data-syn-axis="${ax.id}" aria-pressed="${this.synthesisAxis === ax.id}">
                  ${esc(ax.label[this.lang])} (${axDone}/${axItems.length})
                </button>`;
        }).join("")}
          </div>
        </div>
        <div class="mnem-challenge-head">
          <span class="mnem-challenge-kicker">🌐 ${esc(s.synthesisTitle)} ${esc(target.code)} (${esc(target.asRef)})</span>
          <div class="mnem-challenge-prompt">
            ${lvl === 3 ? `<span lang="pi" class="mnem-pali-badge">${esc(target.promptPali)}</span>` : `<strong>${esc(target.prompt[this.lang])}</strong>`}
          </div>
        </div>
        <div class="mnem-choice-grid" role="group" aria-label="${esc(s.synthesisTitle)}">
          ${choices
            .map((it) => {
            const isSelected = fb?.selectedId === it.id;
            const isTarget = it.id === target.id;
            const stateCls = fb ? (isTarget ? "is-correct" : isSelected ? "is-wrong" : "is-muted") : "";
            return `
                <button type="button" class="mnem-choice-btn ${stateCls}" data-syn-choice="${esc(it.id)}" ${fb ? "disabled" : ""}>
                  ${lvl === 3
                ? `<span class="mnem-choice-pali" lang="pi">${esc(it.answerPali)}</span>`
                : `<span class="mnem-choice-name"><strong>${esc(it.answer[this.lang])}</strong></span>`}
                </button>`;
        })
            .join("")}
        </div>
        ${fb
            ? `
          <div class="mnem-challenge-feedback ${fb.isCorrect ? "ok" : "err"}" style="margin-top:12px;" aria-live="polite">
            <div style="font-weight:700;">${esc(fb.isCorrect ? s.synthesisCorrectMsg : s.synthesisWrongMsg)}</div>
            <div style="margin-top:4px;"><span lang="pi"><strong>${esc(target.pali)}</strong></span> — ${esc(target.answer[this.lang])}</div>
            <div style="margin-top:4px;font-size:0.88rem;">📐 <em>${esc(target.explanation[this.lang])}</em> (${esc(target.asRef)})</div>
            <div class="mnem-chapter-pill-links" style="margin-top:8px;">
              <span style="font-size:0.8rem;font-weight:600;">${esc(s.synthesisChaptersLinked)}</span>
              ${target.chaptersLinked
                .map((ch) => `<button type="button" class="mnem-rel-chip mnem-chapter-jump-chip" data-bin-chapter="${ch}">${this.loc(`Cap. ${ch}`, `Ch. ${ch}`, `Cap. ${ch}`)} →</button>`)
                .join("")}
            </div>
          </div>`
            : ""}
        <div class="mnem-challenge-actions" style="margin-top:12px;">
          <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-syn-next">${esc(s.binNextBtn)}</button>
        </div>
      </div>
    `;
    }
    renderNarySwitchControls(chapter, sw, _s) {
        const clean = this.progress.level >= 2;
        const renderRow = (label, key, options) => {
            return `
        <div class="mnem-switch-group">
          <span class="mnem-switch-label">${esc(label)}</span>
          <div class="mnem-switch-row">
            ${options
                .map((opt) => `
              <button type="button" class="mnem-bit-btn ${String(sw[key]) === String(opt.val) ? "active" : ""}" data-nary-key="${esc(key)}" data-nary-val="${esc(String(opt.val))}" aria-pressed="${String(sw[key]) === String(opt.val)}">
                ${esc(opt.label)}
              </button>`)
                .join("")}
          </div>
        </div>
      `;
        };
        switch (chapter) {
            case 2: {
                const lensOptions = [
                    { val: "sampayoga", label: this.loc("Sampayoga-naya (52 Cetasikas · Linhas)", "Sampayoga-naya (52 Cetasikas · Rows)", "Sampayoga-naya (52 Cetasikas · Filas)") },
                    { val: "sangaha", label: this.loc("Saṅgaha-naya (33 Classes · Colunas)", "Saṅgaha-naya (33 Classes · Columns)", "Saṅgaha-naya (33 Clases · Columnas)") },
                    { val: "laws", label: this.loc("Leis de Sampayoga & Aniyata (12)", "Sampayoga & Aniyata Laws (12)", "Leyes de Sampayoga y Aniyata (12)") },
                ];
                const currentLens = String(sw.lens ?? "sampayoga");
                if (currentLens === "laws") {
                    const lawGroupOptions = [
                        { val: "sampayoga_marks4", label: this.loc("4 Marcas de Sampayoga (AS II.1)", "4 Sampayoga Marks (AS II.1)", "4 Marcas de Sampayoga (AS II.1)") },
                        { val: "pakinnaka_excl6", label: this.loc("6 Exclusões dos Pakiṇṇakas (AS II.19)", "6 Pakiṇṇaka Exclusions (AS II.19)", "6 Exclusiones de Pakiṇṇakas (AS II.19)") },
                        { val: "regularity_laws", label: this.loc("Regularidade & Diferenciais (11 / 14)", "Regularity & Differentials (11 / 14)", "Regularidad y Diferenciales (11 / 14)") },
                    ];
                    const curLg = String(sw.lawGroup ?? "sampayoga_marks4");
                    const maxLawSlots = curLg === "pakinnaka_excl6" ? 6 : curLg === "sampayoga_marks4" ? 4 : 2;
                    const slotOptions = Array.from({ length: maxLawSlots }, (_, i) => ({
                        val: i + 1,
                        label: this.loc(`Lei #${i + 1}`, `Law #${i + 1}`, `Ley #${i + 1}`),
                    }));
                    const metricVals = curLg === "sampayoga_marks4" ? [4] : curLg === "pakinnaka_excl6" ? [66, 55, 11, 16, 70, 20] : [11, 14];
                    const metricOptions = metricVals.map((n) => ({ val: n, label: `${n}` }));
                    return `
            ${renderRow(this.loc("1. Método Canônico do Cap. 2 (Naya):", "1. Canonical Method of Ch. 2 (Naya):", "1. Método Canónico del Cap. 2 (Naya):"), "lens", lensOptions)}
            ${renderRow(this.loc("2. Grupo de Leis do Cap. 2:", "2. Ch. 2 Law Group:", "2. Grupo de Leyes del Cap. 2:"), "lawGroup", lawGroupOptions)}
            ${renderRow(this.loc("3. Posição na Lei:", "3. Position in Law:", "3. Posición en la Ley:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Métrica Canônica (Exclusão / Total):", "4. Canonical Metric (Exclusion / Total):", "4. Métrica Canónica (Exclusión / Total):"), "metric", metricOptions)}
          `;
                }
                if (currentLens === "sangaha") {
                    const sphereOptions = [
                        { val: "lokuttara", label: clean ? "Lokuttara" : this.loc("Lokuttara (5 Jhānas: 36–33)", "Lokuttara (5 Jhānas: 36–33)", "Lokuttara (5 Jhānas: 36–33)") },
                        { val: "mahaggata", label: clean ? "Mahaggata" : this.loc("Mahaggata (5 Jhānas: 35–30)", "Mahaggata (5 Jhānas: 35–30)", "Mahaggata (5 Jhānas: 35–30)") },
                        { val: "kamasobhana_kusala", label: clean ? "Mahākusala" : this.loc("Mahākusala (4 Pares: 38–36)", "Mahākusala (4 Pairs: 38–36)", "Mahākusala (4 Pares: 38–36)") },
                        { val: "kamasobhana_kiriya", label: clean ? "Mahākiriya" : this.loc("Mahākiriya (4 Pares: 35–33)", "Mahākiriya (4 Pairs: 35–33)", "Mahākiriya (4 Pares: 35–33)") },
                        { val: "kamasobhana_vipaka", label: clean ? "Mahāvipāka" : this.loc("Mahāvipāka (4 Pares: 33–31)", "Mahāvipāka (4 Pairs: 33–31)", "Mahāvipāka (4 Pares: 33–31)") },
                        { val: "akusala", label: clean ? "Akusala" : this.loc("Akusala (7 Classes: 19–15)", "Akusala (7 Classes: 19–15)", "Akusala (7 Clases: 19–15)") },
                        { val: "ahetuka", label: clean ? "Ahetuka" : this.loc("Ahetuka (4 Classes: 12–7)", "Ahetuka (4 Classes: 12–7)", "Ahetuka (4 Clases: 12–7)") },
                    ];
                    const currentSphere = String(sw.sphere ?? "lokuttara");
                    let slotOptions = [];
                    let cetCountVals = [];
                    if (currentSphere === "lokuttara" || currentSphere === "mahaggata") {
                        slotOptions = [
                            { val: 1, label: this.loc("1.º Jhāna", "1st Jhāna", "1.er Jhāna") },
                            { val: 2, label: clean ? this.loc("2.º Jhāna", "2nd Jhāna", "2.º Jhāna") : this.loc("2.º Jhāna (−Vitakka)", "2nd Jhāna (−Vitakka)", "2.º Jhāna (−Vitakka)") },
                            { val: 3, label: clean ? this.loc("3.º Jhāna", "3rd Jhāna", "3.er Jhāna") : this.loc("3.º Jhāna (−Vicāra)", "3rd Jhāna (−Vicāra)", "3.er Jhāna (−Vicāra)") },
                            { val: 4, label: clean ? this.loc("4.º Jhāna", "4th Jhāna", "4.º Jhāna") : this.loc("4.º Jhāna (−Pīti)", "4th Jhāna (−Pīti)", "4.º Jhāna (−Pīti)") },
                            { val: 5, label: clean ? this.loc("5.º Jhāna", "5th Jhāna", "5.º Jhāna") : this.loc("5.º Jhāna (Upekkhā)", "5th Jhāna (Upekkhā)", "5.º Jhāna (Upekkhā)") },
                        ];
                        cetCountVals = currentSphere === "lokuttara" ? [36, 35, 34, 33] : [35, 34, 33, 32, 30];
                    }
                    else if (currentSphere === "kamasobhana_kusala" ||
                        currentSphere === "kamasobhana_kiriya" ||
                        currentSphere === "kamasobhana_vipaka") {
                        slotOptions = [
                            { val: 1, label: this.loc("1.º Par (Somanassa · Ñāṇa)", "1st Pair (Somanassa · Ñāṇa)", "1.er Par (Somanassa · Ñāṇa)") },
                            { val: 2, label: this.loc("2.º Par (Somanassa · −Ñāṇa)", "2nd Pair (Somanassa · −Ñāṇa)", "2.º Par (Somanassa · −Ñāṇa)") },
                            { val: 3, label: this.loc("3.º Par (Upekkhā · Ñāṇa)", "3rd Pair (Upekkhā · Ñāṇa)", "3.er Par (Upekkhā · Ñāṇa)") },
                            { val: 4, label: this.loc("4.º Par (Upekkhā · −Ñāṇa)", "4th Pair (Upekkhā · −Ñāṇa)", "4.º Par (Upekkhā · −Ñāṇa)") },
                        ];
                        cetCountVals =
                            currentSphere === "kamasobhana_kusala"
                                ? [38, 37, 36]
                                : currentSphere === "kamasobhana_kiriya"
                                    ? [35, 34, 33]
                                    : [33, 32, 31];
                    }
                    else if (currentSphere === "akusala") {
                        slotOptions = [
                            { val: 1, label: this.loc("1. Lobha Som. Asaṅkhārika (#1,#3)", "1. Lobha Som. Unprompted (#1,#3)", "1. Lobha Som. No Instigada (#1,#3)") },
                            { val: 2, label: this.loc("2. Lobha Up. Asaṅkhārika (#5,#7)", "2. Lobha Up. Unprompted (#5,#7)", "2. Lobha Up. No Instigada (#5,#7)") },
                            { val: 3, label: this.loc("3. Dosa Asaṅkhārika (#9)", "3. Dosa Unprompted (#9)", "3. Dosa No Instigada (#9)") },
                            { val: 4, label: this.loc("4. Lobha Som. Sasaṅkhārika (#2,#4)", "4. Lobha Som. Prompted (#2,#4)", "4. Lobha Som. Instigada (#2,#4)") },
                            { val: 5, label: this.loc("5. Lobha Up. Sasaṅkhārika (#6,#8)", "5. Lobha Up. Prompted (#6,#8)", "5. Lobha Up. Instigada (#6,#8)") },
                            { val: 6, label: this.loc("6. Dosa Sasaṅkhārika (#10)", "6. Dosa Prompted (#10)", "6. Dosa Instigada (#10)") },
                            { val: 7, label: this.loc("7. Mohamūla (#11,#12)", "7. Mohamūla (#11,#12)", "7. Mohamūla (#11,#12)") },
                        ];
                        cetCountVals = [19, 18, 20, 21, 22, 15];
                    }
                    else {
                        slotOptions = [
                            { val: 1, label: this.loc("1. Hasituppāda (#30)", "1. Hasituppāda (#30)", "1. Hasituppāda (#30)") },
                            { val: 2, label: this.loc("2. Voṭṭhabbana (#29) & Sukha-santīraṇa (#26)", "2. Voṭṭhabbana (#29) & Sukha-santīraṇa (#26)", "2. Voṭṭhabbana (#29) y Sukha-santīraṇa (#26)") },
                            { val: 3, label: this.loc("3. Manodhātu-trika & Upekkhā-santīraṇa (5)", "3. Manodhātu-triad & Upekkhā-santīraṇa (5)", "3. Tríada Manodhātu y Upekkhā-santīraṇa (5)") },
                            { val: 4, label: this.loc("4. Dvipañcaviññāṇa (10 Sentidos)", "4. Dvipañcaviññāṇa (10 Senses)", "4. Dvipañcaviññāṇa (10 Sentidos)") },
                        ];
                        cetCountVals = [12, 11, 10, 7];
                    }
                    const cetOptions = cetCountVals.map((n) => ({
                        val: n,
                        label: `${n} Cetasikas`,
                    }));
                    return `
            ${renderRow(this.loc("1. Método Canônico do Cap. 2 (Naya):", "1. Canonical Method of Ch. 2 (Naya):", "1. Método Canónico del Cap. 2 (Naya):"), "lens", lensOptions)}
            ${renderRow(this.loc("2. Esfera / Classe de Cittas (Saṅgaha-naya):", "2. Consciousness Sphere / Class (Saṅgaha-naya):", "2. Esfera / Clase de Cittas (Saṅgaha-naya):"), "sphere", sphereOptions)}
            ${renderRow(this.loc("3. Degrau / Par Canônico:", "3. Canonical Step / Pair:", "3. Peldaño / Par Canónico:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Total de Cetasikas Incluídos (Fórmula de Subtração):", "4. Total Included Cetasikas (Subtraction Formula):", "4. Total de Cetasikas Incluidos (Fórmula de Sustracción):"), "cetasikas", cetOptions)}
          `;
                }
                const groupOptions = [
                    { val: "aññasamana", label: clean ? "Aññasamāna" : this.loc("Aññasamāna (13 Neutros: 7+6)", "Aññasamāna (13 Ethically Variable: 7+6)", "Aññasamāna (13 Neutros: 7+6)") },
                    { val: "akusala", label: clean ? "Akusala" : this.loc("Akusala (14 Insalubres: 4+3+4+2+1)", "Akusala (14 Unwholesome: 4+3+4+2+1)", "Akusala (14 Inhábiles: 4+3+4+2+1)") },
                    { val: "sobhana", label: clean ? "Sobhana" : this.loc("Sobhana (25 Belos: 19+3+2+1)", "Sobhana (25 Beautiful: 19+3+2+1)", "Sobhana (25 Hermosos: 19+3+2+1)") },
                ];
                const currentGroup = String(sw.group ?? "aññasamana");
                let subOptions = [];
                if (currentGroup === "aññasamana") {
                    subOptions = [
                        { val: "sabbacitta", label: clean ? "Sabbacittasādhāraṇa" : this.loc("Sabbacittasādhāraṇa (7 Universais)", "Sabbacittasādhāraṇa (7 Universals)", "Sabbacittasādhāraṇa (7 Universales)") },
                        { val: "pakinnaka", label: clean ? "Pakiṇṇaka" : this.loc("Pakiṇṇaka (6 Particulares)", "Pakiṇṇaka (6 Occasionals)", "Pakiṇṇaka (6 Particulares)") },
                    ];
                }
                else if (currentGroup === "akusala") {
                    subOptions = [
                        { val: "moha", label: clean ? "Moha-catukka" : this.loc("Moha-catukka (4 Universais Insalubres)", "Moha-catukka (4 Unwholesome Universals)", "Moha-catukka (4 Universales Inhábiles)") },
                        { val: "lobha", label: clean ? "Lobha-tika" : this.loc("Lobha-tríade (3 Raiz Apego)", "Lobha-triad (3 Greed Root)", "Tríada de Lobha (3 Raíz Apego)") },
                        { val: "dosa", label: clean ? "Dosa-catukka" : this.loc("Dosa-catukka (4 Raiz Aversão)", "Dosa-catukka (4 Hatred Root)", "Dosa-catukka (4 Raíz Aversión)") },
                        { val: "thina", label: clean ? "Thīna-duka" : this.loc("Thīna-duka (2 Torpor/Lentidão)", "Thīna-duka (2 Sloth & Torpor)", "Thīna-duka (2 Pereza/Torpor)") },
                        { val: "vicikiccha", label: clean ? "Vicikicchā" : this.loc("Vicikicchā (1 Dúvida Cética)", "Vicikicchā (1 Skeptical Doubt)", "Vicikicchā (1 Duda Escéptica)") },
                    ];
                }
                else {
                    subOptions = [
                        { val: "sadharana", label: clean ? "Sobhanasādhāraṇa" : this.loc("Sobhanasādhāraṇa (19 Universais Belos)", "Sobhanasādhāraṇa (19 Beautiful Universals)", "Sobhanasādhāraṇa (19 Universales Hermosos)") },
                        { val: "virati", label: clean ? "Virati" : this.loc("Virati (3 Abstenções Éticas)", "Virati (3 Ethical Abstinences)", "Virati (3 Abstenciones Éticas)") },
                        { val: "appamanna", label: clean ? "Appamaññā" : this.loc("Appamaññā (2 Ilimitados: Compaixão/Alegria)", "Appamaññā (2 Illimitables: Compassion/Joy)", "Appamaññā (2 Ilimitables: Compasión/Alegría)") },
                        { val: "panna", label: clean ? "Paññindriya" : this.loc("Paññindriya (1 Faculdade da Sabedoria)", "Paññindriya (1 Wisdom Faculty)", "Paññindriya (1 Facultad de Sabiduría)") },
                    ];
                }
                const currentSub = String(sw.sub ?? (subOptions[0]?.val ?? "sabbacitta"));
                let maxSlots = 7;
                if (currentSub === "sabbacitta")
                    maxSlots = 7;
                else if (currentSub === "pakinnaka")
                    maxSlots = 6;
                else if (currentSub === "moha")
                    maxSlots = 4;
                else if (currentSub === "lobha")
                    maxSlots = 3;
                else if (currentSub === "dosa")
                    maxSlots = 4;
                else if (currentSub === "thina")
                    maxSlots = 2;
                else if (currentSub === "vicikiccha")
                    maxSlots = 1;
                else if (currentSub === "sadharana")
                    maxSlots = 19;
                else if (currentSub === "virati")
                    maxSlots = 3;
                else if (currentSub === "appamanna")
                    maxSlots = 2;
                else if (currentSub === "panna")
                    maxSlots = 1;
                const slotOptions = Array.from({ length: maxSlots }, (_, i) => ({
                    val: i + 1,
                    label: this.loc(`Posição #${i + 1}`, `Position #${i + 1}`, `Posición #${i + 1}`),
                }));
                const yogitaOptions = [
                    { val: "niyata", label: clean ? "Niyata" : this.loc("Niyata (Fixo · 41)", "Niyata (Fixed · 41)", "Niyata (Fijo · 41)") },
                    { val: "aniyata_nana", label: clean ? "Aniyata (Nānā)" : this.loc("Aniyata Separado (9)", "Aniyata Separate (9)", "Aniyata Separado (9)") },
                    { val: "aniyata_saha", label: clean ? "Aniyata (Saha)" : this.loc("Aniyata Conjunto (2 · Thīna-Middha)", "Aniyata Paired (2 · Thīna-Middha)", "Aniyata Conjunto (2 · Thīna-Middha)") },
                ];
                const sampayogaOptions = [
                    { val: 121, label: clean ? "121" : "121 (Sabbacitta)" },
                    { val: 110, label: clean ? "110" : "110 (Adhimokkha)" },
                    { val: 105, label: clean ? "105" : "105 (Vīriya)" },
                    { val: 101, label: clean ? "101" : "101 (Chanda)" },
                    { val: 91, label: clean ? "91" : "91 (19 Sobhanasādhāraṇa)" },
                    { val: 79, label: clean ? "79" : "79 (Paññindriya)" },
                    { val: 66, label: clean ? "66" : "66 (Vicāra)" },
                    { val: 55, label: clean ? "55" : "55 (Vitakka)" },
                    { val: 51, label: clean ? "51" : "51 (Pīti)" },
                    { val: 48, label: clean ? "48" : "48 (3 Virati)" },
                    { val: 28, label: clean ? "28" : "28 (2 Appamaññā)" },
                    { val: 12, label: clean ? "12" : "12 (Moha-catukka)" },
                    { val: 8, label: clean ? "8" : "8 (Lobha)" },
                    { val: 5, label: clean ? "5" : "5 (Thīna-Middha)" },
                    { val: 4, label: clean ? "4" : "4 (Diṭṭhi / Māna)" },
                    { val: 2, label: clean ? "2" : "2 (Dosa-catukka)" },
                    { val: 1, label: clean ? "1" : "1 (Vicikicchā)" },
                ];
                return `
          ${renderRow(this.loc("1. Método Canônico do Cap. 2 (Naya):", "1. Canonical Method of Ch. 2 (Naya):", "1. Método Canónico del Cap. 2 (Naya):"), "lens", lensOptions)}
          ${renderRow(this.loc("2. Grupo Canônico Principal (Cetasika-bheda):", "2. Main Canonical Group (Cetasika-bheda):", "2. Grupo Canónico Principal (Cetasika-bheda):"), "group", groupOptions)}
          ${renderRow(this.loc("3. Subfamília / Bloco:", "3. Subfamily / Block:", "3. Subfamilia / Bloque:"), "sub", subOptions)}
          ${renderRow(this.loc("4. Posição no Bloco:", "4. Slot Position:", "4. Posición en el Bloque:"), "slot", slotOptions)}
          ${renderRow(this.loc("5. Regularidade (AS II.33–34 — Niyata vs. Aniyata):", "5. Regularity (AS II.33–34 — Fixed vs. Occasional):", "5. Regularidad (AS II.33–34 — Niyata vs. Aniyata):"), "yogita", yogitaOptions)}
          ${renderRow(this.loc("6. Valência / Associação de Cittas (Sampayoga — 121):", "6. Valence / Association with Cittas (Sampayoga — 121):", "6. Valencia / Asociación de Cittas (Sampayoga — 121):"), "sampayoga", sampayogaOptions)}
        `;
            }
            case 3: {
                const catOptions = [
                    { val: "vedana", label: clean ? "1. Vedanā" : this.loc("1. Vedanā (5 Sensações + Tríade)", "1. Vedanā (5 Feelings + Triad)", "1. Vedanā (5 Sensaciones + Tríada)") },
                    { val: "hetu", label: clean ? "2. Hetu" : this.loc("2. Hetu (6 Raízes & Partição 89)", "2. Hetu (6 Roots & 89-Partition)", "2. Hetu (6 Raíces y Partición 89)") },
                    { val: "kicca", label: clean ? "3. Kicca" : this.loc("3. Kicca (14 Funções · 10 Ṭhānas)", "3. Kicca (14 Functions · 10 Ṭhānas)", "3. Kicca (14 Funciones · 10 Ṭhānas)") },
                    { val: "dvara", label: clean ? "4. Dvāra" : this.loc("4. Dvāra (6 Portas · 46/porta)", "4. Dvāra (6 Doors · 46/door)", "4. Dvāra (6 Puertas · 46/puerta)") },
                    { val: "arammana", label: clean ? "5. Ālambaṇa" : this.loc("5. Ālambaṇa (7 Classes · 6 Objetos · Tempo)", "5. Ālambaṇa (7 Classes · 6 Objects · Time)", "5. Ālambaṇa (7 Clases · 6 Objetos · Tiempo)") },
                    { val: "vatthu", label: clean ? "6. Vatthu" : this.loc("6. Vatthu (43+42+4 · 6/3/0 · 7/4/1)", "6. Vatthu (43+42+4 · 6/3/0 · 7/4/1)", "6. Vatthu (43+42+4 · 6/3/0 · 7/4/1)") },
                ];
                const currentCat = String(sw.category ?? "vedana");
                let itemOptions = [];
                let countVals = [];
                if (currentCat === "vedana") {
                    itemOptions = [
                        { val: "somanassa", label: this.loc("Somanassa (Alegria mental)", "Somanassa (Mental joy)", "Somanassa (Alegría mental)") },
                        { val: "domanassa", label: this.loc("Domanassa (Aflição mental)", "Domanassa (Mental displeasure)", "Domanassa (Aflicción mental)") },
                        { val: "sukha", label: this.loc("Sukha (Prazer corporal)", "Sukha (Bodily pleasure)", "Sukha (Placer corporal)") },
                        { val: "dukkha", label: this.loc("Dukkha (Dor corporal)", "Dukkha (Bodily pain)", "Dukkha (Dolor corporal)") },
                        { val: "upekkha", label: this.loc("Upekkhā (Equanimidade)", "Upekkhā (Equanimity)", "Upekkhā (Ecuanimidad)") },
                        { val: "triad_sukha", label: this.loc("Tríade: Sukhavedanā (Agradável)", "Triad: Sukhavedanā (Pleasant)", "Tríada: Sukhavedanā (Agradable)") },
                        { val: "triad_dukkha", label: this.loc("Tríade: Dukkhavedanā (Desagradável)", "Triad: Dukkhavedanā (Painful)", "Tríada: Dukkhavedanā (Desagradable)") },
                        { val: "triad_adukkhamasukha", label: this.loc("Tríade: Adukkhamasukhā (Neutra)", "Triad: Adukkhamasukhā (Neutral)", "Tríada: Adukkhamasukhā (Neutra)") },
                    ];
                    countVals = [1, 2, 3, 55, 62, 63];
                }
                else if (currentCat === "hetu") {
                    itemOptions = [
                        { val: "ahetuka", label: this.loc("Ahetuka (0 Raízes)", "Ahetuka (0 Roots)", "Ahetuka (0 Raíces)") },
                        { val: "ekahetuka", label: this.loc("Ekahetuka (1 Raiz)", "Ekahetuka (1 Root)", "Ekahetuka (1 Raíz)") },
                        { val: "dvihetuka", label: this.loc("Dvihetuka (2 Raízes)", "Dvihetuka (2 Roots)", "Dvihetuka (2 Raíces)") },
                        { val: "tihetuka", label: this.loc("Tihetuka (3 Raízes)", "Tihetuka (3 Roots)", "Tihetuka (3 Raíces)") },
                        { val: "hetu_lobha", label: this.loc("Raiz: Lobha (Apego)", "Root: Lobha (Greed)", "Raíz: Lobha (Apego)") },
                        { val: "hetu_dosa", label: this.loc("Raiz: Dosa (Aversão)", "Root: Dosa (Hatred)", "Raíz: Dosa (Aversión)") },
                        { val: "hetu_moha", label: this.loc("Raiz: Moha (Ilusão)", "Root: Moha (Delusion)", "Raíz: Moha (Ilusión)") },
                        { val: "hetu_alobha", label: this.loc("Raiz: Alobha (Não-Apego)", "Root: Alobha (Non-Greed)", "Raíz: Alobha (No-Apego)") },
                        { val: "hetu_adosa", label: this.loc("Raiz: Adosa (Não-Aversão)", "Root: Adosa (Non-Hatred)", "Raíz: Adosa (No-Aversión)") },
                        { val: "hetu_amoha", label: this.loc("Raiz: Amoha (Sabedoria)", "Root: Amoha (Wisdom)", "Raíz: Amoha (Sabiduría)") },
                    ];
                    countVals = [2, 8, 12, 18, 22, 47, 59];
                }
                else if (currentCat === "kicca") {
                    itemOptions = [
                        { val: "patisandhi", label: this.loc("1. Paṭisandhi (Reconexão)", "1. Paṭisandhi (Rebirth-linking)", "1. Paṭisandhi (Reconexión)") },
                        { val: "bhavanga", label: this.loc("2. Bhavaṅga (Contínuo vital)", "2. Bhavaṅga (Life-continuum)", "2. Bhavaṅga (Continuo vital)") },
                        { val: "avajjana", label: this.loc("3. Āvajjana (Advertência)", "3. Āvajjana (Adverting)", "3. Āvajjana (Advertencia)") },
                        { val: "dassana", label: this.loc("4. Dassana (Visão)", "4. Dassana (Seeing)", "4. Dassana (Visión)") },
                        { val: "savana", label: this.loc("5. Savana (Audição)", "5. Savana (Hearing)", "5. Savana (Audición)") },
                        { val: "ghayana", label: this.loc("6. Ghāyana (Olfato)", "6. Ghāyana (Smelling)", "6. Ghāyana (Olfato)") },
                        { val: "sayana", label: this.loc("7. Sāyana (Paladar)", "7. Sāyana (Tasting)", "7. Sāyana (Gusto)") },
                        { val: "phusana", label: this.loc("8. Phusana (Tato)", "8. Phusana (Touching)", "8. Phusana (Tacto)") },
                        { val: "sampaticchana", label: this.loc("9. Sampaṭicchana (Recepção)", "9. Sampaṭicchana (Receiving)", "9. Sampaṭicchana (Recepción)") },
                        { val: "santirana", label: this.loc("10. Santīraṇa (Investigação)", "10. Santīraṇa (Investigating)", "10. Santīraṇa (Investigación)") },
                        { val: "votthabbana", label: this.loc("11. Voṭṭhabbana (Determinação)", "11. Voṭṭhabbana (Determining)", "11. Voṭṭhabbana (Determinación)") },
                        { val: "javana", label: this.loc("12. Javana (Impulsão)", "12. Javana (Impulsion)", "12. Javana (Impulsión)") },
                        { val: "tadarammana", label: this.loc("13. Tadārammaṇa (Registro)", "13. Tadārammaṇa (Registration)", "13. Tadārammaṇa (Registro)") },
                        { val: "cuti", label: this.loc("14. Cuti (Morte)", "14. Cuti (Decease)", "14. Cuti (Muerte)") },
                        { val: "thana_10", label: this.loc("Estações: Ṭhāna (14 → Estações)", "Stations: Ṭhāna (14 → Stations)", "Estaciones: Ṭhāna (14 → Estaciones)") },
                        { val: "ekakicca", label: this.loc("Partição: Ekakicca (1 Função)", "Partition: Ekakicca (1 Function)", "Partición: Ekakicca (1 Función)") },
                        { val: "dukicca", label: this.loc("Partição: Dukicca (2 Funções)", "Partition: Dukicca (2 Functions)", "Partición: Dukicca (2 Funciones)") },
                        { val: "tikicca", label: this.loc("Partição: Tikicca (3 Funções)", "Partition: Tikicca (3 Functions)", "Partición: Tikicca (3 Funciones)") },
                        { val: "catukicca", label: this.loc("Partição: Catukicca (4 Funções)", "Partition: Catukicca (4 Functions)", "Partición: Catukicca (4 Funciones)") },
                        { val: "pancakicca", label: this.loc("Partição: Pañcakicca (5 Funções)", "Partition: Pañcakicca (5 Functions)", "Partición: Pañcakicca (5 Funciones)") },
                    ];
                    countVals = [1, 2, 3, 8, 9, 10, 11, 19, 55, 68];
                }
                else if (currentCat === "dvara") {
                    itemOptions = [
                        { val: "pancadvara", label: this.loc("Total: Pañcadvāra (5 Portas)", "Total: Pañcadvāra (5 Doors)", "Total: Pañcadvāra (5 Puertas)") },
                        { val: "per_sense_46", label: this.loc("Por Porta Sensorial Isolada (Ekekasmiṃ Dvāre)", "Per Single Sense-Door (Ekekasmiṃ Dvāre)", "Por Puerta Sensorial Aislada (Ekekasmiṃ Dvāre)") },
                        { val: "manodvara", label: this.loc("Total: Manodvāra (Porta Mental)", "Total: Manodvāra (Mind Door)", "Total: Manodvāra (Puerta Mental)") },
                        { val: "dvaravimutta", label: this.loc("Total: Dvāravimutta (Livre)", "Total: Dvāravimutta (Door-Free)", "Total: Dvāravimutta (Libre)") },
                        { val: "ekadvarika", label: this.loc("Partição: Ekadvārika (1 Porta)", "Partition: Ekadvārika (1 Door)", "Partición: Ekadvārika (1 Puerta)") },
                        { val: "pancadvarika_3", label: this.loc("Partição: Pañcadvārika (5 Portas)", "Partition: Pañcadvārika (5 Doors)", "Partición: Pañcadvārika (5 Puertas)") },
                        { val: "chadvarika", label: this.loc("Partição: Chadvārika (6 Portas)", "Partition: Chadvārika (6 Doors)", "Partición: Chadvārika (6 Puertas)") },
                        { val: "chadvarika_vimutta", label: this.loc("Partição: 6 Portas e Livre", "Partition: 6 Doors & Free", "Partición: 6 Puertas y Libre") },
                        { val: "sabbatha_vimutta", label: this.loc("Partição: Sempre Livre", "Partition: Always Free", "Partición: Siempre Libre") },
                    ];
                    countVals = [3, 9, 10, 19, 31, 36, 46, 54, 67];
                }
                else if (currentCat === "arammana") {
                    itemOptions = [
                        { val: "paritta", label: this.loc("1. Parittārammaṇa (Só Sensual)", "1. Parittārammaṇa (Sense Only)", "1. Parittārammaṇa (Solo Sensual)") },
                        { val: "mahaggata", label: this.loc("2. Mahaggatārammaṇa (Só Sublime)", "2. Mahaggatārammaṇa (Sublime Only)", "2. Mahaggatārammaṇa (Solo Sublime)") },
                        { val: "pannatti", label: this.loc("3. Paññattārammaṇa (Só Conceito)", "3. Paññattārammaṇa (Concept Only)", "3. Paññattārammaṇa (Solo Concepto)") },
                        { val: "nibbana_obj", label: this.loc("4. Nibbānārammaṇa (Só Nibbāna)", "4. Nibbānārammaṇa (Nibbāna Only)", "4. Nibbānārammaṇa (Solo Nibbāna)") },
                        { val: "lokuttara_vajjita", label: this.loc("5. Tudo Exceto Lokuttara", "5. All Except Supramundane", "5. Todo Excepto Lokuttara") },
                        { val: "arahatta_vajjita", label: this.loc("6. Tudo Exceto Magga/Phala Arahant", "6. All Except Arahant Path/Fruit", "6. Todo Excepto Magga/Phala Arahant") },
                        { val: "sabbarammana", label: this.loc("7. Sabbārammaṇa (Todos os Objetos)", "7. Sabbārammaṇa (All Objects)", "7. Sabbārammaṇa (Todos los Objetos)") },
                        { val: "dhammarammana_6", label: this.loc("Síntese: Dhammārammaṇa", "Summary: Dhammārammaṇa", "Síntesis: Dhammārammaṇa") },
                        { val: "dh_pasada", label: "Dhammārammaṇa: Pasādarūpa" },
                        { val: "dh_sukhuma", label: "Dhammārammaṇa: Sukhumarūpa" },
                        { val: "dh_citta", label: "Dhammārammaṇa: Citta" },
                        { val: "dh_cetasika", label: "Dhammārammaṇa: Cetasika" },
                        { val: "dh_nibbana", label: "Dhammārammaṇa: Nibbāna" },
                        { val: "dh_pannatti", label: "Dhammārammaṇa: Paññatti" },
                        { val: "time_5doors", label: this.loc("Tempo: 5 Portas (Paccuppanna)", "Time: 5 Doors (Present)", "Tiempo: 5 Puertas (Presente)") },
                        { val: "time_mind", label: this.loc("Tempo: Porta Mental (Tekālika+Vimutta)", "Time: Mind-Door (3 Times+Timeless)", "Tiempo: Puerta Mental (4 Modos)") },
                        { val: "time_vimutta", label: this.loc("Tempo: Livres de Porta (Signos)", "Time: Door-Free (Death-Signs)", "Tiempo: Libres de Puerta (Signos)") },
                    ];
                    countVals = [0, 1, 3, 4, 5, 6, 8, 16, 20, 21, 25, 52, 89];
                }
                else {
                    itemOptions = [
                        { val: "nissaya", label: this.loc("Nissāya (Sempre c/ Base)", "Nissāya (Always Base-Dependent)", "Nissāya (Siempre con Base)") },
                        { val: "nissaya_anissaya", label: this.loc("Nissāya vā Anissāya vā (Com ou Sem)", "Nissāya vā Anissāya vā (With or Without)", "Nissāya vā Anissāya vā (Con o Sin)") },
                        { val: "anissita", label: this.loc("Anissita (Nunca c/ Base)", "Anissita (Never Base-Dependent)", "Anissita (Nunca con Base)") },
                        { val: "vatthu_kamaloka", label: clean ? "Vatthu: Kāmaloka" : this.loc("Reino: Kāmaloka (6 Vatthus)", "Realm: Kāmaloka (6 Bases)", "Reino: Kāmaloka (6 Bases)") },
                        { val: "vatthu_rupaloka", label: clean ? "Vatthu: Rūpaloka" : this.loc("Reino: Rūpaloka (3 Vatthus)", "Realm: Rūpaloka (3 Bases)", "Reino: Rūpaloka (3 Bases)") },
                        { val: "vatthu_arupaloka", label: clean ? "Vatthu: Arūpaloka" : this.loc("Reino: Arūpaloka (0 Vatthus)", "Realm: Arūpaloka (0 Bases)", "Reino: Arūpaloka (0 Bases)") },
                        { val: "dhatu_kama", label: clean ? "Dhātus: Kāmaloka" : this.loc("Dhātus: Kāmaloka (7 Viññāṇadhātus)", "Dhātus: Kāmaloka (7 Elements)", "Dhātus: Kāmaloka (7 Elementos)") },
                        { val: "dhatu_rupa", label: clean ? "Dhātus: Rūpaloka" : this.loc("Dhātus: Rūpaloka (4 Viññāṇadhātus)", "Dhātus: Rūpaloka (4 Elements)", "Dhātus: Rūpaloka (4 Elementos)") },
                        { val: "dhatu_arupa", label: clean ? "Dhātus: Arūpaloka" : this.loc("Dhātus: Arūpaloka (1 Manoviññāṇa)", "Dhātus: Arūpaloka (1 Element)", "Dhātus: Arūpaloka (1 Elemento)") },
                    ];
                    countVals = [0, 1, 3, 4, 6, 7, 42, 43];
                }
                const countOptions = countVals.map((n) => ({
                    val: n,
                    label: clean
                        ? `${n}`
                        : currentCat === "vatthu" && (n === 0 || n === 3 || n === 6)
                            ? this.loc(`${n} Vatthus`, `${n} Bases`, `${n} Bases`)
                            : n === 1
                                ? "1"
                                : `${n}`,
                }));
                return `
          ${renderRow(this.loc("1. Categoria Mista (Pakiṇṇaka):", "1. Miscellaneous Category (Pakiṇṇaka):", "1. Categoría Mixta (Pakiṇṇaka):"), "category", catOptions)}
          ${renderRow(this.loc("2. Fator / Partição Canônica:", "2. Canonical Factor / Partition:", "2. Factor / Partición Canónica:"), "item", itemOptions)}
          ${renderRow(this.loc("3. Contagem Canônica (89 / 121 / Reinos):", "3. Canonical Count (89 / 121 / Realms):", "3. Conteo Canónico (89 / 121 / Reinos):"), "count", countOptions)}
        `;
            }
            case 4: {
                const doorOptions = [
                    { val: "chakka_6", label: clean ? "1. Cha Chakkāni" : this.loc("1. 6 Hêxades (Chakka · AS IV.2)", "1. 6 Hexads (Chakka · AS IV.2)", "1. 6 Héxadas (Chakka · AS IV.2)") },
                    { val: "pancadvara", label: clean ? "2. Pañcadvāra" : this.loc("2. Pañcadvāra (5 Portas · 4 Vāras)", "2. Pañcadvāra (5 Doors · 4 Vāras)", "2. Pañcadvāra (5 Puertas · 4 Vāras)") },
                    { val: "manodvara", label: clean ? "3. Manodvāra & Appanā" : this.loc("3. Manodvāra & Appanā (32/12/8/6)", "3. Manodvāra & Appanā (32/12/8/6)", "3. Manodvāra y Appanā (32/12/8/6)") },
                    { val: "niyama", label: this.loc("4. Tadārammaṇa & Javana-niyama", "4. Tadārammaṇa & Javana Laws", "4. Leyes Tadārammaṇa y Javana") },
                    { val: "puggala_bhumi", label: this.loc("5. Puggalabheda & Bhūmivibhāga", "5. Puggalabheda & Bhūmivibhāga", "5. Puggalabheda y Bhūmivibhāga") },
                ];
                const currentDoor = String(sw.door ?? "pancadvara");
                let varaOptions = [];
                let vithicittaOptions = [];
                if (currentDoor === "chakka_6") {
                    varaOptions = [
                        { val: "ch_vatthu", label: "1. Vatthuchakka" },
                        { val: "ch_dvara", label: "2. Dvārachakka" },
                        { val: "ch_arammana", label: "3. Ārammaṇachakka" },
                        { val: "ch_vinnana", label: "4. Viññāṇachakka" },
                        { val: "ch_vithi", label: "5. Vīthichakka" },
                        { val: "ch_visaya", label: "6. Visayappavattichakka" },
                    ];
                    vithicittaOptions = [{ val: 6, label: "6" }];
                }
                else if (currentDoor === "pancadvara") {
                    varaOptions = [
                        { val: "tadarammana", label: clean ? "Tadārammaṇavāra" : this.loc("Tadārammaṇavāra (Atimahanta · até Registro)", "Tadārammaṇavāra (Atimahanta · to Registration)", "Tadārammaṇavāra (Atimahanta · hasta Registro)") },
                        { val: "javana", label: clean ? "Javanavāra" : this.loc("Javanavāra (Mahanta · até Javana)", "Javanavāra (Mahanta · to Javana)", "Javanavāra (Mahanta · hasta Javana)") },
                        { val: "votthabbana", label: clean ? "Voṭṭhabbanavāra" : this.loc("Voṭṭhabbanavāra (Paritta · até Determinação)", "Voṭṭhabbanavāra (Paritta · to Determining)", "Voṭṭhabbanavāra (Paritta · hasta Determinación)") },
                        { val: "mogha", label: clean ? "Moghavāra" : this.loc("Moghavāra (Atiparitta · Sem Vīthicitta)", "Moghavāra (Atiparitta · Futile Course)", "Moghavāra (Atiparitta · Curso Fútil)") },
                        { val: "summary_54", label: clean ? "Pañcadvāra-saṅgaha" : this.loc("Síntese Pañcadvāra (7·14·54 · 17 Cittakkhaṇas)", "Pañcadvāra Summary (7·14·54 · 17 Cittakkhaṇas)", "Síntesis Pañcadvāra (7·14·54 · 17 Cittakkhaṇas)") },
                    ];
                    vithicittaOptions = [
                        { val: 14, label: clean ? "14" : "14 Vīthicittas (Atimahanta)" },
                        { val: 12, label: clean ? "12" : "12 Vīthicittas (Mahanta)" },
                        { val: 6, label: clean ? "6" : "6–7 Vīthicittas (Paritta)" },
                        { val: 0, label: clean ? "0" : "0 Vīthicittas (Moghavāra)" },
                        { val: 54, label: clean ? "54" : this.loc("54 Cittas (Síntese das 5 Portas)", "54 Cittas (5-Door Total)", "54 Cittas (Síntesis de 5 Puertas)") },
                    ];
                }
                else if (currentDoor === "manodvara") {
                    varaOptions = [
                        { val: "tadarammana", label: clean ? "Vibhūtārammaṇa" : this.loc("Vibhūtārammaṇa (Claro · até Tadārammaṇa)", "Vibhūtārammaṇa (Clear · to Tadārammaṇa)", "Vibhūtārammaṇa (Claro · hasta Tadārammaṇa)") },
                        { val: "javana", label: clean ? "Avibhūtārammaṇa" : this.loc("Avibhūtārammaṇa (Obscuro · até Javana)", "Avibhūtārammaṇa (Obscure · to Javana)", "Avibhūtārammaṇa (Oscuro · hasta Javana)") },
                        { val: "appana", label: clean ? "Appanāvīthi" : this.loc("Appanāvīthi (Estágios Preliminares + Absorção)", "Appanāvīthi (Preliminary Stages + Absorption)", "Appanāvīthi (Etapas Preliminares + Absorción)") },
                        { val: "appana_som_kus", label: this.loc("Transição: Mahākusala Somanassa → Appanā", "Transition: Somanassa Mahākusala → Appanā", "Transición: Mahākusala Somanassa → Appanā") },
                        { val: "appana_upe_kus", label: this.loc("Transição: Mahākusala Upekkhā → Appanā", "Transition: Upekkhā Mahākusala → Appanā", "Transición: Mahākusala Upekkhā → Appanā") },
                        { val: "appana_som_kir", label: this.loc("Transição: Mahākiriya Somanassa → Appanā", "Transition: Somanassa Mahākiriya → Appanā", "Transición: Mahākiriya Somanassa → Appanā") },
                        { val: "appana_upe_kir", label: this.loc("Transição: Mahākiriya Upekkhā → Appanā", "Transition: Upekkhā Mahākiriya → Appanā", "Transición: Mahākiriya Upekkhā → Appanā") },
                        { val: "gotrabhu_vodana", label: "Gotrabhū / Vodāna" },
                        { val: "magga_phala_ratio", label: this.loc("Lei: 1 Magga → 2/3 Phalas", "Law: 1 Path → 2/3 Fruits", "Ley: 1 Magga → 2/3 Phalas") },
                    ];
                    vithicittaOptions = [
                        { val: 1, label: clean ? "1" : "1 (Gotrabhū / Vodāna)" },
                        { val: 3, label: clean ? "3" : "3 (2/3 Phalas)" },
                        { val: 5, label: clean ? "5" : this.loc("5+ Estágios (Appanāvīthi)", "5+ Stages (Appanāvīthi)", "5+ Etapas (Appanāvīthi)") },
                        { val: 6, label: clean ? "6" : "6 Appanā (Kiriya Upekkhā)" },
                        { val: 8, label: clean ? "8" : "8 (Avibhūta / Kiriya Som → Appanā)" },
                        { val: 10, label: clean ? "10" : "10 Vīthicittas (Vibhūta)" },
                        { val: 12, label: clean ? "12" : "12 Appanā (Kusala Upekkhā)" },
                        { val: 32, label: clean ? "32" : "32 Appanā (Kusala Somanassa)" },
                    ];
                }
                else if (currentDoor === "niyama") {
                    varaOptions = [
                        { val: "tad_quality", label: this.loc("Tadārammaṇa: Aniṭṭha / Iṭṭha / Ati-iṭṭha", "Tadārammaṇa: Aniṭṭha / Iṭṭha / Ati-iṭṭha", "Tadārammaṇa: Aniṭṭha / Iṭṭha / Ati-iṭṭha") },
                        { val: "agantuka_bhavanga", label: this.loc("Āgantuka-bhavaṅga (Amortecimento Domanassa)", "Āgantuka-bhavaṅga (Domanassa Buffer)", "Āgantuka-bhavaṅga (Amortiguador Domanassa)") },
                        { val: "tad_3cond", label: this.loc("Lei Tríplice Kāma de Tadārammaṇa", "Threefold Kāma Law of Tadārammaṇa", "Ley Triple Kāma de Tadārammaṇa") },
                        { val: "jav_normal", label: this.loc("Javana Kāmāvacara Normal", "Normal Sense-Sphere Javana", "Javana Kāmāvacara Normal") },
                        { val: "jav_death", label: this.loc("Javana Próximo à Morte (Maraṇakāla)", "Near-Death Javana (Maraṇakāla)", "Javana Cercano a la Muerte (Maraṇakāla)") },
                        { val: "jav_twin", label: this.loc("Milagre Duplo (Yamakapāṭihāriya)", "Twin Miracle (Yamakapāṭihāriya)", "Milagro Doble (Yamakapāṭihāriya)") },
                        { val: "jav_single", label: this.loc("Iniciante / Abhiññā / Catumagga", "Beginner / Abhiññā / Catumagga", "Principiante / Abhiññā / Catumagga") },
                        { val: "jav_nirodha", label: this.loc("Entrada em Nirodha-samāpatti", "Entry into Nirodha-samāpatti", "Entrada en Nirodha-samāpatti") },
                        { val: "jav_samapatti", label: this.loc("Samāpattivīthi (Absorção Sustentada)", "Samāpattivīthi (Sustained Attainment)", "Samāpattivīthi (Absorción Sostenida)") },
                    ];
                    vithicittaOptions = [
                        { val: 1, label: clean ? "1" : this.loc("1 Momento (Magga / Abhiññā / Āgantuka)", "1 Moment (Path / Abhiññā / Āgantuka)", "1 Momento (Magga / Abhiññā / Āgantuka)") },
                        { val: 2, label: clean ? "2" : this.loc("2 Momentos (Tadārammaṇa / Nirodha)", "2 Moments (Tadārammaṇa / Nirodha)", "2 Momentos (Tadārammaṇa / Nirodha)") },
                        { val: 3, label: clean ? "3" : this.loc("3 Graus (Aniṭṭha / Iṭṭha / Ati-iṭṭha)", "3 Grades (Aniṭṭha / Iṭṭha / Ati-iṭṭha)", "3 Grados (Aniṭṭha / Iṭṭha / Ati-iṭṭha)") },
                        { val: 4, label: clean ? "4–5" : this.loc("4–5 Momentos (Milagre Duplo)", "4–5 Moments (Twin Miracle)", "4–5 Momentos (Milagro Doble)") },
                        { val: 5, label: clean ? "5" : this.loc("5 Momentos (Maraṇakāla)", "5 Moments (Near Death)", "5 Momentos (Maraṇakāla)") },
                        { val: 7, label: clean ? "7" : this.loc("7 (ou 6) Momentos (Normal)", "7 (or 6) Moments (Normal)", "7 (o 6) Momentos (Normal)") },
                        { val: 99, label: clean ? "∞" : this.loc("∞ Incontáveis (Samāpatti)", "∞ Innumerable (Samāpatti)", "∞ Incontables (Samāpatti)") },
                    ];
                }
                else {
                    varaOptions = [
                        { val: "pug_asekkha", label: this.loc("Indivíduo: Asekkha (Arahant)", "Individual: Asekkha (Arahant)", "Individuo: Asekkha (Arahant)") },
                        { val: "pug_sekkha", label: this.loc("Indivíduo: Sekkha (Nobre Aprendiz)", "Individual: Sekkha (Noble Trainee)", "Individuo: Sekkha (Noble Aprendiz)") },
                        { val: "pug_puthujjana", label: this.loc("Indivíduo: Puthujjana (Comum)", "Individual: Puthujjana (Worldling)", "Individuo: Puthujjana (Común)") },
                        { val: "pug_ahetuka", label: "Indivíduo: Ahetuka" },
                        { val: "pug_dvihetuka", label: "Indivíduo: Dvihetuka" },
                        { val: "pug_sotapanna", label: "Sotāpanna / Sakadāgāmī" },
                        { val: "pug_anagami", label: "Anāgāmī" },
                        { val: "bhu_kama", label: this.loc("Plano: Kāmāvacarabhūmi", "Plane: Kāmāvacarabhūmi", "Plano: Kāmāvacarabhūmi") },
                        { val: "bhu_rupa", label: this.loc("Plano: Rūpāvacarabhūmi", "Plane: Rūpāvacarabhūmi", "Plano: Rūpāvacarabhūmi") },
                        { val: "bhu_arupa", label: this.loc("Plano: Arūpāvacarabhūmi", "Plane: Arūpāvacarabhūmi", "Plano: Arūpāvacarabhūmi") },
                        { val: "bhu_asanna", label: this.loc("Plano: Asaññasattabhūmi", "Plane: Asaññasattabhūmi", "Plano: Asaññasattabhūmi") },
                        { val: "excl_kama", label: this.loc("Exclusões: Kāmaloka", "Exclusions: Kāmaloka", "Exclusiones: Kāmaloka") },
                        { val: "excl_rupa", label: this.loc("Exclusões: Rūpaloka", "Exclusions: Rūpaloka", "Exclusiones: Rūpaloka") },
                        { val: "excl_arupa", label: this.loc("Exclusões: Arūpaloka", "Exclusions: Arūpaloka", "Exclusiones: Arūpaloka") },
                    ];
                    vithicittaOptions = [
                        { val: 0, label: clean ? "0" : "0 (Asaññasatta)" },
                        { val: 9, label: clean ? "9" : "9 (Excl. Kāma)" },
                        { val: 16, label: clean ? "16" : "16 (Excl. Rūpa)" },
                        { val: 37, label: clean ? "37" : "37 (Ahetuka)" },
                        { val: 38, label: clean ? "38" : "38 (Excl. Arūpa)" },
                        { val: 41, label: clean ? "41" : "41 (Dvihetuka)" },
                        { val: 42, label: clean ? "42" : "42 (Arūpa)" },
                        { val: 44, label: clean ? "44" : "44 (Asekkha)" },
                        { val: 48, label: clean ? "48" : "48 (Anāgāmī)" },
                        { val: 50, label: clean ? "50" : "50 (Sotāpanna)" },
                        { val: 54, label: clean ? "54" : "54 (Puthujjana)" },
                        { val: 56, label: clean ? "56" : "56 (Sekkha)" },
                        { val: 64, label: clean ? "64" : "64 (Rūpa)" },
                        { val: 80, label: clean ? "80" : "80 (Kāma)" },
                    ];
                }
                return `
          ${renderRow(this.loc("1. Domínio / Porta do Cap. 4 (Dvāra / Niyama):", "1. Ch. 4 Domain / Door (Dvāra / Niyama):", "1. Dominio / Puerta del Cap. 4 (Dvāra / Niyama):"), "door", doorOptions)}
          ${renderRow(this.loc("2. Curso / Regra / Classe (Vāra / Bheda):", "2. Course / Law / Class (Vāra / Bheda):", "2. Curso / Ley / Clase (Vāra / Bheda):"), "vara", varaOptions)}
          ${renderRow(this.loc("3. Valor Canônico (Vīthicittas / Momentos / Cittas):", "3. Canonical Value (Vīthicittas / Moments / Cittas):", "3. Valor Canónico (Vīthicittas / Momentos / Cittas):"), "vithicittas", vithicittaOptions)}
        `;
            }
            case 5: {
                const tetradOptions = [
                    { val: "bhumi_31", label: this.loc("1. 31 Planos & Longevidades (Bhūmi)", "1. 31 Planes & Lifespans (Bhūmi)", "1. 31 Planos y Longevidades (Bhūmi)") },
                    { val: "patisandhi", label: this.loc("2. 4 Paṭisandhis & Objetos", "2. 4 Paṭisandhis & Objects", "2. 4 Paṭisandhis y Objetos") },
                    { val: "kamma_16", label: this.loc("3. Matriz 4×4 Kamma & Maturação", "3. 4×4 Kamma Matrix & Ripening", "3. Matriz 4×4 Kamma y Maduración") },
                    { val: "kammapatha_20", label: this.loc("4. 10 Akusala & 10 Puñña", "4. 10 Akusala & 10 Puñña", "4. 10 Akusala y 10 Puñña") },
                    { val: "marana_cuti", label: this.loc("5. Morte, Signos & Cuti→Paṭisandhi", "5. Death, Signs & Cuti→Paṭisandhi", "5. Muerte, Signos y Cuti→Paṭisandhi") },
                ];
                const currentTetrad = String(sw.tetrad ?? "bhumi_31");
                if (currentTetrad === "bhumi_31") {
                    const pgOptions = [
                        { val: "apaya", label: this.loc("Apāyabhūmi (4 Planos)", "Apāyabhūmi (4 Planes)", "Apāyabhūmi (4 Planos)") },
                        { val: "kamasugati", label: this.loc("Kāmasugati (7 Planos · ×4ᵏ)", "Kāmasugati (7 Planes · ×4ᵏ)", "Kāmasugati (7 Planos · ×4ᵏ)") },
                        { val: "rupa_j1_3", label: this.loc("Rūpa Jhānas 1–3 (9 Planos · 2ᵏ)", "Rūpa Jhānas 1–3 (9 Planes · 2ᵏ)", "Rūpa Jhānas 1–3 (9 Planos · 2ᵏ)") },
                        { val: "rupa_j4", label: this.loc("Rūpa 4.º Jhāna & Suddhāvāsa (7 Planos)", "Rūpa 4th Jhāna & Pure Abodes (7 Planes)", "Rūpa 4.º Jhāna y Suddhāvāsa (7 Planos)") },
                        { val: "arupa", label: this.loc("Arūpabhūmi (4 Planos · 20k–84k)", "Arūpabhūmi (4 Planes · 20k–84k)", "Arūpabhūmi (4 Planos · 20k–84k)") },
                    ];
                    const curPg = String(sw.planeGroup ?? "apaya");
                    const maxSlots = curPg === "apaya" || curPg === "arupa" ? 4 : curPg === "rupa_j1_3" ? 9 : 7;
                    const slotOptions = Array.from({ length: maxSlots }, (_, i) => ({
                        val: i + 1,
                        label: this.loc(`Plano #${i + 1}`, `Plane #${i + 1}`, `Plano #${i + 1}`),
                    }));
                    let lifeOptions = [];
                    if (curPg === "apaya") {
                        lifeOptions = [{ val: "unfixed", label: this.loc("Sem limite fixo (Aniyata)", "Unfixed lifespan (Aniyata)", "Sin límite fijo (Aniyata)") }];
                    }
                    else if (curPg === "kamasugati") {
                        lifeOptions = [
                            { val: "unfixed", label: this.loc("Sem limite fixo (Humanos)", "Unfixed (Humans)", "Sin límite fijo (Humanos)") },
                            { val: "9m", label: this.loc("9 milhões (9×4⁰)", "9 million (9×4⁰)", "9 millones (9×4⁰)") },
                            { val: "36m", label: this.loc("36 milhões (9×4¹)", "36 million (9×4¹)", "36 millones (9×4¹)") },
                            { val: "144m", label: this.loc("144 milhões (9×4²)", "144 million (9×4²)", "144 millones (9×4²)") },
                            { val: "576m", label: this.loc("576 milhões (9×4³)", "576 million (9×4³)", "576 millones (9×4³)") },
                            { val: "2304m", label: this.loc("2.304 milhões (9×4⁴)", "2,304 million (9×4⁴)", "2.304 millones (9×4⁴)") },
                            { val: "9216m", label: this.loc("9.216 milhões (9×4⁵)", "9,216 million (9×4⁵)", "9.216 millones (9×4⁵)") },
                        ];
                    }
                    else if (curPg === "rupa_j1_3") {
                        lifeOptions = [
                            { val: "k_1_3", label: "1/3 kappa" },
                            { val: "k_1_2", label: "1/2 kappa" },
                            { val: "k_1", label: "1 kappa (2⁰)" },
                            { val: "k_2", label: "2 kappas (2¹)" },
                            { val: "k_4", label: "4 kappas (2²)" },
                            { val: "k_8", label: "8 kappas (2³)" },
                            { val: "k_16", label: "16 kappas (2⁴)" },
                            { val: "k_32", label: "32 kappas (2⁵)" },
                            { val: "k_64", label: "64 kappas (2⁶)" },
                        ];
                    }
                    else if (curPg === "rupa_j4") {
                        lifeOptions = [
                            { val: "k_500", label: "500 kappas" },
                            { val: "k_1000", label: "1.000 kappas (1k×2⁰)" },
                            { val: "k_2000", label: "2.000 kappas (1k×2¹)" },
                            { val: "k_4000", label: "4.000 kappas (1k×2²)" },
                            { val: "k_8000", label: "8.000 kappas (1k×2³)" },
                            { val: "k_16000", label: "16.000 kappas (1k×2⁴)" },
                        ];
                    }
                    else {
                        lifeOptions = [
                            { val: "k_20000", label: "20.000 kappas" },
                            { val: "k_40000", label: "40.000 kappas" },
                            { val: "k_60000", label: "60.000 kappas" },
                            { val: "k_84000", label: "84.000 kappas" },
                        ];
                    }
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
            ${renderRow(this.loc("2. Grupo de Planos (Bhūmi):", "2. Plane Group (Bhūmi):", "2. Grupo de Planos (Bhūmi):"), "planeGroup", pgOptions)}
            ${renderRow(this.loc("3. Posição na Escala:", "3. Position in Scale:", "3. Posición en la Escala:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Longevidade Canônica (Āyuppamāṇa):", "4. Canonical Lifespan (Āyuppamāṇa):", "4. Longevidad Canónica (Āyuppamāṇa):"), "lifespan", lifeOptions)}
          `;
                }
                if (currentTetrad === "patisandhi") {
                    const subtypeOptions = [
                        { val: "apaya_patisandhi", label: clean ? "Apāya-paṭisandhi" : "Apāya-paṭisandhi (#19)" },
                        { val: "kamasugati_patisandhi", label: clean ? "Kāmasugati-paṭisandhi" : "Kāmasugati-paṭisandhi (#27 + 8 Mahāvipāka)" },
                        { val: "rupa_patisandhi", label: clean ? "Rūpāvacara-paṭisandhi" : "Rūpāvacara-paṭisandhi (5 + Jīvitanavaka)" },
                        { val: "arupa_patisandhi", label: clean ? "Arūpāvacara-paṭisandhi" : "Arūpāvacara-paṭisandhi (4 Vipāka)" },
                        { val: "pat_ara_kama", label: this.loc("Objeto de Kāma-paṭisandhi", "Kāma-paṭisandhi Object", "Objeto de Kāma-paṭisandhi") },
                        { val: "pat_ara_mah", label: this.loc("Objeto de Rūpa/Arūpa", "Rūpa/Arūpa Object", "Objeto de Rūpa/Arūpa") },
                        { val: "pat_const3", label: this.loc("Tríade: Rūpa / Arūpa / Rūpārūpa", "Triad: Rūpa / Arūpa / Rūpārūpa", "Tríada: Rūpa / Arūpa / Rūpārūpa") },
                        { val: "ariya_plane_rules", label: this.loc("Restrições de Ariyas (Suddhāvāsa / Apāya)", "Ariya Plane Rules (Pure Abodes / Apāya)", "Restricciones de Ariyas (Suddhāvāsa / Apāya)") },
                        { val: "pat_bha_cuti_unity", label: "Paṭisandhi = Bhavaṅga = Cuti" },
                    ];
                    const countOptions = [1, 2, 3, 4, 5, 6, 9].map((n) => ({
                        val: n,
                        label: `${n}`,
                    }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
            ${renderRow(this.loc("2. Modo / Lei de Paṭisandhi:", "2. Paṭisandhi Mode / Law:", "2. Modo / Ley de Paṭisandhi:"), "subtype", subtypeOptions)}
            ${renderRow(this.loc("3. Contagem Canônica:", "3. Canonical Count:", "3. Conteo Canónico:"), "count", countOptions)}
          `;
                }
                if (currentTetrad === "kamma_16") {
                    const kgOptions = [
                        { val: "kicca", label: this.loc("1. Kicca (Por Função: 4)", "1. Kicca (By Function: 4)", "1. Kicca (Por Función: 4)") },
                        { val: "pakadana", label: this.loc("2. Pākadāna (Por Prioridade: 4)", "2. Pākadāna (By Priority: 4)", "2. Pākadāna (Por Prioridad: 4)") },
                        { val: "pakakala", label: this.loc("3. Pākakāla (Por Tempo: 4)", "3. Pākakāla (By Time: 4)", "3. Pākakāla (Por Tiempo: 4)") },
                        { val: "pakathana", label: this.loc("4. Pākaṭhāna (Por Plano)", "4. Pākaṭhāna (By Place)", "4. Pākaṭhāna (Por Lugar)") },
                        { val: "ripening", label: this.loc("5. Maturação (Vipāka & Brahmā)", "5. Ripening (Vipāka & Brahmā)", "5. Maduración (Vipāka y Brahmā)") },
                    ];
                    const curKg = String(sw.kammaGroup ?? "kicca");
                    let subOpts = [];
                    let cVals = [1, 2, 3, 4];
                    if (curKg === "kicca") {
                        subOpts = [
                            { val: "janaka", label: this.loc("Janaka (Gerador)", "Janaka (Reproductive)", "Janaka (Generador)") },
                            { val: "upatthambhaka", label: this.loc("Upatthambhaka (Sustentador)", "Upatthambhaka (Supportive)", "Upatthambhaka (Sustentador)") },
                            { val: "upapilaka", label: this.loc("Upapīḷaka (Obstrutivo)", "Upapīḷaka (Obstructive)", "Upapīḷaka (Obstructivo)") },
                            { val: "upaghataka", label: this.loc("Upaghātaka (Destrutivo)", "Upaghātaka (Destructive)", "Upaghātaka (Destructivo)") },
                        ];
                    }
                    else if (curKg === "pakadana") {
                        subOpts = [
                            { val: "garuka", label: this.loc("Garuka (Pesado)", "Garuka (Weighty)", "Garuka (Grave)") },
                            { val: "asanna", label: this.loc("Āsanna (Próximo à Morte)", "Āsanna (Death-Proximate)", "Āsanna (Cercano a la Muerte)") },
                            { val: "acinna", label: this.loc("Āciṇṇa (Habitual)", "Āciṇṇa (Habitual)", "Āciṇṇa (Habitual)") },
                            { val: "katatta", label: this.loc("Kaṭattā (Reserva)", "Kaṭattā (Reserve)", "Kaṭattā (Reserva)") },
                        ];
                    }
                    else if (curKg === "pakakala") {
                        subOpts = [
                            { val: "ditthadhamma", label: this.loc("Diṭṭhadhammavedanīya (Nesta Vida)", "Diṭṭhadhammavedanīya (This Life)", "Diṭṭhadhammavedanīya (Esta Vida)") },
                            { val: "upapajja", label: this.loc("Upapajjavedanīya (Próxima Vida)", "Upapajjavedanīya (Next Life)", "Upapajjavedanīya (Próxima Vida)") },
                            { val: "aparapariya", label: this.loc("Aparāpariyavedanīya (Vidas Futuras)", "Aparāpariyavedanīya (Subsequent)", "Aparāpariyavedanīya (Vidas Futuras)") },
                            { val: "ahosi", label: this.loc("Ahosi (Extinto)", "Ahosi (Defunct)", "Ahosi (Extinto)") },
                        ];
                    }
                    else if (curKg === "pakathana") {
                        subOpts = [
                            { val: "place_akusala", label: clean ? "Akusala" : "Akusala (12)" },
                            { val: "place_kama", label: clean ? "Kāmāvacara-kusala" : "Kāmāvacara-kusala (8)" },
                            { val: "place_rupa", label: clean ? "Rūpāvacara-kusala" : "Rūpāvacara-kusala (5)" },
                            { val: "place_arupa", label: clean ? "Arūpāvacara-kusala" : "Arūpāvacara-kusala (4)" },
                        ];
                        cVals = [12, 8, 5, 4];
                    }
                    else {
                        subOpts = [
                            { val: "rip_akusala", label: clean ? "Akusala-vipāka" : "Akusala (11→Apāya · 12→7)" },
                            { val: "rip_ti_ukk", label: clean ? "Tihetuka-ukkaṭṭha" : this.loc("Tihetuka Superior (16)", "Superior 3-Root (16)", "Tihetuka Superior (16)") },
                            { val: "rip_dvi_12", label: clean ? "Tihetuka-omaka / Dvihetuka-ukkaṭṭha" : this.loc("Tihetuka Inf. / Dvihetuka Sup. (12)", "Inferior 3-Root / Superior 2-Root (12)", "Tihetuka Inf. / Dvihetuka Sup. (12)") },
                            { val: "rip_ahe_8", label: clean ? "Dvihetuka-omaka" : this.loc("Dvihetuka Inferior (8)", "Inferior 2-Root (8)", "Dvihetuka Inferior (8)") },
                            { val: "kecana_12_10_8", label: clean ? "Kecana-vāda" : "Kecana-vāda (12/10/8)" },
                            { val: "jhana_degrees_9", label: clean ? "Paritta·Majjhima·Paṇīta" : this.loc("3 Graus × 3 Níveis Jhāna → 9 Planos", "3 Degrees × 3 Jhāna Tiers → 9 Planes", "3 Grados × 3 Niveles Jhāna → 9 Planos") },
                            { val: "jhana5_vehapphala", label: "Pañcamajjhāna → Vehapphala" },
                            { val: "sannaviraga_asanna", label: "Saññāvirāga → Asaññasatta" },
                            { val: "anagami_suddhavasa", label: "Anāgāmī → Suddhāvāsā" },
                        ];
                        cVals = [1, 5, 7, 8, 9, 10, 12, 16];
                    }
                    const cOpts = cVals.map((n) => ({
                        val: n,
                        label: curKg === "pakathana" || curKg === "ripening" ? `${n}` : `#${n}`,
                    }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
            ${renderRow(this.loc("2. Tétrade / Lei de Kamma:", "2. Kamma Tetrad / Law:", "2. Tétrada / Ley de Kamma:"), "kammaGroup", kgOptions)}
            ${renderRow(this.loc("3. Tipo Específico:", "3. Specific Type:", "3. Tipo Específico:"), "subtype", subOpts)}
            ${renderRow(this.loc("4. Ordem / Contagem Canônica:", "4. Order / Canonical Count:", "4. Orden / Conteo Canónico:"), "count", cOpts)}
          `;
                }
                if (currentTetrad === "kammapatha_20") {
                    const kpOptions = [
                        { val: "akusala_kaya", label: this.loc("Akusala: Kāyakamma (3 Corpo)", "Akusala: Kāyakamma (3 Body)", "Akusala: Kāyakamma (3 Cuerpo)") },
                        { val: "akusala_vaci", label: this.loc("Akusala: Vacīkamma (4 Fala)", "Akusala: Vacīkamma (4 Speech)", "Akusala: Vacīkamma (4 Habla)") },
                        { val: "akusala_mano", label: this.loc("Akusala: Manokamma (3 Mente)", "Akusala: Manokamma (3 Mind)", "Akusala: Manokamma (3 Mente)") },
                        { val: "punna_10", label: this.loc("10 Puññakiriyavatthus (Mérito)", "10 Puññakiriyavatthus (Merit)", "10 Puññakiriyavatthus (Mérito)") },
                    ];
                    const curKp = String(sw.kpathGroup ?? "akusala_kaya");
                    const maxS = curKp === "punna_10" ? 10 : curKp === "akusala_vaci" ? 4 : 3;
                    const slotOptions = Array.from({ length: maxS }, (_, i) => ({
                        val: i + 1,
                        label: this.loc(`Posição #${i + 1}`, `Position #${i + 1}`, `Posición #${i + 1}`),
                    }));
                    const rootOptions = curKp === "punna_10"
                        ? [
                            { val: "dana", label: this.loc("Pilar: Dāna (Generosidade)", "Pillar: Dāna (Giving)", "Pilar: Dāna (Generosidad)") },
                            { val: "sila", label: this.loc("Pilar: Sīla (Virtude)", "Pillar: Sīla (Virtue)", "Pilar: Sīla (Virtud)") },
                            { val: "bhavana", label: this.loc("Pilar: Bhāvanā (Desenvolvimento)", "Pillar: Bhāvanā (Development)", "Pilar: Bhāvanā (Desarrollo)") },
                        ]
                        : [
                            { val: "dosa", label: this.loc("Raiz Dosa (Aversão)", "Dosa Root (Hatred)", "Raíz Dosa (Aversión)") },
                            { val: "lobha", label: this.loc("Raiz Lobha (Apego)", "Lobha Root (Greed)", "Raíz Lobha (Apego)") },
                            { val: "two_roots", label: this.loc("2 Raízes (Lobha ou Dosa)", "2 Roots (Lobha or Dosa)", "2 Raíces (Lobha o Dosa)") },
                        ];
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
            ${renderRow(this.loc("2. Porta / Conjunto Ético:", "2. Door / Ethical Set:", "2. Puerta / Conjunto Ético:"), "kpathGroup", kpOptions)}
            ${renderRow(this.loc("3. Posição Canônica:", "3. Canonical Position:", "3. Posición Canónica:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Raiz (AS V.58–60) / Pilar (AS V.63):", "4. Root (AS V.58–60) / Pillar (AS V.63):", "4. Raíz (AS V.58–60) / Pilar (AS V.63):"), "root", rootOptions)}
          `;
                }
                const mGroupOptions = [
                    { val: "marana_4", label: this.loc("4 Maraṇuppattis (Causas da Morte)", "4 Maraṇuppattis (Causes of Death)", "4 Maraṇuppattis (Causas de Muerte)") },
                    { val: "nimitta_3", label: this.loc("3 Signos na Hora da Morte", "3 Signs at Death", "3 Signos en la Muerte") },
                    { val: "cuti_matrix", label: this.loc("Matriz Cuti → Paṭisandhi (AS V.98)", "Cuti → Paṭisandhi Matrix (AS V.98)", "Matriz Cuti → Paṭisandhi (AS V.98)") },
                ];
                const curMg = String(sw.mGroup ?? "marana_4");
                const mSubOptions = curMg === "marana_4"
                    ? [
                        { val: "ayukkhaya", label: "1. Āyukkhaya" },
                        { val: "kammakkhaya", label: "2. Kammakkhaya" },
                        { val: "ubhayakkhaya", label: "3. Ubhayakkhaya" },
                        { val: "upacchedaka", label: "4. Upacchedakakamma" },
                    ]
                    : curMg === "nimitta_3"
                        ? [
                            { val: "sign_kamma", label: "1. Kamma" },
                            { val: "sign_kammanimitta", label: "2. Kammanimitta" },
                            { val: "sign_gatinimitta", label: "3. Gatinimitta" },
                        ]
                        : [
                            { val: "cuti_arupa", label: "1. Arūpa-cuti" },
                            { val: "cuti_rupa", label: "2. Rūpa-cuti" },
                            { val: "cuti_kama3", label: "3. Kāma Tihetuka-cuti" },
                            { val: "cuti_kama_other", label: "4. Itara Kāma-cuti" },
                        ];
                const mRuleOptions = curMg === "marana_4"
                    ? [
                        { val: "wick_ends", label: this.loc("Símile: Pavio acaba (Āyu)", "Simile: Wick expires (Āyu)", "Símil: Mecha agotada (Āyu)") },
                        { val: "oil_ends", label: this.loc("Símile: Óleo acaba (Kamma)", "Simile: Oil expires (Kamma)", "Símil: Aceite agotado (Kamma)") },
                        { val: "both_end", label: this.loc("Símile: Pavio e Óleo acabam", "Simile: Wick & Oil expire", "Símil: Mecha y Aceite agotados") },
                        { val: "wind_gust", label: this.loc("Símile: Rajada de vento (Corte)", "Simile: Gust of wind (Cutoff)", "Símil: Ráfaga de viento (Corte)") },
                    ]
                    : curMg === "nimitta_3"
                        ? [
                            { val: "past_mind_only", label: this.loc("Passado · Só Porta Mental", "Past · Mind-Door Only", "Pasado · Solo Puerta Mental") },
                            { val: "six_doors_any", label: this.loc("6 Portas · Qualquer Tempo", "6 Doors · Any Time", "6 Puertas · Cualquier Tiempo") },
                            { val: "present_kama_only", label: this.loc("Presente · Só Kāmaloka", "Present · Kāmaloka Only", "Presente · Solo Kāmaloka") },
                        ]
                        : [
                            { val: "dest_arupa_kama3", label: this.loc("→ Arūpa Igual/Sup. ou Kāma 3r", "→ Same/Higher Arūpa or 3-Root Kāma", "→ Arūpa Igual/Sup. o Kāma 3r") },
                            { val: "dest_no_ahetuka", label: this.loc("→ Qualquer exceto Ahetuka", "→ Any except Rootless", "→ Cualquiera excepto Ahetuka") },
                            { val: "dest_all_4", label: this.loc("→ Todos os 4 Planos", "→ All 4 Planes", "→ Los 4 Planos") },
                            { val: "dest_kama_only", label: this.loc("→ Somente Kāmaloka", "→ Kāmaloka Only", "→ Solo Kāmaloka") },
                        ];
                return `
          ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
          ${renderRow(this.loc("2. Domínio de Morte / Transição:", "2. Death / Transition Domain:", "2. Dominio de Muerte / Transición:"), "mGroup", mGroupOptions)}
          ${renderRow(this.loc("3. Fator / Tipo:", "3. Factor / Type:", "3. Factor / Tipo:"), "subtype", mSubOptions)}
          ${renderRow(this.loc("4. Símile / Porta / Destino Canônico:", "4. Canonical Simile / Door / Destination:", "4. Símil / Puerta / Destino Canónico:"), "rule", mRuleOptions)}
        `;
            }
            case 6: {
                const secOptions = [
                    { val: "rupa_28", label: this.loc("1. 28 Rūpas Individuais (18+10)", "1. 28 Individual Rūpas (18+10)", "1. 28 Rūpas Individuales (18+10)") },
                    { val: "vibhaga_10", label: this.loc("2. 10 Díades & 4 Samuṭṭhānas", "2. 10 Dyads & 4 Origins", "2. 10 Díadas y 4 Orígenes") },
                    { val: "kalapa_21", label: this.loc("3. 21 Rūpakalāpas (Álgebra Octeto)", "3. 21 Rūpakalāpas (Octad Algebra)", "3. 21 Rūpakalāpas (Álgebra Octeto)") },
                    { val: "pavatti_nibbana", label: this.loc("4. Pavattikkama & Nibbāna", "4. Pavattikkama & Nibbāna", "4. Pavattikkama y Nibbāna") },
                    { val: "rupa_laws", label: this.loc("5. Leis de Rūpa & Nibbāna (11)", "5. Rūpa & Nibbāna Laws (11)", "5. Leyes de Rūpa y Nibbāna (11)") },
                ];
                const curSec = String(sw.section ?? "rupa_28");
                if (curSec === "rupa_laws") {
                    const lawOptions = [
                        { val: "univ_8", label: this.loc("8 Propriedades Universais (AS VI.18)", "8 Universal Properties (AS VI.18)", "8 Propiedades Universales (AS VI.18)") },
                        { val: "syn_5", label: this.loc("5 Sinônimos de Nipphanna (AS VI.11)", "5 Nipphanna Synonyms (AS VI.11)", "5 Sinónimos de Nipphanna (AS VI.11)") },
                        { val: "kamma_25", label: this.loc("Kammas Geradores de Matéria (AS VI.30)", "Matter-Generating Kammas (AS VI.30)", "Kammas Generadores de Materia (AS VI.30)") },
                        { val: "citta_75", label: this.loc("Cittas Geradoras de Matéria (AS VI.31)", "Matter-Generating Cittas (AS VI.31)", "Cittas Generadoras de Materia (AS VI.31)") },
                        { val: "vinnatti_32", label: this.loc("Cittas de Viññatti (AS VI.33)", "Viññatti-Generating Cittas (AS VI.33)", "Cittas de Viññatti (AS VI.33)") },
                        { val: "hasana_13", label: this.loc("Cittas de Riso / Hasana (AS VI.34)", "Laughter-Producing Cittas (AS VI.34)", "Cittas de Risa / Hasana (AS VI.34)") },
                        { val: "iriyapatha_26", label: this.loc("Appanā-javanas & Postura (AS VI.32)", "Appanā-javanas & Posture (AS VI.32)", "Appanā-javanas y Postura (AS VI.32)") },
                        { val: "birth_4", label: this.loc("4 Modos de Nascimento (AS VI.52)", "4 Birth Modes (AS VI.52)", "4 Modos de Nacimiento (AS VI.52)") },
                        { val: "ext_kalapa_2", label: this.loc("Kalāpas Externos / Inanimados (AS VI.50)", "External Inanimate Kalāpas (AS VI.50)", "Kalāpas Externos / Inanimados (AS VI.50)") },
                        { val: "nib_epithets_4", label: this.loc("Epítetos de Nibbāna (AS VI.65)", "Epithets of Nibbāna (AS VI.65)", "Epítetos de Nibbāna (AS VI.65)") },
                        { val: "jati_2", label: this.loc("Jāti-rūpa: Upacaya + Santati (AS VI.16)", "Jāti-rūpa: Upacaya + Santati (AS VI.16)", "Jāti-rūpa: Upacaya + Santati (AS VI.16)") },
                    ];
                    const valOpts = [2, 4, 5, 8, 13, 25, 26, 32, 75].map((n) => ({ val: n, label: `${n}` }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 6 (Rūpasaṅgaha):", "1. Ch. 6 Section (Rūpasaṅgaha):", "1. Sección del Cap. 6 (Rūpasaṅgaha):"), "section", secOptions)}
            ${renderRow(this.loc("2. Lei de Rūpa / Nibbāna:", "2. Rūpa / Nibbāna Law:", "2. Ley de Rūpa / Nibbāna:"), "law", lawOptions)}
            ${renderRow(this.loc("3. Valor Canônico:", "3. Canonical Value:", "3. Valor Canónico:"), "value", valOpts)}
          `;
                }
                if (curSec === "rupa_28") {
                    const headingOptions = [
                        { val: "mahabhuta", label: this.loc("1. Mahābhūta (4 Elementos)", "1. Mahābhūta (4 Primary)", "1. Mahābhūta (4 Elementos)") },
                        { val: "pasada", label: this.loc("2. Pasāda (5 Sentidos)", "2. Pasāda (5 Sensitivities)", "2. Pasāda (5 Sentidos)") },
                        { val: "gocara", label: this.loc("3. Gocara (4 Objetos + Tangível)", "3. Gocara (4 Objects + Tangible)", "3. Gocara (4 Objetos + Tangible)") },
                        { val: "bhava", label: this.loc("4. Bhāva (2 Sexos)", "4. Bhāva (2 Sexes)", "4. Bhāva (2 Sexos)") },
                        { val: "hadaya", label: this.loc("5. Hadaya (1 Base Cardíaca)", "5. Hadaya (1 Heart-Base)", "5. Hadaya (1 Base Cardíaca)") },
                        { val: "jivita", label: this.loc("6. Jīvita (1 Vida Material)", "6. Jīvita (1 Material Life)", "6. Jīvita (1 Vida Material)") },
                        { val: "ahara", label: this.loc("7. Āhāra (1 Nutrição / Ojā)", "7. Āhāra (1 Nutriment / Ojā)", "7. Āhāra (1 Nutrición / Ojā)") },
                        { val: "pariccheda", label: this.loc("8. Pariccheda (1 Espaço · Anip.)", "8. Pariccheda (1 Space · Anip.)", "8. Pariccheda (1 Espacio · Anip.)") },
                        { val: "vinnatti", label: this.loc("9. Viññatti (2 Intimações · Anip.)", "9. Viññatti (2 Intimations · Anip.)", "9. Viññatti (2 Intimaciones · Anip.)") },
                        { val: "vikara", label: this.loc("10. Vikāra (3 Mutabilidades · Anip.)", "10. Vikāra (3 Mutabilities · Anip.)", "10. Vikāra (3 Mutabilidades · Anip.)") },
                        { val: "lakkhana", label: this.loc("11. Lakkhaṇa (4 Fases · Anip.)", "11. Lakkhaṇa (4 Phases · Anip.)", "11. Lakkhaṇa (4 Fases · Anip.)") },
                    ];
                    const curH = String(sw.heading ?? "mahabhuta");
                    const maxMap = {
                        mahabhuta: 4, pasada: 5, gocara: 4, bhava: 2, hadaya: 1, jivita: 1, ahara: 1,
                        pariccheda: 1, vinnatti: 2, vikara: 3, lakkhana: 4,
                    };
                    const slotOptions = Array.from({ length: maxMap[curH] ?? 1 }, (_, i) => ({
                        val: i + 1,
                        label: this.loc(`Rūpa #${i + 1}`, `Rūpa #${i + 1}`, `Rūpa #${i + 1}`),
                    }));
                    const samOptions = [
                        { val: "catusamutthana", label: clean ? "4 Samuṭṭhāna" : this.loc("4 Origens (Kamma·Citta·Utu·Āhāra)", "4 Origins (Kamma·Citta·Utu·Āhāra)", "4 Orígenes (Kamma·Citta·Utu·Āhāra)") },
                        { val: "kammaja", label: clean ? "Kammaja" : this.loc("Só Kamma (8 Indriya + Hadaya)", "Kamma Only (8 Indriya + Hadaya)", "Solo Kamma (8 Indriya + Hadaya)") },
                        { val: "cittaja", label: clean ? "Cittaja" : this.loc("Só Citta (2 Viññatti)", "Citta Only (2 Viññatti)", "Solo Citta (2 Viññatti)") },
                        { val: "cittotuja", label: clean ? "Citta + Utu" : this.loc("Citta + Utu (Sadda / Som)", "Citta + Utu (Sadda / Sound)", "Citta + Utu (Sadda / Sonido)") },
                        { val: "utucittahara", label: clean ? "Utu + Citta + Āhāra" : this.loc("Utu + Citta + Āhāra (3 Vikāra)", "Utu + Citta + Āhāra (3 Vikāra)", "Utu + Citta + Āhāra (3 Vikāra)") },
                        { val: "none_lakkhana", label: clean ? "0 Samuṭṭhāna" : this.loc("0 Origens (4 Lakkhaṇa)", "0 Origins (4 Lakkhaṇa)", "0 Orígenes (4 Lakkhaṇa)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 6 (Rūpasaṅgaha):", "1. Ch. 6 Section (Rūpasaṅgaha):", "1. Sección del Cap. 6 (Rūpasaṅgaha):"), "section", secOptions)}
            ${renderRow(this.loc("2. Grupo Canônico (11 Títulos):", "2. Canonical Heading (11 Groups):", "2. Grupo Canónico (11 Títulos):"), "heading", headingOptions)}
            ${renderRow(this.loc("3. Posição no Grupo:", "3. Position in Heading:", "3. Posición en el Grupo:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Origem Causal (Rūpa-samuṭṭhāna):", "4. Causal Origin (Rūpa-samuṭṭhāna):", "4. Origen Causal (Rūpa-samuṭṭhāna):"), "samutthana", samOptions)}
          `;
                }
                if (curSec === "vibhaga_10") {
                    const dyadOptions = [
                        { val: "ajjhattika", label: this.loc("1. Ajjhattika (Interno) / Bāhira", "1. Ajjhattika (Internal) / External", "1. Ajjhattika (Interno) / Bāhira") },
                        { val: "vatthu_r", label: this.loc("2. Vatthu (Base) / Avatthu", "2. Vatthu (Base) / Non-Base", "2. Vatthu (Base) / Avatthu") },
                        { val: "dvara_r", label: this.loc("3. Dvāra (Porta) / Advāra", "3. Dvāra (Door) / Non-Door", "3. Dvāra (Puerta) / Advāra") },
                        { val: "indriya_r", label: this.loc("4. Indriya (Faculdade) / Anindriya", "4. Indriya (Faculty) / Non-Faculty", "4. Indriya (Facultad) / Anindriya") },
                        { val: "olarika", label: this.loc("5. Oḷārika (Grosseiro) / Sukhuma", "5. Oḷārika (Gross) / Subtle", "5. Oḷārika (Burdo) / Sukhuma") },
                        { val: "upadinna", label: this.loc("6. Upādinna (Kamma) / Anupādinna", "6. Upādinna (Grasped) / Ungrasped", "6. Upādinna (Aprehendido) / Anupādinna") },
                        { val: "sanidassana", label: this.loc("7. Sanidassana (Visível) / Anidassana", "7. Sanidassana (Visible) / Invisible", "7. Sanidassana (Visible) / Anidassana") },
                        { val: "gocaraggahika", label: this.loc("8. Gocaraggāhika (2 Asamp. + 3 Samp.)", "8. Gocaraggāhika (2 Non-cont. + 3 Cont.)", "8. Gocaraggāhika (2 Asamp. + 3 Samp.)") },
                        { val: "avinibbhoga", label: this.loc("9. Avinibbhoga (Octeto) / Vinibbhoga", "9. Avinibbhoga (Octad) / Separable", "9. Avinibbhoga (Octeto) / Vinibbhoga") },
                        { val: "nipphanna_d", label: this.loc("10. Nipphanna (Concreto) / Anipphanna", "10. Nipphanna (Concrete) / Anipphanna", "10. Nipphanna (Concreto) / Anipphanna") },
                        { val: "sam_kamma", label: this.loc("Origem: Kammasamuṭṭhāna", "Origin: Kammasamuṭṭhāna", "Origen: Kammasamuṭṭhāna") },
                        { val: "sam_citta", label: this.loc("Origem: Cittasamuṭṭhāna", "Origin: Cittasamuṭṭhāna", "Origen: Cittasamuṭṭhāna") },
                        { val: "sam_utu", label: this.loc("Origem: Utusamuṭṭhāna", "Origin: Utusamuṭṭhāna", "Origen: Utusamuṭṭhāna") },
                        { val: "sam_ahara", label: this.loc("Origem: Āhārasamuṭṭhāna", "Origin: Āhārasamuṭṭhāna", "Origen: Āhārasamuṭṭhāna") },
                    ];
                    const countOptions = [1, 5, 6, 7, 8, 12, 13, 15, 18].map((n) => ({
                        val: n,
                        label: n === 1 ? "1 Rūpa" : `${n} Rūpas`,
                    }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 6 (Rūpasaṅgaha):", "1. Ch. 6 Section (Rūpasaṅgaha):", "1. Sección del Cap. 6 (Rūpasaṅgaha):"), "section", secOptions)}
            ${renderRow(this.loc("2. Díade (Rūpavibhāga) / Origem (Samuṭṭhāna):", "2. Dyad (Rūpavibhāga) / Origin (Samuṭṭhāna):", "2. Díada (Rūpavibhāga) / Origen (Samuṭṭhāna):"), "dyad", dyadOptions)}
            ${renderRow(this.loc("3. Contagem de Rūpas:", "3. Rūpa Count:", "3. Conteo de Rūpas:"), "count", countOptions)}
          `;
                }
                if (curSec === "kalapa_21") {
                    const originOptions = [
                        { val: "kamma", label: clean ? "Kamma (9)" : this.loc("Kamma (9 Kalāpas: 8 Décadas + 1 Nônada)", "Kamma (9 Kalāpas: 8 Decads + 1 Nonad)", "Kamma (9 Kalāpas: 8 Décadas + 1 Nónada)") },
                        { val: "citta", label: clean ? "Citta (6)" : this.loc("Citta (6 Kalāpas: 3×2 · 8 a 13 Rūpas)", "Citta (6 Kalāpas: 3×2 · 8 to 13 Rūpas)", "Citta (6 Kalāpas: 3×2 · 8 a 13 Rūpas)") },
                        { val: "utu", label: clean ? "Utu (4)" : this.loc("Utu (4 Kalāpas: 2×2 · 2 Externos)", "Utu (4 Kalāpas: 2×2 · 2 External)", "Utu (4 Kalāpas: 2×2 · 2 Externos)") },
                        { val: "ahara", label: clean ? "Āhāra (2)" : this.loc("Āhāra (2 Kalāpas: 1×2 · 8 e 11)", "Āhāra (2 Kalāpas: 1×2 · 8 & 11)", "Āhāra (2 Kalāpas: 1×2 · 8 y 11)") },
                    ];
                    const curOrg = String(sw.origin ?? "kamma");
                    const maxSlot = curOrg === "kamma" ? 9 : curOrg === "citta" ? 6 : curOrg === "utu" ? 4 : 2;
                    const slotOptions = Array.from({ length: maxSlot }, (_, i) => ({
                        val: i + 1,
                        label: `Kalāpa #${i + 1}`,
                    }));
                    const sizes = curOrg === "kamma"
                        ? [9, 10]
                        : curOrg === "citta"
                            ? [8, 9, 10, 11, 12, 13]
                            : curOrg === "utu"
                                ? [8, 9, 11, 12]
                                : [8, 11];
                    const sizeOptions = sizes.map((n) => ({
                        val: n,
                        label: `${n} Rūpas`,
                    }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 6 (Rūpasaṅgaha):", "1. Ch. 6 Section (Rūpasaṅgaha):", "1. Sección del Cap. 6 (Rūpasaṅgaha):"), "section", secOptions)}
            ${renderRow(this.loc("2. Origem do Kalāpa (9+6+4+2 = 21):", "2. Kalāpa Origin (9+6+4+2 = 21):", "2. Origen del Kalāpa (9+6+4+2 = 21):"), "origin", originOptions)}
            ${renderRow(this.loc("3. Índice do Kalāpa:", "3. Kalāpa Index:", "3. Índice del Kalāpa:"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Tamanho (Álgebra do Octeto ★8 + Δ):", "4. Size (Octad Algebra ★8 + Δ):", "4. Tamaño (Álgebra del Octeto ★8 + Δ):"), "size", sizeOptions)}
          `;
                }
                const topicOptions = [
                    { val: "pav_kama", label: this.loc("Pavatti: Kāmaloka", "Pavatti: Kāmaloka", "Pavatti: Kāmaloka") },
                    { val: "pav_rupa", label: this.loc("Pavatti: Rūpaloka", "Pavatti: Rūpaloka", "Pavatti: Rūpaloka") },
                    { val: "pav_asanna", label: this.loc("Pavatti: Asaññasatta", "Pavatti: Asaññasatta", "Pavatti: Asaññasatta") },
                    { val: "pav_arupa", label: this.loc("Pavatti: Arūpaloka", "Pavatti: Arūpaloka", "Pavatti: Arūpaloka") },
                    { val: "pav_start4", label: this.loc("Cronologia dos Inícios (AS VI.55)", "Timeline of Starts (AS VI.55)", "Cronología de Inicios (AS VI.55)") },
                    { val: "pav_death17", label: this.loc("Cessação na Morte (AS VI.56)", "Cessation at Death (AS VI.56)", "Cesación en la Muerte (AS VI.56)") },
                    { val: "pav_absent4", label: this.loc("Ausentes em Paṭisandhi (AS VI.61)", "Absent at Rebirth (AS VI.61)", "Ausentes en Paṭisandhi (AS VI.61)") },
                    { val: "nib_one", label: this.loc("Nibbāna: Natureza Única (Asaṅkhata)", "Nibbāna: Single Nature (Unconditioned)", "Nibbāna: Naturaleza Única (Asaṅkhata)") },
                    { val: "nib_two", label: this.loc("Nibbāna: Modos (Sa/Anupādisesa)", "Nibbāna: Modes (Sa/Anupādisesa)", "Nibbāna: Modos (Sa/Anupādisesa)") },
                    { val: "nib_three", label: this.loc("Nibbāna: Aspectos (Suññata/Animitta/Appaṇihita)", "Nibbāna: Aspects (Empty/Signless/Undirected)", "Nibbāna: Aspectos (Vacío/Sin-Signo/Sin-Deseo)") },
                ];
                const valueOptions = [0, 1, 2, 3, 4, 17, 23, 28].map((n) => ({
                    val: n,
                    label: `${n}`,
                }));
                return `
          ${renderRow(this.loc("1. Seção do Cap. 6 (Rūpasaṅgaha):", "1. Ch. 6 Section (Rūpasaṅgaha):", "1. Sección del Cap. 6 (Rūpasaṅgaha):"), "section", secOptions)}
          ${renderRow(this.loc("2. Lei de Pavatti / Aspecto de Nibbāna:", "2. Pavatti Law / Nibbāna Aspect:", "2. Ley de Pavatti / Aspecto de Nibbāna:"), "topic", topicOptions)}
          ${renderRow(this.loc("3. Valor Canônico (Rūpas / Momentos / Modos):", "3. Canonical Value (Rūpas / Moments / Modes):", "3. Valor Canónico (Rūpas / Momentos / Modos):"), "value", valueOptions)}
        `;
            }
            case 7: {
                const compOptions = [
                    { val: "akusala_9", label: this.loc("1. Akusala-saṅgaha (9 Grupos)", "1. Akusala-saṅgaha (9 Groups)", "1. Akusala-saṅgaha (9 Grupos)") },
                    { val: "akusala_members", label: this.loc("2. Akusala Granular (34 Membros)", "2. Akusala Granular (34 Members)", "2. Akusala Granular (34 Miembros)") },
                    { val: "missaka_7", label: this.loc("3. Missaka-saṅgaha (7 Grupos)", "3. Missaka-saṅgaha (7 Groups)", "3. Missaka-saṅgaha (7 Grupos)") },
                    { val: "missaka_members", label: this.loc("4. Missaka Granular (51 Membros)", "4. Missaka Granular (51 Members)", "4. Missaka Granular (51 Miembros)") },
                    { val: "bodhipakkhiya_21", label: this.loc("5. Bodhipakkhiya (7 Grupos & 14 Sabhāva)", "5. Bodhipakkhiya (7 Groups & 14 Sabhāva)", "5. Bodhipakkhiya (7 Grupos y 14 Sabhāva)") },
                    { val: "bodhi_37", label: this.loc("6. 37 Bodhipakkhiyas Individuais", "6. 37 Individual Bodhipakkhiyas", "6. 37 Bodhipakkhiyas Individuales") },
                    { val: "sabba_7", label: this.loc("7. Sabba-saṅgaha (5 Sínteses)", "7. Sabba-saṅgaha (5 Syntheses)", "7. Sabba-saṅgaha (5 Síntesis)") },
                    { val: "sabba_members", label: this.loc("8. Sabba Granular (28 Membros)", "8. Sabba Granular (28 Members)", "8. Sabba Granular (28 Miembros)") },
                ];
                const currentComp = String(sw.compendium ?? "akusala_9");
                if (currentComp === "akusala_members") {
                    const akSetOpts = [
                        { val: "asava_ogha_yoga", label: "Āsava · Ogha · Yoga (4)" },
                        { val: "gantha", label: "Gantha (4)" },
                        { val: "upadana", label: "Upādāna (4)" },
                        { val: "nivarana", label: "Nīvaraṇa (6)" },
                        { val: "anusaya", label: "Anusaya (7)" },
                        { val: "samyojana_delta", label: "Saṃyojana: Suttanta vs. Abhidhamma (6)" },
                        { val: "kilesa_extra", label: "Kilesa Extras (3)" },
                    ];
                    const curSet = String(sw.akSet ?? "asava_ogha_yoga");
                    const maxMap = {
                        asava_ogha_yoga: 4, gantha: 4, upadana: 4, nivarana: 6, anusaya: 7, samyojana_delta: 6, kilesa_extra: 3,
                    };
                    const slotOpts = Array.from({ length: maxMap[curSet] ?? 4 }, (_, i) => ({
                        val: i + 1,
                        label: `#${i + 1}`,
                    }));
                    const realOpts = [
                        { val: "lobha", label: "Lobha" },
                        { val: "dosa", label: "Dosa" },
                        { val: "moha", label: "Moha" },
                        { val: "ditthi", label: "Diṭṭhi" },
                        { val: "mana", label: "Māna" },
                        { val: "vicikiccha", label: "Vicikicchā" },
                        { val: "thina", label: "Thīna" },
                        { val: "thina_middha", label: "Thīna + Middha (2)" },
                        { val: "uddhacca", label: "Uddhacca" },
                        { val: "uddhacca_kukkucca", label: "Uddhacca + Kukkucca (2)" },
                        { val: "issa", label: "Issā" },
                        { val: "macchariya", label: "Macchariya" },
                        { val: "ahirika", label: "Ahirika" },
                        { val: "anottappa", label: "Anottappa" },
                    ];
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Conjunto Insalubre:", "2. Unwholesome Set:", "2. Conjunto Akusala:"), "akSet", akSetOpts)}
            ${renderRow(this.loc("3. Posição do Membro:", "3. Member Position:", "3. Posición del Miembro:"), "slot", slotOpts)}
            ${renderRow(this.loc("4. Dhamma Real (Vatthuto — AS VII.13–14):", "4. Real Dhamma (Vatthuto — AS VII.13–14):", "4. Dhamma Real (Vatthuto — AS VII.13–14):"), "realDhamma", realOpts)}
          `;
                }
                if (currentComp === "missaka_members") {
                    const miSetOpts = [
                        { val: "indriya22", label: "22 Indriyāni" },
                        { val: "magganga12", label: "12 Maggaṅgāni" },
                        { val: "bala_extra", label: "Bala 6–9 (4 Extras)" },
                        { val: "adhipati4", label: "4 Adhipatī" },
                        { val: "ahara4", label: "4 Āhārā" },
                        { val: "excl_laws5", label: this.loc("5 Leis de Exclusão (AS VII.26–28)", "5 Exclusion Laws (AS VII.26–28)", "5 Leyes de Exclusión (AS VII.26–28)") },
                    ];
                    const curSet = String(sw.miSet ?? "indriya22");
                    const maxMap = {
                        indriya22: 22, magganga12: 12, bala_extra: 4, adhipati4: 4, ahara4: 4, excl_laws5: 5,
                    };
                    const slotOpts = Array.from({ length: maxMap[curSet] ?? 4 }, (_, i) => ({
                        val: i + 1,
                        label: `#${i + 1}`,
                    }));
                    const classBySet = {
                        indriya22: [
                            { val: "pasada_5", label: "5 Pasādarūpa" },
                            { val: "bhava_2", label: "2 Bhāvarūpa" },
                            { val: "jivita_2", label: "Jīvita (Rūpa + Nāma = 2)" },
                            { val: "citta_1", label: "Citta (1)" },
                            { val: "vedana_5", label: "5 → 1 Vedanā" },
                            { val: "sobhana_5", label: "5 Indriya (Saddhā..Paññā)" },
                            { val: "lokuttara_panna_3", label: "3 Lokuttara → Paññā" },
                        ],
                        magganga12: [
                            { val: "panna", label: "Paññā" },
                            { val: "vitakka", label: "Vitakka" },
                            { val: "virati_3", label: "3 Virati" },
                            { val: "viriya", label: "Vīriya" },
                            { val: "sati", label: "Sati" },
                            { val: "ekaggata", label: "Ekaggatā" },
                            { val: "ditthi", label: "Diṭṭhi" },
                        ],
                        bala_extra: [
                            { val: "hiri_ottappa", label: "Hiri / Ottappa (Sobhana)" },
                            { val: "ahirika_anottappa", label: "Ahirika / Anottappa (Akusala)" },
                        ],
                        adhipati4: [
                            { val: "chanda", label: "Chanda" },
                            { val: "viriya", label: "Vīriya" },
                            { val: "citta_1", label: "Citta (1)" },
                            { val: "panna", label: "Paññā" },
                        ],
                        ahara4: [
                            { val: "oja_rupa", label: "Ojā (Rūpa)" },
                            { val: "phassa", label: "Phassa" },
                            { val: "cetana", label: "Cetanā" },
                            { val: "citta_1", label: "Citta (1)" },
                        ],
                        excl_laws5: [
                            { val: "no_jhananga_10", label: "10 Sentidos → 0 Jhānaṅga" },
                            { val: "no_bala_16", label: "16 Avīriya → 0 Bala" },
                            { val: "no_magga_18", label: "18 Ahetuka → 0 Maggaṅga" },
                            { val: "doubt_ekaggata", label: "#11 Vicikicchā (Ekaggatā)" },
                            { val: "one_adhipati", label: "1 Adhipati / 52 Javana" },
                        ],
                    };
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Conjunto Misto (Missaka):", "2. Mixed Set (Missaka):", "2. Conjunto Mixto (Missaka):"), "miSet", miSetOpts)}
            ${renderRow(this.loc("3. Posição do Membro:", "3. Member Position:", "3. Posición del Miembro:"), "slot", slotOpts)}
            ${renderRow(this.loc("4. Redução / Classe Real (Vatthuto):", "4. Real Reduction / Class (Vatthuto):", "4. Reducción / Clase Real (Vatthuto):"), "realClass", classBySet[curSet] ?? classBySet.indriya22)}
          `;
                }
                if (currentComp === "bodhi_37") {
                    const bGroupOpts = [
                        { val: "satipatthana", label: "1. Satipaṭṭhāna (4)" },
                        { val: "sammappadhana", label: "2. Sammappadhāna (4)" },
                        { val: "iddhipada", label: "3. Iddhipāda (4)" },
                        { val: "indriya5", label: "4. Indriya (5)" },
                        { val: "bala5", label: "5. Bala (5)" },
                        { val: "bojjhanga", label: "6. Bojjhaṅga (7)" },
                        { val: "magganga", label: "7. Maggaṅga (8)" },
                    ];
                    const curBg = String(sw.bGroup ?? "satipatthana");
                    const maxMap = {
                        satipatthana: 4, sammappadhana: 4, iddhipada: 4, indriya5: 5, bala5: 5, bojjhanga: 7, magganga: 8,
                    };
                    const slotOpts = Array.from({ length: maxMap[curBg] ?? 4 }, (_, i) => ({
                        val: i + 1,
                        label: `#${i + 1}`,
                    }));
                    const sabhavaOpts = [
                        { val: "viriya", label: "Vīriya" },
                        { val: "sati", label: "Sati" },
                        { val: "panna", label: "Paññā" },
                        { val: "samadhi", label: "Samādhi (Ekaggatā)" },
                        { val: "saddha", label: "Saddhā" },
                        { val: "vitakka", label: "Vitakka (Saṅkappa)" },
                        { val: "passaddhi", label: "Passaddhi" },
                        { val: "piti", label: "Pīti" },
                        { val: "upekkha", label: "Upekkhā (Tatramajjhattatā)" },
                        { val: "chanda", label: "Chanda" },
                        { val: "citta", label: "Citta" },
                        { val: "sammavaca", label: "Sammāvācā" },
                        { val: "sammakammanta", label: "Sammākammanta" },
                        { val: "samma_ajiva", label: "Sammā-ājīva" },
                    ];
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Grupo Bodhipakkhiya (7 Grupos = 37):", "2. Bodhipakkhiya Group (7 Groups = 37):", "2. Grupo Bodhipakkhiya (7 Grupos = 37):"), "bGroup", bGroupOpts)}
            ${renderRow(this.loc("3. Fator no Grupo:", "3. Factor in Group:", "3. Factor en el Grupo:"), "slot", slotOpts)}
            ${renderRow(this.loc("4. Sabhāva-dhamma Real (14 — AS VII.37–40):", "4. Real Sabhāva-dhamma (14 — AS VII.37–40):", "4. Sabhāva-dhamma Real (14 — AS VII.37–40):"), "sabhava", sabhavaOpts)}
          `;
                }
                if (currentComp === "sabba_members") {
                    const sbSetOpts = [
                        { val: "khandha5", label: "5 Khandhā" },
                        { val: "ayatana12", label: "12 Āyatanāni" },
                        { val: "vinnana_dhatu7", label: "7 Viññāṇadhātuyo" },
                        { val: "ariyasacca4", label: "4 Ariyasaccāni" },
                    ];
                    const curSet = String(sw.sbSet ?? "khandha5");
                    const maxMap = {
                        khandha5: 5, ayatana12: 12, vinnana_dhatu7: 7, ariyasacca4: 4,
                    };
                    const slotOpts = Array.from({ length: maxMap[curSet] ?? 5 }, (_, i) => ({
                        val: i + 1,
                        label: `#${i + 1}`,
                    }));
                    const mapBySet = {
                        khandha5: [
                            { val: "rupa_28", label: "28 Rūpa" },
                            { val: "vedana_1", label: "Vedanā (1)" },
                            { val: "sanna_1", label: "Saññā (1)" },
                            { val: "sankhara_50", label: "Saṅkhāra (50)" },
                            { val: "citta_89", label: "Citta (89 / 121)" },
                        ],
                        ayatana12: [
                            { val: "pasada_1", label: "Pasādarūpa (1)" },
                            { val: "citta_89", label: "Citta (89 / 121)" },
                            { val: "gocara_1", label: "Gocararūpa (1)" },
                            { val: "bhuta_3", label: "3 Mahābhūta (Pathavī·Tejo·Vāyo)" },
                            { val: "dhamma_69", label: "69 (52+16+1)" },
                        ],
                        vinnana_dhatu7: [
                            { val: "sense_pair_2", label: "Par Sensorial (2)" },
                            { val: "manodhatu_3", label: "Manodhātu (3)" },
                            { val: "manovinnana_76", label: "Manoviññāṇadhātu (76)" },
                        ],
                        ariyasacca4: [
                            { val: "tebhumaka_excl_lobha", label: "81 Citta + 51 Cet + 28 Rūpa" },
                            { val: "lobha_tanha", label: "Lobha / Taṇhā (1)" },
                            { val: "nibbana_1", label: "Nibbāna (1)" },
                            { val: "magga_factors_8", label: "8 Maggaṅga (4 Magga)" },
                        ],
                    };
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Conjunto Universal (Sabba):", "2. Universal Set (Sabba):", "2. Conjunto Universal (Sabba):"), "sbSet", sbSetOpts)}
            ${renderRow(this.loc("3. Posição do Membro:", "3. Member Position:", "3. Posición del Miembro:"), "slot", slotOpts)}
            ${renderRow(this.loc("4. Equivalência em Paramatthas:", "4. Paramattha Equivalence:", "4. Equivalencia en Paramatthas:"), "paramatthaMap", mapBySet[curSet] ?? mapBySet.khandha5)}
          `;
                }
                if (currentComp === "akusala_9") {
                    const groupOptions = [
                        { val: "asava", label: this.loc("1. 4 Āsavā (Efluências)", "1. 4 Āsavā (Taints)", "1. 4 Āsavā (Efluencias)") },
                        { val: "ogha", label: this.loc("2. 4 Oghā (Inundações)", "2. 4 Oghā (Floods)", "2. 4 Oghā (Torrentes)") },
                        { val: "yoga", label: this.loc("3. 4 Yogā (Jugos)", "3. 4 Yogā (Yokes)", "3. 4 Yogā (Yugos)") },
                        { val: "gantha", label: this.loc("4. 4 Ganthā (Nós)", "4. 4 Ganthā (Knots)", "4. 4 Ganthā (Nudos)") },
                        { val: "upadana", label: this.loc("5. 4 Upādānā (Apegos)", "5. 4 Upādānā (Clingings)", "5. 4 Upādānā (Aferramientos)") },
                        { val: "nivarana", label: this.loc("6. 6 Nīvaraṇāni (Obstáculos)", "6. 6 Nīvaraṇāni (Hindrances)", "6. 6 Nīvaraṇāni (Obstáculos)") },
                        { val: "anusaya", label: this.loc("7. 7 Anusayā (Tendências)", "7. 7 Anusayā (Underlying Tendencies)", "7. 7 Anusayā (Tendencias)") },
                        { val: "samyojana_sutta", label: this.loc("8a. 10 Saṃyojanāni (Suttanta)", "8a. 10 Saṃyojanāni (Suttanta)", "8a. 10 Saṃyojanāni (Suttanta)") },
                        { val: "samyojana_abhi", label: this.loc("8b. 10 Saṃyojanāni (Abhidhamma · União)", "8b. 10 Saṃyojanāni (Abhidhamma · Union)", "8b. 10 Saṃyojanāni (Abhidhamma · Unión)") },
                        { val: "kilesa", label: this.loc("9. 10 Kilesā (Impurezas)", "9. 10 Kilesā (Defilements)", "9. 10 Kilesā (Impurezas)") },
                    ];
                    const vatOpts = [2, 3, 6, 7, 8, 9, 10].map((n) => ({
                        val: n,
                        label: `${n} Vatthuto`,
                    }));
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Grupo Insalubre (9 Grupos):", "2. Unwholesome Group (9 Groups):", "2. Grupo Inhábil (9 Grupos):"), "group", groupOptions)}
            ${renderRow(this.loc("3. Redução Real (Vatthuto — AS VII.14):", "3. Real Reduction (Vatthuto — AS VII.14):", "3. Reducción Real (Vatthuto — AS VII.14):"), "vatthuto", vatOpts)}
          `;
                }
                if (currentComp === "missaka_7") {
                    const groupOptions = [
                        { val: "hetu6", label: this.loc("1. 6 Hetū (Raízes)", "1. 6 Hetū (Roots)", "1. 6 Hetū (Raíces)") },
                        { val: "jhananga", label: this.loc("2. 7 Jhānaṅgāni (Fatores de Jhāna)", "2. 7 Jhānaṅgāni (Jhāna Factors)", "2. 7 Jhānaṅgāni (Factores de Jhāna)") },
                        { val: "magganga12", label: this.loc("3. 12 Maggaṅgāni (8 Nobres + 4 Errôneos)", "3. 12 Maggaṅgāni (8 Right + 4 Wrong)", "3. 12 Maggaṅgāni (8 Rectos + 4 Erróneos)") },
                        { val: "indriya22", label: this.loc("4. 22 Indriyāni (Faculdades)", "4. 22 Indriyāni (Faculties)", "4. 22 Indriyāni (Facultades)") },
                        { val: "bala9", label: this.loc("5. 9 Balāni (Poderes)", "5. 9 Balāni (Powers)", "5. 9 Balāni (Poderes)") },
                        { val: "adhipati4", label: this.loc("6. 4 Adhipatī (Predominâncias)", "6. 4 Adhipatī (Predominances)", "6. 4 Adhipatī (Predominancias)") },
                        { val: "ahara4", label: this.loc("7. 4 Āhārā (Alimentos)", "7. 4 Āhārā (Nutriments)", "7. 4 Āhārā (Alimentos)") },
                        { val: "missaka_laws", label: this.loc("Leis de Exclusão (AS VII.26–28)", "Exclusion Laws (AS VII.26–28)", "Leyes de Exclusión (AS VII.26–28)") },
                    ];
                    const vatOpts = [4, 5, 6, 9, 16].map((n) => ({
                        val: n,
                        label: `${n} Vatthuto`,
                    }));
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Grupo Misto (7 Grupos + Leis):", "2. Mixed Group (7 Groups + Laws):", "2. Grupo Mixto (7 Grupos + Leyes):"), "group", groupOptions)}
            ${renderRow(this.loc("3. Redução Real (Vatthuto — AS VII.29):", "3. Real Reduction (Vatthuto — AS VII.29):", "3. Reducción Real (Vatthuto — AS VII.29):"), "vatthuto", vatOpts)}
          `;
                }
                if (currentComp === "bodhipakkhiya_21") {
                    const modeOpts = [
                        { val: "groups", label: this.loc("7 Grupos (4+4+4+5+5+7+8 = 37)", "7 Groups (4+4+4+5+5+7+8 = 37)", "7 Grupos (4+4+4+5+5+7+8 = 37)") },
                        { val: "sabhava14", label: this.loc("14 Sabhāva-dhammas (9, 8, 5, 4, 2, 9×1)", "14 Sabhāva-dhammas (9, 8, 5, 4, 2, 9×1)", "14 Sabhāva-dhammas (9, 8, 5, 4, 2, 9×1)") },
                    ];
                    const curMode = String(sw.bodhiMode ?? "groups");
                    let itemOpts = [];
                    let cVals = [];
                    if (curMode === "groups") {
                        itemOpts = [
                            { val: "satipatthana", label: clean ? "1. Satipaṭṭhāna" : this.loc("1. 4 Satipaṭṭhānā (Atenção Plena)", "1. 4 Satipaṭṭhānā (Mindfulness)", "1. 4 Satipaṭṭhānā (Atención Plena)") },
                            { val: "sammappadhana", label: clean ? "2. Sammappadhāna" : this.loc("2. 4 Sammappadhānā (Esforços)", "2. 4 Sammappadhānā (Right Strivings)", "2. 4 Sammappadhānā (Esfuerzos)") },
                            { val: "iddhipada", label: clean ? "3. Iddhipāda" : this.loc("3. 4 Iddhipādā (Bases do Poder)", "3. 4 Iddhipādā (Bases of Power)", "3. 4 Iddhipādā (Bases del Poder)") },
                            { val: "indriya5", label: clean ? "4. Indriya" : this.loc("4. 5 Indriyāni (Faculdades)", "4. 5 Indriyāni (Faculties)", "4. 5 Indriyāni (Facultades)") },
                            { val: "bala5", label: clean ? "5. Bala" : this.loc("5. 5 Balāni (Poderes)", "5. 5 Balāni (Powers)", "5. 5 Balāni (Poderes)") },
                            { val: "bojjhanga", label: clean ? "6. Bojjhaṅga" : this.loc("6. 7 Bojjhaṅgā (Iluminação)", "6. 7 Bojjhaṅgā (Enlightenment)", "6. 7 Bojjhaṅgā (Iluminación)") },
                            { val: "magganga", label: clean ? "7. Maggaṅga" : this.loc("7. 8 Maggaṅgāni (Caminho Óctuplo)", "7. 8 Maggaṅgāni (Eightfold Path)", "7. 8 Maggaṅgāni (Óctuple Sendero)") },
                        ];
                        cVals = [4, 5, 7, 8];
                    }
                    else {
                        itemOpts = [
                            { val: "sb_viriya", label: "1. Vīriya" },
                            { val: "sb_sati", label: "2. Sati" },
                            { val: "sb_panna", label: "3. Paññā" },
                            { val: "sb_samadhi", label: "4. Samādhi" },
                            { val: "sb_saddha", label: "5. Saddhā" },
                            { val: "sb_sankappa", label: "6. Sammāsaṅkappa" },
                            { val: "sb_passaddhi", label: "7. Passaddhi" },
                            { val: "sb_piti", label: "8. Pīti" },
                            { val: "sb_upekkha", label: "9. Upekkhā" },
                            { val: "sb_chanda", label: "10. Chanda" },
                            { val: "sb_citta", label: "11. Citta" },
                            { val: "sb_vaca", label: "12. Sammāvācā" },
                            { val: "sb_kammanta", label: "13. Sammākammanta" },
                            { val: "sb_ajiva", label: "14. Sammā-ājīva" },
                        ];
                        cVals = [1, 2, 4, 5, 8, 9];
                    }
                    const cOpts = cVals.map((n) => ({
                        val: n,
                        label: curMode === "sabhava14" ? `${n} Ṭhāna` : this.loc(`${n} Fatores`, `${n} Factors`, `${n} Factores`),
                    }));
                    return `
            ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
            ${renderRow(this.loc("2. Eixo Bodhipakkhiya:", "2. Bodhipakkhiya Axis:", "2. Eje Bodhipakkhiya:"), "bodhiMode", modeOpts)}
            ${renderRow(this.loc("3. Grupo / Sabhāva-dhamma:", "3. Group / Sabhāva-dhamma:", "3. Grupo / Sabhāva-dhamma:"), "item", itemOpts)}
            ${renderRow(this.loc("4. Contagem / Multiplicidade (Ṭhāna):", "4. Count / Multiplicity (Ṭhāna):", "4. Conteo / Multiplicidad (Ṭhāna):"), "count", cOpts)}
          `;
                }
                const sabbaOpts = [
                    { val: "khandha", label: clean ? "1. Khandhā" : this.loc("1. 5 Khandhā (Agregados)", "1. 5 Khandhā (Aggregates)", "1. 5 Khandhā (Agregados)") },
                    { val: "upadanakkhandha", label: clean ? "2. Upādānakkhandhā" : this.loc("2. 5 Upādānakkhandhā (De Apego)", "2. 5 Upādānakkhandhā (Of Clinging)", "2. 5 Upādānakkhandhā (De Apego)") },
                    { val: "ayatana", label: clean ? "3. Āyatanāni" : this.loc("3. 12 Āyatanāni (Bases)", "3. 12 Āyatanāni (Sense Bases)", "3. 12 Āyatanāni (Bases)") },
                    { val: "dhatu", label: clean ? "4. Dhātuyo" : this.loc("4. 18 Dhātuyo (Elementos)", "4. 18 Dhātuyo (Elements)", "4. 18 Dhātuyo (Elementos)") },
                    { val: "ariyasacca", label: clean ? "5. Ariyasaccāni" : this.loc("5. 4 Ariyasaccāni (Nobres Verdades)", "5. 4 Ariyasaccāni (Noble Truths)", "5. 4 Ariyasaccāni (Nobles Verdades)") },
                    { val: "dhammayatana_69", label: clean ? "6. Dhammāyatana / Dhātu" : this.loc("Dhammāyatana / Dhātu (52+16+1)", "Dhammāyatana / Dhātu (52+16+1)", "Dhammāyatana / Dhātu (52+16+1)") },
                    { val: "sacca_excl", label: this.loc("Excluídos das 4 Verdades (AS VII.53)", "Excluded from 4 Truths (AS VII.53)", "Excluidos de 4 Verdades (AS VII.53)") },
                ];
                const countOptions = [4, 5, 12, 18, 29, 69].map((n) => ({
                    val: n,
                    label: `${n}`,
                }));
                return `
          ${renderRow(this.loc("1. Compêndio (Samuccaya):", "1. Compendium (Samuccaya):", "1. Compendio (Samuccaya):"), "compendium", compOptions)}
          ${renderRow(this.loc("2. Síntese Universal (Sabba-saṅgaha):", "2. Universal Synthesis (Sabba-saṅgaha):", "2. Síntesis Universal (Sabba-saṅgaha):"), "group", sabbaOpts)}
          ${renderRow(this.loc("3. Contagem Canônica:", "3. Canonical Count:", "3. Conteo Canónico:"), "count", countOptions)}
        `;
            }
            case 8: {
                const methodOptions = [
                    { val: "paticcasamuppada", label: this.loc("1. Paṭiccasamuppāda (12 Elos + 6 Análises)", "1. Paṭiccasamuppāda (12 Links + 6 Analyses)", "1. Paṭiccasamuppāda (12 Eslabones + 6 Análisis)") },
                    { val: "patthana_24", label: this.loc("2. 24 Paṭṭhāna (6 Vias + 4 Samodhāna)", "2. 24 Paṭṭhāna (6 Ways + 4 Samodhāna)", "2. 24 Paṭṭhāna (6 Vías + 4 Samodhāna)") },
                    { val: "patthana_submodes", label: this.loc("3. Submodos Paṭṭhāna & 6 Atthapaññatti (18)", "3. Paṭṭhāna Submodes & 6 Atthapaññatti (18)", "3. Submodos Paṭṭhāna y 6 Atthapaññatti (18)") },
                    { val: "pannatti_8", label: this.loc("4. Paññattibheda (Attha & 6 Nāmapaññatti)", "4. Paññattibheda (Attha & 6 Nāmapaññatti)", "4. Paññattibheda (Attha y 6 Nāmapaññatti)") },
                ];
                const currentMethod = String(sw.method ?? "paticcasamuppada");
                if (currentMethod === "patthana_submodes") {
                    const sgOpts = [
                        { val: "paccaya_modes", label: this.loc("12 Submodos & Leis do Paṭṭhāna (AS VIII.17–38)", "12 Paṭṭhāna Submodes & Laws (AS VIII.17–38)", "12 Submodos y Leyes del Paṭṭhāna (AS VIII.17–38)") },
                        { val: "atthapannatti_6", label: this.loc("6 Modos de Atthapaññatti (AS VIII.40)", "6 Modes of Atthapaññatti (AS VIII.40)", "6 Modos de Atthapaññatti (AS VIII.40)") },
                    ];
                    const curSg = String(sw.subGroup ?? "paccaya_modes");
                    const topicOpts = curSg === "atthapannatti_6"
                        ? [
                            { val: "att_bhumi", label: "1. Bhūmi / Pabbata" },
                            { val: "att_geha", label: "2. Geha / Ratha" },
                            { val: "att_purisa", label: "3. Purisa / Puggala" },
                            { val: "att_disa", label: "4. Disā / Kāla" },
                            { val: "att_kupa", label: "5. Kūpa / Guhā" },
                            { val: "att_kasina", label: "6. Kasiṇa-nimitta" },
                        ]
                        : [
                            { val: "sub_upanissaya", label: "Upanissaya" },
                            { val: "sub_adhipati", label: "Adhipati" },
                            { val: "sub_kamma", label: "Kamma" },
                            { val: "sub_sahajata", label: "Sahajāta" },
                            { val: "sub_annamanna", label: "Aññamañña" },
                            { val: "sub_nissaya", label: "Nissaya" },
                            { val: "sub_ahara", label: "Āhāra" },
                            { val: "sub_indriya", label: "Indriya" },
                            { val: "sub_vippayutta", label: "Vippayutta" },
                            { val: "sub_atthi5", label: "Atthi & Avigata" },
                            { val: "sub_sahajatarupa2", label: "Sahajāta-rūpa (Pavatti / Paṭisandhi)" },
                            { val: "sub_nama5", label: "Nāma / Arūpa (AS VIII.38)" },
                        ];
                    const modeVals = curSg === "atthapannatti_6" ? [1, 2, 3, 4, 5, 6] : [2, 3, 5];
                    const modeOpts = modeVals.map((n) => ({ val: n, label: `${n}` }));
                    return `
            ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
            ${renderRow(this.loc("2. Subgrupo (Paṭṭhāna / Atthapaññatti):", "2. Subgroup (Paṭṭhāna / Atthapaññatti):", "2. Subgrupo (Paṭṭhāna / Atthapaññatti):"), "subGroup", sgOpts)}
            ${renderRow(this.loc("3. Tópico Canônico:", "3. Canonical Topic:", "3. Tema Canónico:"), "topic", topicOpts)}
            ${renderRow(this.loc("4. Modos / Índice:", "4. Modes / Index:", "4. Modos / Índice:"), "modes", modeOpts)}
          `;
                }
                if (currentMethod === "paticcasamuppada") {
                    const psModeOpts = [
                        { val: "links12", label: this.loc("12 Elos Individuais (Avijjā → Jarāmaraṇa)", "12 Individual Links (Avijjā → Jarāmaraṇa)", "12 Eslabones Individuales (Avijjā → Jarāmaraṇa)") },
                        { val: "analysis6", label: this.loc("6 Análises (3 Addhā · 20 Ākārā · 3 Sandhi · 4 Saṅkhepa · 3 Vaṭṭa · 2 Mūla)", "6 Analyses (3 Addhā · 20 Ākārā · 3 Sandhi · 4 Saṅkhepa · 3 Vaṭṭa · 2 Mūla)", "6 Análisis (3 Addhā · 20 Ākārā · 3 Sandhi · 4 Saṅkhepa · 3 Vaṭṭa · 2 Mūla)") },
                    ];
                    const curPsMode = String(sw.psMode ?? "links12");
                    if (curPsMode === "links12") {
                        const slotOpts = [
                            "1. Avijjā", "2. Saṅkhārā", "3. Viññāṇa", "4. Nāmarūpa",
                            "5. Saḷāyatana", "6. Phassa", "7. Vedanā", "8. Taṇhā",
                            "9. Upādāna", "10. Bhava", "11. Jāti", "12. Jarāmaraṇa",
                        ].map((lbl, i) => ({ val: i + 1, label: lbl }));
                        const addhaOpts = [
                            { val: "atita", label: this.loc("Atīta (Passado · 2)", "Atīta (Past · 2)", "Atīta (Pasado · 2)") },
                            { val: "paccuppanna", label: this.loc("Paccuppanna (Presente · 8)", "Paccuppanna (Present · 8)", "Paccuppanna (Presente · 8)") },
                            { val: "anagata", label: this.loc("Anāgata (Futuro · 2)", "Anāgata (Future · 2)", "Anāgata (Futuro · 2)") },
                        ];
                        const vattaOpts = [
                            { val: "kilesavatta", label: this.loc("Kilesavaṭṭa (Impurezas)", "Kilesavaṭṭa (Defilements)", "Kilesavaṭṭa (Impurezas)") },
                            { val: "kammavatta", label: this.loc("Kammavaṭṭa (Ação)", "Kammavaṭṭa (Kamma)", "Kammavaṭṭa (Acción)") },
                            { val: "vipakavatta", label: this.loc("Vipākavaṭṭa (Resultados)", "Vipākavaṭṭa (Results)", "Vipākavaṭṭa (Resultados)") },
                            { val: "kamma_vipaka", label: this.loc("Kamma + Vipāka (Bhava duplo)", "Kamma + Vipāka (Dual Bhava)", "Kamma + Vipāka (Bhava doble)") },
                        ];
                        return `
              ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
              ${renderRow(this.loc("2. Eixo Paṭiccasamuppāda:", "2. Paṭiccasamuppāda Axis:", "2. Eje Paṭiccasamuppāda:"), "psMode", psModeOpts)}
              ${renderRow(this.loc("3. Elo (Dvādasaṅgāni 1..12):", "3. Link (Dvādasaṅgāni 1..12):", "3. Eslabón (Dvādasaṅgāni 1..12):"), "slot", slotOpts)}
              ${renderRow(this.loc("4. Período Temporal (Tayo Addhā):", "4. Time Period (Tayo Addhā):", "4. Período Temporal (Tayo Addhā):"), "addha", addhaOpts)}
              ${renderRow(this.loc("5. Roda do Ciclo (Tīṇi Vaṭṭāni):", "5. Round of Cycle (Tīṇi Vaṭṭāni):", "5. Rueda del Ciclo (Tīṇi Vaṭṭāni):"), "vatta", vattaOpts)}
            `;
                    }
                    const topicOpts = [
                        { val: "addha_3", label: clean ? "Tayo Addhā" : this.loc("Tayo Addhā (3 Períodos)", "Tayo Addhā (3 Periods)", "Tayo Addhā (3 Períodos)") },
                        { val: "akara_20", label: clean ? "Vīsatākārā" : this.loc("Vīsatākārā (20 Modos)", "Vīsatākārā (20 Modes)", "Vīsatākārā (20 Modos)") },
                        { val: "sandhi_3", label: clean ? "Tisandhi" : this.loc("Tisandhi (3 Junções)", "Tisandhi (3 Connections)", "Tisandhi (3 Conexiones)") },
                        { val: "sankhepa_4", label: clean ? "Catusaṅkhepā" : this.loc("Catusaṅkhepā (4 Blocos)", "Catusaṅkhepā (4 Summaries)", "Catusaṅkhepā (4 Bloques)") },
                        { val: "vatta_3", label: clean ? "Tīṇi Vaṭṭāni" : this.loc("Tīṇi Vaṭṭāni (3 Rodas)", "Tīṇi Vaṭṭāni (3 Rounds)", "Tīṇi Vaṭṭāni (3 Ruedas)") },
                        { val: "mula_2", label: clean ? "Dve Mūlāni" : this.loc("Dve Mūlāni (2 Raízes)", "Dve Mūlāni (2 Roots)", "Dve Mūlāni (2 Raíces)") },
                    ];
                    const countOpts = [2, 3, 4, 20].map((n) => ({ val: n, label: `${n}` }));
                    return `
            ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
            ${renderRow(this.loc("2. Eixo Paṭiccasamuppāda:", "2. Paṭiccasamuppāda Axis:", "2. Eje Paṭiccasamuppāda:"), "psMode", psModeOpts)}
            ${renderRow(this.loc("3. Estrutura Analítica:", "3. Analytical Structure:", "3. Estructura Analítica:"), "topic", topicOpts)}
            ${renderRow(this.loc("4. Quantidade Canônica:", "4. Canonical Count:", "4. Cantidad Canónica:"), "count", countOpts)}
          `;
                }
                if (currentMethod === "patthana_24") {
                    const dirOpts = [
                        { val: "nama_nama", label: "1. Nāma → Nāma (6)" },
                        { val: "nama_namarupa", label: "2. Nāma → Nāmarūpa (5)" },
                        { val: "nama_rupa", label: "3. Nāma → Rūpa (1)" },
                        { val: "rupa_nama", label: "4. Rūpa → Nāma (1)" },
                        { val: "pannatti_nama", label: "5. Paññatti/Nāmarūpa → Nāma (2)" },
                        { val: "namarupa_namarupa", label: "6. Nāmarūpa → Nāmarūpa (9)" },
                        { val: "samodhana_4", label: this.loc("Síntese: 4 Samodhāna (AS VIII.35)", "Synthesis: 4 Samodhāna (AS VIII.35)", "Síntesis: 4 Samodhāna (AS VIII.35)") },
                    ];
                    const curDir = String(sw.direction ?? "nama_nama");
                    const all24Conditions = [
                        { val: 1, label: "#1 Hetu" },
                        { val: 2, label: "#2 Ārammaṇa" },
                        { val: 3, label: "#3 Adhipati" },
                        { val: 4, label: "#4 Anantara" },
                        { val: 5, label: "#5 Samanantara" },
                        { val: 6, label: "#6 Sahajāta" },
                        { val: 7, label: "#7 Aññamañña" },
                        { val: 8, label: "#8 Nissaya" },
                        { val: 9, label: "#9 Upanissaya" },
                        { val: 10, label: "#10 Purejāta" },
                        { val: 11, label: "#11 Pacchājāta" },
                        { val: 12, label: "#12 Āsevana" },
                        { val: 13, label: "#13 Kamma" },
                        { val: 14, label: "#14 Vipāka" },
                        { val: 15, label: "#15 Āhāra" },
                        { val: 16, label: "#16 Indriya" },
                        { val: 17, label: "#17 Jhāna" },
                        { val: 18, label: "#18 Magga" },
                        { val: 19, label: "#19 Sampayutta" },
                        { val: 20, label: "#20 Vippayutta" },
                        { val: 21, label: "#21 Atthi" },
                        { val: 22, label: "#22 Natthi" },
                        { val: 23, label: "#23 Vigata" },
                        { val: 24, label: "#24 Avigata" },
                    ];
                    const dirConditions = {
                        nama_nama: [
                            { val: 4, label: "#4 Anantara" },
                            { val: 5, label: "#5 Samanantara" },
                            { val: 12, label: "#12 Āsevana" },
                            { val: 19, label: "#19 Sampayutta" },
                            { val: 22, label: "#22 Natthi" },
                            { val: 23, label: "#23 Vigata" },
                        ],
                        nama_namarupa: [
                            { val: 1, label: "#1 Hetu" },
                            { val: 13, label: "#13 Kamma" },
                            { val: 14, label: "#14 Vipāka" },
                            { val: 17, label: "#17 Jhāna" },
                            { val: 18, label: "#18 Magga" },
                        ],
                        nama_rupa: [{ val: 11, label: "#11 Pacchājāta" }],
                        rupa_nama: [{ val: 10, label: "#10 Purejāta" }],
                        pannatti_nama: [
                            { val: 2, label: "#2 Ārammaṇa" },
                            { val: 9, label: "#9 Upanissaya" },
                        ],
                        namarupa_namarupa: [
                            { val: 3, label: "#3 Adhipati" },
                            { val: 6, label: "#6 Sahajāta" },
                            { val: 7, label: "#7 Aññamañña" },
                            { val: 8, label: "#8 Nissaya" },
                            { val: 15, label: "#15 Āhāra" },
                            { val: 16, label: "#16 Indriya" },
                            { val: 20, label: "#20 Vippayutta" },
                            { val: 21, label: "#21 Atthi" },
                            { val: 24, label: "#24 Avigata" },
                        ],
                        samodhana_4: [
                            { val: 2, label: "1. Ārammaṇa (#2)" },
                            { val: 9, label: "2. Upanissaya (#9)" },
                            { val: 13, label: "3. Kamma (#13)" },
                            { val: 21, label: "4. Atthi (#21)" },
                        ],
                    };
                    const idxOpts = this.progress.level === 3 && curDir !== "samodhana_4"
                        ? all24Conditions
                        : dirConditions[curDir] ?? dirConditions.nama_nama;
                    return `
            ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
            ${renderRow(this.loc("2. Matriz Direcional (6+5+1+1+2+9 = 24):", "2. Directional Matrix (6+5+1+1+2+9 = 24):", "2. Matriz Direccional (6+5+1+1+2+9 = 24):"), "direction", dirOpts)}
            ${renderRow(this.loc("3. Condição do Paṭṭhāna (#1..#24):", "3. Paṭṭhāna Condition (#1..#24):", "3. Condición del Paṭṭhāna (#1..#24):"), "index", idxOpts)}
          `;
                }
                const panTypeOpts = [
                    { val: "atthapannatti", label: this.loc("Classe: Atthapaññatti (Significado)", "Class: Atthapaññatti (Meaning)", "Clase: Atthapaññatti (Significado)") },
                    { val: "namapannatti", label: this.loc("Classe: Nāmapaññatti (Nome)", "Class: Nāmapaññatti (Name)", "Clase: Nāmapaññatti (Nombre)") },
                    { val: "v_only", label: clean ? "1. Vijjamānapaññatti" : "1. Vijjamānapaññatti (Rūpa)" },
                    { val: "a_only", label: clean ? "2. Avijjamānapaññatti" : "2. Avijjamānapaññatti (Bhūmi)" },
                    { val: "v_to_a", label: clean ? "3. Vijjamānena Avijjamāna" : "3. Vijjamānena Avijjamāna (Chaḷabhiñño)" },
                    { val: "a_to_v", label: clean ? "4. Avijjamānena Vijjamāna" : "4. Avijjamānena Vijjamāna (Itthisaddo)" },
                    { val: "v_to_v", label: clean ? "5. Vijjamānena Vijjamāna" : "5. Vijjamānena Vijjamāna (Cakkhuviññāṇaṃ)" },
                    { val: "a_to_a", label: clean ? "6. Avijjamānena Avijjamāna" : "6. Avijjamānena Avijjamāna (Rājaputto)" },
                ];
                const arityOpts = [
                    { val: 1, label: this.loc("1 · Unário (Simples)", "1 · Unary (Simple)", "1 · Unario (Simple)") },
                    { val: 2, label: this.loc("2 · Binário (Composto 2×2)", "2 · Binary (Compound 2×2)", "2 · Binario (Compuesto 2×2)") },
                    { val: 6, label: this.loc("6 · Classe Completa (6 Modos)", "6 · Full Class (6 Modes)", "6 · Clase Completa (6 Modos)") },
                ];
                return `
          ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
          ${renderRow(this.loc("2. Tipo de Conceito (Paññattibheda):", "2. Concept Type (Paññattibheda):", "2. Tipo de Concepto (Paññattibheda):"), "panType", panTypeOpts)}
          ${renderRow(this.loc("3. Aridade / Modos:", "3. Arity / Modes:", "3. Aridad / Modos:"), "arity", arityOpts)}
        `;
            }
            case 9:
            default: {
                const wingOptions = [
                    { val: "samatha_40", label: this.loc("1. 40 Samatha Kammaṭṭhānas", "1. 40 Samatha Kammaṭṭhānas", "1. 40 Samatha Kammaṭṭhānas") },
                    { val: "samatha_carita_abhinna", label: this.loc("2. 6 Caritas · 5 Vasitās · 5 Abhiññās", "2. 6 Caritas · 5 Vasitās · 5 Abhiññās", "2. 6 Caritas · 5 Vasitās · 5 Abhiññās") },
                    { val: "vipassana_visuddhi_nana", label: this.loc("3. 7 Visuddhis · 10 Ñāṇas · Vimokkha", "3. 7 Visuddhis · 10 Ñāṇas · Vimokkha", "3. 7 Visuddhis · 10 Ñāṇas · Vimokkha") },
                    { val: "ariya_samapatti", label: this.loc("4. 4 Ariyas & 2 Samāpattis", "4. 4 Ariyas & 2 Samāpattis", "4. 4 Ariyas y 2 Samāpattis") },
                    { val: "kammatthana_details", label: this.loc("5. Bhāvanā · Nimitta · Sīla 4 · Upakkilesa 10 (23)", "5. Bhāvanā · Nimitta · Sīla 4 · Upakkilesa 10 (23)", "5. Bhāvanā · Nimitta · Sīla 4 · Upakkilesa 10 (23)") },
                ];
                const currentWing = String(sw.wing ?? "samatha_40");
                if (currentWing === "kammatthana_details") {
                    const detGroupOpts = [
                        { val: "bhavana_3", label: "3 Bhāvanā" },
                        { val: "nimitta_3", label: "3 Nimitta" },
                        { val: "parisuddhisila_4", label: "4 Catupārisuddhisīla" },
                        { val: "upakkilesa_10", label: "10 Vipassanupakkilesā" },
                        { val: "paccavekkhana_aruppa", label: "Paccavekkhaṇā & 9 Kasiṇas" },
                    ];
                    const curDg = String(sw.detGroup ?? "bhavana_3");
                    const maxMap = {
                        bhavana_3: 3, nimitta_3: 3, parisuddhisila_4: 4, upakkilesa_10: 10, paccavekkhana_aruppa: 3,
                    };
                    const slotOpts = Array.from({ length: maxMap[curDg] ?? 3 }, (_, i) => ({
                        val: i + 1,
                        label: `#${i + 1}`,
                    }));
                    const rolesByDg = {
                        bhavana_3: [
                            { val: "all_40", label: this.loc("Todos os 40 Objetos", "All 40 Subjects", "Los 40 Objetos") },
                            { val: "upacara_10", label: this.loc("10 Só Upacāra", "10 Upacāra Only", "10 Solo Upacāra") },
                            { val: "appana_30", label: this.loc("30 Alcançam Appanā", "30 Reach Appanā", "30 Alcanzan Appanā") },
                        ],
                        nimitta_3: [
                            { val: "all_40", label: this.loc("Todos os 40 Objetos", "All 40 Subjects", "Los 40 Objetos") },
                            { val: "patibhaga_22", label: this.loc("22 Geram Paṭibhāga", "22 Yield Paṭibhāga", "22 Generan Paṭibhāga") },
                        ],
                        parisuddhisila_4: [
                            { val: "sila_visuddhi", label: "Sīla-visuddhi (#1)" },
                        ],
                        upakkilesa_10: [
                            { val: "upakkilesa_v5", label: "Visuddhi #5 (Upakkilesa)" },
                            { val: "upakkilesa_akusala", label: this.loc("Visuddhi #5 (Único Akusala)", "Visuddhi #5 (Sole Unwholesome)", "Visuddhi #5 (Único Akusala)") },
                        ],
                        paccavekkhana_aruppa: [
                            { val: "review_mandatory", label: this.loc("Obrigatórias (3)", "Mandatory (3)", "Obligatorias (3)") },
                            { val: "review_optional_19", label: this.loc("Opcionais (2 · Total 19)", "Optional (2 · Total 19)", "Opcionales (2 · Total 19)") },
                            { val: "aruppa_9_kasinas", label: this.loc("9 Kasiṇas (Sem Ākāsa)", "9 Kasiṇas (Excl. Space)", "9 Kasiṇas (Sin Ākāsa)") },
                        ],
                    };
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Eixo Detalhado:", "2. Detail Axis:", "2. Eje Detallado:"), "detGroup", detGroupOpts)}
            ${renderRow(this.loc("3. Item Canônico:", "3. Canonical Item:", "3. Ítem Canónico:"), "slot", slotOpts)}
            ${renderRow(this.loc("4. Função / Escopo Canônico:", "4. Canonical Role / Scope:", "4. Función / Ámbito Canónico:"), "role", rolesByDg[curDg] ?? rolesByDg.bhavana_3)}
          `;
                }
                if (currentWing === "samatha_40") {
                    const groupOptions = [
                        { val: "kasina", label: clean ? "10 Kasiṇas" : this.loc("10 Kasiṇas (5 Jhānas · Paṭibhāga)", "10 Kasiṇas (5 Jhānas · Paṭibhāga)", "10 Kasiṇas (5 Jhānas · Paṭibhāga)") },
                        { val: "asubha", label: clean ? "10 Asubhas" : this.loc("10 Asubhas (1.º Jhāna · Paṭibhāga)", "10 Asubhas (1st Jhāna · Paṭibhāga)", "10 Asubhas (1.er Jhāna · Paṭibhāga)") },
                        { val: "anussati", label: clean ? "10 Anussatis" : this.loc("10 Anussatis (8 Upacāra · 1.º · 5)", "10 Anussatis (8 Upacāra · 1st · 5)", "10 Anussatis (8 Upacāra · 1.º · 5)") },
                        { val: "brahmavihara", label: this.loc("4 Appamaññā / Brahmavihāra", "4 Appamaññā / Brahmavihāra", "4 Appamaññā / Brahmavihāra") },
                        { val: "sanna_vavatthana", label: clean ? "1 Saññā + 1 Vavatthāna" : this.loc("1 Saññā + 1 Vavatthāna (Upacāra)", "1 Saññā + 1 Vavatthāna (Upacāra)", "1 Saññā + 1 Vavatthāna (Upacāra)") },
                        { val: "aruppa", label: this.loc("4 Āruppas (Imateriais)", "4 Āruppas (Immaterial)", "4 Āruppas (Inmateriales)") },
                    ];
                    const curGrp = String(sw.group ?? "kasina");
                    const slotNamesByGroup = {
                        kasina: ["1. Pathavī", "2. Āpo", "3. Tejo", "4. Vāyo", "5. Nīla", "6. Pīta", "7. Lohita", "8. Odāta", "9. Ākāsa", "10. Āloka"],
                        asubha: ["1. Uddhumātaka", "2. Vinīlaka", "3. Vipubbaka", "4. Vicchiddaka", "5. Vikkhāyitaka", "6. Vikkhittaka", "7. Hatavikkhittaka", "8. Lohitaka", "9. Puḷavaka", "10. Aṭṭhika"],
                        anussati: ["1. Buddha", "2. Dhamma", "3. Saṅgha", "4. Sīla", "5. Cāga", "6. Devatā", "7. Upasama", "8. Maraṇa", "9. Kāyagatāsati", "10. Ānāpānassati"],
                        brahmavihara: ["1. Mettā", "2. Karuṇā", "3. Muditā", "4. Upekkhā"],
                        sanna_vavatthana: ["1. Āhāre Paṭikūlasaññā", "2. Catudhātuvavatthāna"],
                        aruppa: ["1. Ākāsānañcāyatana", "2. Viññāṇañcāyatana", "3. Ākiñcaññāyatana", "4. Nevasaññānāsaññā"],
                    };
                    const slotOptions = (slotNamesByGroup[curGrp] ?? slotNamesByGroup.kasina).map((lbl, i) => ({
                        val: i + 1,
                        label: lbl,
                    }));
                    const reachOptions = [
                        { val: "upacara", label: this.loc("Upacāra (Só Acesso)", "Upacāra (Access Only)", "Upacāra (Solo Acceso)") },
                        { val: "jhana_1", label: this.loc("1.º Jhāna (Paṭhamajjhāna)", "1st Jhāna Only (Paṭhamajjhāna)", "Solo 1.er Jhāna (Paṭhamajjhāna)") },
                        { val: "jhana_4", label: this.loc("1.º–4.º Jhāna (Catukkajjhāna)", "1st–4th Jhāna (Catukkajjhāna)", "1.º–4.º Jhāna (Catukkajjhāna)") },
                        { val: "jhana_5_only", label: this.loc("Só 5.º Jhāna (Pañcamajjhāna)", "5th Jhāna Only (Pañcamajjhāna)", "Solo 5.º Jhāna (Pañcamajjhāna)") },
                        { val: "jhana_5", label: this.loc("Todos 5 Jhānas (Pañcakajjhāna)", "All 5 Jhānas (Pañcakajjhāna)", "Los 5 Jhānas (Pañcakajjhāna)") },
                        { val: "aruppa_4", label: this.loc("4 Āruppas (Āruppajjhāna)", "4 Āruppas (Āruppajjhāna)", "4 Āruppas (Āruppajjhāna)") },
                    ];
                    const nimittaOptions = [
                        { val: 2, label: this.loc("2 Nimittas (Sem Paṭibhāga)", "2 Nimittas (No Paṭibhāga)", "2 Nimittas (Sin Paṭibhāga)") },
                        { val: 3, label: this.loc("3 Nimittas (Com Paṭibhāga)", "3 Nimittas (With Paṭibhāga)", "3 Nimittas (Con Paṭibhāga)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Classe dos 40 Objetos:", "2. Class of 40 Subjects:", "2. Clase de 40 Objetos:"), "group", groupOptions)}
            ${renderRow(this.loc("3. Objeto Individual (1..N):", "3. Individual Subject (1..N):", "3. Objeto Individual (1..N):"), "slot", slotOptions)}
            ${renderRow(this.loc("4. Alcance Canônico (Bhāvanābheda):", "4. Canonical Reach (Bhāvanābheda):", "4. Alcance Canónico (Bhāvanābheda):"), "reach", reachOptions)}
            ${renderRow(this.loc("5. Sinais Meditativos (Nimitta: 22 vs 18):", "5. Meditative Signs (Nimitta: 22 vs 18):", "5. Signos Meditativos (Nimitta: 22 vs 18):"), "nimitta", nimittaOptions)}
          `;
                }
                if (currentWing === "samatha_carita_abhinna") {
                    const tgOpts = [
                        { val: "carita_6", label: this.loc("6 Caritas (Temperamentos · Sappāya)", "6 Caritas (Temperaments · Suitability)", "6 Caritas (Temperamentos · Idoneidad)") },
                        { val: "vasita_5", label: this.loc("5 Vasitās (Maestrias do Jhāna)", "5 Vasitās (Jhāna Masteries)", "5 Vasitās (Maestrías del Jhāna)") },
                        { val: "abhinna_5", label: this.loc("5 Abhiññās (Poderes Diretos)", "5 Abhiññās (Direct Knowledges)", "5 Abhiññās (Conocimientos Directos)") },
                    ];
                    const curTg = String(sw.topicGroup ?? "carita_6");
                    const slotsMap = {
                        carita_6: ["1. Rāgacarita", "2. Dosacarita", "3. Mohacarita", "4. Saddhācarita", "5. Buddhicarita", "6. Vitakkacarita"],
                        vasita_5: ["1. Āvajjana", "2. Samāpajjana", "3. Adhiṭṭhāna", "4. Vuṭṭhāna", "5. Paccavekkhaṇā"],
                        abhinna_5: ["1. Iddhividha", "2. Dibbasota", "3. Paracittavijānana", "4. Pubbenivāsānussati", "5. Dibbacakkhu"],
                    };
                    const slotOpts = (slotsMap[curTg] ?? slotsMap.carita_6).map((lbl, i) => ({ val: i + 1, label: lbl }));
                    const caritaPropOpts = [
                        { val: "sappaya_11", label: this.loc("11 Objetos (10 Asubha + Kāyagatā)", "11 Subjects (10 Asubha + Kāyagatā)", "11 Objetos (10 Asubha + Kāyagatā)") },
                        { val: "sappaya_8", label: this.loc("8 Objetos (4 Brahmavihāra + 4 Cor)", "8 Subjects (4 Brahmavihāra + 4 Color)", "8 Objetos (4 Brahmavihāra + 4 Color)") },
                        { val: "sappaya_anapana_large", label: this.loc("Ānāpāna · Kasiṇa Grande", "Ānāpāna · Large Kasiṇa", "Ānāpāna · Kasiṇa Grande") },
                        { val: "sappaya_6", label: this.loc("6 Primeiras Anussatis", "First 6 Anussatis", "Primeras 6 Anussatis") },
                        { val: "sappaya_4", label: this.loc("4 (Maraṇa·Upasama·Āhāra·Dhātu)", "4 (Maraṇa·Upasama·Āhāra·Dhātu)", "4 (Maraṇa·Upasama·Āhāra·Dhātu)") },
                        { val: "sappaya_anapana_small", label: this.loc("Ānāpāna · Kasiṇa Pequeno", "Ānāpāna · Small Kasiṇa", "Ānāpāna · Kasiṇa Pequeño") },
                    ];
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Subgrupo (Carita / Vasitā / Abhiññā):", "2. Subgroup (Carita / Vasitā / Abhiññā):", "2. Subgrupo (Carita / Vasitā / Abhiññā):"), "topicGroup", tgOpts)}
            ${renderRow(this.loc("3. Item Canônico:", "3. Canonical Item:", "3. Ítem Canónico:"), "slot", slotOpts)}
            ${curTg === "carita_6" ? renderRow(this.loc("4. Objetos Adequados (Sappāyabheda — AS IX.15–18):", "4. Suitable Subjects (Sappāyabheda — AS IX.15–18):", "4. Objetos Idóneos (Sappāyabheda — AS IX.15–18):"), "prop", caritaPropOpts) : ""}
          `;
                }
                if (currentWing === "vipassana_visuddhi_nana") {
                    const vgOpts = [
                        { val: "visuddhi_7", label: this.loc("7 Visuddhis (Purificações)", "7 Visuddhis (Purifications)", "7 Visuddhis (Purificaciones)") },
                        { val: "nana_10", label: this.loc("10 Vipassanā-ñāṇas (Conhecimentos)", "10 Vipassanā-ñāṇas (Knowledges)", "10 Vipassanā-ñāṇas (Conocimientos)") },
                        { val: "vimokkha_4", label: this.loc("3 Tríades Vimokkha + 10 Upakkilesas", "3 Vimokkha Triads + 10 Upakkilesas", "3 Tríadas Vimokkha + 10 Upakkilesas") },
                    ];
                    const curVg = String(sw.vipGroup ?? "visuddhi_7");
                    const slotsMap = {
                        visuddhi_7: ["1. Sīla", "2. Citta", "3. Diṭṭhi", "4. Kaṅkhāvitaraṇa", "5. Maggāmagga", "6. Paṭipadā", "7. Ñāṇadassana"],
                        nana_10: ["1. Sammasana", "2. Udayabbaya", "3. Bhaṅga", "4. Bhaya", "5. Ādīnava", "6. Nibbidā", "7. Muccitukamyatā", "8. Paṭisaṅkhā", "9. Saṅkhārupekkhā", "10. Anuloma"],
                        vimokkha_4: ["1. Anicca → Animitta", "2. Dukkha → Appaṇihita", "3. Anatta → Suññata", "4. 10 Vipassanupakkilesā"],
                    };
                    const slotOpts = (slotsMap[curVg] ?? slotsMap.visuddhi_7).map((lbl, i) => ({ val: i + 1, label: lbl }));
                    const stageOpts = [
                        { val: "v5_maggamagga", label: "Visuddhi #5 (Maggāmagga)" },
                        { val: "v5_v6_bridge", label: this.loc("Ponte Visuddhi #5 → #6", "Visuddhi #5 → #6 Bridge", "Puente Visuddhi #5 → #6") },
                        { val: "v6_patipada", label: "Visuddhi #6 (Paṭipadā)" },
                        { val: "v6_vutthanagamini", label: "Visuddhi #6 (Vuṭṭhānagāminī)" },
                    ];
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Eixo de Vipassanā:", "2. Vipassanā Axis:", "2. Eje de Vipassanā:"), "vipGroup", vgOpts)}
            ${renderRow(this.loc("3. Estágio / Conhecimento / Tríade:", "3. Stage / Knowledge / Triad:", "3. Etapa / Conocimiento / Tríada:"), "slot", slotOpts)}
            ${curVg === "nana_10" ? renderRow(this.loc("4. Purificação Correspondente (Visuddhi #5 / #6):", "4. Corresponding Purification (Visuddhi #5 / #6):", "4. Purificación Correspondiente (Visuddhi #5 / #6):"), "stage", stageOpts) : ""}
          `;
                }
                const agOpts = [
                    { val: "puggala_4", label: this.loc("4 Ariyapuggalas (Nobres)", "4 Ariyapuggalas (Noble Ones)", "4 Ariyapuggalas (Nobles)") },
                    { val: "samapatti_2", label: this.loc("2 Samāpattis (Phala & Nirodha)", "2 Samāpattis (Phala & Nirodha)", "2 Samāpattis (Phala y Nirodha)") },
                ];
                const curAg = String(sw.ariyaGroup ?? "puggala_4");
                const slotOpts = curAg === "puggala_4"
                    ? [
                        { val: 1, label: "1. Sotāpanna" },
                        { val: 2, label: "2. Sakadāgāmī" },
                        { val: 3, label: "3. Anāgāmī" },
                        { val: 4, label: "4. Arahā" },
                    ]
                    : [
                        { val: 1, label: "1. Phala-samāpatti" },
                        { val: 2, label: "2. Nirodha-samāpatti" },
                    ];
                const ariyaPropOpts = curAg === "puggala_4"
                    ? [
                        { val: "cut_ditthi_vicikiccha", label: this.loc("Corta Diṭṭhi + Vicikicchā", "Cuts Diṭṭhi + Vicikicchā", "Corta Diṭṭhi + Vicikicchā") },
                        { val: "attenuate_3", label: this.loc("Atenua Rāga·Dosa·Moha", "Attenuates Rāga·Dosa·Moha", "Atenúa Rāga·Dosa·Moha") },
                        { val: "cut_kamaraga_byapada", label: this.loc("Corta Kāmarāga + Byāpāda", "Cuts Kāmarāga + Byāpāda", "Corta Kāmarāga + Byāpāda") },
                        { val: "cut_all_remaining", label: this.loc("Corta Todas as Impurezas", "Cuts All Remaining Defilements", "Corta Todas las Impurezas") },
                    ]
                    : [
                        { val: "access_4_ariyas", label: this.loc("Todos os 4 Ariyas", "All 4 Noble Ones", "Los 4 Ariyas") },
                        { val: "access_anagami_arahant", label: this.loc("Só Anāgāmī & Arahant (8 Jhānas)", "Anāgāmī & Arahant Only (8 Jhānas)", "Solo Anāgāmī y Arahant (8 Jhānas)") },
                    ];
                return `
          ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
          ${renderRow(this.loc("2. Subgrupo (Ariya / Samāpatti):", "2. Subgroup (Ariya / Samāpatti):", "2. Subgrupo (Ariya / Samāpatti):"), "ariyaGroup", agOpts)}
          ${renderRow(this.loc("3. Grau Nobre / Realização:", "3. Noble Grade / Attainment:", "3. Grado Noble / Realización:"), "slot", slotOpts)}
          ${renderRow(this.loc("4. Erradicação / Critério de Acesso:", "4. Eradication / Access Criterion:", "4. Erradicación / Criterio de Acceso:"), "prop", ariyaPropOpts)}
        `;
            }
        }
    }
    renderPeriodicPillar(s, summary) {
        return `
      <div class="mnem-submode-bar">
        <button type="button" class="mnem-submode-btn ${this.perMode === "atlas" ? "active" : ""}" data-per-mode="atlas" aria-pressed="${this.perMode === "atlas"}">
          ${esc(s.perModeAtlas)}
        </button>
        <button type="button" class="mnem-submode-btn ${this.perMode === "alchemy" ? "active" : ""}" data-per-mode="alchemy" aria-pressed="${this.perMode === "alchemy"}">
          ${esc(s.perModeAlchemy)}
        </button>
      </div>
      <div class="mnem-aid-note"><strong>ℹ️ ${esc(s.perAidNotice)}</strong></div>

      ${this.perMode === "atlas" ? this.renderPeriodicAtlas(s) : this.renderPeriodicAlchemy(s, summary)}
    `;
    }
    renderPeriodicAtlas(s) {
        const filtered = PERIODIC_ELEMENTS_72.filter((el) => {
            if (this.perFilter === "all")
                return true;
            if (this.perFilter === "citta")
                return el.paramattha === "citta";
            if (this.perFilter === "neutral")
                return el.block === "sabbacitta" || el.block === "pakinnaka";
            if (this.perFilter === "akusala")
                return el.block.startsWith("akusala_");
            if (this.perFilter === "sobhana")
                return el.block.startsWith("sobhana_");
            if (this.perFilter === "rupa")
                return el.paramattha === "rupa" && !el.isAnipphanna;
            if (this.perFilter === "anipphanna")
                return Boolean(el.isAnipphanna);
            if (this.perFilter === "nibbana")
                return el.paramattha === "nibbana";
            return true;
        });
        const atom = this.selectedAtom;
        return `
      <div class="mnem-filter-bar">
        ${[
            { id: "all", lbl: s.perFilterAll },
            { id: "citta", lbl: s.perFilterCitta },
            { id: "neutral", lbl: s.perFilterNeutral },
            { id: "akusala", lbl: s.perFilterAkusala },
            { id: "sobhana", lbl: s.perFilterSobhana },
            { id: "rupa", lbl: s.perFilterRupa },
            { id: "anipphanna", lbl: s.perFilterAnipphanna },
            { id: "nibbana", lbl: s.perFilterNibbana },
        ]
            .map((f) => `
            <button type="button" class="mnem-filter-chip ${this.perFilter === f.id ? "active" : ""}" data-per-filter="${f.id}" aria-pressed="${this.perFilter === f.id}">
              ${esc(f.lbl)}
            </button>`)
            .join("")}
      </div>

      <div class="mnem-atom-inspector" aria-live="polite">
        <div class="mnem-atom-badge mnem-block-${atom.block}">
          <span class="mnem-atom-num">#${atom.atomicNumber}</span>
          <strong class="mnem-atom-sym">${esc(atom.symbol)}</strong>
          <span class="mnem-atom-param" lang="pi">${esc(this.formatParamatthaPali(atom.paramattha))}</span>
        </div>
        <div class="mnem-atom-details">
          <div class="mnem-atom-title">
            <strong lang="pi">${esc(atom.pali)}</strong> — <span>${esc(atom.name[this.lang])}</span>
            ${atom.isAvinibbhoga ? `<span class="mnem-avin-tag">${esc(s.avinTag)}</span>` : ""}
            ${atom.isAnipphanna ? `<span class="mnem-anipphanna-tag">${esc(s.anipphannaTag)}</span>` : ""}
          </div>
          <div class="mnem-atom-lak"><strong>Lakkhaṇa:</strong> ${esc(atom.lakkhana[this.lang])}</div>
          <div class="mnem-atom-val"><strong>${esc(s.valenceLabel)}</strong> ${esc(atom.valenceRule[this.lang])}</div>
        </div>
      </div>

      <div class="mnem-periodic-grid">
        ${filtered
            .map((el) => {
            const isSel = el.atomicNumber === atom.atomicNumber;
            return `
              <button type="button" class="mnem-element-tile mnem-block-${el.block} ${el.isAnipphanna ? "mnem-tile-anipphanna" : ""} ${isSel ? "selected" : ""}" data-atom-num="${el.atomicNumber}" aria-pressed="${isSel}">
                <span class="mnem-tile-top">
                  <span class="mnem-tile-num">${el.atomicNumber}</span>
                  ${el.cittaCount89 ? `<span class="mnem-tile-val">${el.cittaCount89}c</span>` : el.isAvinibbhoga ? `<span class="mnem-tile-val">★8</span>` : el.isAnipphanna ? `<span class="mnem-tile-val">◇10</span>` : ""}
                </span>
                <strong class="mnem-tile-sym">${esc(el.symbol)}</strong>
                <span class="mnem-tile-pali" lang="pi">${esc(el.pali.split(" ")[0])}</span>
                <span class="mnem-tile-name">${esc(el.name[this.lang])}</span>
              </button>
            `;
        })
            .join("")}
      </div>

      <div class="mnem-why72-box">
        <strong>ℹ️ ${esc(s.perWhy72Title)}</strong>
        <p>${esc(s.perWhy72Body)}</p>
      </div>
    `;
    }
    renderPeriodicAlchemy(s, summary) {
        const target = this.chemTargetCitta;
        const evalRes = evaluateChemicalSynthesis(target, this.activeChemSet);
        const cetasikaElements = PERIODIC_ELEMENTS_72.filter((el) => el.paramattha === "cetasika");
        let collisionsHtml = "";
        if (evalRes.collisions.length > 0) {
            collisionsHtml = `
        <div class="mnem-collision-alert" aria-live="polite">
          <div class="mnem-collision-head">${esc(s.perCollisionsTitle)}</div>
          ${evalRes.collisions
                .map((c) => `
              <div class="mnem-collision-item">
                <strong>⚡ ${esc(c.title[this.lang])} (${esc(c.asRef)}):</strong>
                <span>${esc(c.explanation[this.lang])}</span>
              </div>`)
                .join("")}
        </div>
      `;
        }
        else {
            collisionsHtml = `<div class="mnem-collision-ok">${esc(s.perNoCollisions)}</div>`;
        }
        let verifyFeedbackHtml = "";
        if (this.chemVerified) {
            if (evalRes.isValidConfiguration) {
                const msg = evalRes.isExactFullSangahaMatch ? s.perSuccessFull : s.perSuccessFixed;
                verifyFeedbackHtml = `
          <div class="mnem-feedback mnem-feedback-ok" aria-live="polite">
            <div><strong>${esc(msg)}</strong></div>
            <div class="mnem-formula-note">${esc(target.formulaNote[this.lang])}</div>
            ${evalRes.simultaneousOptionalNote ? `<div class="mnem-opt-note">💡 ${esc(s.perOptionalNote)}</div>` : ""}
          </div>
        `;
            }
            else if (evalRes.missingFixed.length > 0 || evalRes.extraForbidden.length > 0) {
                verifyFeedbackHtml = `
          <div class="mnem-feedback mnem-feedback-err" aria-live="polite">
            ${evalRes.missingFixed.length > 0
                    ? `<div><strong>${esc(s.perMissingFixed)}</strong> ${evalRes.missingFixed.map((e) => `${esc(e.pali)} (${esc(e.name[this.lang])})`).join(", ")}</div>`
                    : ""}
            ${evalRes.extraForbidden.length > 0
                    ? `<div><strong>${esc(s.perExtraForbidden)}</strong> ${evalRes.extraForbidden.map((e) => `${esc(e.pali)} (${esc(e.name[this.lang])})`).join(", ")}</div>`
                    : ""}
          </div>
        `;
            }
        }
        const fixedCount = target.fixedCetasikas.length;
        const optCount = target.optionalCetasikas.length;
        return `
      <div class="mnem-alchemy-header">
        <div class="mnem-challenge-progress-strip">
          ${this.renderProgressMeter("alchemy", "alchemy", s.perAlchemyProgressLabel, summary.periodic, undefined, true)}
          ${this.renderProgressMeter("alchemy-global", "global-lab-inline", s.globalProgressLabel, summary.overall, undefined, true)}
        </div>
        <div class="mnem-alchemy-target">
          <span class="mnem-challenge-kicker">⚗️ ${esc(s.perTargetTitle)} (${esc(target.asRef)})</span>
          <div class="mnem-alchemy-citta-title">
            <strong>#${target.id} ${esc(target.code)}</strong> — <span lang="pi">${esc(target.pali)}</span>
          </div>
          <div class="mnem-alchemy-citta-sub">${esc(target.name[this.lang])}</div>
          ${this.progress.level === 1
            ? `<div class="mnem-alchemy-counter">
                  ${esc(s.perActiveCount)} <strong>${this.activeChemSet.size}</strong>
                  (${esc(s.fixedCoreLabel)} <strong>${fixedCount}</strong>${optCount > 0 ? ` · ${esc(s.totalSangahaLabel)} <strong>${target.totalSangahaCount}</strong>` : ""})
                </div>`
            : `<div class="mnem-alchemy-counter">${esc(s.perActiveCount)} <strong>${this.activeChemSet.size}</strong></div>`}
        </div>
        <div class="mnem-alchemy-actions">
          <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-chem-verify">${esc(s.perVerifyMix)}</button>
          <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-chem-hint">${esc(s.perFillFixedHint)}</button>
          <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-chem-clear">${esc(s.perClearMix)}</button>
          <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-chem-next">${esc(s.perNextChallenge)}</button>
        </div>
      </div>

      ${verifyFeedbackHtml}
      ${collisionsHtml}

      <div class="mnem-macro-bar">
        <span class="mnem-macro-lbl">${esc(s.perMacroBlocks)}</span>
        <button type="button" class="mnem-macro-btn" data-chem-macro="univ7">${esc(s.perBlockUniv7)}</button>
        <button type="button" class="mnem-macro-btn" data-chem-macro="pak6">${esc(s.perBlockPak6)}</button>
        <button type="button" class="mnem-macro-btn" data-chem-macro="aku4">${esc(s.perBlockAkuUniv4)}</button>
        <button type="button" class="mnem-macro-btn" data-chem-macro="sob19">${esc(s.perBlockSobUniv19)}</button>
        <button type="button" class="mnem-macro-btn" data-chem-macro="vir3">${esc(s.perBlockVirati3)}</button>
      </div>

      <div class="mnem-periodic-grid mnem-alchemy-grid">
        ${cetasikaElements
            .map((el) => {
            const active = this.activeChemSet.has(el.subId);
            return `
              <button type="button" class="mnem-element-tile mnem-block-${el.block} ${active ? "chem-active" : "chem-inactive"}" data-chem-toggle="${el.subId}" aria-pressed="${active}">
                <span class="mnem-tile-top">
                  <span class="mnem-tile-num">#${el.subId}</span>
                  <span class="mnem-tile-check">${active ? "✓" : ""}</span>
                </span>
                <strong class="mnem-tile-sym">${esc(el.symbol)}</strong>
                <span class="mnem-tile-pali" lang="pi">${esc(el.pali.split(" ")[0])}</span>
                <span class="mnem-tile-name">${esc(el.name[this.lang])}</span>
              </button>
            `;
        })
            .join("")}
      </div>
    `;
    }
    renderPhalanxPillar(s, summary) {
        const mapSpec = getPhalanxMapById(this.phaMapId);
        const mapProg = computePhalanxMapProgress(this.progress, this.phaMapId);
        const activeSlot = mapSpec.slots.find((sl) => sl.index === this.selectedSlotIndex) ?? mapSpec.slots[0];
        let challengeBannerHtml = "";
        if (this.phaMode === "blind") {
            const target = this.blindTargetSlot;
            const lvl = this.progress.level;
            const promptText = lvl === 3
                ? `<strong lang="pi">${esc(target.pali)}</strong>`
                : `<strong>${esc(target.label[this.lang])}</strong> (<span lang="pi">${esc(target.pali)}</span>)`;
            let fbHtml = "";
            if (this.blindFeedback) {
                const hitSlot = mapSpec.slots.find((sl) => sl.index === this.blindFeedback.targetIndex);
                fbHtml = this.blindFeedback.isCorrect
                    ? `<div class="mnem-feedback mnem-feedback-ok" aria-live="polite">
              <strong>${esc(s.phaCorrectTap)}</strong>
              ${hitSlot ? `<div>⚓ ${esc(hitSlot.mnemonicAnchor[this.lang])}</div>` : ""}
            </div>`
                    : `<div class="mnem-feedback mnem-feedback-err" aria-live="polite">
              <strong>${esc(s.phaWrongTap)} #${this.blindFeedback.targetIndex}</strong>
              ${hitSlot ? `<div>⚓ ${esc(hitSlot.mnemonicAnchor[this.lang])}</div>` : ""}
            </div>`;
            }
            challengeBannerHtml = `
        <div class="mnem-challenge-box">
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">🎯 ${esc(s.phaPromptFind)}</span>
            <div class="mnem-challenge-prompt">${promptText}</div>
          </div>
          ${fbHtml}
        </div>
      `;
        }
        else if (this.phaMode === "sequence") {
            const total = mapSpec.slots.length;
            const isDone = this.sequenceStep > total;
            const nextSlot = mapSpec.slots.find((sl) => sl.index === this.sequenceStep);
            challengeBannerHtml = `
        <div class="mnem-challenge-box">
          ${isDone
                ? `<div class="mnem-feedback mnem-feedback-ok" aria-live="polite">
                  <strong>${esc(s.phaSeqComplete)}</strong>
                  <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-pha-restart-seq" style="margin-left:12px;">${esc(s.phaRestartSeq)}</button>
                </div>`
                : `<div class="mnem-challenge-head">
                  <span class="mnem-challenge-kicker">🔢 ${esc(s.phaPromptSeq)} (${this.sequenceStep} / ${total})</span>
                  <div class="mnem-challenge-prompt">
                    <strong>#${nextSlot?.index}</strong> — <span lang="pi">${esc(nextSlot?.pali ?? "")}</span>
                    ${this.progress.level < 3 ? ` · <span>${esc(nextSlot?.label[this.lang] ?? "")}</span>` : ""}
                  </div>
                </div>`}
        </div>
      `;
        }
        return `
      <div class="mnem-phalanx-controls">
        <div class="mnem-map-select-wrap">
          <label for="mnem-pha-map-sel" class="mnem-switch-label">${esc(s.phaMapSelectLabel)}</label>
          <select id="mnem-pha-map-sel" class="mnem-map-select">
            ${PHALANX_MAPS.map((m) => `<option value="${m.id}" ${m.id === this.phaMapId ? "selected" : ""}>${esc(m.title[this.lang])}</option>`).join("")}
          </select>
        </div>

        <div class="mnem-submode-bar">
          <button type="button" class="mnem-submode-btn ${this.phaMode === "open" ? "active" : ""}" data-pha-mode="open" aria-pressed="${this.phaMode === "open"}">
            ${esc(s.phaModeOpen)}
          </button>
          <button type="button" class="mnem-submode-btn ${this.phaMode === "blind" ? "active" : ""}" data-pha-mode="blind" aria-pressed="${this.phaMode === "blind"}">
            ${esc(s.phaModeBlind)}
          </button>
          <button type="button" class="mnem-submode-btn ${this.phaMode === "sequence" ? "active" : ""}" data-pha-mode="sequence" aria-pressed="${this.phaMode === "sequence"}">
            ${esc(s.phaModeSequence)}
          </button>
        </div>
      </div>

      <div class="mnem-aid-note"><strong>ℹ️ ${esc(s.phaAidNotice)}</strong></div>

      <div class="mnem-map-summary-banner">
        <strong>${esc(mapSpec.title[this.lang])} (${esc(mapSpec.asRef)}):</strong>
        <span>${esc(mapSpec.formulaSummary[this.lang])}</span>
        <div class="mnem-challenge-progress-strip" style="margin-top:10px;">
          ${this.renderProgressMeter("phalanx-map", "phalanx-map", s.phaMapProgressLabel, mapProg, undefined, true)}
          ${this.renderProgressMeter("phalanx-global", "phalanx-global", s.phaAllMapsProgressLabel, summary.phalanx, undefined, true)}
        </div>
      </div>

      ${challengeBannerHtml}

      <div class="mnem-hands-stage">
        ${this.renderHandAnatomy(mapSpec, "left", s)}
        ${mapSpec.handsUsed === 2 ? this.renderHandAnatomy(mapSpec, "right", s) : ""}
      </div>

      <div class="mnem-slot-inspector" aria-live="polite">
        <div class="mnem-slot-badge">#${activeSlot.index} · ${esc(activeSlot.code)}</div>
        <div class="mnem-slot-body">
          <div class="mnem-slot-title">
            <strong lang="pi">${esc(activeSlot.pali)}</strong> — <span>${esc(activeSlot.label[this.lang])}</span>
          </div>
          <div class="mnem-slot-anchor">⚓ <strong>${esc(s.anchorLabel)}</strong> ${esc(activeSlot.mnemonicAnchor[this.lang])}</div>
          ${activeSlot.sandhiAfter
            ? `<div class="mnem-slot-sandhi">${esc(activeSlot.sandhiAfter[this.lang])}</div>`
            : ""}
        </div>
      </div>
    `;
    }
    renderHandAnatomy(mapSpec, hand, s) {
        const fingers = [
            { id: "index", label: s.phaFingerIndex },
            { id: "middle", label: s.phaFingerMiddle },
            { id: "ring", label: s.phaFingerRing },
            { id: "little", label: s.phaFingerLittle },
        ];
        const jointsOrder = [
            { id: "tip", label: s.phaJointTip },
            { id: "middle", label: s.phaJointMiddle },
            { id: "base", label: s.phaJointBase },
            ...(mapSpec.usesPalmCrease ? [{ id: "crease", label: s.phaJointCrease }] : []),
        ];
        const handSlots = mapSpec.slots.filter((sl) => sl.hand === hand);
        return `
      <div class="mnem-hand-card" data-hand="${hand}">
        <div class="mnem-hand-title">${esc(hand === "left" ? s.phaLeftHand : s.phaRightHand)}</div>
        <div class="mnem-fingers-grid">
          ${fingers
            .map((fg) => {
            const fSlots = handSlots.filter((sl) => sl.finger === fg.id);
            return `
                <div class="mnem-finger-col mnem-finger-${fg.id}">
                  <div class="mnem-fingernail" aria-hidden="true"></div>
                  <div class="mnem-finger-name">${esc(fg.label)}</div>
                  <div class="mnem-joints-stack">
                    ${jointsOrder
                .map((jt) => {
                const slot = fSlots.find((sl) => sl.joint === jt.id);
                if (!slot) {
                    return `<div class="mnem-joint-empty" aria-hidden="true"></div>`;
                }
                const isSelected = this.selectedSlotIndex === slot.index;
                const isMastered = (this.progress.masteredPhalanx[`${mapSpec.id}:${slot.index}`] ?? 0) >= 1;
                const isBlindRevealed = this.phaMode === "open" ||
                    (this.phaMode === "sequence" && slot.index < this.sequenceStep) ||
                    (this.phaMode === "blind" &&
                        this.blindFeedback != null &&
                        this.blindFeedback.targetIndex === slot.index);
                const isGoldHighlight = this.phaMode === "blind" &&
                    this.blindFeedback != null &&
                    !this.blindFeedback.isCorrect &&
                    this.blindFeedback.targetIndex === slot.index;
                return `
                          <button
                            type="button"
                            class="mnem-phalanx-btn ${isSelected ? "selected" : ""} ${isMastered ? "mastered" : ""} ${isGoldHighlight ? "gold-target" : ""}"
                            data-phalanx-idx="${slot.index}"
                            aria-pressed="${isSelected}"
                            aria-label="${esc(fg.label)} ${esc(jt.label)} (#${slot.index})"
                          >
                            <span class="mnem-phalanx-top">
                              <span class="mnem-phalanx-num">#${slot.index}</span>
                              <span class="mnem-phalanx-jname">${esc(jt.label)}</span>
                            </span>
                            ${isBlindRevealed
                    ? `<strong class="mnem-phalanx-code">${esc(slot.code)}</strong>
                                   <span class="mnem-phalanx-pali" lang="pi">${esc(slot.pali.split(" ")[0])}</span>`
                    : `<strong class="mnem-phalanx-hidden">?</strong>`}
                            ${slot.sandhiAfter ? `<span class="mnem-sandhi-dot" title="${esc(slot.sandhiAfter[this.lang])}">⚡ Sandhi</span>` : ""}
                          </button>
                        `;
            })
                .join("")}
                  </div>
                </div>
              `;
        })
            .join("")}
        </div>
      </div>
    `;
    }
    wireEvents() {
        const rigorSel = this.container.querySelector("#mnem-rigor-select");
        rigorSel?.addEventListener("change", () => {
            const val = Number(rigorSel.value);
            if (val === 1 || val === 2 || val === 3) {
                this.progress = { ...this.progress, level: val };
                this.binFeedback = null;
                this.naryFeedback = null;
                this.reverseFeedback = null;
                this.synthesisFeedback = null;
                saveMnemonicProgress(this.progress);
                this.syncVault();
                this.render();
            }
        });
        this.container.querySelectorAll("[data-set-level]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const val = Number(btn.dataset.setLevel);
                if ((val === 1 || val === 2 || val === 3) && val !== this.progress.level) {
                    this.progress = { ...this.progress, level: val };
                    this.binFeedback = null;
                    this.naryFeedback = null;
                    this.reverseFeedback = null;
                    this.synthesisFeedback = null;
                    saveMnemonicProgress(this.progress);
                    this.syncVault();
                    this.render();
                }
            });
        });
        this.container.querySelector("#mnem-vault-export")?.addEventListener("click", () => {
            const snap = buildLocalStorageSnapshot();
            const blob = new Blob([serializeProgressBackup(snap)], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `abhidhamma-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        });
        const fileInput = this.container.querySelector("#mnem-vault-file-input");
        this.container.querySelector("#mnem-vault-import")?.addEventListener("click", () => {
            fileInput?.click();
        });
        fileInput?.addEventListener("change", async () => {
            const file = fileInput.files?.[0];
            if (!file)
                return;
            try {
                const text = await file.text();
                const incoming = parseProgressBackup(text);
                const current = buildLocalStorageSnapshot();
                const merged = mergeSnapshots(current, incoming);
                if (merged.mnemonicLab) {
                    this.progress = mergeMnemonicProgress(this.progress, merged.mnemonicLab);
                    saveMnemonicProgress(this.progress);
                    await persistMnemonicOfflineVault(this.progress);
                }
                alert((LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt).vaultImportOk);
            }
            catch {
                alert((LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt).vaultImportErr);
            }
            finally {
                fileInput.value = "";
            }
            this.render();
        });
        const tabs = Array.from(this.container.querySelectorAll(".mnem-pillar-tab"));
        tabs.forEach((tab, idx) => {
            tab.addEventListener("click", () => {
                const pillar = tab.dataset.pillar;
                if (pillar && pillar !== this.activePillar) {
                    this.activePillar = pillar;
                    this.render();
                    const newTab = this.container.querySelector(`.mnem-pillar-tab[data-pillar="${pillar}"]`);
                    newTab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
                }
            });
            tab.addEventListener("keydown", (e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const nextIdx = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
                    const targetTab = tabs[nextIdx];
                    const pillar = targetTab.dataset.pillar;
                    this.activePillar = pillar;
                    this.render();
                    const focused = this.container.querySelector(`.mnem-pillar-tab[data-pillar="${pillar}"]`);
                    focused?.focus();
                }
            });
        });
        this.container.querySelector("#mnem-bin-mode-toggle")?.addEventListener("click", () => {
            this.binEnumMode = this.binEnumMode === 121 ? 89 : 121;
            this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
            this.binFeedback = null;
            if (this.autoAlignFamily) {
                this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            }
            else if (this.binEnumMode === 89 && this.switches.family === "lokuttara") {
                this.switches = { ...this.switches, jhanaStage: 1 };
            }
            this.render();
        });
        this.container.querySelectorAll("[data-bin-mode]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const mode = btn.dataset.binMode;
                if (mode) {
                    this.binMode = mode;
                    this.binFeedback = null;
                    if (mode === "challenge" && this.autoAlignFamily) {
                        this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
                    }
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-bin-scope]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const sc = btn.dataset.binScope;
                if (sc) {
                    this.binFamilyScope = sc;
                    this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
                    this.binFeedback = null;
                    if (this.autoAlignFamily) {
                        this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
                    }
                    this.render();
                }
            });
        });
        this.container.querySelector("#mnem-bin-align-family")?.addEventListener("click", () => {
            this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            this.binFeedback = null;
            this.render();
        });
        this.container.querySelector("#mnem-bin-autoalign-toggle")?.addEventListener("change", (e) => {
            this.autoAlignFamily = e.target.checked;
            if (this.autoAlignFamily && this.switches.family !== this.binTargetCitta.family) {
                this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            }
            this.render();
        });
        this.container.querySelectorAll("[data-bin-family]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const fam = btn.dataset.binFamily;
                if (fam) {
                    this.switches = defaultSwitchStateForFamily(fam);
                    this.binFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-bin-jati]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const jati = btn.dataset.binJati;
                if (jati) {
                    this.switches = { ...this.switches, jati };
                    this.binFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-bit-vedana]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const v = Number(btn.dataset.bitVedana);
                this.switches = { ...this.switches, bitVedana: v };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bit-cog]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const c = Number(btn.dataset.bitCog);
                this.switches = { ...this.switches, bitCognitive: c };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bit-sank]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const s = Number(btn.dataset.bitSank);
                this.switches = { ...this.switches, bitSankhara: s };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bit-moha]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const m = btn.dataset.bitMoha;
                this.switches = { ...this.switches, bitCognitive: m };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-ahetuka-sub]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const sg = btn.dataset.ahetukaSub;
                if (sg) {
                    this.switches = { ...this.switches, ahetukaSubgroup: sg, ahetukaSlot: 0 };
                    this.binFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-ahetuka-slot]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const slot = Number(btn.dataset.ahetukaSlot);
                this.switches = { ...this.switches, ahetukaSlot: slot };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bin-jhana]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const j = Number(btn.dataset.binJhana);
                this.switches = { ...this.switches, jhanaStage: j };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bin-arupa]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const b = Number(btn.dataset.binArupa);
                this.switches = { ...this.switches, arupaBase: b };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-bin-magga]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const m = Number(btn.dataset.binMagga);
                this.switches = { ...this.switches, maggaStage: m };
                this.binFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-load-citta]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = Number(btn.dataset.loadCitta);
                const pool = this.binEnumMode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
                const found = pool.find((c) => c.id === id);
                if (found) {
                    const ahetukaSubgroup = found.id >= 28 ? "kiriya" : found.id >= 20 ? "kusala_vipaka" : "akusala_vipaka";
                    const ahetukaSlot = found.id >= 28 ? found.id - 28 : found.id >= 20 ? found.id - 20 : Math.max(0, found.id - 13);
                    this.switches = {
                        family: found.family,
                        jati: found.jati,
                        bitVedana: found.bitVedana,
                        bitCognitive: found.bitCognitive,
                        bitSankhara: found.bitSankhara,
                        jhanaStage: found.jhanaStage ?? 1,
                        arupaBase: found.arupaBase ?? 1,
                        maggaStage: found.maggaStage ?? 1,
                        ahetukaSubgroup,
                        ahetukaSlot,
                    };
                    this.binFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelector("#mnem-bin-verify")?.addEventListener("click", () => {
            const synth = resolveCittaFromSwitches(this.switches, this.binEnumMode);
            const isCorrect = synth?.id === this.binTargetCitta.id;
            this.binFeedback = { isCorrect, synthesized: synth };
            this.progress = recordMnemonicAttempt(this.progress, "binary", `citta:${this.binTargetCitta.id}`, isCorrect);
            this.syncVault();
            this.render();
        });
        this.container.querySelector("#mnem-bin-next")?.addEventListener("click", () => {
            this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, this.binTargetCitta.id, this.binEnumMode);
            this.binFeedback = null;
            if (this.autoAlignFamily) {
                this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            }
            this.render();
        });
        this.container.querySelectorAll("[data-nary-drill]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const dm = btn.dataset.naryDrill;
                if (dm && dm !== this.naryDrillMode) {
                    this.naryDrillMode = dm;
                    this.reverseFeedback = null;
                    this.synthesisFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-bin-chapter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const ch = Number(btn.dataset.binChapter);
                if (ch >= 1 && ch <= 9 && (ch !== this.binActiveChapter || this.naryDrillMode === "synthesis")) {
                    if (this.naryDrillMode === "synthesis") {
                        this.naryDrillMode = "encode";
                    }
                    this.binActiveChapter = ch;
                    this.narySubmatrixScope = "all";
                    this.reverseFeedback = null;
                    if (ch > 1) {
                        this.binTargetNaryItem = pickNextNaryChapterChallenge(ch, this.progress, undefined, "all");
                        this.narySwitches = defaultNarySwitchesForChapter(ch);
                        this.naryFeedback = null;
                    }
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-reverse-choice]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (this.reverseFeedback)
                    return;
                const selectedId = btn.dataset.reverseChoice;
                if (!selectedId)
                    return;
                const targetId = this.binActiveChapter === 1 ? String(this.binTargetCitta.id) : this.binTargetNaryItem.id;
                const isCorrect = selectedId === targetId;
                this.reverseFeedback = { isCorrect, selectedId, targetId };
                const key = this.binActiveChapter === 1 ? `rev:citta:${targetId}` : `rev:nary:${targetId}`;
                this.progress = recordMnemonicAttempt(this.progress, "binary", key, isCorrect);
                this.syncVault();
                this.render();
            });
        });
        this.container.querySelector("#mnem-reverse-next")?.addEventListener("click", () => {
            this.reverseFeedback = null;
            if (this.binActiveChapter === 1) {
                this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, this.binTargetCitta.id, this.binEnumMode);
            }
            else {
                this.binTargetNaryItem = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, this.binTargetNaryItem?.id, this.narySubmatrixScope);
            }
            this.render();
        });
        this.container.querySelectorAll("[data-syn-axis]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const ax = btn.dataset.synAxis;
                if (ax && ax !== this.synthesisAxis) {
                    this.synthesisAxis = ax;
                    this.synthesisTarget = this.pickNextSynthesisItem();
                    this.synthesisFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-syn-choice]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (this.synthesisFeedback)
                    return;
                const selectedId = btn.dataset.synChoice;
                if (!selectedId)
                    return;
                const isCorrect = selectedId === this.synthesisTarget.id;
                this.synthesisFeedback = { isCorrect, selectedId };
                this.progress = recordMnemonicAttempt(this.progress, "binary", this.synthesisTarget.id, isCorrect);
                this.syncVault();
                this.render();
            });
        });
        this.container.querySelector("#mnem-syn-next")?.addEventListener("click", () => {
            this.synthesisTarget = this.pickNextSynthesisItem(this.synthesisTarget.id);
            this.synthesisFeedback = null;
            this.render();
        });
        this.container.querySelectorAll("[data-nary-submatrix]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const smId = btn.dataset.narySubmatrix;
                if (!smId || smId === this.narySubmatrixScope)
                    return;
                this.narySubmatrixScope = smId;
                this.binTargetNaryItem = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, undefined, smId);
                this.narySwitches = defaultNarySwitchesForSubmatrix(this.binActiveChapter, smId);
                this.naryFeedback = null;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-nary-key]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const key = btn.dataset.naryKey;
                const rawVal = btn.dataset.naryVal;
                if (!key || rawVal === undefined)
                    return;
                const val = /^-?\d+$/.test(rawVal) ? Number(rawVal) : rawVal;
                this.narySwitches = this.normalizeNarySwitches(this.binActiveChapter, this.narySwitches, key, val);
                this.naryFeedback = null;
                this.render();
            });
        });
        this.container.querySelector("#mnem-nary-verify")?.addEventListener("click", () => {
            if (!this.binTargetNaryItem)
                return;
            const res = evaluateNaryChallenge(this.binTargetNaryItem, this.narySwitches);
            this.naryFeedback = res;
            const itemId = this.binTargetNaryItem.id;
            this.progress = recordMnemonicAttempt(this.progress, "binary", `nary:${itemId}`, res.isCorrect);
            this.syncVault();
            this.render();
        });
        this.container.querySelector("#mnem-nary-next")?.addEventListener("click", () => {
            this.binTargetNaryItem = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, this.binTargetNaryItem?.id, this.narySubmatrixScope);
            this.naryFeedback = null;
            this.render();
        });
        this.container.querySelectorAll("[data-nary-load-item]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.naryLoadItem;
                const item = getNaryItemsForChapter(this.binActiveChapter).find((i) => i.id === id);
                if (item) {
                    this.narySwitches = { ...item.switches };
                    this.naryFeedback = null;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-per-mode]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const m = btn.dataset.perMode;
                if (m) {
                    this.perMode = m;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-per-filter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const f = btn.dataset.perFilter;
                if (f) {
                    this.perFilter = f;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-atom-num]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const num = Number(btn.dataset.atomNum);
                const found = PERIODIC_ELEMENTS_72.find((e) => e.atomicNumber === num);
                if (found) {
                    this.selectedAtom = found;
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-chem-toggle]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const subId = Number(btn.dataset.chemToggle);
                if (this.activeChemSet.has(subId)) {
                    this.activeChemSet.delete(subId);
                }
                else {
                    this.activeChemSet.add(subId);
                }
                this.chemVerified = false;
                this.render();
            });
        });
        this.container.querySelectorAll("[data-chem-macro]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const macro = btn.dataset.chemMacro;
                const blockMap = {
                    univ7: [1, 2, 3, 4, 5, 6, 7],
                    pak6: [8, 9, 10, 11, 12, 13],
                    aku4: [14, 15, 16, 17],
                    sob19: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
                    vir3: [47, 48, 49],
                };
                const ids = blockMap[macro ?? ""] ?? [];
                const allPresent = ids.every((id) => this.activeChemSet.has(id));
                for (const id of ids) {
                    if (allPresent)
                        this.activeChemSet.delete(id);
                    else
                        this.activeChemSet.add(id);
                }
                this.chemVerified = false;
                this.render();
            });
        });
        this.container.querySelector("#mnem-chem-clear")?.addEventListener("click", () => {
            this.activeChemSet.clear();
            this.chemVerified = false;
            this.render();
        });
        this.container.querySelector("#mnem-chem-hint")?.addEventListener("click", () => {
            this.activeChemSet = new Set(this.chemTargetCitta.fixedCetasikas);
            this.chemVerified = false;
            this.render();
        });
        this.container.querySelector("#mnem-chem-verify")?.addEventListener("click", () => {
            const res = evaluateChemicalSynthesis(this.chemTargetCitta, this.activeChemSet);
            this.chemVerified = true;
            this.progress = recordMnemonicAttempt(this.progress, "periodic", `chem:${this.chemTargetCitta.id}`, res.isValidConfiguration);
            this.syncVault();
            this.render();
        });
        this.container.querySelector("#mnem-chem-next")?.addEventListener("click", () => {
            this.chemTargetCitta = pickNextPeriodicChallenge(this.progress, this.chemTargetCitta.id);
            this.activeChemSet = new Set([1, 2, 3, 4, 5, 6, 7]);
            this.chemVerified = false;
            this.render();
        });
        const mapSel = this.container.querySelector("#mnem-pha-map-sel");
        mapSel?.addEventListener("change", () => {
            const nextId = mapSel.value;
            this.phaMapId = nextId;
            this.selectedSlotIndex = 1;
            this.sequenceStep = 1;
            this.blindFeedback = null;
            this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(nextId));
            this.render();
        });
        this.container.querySelectorAll("[data-pha-mode]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const m = btn.dataset.phaMode;
                if (m) {
                    this.phaMode = m;
                    this.sequenceStep = 1;
                    this.blindFeedback = null;
                    this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(this.phaMapId));
                    this.render();
                }
            });
        });
        this.container.querySelectorAll("[data-phalanx-idx]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.dataset.phalanxIdx);
                this.selectedSlotIndex = idx;
                const mapSpec = getPhalanxMapById(this.phaMapId);
                if (this.phaMode === "blind") {
                    const targetIdx = this.blindTargetSlot.index;
                    const isCorrect = idx === targetIdx;
                    this.blindFeedback = { isCorrect, tappedIndex: idx, targetIndex: targetIdx };
                    this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${targetIdx}`, isCorrect);
                    if (isCorrect) {
                        this.blindTargetSlot = pickNextPhalanxSlot(this.progress, mapSpec, targetIdx);
                    }
                    this.syncVault();
                }
                else if (this.phaMode === "sequence") {
                    if (this.sequenceStep <= mapSpec.slots.length) {
                        if (idx === this.sequenceStep) {
                            this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${idx}`, true);
                            this.sequenceStep += 1;
                        }
                        else {
                            this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${this.sequenceStep}`, false);
                        }
                        this.syncVault();
                    }
                }
                this.render();
            });
        });
        this.container.querySelector("#mnem-pha-restart-seq")?.addEventListener("click", () => {
            this.sequenceStep = 1;
            this.render();
        });
    }
}
//# sourceMappingURL=ui.js.map