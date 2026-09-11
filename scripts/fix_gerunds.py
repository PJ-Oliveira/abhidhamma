import json, glob, re

replacements = [
    (re.compile(r'\bestá\s+a\s+fazer\b', re.IGNORECASE), 'está fazendo'),
    (re.compile(r'\bestá\s+a\s+ver\b', re.IGNORECASE), 'está vendo'),
    (re.compile(r'\bestão\s+a\s+fazer\b', re.IGNORECASE), 'estão fazendo'),
    (re.compile(r'\bestão\s+a\s+ver\b', re.IGNORECASE), 'estão vendo'),
    (re.compile(r'\bestava\s+a\s+fazer\b', re.IGNORECASE), 'estava fazendo'),
    (re.compile(r'\bestava\s+a\s+ver\b', re.IGNORECASE), 'estava vendo'),
    
    # Generic "a <verbo no infinitivo>" after estar -> "fazendo/vendo"
    # To be perfectly safe, I'll use a known list from the audit report or just use the generic regex
    (re.compile(r'\bestá\s+a\s+([a-z]+)r\b', re.IGNORECASE), lambda m: 'está ' + m.group(1) + 'ndo'),
    (re.compile(r'\bestão\s+a\s+([a-z]+)r\b', re.IGNORECASE), lambda m: 'estão ' + m.group(1) + 'ndo'),
    (re.compile(r'\bestava\s+a\s+([a-z]+)r\b', re.IGNORECASE), lambda m: 'estava ' + m.group(1) + 'ndo'),
    (re.compile(r'\bestavam\s+a\s+([a-z]+)r\b', re.IGNORECASE), lambda m: 'estavam ' + m.group(1) + 'ndo'),

    # Also, "facto" -> "fato", "contacto" -> "contato", "controlo" -> "controle", "seccao" -> "seção"
    (re.compile(r'\bfacto\b', re.IGNORECASE), 'fato'),
    (re.compile(r'\bfactos\b', re.IGNORECASE), 'fatos'),
    (re.compile(r'\bcontacto\b', re.IGNORECASE), 'contato'),
    (re.compile(r'\bcontactos\b', re.IGNORECASE), 'contatos'),
    (re.compile(r'\bcontrolo\b', re.IGNORECASE), 'controle'),
    (re.compile(r'\bcontrolos\b', re.IGNORECASE), 'controles'),
]

changed = 0
for filepath in sorted(glob.glob("data/works/**/*.json", recursive=True)):
    if "index.json" in filepath: continue
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except: continue
    if not isinstance(data, list): continue
    
    file_changed = False
    for seg in data:
        pt = seg.get("pt", "")
        if pt:
            orig = pt
            for pattern, repl in replacements:
                if callable(repl):
                    pt = pattern.sub(repl, pt)
                else:
                    def match_case(m):
                        word = m.group(0)
                        r = repl
                        if word[0].isupper():
                            return r.capitalize()
                        return r
                    pt = pattern.sub(match_case, pt)
            if orig != pt:
                seg["pt"] = pt
                file_changed = True
                changed += 1
    
    if file_changed:
        with open(filepath, 'w') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Fixed {changed} segments with PT-PT gerunds or orthography!")
