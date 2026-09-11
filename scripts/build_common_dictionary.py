"""
Gera data/dictionary/common_pali.json: um dicionário Pāli leve e 100% estático
(sem chamadas de API), com as palavras mais frequentes do corpus local
(Abhidhamma Piṭaka + Visuddhimagga + obras independentes, já extraído em
data/works/). A frequência de cada verbete vem da forma flexionada mais
comum observada em scripts/word_frequency.py (pali_word_freq.tsv) — um
indicador aproximado de uso, não uma contagem lematizada exaustiva.

pos: m./f./nt. = substantivo masc./fem./neutro; adj.; v. = verbo;
     abs. = absolutivo; ind. = partícula indeclinável; pron.; num.
"""
import json

E = []


def add(h, pos, en, pt, es, root=None, syn=None, usage=None, freq=None):
    entry = {"h": h, "pos": pos, "en": en, "pt": pt, "es": es}
    if root:
        entry["root"] = root
    if syn:
        entry["syn"] = syn
    if usage:
        entry["usage"] = usage
    if freq:
        entry["freq"] = freq
    E.append(entry)


# ---- A. partículas, pronomes, conjunções (essenciais para ler qualquer texto) ----
add("ca", "ind.", "and; also", "e; também", "y; también", usage="Conjunção enclítica; nunca abre frase, sempre segue a palavra que liga.", freq=46021)
add("na", "ind.", "not", "não", "no", usage="Partícula de negação; combina-se com atthi → natthi (\"não há\").", freq=39275)
add("ti / iti", "ind.", "thus; that (quotative marker closing direct/reported speech)", "assim; que (marcador citativo que fecha um discurso direto ou indireto)", "así; que (marcador citativo que cierra un discurso directo o indirecto)", usage="Equivalente às aspas de fechamento em português; \"iti\" é a forma plena, \"ti\" a forma sandhi após vogal.", freq=37732)
add("pe", "ind.", "et cetera (elision marker: \"repeat the preceding pattern\")", "et cetera (marcador de elisão: \"repita o padrão anterior\")", "etcétera (marcador de elisión: \"repita el patrón anterior\")", usage="Abreviação de peyyāla; extremamente comum no Paṭṭhāna e no Yamaka, onde longas séries repetitivas são abreviadas.", freq=25373)
add("vā", "ind.", "or", "ou", "o", usage="Conjunção disjuntiva enclítica, como \"ca\".", freq=18126)
add("pana", "ind.", "but; now; moreover", "mas; ora; além disso", "pero; ahora bien; además", usage="Marca contraste ou transição de tópico, mais suave que um \"mas\" forte.", freq=16626)
add("tattha", "ind.", "there; in that connection; therein", "ali; a esse respeito; nisso", "allí; a ese respecto; en eso", root="ta- (raiz demonstrativa) + -ttha (sufixo locativo)", usage="Muito comum para introduzir uma explicação: \"tattha ... \" = \"a esse respeito...\".", freq=16410)
add("hi", "ind.", "indeed; for; because", "com efeito; pois; porque", "en efecto; pues; porque", usage="Partícula enfática/explicativa, geralmente na segunda posição da frase.", freq=8525)
add("evaṃ", "ind.", "thus; in this way; so", "assim; deste modo", "así; de este modo", usage="Muito frequente ao final de uma explicação (\"evaṃ ... veditabbaṃ\" = \"assim deve ser entendido\").", freq=8359)
add("no", "ind.", "not (negation, verse style); also: us/our (obl. of amha)", "não (negação, estilo poético); também: nos/nosso (oblíquo de amha)", "no (negación, estilo poético); también: nos/nuestro (oblicuo de amha)", usage="Ambíguo fora de contexto: negação arcaica em versos ou pronome pessoal de 1ª pl.")
add("nāma", "ind./nt.", "by name; that is to say (particle); also: mentality/the mental (technical term, opposed to rūpa)", "por nome; ou seja (partícula); também: mentalidade/o mental (termo técnico, em oposição a rūpa)", "por nombre; es decir (partícula); también: mentalidad/lo mental (término técnico, opuesto a rūpa)", root="√nam / cf. inglês \"name\"", syn=["citta", "mano"], usage="No Abhidhamma, \"nāma\" designa os agregados mentais (vedanā, saññā, saṅkhāra, viññāṇa) em contraste com \"rūpa\" (matéria) — o par nāma-rūpa é central.", freq=6384)
add("viya", "ind.", "like; as if; as it were", "como; como se; como que", "como; como si; como que", usage="Partícula comparativa, sinônimo de \"iva\".", freq=5408)
add("tato", "ind.", "from that; thereafter; therefore", "a partir daí; depois disso; por isso", "a partir de eso; después de eso; por eso", usage="Ablativo advérbio do pronome demonstrativo \"ta-\".", freq=4547)
add("ayaṃ", "pron.", "this (masc./fem. nom. sg. of \"idam\")", "este/esta (nom. sg. masc./fem. de \"idam\")", "este/esta (nom. sg. masc./fem. de \"idam\")", usage="Pronome demonstrativo próximo; a forma neutra é \"idaṃ\".", freq=4139)
add("yaṃ", "pron.", "which; that (rel. pron., neut./acc.)", "o qual; que (pron. relativo, neutro/acusativo)", "el cual; que (pron. relativo, neutro/acusativo)", usage="Correlativo típico: \"yaṃ ... taṃ\" = \"o que ... isso\".", freq=4047)
add("yathā", "ind.", "as; just as; in accordance with", "como; assim como; conforme", "como; así como; conforme", usage="Correlativo com \"tathā\" (\"assim\"): \"yathā ... tathā\" = \"assim como ... assim também\".", freq=3999)
add("tasmā", "ind.", "therefore; for that reason", "portanto; por essa razão", "por lo tanto; por esa razón", usage="Ablativo advérbio de \"ta-\", introduz uma conclusão.", freq=3958)
add("te", "pron.", "they/those; also enclitic \"to you / your\" (dat./gen. sg. of tvaṃ)", "eles/essas; também enclítico \"a ti / teu\" (dat./gen. sg. de tvaṃ)", "ellos/esas; también enclítico \"a ti / tu\" (dat./gen. sg. de tvaṃ)", usage="Forma ambígua — nominativo/acusativo plural de \"ta-\" ou pronome de 2ª pessoa enclítico.", freq=3927)
add("ceva", "ind.", "and indeed; and also (ca + eva)", "e também; e de fato (ca + eva)", "y también; y de hecho (ca + eva)", usage="Frequentemente em par correlativo \"ceva ... ca\" = \"tanto ... quanto\".", freq=3863)
add("katvā", "abs.", "having done; having made", "tendo feito", "habiendo hecho", root="√kar (fazer) — lema karoti", usage="Absolutivo (gerúndio) do verbo mais comum do Pāli, karoti.", freq=3834)
add("yattha", "ind.", "where; in which (relative)", "onde; no qual (relativo)", "donde; en el cual (relativo)", usage="Correlativo com \"tattha\": \"yattha ... tattha\" = \"onde ... ali\".", freq=3594)
add("ye", "pron.", "who; which (rel. pron., masc./nt. pl.)", "os quais; que (pron. relativo, masc./nt. pl.)", "los cuales; que (pron. relativo, masc./nt. pl.)", freq=3487)
add("idaṃ", "pron.", "this (neuter nom./acc. sg.)", "isto (neutro, nom./acus. sg.)", "esto (neutro, nom./acus. sg.)", freq=3426)
add("tena", "pron./ind.", "by that; therefore; with that", "por isso; portanto; com isso", "por eso; por lo tanto; con eso", usage="Instrumental de \"ta-\", frequentemente com valor de conjunção conclusiva.", freq=3324)
add("vuccati", "v.", "is said; is called", "é dito; é chamado", "se dice; se llama", root="√vac (falar)", syn=["vutta", "kathiyati"], usage="Voz passiva de \"vatti/vadati\"; muito comum ao definir um termo técnico.", freq=3144)
add("natthi", "ind.", "there is not; does not exist (na + atthi)", "não há; não existe (na + atthi)", "no hay; no existe (na + atthi)", usage="Também nome de um dos 24 paccayas do Paṭṭhāna (natthipaccaya).", freq=3103)
add("ettha", "ind.", "here; in this connection", "aqui; a este respeito", "aquí; a este respecto", freq=2976)
add("eva", "ind.", "just; only; indeed (emphatic particle)", "justamente; somente; de fato (partícula enfática)", "justamente; solo; de hecho (partícula enfática)", usage="Enclítico enfático que reforça a palavra anterior, sem tradução literal fixa.", freq=2962)
add("tasmiṃ", "pron.", "in that; on that (loc. sg. of ta-)", "naquele; naquilo (loc. sg. de ta-)", "en aquel; en aquello (loc. sg. de ta-)", freq=2822)
add("yo", "pron.", "who; which (rel. pron., masc. nom. sg.)", "quem; o qual (pron. relativo, masc. nom. sg.)", "quien; el cual (pron. relativo, masc. nom. sg.)", usage="Correlativo clássico: \"yo ... so\" = \"aquele que ... esse\".", freq=2729)
add("āha", "v.", "(he/she) says; said", "(ele/ela) diz; disse", "(él/ella) dice; dijo", root="√ah (defectivo, só aoristo/perfeito)", usage="Usado para introduzir citações de comentaristas ou do próprio texto-base.", freq=2685)
add("kho", "ind.", "indeed; now (emphatic/transitional particle)", "de fato; ora (partícula enfática/transitiva)", "de hecho; ahora bien (partícula enfática/transitiva)", freq=1847)
add("idha", "ind.", "here; in this (teaching/context)", "aqui; nesta (doutrina/contexto)", "aquí; en esta (doctrina/contexto)", freq=1989)
add("atha", "ind.", "then; now; and then", "então; agora; e então", "entonces; ahora; y entonces", freq=1661)
add("kiṃ", "pron.", "what?; why? (interrogative)", "o quê?; por quê? (interrogativo)", "¿qué?; ¿por qué? (interrogativo)", freq=1092)
add("yadi", "ind.", "if", "se", "si", usage="Correlativo com \"tadā\"/\"atha\": \"yadi ... atha\" = \"se ... então\".", freq=1200)
add("idāni", "ind.", "now", "agora", "ahora", freq=1125)
add("sabba", "adj.", "all; every", "todo; cada", "todo; cada", syn=["sakala"], freq=987)
add("kathaṃ", "ind.", "how?", "como?", "¿cómo?", freq=944)

