"""Chapter 0: Catuparamatthadhamma & Ontological Foundations."""

CHAPTER_META = {
    "chapter": 0,
    "paliTitle": "Catuparamatthadhamma",
    "title": {
        "pt": "Fundamentos: As Quatro Realidades Últimas",
        "en": "Foundations: The Four Ultimate Realities",
        "es": "Fundamentos: Las Cuatro Realidades Últimas",
    },
    "subtitle": {
        "pt": "Sabhāva vs. Paññatti, os 4 Paramatthas, Cittakkhaṇa e o método quádruplo de definição.",
        "en": "Sabhāva vs. Paññatti, the 4 Paramatthas, Cittakkhaṇa, and the fourfold defining device.",
        "es": "Sabhāva vs. Paññatti, los 4 Paramatthas, Cittakkhaṇa y el método cuádruple de definición.",
    },
    "unlockPrevAtomPct": 0,
    "houseUnlockAtomPct": 75,
}


def build_cards():
    return [
        {
            "id": "c0.paramattha_sabhava",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "atom",
            "requires": [],
            "paliTerm": "Paramattha-dhamma (Sabhāva)",
            "categoryLabel": {
                "pt": "Axioma Ontológico",
                "en": "Ontological Axiom",
                "es": "Axioma Ontológico",
            },
            "prompt": {
                "pt": "O que define um paramattha dhamma (realidade última) e o distingue de paññatti?",
                "en": "What defines a paramattha dhamma (ultimate reality) and distinguishes it from paññatti?",
                "es": "¿Qué define un paramattha dhamma (realidad última) y lo distingue de paññatti?",
            },
            "answer": {
                "pt": "Um paramattha dhamma existe por sua natureza intrínseca irredutível (sabhāva), resiste à análise conceitual sem desaparecer e pode ser verificado diretamente pela sabedoria. Paññatti (conceito convencional) é uma construção mental/linguística sem natureza intrínseca própria.",
                "en": "A paramattha dhamma exists by its own irreducible intrinsic nature (sabhāva), withstands analytical dissection, and is directly verifiable by wisdom. Paññatti (conventional concept) is a mental/linguistic construct lacking intrinsic nature.",
                "es": "Un paramattha dhamma existe por su naturaleza intrínseca irreductible (sabhāva), resiste la disección analítica y es verificable directamente por la sabiduría. Paññatti (concepto convencional) es una construcción mental/lingüística sin naturaleza intrínseca.",
            },
            "mechanics": {
                "pt": "Os 4 paramatthas esgotam tudo o que existe ultimamente: Citta, Cetasika, Rūpa (condicionados/saṅkhata) e Nibbāna (incondicionado/asaṅkhata).",
                "en": "The 4 paramatthas exhaust everything that ultimately exists: Citta, Cetasika, Rūpa (conditioned/saṅkhata) and Nibbāna (unconditioned/asaṅkhata).",
                "es": "Los 4 paramatthas agotan todo lo que existe últimamente: Citta, Cetasika, Rūpa (condicionados/saṅkhata) y Nibbāna (incondicionado/asaṅkhata).",
            },
            "source": {"as": "I.2", "cma": "I §2", "segId": 7},
        },
        {
            "id": "c0.citta_atom",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "atom",
            "requires": ["c0.paramattha_sabhava"],
            "paliTerm": "Citta",
            "categoryLabel": {
                "pt": "1ª Realidade Última",
                "en": "1st Ultimate Reality",
                "es": "1.ª Realidad Última",
            },
            "prompt": {
                "pt": "Defina Citta quanto à sua característica definidora (lakkhaṇa), função e natureza estrutural.",
                "en": "Define Citta in terms of its defining characteristic (lakkhaṇa), function, and structural nature.",
                "es": "Defina Citta en cuanto a su característica definitoria (lakkhaṇa), función y naturaleza estructural.",
            },
            "answer": {
                "pt": "Citta é o centro funcional de registro cognitivo cujo lakkhaṇa único é conhecer ou tomar ciência de um objeto (ārammaṇa-vijānana). Nunca surge isoladamente: atua sempre em conjunto com cetasikas e é o fator líder na cognição do objeto.",
                "en": "Citta is the functional center of cognitive registration whose sole characteristic is cognizing an object (ārammaṇa-vijānana). It never arises alone: it always co-arises with cetasikas and leads in knowing the object.",
                "es": "Citta es el centro funcional de registro cognitivo cuya única característica es conocer un objeto (ārammaṇa-vijānana). Nunca surge aislado: siempre co-surge con cetasikas y lidera el conocimiento del objeto.",
            },
            "characteristics": {
                "lakkhana": {
                    "pt": "Conhecer um objeto (vijānana).",
                    "en": "Cognizing an object (vijānana).",
                    "es": "Conocer un objeto (vijānana).",
                },
                "rasa": {
                    "pt": "Ser o precursor dos fatores mentais concomitantes (pubbaṅgama).",
                    "en": "Being the forerunner of concomitant mental factors (pubbaṅgama).",
                    "es": "Ser el precursor de los factores mentales concomitantes (pubbaṅgama).",
                },
                "paccupatthana": {
                    "pt": "Continuidade de estados sucessivos (sandhāna).",
                    "en": "Continuity of successive states (sandhāna).",
                    "es": "Continuidad de estados sucesivos (sandhāna).",
                },
                "padatthana": {
                    "pt": "Mentalidade e materialidade (nāma-rūpa).",
                    "en": "Mentality and materiality (nāma-rūpa).",
                    "es": "Mentalidad y materialidad (nāma-rūpa).",
                },
            },
            "source": {"as": "I.2–3", "cma": "I §2–3", "segId": 8},
        },
        {
            "id": "c0.cetasika_atom",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "atom",
            "requires": ["c0.citta_atom"],
            "paliTerm": "Cetasika",
            "categoryLabel": {
                "pt": "2ª Realidade Última",
                "en": "2nd Ultimate Reality",
                "es": "2.ª Realidad Última",
            },
            "prompt": {
                "pt": "O que é Cetasika e quais são as quatro condições estritas de sua associação (sampayoga) com Citta?",
                "en": "What is Cetasika and what are the four strict conditions of its association (sampayoga) with Citta?",
                "es": "¿Qué es Cetasika y cuáles son las cuatro condiciones estrictas de su asociación (sampayoga) con Citta?",
            },
            "answer": {
                "pt": "Cetasikas são os 52 moduladores mentais síncronos que colorem e qualificam a cognição. Associam-se a citta por 4 condições: (1) Ekuppāda (surgir juntos), (2) Ekanirodha (cessar juntos), (3) Ekālambana (tomar o mesmo objeto) e (4) Ekavatthuka (depender da mesma base física, quando há base).",
                "en": "Cetasikas are the 52 synchronous mental modulators that color and qualify cognition. They associate with citta by 4 conditions: (1) Ekuppāda (arise together), (2) Ekanirodha (cease together), (3) Ekālambana (take the same object), and (4) Ekavatthuka (share the same physical base, when applicable).",
                "es": "Los cetasikas son los 52 moduladores mentales síncronos que colorean y califican la cognición. Se asocian con citta por 4 condiciones: (1) Ekuppāda (surgir juntos), (2) Ekanirodha (cesar juntos), (3) Ekālambana (tomar el mismo objeto) y (4) Ekavatthuka (compartir la misma base física, cuando hay base).",
            },
            "source": {"as": "II.1", "cma": "II §1", "segId": 79},
        },
        {
            "id": "c0.rupa_atom",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "atom",
            "requires": ["c0.paramattha_sabhava"],
            "paliTerm": "Rūpa",
            "categoryLabel": {
                "pt": "3ª Realidade Última",
                "en": "3rd Ultimate Reality",
                "es": "3.ª Realidad Última",
            },
            "prompt": {
                "pt": "Qual é a definição exata de Rūpa (materialidade) e sua diferença funcional fundamental em relação a Citta e Cetasika?",
                "en": "What is the exact definition of Rūpa (materiality) and its fundamental functional difference from Citta and Cetasika?",
                "es": "¿Cuál es la definición exacta de Rūpa (materialidad) y su diferencia funcional fundamental respecto a Citta y Cetasika?",
            },
            "answer": {
                "pt": "Rūpa (28 fenômenos materiais) é a realidade última não-cognitiva caracterizada por ser alterada, deformada ou perturbada (ruppana) por condições opostas (frio, calor, etc.). Ao contrário de nāma (citta e cetasika), rūpa é incapaz de conhecer qualquer objeto (anārammaṇa).",
                "en": "Rūpa (28 material phenomena) is non-cognitive ultimate reality characterized by being molested, deformed, or altered (ruppana) by adverse physical conditions (cold, heat, etc.). Unlike nāma (citta and cetasika), rūpa cannot cognize any object (anārammaṇa).",
                "es": "Rūpa (28 fenómenos materiales) es la realidad última no cognitiva caracterizada por ser alterada o perturbada (ruppana) por condiciones adversas (frío, calor, etc.). A diferencia de nāma (citta y cetasika), rūpa no puede conocer objeto alguno (anārammaṇa).",
            },
            "mechanics": {
                "pt": "Assimetria temporal: 1 unidade de rūpa perdura por 17 momentos de consciência (cittakkhaṇas), iterando 17× mais devagar que a mente.",
                "en": "Temporal asymmetry: 1 unit of rūpa lasts for 17 consciousness-moments (cittakkhaṇas), iterating 17× slower than mind.",
                "es": "Asimetría temporal: 1 unidad de rūpa perdura por 17 momentos de conciencia (cittakkhaṇas), iterando 17× más lento que la mente.",
            },
            "source": {"as": "I.2; VI", "cma": "I §2; VI §1", "segId": 8},
        },
        {
            "id": "c0.nibbana_atom",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "atom",
            "requires": ["c0.paramattha_sabhava"],
            "paliTerm": "Nibbāna (Asaṅkhata-dhātu)",
            "categoryLabel": {
                "pt": "4ª Realidade Última",
                "en": "4th Ultimate Reality",
                "es": "4.ª Realidad Última",
            },
            "prompt": {
                "pt": "Defina Nibbāna como realidade última discreta e explique por que NÃO pode ser classificado como estado cognitivo ou consciência transcendente.",
                "en": "Define Nibbāna as a discrete ultimate reality and explain why it MUST NOT be classified as a cognitive state or transcendent consciousness.",
                "es": "Defina Nibbāna como realidad última discreta y explique por qué NO puede clasificarse como un estado cognitivo o conciencia trascendente.",
            },
            "answer": {
                "pt": "Nibbāna é o único dhamma incondicionado (asaṅkhata), desprovido de nascimento, duração e dissolução (uppāda, ṭhiti, bhaṅga). É estritamente um alvo objetivo (ārammaṇa) conhecido pelos cittas supramundanos (lokuttara), carecendo em absoluto de atividade cognitiva ou experiência subjetiva própria.",
                "en": "Nibbāna is the sole unconditioned dhamma (asaṅkhata), devoid of arising, presence, and dissolution (uppāda, ṭhiti, bhaṅga). It is strictly an objective referent (ārammaṇa) cognized by supramundane (lokuttara) cittas, utterly devoid of cognitive activity or subjective experience.",
                "es": "Nibbāna es el único dhamma incondicionado (asaṅkhata), desprovido de surgimiento, presencia y disolución (uppāda, ṭhiti, bhaṅga). Es estrictamente un objeto (ārammaṇa) conocido por los cittas supramundanos (lokuttara), absolutamente desprovisto de actividad cognitiva o experiencia subjetiva.",
            },
            "source": {"as": "I.2; VI.30", "cma": "I §2; VI §30", "segId": 568},
        },
        {
            "id": "c0.cittakkhana",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "structure",
            "requires": ["c0.citta_atom", "c0.rupa_atom"],
            "paliTerm": "Cittakkhaṇa (Uppāda · Ṭhiti · Bhaṅga)",
            "categoryLabel": {
                "pt": "Dinâmica Temporal Condicionada",
                "en": "Conditioned Temporal Dynamics",
                "es": "Dinámica Temporal Condicionada",
            },
            "prompt": {
                "pt": "Quais são os três submomentos de todo momento de consciência (cittakkhaṇa) e como isso se relaciona ao ciclo dos saṅkhata dhammas?",
                "en": "What are the three sub-moments of every consciousness-moment (cittakkhaṇa) and how does this relate to all saṅkhata dhammas?",
                "es": "¿Cuáles son los tres submomentos de todo momento de conciencia (cittakkhaṇa) y cómo se relaciona con todos los saṅkhata dhammas?",
            },
            "answer": {
                "pt": "Cada cittakkhaṇa divide-se em 3 submomentos iguais: (1) Uppāda (gênese/surgimento), (2) Ṭhiti (estabilidade/presença) e (3) Bhaṅga (dissolução/cessação). Todos os dhammas condicionados (saṅkhata: citta, cetasika, rūpa) submetem-se a esse ciclo triádico, mas em velocidades assimétricas (1 cittakkhaṇa vs. 17 cittakkhaṇas para rūpa).",
                "en": "Each cittakkhaṇa divides into 3 equal sub-moments: (1) Uppāda (arising), (2) Ṭhiti (presence/duration), and (3) Bhaṅga (dissolution). All conditioned dhammas (saṅkhata: citta, cetasika, rūpa) undergo this triad, though at asymmetric speeds (1 cittakkhaṇa vs. 17 cittakkhaṇas for rūpa).",
                "es": "Cada cittakkhaṇa se divide en 3 submomentos iguales: (1) Uppāda (surgimiento), (2) Ṭhiti (presencia/duración) y (3) Bhaṅga (disolución). Todos los dhammas condicionados (saṅkhata: citta, cetasika, rūpa) pasan por esta tríada, aunque a velocidades asimétricas (1 cittakkhaṇa frente a 17 cittakkhaṇas para rūpa).",
            },
            "source": {"as": "IV; VI", "cma": "IV §6; VI §16", "segId": 287},
        },
        {
            "id": "c0.four_defining_devices",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "structure",
            "requires": ["c0.paramattha_sabhava"],
            "paliTerm": "Lakkhaṇa · Rasa · Paccupaṭṭhāna · Padaṭṭhāna",
            "categoryLabel": {
                "pt": "Metodologia Analítica",
                "en": "Analytical Methodology",
                "es": "Metodología Analítica",
            },
            "prompt": {
                "pt": "O que são os quatro dispositivos definitórios usados no Abhidhamma para caracterizar cada dhamma discreto?",
                "en": "What are the four defining devices used in Abhidhamma to characterize each discrete dhamma?",
                "es": "¿Cuáles son los cuatro dispositivos definitorios usados en el Abhidhamma para caracterizar cada dhamma discreto?",
            },
            "answer": {
                "pt": "(1) Lakkhaṇa: característica intrínseca saliente; (2) Rasa: função concreta (kicca) ou realização (sampatti); (3) Paccupaṭṭhāna: modo como se manifesta na experiência meditativa ou como resultado (phala); (4) Padaṭṭhāna: causa próxima imediata da qual depende.",
                "en": "(1) Lakkhaṇa: salient intrinsic characteristic; (2) Rasa: concrete function (kicca) or accomplishment (sampatti); (3) Paccupaṭṭhāna: manifestation in experience or effect (phala); (4) Padaṭṭhāna: immediate proximate cause on which it depends.",
                "es": "(1) Lakkhaṇa: característica intrínseca saliente; (2) Rasa: función concreta (kicca) o logro (sampatti); (3) Paccupaṭṭhāna: manifestación en la experiencia o efecto (phala); (4) Padaṭṭhāna: causa próxima inmediata de la que depende.",
            },
            "source": {"cma": "I §3"},
        },
        {
            "id": "c0.pannatti_distinction",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "structure",
            "requires": ["c0.paramattha_sabhava"],
            "paliTerm": "Paññatti (Nāma-paññatti & Attha-paññatti)",
            "categoryLabel": {
                "pt": "Verdade Convencional vs. Última",
                "en": "Conventional vs. Ultimate Truth",
                "es": "Verdad Convencional vs. Última",
            },
            "prompt": {
                "pt": "Como se distinguem Nāma-paññatti e Attha-paññatti dentro da realidade convencional (sammuti-sacca)?",
                "en": "How are Nāma-paññatti and Attha-paññatti distinguished within conventional reality (sammuti-sacca)?",
                "es": "¿Cómo se distinguen Nāma-paññatti y Attha-paññatti dentro de la realidad convencional (sammuti-sacca)?",
            },
            "answer": {
                "pt": "Nāma-paññatti (conceito como nome) são os termos, palavras e símbolos sonoros que dão nome às coisas. Attha-paññatti (conceito como significado) são as ideias, formas, coleções ou noções mentais comunicadas por esses nomes (ex.: 'casa', 'pessoa', 'montanha'). Nenhum dos dois possui sabhāva último.",
                "en": "Nāma-paññatti (concept-as-name) are words, terms, and vocal signs that designate things. Attha-paññatti (concept-as-meaning) are the mental ideas, shapes, or collectives signified by those names (e.g. 'house', 'person'). Neither possesses ultimate sabhāva.",
                "es": "Nāma-paññatti (concepto como nombre) son las palabras y signos que designan cosas. Attha-paññatti (concepto como significado) son las ideas, formas o conjuntos significados por esos nombres (ej. 'casa', 'persona'). Ninguno posee sabhāva último.",
            },
            "source": {"as": "VIII.26", "cma": "VIII §26", "segId": 701},
        },
        {
            "id": "c0.four_paramatthas_house",
            "chapter": 0,
            "axis": "paramattha",
            "tier": "house",
            "requires": [
                "c0.citta_atom",
                "c0.cetasika_atom",
                "c0.rupa_atom",
                "c0.nibbana_atom",
                "c0.cittakkhana",
            ],
            "paliTerm": {
                "pt": "Arquitetura dos 4 Paramatthas (Saṅkhata vs. Asaṅkhata)",
                "en": "Architecture of the 4 Paramatthas (Saṅkhata vs. Asaṅkhata)",
                "es": "Arquitectura de los 4 Paramatthas (Saṅkhata vs. Asaṅkhata)",
            },
            "categoryLabel": {
                "pt": "Síntese Ontológica (Casa)",
                "en": "Ontological Synthesis (House)",
                "es": "Síntesis Ontológica (Casa)",
            },
            "prompt": {
                "pt": "Sintetize a arquitetura completa dos 4 paramattha dhammas cruzando os eixos (1) Nāma vs. Rūpa, (2) Saṅkhata vs. Asaṅkhata, e (3) capacidade cognitiva.",
                "en": "Synthesize the full architecture of the 4 paramattha dhammas across (1) Nāma vs. Rūpa, (2) Saṅkhata vs. Asaṅkhata, and (3) cognitive capacity.",
                "es": "Sintetice la arquitectura completa de los 4 paramattha dhammas cruzando (1) Nāma vs. Rūpa, (2) Saṅkhata vs. Asaṅkhata y (3) capacidad cognitiva.",
            },
            "answer": {
                "pt": "Citta (89/121) e Cetasika (52) são Nāma condicionado (saṅkhata) e cognitivo (tomam objeto, 1 cittakkhaṇa). Rūpa (28) é materialidade condicionada (saṅkhata), não-cognitiva (17 cittakkhaṇas). Nibbāna (1) é Nāma-dhātu incondicionado (asaṅkhata), sem gênese/duração/cessação, não-cognitivo (é exclusivamente ārammaṇa de Lokuttara cittas).",
                "en": "Citta (89/121) and Cetasika (52) are conditioned (saṅkhata) cognitive Nāma (take objects, 1 cittakkhaṇa). Rūpa (28) is conditioned non-cognitive materiality (17 cittakkhaṇas). Nibbāna (1) is unconditioned (asaṅkhata) Nāma-element, free of arising/duration/decay, strictly non-cognitive (solely an ārammaṇa of Lokuttara cittas).",
                "es": "Citta (89/121) y Cetasika (52) son Nāma condicionado (saṅkhata) y cognitivo (toman objeto, 1 cittakkhaṇa). Rūpa (28) es materialidad condicionada no cognitiva (17 cittakkhaṇas). Nibbāna (1) es Nāma incondicionado (asaṅkhata), libre de surgimiento/duración/cese, no cognitivo (solo ārammaṇa de cittas Lokuttara).",
            },
            "source": {"as": "I.2", "cma": "I §2", "segId": 8},
        },
    ]
