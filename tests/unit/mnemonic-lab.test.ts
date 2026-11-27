import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  CANONICAL_CITTAS_89,
  CANONICAL_CITTAS_121,
  PERIODIC_ELEMENTS_72,
  PHALANX_MAPS,
} from "../../src/mnemonic-lab/data.js";
import {
  computeChapterScopeProgress,
  computeMnemonicProgressSummary,
  computeProgressMetric,
  createInitialProgress,
  defaultSwitchStateForFamily,
  detectOntologicalCollisions,
  evaluateChemicalSynthesis,
  getPhalanxMapById,
  getSynthesizableCittas,
  pickNextBinaryChallenge,
  pickNextPeriodicChallenge,
  pickNextPhalanxSlot,
  recordMnemonicAttempt,
  resolveCittaFromSwitches,
  getNaryItemsForChapter,
  pickNextNaryChapterChallenge,
  defaultNarySwitchesForChapter,
  evaluateNaryChallenge,
} from "../../src/mnemonic-lab/engine.js";
import { CANONICAL_CHAPTERS_META, getSubmatricesForChapter } from "../../src/mnemonic-lab/nary-chapters-data.js";
import { MULA_SYNTHESIS_ITEMS, SYNTHESIS_AXIS_META } from "../../src/mnemonic-lab/chapters/ch0-synthesis.js";
import { MnemonicLabUI } from "../../src/mnemonic-lab/ui.js";
import {
  buildLocalStorageSnapshot,
  hydrateOfflineVault,
  parseProgressBackup,
  persistMnemonicOfflineVault,
  serializeProgressBackup,
} from "../../src/abhidhamma-srs/offline-store.js";