# ---- B. numerais ----
add("eka", "num.", "one", "um", "uno", usage="Forma singular \"ekaṃ/eko\" também significa \"um único\" ou \"sozinho\".", freq=9880)
add("dve", "num.", "two", "dois", "dos", freq=7301)
add("ti / tīṇi", "num.", "three", "três", "tres", freq=9571)
add("catu / cattāri", "num.", "four", "quatro", "cuatro", usage="Base do composto \"cattāri ariyasaccāni\" (as quatro nobres verdades).", freq=2225)
add("pañca", "num.", "five", "cinco", "cinco", usage="Base de \"pañcakkhandhā\" (os cinco agregados).", freq=3644)
add("cha", "num.", "six", "seis", "seis", usage="Base de \"cha āyatanāni\" (as seis bases sensoriais).", freq=1838)
add("satta", "num.", "seven", "sete", "siete", usage="Base de \"sattappakaraṇa\" (as sete obras do Abhidhamma).", freq=3048)
add("aṭṭha", "num.", "eight", "oito", "ocho", freq=1257)
add("nava", "num.", "nine", "nove", "nueve", freq=6796)
add("dasa", "num.", "ten", "dez", "diez", freq=681)

# ---- C. vocabulário nuclear (khandhas, nāma-rūpa) ----
add("dhamma", "m./nt.", "phenomenon; mental/physical state; quality; teaching; the Dhamma (the Buddha's teaching)", "fenômeno; estado mental/físico; qualidade; ensinamento; o Dhamma (o ensinamento do Buda)", "fenómeno; estado mental/físico; cualidad; enseñanza; el Dhamma (la enseñanza del Buda)", root="√dhar (sustentar, manter)", syn=["sabhāva", "guṇa"], usage="Termo mais central de todo o Abhidhamma: tanto \"fenômenos\" analisados quanto o corpo de ensinamentos que os descreve.", freq=13876)
add("citta", "nt.", "mind; consciousness; mental state", "mente; consciência; estado mental", "mente; consciencia; estado mental", root="√cit (pensar, perceber)", syn=["viññāṇa", "mano", "hadaya"], usage="No Abhidhamma, sinônimo funcional de \"viññāṇa\"; cada citta surge e cessa acompanhado de fatores mentais (cetasika).", freq=4754)
add("rūpa", "nt.", "materiality; matter; physical phenomenon; form", "materialidade; matéria; fenômeno físico; forma", "materialidad; materia; fenómeno físico; forma", syn=["mahābhūta (elemento material)"], usage="Metade do par nāma-rūpa; no Abhidhamma é analisado em 28 tipos de matéria.", freq=5828)
add("vedanā", "f.", "feeling; sensation (pleasant, painful or neutral)", "sensação; sentimento (agradável, doloroso ou neutro)", "sensación; sentimiento (agradable, doloroso o neutro)", root="√vid (sentir, experimentar)", usage="Um dos cinco agregados (khandha); classifica-se em sukha, dukkha e adukkhamasukha.", freq=1369)
add("saññā", "f.", "perception; recognition", "percepção; reconhecimento", "percepción; reconocimiento", root="√ñā (conhecer) + saṃ- (junto)", usage="O agregado que reconhece e rotula o objeto percebido (\"isto é azul\", \"isto é uma pessoa\").", freq=907)
add("saṅkhāra", "m.", "mental formations; volitional activities; conditioned things", "formações mentais; atividades volitivas; coisas condicionadas", "formaciones mentales; actividades volitivas; cosas condicionadas", root="saṃ- + √kar (fazer)", usage="Sentido duplo: (1) o agregado dos fatores mentais volitivos; (2) qualquer coisa condicionada/formada.", freq=830)
add("viññāṇa", "nt.", "consciousness", "consciência", "consciencia", root="vi- + √jñā (conhecer)", syn=["citta", "mano"], usage="O agregado que simplesmente cognoscente do objeto, sem ainda julgá-lo (isso é feito por saññā/saṅkhāra).", freq=1008)
add("khandha", "m.", "aggregate; heap; group", "agregado; monte; grupo", "agregado; montón; grupo", usage="Os cinco khandhā (rūpa, vedanā, saññā, saṅkhāra, viññāṇa) compõem toda experiência de um ser.", freq=6380)
add("āyatana", "nt.", "base; sphere; sense-door and its object", "base; esfera; porta sensorial e seu objeto", "base; esfera; puerta sensorial y su objeto", usage="Doze āyatanas: seis internos (olho...mente) e seis externos (forma...objeto mental).", freq=1430)
add("dhātu", "f.", "element", "elemento", "elemento", usage="Classificação alternativa da realidade em elementos (ex.: os quatro grandes elementos, ou as 18 dhātus).", freq=391)
add("indriya", "nt.", "faculty; controlling principle", "faculdade; princípio controlador", "facultad; principio controlador", usage="22 indriyas no Abhidhamma, incluindo as faculdades sensoriais e a faculdade vital (jīvitindriya).", freq=592)
add("ārammaṇa", "nt.", "object (of consciousness); sense-object", "objeto (da consciência); objeto sensorial", "objeto (de la consciencia); objeto sensorial", syn=["visaya"], usage="Aquilo que a consciência (citta) toma como objeto; base do ārammaṇapaccaya.", freq=947)
add("sabhāva", "m.", "intrinsic nature; own characteristic", "natureza intrínseca; característica própria", "naturaleza intrínseca; característica propia", syn=["dhamma"], usage="Cada dhamma tem seu próprio \"sabhāva\" — daí a etimologia popular \"dhamma\" = \"o que sustenta sua própria natureza\".")
add("attha", "m.", "meaning; sense; benefit; matter", "significado; sentido; benefício; assunto", "significado; sentido; beneficio; asunto", freq=3944)
add("vatthu", "nt.", "basis; physical seat (e.g. of a sense faculty); subject-matter", "base; sede física (p. ex. de uma faculdade sensorial); assunto", "base; sede física (p. ej. de una facultad sensorial); asunto", freq=1213)
add("mano", "nt.", "mind; the mind-door (as the 6th internal āyatana)", "mente; a porta mental (como o 6º āyatana interno)", "mente; la puerta mental (como el 6º āyatana interno)", syn=["citta", "viññāṇa"], usage="Distinto dos cinco sentidos físicos; é a base de toda cognição mental e do manāyatana.", freq=407)
add("cakkhu", "nt.", "eye; the eye-faculty", "olho; a faculdade visual", "ojo; la facultad visual", usage="Primeiro dos seis āyatanas internos (cakkhāyatana).", freq=793)
add("sota", "nt.", "ear; the ear-faculty", "ouvido; a faculdade auditiva", "oído; la facultad auditiva", usage="Segundo dos seis āyatanas internos.")
add("ghāna", "nt.", "nose; the nose-faculty", "nariz; a faculdade olfativa", "nariz; la facultad olfativa", usage="Terceiro āyatana interno (ghānāyatana).", freq=613)
add("jivhā", "f.", "tongue; the tongue-faculty", "língua; a faculdade gustativa", "lengua; la facultad gustativa", usage="Quarto āyatana interno.")
add("kāya", "m.", "body; the body-faculty (tactile sense)", "corpo; a faculdade corporal (tato)", "cuerpo; la facultad corporal (tacto)", usage="Quinto āyatana interno; também usado em sentido amplo como \"corpo\" físico ou mental (kāyasaṅkhāra).", freq=679)
add("rūpāyatana", "nt.", "visible form (as sense-object)", "forma visível (como objeto sensorial)", "forma visible (como objeto sensorial)", usage="Primeiro dos seis āyatanas externos: objeto do olho.", freq=1028)
add("saddāyatana", "nt.", "sound (as sense-object)", "som (como objeto sensorial)", "sonido (como objeto sensorial)", usage="Objeto do ouvido.")
add("gandhāyatana", "nt.", "smell (as sense-object)", "odor (como objeto sensorial)", "olor (como objeto sensorial)", usage="Objeto do nariz.")
add("rasāyatana", "nt.", "taste (as sense-object)", "sabor (como objeto sensorial)", "sabor (como objeto sensorial)", usage="Objeto da língua.")
add("phoṭṭhabbāyatana", "nt.", "tangible object (as sense-object)", "objeto tangível (como objeto sensorial)", "objeto tangible (como objeto sensorial)", usage="Objeto do corpo (tato).", freq=371)
add("dhammāyatana", "nt.", "mental object (as sense-object, the 6th external āyatana)", "objeto mental (como objeto sensorial, o 6º āyatana externo)", "objeto mental (como objeto sensorial, el 6º āyatana externo)", usage="Objeto da mente; inclui os cetasikas, o nibbāna e sutis fenômenos mentais.", freq=840)

