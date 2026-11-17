"""Chapter 1: Cittapariccheda — All 89 (and 121) Cittas individually."""

CHAPTER_META = {
    "chapter": 1,
    "paliTitle": "Cittapariccheda",
    "title": {
        "pt": "Cap. 1: Compêndio da Consciência (89 / 121 Cittas)",
        "en": "Ch. 1: Compendium of Consciousness (89 / 121 Cittas)",
        "es": "Cap. 1: Compendio de la Conciencia (89 / 121 Cittas)",
    },
    "subtitle": {
        "pt": "Mapeamento individual de todas as 89 classes (54 Kāmāvacara, 15 Rūpāvacara, 12 Arūpāvacara, 8/40 Lokuttara).",
        "en": "Individual mapping of all 89 classes (54 Kāmāvacara, 15 Rūpāvacara, 12 Arūpāvacara, 8/40 Lokuttara).",
        "es": "Mapeo individual de todas las 89 clases (54 Kāmāvacara, 15 Rūpāvacara, 12 Arūpāvacara, 8/40 Lokuttara).",
    },
    "unlockPrevAtomPct": 80,
    "houseUnlockAtomPct": 75,
}


def _kamavacara_sobhana_cards():
    """Generates all 24 Kāmāvacara Sobhana Cittas (8 Mahākusala, 8 Mahāvipāka, 8 Mahākiriya)."""
    groups = [
        (
            "Mahākusala",
            "Kāmāvacara Kusala",
            31,
            {
                "pt": "Consciência Salubre da Esfera Sensorial",
                "en": "Sense-Sphere Wholesome Consciousness",
                "es": "Conciencia Saludable de la Esfera Sensorial",
            },
            {
                "pt": "Executa ação kammicamente salubre (javana) em seres mundanos e treinantes (sekha), gerando kamma meritório capaz de produzir renascimento ditoso ou resultado sensorial.",
                "en": "Performs kammically wholesome impulsion (javana) in worldlings and trainees (sekha), generating meritorious kamma capable of producing happy rebirth or sense-sphere results.",
                "es": "Ejecuta impulsión kámicamente saludable (javana) en mundanos y aprendices (sekha), generando kamma meritorio capaz de producir renacimiento dichoso o resultado sensorial.",
            },
            29,
        ),
        (
            "Mahāvipāka",
            "Kāmāvacara Sahetuka Vipāka",
            39,
            {
                "pt": "Consciência Resultante Bela da Esfera Sensorial",
                "en": "Sense-Sphere Beautiful Resultant Consciousness",
                "es": "Conciencia Resultante Bella de la Esfera Sensorial",
            },
            {
                "pt": "Fruto passivo de Mahākusala passado; desempenha as funções de Paṭisandhi (renascimento humano/deva), Bhavaṅga (contínuo vital), Cuti (morte) e Tadārammaṇa (registro).",
                "en": "Passive fruit of past Mahākusala; performs Paṭisandhi (human/deva rebirth), Bhavaṅga (life-continuum), Cuti (death), and Tadārammaṇa (registration).",
                "es": "Fruto pasivo de Mahākusala pasado; desempeña Paṭisandhi (renacimiento humano/deva), Bhavaṅga (continuo vital), Cuti (muerte) y Tadārammaṇa (registro).",
            },
            31,
        ),
        (
            "Mahākiriya",
            "Kāmāvacara Sahetuka Kiriya",
            47,
            {
                "pt": "Consciência Funcional Bela da Esfera Sensorial",
                "en": "Sense-Sphere Beautiful Functional Consciousness",
                "es": "Conciencia Funcional Bella de la Esfera Sensorial",
            },
            {
                "pt": "Surge exclusivamente na fase de javana de Arahats (iluminados); possui todas as qualidades belas sem gerar kamma futuro.",
                "en": "Arises exclusively in the javana phase of Arahats; possesses all beautiful qualities without generating future kamma.",
                "es": "Surge exclusivamente en la fase javana de los Arahats; posee todas las cualidades bellas sin generar kamma futuro.",
            },
            33,
        ),
    ]

    combos = [
        (1, "Somanassa-sahagataṃ", "ñāṇa-sampayuttaṃ", "asaṅkhārikaṃ",
         ("alegre", "joy", "alegre"), ("associada ao conhecimento", "associated with knowledge", "asociada al conocimiento"), ("não-instigada", "unprompted", "no instigada"), 38, 33),
        (2, "Somanassa-sahagataṃ", "ñāṇa-sampayuttaṃ", "sasaṅkhārikaṃ",
         ("alegre", "joy", "alegre"), ("associada ao conhecimento", "associated with knowledge", "asociada al conocimiento"), ("instigada", "prompted", "instigada"), 38, 33),
        (3, "Somanassa-sahagataṃ", "ñāṇa-vippayuttaṃ", "asaṅkhārikaṃ",
         ("alegre", "joy", "alegre"), ("dissociada do conhecimento", "dissociated from knowledge", "disociada del conocimiento"), ("não-instigada", "unprompted", "no instigada"), 37, 32),
        (4, "Somanassa-sahagataṃ", "ñāṇa-vippayuttaṃ", "sasaṅkhārikaṃ",
         ("alegre", "joy", "alegre"), ("dissociada do conhecimento", "dissociated from knowledge", "disociada del conocimiento"), ("instigada", "prompted", "instigada"), 37, 32),
        (5, "Upekkhā-sahagataṃ", "ñāṇa-sampayuttaṃ", "asaṅkhārikaṃ",
         ("equânime", "equanimity", "ecuánime"), ("associada ao conhecimento", "associated with knowledge", "asociada al conocimiento"), ("não-instigada", "unprompted", "no instigada"), 37, 32),
        (6, "Upekkhā-sahagataṃ", "ñāṇa-sampayuttaṃ", "sasaṅkhārikaṃ",
         ("equânime", "equanimity", "ecuánime"), ("associada ao conhecimento", "associated with knowledge", "asociada al conocimiento"), ("instigada", "prompted", "instigada"), 37, 32),
        (7, "Upekkhā-sahagataṃ", "ñāṇa-vippayuttaṃ", "asaṅkhārikaṃ",
         ("equânime", "equanimity", "ecuánime"), ("dissociada do conhecimento", "dissociated from knowledge", "disociada del conocimiento"), ("não-instigada", "unprompted", "no instigada"), 36, 31),
        (8, "Upekkhā-sahagataṃ", "ñāṇa-vippayuttaṃ", "sasaṅkhārikaṃ",
         ("equânime", "equanimity", "ecuánime"), ("dissociada do conhecimento", "dissociated from knowledge", "disociada del conocimiento"), ("instigada", "prompted", "instigada"), 36, 31),
    ]

    cards = []
    for g_name, g_cat, start_num, g_title, g_func, seg_id in groups:
        for idx, p_ved, p_nana, p_sankh, ved, nana, sankh, cet_kus, cet_vip in combos:
            num = start_num + idx - 1
            is_vip = g_name == "Mahāvipāka"
            max_cet = cet_vip if is_vip else cet_kus
            roots_pt = "3 raízes (alobha, adosa, amoha)" if "sampayutta" in p_nana else "2 raízes (alobha, adosa)"
            roots_en = "3 roots (alobha, adosa, amoha)" if "sampayutta" in p_nana else "2 roots (alobha, adosa)"
            roots_es = "3 raíces (alobha, adosa, amoha)" if "sampayutta" in p_nana else "2 raíces (alobha, adosa)"
            cards.append({
                "id": f"c1.citta_{num:02d}",
                "chapter": 1,
                "axis": "citta",
                "tier": "atom",
                "requires": [],
                "paliTerm": f"#{num} {g_name} {idx}: {p_ved} {p_nana} {p_sankh}",
                "categoryLabel": {
                    "pt": f"Kāmāvacara Sobhana · {g_cat} ({idx}/8)",
                    "en": f"Kāmāvacara Sobhana · {g_cat} ({idx}/8)",
                    "es": f"Kāmāvacara Sobhana · {g_cat} ({idx}/8)",
                },
                "prompt": {
                    "pt": f"Qual é a definição exata, composição de raízes e função operacional do {g_name} Citta #{idx} (classe #{num} das 89)?",
                    "en": f"What is the exact definition, root composition, and operational function of {g_name} Citta #{idx} (class #{num} of 89)?",
                    "es": f"¿Cuál es la definición exacta, composición de raíces y función operacional del {g_name} Citta #{idx} (clase #{num} de 89)?",
                },
                "answer": {
                    "pt": f"{g_title['pt']} #{idx}: acompanhada de sensação {ved[0]}, {nana[0]} ({roots_pt}), {sankh[0]}. {g_func['pt']}",
                    "en": f"{g_title['en']} #{idx}: accompanied by {ved[1]}, {nana[1]} ({roots_en}), {sankh[1]}. {g_func['en']}",
                    "es": f"{g_title['es']} #{idx}: acompañada de sensación {ved[2]}, {nana[2]} ({roots_es}), {sankh[2]}. {g_func['es']}",
                },
                "mechanics": {
                    "pt": f"Plano: Kāmāvacara | Cetasikas máx.: {max_cet} (excluindo abstinências/ilimitáveis em Vipāka).",
                    "en": f"Plane: Kāmāvacara | Max cetasikas: {max_cet} (abstinences/illimitables absent in Vipāka).",
                    "es": f"Plano: Kāmāvacara | Cetasikas máx.: {max_cet} (abstinencias/ilimitables ausentes en Vipāka).",
                },
                "source": {"as": "I.10–12", "cma": "I §13–17", "segId": seg_id},
            })
    return cards


