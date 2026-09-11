import json
import re
from pathlib import Path

ROOT_DIR = Path("/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site")

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
    
    if "entries" in data:
        for entry in data["entries"]:
            # check usage
            if "usage" in entry and entry["usage"]:
                text = entry["usage"]
                for pattern, repl_func in dict_violations:
                    if pattern.search(text):
                        def final_repl(m):
                            word = repl_func(m)
                            return word.capitalize() if m.group(1).isupper() else word
                        text = pattern.sub(final_repl, text)
                        modified = True
                entry["usage"] = text
            
            # check senses
            if "senses" in entry:
                for sense in entry["senses"]:
                    for field in ['pt', 'es']:
                        if field in sense and sense[field]:
                            text = sense[field]
                            for pattern, repl_func in dict_violations:
                                if pattern.search(text):
                                    def final_repl(m):
                                        word = repl_func(m)
                                        return word.capitalize() if m.group(1).isupper() else word
                                    text = pattern.sub(final_repl, text)
                                    modified = True
                            sense[field] = text
                    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

print("Dictionary fixed!")