# ---- D. ética, causalidade, defilements ----
add("paccaya", "m.", "condition; cause; requisite", "condição; causa; requisito", "condición; causa; requisito", root="prati- + √i (ir)", usage="Termo-chave do Paṭṭhāna, que descreve 24 tipos de paccaya (relação condicional) entre os fenômenos.", freq=15560)
add("hetu", "m.", "root cause; the six roots (lobha, dosa, moha, alobha, adosa, amoha)", "causa raiz; as seis raízes (lobha, dosa, moha, alobha, adosa, amoha)", "causa raíz; las seis raíces (lobha, dosa, moha, alobha, adosa, amoha)", usage="Também nome do primeiro dos 24 paccayas (hetupaccaya).", freq=2150)
add("kusala", "adj./nt.", "wholesome; skilful; meritorious", "saudável; hábil; meritório", "sano; hábil; meritorio", syn=["sobhana"], usage="Estado mental (citta) sem lobha/dosa/moha nas raízes, opondo-se a akusala.", freq=1940)
add("akusala", "adj./nt.", "unwholesome; unskilful", "não saudável; não hábil", "insano; no hábil", usage="Estado mental enraizado em lobha, dosa ou moha.", freq=1329)
add("abyākata", "adj./nt.", "indeterminate (neither kusala nor akusala)", "indeterminado (nem kusala nem akusala)", "indeterminado (ni kusala ni akusala)", usage="Terceira categoria de citta no Abhidhamma: resultados (vipāka) e funcionais (kiriya) são abyākata.", freq=1446)
add("kamma", "nt.", "action; volitional deed", "ação; ato volitivo", "acción; acto volitivo", root="√kar (fazer)", usage="Ação intencional que gera resultado (vipāka); também um dos 24 paccayas (kammapaccaya).", freq=847)
add("vipāka", "m.", "result; ripening (of kamma)", "resultado; maturação (do kamma)", "resultado; maduración (del kamma)", usage="Fruto de um kamma anterior; categoria de citta \"resultante\".", freq=793)
add("moha", "m.", "delusion; ignorance", "ilusão; ignorância", "engaño; ignorancia", syn=["avijjā"], usage="Uma das três raízes akusala; obscurece a percepção correta da realidade.", freq=965)
add("lobha", "m.", "greed; attachment", "avidez; apego", "avidez; apego", syn=["rāga", "taṇhā"], usage="Uma das três raízes akusala.")
add("rāga", "m.", "lust; passion; attachment", "luxúria; paixão; apego", "lujuria; pasión; apego", syn=["lobha"], freq=780)
add("dosa", "m.", "hatred; aversion; ill-will", "aversão; ódio; má vontade", "aversión; odio; mala voluntad", syn=["paṭigha"], usage="Uma das três raízes akusala.", freq=372)
add("taṇhā", "f.", "craving; thirst", "sede; ansiedade; desejo ardente", "sed; ansiedad; deseo ardiente", syn=["lobha"], usage="Causa central do sofrimento na segunda nobre verdade (samudayasacca).", freq=479)
add("diṭṭhi", "f.", "view; belief (often wrong view, micchādiṭṭhi)", "visão; crença (frequentemente visão errada, micchādiṭṭhi)", "visión; creencia (frecuentemente visión errónea, micchādiṭṭhi)", freq=647)
add("māna", "m.", "conceit; pride", "orgulho; conceito de si", "orgullo; concepto de sí mismo", usage="Um dos sete anusaya (tendências latentes).")
add("vicikicchā", "f.", "doubt; uncertainty", "dúvida; incerteza", "duda; incertidumbre", usage="Um dos cinco nīvaraṇa (obstáculos) e um dos anusaya.")
add("anusaya", "m.", "latent tendency; underlying proclivity", "tendência latente; propensão subjacente", "tendencia latente; propensión subyacente", usage="Sete anusayas dormem na mente até serem ativados por condições apropriadas (ex.: kāmarāgānusaya, paṭighānusaya).", freq=655)
add("āsava", "m.", "taint; canker; influx", "impureza; corrupção; influxo", "mancha; corrupción; influjo", usage="Quatro āsavas (kāma, bhava, diṭṭhi, avijjā) cuja erradicação define o arahant.")
add("nīvaraṇa", "nt.", "hindrance", "obstáculo", "obstáculo", usage="Cinco nīvaraṇas (desejo sensorial, aversão, sono e torpor, agitação e remorso, dúvida) que obstruem a concentração.")
add("saṃyojana", "nt.", "fetter", "grilhão; algema", "grillete; cadena", usage="Dez saṃyojanas que atam o ser ao ciclo de nascimentos; sua erradicação gradual marca os quatro estágios de despertar.")
add("upādāna", "nt.", "clinging; grasping", "apego; aferramento", "apego; aferramiento", usage="Elo do paṭiccasamuppāda (originação dependente) que segue a taṇhā.")
add("kilesa", "m.", "defilement", "aflição; mácula mental", "aflicción; mancha mental", syn=["āsava", "anusaya"], usage="Termo geral para todas as impurezas mentais (lobha, dosa, moha e derivados).", freq=428)
add("sīla", "nt.", "virtue; moral conduct", "virtude; conduta moral", "virtud; conducta moral", freq=820)
add("samādhi", "m.", "concentration; one-pointedness of mind", "concentração; unidirecionalidade da mente", "concentración; unidireccionalidad de la mente", freq=395)
add("paññā", "f.", "wisdom; understanding", "sabedoria; compreensão", "sabiduría; comprensión", syn=["ñāṇa"], freq=1447)
add("ñāṇa", "nt.", "knowledge; insight", "conhecimento; discernimento", "conocimiento; discernimiento", syn=["paññā"], freq=1215)
add("saddhā", "f.", "faith; confidence", "fé; confiança", "fe; confianza", freq=473)
add("vīriya", "nt.", "energy; effort; diligence", "energia; esforço; diligência", "energía; esfuerzo; diligencia", freq=395)
add("sati", "f.", "mindfulness", "atenção plena; presença mental", "atención plena; presencia mental", freq=1480)
add("vitakka", "m.", "applied thought; initial application of mind", "pensamento aplicado; aplicação inicial da mente", "pensamiento aplicado; aplicación inicial de la mente", usage="Primeiro fator de jhāna, que dirige a mente ao objeto.", freq=670)
add("vicāra", "m.", "sustained thought; sustained application", "pensamento sustentado; aplicação contínua", "pensamiento sostenido; aplicación continua", usage="Segundo fator de jhāna, que mantém a mente no objeto.", freq=400)
add("pīti", "f.", "rapture; joy", "júbilo; alegria", "júbilo; alegría")
add("sukha", "nt./adj.", "pleasure; happiness; pleasant", "prazer; felicidade; agradável", "placer; felicidad; agradable", freq=787)
add("dukkha", "nt./adj.", "suffering; pain; unsatisfactory", "sofrimento; dor; insatisfatório", "sufrimiento; dolor; insatisfactorio", usage="Primeira das quatro nobres verdades (dukkhasacca).", freq=1037)
add("adukkhamasukha", "adj.", "neither-painful-nor-pleasant (neutral feeling)", "nem-doloroso-nem-agradável (sensação neutra)", "ni-doloroso-ni-agradable (sensación neutra)", usage="Também chamada upekkhāvedanā; a terceira categoria de vedanā.", freq=472)
add("somanassa", "nt.", "mental joy; gladness", "alegria mental; contentamento", "alegría mental; contento", freq=709)
add("domanassa", "nt.", "mental displeasure; sadness", "desagrado mental; tristeza", "desagrado mental; tristeza", freq=550)
add("upekkhā", "f.", "equanimity; neutral feeling", "equanimidade; sensação neutra", "ecuanimidad; sensación neutra", freq=380)
add("cetanā", "f.", "volition; intention", "volição; intenção", "volición; intención", usage="Fator mental que \"organiza\" a ação e produz kamma; para alguns comentadores, é a essência do próprio kamma.", freq=1334)
add("phassa", "m.", "contact; sense-impression", "contato; impressão sensorial", "contacto; impresión sensorial", usage="Encontro entre objeto, faculdade sensorial e consciência; condiciona vedanā no paṭiccasamuppāda.", freq=1053)
add("sacca", "nt.", "truth", "verdade", "verdad", usage="As quatro nobres verdades: dukkha, samudaya, nirodha (nibbāna) e magga (o caminho).")
add("nibbāna", "nt.", "extinction; the unconditioned; liberation", "extinção; o incondicionado; libertação", "extinción; lo incondicionado; liberación", root="nir- + √vā (soprar, extinguir)", usage="Cessação completa do sofrimento e das causas do sofrimento; o objetivo final do caminho budista.", freq=827)
add("magga", "m.", "path", "caminho", "camino", usage="O caminho que leva ao nibbāna; também um dos 24 paccayas (maggapaccaya).", freq=903)
add("puggala", "m.", "person; individual", "pessoa; indivíduo", "persona; individuo", usage="Objeto de análise de todo o livro Puggalapaññatti.", freq=2557)
add("bhikkhu", "m.", "Buddhist monk", "monge budista", "monje budista", freq=710)
add("bhagavā", "m.", "the Blessed One (epithet of the Buddha)", "o Bem-Aventurado (epíteto do Buda)", "el Bienaventurado (epíteto del Buda)", freq=565)
add("arahā / arahant", "m.", "worthy one; fully liberated being", "digno; ser completamente liberado", "digno; ser completamente liberado", usage="Quem erradicou completamente os āsavas; quarto e último estágio de despertar.", freq=596)
add("sattā", "m.pl.", "beings", "seres", "seres", root="√as (ser)")
add("ariya", "adj./m.", "noble", "nobre", "noble", usage="Refere-se aos seres que atingiram algum dos quatro estágios de despertar, ou às \"quatro nobres verdades\".", freq=392)