def _rupavacara_cards():
    """Generates all 15 Rūpāvacara Cittas (5 Kusala, 5 Vipāka, 5 Kiriya)."""
    jhanas = [
        (1, "Paṭhamajjhāna", "vitakka, vicāra, pīti, sukha, ekaggatā", 35, 35),
        (2, "Dutiyajjhāna", "vicāra, pīti, sukha, ekaggatā (sem vitakka)", 34, 34),
        (3, "Tatiyajjhāna", "pīti, sukha, ekaggatā (sem vitakka e vicāra)", 33, 33),
        (4, "Catutthajjhāna", "sukha, ekaggatā (sem vitakka, vicāra e pīti)", 32, 32),
        (5, "Pañcamajjhāna", "upekkhā, ekaggatā (sukha substituído por upekkhā)", 30, 30),
    ]
    jhana_en = [
        "vitakka, vicāra, pīti, sukha, ekaggatā",
        "vicāra, pīti, sukha, ekaggatā (without vitakka)",
        "pīti, sukha, ekaggatā (without vitakka, vicāra)",
        "sukha, ekaggatā (without vitakka, vicāra, pīti)",
        "upekkhā, ekaggatā (sukha replaced by equanimity)",
    ]
    jhana_es = [
        "vitakka, vicāra, pīti, sukha, ekaggatā",
        "vicāra, pīti, sukha, ekaggatā (sin vitakka)",
        "pīti, sukha, ekaggatā (sin vitakka y vicāra)",
        "sukha, ekaggatā (sin vitakka, vicāra y pīti)",
        "upekkhā, ekaggatā (sukha sustituido por ecuanimidad)",
    ]
    classes = [
        (
            "Rūpāvacara Kusala",
            55,
            {
                "pt": "Atua como javana de absorção (appanā) em mundanos e sekhas durante o desenvolvimento meditativo da esfera da forma fina.",
                "en": "Acts as absorption javana (appanā) in worldlings and sekhas during fine-material meditative attainment.",
                "es": "Actúa como javana de absorción (appanā) en mundanos y sekhas durante el logro meditativo de la forma sutil.",
            },
            39,
        ),
        (
            "Rūpāvacara Vipāka",
            60,
            {
                "pt": "Resultado do Kusala correspondente; opera exclusivamente como Paṭisandhi, Bhavaṅga e Cuti nos 16 reinos de Brahmā (Rūpa-bhūmi).",
                "en": "Resultant of the corresponding Kusala; functions strictly as Paṭisandhi, Bhavaṅga, and Cuti in the Rūpa-bhūmi Brahmā realms.",
                "es": "Resultante del Kusala correspondiente; opera exclusivamente como Paṭisandhi, Bhavaṅga y Cuti en los reinos de Brahmā (Rūpa-bhūmi).",
            },
            41,
        ),
        (
            "Rūpāvacara Kiriya",
            65,
            {
                "pt": "Atua exclusivamente como javana de absorção (appanā) em Arahats que ingressam nesse jhāna, sem gerar kamma futuro.",
                "en": "Acts exclusively as absorption javana (appanā) in Arahats entering this jhāna, generating no future kamma.",
                "es": "Actúa exclusivamente como javana de absorción (appanā) en Arahats que entran en este jhāna, sin generar kamma futuro.",
            },
            43,
        ),
    ]
    cards = []
    for cls_name, base_num, cls_func, seg_id in classes:
        for idx, (j_num, j_pali, f_pt, cet_k, _cet_v) in enumerate(jhanas):
            num = base_num + idx
            cards.append({
                "id": f"c1.citta_{num:02d}",
                "chapter": 1,
                "axis": "citta",
                "tier": "atom",
                "requires": [],
                "paliTerm": f"#{num} {cls_name} — {j_pali}-citta",
                "categoryLabel": {
                    "pt": f"Rūpāvacara (15) · {cls_name}",
                    "en": f"Rūpāvacara (15) · {cls_name}",
                    "es": f"Rūpāvacara (15) · {cls_name}",
                },
                "prompt": {
                    "pt": f"Quais fatores de jhāna compõem o {cls_name} do {j_num}º jhāna (classe #{num}) e qual é a sua função estrutural?",
                    "en": f"Which jhāna factors compose the {j_num}th jhāna {cls_name} (class #{num}) and what is its structural function?",
                    "es": f"¿Qué factores de jhāna componen el {cls_name} del {j_num}º jhāna (clase #{num}) y cuál es su función estructural?",
                },
                "answer": {
                    "pt": f"{j_pali} ({cls_name}): possui 3 raízes (alobha, adosa, amoha) e os fatores: {f_pt}. {cls_func['pt']}",
                    "en": f"{j_pali} ({cls_name}): tihetuka (alobha, adosa, amoha) with jhāna factors: {jhana_en[idx]}. {cls_func['en']}",
                    "es": f"{j_pali} ({cls_name}): tihetuka (alobha, adosa, amoha) con factores: {jhana_es[idx]}. {cls_func['es']}",
                },
                "mechanics": {
                    "pt": f"Tihetuka (3 raízes) | Cetasikas: até {cet_k} (sem virati; karuṇā/muditā ausentes no 5º jhāna).",
                    "en": f"Tihetuka (3 roots) | Cetasikas: up to {cet_k} (no viratis; karuṇā/muditā absent in 5th jhāna).",
                    "es": f"Tihetuka (3 raíces) | Cetasikas: hasta {cet_k} (sin viratis; karuṇā/muditā ausentes en 5º jhāna).",
                },
                "source": {"as": "I.13–16", "cma": "I §18–21", "segId": seg_id},
            })
    return cards


