"""Extra high-leverage memorization cards for the Abhidhammatthasaṅgaha Mūla:
- Checksum (arithmetic decomposition) cards
- Production Enumeration cards (with structured checklists)
- Sequence Ordering cards (with canonical ordered items)
- Confusable Contrast / Interleaving cards
"""

from __future__ import annotations

LANGS = ("pt", "en", "es")


def T(pt: str, en: str, es: str) -> dict[str, str]:
    return {"pt": pt, "en": en, "es": es}


def P(text: str) -> dict[str, str]:
    return {lang: text for lang in LANGS}


def _card(
    cid: str,
    chapter: int,
    axis: str,
    tier: str,
    mode: str,
    requires: list[str],
    pali: str | dict[str, str],
    cat: dict[str, str],
    prompt: dict[str, str],
    answer: dict[str, str],
    src: dict,
    *,
    mechanics: dict[str, str] | None = None,
    checklist: list[dict[str, str]] | None = None,
    sequence_items: list[dict[str, str]] | None = None,
) -> dict:
    c: dict = {
        "id": cid,
        "chapter": chapter,
        "axis": axis,
        "tier": tier,
        "mode": mode,
        "requires": requires,
        "paliTerm": P(pali) if isinstance(pali, str) else pali,
        "categoryLabel": cat,
        "prompt": prompt,
        "answer": answer,
        "source": src,
    }
    if mechanics is not None:
        c["mechanics"] = mechanics
    if checklist is not None:
        c["checklist"] = checklist
    if sequence_items is not None:
        c["sequenceItems"] = sequence_items
    return c


