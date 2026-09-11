import json
import re
from pathlib import Path

ROOT_DIR = Path("/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site")

# 1. Fix Dictionary (PT and ES)
DICT_DIR = ROOT_DIR / "data" / "dictionary"
dict_violations = [
    (re.compile(r'\b(k)arma\b', re.IGNORECASE), lambda m: m.group(1) + "amma"),
    (re.compile(r'\b(f)enômenos\b', re.IGNORECASE), lambda m: m.group(1) + "ealidades"),
    (re.compile(r'\b(f)enômeno\b', re.IGNORECASE), lambda m: m.group(1) + "ealidade"),
    (re.compile(r'\b(f)enómenos\b', re.IGNORECASE), lambda m: m.group(1) + "ealidades"),
    (re.compile(r'\b(f)enómeno\b', re.IGNORECASE), lambda m: m.group(1) + "ealidad"),
]

for file_path in DICT_DIR.glob("*.json"):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        continue
    
    modified = False
    
    # words is the main dict mapping word -> details
    if "words" in data:
        for word, entry in data["words"].items():
            for field in ['pt', 'es', 'usage']:
                if field in entry and entry[field]:
                    text = entry[field]
                    for pattern, repl_func in dict_violations:
                        if pattern.search(text):
                            def final_repl(m):
                                word = repl_func(m)
                                return word.capitalize() if m.group(1).isupper() else word
                            text = pattern.sub(final_repl, text)
                            modified = True
                    entry[field] = text
                    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


# 2. Fix Corpus PT/ES only (subconsciência, etc.)
WORKS_DIR = ROOT_DIR / "data" / "works"
corpus_violations = [
    (re.compile(r'\b(s)ubconsciência(s?)\b', re.IGNORECASE), lambda m: m.group(1) + "havaṅga" + m.group(2)),
    (re.compile(r'\b(s)ubconsciente(s?)\b', re.IGNORECASE), lambda m: m.group(1) + "havaṅga" + m.group(2)),
    (re.compile(r'\b(s)ubconsciencia(s?)\b', re.IGNORECASE), lambda m: m.group(1) + "havaṅga" + m.group(2))
]

for file_path in WORKS_DIR.rglob("*.json"):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        continue
        
    if not isinstance(data, list):
        continue
        
    modified = False
    for segment in data:
        for lang in ['pt', 'es']: # ONLY touch PT and ES
            if lang in segment and segment[lang]:
                text = segment[lang]
                for pattern, repl_func in corpus_violations:
                    if pattern.search(text):
                        def final_repl(m):
                            word = repl_func(m)
                            return word.capitalize() if m.group(1).isupper() else word
                        text = pattern.sub(final_repl, text)
                        modified = True
                segment[lang] = text
                
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Dictionary and Corpus fixes completed.")
