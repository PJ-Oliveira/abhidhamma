const fs = require('fs');
const path = require('path');

const newEntries = [
  {"pali": "attho", "meaning": {"en": "meaning; purpose; benefit", "pt": "significado; propósito; benefício", "es": "significado; propósito; beneficio"}, "grammar": "noun, masculine, nominative singular"},
  {"pali": "vuttanayeneva", "meaning": {"en": "in the manner already stated", "pt": "da maneira já declarada", "es": "de la manera ya declarada"}, "grammar": "adverb (vutta + nayena + eva)"},
  {"pali": "ma", "meaning": {"en": "do not (prohibitive)", "pt": "não (proibitivo)", "es": "no (prohibitivo)"}, "grammar": "particle"},
  {"pali": "karoti", "meaning": {"en": "does; makes; performs", "pt": "faz; realiza", "es": "hace; realiza"}, "grammar": "verb, 3rd person singular"},
  {"pali": "dhammā", "meaning": {"en": "phenomena; mind-objects; teachings", "pt": "fenômenos; objetos mentais; ensinamentos", "es": "fenómenos; objetos mentales; enseñanzas"}, "grammar": "noun, masculine, nominative plural"},
  {"pali": "kiṃ", "meaning": {"en": "what? why?", "pt": "o quê? por quê?", "es": "¿qué? ¿por qué?"}, "grammar": "interrogative pronoun, neuter"},
  {"pali": "bhikkhave", "meaning": {"en": "O monks; bhikkhus", "pt": "Ó monges; bhikkhus", "es": "Oh monjes; bhikkhus"}, "grammar": "noun, masculine, vocative plural"},
  {"pali": "nu", "meaning": {"en": "interrogative particle (often untranslated)", "pt": "partícula interrogativa (frequentemente não traduzida)", "es": "partícula interrogativa"}, "grammar": "particle"},
  {"pali": "apica", "meaning": {"en": "moreover; furthermore; but", "pt": "além disso; ademais; mas", "es": "además; por otra parte; pero"}, "grammar": "conjunction (api + ca)"},
  {"pali": "pañca", "meaning": {"en": "five", "pt": "cinco", "es": "cinco"}, "grammar": "numeral"},
  {"pali": "disvā", "meaning": {"en": "having seen", "pt": "tendo visto", "es": "habiendo visto"}, "grammar": "verb, absolutive (gerund) of passati"},
  {"pali": "paṭhamaṃ", "meaning": {"en": "first; firstly", "pt": "primeiro; primeiramente", "es": "primero; en primer lugar"}, "grammar": "adjective/adverb, neuter nominative/accusative"},
  {"pali": "tassevaṃ", "meaning": {"en": "to him thus; of that thus", "pt": "para ele assim; disso assim", "es": "para él así; de eso así"}, "grammar": "pronoun + adverb (tassa + evaṃ)"},
  {"pali": "me", "meaning": {"en": "to me; by me; my", "pt": "para mim; por mim; meu", "es": "a mí; por mí; mi"}, "grammar": "pronoun, dative/instrumental/genitive singular"},
  {"pali": "gacchati", "meaning": {"en": "goes; proceeds", "pt": "vai; prossegue", "es": "va; procede"}, "grammar": "verb, 3rd person singular"},
  {"pali": "kammaṭṭhānaṃ", "meaning": {"en": "meditation subject; working-ground", "pt": "sujeito de meditação; base de trabalho", "es": "tema de meditación; base de trabajo"}, "grammar": "noun, neuter, nominative/accusative singular"},
  {"pali": "nayena", "meaning": {"en": "by the method (of); by way of", "pt": "pelo método (de); por meio de", "es": "por el método (de); por medio de"}, "grammar": "noun, masculine, instrumental singular"},
  {"pali": "ceva", "meaning": {"en": "and also; and even", "pt": "e também; e até mesmo", "es": "y también; e incluso"}, "grammar": "particle (ca + eva)"},
  {"pali": "sukhaṃ", "meaning": {"en": "happiness; bliss; comfortably", "pt": "felicidade; bem-aventurança; confortavelmente", "es": "felicidad; dicha; cómodamente"}, "grammar": "noun, neuter, nominative/accusative singular / adverb"},
  {"pali": "pavattati", "meaning": {"en": "occurs; proceeds; moves forward", "pt": "ocorre; prossegue; avança", "es": "ocurre; procede; avanza"}, "grammar": "verb, 3rd person singular"},
  {"pali": "vuttā", "meaning": {"en": "said; stated; spoken", "pt": "dito; declarado; falado", "es": "dicho; declarado; hablado"}, "grammar": "verb, past participle, feminine singular or masculine plural"},
  {"pali": "yasmā", "meaning": {"en": "because; since; from which", "pt": "porque; uma vez que; a partir do qual", "es": "porque; puesto que; a partir del cual"}, "grammar": "pronoun/conjunction, ablative singular"},
  {"pali": "no", "meaning": {"en": "not; our / to us", "pt": "não; nosso / para nós", "es": "no; nuestro / para nosotros"}, "grammar": "particle / pronoun"},
  {"pali": "imassa", "meaning": {"en": "of this; to this", "pt": "disso; a isso", "es": "de esto; a esto"}, "grammar": "pronoun, genitive/dative singular"},
  {"pali": "saddo", "meaning": {"en": "sound; word; noise", "pt": "som; palavra; ruído", "es": "sonido; palabra; ruido"}, "grammar": "noun, masculine, nominative singular"},
  {"pali": "veditabbaṃ", "meaning": {"en": "should be known; to be understood", "pt": "deve ser conhecido; deve ser compreendido", "es": "debe ser conocido; a ser comprendido"}, "grammar": "verb, future passive participle, neuter singular"},
  {"pali": "ārabbha", "meaning": {"en": "concerning; beginning with; having begun", "pt": "sobre; começando com; tendo começado", "es": "acerca de; comenzando con; habiendo comenzado"}, "grammar": "verb, absolutive / indeclinable"},
  {"pali": "saddhiṃ", "meaning": {"en": "with; together with", "pt": "com; junto com", "es": "con; junto con"}, "grammar": "adverb/preposition (takes instrumental)"},
  {"pali": "ito", "meaning": {"en": "from here; from now", "pt": "daqui; a partir de agora", "es": "de aquí; a partir de ahora"}, "grammar": "adverb"},
  {"pali": "atha", "meaning": {"en": "then; now; afterwards", "pt": "então; agora; depois", "es": "entonces; ahora; después"}, "grammar": "indeclinable particle"},
  {"pali": "dve", "meaning": {"en": "two", "pt": "dois; duas", "es": "dos"}, "grammar": "numeral"},
  {"pali": "veditabbā", "meaning": {"en": "should be known (plural)", "pt": "devem ser conhecidos", "es": "deben ser conocidos"}, "grammar": "verb, future passive participle, masculine plural"},
  {"pali": "dasa", "meaning": {"en": "ten", "pt": "dez", "es": "diez"}, "grammar": "numeral"},
  {"pali": "samaye", "meaning": {"en": "at the time; on the occasion", "pt": "na ocasião; no momento", "es": "en la ocasión; en el momento"}, "grammar": "noun, masculine, locative singular"},
  {"pali": "bhāvetukāmena", "meaning": {"en": "by one desiring to develop", "pt": "por alguém que deseja desenvolver", "es": "por alguien que desea desarrollar"}, "grammar": "adjective, instrumental singular"},
  {"pali": "attānaṃ", "meaning": {"en": "oneself; himself; the body", "pt": "a si mesmo; ele mesmo; o corpo", "es": "a sí mismo; él mismo; el cuerpo"}, "grammar": "noun, masculine, accusative singular"},
  {"pali": "vuttañhetaṃ", "meaning": {"en": "for this was said", "pt": "pois isto foi dito", "es": "pues esto fue dicho"}, "grammar": "phrase (vuttaṃ + hi + etaṃ)"},
  {"pali": "yā", "meaning": {"en": "which; whatever (feminine)", "pt": "que; a qual (feminino)", "es": "que; la cual (femenino)"}, "grammar": "pronoun, relative, feminine nominative singular"},
  {"pali": "panassa", "meaning": {"en": "but of this; however of him", "pt": "mas disso; no entanto dele", "es": "pero de esto; sin embargo de él"}, "grammar": "phrase (pana + assa)"},
  {"pali": "sace", "meaning": {"en": "if", "pt": "se", "es": "si"}, "grammar": "conjunction"},
  {"pali": "ṭhapetvā", "meaning": {"en": "having placed; except; apart from", "pt": "tendo colocado; exceto; além de", "es": "habiendo colocado; excepto; aparte de"}, "grammar": "verb, absolutive of ṭhapeti"},
  {"pali": "natthi", "meaning": {"en": "there is not; does not exist", "pt": "não há; não existe", "es": "no hay; no existe"}, "grammar": "phrase (na + atthi)"},
  {"pali": "dhātuyo", "meaning": {"en": "elements (plural)", "pt": "elementos", "es": "elementos"}, "grammar": "noun, feminine, nominative/accusative plural"},
  {"pali": "bhagavatā", "meaning": {"en": "by the Blessed One", "pt": "pelo Abençoado", "es": "por el Bendito"}, "grammar": "noun, masculine, instrumental singular"},
  {"pali": "vasena", "meaning": {"en": "by way of; on account of; according to", "pt": "por meio de; devido a; de acordo com", "es": "por medio de; debido a; de acuerdo con"}, "grammar": "noun, masculine, instrumental singular"},
  {"pali": "imasmiṃ", "meaning": {"en": "in this", "pt": "nisto; neste", "es": "en esto; en este"}, "grammar": "pronoun, demonstrative, locative singular"},
  {"pali": "imesaṃ", "meaning": {"en": "of these", "pt": "destes", "es": "de estos"}, "grammar": "pronoun, genitive plural"},
  {"pali": "puna", "meaning": {"en": "again; further", "pt": "novamente; mais uma vez", "es": "de nuevo; además"}, "grammar": "adverb"},
  {"pali": "paṭikkhipāmi", "meaning": {"en": "I reject; I refuse", "pt": "eu rejeito; eu recuso", "es": "yo rechazo; yo rehúso"}, "grammar": "verb, 1st person singular"},
  {"pali": "samādiyāmī", "meaning": {"en": "I undertake", "pt": "eu assumo (como voto)", "es": "yo asumo (como voto)"}, "grammar": "verb, 1st person singular"},
  {"pali": "imesu", "meaning": {"en": "in these; among these", "pt": "nestes; entre estes", "es": "en estos; entre estos"}, "grammar": "pronoun, locative plural"},
  {"pali": "samādinnaṃ", "meaning": {"en": "undertaken", "pt": "assumido (compromisso)", "es": "asumido (compromiso)"}, "grammar": "verb, past participle, neuter nominative/accusative singular"},
  {"pali": "bhagavato", "meaning": {"en": "of the Blessed One", "pt": "do Abençoado", "es": "del Bendito"}, "grammar": "noun, masculine, genitive/dative singular"},
  {"pali": "paṭibhāganimittaṃ", "meaning": {"en": "counterpart sign", "pt": "sinal da contraparte", "es": "signo de la contraparte"}, "grammar": "noun, neuter, nominative/accusative singular"},
  {"pali": "satiyā", "meaning": {"en": "of mindfulness; with mindfulness", "pt": "da atenção plena; com atenção plena", "es": "de la atención plena; con atención plena"}, "grammar": "noun, feminine, genitive/instrumental/locative singular"},
  {"pali": "imaṃ", "meaning": {"en": "this", "pt": "isto; este; esta", "es": "esto; este; esta"}, "grammar": "pronoun, demonstrative, accusative singular"},
  {"pali": "kasmā", "meaning": {"en": "why? from what?", "pt": "por quê? de quê?", "es": "¿por qué? ¿de qué?"}, "grammar": "interrogative pronoun, ablative singular"},
  {"pali": "ko", "meaning": {"en": "who? what?", "pt": "quem? o quê?", "es": "¿quién? ¿qué?"}, "grammar": "interrogative pronoun, masculine nominative singular"},
  {"pali": "gaṇhāti", "meaning": {"en": "takes; seizes; grasps", "pt": "toma; agarra; compreende", "es": "toma; agarra; comprende"}, "grammar": "verb, 3rd person singular"},
  {"pali": "nayo", "meaning": {"en": "method; way; inference", "pt": "método; caminho; inferência", "es": "método; camino; inferencia"}, "grammar": "noun, masculine, nominative singular"},
  {"pali": "cāti", "meaning": {"en": "and (end of quote)", "pt": "e (fim de citação)", "es": "y (fin de cita)"}, "grammar": "phrase (ca + iti)"},
  {"pali": "kātabbaṃ", "meaning": {"en": "should be done", "pt": "deve ser feito", "es": "debe ser hecho"}, "grammar": "verb, future passive participle, neuter singular"},
  {"pali": "vinicchayo", "meaning": {"en": "investigation; decision; judgment", "pt": "investigação; decisão; julgamento", "es": "investigación; decisión; juicio"}, "grammar": "noun, masculine, nominative singular"},
  {"pali": "santike", "meaning": {"en": "in the presence of; near", "pt": "na presença de; perto", "es": "en presencia de; cerca"}, "grammar": "adverb/locative noun"},
  {"pali": "aññataravacanena", "meaning": {"en": "by another word; by another expression", "pt": "por outra palavra; por outra expressão", "es": "por otra palabra; por otra expresión"}, "grammar": "noun, instrumental singular"},
  {"pali": "atthi", "meaning": {"en": "there is; exists", "pt": "há; existe", "es": "hay; existe"}, "grammar": "verb, 3rd person singular"},
  {"pali": "cattāro", "meaning": {"en": "four (masculine)", "pt": "quatro (masculino)", "es": "cuatro (masculino)"}, "grammar": "numeral, nominative/accusative plural"},
  {"pali": "bhāvetabbaṃ", "meaning": {"en": "to be developed", "pt": "a ser desenvolvido", "es": "a ser desarrollado"}, "grammar": "verb, future passive participle, neuter singular"},
  {"pali": "punappunaṃ", "meaning": {"en": "again and again; repeatedly", "pt": "repetidas vezes; repetidamente", "es": "una y otra vez; repetidamente"}, "grammar": "adverb"},
  {"pali": "cattāri", "meaning": {"en": "four (neuter)", "pt": "quatro (neutro)", "es": "cuatro (neutro)"}, "grammar": "numeral, nominative/accusative plural"},
  {"pali": "vāti", "meaning": {"en": "or (end of quote)", "pt": "ou (fim de citação)", "es": "o (fin de cita)"}, "grammar": "phrase (vā + iti)"},
  {"pali": "saṃ", "meaning": {"en": "own; one's own (prefix/pronoun)", "pt": "próprio; de si mesmo", "es": "propio; de uno mismo"}, "grammar": "adjective/prefix"},
  {"pali": "tāni", "meaning": {"en": "those", "pt": "aqueles; aquelas", "es": "aquellos; aquellas"}, "grammar": "pronoun, neuter nominative/accusative plural"},
  {"pali": "cettha", "meaning": {"en": "and here; and in this case", "pt": "e aqui; e neste caso", "es": "y aquí; y en este caso"}, "grammar": "phrase (ca + ettha)"},
  {"pali": "labhati", "meaning": {"en": "gets; obtains; receives", "pt": "obtém; consegue; recebe", "es": "obtiene; consigue; recibe"}, "grammar": "verb, 3rd person singular"},
  {"pali": "uggahanimittaṃ", "meaning": {"en": "learning sign", "pt": "sinal de aprendizado", "es": "signo de aprendizaje"}, "grammar": "noun, neuter, nominative/accusative singular"},
  {"pali": "aññaṃ", "meaning": {"en": "another; other", "pt": "outro; outra", "es": "otro; otra"}, "grammar": "pronoun/adjective, accusative singular / neuter nominative"},
  {"pali": "uppannā", "meaning": {"en": "arisen; born", "pt": "surgido; nascido", "es": "surgido; nacido"}, "grammar": "verb, past participle, feminine singular or masculine plural"},
  {"pali": "seyyathāpi", "meaning": {"en": "just as if; as though", "pt": "assim como se; como se", "es": "así como si; como si"}, "grammar": "indeclinable"},
  {"pali": "catūsu", "meaning": {"en": "in the four", "pt": "nos quatro", "es": "en los cuatro"}, "grammar": "numeral, locative plural"},
  {"pali": "ajjhattaṃ", "meaning": {"en": "internally; from within", "pt": "internamente; de dentro", "es": "internamente; desde dentro"}, "grammar": "adverb / neuter noun accusative"},
  {"pali": "ekato", "meaning": {"en": "on one side; together", "pt": "por um lado; juntos", "es": "por un lado; juntos"}, "grammar": "adverb"},
  {"pali": "paccavekkhati", "meaning": {"en": "reviews; considers; reflects", "pt": "revisa; considera; reflete", "es": "revisa; considera; reflexiona"}, "grammar": "verb, 3rd person singular"},
  {"pali": "nibbānaṃ", "meaning": {"en": "Nibbana (extinction of craving)", "pt": "Nibbana (extinção do anseio)", "es": "Nibbana (extinción del anhelo)"}, "grammar": "noun, neuter, nominative/accusative singular"},
  {"pali": "tassā", "meaning": {"en": "of her; to her / of that (fem)", "pt": "dela; para ela / daquilo (fem)", "es": "de ella; a ella / de aquello (fem)"}, "grammar": "pronoun, feminine genitive/dative singular"},
  {"pali": "neva", "meaning": {"en": "not even; neither", "pt": "nem sequer; nem", "es": "ni siquiera; ni"}, "grammar": "phrase (na + eva)"},
  {"pali": "tadeva", "meaning": {"en": "that very; just that", "pt": "aquele mesmo; exatamente isso", "es": "ese mismo; exactamente eso"}, "grammar": "phrase (taṃ + eva)"},
  {"pali": "bhikkhuno", "meaning": {"en": "of the monk", "pt": "do monge", "es": "del monje"}, "grammar": "noun, masculine, genitive/dative singular"},
  {"pali": "vacanato", "meaning": {"en": "from the word; by the saying", "pt": "da palavra; pelo dito", "es": "de la palabra; por el dicho"}, "grammar": "noun, neuter, ablative singular"},
  {"pali": "gahetvā", "meaning": {"en": "having taken; having grasped", "pt": "tendo tomado; tendo compreendido", "es": "habiendo tomado; habiendo comprendido"}, "grammar": "verb, absolutive"},
  {"pali": "sappāyaṃ", "meaning": {"en": "suitable; beneficial", "pt": "adequado; benéfico", "es": "adecuado; beneficioso"}, "grammar": "adjective, neuter singular"},
  {"pali": "ime", "meaning": {"en": "these", "pt": "estes", "es": "estos"}, "grammar": "pronoun, demonstrative, masculine plural"},
  {"pali": "siyā", "meaning": {"en": "may be; should be; if there is", "pt": "pode ser; deveria ser; se houver", "es": "puede ser; debería ser; si hay"}, "grammar": "verb, optative 3rd person singular of atthi"},
  {"pali": "panettha", "meaning": {"en": "but here; moreover in this case", "pt": "mas aqui; ademais neste caso", "es": "pero aquí; además en este caso"}, "grammar": "phrase (pana + ettha)"},
  {"pali": "ākāse", "meaning": {"en": "in the sky; in space", "pt": "no céu; no espaço", "es": "en el cielo; en el espacio"}, "grammar": "noun, masculine, locative singular"},
  {"pali": "nissāya", "meaning": {"en": "dependent upon; by means of", "pt": "dependente de; por meio de", "es": "dependiente de; por medio de"}, "grammar": "verb, absolutive / preposition"},
  {"pali": "vavatthapetabbaṃ", "meaning": {"en": "to be defined; should be determined", "pt": "a ser definido; deve ser determinado", "es": "a ser definido; debe ser determinado"}, "grammar": "verb, future passive participle, neuter singular"}
];

const dictPath = path.join(__dirname, 'src', 'data', 'paliDictionary.json');
let existingDict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Filter out any duplicates if they exist, then append
const existingWords = new Set(existingDict.map(e => e.pali));
const added = [];

newEntries.forEach(entry => {
  if (!existingWords.has(entry.pali)) {
    existingDict.push(entry);
    added.push(entry.pali);
  }
});

fs.writeFileSync(dictPath, JSON.stringify(existingDict, null, 2));
console.log('Successfully added ' + added.length + ' highly frequent words!');
