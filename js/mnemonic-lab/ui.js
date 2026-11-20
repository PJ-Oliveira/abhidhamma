import { settings } from "../state.js?v=f5a29153";
import { registerToolModule } from "../tools/tools.js?v=f5a29153";
import { CANONICAL_CITTAS_89, CANONICAL_CITTAS_121, PERIODIC_ELEMENTS_72, PHALANX_MAPS, } from "./data.js?v=f5a29153";
import { CANONICAL_CHAPTERS_META, } from "./nary-chapters-data.js?v=f5a29153";
import { defaultNarySwitchesForChapter, evaluateNaryChallenge, getNaryItemsForChapter, pickNextNaryChapterChallenge, defaultSwitchStateForFamily, evaluateChemicalSynthesis, getPhalanxMapById, getSynthesizableCittas, loadMnemonicProgress, mergeMnemonicProgress, pickNextBinaryChallenge, pickNextPeriodicChallenge, pickNextPhalanxSlot, recordMnemonicAttempt, resolveCittaFromSwitches, saveMnemonicProgress, } from "./engine.js?v=f5a29153";
import { buildLocalStorageSnapshot, hydrateOfflineVault, mergeSnapshots, parseProgressBackup, persistMnemonicOfflineVault, serializeProgressBackup, VAULT_BROADCAST_CHANNEL, } from "../abhidhamma-srs/offline-store.js?v=f5a29153";
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
        };
        return map[name] ?? (name.charAt(0).toUpperCase() + name.slice(1));
    }
    formatNaryParamKey(key) {
        const map = {
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
            tetrad: ["Catukka", "Tetrad (Catukka)", "Catukka"],
            subtype: ["Subtipo", "Subtype", "Subtipo"],
            type: ["Natureza", "Nature", "Naturaleza"],
            heading: ["Rūpa / Classe", "Rūpa / Class", "Rūpa / Clase"],
            status: ["Estado", "Status", "Estado"],
            samutthana: ["Samuṭṭhāna", "Samuṭṭhāna", "Samuṭṭhāna"],
            compendium: ["Saṅgaha", "Compendium", "Compendio"],
            method: ["Método", "Method", "Método"],
            index: ["Índice", "Index", "Índice"],
            wing: ["Bhāvanā", "Bhāvanā Wing", "Bhāvanā"],
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
            somanassa: "Somanassa",
            domanassa: "Domanassa",
            sukha: "Sukha",
            dukkha: "Dukkha",
            upekkha: "Upekkhā",
            ahetuka: "Ahetuka",
            ekahetuka: "Ekahetuka",
            dvihetuka: "Dvihetuka",
            tihetuka: "Tihetuka",
            patisandhi: "Paṭisandhi",
            bhavanga: "Bhavaṅga",
            javana: "Javana",
            tadarammana: "Tadārammaṇa",
            cuti: "Cuti",
            dvaravimutta: "Dvāravimutta",
            paritta: "Parittārammaṇa",
            mahaggata: "Mahaggatārammaṇa",
            pannatti: "Paññattārammaṇa",
            nibbana_obj: "Nibbānārammaṇa",
            nissaya: "Nissāya",
            nissaya_anissaya: "Nissāya vā Anissāya vā",
            anissita: "Anissita",
            votthabbana: "Voṭṭhabbana",
            mogha: "Moghavāra",
            apaya: "Apāyabhūmi",
            kamasugati: "Kāmasugatibhūmi",
            rupabhumi: "Rūpāvacarabhūmi",
            arupabhumi: "Arūpāvacarabhūmi",
            apaya_patisandhi: "Apāya-paṭisandhi",
            kamasugati_patisandhi: "Kāmasugati-paṭisandhi",
            rupa_patisandhi: "Rūpāvacara-paṭisandhi",
            arupa_patisandhi: "Arūpāvacara-paṭisandhi",
            kamma_kicca: "Kicca-kamma",
            kamma_pakadana: "Pākadānapariyāya",
            kamma_pakakala: "Pākakāla",
            kamma_pakathana: "Pākaṭhāna",
            ayukkhaya: "Āyukkhaya",
            kammakkhaya: "Kammakkhaya",
            ubhayakkhaya: "Ubhayakkhaya",
            upacchedaka: "Upacchedakakamma",
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
            asava: "Āsava",
            nivarana: "Nīvaraṇa",
            anusaya: "Anusaya",
            samyojana: "Saṃyojana",
            jhananga: "Jhānaṅga",
            magganga12: "12 Maggaṅga",
            indriya22: "22 Indriya",
            satipatthana: "Satipaṭṭhāna",
            sammappadhana: "Sammappadhāna",
            iddhipada: "Iddhipāda",
            indriya5: "5 Indriya",
            bala5: "5 Bala",
            bojjhanga: "Bojjhaṅga",
            magganga: "8 Maggaṅga",
            khandha: "5 Khandha",
            upadanakkhandha: "5 Upādānakkhandha",
            ayatana: "12 Āyatana",
            dhatu: "18 Dhātu",
            ariyasacca: "4 Ariyasacca",
            anga12: "12 Aṅga",
            vatta3: "3 Vaṭṭa",
            akara20: "20 Ākāra",
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
        };
        if (key === "maxJhana" && s === "0") {
            return "Upacāra-samādhi";
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
            else {
                next.vara = "tadarammana";
                next.vithicittas = 10;
            }
        }
        else if (chapter === 5 && key === "tetrad") {
            const defaults = {
                bhumi: { subtype: "apaya", count: 4 },
                patisandhi: { subtype: "apaya_patisandhi", count: 1 },
                kamma: { subtype: "kamma_kicca", count: 4 },
                marana: { subtype: "ayukkhaya", count: 4 },
            };
            const d = defaults[String(val)];
            if (d) {
                next.subtype = d.subtype;
                next.count = d.count;
            }
        }
        else if (chapter === 6 && key === "type") {
            if (val === "mahabhuta") {
                next.heading = "pathavi";
                next.status = "nipphanna";
                next.samutthana = "catusamutthana";
            }
            else if (val === "upada") {
                next.heading = "pasada";
                next.status = "nipphanna";
                next.samutthana = "kammaja";
            }
            else {
                next.heading = "nibbana";
                next.status = "santi";
                next.samutthana = "asankhata";
            }
        }
        else if (chapter === 7 && key === "compendium") {
            const defaults = {
                akusala: { group: "asava", count: 4 },
                missaka: { group: "jhananga", count: 7 },
                bodhipakkhiya: { group: "satipatthana", count: 4 },
                sabba: { group: "khandha", count: 5 },
            };
            const d = defaults[String(val)];
            if (d) {
                next.group = d.group;
                next.count = d.count;
            }
        }
        else if (chapter === 8 && key === "method") {
            if (val === "patthana") {
                next.type = "sahajata";
                next.index = 1;
            }
            else {
                next.type = "anga12";
                next.index = 12;
            }
        }
        else if (chapter === 9 && key === "wing") {
            if (val === "samatha") {
                return { wing: "samatha", group: "kasina", maxJhana: 5, carita: "all", nimitta: 3 };
            }
            return { wing: "vipassana", visuddhi: 3, stage: "nama_rupa", section: "visuddhi" };
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
        const chapterItems = getNaryItemsForChapter(this.binActiveChapter);
        let target = this.binTargetNaryItem;
        if (!target || target.chapter !== this.binActiveChapter) {
            target = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress);
            this.binTargetNaryItem = target;
            this.narySwitches = defaultNarySwitchesForChapter(this.binActiveChapter);
            this.naryFeedback = null;
        }
        const synthItem = chapterItems.find((item) => {
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
        return `
      <div class="mnem-equation-banner">
        <div class="mnem-eq-title">🏛️ ${esc(meta.title[this.lang])} · <span lang="pi">${esc(meta.paliTitle)}</span> (${esc(meta.asRef)})</div>
        <div class="mnem-eq-chips">
          <span class="mnem-eq-chip highlight">📐 <strong>${esc(meta.equation[this.lang])}</strong></span>
        </div>
      </div>

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
                  <div style="font-size:0.75rem;color:var(--text-muted, #6f5c48);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    ${esc(item.name[this.lang])}
                  </div>
                  <div style="margin-top:6px;">
                    <button type="button" class="mnem-bit-btn" style="padding:2px 8px;font-size:0.72rem;min-height:24px;width:100%;" data-nary-load-item="${esc(item.id)}">
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
          ${renderRow(this.loc("1. Grupo Canônico Principal (Cetasika-bheda):", "1. Main Canonical Group (Cetasika-bheda):", "1. Grupo Canónico Principal (Cetasika-bheda):"), "group", groupOptions)}
          ${renderRow(this.loc("2. Subfamília / Bloco:", "2. Subfamily / Block:", "2. Subfamilia / Bloque:"), "sub", subOptions)}
          ${renderRow(this.loc("3. Posição no Bloco:", "3. Slot Position:", "3. Posición en el Bloque:"), "slot", slotOptions)}
          ${renderRow(this.loc("4. Valência / Associação de Cittas (Sampayoga — 121):", "4. Valence / Association with Cittas (Sampayoga — 121):", "4. Valencia / Asociación de Cittas (Sampayoga — 121):"), "sampayoga", sampayogaOptions)}
        `;
            }
            case 3: {
                const catOptions = [
                    { val: "vedana", label: this.loc("Vedanā (5 Sensações)", "Vedanā (5 Feelings)", "Vedanā (5 Sensaciones)") },
                    { val: "hetu", label: this.loc("Hetu (6 Raízes)", "Hetu (6 Roots)", "Hetu (6 Raíces)") },
                    { val: "kicca", label: this.loc("Kicca (14 Funções)", "Kicca (14 Functions)", "Kicca (14 Funciones)") },
                    { val: "dvara", label: this.loc("Dvāra (6 Portas)", "Dvāra (6 Doors)", "Dvāra (6 Puertas)") },
                    { val: "arammana", label: this.loc("Ālambaṇa (6 Objetos)", "Ālambaṇa (6 Objects)", "Ālambaṇa (6 Objetos)") },
                    { val: "vatthu", label: this.loc("Vatthu (6 Bases Físicas)", "Vatthu (6 Physical Bases)", "Vatthu (6 Bases Físicas)") },
                ];
                const currentCat = String(sw.category ?? "vedana");
                let itemOptions = [];
                let countVals = [];
                if (currentCat === "vedana") {
                    itemOptions = [
                        { val: "somanassa", label: this.loc("Somanassa (Agradável mental)", "Somanassa (Pleasant mental)", "Somanassa (Agradable mental)") },
                        { val: "domanassa", label: this.loc("Domanassa (Desagradável mental)", "Domanassa (Unpleasant mental)", "Domanassa (Desagradable mental)") },
                        { val: "sukha", label: this.loc("Sukha (Agradável corporal)", "Sukha (Pleasant bodily)", "Sukha (Agradable corporal)") },
                        { val: "dukkha", label: this.loc("Dukkha (Dor corporal)", "Dukkha (Painful bodily)", "Dukkha (Dolor corporal)") },
                        { val: "upekkha", label: this.loc("Upekkhā (Equanimidade neutra)", "Upekkhā (Neutral equanimity)", "Upekkhā (Ecuanimidad neutra)") },
                    ];
                    countVals = [1, 2, 55, 62];
                }
                else if (currentCat === "hetu") {
                    itemOptions = [
                        { val: "ahetuka", label: this.loc("Ahetuka (Sem Raiz · 18)", "Ahetuka (Rootless · 18)", "Ahetuka (Sin Raíz · 18)") },
                        { val: "ekahetuka", label: this.loc("Ekahetuka (1 Raiz · 2)", "Ekahetuka (1 Root · 2)", "Ekahetuka (1 Raíz · 2)") },
                        { val: "dvihetuka", label: this.loc("Dvihetuka (2 Raízes · 22)", "Dvihetuka (2 Roots · 22)", "Dvihetuka (2 Raíces · 22)") },
                        { val: "tihetuka", label: this.loc("Tihetuka (3 Raízes · 47)", "Tihetuka (3 Roots · 47)", "Tihetuka (3 Raíces · 47)") },
                    ];
                    countVals = [2, 18, 22, 47];
                }
                else if (currentCat === "kicca") {
                    itemOptions = [
                        { val: "patisandhi", label: this.loc("Paṭisandhi (Reconexão)", "Paṭisandhi (Rebirth-linking)", "Paṭisandhi (Reconexión)") },
                        { val: "bhavanga", label: this.loc("Bhavaṅga (Contínuo vital)", "Bhavaṅga (Life-continuum)", "Bhavaṅga (Continuo vital)") },
                        { val: "javana", label: this.loc("Javana (Impulsão)", "Javana (Impulsion)", "Javana (Impulsión)") },
                        { val: "tadarammana", label: this.loc("Tadārammaṇa (Registro)", "Tadārammaṇa (Registration)", "Tadārammaṇa (Registro)") },
                        { val: "cuti", label: this.loc("Cuti (Morte / Falecimento)", "Cuti (Decease)", "Cuti (Muerte / Deceso)") },
                    ];
                    countVals = [11, 19, 55];
                }
                else if (currentCat === "dvara") {
                    itemOptions = [
                        { val: "pancadvara", label: this.loc("Pañcadvāra (5 Portas Sensoriais)", "Pañcadvāra (5 Sense Doors)", "Pañcadvāra (5 Puertas Sensoriales)") },
                        { val: "manodvara", label: this.loc("Manodvāra (Porta Mental)", "Manodvāra (Mind Door)", "Manodvāra (Puerta Mental)") },
                        { val: "dvaravimutta", label: this.loc("Dvāravimutta (Livre de Porta)", "Dvāravimutta (Door-Free)", "Dvāravimutta (Libre de Puerta)") },
                    ];
                    countVals = [19, 54, 67];
                }
                else if (currentCat === "arammana") {
                    itemOptions = [
                        { val: "paritta", label: this.loc("Parittārammaṇa (Objeto Sensorial)", "Parittārammaṇa (Sense-Sphere Object)", "Parittārammaṇa (Objeto Sensorial)") },
                        { val: "mahaggata", label: this.loc("Mahaggatārammaṇa (Objeto Sublime)", "Mahaggatārammaṇa (Sublime Object)", "Mahaggatārammaṇa (Objeto Sublime)") },
                        { val: "pannatti", label: this.loc("Paññattārammaṇa (Objeto Conceitual)", "Paññattārammaṇa (Concept Object)", "Paññattārammaṇa (Objeto Conceptual)") },
                        { val: "nibbana_obj", label: this.loc("Nibbānārammaṇa (Nibbāna)", "Nibbānārammaṇa (Nibbāna)", "Nibbānārammaṇa (Nibbāna)") },
                    ];
                    countVals = [6, 8, 21, 25];
                }
                else {
                    itemOptions = [
                        { val: "nissaya", label: this.loc("Nissāya (Sempre c/ Base Física)", "Nissāya (Always Base-Dependent)", "Nissāya (Siempre con Base Física)") },
                        { val: "nissaya_anissaya", label: this.loc("Nissāya vā Anissāya vā (Com ou Sem Base)", "Nissāya vā Anissāya vā (With or Without Base)", "Nissāya vā Anissāya vā (Con o Sin Base)") },
                        { val: "anissita", label: this.loc("Anissita (Nunca c/ Base Física)", "Anissita (Never Base-Dependent)", "Anissita (Nunca con Base Física)") },
                    ];
                    countVals = [4, 42, 43];
                }
                const countOptions = countVals.map((n) => ({
                    val: n,
                    label: n === 1 ? "1 Citta" : `${n} Cittas`,
                }));
                return `
          ${renderRow(this.loc("1. Categoria Mista (Pakiṇṇaka):", "1. Miscellaneous Category (Pakiṇṇaka):", "1. Categoría Mixta (Pakiṇṇaka):"), "category", catOptions)}
          ${renderRow(this.loc("2. Fator Específico:", "2. Specific Factor:", "2. Factor Específico:"), "item", itemOptions)}
          ${renderRow(this.loc("3. Contagem de Cittas Correspondentes:", "3. Corresponding Cittas Count:", "3. Conteo de Cittas Correspondientes:"), "count", countOptions)}
        `;
            }
            case 4: {
                const doorOptions = [
                    { val: "pancadvara", label: this.loc("Pañcadvāra (5 Portas dos Sentidos)", "Pañcadvāra (5 Sense Doors)", "Pañcadvāra (5 Puertas de los Sentidos)") },
                    { val: "manodvara", label: this.loc("Manodvāra (Porta da Mente)", "Manodvāra (Mind Door)", "Manodvāra (Puerta de la Mente)") },
                ];
                const currentDoor = String(sw.door ?? "pancadvara");
                const varaOptions = currentDoor === "pancadvara"
                    ? [
                        { val: "tadarammana", label: this.loc("Tadārammaṇavāra (Atimahanta · até Registro)", "Tadārammaṇavāra (Atimahanta · to Registration)", "Tadārammaṇavāra (Atimahanta · hasta Registro)") },
                        { val: "javana", label: this.loc("Javanavāra (Mahanta · até Javana)", "Javanavāra (Mahanta · to Javana)", "Javanavāra (Mahanta · hasta Javana)") },
                        { val: "votthabbana", label: this.loc("Voṭṭhabbanavāra (Paritta · até Determinação)", "Voṭṭhabbanavāra (Paritta · to Determining)", "Voṭṭhabbanavāra (Paritta · hasta Determinación)") },
                        { val: "mogha", label: this.loc("Moghavāra (Atiparitta · Sem Vīthicitta)", "Moghavāra (Atiparitta · Futile Course)", "Moghavāra (Atiparitta · Curso Fútil)") },
                    ]
                    : [
                        { val: "tadarammana", label: this.loc("Vibhūtārammaṇa (Claro · até Tadārammaṇa)", "Vibhūtārammaṇa (Clear · to Tadārammaṇa)", "Vibhūtārammaṇa (Claro · hasta Tadārammaṇa)") },
                        { val: "javana", label: this.loc("Avibhūtārammaṇa (Obscuro · até Javana)", "Avibhūtārammaṇa (Obscure · to Javana)", "Avibhūtārammaṇa (Oscuro · hasta Javana)") },
                        { val: "appana", label: this.loc("Appanāvīthi (Absorção Jhāna / Magga)", "Appanāvīthi (Absorption Jhāna / Magga)", "Appanāvīthi (Absorción Jhāna / Magga)") },
                    ];
                const vithicittaOptions = currentDoor === "pancadvara"
                    ? [
                        { val: 14, label: this.loc("14 Vīthicittas (Atimahanta)", "14 Vīthicittas (Atimahanta)", "14 Vīthicittas (Atimahanta)") },
                        { val: 12, label: this.loc("12 Vīthicittas (Mahanta)", "12 Vīthicittas (Mahanta)", "12 Vīthicittas (Mahanta)") },
                        { val: 6, label: this.loc("6–7 Vīthicittas (Paritta)", "6–7 Vīthicittas (Paritta)", "6–7 Vīthicittas (Paritta)") },
                        { val: 0, label: this.loc("0 Vīthicittas (Moghavāra)", "0 Vīthicittas (Moghavāra)", "0 Vīthicittas (Moghavāra)") },
                    ]
                    : [
                        { val: 10, label: this.loc("10 Vīthicittas (Vibhūta)", "10 Vīthicittas (Vibhūta)", "10 Vīthicittas (Vibhūta)") },
                        { val: 8, label: this.loc("8 Vīthicittas (Avibhūta)", "8 Vīthicittas (Avibhūta)", "8 Vīthicittas (Avibhūta)") },
                        { val: 5, label: this.loc("5+ Estágios (Manodvārāvajjana → Appanā)", "5+ Stages (Manodvārāvajjana → Appanā)", "5+ Etapas (Manodvārāvajjana → Appanā)") },
                    ];
                return `
          ${renderRow(this.loc("1. Porta de Entrada (Dvāra):", "1. Entry Door (Dvāra):", "1. Puerta de Entrada (Dvāra):"), "door", doorOptions)}
          ${renderRow(this.loc("2. Curso do Processo (Vāra):", "2. Process Course (Vāra):", "2. Curso del Proceso (Vāra):"), "vara", varaOptions)}
          ${renderRow(this.loc("3. Surgimentos de Vīthicitta (Cittuppāda):", "3. Process-Citta Arisings (Cittuppāda):", "3. Surgimientos de Vīthicitta (Cittuppāda):"), "vithicittas", vithicittaOptions)}
        `;
            }
            case 5: {
                const tetradOptions = [
                    { val: "bhumi", label: this.loc("1. Bhūmi-catukka (4 Planos / 31 Reinos)", "1. Bhūmi-catukka (4 Planes / 31 Realms)", "1. Bhūmi-catukka (4 Planos / 31 Reinos)") },
                    { val: "patisandhi", label: this.loc("2. Paṭisandhi-catukka (4 Modos de Reconexão)", "2. Paṭisandhi-catukka (4 Modes of Rebirth-Linking)", "2. Paṭisandhi-catukka (4 Modos de Reconexión)") },
                    { val: "kamma", label: this.loc("3. Kamma-catukka (4 Quádruplas de Kamma)", "3. Kamma-catukka (4 Tetrads of Kamma)", "3. Kamma-catukka (4 Cuádruplas de Kamma)") },
                    { val: "marana", label: this.loc("4. Maraṇuppatti-catukka (4 Causas da Morte)", "4. Maraṇuppatti-catukka (4 Causes of Death)", "4. Maraṇuppatti-catukka (4 Causas de la Muerte)") },
                ];
                const currentTetrad = String(sw.tetrad ?? "bhumi");
                let subtypeOptions = [];
                let countVals = [];
                if (currentTetrad === "bhumi") {
                    subtypeOptions = [
                        { val: "apaya", label: this.loc("Apāyabhūmi (4 Planos de Privação)", "Apāyabhūmi (4 Woeful Planes)", "Apāyabhūmi (4 Planos de Privación)") },
                        { val: "kamasugati", label: this.loc("Kāmasugatibhūmi (7 Planos Venturosos)", "Kāmasugatibhūmi (7 Sensuous Blissful Planes)", "Kāmasugatibhūmi (7 Planos Venturosos)") },
                        { val: "rupabhumi", label: this.loc("Rūpāvacarabhūmi (16 Planos Rūpa)", "Rūpāvacarabhūmi (16 Fine-Material Planes)", "Rūpāvacarabhūmi (16 Planos Rūpa)") },
                        { val: "arupabhumi", label: this.loc("Arūpāvacarabhūmi (4 Planos Imateriais)", "Arūpāvacarabhūmi (4 Immaterial Planes)", "Arūpāvacarabhūmi (4 Planos Inmateriales)") },
                    ];
                    countVals = [4, 7, 16];
                }
                else if (currentTetrad === "patisandhi") {
                    subtypeOptions = [
                        { val: "apaya_patisandhi", label: this.loc("Apāya-paṭisandhi (1 Citta: #19)", "Apāya-paṭisandhi (1 Citta: #19)", "Apāya-paṭisandhi (1 Citta: #19)") },
                        { val: "kamasugati_patisandhi", label: this.loc("Kāmasugati-paṭisandhi (9 Cittas: #27 + 8 Mahāvipāka)", "Kāmasugati-paṭisandhi (9 Cittas: #27 + 8 Mahāvipāka)", "Kāmasugati-paṭisandhi (9 Cittas: #27 + 8 Mahāvipāka)") },
                        { val: "rupa_patisandhi", label: this.loc("Rūpāvacara-paṭisandhi (6: 5 Vipākas + Jīvitanavaka)", "Rūpāvacara-paṭisandhi (6: 5 Vipākas + Jīvitanavaka)", "Rūpāvacara-paṭisandhi (6: 5 Vipākas + Jīvitanavaka)") },
                        { val: "arupa_patisandhi", label: this.loc("Arūpāvacara-paṭisandhi (4 Vipākas)", "Arūpāvacara-paṭisandhi (4 Vipākas)", "Arūpāvacara-paṭisandhi (4 Vipākas)") },
                    ];
                    countVals = [1, 4, 6, 9];
                }
                else if (currentTetrad === "kamma") {
                    subtypeOptions = [
                        { val: "kamma_kicca", label: this.loc("Kiccavasena (Por Função: Janaka a Upaghātaka)", "Kiccavasena (By Function: Janaka to Upaghātaka)", "Kiccavasena (Por Función: Janaka a Upaghātaka)") },
                        { val: "kamma_pakadana", label: this.loc("Pākadānapariyāyena (Por Prioridade: Garuka a Kaṭattā)", "Pākadānapariyāyena (By Order: Garuka to Kaṭattā)", "Pākadānapariyāyena (Por Orden: Garuka a Kaṭattā)") },
                        { val: "kamma_pakakala", label: this.loc("Pākakālavasena (Por Tempo: Diṭṭhadhamma a Ahosi)", "Pākakālavasena (By Time: Diṭṭhadhamma to Ahosi)", "Pākakālavasena (Por Tiempo: Diṭṭhadhamma a Ahosi)") },
                        { val: "kamma_pakathana", label: this.loc("Pākaṭhānavasena (Por Plano: Akusala a Arūpa)", "Pākaṭhānavasena (By Place: Akusala to Arūpa)", "Pākaṭhānavasena (Por Lugar: Akusala a Arūpa)") },
                    ];
                    countVals = [4];
                }
                else {
                    subtypeOptions = [
                        { val: "ayukkhaya", label: this.loc("1. Āyukkhaya (Exaustão da Longevidade)", "1. Āyukkhaya (Exhaustion of Lifespan)", "1. Āyukkhaya (Agotamiento del Lapso Vital)") },
                        { val: "kammakkhaya", label: this.loc("2. Kammakkhaya (Exaustão do Kamma)", "2. Kammakkhaya (Exhaustion of Kamma)", "2. Kammakkhaya (Agotamiento del Kamma)") },
                        { val: "ubhayakkhaya", label: this.loc("3. Ubhayakkhaya (Exaustão de Ambos)", "3. Ubhayakkhaya (Exhaustion of Both)", "3. Ubhayakkhaya (Agotamiento de Ambos)") },
                        { val: "upacchedaka", label: this.loc("4. Upacchedakakamma (Kamma Destrutivo)", "4. Upacchedakakamma (Destructive Kamma)", "4. Upacchedakakamma (Kamma Destructor)") },
                    ];
                    countVals = [4];
                }
                const countOptions = countVals.map((n) => ({
                    val: n,
                    label: this.loc(`${n} ${n === 1 ? "Tipo / Citta" : "Planos / Tipos"}`, `${n} ${n === 1 ? "Type / Citta" : "Planes / Types"}`, `${n} ${n === 1 ? "Tipo / Citta" : "Planos / Tipos"}`),
                }));
                return `
          ${renderRow(this.loc("1. Tétrade Fora do Processo (Catukka):", "1. Process-Free Tetrad (Catukka):", "1. Tétrada Fuera del Proceso (Catukka):"), "tetrad", tetradOptions)}
          ${renderRow(this.loc("2. Subdivisão Canônica:", "2. Canonical Subdivision:", "2. Subdivisión Canónica:"), "subtype", subtypeOptions)}
          ${renderRow(this.loc("3. Quantificação Canônica:", "3. Canonical Quantification:", "3. Cuantificación Canónica:"), "count", countOptions)}
        `;
            }
            case 6: {
                const typeOptions = [
                    { val: "mahabhuta", label: this.loc("Mahābhūta (4 Grandes Elementos)", "Mahābhūta (4 Great Primary Elements)", "Mahābhūta (4 Grandes Elementos)") },
                    { val: "upada", label: this.loc("Upādā-rūpa (24 Matérias Derivadas)", "Upādā-rūpa (24 Derived Materialities)", "Upādā-rūpa (24 Materias Derivadas)") },
                    { val: "asankhata", label: this.loc("Asaṅkhata (Nibbāna · Incondicionado)", "Asaṅkhata (Nibbāna · Unconditioned)", "Asaṅkhata (Nibbāna · Incondicionado)") },
                ];
                const currentType = String(sw.type ?? "mahabhuta");
                let headingOptions = [];
                if (currentType === "mahabhuta") {
                    headingOptions = [
                        { val: "pathavi", label: this.loc("Pathavī-dhātu (Terra)", "Pathavī-dhātu (Earth)", "Pathavī-dhātu (Tierra)") },
                        { val: "apo", label: this.loc("Āpo-dhātu (Água)", "Āpo-dhātu (Water)", "Āpo-dhātu (Agua)") },
                        { val: "tejo", label: this.loc("Tejo-dhātu (Fogo)", "Tejo-dhātu (Fire)", "Tejo-dhātu (Fuego)") },
                        { val: "vayo", label: this.loc("Vāyo-dhātu (Vento)", "Vāyo-dhātu (Air)", "Vāyo-dhātu (Viento)") },
                    ];
                }
                else if (currentType === "upada") {
                    headingOptions = [
                        { val: "pasada", label: this.loc("Pasāda (5 Sentidos)", "Pasāda (5 Sensitivities)", "Pasāda (5 Sentidos)") },
                        { val: "gocara_avin", label: this.loc("Gocara (Vaṇṇa, Gandha, Rasa)", "Gocara (Color, Odor, Taste)", "Gocara (Color, Olor, Sabor)") },
                        { val: "sadda", label: this.loc("Sadda (Som)", "Sadda (Sound)", "Sadda (Sonido)") },
                        { val: "bhava", label: this.loc("Bhāva (2 Sexos)", "Bhāva (2 Sexes)", "Bhāva (2 Sexos)") },
                        { val: "hadaya", label: this.loc("Hadayavatthu (Base Cardíaca)", "Hadayavatthu (Heart-Base)", "Hadayavatthu (Base Cardíaca)") },
                        { val: "jivita", label: this.loc("Jīvitindriya (Vida Material)", "Jīvitindriya (Material Life)", "Jīvitindriya (Vida Material)") },
                        { val: "ahara", label: this.loc("Āhāra / Ojā (Nutrição)", "Āhāra / Ojā (Nutriment)", "Āhāra / Ojā (Nutrición)") },
                        { val: "pariccheda", label: this.loc("Pariccheda (Ākāsa · Espaço)", "Pariccheda (Ākāsa · Space)", "Pariccheda (Ākāsa · Espacio)") },
                        { val: "vinnatti", label: this.loc("Viññatti (2 Intimações)", "Viññatti (2 Intimations)", "Viññatti (2 Intimaciones)") },
                        { val: "vikara", label: this.loc("Vikāra (3 Mutabilidades)", "Vikāra (3 Mutabilities)", "Vikāra (3 Mutabilidades)") },
                        { val: "lakkhana", label: this.loc("Lakkhaṇa (4 Características)", "Lakkhaṇa (4 Characteristics)", "Lakkhaṇa (4 Características)") },
                    ];
                }
                else {
                    headingOptions = [
                        { val: "nibbana", label: this.loc("Nibbāna (Asaṅkhata-dhātu)", "Nibbāna (Asaṅkhata-dhātu)", "Nibbāna (Asaṅkhata-dhātu)") },
                    ];
                }
                const statusOptions = [
                    { val: "nipphanna", label: this.loc("Nipphanna (18 Rūpas Concretos)", "Nipphanna (18 Concrete Rūpas)", "Nipphanna (18 Rūpas Concretos)") },
                    { val: "anipphanna", label: this.loc("Anipphanna (10 Rūpas Não-Concretos)", "Anipphanna (10 Non-Concrete Rūpas)", "Anipphanna (10 Rūpas No Concretos)") },
                    { val: "santi", label: this.loc("Santilakkhaṇa (Nibbāna)", "Santilakkhaṇa (Nibbāna)", "Santilakkhaṇa (Nibbāna)") },
                ];
                const samutthanaOptions = [
                    { val: "catusamutthana", label: this.loc("4 Origens (Kamma, Citta, Utu, Āhāra)", "4 Origins (Kamma, Citta, Utu, Āhāra)", "4 Orígenes (Kamma, Citta, Utu, Āhāra)") },
                    { val: "kammaja", label: this.loc("Exclusivo Kamma (Pasāda, Bhāva, Hadaya, Jīvita)", "Exclusively Kamma (Pasāda, Bhāva, Hadaya, Jīvita)", "Exclusivo Kamma (Pasāda, Bhāva, Hadaya, Jīvita)") },
                    { val: "cittaja", label: this.loc("Exclusivo Citta (2 Viññattis)", "Exclusively Citta (2 Viññattis)", "Exclusivo Citta (2 Viññattis)") },
                    { val: "cittotuja", label: this.loc("Citta + Utu (Sadda / Som)", "Citta + Utu (Sadda / Sound)", "Citta + Utu (Sadda / Sonido)") },
                    { val: "utucittahara", label: this.loc("Utu + Citta + Āhāra (3 Vikāras)", "Utu + Citta + Āhāra (3 Vikāras)", "Utu + Citta + Āhāra (3 Vikāras)") },
                    { val: "none_lakkhana", label: this.loc("Sem Origem Causal (4 Lakkhaṇas)", "No Causal Origin (4 Lakkhaṇas)", "Sin Origen Causal (4 Lakkhaṇas)") },
                    { val: "asankhata", label: this.loc("Asaṅkhata (Incondicionado · Nibbāna)", "Asaṅkhata (Unconditioned · Nibbāna)", "Asaṅkhata (Incondicionado · Nibbāna)") },
                ];
                return `
          ${renderRow(this.loc("1. Natureza Ontológica (Rūpa-samuddesa):", "1. Ontological Nature (Rūpa-samuddesa):", "1. Naturaleza Ontológica (Rūpa-samuddesa):"), "type", typeOptions)}
          ${renderRow(this.loc("2. Classe / Elemento (11 Grupos + Nibbāna):", "2. Class / Element (11 Headings + Nibbāna):", "2. Clase / Elemento (11 Grupos + Nibbāna):"), "heading", headingOptions)}
          ${renderRow(this.loc("3. Status Estrutural:", "3. Structural Status:", "3. Estado Estructural:"), "status", statusOptions)}
          ${renderRow(this.loc("4. Origem Causal (Rūpa-samuṭṭhāna):", "4. Causal Origin (Rūpa-samuṭṭhāna):", "4. Origen Causal (Rūpa-samuṭṭhāna):"), "samutthana", samutthanaOptions)}
        `;
            }
            case 7: {
                const compOptions = [
                    { val: "akusala", label: this.loc("Akusala-saṅgaha (9 Grupos Insalubres)", "Akusala-saṅgaha (9 Unwholesome Groups)", "Akusala-saṅgaha (9 Grupos Inhábiles)") },
                    { val: "missaka", label: this.loc("Missaka-saṅgaha (7 Grupos Mistos)", "Missaka-saṅgaha (7 Miscellaneous Groups)", "Missaka-saṅgaha (7 Grupos Mixtos)") },
                    { val: "bodhipakkhiya", label: this.loc("Bodhipakkhiya-saṅgaha (7 Grupos / 37 Fatores)", "Bodhipakkhiya-saṅgaha (7 Groups / 37 Factors)", "Bodhipakkhiya-saṅgaha (7 Grupos / 37 Factores)") },
                    { val: "sabba", label: this.loc("Sabba-saṅgaha (5 Sínteses Universais)", "Sabba-saṅgaha (5 Universal Syntheses)", "Sabba-saṅgaha (5 Síntesis Universales)") },
                ];
                const currentComp = String(sw.compendium ?? "bodhipakkhiya");
                let groupOptions = [];
                let countVals = [];
                if (currentComp === "akusala") {
                    groupOptions = [
                        { val: "asava", label: this.loc("4 Āsavā (Efluências)", "4 Āsavā (Taints)", "4 Āsavā (Efluencias)") },
                        { val: "nivarana", label: this.loc("6 Nīvaraṇāni (Obstáculos)", "6 Nīvaraṇāni (Hindrances)", "6 Nīvaraṇāni (Obstáculos)") },
                        { val: "anusaya", label: this.loc("7 Anusayā (Tendências Latentes)", "7 Anusayā (Underlying Tendencies)", "7 Anusayā (Tendencias Latentes)") },
                        { val: "samyojana", label: this.loc("10 Saṃyojanāni (Grilhões)", "10 Saṃyojanāni (Fetters)", "10 Saṃyojanāni (Grilletes)") },
                    ];
                    countVals = [4, 6, 7, 10];
                }
                else if (currentComp === "missaka") {
                    groupOptions = [
                        { val: "jhananga", label: this.loc("7 Jhānaṅgāni (Fatores de Jhāna)", "7 Jhānaṅgāni (Jhāna Factors)", "7 Jhānaṅgāni (Factores de Jhāna)") },
                        { val: "magganga12", label: this.loc("12 Maggaṅgāni (8 Nobres + 4 Errôneos)", "12 Maggaṅgāni (8 Right + 4 Wrong)", "12 Maggaṅgāni (8 Rectos + 4 Erróneos)") },
                        { val: "indriya22", label: this.loc("22 Indriyāni (Faculdades)", "22 Indriyāni (Faculties)", "22 Indriyāni (Facultades)") },
                    ];
                    countVals = [7, 12, 22];
                }
                else if (currentComp === "bodhipakkhiya") {
                    groupOptions = [
                        { val: "satipatthana", label: this.loc("4 Satipaṭṭhānā (Atenção Plena)", "4 Satipaṭṭhānā (Foundations of Mindfulness)", "4 Satipaṭṭhānā (Atención Plena)") },
                        { val: "sammappadhana", label: this.loc("4 Sammappadhānā (Esforços Corretos)", "4 Sammappadhānā (Right Strivings)", "4 Sammappadhānā (Esfuerzos Rectos)") },
                        { val: "iddhipada", label: this.loc("4 Iddhipādā (Bases do Poder)", "4 Iddhipādā (Bases of Spiritual Power)", "4 Iddhipādā (Bases del Poder)") },
                        { val: "indriya5", label: this.loc("5 Indriyāni (Faculdades Espirituais)", "5 Indriyāni (Spiritual Faculties)", "5 Indriyāni (Facultades Espirituales)") },
                        { val: "bala5", label: this.loc("5 Balāni (Poderes Espirituais)", "5 Balāni (Spiritual Powers)", "5 Balāni (Poderes Espirituales)") },
                        { val: "bojjhanga", label: this.loc("7 Bojjhaṅgā (Fatores da Iluminação)", "7 Bojjhaṅgā (Factors of Enlightenment)", "7 Bojjhaṅgā (Factores de Iluminación)") },
                        { val: "magganga", label: this.loc("8 Maggaṅgāni (Nobre Caminho Óctuplo)", "8 Maggaṅgāni (Noble Eightfold Path)", "8 Maggaṅgāni (Noble Óctuple Sendero)") },
                    ];
                    countVals = [4, 5, 7, 8];
                }
                else {
                    groupOptions = [
                        { val: "khandha", label: this.loc("5 Khandhā (Agregados)", "5 Khandhā (Aggregates)", "5 Khandhā (Agregados)") },
                        { val: "upadanakkhandha", label: this.loc("5 Upādānakkhandhā (Agregados de Apego)", "5 Upādānakkhandhā (Aggregates of Clinging)", "5 Upādānakkhandhā (Agregados de Apego)") },
                        { val: "ayatana", label: this.loc("12 Āyatanāni (Bases Sensoriais)", "12 Āyatanāni (Sense Bases)", "12 Āyatanāni (Bases Sensoriales)") },
                        { val: "dhatu", label: this.loc("18 Dhātuyo (Elementos)", "18 Dhātuyo (Elements)", "18 Dhātuyo (Elementos)") },
                        { val: "ariyasacca", label: this.loc("4 Ariyasaccāni (Nobres Verdades)", "4 Ariyasaccāni (Noble Truths)", "4 Ariyasaccāni (Nobles Verdades)") },
                    ];
                    countVals = [4, 5, 12, 18];
                }
                const countOptions = countVals.map((n) => ({
                    val: n,
                    label: this.loc(`${n} Fatores`, `${n} Factors`, `${n} Factores`),
                }));
                return `
          ${renderRow(this.loc("1. Compêndio de Categorias (Samuccaya):", "1. Categories Compendium (Samuccaya):", "1. Compendio de Categorías (Samuccaya):"), "compendium", compOptions)}
          ${renderRow(this.loc("2. Grupo Doutrinário:", "2. Doctrinal Group:", "2. Grupo Doctrinal:"), "group", groupOptions)}
          ${renderRow(this.loc("3. Quantidade no Grupo:", "3. Count in Group:", "3. Cantidad en el Grupo:"), "count", countOptions)}
        `;
            }
            case 8: {
                const methodOptions = [
                    { val: "patthana", label: this.loc("Paṭṭhāna-naya (As 24 Condições)", "Paṭṭhāna-naya (The 24 Conditions)", "Paṭṭhāna-naya (Las 24 Condiciones)") },
                    { val: "paticcasamuppada", label: this.loc("Paṭiccasamuppāda-naya (12 Elos · 20 Ākāras)", "Paṭiccasamuppāda-naya (12 Links · 20 Ākāras)", "Paṭiccasamuppāda-naya (12 Eslabones · 20 Ākāras)") },
                ];
                const currentMethod = String(sw.method ?? "patthana");
                if (currentMethod === "patthana") {
                    const typeOptions = [
                        { val: "sahajata", label: this.loc("Sahajāta (Conascença)", "Sahajāta (Co-nascence)", "Sahajāta (Conascencia)") },
                        { val: "arammana", label: this.loc("Ārammaṇa (Objeto)", "Ārammaṇa (Object)", "Ārammaṇa (Objeto)") },
                        { val: "anantara", label: this.loc("Anantara (Proximidade)", "Anantara (Proximity)", "Anantara (Proximidad)") },
                        { val: "nissaya", label: this.loc("Nissaya (Suporte)", "Nissaya (Support)", "Nissaya (Soporte)") },
                        { val: "purejata", label: this.loc("Purejāta (Pré-nascença)", "Purejāta (Pre-nascence)", "Purejāta (Prenascencia)") },
                        { val: "kamma", label: this.loc("Kamma (Volição Cetanā)", "Kamma (Volition Cetanā)", "Kamma (Volición Cetanā)") },
                        { val: "atthi", label: this.loc("Atthi (Presença)", "Atthi (Presence)", "Atthi (Presencia)") },
                    ];
                    const indexOptions = [
                        { val: 1, label: this.loc("#1 Hetu (Raiz)", "#1 Hetu (Root)", "#1 Hetu (Raíz)") },
                        { val: 2, label: this.loc("#2 Ārammaṇa (Objeto)", "#2 Ārammaṇa (Object)", "#2 Ārammaṇa (Objeto)") },
                        { val: 4, label: this.loc("#4 Anantara (Proximidade)", "#4 Anantara (Proximity)", "#4 Anantara (Proximidad)") },
                        { val: 6, label: this.loc("#6 Sahajāta (Conascência)", "#6 Sahajāta (Co-nascence)", "#6 Sahajāta (Conascencia)") },
                        { val: 8, label: this.loc("#8 Nissaya (Suporte)", "#8 Nissaya (Support)", "#8 Nissaya (Soporte)") },
                        { val: 10, label: this.loc("#10 Purejāta (Pré-nascença)", "#10 Purejāta (Pre-nascence)", "#10 Purejāta (Prenascencia)") },
                        { val: 13, label: this.loc("#13 Kamma (Ação)", "#13 Kamma (Action)", "#13 Kamma (Acción)") },
                        { val: 21, label: this.loc("#21 Atthi (Presença)", "#21 Atthi (Presence)", "#21 Atthi (Presencia)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Método Causal:", "1. Causal Method:", "1. Método Causal:"), "method", methodOptions)}
            ${renderRow(this.loc("2. Vetor Relacional:", "2. Relational Vector:", "2. Vector Relacional:"), "type", typeOptions)}
            ${renderRow(this.loc("3. Índice Canônico no Paṭṭhāna (1..24):", "3. Canonical Paṭṭhāna Index (1..24):", "3. Índice Canónico en el Paṭṭhāna (1..24):"), "index", indexOptions)}
          `;
                }
                else {
                    const psTypeOptions = [
                        { val: "anga12", label: this.loc("Dvādasaṅgāni (12 Elos)", "Dvādasaṅgāni (12 Links)", "Dvādasaṅgāni (12 Eslabones)") },
                        { val: "vatta3", label: this.loc("Tīṇi Vaṭṭāni (3 Rodas: Kilesa, Kamma, Vipāka)", "Tīṇi Vaṭṭāni (3 Rounds: Kilesa, Kamma, Vipāka)", "Tīṇi Vaṭṭāni (3 Ruedas: Kilesa, Kamma, Vipāka)") },
                        { val: "akara20", label: this.loc("Vīsatākārā (20 Modos & 3 Sandhis)", "Vīsatākārā (20 Modes & 3 Sandhis)", "Vīsatākārā (20 Modos y 3 Sandhis)") },
                    ];
                    const psIndexOptions = [
                        { val: 3, label: this.loc("3 (Vaṭṭāni / Sandhi)", "3 (Vaṭṭāni / Sandhi)", "3 (Vaṭṭāni / Sandhi)") },
                        { val: 12, label: this.loc("12 (Aṅgāni / Elos)", "12 (Aṅgāni / Links)", "12 (Aṅgāni / Eslabones)") },
                        { val: 20, label: this.loc("20 (Ākārā: 5+5+5+5)", "20 (Ākārā: 5+5+5+5)", "20 (Ākārā: 5+5+5+5)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Método Causal:", "1. Causal Method:", "1. Método Causal:"), "method", methodOptions)}
            ${renderRow(this.loc("2. Estrutura do Paṭiccasamuppāda:", "2. Paṭiccasamuppāda Structure:", "2. Estructura del Paṭiccasamuppāda:"), "type", psTypeOptions)}
            ${renderRow(this.loc("3. Quantidade Canônica:", "3. Canonical Count:", "3. Cantidad Canónica:"), "index", psIndexOptions)}
          `;
                }
            }
            case 9:
            default: {
                const wingOptions = [
                    { val: "samatha", label: this.loc("Samatha-bhāvanā (Tranquilidade · 40 Kammaṭṭhānas)", "Samatha-bhāvanā (Serenity · 40 Kammaṭṭhānas)", "Samatha-bhāvanā (Tranquilidad · 40 Kammaṭṭhānas)") },
                    { val: "vipassana", label: this.loc("Vipassanā-bhāvanā (Visão Cabal · 7 Visuddhis & 10 Ñāṇas)", "Vipassanā-bhāvanā (Insight · 7 Visuddhis & 10 Ñāṇas)", "Vipassanā-bhāvanā (Visión Cabal · 7 Visuddhis y 10 Ñāṇas)") },
                ];
                const currentWing = String(sw.wing ?? "samatha");
                if (currentWing === "samatha") {
                    const groupOptions = [
                        { val: "kasina", label: this.loc("10 Kasiṇas (Terra, Água, Fogo, Vento, etc.)", "10 Kasiṇas (Earth, Water, Fire, Air, etc.)", "10 Kasiṇas (Tierra, Agua, Fuego, Aire, etc.)") },
                        { val: "asubha", label: this.loc("10 Asubhas (Contemplação da Impureza)", "10 Asubhas (Foulness Contemplations)", "10 Asubhas (Contemplación de Impurezas)") },
                        { val: "anussati", label: this.loc("10 Anussatis (Buddhānussati a Ānāpānassati)", "10 Anussatis (Buddhānussati to Ānāpānassati)", "10 Anussatis (Buddhānussati a Ānāpānassati)") },
                        { val: "brahmavihara", label: this.loc("4 Brahmavihāras / Appamaññā", "4 Brahmavihāras / Appamaññā", "4 Brahmavihāras / Appamaññā") },
                        { val: "aruppa", label: this.loc("4 Āruppas (Realizações Imateriais)", "4 Āruppas (Immaterial Attainments)", "4 Āruppas (Realizaciones Inmateriales)") },
                    ];
                    const jhanaOptions = [
                        { val: 5, label: this.loc("Até o 5º Jhāna (ou Arūpa)", "Up to 5th Jhāna (or Arūpa)", "Hasta el 5.º Jhāna (o Arūpa)") },
                        { val: 4, label: this.loc("Até o 4º Jhāna (Mettā, Karuṇā, Muditā)", "Up to 4th Jhāna (Mettā, Karuṇā, Muditā)", "Hasta el 4.º Jhāna (Mettā, Karuṇā, Muditā)") },
                        { val: 1, label: this.loc("Apenas 1º Jhāna (Asubhas & Kāyagatāsati)", "1st Jhāna Only (Asubhas & Kāyagatāsati)", "Solo 1.er Jhāna (Asubhas y Kāyagatāsati)") },
                        { val: 0, label: this.loc("Apenas Upacāra-samādhi (10 Kammaṭṭhānas)", "Access Only: Upacāra-samādhi (10 Subjects)", "Solo Upacāra-samādhi (10 Objetos)") },
                    ];
                    const caritaOptions = [
                        { val: "all", label: this.loc("Todos os Temperamentos (Sabba)", "All Temperaments (Sabba)", "Todos los Temperamentos (Sabba)") },
                        { val: "raga", label: this.loc("Rāgacarita (Apego / Desejo)", "Rāgacarita (Greedy / Lustful)", "Rāgacarita (Apego / Deseo)") },
                        { val: "dosa", label: this.loc("Dosacarita (Aversão / Irritação)", "Dosacarita (Hating / Aversive)", "Dosacarita (Aversión / Irritación)") },
                        { val: "moha_vitakka", label: this.loc("Moha / Vitakkacarita (Ilusão / Discursivo)", "Moha / Vitakkacarita (Deluded / Discursive)", "Moha / Vitakkacarita (Engaño / Discursivo)") },
                        { val: "saddha", label: this.loc("Saddhācarita (Fé e Devoção)", "Saddhācarita (Faithful / Devout)", "Saddhācarita (Fe y Devoción)") },
                    ];
                    const nimittaOptions = [
                        { val: 2, label: this.loc("2 Nimittas (Parikamma + Uggaha · sem Paṭibhāga)", "2 Nimittas (Parikamma + Uggaha · no Paṭibhāga)", "2 Nimittas (Parikamma + Uggaha · sin Paṭibhāga)") },
                        { val: 3, label: this.loc("3 Nimittas (inclui Paṭibhāga-nimitta · 22 objetos)", "3 Nimittas (includes Paṭibhāga-nimitta · 22 subjects)", "3 Nimittas (incluye Paṭibhāga-nimitta · 22 objetos)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Via de Desenvolvimento (Bhāvanā-naya):", "1. Meditation Wing (Bhāvanā-naya):", "1. Vía de Desarrollo (Bhāvanā-naya):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Grupo dos 40 Objetos (Samatha-kammaṭṭhāna):", "2. Group of 40 Objects (Samatha-kammaṭṭhāna):", "2. Grupo de los 40 Objetos (Samatha-kammaṭṭhāna):"), "group", groupOptions)}
            ${renderRow(this.loc("3. Alcance de Concentração (Jhāna-bhūmi):", "3. Concentration Reach (Jhāna-bhūmi):", "3. Alcance de Concentración (Jhāna-bhūmi):"), "maxJhana", jhanaOptions)}
            ${renderRow(this.loc("4. Temperamento Adequado (Sappāyabheda):", "4. Suitable Temperament (Sappāyabheda):", "4. Temperamento Adecuado (Sappāyabheda):"), "carita", caritaOptions)}
            ${renderRow(this.loc("5. Sinais Meditativos Alcançados (Nimitta):", "5. Meditative Signs Reached (Nimitta):", "5. Signos Meditativos Alcanzados (Nimitta):"), "nimitta", nimittaOptions)}
          `;
                }
                else {
                    const visuddhiOptions = [
                        { val: 3, label: this.loc("3. Diṭṭhi-visuddhi (Purificação da Visão)", "3. Diṭṭhi-visuddhi (Purification of View)", "3. Diṭṭhi-visuddhi (Purificación de la Visión)") },
                        { val: 4, label: this.loc("4. Kaṅkhāvitaraṇa-visuddhi (Superação da Dúvida)", "4. Kaṅkhāvitaraṇa-visuddhi (Overcoming Doubt)", "4. Kaṅkhāvitaraṇa-visuddhi (Superación de la Duda)") },
                        { val: 5, label: this.loc("5. Maggāmaggañāṇadassana-visuddhi (10 Upakkilesas)", "5. Maggāmaggañāṇadassana-visuddhi (10 Upakkilesas)", "5. Maggāmaggañāṇadassana-visuddhi (10 Upakkilesas)") },
                        { val: 6, label: this.loc("6. Paṭipadāñāṇadassana-visuddhi (9 Conhecimentos)", "6. Paṭipadāñāṇadassana-visuddhi (9 Knowledges)", "6. Paṭipadāñāṇadassana-visuddhi (9 Conocimientos)") },
                        { val: 7, label: this.loc("7. Ñāṇadassana-visuddhi (Os 4 Maggas)", "7. Ñāṇadassana-visuddhi (The 4 Paths)", "7. Ñāṇadassana-visuddhi (Los 4 Maggas)") },
                        { val: "samapatti", label: this.loc("Samāpatti-bheda (Realizações: Phala / Nirodha)", "Samāpatti-bheda (Attainments: Phala / Nirodha)", "Samāpatti-bheda (Realizaciones: Phala / Nirodha)") },
                    ];
                    const stageOptions = [
                        { val: "nama_rupa", label: this.loc("Nāmarūpa-pariggaha (Nome e Forma)", "Nāmarūpa-pariggaha (Mentality & Matter)", "Nāmarūpa-pariggaha (Nombre y Forma)") },
                        { val: "paccaya", label: this.loc("Paccaya-pariggaha (Discernimento Causal)", "Paccaya-pariggaha (Causal Discernment)", "Paccaya-pariggaha (Discernimiento Causal)") },
                        { val: "maggamagga", label: this.loc("Maggāmagga (Discernir os 10 Upakkilesas)", "Maggāmagga (Discerning the 10 Upakkilesas)", "Maggāmagga (Discernir los 10 Upakkilesas)") },
                        { val: "udayabbaya", label: this.loc("Udayabbaya-ñāṇa (Surgimento e Dissolução)", "Udayabbaya-ñāṇa (Arising & Passing Away)", "Udayabbaya-ñāṇa (Surgimiento y Disolución)") },
                        { val: "sankharupekkha", label: this.loc("Saṅkhārupekkhā-ñāṇa (Equanimidade c/ Formações)", "Saṅkhārupekkhā-ñāṇa (Equanimity towards Formations)", "Saṅkhārupekkhā-ñāṇa (Ecuanimidad con Formaciones)") },
                        { val: "magga", label: this.loc("Catumagga (Os 4 Caminhos Supramundanos)", "Catumagga (The 4 Supramundane Paths)", "Catumagga (Los 4 Senderos Supramundanos)") },
                        { val: "nirodha", label: this.loc("Nirodha-samāpatti (Realização da Cessação)", "Nirodha-samāpatti (Attainment of Cessation)", "Nirodha-samāpatti (Realización de la Cesación)") },
                    ];
                    const sectionOptions = [
                        { val: "visuddhi", label: this.loc("Visuddhi-bheda (7 Purificações)", "Visuddhi-bheda (7 Purifications)", "Visuddhi-bheda (7 Purificaciones)") },
                        { val: "nana", label: this.loc("Vipassanā-ñāṇa (10 Conhecimentos)", "Vipassanā-ñāṇa (10 Insight Knowledges)", "Vipassanā-ñāṇa (10 Conocimientos)") },
                        { val: "samapatti", label: this.loc("Samāpatti-bheda (Phala & Nirodha)", "Samāpatti-bheda (Phala & Nirodha)", "Samāpatti-bheda (Phala y Nirodha)") },
                    ];
                    return `
            ${renderRow(this.loc("1. Via de Desenvolvimento (Bhāvanā-naya):", "1. Meditation Wing (Bhāvanā-naya):", "1. Vía de Desarrollo (Bhāvanā-naya):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Purificação / Domínio (7 Visuddhis / Samāpatti):", "2. Purification / Domain (7 Visuddhis / Samāpatti):", "2. Purificación / Dominio (7 Visuddhis / Samāpatti):"), "visuddhi", visuddhiOptions)}
            ${renderRow(this.loc("3. Estágio / Conhecimento (Vipassanā-ñāṇa):", "3. Stage / Knowledge (Vipassanā-ñāṇa):", "3. Etapa / Conocimiento (Vipassanā-ñāṇa):"), "stage", stageOptions)}
            ${renderRow(this.loc("4. Seção Canônica (Cap. 9 Mūla):", "4. Canonical Section (Ch. 9 Mūla):", "4. Sección Canónica (Cap. 9 Mūla):"), "section", sectionOptions)}
          `;
                }
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
            else {
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
            URL.revokeObjectURL(url);
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
                    if (ch > 1) {
                        this.binTargetNaryItem = pickNextNaryChapterChallenge(ch, this.progress);
                        this.narySwitches = defaultNarySwitchesForChapter(ch);
                        this.naryFeedback = null;
                    }
                    this.render();
                }
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
            this.binTargetNaryItem = pickNextNaryChapterChallenge(this.binActiveChapter, this.progress, this.binTargetNaryItem?.id);
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
                    if (idx === this.sequenceStep) {
                        this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${idx}`, true);
                        this.sequenceStep += 1;
                    }
                    else {
                        this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${this.sequenceStep}`, false);
                    }
                    this.syncVault();
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
let mnemonicLangListenerBound = false;
registerToolModule("mnemonic", (container) => {
    toolsMnemonicInstance = new MnemonicLabUI(container, settings.uiLang);
    toolsMnemonicInstance.init();
    if (!mnemonicLangListenerBound) {
        mnemonicLangListenerBound = true;
        window.addEventListener("languageChanged", () => {
            toolsMnemonicInstance?.setLang(settings.uiLang);
        });
    }
});
//# sourceMappingURL=ui.js.map