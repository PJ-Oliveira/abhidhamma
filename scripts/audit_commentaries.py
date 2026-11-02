#!/usr/bin/env python3
"""Auditoria profunda e detalhada das 3 obras de Comentários Contemporâneos:
1. Lessons in Abhidhamma (Bhante Subhūti)
2. Dhamma Now (Sarah Procter Abbott)
3. Dhamma Now 2 (Sarah Procter Abbott)
"""

import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "data" / "manifest.json"
WORKS_DIR = ROOT / "data" / "works"

BOOKS = ["lessons-in-abhidhamma", "dhamma-now", "dhamma-now-2"]

# Regexes de verificação linguística e terminológica
PTPT_WORDS = re.compile(r"\b(facto|factos|contacto|contactos|controlo|controlos|percepção|secção|acto|actos|projecto|projectos|objecto|objectos|objectivo|objectivos|caraterística|actividade|actividades|directo|exacto|efectivo|adopção|direcção|óptimo|óptima)\b", re.I)
PTPT_GERUND = re.compile(r"\b(est[áa]|and[ao]|continu[ao]|fic[ao]) a \w+[aei]r\b", re.I)
FENOM = re.compile(r"\bfen[oôó]meno|\bfenomen", re.I)
PSYCH = re.compile(r"\b(subconsciente|inconsciente)s?\b", re.I)
SANSKRIT = re.compile(r"\b(karma|dharma|nirvana|nirvāṇa|skandha|sutra|sūtra)\b", re.I)
BAD_PALI = re.compile(r"[ṁśṛṝḥ]")
ES_IN_PT = re.compile(r"\b(también|pero|cuando|donde|según|además|hay|muy|ahora|nosotros|vosotros)\b", re.I)
PT_IN_ES = re.compile(r"\b(não|são|também|você|vocês|então|têm|estão|está a|fazer)\b", re.I)
EN_LEAKS = re.compile(r"\b(the|and|of|is|are|with|which|that|this|from|by|does|did|will|would|have|has|had|been|were|shall|should|their|there|these|those)\b", re.I)
PT_GENDER = re.compile(r"\b(um|o|do|no|pelo|este|esse|aquele|todo|outro|algum|nenhum)\s+(realidade|consciência)\b", re.I)
ES_GENDER = re.compile(r"\b(el|un|del|al|este|ese|aquel|todo|otro|algún|ningún)\s+(realidad|conciencia)\b", re.I)

HTML_TAGS = re.compile(r"<[^>]+>")

