#!/usr/bin/env python3
"""
Extrai o Abhidhamma Pitaka (+ comentarios, subcomentarios, tratados
independentes e Visuddhimagga) dos 4 bancos SQLite (pali/en/pt/es) e gera
JSON estatico para o site em data/works/<work_id>/<part>[__<chunk>].json,
alem de data/manifest.json com a arvore de navegacao.
"""
import json
import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "data" / "works"

DBS = {
    "pali": (ROOT / "tipitaka-roman-pali.db", "pali_text"),
    "en": (ROOT / "english_tipitaka_translation_data-2026-04-28.db", "english_translation"),
    "pt": (ROOT / "portuguese_tipitaka_translation_data-2026-07-22.db", "portuguese_translation"),
    "es": (ROOT / "spanish_tipitaka_translation_data-2026-05-15.db", "spanish_translation"),
}

# Linhas por arquivo JSON antes de fatiar por capitulo (performance no navegador)
CHUNK_SIZE = 900

# ---------------------------------------------------------------------------
# Registro das obras. Cada "part" e uma lista de fontes (tabela + faixa de id
# opcional, usada para separar os 5 livros que compartilham uma unica tabela
# em abh03a_att / abh03t_tik / abh05t_nrf).
# ---------------------------------------------------------------------------

def src(table, id_range=None):
    return {"table": table, "id_range": id_range}


WORKS = [
    {
        "id": "dhammasangani",
        "title": "Dhammasaṅgaṇī",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh01m_mul")],
            "attha": [src("abh01a_att")],
            "tika": [src("abh01t_tik")],
            "anutika": [src("abh04t_nrf")],
        },
    },
    {
        "id": "vibhanga",
        "title": "Vibhaṅga",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh02m_mul")],
            "attha": [src("abh02a_att")],
            "tika": [src("abh02t_tik")],
        },
    },
    {
        "id": "dhatukatha",
        "title": "Dhātukathā",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh03m1_mul")],
            "attha": [src("abh03a_att", (1, 143))],
            "tika": [src("abh03t_tik", (1, 99))],
            "anutika": [src("abh05t_nrf", (1, 116))],
        },
    },
    {
        "id": "puggalapannatti",
        "title": "Puggalapaññatti",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh03m2_mul")],
            "attha": [src("abh03a_att", (144, 429))],
            "tika": [src("abh03t_tik", (100, 200))],
            "anutika": [src("abh05t_nrf", (117, 212))],
        },
    },
    {
        "id": "kathavatthu",
        "title": "Kathāvatthu",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh03m3_mul")],
            "attha": [src("abh03a_att", (430, 1523))],
            "tika": [src("abh03t_tik", (201, 864))],
            "anutika": [src("abh05t_nrf", (213, 909))],
        },
    },
    {
        "id": "yamaka",
        "title": "Yamaka",
        "group": "abhidhamma",
        "parts": {
            "mula": [src("abh03m4_mul"), src("abh03m5_mul"), src("abh03m6_mul")],
            "attha": [src("abh03a_att", (1524, 1765))],
            "tika": [src("abh03t_tik", (865, 1058))],
            "anutika": [src("abh05t_nrf", (910, 1131))],
        },
    },
    {
        "id": "patthana",
        "title": "Paṭṭhāna",
        "group": "abhidhamma",
        "parts": {
            "mula": [
                src("abh03m7_mul"), src("abh03m8_mul"), src("abh03m9_mul"),
                src("abh03m10_mul"), src("abh03m11_mul"),
            ],
            "attha": [src("abh03a_att", (1766, 2421))],
            "tika": [src("abh03t_tik", (1059, 1456))],
            "anutika": [src("abh05t_nrf", (1132, 1502))],
        },
    },
    {
        "id": "abhidhammavatara",
        "title": "Abhidhammāvatāra",
        "group": "outros",
        "parts": {
            "mula": [src("abh06t_nrf")],
            "tika": [src("abh08t_nrf")],
        },
    },
    {
        "id": "abhidhammatthasangaha",
        "title": "Abhidhammatthasaṅgaha",
        "group": "outros",
        "parts": {
            "mula": [src("abh07t_nrf")],
        },
    },
    {
        "id": "abhidhammamatika",
        "title": "Abhidhammamātikāpāḷi",
        "group": "outros",
        "parts": {
            "mula": [src("abh09t_nrf")],
        },
    },
    {
        "id": "visuddhimagga",
        "title": "Visuddhimagga",
        "group": "visuddhimagga",
        "parts": {
            "mula": [src("e0101n_mul"), src("e0102n_mul")],
            "tika": [src("e0103n_att"), src("e0104n_att")],
            "nidanakatha": [src("e0105n_nrf")],
        },
    },
]

PART_LABELS = {
    "mula": "Mūla",
    "attha": "Aṭṭhakathā",
    "tika": "Ṭīkā",
    "anutika": "Anuṭīkā",
    "nidanakatha": "Nidānakathā",
}

# ---------------------------------------------------------------------------
# Limpeza do pseudo-XML (so o campo pali_text tem marcacao; as traducoes sao
# texto puro).
# ---------------------------------------------------------------------------