def build_cards() -> list[dict]:
    CAT_CHK = T("Esqueleto Numérico · Checksum", "Numerical Skeleton · Checksum", "Esqueleto Numérico · Checksum")
    CAT_ENUM = T("Produção · Enumeração", "Production · Enumeration", "Producción · Enumeración")
    CAT_SEQ = T("Produção · Sequência Ordenada", "Production · Ordered Sequence", "Producción · Secuencia Ordenada")
    CAT_CONF = T("Discriminação · Confundíveis", "Discrimination · Confusables", "Discriminación · Confundibles")

    cards: list[dict] = []

    # ══════════════════════════════════════════════════════════════════════════
    # 1. CHECKSUM / ARITHMETIC DECOMPOSITION CARDS
    # ══════════════════════════════════════════════════════════════════════════
    cards.extend([
        _card(
            "c0.chk_paramattha_4", 0, "paramattha", "structure", "checksum",
            ["c0.citta_atom", "c0.cetasika_atom", "c0.rupa_atom", "c0.nibbana_atom"],
            "4 = 3 Saṅkhata + 1 Asaṅkhata",
            CAT_CHK,
            T("Decomponha o checksum dos 4 Paramatthas: quantos são condicionados (saṅkhata), quantos são mentais (nāma) e qual é incondicionado?",
              "Decompose the checksum of the 4 Paramatthas: how many are conditioned (saṅkhata), how many are mental (nāma), and which is unconditioned?",
              "Descomponga el checksum de los 4 Paramatthas: ¿cuántos son condicionados (saṅkhata), cuántos son mentales (nāma) y cuál es incondicionado?"),
            T("4 = 3 condicionados (Citta, Cetasika, Rūpa) + 1 incondicionado (Nibbāna). Na divisão mente/matéria: 2 mentais condicionados (Citta + Cetasika) + 1 matéria (Rūpa) + 1 Nibbāna (arūpa/nāma incondicionado).",
              "4 = 3 conditioned (Citta, Cetasika, Rūpa) + 1 unconditioned (Nibbāna). By mind/matter: 2 conditioned mental (Citta + Cetasika) + 1 matter (Rūpa) + 1 Nibbāna (unconditioned non-material).",
              "4 = 3 condicionados (Citta, Cetasika, Rūpa) + 1 incondicionado (Nibbāna). Por mente/materia: 2 mentales condicionados (Citta + Cetasika) + 1 materia (Rūpa) + 1 Nibbāna (incondicionado)."),
            {"as": "I.2", "cma": "I §2", "segId": 7},
        ),
        _card(
            "c1.chk_89_planes", 1, "citta", "structure", "checksum",
            ["c1.struct_kamavacara_54", "c1.struct_mahaggata_27", "c1.struct_lokuttara_nibbana_object"],
            "89 = 54 + 15 + 12 + 8",
            CAT_CHK,
            T("Checksum dos 89 Cittas por plano (bhūmi): qual é a soma exata das 4 esferas e como os 54 kāmāvacara se subdividem?",
              "Checksum of the 89 Cittas by plane (bhūmi): what is the exact sum of the 4 spheres and how do the 54 kāmāvacara subdivide?",
              "Checksum de los 89 Cittas por plano (bhūmi): ¿cuál es la suma exacta de las 4 esferas y cómo se subdividen los 54 kāmāvacara?"),
            T("89 = 54 kāmāvacara + 15 rūpāvacara + 12 arūpāvacara + 8 lokuttara. Os 54 kāmāvacara = 12 akusala (8+2+2) + 18 ahetuka (7+8+3) + 24 sobhana (8+8+8).",
              "89 = 54 kāmāvacara + 15 rūpāvacara + 12 arūpāvacara + 8 lokuttara. The 54 kāmāvacara = 12 akusala (8+2+2) + 18 ahetuka (7+8+3) + 24 sobhana (8+8+8).",
              "89 = 54 kāmāvacara + 15 rūpāvacara + 12 arūpāvacara + 8 lokuttara. Los 54 kāmāvacara = 12 akusala (8+2+2) + 18 ahetuka (7+8+3) + 24 sobhana (8+8+8)."),
            {"as": "I.36", "cma": "I §30", "segId": 61},
        ),
        _card(
            "c1.chk_121_expansion", 1, "citta", "house", "checksum",
            ["c1.house_121_expansion"],
            "121 = 89 + 32 (8 → 40)",
            CAT_CHK,
            T("Checksum da expansão 89 → 121 Cittas: por que se somam exatamente 32 e qual é a decomposição por classe (jāti) nos 89 e nos 121?",
              "Checksum of the 89 → 121 Cittas expansion: why are exactly 32 added, and what is the class (jāti) breakdown in 89 and in 121?",
              "Checksum de la expansión 89 → 121 Cittas: ¿por qué se suman exactamente 32 y cuál es el desglose por clase (jāti) en 89 y en 121?"),
            T("Cada um dos 8 lokuttara desdobra-se em 5 jhānas (8×5 = 40; +32). Por classe (89): 12 akusala + 21 kusala + 36 vipāka + 20 kiriya = 89. Em 121: 12 akusala + 37 kusala + 52 vipāka + 20 kiriya = 121.",
              "Each of the 8 lokuttara expands across 5 jhānas (8×5 = 40; +32). By class (89): 12 akusala + 21 kusala + 36 vipāka + 20 kiriya = 89. In 121: 12 akusala + 37 kusala + 52 vipāka + 20 kiriya = 121.",
              "Cada uno de los 8 lokuttara se desdobla en 5 jhānas (8×5 = 40; +32). Por clase (89): 12 akusala + 21 kusala + 36 vipāka + 20 kiriya = 89. En 121: 12 akusala + 37 kusala + 52 vipāka + 20 kiriya = 121."),
            {"as": "I.35", "cma": "I §31", "segId": 59},
        ),
        _card(
            "c2.chk_52_cetasikas", 2, "cetasika", "structure", "checksum",
            ["c2.struct_annasamana_13", "c2.struct_akusala_14"],
            "52 = 7 + 6 + 14 + 25",
            CAT_CHK,
            T("Checksum dos 52 Cetasikas: decomponha os 3 grandes blocos e todos os seus subgrupos numéricos até fechar 52.",
              "Checksum of the 52 Cetasikas: decompose the 3 major blocks and every numeric subgroup until they sum to 52.",
              "Checksum de los 52 Cetasikas: descomponga los 3 grandes bloques y todos sus subgrupos numéricos hasta sumar 52."),
            T("52 = 13 aññasamāna (7 universais + 6 ocasionais) + 14 akusala (4 moha + 3 lobha + 4 dosa + 2 thīna-middha + 1 vicikicchā) + 25 sobhana (19 universais belos [7 + 6 pares] + 3 virati + 2 appamaññā + 1 paññā).",
              "52 = 13 aññasamāna (7 universals + 6 occasionals) + 14 akusala (4 moha + 3 lobha + 4 dosa + 2 thīna-middha + 1 vicikicchā) + 25 sobhana (19 beautiful universals [7 + 6 pairs] + 3 virati + 2 appamaññā + 1 paññā).",
              "52 = 13 aññasamāna (7 universales + 6 ocasionales) + 14 akusala (4 moha + 3 lobha + 4 dosa + 2 thīna-middha + 1 vicikicchā) + 25 sobhana (19 bellos universales [7 + 6 pares] + 3 virati + 2 appamaññā + 1 paññā)."),
            {"as": "II.7", "cma": "II §8", "segId": 95},
        ),
        _card(
            "c3.chk_pakinnaka_grids", 3, "pakinnaka", "structure", "checksum",
            ["c3.struct_vedana_5", "c3.struct_hetu_distribution"],
            "5 · 6 · 14 · 6 · 6 · 6",
            CAT_CHK,
            T("Checksum das 6 grelhas do Cap. 3 (Pakiṇṇaka): quais são os números exatos de Vedanā, Hetu, Kicca, Dvāra, Ārammaṇa e Vatthu — e como os 89 cittas fecham por raízes (0, 1, 2, 3)?",
              "Checksum of the 6 grids of Ch. 3 (Pakiṇṇaka): what are the exact counts of Vedanā, Hetu, Kicca, Dvāra, Ārammaṇa, and Vatthu — and how do the 89 cittas sum by roots (0, 1, 2, 3)?",
              "Checksum de las 6 grillas del Cap. 3 (Pakiṇṇaka): ¿cuáles son los números exactos de Vedanā, Hetu, Kicca, Dvāra, Ārammaṇa y Vatthu, y cómo suman los 89 cittas por raíces (0, 1, 2, 3)?"),
            T("5 vedanās · 6 hetus · 14 kiccas (em 10 lugares/ṭhāna) · 6 dvāras · 6 ārammaṇas · 6 vatthus. Por raízes nos 89 cittas: 18 ahetuka (0) + 2 ekahetuka (1) + 22 dvihetuka (2) + 47 tihetuka (3) = 89.",
              "5 vedanās · 6 hetus · 14 kiccas (at 10 stages/ṭhāna) · 6 dvāras · 6 ārammaṇas · 6 vatthus. By roots in 89 cittas: 18 ahetuka (0) + 2 ekahetuka (1) + 22 dvihetuka (2) + 47 tihetuka (3) = 89.",
              "5 vedanās · 6 hetus · 14 kiccas (en 10 etapas/ṭhāna) · 6 dvāras · 6 ārammaṇas · 6 vatthus. Por raíces en 89 cittas: 18 ahetuka (0) + 2 ekahetuka (1) + 22 dvihetuka (2) + 47 tihetuka (3) = 89."),
            {"as": "III.15", "cma": "III §7", "segId": 199},
        ),
        _card(
            "c4.chk_vithi_17", 4, "vithi", "structure", "checksum",
            ["c4.vithi_16_17_tadarammana"],
            "17 = 3 Bhavaṅga + 5 Porta + 7 Javana + 2 Tadārammaṇa",
            CAT_CHK,
            T("Checksum dos 17 momentos (cittakkhaṇas) do processo sensorial muito grande (atimahanta): como os 17 momentos somam exato e quantos sub-instantes (khaṇas) correspondem a 1 rūpa?",
              "Checksum of the 17 moments (cittakkhaṇas) of a very great (atimahanta) five-door process: how do the 17 moments add up, and how many sub-instants (khaṇas) equal 1 rūpa?",
              "Checksum de los 17 momentos (cittakkhaṇas) del proceso sensorial muy grande (atimahanta): ¿cómo suman los 17 momentos y cuántos sub-instantes (khaṇas) equivalen a 1 rūpa?"),
            T("17 = 1 atīta-bhavaṅga + 1 bhavaṅga-calana + 1 bhavaṅgupaccheda + 1 pañcadvārāvajjana + 1 pañcaviññāṇa + 1 sampaṭicchana + 1 santīraṇa + 1 voṭṭhabbana + 7 javana + 2 tadārammaṇa. 17 × 3 = 51 sub-instantes (uppāda, ṭhiti, bhaṅga).",
              "17 = 1 atīta-bhavaṅga + 1 bhavaṅga-calana + 1 bhavaṅgupaccheda + 1 pañcadvārāvajjana + 1 pañcaviññāṇa + 1 sampaṭicchana + 1 santīraṇa + 1 voṭṭhabbana + 7 javana + 2 tadārammaṇa. 17 × 3 = 51 sub-instants (uppāda, ṭhiti, bhaṅga).",
              "17 = 1 atīta-bhavaṅga + 1 bhavaṅga-calana + 1 bhavaṅgupaccheda + 1 pañcadvārāvajjana + 1 pañcaviññāṇa + 1 sampaṭicchana + 1 santīraṇa + 1 voṭṭhabbana + 7 javana + 2 tadārammaṇa. 17 × 3 = 51 sub-instantes (uppāda, ṭhiti, bhaṅga)."),
            {"as": "IV.6", "cma": "IV §8", "segId": 286},
        ),
        _card(
            "c5.chk_31_planes_19_patisandhi", 5, "vithimutta", "structure", "checksum",
            ["c5.bhumi_apaya", "c5.bhumi_kamasugati", "c5.bhumi_rupa_arupa"],
            "31 = 11 + 16 + 4 · 19 Paṭisandhi",
            CAT_CHK,
            T("Checksum do Cap. 5: como somam os 31 planos de existência, os 19 cittas de religação (paṭisandhi) e as 16 classes de kamma?",
              "Checksum of Ch. 5: how do the 31 planes of existence, the 19 rebirth-linking (paṭisandhi) cittas, and the 16 classes of kamma sum up?",
              "Checksum del Cap. 5: ¿cómo suman los 31 planos de existencia, los 19 cittas de reconexión (paṭisandhi) y las 16 clases de kamma?"),
            T("31 planos = 11 kāma (4 apāya + 1 humano + 6 devas) + 16 rūpa (3+3+3+7) + 4 arūpa. 19 paṭisandhi = 2 santīraṇa + 8 mahāvipāka + 5 rūpa-vipāka + 4 arūpa-vipāka. 16 kammas = 4 tétrades (função, prioridade, tempo, local).",
              "31 planes = 11 kāma (4 apāya + 1 human + 6 devas) + 16 rūpa (3+3+3+7) + 4 arūpa. 19 paṭisandhi = 2 santīraṇa + 8 mahāvipāka + 5 rūpa-vipāka + 4 arūpa-vipāka. 16 kammas = 4 tetrads (function, priority, time, place).",
              "31 planos = 11 kāma (4 apāya + 1 humano + 6 devas) + 16 rūpa (3+3+3+7) + 4 arūpa. 19 paṭisandhi = 2 santīraṇa + 8 mahāvipāka + 5 rūpa-vipāka + 4 arūpa-vipāka. 16 kammas = 4 tétradas (función, prioridad, tiempo, lugar)."),
            {"as": "V.8", "cma": "V §8", "segId": 374},
        ),
        _card(
            "c6.chk_28_rupas_21_kalapas", 6, "rupa", "structure", "checksum",
            ["c6.rupa_samutthana_4"],
            "28 = 18 + 10 · 21 = 9 + 6 + 4 + 2",
            CAT_CHK,
            T("Checksum do Cap. 6: decomponha os 28 Rūpas (concretos e não-concretos) e os 21 Kalāpas por origem (samuṭṭhāna).",
              "Checksum of Ch. 6: decompose the 28 Rūpas (concrete and non-concrete) and the 21 Kalāpas by origin (samuṭṭhāna).",
              "Checksum del Cap. 6: descomponga los 28 Rūpas (concretos y no concretos) y los 21 Kalāpas por origen (samuṭṭhāna)."),
            T("28 rūpas = 18 nipphanna (4 mahābhūta + 5 pasāda + 4 gocara + 2 bhāva + 1 hadaya + 1 jīvita + 1 āhāra) + 10 anipphanna (1 pariccheda + 2 viññatti + 3 vikāra + 4 lakkhaṇa). 21 kalāpas = 9 kammaja + 6 cittaja + 4 utuja + 2 āhāraja.",
              "28 rūpas = 18 nipphanna (4 mahābhūta + 5 pasāda + 4 gocara + 2 bhāva + 1 hadaya + 1 jīvita + 1 āhāra) + 10 anipphanna (1 pariccheda + 2 viññatti + 3 vikāra + 4 lakkhaṇa). 21 kalāpas = 9 kammaja + 6 cittaja + 4 utuja + 2 āhāraja.",
              "28 rūpas = 18 nipphanna (4 mahābhūta + 5 pasāda + 4 gocara + 2 bhāva + 1 hadaya + 1 jīvita + 1 āhāra) + 10 anipphanna (1 pariccheda + 2 viññatti + 3 vikāra + 4 lakkhaṇa). 21 kalāpas = 9 kammaja + 6 cittaja + 4 utuja + 2 āhāraja."),
            {"as": "VI.5", "cma": "VI §5", "segId": 500},
        ),
        _card(
            "c7.chk_37_bodhipakkhiya", 7, "samuccaya", "structure", "checksum",
            ["c7.bodhipakkhiya_37"],
            "37 = 4+4+4+5+5+7+8 · 14 Dhammas reais",
            CAT_CHK,
            T("Checksum dos 37 Bodhipakkhiya-dhammā: qual é a soma dos 7 grupos e a quantos dhammas últimos (paramattha) distintos eles se reduzem?",
              "Checksum of the 37 Bodhipakkhiya-dhammā: what is the sum of the 7 groups, and to how many distinct ultimate dhammas (paramattha) do they reduce?",
              "Checksum de los 37 Bodhipakkhiya-dhammā: ¿cuál es la suma de los 7 grupos y a cuántos dhammas últimos (paramattha) distintos se reducen?"),
            T("37 = 4 satipaṭṭhāna + 4 sammappadhāna + 4 iddhipāda + 5 indriya + 5 bala + 7 bojjhaṅga + 8 maggaṅga. Reduzem-se a 14 dhammas últimos (1 citta + 13 cetasikas), com vīriya aparecendo 9 vezes e sati 8 vezes.",
              "37 = 4 satipaṭṭhāna + 4 sammappadhāna + 4 iddhipāda + 5 indriya + 5 bala + 7 bojjhaṅga + 8 maggaṅga. They reduce to 14 distinct ultimate dhammas (1 citta + 13 cetasikas), with vīriya occurring 9 times and sati 8 times.",
              "37 = 4 satipaṭṭhāna + 4 sammappadhāna + 4 iddhipāda + 5 indriya + 5 bala + 7 bojjhaṅga + 8 maggaṅga. Se reducen a 14 dhammas últimos (1 citta + 13 cetasikas), con vīriya 9 veces y sati 8 veces."),
            {"as": "VII.28", "cma": "VII §29", "segId": 625},
        ),
        _card(
            "c8.chk_patthana_6_modes", 8, "paccaya", "structure", "checksum",
            ["c8.struct_ps_architecture", "c8.pat_01", "c8.pat_24"],
            "24 Paccayas · 6 Modos (6+5+1+1+2+9)",
            CAT_CHK,
            T("Checksum do Cap. 8: como se somam os 6 modos de relação do Paṭṭhāna (nāma/rūpa/paññatti) e a arquitetura 3-4-3-20 do Paṭiccasamuppāda?",
              "Checksum of Ch. 8: how do the 6 relational modes of the Paṭṭhāna (nāma/rūpa/paññatti) sum up, and what is the 3-4-3-20 architecture of Paṭiccasamuppāda?",
              "Checksum del Cap. 8: ¿cómo suman los 6 modos relacionales del Paṭṭhāna (nāma/rūpa/paññatti) y cuál es la arquitectura 3-4-3-20 del Paṭiccasamuppāda?"),
            T("6 modos: nāma→nāma (6), nāma→nāmarūpa (5), nāma→rūpa (1), rūpa→nāma (1), paññatti-nāmarūpa→nāma (2), nāmarūpa→nāmarūpa (9). Paṭiccasamuppāda: 12 elos · 3 períodos · 4 grupos (5+5+5+5 = 20 modos) · 3 junções (sandhi) · 3 rondas (vaṭṭa).",
              "6 modes: nāma→nāma (6), nāma→nāmarūpa (5), nāma→rūpa (1), rūpa→nāma (1), paññatti-nāmarūpa→nāma (2), nāmarūpa→nāmarūpa (9). Paṭiccasamuppāda: 12 links · 3 periods · 4 groups (5+5+5+5 = 20 modes) · 3 links (sandhi) · 3 rounds (vaṭṭa).",
              "6 modos: nāma→nāma (6), nāma→nāmarūpa (5), nāma→rūpa (1), rūpa→nāma (1), paññatti-nāmarūpa→nāma (2), nāmarūpa→nāmarūpa (9). Paṭiccasamuppāda: 12 eslabones · 3 períodos · 4 grupos (5+5+5+5 = 20 modos) · 3 uniones (sandhi) · 3 rondas (vaṭṭa)."),
            {"as": "VIII.15", "cma": "VIII §15", "segId": 672},
        ),
        _card(
            "c9.chk_40_kammatthana", 9, "kammatthana", "structure", "checksum",
            ["c9.samatha_40"],
            "40 = 10 + 10 + 10 + (4 + 1 + 1 + 4)",
            CAT_CHK,
            T("Checksum dos 40 Kammaṭṭhānas de Samatha: decomponha a simetria dos 7 grupos e a soma em concentração de acesso (upacāra) vs. absorção (appanā).",
              "Checksum of the 40 Samatha Kammaṭṭhānas: decompose the symmetry of the 7 groups and the split between access concentration (upacāra) vs. absorption (appanā).",
              "Checksum de los 40 Kammaṭṭhānas de Samatha: descomponga la simetría de los 7 grupos y el reparto entre concentración de acceso (upacāra) y absorción (appanā)."),
            T("40 = 10 kasiṇa + 10 asubha + 10 anussati (30) + espelho 4 appamaññā + 1 āhāre + 1 catudhātu + 4 āruppa (10). Por bhāvanā: 10 conduzem só a upacāra e 30 conduzem a appanā (jhāna).",
              "40 = 10 kasiṇa + 10 asubha + 10 anussati (30) + mirror 4 appamaññā + 1 āhāre + 1 catudhātu + 4 āruppa (10). By bhāvanā: 10 lead only to upacāra and 30 lead to appanā (jhāna).",
              "40 = 10 kasiṇa + 10 asubha + 10 anussati (30) + espejo 4 appamaññā + 1 āhāre + 1 catudhātu + 4 āruppa (10). Por bhāvanā: 10 conducen solo a upacāra y 30 a appanā (jhāna)."),
            {"as": "IX.11", "cma": "IX §11", "segId": 715},
        ),
        # ── Extra generative mathematical construction cards ──────────────────
        _card(
            "c1.math_cartesian_lobha_sobhana", 1, "citta", "structure", "checksum",
            ["c1.citta_01", "c1.citta_08", "c1.citta_31"],
            "2 × 2 × 2 = 8 (Lobha & Kāmasobhana)",
            CAT_CHK,
            T("Estrutura matemática: qual produto cartesiano binário (2 × 2 × 2) gera automaticamente os 8 Lobhamūla e os 24 Kāmasobhana (3 × 8)?",
              "Mathematical structure: which binary Cartesian product (2 × 2 × 2) automatically generates the 8 Lobhamūla and the 24 Kāmasobhana (3 × 8)?",
              "Estructura matemática: ¿qué producto cartesiano binario (2 × 2 × 2) genera automáticamente los 8 Lobhamūla y los 24 Kāmasobhana (3 × 8)?"),
            T("3 eixos binários (2³ = 8): {Somanassa, Upekkhā} × {Diṭṭhi+/- nos Lobha OU Ñāṇa+/- nos Sobhana} × {Asaṅkhārika, Sasaṅkhārika}. Nos Kāmasobhana, esse cubo de 8 é clonado 3× em {Kusala, Vipāka, Kiriya} = 24.",
              "3 binary axes (2³ = 8): {Somanassa, Upekkhā} × {Diṭṭhi+/- in Lobha OR Ñāṇa+/- in Sobhana} × {Asaṅkhārika, Sasaṅkhārika}. In Kāmasobhana, this 8-cube is cloned 3× across {Kusala, Vipāka, Kiriya} = 24.",
              "3 ejes binarios (2³ = 8): {Somanassa, Upekkhā} × {Diṭṭhi+/- en Lobha O Ñāṇa+/- en Sobhana} × {Asaṅkhārika, Sasaṅkhārika}. En Kāmasobhana, este cubo de 8 se clona 3× en {Kusala, Vipāka, Kiriya} = 24."),
            {"as": "I.4", "cma": "I §4 & §13", "segId": 13},
        ),
        _card(
            "c1.math_ahetuka_mirror_jhana_sub", 1, "citta", "structure", "checksum",
            ["c1.citta_13", "c1.citta_20", "c1.citta_55", "c1.citta_70"],
            "Espelho 7→8 · Subtração 5→4→3→2→2",
            CAT_CHK,
            T("Estrutura matemática: (a) por que Ahetuka soma 7 + 8 + 3 = 18? (b) qual lei algébrica gera os 15 Rūpāvacara (3×5) e os 12 Arūpāvacara (3×4)?",
              "Mathematical structure: (a) why does Ahetuka sum 7 + 8 + 3 = 18? (b) what algebraic rule generates the 15 Rūpāvacara (3×5) and 12 Arūpāvacara (3×4)?",
              "Estructura matemática: (a) ¿por qué Ahetuka suma 7 + 8 + 3 = 18? (b) ¿qué regla algebraica genera los 15 Rūpāvacara (3×5) y 12 Arūpāvacara (3×4)?"),
            T("(a) Os 7 akusalavipāka e 8 kusalavipāka são espelhos (5 viññāṇa + 1 sampaṭicchana + santīraṇa), mas kusalavipāka bifurca santīraṇa em 2 (somanassa/upekkhā → +1); +3 kiriya. (b) Rūpāvacara subtrai 1 fator por jhāna (5→4→3→2→2 com upekkhā) ×3; Arūpāvacara fixa os 2 fatores e varia 4 objetos ×3.",
              "(a) The 7 akusalavipāka and 8 kusalavipāka mirror each other (5 viññāṇa + 1 sampaṭicchana + santīraṇa), but kusalavipāka splits santīraṇa in 2 (+1); +3 kiriya. (b) Rūpāvacara drops 1 factor per jhāna (5→4→3→2→2 with upekkhā) ×3; Arūpāvacara fixes 2 factors and rotates 4 objects ×3.",
              "(a) Los 7 akusalavipāka y 8 kusalavipāka se espejan (5 viññāṇa + 1 sampaṭicchana + santīraṇa), pero kusalavipāka bifurca santīraṇa en 2 (+1); +3 kiriya. (b) Rūpāvacara resta 1 factor por jhāna (5→4→3→2→2) ×3; Arūpāvacara fija 2 factores y varía 4 objetos ×3."),
            {"as": "I.19", "cma": "I §18–23", "segId": 35},
        ),
        _card(
            "c2.math_sangahanaya_deltas", 2, "cetasika", "house", "checksum",
            ["c2.house_sangahanaya"],
            "Saṅgahanaya: Base + Deltas",
            CAT_CHK,
            T("Estrutura matemática do Saṅgahanaya (Akusala e Ahetuka): em vez de decorar números soltos, quais deltas geram (a) os 7 totais de Akusala e (b) a escada de Ahetuka?",
              "Mathematical structure of Saṅgahanaya (Akusala & Ahetuka): instead of rote numbers, which deltas generate (a) the 7 Akusala totals and (b) the Ahetuka ladder?",
              "Estructura matemática del Saṅgahanaya (Akusala y Ahetuka): ¿qué deltas generan (a) los 7 totales de Akusala y (b) la escalera de Ahetuka?"),
            T("(a) Akusala: Lobha #1 = 19; trocar somanassa→upekkhā = −1 (18); tornar sasaṅkhārika = +2 thīna/middha (21, 20); Dosa #1 = 20, #2 = 22 (+2); Mohamūla = 15 cada. (b) Ahetuka: Hasituppāda 12 (13−chanda) → Voṭṭhabbana/Somanassa-Santīraṇa 11 (−1) → Mano-dhātu/Upekkhā-Santīraṇa 10 (−2) → 10 Pañcaviññāṇa 7.",
              "(a) Akusala: Lobha #1 = 19; somanassa→upekkhā = −1 (18); sasaṅkhārika = +2 thīna/middha (21, 20); Dosa #1 = 20, #2 = 22 (+2); Mohamūla = 15 each. (b) Ahetuka: Hasituppāda 12 (13−chanda) → Voṭṭhabbana/Somanassa-Santīraṇa 11 (−1) → Mano-dhātu/Upekkhā-Santīraṇa 10 (−2) → 10 Pañcaviññāṇa 7.",
              "(a) Akusala: Lobha #1 = 19; somanassa→upekkhā = −1 (18); sasaṅkhārika = +2 thīna/middha (21, 20); Dosa #1 = 20, #2 = 22 (+2); Mohamūla = 15 c/u. (b) Ahetuka: Hasituppāda 12 → 11 → 10 → 10 Pañcaviññāṇa 7."),
            {"as": "II.26", "cma": "II §25–26", "segId": 160},
        ),
        _card(
            "c3.math_vedana_121_kicca_10_14", 3, "pakinnaka", "structure", "checksum",
            ["c3.struct_vedana_5", "c3.kicca_04"],
            "121 = 62+55+2+1+1 · 14 = 10−1+5",
            CAT_CHK,
            T("Estrutura matemática do Cap. 3: (a) qual é a soma exata das 5 sensações (Vedanā) nos 121 cittas? (b) como os 10 estágios (ṭhāna) geram exatamente 14 funções (kicca)?",
              "Mathematical structure of Ch. 3: (a) what is the exact sum of the 5 feelings (Vedanā) across 121 cittas? (b) how do the 10 stages (ṭhāna) yield exactly 14 functions (kicca)?",
              "Estructura matemática del Cap. 3: (a) ¿cuál es la suma exacta de las 5 sensaciones (Vedanā) en 121 cittas? (b) ¿cómo producen 10 etapas (ṭhāna) exactamente 14 funciones (kicca)?"),
            T("(a) 62 somanassa + 55 upekkhā + 2 domanassa + 1 sukha (tátil hábil) + 1 dukkha (tátil inábil) = 121. (b) 10 estágios têm 1 função cada, exceto o 4º (Pañcaviññāṇa) que se abre em 5 sentidos: 10 − 1 + 5 = 14 kiccas.",
              "(a) 62 somanassa + 55 upekkhā + 2 domanassa + 1 sukha (wholesome body) + 1 dukkha (unwholesome body) = 121. (b) 10 stages have 1 function each except the 4th (Pañcaviññāṇa), which expands into 5 senses: 10 − 1 + 5 = 14 kiccas.",
              "(a) 62 somanassa + 55 upekkhā + 2 domanassa + 1 sukha + 1 dukkha = 121. (b) 10 etapas tienen 1 función cada una excepto la 4.ª (Pañcaviññāṇa), que se abre en 5 sentidos: 10 − 1 + 5 = 14 kiccas."),
            {"as": "III.5", "cma": "III §3 & §8", "segId": 186},
        ),
        _card(
            "c7.math_ayatana_12_dhatu_18", 7, "samuccaya", "structure", "checksum",
            ["c7.sabba_khandha_5"],
            "18 Dhātus = 12 Āyatanas − 1 + 7",
            CAT_CHK,
            T("Estrutura matemática do Sabbasaṅgaha: qual transformação aritmética exata converte as 12 Bases (Āyatanas) nos 18 Elementos (Dhātus)?",
              "Mathematical structure of Sabbasaṅgaha: which exact arithmetic transformation converts the 12 Bases (Āyatanas) into the 18 Elements (Dhātus)?",
              "Estructura matemática del Sabbasaṅgaha: ¿qué transformación aritmética exacta convierte las 12 Bases (Āyatanas) en los 18 Elementos (Dhātus)?"),
            T("11 āyatanas permanecem idênticos (5 órgãos + 5 objetos + dhammāyatana). Apenas o 12º (Manāyatana = todos os 89 cittas) expande-se em 7 Viññāṇadhātus (5 consciências sensoriais + manodhātu + manoviññāṇadhātu): 12 − 1 + 7 = 18 dhātus.",
              "11 āyatanas remain unchanged (5 organs + 5 objects + dhammāyatana). Only the 12th (Manāyatana = all 89 cittas) splits into 7 Viññāṇadhātus (5 sense-consciousnesses + manodhātu + manoviññāṇadhātu): 12 − 1 + 7 = 18 dhātus.",
              "11 āyatanas quedan iguales (5 órganos + 5 objetos + dhammāyatana). Solo el 12.º (Manāyatana = 89 cittas) se divide en 7 Viññāṇadhātus (5 sensoriales + manodhātu + manoviññāṇadhātu): 12 − 1 + 7 = 18 dhātus."),
            {"as": "VII.36", "cma": "VII §37", "segId": 640},
        ),
    ])

    # ══════════════════════════════════════════════════════════════════════════
    # 2. PRODUCTION: ENUMERATION CARDS (with interactive checklist)
    # ══════════════════════════════════════════════════════════════════════════
    cards.extend([
        _card(
            "c2.enum_universal_7", 2, "cetasika", "structure", "enumeration",
            ["c2.cet_01", "c2.cet_02", "c2.cet_03", "c2.cet_04", "c2.cet_05", "c2.cet_06", "c2.cet_07"],
            "Sabbacittasādhāraṇa (7)",
            CAT_ENUM,
            T("Produção: liste de memória os 7 Cetasikas Universais (Sabbacittasādhāraṇa) na ordem canônica do Mūla.",
              "Production: list from memory the 7 Universal Cetasikas (Sabbacittasādhāraṇa) in the canonical Mūla order.",
              "Producción: enumere de memoria los 7 Cetasikas Universales (Sabbacittasādhāraṇa) en el orden canónico del Mūla."),
            T("1. Phassa · 2. Vedanā · 3. Saññā · 4. Cetanā · 5. Ekaggatā · 6. Jīvitindriya · 7. Manasikāra.",
              "1. Phassa · 2. Vedanā · 3. Saññā · 4. Cetanā · 5. Ekaggatā · 6. Jīvitindriya · 7. Manasikāra.",
              "1. Phassa · 2. Vedanā · 3. Saññā · 4. Cetanā · 5. Ekaggatā · 6. Jīvitindriya · 7. Manasikāra."),
            {"as": "II.2", "cma": "II §2", "segId": 83},
            checklist=[
                T("Phassa (Contato)", "Phassa (Contact)", "Phassa (Contacto)"),
                T("Vedanā (Sensação)", "Vedanā (Feeling)", "Vedanā (Sensación)"),
                T("Saññā (Percepção)", "Saññā (Perception)", "Saññā (Percepción)"),
                T("Cetanā (Volição)", "Cetanā (Volition)", "Cetanā (Volición)"),
                T("Ekaggatā (Unificação)", "Ekaggatā (One-pointedness)", "Ekaggatā (Unificación)"),
                T("Jīvitindriya (Faculdade vital mental)", "Jīvitindriya (Mental life faculty)", "Jīvitindriya (Facultad vital mental)"),
                T("Manasikāra (Atenção)", "Manasikāra (Attention)", "Manasikāra (Atención)"),
            ],
        ),
        _card(
            "c2.enum_pakinnaka_6", 2, "cetasika", "structure", "enumeration",
            ["c2.cet_08", "c2.cet_09", "c2.cet_10", "c2.cet_11", "c2.cet_12", "c2.cet_13"],
            "Pakiṇṇaka-cetasika (6)",
            CAT_ENUM,
            T("Produção: liste de memória os 6 Cetasikas Ocasionais (Pakiṇṇaka) na ordem canônica.",
              "Production: list from memory the 6 Occasional Cetasikas (Pakiṇṇaka) in canonical order.",
              "Producción: enumere de memoria los 6 Cetasikas Ocasionales (Pakiṇṇaka) en orden canónico."),
            T("1. Vitakka · 2. Vicāra · 3. Adhimokkha · 4. Vīriya · 5. Pīti · 6. Chanda.",
              "1. Vitakka · 2. Vicāra · 3. Adhimokkha · 4. Vīriya · 5. Pīti · 6. Chanda.",
              "1. Vitakka · 2. Vicāra · 3. Adhimokkha · 4. Vīriya · 5. Pīti · 6. Chanda."),
            {"as": "II.3", "cma": "II §3", "segId": 85},
            checklist=[
                T("Vitakka (Aplicação inicial)", "Vitakka (Initial application)", "Vitakka (Aplicación inicial)"),
                T("Vicāra (Aplicação sustentada)", "Vicāra (Sustained application)", "Vicāra (Aplicación sostenida)"),
                T("Adhimokkha (Decisão)", "Adhimokkha (Decision)", "Adhimokkha (Decisión)"),
                T("Vīriya (Energia)", "Vīriya (Energy)", "Vīriya (Energía)"),
                T("Pīti (Êxtase / Júbilo)", "Pīti (Zest / Rapture)", "Pīti (Éxtasis / Júbilo)"),
                T("Chanda (Desejo de agir)", "Chanda (Desire to act)", "Chanda (Deseo de actuar)"),
            ],
        ),
        _card(
            "c2.enum_akusala_14", 2, "cetasika", "house", "enumeration",
            ["c2.struct_akusala_14"],
            "Akusala-cetasika (14)",
            CAT_ENUM,
            T("Produção: liste todos os 14 Cetasikas Inábeis (Akusala) agrupados em 4 + 3 + 4 + 2 + 1.",
              "Production: list all 14 Unwholesome Cetasikas (Akusala) grouped as 4 + 3 + 4 + 2 + 1.",
              "Producción: enumere todos los 14 Cetasikas Inhábiles (Akusala) agrupados en 4 + 3 + 4 + 2 + 1."),
            T("Moha-4: Moha, Ahirika, Anottappa, Uddhacca | Lobha-3: Lobha, Diṭṭhi, Māna | Dosa-4: Dosa, Issā, Macchariya, Kukkucca | Par-2: Thīna, Middha | Isolado-1: Vicikicchā.",
              "Moha-4: Moha, Ahirika, Anottappa, Uddhacca | Lobha-3: Lobha, Diṭṭhi, Māna | Dosa-4: Dosa, Issā, Macchariya, Kukkucca | Pair-2: Thīna, Middha | Single-1: Vicikicchā.",
              "Moha-4: Moha, Ahirika, Anottappa, Uddhacca | Lobha-3: Lobha, Diṭṭhi, Māna | Dosa-4: Dosa, Issā, Macchariya, Kukkucca | Par-2: Thīna, Middha | Único-1: Vicikicchā."),
            {"as": "II.4", "cma": "II §4", "segId": 88},
            checklist=[
                P("Moha · Ahirika · Anottappa · Uddhacca (4)"),
                P("Lobha · Diṭṭhi · Māna (3)"),
                P("Dosa · Issā · Macchariya · Kukkucca (4)"),
                P("Thīna · Middha (2)"),
                P("Vicikicchā (1)"),
            ],
        ),
        _card(
            "c2.enum_sobhana_25", 2, "cetasika", "house", "enumeration",
            ["c2.cet_28", "c2.cet_35", "c2.cet_47", "c2.cet_50", "c2.cet_52"],
            "Sobhana-cetasika (25)",
            CAT_ENUM,
            T("Produção: liste todos os 25 Cetasikas Belos (Sobhana) em ordem: 7 + 6 pares kāya/citta + 3 virati + 2 appamaññā + 1 paññā.",
              "Production: list all 25 Beautiful Cetasikas (Sobhana) in order: 7 + 6 kāya/citta pairs + 3 virati + 2 appamaññā + 1 paññā.",
              "Producción: enumere los 25 Cetasikas Bellos (Sobhana) en orden: 7 + 6 pares kāya/citta + 3 virati + 2 appamaññā + 1 paññā."),
            T("7: Saddhā, Sati, Hiri, Ottappa, Alobha, Adosa, Tatramajjhattatā | 6 pares (12): Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā (kāya & citta) | 3 Virati: Sammāvācā, Sammākammanta, Sammā-ājīva | 2 Appamaññā: Karuṇā, Muditā | 1 Paññindriya.",
              "7: Saddhā, Sati, Hiri, Ottappa, Alobha, Adosa, Tatramajjhattatā | 6 pairs (12): Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā (kāya & citta) | 3 Virati: Sammāvācā, Sammākammanta, Sammā-ājīva | 2 Appamaññā: Karuṇā, Muditā | 1 Paññindriya.",
              "7: Saddhā, Sati, Hiri, Ottappa, Alobha, Adosa, Tatramajjhattatā | 6 pares (12): Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā (kāya & citta) | 3 Virati: Sammāvācā, Sammākammanta, Sammā-ājīva | 2 Appamaññā: Karuṇā, Muditā | 1 Paññindriya."),
            {"as": "II.6", "cma": "II §5–7", "segId": 92},
            checklist=[
                P("7 primeiros: Saddhā · Sati · Hiri · Ottappa · Alobha · Adosa · Tatramajjhattatā"),
                P("Par 1–2: Kāya/Citta-passaddhi · Kāya/Citta-lahutā"),
                P("Par 3–4: Kāya/Citta-mudutā · Kāya/Citta-kammaññatā"),
                P("Par 5–6: Kāya/Citta-pāguññatā · Kāya/Citta-ujukatā"),
                P("3 Virati: Sammāvācā · Sammākammanta · Sammā-ājīva"),
                P("2 Appamaññā: Karuṇā · Muditā"),
                P("1 Paññindriya (Amoha)"),
            ],
        ),
        _card(
            "c6.enum_nipphanna_18", 6, "rupa", "structure", "enumeration",
            ["c6.rupa_01", "c6.rupa_05", "c6.rupa_10", "c6.rupa_14", "c6.rupa_16", "c6.rupa_17", "c6.rupa_18"],
            "Nipphanna-rūpa (18)",
            CAT_ENUM,
            T("Produção: liste os 18 Rūpas Concretos (Nipphanna) em seus 7 subgrupos (4+5+4+2+1+1+1).",
              "Production: list the 18 Concrete Rūpas (Nipphanna) in their 7 subgroups (4+5+4+2+1+1+1).",
              "Producción: enumere los 18 Rūpas Concretos (Nipphanna) en sus 7 subgrupos (4+5+4+2+1+1+1)."),
            T("4 Mahābhūta (Paṭhavī, Āpo, Tejo, Vāyo) + 5 Pasāda (Cakkhu, Sota, Ghāna, Jivhā, Kāya) + 4 Gocara (Rūpa, Sadda, Gandha, Rasa; phoṭṭhabba está em 3 bhūtas) + 2 Bhāva (Itthi, Purisa) + Hadaya + Jīvita + Āhāra.",
              "4 Mahābhūta (Paṭhavī, Āpo, Tejo, Vāyo) + 5 Pasāda (Cakkhu, Sota, Ghāna, Jivhā, Kāya) + 4 Gocara (Rūpa, Sadda, Gandha, Rasa; phoṭṭhabba is in 3 bhūtas) + 2 Bhāva (Itthi, Purisa) + Hadaya + Jīvita + Āhāra.",
              "4 Mahābhūta (Paṭhavī, Āpo, Tejo, Vāyo) + 5 Pasāda (Cakkhu, Sota, Ghāna, Jivhā, Kāya) + 4 Gocara (Rūpa, Sadda, Gandha, Rasa; phoṭṭhabba está en 3 bhūtas) + 2 Bhāva (Itthi, Purisa) + Hadaya + Jīvita + Āhāra."),
            {"as": "VI.3", "cma": "VI §3", "segId": 490},
            checklist=[
                P("4 Mahābhūta: Paṭhavī · Āpo · Tejo · Vāyo"),
                P("5 Pasāda: Cakkhu · Sota · Ghāna · Jivhā · Kāya"),
                P("4 Gocara: Rūpa · Sadda · Gandha · Rasa"),
                P("2 Bhāva: Itthibhāva · Purisabhāva"),
                P("1 Hadayavatthu · 1 Jīvitindriya · 1 Kabalīkāra-āhāra"),
            ],
        ),
        _card(
            "c6.enum_anipphanna_10", 6, "rupa", "structure", "enumeration",
            ["c6.rupa_19", "c6.rupa_20", "c6.rupa_22", "c6.rupa_25"],
            "Anipphanna-rūpa (10)",
            CAT_ENUM,
            T("Produção: liste os 10 Rūpas Não-Concretos (Anipphanna) em seus 4 subgrupos (1+2+3+4).",
              "Production: list the 10 Non-Concrete Rūpas (Anipphanna) in their 4 subgroups (1+2+3+4).",
              "Producción: enumere los 10 Rūpas No Concretos (Anipphanna) en sus 4 subgrupos (1+2+3+4)."),
            T("1 Pariccheda (Ākāsadhātu) + 2 Viññatti (Kāyaviññatti, Vacīviññatti) + 3 Vikāra (Lahutā, Mudutā, Kammaññatā) + 4 Lakkhaṇa (Upacaya, Santati, Jaratā, Aniccatā).",
              "1 Pariccheda (Ākāsadhātu) + 2 Viññatti (Kāyaviññatti, Vacīviññatti) + 3 Vikāra (Lahutā, Mudutā, Kammaññatā) + 4 Lakkhaṇa (Upacaya, Santati, Jaratā, Aniccatā).",
              "1 Pariccheda (Ākāsadhātu) + 2 Viññatti (Kāyaviññatti, Vacīviññatti) + 3 Vikāra (Lahutā, Mudutā, Kammaññatā) + 4 Lakkhaṇa (Upacaya, Santati, Jaratā, Aniccatā)."),
            {"as": "VI.4", "cma": "VI §4", "segId": 495},
            checklist=[
                P("1 Pariccheda: Ākāsadhātu"),
                P("2 Viññatti: Kāyaviññatti · Vacīviññatti"),
                P("3 Vikāra: Rūpassa lahutā · mudutā · kammaññatā"),
                P("4 Lakkhaṇa: Upacaya · Santati · Jaratā · Aniccatā"),
            ],
        ),
        _card(
            "c8.enum_patthana_24", 8, "paccaya", "house", "enumeration",
            ["c8.pat_01", "c8.pat_12", "c8.pat_13", "c8.pat_24"],
            "Catuvīsati Paccayā (24)",
            CAT_ENUM,
            T("Produção: recite de memória as 24 Condições do Paṭṭhāna em 4 blocos de 6.",
              "Production: recite from memory the 24 Paṭṭhāna Conditions in 4 blocks of 6.",
              "Producción: recite de memoria las 24 Condiciones del Paṭṭhāna en 4 bloques de 6."),
            T("1–6: Hetu, Ārammaṇa, Adhipati, Anantara, Samanantara, Sahajāta | 7–12: Aññamañña, Nissaya, Upanissaya, Purejāta, Pacchājāta, Āsevana | 13–18: Kamma, Vipāka, Āhāra, Indriya, Jhāna, Magga | 19–24: Sampayutta, Vippayutta, Atthi, Natthi, Vigata, Avigata.",
              "1–6: Hetu, Ārammaṇa, Adhipati, Anantara, Samanantara, Sahajāta | 7–12: Aññamañña, Nissaya, Upanissaya, Purejāta, Pacchājāta, Āsevana | 13–18: Kamma, Vipāka, Āhāra, Indriya, Jhāna, Magga | 19–24: Sampayutta, Vippayutta, Atthi, Natthi, Vigata, Avigata.",
              "1–6: Hetu, Ārammaṇa, Adhipati, Anantara, Samanantara, Sahajāta | 7–12: Aññamañña, Nissaya, Upanissaya, Purejāta, Pacchājāta, Āsevana | 13–18: Kamma, Vipāka, Āhāra, Indriya, Jhāna, Magga | 19–24: Sampayutta, Vippayutta, Atthi, Natthi, Vigata, Avigata."),
            {"as": "VIII.12", "cma": "VIII §12", "segId": 668},
            checklist=[
                P("1–6: Hetu · Ārammaṇa · Adhipati · Anantara · Samanantara · Sahajāta"),
                P("7–12: Aññamañña · Nissaya · Upanissaya · Purejāta · Pacchājāta · Āsevana"),
                P("13–18: Kamma · Vipāka · Āhāra · Indriya · Jhāna · Magga"),
                P("19–24: Sampayutta · Vippayutta · Atthi · Natthi · Vigata · Avigata"),
            ],
        ),
        _card(
            "c9.enum_upakkilesa_10", 9, "kammatthana", "structure", "enumeration",
            ["c9.vipassana_nanas_10"],
            "Vipassanūpakkilesa (10)",
            CAT_ENUM,
            T("Produção: liste as 10 Corrupções do Insight (Vipassanūpakkilesa) que surgem no conhecimento de udayabbaya jovem.",
              "Production: list the 10 Corruptions of Insight (Vipassanūpakkilesa) arising in tender udayabbaya knowledge.",
              "Producción: enumere las 10 Corrupciones del Insight (Vipassanūpakkilesa) que surgen en el conocimiento tierno de udayabbaya."),
            T("1. Obhāsa (iluminação) · 2. Ñāṇa · 3. Pīti · 4. Passaddhi · 5. Sukha · 6. Adhimokkha · 7. Paggaha · 8. Upaṭṭhāna · 9. Upekkhā · 10. Nikanti (apego sutil).",
              "1. Obhāsa (illumination) · 2. Ñāṇa · 3. Pīti · 4. Passaddhi · 5. Sukha · 6. Adhimokkha · 7. Paggaha · 8. Upaṭṭhāna · 9. Upekkhā · 10. Nikanti (subtle attachment).",
              "1. Obhāsa (iluminación) · 2. Ñāṇa · 3. Pīti · 4. Passaddhi · 5. Sukha · 6. Adhimokkha · 7. Paggaha · 8. Upaṭṭhāna · 9. Upekkhā · 10. Nikanti (apego sutil)."),
            {"as": "IX.34", "cma": "IX §34", "segId": 782},
            checklist=[
                P("Obhāsa · Ñāṇa · Pīti"),
                P("Passaddhi · Sukha · Adhimokkha"),
                P("Paggaha · Upaṭṭhāna · Upekkhā · Nikanti"),
            ],
        ),
    ])

    # ══════════════════════════════════════════════════════════════════════════
    # 3. PRODUCTION: SEQUENCE ORDERING CARDS (interactive chip ordering)
    # ══════════════════════════════════════════════════════════════════════════
    cards.extend([
        _card(
            "c3.seq_kicca_14", 3, "pakinnaka", "house", "sequence",
            ["c3.kicca_01", "c3.kicca_02", "c3.kicca_03", "c3.kicca_09", "c3.kicca_12", "c3.kicca_14"],
            "14 Kicca (Sequência Canônica)",
            CAT_SEQ,
            T("Ordene as etapas principais das 14 funções (Kicca) do ciclo mental, da religação (paṭisandhi) à morte (cuti).",
              "Order the core stages of the 14 functions (Kicca) of the mental cycle, from rebirth-linking (paṭisandhi) to death (cuti).",
              "Ordene las etapas principales de las 14 funciones (Kicca) del ciclo mental, desde la reconexión (paṭisandhi) hasta la muerte (cuti)."),
            T("Paṭisandhi → Bhavaṅga → Āvajjana → 5 funções sensoriais (Dassana/Savana/Ghāyana/Sāyana/Phusana) → Sampaṭicchana → Santīraṇa → Voṭṭhabbana → Javana → Tadārammaṇa → Cuti.",
              "Paṭisandhi → Bhavaṅga → Āvajjana → 5 sense functions (Dassana/Savana/Ghāyana/Sāyana/Phusana) → Sampaṭicchana → Santīraṇa → Voṭṭhabbana → Javana → Tadārammaṇa → Cuti.",
              "Paṭisandhi → Bhavaṅga → Āvajjana → 5 funciones sensoriales (Dassana/Savana/Ghāyana/Sāyana/Phusana) → Sampaṭicchana → Santīraṇa → Voṭṭhabbana → Javana → Tadārammaṇa → Cuti."),
            {"as": "III.8", "cma": "III §8", "segId": 203},
            sequence_items=[
                P("1. Paṭisandhi"),
                P("2. Bhavaṅga"),
                P("3. Āvajjana"),
                T("4. Pañcaviññāṇa (5 funções)", "4. Pañcaviññāṇa (5 functions)", "4. Pañcaviññāṇa (5 funciones)"),
                P("5. Sampaṭicchana"),
                P("6. Santīraṇa"),
                P("7. Voṭṭhabbana"),
                P("8. Javana"),
                P("9. Tadārammaṇa"),
                P("10. Cuti"),
            ],
        ),
        _card(
            "c4.seq_vithi_17", 4, "vithi", "structure", "sequence",
            ["c4.vithi_01_atita_bhavanga", "c4.vithi_04_avajjana", "c4.vithi_09_15_javana", "c4.vithi_16_17_tadarammana"],
            "Pañcadvāra-vīthi (17 Momentos)",
            CAT_SEQ,
            T("Ordene na sequência exata os blocos dos 17 momentos do processo cognitivo sensorial completo (Atimahanta).",
              "Place the stages of the 17-moment complete sense-door cognitive process (Atimahanta) in exact sequence.",
              "Ordene en la secuencia exacta los bloques de los 17 momentos del proceso cognitivo sensorial completo (Atimahanta)."),
            T("Atīta-bhavaṅga (1) → Bhavaṅga-calana (2) → Bhavaṅgupaccheda (3) → Pañcadvārāvajjana (4) → Pañcaviññāṇa (5) → Sampaṭicchana (6) → Santīraṇa (7) → Voṭṭhabbana (8) → Javana ×7 (9–15) → Tadārammaṇa ×2 (16–17).",
              "Atīta-bhavaṅga (1) → Bhavaṅga-calana (2) → Bhavaṅgupaccheda (3) → Pañcadvārāvajjana (4) → Pañcaviññāṇa (5) → Sampaṭicchana (6) → Santīraṇa (7) → Voṭṭhabbana (8) → Javana ×7 (9–15) → Tadārammaṇa ×2 (16–17).",
              "Atīta-bhavaṅga (1) → Bhavaṅga-calana (2) → Bhavaṅgupaccheda (3) → Pañcadvārāvajjana (4) → Pañcaviññāṇa (5) → Sampaṭicchana (6) → Santīraṇa (7) → Voṭṭhabbana (8) → Javana ×7 (9–15) → Tadārammaṇa ×2 (16–17)."),
            {"as": "IV.6", "cma": "IV §8", "segId": 286},
            sequence_items=[
                P("Atīta-bhavaṅga"),
                P("Bhavaṅga-calana"),
                P("Bhavaṅgupaccheda"),
                P("Pañcadvārāvajjana"),
                P("Pañcaviññāṇa"),
                P("Sampaṭicchana"),
                P("Santīraṇa"),
                P("Voṭṭhabbana"),
                P("Javana (×7)"),
                P("Tadārammaṇa (×2)"),
            ],
        ),
        _card(
            "c5.seq_deva_6", 5, "vithimutta", "structure", "sequence",
            ["c5.bhumi_kamasugati"],
            "Cha Kāmāvacara-devalokā (6)",
            CAT_SEQ,
            T("Ordene de baixo para cima os 6 planos deva da esfera sensorial (andares 6 a 11 do arranha-céu cosmológico).",
              "Order from lowest to highest the 6 sense-sphere deva planes (floors 6 to 11 of the cosmological skyscraper).",
              "Ordene de abajo hacia arriba los 6 planos deva de la esfera sensorial (pisos 6 al 11 del rascacielos cosmológico)."),
            T("1. Cātummahārājika → 2. Tāvatiṃsa → 3. Yāma → 4. Tusita → 5. Nimmānarati → 6. Paranimmitavasavattī.",
              "1. Cātummahārājika → 2. Tāvatiṃsa → 3. Yāma → 4. Tusita → 5. Nimmānarati → 6. Paranimmitavasavattī.",
              "1. Cātummahārājika → 2. Tāvatiṃsa → 3. Yāma → 4. Tusita → 5. Nimmānarati → 6. Paranimmitavasavattī."),
            {"as": "V.3", "cma": "V §4", "segId": 366},
            sequence_items=[
                P("Cātummahārājika"),
                P("Tāvatiṃsa"),
                P("Yāma"),
                P("Tusita"),
                P("Nimmānarati"),
                P("Paranimmitavasavattī"),
            ],
        ),
        _card(
            "c8.seq_nidana_12", 8, "paccaya", "structure", "sequence",
            ["c8.ps_01", "c8.ps_06", "c8.ps_12"],
            "Dvādasa Nidānā (12 Elos)",
            CAT_SEQ,
            T("Ordene na sequência canônica os 12 elos da Originação Dependente (Paṭiccasamuppāda).",
              "Order the 12 links of Dependent Origination (Paṭiccasamuppāda) in canonical sequence.",
              "Ordene en secuencia canónica los 12 eslabones del Origen Dependiente (Paṭiccasamuppāda)."),
            T("Avijjā → Saṅkhāra → Viññāṇa → Nāmarūpa → Saḷāyatana → Phassa → Vedanā → Taṇhā → Upādāna → Bhava → Jāti → Jarāmaraṇa.",
              "Avijjā → Saṅkhāra → Viññāṇa → Nāmarūpa → Saḷāyatana → Phassa → Vedanā → Taṇhā → Upādāna → Bhava → Jāti → Jarāmaraṇa.",
              "Avijjā → Saṅkhāra → Viññāṇa → Nāmarūpa → Saḷāyatana → Phassa → Vedanā → Taṇhā → Upādāna → Bhava → Jāti → Jarāmaraṇa."),
            {"as": "VIII.2", "cma": "VIII §2", "segId": 654},
            sequence_items=[
                P("Avijjā"), P("Saṅkhāra"), P("Viññāṇa"), P("Nāmarūpa"),
                P("Saḷāyatana"), P("Phassa"), P("Vedanā"), P("Taṇhā"),
                P("Upādāna"), P("Bhava"), P("Jāti"), P("Jarāmaraṇa"),
            ],
        ),
        _card(
            "c9.seq_visuddhi_7", 9, "kammatthana", "structure", "sequence",
            ["c9.visuddhi_1_4", "c9.visuddhi_5_7"],
            "Satta Visuddhi (7 Purificações)",
            CAT_SEQ,
            T("Ordene as 7 Purificações (Visuddhi) do caminho de Vipassanā da 1ª à 7ª.",
              "Order the 7 Purifications (Visuddhi) of the Vipassanā path from 1st to 7th.",
              "Ordene las 7 Purificaciones (Visuddhi) del camino de Vipassanā de la 1.ª a la 7.ª."),
            T("1. Sīla → 2. Citta → 3. Diṭṭhi → 4. Kaṅkhāvitaraṇa → 5. Maggāmaggañāṇadassana → 6. Paṭipadāñāṇadassana → 7. Ñāṇadassana.",
              "1. Sīla → 2. Citta → 3. Diṭṭhi → 4. Kaṅkhāvitaraṇa → 5. Maggāmaggañāṇadassana → 6. Paṭipadāñāṇadassana → 7. Ñāṇadassana.",
              "1. Sīla → 2. Citta → 3. Diṭṭhi → 4. Kaṅkhāvitaraṇa → 5. Maggāmaggañāṇadassana → 6. Paṭipadāñāṇadassana → 7. Ñāṇadassana."),
            {"as": "IX.22", "cma": "IX §22", "segId": 771},
            sequence_items=[
                P("Sīlavisuddhi"),
                P("Cittavisuddhi"),
                P("Diṭṭhivisuddhi"),
                P("Kaṅkhāvitaraṇavisuddhi"),
                P("Maggāmaggañāṇadassanavisuddhi"),
                P("Paṭipadāñāṇadassanavisuddhi"),
                P("Ñāṇadassanavisuddhi"),
            ],
        ),
    ])

    # ══════════════════════════════════════════════════════════════════════════
    # 4. CONFUSABLES / EXPLICIT CONTRAST CARDS
    # ══════════════════════════════════════════════════════════════════════════
    cards.extend([
        _card(
            "c2.conf_hiri_ottappa", 2, "cetasika", "structure", "confusable",
            ["c2.cet_30", "c2.cet_31"],
            "Hiri vs. Ottappa",
            CAT_CONF,
            T("Confundíveis: qual é a diferença exata (causa próxima e direção) entre Hiri (vergonha moral) e Ottappa (temor moral)?",
              "Confusables: what is the exact difference (proximate cause and orientation) between Hiri (moral shame) and Ottappa (moral dread)?",
              "Confundibles: ¿cuál es la diferencia exacta (causa próxima y orientación) entre Hiri (vergüenza moral) y Ottappa (temor moral)?"),
            T("Hiri nasce do autorrespeito interno (repulsa intrínseca ao mal, como tocar sujeira). Ottappa nasce do respeito pelos outros e pelo temor às consequências (como tocar ferro em brasa). Juntos são os «guardiões do mundo» (lokapāla).",
              "Hiri arises from internal self-respect (intrinsic disgust at evil, like touching filth). Ottappa arises from regard for others and fear of consequences (like touching red-hot iron). Together they are the 'guardians of the world' (lokapāla).",
              "Hiri nace del autorrespeto interno (repulsión intrínseca al mal, como tocar inmundicia). Ottappa nace del respeto por los demás y el temor a las consecuencias (como tocar hierro candente). Juntos son los «guardianes del mundo» (lokapāla)."),
            {"as": "II.6", "cma": "II §5", "segId": 92},
        ),
        _card(
            "c2.conf_thina_middha", 2, "cetasika", "structure", "confusable",
            ["c2.cet_25", "c2.cet_26"],
            "Thīna vs. Middha",
            CAT_CONF,
            T("Confundíveis: qual é a distinção precisa entre Thīna (preguiça) e Middha (torpor), e em quais cittas eles podem surgir?",
              "Confusables: what is the precise distinction between Thīna (sloth) and Middha (torpor), and in which cittas can they arise?",
              "Confundibles: ¿cuál es la distinción precisa entre Thīna (pereza) y Middha (torpor), y en qué cittas pueden surgir?"),
            T("Thīna é a morbidez/rigidez da consciência (citta); Middha é a morbidez/peso do corpo mental dos fatores (cetasika-kāya). Surgem sempre juntos e apenas nos 5 akusala-cittas instigados (sasaṅkhārika: 4 lobha + 1 dosa).",
              "Thīna is the dullness/stiffness of consciousness (citta); Middha is the dullness/heaviness of the mental body of factors (cetasika-kāya). They always arise together and only in the 5 prompted (sasaṅkhārika) akusala cittas (4 lobha + 1 dosa).",
              "Thīna es la rigidez/letargo de la conciencia (citta); Middha es la pesadez del cuerpo mental de factores (cetasika-kāya). Surgen siempre juntos y solo en los 5 akusala-cittas instigados (sasaṅkhārika: 4 lobha + 1 dosa)."),
            {"as": "II.13", "cma": "II §14", "segId": 107},
        ),
        _card(
            "c2.conf_kaya_citta_6pairs", 2, "cetasika", "structure", "confusable",
            ["c2.cet_35", "c2.cet_36", "c2.cet_45", "c2.cet_46"],
            "6 Pares: Kāya- vs. Citta-",
            CAT_CONF,
            T("Confundíveis: nos 6 pares de sobhana-sādhāraṇa (Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā), a que se refere «Kāya» versus «Citta»?",
              "Confusables: in the 6 pairs of sobhana-sādhāraṇa (Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā), what does 'Kāya' refer to versus 'Citta'?",
              "Confundibles: en los 6 pares de sobhana-sādhāraṇa (Passaddhi, Lahutā, Mudutā, Kammaññatā, Pāguññatā, Ujukatā), ¿a qué se refiere «Kāya» frente a «Citta»?"),
            T("«Kāya» aqui NÃO é o corpo físico (rūpa), mas o «corpo mental» (nāmakāya = os 3 agregados dos cetasikas: vedanā, saññā, saṅkhāra). «Citta» é a própria consciência (viññāṇakkhandha). Os 12 fatores surgem sempre juntos em todo citta belo.",
              "'Kāya' here is NOT the physical body (rūpa), but the 'mental body' (nāmakāya = the 3 cetasika aggregates: vedanā, saññā, saṅkhāra). 'Citta' is consciousness itself (viññāṇakkhandha). All 12 arise together in every beautiful citta.",
              "«Kāya» aquí NO es el cuerpo físico (rūpa), sino el «cuerpo mental» (nāmakāya = los 3 agregados de cetasikas: vedanā, saññā, saṅkhāra). «Citta» es la conciencia misma (viññāṇakkhandha). Los 12 surgen juntos en todo citta bello."),
            {"as": "II.6", "cma": "II §5", "segId": 92},
        ),
        _card(
            "c2.conf_vitakka_vicara", 2, "cetasika", "structure", "confusable",
            ["c2.cet_08", "c2.cet_09"],
            "Vitakka vs. Vicāra",
            CAT_CONF,
            T("Confundíveis: qual é a diferença operacional entre Vitakka e Vicāra (e em qual jhāna cada um desaparece)?",
              "Confusables: what is the operational difference between Vitakka and Vicāra (and in which jhāna does each drop away)?",
              "Confundibles: ¿cuál es la diferencia operacional entre Vitakka y Vicāra (y en qué jhāna desaparece cada uno)?"),
            T("Vitakka dirige/lança a mente ao objeto (como o golpe inicial no sino); Vicāra examina e mantém a mente esfregando-se no objeto (como a reverberação do sino). No sistema de 5 jhānas, Vitakka cessa no 2º jhāna e Vicāra no 3º.",
              "Vitakka directs/mounts the mind onto the object (like striking a bell); Vicāra sustains and rubs the mind against the object (like the bell's reverberation). In the 5-jhāna system, Vitakka drops in the 2nd jhāna and Vicāra in the 3rd.",
              "Vitakka dirige/lanza la mente al objeto (como golpear una campana); Vicāra sostiene y examina el objeto (como la reverberación). En el sistema de 5 jhānas, Vitakka cesa en el 2.º jhāna y Vicāra en el 3.º."),
            {"as": "II.3", "cma": "II §3", "segId": 85},
        ),
        _card(
            "c2.conf_issa_macchariya_kukkucca", 2, "cetasika", "structure", "confusable",
            ["c2.cet_22", "c2.cet_23", "c2.cet_24"],
            "Issā vs. Macchariya vs. Kukkucca",
            CAT_CONF,
            T("Confundíveis: diferencie os 3 fatores ocasionais da tétrade de Dosa (Issā, Macchariya, Kukkucca) quanto ao objeto de aversão e sua regra de co-ocorrência.",
              "Confusables: distinguish the 3 occasional factors of the Dosa tetrad (Issā, Macchariya, Kukkucca) by their object of aversion and their co-occurrence rule.",
              "Confundibles: distinga los 3 factores ocasionales de la tétrada de Dosa (Issā, Macchariya, Kukkucca) según su objeto de aversión y su regla de co-ocurrencia."),
            T("Issā (inveja) detesta a prosperidade alheia; Macchariya (avareza) oculta/recusa partilhar a própria prosperidade; Kukkucca (remorso) lamenta o mal feito ou o bem omitido. Como têm objetos distintos, são mutuamente excludentes (no máx. 1 por citta).",
              "Issā (envy) resents others' prosperity; Macchariya (avarice) conceals/refuses to share one's own prosperity; Kukkucca (worry/remorse) broods over wrongs done or good omitted. Having distinct objects, they are mutually exclusive (at most 1 per citta).",
              "Issā (envidia) resiente la prosperidad ajena; Macchariya (avaricia) oculta/rehúsa compartir la propia; Kukkucca (remordimiento) lamenta el mal hecho o el bien omitido. Al tener objetos distintos, son mutuamente excluyentes (máx. 1 por citta)."),
            {"as": "II.13", "cma": "II §14", "segId": 106},
        ),
        _card(
            "c3.conf_somanassa_sukha_piti", 3, "pakinnaka", "structure", "confusable",
            ["c3.struct_vedana_5", "c2.cet_12"],
            "Somanassa vs. Sukha vs. Pīti",
            CAT_CONF,
            T("Confundíveis: distinga Somanassa, Sukha (corporal) e Pīti quanto ao agregado (khandha), natureza e momento em que cessam nos jhānas.",
              "Confusables: distinguish Somanassa, bodily Sukha, and Pīti by aggregate (khandha), nature, and when they drop across the jhānas.",
              "Confundibles: distinga Somanassa, Sukha (corporal) y Pīti por agregado (khandha), naturaleza y momento en que cesan en los jhānas."),
            T("Somanassa (alegria mental) e Sukha (prazer corporal, só na consciência tátil hábil resultante) pertencem a vedanā-kkhandha. Pīti (entusiasmo/interesse ativo pelo objeto) pertence a saṅkhāra-kkhandha. Nos 5 jhānas, Pīti cessa no 4º e Somanassa (sukha mental) no 5º.",
              "Somanassa (mental joy) and Sukha (bodily pleasure, only in wholesome-resultant body-consciousness) belong to vedanā-kkhandha. Pīti (zest/active interest in the object) belongs to saṅkhāra-kkhandha. In the 5 jhānas, Pīti ceases in the 4th and Somanassa in the 5th.",
              "Somanassa (alegría mental) y Sukha (placer corporal, solo en conciencia táctil resultante hábil) son vedanā-kkhandha. Pīti (entusiasmo por el objeto) es saṅkhāra-kkhandha. En los 5 jhānas, Pīti cesa en el 4.º y Somanassa en el 5.º."),
            {"as": "III.2", "cma": "III §2", "segId": 182},
        ),
        _card(
            "c3.conf_patisandhi_bhavanga_cuti", 3, "pakinnaka", "structure", "confusable",
            ["c3.kicca_01", "c3.kicca_02", "c3.kicca_14"],
            "Paṭisandhi vs. Bhavaṅga vs. Cuti",
            CAT_CONF,
            T("Confundíveis: o que Paṭisandhi, Bhavaṅga e Cuti têm em comum numa mesma vida, e o que exatamente os diferencia?",
              "Confusables: what do Paṭisandhi, Bhavaṅga, and Cuti share within a single lifetime, and what exactly distinguishes them?",
              "Confundibles: ¿qué tienen en común Paṭisandhi, Bhavaṅga y Cuti dentro de una misma vida, y qué los diferencia exactamente?"),
            T("Na mesma existência, todos os três são exatamente o MESMO tipo de citta vipāka (um dos 19), têm os mesmos cetasikas e o mesmo objeto (kamma, kammanimitta ou gatinimitta). Diferem só pela função (kicca) e posição temporal: início, continuidade passiva e encerramento da vida.",
              "Within one existence, all three are the EXACT SAME vipāka citta type (one of the 19), with identical cetasikas and identical object (kamma, kammanimitta, or gatinimitta). They differ solely in function (kicca) and timing: start, passive continuity, and end of life.",
              "En una misma existencia, los tres son el MISMO tipo de citta vipāka (uno de los 19), con idénticos cetasikas e idéntico objeto (kamma, kammanimitta o gatinimitta). Difieren solo en su función (kicca) y momento: inicio, continuidad pasiva y cierre de la vida."),
            {"as": "III.8", "cma": "III §9", "segId": 206},
        ),
        _card(
            "c4.conf_samp_sant_votth", 4, "vithi", "structure", "confusable",
            ["c4.vithi_06_07_08_samp_sant_votth"],
            "Sampaṭicchana vs. Santīraṇa vs. Voṭṭhabbana",
            CAT_CONF,
            T("Confundíveis: contraste as funções, classes de citta (vipāka vs. kiriya) e quantidades de Sampaṭicchana, Santīraṇa e Voṭṭhabbana na porta sensorial.",
              "Confusables: contrast the functions, citta classes (vipāka vs. kiriya), and counts of Sampaṭicchana, Santīraṇa, and Voṭṭhabbana in a sense-door process.",
              "Confundibles: contraste las funciones, clases de citta (vipāka vs. kiriya) y cantidades de Sampaṭicchana, Santīraṇa y Voṭṭhabbana en la puerta sensorial."),
            T("Sampaṭicchana (2 vipāka ahetuka) RECEBE o objeto; Santīraṇa (3 vipāka ahetuka) INVESTIGA o objeto; Voṭṭhabbana (1 kiriya ahetuka = Manodvārāvajjana) DETERMINA o objeto, decidindo a guinada para javana hábil ou inábil.",
              "Sampaṭicchana (2 rootless vipāka) RECEIVES the object; Santīraṇa (3 rootless vipāka) INVESTIGATES the object; Voṭṭhabbana (1 rootless kiriya = Manodvārāvajjana) DETERMINES the object, setting the turn toward wholesome or unwholesome javana.",
              "Sampaṭicchana (2 vipāka ahetuka) RECIBE el objeto; Santīraṇa (3 vipāka ahetuka) INVESTIGA el objeto; Voṭṭhabbana (1 kiriya ahetuka = Manodvārāvajjana) DETERMINA el objeto, abriendo paso al javana hábil o inhábil."),
            {"as": "IV.6", "cma": "IV §8", "segId": 286},
        ),
        _card(
            "c7.conf_lobha_raga_tanha", 7, "samuccaya", "structure", "confusable",
            ["c7.asava_ogha_yoga_4", "c7.kilesa_10", "c2.cet_18"],
            "Lobha vs. Rāga vs. Taṇhā",
            CAT_CONF,
            T("Confundíveis: qual é o paramattha-dhamma único por trás de Lobha, Rāga, Taṇhā, Kāmāsava e Kāmupādāna, e por que recebem nomes distintos no Cap. 7?",
              "Confusables: what single paramattha-dhamma underlies Lobha, Rāga, Taṇhā, Kāmāsava, and Kāmupādāna, and why do they bear distinct names in Ch. 7?",
              "Confundibles: ¿qué único paramattha-dhamma subyace a Lobha, Rāga, Taṇhā, Kāmāsava y Kāmupādāna, y por qué reciben nombres distintos en el Cap. 7?"),
            T("Todos são o MESMO cetasika único: Lobha. Recebem nomes conforme o papel/intensidade: Lobha (raiz/cobiça geral), Rāga (paixão que tinge a mente), Taṇhā (sede/ânsia no Paṭiccasamuppāda), Kāmāsava (fluxo) e Kāmupādāna (apego agarrado aos prazeres).",
              "All are the SINGLE cetasika Lobha. They take different names by role/intensity: Lobha (root/general greed), Rāga (lust dyeing the mind), Taṇhā (craving/thirst in Paṭiccasamuppāda), Kāmāsava (taint), and Kāmupādāna (clinging to sense-pleasures).",
              "Todos son el ÚNICO cetasika Lobha. Reciben distintos nombres según rol/intensidad: Lobha (raíz/codicia general), Rāga (pasión que tiñe la mente), Taṇhā (sed/ansia en Paṭiccasamuppāda), Kāmāsava (contaminación) y Kāmupādāna (aferramiento sensual)."),
            {"as": "VII.2", "cma": "VII §2–8", "segId": 581},
        ),
        _card(
            "c8.conf_sahajata_annamanna_nissaya", 8, "paccaya", "structure", "confusable",
            ["c8.pat_06", "c8.pat_07", "c8.pat_08"],
            "Sahajāta vs. Aññamañña vs. Nissaya",
            CAT_CONF,
            T("Confundíveis: contraste Sahajāta (co-nascença), Aññamañña (reciprocidade) e Nissaya (suporte) — qual é o mais amplo e qual exige mão dupla?",
              "Confusables: contrast Sahajāta (conascence), Aññamañña (mutuality), and Nissaya (support) — which is broadest and which requires two-way reciprocity?",
              "Confundibles: contraste Sahajāta (conacimiento), Aññamañña (reciprocidad) y Nissaya (soporte): ¿cuál es más amplio y cuál exige doble vía?"),
            T("Sahajāta: surge junto (1 direção basta, ex.: citta → cittaja-rūpa). Aññamañña: subconjunto de Sahajāta com apoio MÚTUO (como 3 varas de tripé: citta ↔ cetasikas, 4 mahābhūtas entre si). Nissaya: suporte (inclui tanto sahajāta-nissaya quanto purejāta-nissaya, como a base física pré-nascida).",
              "Sahajāta: arises together (one-way suffices, e.g., citta → cittaja-rūpa). Aññamañña: subset of Sahajāta with MUTUAL support (like 3 tripod sticks: citta ↔ cetasikas, 4 mahābhūtas mutually). Nissaya: foundation/support (includes both conascent and prenascence support, e.g., physical base).",
              "Sahajāta: surge junto (basta una dirección, ej.: citta → cittaja-rūpa). Aññamañña: subconjunto de Sahajāta con apoyo MUTUO (como 3 varas de trípode: citta ↔ cetasikas, 4 mahābhūtas entre sí). Nissaya: soporte (incluye tanto conaciente como prenacido, ej.: base física)."),
            {"as": "VIII.17", "cma": "VIII §18–20", "segId": 677},
        ),
        _card(
            "c8.conf_anantara_samanantara_upanissaya", 8, "paccaya", "structure", "confusable",
            ["c8.pat_04", "c8.pat_05", "c8.pat_09"],
            "Anantara vs. Samanantara vs. Upanissaya",
            CAT_CONF,
            T("Confundíveis: qual é a diferença entre Anantara, Samanantara e Upanissaya (e seus 3 tipos)?",
              "Confusables: what is the difference between Anantara, Samanantara, and Upanissaya (and its 3 kinds)?",
              "Confundibles: ¿cuál es la diferencia entre Anantara, Samanantara y Upanissaya (y sus 3 tipos)?"),
            T("Anantara e Samanantara têm o mesmo alcance real (cada citta cessando dá lugar sem intervalo ao seguinte; só diferem na ênfase verbal). Upanissaya é apoio decisivo/poderoso em 3 modos: ārammaṇūpanissaya (objeto forte), anantarūpanissaya (imediatamente anterior) e pakatūpanissaya (suporte natural à distância no tempo).",
              "Anantara and Samanantara have identical real scope (each ceasing citta immediately gives way to the next; differing only in verbal nuance). Upanissaya is decisive support in 3 modes: ārammaṇūpanissaya (strong object), anantarūpanissaya (immediately preceding), and pakatūpanissaya (natural decisive support across time).",
              "Anantara y Samanantara tienen igual alcance real (cada citta al cesar da paso sin intervalo al siguiente; solo difieren en matiz verbal). Upanissaya es apoyo decisivo en 3 modos: ārammaṇūpanissaya (objeto fuerte), anantarūpanissaya (inmediatamente anterior) y pakatūpanissaya (apoyo natural a distancia en el tiempo)."),
            {"as": "VIII.22", "cma": "VIII §17 & §22", "segId": 681},
        ),
        _card(
            "c9.conf_nimitta_3", 9, "kammatthana", "structure", "confusable",
            ["c9.nimitta_bhavana_3"],
            "Parikamma vs. Uggaha vs. Paṭibhāga-nimitta",
            CAT_CONF,
            T("Confundíveis: diferencie os 3 sinais meditativos (Nimitta) em Samatha quanto à estabilidade, defeitos e relação com o jhāna.",
              "Confusables: distinguish the 3 meditative signs (Nimitta) in Samatha regarding stability, flaws, and relation to jhāna.",
              "Confundibles: distinga los 3 signos meditativos (Nimitta) en Samatha respecto a estabilidad, defectos y relación con el jhāna."),
            T("Parikamma-nimitta: o objeto inicial bruto (ex.: disco físico de argila). Uggaha-nimitta: cópia mental exata vista com olhos fechados, ainda com imperfeições. Paṭibhāga-nimitta: sinal de contrapartida purificado, luminoso e conceitual (paññatti) que sustenta upacāra e appanā (jhāna).",
              "Parikamma-nimitta: the raw preliminary object (e.g., physical clay disk). Uggaha-nimitta: exact mental replica seen with eyes closed, still carrying flaws. Paṭibhāga-nimitta: purified, luminous conceptual counterpart sign (paññatti) supporting upacāra and appanā (jhāna).",
              "Parikamma-nimitta: el objeto preliminar bruto (ej.: disco físico de arcilla). Uggaha-nimitta: réplica mental exacta vista con ojos cerrados, aún con imperfecciones. Paṭibhāga-nimitta: signo de contrapartida purificado, luminoso y conceptual (paññatti) que sostiene upacāra y appanā (jhāna)."),
            {"as": "IX.18", "cma": "IX §18", "segId": 737},
        ),
    ])

    # ══════════════════════════════════════════════════════════════════════════
    # 5. COMPLETE CONCEPTUAL & MATHEMATICAL LIST COVERAGE (Ch. 5, 6, 7, 9)
    # ══════════════════════════════════════════════════════════════════════════
    cards.extend([
        # ── Ch. 5: 16 Rūpa planes (3+3+3+7), 4 Paṭisandhis, 4 Death causes ────
        _card(
            "c5.math_rupa16_planes", 5, "vithimutta", "structure", "checksum",
            ["c5.bhumi_rupa_arupa"],
            "16 Rūpa-bhūmi = 3 + 3 + 3 + 7",
            CAT_CHK,
            T("Estrutura matemática dos 16 planos Rūpāvacara: como a regra 3 + 3 + 3 + 7 organiza os planos por jhāna e quais são os 5 Suddhāvāsa?",
              "Mathematical structure of the 16 Rūpāvacara planes: how does the 3 + 3 + 3 + 7 rule organize them by jhāna, and what are the 5 Suddhāvāsa?",
              "Estructura matemática de los 16 planos Rūpāvacara: ¿cómo los organiza la regla 3 + 3 + 3 + 7 por jhāna y cuáles son los 5 Suddhāvāsa?"),
            T("1º jhāna (3): Brahmapārisajja, Brahmapurohita, Mahābrahmā | 2º (3): Parittābha, Appamāṇābha, Ābhassara | 3º (3): Parittasubha, Appamāṇasubha, Subhakiṇha | 4º (7): Vehapphala + Asaññasatta + 5 Suddhāvāsa (Avihā, Atappā, Sudassā, Sudassī, Akaniṭṭhā).",
              "1st jhāna (3): Brahmapārisajja, Brahmapurohita, Mahābrahmā | 2nd (3): Parittābha, Appamāṇābha, Ābhassara | 3rd (3): Parittasubha, Appamāṇasubha, Subhakiṇha | 4th (7): Vehapphala + Asaññasatta + 5 Suddhāvāsa (Avihā, Atappā, Sudassā, Sudassī, Akaniṭṭhā).",
              "1.er jhāna (3): Brahmapārisajja, Brahmapurohita, Mahābrahmā | 2.º (3): Parittābha, Appamāṇābha, Ābhassara | 3.er (3): Parittasubha, Appamāṇasubha, Subhakiṇha | 4.º (7): Vehapphala + Asaññasatta + 5 Suddhāvāsa (Avihā, Atappā, Sudassā, Sudassī, Akaniṭṭhā)."),
            {"as": "V.4", "cma": "V §5", "segId": 368},
        ),
        _card(
            "c5.math_patisandhi_4_and_death_4", 5, "vithimutta", "structure", "checksum",
            ["c5.bhumi_apaya", "c5.bhumi_kamasugati", "c5.bhumi_rupa_arupa"],
            T("4 Paṭisandhi (19 Cittas) · 4 Causas de Morte", "4 Paṭisandhi (19 Cittas) · 4 Causes of Death", "4 Paṭisandhi (19 Cittas) · 4 Causas de Muerte"),
            CAT_CHK,
            T("Quais são os 4 tipos de religação (Paṭisandhi) com a soma exata dos 19 cittas (1 + 9 + 5 + 4), e quais são as 4 causas de morte (Maraṇuppatti)?",
              "What are the 4 kinds of rebirth-linking (Paṭisandhi) summing the 19 cittas (1 + 9 + 5 + 4), and what are the 4 causes of death (Maraṇuppatti)?",
              "¿Cuáles son los 4 tipos de reconexión (Paṭisandhi) sumando los 19 cittas (1 + 9 + 5 + 4), y cuáles son las 4 causas de muerte (Maraṇuppatti)?"),
            T("4 Paṭisandhi: Apāya (1 santīraṇa akusala) + Kāmasugati (1 santīraṇa kusala + 8 mahāvipāka = 9) + Rūpāvacara (5 rūpavipāka) + Arūpāvacara (4 arūpavipāka) = 19. 4 mortes: Āyukkhaya (fim da vida), Kammakkhaya (fim do kamma), Ubhayakkhaya (ambos) e Upacchedaka (kamma destrutivo).",
              "4 Paṭisandhi: Apāya (1 unwholesome santīraṇa) + Kāmasugati (1 wholesome santīraṇa + 8 mahāvipāka = 9) + Rūpāvacara (5 rūpavipāka) + Arūpāvacara (4 arūpavipāka) = 19. 4 deaths: Āyukkhaya (lifespan), Kammakkhaya (kamma), Ubhayakkhaya (both), Upacchedaka (destructive kamma).",
              "4 Paṭisandhi: Apāya (1) + Kāmasugati (1+8=9) + Rūpāvacara (5) + Arūpāvacara (4) = 19. 4 muertes: Āyukkhaya (fin de vida), Kammakkhaya (fin de kamma), Ubhayakkhaya (ambos) y Upacchedaka (kamma destructivo)."),
            {"as": "V.9", "cma": "V §9 & §34", "segId": 376},
        ),
        _card(
            "c5.enum_kammapatha_10_punna_10", 5, "vithimutta", "structure", "enumeration",
            ["c5.kamma_kicca_4"],
            "10 Akusalakammapatha · 10 Puññakiriyavatthu",
            CAT_ENUM,
            T("Como se decompõem matematicamente os 10 cursos de ação inábil (3 + 4 + 3 = 10) e as 10 bases de ação meritória (Puññakiriyavatthu)?",
              "How do the 10 unwholesome courses of action decompose (3 + 4 + 3 = 10), and what are the 10 bases of meritorious action (Puññakiriyavatthu)?",
              "¿Cómo se descomponen los 10 cursos de acción inhábil (3 + 4 + 3 = 10) y cuáles son las 10 bases de acción meritoria (Puññakiriyavatthu)?"),
            T("10 Akusala: 3 corporais (matar, roubar, má conduta sexual) + 4 verbais (mentira, calúnia, fala áspera, futilidade) + 3 mentais (cobiça, má vontade, visão errônea). 10 Méritos: dāna, sīla, bhāvanā, apacāyana, veyyāvacca, pattidāna, pattānumodanā, dhammassavana, dhammadesanā, diṭṭhijukamma.",
              "10 Unwholesome: 3 bodily (killing, stealing, sexual misconduct) + 4 verbal (lying, slander, harsh speech, idle chatter) + 3 mental (covetousness, ill will, wrong view). 10 Meritorious: dāna, sīla, bhāvanā, reverence, service, sharing merit, rejoicing in merit, hearing Dhamma, teaching Dhamma, straightening views.",
              "10 Inhábiles: 3 corporales + 4 verbales + 3 mentales. 10 Meritorias: dāna, sīla, bhāvanā, reverencia, servicio, compartir mérito, regocijo, oír Dhamma, enseñar Dhamma, rectificar la visión."),
            {"as": "V.22", "cma": "V §22–24", "segId": 419},
            checklist=[
                T("3 corporais + 4 verbais + 3 mentais = 10 Akusalakammapatha", "3 bodily + 4 verbal + 3 mental = 10 Akusalakammapatha", "3 corporales + 4 verbales + 3 mentales = 10 Akusalakammapatha"),
                T("Dāna · Sīla · Bhāvanā (3 raízes do mérito)", "Dāna · Sīla · Bhāvanā (3 roots of merit)", "Dāna · Sīla · Bhāvanā (3 raíces del mérito)"),
                T("Apacāyana · Veyyāvacca · Pattidāna · Pattānumodanā (4 sociais)", "Apacāyana · Veyyāvacca · Pattidāna · Pattānumodanā (4 social)", "Apacāyana · Veyyāvacca · Pattidāna · Pattānumodanā (4 sociales)"),
                T("Dhammassavana · Dhammadesanā · Diṭṭhijukamma (3 de sabedoria)", "Dhammassavana · Dhammadesanā · Diṭṭhijukamma (3 wisdom)", "Dhammassavana · Dhammadesanā · Diṭṭhijukamma (3 de sabiduría)"),
            ],
        ),
        # ── Ch. 6: Rūpavibhāga progression (5,6,7,8,12) & 21 Kalāpas formula ──
        _card(
            "c6.math_rupavibhaga_progression", 6, "rupa", "structure", "checksum",
            ["c6.rupa_01", "c6.rupa_05", "c6.rupa_16"],
            "Rūpavibhāga: 5 · 6 · 7 · 8 · 12 (vs. 28)",
            CAT_CHK,
            T("Estrutura matemática das classificações duplas (Rūpavibhāga): qual progressão crescente (5, 6, 7, 8, 12) gera Ajjhattika, Vatthu, Dvāra, Indriya e Oḷārika sobre os 28 rūpas?",
              "Mathematical structure of the twofold classifications (Rūpavibhāga): how does the ascending sequence (5, 6, 7, 8, 12) generate Ajjhattika, Vatthu, Dvāra, Indriya, and Oḷārika out of 28 rūpas?",
              "Estructura matemática del Rūpavibhāga: ¿cómo genera la secuencia creciente (5, 6, 7, 8, 12) Ajjhattika, Vatthu, Dvāra, Indriya y Oḷārika sobre los 28 rūpas?"),
            T("5 Ajjhattika (5 pasādas) → +1 Hadaya = 6 Vatthu → +2 Viññatti (sem Hadaya) = 7 Dvāra → 5 Pasāda + 2 Bhāva + 1 Jīvita = 8 Indriya → 5 Pasāda + 7 objetos (4 gocara + 3 bhūta) = 12 Oḷārika (e 16 Sukhuma). Cada par soma exatamente 28!",
              "5 Ajjhattika (5 pasādas) → +1 Hadaya = 6 Vatthu → 5 Pasāda + 2 Viññatti = 7 Dvāra → 5 Pasāda + 2 Bhāva + 1 Jīvita = 8 Indriya → 5 Pasāda + 7 sense-objects (4 gocara + 3 bhūta) = 12 Oḷārika (and 16 Sukhuma). Every pair sums to 28!",
              "5 Ajjhattika (5 pasādas) → +1 Hadaya = 6 Vatthu → 5 Pasāda + 2 Viññatti = 7 Dvāra → 5 Pasāda + 2 Bhāva + 1 Jīvita = 8 Indriya → 5 Pasāda + 7 objetos = 12 Oḷārika (y 16 Sukhuma). ¡Cada par suma 28!"),
            {"as": "VI.6", "cma": "VI §6", "segId": 502},
        ),
        _card(
            "c6.math_kalapa_21_formula", 6, "rupa", "structure", "enumeration",
            ["c6.rupa_samutthana_4"],
            T("21 Kalāpas = 9 + 6 + 4 + 2 (Núcleo 8 + extras)", "21 Kalāpas = 9 + 6 + 4 + 2 (8-Core + extras)", "21 Kalāpas = 9 + 6 + 4 + 2 (Núcleo 8 + extras)"),
            CAT_ENUM,
            T("Como são construídos os 21 Kalāpas a partir do núcleo Suddhaṭṭhaka (8 inseparáveis) nas 4 origens: 9 Kammaja + 6 Cittaja + 4 Utuja + 2 Āhāraja?",
              "How are the 21 Kalāpas constructed from the Suddhaṭṭhaka core (8 inseparables) across the 4 origins: 9 Kammaja + 6 Cittaja + 4 Utuja + 2 Āhāraja?",
              "¿Cómo se construyen los 21 Kalāpas a partir del núcleo Suddhaṭṭhaka (8 inseparables) en los 4 orígenes: 9 Kammaja + 6 Cittaja + 4 Utuja + 2 Āhāraja?"),
            T("Todo kalāpa contém os 8 inseparáveis (4 bhūtas + cor + odor + sabor + ojā). Kammaja (9): 8 + jīvita (nono) + {5 pasāda, 2 bhāva, 1 hadaya, 1 só jīvita} = 9. Cittaja (6): puro, +kāyaviññatti, +vacīviññatti+som, e os 3 com +3 vikāras. Utuja (4): puro, +som, e os 2 com +3 vikāras. Āhāraja (2): puro e +3 vikāras.",
              "Every kalāpa contains the 8 inseparables (4 bhūtas + color + odor + taste + ojā). Kammaja (9): 8 + life + {5 pasāda, 2 sex, 1 heart, 1 life-only} = 9. Cittaja (6): pure, +bodily intimation, +vocal+sound, plus 3 with +3 vikāras. Utuja (4): pure, +sound, plus 2 with +3 vikāras. Āhāraja (2): pure and +3 vikāras.",
              "Todo kalāpa lleva los 8 inseparables. Kammaja (9): 8+vida+{5 pasāda, 2 sexo, 1 corazón, 1 solo vida}. Cittaja (6): puro, +kāyaviññatti, +vacī+sonido, y los 3 con +3 vikāras. Utuja (4): puro, +sonido, y los 2 con +3 vikāras. Āhāraja (2): puro y +3 vikāras."),
            {"as": "VI.17", "cma": "VI §16–20", "segId": 530},
            checklist=[
                T("9 Kammaja = 8 inseparáveis + jīvita + (5 pasāda, 2 bhāva, 1 hadaya, 1 jīvita puro)", "9 Kammaja = 8 inseparables + life + (5 pasāda, 2 sex, 1 heart, 1 life-only)", "9 Kammaja = 8 inseparables + vida + (5 pasāda, 2 sexo, 1 corazón, 1 solo vida)"),
                T("6 Cittaja = 3 bases (puro, kāyaviññatti, vacīviññatti+som) × 2 (com/sem 3 vikāras)", "6 Cittaja = 3 bases (pure, bodily, vocal+sound) × 2 (with/without 3 vikāras)", "6 Cittaja = 3 bases × 2 (con/sin 3 vikāras)"),
                T("4 Utuja = 2 bases (puro, som) × 2 (com/sem 3 vikāras)", "4 Utuja = 2 bases (pure, sound) × 2 (with/without 3 vikāras)", "4 Utuja = 2 bases (puro, sonido) × 2 (con/sin 3 vikāras)"),
                T("2 Āhāraja = 1 base (puro) × 2 (com/sem 3 vikāras)", "2 Āhāraja = 1 base (pure) × 2 (with/without 3 vikāras)", "2 Āhāraja = 1 base (puro) × 2 (con/sin 3 vikāras)"),
            ],
        ),
        # ── Ch. 7: 9 Akusala groups & 7 Missaka groups ────────────────────────
        _card(
            "c7.math_akusala9_missaka7", 7, "samuccaya", "structure", "enumeration",
            ["c7.asava_ogha_yoga_4", "c7.nivarana_6", "c7.samyojana_10", "c7.kilesa_10"],
            "9 Akusala (4·4·4·4·4·6·7·10·10) · 7 Missaka",
            CAT_ENUM,
            T("Quais são os 9 grupos da seção Akusala (com seus tamanhos 4·4·4·4·4·6·7·10·10) e os 7 grupos da seção Missaka (6·7·12·22·9·4·4)?",
              "What are the 9 groups of the Akusala section (sizes 4·4·4·4·4·6·7·10·10) and the 7 groups of the Missaka section (6·7·12·22·9·4·4)?",
              "¿Cuáles son los 9 grupos de la sección Akusala (4·4·4·4·4·6·7·10·10) y los 7 grupos de la sección Missaka (6·7·12·22·9·4·4)?"),
            T("9 Akusala: 4 Āsava = 4 Ogha = 4 Yoga (idênticos!) · 4 Gantha · 4 Upādāna · 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa. 7 Missaka: 6 Hetu · 7 Jhānaṅga · 12 Maggaṅga (8 retos + 4 errôneos) · 22 Indriya · 9 Bala · 4 Adhipati · 4 Āhāra.",
              "9 Akusala: 4 Āsava = 4 Ogha = 4 Yoga (identical!) · 4 Gantha · 4 Upādāna · 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa. 7 Missaka: 6 Hetu · 7 Jhānaṅga · 12 Maggaṅga (8 right + 4 wrong) · 22 Indriya · 9 Bala · 4 Adhipati · 4 Āhāra.",
              "9 Akusala: 4 Āsava = 4 Ogha = 4 Yoga (¡idénticos!) · 4 Gantha · 4 Upādāna · 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa. 7 Missaka: 6 Hetu · 7 Jhānaṅga · 12 Maggaṅga · 22 Indriya · 9 Bala · 4 Adhipati · 4 Āhāra."),
            {"as": "VII.2", "cma": "VII §2–23", "segId": 580},
            checklist=[
                T("5 grupos de 4: Āsava · Ogha · Yoga (idênticos) · Gantha · Upādāna", "5 groups of 4: Āsava · Ogha · Yoga (identical) · Gantha · Upādāna", "5 grupos de 4: Āsava · Ogha · Yoga (idénticos) · Gantha · Upādāna"),
                T("4 grupos maiores: 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa", "4 larger groups: 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa", "4 grupos mayores: 6 Nīvaraṇa · 7 Anusaya · 10 Saṃyojana · 10 Kilesa"),
                P("7 Missaka: 6 Hetu · 7 Jhānaṅga · 12 Maggaṅga · 22 Indriya · 9 Bala · 4 Adhipati · 4 Āhāra"),
            ],
        ),
        # ── Ch. 9: 6 Caritas, Sappāyabheda=40, Jhāna map=40, 5 Vasitā/Abhiññā, 8 Ariyas ─
        _card(
            "c9.math_carita6_jhana_map40", 9, "kammatthana", "structure", "checksum",
            ["c9.samatha_40"],
            "6 Caritas · 40 = 10+11+3+1+11+4 (Jhānas)",
            CAT_CHK,
            T("Quais são os 6 temperamentos (Carita) e como os 40 objetos de Samatha fecham a soma por nível de concentração alcançável (upacāra vs. jhānas)?",
              "What are the 6 temperaments (Carita), and how do the 40 Samatha subjects sum by attainable concentration level (upacāra vs. jhānas)?",
              "¿Cuáles son los 6 temperamentos (Carita) y cómo suman los 40 objetos de Samatha según el nivel de concentración alcanzable?"),
            T("6 Caritas: Rāga, Dosa, Moha, Saddhā, Buddhi, Vitakka. Mapa dos 40 por jhāna: 10 só upacāra (8 anussati + āhāre + catudhātu) + 11 só 1º jhāna (10 asubha + kāyagatāsati) + 3 jhānas 1–4 (mettā, karuṇā, muditā) + 1 só 5º jhāna (upekkhā) + 11 todos os 5 jhānas (10 kasiṇa + ānāpānasati) + 4 arūpa = 40.",
              "6 Caritas: Rāga, Dosa, Moha, Saddhā, Buddhi, Vitakka. Map of 40 by jhāna: 10 upacāra-only + 11 1st-jhāna-only (10 asubha + kāyagatāsati) + 3 jhānas 1–4 (mettā, karuṇā, muditā) + 1 5th-jhāna-only (upekkhā) + 11 all 5 jhānas (10 kasiṇa + ānāpānasati) + 4 arūpa = 40.",
              "6 Caritas: Rāga, Dosa, Moha, Saddhā, Buddhi, Vitakka. Mapa de 40: 10 solo upacāra + 11 solo 1.er jhāna + 3 jhānas 1–4 + 1 solo 5.º jhāna + 11 los 5 jhānas + 4 arūpa = 40."),
            {"as": "IX.17", "cma": "IX §14–17", "segId": 730},
        ),
        _card(
            "c9.enum_vasita5_abhinna5_ariya8", 9, "kammatthana", "structure", "enumeration",
            ["c9.visuddhi_5_7", "c9.vimokkha_3_and_nirodha"],
            T("5 Vasitā · 5 Abhiññā · 4 Pares (8 Ariyapuggalas)", "5 Vasitā · 5 Abhiññā · 4 Pairs (8 Ariyapuggalas)", "5 Vasitā · 5 Abhiññā · 4 Pares (8 Ariyapuggalas)"),
            CAT_ENUM,
            T("Liste as 5 Maestrias (Vasitā), os 5 Conhecimentos Diretos mundanos (Abhiññā) e os 4 pares / 8 indivíduos nobres (Ariyapuggala).",
              "List the 5 Masteries (Vasitā), the 5 mundane Direct Knowledges (Abhiññā), and the 4 pairs / 8 noble individuals (Ariyapuggala).",
              "Enumere las 5 Maestrías (Vasitā), los 5 Conocimientos Directos mundanos (Abhiññā) y los 4 pares / 8 individuos nobles (Ariyapuggala)."),
            T("5 Vasitā: Āvajjana (advertir), Samāpajjana (entrar), Adhiṭṭhāna (determinar duração), Vuṭṭhāna (sair), Paccavekkhaṇa (revisar). 5 Abhiññā: Iddhividha, Dibbasota, Paracittavijānana, Pubbenivāsānussati, Dibbacakkhu. 8 Ariyas = 4 caminhos (magga) + 4 frutos (phala): Sotāpanna, Sakadāgāmī, Anāgāmī, Arahat.",
              "5 Vasitā: Āvajjana (adverting), Samāpajjana (entering), Adhiṭṭhāna (resolving duration), Vuṭṭhāna (emerging), Paccavekkhaṇa (reviewing). 5 Abhiññā: Iddhividha, Dibbasota, Paracittavijānana, Pubbenivāsānussati, Dibbacakkhu. 8 Ariyas = 4 paths + 4 fruits: Sotāpanna, Sakadāgāmī, Anāgāmī, Arahat.",
              "5 Vasitā: Āvajjana, Samāpajjana, Adhiṭṭhāna, Vuṭṭhāna, Paccavekkhaṇa. 5 Abhiññā: Iddhividha, Dibbasota, Paracittavijānana, Pubbenivāsānussati, Dibbacakkhu. 8 Ariyas = 4 caminos + 4 frutos: Sotāpanna, Sakadāgāmī, Anāgāmī, Arahat."),
            {"as": "IX.21", "cma": "IX §20–21 & §42", "segId": 763},
            checklist=[
                P("5 Vasitā: Āvajjana · Samāpajjana · Adhiṭṭhāna · Vuṭṭhāna · Paccavekkhaṇa"),
                P("5 Abhiññā: Iddhividha · Dibbasota · Paracittavijānana · Pubbenivāsānussati · Dibbacakkhu"),
                P("4×2 = 8 Ariyapuggala: Sotāpanna · Sakadāgāmī · Anāgāmī · Arahat (Magga & Phala)"),
            ],
        ),
    ])

    return cards


