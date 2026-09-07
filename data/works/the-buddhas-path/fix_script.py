import json
import re
import os

files = [
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/the-buddhas-path/texto__0.json",
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/the-buddhas-path/texto__1.json",
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/the-buddhas-path/texto__2.json",
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/the-buddhas-path/texto__3.json"
]

replacements = [
    (r'\btodos as realidades\b', 'todas as realidades'),
    (r'\btodos os realidades\b', 'todas as realidades'),
    (r'\bdesses realidades\b', 'dessas realidades'),
    (r'\bdestes realidades\b', 'destas realidades'),
    (r'\bdaqueles realidades\b', 'daquelas realidades'),
    (r'\buns realidades\b', 'umas realidades'),
    (r'\bmuitos realidades\b', 'muitas realidades'),
    (r'\balguns realidades\b', 'algumas realidades'),
    (r'\boutros realidades\b', 'outras realidades'),
    (r'\bpoucos realidades\b', 'poucas realidades'),
    (r'\bestes realidades\b', 'estas realidades'),
    (r'\besses realidades\b', 'essas realidades'),
    (r'\baqueles realidades\b', 'aquelas realidades'),
    (r'\bum realidade mental\b', 'uma realidade mental'),
    (r'\bum realidade física\b', 'uma realidade física'),
    (r'\bum realidade físico\b', 'uma realidade física'),
    (r'\bum realidade físico que pode ser ouvido\b', 'uma realidade física que pode ser ouvida'),
    (r'\bum realidade corporal condicionado\b', 'uma realidade corporal condicionada'),
    (r'\bO realidade mental\b', 'A realidade mental'),
    (r'\bo realidade físico\b', 'a realidade física'),
    (r'\bO realidade físico\b', 'A realidade física'),
    (r'\bum realidade\b', 'uma realidade'),
    (r'\bo realidade\b', 'a realidade'),
    (r'\beste realidade\b', 'esta realidade'),
    (r'\besse realidade\b', 'essa realidade'),
    (r'\baquele realidade\b', 'aquela realidade'),
    (r'\bdo realidade\b', 'da realidade'),
    (r'\bno realidade\b', 'na realidade'),
    (r'\bpelo realidade\b', 'pela realidade'),
    (r'\bao realidade\b', 'à realidade'),
    (r'\bO realidade\b', 'A realidade'),
    (r'\bUm realidade\b', 'Uma realidade'),
    (r'\bEste realidade\b', 'Esta realidade'),
    (r'\bEsse realidade\b', 'Essa realidade'),
    (r'\bAquele realidade\b', 'Aquela realidade'),
    (r'\bDo realidade\b', 'Da realidade'),
    (r'\bNo realidade\b', 'Na realidade'),
    (r'\bPelo realidade\b', 'Pela realidade'),
    (r'\bAo realidade\b', 'À realidade')
]

for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    modified = False
    for item in data:
        pt = item.get("pt", "")
        pali = item.get("pali", "")
        
        # fix empty pt
        if not pt.strip() and pali.strip():
            if "CHAPTER" in pali:
                # e.g., "2 CHAPTER 1. INTRODUCTION" -> "2 CAPÍTULO 1. INTRODUÇÃO"
                new_pt = pali.replace("CHAPTER", "CAPÍTULO").replace("INTRODUCTION", "INTRODUÇÃO")
                item["pt"] = new_pt
                modified = True
                
        # fix grammar
        if pt:
            orig_pt = pt
            for pattern, repl in replacements:
                # Using re.IGNORECASE could mess up capitalization, so we rely on exact matches or manual cases
                pt = re.sub(pattern, repl, pt)
            
            if pt != orig_pt:
                item["pt"] = pt
                modified = True

    if modified:
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {fpath}")

