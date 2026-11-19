import { describe, it, expect, beforeEach } from "vitest";
import {
  CANONICAL_CITTAS_89,
  PERIODIC_ELEMENTS_72,
  PHALANX_MAPS,
} from "../../src/mnemonic-lab/data.js";
import {
  createInitialProgress,
  defaultSwitchStateForFamily,
  detectOntologicalCollisions,
  evaluateChemicalSynthesis,
  getPhalanxMapById,
  pickNextBinaryChallenge,
  pickNextPeriodicChallenge,
  pickNextPhalanxSlot,
  recordMnemonicAttempt,
  resolveCittaFromSwitches,
} from "../../src/mnemonic-lab/engine.js";
import { MnemonicLabUI } from "../../src/mnemonic-lab/ui.js";

describe("Laboratório Mnêmico — Canonical Data, Combinatorial Engine & Trilingual UI", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("validates exact canonical counts of the 89 Cittas and their Saṅgaha-naya compositions", () => {
    expect(CANONICAL_CITTAS_89.length).toBe(89);

    const lobha = CANONICAL_CITTAS_89.filter((c) => c.family === "lobha");
    const dosa = CANONICAL_CITTAS_89.filter((c) => c.family === "dosa");
    const moha = CANONICAL_CITTAS_89.filter((c) => c.family === "moha");
    const ahetuka = CANONICAL_CITTAS_89.filter((c) => c.family === "ahetuka");
    const kamasobhana = CANONICAL_CITTAS_89.filter((c) => c.family === "kamasobhana");
    const rupa = CANONICAL_CITTAS_89.filter((c) => c.family === "rupavacara");
    const arupa = CANONICAL_CITTAS_89.filter((c) => c.family === "arupavacara");
    const lokuttara = CANONICAL_CITTAS_89.filter((c) => c.family === "lokuttara");

    expect(lobha.length).toBe(8);
    expect(dosa.length).toBe(2);
    expect(moha.length).toBe(2);
    expect(ahetuka.length).toBe(18);
    expect(kamasobhana.length).toBe(24);
    expect(rupa.length).toBe(15);
    expect(arupa.length).toBe(12);
    expect(lokuttara.length).toBe(8);

    // Check classic Saṅgaha-naya counts (AS II.18-29)
    expect(lobha.map((c) => c.totalSangahaCount)).toEqual([19, 21, 19, 21, 18, 20, 18, 20]);
    expect(dosa.map((c) => c.totalSangahaCount)).toEqual([20, 22]);
    expect(moha.map((c) => c.totalSangahaCount)).toEqual([15, 15]);
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 13)?.totalSangahaCount).toBe(7); // Cakkhu-viññāṇa
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 31)?.totalSangahaCount).toBe(38); // 1st Mahā-kusala
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 39)?.totalSangahaCount).toBe(33); // 1st Mahā-vipāka
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 47)?.totalSangahaCount).toBe(35); // 1st Mahā-kiriya
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 55)?.totalSangahaCount).toBe(35); // 1st Jhāna Rūpāvacara
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 59)?.totalSangahaCount).toBe(30); // 5th Jhāna Rūpāvacara
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 70)?.totalSangahaCount).toBe(30); // Arūpāvacara
    expect(CANONICAL_CITTAS_89.find((c) => c.id === 82)?.totalSangahaCount).toBe(36); // Sotāpatti-magga (1st Jhāna)
  });

  it("validates the Periodic Table of 72 Sabhāva-dhammas (1 + 52 + 18 + 1 = 72) and the 8 Avinibbhoga-rūpas", () => {
    expect(PERIODIC_ELEMENTS_72.length).toBe(72);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "citta").length).toBe(1);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "cetasika").length).toBe(52);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "rupa").length).toBe(18);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "nibbana").length).toBe(1);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.isAvinibbhoga).length).toBe(8);
  });

  it("detects all 8 canonical ontological collisions in Chapter 2 (Saṅgaha-naya)", () => {
    // 1. Akusala (14 Moha) + Sobhana (28 Saddhā)
    expect(detectOntologicalCollisions(new Set([14, 28])).map((c) => c.id)).toContain("akusala_sobhana");

    // 2. Diṭṭhi (19) + Māna (20)
    expect(detectOntologicalCollisions(new Set([18, 19, 20])).map((c) => c.id)).toContain("ditthi_mana");

    // 3. Lobha (18) + Dosa (21)
    expect(detectOntologicalCollisions(new Set([18, 21])).map((c) => c.id)).toContain("lobha_dosa");

    // 4. Adhimokkha (10) + Vicikicchā (27)
    expect(detectOntologicalCollisions(new Set([10, 27])).map((c) => c.id)).toContain("adhimokkha_vicikiccha");

    // 5. Pīti (12) with Dosa (21)
    expect(detectOntologicalCollisions(new Set([12, 21])).map((c) => c.id)).toContain("piti_feeling");

    // 6. Thīna-Middha (25, 26) in Asaṅkhārika Citta (#1)
    const lobha1 = CANONICAL_CITTAS_89.find((c) => c.id === 1)!;
    expect(detectOntologicalCollisions(new Set([...lobha1.fixedCetasikas, 25, 26]), lobha1).map((c) => c.id)).toContain(
      "thina_asankharika"
    );

    // 7. Issā (22) + Macchariya (23) outside Dosa Saṅgaha pool
    expect(detectOntologicalCollisions(new Set([22, 23])).map((c) => c.id)).toContain("dosa_secondaries");

    // 8. Karuṇā (50) + Muditā (51) in Lokuttara (#82)
    const magga1 = CANONICAL_CITTAS_89.find((c) => c.id === 82)!;
    expect(detectOntologicalCollisions(new Set([...magga1.fixedCetasikas, 50]), magga1).map((c) => c.id)).toContain(
      "karuna_mudita"
    );

    // 9. Thīna (25) split from Middha (26)
    expect(detectOntologicalCollisions(new Set([25])).map((c) => c.id)).toContain("thina_pair_split");

    // Verify exact Sampayoga-naya counts (89-count & 121-count) in Periodic Table
    const getCet = (subId: number) => PERIODIC_ELEMENTS_72.find((e) => e.paramattha === "cetasika" && e.subId === subId)!;
    expect([getCet(8).cittaCount89, getCet(8).cittaCount121]).toEqual([55, 55]);   // Vitakka
    expect([getCet(9).cittaCount89, getCet(9).cittaCount121]).toEqual([58, 66]);   // Vicāra
    expect([getCet(10).cittaCount89, getCet(10).cittaCount121]).toEqual([78, 110]); // Adhimokkha
    expect([getCet(11).cittaCount89, getCet(11).cittaCount121]).toEqual([73, 105]); // Vīriya
    expect([getCet(12).cittaCount89, getCet(12).cittaCount121]).toEqual([35, 51]);  // Pīti
    expect([getCet(13).cittaCount89, getCet(13).cittaCount121]).toEqual([69, 101]); // Chanda
    expect([getCet(52).cittaCount89, getCet(52).cittaCount121]).toEqual([47, 79]);  // Paññindriya
  });

  it("validates all 5 Phalanx Abacus maps (12 Akusala, 14 Cetasikas, 12 Paṭiccasamuppāda + 3 Sandhis, 14 Kicca, 24 Paṭṭhāna)", () => {
    expect(PHALANX_MAPS.length).toBe(5);
    expect(getPhalanxMapById("akusala12").slots.length).toBe(12);
    expect(getPhalanxMapById("cetasika14").slots.length).toBe(14);
    const paticca = getPhalanxMapById("paticca12");
    expect(paticca.slots.length).toBe(12);
    expect(paticca.slots.filter((s) => s.sandhiAfter != null).length).toBe(3);
    expect(getPhalanxMapById("kicca14").slots.length).toBe(14);
    expect(getPhalanxMapById("patthana24").slots.length).toBe(24);
  });

  it("resolves binary switches and evaluates chemical synthesis accurately", () => {
    const sw = {
      ...defaultSwitchStateForFamily("lobha"),
      bitVedana: 0 as const,
      bitCognitive: 1 as const,
      bitSankhara: 0 as const,
    };
    const resolved = resolveCittaFromSwitches(sw);
    expect(resolved?.id).toBe(6); // 6th Lobhamūla [0·1·0]

    // Verify all 18 Ahetuka Cittas (#13..#30) are synthesizable
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 4 })?.id).toBe(17); // Kāya-viññāṇa dukkha
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "kusala_vipaka", ahetukaSlot: 7 })?.id).toBe(27); // Somanassa-santīraṇa
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "kiriya", ahetukaSlot: 2 })?.id).toBe(30); // Hasituppāda

    const evalFixed = evaluateChemicalSynthesis(resolved!, new Set(resolved!.fixedCetasikas));
    expect(evalFixed.isExactFixedMatch).toBe(true);
    expect(evalFixed.isValidConfiguration).toBe(true);

    const prog0 = createInitialProgress();
    const prog1 = recordMnemonicAttempt(prog0, "binary", "citta:6", true);
    expect(prog1.streak).toBe(1);
    expect(prog1.masteredBinary["citta:6"]).toBe(1);

    expect(pickNextBinaryChallenge(prog1, "lobha", 6).id).not.toBe(6);
    expect(pickNextPeriodicChallenge(prog1, 1).id).not.toBe(1);
    expect(pickNextPhalanxSlot(prog1, getPhalanxMapById("akusala12"), 1).index).not.toBe(1);
  });

  it("renders MnemonicLabUI across all 3 pillars and updates live across PT, EN, and ES", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const ui = new MnemonicLabUI(host, "pt");
    ui.init();

    expect(host.textContent).toContain("Laboratório Mnêmico do Abhidhammatthasaṅgaha");

    // Switch language to English and Spanish
    ui.setLang("en");
    expect(host.textContent).toContain("Abhidhammatthasaṅgaha Mnemonic Lab");
    ui.setLang("es");
    expect(host.textContent).toContain("Laboratorio Mnemónico del Abhidhammatthasaṅgaha");
    ui.setLang("pt");

    // Pillar 1: Challenge mode & verify
    const binChallengeBtn = host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')!;
    binChallengeBtn.click();
    const verifyBinBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-verify")!;
    verifyBinBtn.click();
    expect(host.querySelector(".mnem-feedback")).not.toBeNull();

    // Pillar 2: Switch to Periodic Table tab & test Alchemy mode
    const tabPeriodic = host.querySelector<HTMLButtonElement>('#mnem-tab-periodic')!;
    tabPeriodic.click();
    expect(host.textContent).toContain("Por que 72 Realidades");

    const alchemyBtn = host.querySelector<HTMLButtonElement>('[data-per-mode="alchemy"]')!;
    alchemyBtn.click();
    const hintBtn = host.querySelector<HTMLButtonElement>("#mnem-chem-hint")!;
    hintBtn.click();
    const verifyChemBtn = host.querySelector<HTMLButtonElement>("#mnem-chem-verify")!;
    verifyChemBtn.click();
    expect(host.querySelector(".mnem-feedback-ok")).not.toBeNull();

    // Pillar 3: Switch to Phalanx Abacus tab & test Blind and Sequence modes
    const tabPhalanx = host.querySelector<HTMLButtonElement>('#mnem-tab-phalanx')!;
    tabPhalanx.click();
    expect(host.querySelectorAll(".mnem-phalanx-btn").length).toBe(12);

    const seqBtn = host.querySelector<HTMLButtonElement>('[data-pha-mode="sequence"]')!;
    seqBtn.click();
    const firstJoint = host.querySelector<HTMLButtonElement>('[data-phalanx-idx="1"]')!;
    firstJoint.click();
    expect(host.textContent).toContain("(2 / 12)");
  });
});
