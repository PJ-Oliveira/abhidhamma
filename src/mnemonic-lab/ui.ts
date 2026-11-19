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
  CANONICAL_CHAPTERS_META,
  type CanonicalChapterNum,
  type NaryChallengeItem,
} from "./nary-chapters-data.js";
import {
  defaultNarySwitchesForChapter,
  evaluateNaryChallenge,
  getNaryItemsForChapter,
  pickNextNaryChapterChallenge,
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
  navaParicchedaTitle: string;
  binModeToggleTitle: string;
  naryCorrectParams: string;
  naryDivergentParams: string;
  naryNone: string;
  naryExpected: string;
  naryCurrent: string;
  naryGroupLabel: string;
  narySubdivisionLabel: string;
  naryFormulaAnchor: string;
  narySynthKicker: string;
  naryEditingConfig: string;
  naryCurrentCombo: string;
  naryLoadIntoSwitches: string;
  naryCatalogueTitle: (ch: number, count: number) => string;
}

const LAB_STRINGS: Readonly<Record<UiLang, LabStrings>> = {
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
    naryCatalogueTitle: (ch: number, count: number) => `Catálogo Canônico do Capítulo ${ch} (${count} Itens Mūla):`,
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
    naryCatalogueTitle: (ch: number, count: number) => `Canonical Catalogue of Chapter ${ch} (${count} Mūla Items):`,
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
    naryCatalogueTitle: (ch: number, count: number) => `Catálogo Canónico del Capítulo ${ch} (${count} Ítems Mūla):`,
  },
};

