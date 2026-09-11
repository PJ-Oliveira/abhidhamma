import json
import os
import glob
import re
from collections import defaultdict

books_base = "data/works"
issues_found = []

# Regexes for common issues
ptpt_words = re.compile(r'\b(facto|contacto|controlo|perceção|secção|acto|projecto|objecto|objectivo|caraterística)\b', re.IGNORECASE)
ptpt_gerund = re.compile(r'\b(est[áa]|and[ao]|continu[ao]) a \w+[aei]r\b', re.IGNORECASE)
gender_realidade = re.compile(r'\b(um|o|do|este|esse|todo|outro|algum|nenhum)\s+realidade\b', re.IGNORECASE)
gender_consciencia = re.compile(r'\b(um|o|do|este|esse|todo|outro|algum|nenhum)\s+consciência\b', re.IGNORECASE)
wrong_dhamma = re.compile(r'\b(fenômenos?|fenómenos?)\b', re.IGNORECASE)
wrong_psych = re.compile(r'\b(subconsciente|inconsciente)\b', re.IGNORECASE)
wrong_sanskrit = re.compile(r'\b(karma|dharma)\b', re.IGNORECASE)
english_leak = re.compile(r'\b(the|and|is|are|of|in|to|that|this|which|with|for)\b', re.IGNORECASE)

def check_segment(book, fname, seg):
    pt = seg.get("pt", "")
    if pt is None: pt = ""
    pt = pt.strip()
    
    en = seg.get("en", "")
    if en is None: en = ""
    en = en.strip()
    
    pali = seg.get("pali", "")
    if pali is None: pali = ""
    pali = pali.strip()
    
    rend = seg.get("rend", "")
    seg_id = seg.get("id", "N/A")

    if not pt and (en or pali) and rend in ("bodytext", "gatha1", "gathalast"):
        issues_found.append((book, fname, seg_id, "MISSING TRANSLATION", "Missing Portuguese text"))
        return

    if not pt:
        return

    # Check PT-PT words
    m = ptpt_words.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "PT-PT WORD", f"Found: '{m.group(0)}'"))
        
    m = ptpt_gerund.search(pt)
    if m:
        if "está a tarefa" not in pt.lower():
            issues_found.append((book, fname, seg_id, "PT-PT GERUND", f"Found: '{m.group(0)}'"))

    m = gender_realidade.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "GENDER MATCH (realidade)", f"Found: '{m.group(0)}'"))
        
    m = gender_consciencia.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "GENDER MATCH (consciência)", f"Found: '{m.group(0)}'"))

    m = wrong_dhamma.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "ONTOLOGY (fenômeno)", f"Found: '{m.group(0)}'. Should be 'realidade'?"))

    m = wrong_psych.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "PSYCHOLOGIZATION", f"Found: '{m.group(0)}'. Do not use for bhavanga."))

    m = wrong_sanskrit.search(pt)
    if m:
        issues_found.append((book, fname, seg_id, "SANSKRIT TERM", f"Found: '{m.group(0)}'. Use Pali."))

    if len(pt) > 10:
        words = pt.split()
        eng_matches = [w for w in words if english_leak.fullmatch(w.strip('.,;!?()[]"\''))]
        if len(eng_matches) > 3:
            issues_found.append((book, fname, seg_id, "ENGLISH LEAK", f"Found english words: {', '.join(eng_matches[:5])}"))


total = 0
for filepath in sorted(glob.glob(f"{books_base}/**/*.json", recursive=True)):
    if "index.json" in filepath:
        continue
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        continue
    
    if not isinstance(data, list):
        continue
        
    parts = filepath.split('/')
    book = parts[-2]
    fname = parts[-1]
    
    for seg in data:
        total += 1
        check_segment(book, fname, seg)

summary = defaultdict(int)
for issue in issues_found:
    summary[issue[3]] += 1

print(f"Total Segments Scanned: {total}")
print("\n=== SUMMARY OF ISSUES ===")
for k, v in summary.items():
    print(f"{k}: {v}")

with open('audit_report.md', 'w') as f:
    f.write("# Relatório de Auditoria de Traduções\n\n")
    f.write(f"**Total de Segmentos Analisados**: {total}\n\n")
    f.write("## Resumo dos Problemas Encontrados\n")
    for k, v in summary.items():
        f.write(f"- **{k}**: {v} ocorrências\n")
        
    f.write("\n## Problemas Detalhados\n")
    current_book = ""
    for issue in issues_found:
        if issue[0] != current_book:
            current_book = issue[0]
            f.write(f"\n### Livro: {current_book}\n")
        f.write(f"- Arquivo `{issue[1]}` (ID: {issue[2]}): **{issue[3]}** - {issue[4]}\n")