def _citta_math(idx: int) -> dict[str, str]:
    """Coordenadas matemáticas exatas do citta #1..#89 na arquitetura combinatória."""
    if 1 <= idx <= 8:
        k = idx - 1
        ved = "Somanassa" if k < 4 else "Upekkhā"
        dit = "Diṭṭhi+" if (k % 4) < 2 else "Diṭṭhi−"
        san = "Asaṅkhārika" if (k % 2) == 0 else "Sasaṅkhārika"
        return T(
            f"Matriz 2×2×2 = 8 Lobhamūla · bit [{ved} · {dit} · {san}] → #{idx}/8 (em 12 Akusala = 8+2+2; 54 Kāma = 12+18+24).",
            f"2×2×2 = 8 Lobhamūla cube · bits [{ved} · {dit} · {san}] → #{idx}/8 (in 12 Akusala = 8+2+2; 54 Kāma = 12+18+24).",
            f"Matriz 2×2×2 = 8 Lobhamūla · bits [{ved} · {dit} · {san}] → #{idx}/8 (en 12 Akusala = 8+2+2; 54 Kāma = 12+18+24).",
        )
    if 9 <= idx <= 10:
        san = "Asaṅkhārika" if idx == 9 else "Sasaṅkhārika"
        return T(
            f"Par 1×1×2 = 2 Dosamūla · [Domanassa · Paṭigha · {san}] → #{idx-8}/2 (em 12 Akusala = 8+2+2).",
            f"1×1×2 = 2 Dosamūla pair · [Domanassa · Paṭigha · {san}] → #{idx-8}/2 (in 12 Akusala = 8+2+2).",
            f"Par 1×1×2 = 2 Dosamūla · [Domanassa · Paṭigha · {san}] → #{idx-8}/2 (en 12 Akusala = 8+2+2).",
        )
    if 11 <= idx <= 12:
        fac = "Vicikicchā" if idx == 11 else "Uddhacca"
        return T(
            f"Par 1×2×1 = 2 Mohamūla · [Upekkhā · {fac} · sempre asaṅkhārika] → #{idx-10}/2 (em 12 Akusala = 8+2+2).",
            f"1×2×1 = 2 Mohamūla pair · [Upekkhā · {fac} · always unprompted] → #{idx-10}/2 (in 12 Akusala = 8+2+2).",
            f"Par 1×2×1 = 2 Mohamūla · [Upekkhā · {fac} · siempre asaṅkhārika] → #{idx-10}/2 (en 12 Akusala = 8+2+2).",
        )
    if 13 <= idx <= 19:
        return T(
            f"Ahetuka 18 = 7 + 8 + 3 · posição #{idx-12}/7 de Akusalavipāka (espelho de 8 Kusalavipāka sem o 2º santīraṇa).",
            f"Ahetuka 18 = 7 + 8 + 3 · slot #{idx-12}/7 of Akusalavipāka (mirror of 8 Kusalavipāka minus the 2nd santīraṇa).",
            f"Ahetuka 18 = 7 + 8 + 3 · posición #{idx-12}/7 de Akusalavipāka (espejo de 8 Kusalavipāka sin el 2.º santīraṇa).",
        )
    if 20 <= idx <= 27:
        return T(
            f"Ahetuka 18 = 7 + 8 + 3 · posição #{idx-19}/8 de Kusalavipāka (espelho dos 7 + 1 santīraṇa somanassa).",
            f"Ahetuka 18 = 7 + 8 + 3 · slot #{idx-19}/8 of Kusalavipāka (mirror of the 7 + 1 somanassa santīraṇa).",
            f"Ahetuka 18 = 7 + 8 + 3 · posición #{idx-19}/8 de Kusalavipāka (espejo de los 7 + 1 santīraṇa somanassa).",
        )
    if 28 <= idx <= 30:
        return T(
            f"Ahetuka 18 = 7 + 8 + 3 · posição #{idx-27}/3 de Ahetuka-kiriya (2 āvajjana + 1 hasituppāda).",
            f"Ahetuka 18 = 7 + 8 + 3 · slot #{idx-27}/3 of Ahetuka-kiriya (2 āvajjana + 1 hasituppāda).",
            f"Ahetuka 18 = 7 + 8 + 3 · posición #{idx-27}/3 de Ahetuka-kiriya (2 āvajjana + 1 hasituppāda).",
        )
    if 31 <= idx <= 54:
        cls_idx = (idx - 31) // 8
        cls_name = ("Mahākusala", "Mahāvipāka", "Mahākiriya")[cls_idx]
        k = (idx - 31) % 8
        ved = "Somanassa" if k < 4 else "Upekkhā"
        nan = "Ñāṇa+" if (k % 4) < 2 else "Ñāṇa−"
        san = "Asaṅkhārika" if (k % 2) == 0 else "Sasaṅkhārika"
        return T(
            f"Matriz 3×(2×2×2) = 24 Kāmasobhana · [{cls_name} · {ved} · {nan} · {san}] → #{k+1}/8.",
            f"3×(2×2×2) = 24 Kāmasobhana cube · [{cls_name} · {ved} · {nan} · {san}] → #{k+1}/8.",
            f"Matriz 3×(2×2×2) = 24 Kāmasobhana · [{cls_name} · {ved} · {nan} · {san}] → #{k+1}/8.",
        )
    if 55 <= idx <= 69:
        cls_idx = (idx - 55) // 5
        cls_name = ("Kusala", "Vipāka", "Kiriya")[cls_idx]
        jh = (idx - 55) % 5 + 1
        facs = ("5 (Vi·Vc·Pī·Su·Ek)", "4 (−Vi)", "3 (−Vc)", "2 (−Pī)", "2 (Su→Up)")[jh - 1]
        return T(
            f"Matriz 3×5 = 15 Rūpāvacara · [{cls_name} · {jh}º jhāna] · subtração progressiva: {facs}.",
            f"3×5 = 15 Rūpāvacara grid · [{cls_name} · jhāna {jh}] · progressive subtraction: {facs}.",
            f"Matriz 3×5 = 15 Rūpāvacara · [{cls_name} · {jh}.º jhāna] · resta progresiva: {facs}.",
        )
    if 70 <= idx <= 81:
        cls_idx = (idx - 70) // 4
        cls_name = ("Kusala", "Vipāka", "Kiriya")[cls_idx]
        obj = (idx - 70) % 4 + 1
        return T(
            f"Matriz 3×4 = 12 Arūpāvacara · [{cls_name} · objeto #{obj}/4] · fatores fixos do 5º jhāna (Upekkhā + Ekaggatā).",
            f"3×4 = 12 Arūpāvacara grid · [{cls_name} · object #{obj}/4] · fixed 5th-jhāna factors (Upekkhā + Ekaggatā).",
            f"Matriz 3×4 = 12 Arūpāvacara · [{cls_name} · objeto #{obj}/4] · factores fijos del 5.º jhāna (Upekkhā + Ekaggatā).",
        )
    if 82 <= idx <= 89:
        kind = "Magga (Kusala)" if idx <= 85 else "Phala (Vipāka)"
        stage = (idx - 82) % 4 + 1
        return T(
            f"Matriz 2×4 = 8 Lokuttara (×5 jhānas = 40 → 121 cittas) · [{kind} · estágio #{stage}/4].",
            f"2×4 = 8 Lokuttara grid (×5 jhānas = 40 → 121 cittas) · [{kind} · stage #{stage}/4].",
            f"Matriz 2×4 = 8 Lokuttara (×5 jhānas = 40 → 121 cittas) · [{kind} · etapa #{stage}/4].",
        )
    return P("89 = 54 + 15 + 12 + 8 (121 = 89 + 32)")