# ---- E. verbos ----
add("uppajjati", "v.", "arises; comes into being", "surge; nasce; vem à existência", "surge; nace; llega a existir", root="upa- + √jan (nascer)", syn=["nibbattati"], usage="Verbo técnico central do Abhidhamma para descrever o surgimento momentâneo de um dhamma.", freq=14281)
add("nirujjhati", "v.", "ceases; passes away", "cessa; desaparece", "cesa; desaparece", root="ni- + √rudh (bloquear, deter)", usage="Contraponto de uppajjati: todo dhamma condicionado surge e cessa.", freq=1413)
add("hoti", "v.", "is; becomes; there is", "é; torna-se; há", "es; se convierte; hay", root="√bhū (ser, tornar-se)", usage="Verbo \"ser/estar\" mais comum; plural honti.", freq=11872)
add("atthi", "v.", "there is; exists", "há; existe", "hay; existe", root="√as (ser)", usage="Também nome de um dos 24 paccayas (atthipaccaya).", freq=6782)
add("vuttaṃ", "v.", "(it was) said", "(foi) dito", "(fue) dicho", root="√vac (falar) — part. passado", freq=6874)
add("veditabba", "adj./v.", "should be understood/known (gerundive)", "deve ser entendido/compreendido (gerundivo)", "debe ser entendido/comprendido (gerundivo)", root="√vid (saber) — gerundivo", usage="Fórmula de fechamento típica de explicações do Abhidhamma: \"... veditabbaṃ\" = \"... deve ser assim entendido\".")
add("jānāti", "v.", "knows", "sabe; conhece", "sabe; conoce", root="√jñā (conhecer)", syn=["pajānāti"])
add("pajānāti", "v.", "knows fully; discerns", "conhece plenamente; discerne", "conoce plenamente; discierne", root="pa- + √jñā", syn=["jānāti"], freq=426)
add("passati", "v.", "sees", "vê", "ve", root="√dis (ver)", freq=711)
add("karoti", "v.", "does; makes", "faz; realiza", "hace; realiza", root="√kar (fazer)", freq=870)
add("gacchati", "v.", "goes", "vai", "va", root="√gam (ir)", freq=486)
add("labbhati", "v.", "is obtained; is found (passive of labhati)", "é obtido; é encontrado (passiva de labhati)", "es obtenido; es encontrado (pasiva de labhati)", root="√labh (obter)", syn=["upalabbhati"], freq=486)
add("upalabbhati", "v.", "is found; is apprehended", "é encontrado; é apreendido", "es encontrado; es aprehendido", root="upa- + √labh", syn=["labbhati"], freq=660)
add("sampayutta", "adj.", "associated (with)", "associado (a)", "asociado (a)", root="saṃ- + pa- + √yuj (unir)", usage="Diz-se de fatores mentais que surgem sempre juntos com um dado citta; também um dos 24 paccayas.", freq=747)
add("vippayutta", "adj.", "dissociated (from)", "dissociado (de)", "disociado (de)", root="vi- + pa- + √yuj", usage="Oposto de sampayutta; termo dos 24 paccayas (vippayuttapaccaya).", freq=592)
add("sahajāta", "adj.", "co-nascent; arising together", "co-nascente; que surge junto", "co-naciente; que surge junto", root="saha- + √jan", usage="Diz-se de dhammas que surgem no mesmo instante; também um dos 24 paccayas (sahajātapaccaya).", freq=645)
add("pahātabba", "adj./v.", "should be abandoned (gerundive of pajahati)", "deve ser abandonado (gerundivo de pajahati)", "debe ser abandonado (gerundivo de pajahati)", root="pa- + √hā (deixar)", freq=530)
add("pajahati", "v.", "abandons; gives up", "abandona; renuncia a", "abandona; renuncia a", root="pa- + √hā", freq=570)
add("bhāveti", "v.", "develops; cultivates", "desenvolve; cultiva", "desarrolla; cultiva", root="causativo de √bhū (ser, tornar-se)", freq=625)
add("anuseti", "v.", "lies latent; lies dormant", "permanece latente; jaz dormente", "permanece latente; yace dormido", root="anu- + √si (jazer)", usage="Verbo relacionado ao substantivo anusaya (tendência latente).", freq=484)
add("abhinandati", "v.", "delights in; welcomes", "se deleita com; acolhe com prazer", "se deleita con; acoge con placer", root="abhi- + √nand (alegrar-se)", freq=492)
add("viharati", "v.", "dwells; abides", "habita; permanece", "habita; permanece", root="vi- + √har (portar)", freq=808)
add("deti", "v.", "gives", "dá", "da", root="√dā (dar)", freq=521)
add("uppādeti", "v.", "produces; generates (causative of uppajjati)", "produz; gera (causativo de uppajjati)", "produce; genera (causativo de uppajjati)", root="causativo de upa- + √jan", freq=460)
add("vadati", "v.", "says; speaks", "diz; fala", "dice; habla", root="√vad (falar)", syn=["āha", "bhaṇati"])
add("gaṇhāti", "v.", "takes; grasps", "toma; agarra", "toma; agarra", root="√gah (agarrar)")