def _arupavacara_cards():
    """Generates all 12 Arūpāvacara Cittas (4 Kusala, 4 Vipāka, 4 Kiriya)."""
    spheres = [
        (1, "Ākāsānañcāyatana",
         ("Base do espaço infinito (objeto: o conceito do espaço infinito pós-remoção da kasiṇa)",
          "Base of infinite space (object: concept of boundless space after removing the kasiṇa)",
          "Base del espacio infinito (objeto: concepto del espacio infinito tras remover la kasiṇa)")),
        (2, "Viññāṇañcāyatana",
         ("Base da consciência infinita (objeto: a 1ª consciência arūpa que contemplou o espaço)",
          "Base of infinite consciousness (object: the 1st arūpa consciousness itself)",
          "Base de la conciencia infinita (objeto: la 1ª conciencia arūpa)")),
        (3, "Ākiñcaññāyatana",
         ("Base do nada / vacuidade de posse (objeto: a inexistência/ausência da 1ª consciência arūpa)",
          "Base of nothingness (object: the non-existence/absence of the 1st arūpa consciousness)",
          "Base de la nada (objeto: la no-existencia/ausencia de la 1ª conciencia arūpa)")),
        (4, "Nevasaññānāsaññāyatana",
         ("Base da nem-percepção-nem-não-percepção (objeto: a 3ª consciência arūpa extremamente sutil)",
          "Base of neither-perception-nor-non-perception (object: the extremely subtle 3rd arūpa consciousness)",
          "Base de ni-percepción-ni-no-percepción (objeto: la 3ª conciencia arūpa sumamente sutil)")),
    ]
    classes = [
        ("Arūpāvacara Kusala", 70,
         ("Javana de absorção imaterial em mundanos/sekhas.", "Immaterial absorption javana in worldlings/sekhas.", "Javana de absorción inmaterial en mundanos/sekhas."), 46),
        ("Arūpāvacara Vipāka", 74,
         ("Exclusivamente Paṭisandhi, Bhavaṅga e Cuti nos 4 reinos imateriais (avatthuka: sem base física).",
          "Exclusively Paṭisandhi, Bhavaṅga, and Cuti in the 4 immaterial realms (avatthuka: no physical base).",
          "Exclusivamente Paṭisandhi, Bhavaṅga y Cuti en los 4 reinos inmateriales (avatthuka: sin base física)."), 48),
        ("Arūpāvacara Kiriya", 78,
         ("Javana de absorção imaterial exclusivamente em Arahats (sem kamma futuro).",
          "Immaterial absorption javana exclusively in Arahats (no future kamma).",
          "Javana de absorción inmaterial exclusivamente en Arahats (sin kamma futuro)."), 50),
    ]
    cards = []
    for cls_name, base_num, cls_fn, seg_id in classes:
        for idx, (s_num, s_pali, obj_desc) in enumerate(spheres):
            num = base_num + idx
            cards.append({
                "id": f"c1.citta_{num:02d}",
                "chapter": 1,
                "axis": "citta",
                "tier": "atom",
                "requires": [],
                "paliTerm": f"#{num} {cls_name}: {s_pali}",
                "categoryLabel": {
                    "pt": f"Arūpāvacara (12) · {cls_name} ({s_num}/4)",
                    "en": f"Arūpāvacara (12) · {cls_name} ({s_num}/4)",
                    "es": f"Arūpāvacara (12) · {cls_name} ({s_num}/4)",
                },
                "prompt": {
                    "pt": f"Qual é o objeto específico (ārammaṇa), fatores e função do {cls_name} na {s_num}ª esfera ({s_pali}, classe #{num})?",
                    "en": f"What is the specific object (ārammaṇa), factors, and function of {cls_name} in the {s_num}th sphere ({s_pali}, class #{num})?",
                    "es": f"¿Cuál es el objeto específico (ārammaṇa), factores y función del {cls_name} en la {s_num}ª esfera ({s_pali}, clase #{num})?",
                },
                "answer": {
                    "pt": f"{s_pali} ({cls_name}): possui os fatores do 5º jhāna (upekkhā + ekaggatā) diferenciando-se pelo objeto: {obj_desc[0]}. Função: {cls_fn[0]}",
                    "en": f"{s_pali} ({cls_name}): shares 5th-jhāna factors (upekkhā + ekaggatā) and is differentiated by its object: {obj_desc[1]}. Function: {cls_fn[1]}",
                    "es": f"{s_pali} ({cls_name}): posee los factores del 5º jhāna (upekkhā + ekaggatā) y se diferencia por su objeto: {obj_desc[2]}. Función: {cls_fn[2]}",
                },
                "mechanics": {
                    "pt": "Tihetuka | 30 cetasikas exatos (13 aññasamāna exceto vitakka, vicāra, pīti + 19 sobhanasādhāraṇa + paññā = 30).",
                    "en": "Tihetuka | Exactly 30 cetasikas (10 aññasamāna excl. vitakka, vicāra, pīti + 19 sobhanasādhāraṇa + paññā = 30).",
                    "es": "Tihetuka | Exactamente 30 cetasikas (10 aññasamāna excl. vitakka, vicāra, pīti + 19 sobhanasādhāraṇa + paññā = 30).",
                },
                "source": {"as": "I.17–19", "cma": "I §22–24", "segId": seg_id},
            })
    return cards


def _lokuttara_cards():
    """Generates all 8 Lokuttara Cittas (4 Magga + 4 Phala) and 121-expansion cards."""
    paths = [
        (82, 86, "Sotāpatti",
         ("Entrado na Corrente", "Stream-Entry", "Entrada en la Corriente"),
         ("Erradica os 3 primeiros grilhões (sakkāya-diṭṭhi, vicikicchā, sīlabbata-parāmāsa) e todas as consciências capazes de gerar renascimento nos 4 planos de miséria (apāya).",
          "Eradicates the first 3 fetters (personality view, doubt, clinging to rules/rituals) and all kamma capable of rebirth in the 4 woeful planes.",
          "Erradica las 3 primeras ataduras (visión de identidad, duda, apego a ritos) y todo kamma capaz de producir renacimiento en los 4 planos de miseria.")),
        (83, 87, "Sakadāgāmi",
         ("Retorna Uma Vez", "Once-Returner", "El que Retorna Una Vez"),
         ("Não erradica novos grilhões, mas atenua drasticamente o desejo sensual grosseiro (kāmarāga) e a má-vontade grosseira (vyāpāda).",
          "Does not eradicate new fetters, but radically attenuates gross sensual desire (kāmarāga) and gross ill-will (vyāpāda).",
          "No erradica nuevas ataduras, pero atenúa drásticamente el deseo sensual burdo (kāmarāga) y la aversión burda (vyāpāda).")),
        (84, 88, "Anāgāmi",
         ("Não-Retornante", "Non-Returner", "No-Retornante"),
         ("Erradica totalmente o desejo sensual (kāmarāga) e a aversão/ódio (paṭigha/vyāpāda), incluindo todos os cittas enraizados em dosa.",
          "Totally eradicates sensual desire (kāmarāga) and ill-will/hatred (paṭigha/vyāpāda), eliminating all dosa-rooted cittas.",
          "Erradica totalmente el deseo sensual (kāmarāga) y la aversión/odio (paṭigha/vyāpāda), eliminando todos los cittas con dosa.")),
        (85, 89, "Arahatta",
         ("Estado de Arahat", "Arahantship", "Estado de Arahat"),
         ("Erradica os 5 grilhões superiores (rūparāga, arūparāga, māna, uddhacca, avijjā) e todos os remanescentes de contaminações.",
          "Eradicates the 5 higher fetters (fine-material craving, immaterial craving, conceit, restlessness, ignorance) and all remaining defilements.",
          "Erradica las 5 ataduras superiores (deseo de forma/sin forma, presunción, inquietud, ignorancia) y todas las impurezas restantes.")),
    ]
    cards = []
    for m_num, f_num, name, tr, fetters in paths:
        cards.append({
            "id": f"c1.citta_{m_num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"#{m_num} {name}-magga-citta",
            "categoryLabel": {
                "pt": f"Lokuttara (8/40) · Caminho ({tr[0]})",
                "en": f"Lokuttara (8/40) · Path ({tr[1]})",
                "es": f"Lokuttara (8/40) · Camino ({tr[2]})",
            },
            "prompt": {
                "pt": f"Qual é a função supramundana do {name}-magga-citta (classe #{m_num}), seu objeto (ārammaṇa) e seu efeito sobre os grilhões (saṃyojana)?",
                "en": f"What is the supramundane function of {name}-magga-citta (class #{m_num}), its object (ārammaṇa), and its effect on fetters (saṃyojana)?",
                "es": f"¿Cuál es la función supramundana del {name}-magga-citta (clase #{m_num}), su objeto (ārammaṇa) y su efecto sobre las ataduras (saṃyojana)?",
            },
            "answer": {
                "pt": f"Citta do Caminho de {tr[0]} (Lokuttara Kusala): toma exclusivamente o Nibbāna incondicionado como objeto (ārammaṇa). Surge apenas uma única vez como javana por 1 cittakkhaṇa. {fetters[0]}",
                "en": f"Path consciousness of {tr[1]} (Lokuttara Kusala): takes solely unconditioned Nibbāna as its object (ārammaṇa). Arises only once for 1 cittakkhaṇa. {fetters[1]}",
                "es": f"Conciencia del Camino de {tr[2]} (Lokuttara Kusala): toma exclusivamente el Nibbāna incondicionado como objeto (ārammaṇa). Surge una sola vez por 1 cittakkhaṇa. {fetters[2]}",
            },
            "mechanics": {
                "pt": "Expansão 121: multiplica-se por 5 jhānas (5 Maggas). Sempre inclui os 3 Virati (abstinências) e Paññindriya (até 36 cetasikas).",
                "en": "121 expansion: multiplies across 5 jhānas (5 Paths). Always includes all 3 Viratis and Paññindriya (up to 36 cetasikas).",
                "es": "Expansión 121: se multiplica por 5 jhānas (5 Caminos). Siempre incluye los 3 Viratis y Paññindriya (hasta 36 cetasikas).",
            },
            "source": {"as": "I.20–21", "cma": "I §25–32", "segId": 53},
        })
        cards.append({
            "id": f"c1.citta_{f_num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [f"c1.citta_{m_num:02d}"],
            "paliTerm": f"#{f_num} {name}-phala-citta",
            "categoryLabel": {
                "pt": f"Lokuttara (8/40) · Fruto ({tr[0]})",
                "en": f"Lokuttara (8/40) · Fruition ({tr[1]})",
                "es": f"Lokuttara (8/40) · Fruto ({tr[2]})",
            },
            "prompt": {
                "pt": f"Qual é a função do {name}-phala-citta (classe #{f_num}), sua relação imediata com o Magga e seu objeto estrutural?",
                "en": f"What is the function of {name}-phala-citta (class #{f_num}), its immediate relation to Magga, and its structural object?",
                "es": f"¿Cuál es la función del {name}-phala-citta (clase #{f_num}), su relación inmediata con el Magga y su objeto estructural?",
            },
            "answer": {
                "pt": f"Citta do Fruto de {tr[0]} (Lokuttara Vipāka): sucede imediatamente ao {name}-magga (por 2 ou 3 momentos no mesmo processo, por akālika vipāka) e pode ser reexperimentado em Phalasamāpatti. Toma exclusivamente Nibbāna como objeto (ārammaṇa).",
                "en": f"Fruition consciousness of {tr[1]} (Lokuttara Vipāka): immediately follows {name}-magga (for 2 or 3 moments in the same cognitive process, as timeless vipāka) and recurs in Phalasamāpatti. Takes solely Nibbāna as object.",
                "es": f"Conciencia del Fruto de {tr[2]} (Lokuttara Vipāka): sigue inmediatamente al {name}-magga (2 o 3 momentos en el mismo proceso, vipāka atemporal) y recurre en Phalasamāpatti. Toma exclusivamente Nibbāna como objeto.",
            },
            "mechanics": {
                "pt": "Expansão 121: multiplica-se por 5 jhānas (5 Phalas). Nota: Lokuttara Vipāka ocorre como javana (não como paṭisandhi/bhavaṅga).",
                "en": "121 expansion: multiplies across 5 jhānas (5 Fruitions). Note: Lokuttara Vipāka functions as javana (never paṭisandhi/bhavaṅga).",
                "es": "Expansión 121: se multiplica por 5 jhānas (5 Frutos). Nota: Lokuttara Vipāka actúa como javana (nunca paṭisandhi/bhavaṅga).",
            },
            "source": {"as": "I.20–21", "cma": "I §25–32", "segId": 54},
        })
    return cards