def _cetasika_math(idx: int) -> dict[str, str]:
    if 1 <= idx <= 7:
        return T(
            f"Partição 52 = 7 + 6 + 14 + 25 · Universal #{idx}/7 (presente em 100% dos 89/121 cittas).",
            f"Partition 52 = 7 + 6 + 14 + 25 · Universal #{idx}/7 (present in 100% of all 89/121 cittas).",
            f"Partición 52 = 7 + 6 + 14 + 25 · Universal #{idx}/7 (presente en el 100% de los 89/121 cittas).",
        )
    if 8 <= idx <= 13:
        return T(
            f"Partição 52 = 7 + 6 + 14 + 25 · Ocasional (Pakiṇṇaka) #{idx-7}/6 (em 13 Aññasamāna = 7+6).",
            f"Partition 52 = 7 + 6 + 14 + 25 · Occasional (Pakiṇṇaka) #{idx-7}/6 (in 13 Aññasamāna = 7+6).",
            f"Partición 52 = 7 + 6 + 14 + 25 · Ocasional (Pakiṇṇaka) #{idx-7}/6 (en 13 Aññasamāna = 7+6).",
        )
    if 14 <= idx <= 27:
        if idx <= 17:
            sub = f"Moha-catukka #{idx-13}/4 (em todos os 12 akusalas)"
            sub_en = f"Moha-catukka #{idx-13}/4 (in all 12 akusala cittas)"
            sub_es = f"Moha-catukka #{idx-13}/4 (en los 12 akusala cittas)"
        elif idx <= 20:
            sub = f"Lobha-tika #{idx-17}/3"
            sub_en = f"Lobha-tika #{idx-17}/3"
            sub_es = f"Lobha-tika #{idx-17}/3"
        elif idx <= 24:
            sub = f"Dosa-catukka #{idx-20}/4"
            sub_en = f"Dosa-catukka #{idx-20}/4"
            sub_es = f"Dosa-catukka #{idx-20}/4"
        elif idx <= 26:
            sub = f"Par Thīna-Middha #{idx-24}/2 (só nos 5 sasaṅkhārika)"
            sub_en = f"Thīna-Middha pair #{idx-24}/2 (only in the 5 prompted akusalas)"
            sub_es = f"Par Thīna-Middha #{idx-24}/2 (solo en los 5 sasaṅkhārika)"
        else:
            sub = "Isolado #1/1 (só no mohamūla de vicikicchā)"
            sub_en = "Single #1/1 (only in doubt-rooted mohamūla)"
            sub_es = "Único #1/1 (solo en mohamūla de vicikicchā)"
        return T(
            f"14 Akusala = 4 + 3 + 4 + 2 + 1 · {sub}.",
            f"14 Akusala = 4 + 3 + 4 + 2 + 1 · {sub_en}.",
            f"14 Akusala = 4 + 3 + 4 + 2 + 1 · {sub_es}.",
        )
    if 28 <= idx <= 34:
        return T(
            f"25 Sobhana = 19 (7 + 6×2 pares) + 3 + 2 + 1 · Individual #{idx-27}/7 de Sobhanasādhāraṇa.",
            f"25 Sobhana = 19 (7 + 6×2 pairs) + 3 + 2 + 1 · Individual #{idx-27}/7 of Sobhanasādhāraṇa.",
            f"25 Sobhana = 19 (7 + 6×2 pares) + 3 + 2 + 1 · Individual #{idx-27}/7 de Sobhanasādhāraṇa.",
        )
    if 35 <= idx <= 46:
        pair_num = (idx - 35) // 2 + 1
        side = "Kāya (cetasikas)" if (idx - 35) % 2 == 0 else "Citta"
        return T(
            f"25 Sobhana = 19 (7 + 6×2 pares) + 3 + 2 + 1 · Par simétrico #{pair_num}/6 · lado {side}.",
            f"25 Sobhana = 19 (7 + 6×2 pairs) + 3 + 2 + 1 · Symmetric pair #{pair_num}/6 · {side} side.",
            f"25 Sobhana = 19 (7 + 6×2 pares) + 3 + 2 + 1 · Par simétrico #{pair_num}/6 · lado {side}.",
        )
    if 47 <= idx <= 49:
        return T(
            f"25 Sobhana = 19 + 3 Virati + 2 + 1 · Abstenção #{idx-46}/3.",
            f"25 Sobhana = 19 + 3 Virati + 2 + 1 · Abstinence #{idx-46}/3.",
            f"25 Sobhana = 19 + 3 Virati + 2 + 1 · Abstinencia #{idx-46}/3.",
        )
    if 50 <= idx <= 51:
        return T(
            f"25 Sobhana = 19 + 3 + 2 Appamaññā + 1 · Imensurável #{idx-49}/2.",
            f"25 Sobhana = 19 + 3 + 2 Appamaññā + 1 · Immeasurable #{idx-49}/2.",
            f"25 Sobhana = 19 + 3 + 2 Appamaññā + 1 · Inconmensurable #{idx-49}/2.",
        )
    return T(
        "25 Sobhana = 19 + 3 + 2 + 1 Paññā · vértice final (#52/52).",
        "25 Sobhana = 19 + 3 + 2 + 1 Paññā · final apex (#52/52).",
        "25 Sobhana = 19 + 3 + 2 + 1 Paññā · vértice final (#52/52).",
    )