# ---- F. os 24 paccayas do Paṭṭhāna ----
add("hetupaccaya", "m.", "root-cause condition (1st of the 24 paccayas)", "condição de causa-raiz (1º dos 24 paccayas)", "condición de causa-raíz (1º de los 24 paccayas)", usage="As seis raízes (hetu) condicionam os dhammas associados a elas por hetupaccaya.", freq=7119)
add("ārammaṇapaccaya", "m.", "object condition (2nd of the 24 paccayas)", "condição de objeto (2º dos 24 paccayas)", "condición de objeto (2º de los 24 paccayas)", usage="Todo objeto (ārammaṇa) condiciona a consciência que o toma por ārammaṇapaccaya.")
add("adhipatipaccaya", "m.", "predominance condition (3rd of the 24 paccayas)", "condição de predominância (3º dos 24 paccayas)", "condición de predominancia (3º de los 24 paccayas)", usage="Um dhamma dominante (ex.: forte desejo, esforço, consciência ou raciocínio) condiciona os demais por predominância.", freq=1022)
add("anantarapaccaya", "m.", "proximity condition (4th of the 24 paccayas)", "condição de proximidade imediata (4º dos 24 paccayas)", "condición de proximidad inmediata (4º de los 24 paccayas)", usage="Um citta condiciona o citta seguinte, imediatamente contíguo, sem intervalo.")
add("samanantarapaccaya", "m.", "contiguity condition (5th of the 24 paccayas, functionally identical to anantarapaccaya)", "condição de contiguidade (5º dos 24 paccayas, funcionalmente idêntico ao anantarapaccaya)", "condición de contigüidad (5º de los 24 paccayas, funcionalmente idéntico al anantarapaccaya)", freq=464)
add("sahajātapaccaya", "m.", "conascence condition (6th of the 24 paccayas)", "condição de co-nascença (6º dos 24 paccayas)", "condición de co-nacencia (6º de los 24 paccayas)", usage="Dhammas que surgem simultaneamente condicionam-se mutuamente por sahajātapaccaya.", freq=903)
add("aññamaññapaccaya", "m.", "mutuality condition (7th of the 24 paccayas)", "condição de mutualidade (7º dos 24 paccayas)", "condición de mutualidad (7º de los 24 paccayas)", usage="Caso especial de sahajātapaccaya em que os dhammas se sustentam mutuamente, como os pés de um tripé.")
add("nissayapaccaya", "m.", "support condition (8th of the 24 paccayas)", "condição de suporte (8º dos 24 paccayas)", "condición de soporte (8º de los 24 paccayas)", usage="Um dhamma serve de base/suporte para outro, incluindo os casos de sahajāta e purejāta.", freq=742)
add("upanissayapaccaya", "m.", "decisive-support condition (9th of the 24 paccayas)", "condição de suporte decisivo (9º dos 24 paccayas)", "condición de soporte decisivo (9º de los 24 paccayas)", usage="Uma condição forte e duradoura (objeto, proximidade ou tendência natural) que sustenta decisivamente outro dhamma.", freq=1708)
add("purejātapaccaya", "m.", "pre-nascence condition (10th of the 24 paccayas)", "condição de pré-nascença (10º dos 24 paccayas)", "condición de pre-nacencia (10º de los 24 paccayas)", usage="Um dhamma material já surgido serve de base a um dhamma mental posterior (ex.: os órgãos dos sentidos).", freq=618)
add("pacchājātapaccaya", "m.", "post-nascence condition (11th of the 24 paccayas)", "condição de pós-nascença (11º dos 24 paccayas)", "condición de post-nacencia (11º de los 24 paccayas)", usage="Um citta posterior sustenta, por sua presença, o corpo material já surgido antes dele.", freq=421)
add("āsevanapaccaya", "m.", "repetition condition (12th of the 24 paccayas)", "condição de repetição (12º dos 24 paccayas)", "condición de repetición (12º de los 24 paccayas)", usage="Um citta condiciona o citta seguinte da mesma série por repetição, tornando-o mais forte/hábil (ex.: em processos cognitivos consecutivos).", freq=477)
add("kammapaccaya", "m.", "kamma condition (13th of the 24 paccayas)", "condição de kamma (13º dos 24 paccayas)", "condición de kamma (13º de los 24 paccayas)", usage="A volição (cetanā) condiciona seus resultados (vipāka) por kammapaccaya.", freq=921)
add("vipākapaccaya", "m.", "kamma-result condition (14th of the 24 paccayas)", "condição de resultado kármico (14º dos 24 paccayas)", "condición de resultado kármico (14º de los 24 paccayas)", usage="Um citta/cetasika resultante (vipāka) condiciona os fatores mentais coexistentes.")
add("āhārapaccaya", "m.", "nutriment condition (15th of the 24 paccayas)", "condição de nutrimento (15º dos 24 paccayas)", "condición de nutrimento (15º de los 24 paccayas)", usage="Os quatro nutrimentos (alimento material, contato, volição mental, consciência) sustentam os dhammas resultantes.", freq=400)
add("indriyapaccaya", "m.", "faculty condition (16th of the 24 paccayas)", "condição de faculdade (16º dos 24 paccayas)", "condición de facultad (16º de los 24 paccayas)", usage="As faculdades (indriya) controlam e condicionam os dhammas associados na sua esfera.")
add("jhānapaccaya", "m.", "jhāna condition (17th of the 24 paccayas)", "condição de jhāna (17º dos 24 paccayas)", "condición de jhāna (17º de los 24 paccayas)", usage="Os fatores de absorção meditativa (jhāna) condicionam os dhammas coexistentes por meio de sua atenção total ao objeto.", freq=1732)
add("maggapaccaya", "m.", "path condition (18th of the 24 paccayas)", "condição de caminho (18º dos 24 paccayas)", "condición de camino (18º de los 24 paccayas)", usage="Os fatores do caminho (magga) — nobre ou não — direcionam os dhammas coexistentes rumo a seu resultado.")
add("sampayuttapaccaya", "m.", "association condition (19th of the 24 paccayas)", "condição de associação (19º dos 24 paccayas)", "condición de asociación (19º de los 24 paccayas)", usage="Dhammas mentais que surgem e cessam juntos, compartilhando base e objeto, condicionam-se por associação.")
add("vippayuttapaccaya", "m.", "dissociation condition (20th of the 24 paccayas)", "condição de dissociação (20º dos 24 paccayas)", "condición de disociación (20º de los 24 paccayas)", usage="Dhammas mentais e materiais que coexistem sem se misturar condicionam-se por dissociação.", freq=686)
add("atthipaccaya", "m.", "presence condition (21st of the 24 paccayas)", "condição de presença (21º dos 24 paccayas)", "condición de presencia (21º de los 24 paccayas)", usage="Um dhamma presente no momento condiciona outro dhamma coexistente ou dele dependente.", freq=1410)
add("natthipaccaya", "m.", "absence condition (22nd of the 24 paccayas)", "condição de ausência (22º dos 24 paccayas)", "condición de ausencia (22º de los 24 paccayas)", usage="A cessação imediatamente anterior de um citta condiciona o surgimento do citta seguinte, abrindo espaço para ele.")
add("vigatapaccaya", "m.", "disappearance condition (23rd of the 24 paccayas)", "condição de desaparecimento (23º dos 24 paccayas)", "condición de desaparición (23º de los 24 paccayas)", usage="Funcionalmente equivalente ao natthipaccaya: o desaparecimento de um dhamma condiciona o próximo.", freq=374)
add("avigatapaccaya", "m.", "non-disappearance condition (24th of the 24 paccayas)", "condição de não-desaparecimento (24º dos 24 paccayas)", "condición de no-desaparición (24º de los 24 paccayas)", usage="Funcionalmente equivalente ao atthipaccaya: a presença contínua condiciona o dhamma dependente.", freq=1665)

