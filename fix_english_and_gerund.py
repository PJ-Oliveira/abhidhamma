import json, os, re, glob

# Mapping of common isolated English words to Portuguese equivalents
ENGLISH_MAP = {
    "for": "para",
    "the": "",
    "and": "e",
    "is": "é",
    "are": "são",
    "of": "de",
    "to": "para",
    "that": "que",
    "this": "isto",
    "which": "que",
    "with": "com",
    "in": "em",
    "as": "como",
    "on": "sobre",
    "by": "por",
    "but": "mas",
    "or": "ou",
    "if": "se",
    "when": "quando",
    "then": "então"
}

# Regex for isolated English words (case‑insensitive)
english_word_pat = re.compile(r"\\b(" + "|".join(ENGLISH_MAP.keys()) + r")\\b", re.IGNORECASE)

# Regex for PT‑PT gerund pattern: "continua a <verb>" where <verb> ends with 'r'
gerund_pat = re.compile(r"continua a (\\w+?)\\b", re.IGNORECASE)

def replace_english(text: str) -> str:
    def repl(m):
        eng = m.group(0).lower()
        pt = ENGLISH_MAP.get(eng, "")
        # Preserve capitalisation of the first letter if needed
        if m.group(0)[0].isupper():
            pt = pt.capitalize()
        return pt
    return english_word_pat.sub(repl, text)

def replace_gerund(text: str) -> str:
    def repl(m):
        verb = m.group(1)
        if verb.endswith('r'):
            base = verb[:-1]
            return f"continua {base}ndo"
        return m.group(0)
    return gerund_pat.sub(repl, text)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    changed = False
    for seg in data:
        pt = seg.get('pt')
        if not pt:
            continue
        new_pt = replace_english(pt)
        new_pt = replace_gerund(new_pt)
        if new_pt != pt:
            seg['pt'] = new_pt
            changed = True
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Modified: {filepath}")

if __name__ == '__main__':
    base = 'data/works'
    for path in glob.glob(os.path.join(base, '**', '*.json'), recursive=True):
        if path.endswith('index.json'):
            continue
        process_file(path)
    print('All files processed.')
