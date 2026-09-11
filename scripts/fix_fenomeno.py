import json, glob, re

replacements = [
    (re.compile(r'\bo\s+fenômeno\b', re.IGNORECASE), 'a realidade'),
    (re.compile(r'\bo\s+fenómeno\b', re.IGNORECASE), 'a realidade'),
    (re.compile(r'\bos\s+fenômenos\b', re.IGNORECASE), 'as realidades'),
    (re.compile(r'\bos\s+fenómenos\b', re.IGNORECASE), 'as realidades'),
    
    (re.compile(r'\bum\s+fenômeno\b', re.IGNORECASE), 'uma realidade'),
    (re.compile(r'\bum\s+fenómeno\b', re.IGNORECASE), 'uma realidade'),
    (re.compile(r'\buns\s+fenômenos\b', re.IGNORECASE), 'umas realidades'),
    (re.compile(r'\buns\s+fenómenos\b', re.IGNORECASE), 'umas realidades'),
    
    (re.compile(r'\bdo\s+fenômeno\b', re.IGNORECASE), 'da realidade'),
    (re.compile(r'\bdo\s+fenómeno\b', re.IGNORECASE), 'da realidade'),
    (re.compile(r'\bdos\s+fenômenos\b', re.IGNORECASE), 'das realidades'),
    (re.compile(r'\bdos\s+fenómenos\b', re.IGNORECASE), 'das realidades'),
    
    (re.compile(r'\bno\s+fenômeno\b', re.IGNORECASE), 'na realidade'),
    (re.compile(r'\bno\s+fenómeno\b', re.IGNORECASE), 'na realidade'),
    (re.compile(r'\bnos\s+fenômenos\b', re.IGNORECASE), 'nas realidades'),
    (re.compile(r'\bnos\s+fenómenos\b', re.IGNORECASE), 'nas realidades'),
    
    (re.compile(r'\bpelo\s+fenômeno\b', re.IGNORECASE), 'pela realidade'),
    (re.compile(r'\bpelo\s+fenómeno\b', re.IGNORECASE), 'pela realidade'),
    (re.compile(r'\bpelos\s+fenômenos\b', re.IGNORECASE), 'pelas realidades'),
    (re.compile(r'\bpelos\s+fenómenos\b', re.IGNORECASE), 'pelas realidades'),

    (re.compile(r'\bao\s+fenômeno\b', re.IGNORECASE), 'à realidade'),
    (re.compile(r'\bao\s+fenómeno\b', re.IGNORECASE), 'à realidade'),
    (re.compile(r'\baos\s+fenômenos\b', re.IGNORECASE), 'às realidades'),
    (re.compile(r'\baos\s+fenómenos\b', re.IGNORECASE), 'às realidades'),
    
    (re.compile(r'\bdesse\s+fenômeno\b', re.IGNORECASE), 'dessa realidade'),
    (re.compile(r'\bdesses\s+fenômenos\b', re.IGNORECASE), 'dessas realidades'),
    (re.compile(r'\bdesse\s+fenómeno\b', re.IGNORECASE), 'dessa realidade'),
    (re.compile(r'\bdesses\s+fenómenos\b', re.IGNORECASE), 'dessas realidades'),
    
    (re.compile(r'\bdeste\s+fenômeno\b', re.IGNORECASE), 'desta realidade'),
    (re.compile(r'\bdestes\s+fenômenos\b', re.IGNORECASE), 'destas realidades'),
    (re.compile(r'\bdeste\s+fenómeno\b', re.IGNORECASE), 'desta realidade'),
    (re.compile(r'\bdestes\s+fenómenos\b', re.IGNORECASE), 'destas realidades'),
    
    (re.compile(r'\bdaquele\s+fenômeno\b', re.IGNORECASE), 'daquela realidade'),
    (re.compile(r'\bdaqueles\s+fenômenos\b', re.IGNORECASE), 'daquelas realidades'),
    
    (re.compile(r'\bqualquer\s+fenômeno\b', re.IGNORECASE), 'qualquer realidade'),
    (re.compile(r'\bquaisquer\s+fenômenos\b', re.IGNORECASE), 'quaisquer realidades'),
    
    (re.compile(r'\b(fenômenos?|fenómenos?)\b', re.IGNORECASE), lambda m: 'realidades' if m.group(1).endswith('s') else 'realidade')
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
                    # Match case of original (very naive but works for start of sentence)
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

print(f"Fixed {changed} segments with ontology errors!")
