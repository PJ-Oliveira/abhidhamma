"""Chapter 3: Pakiṇṇakapariccheda — All 6 Roots, 14 Functions, 6 Doors, 6 Objects, 6 Bases, and Feelings."""

CHAPTER_META = {
    "chapter": 3,
    "paliTitle": "Pakiṇṇakapariccheda",
    "title": {
        "pt": "Cap. 3: Grelhas Logísticas (Pakiṇṇaka)",
        "en": "Ch. 3: Compendium of Miscellaneous (Pakiṇṇaka)",
        "es": "Cap. 3: Compendio de los Diversos (Pakiṇṇaka)",
    },
    "subtitle": {
        "pt": "Mapeamento item a item: 6 raízes (hetu), 14 funções (kicca), 6 portas (dvāra), 6 objetos (ārammaṇa) e 6 bases (vatthu).",
        "en": "Item-by-item mapping: 6 roots (hetu), 14 functions (kicca), 6 doors (dvāra), 6 objects (ārammaṇa), and 6 bases (vatthu).",
        "es": "Mapeo ítem por ítem: 6 raíces (hetu), 14 funciones (kicca), 6 puertas (dvāra), 6 objetos (ārammaṇa) y 6 bases (vatthu).",
    },
    "unlockPrevAtomPct": 80,
    "houseUnlockAtomPct": 75,
}


