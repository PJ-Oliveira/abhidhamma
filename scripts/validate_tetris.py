#!/usr/bin/env python3
"""Valida o currículo do Abhidhamma Tetris em data/tetris/unit-*.json.

Uso:
    python3 scripts/validate_tetris.py                 # todas as unidades presentes
    python3 scripts/validate_tetris.py data/tetris/unit-3.json

Sai com código 1 se houver QUALQUER erro. Avisos (WARN) não reprovam, mas devem ser
revistos. As regras de elegibilidade das cartas geradas espelham src/tetris/taxonomy.ts.
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "tetris"
LANGS = ("en", "pt", "es")

CARD_ID_RE = re.compile(r"^u(\d+)\.[a-z0-9_.\-]+$")
NODE_ID_RE = re.compile(r"^[A-Za-z0-9_\-]+$")
TAX_ID_RE = CARD_ID_RE
GEN_ID_RE = re.compile(r"^(u\d+\.[a-z0-9_.\-]+)/([A-Za-z0-9_\-]+)/(count|category|member|intruder)$")

PTPT = re.compile(r"\b(facto|factos|contacto|controlo|perce[cç][aã]o|sec[cç][aã]o|acto|projecto|objecto|objectivo|caraterística|actividade|directo|exacto|efectivo)\b", re.I)
PTPT_GERUND = re.compile(r"\b(est[áa]|and[ao]|continu[ao]|fic[ao]) a \w+[aei]r\b", re.I)
FENOM = re.compile(r"\bfen[oô]meno|\bfenomen", re.I)
PSYCH = re.compile(r"\b(subconsciente|inconsciente)s?\b", re.I)
SANSKRIT = re.compile(r"\b(karma|dharma|nirvana|nirvāṇa|skandha|sutra)\b", re.I)
EN_LEAK = re.compile(r"\b(the|and|of|is|are|with|which|that|this|from|by|not|can|will|have|does)\b", re.I)
PT_IN_ES = re.compile(r"\b(não|são|também|você|então|têm)\b", re.I)
ES_IN_PT = re.compile(r"\b(también|pero|cuando|donde|según|además|hay|muy|ahora|nosotros)\b", re.I)
ES_GENDER = re.compile(r"\b(el|un|este|ese)\s+realidad\b", re.I)
PT_GENDER = re.compile(r"\b(um|o|do|este|esse|todo|outro|algum|nenhum)\s+(realidade|consciência)\b", re.I)
BAD_PALI = re.compile(r"[ṁśṛṝḥ]")

errors: list[str] = []
warns: list[str] = []


def err(where: str, msg: str) -> None:
    errors.append(f"ERROR {where}: {msg}")


def warn(where: str, msg: str) -> None:
    warns.append(f"WARN  {where}: {msg}")


def check_localized(where: str, obj, *, max_len: int | None = None, allow_empty=False) -> bool:
    if not isinstance(obj, dict) or set(obj.keys()) != set(LANGS):
        err(where, f"deve ter exatamente as chaves {LANGS}")
        return False
    ok = True
    for lang in LANGS:
        v = obj[lang]
        if not isinstance(v, str) or (not v.strip() and not allow_empty):
            err(f"{where}.{lang}", "texto vazio ou não-string")
            ok = False
            continue
        if unicodedata.normalize("NFC", v) != v:
            err(f"{where}.{lang}", "não está em NFC (use diacríticos Pāli compostos)")
        if "<" in v or ">" in v:
            err(f"{where}.{lang}", "não use '<' ou '>' (texto puro)")
        if BAD_PALI.search(v):
            warn(f"{where}.{lang}", "diacrítico não padrão (use ṃ, não ṁ; evite sânscrito)")
        if "  " in v or v != v.strip():
            err(f"{where}.{lang}", "espaços duplicados/bordas")
        if max_len and len(v) > max_len:
            warn(f"{where}.{lang}", f"longo demais ({len(v)} > {max_len})")
        if lang == "pt":
            for rx, label in ((FENOM, "fenômeno"), (PSYCH, "subconsciente/inconsciente"), (SANSKRIT, "termo sânscrito"), (PTPT, "lusitanismo"), (PTPT_GERUND, "gerúndio lusitano"), (ES_IN_PT, "espanhol em PT"), (PT_GENDER, "concordância (realidade/consciência)")):
                m = rx.search(v)
                if m:
                    err(f"{where}.pt", f"{label}: '{m.group(0)}'")
        if lang == "es":
            for rx, label in ((FENOM, "fenómeno"), (PSYCH, "subconsciente/inconsciente"), (SANSKRIT, "término sánscrito"), (PT_IN_ES, "portugués en ES"), (ES_GENDER, "concordancia (realidad)")):
                m = rx.search(v)
                if m:
                    err(f"{where}.es", f"{label}: '{m.group(0)}'")
        if lang in ("pt", "es"):
            leaks = [w for w in EN_LEAK.findall(v)]
            if leaks:
                err(f"{where}.{lang}", f"inglês residual: {sorted(set(w.lower() for w in leaks))}")
    return ok


def tax_structure(tax: dict, where: str):
    nodes = tax.get("nodes", [])
    by_id: dict[str, dict] = {}
    for n in nodes:
        nid = n.get("id")
        if not isinstance(nid, str) or not NODE_ID_RE.match(nid):
            err(f"{where}.nodes", f"id de nó inválido: {nid!r}")
            continue
        if nid in by_id:
            err(f"{where}.nodes", f"id de nó duplicado: {nid}")
        by_id[nid] = n
    roots = [n for n in nodes if n.get("parent") is None]
    if len(roots) != 1:
        err(where, f"deve haver exatamente 1 raiz (há {len(roots)})")
        return None
    children: dict[str, list[str]] = defaultdict(list)
    for n in nodes:
        p = n.get("parent")
        if p is not None:
            if p not in by_id:
                err(f"{where}.nodes.{n['id']}", f"parent inexistente: {p}")
            else:
                children[p].append(n["id"])
    root = roots[0]["id"]
    depth: dict[str, int] = {}
    parent: dict[str, str | None] = {n["id"]: n.get("parent") for n in nodes if "id" in n}

    def walk(nid: str, d: int, seen: set[str]) -> None:
        if nid in seen:
            err(where, f"ciclo na taxonomia em {nid}")
            return
        seen.add(nid)
        depth[nid] = d
        for c in children.get(nid, []):
            walk(c, d + 1, seen)

    walk(root, 0, set())
    for nid in by_id:
        if nid not in depth:
            err(f"{where}.nodes.{nid}", "nó inalcançável a partir da raiz")
    return by_id, children, parent, depth, root


def ancestors(parent: dict, nid: str) -> set[str]:
    out: set[str] = set()
    p = parent.get(nid)
    while p is not None:
        out.add(p)
        p = parent.get(p)
    return out


def descendants(children: dict, nid: str) -> set[str]:
    out: set[str] = set()
    stack = list(children.get(nid, []))
    while stack:
        x = stack.pop()
        if x in out:
            continue
        out.add(x)
        stack.extend(children.get(x, []))
    return out


def node_count(by_id, children, nid: str) -> int:
    ch = children.get(nid, [])
    if not ch:
        w = by_id[nid].get("weight", 1)
        return w if isinstance(w, int) and w >= 1 else 1
    return sum(node_count(by_id, children, c) for c in ch)


def category_pool(by_id, children, parent, depth, x: str) -> list[str]:
    p = parent.get(x)
    if p is None:
        return []
    excluded = ancestors(parent, x) | {x, p} | descendants(children, x)
    internal = [n for n in by_id if children.get(n)]
    sib_of_p = [n for n in children.get(parent.get(p), []) if n != p] if parent.get(p) is not None else []
    tier1 = [n for n in sib_of_p if n not in excluded and children.get(n)]
    tier2 = [n for n in internal if depth[n] == depth[p] and n not in excluded and n not in tier1]
    tier3 = [n for n in internal if n not in excluded and n not in tier1 and n not in tier2]
    return tier1 + tier2 + tier3


def outsiders_for(by_id, children, parent, depth, g: str) -> list[str]:
    sub = descendants(children, g) | {g}
    child_depth = depth[g] + 1
    return [n for n in by_id if depth[n] == child_depth and n not in sub and parent.get(n) != g]


def generated_ids(tax: dict, by_id, children, parent, depth, root) -> dict[str, str]:
    """Mapeia id de carta gerada -> template, espelhando src/tetris/taxonomy.ts."""
    out: dict[str, str] = {}
    tid = tax["id"]
    for nid in by_id:
        if nid == root:
            continue
        if parent.get(nid) == root:
            continue
        if len(category_pool(by_id, children, parent, depth, nid)) >= 3:
            out[f"{tid}/{nid}/category"] = "category"
    for nid in by_id:
        ch = children.get(nid, [])
        if ch or node_count(by_id, children, nid) >= 2:
            out[f"{tid}/{nid}/count"] = "count"
    for nid in by_id:
        ch = children.get(nid, [])
        if nid == root or not ch:
            continue
        outs = outsiders_for(by_id, children, parent, depth, nid)
        if len(ch) >= 2 and len(outs) >= 3:
            out[f"{tid}/{nid}/member"] = "member"
        if len(ch) >= 3 and len(outs) >= 1:
            out[f"{tid}/{nid}/intruder"] = "intruder"
    return out


def validate_unit(path: Path):
    where0 = path.name
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(where0, f"JSON inválido: {e}")
        return None
    unit = data.get("unit")
    if not isinstance(unit, int):
        err(where0, "campo 'unit' inteiro ausente")
        return None
    if path.name != f"unit-{unit}.json":
        err(where0, f"nome de arquivo deve ser unit-{unit}.json")
    check_localized(f"{where0}.title", data.get("title"))
    check_localized(f"{where0}.summary", data.get("summary"), max_len=500)

    gen: dict[str, str] = {}
    tax_ids: set[str] = set()
    for tax in data.get("taxonomies", []):
        tid = tax.get("id", "?")
        w = f"{where0}.taxonomy[{tid}]"
        m = TAX_ID_RE.match(tid) if isinstance(tid, str) else None
        if not m or int(m.group(1)) != unit:
            err(w, f"id deve começar com 'u{unit}.'")
        if tid in tax_ids:
            err(w, "id de taxonomia duplicado")
        tax_ids.add(tid)
        check_localized(f"{w}.title", tax.get("title"), max_len=90)
        check_localized(f"{w}.noun", tax.get("noun"), max_len=40)
        src = tax.get("source", {})
        if not any(src.get(k) for k in ("cma", "fund", "as")):
            err(w, "source vazio")
        for n in tax.get("nodes", []):
            check_localized(f"{w}.node[{n.get('id')}].name", n.get("name"), max_len=80)
            wt = n.get("weight")
            if wt is not None and (not isinstance(wt, int) or wt < 1):
                err(f"{w}.node[{n.get('id')}]", "weight deve ser inteiro >= 1")
        st = tax_structure(tax, w)
        if st:
            by_id, children, parent, depth, root = st
            names = Counter(n["name"]["en"].strip().lower() for n in tax["nodes"] if isinstance(n.get("name"), dict) and "en" in n["name"])
            for nm, c in names.items():
                if c > 1:
                    err(w, f"nome EN duplicado entre nós: {nm!r} (ambíguo como opção)")
            gen.update(generated_ids(tax, by_id, children, parent, depth, root))

    authored_ids: list[str] = []
    prompts_en = Counter()
    cards = data.get("cards", [])
    for c in cards:
        cid = c.get("id", "?")
        w = f"{where0}.card[{cid}]"
        m = CARD_ID_RE.match(cid) if isinstance(cid, str) else None
        if not m or int(m.group(1)) != unit:
            err(w, f"id deve começar com 'u{unit}.' e usar [a-z0-9_.-]")
        if cid in authored_ids or cid in gen:
            err(w, "id duplicado")
        authored_ids.append(cid)
        if c.get("kind") not in ("atom", "derived"):
            err(w, "kind deve ser 'atom' ou 'derived'")
        check_localized(f"{w}.topic", c.get("topic"), max_len=60)
        check_localized(f"{w}.prompt", c.get("prompt"), max_len=260)
        check_localized(f"{w}.correct", c.get("correct"), max_len=120)
        check_localized(f"{w}.explanation", c.get("explanation"), max_len=700)
        dis = c.get("distractors", [])
        if not isinstance(dis, list) or not (3 <= len(dis) <= 5):
            err(w, "distractors deve ter 3 a 5 itens")
            dis = []
        for i, d in enumerate(dis):
            check_localized(f"{w}.distractors[{i}]", d, max_len=120)
        for lang in LANGS:
            try:
                opts = [c["correct"][lang].strip().lower()] + [d[lang].strip().lower() for d in dis]
            except Exception:  # noqa: BLE001
                continue
            if len(set(opts)) != len(opts):
                err(w, f"opções repetidas em {lang}")
        src = c.get("source", {})
        if not isinstance(src, dict) or not any(src.get(k) for k in ("cma", "fund", "as")):
            err(w, "source precisa de ao menos um de cma/fund/as")
        req = c.get("requires", [])
        if not isinstance(req, list):
            err(w, "requires deve ser lista")
            req = []
        if c.get("kind") == "derived" and not req:
            err(w, "carta 'derived' precisa de requires (os átomos que ela integra)")
        if isinstance(c.get("prompt"), dict):
            prompts_en[c["prompt"].get("en", "").strip().lower()] += 1
    for p, n in prompts_en.items():
        if n > 1:
            err(where0, f"prompt EN repetido {n}x: {p[:70]!r}")

    all_ids = set(authored_ids) | set(gen)
    graph: dict[str, list[str]] = {}
    for c in cards:
        cid = c.get("id")
        req = c.get("requires", []) if isinstance(c.get("requires"), list) else []
        graph[cid] = []
        for r in req:
            if r == cid:
                err(f"{where0}.card[{cid}]", "requires aponta para si mesma")
            if r not in all_ids:
                if GEN_ID_RE.match(r):
                    err(f"{where0}.card[{cid}]", f"requires '{r}' é um id gerado INEXISTENTE/INELEGÍVEL (confira taxonomia/nó/template)")
                else:
                    err(f"{where0}.card[{cid}]", f"requires '{r}' não existe nesta unidade")
            elif r in authored_ids:
                graph[cid].append(r)
    # ciclos
    color: dict[str, int] = {}

    def dfs(n: str, stack: list[str]) -> None:
        color[n] = 1
        for m in graph.get(n, []):
            if color.get(m, 0) == 1:
                err(where0, f"ciclo em requires: {' -> '.join(stack + [n, m])}")
            elif color.get(m, 0) == 0:
                dfs(m, stack + [n])
        color[n] = 2

    for n in list(graph):
        if color.get(n, 0) == 0:
            dfs(n, [])

    tcount = Counter(gen.values())
    return {
        "unit": unit,
        "authored": len(cards),
        "atoms": sum(1 for c in cards if c.get("kind") == "atom"),
        "derived": sum(1 for c in cards if c.get("kind") == "derived"),
        "taxonomies": len(tax_ids),
        "generated": dict(tcount),
        "generated_total": sum(tcount.values()),
    }


def main(argv: list[str]) -> int:
    paths = [Path(a) for a in argv] if argv else sorted(DATA.glob("unit-*.json"), key=lambda p: int(re.findall(r"\d+", p.stem)[0]))
    if not paths:
        print("Nenhum unit-*.json encontrado em data/tetris/")
        return 1
    summaries = []
    for p in paths:
        s = validate_unit(p if p.is_absolute() else ROOT / p)
        if s:
            summaries.append(s)
    for line in warns:
        print(line)
    for line in errors:
        print(line)
    print("\n=== RESUMO ===")
    for s in summaries:
        print(
            f"unidade {s['unit']}: autoradas={s['authored']} (átomos={s['atoms']}, derivadas={s['derived']}) "
            f"taxonomias={s['taxonomies']} geradas={s['generated_total']} {s['generated']}"
        )
    print(f"erros={len(errors)} avisos={len(warns)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