def build_cards():
    cards = []

    # ── 12 Akusala Cittas (1..12) ────────────────────────────────────────────
    lobha_specs = [
        (1, "Somanassa-sahagataṃ diṭṭhigata-sampayuttaṃ asaṅkhārikam",
         ("alegria (somanassa)", "joy (somanassa)", "alegría (somanassa)"),
         ("associada com visão errônea (diṭṭhi)", "associated with wrong view (diṭṭhi)", "asociada con visión errónea (diṭṭhi)"),
         ("espontânea / não-instigada (asaṅkhārika)", "unprompted (asaṅkhārika)", "espontánea / no instigada (asaṅkhārika)"), 19),
        (2, "Somanassa-sahagataṃ diṭṭhigata-sampayuttaṃ sasaṅkhārikam",
         ("alegria (somanassa)", "joy (somanassa)", "alegría (somanassa)"),
         ("associada com visão errônea (diṭṭhi)", "associated with wrong view (diṭṭhi)", "asociada con visión errónea (diṭṭhi)"),
         ("instigada / hesitante (sasaṅkhārika)", "prompted (sasaṅkhārika)", "instigada (sasaṅkhārika)"), 21),
        (3, "Somanassa-sahagataṃ diṭṭhigata-vippayuttaṃ asaṅkhārikam",
         ("alegria (somanassa)", "joy (somanassa)", "alegría (somanassa)"),
         ("dissociada de visão errônea (pode ter māna)", "dissociated from wrong view (may take māna)", "disociada de visión errónea (puede tener māna)"),
         ("espontânea / não-instigada (asaṅkhārika)", "unprompted (asaṅkhārika)", "espontánea / no instigada (asaṅkhārika)"), 19),
        (4, "Somanassa-sahagataṃ diṭṭhigata-vippayuttaṃ sasaṅkhārikam",
         ("alegria (somanassa)", "joy (somanassa)", "alegría (somanassa)"),
         ("dissociada de visão errônea (pode ter māna)", "dissociated from wrong view (may take māna)", "disociada de visión errónea (puede tener māna)"),
         ("instigada / hesitante (sasaṅkhārika)", "prompted (sasaṅkhārika)", "instigada (sasaṅkhārika)"), 21),
        (5, "Upekkhā-sahagataṃ diṭṭhigata-sampayuttaṃ asaṅkhārikam",
         ("equanimidade / neutralidade (upekkhā)", "equanimity (upekkhā)", "ecuanimidad (upekkhā)"),
         ("associada com visão errônea (diṭṭhi)", "associated with wrong view (diṭṭhi)", "asociada con visión errónea (diṭṭhi)"),
         ("espontânea / não-instigada (asaṅkhārika)", "unprompted (asaṅkhārika)", "espontánea / no instigada (asaṅkhārika)"), 18),
        (6, "Upekkhā-sahagataṃ diṭṭhigata-sampayuttaṃ sasaṅkhārikam",
         ("equanimidade / neutralidade (upekkhā)", "equanimity (upekkhā)", "ecuanimidad (upekkhā)"),
         ("associada com visão errônea (diṭṭhi)", "associated with wrong view (diṭṭhi)", "asociada con visión errónea (diṭṭhi)"),
         ("instigada / hesitante (sasaṅkhārika)", "prompted (sasaṅkhārika)", "instigada (sasaṅkhārika)"), 20),
        (7, "Upekkhā-sahagataṃ diṭṭhigata-vippayuttaṃ asaṅkhārikam",
         ("equanimidade / neutralidade (upekkhā)", "equanimity (upekkhā)", "ecuanimidad (upekkhā)"),
         ("dissociada de visão errônea (pode ter māna)", "dissociated from wrong view (may take māna)", "disociada de visión errónea (puede tener māna)"),
         ("espontânea / não-instigada (asaṅkhārika)", "unprompted (asaṅkhārika)", "espontánea / no instigada (asaṅkhārika)"), 18),
        (8, "Upekkhā-sahagataṃ diṭṭhigata-vippayuttaṃ sasaṅkhārikam",
         ("equanimidade / neutralidade (upekkhā)", "equanimity (upekkhā)", "ecuanimidad (upekkhā)"),
         ("dissociada de visão errônea (pode ter māna)", "dissociated from wrong view (may take māna)", "disociada de visión errónea (puede tener māna)"),
         ("instigada / hesitante (sasaṅkhārika)", "prompted (sasaṅkhārika)", "instigada (sasaṅkhārika)"), 20),
    ]
    for num, pali, ved, dit, sankh, max_cet in lobha_specs:
        cards.append({
            "id": f"c1.citta_{num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"#{num} Lobha-mūla-citta {num}: {pali}",
            "categoryLabel": {
                "pt": f"Kāmāvacara Akusala · Lobha-mūla ({num}/8)",
                "en": f"Kāmāvacara Akusala · Lobha-mūla ({num}/8)",
                "es": f"Kāmāvacara Akusala · Lobha-mūla ({num}/8)",
            },
            "prompt": {
                "pt": f"Descreva exatamente a classe de consciência #{num} (Lobha-mūla-citta {num}): sensação, associação com visão errônea, instigação, raízes e função.",
                "en": f"Describe consciousness class #{num} (Lobha-mūla-citta {num}): feeling, wrong-view association, prompting, roots, and function.",
                "es": f"Describa la clase de conciencia #{num} (Lobha-mūla-citta {num}): sensación, asociación con visión errónea, instigación, raíces y función.",
            },
            "answer": {
                "pt": f"Consciência enraizada em avidez (lobha + moha), acompanhada de {ved[0]}, {dit[0]}, {sankh[0]}. Atua exclusivamente na função de javana (impulsão).",
                "en": f"Consciousness rooted in greed (lobha + moha), accompanied by {ved[1]}, {dit[1]}, {sankh[1]}. Functions solely as javana (impulsion).",
                "es": f"Conciencia enraizada en avidez (lobha + moha), acompañada de {ved[2]}, {dit[2]}, {sankh[2]}. Opera exclusivamente como javana (impulsión).",
            },
            "mechanics": {
                "pt": f"Dvihetuka (2 raízes: lobha, moha) | Máx. {max_cet} cetasikas (thīna-middha apenas nos sasaṅkhārikas; pīti apenas nos somanassas).",
                "en": f"Dvihetuka (2 roots: lobha, moha) | Max {max_cet} cetasikas (thīna-middha only in sasaṅkhārika; pīti only in somanassa).",
                "es": f"Dvihetuka (2 raíces: lobha, moha) | Máx. {max_cet} cetasikas (thīna-middha solo en sasaṅkhārika; pīti solo en somanassa).",
            },
            "source": {"as": "I.4", "cma": "I §4–5", "segId": 13},
        })

    # 9-10 Dosa-mūla
    for num, pali, sankh, max_cet in [
        (9, "Domanassa-sahagataṃ paṭigha-sampayuttaṃ asaṅkhārikam",
         ("não-instigada (asaṅkhārika)", "unprompted (asaṅkhārika)", "no instigada (asaṅkhārika)"), 20),
        (10, "Domanassa-sahagataṃ paṭigha-sampayuttaṃ sasaṅkhārikam",
         ("instigada (sasaṅkhārika)", "prompted (sasaṅkhārika)", "instigada (sasaṅkhārika)"), 22),
    ]:
        idx = num - 8
        cards.append({
            "id": f"c1.citta_{num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"#{num} Dosa-mūla-citta {idx}: {pali}",
            "categoryLabel": {
                "pt": f"Kāmāvacara Akusala · Dosa-mūla ({idx}/2)",
                "en": f"Kāmāvacara Akusala · Dosa-mūla ({idx}/2)",
                "es": f"Kāmāvacara Akusala · Dosa-mūla ({idx}/2)",
            },
            "prompt": {
                "pt": f"Qual é a definição e mecânica da classe #{num} (Dosa-mūla-citta {idx})?",
                "en": f"What is the definition and mechanics of class #{num} (Dosa-mūla-citta {idx})?",
                "es": f"¿Cuál es la definición y mecánica de la clase #{num} (Dosa-mūla-citta {idx})?",
            },
            "answer": {
                "pt": f"Consciência enraizada em aversão (dosa + moha), sempre acompanhada de desprazer mental (domanassa), associada a aversão/repulsão (paṭigha) e {sankh[0]}. Opera como javana.",
                "en": f"Consciousness rooted in hatred (dosa + moha), always accompanied by displeasure (domanassa), associated with aversion (paṭigha), {sankh[1]}. Functions as javana.",
                "es": f"Conciencia enraizada en aversión (dosa + moha), siempre acompañada de desagrado mental (domanassa), asociada a repulsión (paṭigha), {sankh[2]}. Opera como javana.",
            },
            "mechanics": {
                "pt": f"Dvihetuka (dosa, moha) | Sem pīti | Máx. {max_cet} cetasikas (pode incluir issā, macchariya ou kukkucca, mutuamente exclusivos).",
                "en": f"Dvihetuka (dosa, moha) | No pīti | Max {max_cet} cetasikas (may include issā, macchariya, or kukkucca, mutually exclusive).",
                "es": f"Dvihetuka (dosa, moha) | Sin pīti | Máx. {max_cet} cetasikas (puede incluir issā, macchariya o kukkucca, mutuamente excluyentes).",
            },
            "source": {"as": "I.5", "cma": "I §6", "segId": 15},
        })

    # 11-12 Moha-mūla
    for num, pali, f_pt, f_en, f_es, desc_pt, desc_en, desc_es in [
        (11, "Upekkhā-sahagataṃ vicikicchā-sampayuttam",
         "Vicikicchā (dúvida cética)", "Vicikicchā (skeptical doubt)", "Vicikicchā (duda escéptica)",
         "Consciência enraizada apenas em ilusão (moha), acompanhada de equanimidade (upekkhā) e associada à dúvida cética (vicikicchā). Não inclui adhimokkha (decisão).",
         "Consciousness rooted solely in delusion (moha), accompanied by equanimity (upekkhā), associated with skeptical doubt (vicikicchā). Excludes adhimokkha (decision).",
         "Conciencia enraizada solo en ilusión (moha), acompañada de ecuanimidad (upekkhā), asociada a la duda escéptica (vicikicchā). Excluye adhimokkha (decisión)."),
        (12, "Upekkhā-sahagataṃ uddhacca-sampayuttam",
         "Uddhacca (inquietação)", "Uddhacca (restlessness)", "Uddhacca (inquietud)",
         "Consciência enraizada apenas em ilusão (moha), acompanhada de equanimidade (upekkhā) e associada à inquietação/agitação mental (uddhacca). É a mais fraca das consciências inábeis e não gera renascimento.",
         "Consciousness rooted solely in delusion (moha), accompanied by equanimity (upekkhā), associated with restlessness (uddhacca). Too weak to produce rebirth.",
         "Conciencia enraizada solo en ilusión (moha), acompañada de ecuanimidad (upekkhā), asociada a la inquietud (uddhacca). Demasiado débil para generar renacimiento."),
    ]:
        idx = num - 10
        cards.append({
            "id": f"c1.citta_{num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"#{num} Moha-mūla-citta {idx}: {pali}",
            "categoryLabel": {
                "pt": f"Kāmāvacara Akusala · Moha-mūla ({idx}/2)",
                "en": f"Kāmāvacara Akusala · Moha-mūla ({idx}/2)",
                "es": f"Kāmāvacara Akusala · Moha-mūla ({idx}/2)",
            },
            "prompt": {
                "pt": f"Defina a classe #{num} (Moha-mūla-citta {idx} — {f_pt}), suas raízes e particularidade de cetasikas.",
                "en": f"Define class #{num} (Moha-mūla-citta {idx} — {f_en}), its roots, and its cetasika particularity.",
                "es": f"Defina la clase #{num} (Moha-mūla-citta {idx} — {f_es}), sus raíces y particularidad de cetasikas.",
            },
            "answer": {"pt": desc_pt, "en": desc_en, "es": desc_es},
            "mechanics": {
                "pt": f"Ekahetuka (1 única raiz: moha) | {15 if num == 11 else 15} cetasikas.",
                "en": "Ekahetuka (single root: moha) | 15 cetasikas.",
                "es": "Ekahetuka (1 sola raíz: moha) | 15 cetasikas.",
            },
            "source": {"as": "I.6", "cma": "I §7", "segId": 17},
        })

    # ── 18 Ahetuka Cittas (13..30) ───────────────────────────────────────────
    ahetuka_specs = [
        # 7 Akusala-vipāka (13..19)
        (13, "Akusala-vipāka Cakkhuviññāṇa", "Upekkhā-sahagataṃ cakkhuviññāṇaṃ", "Akusala-vipāka (1/7)", 7,
         ("Consciência visual resultante inábil: acompanhada de equanimidade (upekkhā), vê forma visível indesejável baseada no cakkhu-vatthu. Função: dassana (ver).",
          "Unwholesome-resultant eye-consciousness: accompanied by equanimity, cognizes an undesirable visible form via cakkhu-vatthu. Function: dassana (seeing).",
          "Conciencia visual resultante insalubre: acompañada de ecuanimidad, conoce una forma visible indeseable vía cakkhu-vatthu. Función: dassana (ver).")),
        (14, "Akusala-vipāka Sotaviññāṇa", "Upekkhā-sahagataṃ sotaviññāṇaṃ", "Akusala-vipāka (2/7)", 7,
         ("Consciência auditiva resultante inábil: acompanhada de equanimidade, ouve som indesejável baseada no sota-vatthu. Função: savana (ouvir).",
          "Unwholesome-resultant ear-consciousness: accompanied by equanimity, cognizes an undesirable sound via sota-vatthu. Function: savana (hearing).",
          "Conciencia auditiva resultante insalubre: acompañada de ecuanimidad, oye un sonido indeseable vía sota-vatthu. Función: savana (oír).")),
        (15, "Akusala-vipāka Ghānaviññāṇa", "Upekkhā-sahagataṃ ghānaviññāṇaṃ", "Akusala-vipāka (3/7)", 7,
         ("Consciência olfativa resultante inábil: acompanhada de equanimidade, percebe odor indesejável baseada no ghāna-vatthu. Função: ghāyana (cheirar).",
          "Unwholesome-resultant nose-consciousness: accompanied by equanimity, cognizes an undesirable odor via ghāna-vatthu. Function: ghāyana (smelling).",
          "Conciencia olfativa resultante insalubre: acompañada de ecuanimidad, percibe un olor indeseable vía ghāna-vatthu. Función: ghāyana (oler).")),
        (16, "Akusala-vipāka Jivhāviññāṇa", "Upekkhā-sahagataṃ jivhāviññāṇaṃ", "Akusala-vipāka (4/7)", 7,
         ("Consciência gustativa resultante inábil: acompanhada de equanimidade, percebe sabor indesejável baseada no jivhā-vatthu. Função: sāyana (degustar).",
          "Unwholesome-resultant tongue-consciousness: accompanied by equanimity, cognizes an undesirable taste via jivhā-vatthu. Function: sāyana (tasting).",
          "Conciencia gustativa resultante insalubre: acompañada de ecuanimidad, percibe un sabor indeseable vía jivhā-vatthu. Función: sāyana (saborear).")),
        (17, "Akusala-vipāka Kāyaviññāṇa", "Dukkha-sahagataṃ kāyaviññāṇaṃ", "Akusala-vipāka (5/7)", 7,
         ("Consciência tátil resultante inábil: ÚNICA consciência acompanhada de dor física (dukkha); percebe objeto tangível desagradável via kāya-vatthu. Função: phusana (tocar).",
          "Unwholesome-resultant body-consciousness: the ONLY citta accompanied by bodily pain (dukkha); cognizes an unpleasant tangible object via kāya-vatthu. Function: phusana.",
          "Conciencia táctil resultante insalubre: la ÚNICA conciencia acompañada de dolor físico (dukkha); conoce un objeto tangible desagradable vía kāya-vatthu. Función: phusana.")),
        (18, "Akusala-vipāka Sampaṭicchana", "Upekkhā-sahagataṃ sampaṭicchana-cittaṃ", "Akusala-vipāka (6/7)", 10,
         ("Consciência receptora resultante inábil: acompanhada de equanimidade, recebe imediatamente o objeto das cinco portas após um pañcaviññāṇa inábil. Base: hadaya-vatthu.",
          "Unwholesome-resultant receiving consciousness: accompanied by equanimity, receives the sense-object immediately after an unwholesome pañcaviññāṇa. Base: hadaya-vatthu.",
          "Conciencia receptora resultante insalubre: acompañada de ecuanimidad, recibe el objeto inmediatamente tras un pañcaviññāṇa insalubre. Base: hadaya-vatthu.")),
        (19, "Akusala-vipāka Santīraṇa", "Upekkhā-sahagataṃ santīraṇa-cittaṃ", "Akusala-vipāka (7/7)", 11,
         ("Consciência investigadora resultante inábil: acompanhada de equanimidade; além de investigar (santīraṇa) no processo, atua como Paṭisandhi, Bhavaṅga e Cuti nos 4 reinos de miséria (apāya) e como Tadārammaṇa.",
          "Unwholesome-resultant investigating consciousness: accompanied by equanimity; besides investigating (santīraṇa), serves as Paṭisandhi, Bhavaṅga, and Cuti in the 4 woeful planes (apāya), and as Tadārammaṇa.",
          "Conciencia investigadora resultante insalubre: acompañada de ecuanimidad; además de investigar (santīraṇa), opera como Paṭisandhi, Bhavaṅga y Cuti en los 4 planos de miseria (apāya), y como Tadārammaṇa.")),
        # 8 Kusala-vipāka Ahetuka (20..27)
        (20, "Kusala-vipāka Cakkhuviññāṇa", "Upekkhā-sahagataṃ cakkhuviññāṇaṃ", "Kusala-vipāka Ahetuka (1/8)", 7,
         ("Consciência visual resultante hábil (sem raiz): acompanhada de equanimidade, vê forma visível desejável/neutra via cakkhu-vatthu. Função: dassana.",
          "Wholesome-resultant rootless eye-consciousness: accompanied by equanimity, cognizes desirable/neutral visible form via cakkhu-vatthu. Function: dassana.",
          "Conciencia visual resultante saludable sin raíz: acompañada de ecuanimidad, ve forma visible deseable/neutra vía cakkhu-vatthu. Función: dassana.")),
        (21, "Kusala-vipāka Sotaviññāṇa", "Upekkhā-sahagataṃ sotaviññāṇaṃ", "Kusala-vipāka Ahetuka (2/8)", 7,
         ("Consciência auditiva resultante hábil (sem raiz): acompanhada de equanimidade, ouve som desejável/neutro via sota-vatthu. Função: savana.",
          "Wholesome-resultant rootless ear-consciousness: accompanied by equanimity, cognizes desirable/neutral sound via sota-vatthu. Function: savana.",
          "Conciencia auditiva resultante saludable sin raíz: acompañada de ecuanimidad, oye sonido deseable/neutro vía sota-vatthu. Función: savana.")),
        (22, "Kusala-vipāka Ghānaviññāṇa", "Upekkhā-sahagataṃ ghānaviññāṇaṃ", "Kusala-vipāka Ahetuka (3/8)", 7,
         ("Consciência olfativa resultante hábil (sem raiz): acompanhada de equanimidade, percebe odor desejável/neutro via ghāna-vatthu. Função: ghāyana.",
          "Wholesome-resultant rootless nose-consciousness: accompanied by equanimity, cognizes desirable/neutral odor via ghāna-vatthu. Function: ghāyana.",
          "Conciencia olfativa resultante saludable sin raíz: acompañada de ecuanimidad, percibe olor deseable/neutro vía ghāna-vatthu. Función: ghāyana.")),
        (23, "Kusala-vipāka Jivhāviññāṇa", "Upekkhā-sahagataṃ jivhāviññāṇaṃ", "Kusala-vipāka Ahetuka (4/8)", 7,
         ("Consciência gustativa resultante hábil (sem raiz): acompanhada de equanimidade, percebe sabor desejável/neutro via jivhā-vatthu. Função: sāyana.",
          "Wholesome-resultant rootless tongue-consciousness: accompanied by equanimity, cognizes desirable/neutral taste via jivhā-vatthu. Function: sāyana.",
          "Conciencia gustativa resultante saludable sin raíz: acompañada de ecuanimidad, percibe sabor deseable/neutro vía jivhā-vatthu. Función: sāyana.")),
        (24, "Kusala-vipāka Kāyaviññāṇa", "Sukha-sahagataṃ kāyaviññāṇaṃ", "Kusala-vipāka Ahetuka (5/8)", 7,
         ("Consciência tátil resultante hábil: ÚNICA consciência acompanhada de prazer físico (sukha); percebe objeto tangível agradável via kāya-vatthu. Função: phusana.",
          "Wholesome-resultant body-consciousness: the ONLY citta accompanied by bodily pleasure (sukha); cognizes a pleasant tangible object via kāya-vatthu. Function: phusana.",
          "Conciencia táctil resultante saludable: la ÚNICA conciencia acompañada de placer físico (sukha); conoce objeto tangible agradable vía kāya-vatthu. Función: phusana.")),
        (25, "Kusala-vipāka Sampaṭicchana", "Upekkhā-sahagataṃ sampaṭicchana-cittaṃ", "Kusala-vipāka Ahetuka (6/8)", 10,
         ("Consciência receptora resultante hábil (sem raiz): acompanhada de equanimidade, recebe o objeto imediatamente após um pañcaviññāṇa hábil.",
          "Wholesome-resultant rootless receiving consciousness: accompanied by equanimity, receives the object immediately after a wholesome pañcaviññāṇa.",
          "Conciencia receptora resultante saludable sin raíz: acompañada de ecuanimidad, recibe el objeto inmediatamente tras un pañcaviññāṇa saludable.")),
        (26, "Somanassa-santīraṇa", "Somanassa-sahagataṃ santīraṇa-cittaṃ", "Kusala-vipāka Ahetuka (7/8)", 12,
         ("Consciência investigadora acompanhada de alegria (somanassa): investiga objetos extraordinariamente desejáveis (ati-iṭṭha) nas 5 portas e atua como Tadārammaṇa (não atua como paṭisandhi).",
          "Joy-accompanied investigating consciousness: investigates exceptionally desirable objects in the 5 sense doors and serves as Tadārammaṇa (never paṭisandhi).",
          "Conciencia investigadora acompañada de alegría (somanassa): investiga objetos extraordinariamente deseables en las 5 puertas y actúa como Tadārammaṇa (nunca paṭisandhi).")),
        (27, "Upekkhā-santīraṇa (Kusala-vipāka)", "Upekkhā-sahagataṃ santīraṇa-cittaṃ", "Kusala-vipāka Ahetuka (8/8)", 11,
         ("Consciência investigadora hábil com equanimidade: atua como santīraṇa e tadārammaṇa, e também como Paṭisandhi, Bhavaṅga e Cuti de humanos com deficiência congênita (ahetuka-sugati) e devas inferiores.",
          "Equanimity-accompanied wholesome investigating consciousness: performs santīraṇa and tadārammaṇa, and also Paṭisandhi, Bhavaṅga, and Cuti for congenitally impaired humans and lower devas.",
          "Conciencia investigadora saludable con ecuanimidad: opera como santīraṇa y tadārammaṇa, y como Paṭisandhi, Bhavaṅga y Cuti en humanos con discapacidad congénita y devas inferiores.")),
        # 3 Ahetuka Kiriya (28..30)
        (28, "Pañcadvārāvajjana", "Upekkhā-sahagataṃ pañcadvārāvajjana-cittaṃ", "Ahetuka Kiriya (1/3)", 10,
         ("Advertência das cinco portas: primeiro citta do processo cognitivo (vīthi) sensorial; rompe a passividade do bhavaṅga e volta a atenção para um impacto nas 5 portas físicas.",
          "Five-door adverting consciousness: first vīthi citta in a sense-door process; turns attention toward an impingement at any of the 5 physical sense doors.",
          "Advertencia de las cinco puertas: primer citta vīthi de un proceso sensorial; dirige la atención hacia un impacto en las 5 puertas físicas.")),
        (29, "Manodvārāvajjana", "Upekkhā-sahagataṃ manodvārāvajjana-cittaṃ", "Ahetuka Kiriya (2/3)", 11,
         ("Advertência da porta mental: desempenha DUAS funções: (1) Āvajjana na porta mental e (2) Voṭṭhapana (determinação) na porta dos 5 sentidos.",
          "Mind-door adverting consciousness: performs TWO functions: (1) Āvajjana in mind-door processes and (2) Voṭṭhapana (determining) in 5-sense-door processes.",
          "Advertencia de la puerta mental: desempeña DOS funciones: (1) Āvajjana en procesos de puerta mental y (2) Voṭṭhapana (determinación) en procesos de 5 sentidos.")),
        (30, "Hasituppāda", "Somanassa-sahagataṃ hasituppāda-cittaṃ", "Ahetuka Kiriya (3/3)", 12,
         ("Consciência produtora de sorriso: exclusiva de Budas, Paccekabudas e Arahats ao sorrirem sobre objetos sensoriais mundanos; opera na função de javana sem gerar kamma.",
          "Smile-producing consciousness: exclusive to Buddhas, Paccekabuddhas, and Arahats smiling at sense-sphere objects; functions as javana without producing kamma.",
          "Conciencia productora de sonrisa: exclusiva de Budas, Paccekabudas y Arahats al sonreír ante objetos sensoriales; opera como javana sin producir kamma.")),
    ]
    for num, short_name, pali, cat_sub, cet_cnt, ans in ahetuka_specs:
        cards.append({
            "id": f"c1.citta_{num:02d}",
            "chapter": 1,
            "axis": "citta",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"#{num} {short_name}: {pali}",
            "categoryLabel": {
                "pt": f"Kāmāvacara Ahetuka · {cat_sub}",
                "en": f"Kāmāvacara Ahetuka · {cat_sub}",
                "es": f"Kāmāvacara Ahetuka · {cat_sub}",
            },
            "prompt": {
                "pt": f"Qual é a definição, sensação, base e função exata do {short_name} (classe #{num} dos 89 cittas)?",
                "en": f"What is the exact definition, feeling, base, and function of {short_name} (class #{num} of 89 cittas)?",
                "es": f"¿Cuál es la definición, sensación, base y función exacta de {short_name} (clase #{num} de 89 cittas)?",
            },
            "answer": {"pt": ans[0], "en": ans[1], "es": ans[2]},
            "mechanics": {
                "pt": f"Ahetuka (0 raízes) | Exatamente {cet_cnt} cetasikas associados.",
                "en": f"Ahetuka (0 roots) | Exactly {cet_cnt} associated cetasikas.",
                "es": f"Ahetuka (0 raíces) | Exactamente {cet_cnt} cetasikas asociados.",
            },
            "source": {"as": "I.7–9", "cma": "I §8–12", "segId": 20},
        })

    cards.extend(_kamavacara_sobhana_cards())
    cards.extend(_rupavacara_cards())
    cards.extend(_arupavacara_cards())
    cards.extend(_lokuttara_cards())

    # ── Structures & Houses (Cap. 1 Synthesis) ───────────────────────────────
    cards.extend([
        {
            "id": "c1.struct_kamavacara_54",
            "chapter": 1,
            "axis": "citta",
            "tier": "structure",
            "requires": ["c1.citta_01", "c1.citta_13", "c1.citta_31"],
            "paliTerm": "Kāmāvacara-citta (54)",
            "categoryLabel": {
                "pt": "Estrutura por Plano · Esfera Sensorial",
                "en": "Plane Structure · Sense Sphere",
                "es": "Estructura por Plano · Esfera Sensorial",
            },
            "prompt": {
                "pt": "Como se decompõem exatamente as 54 classes de Kāmāvacara citta (esfera dos sentidos)?",
                "en": "How do the 54 classes of Kāmāvacara citta (sense sphere) decompose exactly?",
                "es": "¿Cómo se descomponen exactamente las 54 clases de Kāmāvacara citta (esfera sensorial)?",
            },
            "answer": {
                "pt": "54 = 12 Akusala (8 Lobha + 2 Dosa + 2 Moha) + 18 Ahetuka (7 Akusala-vipāka + 8 Kusala-vipāka + 3 Kiriya) + 24 Kāmāvacara Sobhana (8 Mahākusala + 8 Mahāvipāka + 8 Mahākiriya).",
                "en": "54 = 12 Akusala (8 Lobha + 2 Dosa + 2 Moha) + 18 Ahetuka (7 Akusala-vipāka + 8 Kusala-vipāka + 3 Kiriya) + 24 Kāmāvacara Sobhana (8 Mahākusala + 8 Mahāvipāka + 8 Mahākiriya).",
                "es": "54 = 12 Akusala (8 Lobha + 2 Dosa + 2 Moha) + 18 Ahetuka (7 Akusala-vipāka + 8 Kusala-vipāka + 3 Kiriya) + 24 Kāmāvacara Sobhana (8 Mahākusala + 8 Mahāvipāka + 8 Mahākiriya).",
            },
            "source": {"as": "I.22", "cma": "I §33", "segId": 58},
        },
        {
            "id": "c1.struct_mahaggata_27",
            "chapter": 1,
            "axis": "citta",
            "tier": "structure",
            "requires": ["c1.citta_55", "c1.citta_70"],
            "paliTerm": "Mahaggata-citta (15 Rūpāvacara + 12 Arūpāvacara = 27)",
            "categoryLabel": {
                "pt": "Estrutura por Plano · Consciência Sublime",
                "en": "Plane Structure · Sublime Consciousness",
                "es": "Estructura por Plano · Conciencia Sublime",
            },
            "prompt": {
                "pt": "Como se estruturam os 27 cittas sublimes (Mahaggata) e o que os diferencia entre Rūpāvacara e Arūpāvacara?",
                "en": "How are the 27 sublime (Mahaggata) cittas structured and what differentiates Rūpāvacara from Arūpāvacara?",
                "es": "¿Cómo se estructuran los 27 cittas sublimes (Mahaggata) y qué diferencia Rūpāvacara de Arūpāvacara?",
            },
            "answer": {
                "pt": "15 Rūpāvacara (5 jhānas × Kusala/Vipāka/Kiriya, diferenciados pelos fatores de jhāna) + 12 Arūpāvacara (4 esferas × Kusala/Vipāka/Kiriya, todos com os fatores do 5º jhāna e diferenciados pelo objeto imaterial). Todos os 27 são tihetuka.",
                "en": "15 Rūpāvacara (5 jhānas × Kusala/Vipāka/Kiriya, differentiated by jhāna factors) + 12 Arūpāvacara (4 spheres × Kusala/Vipāka/Kiriya, all sharing 5th-jhāna factors and differentiated by immaterial object). All 27 are tihetuka.",
                "es": "15 Rūpāvacara (5 jhānas × Kusala/Vipāka/Kiriya, diferenciados por factores de jhāna) + 12 Arūpāvacara (4 esferas × Kusala/Vipāka/Kiriya, todos con factores del 5º jhāna y diferenciados por objeto inmaterial). Los 27 son tihetuka.",
            },
            "source": {"as": "I.22", "cma": "I §33", "segId": 62},
        },
        {
            "id": "c1.struct_lokuttara_nibbana_object",
            "chapter": 1,
            "axis": "citta",
            "tier": "structure",
            "requires": ["c1.citta_82", "c1.citta_89"],
            "paliTerm": "Lokuttara-citta & Nibbānārammaṇa",
            "categoryLabel": {
                "pt": "Axioma Supramundano",
                "en": "Supramundane Axiom",
                "es": "Axioma Supramundano",
            },
            "prompt": {
                "pt": "Qual é a propriedade estrutural exclusiva dos Lokuttara cittas (8 ou 40) em relação ao Nibbāna?",
                "en": "What is the exclusive structural property of Lokuttara cittas (8 or 40) regarding Nibbāna?",
                "es": "¿Cuál es la propiedad estructural exclusiva de los Lokuttara cittas (8 o 40) respecto a Nibbāna?",
            },
            "answer": {
                "pt": "Os Lokuttara cittas (4 Magga + 4 Phala, ou 40 com distinção de jhānas) são os ÚNICOS processos cognitivos capazes de tomar diretamente o Nibbāna incondicionado como seu objeto (ārammaṇa) para erradicação dos grilhões e fruição supramundana.",
                "en": "Lokuttara cittas (4 Magga + 4 Phala, or 40 by jhāna distinctions) are the ONLY cognitive processes whose structural function can directly take unconditioned Nibbāna as object (ārammaṇa) for fetter-eradication and fruition.",
                "es": "Los Lokuttara cittas (4 Magga + 4 Phala, o 40 por distinción de jhāna) son los ÚNICOS procesos cognitivos capaces de tomar directamente el Nibbāna incondicionado como objeto (ārammaṇa).",
            },
            "source": {"as": "I.20–21", "cma": "I §25–27", "segId": 53},
        },
        {
            "id": "c1.house_121_expansion",
            "chapter": 1,
            "axis": "citta",
            "tier": "house",
            "requires": [
                "c1.struct_kamavacara_54",
                "c1.struct_mahaggata_27",
                "c1.struct_lokuttara_nibbana_object",
            ],
            "paliTerm": "Vitthāra-gaṇanā: 89 → 121 Cittas",
            "categoryLabel": {
                "pt": "Síntese Arquitetônica (Casa)",
                "en": "Architectural Synthesis (House)",
                "es": "Síntesis Arquitectónica (Casa)",
            },
            "prompt": {
                "pt": "Como exatamente os 89 cittas breves se expandem nos 121 cittas detalhados (Vitthāra-gaṇanā)?",
                "en": "How exactly do the 89 brief cittas expand into the 121 detailed cittas (Vitthāra-gaṇanā)?",
                "es": "¿Cómo se expanden exactamente los 89 cittas breves en los 121 cittas detallados (Vitthāra-gaṇanā)?",
            },
            "answer": {
                "pt": "Os 81 cittas mundanos (54 Kāmāvacara + 15 Rūpāvacara + 12 Arūpāvacara) permanecem inalterados. Os 8 Lokuttara cittas (4 Magga + 4 Phala) multiplicam-se cada um pelos 5 jhānas (supramundanos), totalizando 40 Lokuttara cittas (20 Magga + 20 Phala). Soma: 81 + 40 = 121.",
                "en": "The 81 mundane cittas (54 Kāmāvacara + 15 Rūpāvacara + 12 Arūpāvacara) remain unchanged. Each of the 8 Lokuttara cittas (4 Magga + 4 Phala) multiplies across the 5 jhānas, yielding 40 Lokuttara cittas (20 Magga + 20 Phala). Total: 81 + 40 = 121.",
                "es": "Los 81 cittas mundanos (54 Kāmāvacara + 15 Rūpāvacara + 12 Arūpāvacara) permanecen iguales. Cada uno de los 8 Lokuttara cittas (4 Magga + 4 Phala) se multiplica por los 5 jhānas, dando 40 Lokuttara (20 Magga + 20 Phala). Total: 81 + 40 = 121.",
            },
            "source": {"as": "I.23–25", "cma": "I §34–36", "segId": 65},
        },
        {
            "id": "c1.house_89_by_jhana_ethics",
            "chapter": 1,
            "axis": "citta",
            "tier": "house",
            "requires": ["c1.house_121_expansion"],
            "paliTerm": {
                "pt": "Matriz Ética dos 89 Cittas (Jāti)",
                "en": "Ethical Matrix of the 89 Cittas (Jāti)",
                "es": "Matriz Ética de los 89 Cittas (Jāti)",
            },
            "categoryLabel": {
                "pt": "Síntese Arquitetônica (Casa)",
                "en": "Architectural Synthesis (House)",
                "es": "Síntesis Arquitectónica (Casa)",
            },
            "prompt": {
                "pt": "Classifique os 89 cittas pelas 4 naturezas (jāti): Akusala, Kusala, Vipāka e Kiriya, verificando a soma exata.",
                "en": "Classify the 89 cittas by the 4 natures (jāti): Akusala, Kusala, Vipāka, and Kiriya, verifying the exact sum.",
                "es": "Clasifique los 89 cittas por las 4 naturalezas (jāti): Akusala, Kusala, Vipāka y Kiriya, verificando la suma exacta.",
            },
            "answer": {
                "pt": "Akusala = 12 | Kusala = 21 (8 Mahākusala + 5 Rūpa + 4 Arūpa + 4 Magga) | Vipāka = 36 (15 Ahetuka + 8 Mahāvipāka + 5 Rūpa + 4 Arūpa + 4 Phala) | Kiriya = 20 (3 Ahetuka + 8 Mahākiriya + 5 Rūpa + 4 Arūpa). Soma: 12 + 21 + 36 + 20 = 89.",
                "en": "Akusala = 12 | Kusala = 21 (8 Mahākusala + 5 Rūpa + 4 Arūpa + 4 Magga) | Vipāka = 36 (15 Ahetuka + 8 Mahāvipāka + 5 Rūpa + 4 Arūpa + 4 Phala) | Kiriya = 20 (3 Ahetuka + 8 Mahākiriya + 5 Rūpa + 4 Arūpa). Total: 12 + 21 + 36 + 20 = 89.",
                "es": "Akusala = 12 | Kusala = 21 (8 Mahākusala + 5 Rūpa + 4 Arūpa + 4 Magga) | Vipāka = 36 (15 Ahetuka + 8 Mahāvipāka + 5 Rūpa + 4 Arūpa + 4 Phala) | Kiriya = 20 (3 Ahetuka + 8 Mahākiriya + 5 Rūpa + 4 Arūpa). Total: 12 + 21 + 36 + 20 = 89.",
            },
            "source": {"as": "I.22", "cma": "I §33", "segId": 58},
        },
    ])

    return cards
