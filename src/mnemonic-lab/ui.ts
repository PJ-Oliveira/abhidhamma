/**
 * Interface Interativa e Gamificada do Laboratório Mnêmico (PT / EN / ES + Pāli).
 * Implementa os 3 Pilares:
 *   1. Descompactador Binário & Combinatório (89/121 Cittas)
 *   2. Tabela Periódica das 72 Realidades & Alquimia do Saṅgaha-naya
 *   3. Ábaco das Falanges (5 Mapas Táteis Tradicionais)
 */

import type { UiLang } from "../types.js";
import { settings } from "../state.js";
import { registerToolModule } from "../tools/tools.js";
import {
  CANONICAL_CITTAS_89,
  CANONICAL_CITTAS_121,
  PERIODIC_ELEMENTS_72,
  PHALANX_MAPS,
  type CanonicalCitta,
  type CittaFamilyId,
  type PhalanxMapSpec,
  type PhalanxSlot,
  type SabhavaElement,
} from "./data.js";
import {
  defaultSwitchStateForFamily,
  evaluateChemicalSynthesis,
  getPhalanxMapById,
  getSynthesizableCittas,
  loadMnemonicProgress,
  mergeMnemonicProgress,
  pickNextBinaryChallenge,
  pickNextPeriodicChallenge,
  pickNextPhalanxSlot,
  recordMnemonicAttempt,
  resolveCittaFromSwitches,
  saveMnemonicProgress,
  type AhetukaSubgroupId,
  type BinarySwitchState,
  type DifficultyLevel,
  type MnemonicProgressState,
} from "./engine.js";
import {
  buildLocalStorageSnapshot,
  hydrateOfflineVault,
  mergeSnapshots,
  parseProgressBackup,
  persistMnemonicOfflineVault,
  serializeProgressBackup,
  VAULT_BROADCAST_CHANNEL,
} from "../abhidhamma-srs/offline-store.js";

type PillarId = "binary" | "periodic" | "phalanx";
type BinaryMode = "explore" | "challenge";
type PeriodicMode = "atlas" | "alchemy";
type PhalanxMode = "open" | "blind" | "sequence";

interface LabStrings {
  title: string;
  subtitle: string;
  memoryAidNotice: string;
  binAidNotice: string;
  perAidNotice: string;
  phaAidNotice: string;
  streak: string;
  bestStreak: string;
  mastered: string;
  accuracy: string;
  rigorLevel: string;
  lvl1: string;
  lvl2: string;
  lvl3: string;
  tabBinary: string;
  tabPeriodic: string;
  tabPhalanx: string;
  // Pillar 1
  binModeExplore: string;
  binModeChallenge: string;
  binFamilyLabel: string;
  binJatiLabel: string;
  binBit1Label: string;
  binBit2Label: string;
  binBit3Label: string;
  binJhanaLabel: string;
  binArupaLabel: string;
  binMaggaLabel: string;
  binSynthesizedTitle: string;
  binChallengeTitle: string;
  binVerifyBtn: string;
  binNextBtn: string;
  binLoadIntoSwitches: string;
  binMatrixHeader: string;
  binCorrectMsg: string;
  binWrongMsg: string;
  binEquationBoxTitle: string;
  binMode121Label: string;
  binMode89Label: string;
  binScopeAll121: string;
  binScopeAll89: string;
  binJhanaLokuttaraLabel: string;
  binRelBhumi: string;
  binRelJati: string;
  binRelVedana: string;
  binRelHetu: string;
  binRelKicca: string;
  binRelDvara: string;
  binRelArammana: string;
  binRelVatthu: string;
  binRelEradication: string;
  binRelSangaha: string;
  // Pillar 2
  perModeAtlas: string;
  perModeAlchemy: string;
  perFilterAll: string;
  perFilterCitta: string;
  perFilterNeutral: string;
  perFilterAkusala: string;
  perFilterSobhana: string;
  perFilterRupa: string;
  perFilterAnipphanna: string;
  perFilterNibbana: string;
  perWhy72Title: string;
  perWhy72Body: string;
  perTargetTitle: string;
  perMacroBlocks: string;
  perBlockUniv7: string;
  perBlockPak6: string;
  perBlockAkuUniv4: string;
  perBlockSobUniv19: string;
  perBlockVirati3: string;
  perClearMix: string;
  perFillFixedHint: string;
  perVerifyMix: string;
  perNextChallenge: string;
  perActiveCount: string;
  perCollisionsTitle: string;
  perNoCollisions: string;
  perSuccessFixed: string;
  perSuccessFull: string;
  perMissingFixed: string;
  perExtraForbidden: string;
  perOptionalNote: string;
  // Pillar 3
  phaMapSelectLabel: string;
  phaModeOpen: string;
  phaModeBlind: string;
  phaModeSequence: string;
  phaLeftHand: string;
  phaRightHand: string;
  phaFingerIndex: string;
  phaFingerMiddle: string;
  phaFingerRing: string;
  phaFingerLittle: string;
  phaJointCrease: string;
  phaJointBase: string;
  phaJointMiddle: string;
  phaJointTip: string;
  phaPromptFind: string;
  phaPromptSeq: string;
  phaTapHint: string;
  phaCorrectTap: string;
  phaWrongTap: string;
  phaSeqComplete: string;
  phaRestartSeq: string;
  targetLabel: string;
  currentLabel: string;
  jatiKusala: string;
  jatiVipaka: string;
  jatiKiriya: string;
  dosaFixedNote: string;
  mohaFixedNote: string;
  mohaDoubt: string;
  mohaRestlessness: string;
  jhanaWord: string;
  maggaBtn: string;
  phalaBtn: string;
  eqSenses: string;
  eqStages: string;
  avinTag: string;
  anipphannaTag: string;
  valenceLabel: string;
  fixedCoreLabel: string;
  totalSangahaLabel: string;
  anchorLabel: string;
  vaultPillLabel: string;
  vaultPillTitle: string;
  binScopeLabel: string;
  binScopeAll: string;
  familyMismatchNotice: string;
  alignFamilyBtn: string;
  autoAlignToggleLabel: string;
  exportVaultBtn: string;
  exportVaultTitle: string;
  importVaultBtn: string;
  importVaultTitle: string;
  vaultImportOk: string;
  vaultImportErr: string;
}