def _rupa_math(idx: int) -> dict[str, str]:
    if 1 <= idx <= 18:
        if idx <= 4:
            sub = f"4 Mahābhūta (#{idx}/4)"
        elif idx <= 9:
            sub = f"5 Pasāda (#{idx-4}/5)"
        elif idx <= 13:
            sub = f"4 Gocara (#{idx-9}/4; 5º está nos 3 bhūtas)"
        elif idx <= 15:
            sub = f"2 Bhāva (#{idx-13}/2)"
        elif idx == 16:
            sub = "1 Hadayavatthu"
        elif idx == 17:
            sub = "1 Jīvitindriya"
        else:
            sub = "1 Āhāra"
        return T(
            f"28 Rūpas = 18 Nipphanna (4+5+4+2+1+1+1) + 10 Anipphanna · {sub}.",
            f"28 Rūpas = 18 Nipphanna (4+5+4+2+1+1+1) + 10 Anipphanna · {sub}.",
            f"28 Rūpas = 18 Nipphanna (4+5+4+2+1+1+1) + 10 Anipphanna · {sub}.",
        )
    if idx == 19:
        sub = "1 Pariccheda (1/1)"
    elif idx <= 21:
        sub = f"2 Viññatti ({idx-19}/2)"
    elif idx <= 24:
        sub = f"3 Vikāra ({idx-21}/3)"
    else:
        sub = f"4 Lakkhaṇa ({idx-24}/4)"
    return T(
        f"10 Anipphanna = progressão exata 1 + 2 + 3 + 4 · {sub}.",
        f"10 Anipphanna = exact arithmetic progression 1 + 2 + 3 + 4 · {sub}.",
        f"10 Anipphanna = progresión exacta 1 + 2 + 3 + 4 · {sub}.",
    )