def build_cards():
    cards = []

    # ── 6 Roots (Hetu) ───────────────────────────────────────────────────────
    hetus = [
        (1, "Lobha", "Avidez", "Greed", "Avidez", "Akusala-hetu (1/3)",
         ("Raiz prejudicial da avidez/cobiça: apega-se ao objeto desejável. Ocorre nos 8 Lobha-mūla-cittas.",
          "Unwholesome root of greed/attachment: clings to desirable objects. Occurs in the 8 Lobha-mūla-cittas.",
          "Raíz insalubre de avidez/apego: se aferra al objeto deseable. Ocurre en los 8 Lobha-mūla-cittas.")),
        (2, "Dosa", "Ódio", "Hatred", "Odio", "Akusala-hetu (2/3)",
         ("Raiz prejudicial da aversão/ódio: rejeita ou ataca o objeto desagradável. Ocorre nos 2 Dosa-mūla-cittas.",
          "Unwholesome root of hatred/aversion: rejects or attacks unpleasant objects. Occurs in the 2 Dosa-mūla-cittas.",
          "Raíz insalubre de odio/aversión: rechaza o ataca objetos desagradables. Ocurre en los 2 Dosa-mūla-cittas.")),
        (3, "Moha", "Ilusão", "Delusion", "Ilusión", "Akusala-hetu (3/3)",
         ("Raiz prejudicial da ilusão/ignorância: cega a mente para a natureza real dos dhammas. Ocorre em todos os 12 akusala cittas (única raiz nos 2 Moha-mūla).",
          "Unwholesome root of delusion/ignorance: blinds the mind to reality. Present in all 12 akusala cittas (sole root in 2 Moha-mūla).",
          "Raíz insalubre de ilusión/ignorancia: ciega la mente ante la realidad. Presente en los 12 akusala cittas (única raíz en 2 Moha-mūla).")),
        (4, "Alobha", "Não-avidez", "Non-greed", "No-avidez", "Sobhana-hetu (1/3)",
         ("Raiz bela de não-avidez/generosidade: desapego que sustenta todos os 59/91 sobhana cittas (kusala, vipāka, kiriya).",
          "Beautiful root of non-greed/generosity: detachment supporting all 59/91 sobhana cittas.",
          "Raíz bella de no-avidez/generosidad: desapego que sostiene todos los 59/91 sobhana cittas.")),
        (5, "Adosa", "Não-ódio", "Non-hatred", "No-odio", "Sobhana-hetu (2/3)",
         ("Raiz bela de não-ódio/benevolência (mettā): suavidade sem hostilidade, presente em todos os 59/91 sobhana cittas.",
          "Beautiful root of non-hatred/loving-kindness (mettā): non-hostility present in all 59/91 sobhana cittas.",
          "Raíz bella de no-odio/benevolencia (mettā): ausencia de hostilidad en todos los 59/91 sobhana cittas.")),
        (6, "Amoha", "Não-ilusão / Paññā", "Non-delusion / Paññā", "No-ilusión / Paññā", "Sobhana-hetu (3/3)",
         ("Raiz bela da sabedoria (paññā): compreensão clara da realidade. Presente nos 47 cittas tihetukas (12 kāmāvacara ñāṇa-sampayutta + 27 mahaggata + 8 lokuttara).",
          "Beautiful root of non-delusion/wisdom (paññā): clear comprehension of reality. Present in 47 tihetuka cittas.",
          "Raíz bella de no-ilusión/sabiduría (paññā): comprensión clara. Presente en 47 cittas tihetukas.")),
    ]
    for idx, pali_n, pt_n, en_n, es_n, sub, desc in hetus:
        cards.append({
            "id": f"c3.hetu_{idx:02d}",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "atom",
            "requires": [],
            "paliTerm": {
                "pt": f"Hetu {idx}/6: {pali_n} ({pt_n})",
                "en": f"Hetu {idx}/6: {pali_n} ({en_n})",
                "es": f"Hetu {idx}/6: {pali_n} ({es_n})",
            },
            "categoryLabel": {"pt": f"Pakiṇṇaka · Raízes ({sub})", "en": f"Pakiṇṇaka · Roots ({sub})", "es": f"Pakiṇṇaka · Raíces ({sub})"},
            "prompt": {
                "pt": f"Defina a raiz (hetu) {pali_n} ({pt_n}) e indique exatamente em quais classes de citta ela ocorre.",
                "en": f"Define the root (hetu) {pali_n} ({en_n}) and state exactly which citta classes contain it.",
                "es": f"Defina la raíz (hetu) {pali_n} ({es_n}) e indique exactamente en qué clases de citta ocurre.",
            },
            "answer": {"pt": desc[0], "en": desc[1], "es": desc[2]},
            "source": {"as": "III.5–7", "cma": "III §5–7", "segId": 193},
        })

    # ── 14 Functions (Kicca) ─────────────────────────────────────────────────
    kiccas = [
        (1, "Paṭisandhi", "Religação / Renascimento", "Rebirth-linking", "Reconexión / Renacimiento",
         "Conecta uma nova existência ao momento da morte anterior, surgindo uma única vez no início da vida. Desempenhada por 19 cittas (2 santīraṇas + 8 mahāvipāka + 5 rūpavipāka + 4 arūpavipāka).",
         "Connects a new existence to the preceding death, arising once at the start of life. Performed by 19 cittas.",
         "Conecta una nueva existencia con la muerte anterior, surgiendo una vez al inicio de la vida. Desempeñada por 19 cittas."),
        (2, "Bhavaṅga", "Contínuo Vital", "Life-continuum", "Continuo Vital",
         "Mantém o fluxo passivo e ininterrupto da corrente vital entre processos cognitivos ativos, tomando o mesmo objeto da paṭisandhi (kamma, kammanimitta ou gatinimitta). Mesmos 19 cittas.",
         "Maintains the passive uninterrupted stream of life between active cognitive processes, taking the same object as paṭisandhi. Same 19 cittas.",
         "Mantiene el flujo pasivo del continuo vital entre procesos cognitivos, con el mismo objeto de paṭisandhi. Mismos 19 cittas."),
        (3, "Āvajjana", "Advertência", "Adverting", "Advertencia",
         "Volta a atenção da mente para o novo objeto que impacta a porta, interrompendo o bhavaṅga. Desempenhada por 2 cittas: Pañcadvārāvajjana (5 sentidos) e Manodvārāvajjana (porta mental).",
         "Turns attention toward the new object impinging on a door, arresting bhavaṅga. Performed by 2 cittas: Pañcadvārāvajjana and Manodvārāvajjana.",
         "Dirige la atención hacia el nuevo objeto que impacta la puerta. Desempeñada por 2 cittas: Pañcadvārāvajjana y Manodvārāvajjana."),
        (4, "Dassana", "Visão", "Seeing", "Visión",
         "Apreensão direta da forma visível (rūpārammaṇa) na porta ocular. Desempenhada pelos 2 cakkhuviññāṇas (kusala-vipāka e akusala-vipāka).",
         "Direct apprehension of visible form at the eye door. Performed by the 2 cakkhuviññāṇas.",
         "Aprehensión directa de la forma visible en la puerta ocular. Desempeñada por los 2 cakkhuviññāṇas."),
        (5, "Savana", "Audição", "Hearing", "Audición",
         "Apreensão direta do som (saddārammaṇa) na porta auditiva. Desempenhada pelos 2 sotaviññāṇas.",
         "Direct apprehension of sound at the ear door. Performed by the 2 sotaviññāṇas.",
         "Aprehensión directa del sonido en la puerta auditiva. Desempeñada por los 2 sotaviññāṇas."),
        (6, "Ghāyana", "Olfato", "Smelling", "Olfato",
         "Apreensão direta do odor (gandhārammaṇa) na porta olfativa. Desempenhada pelos 2 ghānaviññāṇas.",
         "Direct apprehension of odor at the nose door. Performed by the 2 ghānaviññāṇas.",
         "Aprehensión directa del olor en la puerta olfativa. Desempeñada por los 2 ghānaviññāṇas."),
        (7, "Sāyana", "Paladar", "Tasting", "Gusto",
         "Apreensão direta do sabor (rasārammaṇa) na porta gustativa. Desempenhada pelos 2 jivhāviññāṇas.",
         "Direct apprehension of taste at the tongue door. Performed by the 2 jivhāviññāṇas.",
         "Aprehensión directa del sabor en la puerta gustativa. Desempeñada por los 2 jivhāviññāṇas."),
        (8, "Phusana", "Tato", "Touching", "Tacto",
         "Apreensão direta do objeto tangível (phoṭṭhabbārammaṇa) na porta corporal. Desempenhada pelos 2 kāyaviññāṇas (com sukha ou dukkha).",
         "Direct apprehension of tangible object at the body door. Performed by the 2 kāyaviññāṇas (sukha or dukkha).",
         "Aprehensión directa del objeto tangible en la puerta corporal. Desempeñada por los 2 kāyaviññāṇas (sukha o dukkha)."),
        (9, "Sampaṭicchana", "Recepção", "Receiving", "Recepción",
         "Recebe o objeto sensorial imediatamente após a consciência sensorial (pañcaviññāṇa). Desempenhada pelos 2 sampaṭicchana-cittas.",
         "Receives the sense-object immediately after sense-consciousness. Performed by the 2 sampaṭicchana-cittas.",
         "Recibe el objeto sensorial inmediatamente después de pañcaviññāṇa. Desempeñada por los 2 sampaṭicchana-cittas."),
        (10, "Santīraṇa", "Investigação", "Investigating", "Investigación",
         "Examina/investiga a natureza do objeto recebido na porta dos 5 sentidos. Desempenhada pelos 3 santīraṇa-cittas.",
         "Examines/investigates the sense-object received at the 5 sense doors. Performed by the 3 santīraṇa-cittas.",
         "Examina/investiga el objeto recibido en las 5 puertas sensoriales. Desempeñada por los 3 santīraṇa-cittas."),
        (11, "Voṭṭhapana", "Determinação", "Determining", "Determinación",
         "Define/delimita o objeto sensorial preparando a porta para a reação ativa de javana. Desempenhada exclusivamente pelo Manodvārāvajjana-citta.",
         "Defines/determines the sense-object, opening the way for javana impulsion. Performed solely by Manodvārāvajjana.",
         "Define/determina el objeto sensorial preparando la vía para javana. Desempeñada exclusivamente por Manodvārāvajjana."),
        (12, "Javana", "Impulsão", "Impulsion", "Impulsión",
         "Fase cognitiva ativa que 'corre velozmente' sobre o objeto (geralmente 7 vezes no kāmāvacara), gerando kamma (nos kusala/akusala) ou operando funcionalmente (Arahats) / supramundanamente. Desempenhada por 55 cittas.",
         "Active cognitive phase running swiftly over the object (7 moments in sense-sphere), creating kamma or acting functionally/supramundanely. Performed by 55 cittas.",
         "Fase cognitiva activa que 'corre velozmente' sobre el objeto (7 momentos en esfera sensorial), creando kamma o actuando funcionalmente. 55 cittas."),
        (13, "Tadārammaṇa", "Registro", "Registration", "Registro",
         "Registra e 'toma como objeto' o mesmo objeto experimentado pelos javanas kāmāvacaras diante de objetos muito intensos/claros em seres sensoriais. Desempenhada por 11 cittas (3 santīraṇas + 8 mahāvipākas).",
         "Registers/retains the object experienced by sense-sphere javanas when the object is very strong/clear in sense-sphere beings. Performed by 11 cittas (3 santīraṇas + 8 mahāvipākas).",
         "Registra el objeto experimentado por javanas sensoriales ante objetos muy intensos en seres sensoriales. 11 cittas (3 santīraṇas + 8 mahāvipākas)."),
        (14, "Cuti", "Morte / Falecimento", "Death", "Muerte / Fallecimiento",
         "Último momento de consciência da existência presente; cessa o fluxo daquela vida, possuindo a mesma classe de citta e objeto da paṭisandhi e bhavaṅga daquela existência. Mesmos 19 cittas.",
         "Final consciousness-moment of the present life, marking departure from that existence with the exact same citta/object as paṭisandhi and bhavaṅga. Same 19 cittas.",
         "Último momento de conciencia de la vida presente, con la misma clase de citta y objeto que paṭisandhi y bhavaṅga. Mismos 19 cittas."),
    ]
    for idx, pali, pt_t, en_t, es_t, d_pt, d_en, d_es in kiccas:
        cards.append({
            "id": f"c3.kicca_{idx:02d}",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "atom",
            "requires": [],
            "paliTerm": {
                "pt": f"Kicca {idx}/14: {pali} ({pt_t})",
                "en": f"Kicca {idx}/14: {pali} ({en_t})",
                "es": f"Kicca {idx}/14: {pali} ({es_t})",
            },
            "categoryLabel": {
                "pt": f"Pakiṇṇaka · Funções ({idx}/14)",
                "en": f"Pakiṇṇaka · Functions ({idx}/14)",
                "es": f"Pakiṇṇaka · Funciones ({idx}/14)",
            },
            "prompt": {
                "pt": f"Qual é o papel mecânico da função (kicca) {pali} ({pt_t}) e quais cittas a desempenham?",
                "en": f"What is the mechanical role of the function (kicca) {pali} ({en_t}) and which cittas perform it?",
                "es": f"¿Cuál es el papel mecánico de la función (kicca) {pali} ({es_t}) y qué cittas la desempeñan?",
            },
            "answer": {"pt": d_pt, "en": d_en, "es": d_es},
            "source": {"as": "III.8–11", "cma": "III §8–11", "segId": 204},
        })

    # ── 6 Doors (Dvāra) ──────────────────────────────────────────────────────
    dvaras = [
        (1, "Cakkhu-dvāra", "Porta do Olho", "Eye-door", "Puerta del Ojo",
         "Constituída pela matéria sensitiva ocular (cakkhu-pasāda); via de entrada de 46 cittas nos processos visuais.",
         "Eye-sensitivity (cakkhu-pasāda); channel for 46 cittas in eye-door processes.",
         "Sensibilidad ocular (cakkhu-pasāda); canal de 46 cittas en procesos visuales."),
        (2, "Sota-dvāra", "Porta do Ouvido", "Ear-door", "Puerta del Oído",
         "Constituída pela matéria sensitiva auditiva (sota-pasāda); via de entrada de 46 cittas nos processos auditivos.",
         "Ear-sensitivity (sota-pasāda); channel for 46 cittas in ear-door processes.",
         "Sensibilidad auditiva (sota-pasāda); canal de 46 cittas en procesos auditivos."),
        (3, "Ghāna-dvāra", "Porta do Nariz", "Nose-door", "Puerta de la Nariz",
         "Constituída pela matéria sensitiva olfativa (ghāna-pasāda); via de entrada de 46 cittas nos processos olfativos.",
         "Nose-sensitivity (ghāna-pasāda); channel for 46 cittas in nose-door processes.",
         "Sensibilidad olfativa (ghāna-pasāda); canal de 46 cittas en procesos olfativos."),
        (4, "Jivhā-dvāra", "Porta da Língua", "Tongue-door", "Puerta de la Lengua",
         "Constituída pela matéria sensitiva gustativa (jivhā-pasāda); via de entrada de 46 cittas nos processos gustativos.",
         "Tongue-sensitivity (jivhā-pasāda); channel for 46 cittas in tongue-door processes.",
         "Sensibilidad gustativa (jivhā-pasāda); canal de 46 cittas en procesos gustativos."),
        (5, "Kāya-dvāra", "Porta do Corpo", "Body-door", "Puerta del Cuerpo",
         "Constituída pela matéria sensitiva tátil (kāya-pasāda); via de entrada de 46 cittas nos processos táteis.",
         "Body-sensitivity (kāya-pasāda); channel for 46 cittas in body-door processes.",
         "Sensibilidad táctil (kāya-pasāda); canal de 46 cittas en procesos táctiles."),
        (6, "Mano-dvāra", "Porta da Mente", "Mind-door", "Puerta de la Mente",
         "Constituída pelo próprio fluxo do bhavaṅga (especificamente o bhavaṅgupaccheda antes de manodvārāvajjana); porta para 67 cittas (incluindo mahaggata e lokuttara).",
         "Constituted by the bhavaṅga continuum itself (specifically bhavaṅgupaccheda before manodvārāvajjana); door for 67 cittas (incl. mahaggata and lokuttara).",
         "Constituida por el flujo del bhavaṅga mismo (específicamente bhavaṅgupaccheda); puerta de 67 cittas (incl. mahaggata y lokuttara)."),
    ]
    for idx, pali, pt_t, en_t, es_t, d_pt, d_en, d_es in dvaras:
        cards.append({
            "id": f"c3.dvara_{idx:02d}",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"Dvāra {idx}/6: {pali}",
            "categoryLabel": {"pt": f"Pakiṇṇaka · Portas ({idx}/6)", "en": f"Pakiṇṇaka · Doors ({idx}/6)", "es": f"Pakiṇṇaka · Puertas ({idx}/6)"},
            "prompt": {
                "pt": f"Qual realidade constitui a porta {pali} ({pt_t}) e quantos cittas operam por meio dela?",
                "en": f"What reality constitutes {pali} ({en_t}) and how many cittas operate through it?",
                "es": f"¿Qué realidad constituye la puerta {pali} ({es_t}) y cuántos cittas operan a través de ella?",
            },
            "answer": {"pt": d_pt, "en": d_en, "es": d_es},
            "mechanics": {
                "pt": "Nota: os 19 cittas em função de Paṭisandhi, Bhavaṅga e Cuti são Dvāravimutta ('livres de porta').",
                "en": "Note: the 19 cittas functioning as Paṭisandhi, Bhavaṅga, and Cuti are Dvāravimutta ('door-freed').",
                "es": "Nota: los 19 cittas en función de Paṭisandhi, Bhavaṅga y Cuti son Dvāravimutta ('libres de puerta').",
            },
            "source": {"as": "III.12–15", "cma": "III §12–15", "segId": 224},
        })

    # ── 6 Objects (Ārammaṇa) ─────────────────────────────────────────────────
    arammanas = [
        (1, "Rūpārammaṇa", "Objeto Visível", "Visible Form", "Forma Visible",
         "Cor/luz percebida exclusivamente pelo cakkhu-viññāṇa na porta ocular (e subsequentemente pela porta mental). Sempre presente no processo sensorial.",
         "Color/visible form cognized solely via eye-door (and subsequently mind-door). Must be present in sense-door processes.",
         "Color/forma visible conocida exclusivamente vía puerta ocular (y luego puerta mental). Presente en procesos sensoriales."),
        (2, "Saddārammaṇa", "Objeto Sonoro", "Sound Object", "Objeto Sonoro",
         "Som percebido exclusivamente pela porta auditiva (sota-viññāṇa) no presente, ou recordado/imaginado pela porta mental.",
         "Sound cognized via ear-door in the present, or recalled/conceived via mind-door.",
         "Sonido conocido vía puerta auditiva en el presente, o recordado/concebido vía puerta mental."),
        (3, "Gandhārammaṇa", "Objeto Olfativo", "Odor Object", "Objeto Olfativo",
         "Odor percebido pela porta olfativa (ghāna-viññāṇa) no presente, ou posteriormente pela porta mental.",
         "Odor cognized via nose-door in the present, or subsequently via mind-door.",
         "Olor conocido vía puerta olfativa en el presente, o posteriormente vía puerta mental."),
        (4, "Rasārammaṇa", "Objeto Gustativo", "Taste Object", "Objeto Gustativo",
         "Sabor percebido pela porta gustativa (jivhā-viññāṇa) no presente, ou posteriormente pela porta mental.",
         "Taste cognized via tongue-door in the present, or subsequently via mind-door.",
         "Sabor conocido vía puerta gustativa en el presente, o posteriormente vía puerta mental."),
        (5, "Phoṭṭhabbārammaṇa", "Objeto Tangível", "Tangible Object", "Objeto Tangible",
         "Composto por 3 elementos primários (pathavī = dureza/suavidade, tejo = temperatura, vāyo = pressão/movimento — NUNCA āpo). Apreendido por kāya-viññāṇa.",
         "Composed of 3 primary elements (pathavī = hardness/softness, tejo = heat/cold, vāyo = pressure/motion — NEVER āpo). Cognized by kāya-viññāṇa.",
         "Compuesto por 3 elementos primarios (pathavī, tejo, vāyo — NUNCA āpo). Conocido por kāya-viññāṇa."),
        (6, "Dhammārammaṇa", "Objeto Mental", "Mental Object", "Objeto Mental",
         "Compreende 6 classes acessíveis exclusivamente à porta mental (mano-dvāra): pasāda-rūpa (5), sukhuma-rūpa (16), citta (89), cetasika (52), Nibbāna (asaṅkhata, fora do tempo) e Paññatti (conceitos, fora do tempo).",
         "Comprises 6 classes accessible solely to the mind-door: pasāda-rūpa (5), subtle rūpa (16), citta (89), cetasika (52), Nibbāna (timeless), and Paññatti (timeless).",
         "Comprende 6 clases accesibles solo a la puerta mental: pasāda-rūpa (5), rūpa sutil (16), citta (89), cetasika (52), Nibbāna (atemporal) y Paññatti (atemporal)."),
    ]
    for idx, pali, pt_t, en_t, es_t, d_pt, d_en, d_es in arammanas:
        cards.append({
            "id": f"c3.arammana_{idx:02d}",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"Ārammaṇa {idx}/6: {pali}",
            "categoryLabel": {"pt": f"Pakiṇṇaka · Objetos ({idx}/6)", "en": f"Pakiṇṇaka · Objects ({idx}/6)", "es": f"Pakiṇṇaka · Objetos ({idx}/6)"},
            "prompt": {
                "pt": f"O que constitui o objeto {pali} ({pt_t}) e quais portas/cittas o apreendem?",
                "en": f"What constitutes the object {pali} ({en_t}) and which doors/cittas apprehend it?",
                "es": f"¿Qué constituye el objeto {pali} ({es_t}) y qué puertas/cittas lo aprehenden?",
            },
            "answer": {"pt": d_pt, "en": d_en, "es": d_es},
            "source": {"as": "III.16–19", "cma": "III §16–19", "segId": 240},
        })

    # ── 6 Bases (Vatthu) ─────────────────────────────────────────────────────
    vatthus = [
        (1, "Cakkhu-vatthu", "Base Ocular", "Eye-base", "Base Ocular",
         "Matéria sensitiva do olho (cakkhu-pasāda); suporte físico exclusivo dos 2 cakkhuviññāṇa-cittas.",
         "Eye-sensitivity matter (cakkhu-pasāda); exclusive physical base for the 2 cakkhuviññāṇa-cittas.",
         "Materia sensitiva del ojo; soporte físico exclusivo de los 2 cakkhuviññāṇa-cittas."),
        (2, "Sota-vatthu", "Base Auditiva", "Ear-base", "Base Auditiva",
         "Matéria sensitiva do ouvido (sota-pasāda); suporte físico exclusivo dos 2 sotaviññāṇa-cittas.",
         "Ear-sensitivity matter (sota-pasāda); exclusive physical base for the 2 sotaviññāṇa-cittas.",
         "Materia sensitiva del oído; soporte físico exclusivo de los 2 sotaviññāṇa-cittas."),
        (3, "Ghāna-vatthu", "Base Olfativa", "Nose-base", "Base Olfativa",
         "Matéria sensitiva do nariz (ghāna-pasāda); suporte físico exclusivo dos 2 ghānaviññāṇa-cittas.",
         "Nose-sensitivity matter (ghāna-pasāda); exclusive physical base for the 2 ghānaviññāṇa-cittas.",
         "Materia sensitiva de la nariz; soporte físico exclusivo de los 2 ghānaviññāṇa-cittas."),
        (4, "Jivhā-vatthu", "Base Gustativa", "Tongue-base", "Base Gustativa",
         "Matéria sensitiva da língua (jivhā-pasāda); suporte físico exclusivo dos 2 jivhāviññāṇa-cittas.",
         "Tongue-sensitivity matter (jivhā-pasāda); exclusive physical base for the 2 jivhāviññāṇa-cittas.",
         "Materia sensitiva de la lengua; soporte físico exclusivo de los 2 jivhāviññāṇa-cittas."),
        (5, "Kāya-vatthu", "Base Corporal", "Body-base", "Base Corporal",
         "Matéria sensitiva do corpo (kāya-pasāda); suporte físico exclusivo dos 2 kāyaviññāṇa-cittas.",
         "Body-sensitivity matter (kāya-pasāda); exclusive physical base for the 2 kāyaviññāṇa-cittas.",
         "Materia sensitiva del cuerpo; soporte físico exclusivo de los 2 kāyaviññāṇa-cittas."),
        (6, "Hadaya-vatthu", "Base do Coração", "Heart-base", "Base del Corazón",
         "Matéria derivada localizada no sangue dentro do coração; suporte físico da manodhātu (3) e manoviññāṇadhātu (76 nos planos com matéria). Ausente nos planos imateriais (Arūpa-bhūmi).",
         "Derived matter located in blood inside the heart; physical base for manodhātu (3) and manoviññāṇadhātu (76 in realms with matter). Absent in Arūpa-bhūmi.",
         "Materia derivada ubicada en la sangre dentro del corazón; soporte físico de manodhātu y manoviññāṇadhātu en planos con materia. Ausente en Arūpa-bhūmi."),
    ]
    for idx, pali, pt_t, en_t, es_t, d_pt, d_en, d_es in vatthus:
        cards.append({
            "id": f"c3.vatthu_{idx:02d}",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "atom",
            "requires": [],
            "paliTerm": f"Vatthu {idx}/6: {pali}",
            "categoryLabel": {"pt": f"Pakiṇṇaka · Bases ({idx}/6)", "en": f"Pakiṇṇaka · Bases ({idx}/6)", "es": f"Pakiṇṇaka · Bases ({idx}/6)"},
            "prompt": {
                "pt": f"Defina a base física {pali} ({pt_t}) e indique quais cittas dependem dela.",
                "en": f"Define the physical base {pali} ({en_t}) and indicate which cittas depend on it.",
                "es": f"Defina la base física {pali} ({es_t}) e indique qué cittas dependen de ella.",
            },
            "answer": {"pt": d_pt, "en": d_en, "es": d_es},
            "mechanics": {
                "pt": "Os 4 Arūpāvacara Vipāka são sempre avatthuka (sem base física). Na esfera Arūpa, todos os cittas operantes não têm base física.",
                "en": "The 4 Arūpāvacara Vipākas are always avatthuka (without physical base). In Arūpa-bhūmi, no citta depends on a physical base.",
                "es": "Los 4 Arūpāvacara Vipāka son siempre avatthuka (sin base física).",
            },
            "source": {"as": "III.20–22", "cma": "III §20–22", "segId": 259},
        })

    # Structures & House
    cards.extend([
        {
            "id": "c3.struct_vedana_5",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "structure",
            "requires": ["c3.hetu_01", "c3.kicca_08"],
            "paliTerm": {
                "pt": "Vedanā-saṅgaha (5 Sensações)",
                "en": "Vedanā-saṅgaha (5 Feelings)",
                "es": "Vedanā-saṅgaha (5 Sensaciones)",
            },
            "categoryLabel": {"pt": "Pakiṇṇaka · Sensações", "en": "Pakiṇṇaka · Feelings", "es": "Pakiṇṇaka · Sensaciones"},
            "prompt": {
                "pt": "Como se distribuem as 5 sensações (Sukha, Dukkha, Somanassa, Domanassa, Upekkhā) pelos 89 cittas?",
                "en": "How are the 5 feelings (Sukha, Dukkha, Somanassa, Domanassa, Upekkhā) distributed across the 89 cittas?",
                "es": "¿Cómo se distribuyen las 5 sensaciones (Sukha, Dukkha, Somanassa, Domanassa, Upekkhā) entre los 89 cittas?",
            },
            "answer": {
                "pt": "Sukha (prazer físico) = 1 (kusala-vipāka kāyaviññāṇa) | Dukkha (dor física) = 1 (akusala-vipāka kāyaviññāṇa) | Domanassa (desprazer mental) = 2 (dosa-mūla) | Somanassa (alegria mental) = 18 (4 lobha + 1 somanassa-santīraṇa + 1 hasituppāda + 12 kāmāvacara sobhana) + 12 (1º–4º rūpa jhāna × 3) [= 30? Wait: 18 + 12 + ... Let's count exact: 4 lobha + 2 ahetuka + 12 kāmasobhana + 12 rūpāvacara (4×3) + 32? No, in 89: 4+2+12+12+0+0 = 30? No: 18+12 = 30, wait: 1º-4º Lokuttara in 121! In 89: 4 lobha + 1 somanassa-santīraṇa + 1 hasituppāda + 12 kāma sobhana + 12 rūpāvacara (1st-4th × 3) = 30, or 18+12? Wait: in Abhidhamma: Sukha=1, Dukkha=1, Domanassa=2, Somanassa=62 in 121 (18 + 12 + 32 lokuttara) or 30? Wait: Lokuttara in 89 has 8, 5th jhāna is upekkhā, 1st-4th are somanassa, so in 89 brief: 18 + 12 = 30 + (no single fixed in brief lokuttara unless counted as 62 in 121). Let's state the exact canonical numbers: in 121: Sukha=1, Dukkha=1, Domanassa=2, Somanassa=62 (18 kāma + 12 rūpa + 32 lokuttara), Upekkhā=55 (32 kāma + 3 rūpa + 12 arūpa + 8 lokuttara 5th jhāna)! Sum: 1+1+2+62+55 = 121!]",
                "en": "In the 121-citta reckoning: Sukha = 1 (kusala kāyaviññāṇa), Dukkha = 1 (akusala kāyaviññāṇa), Domanassa = 2 (dosa-mūla), Somanassa = 62 (18 sense + 12 rūpa 1st–4th jhāna + 32 lokuttara 1st–4th jhāna), Upekkhā = 55 (32 sense + 3 rūpa 5th jhāna + 12 arūpa + 8 lokuttara 5th jhāna). Total = 121.",
                "es": "En el cómputo de 121: Sukha = 1, Dukkha = 1, Domanassa = 2, Somanassa = 62 (18 sensoriales + 12 rūpa 1.º–4.º jhāna + 32 lokuttara), Upekkhā = 55 (32 sensoriales + 3 rūpa 5.º jhāna + 12 arūpa + 8 lokuttara 5.º jhāna). Total = 121.",
            },
            "source": {"as": "III.2–4", "cma": "III §2–4", "segId": 183},
        },
        {
            "id": "c3.struct_hetu_distribution",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "structure",
            "requires": [f"c3.hetu_{i:02d}" for i in range(1, 7)],
            "paliTerm": {
                "pt": "Distribuição das Raízes nos 89 Cittas",
                "en": "Root Distribution across the 89 Cittas",
                "es": "Distribución de Raíces en los 89 Cittas",
            },
            "categoryLabel": {"pt": "Pakiṇṇaka · Síntese das Raízes", "en": "Pakiṇṇaka · Roots Synthesis", "es": "Pakiṇṇaka · Síntesis de Raíces"},
            "prompt": {
                "pt": "Como se classificam os 89 cittas por número de raízes (Ahetuka, Ekahetuka, Dvihetuka, Tihetuka)?",
                "en": "How are the 89 cittas classified by number of roots (Ahetuka, Ekahetuka, Dvihetuka, Tihetuka)?",
                "es": "¿Cómo se clasifican los 89 cittas por número de raíces (Ahetuka, Ekahetuka, Dvihetuka, Tihetuka)?",
            },
            "answer": {
                "pt": "Ahetuka (0 raízes) = 18 | Ekahetuka (1 raiz: moha) = 2 (moha-mūla) | Dvihetuka (2 raízes) = 22 (8 lobha + 2 dosa + 12 kāmāvacara sobhana ñāṇa-vippayutta) | Tihetuka (3 raízes) = 47 (12 kāmāvacara sobhana ñāṇa-sampayutta + 15 rūpāvacara + 12 arūpāvacara + 8 lokuttara). Total = 89.",
                "en": "Ahetuka (0 roots) = 18 | Ekahetuka (1 root: moha) = 2 | Dvihetuka (2 roots) = 22 (8 lobha + 2 dosa + 12 sense-sphere ñāṇa-vippayutta) | Tihetuka (3 roots) = 47 (12 sense-sphere ñāṇa-sampayutta + 15 rūpa + 12 arūpa + 8 lokuttara). Total = 89.",
                "es": "Ahetuka (0 raíces) = 18 | Ekahetuka (1 raíz: moha) = 2 | Dvihetuka (2 raíces) = 22 | Tihetuka (3 raíces) = 47. Total = 89.",
            },
            "source": {"as": "III.6–7", "cma": "III §6–7", "segId": 193},
        },
        {
            "id": "c3.house_pakinnaka_synthesis",
            "chapter": 3,
            "axis": "pakinnaka",
            "tier": "house",
            "requires": [
                "c3.struct_hetu_distribution",
                "c3.kicca_11",
                "c3.kicca_12",
                "c3.dvara_06",
                "c3.arammana_06",
                "c3.vatthu_06",
            ],
            "paliTerm": {
                "pt": "Integração das 6 Grelhas de Pakiṇṇaka",
                "en": "Integration of the 6 Pakiṇṇaka Grids",
                "es": "Integración de las 6 Rejillas de Pakiṇṇaka",
            },
            "categoryLabel": {"pt": "Síntese Arquitetônica (Casa)", "en": "Architectural Synthesis (House)", "es": "Síntesis Arquitectónica (Casa)"},
            "prompt": {
                "pt": "Sintetize as exceções estruturais que conectam Kicca, Dvāra, Ārammaṇa e Vatthu: (1) cittas dvāravimutta, (2) cittas avatthuka e (3) citta dual āvajjana/voṭṭhapana.",
                "en": "Synthesize the structural cross-rules linking Kicca, Dvāra, Ārammaṇa, and Vatthu: (1) dvāravimutta cittas, (2) avatthuka cittas, and (3) the dual āvajjana/voṭṭhapana citta.",
                "es": "Sintetice las reglas cruzadas que conectan Kicca, Dvāra, Ārammaṇa y Vatthu: (1) cittas dvāravimutta, (2) cittas avatthuka y (3) el citta dual āvajjana/voṭṭhapana.",
            },
            "answer": {
                "pt": "(1) Os 19 cittas de Paṭisandhi/Bhavaṅga/Cuti operam fora das 6 portas (dvāravimutta), tomando kamma, kammanimitta ou gatinimitta; (2) Os 4 Arūpāvacara Vipākas (e todos os cittas na esfera Arūpa) operam sem base física (avatthuka); (3) O Manodvārāvajjana atua tanto como āvajjana na porta mental quanto como voṭṭhapana na porta dos 5 sentidos.",
                "en": "(1) The 19 Paṭisandhi/Bhavaṅga/Cuti cittas operate outside the 6 doors (dvāravimutta); (2) The 4 Arūpāvacara Vipākas (and all cittas in Arūpa realms) operate without physical base (avatthuka); (3) Manodvārāvajjana acts as both āvajjana in mind-door and voṭṭhapana in 5-sense-door processes.",
                "es": "(1) Los 19 cittas de Paṭisandhi/Bhavaṅga/Cuti operan fuera de las 6 puertas (dvāravimutta); (2) Los 4 Arūpāvacara Vipākas operan sin base física (avatthuka); (3) Manodvārāvajjana actúa como āvajjana en puerta mental y como voṭṭhapana en 5 sentidos.",
            },
            "source": {"as": "III.8–22", "cma": "III §8–22", "segId": 178},
        },
    ])

    # Fix clean PT answer for c3.struct_vedana_5 without draft note
    for c in cards:
        if c["id"] == "c3.struct_vedana_5":
            c["answer"]["pt"] = (
                "Na contagem detalhada de 121 cittas: Sukha (prazer físico) = 1 (kusala-vipāka kāyaviññāṇa) | "
                "Dukkha (dor física) = 1 (akusala-vipāka kāyaviññāṇa) | Domanassa (desprazer mental) = 2 (dosa-mūla) | "
                "Somanassa (alegria mental) = 62 (18 kāmāvacara + 12 rūpāvacara 1º–4º jhāna + 32 lokuttara 1º–4º jhāna) | "
                "Upekkhā (equanimidade) = 55 (32 kāmāvacara + 3 rūpāvacara 5º jhāna + 12 arūpāvacara + 8 lokuttara 5º jhāna). Soma = 121."
            )

    return cards
