import json

new_words = [
  {"pali": "javana", "en": "active consciousness, swift phase of thought", "pt": "consciência ativa, fase impulsiva do pensamento", "es": "conciencia activa, fase impulsiva del pensamiento", "grammar": "noun, neuter"},
  {"pali": "bhavanga", "en": "life-continuum, resting state of consciousness", "pt": "contínuo vital, estado de repouso da consciência", "es": "continuo vital, estado de reposo de la conciencia", "grammar": "noun, neuter"},
  {"pali": "paṭisandhi", "en": "rebirth-linking consciousness", "pt": "consciência de reconexão, renascimento", "es": "conciencia de reconexión, renacimiento", "grammar": "noun, feminine"},
  {"pali": "cuti", "en": "death consciousness, passing away", "pt": "consciência da morte, falecimento", "es": "conciencia de muerte, fallecimiento", "grammar": "noun, feminine"},
  {"pali": "tadārammaṇa", "en": "registering consciousness, object-retention", "pt": "consciência de registro, retenção do objeto", "es": "conciencia de registro, retención del objeto", "grammar": "noun, neuter"},
  {"pali": "vīthi", "en": "cognitive process, thought-path", "pt": "processo cognitivo, caminho do pensamento", "es": "proceso cognitivo, camino del pensamiento", "grammar": "noun, feminine"},
  {"pali": "kammaṭṭhāna", "en": "meditation subject, working ground", "pt": "objeto de meditação, campo de trabalho", "es": "objeto de meditación, campo de trabajo", "grammar": "noun, neuter"},
  {"pali": "nimitta", "en": "sign, mental image, mark", "pt": "sinal, imagem mental, marca", "es": "señal, imagen mental, marca", "grammar": "noun, neuter"},
  {"pali": "parikamma", "en": "preliminary practice, preparation", "pt": "prática preliminar, preparação", "es": "práctica preliminar, preparación", "grammar": "noun, neuter"},
  {"pali": "upacāra", "en": "access concentration, proximity", "pt": "concentração de acesso, proximidade", "es": "concentración de acceso, proximidad", "grammar": "noun, masculine"},
  {"pali": "appanā", "en": "absorption concentration", "pt": "concentração de absorção", "es": "concentración de absorción", "grammar": "noun, feminine"},
  {"pali": "kasiṇa", "en": "meditation disk, totality, universal", "pt": "disco de meditação, totalidade, universal", "es": "disco de meditación, totalidad, universal", "grammar": "noun, neuter"},
  {"pali": "asubha", "en": "foulness, impurity, unattractive", "pt": "impureza, repulsividade, não-atraente", "es": "impureza, repulsividad, no atractivo", "grammar": "noun, neuter/adjective"},
  {"pali": "anussati", "en": "recollection, mindfulness", "pt": "recordação, atenção plena contínua", "es": "recuerdo, atención plena continua", "grammar": "noun, feminine"},
  {"pali": "vipassanā", "en": "insight, clear seeing", "pt": "visão profunda, clareza de visão", "es": "visión profunda, visión clara", "grammar": "noun, feminine"},
  {"pali": "samatha", "en": "tranquility, calm, serenity", "pt": "tranquilidade, calma, serenidade", "es": "tranquilidad, calma, serenidad", "grammar": "noun, masculine"},
  {"pali": "nīvaraṇa", "en": "hindrance, obstacle", "pt": "impedimento, obstáculo", "es": "impedimento, obstáculo", "grammar": "noun, neuter"},
  {"pali": "kāmacchanda", "en": "sensual desire", "pt": "desejo sensual", "es": "deseo sensual", "grammar": "noun, masculine"},
  {"pali": "byāpāda", "en": "ill-will, malice", "pt": "má vontade, malevolência", "es": "mala voluntad, malevolencia", "grammar": "noun, masculine"},
  {"pali": "thīnamiddha", "en": "sloth and torpor", "pt": "preguiça e torpor", "es": "pereza y letargo", "grammar": "noun, neuter"},
  {"pali": "uddhaccakukkucca", "en": "restlessness and remorse", "pt": "inquietação e remorso", "es": "inquietud y remordimiento", "grammar": "noun, neuter"},
  {"pali": "vicikicchā", "en": "skeptical doubt", "pt": "dúvida cética", "es": "duda escéptica", "grammar": "noun, feminine"},
  {"pali": "bojjhaṅga", "en": "factor of enlightenment", "pt": "fator de iluminação", "es": "factor de iluminación", "grammar": "noun, masculine"},
  {"pali": "magga", "en": "path, way", "pt": "caminho, via", "es": "camino, vía", "grammar": "noun, masculine"},
  {"pali": "phala", "en": "fruit, result, fruition", "pt": "fruto, resultado, fruição", "es": "fruto, resultado, fruición", "grammar": "noun, neuter"},
  {"pali": "sotāpatti", "en": "stream-entry", "pt": "entrada na correnteza", "es": "entrada en la corriente", "grammar": "noun, feminine"},
  {"pali": "sakadāgāmitā", "en": "once-returning", "pt": "condição de quem retorna uma vez", "es": "condición del que retorna una vez", "grammar": "noun, feminine"},
  {"pali": "anāgāmitā", "en": "non-returning", "pt": "condição de não-retorno", "es": "condición de no-retorno", "grammar": "noun, feminine"},
  {"pali": "arahatta", "en": "arahantship, perfection", "pt": "estado de arahant, perfeição", "es": "estado de arahant, perfección", "grammar": "noun, neuter"},
  {"pali": "khandha", "en": "aggregate, heap, group", "pt": "agregado, grupo", "es": "agregado, grupo", "grammar": "noun, masculine"},
  {"pali": "rūpa", "en": "matter, form, fine-material", "pt": "matéria, forma", "es": "materia, forma", "grammar": "noun, neuter"},
  {"pali": "vedanā", "en": "feeling, sensation", "pt": "sensação, sentimento", "es": "sensación, sentimiento", "grammar": "noun, feminine"},
  {"pali": "saññā", "en": "perception, recognition", "pt": "percepção, reconhecimento", "es": "percepción, reconocimiento", "grammar": "noun, feminine"},
  {"pali": "saṅkhāra", "en": "formation, volitional activity", "pt": "formação, atividade volitiva", "es": "formación, actividad volitiva", "grammar": "noun, masculine"},
  {"pali": "viññāṇa", "en": "consciousness", "pt": "consciência", "es": "conciencia", "grammar": "noun, neuter"},
  {"pali": "āyatana", "en": "sense base, sphere", "pt": "base sensorial, esfera", "es": "base sensorial, esfera", "grammar": "noun, neuter"},
  {"pali": "dhātu", "en": "element", "pt": "elemento", "es": "elemento", "grammar": "noun, feminine"},
  {"pali": "indriya", "en": "faculty, controlling power", "pt": "faculdade, poder controlador", "es": "facultad, poder controlador", "grammar": "noun, neuter"},
  {"pali": "bala", "en": "power, strength", "pt": "poder, força", "es": "poder, fuerza", "grammar": "noun, neuter"},
  {"pali": "paticcasamuppāda", "en": "dependent origination", "pt": "originação dependente", "es": "originación dependiente", "grammar": "noun, masculine"},
  {"pali": "avijjā", "en": "ignorance, delusion", "pt": "ignorância, ilusão", "es": "ignorancia, ilusión", "grammar": "noun, feminine"},
  {"pali": "taṇhā", "en": "craving, thirst", "pt": "anseio, sede", "es": "anhelo, sed", "grammar": "noun, feminine"},
  {"pali": "upādāna", "en": "clinging, attachment", "pt": "apego, agarramento", "es": "aferramiento", "grammar": "noun, neuter"},
  {"pali": "bhava", "en": "becoming, existence", "pt": "vir a ser, existência", "es": "llegar a ser, existencia", "grammar": "noun, masculine"},
  {"pali": "jāti", "en": "birth", "pt": "nascimento", "es": "nacimiento", "grammar": "noun, feminine"},
  {"pali": "jarā", "en": "aging, decay", "pt": "envelhecimento, decadência", "es": "envejecimiento, decadencia", "grammar": "noun, feminine"},
  {"pali": "maraṇa", "en": "death", "pt": "morte", "es": "muerte", "grammar": "noun, neuter"},
  {"pali": "soka", "en": "sorrow", "pt": "tristeza, pesar", "es": "tristeza, pesar", "grammar": "noun, masculine"},
  {"pali": "parideva", "en": "lamentation", "pt": "lamentação", "es": "lamentación", "grammar": "noun, masculine"},
  {"pali": "domanassa", "en": "mental pain, displeasure", "pt": "dor mental, desprazer", "es": "dolor mental, displacer", "grammar": "noun, neuter"},
  {"pali": "upāyāsa", "en": "despair", "pt": "desespero", "es": "desesperación", "grammar": "noun, masculine"}
]

out = []
for w in new_words:
    out.append({
        "pali": w["pali"],
        "meaning": {
            "en": w["en"],
            "pt": w["pt"],
            "es": w["es"]
        },
        "grammar": w["grammar"]
    })

with open("batch4.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