const LAB_STRINGS: Readonly<Record<UiLang, LabStrings>> = {
  pt: {
    title: "🧮 Laboratório Mnêmico do Abhidhammatthasaṅgaha",
    subtitle: "1. Descompactação Binária (89/121) · 2. Tabela Periódica (72 Sabhāva + 10 Anipphanna = 82) · 3. Ábaco Tátil nas Falanges",
    memoryAidNotice: "Isto não é o Abhidhamma em si, mas apenas um auxílio de memorização.",
    binAidNotice: "Auxílio de memorização (não o Abhidhamma em si): matrizes combinatórias para reconstruir as 89/121 Cittas.",
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
    tabBinary: "⚡ 1. Descompactador Binário (89/121)",
    tabPeriodic: "🧪 2. Tabela Periódica (72 / 82 Realidades)",
    tabPhalanx: "🖐 3. Ábaco das Falanges (5 Mapas)",
    binModeExplore: "🔬 Explorador de Matrizes & Gerador",
    binModeChallenge: "🎯 Desafio: Decodificador Binário",
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
    binCorrectMsg: "✅ Codificação Exata! Você reconstruiu a Citta pela fórmula geradora.",
    binWrongMsg: "❌ As chaves atuais geram outra Citta. Compare os bits abaixo:",
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
    vaultPillLabel: "Cofre Offline",
    vaultPillTitle: "Respostas salvas em 4 camadas (localStorage, IndexedDB, Cache Storage e OPFS)",
    binScopeLabel: "Filtrar Família do Desafio:",
    binScopeAll: "🌐 Todas as 89",
    familyMismatchNotice: "Atenção: o alvo pertence à matriz",
    alignFamilyBtn: "Alinhar Chaves com o Alvo",
    autoAlignToggleLabel: "Auto-alinhar matriz ao avançar",
    exportVaultBtn: "Backup",
    exportVaultTitle: "Exportar backup completo em JSON (Cofre Offline 4 camadas)",
    importVaultBtn: "Restaurar",
    importVaultTitle: "Importar backup (.json) e mesclar com o cofre offline",
    vaultImportOk: "✅ Backup restaurado e sincronizado nas 4 camadas com sucesso!",
    vaultImportErr: "❌ Arquivo de backup inválido.",
  },
  en: {
    title: "🧮 Abhidhammatthasaṅgaha Mnemonic Lab",
    subtitle: "1. Binary Decompression (89/121) · 2. Periodic Table (72 Sabhāva + 10 Anipphanna = 82) · 3. Phalanx Tactile Abacus",
    memoryAidNotice: "This is not the Abhidhamma itself, but memory aids only.",
    binAidNotice: "Memory aid only (not the Abhidhamma itself): combinatorial matrices to reconstruct all 89/121 Cittas.",
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
    tabBinary: "⚡ 1. Binary Decompressor (89/121)",
    tabPeriodic: "🧪 2. Periodic Table (72 / 82 Realities)",
    tabPhalanx: "🖐 3. Phalanx Abacus (5 Maps)",
    binModeExplore: "🔬 Matrix Explorer & Live Generator",
    binModeChallenge: "🎯 Challenge: Binary Decoder",
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
    binCorrectMsg: "✅ Exact Encoding! You reconstructed the Citta via its generator formula.",
    binWrongMsg: "❌ Current switches generate a different Citta. Compare the bits below:",
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
  },
  es: {
    title: "🧮 Laboratorio Mnemónico del Abhidhammatthasaṅgaha",
    subtitle: "1. Descompresión Binaria (89/121) · 2. Tabla Periódica (72 Sabhāva + 10 Anipphanna = 82) · 3. Ábaco Táctil en las Falanges",
    memoryAidNotice: "Esto no es el Abhidhamma en sí, sino solo una ayuda de memorización.",
    binAidNotice: "Solo ayuda de memorización (no el Abhidhamma en sí): matrices combinatorias para reconstruir las 89/121 Cittas.",
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
    tabBinary: "⚡ 1. Descompresor Binario (89/121)",
    tabPeriodic: "🧪 2. Tabla Periódica (72 / 82 Realidades)",
    tabPhalanx: "🖐 3. Ábaco de Falanges (5 Mapas)",
    binModeExplore: "🔬 Explorador de Matrices y Generador",
    binModeChallenge: "🎯 Desafío: Decodificador Binario",
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
    binCorrectMsg: "✅ ¡Codificación Exacta! Reconstruiste la Citta mediante su fórmula generadora.",
    binWrongMsg: "❌ Los interruptores actuales generan otra Citta. Compara los bits abajo:",
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
    vaultPillLabel: "Bóveda Offline",
    vaultPillTitle: "Respuestas guardadas en 4 capas (localStorage, IndexedDB, Cache Storage y OPFS)",
    binScopeLabel: "Filtrar Familia del Desafío:",
    binScopeAll: "🌐 Todas las 89",
    familyMismatchNotice: "Aviso: el objetivo pertenece a la matriz",
    alignFamilyBtn: "Alinear Controles con Objetivo",
    autoAlignToggleLabel: "Auto-sincronizar matriz al avanzar",
    exportVaultBtn: "Copia",
    exportVaultTitle: "Exportar copia completa en JSON (Bóveda Offline 4 capas)",
    importVaultBtn: "Restaurar",
    importVaultTitle: "Importar copia (.json) y fusionar con la bóveda offline",
    vaultImportOk: "✅ ¡Copia restaurada y sincronizada en las 4 capas con éxito!",
    vaultImportErr: "❌ Archivo de copia inválido.",
  },
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export class MnemonicLabUI {
  private container: HTMLElement;
  private lang: UiLang;
  private progress: MnemonicProgressState;
  private activePillar: PillarId = "binary";

  // Pillar 1 State
  private binMode: BinaryMode = "explore";
  private binEnumMode: 89 | 121 = 121;
  private switches: BinarySwitchState = defaultSwitchStateForFamily("lobha");
  private binTargetCitta: CanonicalCitta;
  private binFamilyScope: CittaFamilyId | "all" = "all";
  private autoAlignFamily = true;
  private binFeedback: { isCorrect: boolean; synthesized: CanonicalCitta | null } | null = null;

  // Pillar 2 State
  private perMode: PeriodicMode = "atlas";
  private perFilter: "all" | "citta" | "neutral" | "akusala" | "sobhana" | "rupa" | "anipphanna" | "nibbana" = "all";
  private selectedAtom: SabhavaElement = PERIODIC_ELEMENTS_72[0]!;
  private chemTargetCitta: CanonicalCitta;
  private activeChemSet: Set<number> = new Set([1, 2, 3, 4, 5, 6, 7]);
  private chemVerified = false;

  // Pillar 3 State
  private phaMapId: PhalanxMapSpec["id"] = "akusala12";
  private phaMode: PhalanxMode = "open";
  private selectedSlotIndex = 1;
  private blindTargetSlot: PhalanxSlot;
  private blindFeedback: { isCorrect: boolean; tappedIndex: number; targetIndex: number } | null = null;
  private sequenceStep = 1;

  constructor(container: HTMLElement, lang: UiLang = settings.uiLang) {
    this.container = container;
    this.lang = lang;
    this.progress = loadMnemonicProgress();
    this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
    this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
    if (this.binTargetCitta.family === "lokuttara") {
      this.switches = {
        ...this.switches,
        jati: this.binTargetCitta.jati,
        maggaStage: this.binTargetCitta.maggaStage ?? 1,
        jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
      };
    }
    this.chemTargetCitta = pickNextPeriodicChallenge(this.progress);
    this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(this.phaMapId));
  }

  public init(): void {
    this.render();
    void this.hydrateFromVault();
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const ch = new BroadcastChannel(VAULT_BROADCAST_CHANNEL);
        ch.addEventListener("message", () => {
          this.progress = mergeMnemonicProgress(this.progress, loadMnemonicProgress());
          this.render();
        });
      }
    } catch {
      // ignore broadcast restrictions
    }
  }

  private async hydrateFromVault(): Promise<void> {
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
    } catch {
      // ignore vault hydration errors in restricted environments
    }
  }

  private syncVault(): void {
    void persistMnemonicOfflineVault(this.progress);
  }

  public setLang(lang: UiLang): void {
    if (this.lang === lang) return;
    this.lang = lang;
    this.render();
  }

  private countTotalMastered(): number {
    const countMap = (m: Readonly<Record<string, number>>) => Object.values(m).filter((v) => v >= 1).length;
    return (
      countMap(this.progress.masteredBinary) +
      countMap(this.progress.masteredPeriodic) +
      countMap(this.progress.masteredPhalanx)
    );
  }

  public render(): void {
    const s = LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt;
    const acc =
      this.progress.totalAttempts > 0
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

  // ── RENDER PILAR 1: DESCOMPACTADOR BINÁRIO (89 / 121 CITTAS) ───────────────

  private renderBinaryPillar(s: LabStrings): string {
    const currentCitta = resolveCittaFromSwitches(this.switches, this.binEnumMode);
    const familyCittas = getSynthesizableCittas(this.switches.family, this.binEnumMode);
    const sw = this.switches;

    const familyLabels: Record<CittaFamilyId, Record<UiLang, string>> = {
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
      const promptTitle =
        lvl === 3
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
        } else {
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

      const getFamLabel = (f: CittaFamilyId): string => familyLabels[f]?.[this.lang] ?? f;
      const getFamShortLabel = (f: CittaFamilyId): string => getFamLabel(f).split("(")[0]?.trim() ?? f;

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
            ${(["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"] as const)
              .map(
                (fam) => `
                <button type="button" class="mnem-scope-btn ${this.binFamilyScope === fam ? "active" : ""}" data-bin-scope="${fam}">
                  ${esc(getFamShortLabel(fam))} (${fam === "lobha" ? "8" : fam === "dosa" ? "2" : fam === "moha" ? "2" : fam === "ahetuka" ? "18" : fam === "kamasobhana" ? "24" : fam === "rupavacara" ? "15" : fam === "arupavacara" ? "12" : (this.binEnumMode === 121 ? "40" : "8")})
                </button>`
              )
              .join("")}
          </div>
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">🎯 ${esc(s.binChallengeTitle)} (${esc(target.asRef)})</span>
            <div class="mnem-challenge-prompt">${promptTitle}</div>
            <div class="mnem-challenge-rel-grid">
              <span class="mnem-rel-chip">🏛️ <strong>${esc(s.binRelBhumi)}:</strong> ${esc(target.bhumi)}</span>
              <span class="mnem-rel-chip">⚖️ <strong>${esc(s.binRelJati)}:</strong> ${esc(target.jati)}</span>
              ${target.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${target.jhanaStage}º Jhāna</span>` : ""}
              <span class="mnem-rel-chip">🌊 <strong>${esc(s.binRelVedana)}:</strong> ${target.bitVedana === 1 ? "Somanassa" : target.bitVedana === "domanassa" ? "Domanassa" : target.bitVedana === "dukkha" ? "Dukkha" : target.bitVedana === "sukha" ? "Sukha" : "Upekkhā"}</span>
              ${target.hetuType ? `<span class="mnem-rel-chip">🌱 <strong>${esc(s.binRelHetu)}:</strong> ${esc(target.hetuType)}</span>` : ""}
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
      <div class="mnem-submode-bar">
        <button type="button" class="mnem-submode-btn ${this.binMode === "explore" ? "active" : ""}" data-bin-mode="explore" aria-pressed="${this.binMode === "explore"}">
          ${esc(s.binModeExplore)}
        </button>
        <button type="button" class="mnem-submode-btn ${this.binMode === "challenge" ? "active" : ""}" data-bin-mode="challenge" aria-pressed="${this.binMode === "challenge"}">
          ${esc(s.binModeChallenge)}
        </button>
        <button type="button" class="mnem-submode-btn mnem-enum-mode-btn ${this.binEnumMode === 121 ? "mode-121" : "mode-89"}" id="mnem-bin-mode-toggle" title="Alternar entre contagem resumida (89) e detalhada (121)">
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
            ${(["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"] as const)
              .map(
                (fam) => {
                  const isTargetFam = this.binMode === "challenge" && this.binTargetCitta.family === fam;
                  const isMismatched = isTargetFam && sw.family !== fam;
                  return `
                  <button type="button" class="mnem-bit-btn ${sw.family === fam ? "active" : ""} ${isTargetFam ? "target-family" : ""}" data-bin-family="${fam}" aria-pressed="${sw.family === fam}">
                    ${esc(familyLabels[fam][this.lang])}${isMismatched ? " 🎯" : ""}
                  </button>`;
                }
              )
              .join("")}
          </div>
        </div>

        ${
          showJatiTriad
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
            : ""
        }

        ${
          showThreeBits
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
            : ""
        }

        ${
          sw.family === "dosa"
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
            : ""
        }

        ${
          sw.family === "moha"
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
            : ""
        }

        ${
          sw.family === "ahetuka"
            ? (() => {
                const subLabels: Record<AhetukaSubgroupId, Record<UiLang, string>> = {
                  akusala_vipaka: { pt: "1 · Akusala-vipāka (7)", en: "1 · Akusala-vipāka (7)", es: "1 · Akusala-vipāka (7)" },
                  kusala_vipaka: { pt: "2 · Kusala-vipāka (8)", en: "2 · Kusala-vipāka (8)", es: "2 · Kusala-vipāka (8)" },
                  kiriya: { pt: "3 · Ahetuka-kiriya (3)", en: "3 · Ahetuka-kiriya (3)", es: "3 · Ahetuka-kiriya (3)" },
                };
                const senseDoors: Array<{ pt: string; en: string; es: string }> = [
                  { pt: "1. Cakkhu (Olho · Upe)", en: "1. Cakkhu (Eye · Upe)", es: "1. Cakkhu (Ojo · Upe)" },
                  { pt: "2. Sota (Ouvido · Upe)", en: "2. Sota (Ear · Upe)", es: "2. Sota (Oído · Upe)" },
                  { pt: "3. Ghāna (Nariz · Upe)", en: "3. Ghāna (Nose · Upe)", es: "3. Ghāna (Nariz · Upe)" },
                  { pt: "4. Jivhā (Língua · Upe)", en: "4. Jivhā (Tongue · Upe)", es: "4. Jivhā (Lengua · Upe)" },
                ];
                const slotOpts =
                  sw.ahetukaSubgroup === "akusala_vipaka"
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
                        "7. Santīraṇa (Upe)",
                        "8. Santīraṇa (Som)",
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
                      ${(["akusala_vipaka", "kusala_vipaka", "kiriya"] as const)
                        .map(
                          (sg) => `
                          <button type="button" class="mnem-bit-btn ${sw.ahetukaSubgroup === sg ? "active" : ""}" data-ahetuka-sub="${sg}" aria-pressed="${sw.ahetukaSubgroup === sg}">
                            ${esc(subLabels[sg][this.lang])}
                          </button>`
                        )
                        .join("")}
                    </div>
                    <div class="mnem-switch-row" style="margin-top:8px;">
                      ${slotOpts
                        .map(
                          (lbl, idx) => `
                          <button type="button" class="mnem-bit-btn ${sw.ahetukaSlot === idx ? "active" : ""}" data-ahetuka-slot="${idx}" aria-pressed="${sw.ahetukaSlot === idx}">
                            ${esc(lbl)}
                          </button>`
                        )
                        .join("")}
                    </div>
                  </div>`;
              })()
            : ""
        }

        ${
          sw.family === "rupavacara"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binJhanaLabel)}</span>
            <div class="mnem-switch-row">
              ${([
                { st: 1, lbl: "1º Jhāna (5: Vt·Vc·Pī·Su·Ek)" },
                { st: 2, lbl: "2º Jhāna (4: −Vitakka)" },
                { st: 3, lbl: "3º Jhāna (3: −Vicāra)" },
                { st: 4, lbl: "4º Jhāna (2: −Pīti → Su·Ek)" },
                { st: 5, lbl: "5º Jhāna (2: Upekkhā·Ek)" },
              ] as const)
                .map(
                  (j) => `
                  <button type="button" class="mnem-bit-btn ${sw.jhanaStage === j.st ? "active" : ""}" data-bin-jhana="${j.st}" aria-pressed="${sw.jhanaStage === j.st}">
                    ${esc(j.lbl)}
                  </button>`
                )
                .join("")}
            </div>
          </div>`
            : ""
        }

        ${
          sw.family === "arupavacara"
            ? `
          <div class="mnem-switch-group">
            <span class="mnem-switch-label">${esc(s.binArupaLabel)}</span>
            <div class="mnem-switch-row">
              ${([
                { b: 1, lbl: "1. Ākāsānañcāyatana" },
                { b: 2, lbl: "2. Viññāṇañcāyatana" },
                { b: 3, lbl: "3. Ākiñcaññāyatana" },
                { b: 4, lbl: "4. Nevasaññānāsaññāyatana" },
              ] as const)
                .map(
                  (ab) => `
                  <button type="button" class="mnem-bit-btn ${sw.arupaBase === ab.b ? "active" : ""}" data-bin-arupa="${ab.b}" aria-pressed="${sw.arupaBase === ab.b}">
                    ${esc(ab.lbl)}
                  </button>`
                )
                .join("")}
            </div>
          </div>`
            : ""
        }

        ${
          sw.family === "lokuttara"
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
              ${([
                { m: 1, lbl: "1. Sotāpatti" },
                { m: 2, lbl: "2. Sakadāgāmī" },
                { m: 3, lbl: "3. Anāgāmī" },
                { m: 4, lbl: "4. Arahatta" },
              ] as const)
                .map(
                  (mg) => `
                  <button type="button" class="mnem-bit-btn ${sw.maggaStage === mg.m ? "active" : ""}" data-bin-magga="${mg.m}" aria-pressed="${sw.maggaStage === mg.m}">
                    ${esc(mg.lbl)}
                  </button>`
                )
                .join("")}
            </div>
            ${
              this.binEnumMode === 121
                ? `
            <div style="margin-top:10px;">
              <span class="mnem-switch-label">${esc(s.binJhanaLokuttaraLabel)}</span>
              <div class="mnem-switch-row" style="margin-top:4px;">
                ${([
                  { st: 1, lbl: "1º Jhāna (36: Vt·Vc·Pī·Su·Ek)" },
                  { st: 2, lbl: "2º Jhāna (35: −Vitakka)" },
                  { st: 3, lbl: "3º Jhāna (34: −Vicāra)" },
                  { st: 4, lbl: "4º Jhāna (33: −Pīti)" },
                  { st: 5, lbl: "5º Jhāna (33: Upekkhā·Ek)" },
                ] as const)
                  .map(
                    (j) => `
                    <button type="button" class="mnem-bit-btn ${sw.jhanaStage === j.st ? "active" : ""}" data-bin-jhana="${j.st}" aria-pressed="${sw.jhanaStage === j.st}">
                      ${esc(j.lbl)}
                    </button>`
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
          </div>`
            : ""
        }
      </div>

      ${
        currentCitta
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
            <span class="mnem-rel-chip">🏛️ <strong>${esc(s.binRelBhumi)}:</strong> ${esc(currentCitta.bhumi)}</span>
            <span class="mnem-rel-chip">⚖️ <strong>${esc(s.binRelJati)}:</strong> ${esc(currentCitta.jati)}</span>
            ${currentCitta.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${currentCitta.jhanaStage}º Jhāna</span>` : ""}
            <span class="mnem-rel-chip">🌊 <strong>${esc(s.binRelVedana)}:</strong> ${currentCitta.bitVedana === 1 ? "Somanassa" : currentCitta.bitVedana === "domanassa" ? "Domanassa" : currentCitta.bitVedana === "dukkha" ? "Dukkha" : currentCitta.bitVedana === "sukha" ? "Sukha" : "Upekkhā"}</span>
            ${currentCitta.hetuType ? `<span class="mnem-rel-chip">🌱 <strong>${esc(s.binRelHetu)}:</strong> ${esc(currentCitta.hetuType)}</span>` : ""}
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
          : ""
      }

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

  // ── RENDER PILAR 2: TABELA PERIÓDICA DAS 72 REALIDADES & SAṄGAHA-NAYA ─────

  private renderPeriodicPillar(s: LabStrings): string {
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

  private renderPeriodicAtlas(s: LabStrings): string {
    const filtered = PERIODIC_ELEMENTS_72.filter((el) => {
      if (this.perFilter === "all") return true;
      if (this.perFilter === "citta") return el.paramattha === "citta";
      if (this.perFilter === "neutral") return el.block === "sabbacitta" || el.block === "pakinnaka";
      if (this.perFilter === "akusala") return el.block.startsWith("akusala_");
      if (this.perFilter === "sobhana") return el.block.startsWith("sobhana_");
      if (this.perFilter === "rupa") return el.paramattha === "rupa" && !el.isAnipphanna;
      if (this.perFilter === "anipphanna") return Boolean(el.isAnipphanna);
      if (this.perFilter === "nibbana") return el.paramattha === "nibbana";
      return true;
    });

    const atom = this.selectedAtom;

    return `
      <div class="mnem-filter-bar">
        ${([
          { id: "all", lbl: s.perFilterAll },
          { id: "citta", lbl: s.perFilterCitta },
          { id: "neutral", lbl: s.perFilterNeutral },
          { id: "akusala", lbl: s.perFilterAkusala },
          { id: "sobhana", lbl: s.perFilterSobhana },
          { id: "rupa", lbl: s.perFilterRupa },
          { id: "anipphanna", lbl: s.perFilterAnipphanna },
          { id: "nibbana", lbl: s.perFilterNibbana },
        ] as const)
          .map(
            (f) => `
            <button type="button" class="mnem-filter-chip ${this.perFilter === f.id ? "active" : ""}" data-per-filter="${f.id}" aria-pressed="${this.perFilter === f.id}">
              ${esc(f.lbl)}
            </button>`
          )
          .join("")}
      </div>

      <div class="mnem-atom-inspector" aria-live="polite">
        <div class="mnem-atom-badge mnem-block-${atom.block}">
          <span class="mnem-atom-num">#${atom.atomicNumber}</span>
          <strong class="mnem-atom-sym">${esc(atom.symbol)}</strong>
          <span class="mnem-atom-param">${esc(atom.paramattha.toUpperCase())}</span>
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
                <span class="mnem-tile-pali" lang="pi">${esc(el.pali.split(" ")[0]!)}</span>
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

  private renderPeriodicAlchemy(s: LabStrings): string {
    const target = this.chemTargetCitta;
    const evalRes = evaluateChemicalSynthesis(target, this.activeChemSet);
    const cetasikaElements = PERIODIC_ELEMENTS_72.filter((el) => el.paramattha === "cetasika");

    let collisionsHtml = "";
    if (evalRes.collisions.length > 0) {
      collisionsHtml = `
        <div class="mnem-collision-alert" aria-live="polite">
          <div class="mnem-collision-head">${esc(s.perCollisionsTitle)}</div>
          ${evalRes.collisions
            .map(
              (c) => `
              <div class="mnem-collision-item">
                <strong>⚡ ${esc(c.title[this.lang])} (${esc(c.asRef)}):</strong>
                <span>${esc(c.explanation[this.lang])}</span>
              </div>`
            )
            .join("")}
        </div>
      `;
    } else {
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
      } else {
        verifyFeedbackHtml = `
          <div class="mnem-feedback mnem-feedback-err" aria-live="polite">
            ${
              evalRes.missingFixed.length > 0
                ? `<div><strong>${esc(s.perMissingFixed)}</strong> ${evalRes.missingFixed.map((e) => `${esc(e.pali)} (${esc(e.name[this.lang])})`).join(", ")}</div>`
                : ""
            }
            ${
              evalRes.extraForbidden.length > 0
                ? `<div><strong>${esc(s.perExtraForbidden)}</strong> ${evalRes.extraForbidden.map((e) => `${esc(e.pali)} (${esc(e.name[this.lang])})`).join(", ")}</div>`
                : ""
            }
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
          ${
            this.progress.level === 1
              ? `<div class="mnem-alchemy-counter">
                  ${esc(s.perActiveCount)} <strong>${this.activeChemSet.size}</strong>
                  (${esc(s.fixedCoreLabel)} <strong>${fixedCount}</strong>${optCount > 0 ? ` · ${esc(s.totalSangahaLabel)} <strong>${target.totalSangahaCount}</strong>` : ""})
                </div>`
              : `<div class="mnem-alchemy-counter">${esc(s.perActiveCount)} <strong>${this.activeChemSet.size}</strong></div>`
          }
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
                <span class="mnem-tile-pali" lang="pi">${esc(el.pali.split(" ")[0]!)}</span>
                <span class="mnem-tile-name">${esc(el.name[this.lang])}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }

  // ── RENDER PILAR 3: O ÁBACO NAS FALANGES DOS DEDOS (5 MAPAS TÁTEIS) ─────────

  private renderPhalanxPillar(s: LabStrings): string {
    const mapSpec = getPhalanxMapById(this.phaMapId);
    const activeSlot = mapSpec.slots.find((sl) => sl.index === this.selectedSlotIndex) ?? mapSpec.slots[0]!;

    let challengeBannerHtml = "";
    if (this.phaMode === "blind") {
      const target = this.blindTargetSlot;
      const lvl = this.progress.level;
      const promptText =
        lvl === 3
          ? `<strong lang="pi">${esc(target.pali)}</strong>`
          : `<strong>${esc(target.label[this.lang])}</strong> (<span lang="pi">${esc(target.pali)}</span>)`;

      let fbHtml = "";
      if (this.blindFeedback) {
        const hitSlot = mapSpec.slots.find((sl) => sl.index === this.blindFeedback!.targetIndex);
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
    } else if (this.phaMode === "sequence") {
      const total = mapSpec.slots.length;
      const isDone = this.sequenceStep > total;
      const nextSlot = mapSpec.slots.find((sl) => sl.index === this.sequenceStep);
      challengeBannerHtml = `
        <div class="mnem-challenge-box">
          ${
            isDone
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
                </div>`
          }
        </div>
      `;
    }

    return `
      <div class="mnem-phalanx-controls">
        <div class="mnem-map-select-wrap">
          <label for="mnem-pha-map-sel" class="mnem-switch-label">${esc(s.phaMapSelectLabel)}</label>
          <select id="mnem-pha-map-sel" class="mnem-map-select">
            ${PHALANX_MAPS.map(
              (m) => `<option value="${m.id}" ${m.id === this.phaMapId ? "selected" : ""}>${esc(m.title[this.lang])}</option>`
            ).join("")}
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
          ${
            activeSlot.sandhiAfter
              ? `<div class="mnem-slot-sandhi">${esc(activeSlot.sandhiAfter[this.lang])}</div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  private renderHandAnatomy(mapSpec: PhalanxMapSpec, hand: "left" | "right", s: LabStrings): string {
    const fingers: Array<{ id: PhalanxSlot["finger"]; label: string }> = [
      { id: "index", label: s.phaFingerIndex },
      { id: "middle", label: s.phaFingerMiddle },
      { id: "ring", label: s.phaFingerRing },
      { id: "little", label: s.phaFingerLittle },
    ];
    const jointsOrder: Array<{ id: PhalanxSlot["joint"]; label: string }> = [
      { id: "tip", label: s.phaJointTip },
      { id: "middle", label: s.phaJointMiddle },
      { id: "base", label: s.phaJointBase },
      ...(mapSpec.usesPalmCrease ? [{ id: "crease" as const, label: s.phaJointCrease }] : []),
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
                        const isBlindRevealed =
                          this.phaMode === "open" ||
                          (this.phaMode === "sequence" && slot.index < this.sequenceStep) ||
                          (this.phaMode === "blind" &&
                            this.blindFeedback != null &&
                            this.blindFeedback.targetIndex === slot.index);
                        const isGoldHighlight =
                          this.phaMode === "blind" &&
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
                            ${
                              isBlindRevealed
                                ? `<strong class="mnem-phalanx-code">${esc(slot.code)}</strong>
                                   <span class="mnem-phalanx-pali" lang="pi">${esc(slot.pali.split(" ")[0]!)}</span>`
                                : `<strong class="mnem-phalanx-hidden">?</strong>`
                            }
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

  // ── EVENT WIRING ───────────────────────────────────────────────────────────

  private wireEvents(): void {
    // Rigor Level selector
    const rigorSel = this.container.querySelector<HTMLSelectElement>("#mnem-rigor-select");
    rigorSel?.addEventListener("change", () => {
      const val = Number(rigorSel.value) as DifficultyLevel;
      if (val === 1 || val === 2 || val === 3) {
        this.progress = { ...this.progress, level: val };
        saveMnemonicProgress(this.progress);
        this.syncVault();
        this.render();
      }
    });

    // Vault Export & Import
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

    const fileInput = this.container.querySelector<HTMLInputElement>("#mnem-vault-file-input");
    this.container.querySelector("#mnem-vault-import")?.addEventListener("click", () => {
      fileInput?.click();
    });
    fileInput?.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
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
      } catch {
        alert((LAB_STRINGS[this.lang] ?? LAB_STRINGS.pt).vaultImportErr);
      }
      this.render();
    });

    // Pillar Tabs (with arrow key support per WAI-ARIA tablist guidance)
    const tabs = Array.from(this.container.querySelectorAll<HTMLButtonElement>(".mnem-pillar-tab"));
    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        const pillar = tab.dataset.pillar as PillarId;
        if (pillar && pillar !== this.activePillar) {
          this.activePillar = pillar;
          this.render();
          const newTab = this.container.querySelector<HTMLButtonElement>(`.mnem-pillar-tab[data-pillar="${pillar}"]`);
          newTab?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
        }
      });
      tab.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const nextIdx = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          const targetTab = tabs[nextIdx]!;
          const pillar = targetTab.dataset.pillar as PillarId;
          this.activePillar = pillar;
          this.render();
          const focused = this.container.querySelector<HTMLButtonElement>(`.mnem-pillar-tab[data-pillar="${pillar}"]`);
          focused?.focus();
        }
      });
    });

    // ── Pillar 1 Events ──
    this.container.querySelector("#mnem-bin-mode-toggle")?.addEventListener("click", () => {
      this.binEnumMode = this.binEnumMode === 121 ? 89 : 121;
      this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
      this.binFeedback = null;
      if (this.autoAlignFamily) {
        this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
        if (this.binTargetCitta.family === "lokuttara") {
          this.switches = {
            ...this.switches,
            maggaStage: this.binTargetCitta.maggaStage ?? 1,
            jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
            jati: this.binTargetCitta.jati,
          };
        }
      }
      this.render();
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.binMode as BinaryMode;
        if (mode) {
          this.binMode = mode;
          this.binFeedback = null;
          if (mode === "challenge" && this.autoAlignFamily) {
            this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            if (this.binTargetCitta.family === "lokuttara") {
              this.switches = {
                ...this.switches,
                maggaStage: this.binTargetCitta.maggaStage ?? 1,
                jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
                jati: this.binTargetCitta.jati,
              };
            }
          }
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-scope]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sc = btn.dataset.binScope as CittaFamilyId | "all";
        if (sc) {
          this.binFamilyScope = sc;
          this.binTargetCitta = pickNextBinaryChallenge(this.progress, this.binFamilyScope, undefined, this.binEnumMode);
          this.binFeedback = null;
          if (this.autoAlignFamily) {
            this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
            if (this.binTargetCitta.family === "lokuttara") {
              this.switches = {
                ...this.switches,
                maggaStage: this.binTargetCitta.maggaStage ?? 1,
                jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
                jati: this.binTargetCitta.jati,
              };
            }
          }
          this.render();
        }
      });
    });

    this.container.querySelector("#mnem-bin-align-family")?.addEventListener("click", () => {
      this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
      if (this.binTargetCitta.family === "lokuttara") {
        this.switches = {
          ...this.switches,
          maggaStage: this.binTargetCitta.maggaStage ?? 1,
          jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
          jati: this.binTargetCitta.jati,
        };
      }
      this.binFeedback = null;
      this.render();
    });

    this.container.querySelector<HTMLInputElement>("#mnem-bin-autoalign-toggle")?.addEventListener("change", (e) => {
      this.autoAlignFamily = (e.target as HTMLInputElement).checked;
      if (this.autoAlignFamily && this.switches.family !== this.binTargetCitta.family) {
        this.switches = defaultSwitchStateForFamily(this.binTargetCitta.family);
        if (this.binTargetCitta.family === "lokuttara") {
          this.switches = {
            ...this.switches,
            maggaStage: this.binTargetCitta.maggaStage ?? 1,
            jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
            jati: this.binTargetCitta.jati,
          };
        }
      }
      this.render();
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-family]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const fam = btn.dataset.binFamily as CittaFamilyId;
        if (fam) {
          this.switches = defaultSwitchStateForFamily(fam);
          this.binFeedback = null;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-jati]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const jati = btn.dataset.binJati as BinarySwitchState["jati"];
        if (jati) {
          this.switches = { ...this.switches, jati };
          this.binFeedback = null;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bit-vedana]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = Number(btn.dataset.bitVedana) as 0 | 1;
        this.switches = { ...this.switches, bitVedana: v };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bit-cog]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = Number(btn.dataset.bitCog) as 0 | 1;
        this.switches = { ...this.switches, bitCognitive: c };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bit-sank]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = Number(btn.dataset.bitSank) as 0 | 1;
        this.switches = { ...this.switches, bitSankhara: s };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bit-moha]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.bitMoha as "vicikiccha" | "uddhacca";
        this.switches = { ...this.switches, bitCognitive: m };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-ahetuka-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sg = btn.dataset.ahetukaSub as AhetukaSubgroupId;
        if (sg) {
          this.switches = { ...this.switches, ahetukaSubgroup: sg, ahetukaSlot: 0 };
          this.binFeedback = null;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-ahetuka-slot]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slot = Number(btn.dataset.ahetukaSlot);
        this.switches = { ...this.switches, ahetukaSlot: slot };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-jhana]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const j = Number(btn.dataset.binJhana) as 1 | 2 | 3 | 4 | 5;
        this.switches = { ...this.switches, jhanaStage: j };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-arupa]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const b = Number(btn.dataset.binArupa) as 1 | 2 | 3 | 4;
        this.switches = { ...this.switches, arupaBase: b };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-magga]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = Number(btn.dataset.binMagga) as 1 | 2 | 3 | 4;
        this.switches = { ...this.switches, maggaStage: m };
        this.binFeedback = null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-load-citta]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.loadCitta);
        const pool = this.binEnumMode === 121 ? CANONICAL_CITTAS_121 : CANONICAL_CITTAS_89;
        const found = pool.find((c) => c.id === id);
        if (found) {
          const ahetukaSubgroup: AhetukaSubgroupId =
            found.id >= 28 ? "kiriya" : found.id >= 20 ? "kusala_vipaka" : "akusala_vipaka";
          const ahetukaSlot =
            found.id >= 28 ? found.id - 28 : found.id >= 20 ? found.id - 20 : Math.max(0, found.id - 13);
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
        if (this.binTargetCitta.family === "lokuttara") {
          this.switches = {
            ...this.switches,
            maggaStage: this.binTargetCitta.maggaStage ?? 1,
            jhanaStage: this.binTargetCitta.jhanaStage ?? 1,
            jati: this.binTargetCitta.jati,
          };
        }
      }
      this.render();
    });

    // ── Pillar 2 Events ──
    this.container.querySelectorAll<HTMLButtonElement>("[data-per-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.perMode as PeriodicMode;
        if (m) {
          this.perMode = m;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-per-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.perFilter as typeof this.perFilter;
        if (f) {
          this.perFilter = f;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-atom-num]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const num = Number(btn.dataset.atomNum);
        const found = PERIODIC_ELEMENTS_72.find((e) => e.atomicNumber === num);
        if (found) {
          this.selectedAtom = found;
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-chem-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const subId = Number(btn.dataset.chemToggle);
        if (this.activeChemSet.has(subId)) {
          this.activeChemSet.delete(subId);
        } else {
          this.activeChemSet.add(subId);
        }
        this.chemVerified = false;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-chem-macro]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const macro = btn.dataset.chemMacro;
        const blockMap: Record<string, number[]> = {
          univ7: [1, 2, 3, 4, 5, 6, 7],
          pak6: [8, 9, 10, 11, 12, 13],
          aku4: [14, 15, 16, 17],
          sob19: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
          vir3: [47, 48, 49],
        };
        const ids = blockMap[macro ?? ""] ?? [];
        const allPresent = ids.every((id) => this.activeChemSet.has(id));
        for (const id of ids) {
          if (allPresent) this.activeChemSet.delete(id);
          else this.activeChemSet.add(id);
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
      this.progress = recordMnemonicAttempt(
        this.progress,
        "periodic",
        `chem:${this.chemTargetCitta.id}`,
        res.isValidConfiguration
      );
      this.syncVault();
      this.render();
    });

    this.container.querySelector("#mnem-chem-next")?.addEventListener("click", () => {
      this.chemTargetCitta = pickNextPeriodicChallenge(this.progress, this.chemTargetCitta.id);
      this.activeChemSet = new Set([1, 2, 3, 4, 5, 6, 7]);
      this.chemVerified = false;
      this.render();
    });

    // ── Pillar 3 Events ──
    const mapSel = this.container.querySelector<HTMLSelectElement>("#mnem-pha-map-sel");
    mapSel?.addEventListener("change", () => {
      const nextId = mapSel.value as PhalanxMapSpec["id"];
      this.phaMapId = nextId;
      this.selectedSlotIndex = 1;
      this.sequenceStep = 1;
      this.blindFeedback = null;
      this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(nextId));
      this.render();
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-pha-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.phaMode as PhalanxMode;
        if (m) {
          this.phaMode = m;
          this.sequenceStep = 1;
          this.blindFeedback = null;
          this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(this.phaMapId));
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-phalanx-idx]").forEach((btn) => {
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
        } else if (this.phaMode === "sequence") {
          if (idx === this.sequenceStep) {
            this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${idx}`, true);
            this.sequenceStep += 1;
          } else {
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

// Registra também como aba em Abhidhamma Tools (#/tools/mnemonic)
let toolsMnemonicInstance: MnemonicLabUI | null = null;
let mnemonicLangListenerBound = false;
registerToolModule("mnemonic" as any, (container: HTMLElement) => {
  toolsMnemonicInstance = new MnemonicLabUI(container, settings.uiLang);
  toolsMnemonicInstance.init();
  if (!mnemonicLangListenerBound) {
    mnemonicLangListenerBound = true;
    window.addEventListener("languageChanged", () => {
      toolsMnemonicInstance?.setLang(settings.uiLang);
    });
  }
});