def attach_math_structures(cards: list[dict]) -> None:
    """Anexa `mathStructure` às cartas canônicas de listas para reforçar sua construção matemática."""
    import re

    for c in cards:
        if "mathStructure" in c or c.get("axis") == "recitation":
            continue
        cid = c["id"]
        m = re.match(r"^c1\.citta_(\d+)$", cid)
        if m:
            c["mathStructure"] = _citta_math(int(m.group(1)))
            continue
        m = re.match(r"^c2\.cet_(\d+)$", cid)
        if m:
            c["mathStructure"] = _cetasika_math(int(m.group(1)))
            continue
        m = re.match(r"^c6\.rupa_(\d+)$", cid)
        if m:
            c["mathStructure"] = _rupa_math(int(m.group(1)))
            continue
        m = re.match(r"^c3\.hetu_(\d+)$", cid)
        if m:
            idx = int(m.group(1))
            pol = "3 Akusala" if idx <= 3 else "3 Sobhana (espelho de opostos)"
            pol_en = "3 Akusala" if idx <= 3 else "3 Sobhana (exact opposites)"
            pol_es = "3 Akusala" if idx <= 3 else "3 Sobhana (opuestos exactos)"
            c["mathStructure"] = T(
                f"6 Hetus = 3 + 3 espelhados (Lobha↔Alobha · Dosa↔Adosa · Moha↔Amoha) · #{idx}/6 ({pol}).",
                f"6 Hetus = 3 + 3 mirrored pairs (Lobha↔Alobha · Dosa↔Adosa · Moha↔Amoha) · #{idx}/6 ({pol_en}).",
                f"6 Hetus = 3 + 3 pares espejo (Lobha↔Alobha · Dosa↔Adosa · Moha↔Amoha) · #{idx}/6 ({pol_es}).",
            )
            continue
        m = re.match(r"^c3\.kicca_(\d+)$", cid)
        if m:
            idx = int(m.group(1))
            c["mathStructure"] = T(
                f"14 Kiccas = 10 estágios − 1 + 5 sentidos · função #{idx}/14 na ordem do ciclo vital e cognitivo.",
                f"14 Kiccas = 10 stages − 1 + 5 senses · function #{idx}/14 in life & cognitive cycle order.",
                f"14 Kiccas = 10 etapas − 1 + 5 sentidos · función #{idx}/14 en orden del ciclo vital y cognitivo.",
            )
            continue
        m = re.match(r"^c3\.(dvara|arammana|vatthu)_(\d+)$", cid)
        if m:
            idx = int(m.group(2))
            c["mathStructure"] = T(
                f"Simetria 5 sensoriais + 1 mental = 6 · item #{idx}/6 (5+1 em Dvāra, Ārammaṇa e Vatthu).",
                f"Symmetry 5 sensory + 1 mental = 6 · item #{idx}/6 (5+1 across Dvāra, Ārammaṇa, and Vatthu).",
                f"Simetría 5 sensoriales + 1 mental = 6 · elemento #{idx}/6 (5+1 en Dvāra, Ārammaṇa y Vatthu).",
            )
            continue
        if cid.startswith("c4.vithi_"):
            c["mathStructure"] = T(
                "17 momentos = 3 Bhavaṅga + 5 Porta + 7 Javana + 2 Tadārammaṇa (17 × 3 = 51 sub-instantes = 1 rūpa).",
                "17 moments = 3 Bhavaṅga + 5 Sense-door + 7 Javana + 2 Tadārammaṇa (17 × 3 = 51 sub-instants = 1 rūpa).",
                "17 momentos = 3 Bhavaṅga + 5 Puerta + 7 Javana + 2 Tadārammaṇa (17 × 3 = 51 sub-instantes = 1 rūpa).",
            )
            continue
        if cid.startswith("c5.bhumi_"):
            c["mathStructure"] = T(
                "31 planos = 11 Kāma (4+1+6) + 16 Rūpa (3+3+3+7) + 4 Arūpa.",
                "31 planes = 11 Kāma (4+1+6) + 16 Rūpa (3+3+3+7) + 4 Arūpa.",
                "31 planos = 11 Kāma (4+1+6) + 16 Rūpa (3+3+3+7) + 4 Arūpa.",
            )
            continue
        if cid.startswith("c5.kamma_"):
            c["mathStructure"] = T(
                "16 Kammas = matriz 4 × 4 (4 eixos: Função · Prioridade · Tempo · Local × 4 classes cada).",
                "16 Kammas = 4 × 4 matrix (4 axes: Function · Priority · Time · Place × 4 classes each).",
                "16 Kammas = matriz 4 × 4 (4 ejes: Función · Prioridad · Tiempo · Lugar × 4 clases c/u).",
            )
            continue
        m = re.match(r"^c8\.ps_(\d+)$", cid)
        if m:
            idx = int(m.group(1))
            if idx <= 2:
                grp = "Grupo 1 · 2 causas passadas"
                grp_en = "Group 1 · 2 past causes"
                grp_es = "Grupo 1 · 2 causas pasadas"
            elif idx <= 7:
                grp = "Grupo 2 · 5 efeitos presentes"
                grp_en = "Group 2 · 5 present effects"
                grp_es = "Grupo 2 · 5 efectos presentes"
            elif idx <= 10:
                grp = "Grupo 3 · 3 causas presentes"
                grp_en = "Group 3 · 3 present causes"
                grp_es = "Grupo 3 · 3 causas presentes"
            else:
                grp = "Grupo 4 · 2 efeitos futuros"
                grp_en = "Group 4 · 2 future effects"
                grp_es = "Grupo 4 · 2 efectos futuros"
            c["mathStructure"] = T(
                f"12 Nidānas = 2 + 5 + 3 + 2 (simetria 4×5 = 20 modos) · elo #{idx}/12 ({grp}).",
                f"12 Nidānas = 2 + 5 + 3 + 2 (4×5 = 20 modes symmetry) · link #{idx}/12 ({grp_en}).",
                f"12 Nidānas = 2 + 5 + 3 + 2 (simetría 4×5 = 20 modos) · eslabón #{idx}/12 ({grp_es}).",
            )
            continue
        m = re.match(r"^c8\.pat_(\d+)$", cid)
        if m:
            idx = int(m.group(1))
            blk = (idx - 1) // 6 + 1
            c["mathStructure"] = T(
                f"24 Paccayas = 4 blocos de 6 (bloco {blk}/4 · #{idx}/24) · soma nos 6 modos: 6+5+1+1+2+9.",
                f"24 Paccayas = 4 blocks of 6 (block {blk}/4 · #{idx}/24) · sum across 6 modes: 6+5+1+1+2+9.",
                f"24 Paccayas = 4 bloques de 6 (bloque {blk}/4 · #{idx}/24) · suma en 6 modos: 6+5+1+1+2+9.",
            )
            continue