# ---- G. marcadores editoriais / formulários específicos dos textos ----
add("āmantā", "ind.", "\"I assent\" / \"yes, granted\" (dialectical formula in the Kathāvatthu)", "\"eu concordo\" / \"sim, concedido\" (fórmula dialética do Kathāvatthu)", "\"yo asiento\" / \"sí, concedido\" (fórmula dialéctica del Kathāvatthu)", usage="No Kathāvatthu, é a resposta padrão do oponente quando aceita a proposição colocada — marca o ponto de concordância antes da refutação.", freq=6341)
add("saṃkhittaṃ", "ind.", "\"in brief\" (abbreviation marker)", "\"em resumo\" (marcador de abreviação)", "\"en resumen\" (marcador de abreviación)", root="saṃ- + √khip (lançar, resumir)", usage="Usado no Paṭṭhāna e no Yamaka para sinalizar que uma série repetitiva foi abreviada.", freq=3607)
add("tiādi / tiādinā", "ind.", "\"...\" and so on (ti + ādi, \"beginning with\")", "\"...\" e assim por diante (ti + ādi, \"começando com\")", "\"...\" y así sucesivamente (ti + ādi, \"comenzando con\")", usage="Combinação comum para indicar que uma citação ou lista continua segundo o mesmo padrão.", freq=1859)
add("niṭṭhitā", "adj.", "finished; concluded (colophon marker)", "terminado; concluído (marcador de colofão)", "terminado; concluido (marcador de colofón)", root="ni- + √sthā (estar de pé) — part. passado", usage="Aparece ao final de seções ou obras inteiras, como um \"FIM\" editorial (ex.: \"Dhammasaṅgaṇī niṭṭhitā\").", freq=1611)
add("ka / kha", "ind.", "alphabetic list marker (\"(a)\", \"(b)\"...), using consonants of the Pāli alphabet", "marcador alfabético de lista (\"(a)\", \"(b)\"...), usando as consoantes do alfabeto Pāli", "marcador alfabético de lista (\"(a)\", \"(b)\"...), usando las consonantes del alfabeto Pāli", usage="Não são palavras lexicais: funcionam como \"(a)\", \"(b)\", \"(c)\"... para enumerar itens de uma lista ou variante de leitura, como em \"(Ka) kusalā dhammā\".", freq=4337)

# ---- H. termos de meditação/jhāna adicionais ----
add("jhāna", "nt.", "meditative absorption", "absorção meditativa", "absorción meditativa", root="√jhe/dhyā (meditar, contemplar)", usage="Estado de profunda concentração; também um dos 24 paccayas (jhānapaccaya).", freq=1732)
add("bhāvanā", "f.", "meditation; mental development", "meditação; desenvolvimento mental", "meditación; desarrollo mental", root="causativo de √bhū", freq=1230)
add("ekaggatā", "f.", "one-pointedness of mind", "unidirecionalidade da mente", "unidireccionalidad de la mente", syn=["samādhi"], usage="Fator mental presente em todo citta, responsável pela unificação da atenção no objeto.")

data = {
    "meta": {
        "version": 1,
        "language": ["pt", "en", "es"],
        "source": "Frequência computada a partir do corpus local (data/works/: Abhidhamma Piṭaka + Visuddhimagga + obras independentes); glosas redigidas manualmente, sem chamadas de API.",
        "count": len(E),
    },
    "entries": E,
}

with open("data/dictionary/common_pali.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

print(f"wrote {len(E)} entries to data/dictionary/common_pali.json")
