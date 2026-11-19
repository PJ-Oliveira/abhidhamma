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

type PillarId = "binary" | "periodic" | "phalanx";
type BinaryMode = "explore" | "challenge";
type PeriodicMode = "atlas" | "alchemy";
type PhalanxMode = "open" | "blind" | "sequence";

interface LabStrings {
  title: string;
  subtitle: string;
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
  // Pillar 2
  perModeAtlas: string;
  perModeAlchemy: string;
  perFilterAll: string;
  perFilterCitta: string;
  perFilterNeutral: string;
  perFilterAkusala: string;
  perFilterSobhana: string;
  perFilterRupa: string;
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
  valenceLabel: string;
  fixedCoreLabel: string;
  totalSangahaLabel: string;
  anchorLabel: string;
}

const LAB_STRINGS: Readonly<Record<UiLang, LabStrings>> = {
  pt: {
    title: "🧮 Laboratório Mnêmico do Abhidhammatthasaṅgaha",
    subtitle: "1. Descompactação Binária (89/121) · 2. Tabela Periódica (72 Realidades) · 3. Ábaco Tátil nas Falanges",
    streak: "Sequência",
    bestStreak: "Recorde",
    mastered: "Dominados",
    accuracy: "Precisão",
    rigorLevel: "Nível de Rigor:",
    lvl1: "1 · Guiado (Fórmulas & Pistas)",
    lvl2: "2 · Canônico (Tradução ↔ Estrutura)",
    lvl3: "3 · Rigor Pāli (Sem Dicas / Mão Cega)",
    tabBinary: "⚡ 1. Descompactador Binário (89/121)",
    tabPeriodic: "🧪 2. Tabela Periódica (72 Realidades)",
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
    perModeAtlas: "🗺 Atlas Interativo das 72 Realidades (Sabhāva)",
    perModeAlchemy: "⚗️ Jogo: Alquimia do Saṅgaha-naya & Colisões",
    perFilterAll: "Todas as 72 Realidades",
    perFilterCitta: "1 Citta",
    perFilterNeutral: "13 Cetasikas Neutros (7+6)",
    perFilterAkusala: "14 Cetasikas Insalubres (4+3+4+2+1)",
    perFilterSobhana: "25 Cetasikas Belos (19+3+2+1)",
    perFilterRupa: "18 Rūpas Concretos (Octeto Inseparável ★)",
    perFilterNibbana: "1 Nibbāna",
    perWhy72Title: "Por que 72 Realidades (Sabhāva-dhammas) e não 82? (AS VII.2)",
    perWhy72Body: "Porque 1 Citta + 52 Cetasikas + 18 Nipphanna-Rūpas (materialidades concretas) + 1 Nibbāna = 72 realidades com natureza própria (sabhāva). As outras 10 materialidades (Anipphanna-rūpa: espaço delimitante [1], intimações [2], mutabilidades [3] e fases temporais [4]) são apenas modos ou limites das 18 concretas.",
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
    valenceLabel: "Sampayoga / Valência:",
    fixedCoreLabel: "Base Fixa:",
    totalSangahaLabel: "Total Saṅgaha:",
    anchorLabel: "Âncora Mnêmica:",
  },
  en: {
    title: "🧮 Abhidhammatthasaṅgaha Mnemonic Lab",
    subtitle: "1. Binary Decompression (89/121) · 2. Periodic Table (72 Realities) · 3. Phalanx Tactile Abacus",
    streak: "Streak",
    bestStreak: "Best",
    mastered: "Mastered",
    accuracy: "Accuracy",
    rigorLevel: "Rigor Level:",
    lvl1: "1 · Guided (Formulas & Cues)",
    lvl2: "2 · Canonical (Translation ↔ Structure)",
    lvl3: "3 · Pāli Rigor (No Hints / Blind Hand)",
    tabBinary: "⚡ 1. Binary Decompressor (89/121)",
    tabPeriodic: "🧪 2. Periodic Table (72 Realities)",
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
    perModeAtlas: "🗺 Interactive Atlas of the 72 Realities (Sabhāva)",
    perModeAlchemy: "⚗️ Game: Saṅgaha-naya Alchemy & Collisions",
    perFilterAll: "All 72 Realities",
    perFilterCitta: "1 Citta",
    perFilterNeutral: "13 Ethically Variable Cetasikas (7+6)",
    perFilterAkusala: "14 Unwholesome Cetasikas (4+3+4+2+1)",
    perFilterSobhana: "25 Beautiful Cetasikas (19+3+2+1)",
    perFilterRupa: "18 Concrete Rūpas (Inseparable Octad ★)",
    perFilterNibbana: "1 Nibbāna",
    perWhy72Title: "Why 72 Realities (Sabhāva-dhammas) instead of 82? (AS VII.2)",
    perWhy72Body: "Because 1 Citta + 52 Cetasikas + 18 Nipphanna-Rūpas (concretely produced matter) + 1 Nibbāna = 72 realities possessing intrinsic nature (sabhāva). The remaining 10 materialities (Anipphanna-rūpa: delimiting space [1], intimations [2], mutabilities [3], and temporal phases [4]) are merely modes or boundaries of the 18 concrete realities.",
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
    valenceLabel: "Sampayoga / Valence:",
    fixedCoreLabel: "Fixed Core:",
    totalSangahaLabel: "Total Saṅgaha:",
    anchorLabel: "Mnemonic Anchor:",
  },
  es: {
    title: "🧮 Laboratorio Mnemónico del Abhidhammatthasaṅgaha",
    subtitle: "1. Descompresión Binaria (89/121) · 2. Tabla Periódica (72 Realidades) · 3. Ábaco Táctil en las Falanges",
    streak: "Racha",
    bestStreak: "Récord",
    mastered: "Dominados",
    accuracy: "Precisión",
    rigorLevel: "Nivel de Rigor:",
    lvl1: "1 · Guiado (Fórmulas y Pistas)",
    lvl2: "2 · Canónico (Traducción ↔ Estructura)",
    lvl3: "3 · Rigor Pāli (Sin Pistas / Mano Ciega)",
    tabBinary: "⚡ 1. Descompresor Binario (89/121)",
    tabPeriodic: "🧪 2. Tabla Periódica (72 Realidades)",
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
    perModeAtlas: "🗺 Atlas Interactivo de las 72 Realidades (Sabhāva)",
    perModeAlchemy: "⚗️ Juego: Alquimia del Saṅgaha-naya y Colisiones",
    perFilterAll: "Todas las 72 Realidades",
    perFilterCitta: "1 Citta",
    perFilterNeutral: "13 Cetasikas Neutros (7+6)",
    perFilterAkusala: "14 Cetasikas Insaludables (4+3+4+2+1)",
    perFilterSobhana: "25 Cetasikas Bellos (19+3+2+1)",
    perFilterRupa: "18 Rūpas Concretos (Octeto Inseparable ★)",
    perFilterNibbana: "1 Nibbāna",
    perWhy72Title: "¿Por qué 72 Realidades (Sabhāva-dhammas) y no 82? (AS VII.2)",
    perWhy72Body: "Porque 1 Citta + 52 Cetasikas + 18 Nipphanna-Rūpas (materialidades concretas) + 1 Nibbāna = 72 realidades con naturaleza propia (sabhāva). Las otras 10 materialidades (Anipphanna-rūpa: espacio delimitante [1], intimaciones [2], mutabilidades [3] y fases temporales [4]) son solo modos o límites de las 18 concretas.",
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
    valenceLabel: "Sampayoga / Valencia:",
    fixedCoreLabel: "Base Fija:",
    totalSangahaLabel: "Total Saṅgaha:",
    anchorLabel: "Ancla Mnemónica:",
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
  private switches: BinarySwitchState = defaultSwitchStateForFamily("lobha");
  private binTargetCitta: CanonicalCitta;
  private binFeedback: { isCorrect: boolean; synthesized: CanonicalCitta | null } | null = null;

  // Pillar 2 State
  private perMode: PeriodicMode = "atlas";
  private perFilter: "all" | "citta" | "neutral" | "akusala" | "sobhana" | "rupa" | "nibbana" = "all";
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
    this.binTargetCitta = pickNextBinaryChallenge(this.progress, "all");
    this.chemTargetCitta = pickNextPeriodicChallenge(this.progress);
    this.blindTargetSlot = pickNextPhalanxSlot(this.progress, getPhalanxMapById(this.phaMapId));
  }

  public init(): void {
    this.render();
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
    const currentCitta = resolveCittaFromSwitches(this.switches);
    const familyCittas = getSynthesizableCittas(this.switches.family);
    const sw = this.switches;

    const familyLabels: Record<CittaFamilyId, Record<UiLang, string>> = {
      lobha: { pt: "Lobha-mūla (8 = 2³)", en: "Lobha-mūla (8 = 2³)", es: "Lobha-mūla (8 = 2³)" },
      dosa: { pt: "Dosa-mūla (2 = 1×1×2)", en: "Dosa-mūla (2 = 1×1×2)", es: "Dosa-mūla (2 = 1×1×2)" },
      moha: { pt: "Moha-mūla (2 = 1×2)", en: "Moha-mūla (2 = 1×2)", es: "Moha-mūla (2 = 1×2)" },
      ahetuka: { pt: "Ahetuka (18 = 7 + 8 + 3)", en: "Ahetuka (18 = 7 + 8 + 3)", es: "Ahetuka (18 = 7 + 8 + 3)" },
      kamasobhana: { pt: "Kāmasobhana (24 = 2³ × 3)", en: "Kāmasobhana (24 = 2³ × 3)", es: "Kāmasobhana (24 = 2³ × 3)" },
      rupavacara: { pt: "Rūpāvacara (15 = 5 × 3)", en: "Rūpāvacara (15 = 5 × 3)", es: "Rūpāvacara (15 = 5 × 3)" },
      arupavacara: { pt: "Arūpāvacara (12 = 4 × 3)", en: "Arūpāvacara (12 = 4 × 3)", es: "Arūpāvacara (12 = 4 × 3)" },
      lokuttara: { pt: "Lokuttara (8 = 4×2 ou 40 = 8×5)", en: "Lokuttara (8 = 4×2 or 40 = 8×5)", es: "Lokuttara (8 = 4×2 o 40 = 8×5)" },
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

      challengeHtml = `
        <div class="mnem-challenge-box">
          <div class="mnem-challenge-head">
            <span class="mnem-challenge-kicker">🎯 ${esc(s.binChallengeTitle)} (${esc(target.asRef)})</span>
            <div class="mnem-challenge-prompt">${promptTitle}</div>
          </div>
          <div class="mnem-challenge-actions">
            <button type="button" class="mnem-btn mnem-btn-primary" id="mnem-bin-verify">${esc(s.binVerifyBtn)}</button>
            <button type="button" class="mnem-btn mnem-btn-secondary" id="mnem-bin-next">${esc(s.binNextBtn)}</button>
          </div>
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
      </div>

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
                (fam) => `
                <button type="button" class="mnem-bit-btn ${sw.family === fam ? "active" : ""}" data-bin-family="${fam}" aria-pressed="${sw.family === fam}">
                  ${esc(familyLabels[fam][this.lang])}
                </button>`
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
      if (this.perFilter === "rupa") return el.paramattha === "rupa";
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
              <button type="button" class="mnem-element-tile mnem-block-${el.block} ${isSel ? "selected" : ""}" data-atom-num="${el.atomicNumber}" aria-pressed="${isSel}">
                <span class="mnem-tile-top">
                  <span class="mnem-tile-num">${el.atomicNumber}</span>
                  ${el.cittaCount89 ? `<span class="mnem-tile-val">${el.cittaCount89}c</span>` : el.isAvinibbhoga ? `<span class="mnem-tile-val">★8</span>` : ""}
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
        this.render();
      }
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
    this.container.querySelectorAll<HTMLButtonElement>("[data-bin-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.binMode as BinaryMode;
        if (mode) {
          this.binMode = mode;
          this.binFeedback = null;
          this.render();
        }
      });
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
        const found = CANONICAL_CITTAS_89.find((c) => c.id === id);
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
      const synth = resolveCittaFromSwitches(this.switches);
      const isCorrect = synth?.id === this.binTargetCitta.id;
      this.binFeedback = { isCorrect, synthesized: synth };
      this.progress = recordMnemonicAttempt(this.progress, "binary", `citta:${this.binTargetCitta.id}`, isCorrect);
      this.render();
    });

    this.container.querySelector("#mnem-bin-next")?.addEventListener("click", () => {
      this.binTargetCitta = pickNextBinaryChallenge(this.progress, "all", this.binTargetCitta.id);
      this.binFeedback = null;
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
        } else if (this.phaMode === "sequence") {
          if (idx === this.sequenceStep) {
            this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${idx}`, true);
            this.sequenceStep += 1;
          } else {
            this.progress = recordMnemonicAttempt(this.progress, "phalanx", `${mapSpec.id}:${this.sequenceStep}`, false);
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
