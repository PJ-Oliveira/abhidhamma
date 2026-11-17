"""Chapter 9: Kammaṭṭhānapariccheda — Meditation Subjects, 7 Purifications, and Final Synthesis."""

CHAPTER_META = {
    "chapter": 9,
    "paliTitle": "Kammaṭṭhānapariccheda",
    "title": {
        "pt": "Cap. 9: Prática Meditativa e Consolidação (Kammaṭṭhāna)",
        "en": "Ch. 9: Meditation Subjects & Final Consolidation (Kammaṭṭhāna)",
        "es": "Cap. 9: Temas de Meditación y Consolidación Final (Kammaṭṭhāna)",
    },
    "subtitle": {
        "pt": "40 objetos de Samatha, 7 Purificações (Visuddhi), 10 conhecimentos de Vipassanā, 3 Vimokkhas e síntese final.",
        "en": "40 Samatha subjects, 7 Purifications (Visuddhi), 10 Vipassanā insights, 3 Emancipations, and final synthesis.",
        "es": "40 temas de Samatha, 7 Purificaciones (Visuddhi), 10 conocimientos de Vipassanā y síntesis final.",
    },
    "unlockPrevAtomPct": 80,
    "houseUnlockAtomPct": 75,
}


def build_cards():
    return [
        {
            "id": "c9.samatha_40",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "atom",
            "requires": [],
            "paliTerm": "40 Samatha-kammaṭṭhāna",
            "categoryLabel": {"pt": "Samatha · 40 Objetos", "en": "Samatha · 40 Subjects", "es": "Samatha · 40 Objetos"},
            "prompt": {
                "pt": "Enumere os 7 grupos que somam os 40 temas de meditação da serenidade (Samatha) no Abhidhammatthasaṅgaha.",
                "en": "List the 7 groups totaling the 40 Samatha meditation subjects in the Abhidhammatthasaṅgaha.",
                "es": "Enumere los 7 grupos que suman los 40 temas de meditación de serenidad (Samatha).",
            },
            "answer": {
                "pt": "10 Kasiṇas (terra, água, fogo, ar, 4 cores, luz, espaço limitado) + 10 Asubhas (estágios do cadáver) + 10 Anussatis (Buddha, Dhamma, Saṅgha, Sīla, Cāga, Devatā, Upasamā, Maraṇa, Kāyagatāsati, Ānāpānasati) + 4 Brahmavihāras (Mettā, Karuṇā, Muditā, Upekkhā) + 4 Āruppas + 1 Āhāre paṭikūlasaññā + 1 Catudhātuvavatthāna = 40.",
                "en": "10 Kasiṇas + 10 Foulness (Asubha) + 10 Recollections (Anussati) + 4 Illimitables (Brahmavihāra) + 4 Immaterial States (Āruppa) + 1 Loathsomeness in Food + 1 Four-Elements Analysis = 40.",
                "es": "10 Kasiṇas + 10 Asubhas + 10 Anussatis + 4 Brahmavihāras + 4 Āruppas + 1 Āhāre paṭikūlasaññā + 1 Catudhātuvavatthāna = 40.",
            },
            "source": {"as": "IX.2–4", "cma": "IX §2–4", "segId": 714},
        },
        {
            "id": "c9.nimitta_bhavana_3",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "atom",
            "requires": [],
            "paliTerm": "3 Nimittas & 3 Bhāvanās",
            "categoryLabel": {"pt": "Samatha · Estágios", "en": "Samatha · Stages", "es": "Samatha · Etapas"},
            "prompt": {
                "pt": "Como se correlacionam os 3 sinais (Parikamma-, Uggaha-, Paṭibhāga-nimitta) e os 3 estágios de cultivo (Parikamma-, Upacāra-, Appanā-bhāvanā)?",
                "en": "How do the 3 signs (Parikamma-, Uggaha-, Paṭibhāga-nimitta) correlate with the 3 stages of cultivation (Parikamma-, Upacāra-, Appanā-bhāvanā)?",
                "es": "¿Cómo se correlacionan los 3 signos (nimitta) y las 3 etapas de cultivo (bhāvanā)?",
            },
            "answer": {
                "pt": "(1) Parikamma-nimitta (objeto preliminar físico) corresponde à Parikamma-bhāvanā (preparo); (2) Uggaha-nimitta (imagem mental eidética apreendida) surge ao fim do preparo; (3) Paṭibhāga-nimitta (sinal contraparte purificado, livre de defeitos conceituais) surge na Upacāra-bhāvanā (concentração de acesso) e conduz à Appanā-bhāvanā (absorção jhāna).",
                "en": "(1) Parikamma-nimitta (preliminary object) corresponds to preliminary cultivation; (2) Uggaha-nimitta (learning sign/mental replica) arises upon steady focus; (3) Paṭibhāga-nimitta (purified counterpart sign) arises at access concentration (Upacāra) and matures into absorption (Appanā).",
                "es": "(1) Parikamma-nimitta (preliminar) con Parikamma-bhāvanā; (2) Uggaha-nimitta (imagen mental aprendida); (3) Paṭibhāga-nimitta (contraparte purificada) en Upacāra conduciendo a Appanā.",
            },
            "source": {"as": "IX.6–9", "cma": "IX §6–9", "segId": 718},
        },
        {
            "id": "c9.visuddhi_1_4",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "atom",
            "requires": [],
            "paliTerm": {
                "pt": "Visuddhi 1–4 (Fundação & Transcendência da Dúvida)",
                "en": "Visuddhi 1–4 (Foundation & Overcoming Doubt)",
                "es": "Visuddhi 1–4 (Fundamento y Superación de la Duda)",
            },
            "categoryLabel": {"pt": "Vipassanā · Purificações 1–4", "en": "Vipassanā · Purifications 1–4", "es": "Vipassanā · Purificaciones 1–4"},
            "prompt": {
                "pt": "Defina as 4 primeiras Purificações (Visuddhi): Sīla, Citta, Diṭṭhi e Kaṅkhāvitaraṇa.",
                "en": "Define the first 4 Purifications (Visuddhi): Sīla, Citta, Diṭṭhi, and Kaṅkhāvitaraṇa.",
                "es": "Defina las 4 primeras Purificaciones (Visuddhi): Sīla, Citta, Diṭṭhi y Kaṅkhāvitaraṇa.",
            },
            "answer": {
                "pt": "1. Sīla-visuddhi (Purificação da Virtude: 4 pārisuddhi-sīla); 2. Citta-visuddhi (Purificação da Mente: upacāra e appanā samādhi); 3. Diṭṭhi-visuddhi (Purificação da Visão: discernimento direto de nāma e rūpa por lakkhaṇa/rasa/paccupaṭṭhāna/padaṭṭhāna, dissipando a crença num 'eu'); 4. Kaṅkhāvitaraṇa-visuddhi (Superação da Dúvida: discernimento das causas/paccaya de nāma e rūpa nos 3 tempos).",
                "en": "1. Sīla-visuddhi (Virtue); 2. Citta-visuddhi (Mind: access/absorption concentration); 3. Diṭṭhi-visuddhi (View: direct discernment of nāma and rūpa, overcoming self-illusion); 4. Kaṅkhāvitaraṇa-visuddhi (Overcoming Doubt: discerning conditional causes of nāma-rūpa across past, present, future).",
                "es": "1. Sīla-visuddhi (Virtud); 2. Citta-visuddhi (Mente: samādhi); 3. Diṭṭhi-visuddhi (Visión: discernimiento de nāma-rūpa); 4. Kaṅkhāvitaraṇa-visuddhi (Superación de la duda: discernir causas de nāma-rūpa).",
            },
            "source": {"as": "IX.22–26", "cma": "IX §22–26", "segId": 768},
        },
        {
            "id": "c9.visuddhi_5_7",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "atom",
            "requires": ["c9.visuddhi_1_4"],
            "paliTerm": {
                "pt": "Visuddhi 5–7 (Maggāmagga, Paṭipadā e Ñāṇadassana)",
                "en": "Visuddhi 5–7 (Maggāmagga, Paṭipadā & Ñāṇadassana)",
                "es": "Visuddhi 5–7 (Maggāmagga, Paṭipadā y Ñāṇadassana)",
            },
            "categoryLabel": {"pt": "Vipassanā · Purificações 5–7", "en": "Vipassanā · Purifications 5–7", "es": "Vipassanā · Purificaciones 5–7"},
            "prompt": {
                "pt": "Defina as 3 Purificações superiores (5–7): Maggāmagga-ñāṇadassana, Paṭipadā-ñāṇadassana e Ñāṇadassana-visuddhi.",
                "en": "Define the 3 higher Purifications (5–7): Maggāmagga-ñāṇadassana, Paṭipadā-ñāṇadassana, and Ñāṇadassana-visuddhi.",
                "es": "Defina las 3 Purificaciones superiores (5–7): Maggāmagga-ñāṇadassana, Paṭipadā-ñāṇadassana y Ñāṇadassana-visuddhi.",
            },
            "answer": {
                "pt": "5. Maggāmagga-ñāṇadassana-visuddhi: discernir o verdadeiro caminho separando-o das 10 corrupções do insight (upakkilesa, ex.: luz/pīti); 6. Paṭipadā-ñāṇadassana-visuddhi: os 9 conhecimentos de vipassanā de Udayabbaya (ascensão e queda) até Saṅkhārupekkhā + Anuloma; 7. Ñāṇadassana-visuddhi: conhecimento direto dos 4 Caminhos Supramundanos (Magga-ñāṇa) tomando Nibbāna por objeto.",
                "en": "5. Maggāmagga-ñāṇadassana: distinguishing the true path from the 10 corruptions of insight; 6. Paṭipadā-ñāṇadassana: the 9 insight-knowledges from Udayabbaya (rise & fall) through Equanimity + Conformity; 7. Ñāṇadassana-visuddhi: the 4 Supramundane Paths (Magga) taking Nibbāna as object.",
                "es": "5. Maggāmagga-ñāṇadassana: distinguir el camino verdadero de las 10 corrupciones del insight; 6. Paṭipadā-ñāṇadassana: los 9 conocimientos de vipassanā hasta Anuloma; 7. Ñāṇadassana-visuddhi: los 4 Caminos Supramundanos.",
            },
            "source": {"as": "IX.27–33", "cma": "IX §27–33", "segId": 775},
        },
        {
            "id": "c9.vipassana_nanas_10",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "structure",
            "requires": ["c9.visuddhi_5_7"],
            "paliTerm": {"pt": "Os 10 Vipassanā-ñāṇas", "en": "The 10 Vipassanā-ñāṇas", "es": "Los 10 Vipassanā-ñāṇas"},
            "categoryLabel": {"pt": "Vipassanā · Conhecimentos de Insight", "en": "Vipassanā · Insight Knowledges", "es": "Vipassanā · Conocimientos de Insight"},
            "prompt": {
                "pt": "Enumere em ordem canônica os 10 Vipassanā-ñāṇas (do discernimento das Três Características até Anuloma).",
                "en": "List in canonical order the 10 Vipassanā-ñāṇas (from comprehension of Three Marks to Conformity).",
                "es": "Enumere en orden canónico los 10 Vipassanā-ñāṇas (desde las Tres Marcas hasta Anuloma).",
            },
            "answer": {
                "pt": "1. Sammasana-ñāṇa (compreensão das 3 marcas); 2. Udayabbaya-ñāṇa (ascensão e queda); 3. Bhaṅga-ñāṇa (dissolução); 4. Bhaya-ñāṇa (terror); 5. Ādīnava-ñāṇa (perigo); 6. Nibbidā-ñāṇa (desencantamento); 7. Muñcitukamyatā-ñāṇa (desejo de libertação); 8. Paṭisaṅkhā-ñāṇa (re-exame); 9. Saṅkhārupekkhā-ñāṇa (equanimidade diante das formações); 10. Anuloma-ñāṇa (conformidade que precede Gotrabhū e Magga).",
                "en": "1. Sammasana (comprehension); 2. Udayabbaya (rise & fall); 3. Bhaṅga (dissolution); 4. Bhaya (fear); 5. Ādīnava (danger); 6. Nibbidā (disenchantment); 7. Muñcitukamyatā (desire for deliverance); 8. Paṭisaṅkhā (re-observation); 9. Saṅkhārupekkhā (equanimity toward formations); 10. Anuloma (conformity).",
                "es": "1. Sammasana; 2. Udayabbaya; 3. Bhaṅga; 4. Bhaya; 5. Ādīnava; 6. Nibbidā; 7. Muñcitukamyatā; 8. Paṭisaṅkhā; 9. Saṅkhārupekkhā; 10. Anuloma.",
            },
            "source": {"as": "IX.29–32", "cma": "IX §29–32", "segId": 780},
        },
        {
            "id": "c9.vimokkha_3_and_nirodha",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "structure",
            "requires": ["c9.visuddhi_5_7"],
            "paliTerm": "3 Vimokkha & Nirodha-samāpatti",
            "categoryLabel": {"pt": "Emancipação & Cessação", "en": "Emancipation & Cessation", "es": "Emancipación y Cesación"},
            "prompt": {
                "pt": "Como as 3 contemplações (Anicca, Dukkha, Anattā) determinam os 3 portões da emancipação (Vimokkha-mukha) e o que é Nirodha-samāpatti?",
                "en": "How do the 3 contemplations (Anicca, Dukkha, Anattā) determine the 3 gateways to liberation (Vimokkha-mukha), and what is Nirodha-samāpatti?",
                "es": "¿Cómo determinan las 3 contemplaciones los 3 portales de emancipación (Vimokkha-mukha) y qué es Nirodha-samāpatti?",
            },
            "answer": {
                "pt": "Anupassanā → Vimokkha: (1) Anicca → Animitta-vimokkha (sem sinal); (2) Dukkha → Appaṇihita-vimokkha (sem anseio); (3) Anattā → Suññata-vimokkha (vazio). Nirodha-samāpatti é a suspensão temporária de todos os cittas, cetasikas e matéria nascida da mente (cittaja-rūpa), acessível apenas a Anāgāmīs e Arahats que dominam as 8 absorções (samāpattis) e unem samatha-vipassanā até o 8º reino.",
                "en": "Anicca → Signless (Animitta); Dukkha → Desireless (Appaṇihita); Anattā → Void (Suññata). Nirodha-samāpatti is the temporary suspension of all cittas, cetasikas, and mind-born matter, accessible solely to Non-Returners and Arahants who master all 8 jhānas.",
                "es": "Anicca → Animitta; Dukkha → Appaṇihita; Anattā → Suññata. Nirodha-samāpatti es la suspensión temporal de citta, cetasikas y materia nacida de citta, accesible solo a Anāgāmīs y Arahats con las 8 absorciones.",
            },
            "source": {"as": "IX.34–44", "cma": "IX §34–44", "segId": 792},
        },
        {
            "id": "c9.house_abhidhamma_edifice",
            "chapter": 9,
            "axis": "kammatthana",
            "tier": "house",
            "requires": ["c9.vipassana_nanas_10", "c9.vimokkha_3_and_nirodha"],
            "paliTerm": {
                "pt": "A Casa Completa do Abhidhammatthasaṅgaha",
                "en": "The Complete House of Abhidhammatthasaṅgaha",
                "es": "La Casa Completa del Abhidhammatthasaṅgaha",
            },
            "categoryLabel": {"pt": "Síntese Arquitetônica Final (Casa)", "en": "Final Architectural Synthesis (House)", "es": "Síntesis Arquitectónica Final (Casa)"},
            "prompt": {
                "pt": "Integre todo o edifício do Abhidhammatthasaṅgaha: como a anatomia estática (Cap. 1–2, 6) e a dinâmica condicional (Cap. 3–5, 8) culminam no processo cognitivo da realização do Nibbāna (Cap. 9)?",
                "en": "Integrate the complete Abhidhammatthasaṅgaha edifice: how do static anatomy (Ch. 1–2, 6) and conditional dynamics (Ch. 3–5, 8) culminate in the cognitive process of realizing Nibbāna (Ch. 9)?",
                "es": "Integre todo el edificio del Abhidhammatthasaṅgaha: ¿cómo culminan la anatomía (Cap. 1–2, 6) y la dinámica condicional (Cap. 3–5, 8) en la realización de Nibbāna (Cap. 9)?",
            },
            "answer": {
                "pt": "Através das 7 Visuddhis e 10 Vipassanā-ñāṇas, a sabedoria (paññindriya) disseca citta (89), cetasika (52) e rūpa (28, ciclo 17:1) e vê sua dependência condicional (Paṭiccasamuppāda + 24 Paccayas). No ápice de Saṅkhārupekkhā, um Manodvāra-vīthi de Appanā (Parikamma → Upacāra → Anuloma → Gotrabhū) abandona os objetos condicionados e dá lugar ao Magga-citta (1 cittakkhaṇa) e Phala-cittas (2–3 cittakkhaṇas), únicos processos que apreendem o Nibbāna asaṅkhata como ārammaṇa, erradicando os grilhões.",
                "en": "Through the 7 Purifications and 10 Insight Knowledges, wisdom dissects citta (89), cetasika (52), and rūpa (28, 17:1 ratio) and discerns conditionality (Paṭiccasamuppāda + 24 Paccayas). At the peak of equanimity, a mind-door Appanā-vīthi (Parikamma → Upacāra → Anuloma → Gotrabhū) relinquishes conditioned formations and triggers Magga-citta (1 moment) + Phala-cittas, the sole cognitive processes taking unconditioned Nibbāna as ārammaṇa.",
                "es": "Mediante las 7 Purificaciones y 10 Vipassanā-ñāṇas, la sabiduría disecciona citta (89), cetasika (52), rūpa (28, 17:1) y la condicionalidad. En la cúspide, un Manodvāra-vīthi de Appanā produce el Magga-citta y Phala-cittas, únicos procesos que toman Nibbāna asaṅkhata como ārammaṇa.",
            },
            "source": {"as": "IX.32–44", "cma": "IX §32–44", "segId": 801},
        },
    ]