TAG_P = re.compile(r'^<p rend="([^"]*)"[^>]*>(.*)</p>\s*$', re.DOTALL)
TAG_PARANUM = re.compile(r'<hi rend="(?:paranum|dot)">.*?</hi>')
TAG_BOLD = re.compile(r'<hi rend="bold">(.*?)</hi>', re.DOTALL)
TAG_PB = re.compile(r'<pb[^>]*/?>')
TAG_NOTE = re.compile(r'<note>(.*?)</note>', re.DOTALL)


def clean_pali(raw):
    if not raw:
        return "", []
    m = TAG_P.match(raw.strip())
    body = m.group(2) if m else raw
    body = TAG_PARANUM.sub("", body)
    body = TAG_PB.sub("", body)

    notes = []

    def _note(match):
        notes.append(match.group(1).strip())
        idx = len(notes)
        return f'<sup class="var-note" data-note="{idx - 1}">[{idx}]</sup>'

    body = TAG_NOTE.sub(_note, body)
    body = TAG_BOLD.sub(r"<b>\1</b>", body)
    body = re.sub(r"[ \t]{2,}", " ", body)
    return body.strip(), notes


# ---------------------------------------------------------------------------
# Leitura dos bancos
# ---------------------------------------------------------------------------

def open_conns():
    return {lang: sqlite3.connect(str(path)) for lang, (path, _col) in DBS.items()}


def fetch_table(conns, table, id_range=None):
    where = ""
    params = ()
    if id_range:
        where = "WHERE id BETWEEN ? AND ?"
        params = id_range

    cur = conns["pali"].cursor()
    cur.execute(f'SELECT id, rend, paranum, pali_text FROM "{table}" {where} ORDER BY id', params)
    pali_rows = cur.fetchall()

    translations = {}
    for lang in ("en", "pt", "es"):
        _path, col = DBS[lang]
        c = conns[lang].cursor()
        c.execute(f'SELECT id, "{col}" FROM "{table}" {where} ORDER BY id', params)
        translations[lang] = dict(c.fetchall())

    segments = []
    for row_id, rend_raw, paranum, pali_raw in pali_rows:
        pali_clean, notes = clean_pali(pali_raw)
        rend = rend_raw or "bodytext"
        en_t = (translations["en"].get(row_id) or "").strip()
        pt_t = (translations["pt"].get(row_id) or "").strip()
        es_t = (translations["es"].get(row_id) or "").strip()
        if not pali_clean and not (en_t or pt_t or es_t):
            continue
        seg = {
            "id": row_id,
            "rend": rend,
            "paranum": paranum or None,
            "pali": pali_clean,
            "en": en_t,
            "pt": pt_t,
            "es": es_t,
        }
        if notes:
            seg["notes"] = notes
        segments.append(seg)
    return segments


HEADING_RENDS = {"book", "nikaya", "title", "chapter", "subhead", "subsubhead"}


def build_toc(segments):
    """Extrai uma mini tabela de conteudo (capitulos) a partir dos headings."""
    toc = []
    for seg in segments:
        if seg["rend"] in ("chapter", "subhead") and seg["pali"]:
            plain = re.sub(r"<[^>]+>", "", seg["pali"]).strip()
            if plain:
                toc.append({"id": seg["id"], "rend": seg["rend"], "text": plain})
    return toc


def chunk_segments(segments):
    if len(segments) <= CHUNK_SIZE:
        return [segments]
    chunks = []
    current = []
    for seg in segments:
        if len(current) >= CHUNK_SIZE and seg["rend"] in ("chapter", "book", "subhead"):
            chunks.append(current)
            current = []
        current.append(seg)
    if current:
        chunks.append(current)
    return chunks


def main():
    conns = open_conns()
    manifest = {"groups": {}}

    for work in WORKS:
        group = work["group"]
        manifest["groups"].setdefault(group, [])
        work_out = {
            "id": work["id"],
            "title": work["title"],
            "parts": {},
        }
        work_dir = OUT_DIR / work["id"]
        work_dir.mkdir(parents=True, exist_ok=True)

        for part_key, sources in work["parts"].items():
            all_segments = []
            for s in sources:
                all_segments.extend(fetch_table(conns, s["table"], s["id_range"]))

            toc = build_toc(all_segments)
            chunks = chunk_segments(all_segments)

            files = []
            for i, chunk in enumerate(chunks):
                fname = f"{part_key}__{i}.json" if len(chunks) > 1 else f"{part_key}.json"
                (work_dir / fname).write_text(
                    json.dumps(chunk, ensure_ascii=False, separators=(",", ":")),
                    encoding="utf-8",
                )
                files.append(fname)

            work_out["parts"][part_key] = {
                "label": PART_LABELS[part_key],
                "files": files,
                "toc": toc,
                "count": len(all_segments),
            }
            print(f"{work['id']}/{part_key}: {len(all_segments)} segmentos em {len(files)} arquivo(s)")

        manifest["groups"][group].append(work_out)
        (work_dir / "index.json").write_text(
            json.dumps(work_out, ensure_ascii=False, indent=None), encoding="utf-8"
        )

    (ROOT / "data" / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=None), encoding="utf-8"
    )
    print("\nmanifest.json gerado.")


if __name__ == "__main__":
    main()
