import { settings } from "../state.js?v=e14b20e3";
import { registerToolModule } from "../tools/tools.js?v=e14b20e3";
import { CANONICAL_CITTAS_89, CANONICAL_CITTAS_121, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=e14b20e3";
import { CANONICAL_CHAPTERS_META, getSubmatricesForChapter, } from "./nary-chapters-data.js?v=e14b20e3";
import { defaultNarySwitchesForChapter, defaultNarySwitchesForSubmatrix, evaluateNaryChallenge, getNaryItemsForChapter, pickNextNaryChapterChallenge, defaultSwitchStateForFamily, evaluateChemicalSynthesis, getPhalanxMapById, getSynthesizableCittas, loadMnemonicProgress, mergeMnemonicProgress, pickNextBinaryChallenge, pickNextPeriodicChallenge, pickNextPhalanxSlot, recordMnemonicAttempt, resolveCittaFromSwitches, saveMnemonicProgress, } from "./engine.js?v=e14b20e3";
import { buildLocalStorageSnapshot, hydrateOfflineVault, mergeSnapshots, parseProgressBackup, persistMnemonicOfflineVault, serializeProgressBackup, VAULT_BROADCAST_CHANNEL, } from "../abhidhamma-srs/offline-store.js?v=e14b20e3";
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
    },
};
function esc(s) {
    return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
export class MnemonicLabUI {
    container;
    lang;
    progress;
    activePillar = "binary";
    binMode = "explore";
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
        };
        return map[name] ?? (name.charAt(0).toUpperCase() + name.slice(1));
    }
    formatNaryParamKey(key) {
        const map = {
            lens: ["Método (Naya)", "Method (Naya)", "Método (Naya)"],
            sphere: ["Esfera / Classe", "Sphere / Class", "Esfera / Clase"],
            cetasikas: ["Cetasikas (Saṅgaha)", "Cetasikas (Saṅgaha)", "Cetasikas (Saṅgaha)"],
            group: ["Grupo", "Group", "Grupo"],
            sub: ["Subfamília", "Subfamily", "Subfamilia"],
            slot: ["Posição", "Position", "Posición"],
            sampayoga: ["Sampayoga", "Sampayoga", "Sampayoga"],
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
            subtype: ["Subtipo", "Subtype", "Subtipo"],
            type: ["Natureza", "Nature", "Naturaleza"],
            heading: ["Rūpa / Classe", "Rūpa / Class", "Rūpa / Clase"],
            status: ["Estado", "Status", "Estado"],
            samutthana: ["Samuṭṭhāna", "Samuṭṭhāna", "Samuṭṭhāna"],
            dyad: ["Díade / Origem", "Dyad / Origin", "Díada / Origen"],
            origin: ["Origem do Kalāpa", "Kalāpa Origin", "Origen del Kalāpa"],
            size: ["Rūpas no Kalāpa", "Rūpas in Kalāpa", "Rūpas en Kalāpa"],
            topic: ["Tópico / Plano", "Topic / Plane", "Tema / Plano"],
            value: ["Valor Canônico", "Canonical Value", "Valor Canónico"],
            compendium: ["Saṅgaha", "Compendium", "Compendio"],
            vatthuto: ["Real (Vatthuto)", "Real (Vatthuto)", "Real (Vatthuto)"],
            bodhiMode: ["Eixo Bodhipakkhiya", "Bodhipakkhiya Axis", "Eje Bodhipakkhiya"],
            method: ["Método", "Method", "Método"],
            psMode: ["Eixo Paṭiccasamuppāda", "Paṭiccasamuppāda Axis", "Eje Paṭiccasamuppāda"],
            addha: ["Período (Addhā)", "Time Period (Addhā)", "Período (Addhā)"],
            vatta: ["Roda (Vaṭṭa)", "Round (Vaṭṭa)", "Rueda (Vaṭṭa)"],
            direction: ["Matriz Direcional", "Directional Matrix", "Matriz Direccional"],
            panType: ["Tipo de Paññatti", "Paññatti Type", "Tipo de Paññatti"],
            arity: ["Aridade / Modos", "Arity / Modes", "Aridad / Modos"],
            index: ["Índice", "Index", "Índice"],
            wing: ["Bhāvanā", "Bhāvanā Wing", "Bhāvanā"],
            reach: ["Alcance (Bhāvanā)", "Reach (Bhāvanā)", "Alcance (Bhāvanā)"],
            topicGroup: ["Subgrupo Samatha", "Samatha Subgroup", "Subgrupo Samatha"],
            vipGroup: ["Subgrupo Vipassanā", "Vipassanā Subgroup", "Subgrupo Vipassanā"],
            ariyaGroup: ["Subgrupo Ariya", "Ariya Subgroup", "Subgrupo Ariya"],
            maxJhana: ["Jhāna máx.", "Max Jhāna", "Jhāna máx."],
            carita: ["Carita", "Carita", "Carita"],
            nimitta: ["Nimitta", "Nimitta", "Nimitta"],
            visuddhi: ["Visuddhi", "Visuddhi", "Visuddhi"],
            stage: ["Estágio", "Stage", "Etapa"],
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
                return { lens: "sampayoga", group: "aññasamana", sub: "sabbacitta", slot: 1, sampayoga: 121 };
            }
            if (String(next.lens ?? "sampayoga") === "sangaha") {
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
            if (val === "pancadvara") {
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
                return { tetrad: "marana_cuti", mGroup: "marana_4", subtype: "ayukkhaya" };
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
                next.subtype = val === "marana_4" ? "ayukkhaya" : val === "nimitta_3" ? "sign_kamma" : "cuti_arupa";
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
                if (val === "missaka_7")
                    return { compendium: "missaka_7", group: "hetu6", vatthuto: 6 };
                if (val === "bodhipakkhiya_21")
                    return { compendium: "bodhipakkhiya_21", bodhiMode: "groups", item: "satipatthana", count: 4 };
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
        }
        else if (chapter === 8) {
            if (key === "method") {
                if (val === "paticcasamuppada") {
                    return { method: "paticcasamuppada", psMode: "links12", slot: 1, addha: "atita", vatta: "kilesavatta" };
                }
                if (val === "patthana_24") {
                    return { method: "patthana_24", direction: "nama_nama", index: 4 };
                }
                return { method: "pannatti_8", panType: "atthapannatti", arity: 6 };
            }
            if (key === "psMode") {
                if (val === "analysis6") {
                    return { method: "paticcasamuppada", psMode: "analysis6", topic: "addha_3", count: 3 };
                }
                return { method: "paticcasamuppada", psMode: "links12", slot: 1, addha: "atita", vatta: "kilesavatta" };
            }
            if (key === "direction") {
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
        else if (chapter === 9) {
            if (key === "wing") {
                if (val === "samatha_40") {
                    return { wing: "samatha_40", group: "kasina", slot: 1, reach: "jhana_5", nimitta: 3 };
                }
                if (val === "samatha_carita_abhinna") {
                    return { wing: "samatha_carita_abhinna", topicGroup: "carita_6", slot: 1 };
                }
                if (val === "vipassana_visuddhi_nana") {
                    return { wing: "vipassana_visuddhi_nana", vipGroup: "visuddhi_7", slot: 1 };
                }
                return { wing: "ariya_samapatti", ariyaGroup: "puggala_4", slot: 1 };
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
            else if (key === "topicGroup" || key === "vipGroup" || key === "ariyaGroup") {
                next.slot = 1;
            }
        }
        return next;
    }
    countTotalMastered() {
        const countMap = (m) => Object.values(m).filter((v) => v >= 1).length;
        return (countMap(this.progress.masteredBinary) +
            countMap(this.progress.masteredPeriodic) +
            countMap(this.progress.masteredPhalanx));
    }
    render() {
        const s = LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt;
        const acc = this.progress.totalAttempts > 0
            ? Math.round((this.progress.totalCorrect / this.progress.totalAttempts) * 100)
            : 100;
        const masteredCount = this.countTotalMastered();
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
            <div class="mnem-stat-pill">
              <span class="mnem-stat-lbl">⭐ ${esc(s.mastered)}</span>
              <strong class="mnem-stat-val">${masteredCount}</strong>
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
            <div class="mnem-tabpanel-inner">${this.activePillar === "binary" ? this.renderBinaryPillar(s) : ""}</div>
          </div>
          <div role="tabpanel" aria-labelledby="mnem-tab-periodic" class="mnem-tabpanel" ${this.activePillar === "periodic" ? "" : "hidden"}>
            <div class="mnem-tabpanel-inner">${this.activePillar === "periodic" ? this.renderPeriodicPillar(s) : ""}</div>
          </div>
          <div role="tabpanel" aria-labelledby="mnem-tab-phalanx" class="mnem-tabpanel" ${this.activePillar === "phalanx" ? "" : "hidden"}>
            <div class="mnem-tabpanel-inner">${this.activePillar === "phalanx" ? this.renderPhalanxPillar(s) : ""}</div>
          </div>
        </div>
      </div>
    `;
        this.wireEvents();
    }
    renderBinaryPillar(s) {
        const chapterBarHtml = `
      <div class="mnem-chapter-bar" role="navigation" aria-label="${esc(s.navaParicchedaTitle)}">
        <div class="mnem-chapter-bar-title">🏛️ <strong>${esc(s.navaParicchedaTitle)}</strong></div>
        <div class="mnem-chapter-btn-group">
          ${CANONICAL_CHAPTERS_META.map((ch) => `
            <button type="button" class="mnem-chapter-btn ${this.binActiveChapter === ch.num ? "active" : ""}" data-bin-chapter="${ch.num}" aria-pressed="${this.binActiveChapter === ch.num}">
              ${esc(ch.shortLabel[this.lang])}
            </button>`).join("")}
        </div>
      </div>
    `;
        if (this.binActiveChapter > 1) {
            return `
        ${chapterBarHtml}
        ${this.renderNaryChapterDecoder(s)}
      `;
        }
        const currentCitta = resolveCittaFromSwitches(this.switches, this.binEnumMode);
        const familyCittas = getSynthesizableCittas(this.switches.family, this.binEnumMode);
        const sw = this.switches;
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
        if (this.binMode === "challenge") {
            const target = this.binTargetCitta;
            const lvl = this.progress.level;
            const promptTitle = lvl === 3
                ? `<span lang="pi" class="mnem-pali-badge">${esc(target.pali)}</span> <span class="mnem-id-tag">Citta #${target.id}</span>`
                : lvl === 2
                    ? `<strong>${esc(target.name[this.lang])}</strong>`
                    : `<strong>${esc(target.name[this.lang])}</strong><div class="mnem-hint-line">💡 <span lang="pi">${esc(target.code)}</span> — ${esc(target.pali)}</div>`;
            let feedbackHtml = "";
            if (this.binFeedback) {
                if (this.binFeedback.isCorrect) {
                    feedbackHtml = `
            <div class="mnem-feedback mnem-feedback-ok" aria-live="polite">
              <div><strong>${esc(s.binCorrectMsg)}</strong></div>
              <div class="mnem-formula-note">${esc(target.formulaNote[this.lang])}</div>
            </div>
          `;
                }
                else {
                    const got = this.binFeedback.synthesized;
                    feedbackHtml = `
            <div class="mnem-feedback mnem-feedback-err" aria-live="polite">
              <div><strong>${esc(s.binWrongMsg)}</strong></div>
              <div>${esc(s.targetLabel)} <strong>#${target.id} ${esc(target.code)}</strong> (<span lang="pi">${esc(target.pali)}</span>)</div>
              <div>${esc(s.currentLabel)} <strong>${got ? `#${got.id} ${esc(got.code)}` : "—"}</strong></div>
            </div>
          `;
                }
            }
            const getFamLabel = (f) => familyLabels[f]?.[this.lang] ?? f;
            const getFamShortLabel = (f) => getFamLabel(f).split("(")[0]?.trim() ?? f;
            let mismatchHtml = "";
            if (sw.family !== target.family) {
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
            challengeHtml = `
        <div class="mnem-challenge-box">
          <div class="mnem-challenge-scope-bar">
            <span class="mnem-scope-label">${esc(s.binScopeLabel)}</span>
            <button type="button" class="mnem-scope-btn ${this.binFamilyScope === "all" ? "active" : ""}" data-bin-scope="all">
              ${this.binEnumMode === 121 ? esc(s.binScopeAll121) : esc(s.binScopeAll89)}
            </button>
            ${["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"]
                .map((fam) => `
                <button type="button" class="mnem-scope-btn ${this.binFamilyScope === fam ? "active" : ""}" data-bin-scope="${fam}">
                  ${esc(getFamShortLabel(fam))} (${fam === "lobha" ? "8" : fam === "dosa" ? "2" : fam === "moha" ? "2" : fam === "ahetuka" ? "18" : fam === "kamasobhana" ? "24" : fam === "rupavacara" ? "15" : fam === "arupavacara" ? "12" : (this.binEnumMode === 121 ? "40" : "8")})
                </button>`)
                .join("")}
          </div>
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">🎯 ${esc(s.binChallengeTitle)} (${esc(target.asRef)})</span>
            <div class="mnem-challenge-prompt">${promptTitle}</div>
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
            const isTargetFam = this.binMode === "challenge" && this.binTargetCitta.family === fam;
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

      ${currentCitta
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

      <div class="mnem-matrix-section">
        <h3 class="mnem-section-h3">${esc(s.binMatrixHeader)}</h3>
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
      </div>
    `;
    }
    renderNaryChapterDecoder(s) {
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
        return `
      <div class="mnem-equation-banner">
        <div class="mnem-eq-title">🏛️ ${esc(meta.title[this.lang])} · <span lang="pi">${esc(meta.paliTitle)}</span> (${esc(meta.asRef)})</div>
        <div class="mnem-eq-chips">
          <span class="mnem-eq-chip highlight">📐 <strong>${esc(meta.equation[this.lang])}</strong></span>
          ${activeSubmatrixMeta
            ? `<span class="mnem-eq-chip">🧮 <strong>${esc(s.narySubmatrixEqLabel)}</strong> ${esc(activeSubmatrixMeta.equation[this.lang])} (${esc(activeSubmatrixMeta.asRef)})</span>`
            : ""}
        </div>
      </div>
      ${submatrixBarHtml}

      <div class="mnem-challenge-card" style="margin-bottom:16px;">
        <div class="mnem-challenge-head">
          <span class="mnem-challenge-kicker">🎯 ${esc(meta.shortLabel[this.lang])} · ${esc(target.code)} (${esc(target.asRef)})</span>
          <div class="mnem-challenge-prompt">
            <span lang="pi" style="font-weight:700;">${esc(target.pali)}</span> — ${esc(target.name[this.lang])}
          </div>
          <div class="mnem-challenge-rel-grid" style="margin-top:8px;">
            <span class="mnem-rel-chip">🏷️ <strong>${esc(s.naryGroupLabel)}</strong> ${esc(this.formatCanonicalGroupName(target.primaryGroup))}</span>
            <span class="mnem-rel-chip">📂 <strong>${esc(s.narySubdivisionLabel)}</strong> ${esc(this.formatCanonicalGroupName(target.secondaryGroup))}</span>
          </div>
          <div class="mnem-rel-eradication-box" style="margin-top:8px;">
            📐 <strong>${esc(s.naryFormulaAnchor)}</strong> ${esc(target.formulaNote[this.lang])}
          </div>
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

      <div class="mnem-synthesized-card" style="margin-top:16px;">
        <div class="mnem-synth-header">
          <span class="mnem-synth-kicker">${esc(s.narySynthKicker)}</span>
          <span class="mnem-synth-code">${synthItem ? `${esc(synthItem.code)} (${esc(synthItem.asRef)})` : esc(s.naryEditingConfig)}</span>
        </div>
        ${synthItem
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

      <div class="mnem-matrix-section" style="margin-top:20px;">
        <h3 class="mnem-section-h3">${esc(s.naryCatalogueTitle(this.binActiveChapter, chapterItems.length))}</h3>
        <div class="mnem-matrix-grid">
          ${chapterItems
            .map((item) => {
            const isTarget = target.id === item.id;
            const isSelected = synthItem?.id === item.id;
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
      </div>
    `;
    }
    renderNarySwitchControls(chapter, sw, _s) {
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
                ];
                const currentLens = String(sw.lens ?? "sampayoga");
                if (currentLens === "sangaha") {
                    const sphereOptions = [
                        { val: "lokuttara", label: this.loc("Lokuttara (5 Jhānas: 36–33)", "Lokuttara (5 Jhānas: 36–33)", "Lokuttara (5 Jhānas: 36–33)") },
                        { val: "mahaggata", label: this.loc("Mahaggata (5 Jhānas: 35–30)", "Mahaggata (5 Jhānas: 35–30)", "Mahaggata (5 Jhānas: 35–30)") },
                        { val: "kamasobhana_kusala", label: this.loc("Mahākusala (4 Pares: 38–36)", "Mahākusala (4 Pairs: 38–36)", "Mahākusala (4 Pares: 38–36)") },
                        { val: "kamasobhana_kiriya", label: this.loc("Mahākiriya (4 Pares: 35–33)", "Mahākiriya (4 Pairs: 35–33)", "Mahākiriya (4 Pares: 35–33)") },
                        { val: "kamasobhana_vipaka", label: this.loc("Mahāvipāka (4 Pares: 33–31)", "Mahāvipāka (4 Pairs: 33–31)", "Mahāvipāka (4 Pares: 33–31)") },
                        { val: "akusala", label: this.loc("Akusala (7 Classes: 19–15)", "Akusala (7 Classes: 19–15)", "Akusala (7 Clases: 19–15)") },
                        { val: "ahetuka", label: this.loc("Ahetuka (4 Classes: 12–7)", "Ahetuka (4 Classes: 12–7)", "Ahetuka (4 Clases: 12–7)") },
                    ];
                    const currentSphere = String(sw.sphere ?? "lokuttara");
                    let slotOptions = [];
                    let cetCountVals = [];
                    if (currentSphere === "lokuttara" || currentSphere === "mahaggata") {
                        slotOptions = [
                            { val: 1, label: this.loc("1.º Jhāna", "1st Jhāna", "1.er Jhāna") },
                            { val: 2, label: this.loc("2.º Jhāna (−Vitakka)", "2nd Jhāna (−Vitakka)", "2.º Jhāna (−Vitakka)") },
                            { val: 3, label: this.loc("3.º Jhāna (−Vicāra)", "3rd Jhāna (−Vicāra)", "3.er Jhāna (−Vicāra)") },
                            { val: 4, label: this.loc("4.º Jhāna (−Pīti)", "4th Jhāna (−Pīti)", "4.º Jhāna (−Pīti)") },
                            { val: 5, label: this.loc("5.º Jhāna (Upekkhā)", "5th Jhāna (Upekkhā)", "5.º Jhāna (Upekkhā)") },
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
                    { val: "aññasamana", label: this.loc("Aññasamāna (13 Neutros: 7+6)", "Aññasamāna (13 Ethically Variable: 7+6)", "Aññasamāna (13 Neutros: 7+6)") },
                    { val: "akusala", label: this.loc("Akusala (14 Insalubres: 4+3+4+2+1)", "Akusala (14 Unwholesome: 4+3+4+2+1)", "Akusala (14 Inhábiles: 4+3+4+2+1)") },
                    { val: "sobhana", label: this.loc("Sobhana (25 Belos: 19+3+2+1)", "Sobhana (25 Beautiful: 19+3+2+1)", "Sobhana (25 Hermosos: 19+3+2+1)") },
                ];
                const currentGroup = String(sw.group ?? "aññasamana");
                let subOptions = [];
                if (currentGroup === "aññasamana") {
                    subOptions = [
                        { val: "sabbacitta", label: this.loc("Sabbacittasādhāraṇa (7 Universais)", "Sabbacittasādhāraṇa (7 Universals)", "Sabbacittasādhāraṇa (7 Universales)") },
                        { val: "pakinnaka", label: this.loc("Pakiṇṇaka (6 Particulares)", "Pakiṇṇaka (6 Occasionals)", "Pakiṇṇaka (6 Particulares)") },
                    ];
                }
                else if (currentGroup === "akusala") {
                    subOptions = [
                        { val: "moha", label: this.loc("Moha-catukka (4 Universais Insalubres)", "Moha-catukka (4 Unwholesome Universals)", "Moha-catukka (4 Universales Inhábiles)") },
                        { val: "lobha", label: this.loc("Lobha-tríade (3 Raiz Apego)", "Lobha-triad (3 Greed Root)", "Tríada de Lobha (3 Raíz Apego)") },
                        { val: "dosa", label: this.loc("Dosa-catukka (4 Raiz Aversão)", "Dosa-catukka (4 Hatred Root)", "Dosa-catukka (4 Raíz Aversión)") },
                        { val: "thina", label: this.loc("Thīna-duka (2 Torpor/Lentidão)", "Thīna-duka (2 Sloth & Torpor)", "Thīna-duka (2 Pereza/Torpor)") },
                        { val: "vicikiccha", label: this.loc("Vicikicchā (1 Dúvida Cética)", "Vicikicchā (1 Skeptical Doubt)", "Vicikicchā (1 Duda Escéptica)") },
                    ];
                }
                else {
                    subOptions = [
                        { val: "sadharana", label: this.loc("Sobhanasādhāraṇa (19 Universais Belos)", "Sobhanasādhāraṇa (19 Beautiful Universals)", "Sobhanasādhāraṇa (19 Universales Hermosos)") },
                        { val: "virati", label: this.loc("Virati (3 Abstenções Éticas)", "Virati (3 Ethical Abstinences)", "Virati (3 Abstenciones Éticas)") },
                        { val: "appamanna", label: this.loc("Appamaññā (2 Ilimitados: Compaixão/Alegria)", "Appamaññā (2 Illimitables: Compassion/Joy)", "Appamaññā (2 Ilimitables: Compasión/Alegría)") },
                        { val: "panna", label: this.loc("Paññindriya (1 Faculdade da Sabedoria)", "Paññindriya (1 Wisdom Faculty)", "Paññindriya (1 Facultad de Sabiduría)") },
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
                const sampayogaOptions = [
                    { val: 121, label: "121 (Sabbacitta)" },
                    { val: 110, label: "110 (Adhimokkha)" },
                    { val: 105, label: "105 (Vīriya)" },
                    { val: 101, label: "101 (Chanda)" },
                    { val: 91, label: "91 (19 Sobhanasādhāraṇa)" },
                    { val: 79, label: "79 (Paññindriya)" },
                    { val: 66, label: "66 (Vicāra)" },
                    { val: 55, label: "55 (Vitakka)" },
                    { val: 51, label: "51 (Pīti)" },
                    { val: 48, label: "48 (3 Virati)" },
                    { val: 28, label: "28 (2 Appamaññā)" },
                    { val: 12, label: "12 (Moha-catukka)" },
                    { val: 8, label: "8 (Lobha)" },
                    { val: 5, label: "5 (Thīna-Middha)" },
                    { val: 4, label: "4 (Diṭṭhi / Māna)" },
                    { val: 2, label: "2 (Dosa-catukka)" },
                    { val: 1, label: "1 (Vicikicchā)" },
                ];
                return `
          ${renderRow(this.loc("1. Método Canônico do Cap. 2 (Naya):", "1. Canonical Method of Ch. 2 (Naya):", "1. Método Canónico del Cap. 2 (Naya):"), "lens", lensOptions)}
          ${renderRow(this.loc("2. Grupo Canônico Principal (Cetasika-bheda):", "2. Main Canonical Group (Cetasika-bheda):", "2. Grupo Canónico Principal (Cetasika-bheda):"), "group", groupOptions)}
          ${renderRow(this.loc("3. Subfamília / Bloco:", "3. Subfamily / Block:", "3. Subfamilia / Bloque:"), "sub", subOptions)}
          ${renderRow(this.loc("4. Posição no Bloco:", "4. Slot Position:", "4. Posición en el Bloque:"), "slot", slotOptions)}
          ${renderRow(this.loc("5. Valência / Associação de Cittas (Sampayoga — 121):", "5. Valence / Association with Cittas (Sampayoga — 121):", "5. Valencia / Asociación de Cittas (Sampayoga — 121):"), "sampayoga", sampayogaOptions)}
        `;
            }
            case 3: {
                const catOptions = [
                    { val: "vedana", label: this.loc("1. Vedanā (5 Sensações · 121)", "1. Vedanā (5 Feelings · 121)", "1. Vedanā (5 Sensaciones · 121)") },
                    { val: "hetu", label: this.loc("2. Hetu (6 Raízes & Partição 89)", "2. Hetu (6 Roots & 89-Partition)", "2. Hetu (6 Raíces y Partición 89)") },
                    { val: "kicca", label: this.loc("3. Kicca (14 Funções & Multiplicidade)", "3. Kicca (14 Functions & Multiplicity)", "3. Kicca (14 Funciones y Multiplicidad)") },
                    { val: "dvara", label: this.loc("4. Dvāra (6 Portas & Partição 5-vias)", "4. Dvāra (6 Doors & 5-Way Partition)", "4. Dvāra (6 Puertas y Partición 5-vías)") },
                    { val: "arammana", label: this.loc("5. Ālambaṇa (7 Classes · 91 & 6 Objetos)", "5. Ālambaṇa (7 Classes · 91 & 6 Objects)", "5. Ālambaṇa (7 Clases · 91 y 6 Objetos)") },
                    { val: "vatthu", label: this.loc("6. Vatthu (43+42+4 & 6/3/0 nos Reinos)", "6. Vatthu (43+42+4 & 6/3/0 in Realms)", "6. Vatthu (43+42+4 y 6/3/0 en Reinos)") },
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
                    ];
                    countVals = [1, 2, 55, 62];
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
                        { val: "ekakicca", label: this.loc("Partição: Ekakicca (1 Função)", "Partition: Ekakicca (1 Function)", "Partición: Ekakicca (1 Función)") },
                        { val: "dukicca", label: this.loc("Partição: Dukicca (2 Funções)", "Partition: Dukicca (2 Functions)", "Partición: Dukicca (2 Funciones)") },
                        { val: "tikicca", label: this.loc("Partição: Tikicca (3 Funções)", "Partition: Tikicca (3 Functions)", "Partición: Tikicca (3 Funciones)") },
                        { val: "catukicca", label: this.loc("Partição: Catukicca (4 Funções)", "Partition: Catukicca (4 Functions)", "Partición: Catukicca (4 Funciones)") },
                        { val: "pancakicca", label: this.loc("Partição: Pañcakicca (5 Funções)", "Partition: Pañcakicca (5 Functions)", "Partición: Pañcakicca (5 Funciones)") },
                    ];
                    countVals = [1, 2, 3, 8, 9, 11, 19, 55, 68];
                }
                else if (currentCat === "dvara") {
                    itemOptions = [
                        { val: "pancadvara", label: this.loc("Total: Pañcadvāra (5 Portas)", "Total: Pañcadvāra (5 Doors)", "Total: Pañcadvāra (5 Puertas)") },
                        { val: "manodvara", label: this.loc("Total: Manodvāra (Porta Mental)", "Total: Manodvāra (Mind Door)", "Total: Manodvāra (Puerta Mental)") },
                        { val: "dvaravimutta", label: this.loc("Total: Dvāravimutta (Livre)", "Total: Dvāravimutta (Door-Free)", "Total: Dvāravimutta (Libre)") },
                        { val: "ekadvarika", label: this.loc("Partição: Ekadvārika (1 Porta)", "Partition: Ekadvārika (1 Door)", "Partición: Ekadvārika (1 Puerta)") },
                        { val: "pancadvarika_3", label: this.loc("Partição: Pañcadvārika (5 Portas)", "Partition: Pañcadvārika (5 Doors)", "Partición: Pañcadvārika (5 Puertas)") },
                        { val: "chadvarika", label: this.loc("Partição: Chadvārika (6 Portas)", "Partition: Chadvārika (6 Doors)", "Partición: Chadvārika (6 Puertas)") },
                        { val: "chadvarika_vimutta", label: this.loc("Partição: 6 Portas e Livre", "Partition: 6 Doors & Free", "Partición: 6 Puertas y Libre") },
                        { val: "sabbatha_vimutta", label: this.loc("Partição: Sempre Livre", "Partition: Always Free", "Partición: Siempre Libre") },
                    ];
                    countVals = [3, 9, 10, 19, 31, 36, 54, 67];
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
                        { val: "dhammarammana_6", label: this.loc("6 Componentes de Dhammārammaṇa", "6 Constituents of Dhammārammaṇa", "6 Componentes de Dhammārammaṇa") },
                    ];
                    countVals = [5, 6, 8, 20, 21, 25];
                }
                else {
                    itemOptions = [
                        { val: "nissaya", label: this.loc("Nissāya (Sempre c/ Base)", "Nissāya (Always Base-Dependent)", "Nissāya (Siempre con Base)") },
                        { val: "nissaya_anissaya", label: this.loc("Nissāya vā Anissāya vā (Com ou Sem)", "Nissāya vā Anissāya vā (With or Without)", "Nissāya vā Anissāya vā (Con o Sin)") },
                        { val: "anissita", label: this.loc("Anissita (Nunca c/ Base)", "Anissita (Never Base-Dependent)", "Anissita (Nunca con Base)") },
                        { val: "vatthu_kamaloka", label: this.loc("Reino: Kāmaloka (6 Vatthus)", "Realm: Kāmaloka (6 Bases)", "Reino: Kāmaloka (6 Bases)") },
                        { val: "vatthu_rupaloka", label: this.loc("Reino: Rūpaloka (3 Vatthus)", "Realm: Rūpaloka (3 Bases)", "Reino: Rūpaloka (3 Bases)") },
                        { val: "vatthu_arupaloka", label: this.loc("Reino: Arūpaloka (0 Vatthus)", "Realm: Arūpaloka (0 Bases)", "Reino: Arūpaloka (0 Bases)") },
                    ];
                    countVals = [0, 3, 4, 6, 42, 43];
                }
                const countOptions = countVals.map((n) => ({
                    val: n,
                    label: currentCat === "vatthu" && (n === 0 || n === 3 || n === 6)
                        ? this.loc(`${n} Vatthus`, `${n} Bases`, `${n} Bases`)
                        : n === 1
                            ? "1 Citta"
                            : `${n} Cittas`,
                }));
                return `
          ${renderRow(this.loc("1. Categoria Mista (Pakiṇṇaka):", "1. Miscellaneous Category (Pakiṇṇaka):", "1. Categoría Mixta (Pakiṇṇaka):"), "category", catOptions)}
          ${renderRow(this.loc("2. Fator / Partição Canônica:", "2. Canonical Factor / Partition:", "2. Factor / Partición Canónica:"), "item", itemOptions)}
          ${renderRow(this.loc("3. Contagem Canônica (89 / 121 / Reinos):", "3. Canonical Count (89 / 121 / Realms):", "3. Conteo Canónico (89 / 121 / Reinos):"), "count", countOptions)}
        `;
            }
            case 4: {
                const doorOptions = [
                    { val: "pancadvara", label: this.loc("1. Pañcadvāra (5 Portas · 4 Vāras)", "1. Pañcadvāra (5 Doors · 4 Vāras)", "1. Pañcadvāra (5 Puertas · 4 Vāras)") },
                    { val: "manodvara", label: this.loc("2. Manodvāra & Appanā (32/12/8/6)", "2. Manodvāra & Appanā (32/12/8/6)", "2. Manodvāra y Appanā (32/12/8/6)") },
                    { val: "niyama", label: this.loc("3. Tadārammaṇa & Javana-niyama", "3. Tadārammaṇa & Javana Laws", "3. Leyes Tadārammaṇa y Javana") },
                    { val: "puggala_bhumi", label: this.loc("4. Puggalabheda & Bhūmivibhāga", "4. Puggalabheda & Bhūmivibhāga", "4. Puggalabheda y Bhūmivibhāga") },
                ];
                const currentDoor = String(sw.door ?? "pancadvara");
                let varaOptions = [];
                let vithicittaOptions = [];
                if (currentDoor === "pancadvara") {
                    varaOptions = [
                        { val: "tadarammana", label: this.loc("Tadārammaṇavāra (Atimahanta · até Registro)", "Tadārammaṇavāra (Atimahanta · to Registration)", "Tadārammaṇavāra (Atimahanta · hasta Registro)") },
                        { val: "javana", label: this.loc("Javanavāra (Mahanta · até Javana)", "Javanavāra (Mahanta · to Javana)", "Javanavāra (Mahanta · hasta Javana)") },
                        { val: "votthabbana", label: this.loc("Voṭṭhabbanavāra (Paritta · até Determinação)", "Voṭṭhabbanavāra (Paritta · to Determining)", "Voṭṭhabbanavāra (Paritta · hasta Determinación)") },
                        { val: "mogha", label: this.loc("Moghavāra (Atiparitta · Sem Vīthicitta)", "Moghavāra (Atiparitta · Futile Course)", "Moghavāra (Atiparitta · Curso Fútil)") },
                        { val: "summary_54", label: this.loc("Síntese Pañcadvāra (7·14·54 · 17 Cittakkhaṇas)", "Pañcadvāra Summary (7·14·54 · 17 Cittakkhaṇas)", "Síntesis Pañcadvāra (7·14·54 · 17 Cittakkhaṇas)") },
                    ];
                    vithicittaOptions = [
                        { val: 14, label: "14 Vīthicittas (Atimahanta)" },
                        { val: 12, label: "12 Vīthicittas (Mahanta)" },
                        { val: 6, label: "6–7 Vīthicittas (Paritta)" },
                        { val: 0, label: "0 Vīthicittas (Moghavāra)" },
                        { val: 54, label: this.loc("54 Cittas (Síntese das 5 Portas)", "54 Cittas (5-Door Total)", "54 Cittas (Síntesis de 5 Puertas)") },
                    ];
                }
                else if (currentDoor === "manodvara") {
                    varaOptions = [
                        { val: "tadarammana", label: this.loc("Vibhūtārammaṇa (Claro · até Tadārammaṇa)", "Vibhūtārammaṇa (Clear · to Tadārammaṇa)", "Vibhūtārammaṇa (Claro · hasta Tadārammaṇa)") },
                        { val: "javana", label: this.loc("Avibhūtārammaṇa (Obscuro · até Javana)", "Avibhūtārammaṇa (Obscure · to Javana)", "Avibhūtārammaṇa (Oscuro · hasta Javana)") },
                        { val: "appana", label: this.loc("Appanāvīthi (Estágios Preliminares + Absorção)", "Appanāvīthi (Preliminary Stages + Absorption)", "Appanāvīthi (Etapas Preliminares + Absorción)") },
                        { val: "appana_som_kus", label: this.loc("Transição: Mahākusala Somanassa → Appanā", "Transition: Somanassa Mahākusala → Appanā", "Transición: Mahākusala Somanassa → Appanā") },
                        { val: "appana_upe_kus", label: this.loc("Transição: Mahākusala Upekkhā → Appanā", "Transition: Upekkhā Mahākusala → Appanā", "Transición: Mahākusala Upekkhā → Appanā") },
                        { val: "appana_som_kir", label: this.loc("Transição: Mahākiriya Somanassa → Appanā", "Transition: Somanassa Mahākiriya → Appanā", "Transición: Mahākiriya Somanassa → Appanā") },
                        { val: "appana_upe_kir", label: this.loc("Transição: Mahākiriya Upekkhā → Appanā", "Transition: Upekkhā Mahākiriya → Appanā", "Transición: Mahākiriya Upekkhā → Appanā") },
                    ];
                    vithicittaOptions = [
                        { val: 10, label: "10 Vīthicittas (Vibhūta)" },
                        { val: 8, label: "8 (Avibhūta / Kiriya Som → Appanā)" },
                        { val: 5, label: this.loc("5+ Estágios (Appanāvīthi)", "5+ Stages (Appanāvīthi)", "5+ Etapas (Appanāvīthi)") },
                        { val: 32, label: "32 Appanā (Kusala Somanassa)" },
                        { val: 12, label: "12 Appanā (Kusala Upekkhā)" },
                        { val: 6, label: "6 Appanā (Kiriya Upekkhā)" },
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
                        { val: 1, label: this.loc("1 Momento (Magga / Abhiññā / Āgantuka)", "1 Moment (Path / Abhiññā / Āgantuka)", "1 Momento (Magga / Abhiññā / Āgantuka)") },
                        { val: 2, label: this.loc("2 Momentos (Tadārammaṇa / Nirodha)", "2 Moments (Tadārammaṇa / Nirodha)", "2 Momentos (Tadārammaṇa / Nirodha)") },
                        { val: 3, label: this.loc("3 Graus (Aniṭṭha / Iṭṭha / Ati-iṭṭha)", "3 Grades (Aniṭṭha / Iṭṭha / Ati-iṭṭha)", "3 Grados (Aniṭṭha / Iṭṭha / Ati-iṭṭha)") },
                        { val: 4, label: this.loc("4–5 Momentos (Milagre Duplo)", "4–5 Moments (Twin Miracle)", "4–5 Momentos (Milagro Doble)") },
                        { val: 5, label: this.loc("5 Momentos (Maraṇakāla)", "5 Moments (Near Death)", "5 Momentos (Maraṇakāla)") },
                        { val: 7, label: this.loc("7 (ou 6) Momentos (Normal)", "7 (or 6) Moments (Normal)", "7 (o 6) Momentos (Normal)") },
                        { val: 99, label: this.loc("∞ Incontáveis (Samāpatti)", "∞ Innumerable (Samāpatti)", "∞ Incontables (Samāpatti)") },
                    ];
                }
                else {
                    varaOptions = [
                        { val: "pug_asekkha", label: this.loc("Indivíduo: Asekkha (Arahant)", "Individual: Asekkha (Arahant)", "Individuo: Asekkha (Arahant)") },
                        { val: "pug_sekkha", label: this.loc("Indivíduo: Sekkha (Nobre Aprendiz)", "Individual: Sekkha (Noble Trainee)", "Individuo: Sekkha (Noble Aprendiz)") },
                        { val: "pug_puthujjana", label: this.loc("Indivíduo: Puthujjana (Comum)", "Individual: Puthujjana (Worldling)", "Individuo: Puthujjana (Común)") },
                        { val: "bhu_kama", label: this.loc("Plano: Kāmāvacarabhūmi", "Plane: Kāmāvacarabhūmi", "Plano: Kāmāvacarabhūmi") },
                        { val: "bhu_rupa", label: this.loc("Plano: Rūpāvacarabhūmi", "Plane: Rūpāvacarabhūmi", "Plano: Rūpāvacarabhūmi") },
                        { val: "bhu_arupa", label: this.loc("Plano: Arūpāvacarabhūmi", "Plane: Arūpāvacarabhūmi", "Plano: Arūpāvacarabhūmi") },
                        { val: "bhu_asanna", label: this.loc("Plano: Asaññasattabhūmi", "Plane: Asaññasattabhūmi", "Plano: Asaññasattabhūmi") },
                    ];
                    vithicittaOptions = [
                        { val: 44, label: "44 Cittas (Asekkha)" },
                        { val: 56, label: "56 Cittas (Sekkha)" },
                        { val: 54, label: "54 Cittas (Puthujjana)" },
                        { val: 80, label: "80 Vīthicittas (Kāma)" },
                        { val: 64, label: "64 Vīthicittas (Rūpa)" },
                        { val: 42, label: "42 Vīthicittas (Arūpa)" },
                        { val: 0, label: "0 Vīthicittas (Asaññasatta)" },
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
                        { val: "apaya_patisandhi", label: "Apāya-paṭisandhi (#19)" },
                        { val: "kamasugati_patisandhi", label: "Kāmasugati-paṭisandhi (#27 + 8 Mahāvipāka)" },
                        { val: "rupa_patisandhi", label: "Rūpāvacara-paṭisandhi (5 + Jīvitanavaka)" },
                        { val: "arupa_patisandhi", label: "Arūpāvacara-paṭisandhi (4 Vipāka)" },
                        { val: "pat_ara_kama", label: this.loc("Objeto de Kāma-paṭisandhi (3 Signos)", "Kāma-paṭisandhi Object (3 Signs)", "Objeto de Kāma-paṭisandhi (3 Signos)") },
                        { val: "pat_ara_mah", label: this.loc("Objeto de Rūpa/Arūpa (Só Kammanimitta)", "Rūpa/Arūpa Object (Kammanimitta Only)", "Objeto de Rūpa/Arūpa (Solo Kammanimitta)") },
                        { val: "pat_const3", label: this.loc("Tríade: Rūpa / Arūpa / Rūpārūpa", "Triad: Rūpa / Arūpa / Rūpārūpa", "Tríada: Rūpa / Arūpa / Rūpārūpa") },
                    ];
                    const countOptions = [1, 2, 3, 4, 6, 9].map((n) => ({
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
                        { val: "pakathana", label: this.loc("4. Pākaṭhāna (Por Plano: 12/8/5/4)", "4. Pākaṭhāna (By Place: 12/8/5/4)", "4. Pākaṭhāna (Por Lugar: 12/8/5/4)") },
                        { val: "ripening", label: this.loc("5. Maturação (Vipāka: 7/16/12/8)", "5. Ripening (Vipāka: 7/16/12/8)", "5. Maduración (Vipāka: 7/16/12/8)") },
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
                            { val: "place_akusala", label: "Akusala (12)" },
                            { val: "place_kama", label: "Kāmāvacara-kusala (8)" },
                            { val: "place_rupa", label: "Rūpāvacara-kusala (5)" },
                            { val: "place_arupa", label: "Arūpāvacara-kusala (4)" },
                        ];
                        cVals = [12, 8, 5, 4];
                    }
                    else {
                        subOpts = [
                            { val: "rip_akusala", label: "Akusala (11→Apāya · 12→7)" },
                            { val: "rip_ti_ukk", label: this.loc("Tihetuka Superior (16)", "Superior 3-Root (16)", "Tihetuka Superior (16)") },
                            { val: "rip_dvi_12", label: this.loc("Tihetuka Inf. / Dvihetuka Sup. (12)", "Inferior 3-Root / Superior 2-Root (12)", "Tihetuka Inf. / Dvihetuka Sup. (12)") },
                            { val: "rip_ahe_8", label: this.loc("Dvihetuka Inferior (8)", "Inferior 2-Root (8)", "Dvihetuka Inferior (8)") },
                        ];
                        cVals = [7, 16, 12, 8];
                    }
                    const cOpts = cVals.map((n) => ({
                        val: n,
                        label: curKg === "pakathana" || curKg === "ripening" ? `${n} Cittas` : `#${n}`,
                    }));
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
            ${renderRow(this.loc("2. Tétrade / Lei de Kamma:", "2. Kamma Tetrad / Law:", "2. Tétrada / Ley de Kamma:"), "kammaGroup", kgOptions)}
            ${renderRow(this.loc("3. Tipo Específico:", "3. Specific Type:", "3. Tipo Específico:"), "subtype", subOpts)}
            ${renderRow(this.loc("4. Ordem / Contagem de Cittas:", "4. Order / Citta Count:", "4. Orden / Conteo de Cittas:"), "count", cOpts)}
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
                            { val: "dosa", label: this.loc("Raiz Dosa (Aversão · 3)", "Dosa Root (Hatred · 3)", "Raíz Dosa (Aversión · 3)") },
                            { val: "lobha", label: this.loc("Raiz Lobha (Apego · 3)", "Lobha Root (Greed · 3)", "Raíz Lobha (Apego · 3)") },
                            { val: "two_roots", label: this.loc("2 Raízes (Lobha ou Dosa · 4)", "2 Roots (Lobha or Dosa · 4)", "2 Raíces (Lobha o Dosa · 4)") },
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
                        { val: "ayukkhaya", label: this.loc("1. Āyukkhaya (Exaustão da Longevidade)", "1. Āyukkhaya (Lifespan Exhaustion)", "1. Āyukkhaya (Agotamiento Vital)") },
                        { val: "kammakkhaya", label: this.loc("2. Kammakkhaya (Exaustão do Kamma)", "2. Kammakkhaya (Kamma Exhaustion)", "2. Kammakkhaya (Agotamiento del Kamma)") },
                        { val: "ubhayakkhaya", label: this.loc("3. Ubhayakkhaya (Exaustão de Ambos)", "3. Ubhayakkhaya (Both Exhausted)", "3. Ubhayakkhaya (Agotamiento de Ambos)") },
                        { val: "upacchedaka", label: this.loc("4. Upacchedakakamma (Destrutivo)", "4. Upacchedakakamma (Destructive)", "4. Upacchedakakamma (Destructor)") },
                    ]
                    : curMg === "nimitta_3"
                        ? [
                            { val: "sign_kamma", label: this.loc("1. Kamma (Volição Passada)", "1. Kamma (Past Volition)", "1. Kamma (Volición Pasada)") },
                            { val: "sign_kammanimitta", label: this.loc("2. Kammanimitta (Signo do Kamma)", "2. Kammanimitta (Sign of Kamma)", "2. Kammanimitta (Signo del Kamma)") },
                            { val: "sign_gatinimitta", label: this.loc("3. Gatinimitta (Signo do Destino)", "3. Gatinimitta (Sign of Destiny)", "3. Gatinimitta (Signo del Destino)") },
                        ]
                        : [
                            { val: "cuti_arupa", label: this.loc("Arūpa-cuti → Arūpa Igual/Sup. ou Kāma 3r", "Arūpa-cuti → Same/Higher Arūpa or 3-Root Kāma", "Arūpa-cuti → Arūpa Igual/Sup. o Kāma 3r") },
                            { val: "cuti_rupa", label: this.loc("Rūpa-cuti → Qualquer Exceto Ahetuka", "Rūpa-cuti → Any Except Rootless", "Rūpa-cuti → Cualquiera Excepto Ahetuka") },
                            { val: "cuti_kama3", label: this.loc("Kāma Tihetuka → Todos os 4 Planos", "Kāma 3-Root → All 4 Realms", "Kāma Tihetuka → Los 4 Planos") },
                            { val: "cuti_kama_other", label: this.loc("Kāma Ahetuka/Dvihetuka → Só Kāma", "Kāma 0/2-Root → Kāma Only", "Kāma Ahetuka/Dvihetuka → Solo Kāma") },
                        ];
                return `
          ${renderRow(this.loc("1. Seção do Cap. 5 (Vīthimutta):", "1. Ch. 5 Section (Vīthimutta):", "1. Sección del Cap. 5 (Vīthimutta):"), "tetrad", tetradOptions)}
          ${renderRow(this.loc("2. Domínio de Morte / Transição:", "2. Death / Transition Domain:", "2. Dominio de Muerte / Transición:"), "mGroup", mGroupOptions)}
          ${renderRow(this.loc("3. Regra / Fator Específico:", "3. Specific Rule / Factor:", "3. Regla / Factor Específico:"), "subtype", mSubOptions)}
        `;
            }
            case 6: {
                const secOptions = [
                    { val: "rupa_28", label: this.loc("1. 28 Rūpas Individuais (18+10)", "1. 28 Individual Rūpas (18+10)", "1. 28 Rūpas Individuales (18+10)") },
                    { val: "vibhaga_10", label: this.loc("2. 10 Díades & 4 Samuṭṭhānas", "2. 10 Dyads & 4 Origins", "2. 10 Díadas y 4 Orígenes") },
                    { val: "kalapa_21", label: this.loc("3. 21 Rūpakalāpas (Álgebra Octeto)", "3. 21 Rūpakalāpas (Octad Algebra)", "3. 21 Rūpakalāpas (Álgebra Octeto)") },
                    { val: "pavatti_nibbana", label: this.loc("4. Pavattikkama & Nibbāna", "4. Pavattikkama & Nibbāna", "4. Pavattikkama y Nibbāna") },
                ];
                const curSec = String(sw.section ?? "rupa_28");
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
                        { val: "catusamutthana", label: this.loc("4 Origens (Kamma·Citta·Utu·Āhāra)", "4 Origins (Kamma·Citta·Utu·Āhāra)", "4 Orígenes (Kamma·Citta·Utu·Āhāra)") },
                        { val: "kammaja", label: this.loc("Só Kamma (8 Indriya + Hadaya)", "Kamma Only (8 Indriya + Hadaya)", "Solo Kamma (8 Indriya + Hadaya)") },
                        { val: "cittaja", label: this.loc("Só Citta (2 Viññatti)", "Citta Only (2 Viññatti)", "Solo Citta (2 Viññatti)") },
                        { val: "cittotuja", label: this.loc("Citta + Utu (Sadda / Som)", "Citta + Utu (Sadda / Sound)", "Citta + Utu (Sadda / Sonido)") },
                        { val: "utucittahara", label: this.loc("Utu + Citta + Āhāra (3 Vikāra)", "Utu + Citta + Āhāra (3 Vikāra)", "Utu + Citta + Āhāra (3 Vikāra)") },
                        { val: "none_lakkhana", label: this.loc("0 Origens (4 Lakkhaṇa)", "0 Origins (4 Lakkhaṇa)", "0 Orígenes (4 Lakkhaṇa)") },
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
                        { val: "kamma", label: this.loc("Kamma (9 Kalāpas: 8 Décadas + 1 Nônada)", "Kamma (9 Kalāpas: 8 Decads + 1 Nonad)", "Kamma (9 Kalāpas: 8 Décadas + 1 Nónada)") },
                        { val: "citta", label: this.loc("Citta (6 Kalāpas: 3×2 · 8 a 13 Rūpas)", "Citta (6 Kalāpas: 3×2 · 8 to 13 Rūpas)", "Citta (6 Kalāpas: 3×2 · 8 a 13 Rūpas)") },
                        { val: "utu", label: this.loc("Utu (4 Kalāpas: 2×2 · 2 Externos)", "Utu (4 Kalāpas: 2×2 · 2 External)", "Utu (4 Kalāpas: 2×2 · 2 Externos)") },
                        { val: "ahara", label: this.loc("Āhāra (2 Kalāpas: 1×2 · 8 e 11)", "Āhāra (2 Kalāpas: 1×2 · 8 & 11)", "Āhāra (2 Kalāpas: 1×2 · 8 y 11)") },
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
                    { val: "pav_kama", label: this.loc("Pavatti: Kāmaloka (7 / 3 Décadas)", "Pavatti: Kāmaloka (7 / 3 Decads)", "Pavatti: Kāmaloka (7 / 3 Décadas)") },
                    { val: "pav_rupa", label: this.loc("Pavatti: Rūpaloka (4 Kalāpas)", "Pavatti: Rūpaloka (4 Kalāpas)", "Pavatti: Rūpaloka (4 Kalāpas)") },
                    { val: "pav_asanna", label: this.loc("Pavatti: Asaññasatta (Jīvitanavaka)", "Pavatti: Asaññasatta (Vital Nonad)", "Pavatti: Asaññasatta (Jīvitanavaka)") },
                    { val: "pav_arupa", label: this.loc("Pavatti: Arūpaloka (Sem Matéria)", "Pavatti: Arūpaloka (No Matter)", "Pavatti: Arūpaloka (Sin Materia)") },
                    { val: "pav_start4", label: this.loc("Cronologia dos 4 Inícios (AS VI.55)", "Timeline of 4 Starts (AS VI.55)", "Cronología de 4 Inicios (AS VI.55)") },
                    { val: "pav_death17", label: this.loc("Cessação na Morte (AS VI.56)", "Cessation at Death (AS VI.56)", "Cesación en la Muerte (AS VI.56)") },
                    { val: "pav_absent4", label: this.loc("Ausentes em Paṭisandhi (AS VI.61)", "Absent at Rebirth (AS VI.61)", "Ausentes en Paṭisandhi (AS VI.61)") },
                    { val: "nib_one", label: this.loc("Nibbāna: 1 Natureza (Asaṅkhata)", "Nibbāna: 1 Nature (Unconditioned)", "Nibbāna: 1 Naturaleza (Asaṅkhata)") },
                    { val: "nib_two", label: this.loc("Nibbāna: 2 Modos (Sa/Anupādisesa)", "Nibbāna: 2 Modes (Sa/Anupādisesa)", "Nibbāna: 2 Modos (Sa/Anupādisesa)") },
                    { val: "nib_three", label: this.loc("Nibbāna: 3 Aspectos (Suññata/Animitta/Appaṇihita)", "Nibbāna: 3 Aspects (Empty/Signless/Undirected)", "Nibbāna: 3 Aspectos (Vacío/Sin-Signo/Sin-Deseo)") },
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
                    { val: "akusala_9", label: this.loc("1. Akusala-saṅgaha (9 Grupos · Redução Vatthuto)", "1. Akusala-saṅgaha (9 Groups · Vatthuto Reduction)", "1. Akusala-saṅgaha (9 Grupos · Reducción Vatthuto)") },
                    { val: "missaka_7", label: this.loc("2. Missaka-saṅgaha (7 Grupos + Leis)", "2. Missaka-saṅgaha (7 Groups + Laws)", "2. Missaka-saṅgaha (7 Grupos + Leyes)") },
                    { val: "bodhipakkhiya_21", label: this.loc("3. Bodhipakkhiya (7 Grupos = 37 → 14 Sabhāva)", "3. Bodhipakkhiya (7 Groups = 37 → 14 Sabhāva)", "3. Bodhipakkhiya (7 Grupos = 37 → 14 Sabhāva)") },
                    { val: "sabba_7", label: this.loc("4. Sabba-saṅgaha (5 Sínteses + 69 & 29)", "4. Sabba-saṅgaha (5 Syntheses + 69 & 29)", "4. Sabba-saṅgaha (5 Síntesis + 69 y 29)") },
                ];
                const currentComp = String(sw.compendium ?? "akusala_9");
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
                            { val: "satipatthana", label: this.loc("1. 4 Satipaṭṭhānā (Atenção Plena)", "1. 4 Satipaṭṭhānā (Mindfulness)", "1. 4 Satipaṭṭhānā (Atención Plena)") },
                            { val: "sammappadhana", label: this.loc("2. 4 Sammappadhānā (Esforços)", "2. 4 Sammappadhānā (Right Strivings)", "2. 4 Sammappadhānā (Esfuerzos)") },
                            { val: "iddhipada", label: this.loc("3. 4 Iddhipādā (Bases do Poder)", "3. 4 Iddhipādā (Bases of Power)", "3. 4 Iddhipādā (Bases del Poder)") },
                            { val: "indriya5", label: this.loc("4. 5 Indriyāni (Faculdades)", "4. 5 Indriyāni (Faculties)", "4. 5 Indriyāni (Facultades)") },
                            { val: "bala5", label: this.loc("5. 5 Balāni (Poderes)", "5. 5 Balāni (Powers)", "5. 5 Balāni (Poderes)") },
                            { val: "bojjhanga", label: this.loc("6. 7 Bojjhaṅgā (Iluminação)", "6. 7 Bojjhaṅgā (Enlightenment)", "6. 7 Bojjhaṅgā (Iluminación)") },
                            { val: "magganga", label: this.loc("7. 8 Maggaṅgāni (Caminho Óctuplo)", "7. 8 Maggaṅgāni (Eightfold Path)", "7. 8 Maggaṅgāni (Óctuple Sendero)") },
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
                    { val: "khandha", label: this.loc("1. 5 Khandhā (Agregados)", "1. 5 Khandhā (Aggregates)", "1. 5 Khandhā (Agregados)") },
                    { val: "upadanakkhandha", label: this.loc("2. 5 Upādānakkhandhā (De Apego)", "2. 5 Upādānakkhandhā (Of Clinging)", "2. 5 Upādānakkhandhā (De Apego)") },
                    { val: "ayatana", label: this.loc("3. 12 Āyatanāni (Bases)", "3. 12 Āyatanāni (Sense Bases)", "3. 12 Āyatanāni (Bases)") },
                    { val: "dhatu", label: this.loc("4. 18 Dhātuyo (Elementos)", "4. 18 Dhātuyo (Elements)", "4. 18 Dhātuyo (Elementos)") },
                    { val: "ariyasacca", label: this.loc("5. 4 Ariyasaccāni (Nobres Verdades)", "5. 4 Ariyasaccāni (Noble Truths)", "5. 4 Ariyasaccāni (Nobles Verdades)") },
                    { val: "dhammayatana_69", label: this.loc("Dhammāyatana / Dhātu (52+16+1)", "Dhammāyatana / Dhātu (52+16+1)", "Dhammāyatana / Dhātu (52+16+1)") },
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
                    { val: "pannatti_8", label: this.loc("3. Paññattibheda (Attha & 6 Nāmapaññatti)", "3. Paññattibheda (Attha & 6 Nāmapaññatti)", "3. Paññattibheda (Attha y 6 Nāmapaññatti)") },
                ];
                const currentMethod = String(sw.method ?? "paticcasamuppada");
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
                        { val: "addha_3", label: this.loc("Tayo Addhā (3 Períodos)", "Tayo Addhā (3 Periods)", "Tayo Addhā (3 Períodos)") },
                        { val: "akara_20", label: this.loc("Vīsatākārā (20 Modos)", "Vīsatākārā (20 Modes)", "Vīsatākārā (20 Modos)") },
                        { val: "sandhi_3", label: this.loc("Tisandhi (3 Junções)", "Tisandhi (3 Connections)", "Tisandhi (3 Conexiones)") },
                        { val: "sankhepa_4", label: this.loc("Catusaṅkhepā (4 Blocos)", "Catusaṅkhepā (4 Summaries)", "Catusaṅkhepā (4 Bloques)") },
                        { val: "vatta_3", label: this.loc("Tīṇi Vaṭṭāni (3 Rodas)", "Tīṇi Vaṭṭāni (3 Rounds)", "Tīṇi Vaṭṭāni (3 Ruedas)") },
                        { val: "mula_2", label: this.loc("Dve Mūlāni (2 Raízes)", "Dve Mūlāni (2 Roots)", "Dve Mūlāni (2 Raíces)") },
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
                    const idxOpts = dirConditions[curDir] ?? dirConditions.nama_nama;
                    return `
            ${renderRow(this.loc("1. Método Causal (Cap. 8):", "1. Causal Method (Ch. 8):", "1. Método Causal (Cap. 8):"), "method", methodOptions)}
            ${renderRow(this.loc("2. Matriz Direcional (6+5+1+1+2+9 = 24):", "2. Directional Matrix (6+5+1+1+2+9 = 24):", "2. Matriz Direccional (6+5+1+1+2+9 = 24):"), "direction", dirOpts)}
            ${renderRow(this.loc("3. Condição do Paṭṭhāna (#1..#24):", "3. Paṭṭhāna Condition (#1..#24):", "3. Condición del Paṭṭhāna (#1..#24):"), "index", idxOpts)}
          `;
                }
                const panTypeOpts = [
                    { val: "atthapannatti", label: this.loc("Classe: Atthapaññatti (Significado · 6)", "Class: Atthapaññatti (Meaning · 6)", "Clase: Atthapaññatti (Significado · 6)") },
                    { val: "namapannatti", label: this.loc("Classe: Nāmapaññatti (Nome · 6)", "Class: Nāmapaññatti (Name · 6)", "Clase: Nāmapaññatti (Nombre · 6)") },
                    { val: "v_only", label: "1. Vijjamānapaññatti (Rūpa)" },
                    { val: "a_only", label: "2. Avijjamānapaññatti (Bhūmi)" },
                    { val: "v_to_a", label: "3. Vijjamānena Avijjamāna (Chaḷabhiñño)" },
                    { val: "a_to_v", label: "4. Avijjamānena Vijjamāna (Itthisaddo)" },
                    { val: "v_to_v", label: "5. Vijjamānena Vijjamāna (Cakkhuviññāṇaṃ)" },
                    { val: "a_to_a", label: "6. Avijjamānena Avijjamāna (Rājaputto)" },
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
                ];
                const currentWing = String(sw.wing ?? "samatha_40");
                if (currentWing === "samatha_40") {
                    const groupOptions = [
                        { val: "kasina", label: this.loc("10 Kasiṇas (5 Jhānas · Paṭibhāga)", "10 Kasiṇas (5 Jhānas · Paṭibhāga)", "10 Kasiṇas (5 Jhānas · Paṭibhāga)") },
                        { val: "asubha", label: this.loc("10 Asubhas (1.º Jhāna · Paṭibhāga)", "10 Asubhas (1st Jhāna · Paṭibhāga)", "10 Asubhas (1.er Jhāna · Paṭibhāga)") },
                        { val: "anussati", label: this.loc("10 Anussatis (8 Upacāra · 1.º · 5)", "10 Anussatis (8 Upacāra · 1st · 5)", "10 Anussatis (8 Upacāra · 1.º · 5)") },
                        { val: "brahmavihara", label: this.loc("4 Appamaññā / Brahmavihāra", "4 Appamaññā / Brahmavihāra", "4 Appamaññā / Brahmavihāra") },
                        { val: "sanna_vavatthana", label: this.loc("1 Saññā + 1 Vavatthāna (Upacāra)", "1 Saññā + 1 Vavatthāna (Upacāra)", "1 Saññā + 1 Vavatthāna (Upacāra)") },
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
                        { val: "upacara", label: this.loc("Upacāra (Só Acesso · 10)", "Upacāra (Access Only · 10)", "Upacāra (Solo Acceso · 10)") },
                        { val: "jhana_1", label: this.loc("1.º Jhāna (Paṭhamajjhāna · 11)", "1st Jhāna Only (Paṭhamajjhāna · 11)", "Solo 1.er Jhāna (Paṭhamajjhāna · 11)") },
                        { val: "jhana_4", label: this.loc("1.º–4.º Jhāna (Catukkajjhāna · 3)", "1st–4th Jhāna (Catukkajjhāna · 3)", "1.º–4.º Jhāna (Catukkajjhāna · 3)") },
                        { val: "jhana_5_only", label: this.loc("Só 5.º Jhāna (Pañcamajjhāna · 1)", "5th Jhāna Only (Pañcamajjhāna · 1)", "Solo 5.º Jhāna (Pañcamajjhāna · 1)") },
                        { val: "jhana_5", label: this.loc("Todos 5 Jhānas (Pañcakajjhāna · 11)", "All 5 Jhānas (Pañcakajjhāna · 11)", "Los 5 Jhānas (Pañcakajjhāna · 11)") },
                        { val: "aruppa_4", label: this.loc("4 Āruppas (Āruppajjhāna · 4)", "4 Āruppas (Āruppajjhāna · 4)", "4 Āruppas (Āruppajjhāna · 4)") },
                    ];
                    const nimittaOptions = [
                        { val: 2, label: this.loc("2 Nimittas (Sem Paṭibhāga · 18)", "2 Nimittas (No Paṭibhāga · 18)", "2 Nimittas (Sin Paṭibhāga · 18)") },
                        { val: 3, label: this.loc("3 Nimittas (Com Paṭibhāga · 22)", "3 Nimittas (With Paṭibhāga · 22)", "3 Nimittas (Con Paṭibhāga · 22)") },
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
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Subgrupo (Carita / Vasitā / Abhiññā):", "2. Subgroup (Carita / Vasitā / Abhiññā):", "2. Subgrupo (Carita / Vasitā / Abhiññā):"), "topicGroup", tgOpts)}
            ${renderRow(this.loc("3. Item Canônico:", "3. Canonical Item:", "3. Ítem Canónico:"), "slot", slotOpts)}
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
                    return `
            ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Eixo de Vipassanā:", "2. Vipassanā Axis:", "2. Eje de Vipassanā:"), "vipGroup", vgOpts)}
            ${renderRow(this.loc("3. Estágio / Conhecimento / Tríade:", "3. Stage / Knowledge / Triad:", "3. Etapa / Conocimiento / Tríada:"), "slot", slotOpts)}
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
                return `
          ${renderRow(this.loc("1. Seção do Cap. 9 (Kammaṭṭhāna):", "1. Ch. 9 Section (Kammaṭṭhāna):", "1. Sección del Cap. 9 (Kammaṭṭhāna):"), "wing", wingOptions)}
          ${renderRow(this.loc("2. Subgrupo (Ariya / Samāpatti):", "2. Subgroup (Ariya / Samāpatti):", "2. Subgrupo (Ariya / Samāpatti):"), "ariyaGroup", agOpts)}
          ${renderRow(this.loc("3. Grau Nobre / Realização:", "3. Noble Grade / Attainment:", "3. Grado Noble / Realización:"), "slot", slotOpts)}
        `;
            }
        }
    }
    renderPeriodicPillar(s) {
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

      ${this.perMode === "atlas" ? this.renderPeriodicAtlas(s) : this.renderPeriodicAlchemy(s)}
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
    renderPeriodicAlchemy(s) {
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
    renderPhalanxPillar(s) {
        const mapSpec = getPhalanxMapById(this.phaMapId);
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
                saveMnemonicProgress(this.progress);
                this.syncVault();
                this.render();
            }
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
        this.container.querySelectorAll("[data-bin-chapter]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const ch = Number(btn.dataset.binChapter);
                if (ch >= 1 && ch <= 9 && ch !== this.binActiveChapter) {
                    this.binActiveChapter = ch;
                    this.narySubmatrixScope = "all";
                    if (ch > 1) {
                        this.binTargetNaryItem = pickNextNaryChapterChallenge(ch, this.progress, undefined, "all");
                        this.narySwitches = defaultNarySwitchesForChapter(ch);
                        this.naryFeedback = null;
                    }
                    this.render();
                }
            });
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
let toolsMnemonicInstance = null;
let toolsMnemonicContainer = null;
let mnemonicLangListenerBound = false;
registerToolModule("mnemonic", (container) => {
    toolsMnemonicContainer = container;
    toolsMnemonicInstance = new MnemonicLabUI(container, settings.uiLang);
    toolsMnemonicInstance.init();
    if (!mnemonicLangListenerBound) {
        mnemonicLangListenerBound = true;
        window.addEventListener("languageChanged", () => {
            if (toolsMnemonicInstance && toolsMnemonicContainer?.isConnected) {
                toolsMnemonicInstance.setLang(settings.uiLang);
            }
        });
    }
});
//# sourceMappingURL=ui.js.map