describe("Laboratório Mnêmico — Canonical Data, Combinatorial Engine & Trilingual UI", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    (MnemonicLabUI as any).activeVaultChannel?.close?.();
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

  it("validates the complete Vitthāra 121 Cittas system and all 40 Lokuttara Cittas (AS I.38-43 & II.36-37)", () => {
    expect(CANONICAL_CITTAS_121.length).toBe(121);

    const lokuttara121 = CANONICAL_CITTAS_121.filter((c) => c.family === "lokuttara");
    expect(lokuttara121.length).toBe(40);

    const magga = lokuttara121.filter((c) => c.jati === "kusala");
    const phala = lokuttara121.filter((c) => c.jati === "vipaka");
    expect(magga.length).toBe(20);
    expect(phala.length).toBe(20);

    // Verify all 4 stages have 5 Jhānas each for Magga (20) and Phala (20)
    for (const stage of [1, 2, 3, 4] as const) {
      const stageMagga = magga.filter((c) => c.maggaStage === stage);
      const stagePhala = phala.filter((c) => c.maggaStage === stage);
      expect(stageMagga.length).toBe(5);
      expect(stagePhala.length).toBe(5);

      // Verify exact Saṅgaha-naya count per Jhāna: 36, 35, 34, 33, 33 (AS II.37)
      expect(stageMagga.map((c) => c.totalSangahaCount)).toEqual([36, 35, 34, 33, 33]);
      expect(stagePhala.map((c) => c.totalSangahaCount)).toEqual([36, 35, 34, 33, 33]);

      // Verify 5th Jhāna has Upekkhā (bitVedana = 0) and 1st-4th have Somanassa (bitVedana = 1)
      expect(stageMagga.map((c) => c.bitVedana)).toEqual([1, 1, 1, 1, 0]);
      expect(stagePhala.map((c) => c.bitVedana)).toEqual([1, 1, 1, 1, 0]);

      // Verify canonical relations for every Lokuttara citta
      for (const c of [...stageMagga, ...stagePhala]) {
        expect(c.bhumi).toBe("lokuttara");
        expect(c.hetuType).toBe("tihetuka");
        expect(c.kiccaPali).toMatch(/javana/i);
        expect(c.dvaraPali).toMatch(/ekadvārika/i);
        expect(c.arammanaPali).toMatch(/asaṅkhata-dhātu/i);
        expect(c.vatthuPali).toMatch(/hadayavatthu/i);
        expect(c.eradicationNote).toBeDefined();
      }
    }

    // Verify resolveCittaFromSwitches in 121 mode can synthesize all 40 Lokuttara cittas
    for (const jati of ["kusala", "vipaka"] as const) {
      for (const maggaStage of [1, 2, 3, 4] as const) {
        for (const jhanaStage of [1, 2, 3, 4, 5] as const) {
          const sw = {
            ...defaultSwitchStateForFamily("lokuttara"),
            jati,
            maggaStage,
            jhanaStage,
          };
          const resolved = resolveCittaFromSwitches(sw, 121);
          expect(resolved).not.toBeNull();
          expect(resolved?.family).toBe("lokuttara");
          expect(resolved?.jati).toBe(jati);
          expect(resolved?.maggaStage).toBe(maggaStage);
          expect(resolved?.jhanaStage).toBe(jhanaStage);
        }
      }
    }
  });

  it("validates the Periodic Table of 82 Realities (72 Sabhāva-dhammas + 10 Anipphanna-rūpas) and the 8 Avinibbhoga-rūpas", () => {
    expect(PERIODIC_ELEMENTS_72.length).toBe(82);
    expect(PERIODIC_ELEMENTS_72.filter((e) => !e.isAnipphanna).length).toBe(72);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.isAnipphanna).length).toBe(10);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "citta").length).toBe(1);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "cetasika").length).toBe(52);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "rupa" && !e.isAnipphanna).length).toBe(18);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "rupa" && e.isAnipphanna).length).toBe(10);
    expect(PERIODIC_ELEMENTS_72.filter((e) => e.paramattha === "rupa").length).toBe(28);
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

    // Verify all 18 Ahetuka Cittas (#13..#30) are synthesizable in exact Mūla order (AS I.9-11)
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "akusala_vipaka", ahetukaSlot: 4 })?.id).toBe(17); // Kāya-viññāṇa dukkha
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "kusala_vipaka", ahetukaSlot: 6 })?.id).toBe(26); // Somanassa-santīraṇa (AS I.10)
    expect(resolveCittaFromSwitches({ ...defaultSwitchStateForFamily("ahetuka"), ahetukaSubgroup: "kusala_vipaka", ahetukaSlot: 7 })?.id).toBe(27); // Upekkhā-santīraṇa (AS I.10)
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
    expect(host.textContent).toContain("Isto não é o Abhidhamma em si, mas apenas um auxílio de memorização.");

    // Switch language to English and Spanish
    ui.setLang("en");
    expect(host.textContent).toContain("Abhidhammatthasaṅgaha Mnemonic Lab");
    expect(host.textContent).toContain("This is not the Abhidhamma itself, but memory aids only.");
    ui.setLang("es");
    expect(host.textContent).toContain("Laboratorio Mnemónico del Abhidhammatthasaṅgaha");
    expect(host.textContent).toContain("Esto no es el Abhidhamma en sí, sino solo una ayuda de memorización.");
    ui.setLang("pt");

    // Pillar 1: Challenge mode & verify
    const binChallengeBtn = host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')!;
    binChallengeBtn.click();
    const verifyBinBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-verify")!;
    verifyBinBtn.click();
    expect(host.querySelector(".mnem-feedback")).not.toBeNull();

    // Challenge family scope filtering & automatic family switch synchronization
    const dosaScopeBtn = host.querySelector<HTMLButtonElement>('[data-bin-scope="dosa"]')!;
    dosaScopeBtn.click();
    // Scope filtered to Dosa: target is Dosa (#9 or #10) and switchboard is automatically aligned to Dosa
    expect(host.querySelector(".mnem-challenge-head")?.textContent).toMatch(/Dosa|Aversion|AS I\.5/i);
    const activeFamBtn = host.querySelector<HTMLButtonElement>('.mnem-bit-btn[data-bin-family="dosa"].active');
    expect(activeFamBtn).not.toBeNull();
    // Verify Dosa switches are displayed (Asaṅkhārika #9 vs Sasaṅkhārika #10)
    expect(host.textContent).toContain("Asaṅkhārika (#9)");
    expect(host.textContent).toContain("Sasaṅkhārika (#10)");

    // If student manually selects another family (e.g., Lobha), mismatch alert banner appears with quick align button
    const lobhaBtn = host.querySelector<HTMLButtonElement>('.mnem-bit-btn[data-bin-family="lobha"]')!;
    lobhaBtn.click();
    expect(host.querySelector(".mnem-family-mismatch-banner")).not.toBeNull();
    const alignBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-align-family")!;
    alignBtn.click();
    // Realigned to Dosa
    expect(host.querySelector('.mnem-bit-btn[data-bin-family="dosa"].active')).not.toBeNull();
    expect(host.querySelector(".mnem-family-mismatch-banner")).toBeNull();

    // Advancing with Next Challenge keeps family switches automatically synchronized
    const nextBinBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-next")!;
    nextBinBtn.click();
    expect(host.querySelector('.mnem-bit-btn[data-bin-family="dosa"].active')).not.toBeNull();

    // Lokuttara scope in 121 mode (all 40 Lokuttara cittas available)
    const lokuScopeBtn = host.querySelector<HTMLButtonElement>('[data-bin-scope="lokuttara"]')!;
    lokuScopeBtn.click();
    expect(host.querySelector(".mnem-challenge-head")?.textContent).toMatch(/Lok-Mag|Lok-Pha|Sotāpatti|Sakadāgāmī|Anāgāmī|Arahatta|Supramundane/i);
    expect(host.querySelector('.mnem-bit-btn[data-bin-family="lokuttara"].active')).not.toBeNull();
    // 5-Jhāna selector buttons are present in 121 mode for Lokuttara
    expect(host.querySelectorAll('[data-bin-jhana]').length).toBe(5);

    // Toggle mode to 89
    let modeToggleBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-mode-toggle")!;
    expect(modeToggleBtn.textContent).toContain("121");
    modeToggleBtn.click();
    modeToggleBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-mode-toggle")!;
    expect(modeToggleBtn.textContent).toContain("89");
    // Toggle back to 121
    modeToggleBtn.click();
    modeToggleBtn = host.querySelector<HTMLButtonElement>("#mnem-bin-mode-toggle")!;
    expect(modeToggleBtn.textContent).toContain("121");

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

  it("integrates Mnemonic Lab into the 4-layer Offline Vault, serializes JSON backups, and auto-heals after wipe", async () => {
    localStorage.clear();

    const cacheMap = new Map<string, string>();
    const prevCaches = (globalThis as any).caches;
    (globalThis as any).caches = {
      open: async () => ({
        match: async (url: string) => {
          const body = cacheMap.get(url);
          if (!body) return undefined;
          return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
        },
        put: async (url: string, resp: Response) => {
          const text = await resp.text();
          cacheMap.set(url, text);
        },
        delete: async (url: string) => {
          cacheMap.delete(url);
        },
      }),
    };

    try {
      // 1) User answers challenges in Mnemonic Lab
      let prog = createInitialProgress();
      prog = recordMnemonicAttempt(prog, "binary", "citta:1", true);
      prog = recordMnemonicAttempt(prog, "binary", "citta:9", true);
      prog = recordMnemonicAttempt(prog, "periodic", "chem:1", true);
      prog = recordMnemonicAttempt(prog, "phalanx", "akusala12:1", true);

      // Persist across the 4 offline layers
      const saved = await persistMnemonicOfflineVault(prog);
      expect(saved).toBe(true);

      // Verify localStorage has it
      expect(localStorage.getItem("abhidhamma_mnemonic_lab_v1")).toContain("citta:9");

      // Verify buildLocalStorageSnapshot serializes mnemonicLab
      const snap = buildLocalStorageSnapshot();
      expect(snap.mnemonicLab?.masteredBinary["citta:9"]).toBe(1);

      // Verify JSON backup export
      const backupJson = serializeProgressBackup(snap);
      expect(backupJson).toContain("citta:9");
      expect(backupJson).toContain("akusala12:1");

      // Verify JSON backup import / parse
      const parsed = parseProgressBackup(backupJson);
      expect(parsed.mnemonicLab?.masteredBinary["citta:1"]).toBe(1);

      // 2) SIMULATE ACCIDENTAL LOCALSTORAGE WIPE
      localStorage.clear();
      expect(localStorage.getItem("abhidhamma_mnemonic_lab_v1")).toBeNull();

      // 3) Auto-heal from Offline Vault (Cache API / IDB)
      const healed = await hydrateOfflineVault();
      expect(healed.snapshot.mnemonicLab?.masteredBinary["citta:9"]).toBe(1);

      // Auto-healed back into localStorage!
      expect(localStorage.getItem("abhidhamma_mnemonic_lab_v1")).toContain("citta:9");
    } finally {
      (globalThis as any).caches = prevCaches;
    }
  });

  it("validates all 9 canonical chapters (Nava Paricchedā) metadata, formulas, and item inventories", () => {
    // 1) All 9 chapters metadata in CANONICAL_CHAPTERS_META
    expect(CANONICAL_CHAPTERS_META.length).toBe(9);
    for (let i = 1; i <= 9; i++) {
      const meta = CANONICAL_CHAPTERS_META.find((m) => m.num === i);
      expect(meta).toBeDefined();
      expect(meta!.asRef).toMatch(/^AS (I|II|III|IV|V|VI|VII|VIII|IX)\./);
      expect(meta!.paliTitle).toBeTruthy();
      expect(meta!.equation.pt).toBeTruthy();
      expect(meta!.equation.en).toBeTruthy();
      expect(meta!.equation.es).toBeTruthy();
    }

    // 2) Chapter 2 has all 52 Cetasikas (13+14+25) + all 33 Saṅgaha-naya classes + 12 Sampayoga/Aniyata laws = 97
    const ch2Items = getNaryItemsForChapter(2);
    expect(ch2Items.length).toBe(97);
    const ch2Samp = getNaryItemsForChapter(2, "sampayoga_52");
    const ch2Sang = getNaryItemsForChapter(2, "sangaha_33");
    const ch2Laws = getNaryItemsForChapter(2, "cetasika_laws");
    expect(ch2Samp.length).toBe(52);
    expect(ch2Sang.length).toBe(33);
    expect(ch2Laws.length).toBe(12);
    // Verify AS II.33–34 Yogitā partition: 41 Niyata + 9 Aniyata Nānā + 2 Aniyata Saha = 52
    expect(ch2Samp.filter((c) => c.switches.yogita === "niyata").length).toBe(41);
    expect(ch2Samp.filter((c) => c.switches.yogita === "aniyata_nana").length).toBe(9);
    expect(ch2Samp.filter((c) => c.switches.yogita === "aniyata_saha").length).toBe(2);
    const annas = ch2Samp.filter((c) => c.primaryGroup === "aññasamana");
    const akus = ch2Samp.filter((c) => c.primaryGroup === "akusala");
    const sobh = ch2Samp.filter((c) => c.primaryGroup === "sobhana");
    expect(annas.length).toBe(13);
    expect(akus.length).toBe(14);
    expect(sobh.length).toBe(25);
    expect(ch2Sang.filter((c) => c.primaryGroup === "sangaha_lokuttara").length).toBe(5);
    expect(ch2Sang.filter((c) => c.primaryGroup === "sangaha_mahaggata").length).toBe(5);
    expect(ch2Sang.filter((c) => c.primaryGroup === "sangaha_kamasobhana").length).toBe(12);
    expect(ch2Sang.filter((c) => c.primaryGroup === "sangaha_akusala").length).toBe(7);
    expect(ch2Sang.filter((c) => c.primaryGroup === "sangaha_ahetuka").length).toBe(4);

    // 3) Chapter 3 covers all 6 exact partitions + Mūla supplements (8+10+20+9+17+9 = 73)
    const ch3Items = getNaryItemsForChapter(3);
    expect(ch3Items.length).toBe(73);
    expect(getNaryItemsForChapter(3, "vedana").length).toBe(8);
    expect(getNaryItemsForChapter(3, "hetu").length).toBe(10);
    expect(getNaryItemsForChapter(3, "kicca").length).toBe(20);
    expect(getNaryItemsForChapter(3, "dvara").length).toBe(9);
    expect(getNaryItemsForChapter(3, "arammana").length).toBe(17);
    expect(getNaryItemsForChapter(3, "vatthu").length).toBe(9);

    // 4) Chapter 4 covers all Vīthisaṅgaha structures including 6 Chakkas & granular Puggalabheda/Bhūmi (6+5+9+9+14 = 43)
    const ch4Items = getNaryItemsForChapter(4);
    expect(ch4Items.length).toBe(43);
    expect(getNaryItemsForChapter(4, "chakka_6").length).toBe(6);
    expect(getNaryItemsForChapter(4, "pancadvara").length).toBe(5);
    expect(getNaryItemsForChapter(4, "manodvara").length).toBe(9);
    expect(getNaryItemsForChapter(4, "niyama").length).toBe(9);
    expect(getNaryItemsForChapter(4, "puggala_bhumi").length).toBe(14);

    // 5) Chapter 5 covers all 31 planes + Paṭisandhi + 4×4 Kamma & ripening + 20 Kammapatha/Puñña + Death/Cuti (31+9+25+20+11 = 96)
    const ch5Items = getNaryItemsForChapter(5);
    expect(ch5Items.length).toBe(96);
    expect(getNaryItemsForChapter(5, "bhumi_31").length).toBe(31);
    expect(getNaryItemsForChapter(5, "patisandhi").length).toBe(9);
    expect(getNaryItemsForChapter(5, "kamma_16").length).toBe(25);
    expect(getNaryItemsForChapter(5, "kammapatha_20").length).toBe(20);
    expect(getNaryItemsForChapter(5, "marana_cuti").length).toBe(11);

    // 6) Chapter 6 covers all 28 individual rūpas + 10 dyads/4 origins + 21 kalāpas + pavatti/Nibbāna + 11 Rūpa laws (28+14+21+10+11 = 84)
    const ch6Items = getNaryItemsForChapter(6);
    expect(ch6Items.length).toBe(84);
    expect(getNaryItemsForChapter(6, "rupa_28").length).toBe(28);
    expect(getNaryItemsForChapter(6, "vibhaga_10").length).toBe(14);
    expect(getNaryItemsForChapter(6, "kalapa_21").length).toBe(21);
    expect(getNaryItemsForChapter(6, "pavatti_nibbana").length).toBe(10);
    expect(getNaryItemsForChapter(6, "rupa_laws").length).toBe(11);

    // 7) Chapter 7 covers summary + full granular Samuccaya (10+34 + 8+51 + 21+37 + 7+28 = 196)
    const ch7Items = getNaryItemsForChapter(7);
    expect(ch7Items.length).toBe(196);
    expect(getNaryItemsForChapter(7, "akusala_9").length).toBe(10);
    expect(getNaryItemsForChapter(7, "akusala_members").length).toBe(34);
    expect(getNaryItemsForChapter(7, "missaka_7").length).toBe(8);
    expect(getNaryItemsForChapter(7, "missaka_members").length).toBe(51);
    expect(getNaryItemsForChapter(7, "bodhipakkhiya_21").length).toBe(21);
    expect(getNaryItemsForChapter(7, "bodhi_37").length).toBe(37);
    expect(getNaryItemsForChapter(7, "sabba_7").length).toBe(7);
    expect(getNaryItemsForChapter(7, "sabba_members").length).toBe(28);

    // 8) Chapter 8 covers Paṭiccasamuppāda (18) + 24 Paṭṭhāna & 4 Samodhāna (28) + 18 Submodes/Atthapaññatti + Paññattibheda (8) = 72
    const ch8Items = getNaryItemsForChapter(8);
    expect(ch8Items.length).toBe(72);
    expect(getNaryItemsForChapter(8, "paticcasamuppada").length).toBe(18);
    expect(getNaryItemsForChapter(8, "patthana_24").length).toBe(28);
    expect(getNaryItemsForChapter(8, "patthana_submodes").length).toBe(18);
    expect(getNaryItemsForChapter(8, "pannatti_8").length).toBe(8);

    // 9) Chapter 9 covers 40 Samatha + 16 Carita/Vasitā/Abhiññā + 21 Vipassanā + 6 Ariya/Samāpatti + 23 Details = 106
    const ch9Items = getNaryItemsForChapter(9);
    expect(ch9Items.length).toBe(106);
    const sam40 = getNaryItemsForChapter(9, "samatha_40");
    expect(sam40.length).toBe(40);
    expect(sam40.filter((i) => i.switches.nimitta === 3).length).toBe(22); // AS IX.34 dvāvīsati
    expect(sam40.filter((i) => i.switches.reach === "upacara").length).toBe(10); // AS IX.19
    expect(getNaryItemsForChapter(9, "samatha_carita_abhinna").length).toBe(16);
    expect(getNaryItemsForChapter(9, "vipassana_visuddhi_nana").length).toBe(21);
    expect(getNaryItemsForChapter(9, "ariya_samapatti").length).toBe(6);
    expect(getNaryItemsForChapter(9, "kammatthana_details").length).toBe(23);

    // Verify all 9 chapters items return non-empty arrays
    for (let ch = 2; ch <= 9; ch++) {
      const items = getNaryItemsForChapter(ch as any);
      expect(items.length).toBeGreaterThan(0);
      for (const it of items) {
        expect(it.chapter).toBe(ch);
        expect(it.pali).toBeTruthy();
        expect(it.code).toBeTruthy();
        expect(it.switches).toBeDefined();
      }
    }
  });

  it("evaluates N-ary challenges and verifies state transitions across chapters 2 through 9", () => {
    const prog = createInitialProgress();

    // Chapter 2 Cetasika challenge
    const ch2Item = getNaryItemsForChapter(2)[0]!; // Phasso
    expect(ch2Item.pali).toBe("Phasso");
    const correctSwitches = { ...ch2Item.switches };
    const evalCorrect = evaluateNaryChallenge(ch2Item, correctSwitches);
    expect(evalCorrect.isCorrect).toBe(true);
    expect(evalCorrect.mismatchedKeys.length).toBe(0);

    const wrongSwitches = { ...ch2Item.switches, sampayoga: 89 };
    const evalWrong = evaluateNaryChallenge(ch2Item, wrongSwitches);
    expect(evalWrong.isCorrect).toBe(false);
    expect(evalWrong.mismatchedKeys).toContain("sampayoga");

    // Chapter 9 Kammaṭṭhāna challenge
    const ch9Item = getNaryItemsForChapter(9)[0]!;
    expect(ch9Item.chapter).toBe(9);
    const evalCh9 = evaluateNaryChallenge(ch9Item, ch9Item.switches);
    expect(evalCh9.isCorrect).toBe(true);

    // Pick next challenge returns items of that chapter
    const nextCh9 = pickNextNaryChapterChallenge(9, prog);
    expect(nextCh9.chapter).toBe(9);

    // Defaults exist for all chapters
    for (let ch = 2; ch <= 9; ch++) {
      const def = defaultNarySwitchesForChapter(ch as any);
      expect(Object.keys(def).length).toBeGreaterThan(0);
    }
  });

  it("renders the interactive 9-chapter bar, N-ary switchboards, real-time preview card, and catalogue loading in the UI", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "pt");
    ui.init();

    // Verify Chapter Bar is rendered
    const chapterBar = host.querySelector(".mnem-chapter-bar");
    expect(chapterBar).not.toBeNull();
    const chapterBtns = host.querySelectorAll<HTMLButtonElement>("[data-bin-chapter]");
    expect(chapterBtns.length).toBe(9);

    // 1) Initially on Chapter 1 (Citta Decoder)
    expect(chapterBtns[0]?.classList.contains("active")).toBe(true);
    expect(host.querySelector("#mnem-bin-mode-toggle")).not.toBeNull();

    // 2) Click Chapter 2 (Cetasika Decoder)
    chapterBtns[1]?.click();
    expect(host.querySelector(".mnem-chapter-btn.active")?.getAttribute("data-bin-chapter")).toBe("2");
    expect(host.textContent).toContain("Cetasikasaṅgaha");
    expect(host.textContent).toContain("13 Aññasamānā");

    // Switch buttons exist for chapter 2
    const naryKeyBtns = host.querySelectorAll<HTMLButtonElement>("[data-nary-key]");
    expect(naryKeyBtns.length).toBeGreaterThan(0);

    // Verify button exists
    const verifyBtn = host.querySelector<HTMLButtonElement>("#mnem-nary-verify");
    expect(verifyBtn).not.toBeNull();

    // Load an item from the chapter 2 catalogue
    const loadBtn = host.querySelector<HTMLButtonElement>("[data-nary-load-item]");
    expect(loadBtn).not.toBeNull();
    loadBtn?.click();

    // Click verify after loading item: should evaluate to exact match!
    verifyBtn?.click();
    expect(host.querySelector(".mnem-challenge-feedback.ok") || host.querySelector(".mnem-challenge-feedback")).not.toBeNull();

    // 3) Click Chapter 9 (Kammaṭṭhāna Decoder)
    chapterBtns[8]?.click();
    expect(host.querySelector(".mnem-chapter-btn.active")?.getAttribute("data-bin-chapter")).toBe("9");
    expect(host.textContent).toContain("Kammaṭṭhānasaṅgaha");
    expect(host.textContent).toContain("Samatha");

    // 4) Click back to Chapter 1
    const ch1Btn = host.querySelector<HTMLButtonElement>('[data-bin-chapter="1"]');
    ch1Btn?.click();
    expect(host.querySelector(".mnem-chapter-btn.active")?.getAttribute("data-bin-chapter")).toBe("1");
    expect(host.querySelector("#mnem-bin-mode-toggle")).not.toBeNull();
  });

  it("enforces N-ary terminology and strict multilingual purity across EN, PT, and ES without cross-language pollution", () => {
    // 1) Test English mode
    const hostEn = document.createElement("div");
    document.body.appendChild(hostEn);
    const uiEn = new MnemonicLabUI(hostEn, "en");
    uiEn.init();

    // Verify Tab and Challenge Button renamed to N-ary
    expect(hostEn.textContent).toContain("N-ary Decompressor");
    expect(hostEn.textContent).toContain("Challenge: N-ary Decoder");
    expect(hostEn.textContent).not.toContain("Binary Decompressor");
    expect(hostEn.textContent).not.toContain("Binary Decoder");

    // Click Chapter 2 in English mode
    const ch2BtnEn = hostEn.querySelectorAll<HTMLButtonElement>("[data-bin-chapter]")[1];
    ch2BtnEn?.click();

    const enText = hostEn.textContent ?? "";
    // English + Pāḷi only: must contain English terms
    expect(enText).toContain("Unwholesome");
    expect(enText).toContain("Ethically Variable");
    expect(enText).toContain("Group:");
    expect(enText).toContain("Subdivision:");
    expect(enText).toContain("Canonical Formula / Mnemonic Anchor:");
    expect(enText).toContain("Position #1");
    expect(enText).toContain("Load into Switches");

    // English mode MUST NOT contain Portuguese terms
    expect(enText).not.toContain("Insalubres");
    expect(enText).not.toContain("Neutros: 7+6");
    expect(enText).not.toContain("Subdivisão:");
    expect(enText).not.toContain("Fórmula Canônica / Âncora Mnêmica:");
    expect(enText).not.toContain("Posição #1");
    expect(enText).not.toContain("Carregar nas Chaves");
    expect(enText).not.toContain("Realidade Sintetizada pelas Chaves Atuais");

    // English mode MUST NOT contain Spanish terms
    expect(enText).not.toContain("Subdivisión:");
    expect(enText).not.toContain("Ancla Mnemónica:");
    expect(enText).not.toContain("Cargar en Interruptores");

    // 2) Test Portuguese mode
    const hostPt = document.createElement("div");
    document.body.appendChild(hostPt);
    const uiPt = new MnemonicLabUI(hostPt, "pt");
    uiPt.init();

    expect(hostPt.textContent).toContain("Descompactador N-ário");
    expect(hostPt.textContent).toContain("Desafio: Decodificador N-ário");
    expect(hostPt.textContent).not.toContain("Binary Decompressor");

    const ch2BtnPt = hostPt.querySelectorAll<HTMLButtonElement>("[data-bin-chapter]")[1];
    ch2BtnPt?.click();

    const ptText = hostPt.textContent ?? "";
    // Portuguese + Pāḷi only
    expect(ptText).toContain("Insalubres");
    expect(ptText).toContain("Neutros: 7+6");
    expect(ptText).toContain("Subdivisão:");
    expect(ptText).toContain("Fórmula Canônica / Âncora Mnêmica:");
    expect(ptText).toContain("Posição #1");
    expect(ptText).toContain("Carregar nas Chaves");

    // Portuguese mode MUST NOT contain English terms
    expect(ptText).not.toContain("Unwholesome: 4+3");
    expect(ptText).not.toContain("Ethically Variable: 7+6");
    expect(ptText).not.toContain("Subdivision:");
    expect(ptText).not.toContain("Canonical Formula / Mnemonic Anchor:");
    expect(ptText).not.toContain("Load into Switches");

    // 3) Test Spanish mode
    const hostEs = document.createElement("div");
    document.body.appendChild(hostEs);
    const uiEs = new MnemonicLabUI(hostEs, "es");
    uiEs.init();

    expect(hostEs.textContent).toContain("Descompresor N-ario");
    expect(hostEs.textContent).toContain("Desafío: Decodificador N-ario");
    expect(hostEs.textContent).not.toContain("Binary Decompressor");

    const ch2BtnEs = hostEs.querySelectorAll<HTMLButtonElement>("[data-bin-chapter]")[1];
    ch2BtnEs?.click();

    const esText = hostEs.textContent ?? "";
    // Spanish + Pāḷi only
    expect(esText).toContain("Inhábiles");
    expect(esText).toContain("Subdivisión:");
    expect(esText).toContain("Fórmula Canónica / Ancla Mnemónica:");
    expect(esText).toContain("Posición #1");
    expect(esText).toContain("Cargar en Interruptores");

    // Spanish mode MUST NOT contain Portuguese terms
    expect(esText).not.toContain("Insalubres: 4+3");
    expect(esText).not.toContain("Subdivisão:");
    expect(esText).not.toContain("Fórmula Canônica / Âncora Mnêmica:");
    expect(esText).not.toContain("Posição #1");
    expect(esText).not.toContain("Carregar nas Chaves");

    // Spanish mode MUST NOT contain English terms
    expect(esText).not.toContain("Unwholesome: 4+3");
    expect(esText).not.toContain("Ethically Variable: 7+6");
    expect(esText).not.toContain("Subdivision:");
    expect(esText).not.toContain("Load into Switches");
  });

  it("verifies doctrinal fidelity to Abhidhammatthasaṅgaha Mūla (Ch. 1–9) and engine invariants", () => {
    // 1) AS I.10: Kusala-vipāka Somanassa-santīraṇa (#26, 11 cetasikas) precedes Upekkhā-santīraṇa (#27, 10 cetasikas)
    const c26 = CANONICAL_CITTAS_89.find((c) => c.id === 26)!;
    const c27 = CANONICAL_CITTAS_89.find((c) => c.id === 27)!;
    expect(c26.bitVedana).toBe(1);
    expect(c26.totalSangahaCount).toBe(11);
    expect(c27.bitVedana).toBe(0);
    expect(c27.totalSangahaCount).toBe(10);

    // 2) AS III.70-71: Only Paṭhamamagga (Sotāpattimagga) depends exclusively on Hadayavatthu;
    //    the remaining 7 Lokuttara cittas (35 in 121-mode) are nissāya vā anissāya vā!
    const lok89 = CANONICAL_CITTAS_89.filter((c) => c.family === "lokuttara");
    expect(lok89.find((c) => c.jati === "kusala" && c.maggaStage === 1)?.vatthuPali).toBe("Hadayavatthu (ekantena)");
    for (const c of lok89.filter((x) => !(x.jati === "kusala" && x.maggaStage === 1))) {
      expect(c.vatthuPali).toBe("Hadayavatthu (nissāya vā anissāya vā)");
    }
    const lok121 = CANONICAL_CITTAS_121.filter((c) => c.family === "lokuttara");
    expect(lok121.filter((c) => c.vatthuPali === "Hadayavatthu (ekantena)").length).toBe(5);
    expect(lok121.filter((c) => c.vatthuPali === "Hadayavatthu (nissāya vā anissāya vā)").length).toBe(35);

    // 3) Pure Pāli metadata fields (zero Portuguese leakage in *Pali fields)
    for (const c of [...CANONICAL_CITTAS_89, ...CANONICAL_CITTAS_121]) {
      expect(c.kiccaPali ?? "").not.toMatch(/Corte de Kamma|Supramundano|fruição/i);
      expect(c.arammanaPali ?? "").not.toMatch(/exclusivo/i);
      expect(c.name.en).not.toMatch(/\b(1th|2th|3th)\b/);
      expect(c.formulaNote.en).not.toMatch(/\b(1th|2th|3th)\b/);
    }

    // 4) Engine 89-mode isolation: never leaks 121-mode cittas when mode === 89
    const lok89Res = resolveCittaFromSwitches(
      { ...defaultSwitchStateForFamily("lokuttara"), jati: "vipaka", maggaStage: 4, jhanaStage: 5 },
      89
    );
    expect(lok89Res?.id).toBe(89);

    // 5) AS II.40: In Kāmāvacara kusala, Virati + Appamaññā (all 5) are mutually exclusive with each other
    const mk1 = CANONICAL_CITTAS_89.find((c) => c.id === 31)!;
    const evalMixed = evaluateChemicalSynthesis(mk1, new Set([...mk1.fixedCetasikas, 47, 50])); // Sammā-vācā + Karuṇā
    expect(evalMixed.isValidConfiguration).toBe(true);
    expect(evalMixed.simultaneousOptionalNote).toBe(true);

    // 6) Spaced-repetition mastery key sync in pickNextNaryChapterChallenge (`nary:<id>`)
    let prog = createInitialProgress();
    const ch2 = getNaryItemsForChapter(2);
    for (const item of ch2.slice(0, 4)) {
      prog = recordMnemonicAttempt(prog, "binary", `nary:${item.id}`, true);
    }
    const nextCh2 = pickNextNaryChapterChallenge(2, prog);
    expect(prog.masteredBinary[`nary:${nextCh2.id}`] ?? 0).toBe(0);
  });

  it("guarantees every single N-ary item across Chapters 2–9 has a unique signature and is 100% solvable via UI controls", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "en");
    ui.init();

    for (let ch = 2; ch <= 9; ch++) {
      const items = getNaryItemsForChapter(ch as any);
      expect(items.length).toBeGreaterThan(0);

      // Verify uniqueness of switch signatures within each chapter
      const sigs = new Set<string>();
      for (const item of items) {
        const key = Object.entries(item.switches)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join("|");
        expect(sigs.has(key), `Duplicate switch signature in Ch.${ch} for ${item.id}: ${key}`).toBe(false);
        sigs.add(key);
      }

      // Verify every single item can be dialed strictly via rendered UI switch controls
      host.querySelector<HTMLButtonElement>(`[data-bin-chapter="${ch}"]`)!.click();
      const uiAny = ui as any;
      const s = uiAny.getStrings ? uiAny.getStrings() : {};
      let swState: Record<string, string | number> = { ...uiAny.narySwitches };
      const dialedGroups = new Set<string>();

      for (const item of items) {
        for (const [k, v] of Object.entries(item.switches)) {
          const switchboardHtml: string = uiAny.renderNarySwitchControls(ch, swState, s);
          const needle = `data-nary-key="${k}" data-nary-val="${String(v)}"`;
          expect(
            switchboardHtml.includes(needle),
            `Missing UI button in Ch.${ch} for ${item.id}: ${needle}`
          ).toBe(true);
          swState = uiAny.normalizeNarySwitches(ch, swState, k, v);
        }
        const resolved = items.find((it) =>
          Object.entries(it.switches).every(([ik, iv]) => String(swState[ik]) === String(iv))
        );
        expect(resolved?.id, `Switch state failed to resolve ${item.id} in Ch.${ch}`).toBe(item.id);

        // Also exercise full DOM button clicking + synthesized preview card for each primaryGroup
        const grpKey = `${ch}:${item.primaryGroup}`;
        if (!dialedGroups.has(grpKey)) {
          dialedGroups.add(grpKey);
          for (const [k, v] of Object.entries(item.switches)) {
            const btn = host.querySelector<HTMLButtonElement>(
              `[data-nary-key="${k}"][data-nary-val="${String(v)}"]`
            );
            expect(btn, `Missing DOM button in Ch.${ch} for ${item.id}: ${k}=${v}`).not.toBeNull();
            if (btn!.getAttribute("aria-pressed") !== "true") {
              btn!.click();
            }
          }
          expect(host.querySelector(".mnem-synthesized-card")?.textContent).toContain(item.code);
          swState = { ...uiAny.narySwitches };
        }
      }
    }
    host.remove();
  }, 150000);

  it("enforces strict single-language + Pāli purity across ALL 9 chapters, ALL 3 pillars, and error feedback in EN, PT, and ES", () => {
    const forbiddenByLang: Record<"en" | "pt" | "es", RegExp[]> = {
      en: [
        /\b(1º|2º|3º|4º|5º)\b/,
        /\b(1th|2th|3th)\b/,
        /\b(Insalubres|Salubre|Subdivisão|Posição|Carregar nas Chaves|Fórmula Canônica|Âncora Mnêmica|Corte de Kamma|Supramundano|fruição|exclusivo|Descompactador)\b/,
        /\b(Subdivisión|Posición|Cargar en Interruptores|Ancla Mnemónica|Inhábiles|Descompresor|Tétrada)\b/,
      ],
      pt: [
        /\b(1st|2nd|3rd|4th|5th)\b/,
        /\b(Tetrads|Adverting|Slot|Insight|Backup|Offline|Volúpia|Doutilidade|Transluecent)\b/,
        /\b(Unwholesome|Ethically Variable|Subdivision:|Load into Switches|Verify Encoding|Next Challenge)\b/,
        /\b(Subdivisión|Posición|Cargar en Interruptores|Ancla Mnemónica|Inhábiles|Descompresor)\b/,
      ],
      es: [
        /\b(1st|2nd|3rd|4th|5th)\b/,
        /\b(Tetrads|Adverting|Slot|Insight|Backup|Offline|Desejo)\b/,
        /\b(Unwholesome|Ethically Variable|Subdivision:|Load into Switches|Verify Encoding|Next Challenge)\b/,
        /\b(Insalubres|Subdivisão|Posição|Carregar nas Chaves|Fórmula Canônica|Âncora Mnêmica|Descompactador)\b/,
      ],
    };

    for (const lang of ["en", "pt", "es"] as const) {
      const host = document.createElement("div");
      document.body.appendChild(host);
      const ui = new MnemonicLabUI(host, lang);
      ui.init();

      const assertPure = (context: string) => {
        const txt = host.textContent ?? "";
        for (const rx of forbiddenByLang[lang]) {
          expect(txt, `Language leak (${lang}) in ${context}: matched ${rx}`).not.toMatch(rx);
        }
      };

      // Pillar 1 — Chapter 1 (Explore & Challenge across all families including Rūpāvacara & Lokuttara)
      assertPure("P1 Ch1 explore");
      for (const fam of ["lobha", "dosa", "moha", "ahetuka", "kamasobhana", "rupavacara", "arupavacara", "lokuttara"]) {
        host.querySelector<HTMLButtonElement>(`[data-bin-family="${fam}"]`)!.click();
        assertPure(`P1 Ch1 explore family=${fam}`);
      }
      host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')!.click();
      assertPure("P1 Ch1 challenge");
      host.querySelector<HTMLButtonElement>("#mnem-bin-verify")!.click();
      assertPure("P1 Ch1 challenge feedback");

      // Pillar 1 — Chapters 2 through 9 (including all submatrices & error feedback to ensure no raw English switch keys leak in PT/ES!)
      for (let ch = 2; ch <= 9; ch++) {
        host.querySelector<HTMLButtonElement>(`[data-bin-chapter="${ch}"]`)!.click();
        assertPure(`P1 Ch${ch} initial`);
        host.querySelector<HTMLButtonElement>("#mnem-nary-verify")!.click();
        assertPure(`P1 Ch${ch} verify feedback`);
        const smBtns = Array.from(host.querySelectorAll<HTMLButtonElement>("[data-nary-submatrix]"))
          .map((b) => b.dataset.narySubmatrix!)
          .filter((id) => id && id !== "all");
        for (const smId of smBtns) {
          host.querySelector<HTMLButtonElement>(`[data-nary-submatrix="${smId}"]`)!.click();
          assertPure(`P1 Ch${ch} submatrix=${smId}`);
          host.querySelector<HTMLButtonElement>("#mnem-nary-verify")!.click();
          assertPure(`P1 Ch${ch} submatrix=${smId} verify feedback`);
        }
      }

      // Pillar 2 — Periodic Table (Atlas & Alchemy)
      host.querySelector<HTMLButtonElement>("#mnem-tab-periodic")!.click();
      assertPure("P2 atlas");
      host.querySelector<HTMLButtonElement>('[data-per-mode="alchemy"]')!.click();
      assertPure("P2 alchemy");

      // Pillar 3 — Phalanx Abacus (all 5 maps & 3 modes)
      host.querySelector<HTMLButtonElement>("#mnem-tab-phalanx")!.click();
      assertPure("P3 open");
      host.querySelector<HTMLButtonElement>('[data-pha-mode="blind"]')!.click();
      assertPure("P3 blind");
      host.querySelector<HTMLButtonElement>('[data-pha-mode="sequence"]')!.click();
      assertPure("P3 sequence");

      host.remove();
    }
  }, 30000);

  it("cycles cleanly through distinct items on repeated Next Challenge without ping-pong loops", () => {
    const prog = createInitialProgress();

    // Chapters 2–9 across 'all' and every submatrix
    for (let ch = 2; ch <= 9; ch++) {
      const chNum = ch as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      const subIds = ["all", ...getSubmatricesForChapter(chNum).map((s) => s.id)];
      for (const smId of subIds) {
        const items = getNaryItemsForChapter(chNum, smId);
        const steps = Math.min(items.length, 8);
        const seen = new Set<string>();
        let cur: string | undefined;
        for (let i = 0; i < steps; i++) {
          const next = pickNextNaryChapterChallenge(chNum, prog, cur, smId);
          expect(next.id).not.toBe(cur);
          seen.add(next.id);
          cur = next.id;
        }
        expect(seen.size, `Ch${ch} sm=${smId} should cycle through ${steps} distinct items`).toBe(steps);
      }
    }

    // Chapter 1 Binary, Pillar 2 Periodic, Pillar 3 Phalanx
    let curCitta: number | undefined;
    const seenCitta = new Set<number>();
    for (let i = 0; i < 8; i++) {
      const next = pickNextBinaryChallenge(prog, "lobha", curCitta, 121);
      seenCitta.add(next.id);
      curCitta = next.id;
    }
    expect(seenCitta.size).toBe(8);

    let curChem: number | undefined;
    const seenChem = new Set<number>();
    for (let i = 0; i < 8; i++) {
      const next = pickNextPeriodicChallenge(prog, curChem);
      seenChem.add(next.id);
      curChem = next.id;
    }
    expect(seenChem.size).toBe(8);

    const mapSpec = getPhalanxMapById("akusala12");
    let curSlot: number | undefined;
    const seenSlot = new Set<number>();
    for (let i = 0; i < 8; i++) {
      const next = pickNextPhalanxSlot(prog, mapSpec, curSlot);
      seenSlot.add(next.index);
      curSlot = next.index;
    }
    expect(seenSlot.size).toBe(8);
  });

  it("formats all 767 N-ary group names and switch values with zero raw underscores or cross-chapter collisions", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "pt") as any;

    for (let ch = 2; ch <= 9; ch++) {
      const items = getNaryItemsForChapter(ch as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
      for (const it of items) {
        const g1 = ui.formatCanonicalGroupName(it.primaryGroup);
        const g2 = ui.formatCanonicalGroupName(it.secondaryGroup);
        expect(g1, `${it.id}.primaryGroup`).not.toMatch(/_/);
        expect(g2, `${it.id}.secondaryGroup`).not.toMatch(/_/);
        for (const [k, v] of Object.entries(it.switches)) {
          const valStr = ui.formatNaryParamVal(k, v);
          expect(valStr, `${it.id} ${k}=${v}`).not.toMatch(/_/);
          expect(valStr, `${it.id} ${k}=${v}`).not.toBe("Ripening");
        }
      }
    }

    // Specific cross-chapter disambiguation guards
    expect(ui.formatNaryParamVal("sub", "dosa")).toBe("Dosa-catukka");
    expect(ui.formatNaryParamVal("root", "dosa")).toBe("Dosa-mūla");
    expect(ui.formatNaryParamVal("carita", "dosa")).toBe("Dosacarita");
    expect(ui.formatNaryParamVal("kammaGroup", "ripening")).toBe("Vipāka-niyama");
    expect(ui.formatNaryParamVal("origin", "ahara")).toBe("Āhāra");

    host.remove();
  });

  it("handles Alchemy collision-only feedback without empty error boxes and protects completed Phalanx sequence", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "pt");
    ui.render();

    // Pillar 2 Alchemy: fill fixed core then add ONLY Thīna (#25) without Middha (#26) -> collision-only invalid state
    host.querySelector<HTMLButtonElement>("#mnem-tab-periodic")!.click();
    host.querySelector<HTMLButtonElement>('[data-per-mode="alchemy"]')!.click();
    host.querySelector<HTMLButtonElement>("#mnem-chem-hint")!.click();
    host.querySelector<HTMLButtonElement>('[data-chem-toggle="25"]')!.click();
    host.querySelector<HTMLButtonElement>("#mnem-chem-verify")!.click();
    const errBox = host.querySelector(".mnem-feedback-err");
    if (errBox) {
      expect((errBox.textContent ?? "").trim().length).toBeGreaterThan(0);
    }
    expect(host.querySelector(".mnem-collision-alert")).not.toBeNull();

    // Pillar 3 Phalanx Sequence: complete full 12-slot akusala12 sequence, then click again -> must NOT break streak
    host.querySelector<HTMLButtonElement>("#mnem-tab-phalanx")!.click();
    host.querySelector<HTMLButtonElement>('[data-pha-mode="sequence"]')!.click();
    for (let i = 1; i <= 12; i++) {
      host.querySelector<HTMLButtonElement>(`[data-phalanx-idx="${i}"]`)!.click();
    }
    expect(host.querySelector("#mnem-pha-restart-seq")).not.toBeNull();
    const attemptsBefore = Number(host.querySelectorAll(".mnem-stat-val")[3]?.textContent ?? "0");
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="1"]')!.click();
    const attemptsAfter = Number(host.querySelectorAll(".mnem-stat-val")[3]?.textContent ?? "0");
    expect(attemptsAfter).toBe(attemptsBefore);

    host.remove();
  });

  it("computes accurate global, N-ary 9-chapter, chapter, scope, alchemy, and phalanx progress metrics", () => {
    expect(computeProgressMetric(0, 888)).toEqual({ mastered: 0, total: 888, percent: 0 });
    expect(computeProgressMetric(1, 888)).toEqual({ mastered: 1, total: 888, percent: 0.1 });
    expect(computeProgressMetric(887, 888)).toEqual({ mastered: 887, total: 888, percent: 99.9 });
    expect(computeProgressMetric(888, 888)).toEqual({ mastered: 888, total: 888, percent: 100 });
    expect(computeProgressMetric(950, 888)).toEqual({ mastered: 888, total: 888, percent: 100 });

    let prog = createInitialProgress();
    const empty121 = computeMnemonicProgressSummary(prog, 121);
    expect(empty121.naryGlobal).toEqual({ mastered: 0, total: 888, percent: 0 });
    expect(empty121.periodic).toEqual({ mastered: 0, total: 27, percent: 0 });
    expect(empty121.phalanx).toEqual({ mastered: 0, total: 76, percent: 0 });
    expect(empty121.overall).toEqual({ mastered: 0, total: 991, percent: 0 });
    expect(empty121.naryChaptersCompleted).toBe(0);

    const empty89 = computeMnemonicProgressSummary(prog, 89);
    expect(empty89.naryGlobal).toEqual({ mastered: 0, total: 856, percent: 0 });
    expect(empty89.overall).toEqual({ mastered: 0, total: 959, percent: 0 });

    // Master 1 Lobha citta (#1), 1 Vitthāra-only citta (#105), 1 Ch.2 item, 1 Alchemy citta, and 1 Phalanx slot
    prog = recordMnemonicAttempt(prog, "binary", "citta:1", true);
    prog = recordMnemonicAttempt(prog, "binary", "citta:105", true);
    const ch2First = getNaryItemsForChapter(2)[0]!;
    prog = recordMnemonicAttempt(prog, "binary", `nary:${ch2First.id}`, true);
    prog = recordMnemonicAttempt(prog, "periodic", "chem:1", true);
    prog = recordMnemonicAttempt(prog, "phalanx", "akusala12:1", true);

    const s121 = computeMnemonicProgressSummary(prog, 121);
    expect(s121.chapters[1].mastered).toBe(2);
    expect(s121.chapters[2].mastered).toBe(1);
    expect(s121.naryGlobal).toEqual({ mastered: 3, total: 888, percent: 0.3 });
    expect(s121.naryByLevel[1]).toEqual({ mastered: 3, total: 888, percent: 0.3 });
    expect(s121.naryByLevel[2]).toEqual({ mastered: 0, total: 888, percent: 0 });
    expect(s121.naryByLevel[3]).toEqual({ mastered: 0, total: 888, percent: 0 });
    expect(s121.periodic).toEqual({ mastered: 1, total: 27, percent: 3.7 });
    expect(s121.phalanx).toEqual({ mastered: 1, total: 76, percent: 1.3 });
    expect(s121.overall).toEqual({ mastered: 5, total: 991, percent: 0.5 });

    // In 89-mode, citta:105 is excluded so Ch.1 mastered is 1/89 (never exceeds pool)
    const s89 = computeMnemonicProgressSummary(prog, 89);
    expect(s89.chapters[1].mastered).toBe(1);
    expect(s89.chapters[1].total).toBe(89);
    expect(s89.naryGlobal.mastered).toBe(2);
    expect(s89.naryGlobal.total).toBe(856);

    // Scope metric: Lobha has 1/8 = 12.5%
    expect(computeChapterScopeProgress(prog, 1, "lobha", 121)).toEqual({ mastered: 1, total: 8, percent: 12.5 });
  });

  it("renders live localized global & N-ary Decoder progress bars across EN, PT, and ES as challenges advance", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "en");
    ui.init();

    // Initial 0% global lab & global N-ary progress in English
    const globalMeterEn = host.querySelector('[data-progress-role="global-lab"]')!;
    const naryGlobalEn = host.querySelector('[data-progress-role="nary-global"]')!;
    expect(globalMeterEn.textContent).toContain("Global Lab Progress");
    expect(globalMeterEn.textContent).toContain("0%");
    expect(globalMeterEn.textContent).toContain("(0/991)");
    expect(naryGlobalEn.textContent).toContain("Global Progress — N-ary Decoder (9 Chapters)");
    expect(naryGlobalEn.textContent).toContain("(0/888)");
    expect(naryGlobalEn.querySelector("progress")?.getAttribute("value")).toBe("0");
    expect(naryGlobalEn.querySelector("progress")?.getAttribute("max")).toBe("888");
    // Native <progress> must have zero fallback inner text per modern-web-guidance
    expect(naryGlobalEn.querySelector("progress")?.textContent).toBe("");

    // Switch to Chapter 1 Challenge: N-ary Decoder and solve Citta #1 (default Lobha [1,1,1] matches target #1)
    host.querySelector<HTMLButtonElement>('[data-bin-mode="challenge"]')!.click();
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("Ch. 1 Progress");
    expect(host.querySelector('[data-progress-role="nary-challenge-global"]')?.textContent).toContain("Global (9 Ch.)");

    host.querySelector<HTMLButtonElement>("#mnem-bin-verify")!.click();
    expect(host.querySelector(".mnem-feedback-ok")).not.toBeNull();

    // After mastering 1 challenge: N-ary global advances to 0.1% (1/888) and Lab global to 0.1% (1/991)
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("0.1%");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("(1/888)");
    expect(host.querySelector('[data-progress-role="nary-global"] progress')?.getAttribute("value")).toBe("1");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("0.1%");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("(1/991)");
    expect(host.querySelector('[data-bin-chapter="1"] .mnem-chapter-btn-lbl')?.textContent).toBe("1. Cittas (121)");
    expect(host.querySelector('[data-bin-chapter="1"] .mnem-chapter-btn-prog')?.textContent).toContain("1/121 · 0.8%");

    // Toggle to 89-mode: Ch. 1 button label & denominators update cleanly (89 / 856 / 959)
    host.querySelector<HTMLButtonElement>("#mnem-bin-mode-toggle")!.click();
    expect(host.querySelector('[data-bin-chapter="1"] .mnem-chapter-btn-lbl')?.textContent).toBe("1. Cittas (89)");
    expect(host.querySelector('[data-bin-chapter="1"] .mnem-chapter-btn-prog')?.textContent).toContain("1/89 · 1.1%");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("(1/856)");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("(1/959)");
    host.querySelector<HTMLButtonElement>("#mnem-bin-mode-toggle")!.click();

    // Advance to Chapter 2 N-ary Decoder and load the active target item into switches, then verify
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="2"]')!.click();
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("Ch. 2 Progress");
    const ch2TargetLoadBtn = host.querySelector<HTMLButtonElement>(".mnem-matrix-cell.target-family [data-nary-load-item]")!;
    expect(ch2TargetLoadBtn).not.toBeNull();
    ch2TargetLoadBtn.click();
    host.querySelector<HTMLButtonElement>("#mnem-nary-verify")!.click();
    expect(host.querySelector(".mnem-challenge-feedback.ok")).not.toBeNull();

    // Now 2/888 = 0.2% globally in N-ary Decoder, 1/97 = 1% in Chapter 2
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("0.2%");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("(2/888)");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("1%");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("(1/97)");
    expect(host.querySelector('[data-bin-chapter="2"] .mnem-chapter-btn-prog')?.textContent).toContain("1/97 · 1%");

    // Switch language to Portuguese: localized labels + comma decimal separator (0,2% / 1%)
    ui.setLang("pt");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("Progresso Global do Laboratório");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("Avanço Global — Decodificador N-ário (9 Capítulos)");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("0,2%");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("Avanço do Cap. 2");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("1%");

    // Switch language to Spanish: localized labels + comma decimal separator (0,2% / 1%)
    ui.setLang("es");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("Progreso Global del Laboratorio");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("Avance Global — Decodificador N-ario (9 Capítulos)");
    expect(host.querySelector('[data-progress-role="nary-global"]')?.textContent).toContain("0,2%");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("Avance del Cap. 2");
    expect(host.querySelector('[data-progress-role="nary-chapter"]')?.textContent).toContain("1%");

    // Verify Pillar 2 Alchemy & Pillar 3 Phalanx progress bars render and advance
    ui.setLang("en");
    host.querySelector<HTMLButtonElement>("#mnem-tab-periodic")!.click();
    host.querySelector<HTMLButtonElement>('[data-per-mode="alchemy"]')!.click();
    expect(host.querySelector('[data-progress-role="alchemy"]')?.textContent).toContain("Alchemy Progress");
    expect(host.querySelector('[data-progress-role="alchemy"]')?.textContent).toContain("(0/27)");
    host.querySelector<HTMLButtonElement>("#mnem-chem-hint")!.click();
    host.querySelector<HTMLButtonElement>("#mnem-chem-verify")!.click();
    expect(host.querySelector('[data-progress-role="alchemy"]')?.textContent).toContain("3.7%");
    expect(host.querySelector('[data-progress-role="alchemy"]')?.textContent).toContain("(1/27)");

    host.querySelector<HTMLButtonElement>("#mnem-tab-phalanx")!.click();
    expect(host.querySelector('[data-progress-role="phalanx-map"]')?.textContent).toContain("Current Map Progress");
    expect(host.querySelector('[data-progress-role="phalanx-global"]')?.textContent).toContain("All 5 Maps Global");
    host.querySelector<HTMLButtonElement>('[data-pha-mode="sequence"]')!.click();
    host.querySelector<HTMLButtonElement>('[data-phalanx-idx="1"]')!.click();
    expect(host.querySelector('[data-progress-role="phalanx-map"]')?.textContent).toContain("8.3%");
    expect(host.querySelector('[data-progress-role="phalanx-map"]')?.textContent).toContain("(1/12)");
    expect(host.querySelector('[data-progress-role="phalanx-global"]')?.textContent).toContain("1.3%");
    expect(host.querySelector('[data-progress-role="phalanx-global"]')?.textContent).toContain("(1/76)");
    expect(host.querySelector('[data-progress-role="global-lab"]')?.textContent).toContain("(4/991)");

    host.remove();
  });

  it("enforces genuine Rigor Levels 1 / 2 / 3 (anti-spoiler, collapsible accordion, Pāli blind mode, 24 Paṭṭhāna un-filtered, and 3-level seals)", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "pt");
    ui.init();

    // 3 clickable level seals rendered
    expect(host.querySelectorAll(".mnem-level-seal").length).toBe(3);

    // Go to Chapter 2
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="2"]')!.click();
    // Level 1: formula anchor & open catalogue visible, spoiler label visible on Sampayoga switch
    expect(host.querySelector(".mnem-rel-eradication-box")).not.toBeNull();
    expect(host.querySelector(".mnem-catalogue-details")).toBeNull();
    expect(host.textContent).toContain("110 (Adhimokkha)");

    // Switch to Level 2 via clickable seal
    host.querySelector<HTMLButtonElement>('[data-set-level="2"]')!.click();
    expect(host.querySelector(".mnem-rigor-cue-banner")).not.toBeNull();
    expect(host.querySelector(".mnem-rel-eradication-box")).toBeNull();
    // Switch labels must be spoiler-free on Level 2!
    expect(host.textContent).not.toContain("110 (Adhimokkha)");
    // Collapsible <details> catalogue is closed by default and contains NO heading inside <summary>
    const details = host.querySelector<HTMLDetailsElement>("details.mnem-catalogue-details");
    expect(details).not.toBeNull();
    expect(details!.open).toBe(false);
    expect(details!.querySelector("summary h1, summary h2, summary h3, summary h4")).toBeNull();
    // Zero .target-family spoiler on Level 2
    expect(host.querySelector(".mnem-matrix-cell.target-family")).toBeNull();

    // Switch to Level 3 (Hard / Blind Pāli)
    host.querySelector<HTMLButtonElement>('[data-set-level="3"]')!.click();
    expect(host.querySelector(".mnem-synth-masked")).not.toBeNull();
    expect(host.querySelector(".mnem-matrix-section")).toBeNull(); // Catalogue completely hidden before Verify

    // Check Chapter 8 Paṭṭhāna on Level 3: all 24 conditions must be selectable (no directional pre-filter!)
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="8"]')!.click();
    host.querySelector<HTMLButtonElement>('[data-nary-key="method"][data-nary-val="patthana_24"]')!.click();
    expect(host.querySelectorAll('[data-nary-key="index"]').length).toBe(24);

    // Verify reveals feedback + records Level 3 mastery separately from Level 1/2
    host.querySelector<HTMLButtonElement>("#mnem-nary-verify")!.click();
    expect(host.querySelector(".mnem-challenge-feedback")).not.toBeNull();
    expect(host.querySelector(".mnem-synth-masked")).toBeNull();

    // Adaptive SRS queue: verify missedQueue re-surfaces missed item on odd totalAttempts
    let prog = createInitialProgress();
    const ch3 = getNaryItemsForChapter(3);
    const first = ch3[0]!;
    const second = ch3[1]!;
    prog = recordMnemonicAttempt(prog, "binary", `nary:${first.id}`, false);
    expect(prog.missedQueue).toContain(`nary:${first.id}`);
    // totalAttempts === 1 (odd) and currentItemId !== first.id -> SRS returns first!
    expect(pickNextNaryChapterChallenge(3, prog, second.id).id).toBe(first.id);
    // Solving it clears it from missedQueue
    prog = recordMnemonicAttempt(prog, "binary", `nary:${first.id}`, true);
    expect(prog.missedQueue).not.toContain(`nary:${first.id}`);

    host.remove();
  });

  it("supports Reverse Decoding (Ch. 1–9) and Prologue & Cross-Chapter Synthesis (32 Mūla items) across PT, EN, and ES", () => {
    expect(MULA_SYNTHESIS_ITEMS.length).toBe(32);
    expect(SYNTHESIS_AXIS_META.length).toBe(4);

    const host = document.createElement("div");
    document.body.appendChild(host);
    const ui = new MnemonicLabUI(host, "en");
    ui.init();

    // 1) Reverse Decoding on Chapter 1 (Level 1 -> 4 choices, Level 3 -> 6 Pāli-only choices)
    host.querySelector<HTMLButtonElement>('[data-nary-drill="reverse"]')!.click();
    expect(host.querySelector(".mnem-reverse-vector-card")).not.toBeNull();
    expect(host.querySelectorAll("[data-reverse-choice]").length).toBe(4);
    host.querySelector<HTMLButtonElement>('[data-set-level="3"]')!.click();
    expect(host.querySelectorAll("[data-reverse-choice]").length).toBe(6);
    expect(host.querySelector(".mnem-choice-name")).toBeNull();
    host.querySelector<HTMLButtonElement>("[data-reverse-choice]")!.click();
    expect(host.querySelector(".mnem-challenge-feedback")).not.toBeNull();

    // Reverse Decoding on Chapter 7
    host.querySelector<HTMLButtonElement>('[data-bin-chapter="7"]')!.click();
    expect(host.querySelector(".mnem-reverse-vector-card")).not.toBeNull();
    expect(host.querySelectorAll("[data-reverse-choice]").length).toBe(6);

    // 2) Prologue & Cross-Chapter Synthesis mode
    host.querySelector<HTMLButtonElement>('[data-set-level="1"]')!.click();
    host.querySelector<HTMLButtonElement>('[data-nary-drill="synthesis"]')!.click();
    expect(host.querySelector('[data-progress-role="nary-synthesis"]')?.textContent).toContain("(0/32)");
    expect(host.querySelectorAll("[data-syn-axis]").length).toBe(5); // all + 4 axes
    expect(host.querySelectorAll("[data-syn-choice]").length).toBe(4);
    host.querySelector<HTMLButtonElement>("[data-syn-choice]")!.click();
    expect(host.querySelector(".mnem-challenge-feedback")).not.toBeNull();
    expect(host.querySelector(".mnem-chapter-jump-chip")).not.toBeNull();

    // Verify trilingual localization in PT & ES on Synthesis mode
    ui.setLang("pt");
    expect(host.textContent).toContain("Avanço em Prólogo & Síntese");
    ui.setLang("es");
    expect(host.textContent).toContain("Avance en Prólogo y Síntesis");

    host.remove();
  });
});