function esc(s: string | undefined | null): string {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export class MnemonicLabUI {
  private container: HTMLElement;
  private lang: UiLang;
  private progress: MnemonicProgressState;
  private activePillar: PillarId = "binary";

  // Pillar 1 State
  private binMode: BinaryMode = "explore";
  private binEnumMode: 89 | 121 = 121;
  private binActiveChapter: CanonicalChapterNum = 1;
  private switches: BinarySwitchState = defaultSwitchStateForFamily("lobha");
  private binTargetCitta: CanonicalCitta;
  private binFamilyScope: CittaFamilyId | "all" = "all";
  private autoAlignFamily = true;
  private binFeedback: { isCorrect: boolean; synthesized: CanonicalCitta | null } | null = null;
  private binTargetNaryItem: NaryChallengeItem;
  private narySwitches: Record<string, string | number>;
  private naryFeedback: { isCorrect: boolean; matchedKeys: string[]; mismatchedKeys: string[] } | null = null;

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
    this.binTargetNaryItem = pickNextNaryChapterChallenge(2, this.progress);
    this.narySwitches = defaultNarySwitchesForChapter(2);
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

  private loc(pt: string, en: string, es: string): string {
    return this.lang === "en" ? en : this.lang === "es" ? es : pt;
  }

  private formatCanonicalGroupName(name?: string): string {
    if (!name) return "—";
    const map: Record<string, string> = {
      aññasamana: "Aññasamāna",
      sabbacitta: "Sabbacittasādhāraṇa",
      pakinnaka: "Pakiṇṇaka",
      akusala: "Akusala",
      moha: "Moha-catukka",
      lobha: "Lobha-tika",
      dosa: "Dosa-catukka",
      thina: "Thīna-duka",
      vicikiccha: "Vicikicchā",
      sobhana: "Sobhana",
      sadharana: "Sobhanasādhāraṇa",
      virati: "Virati",
      appamanna: "Appamaññā",
      panna: "Paññindriya",
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
      upada: "Upādā",
      pasada: "Pasāda",
      hadaya: "Hadaya",
      jivita: "Jīvita",
      nibbana: "Nibbāna",
      bodhipakkhiya: "Bodhipakkhiya",
      akusala_sangaha: "Akusala-samuccaya",
      patthana: "Paṭṭhāna",
      paticcasamuppada: "Paṭiccasamuppāda",
      samatha: "Samatha",
      vipassana: "Vipassanā",
      kasina: "Kasiṇa",
      asubha: "Asubha",
      anussati: "Anussati",
      brahmavihara: "Brahmavihāra",
      aruppa: "Āruppa",
    };
    return map[name] ?? (name.charAt(0).toUpperCase() + name.slice(1));
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

  // ── RENDER PILAR 1: DESCOMPACTADOR N-ÁRIO (89 / 121 CITTAS) ────────────────

  private renderBinaryPillar(s: LabStrings): string {
    const chapterBarHtml = `
      <div class="mnem-chapter-bar" role="navigation" aria-label="${esc(s.navaParicchedaTitle)}">
        <div class="mnem-chapter-bar-title">🏛️ <strong>${esc(s.navaParicchedaTitle)}</strong></div>
        <div class="mnem-chapter-btn-group">
          ${CANONICAL_CHAPTERS_META.map(
            (ch) => `
            <button type="button" class="mnem-chapter-btn ${this.binActiveChapter === ch.num ? "active" : ""}" data-bin-chapter="${ch.num}" aria-pressed="${this.binActiveChapter === ch.num}">
              ${esc(ch.shortLabel[this.lang])}
            </button>`
          ).join("")}
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
              ${target.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${target.jhanaStage}${this.loc("º Jhāna", target.jhanaStage === 1 ? "st Jhāna" : target.jhanaStage === 2 ? "nd Jhāna" : target.jhanaStage === 3 ? "rd Jhāna" : "th Jhāna", ".º Jhāna")}</span>` : ""}
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
                  { st: 1, lbl: this.loc("1º Jhāna (36: Vt·Vc·Pī·Su·Ek)", "1st Jhāna (36: Vt·Vc·Pī·Su·Ek)", "1.º Jhāna (36: Vt·Vc·Pī·Su·Ek)") },
                  { st: 2, lbl: this.loc("2º Jhāna (35: −Vitakka)", "2nd Jhāna (35: −Vitakka)", "2.º Jhāna (35: −Vitakka)") },
                  { st: 3, lbl: this.loc("3º Jhāna (34: −Vicāra)", "3rd Jhāna (34: −Vicāra)", "3.º Jhāna (34: −Vicāra)") },
                  { st: 4, lbl: this.loc("4º Jhāna (33: −Pīti)", "4th Jhāna (33: −Pīti)", "4.º Jhāna (33: −Pīti)") },
                  { st: 5, lbl: this.loc("5º Jhāna (33: Upekkhā·Ek)", "5th Jhāna (33: Upekkhā·Ek)", "5.º Jhāna (33: Upekkhā·Ek)") },
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
            ${currentCitta.jhanaStage ? `<span class="mnem-rel-chip">🧘 <strong>Jhāna:</strong> ${currentCitta.jhanaStage}${this.loc("º Jhāna", currentCitta.jhanaStage === 1 ? "st Jhāna" : currentCitta.jhanaStage === 2 ? "nd Jhāna" : currentCitta.jhanaStage === 3 ? "rd Jhāna" : "th Jhāna", ".º Jhāna")}</span>` : ""}
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

  // ── RENDER N-ARY CHAPTER DECODER (CAPÍTULOS 2 A 9 DO ABHIDHAMMATTHASAṄGAHA) ──

  private renderNaryChapterDecoder(s: LabStrings): string {
    const meta =
      CANONICAL_CHAPTERS_META.find((m) => m.num === this.binActiveChapter) ??
      CANONICAL_CHAPTERS_META[1]!;
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
      } else {
        feedbackHtml = `
          <div class="mnem-challenge-feedback err" style="margin-top:12px;">
            <div style="font-weight:700;">${esc(s.binWrongMsg)}</div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.82rem;font-weight:600;">${esc(s.naryCorrectParams)}</span>
              ${
                this.naryFeedback.matchedKeys.length > 0
                  ? this.naryFeedback.matchedKeys
                      .map((k) => `<span class="mnem-rel-chip" style="color:var(--text-color, #1e4620);background:rgba(46,125,50,0.18);">✓ ${esc(k)}</span>`)
                      .join("")
                  : `<span style="font-size:0.8rem;color:var(--text-muted, #6f5c48);">${esc(s.naryNone)}</span>`
              }
            </div>
            <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span style="font-size:0.82rem;font-weight:600;">${esc(s.naryDivergentParams)}</span>
              ${this.naryFeedback.mismatchedKeys
                .map(
                  (k) => `
                <span class="mnem-rel-chip" style="color:var(--danger, #b71c1c);background:rgba(183,28,28,0.18);">
                  ✗ ${esc(k)} (${esc(s.naryCurrent)}: ${esc(String(this.narySwitches[k] ?? "-"))} · ${esc(s.naryExpected)}: ${esc(String(target.switches[k]))})
                </span>`
                )
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
        ${
          synthItem
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
              .map(([k, v]) => `<strong>${esc(k)}</strong>: ${esc(String(v))}`)
              .join(" · ")}
          </div>
        `
        }
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

  private renderNarySwitchControls(
    chapter: CanonicalChapterNum,
    sw: Record<string, string | number>,
    _s: LabStrings
  ): string {
    const renderRow = (label: string, key: string, options: { val: string | number; label: string }[]) => {
      return `
        <div class="mnem-switch-group">
          <span class="mnem-switch-label">${esc(label)}</span>
          <div class="mnem-switch-row">
            ${options
              .map(
                (opt) => `
              <button type="button" class="mnem-bit-btn ${String(sw[key]) === String(opt.val) ? "active" : ""}" data-nary-key="${esc(key)}" data-nary-val="${esc(String(opt.val))}" aria-pressed="${String(sw[key]) === String(opt.val)}">
                ${esc(opt.label)}
              </button>`
              )
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
        let subOptions: { val: string | number; label: string }[] = [];
        if (currentGroup === "aññasamana") {
          subOptions = [
            { val: "sabbacitta", label: this.loc("Sabbacittasādhāraṇa (7 Universais)", "Sabbacittasādhāraṇa (7 Universals)", "Sabbacittasādhāraṇa (7 Universales)") },
            { val: "pakinnaka", label: this.loc("Pakiṇṇaka (6 Particulares)", "Pakiṇṇaka (6 Occasionals)", "Pakiṇṇaka (6 Particulares)") },
          ];
        } else if (currentGroup === "akusala") {
          subOptions = [
            { val: "moha", label: this.loc("Moha-catukka (4 Universais Insalubres)", "Moha-catukka (4 Unwholesome Universals)", "Moha-catukka (4 Universales Inhábiles)") },
            { val: "lobha", label: this.loc("Lobha-tríade (3 Raiz Apego)", "Lobha-triad (3 Greed Root)", "Tríada de Lobha (3 Raíz Apego)") },
            { val: "dosa", label: this.loc("Dosa-catukka (4 Raiz Aversão)", "Dosa-catukka (4 Hatred Root)", "Dosa-catukka (4 Raíz Aversión)") },
            { val: "thina", label: this.loc("Thīna-duka (2 Torpor/Lentidão)", "Thīna-duka (2 Sloth & Torpor)", "Thīna-duka (2 Pereza/Torpor)") },
            { val: "vicikiccha", label: this.loc("Vicikicchā (1 Dúvida Cética)", "Vicikicchā (1 Skeptical Doubt)", "Vicikicchā (1 Duda Escéptica)") },
          ];
        } else {
          subOptions = [
            { val: "sadharana", label: this.loc("Sobhanasādhāraṇa (19 Universais Belos)", "Sobhanasādhāraṇa (19 Beautiful Universals)", "Sobhanasādhāraṇa (19 Universales Hermosos)") },
            { val: "virati", label: this.loc("Virati (3 Abstenções Éticas)", "Virati (3 Ethical Abstinences)", "Virati (3 Abstenciones Éticas)") },
            { val: "appamanna", label: this.loc("Appamaññā (2 Ilimitados: Compaixão/Alegria)", "Appamaññā (2 Illimitables: Compassion/Joy)", "Appamaññā (2 Ilimitables: Compasión/Alegría)") },
            { val: "panna", label: this.loc("Paññindriya (1 Faculdade da Sabedoria)", "Paññindriya (1 Wisdom Faculty)", "Paññindriya (1 Facultad de Sabiduría)") },
          ];
        }

        const currentSub = String(sw.sub ?? (subOptions[0]?.val ?? "sabbacitta"));
        let maxSlots = 7;
        if (currentSub === "sabbacitta") maxSlots = 7;
        else if (currentSub === "pakinnaka") maxSlots = 6;
        else if (currentSub === "moha") maxSlots = 4;
        else if (currentSub === "lobha") maxSlots = 3;
        else if (currentSub === "dosa") maxSlots = 4;
        else if (currentSub === "thina") maxSlots = 2;
        else if (currentSub === "vicikiccha") maxSlots = 1;
        else if (currentSub === "sadharana") maxSlots = 19;
        else if (currentSub === "virati") maxSlots = 3;
        else if (currentSub === "appamanna") maxSlots = 2;
        else if (currentSub === "panna") maxSlots = 1;

        const slotOptions = Array.from({ length: maxSlots }, (_, i) => ({
          val: i + 1,
          label: this.loc(`Posição #${i + 1}`, `Position #${i + 1}`, `Posición #${i + 1}`),
        }));

        const sampayogaOptions = [
          { val: 121, label: "121 (Sabbacitta)" },
          { val: 110, label: "110 (Chanda)" },
          { val: 105, label: "105 (Viriya)" },
          { val: 101, label: "101 (Adhimokkha)" },
          { val: 91, label: "91 (19 Sobhana)" },
          { val: 79, label: "79 (Paññā)" },
          { val: 66, label: "66 (Pīti)" },
          { val: 55, label: "55 (Vitakka)" },
          { val: 28, label: "28 (Appamaññā)" },
          { val: 12, label: "12 (Moha-catukka)" },
          { val: 8, label: "8 (Lobha)" },
          { val: 4, label: "4 (Diṭṭhi)" },
          { val: 2, label: "2 (Dosa / Paṭigha)" },
          { val: 1, label: "1 (Vicikicchā)" },
        ];

        return `
          ${renderRow(this.loc("1. Grupo Canônico Principal (Cetasika-bheda):", "1. Main Canonical Group (Cetasika-bheda):", "1. Grupo Canónico Principal (Cetasika-bheda):"), "group", groupOptions)}
          ${renderRow(this.loc("2. Subfamília / Bloco:", "2. Subfamily / Block:", "2. Subfamilia / Bloque:"), "sub", subOptions)}
          ${renderRow(this.loc("3. Posição no Bloco (Slot):", "3. Slot Position:", "3. Posición en el Bloque (Slot):"), "slot", slotOptions)}
          ${renderRow(this.loc("4. Valência / Associação de Cittas (Sampayoga):", "4. Valence / Association with Cittas (Sampayoga):", "4. Valencia / Asociación de Cittas (Sampayoga):"), "sampayoga", sampayogaOptions)}
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
        let itemOptions: { val: string | number; label: string }[] = [];
        if (currentCat === "vedana") {
          itemOptions = [
            { val: "somanassa", label: this.loc("Somanassa (Agradável mental)", "Somanassa (Pleasant mental)", "Somanassa (Agradable mental)") },
            { val: "domanassa", label: this.loc("Domanassa (Desagradável mental)", "Domanassa (Unpleasant mental)", "Domanassa (Desagradable mental)") },
            { val: "sukha", label: this.loc("Sukha (Agradável corporal)", "Sukha (Pleasant bodily)", "Sukha (Agradable corporal)") },
            { val: "dukkha", label: this.loc("Dukkha (Dor corporal)", "Dukkha (Painful bodily)", "Dukkha (Dolor corporal)") },
            { val: "upekkha", label: this.loc("Upekkhā (Equanimidade neutra)", "Upekkhā (Neutral equanimity)", "Upekkhā (Ecuanimidad neutra)") },
          ];
        } else if (currentCat === "hetu") {
          itemOptions = [
            { val: "lobha", label: this.loc("Lobha (Apego)", "Lobha (Greed)", "Lobha (Apego)") },
            { val: "dosa", label: this.loc("Dosa (Aversão)", "Dosa (Hatred)", "Dosa (Aversión)") },
            { val: "moha", label: this.loc("Moha (Delusão)", "Moha (Delusion)", "Moha (Engaño / Delusión)") },
            { val: "alobha", label: this.loc("Alobha (Não-apego / Generosidade)", "Alobha (Non-greed / Generosity)", "Alobha (No-apego / Generosidad)") },
            { val: "adosa", label: this.loc("Adosa (Não-aversão / Metta)", "Adosa (Non-hatred / Loving-kindness)", "Adosa (No-aversión / Benevolencia)") },
            { val: "amoha", label: this.loc("Amoha (Não-delusão / Sabedoria)", "Amoha (Non-delusion / Wisdom)", "Amoha (No-engaño / Sabiduría)") },
            { val: "ahetuka", label: this.loc("Ahetuka (Sem Raiz · 18 Cittas)", "Ahetuka (Rootless · 18 Cittas)", "Ahetuka (Sin Raíz · 18 Cittas)") },
          ];
        } else if (currentCat === "kicca") {
          itemOptions = [
            { val: "patisandhi", label: this.loc("1. Paṭisandhi (Renascimento)", "1. Paṭisandhi (Rebirth-linking)", "1. Paṭisandhi (Reconectar / Renacimiento)") },
            { val: "bhavanga", label: this.loc("2. Bhavaṅga (Fluxo vital)", "2. Bhavaṅga (Life-continuum)", "2. Bhavaṅga (Flujo vital)") },
            { val: "avajjana", label: this.loc("3. Āvajjana (Adverting)", "3. Āvajjana (Adverting)", "3. Āvajjana (Advertencia)") },
            { val: "dassana", label: this.loc("4. Dassana (Visão)", "4. Dassana (Seeing)", "4. Dassana (Visión)") },
            { val: "sampaticchana", label: this.loc("5. Sampaṭicchana (Recepção)", "5. Sampaṭicchana (Receiving)", "5. Sampaṭicchana (Recepción)") },
            { val: "santirana", label: this.loc("6. Santīraṇa (Investigação)", "6. Santīraṇa (Investigating)", "6. Santīraṇa (Investigación)") },
            { val: "votthabbana", label: this.loc("7. Voṭṭhabbana (Determinação)", "7. Voṭṭhabbana (Determining)", "7. Voṭṭhabbana (Determinación)") },
            { val: "javana", label: this.loc("8. Javana (Ação moral/imoral)", "8. Javana (Impulsion / Action)", "8. Javana (Acción moral/inmoral)") },
            { val: "tadarammana", label: this.loc("9. Tadārammaṇa (Registro)", "9. Tadārammaṇa (Registration)", "9. Tadārammaṇa (Registro)") },
            { val: "cuti", label: this.loc("10. Cuti (Morte)", "10. Cuti (Death)", "10. Cuti (Muerte)") },
          ];
        } else {
          itemOptions = [
            { val: "cakkhu", label: this.loc("Cakkhu (Olho/Visual)", "Cakkhu (Eye / Visual)", "Cakkhu (Ojo / Visual)") },
            { val: "sota", label: this.loc("Sota (Ouvido/Auditivo)", "Sota (Ear / Auditory)", "Sota (Oído / Auditivo)") },
            { val: "ghana", label: this.loc("Ghāna (Nariz/Olfativo)", "Ghāna (Nose / Olfactory)", "Ghāna (Nariz / Olfativo)") },
            { val: "jivha", label: this.loc("Jivhā (Língua/Gustativo)", "Jivhā (Tongue / Gustatory)", "Jivhā (Lengua / Gustativo)") },
            { val: "kaya", label: this.loc("Kāya (Corpo/Tátil)", "Kāya (Body / Tactile)", "Kāya (Cuerpo / Táctil)") },
            { val: "mano", label: this.loc("Mano (Mente/Mental)", "Mano (Mind / Mental)", "Mano (Mente / Mental)") },
          ];
        }

        const countOptions = [
          { val: 1, label: this.loc("1 Citta", "1 Citta", "1 Citta") },
          { val: 2, label: this.loc("2 Cittas", "2 Cittas", "2 Cittas") },
          { val: 11, label: this.loc("11 Cittas", "11 Cittas", "11 Cittas") },
          { val: 18, label: this.loc("18 Cittas", "18 Cittas", "18 Cittas") },
          { val: 19, label: this.loc("19 Cittas", "19 Cittas", "19 Cittas") },
          { val: 55, label: this.loc("55 Cittas", "55 Cittas", "55 Cittas") },
          { val: 62, label: this.loc("62 Cittas", "62 Cittas", "62 Cittas") },
          { val: 79, label: this.loc("79 Cittas", "79 Cittas", "79 Cittas") },
        ];

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
        const varaOptions = [
          { val: "tadarammana", label: this.loc("Tadārammaṇavāra (Objeto Muito Grande · 17 Momentos)", "Tadārammaṇavāra (Very Great Object · 17 Moments)", "Tadārammaṇavāra (Objeto Muy Grande · 17 Momentos)") },
          { val: "javana", label: this.loc("Javanavāra (Objeto Grande · 14 Momentos)", "Javanavāra (Great Object · 14 Moments)", "Javanavāra (Objeto Grande · 14 Momentos)") },
          { val: "votthabbana", label: this.loc("Voṭṭhabbanavāra (Objeto Pequeno · 3 Momentos)", "Voṭṭhabbanavāra (Slight Object · 3 Moments)", "Voṭṭhabbanavāra (Objeto Pequeño · 3 Momentos)") },
          { val: "appana", label: this.loc("Appanāvīthi (Processos de Absorção Jhāna/Magga)", "Appanāvīthi (Absorption Processes Jhāna/Magga)", "Appanāvīthi (Procesos de Absorción Jhāna/Magga)") },
        ];
        const momentsOptions = [
          { val: 17, label: this.loc("17 Momentos de Citta (Vida da Matéria)", "17 Citta Moments (Lifespan of Matter)", "17 Momentos de Citta (Vida de la Materia)") },
          { val: 14, label: this.loc("14 Momentos (Até Javana)", "14 Moments (Up to Javana)", "14 Momentos (Hasta Javana)") },
          { val: 7, label: this.loc("7 Momentos (Javanas Comuns)", "7 Moments (Ordinary Javanas)", "7 Momentos (Javanas Comunes)") },
          { val: 3, label: this.loc("3 Momentos (Apenas Determinação)", "3 Moments (Determining Only)", "3 Momentos (Solo Determinación)") },
          { val: 0, label: this.loc("0 Momentos de Vīthicitta (Moghavāra)", "0 Vīthicitta Moments (Moghavāra)", "0 Momentos de Vīthicitta (Moghavāra)") },
        ];
        return `
          ${renderRow(this.loc("1. Porta de Entrada (Dvāra):", "1. Entry Door (Dvāra):", "1. Puerta de Entrada (Dvāra):"), "door", doorOptions)}
          ${renderRow(this.loc("2. Extensão do Processo (Vāra):", "2. Process Course / Scope (Vāra):", "2. Extensión del Proceso (Vāra):"), "vara", varaOptions)}
          ${renderRow(this.loc("3. Duração Temporal (Momentos de Citta):", "3. Temporal Duration (Citta Moments):", "3. Duración Temporal (Momentos de Citta):"), "moments", momentsOptions)}
        `;
      }

      case 5: {
        const tetradOptions = [
          { val: "bhumi", label: this.loc("1. Bhūmi-catukka (4 Planos / 31 Reinos)", "1. Bhūmi-catukka (4 Planes / 31 Realms)", "1. Bhūmi-catukka (4 Planos / 31 Reinos)") },
          { val: "kamma", label: this.loc("2. Kamma-catukka (4 Ordens de Kamma)", "2. Kamma-catukka (4 Orders of Kamma)", "2. Kamma-catukka (4 Órdenes de Kamma)") },
          { val: "patisandhi", label: this.loc("3. Paṭisandhi-catukka (4 Modos de Renascimento)", "3. Paṭisandhi-catukka (4 Modes of Rebirth)", "3. Paṭisandhi-catukka (4 Modos de Renacimiento)") },
          { val: "marana", label: this.loc("4. Maraṇuppatti-catukka (4 Ocasiões de Morte)", "4. Maraṇuppatti-catukka (4 Occasions of Death)", "4. Maraṇuppatti-catukka (4 Ocasiones de Muerte)") },
        ];
        const currentTetrad = String(sw.tetrad ?? "bhumi");
        let realmRoleOptions: { val: string | number; label: string }[] = [];
        if (currentTetrad === "bhumi") {
          realmRoleOptions = [
            { val: "apaya", label: this.loc("Apāyabhūmi (4 Reinos Inferiores)", "Apāyabhūmi (4 Woeful Realms)", "Apāyabhūmi (4 Reinos Inferiores)") },
            { val: "kamasugati", label: this.loc("Kāmasugatibhūmi (7 Reinos Felizes Sensuais)", "Kāmasugatibhūmi (7 Sensuous Blissful Realms)", "Kāmasugatibhūmi (7 Reinos Felices Sensuales)") },
            { val: "rupabhumi", label: this.loc("Rūpabhūmi (16 Reinos da Matéria Sutil)", "Rūpabhūmi (16 Fine-Material Realms)", "Rūpabhūmi (16 Reinos de la Materia Sutil)") },
            { val: "arupabhumi", label: this.loc("Arūpabhūmi (4 Reinos Imateriais)", "Arūpabhūmi (4 Immaterial Realms)", "Arūpabhūmi (4 Reinos Inmateriales)") },
          ];
        } else {
          realmRoleOptions = [
            { val: "janaka", label: this.loc("Janaka-kamma (Kamma Gerador)", "Janaka-kamma (Productive Kamma)", "Janaka-kamma (Kamma Generador)") },
            { val: "upatthambhaka", label: this.loc("Upatthambhaka-kamma (Kamma Sustentador)", "Upatthambhaka-kamma (Supportive Kamma)", "Upatthambhaka-kamma (Kamma Sustentador)") },
            { val: "upapilaka", label: this.loc("Upapīḷaka-kamma (Kamma Opressor)", "Upapīḷaka-kamma (Obstructive Kamma)", "Upapīḷaka-kamma (Kamma Opresor)") },
            { val: "upaghataka", label: this.loc("Upaghātaka-kamma (Kamma Destruidor)", "Upaghātaka-kamma (Destructive Kamma)", "Upaghātaka-kamma (Kamma Destructor)") },
            { val: "garuka", label: this.loc("Garuka-kamma (Kamma Grave / Prioritário)", "Garuka-kamma (Weighty Kamma)", "Garuka-kamma (Kamma Grave / Prioritario)") },
            { val: "asanna", label: this.loc("Āsanna-kamma (Kamma na Hora da Morte)", "Āsanna-kamma (Death-proximate Kamma)", "Āsanna-kamma (Kamma Cercano a la Muerte)") },
            { val: "acinna", label: this.loc("Āciṇṇa-kamma (Kamma Habitual)", "Āciṇṇa-kamma (Habitual Kamma)", "Āciṇṇa-kamma (Kamma Habitual)") },
            { val: "katatta", label: this.loc("Katattā-kamma (Kamma Cumulativo Menor)", "Katattā-kamma (Reserve / Cumulative Kamma)", "Katattā-kamma (Kamma Cumulativo Menor)") },
          ];
        }
        const countOptions = [
          { val: 4, label: this.loc("4 Planos / Tipos", "4 Planes / Types", "4 Planos / Tipos") },
          { val: 7, label: this.loc("7 Planos Felizes", "7 Blissful Planes", "7 Planos Felices") },
          { val: 16, label: this.loc("16 Planos Rūpa", "16 Rūpa Planes", "16 Planos Rūpa") },
          { val: 19, label: this.loc("19 Cittas de Renascimento", "19 Rebirth Cittas", "19 Cittas de Renacimiento") },
          { val: 31, label: this.loc("31 Reinos de Existência", "31 Realms of Existence", "31 Reinos de Existencia") },
        ];
        return `
          ${renderRow(this.loc("1. Tétrada Fora do Processo (Catukka):", "1. Process-Free Tetrad (Catukka):", "1. Tétrada Fuera del Proceso (Catukka):"), "tetrad", tetradOptions)}
          ${renderRow(this.loc("2. Domínio ou Papel Kármico:", "2. Domain or Karmic Role:", "2. Dominio o Papel Kármico:"), currentTetrad === "bhumi" ? "realm" : "role", realmRoleOptions)}
          ${renderRow(this.loc("3. Quantificação Canônica:", "3. Canonical Quantification:", "3. Cuantificación Canónica:"), "count", countOptions)}
        `;
      }

      case 6: {
        const typeOptions = [
          { val: "mahabhuta", label: this.loc("Mahābhūta (4 Grandes Elementos Primários)", "Mahābhūta (4 Great Primary Elements)", "Mahābhūta (4 Grandes Elementos Primarios)") },
          { val: "upada", label: this.loc("Upādā-rūpa (24 Matérias Derivadas)", "Upādā-rūpa (24 Derived Matter)", "Upādā-rūpa (24 Materias Derivadas)") },
          { val: "asankhata", label: this.loc("Asaṅkhata (Nibbāna · Não-Condicionado)", "Asaṅkhata (Nibbāna · Unconditioned)", "Asaṅkhata (Nibbāna · No Condicionado)") },
        ];
        const statusOptions = [
          { val: "nipphanna", label: this.loc("Nipphanna (18 Rūpas Concretos Produzidos)", "Nipphanna (18 Concrete / Produced Rūpas)", "Nipphanna (18 Rūpas Concretos Producidos)") },
          { val: "anipphanna", label: this.loc("Anipphanna (10 Rūpas Abstratos/Não-Concretos)", "Anipphanna (10 Abstract / Non-produced Rūpas)", "Anipphanna (10 Rūpas Abstractos/No Concretos)") },
          { val: "santi", label: this.loc("Santilakkhaṇa (Paz Extrema · Nibbāna)", "Santilakkhaṇa (Supreme Peace · Nibbāna)", "Santilakkhaṇa (Paz Suprema · Nibbāna)") },
        ];
        const samutthanaOptions = [
          { val: "catusamutthana", label: this.loc("4 Origens (Kamma, Citta, Utu, Āhāra)", "4 Origins (Kamma, Citta, Utu, Āhāra)", "4 Orígenes (Kamma, Citta, Utu, Āhāra)") },
          { val: "kammaja", label: this.loc("Origem Exclusiva em Kamma (Pasāda, Hadaya, Bhāva, Jīvita)", "Exclusive Kamma Origin (Pasāda, Hadaya, Bhāva, Jīvita)", "Origen Exclusivo en Kamma (Pasāda, Hadaya, Bhāva, Jīvita)") },
          { val: "cittaja", label: this.loc("Origem em Citta (Viññatti, etc.)", "Citta Origin (Viññatti, etc.)", "Origen en Citta (Viññatti, etc.)") },
          { val: "utuja", label: this.loc("Origem em Utu (Temperatura/Clima)", "Utu Origin (Temperature/Climate)", "Origen en Utu (Temperatura/Clima)") },
          { val: "aharaja", label: this.loc("Origem em Āhāra (Nutrição)", "Āhāra Origin (Nutrition)", "Origen en Āhāra (Nutrición)") },
          { val: "asamkhata", label: this.loc("Asaṅkhata (Sem Origem Causal · Nibbāna)", "Asaṅkhata (Without Causal Origin · Nibbāna)", "Asaṅkhata (Sin Origen Causal · Nibbāna)") },
        ];
        return `
          ${renderRow(this.loc("1. Natureza Ontológica (Rūpa-vibhāga):", "1. Ontological Nature (Rūpa-vibhāga):", "1. Naturaleza Ontológica (Rūpa-vibhāga):"), "type", typeOptions)}
          ${renderRow(this.loc("2. Status Estrutural:", "2. Structural Status:", "2. Estado Estructural:"), "status", statusOptions)}
          ${renderRow(this.loc("3. Origem Causal (Samuṭṭhāna):", "3. Causal Origin (Samuṭṭhāna):", "3. Origen Causal (Samuṭṭhāna):"), "samutthana", samutthanaOptions)}
        `;
      }

      case 7: {
        const compOptions = [
          { val: "akusala", label: this.loc("Akusala-samuccaya (9 Categorias Insalubres)", "Akusala-samuccaya (9 Unwholesome Categories)", "Akusala-samuccaya (9 Categorías Inhábiles)") },
          { val: "missaka", label: this.loc("Missaka-samuccaya (7 Categorias Mistas)", "Missaka-samuccaya (7 Miscellaneous Categories)", "Missaka-samuccaya (7 Categorías Mixtas)") },
          { val: "bodhipakkhiya", label: this.loc("Bodhipakkhiya (7 Grupos / 37 Fatores do Despertar)", "Bodhipakkhiya (7 Groups / 37 Factors of Awakening)", "Bodhipakkhiya (7 Grupos / 37 Factores del Despertar)") },
          { val: "sabba", label: this.loc("Sabba-saṅgaha (4 Sínteses Universais: Khandha, etc.)", "Sabba-saṅgaha (4 Universal Syntheses: Khandha, etc.)", "Sabba-saṅgaha (4 Síntesis Universales: Khandha, etc.)") },
        ];
        const groupOptions = [
          { val: "satipatthana", label: this.loc("4 Satipaṭṭhāna (Fundamentos da Atenção)", "4 Satipaṭṭhāna (Foundations of Mindfulness)", "4 Satipaṭṭhāna (Fundamentos de la Atención)") },
          { val: "sammappadhana", label: this.loc("4 Sammappadhāna (Esforços Corretos)", "4 Sammappadhāna (Right Exertions)", "4 Sammappadhāna (Esfuerzos Correctos)") },
          { val: "iddhipada", label: this.loc("4 Iddhipāda (Bases do Poder Espiritual)", "4 Iddhipāda (Bases of Spiritual Power)", "4 Iddhipāda (Bases del Poder Espiritual)") },
          { val: "bojjhanga", label: this.loc("7 Bojjhaṅga (Fatores de Iluminação)", "7 Bojjhaṅga (Factors of Enlightenment)", "7 Bojjhaṅga (Factores de Iluminación)") },
          { val: "magganga", label: this.loc("8 Maggaṅga (Fatores do Nobre Óctuplo Caminho)", "8 Maggaṅga (Noble Eightfold Path Factors)", "8 Maggaṅga (Factores del Noble Óctuple Sendero)") },
          { val: "asava", label: this.loc("4 Āsava (Fermentações/Poluições)", "4 Āsava (Taints / Corruptions)", "4 Āsava (Fermentos / Contaminaciones)") },
          { val: "nivarana", label: this.loc("6 Nīvaraṇa (Obstáculos Mentais)", "6 Nīvaraṇa (Mental Hindrances)", "6 Nīvaraṇa (Obstáculos Mentales)") },
        ];
        const countOptions = [
          { val: 4, label: this.loc("4 Fatores", "4 Factors", "4 Factores") },
          { val: 5, label: this.loc("5 Fatores", "5 Factors", "5 Factores") },
          { val: 6, label: this.loc("6 Fatores", "6 Factors", "6 Factores") },
          { val: 7, label: this.loc("7 Fatores", "7 Factors", "7 Factores") },
          { val: 8, label: this.loc("8 Fatores", "8 Factors", "8 Factores") },
          { val: 9, label: this.loc("9 Fatores", "9 Factors", "9 Factores") },
          { val: 10, label: this.loc("10 Fatores", "10 Factors", "10 Factores") },
        ];
        return `
          ${renderRow(this.loc("1. Compêndio de Categorias (Samuccaya):", "1. Categories Compendium (Samuccaya):", "1. Compendio de Categorías (Samuccaya):"), "compendium", compOptions)}
          ${renderRow(this.loc("2. Grupo Doutrinário:", "2. Doctrinal Group:", "2. Grupo Doctrinal:"), "group", groupOptions)}
          ${renderRow(this.loc("3. Quantidade de Fatores no Grupo:", "3. Factor Count in Group:", "3. Cantidad de Factores en el Grupo:"), "count", countOptions)}
        `;
      }

      case 8: {
        const methodOptions = [
          { val: "patthana", label: this.loc("Paṭṭhāna (As 24 Condições de Relação Causal)", "Paṭṭhāna (24 Conditions of Causal Relations)", "Paṭṭhāna (Las 24 Condiciones de Relación Causal)") },
          { val: "paticcasamuppada", label: this.loc("Paṭiccasamuppāda (Origem Dependente dos 12 Elos)", "Paṭiccasamuppāda (Dependent Origination · 12 Links)", "Paṭiccasamuppāda (Origen Dependiente de los 12 Eslabones)") },
        ];
        const typeOptions = [
          { val: "sahajata", label: this.loc("Sahajāta (Conascença / Simultaneidade)", "Sahajāta (Co-nascence / Simultaneity)", "Sahajāta (Conascencia / Simultaneidad)") },
          { val: "arammana", label: this.loc("Ārammaṇa (Objeto / Condição Objetiva)", "Ārammaṇa (Object / Objective Condition)", "Ārammaṇa (Objeto / Condición Objetiva)") },
          { val: "kamma", label: this.loc("Kamma (Ação e Consequência)", "Kamma (Action & Consequence)", "Kamma (Acción y Consecuencia)") },
          { val: "anantara", label: this.loc("Anantara (Proximidade Imediata Sem Intervalo)", "Anantara (Contiguity / Immediate Proximity)", "Anantara (Proximidad Inmediata Sin Intervalo)") },
          { val: "nissaya", label: this.loc("Nissaya (Suporte / Apoio Físico ou Mental)", "Nissaya (Support / Physical or Mental Base)", "Nissaya (Soporte / Apoyo Físico o Mental)") },
          { val: "purejata", label: this.loc("Purejāta (Pré-nascença / Base Preexistente)", "Purejāta (Prenascence / Pre-existing Base)", "Purejāta (Prenacencia / Base Preexistente)") },
        ];
        const indexOptions = [
          { val: 1, label: this.loc("#1 Hetu (Raiz)", "#1 Hetu (Root)", "#1 Hetu (Raíz)") },
          { val: 2, label: this.loc("#2 Ārammaṇa (Objeto)", "#2 Ārammaṇa (Object)", "#2 Ārammaṇa (Objeto)") },
          { val: 6, label: this.loc("#6 Sahajāta (Conascença)", "#6 Sahajāta (Co-nascence)", "#6 Sahajāta (Conascencia)") },
          { val: 13, label: this.loc("#13 Kamma (Ação)", "#13 Kamma (Action)", "#13 Kamma (Acción)") },
        ];
        return `
          ${renderRow(this.loc("1. Método Causal:", "1. Causal Method:", "1. Método Causal:"), "method", methodOptions)}
          ${renderRow(this.loc("2. Vetor Relacional (Relação de Força):", "2. Relational Vector (Force Relation):", "2. Vector Relacional (Relación de Fuerza):"), "type", typeOptions)}
          ${renderRow(this.loc("3. Índice Canônico no Paṭṭhāna (1..24):", "3. Canonical Paṭṭhāna Index (1..24):", "3. Índice Canónico en el Paṭṭhāna (1..24):"), "index", indexOptions)}
        `;
      }

      case 9:
      default: {
        const wingOptions = [
          { val: "samatha", label: this.loc("Samatha-bhāvanā (Tranquilidade · 40 Kammaṭṭhānas)", "Samatha-bhāvanā (Tranquility · 40 Kammaṭṭhānas)", "Samatha-bhāvanā (Tranquilidad · 40 Kammaṭṭhānas)") },
          { val: "vipassana", label: this.loc("Vipassanā-bhāvanā (Insight · 7 Visuddhis & 10 Ñāṇas)", "Vipassanā-bhāvanā (Insight · 7 Visuddhis & 10 Ñāṇas)", "Vipassanā-bhāvanā (Insight · 7 Visuddhis y 10 Ñāṇas)") },
        ];
        const currentWing = String(sw.wing ?? "samatha");
        if (currentWing === "samatha") {
          const groupOptions = [
            { val: "kasina", label: this.loc("10 Kasiṇas (Terra, Água, Fogo, Ar, etc.)", "10 Kasiṇas (Earth, Water, Fire, Air, etc.)", "10 Kasiṇas (Tierra, Agua, Fuego, Aire, etc.)") },
            { val: "asubha", label: this.loc("10 Asubhas (Contemplação das Impurezas)", "10 Asubhas (Foulness Contemplations)", "10 Asubhas (Contemplación de Impurezas)") },
            { val: "anussati", label: this.loc("10 Anussatis (Rememorações do Buddha, Dhamma, etc.)", "10 Anussatis (Recollections of Buddha, Dhamma, etc.)", "10 Anussatis (Rememoraciones de Buddha, Dhamma, etc.)") },
            { val: "brahmavihara", label: this.loc("4 Brahmavihāras (Amor, Compaixão, Alegria, Equanimidade)", "4 Brahmavihāras (Loving-kindness, Compassion, Joy, Equanimity)", "4 Brahmavihāras (Amor bondadoso, Compasión, Alegría, Ecuanimidad)") },
            { val: "aruppa", label: this.loc("4 Āruppas (Bases Imateriais)", "4 Āruppas (Immaterial Bases)", "4 Āruppas (Bases Inmateriales)") },
          ];
          const jhanaOptions = [
            { val: 5, label: this.loc("Até o 5º Jhāna (Todos os 5)", "Up to 5th Jhāna (All 5)", "Hasta el 5.º Jhāna (Todos los 5)") },
            { val: 4, label: this.loc("Até o 4º Jhāna", "Up to 4th Jhāna", "Hasta el 4.º Jhāna") },
            { val: 1, label: this.loc("Apenas 1º Jhāna (Asubhas & Kāyagatāsati)", "1st Jhāna Only (Asubhas & Kāyagatāsati)", "Solo 1.º Jhāna (Asubhas y Kāyagatāsati)") },
            { val: 0, label: this.loc("Apenas Upacāra-samādhi (Anussatis 1-8)", "Access Only: Upacāra-samādhi (Anussatis 1-8)", "Solo Upacāra-samādhi (Anussatis 1-8)") },
          ];
          const caritaOptions = [
            { val: "all", label: this.loc("Todos os Temperamentos", "All Temperaments", "Todos los Temperamentos") },
            { val: "raga", label: this.loc("Rāgacarita (Apego / Desejo)", "Rāgacarita (Greedy / Lustful)", "Rāgacarita (Apego / Deseo)") },
            { val: "dosa", label: this.loc("Dosacarita (Aversão / Irritação)", "Dosacarita (Hating / Aversive)", "Dosacarita (Aversión / Irritación)") },
            { val: "moha_vitakka", label: this.loc("Moha / Vitakkacarita (Confusão / Distração)", "Moha / Vitakkacarita (Deluded / Distracted)", "Moha / Vitakkacarita (Confusión / Distracción)") },
            { val: "saddha", label: this.loc("Saddhācarita (Fé e Devoção)", "Saddhācarita (Devout / Faithful)", "Saddhācarita (Fe y Devoción)") },
            { val: "buddhi", label: this.loc("Buddhicarita (Intelecto e Sabedoria)", "Buddhicarita (Intellectual / Discerning)", "Buddhicarita (Intelecto y Sabiduría)") },
          ];
          const nimittaOptions = [
            { val: 1, label: this.loc("1. Parikamma-nimitta (Sinal Preliminar)", "1. Parikamma-nimitta (Preparatory Sign)", "1. Parikamma-nimitta (Signo Preliminar)") },
            { val: 2, label: this.loc("2. Uggaha-nimitta (Sinal Adquirido / Imagem Mental)", "2. Uggaha-nimitta (Acquired / Learning Sign)", "2. Uggaha-nimitta (Signo Adquirido / Imagen Mental)") },
            { val: 3, label: this.loc("3. Paṭibhāga-nimitta (Sinal Contraparte Cristalino)", "3. Paṭibhāga-nimitta (Counterpart Sign)", "3. Paṭibhāga-nimitta (Signo Contraparte)") },
          ];
          return `
            ${renderRow(this.loc("1. Asa de Meditação (Bhāvanā-naya):", "1. Meditation Wing (Bhāvanā-naya):", "1. Ala de Meditación (Bhāvanā-naya):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Grupo dos 40 Objetos de Meditação (Kammaṭṭhāna):", "2. Group of 40 Meditation Objects (Kammaṭṭhāna):", "2. Grupo de los 40 Objetos de Meditación (Kammaṭṭhāna):"), "group", groupOptions)}
            ${renderRow(this.loc("3. Alcance Máximo de Concentração (Jhāna-bhūmi):", "3. Maximum Concentration Reach (Jhāna-bhūmi):", "3. Alcance Máximo de Concentración (Jhāna-bhūmi):"), "maxJhana", jhanaOptions)}
            ${renderRow(this.loc("4. Temperamento Adequado (Sappāyabheda):", "4. Suitable Temperament (Sappāyabheda):", "4. Temperamento Adecuado (Sappāyabheda):"), "carita", caritaOptions)}
            ${renderRow(this.loc("5. Nível do Sinal Meditativo (Nimitta):", "5. Meditative Sign Level (Nimitta):", "5. Nivel del Signo Meditativo (Nimitta):"), "nimitta", nimittaOptions)}
          `;
        } else {
          const visuddhiOptions = [
            { val: 3, label: this.loc("3. Diṭṭhivisuddhi (Purificação da Visão: Nome e Forma)", "3. Diṭṭhivisuddhi (Purification of View: Mentality & Matter)", "3. Diṭṭhivisuddhi (Purificación de la Vista: Nombre y Forma)") },
            { val: 4, label: this.loc("4. Kaṅkhāvitaraṇavisuddhi (Superação da Dúvida: Causas)", "4. Kaṅkhāvitaraṇavisuddhi (Overcoming Doubt: Causes)", "4. Kaṅkhāvitaraṇavisuddhi (Superación de la Duda: Causas)") },
            { val: 6, label: this.loc("6. Paṭipadāñāṇadassanavisuddhi (Caminho dos 9 Conhecimentos)", "6. Paṭipadāñāṇadassanavisuddhi (Path of 9 Insight Knowledges)", "6. Paṭipadāñāṇadassanavisuddhi (Sendero de los 9 Conocimientos)") },
            { val: 7, label: this.loc("7. Ñāṇadassanavisuddhi (Visão de Sabedoria: 4 Maggas)", "7. Ñāṇadassanavisuddhi (Vision by Knowledge: 4 Supramundane Paths)", "7. Ñāṇadassanavisuddhi (Visión de Sabiduría: 4 Maggas)") },
          ];
          const stageOptions = [
            { val: "nama_rupa", label: this.loc("Nāmarūpapariccheda (Delimitação de Nome e Forma)", "Nāmarūpapariccheda (Delimitation of Mentality-Materiality)", "Nāmarūpapariccheda (Delimitación de Nombre y Forma)") },
            { val: "paccaya", label: this.loc("Paccayapariggaha (Discernimento das Causas e Efeitos)", "Paccayapariggaha (Discerning Causes & Conditions)", "Paccayapariggaha (Discernimiento de Causas y Efectos)") },
            { val: "udayabbaya", label: this.loc("Udayabbayañāṇa (Visão do Surgimento e Dissolução)", "Udayabbayañāṇa (Knowledge of Arising & Passing Away)", "Udayabbayañāṇa (Visión de Surgimiento y Disolución)") },
            { val: "sankharupekkha", label: this.loc("Saṅkhārupekkhāñāṇa (Equanimidade com as Formações)", "Saṅkhārupekkhāñāṇa (Equanimity towards Formations)", "Saṅkhārupekkhāñāṇa (Ecuanimidad hacia las Formaciones)") },
            { val: "nirodha", label: this.loc("Nirodhasamāpatti (Realização da Cessação Suprema)", "Nirodhasamāpatti (Attainment of Supreme Cessation)", "Nirodhasamāpatti (Realización de la Cesación Suprema)") },
          ];
          const vimokkhaOptions = [
            { val: "sunnata", label: this.loc("Suññatā (Vazio pela Contemplação de Anattā)", "Suññatā (Voidness by Contemplating Anattā)", "Suññatā (Vacuidad por la Contemplación de Anattā)") },
            { val: "animitta", label: this.loc("Animitta (Sem Sinal pela Contemplação de Anicca)", "Animitta (Signless by Contemplating Anicca)", "Animitta (Sin Signo por la Contemplación de Anicca)") },
            { val: "appanihita", label: this.loc("Appaṇihita (Sem Desejo pela Contemplação de Dukkha)", "Appaṇihita (Desireless by Contemplating Dukkha)", "Appaṇihita (Sin Deseo por la Contemplación de Dukkha)") },
            { val: "nirodha", label: this.loc("Nirodha (Cessação Suprema de Citta e Cetasikas)", "Nirodha (Supreme Cessation of Citta & Cetasikas)", "Nirodha (Cesación Suprema de Citta y Cetasikas)") },
          ];
          return `
            ${renderRow(this.loc("1. Asa de Meditação (Bhāvanā-naya):", "1. Meditation Wing (Bhāvanā-naya):", "1. Ala de Meditación (Bhāvanā-naya):"), "wing", wingOptions)}
            ${renderRow(this.loc("2. Nível das 7 Visuddhis (Purificações):", "2. Level of the 7 Visuddhis (Purifications):", "2. Nivel de las 7 Visuddhis (Purificaciones):"), "visuddhi", visuddhiOptions)}
            ${renderRow(this.loc("3. Estágio / Conhecimento de Insight (Vipassanā-ñāṇa):", "3. Insight Stage / Knowledge (Vipassanā-ñāṇa):", "3. Etapa / Conocimiento de Insight (Vipassanā-ñāṇa):"), "stage", stageOptions)}
            ${renderRow(this.loc("4. Porta de Libertação (Vimokkhamukha):", "4. Door of Liberation (Vimokkhamukha):", "4. Puerta de Liberación (Vimokkhamukha):"), "vimokkha", vimokkhaOptions)}
          `;
        }
      }
    }
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

    // ── Chapter Bar & N-ary Events (Capítulos 1 a 9) ──
    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-chapter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ch = Number(btn.dataset.binChapter) as CanonicalChapterNum;
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

    this.container.querySelectorAll<HTMLButtonElement>("[data-nary-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.naryKey;
        const rawVal = btn.dataset.naryVal;
        if (!key || rawVal === undefined) return;
        const val = /^-?\d+$/.test(rawVal) ? Number(rawVal) : rawVal;
        this.narySwitches = { ...this.narySwitches, [key]: val };
        this.naryFeedback = null;
        this.render();
      });
    });

    this.container.querySelector("#mnem-nary-verify")?.addEventListener("click", () => {
      if (!this.binTargetNaryItem) return;
      const res = evaluateNaryChallenge(this.binTargetNaryItem, this.narySwitches);
      this.naryFeedback = res;
      const itemId = this.binTargetNaryItem.id;
      this.progress = recordMnemonicAttempt(this.progress, "binary", `nary:${itemId}`, res.isCorrect);
      this.syncVault();
      this.render();
    });

    this.container.querySelector("#mnem-nary-next")?.addEventListener("click", () => {
      this.binTargetNaryItem = pickNextNaryChapterChallenge(
        this.binActiveChapter,
        this.progress,
        this.binTargetNaryItem?.id
      );
      this.naryFeedback = null;
      this.render();
    });

    this.container.querySelectorAll<HTMLButtonElement>("[data-nary-load-item]").forEach((btn) => {
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