def audit_book(book_id: str):
    book_dir = WORKS_DIR / book_id
    index_file = book_dir / "index.json"
    texto_file = book_dir / "texto.json"
    
    findings = {
        "book_id": book_id,
        "structural_errors": [],
        "toc_errors": [],
        "pt_errors": defaultdict(list),
        "es_errors": defaultdict(list),
        "en_errors": defaultdict(list),
        "stats": {}
    }
    
    if not index_file.exists():
        findings["structural_errors"].append("Ficheiro index.json não encontrado.")
        return findings
    if not texto_file.exists():
        findings["structural_errors"].append("Ficheiro texto.json não encontrado.")
        return findings

    try:
        index_data = json.loads(index_file.read_text(encoding="utf-8"))
    except Exception as e:
        findings["structural_errors"].append(f"Erro ao ler index.json: {e}")
        return findings

    try:
        texto_data = json.loads(texto_file.read_text(encoding="utf-8"))
    except Exception as e:
        findings["structural_errors"].append(f"Erro ao ler texto.json: {e}")
        return findings

    # Verificação de segmentos em texto.json
    segments = texto_data if isinstance(texto_data, list) else texto_data.get("segments", [])
    findings["stats"]["total_segments"] = len(segments)
    
    seg_ids = []
    seg_map = {}
    for i, s in enumerate(segments):
        sid = s.get("id")
        if sid is None:
            findings["structural_errors"].append(f"Segmento no índice {i} sem campo 'id'")
            continue
        seg_ids.append(sid)
        seg_map[sid] = s
        
        # Verificar campos obrigatórios
        pli = s.get("pali", "")
        eng = s.get("en", "")
        por = s.get("pt", "")
        spa = s.get("es", "")
        
        # 1. Checar texto em inglês
        if not eng or not eng.strip():
            findings["en_errors"]["empty"].append(sid)
        if unicodedata.normalize("NFC", eng) != eng:
            findings["en_errors"]["nfc"].append(sid)
        if BAD_PALI.search(eng):
            findings["en_errors"]["bad_diacritics"].append(sid)

        # 2. Checar texto em português
        if not por or not por.strip():
            findings["pt_errors"]["empty"].append(sid)
        else:
            if unicodedata.normalize("NFC", por) != por:
                findings["pt_errors"]["nfc"].append(sid)
            m_ptpt = PTPT_WORDS.findall(por)
            if m_ptpt:
                findings["pt_errors"]["lusitanismos"].append((sid, m_ptpt))
            m_gerund = PTPT_GERUND.findall(por)
            if m_gerund:
                findings["pt_errors"]["gerundio_pt"].append((sid, m_gerund))
            m_fenom = FENOM.findall(por)
            if m_fenom:
                findings["pt_errors"]["fenomeno"].append((sid, m_fenom))
            m_psych = PSYCH.findall(por)
            if m_psych:
                findings["pt_errors"]["psicologizacao"].append((sid, m_psych))
            m_sans = SANSKRIT.findall(por)
            if m_sans:
                findings["pt_errors"]["sanscrito"].append((sid, m_sans))
            m_badpali = BAD_PALI.findall(por)
            if m_badpali:
                findings["pt_errors"]["bad_diacritics"].append((sid, m_badpali))
            m_es = ES_IN_PT.findall(por)
            if m_es:
                findings["pt_errors"]["espanhol_em_pt"].append((sid, m_es))
            m_gender = PT_GENDER.findall(por)
            if m_gender:
                findings["pt_errors"]["concordancia_genero"].append((sid, m_gender))
            
            # Detecção de vazamento de frases inteiras em inglês (mais de 4 palavras comuns inglesas)
            en_words = [w.lower() for w in EN_LEAKS.findall(por)]
            if len(en_words) >= 4:
                findings["pt_errors"]["vazamento_ingles"].append((sid, en_words[:6]))

        # 3. Checar texto em espanhol
        if not spa or not spa.strip():
            findings["es_errors"]["empty"].append(sid)
        else:
            if unicodedata.normalize("NFC", spa) != spa:
                findings["es_errors"]["nfc"].append(sid)
            m_fenom_es = FENOM.findall(spa)
            if m_fenom_es:
                findings["es_errors"]["fenomeno"].append((sid, m_fenom_es))
            m_psych_es = PSYCH.findall(spa)
            if m_psych_es:
                findings["es_errors"]["psicologizacao"].append((sid, m_psych_es))
            m_sans_es = SANSKRIT.findall(spa)
            if m_sans_es:
                findings["es_errors"]["sanscrito"].append((sid, m_sans_es))
            m_badpali_es = BAD_PALI.findall(spa)
            if m_badpali_es:
                findings["es_errors"]["bad_diacritics"].append((sid, m_badpali_es))
            m_pt_in_es = PT_IN_ES.findall(spa)
            if m_pt_in_es:
                findings["es_errors"]["portugues_em_es"].append((sid, m_pt_in_es))
            m_gender_es = ES_GENDER.findall(spa)
            if m_gender_es:
                findings["es_errors"]["concordancia_genero"].append((sid, m_gender_es))
            
            en_words_es = [w.lower() for w in EN_LEAKS.findall(spa)]
            if len(en_words_es) >= 4:
                findings["es_errors"]["vazamento_ingles"].append((sid, en_words_es[:6]))

    # Checar continuidade de IDs
    expected_ids = list(range(1, len(segments) + 1))
    if seg_ids != expected_ids:
        missing = set(expected_ids) - set(seg_ids)
        dups = [item for item, count in Counter(seg_ids).items() if count > 1]
        if missing:
            findings["structural_errors"].append(f"Segmentos faltantes na sequência 1..N: {sorted(missing)[:10]}")
        if dups:
            findings["structural_errors"].append(f"IDs de segmentos duplicados: {dups[:10]}")

    # Verificar TOC em index.json
    toc = index_data.get("parts", {}).get("texto", {}).get("toc", [])
    findings["stats"]["toc_entries"] = len(toc)
    for entry in toc:
        tid = entry.get("id")
        if tid not in seg_map:
            findings["toc_errors"].append(f"TOC aponta para id {tid} inexistente em texto.json")

    return findings

def main():
    print("=" * 80)
    print("AUDITORIA COMPLETA DE COMENTÁRIOS CONTEMPORÂNEOS")
    print("=" * 80)
    
    for b in BOOKS:
        f = audit_book(b)
        print(f"\n>>> OBRA: {b.upper()} <<<")
        print(f"Total de Segmentos: {f['stats'].get('total_segments', 0)}")
        print(f"Total de Entradas no TOC: {f['stats'].get('toc_entries', 0)}")
        
        if f["structural_errors"]:
            print("\n[ERROS ESTRUTURAIS]")
            for err in f["structural_errors"]:
                print(f"  - {err}")
        else:
            print("[✓] Estrutura de arquivos e índices íntegra.")
            
        if f["toc_errors"]:
            print("\n[ERROS DE TOC]")
            for err in f["toc_errors"]:
                print(f"  - {err}")
        else:
            print("[✓] Todas as entradas do TOC mapeiam para segmentos existentes.")

        # Relatório PT
        print("\n[ANÁLISE DE TRADUÇÃO - PORTUGUÊS]")
        for k, v in f["pt_errors"].items():
            print(f"  * {k}: {len(v)} ocorrências")
            for sample in v[:4]:
                print(f"     ex: {sample}")
        if not f["pt_errors"]:
            print("  [✓] Zero anomalias em Português.")

        # Relatório ES
        print("\n[ANÁLISE DE TRADUÇÃO - ESPANHOL]")
        for k, v in f["es_errors"].items():
            print(f"  * {k}: {len(v)} ocorrências")
            for sample in v[:4]:
                print(f"     ex: {sample}")
        if not f["es_errors"]:
            print("  [✓] Zero anomalias em Espanhol.")

        # Relatório EN
        print("\n[ANÁLISE DO TEXTO ORIGINAL - INGLÊS]")
        for k, v in f["en_errors"].items():
            print(f"  * {k}: {len(v)} ocorrências")
            for sample in v[:4]:
                print(f"     ex: {sample}")
        if not f["en_errors"]:
            print("  [✓] Zero anomalias no Inglês original.")

if __name__ == "__main__":
    main()
