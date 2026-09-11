#!/usr/bin/env python3
"""
integrate_books.py — Full pipeline for 6 Nina van Gorkom books.

Steps:
  1. Extract text from PDFs using pdftotext (poppler) or PyMuPDF fallback
  2. For books already extracted, load them
  3. Write data/works/{id}/ with texto__N.json chunks + index.json
  4. Patch data/manifest.json to include the new works under "comentarios"
  5. Print summary

Usage:
  python3 scripts/integrate_books.py           # all books
  python3 scripts/integrate_books.py buddhism  # single book by id prefix

Requirements (choose one):
  brew install poppler      # provides pdftotext (recommended)
  pip install PyMuPDF       # fallback if poppler not available
"""

import subprocess, re, json, os, sys

BASE    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = BASE
EXT_DIR = os.path.join(BASE, "scripts", "extracted")
DAT_DIR = os.path.join(BASE, "data", "works")
MAN     = os.path.join(BASE, "data", "manifest.json")

os.makedirs(EXT_DIR, exist_ok=True)

CHUNK_SIZE = 900  # same as main corpus

# ──────────────────────────────────────────────
# Book registry
# ──────────────────────────────────────────────
BOOKS = [
    {
        "id":       "buddhism-in-daily-life",
        "pdf":      "Buddhism-in-Daily-Life.pdf",
        "title":    "Buddhism in Daily Life",
        "pt_title": "O Budismo na Vida Diária",
        "author":   "Nina van Gorkom",
    },
    {
        "id":       "the-buddhas-path",
        "pdf":      "The-Buddhas-Path.pdf",
        "title":    "The Buddha's Path",
        "pt_title": "O Caminho do Buda",
        "author":   "Nina van Gorkom",
    },
    {
        "id":       "introduction-to-the-abhidhamma",
        "pdf":      "Introduction-to-the-Abhidhamma.pdf",
        "title":    "Introduction to the Abhidhamma",
        "pt_title": "Introdução ao Abhidhamma",
        "author":   "Nina van Gorkom",
    },
    {
        "id":       "the-conditionality-of-life",
        "pdf":      "The-Conditionality-of-Life.pdf",
        "title":    "The Conditionality of Life",
        "pt_title": "A Condicionalidade da Vida",
        "author":   "Nina van Gorkom",
    },
    {
        "id":       "the-buddhist-teaching-on-physical-phenomena",
        "pdf":      "The-Buddhist-Teaching-on-Physical-Phenomena.pdf",
        "title":    "The Buddhist Teaching on Physical Phenomena",
        "pt_title": "O Ensinamento Budista sobre os Fenômenos Físicos",
        "author":   "Nina van Gorkom",
    },
    {
        "id":       "path-without-ownership",
        "pdf":      "path-without-ownership.pdf",
        "title":    "Path Without Ownership",
        "pt_title": "Caminho Sem Apropriação",
        "author":   "Rob Kirkpatrick",
    },
]

# ──────────────────────────────────────────────
# Regex filters
# ──────────────────────────────────────────────
PAGE_NUM_RE      = re.compile(r'^\s*\d+\s*$')
HEADER_FOOTER_RE = re.compile(
    r'^\s*(Buddhism in Daily Life|The Buddha\'?s? Path|Introduction to the Abhidhamma'
    r'|The Conditionality of Life|The Buddhist Teaching|Path [Ww]ithout Ownership'
    r'|Nina van Gorkom|Rob Kirkpatrick|Zolag \d+)\s*$', re.I)
CHAPTER_NUM_RE   = re.compile(r'^\s*(\d{1,2})\s+([A-Z][^\n]{2,80})\s*$')
PREFACE_RE       = re.compile(
    r'^\s*(Preface|Foreword|Introduction|Conclusion|Glossary'
    r'|Bibliography|Notes|References|Appendix.*|Questions?)\s*$', re.I)
AUTHOR_LINE_RE   = re.compile(r'^\s*(Nina van Gorkom|Rob Kirkpatrick)\s*$', re.I)
BOOK_TITLE_RE    = re.compile(
    r'^\s*(Buddhism in Daily Life|The Buddha\'?s? Path|Introduction to the Abhidhamma'
    r'|The Conditionality of Life|The Buddhist Teaching on Physical Phenomena'
    r'|Path [Ww]ithout Ownership)\s*$', re.I)

# ──────────────────────────────────────────────
# PDF extraction — try multiple methods
# ──────────────────────────────────────────────

def _try_pdftotext(pdf_path: str) -> str | None:
    """Extract via pdftotext (poppler). Returns text or None if unavailable."""
    try:
        result = subprocess.run(
            ["pdftotext", "-layout", pdf_path, "-"],
            capture_output=True, timeout=120
        )
        if result.returncode == 0 and result.stdout:
            text = result.stdout.decode("utf-8", errors="replace")
            if len(text.strip()) > 100:
                return text
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    return None


def _try_pdftotext_simple(pdf_path: str) -> str | None:
    """Extract via pdftotext without -layout flag."""
    try:
        result = subprocess.run(
            ["pdftotext", pdf_path, "-"],
            capture_output=True, timeout=120
        )
        if result.returncode == 0 and result.stdout:
            text = result.stdout.decode("utf-8", errors="replace")
            if len(text.strip()) > 100:
                return text
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    return None


def _try_pymupdf(pdf_path: str) -> str | None:
    """Extract via PyMuPDF (fitz). Returns text or None if unavailable."""
    try:
        import fitz  # type: ignore
        doc  = fitz.open(pdf_path)
        pages = []
        for page in doc:
            pages.append(page.get_text("text"))
        doc.close()
        text = "\n".join(pages)
        if len(text.strip()) > 100:
            return text
    except ImportError:
        pass
    except Exception as e:
        print(f"    [PyMuPDF error] {e}")
    return None


def _try_pdfplumber(pdf_path: str) -> str | None:
    """Extract via pdfplumber. Returns text or None if unavailable."""
    try:
        import pdfplumber  # type: ignore
        pages = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    pages.append(t)
        text = "\n".join(pages)
        if len(text.strip()) > 100:
            return text
    except ImportError:
        pass
    except Exception as e:
        print(f"    [pdfplumber error] {e}")
    return None


def extract_raw(pdf_path: str) -> str:
    """Try extraction methods in order of preference."""
    # 1. pdftotext (poppler) — best quality
    text = _try_pdftotext(pdf_path)
    if text:
        return text

    text = _try_pdftotext_simple(pdf_path)
    if text:
        return text

    # 2. PyMuPDF
    text = _try_pymupdf(pdf_path)
    if text:
        return text

    # 3. pdfplumber
    text = _try_pdfplumber(pdf_path)
    if text:
        return text

    print(f"\n  ⚠️  AVISO: Nenhum método de extração funcionou para {pdf_path}")
    print("     Instale poppler: brew install poppler")
    print("     Ou PyMuPDF:      pip install PyMuPDF")
    return ""


# ──────────────────────────────────────────────
# Text cleaning and structuring
# ──────────────────────────────────────────────

def clean_lines(raw: str) -> list:
    cleaned = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            cleaned.append("")
            continue
        if PAGE_NUM_RE.match(line):
            continue
        if HEADER_FOOTER_RE.match(line):
            continue
        # Remove Table of Contents lines (dots patterns)
        if re.match(r'^.{3,60}\.{4,}', line):
            continue
        cleaned.append(line)
    return cleaned


def lines_to_paragraphs(lines: list) -> list:
    paragraphs = []
    current    = []

    def flush():
        if not current:
            return
        text = " ".join(l for l in current if l)
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            paragraphs.append(text)
        current.clear()

    for line in lines:
        if line == "":
            flush()
        else:
            current.append(line)
    flush()
    return paragraphs


def classify_paragraph(para: str) -> str:
    if BOOK_TITLE_RE.match(para):
        return "book"
    if AUTHOR_LINE_RE.match(para):
        return "subhead"
    if CHAPTER_NUM_RE.match(para):
        return "chapter"
    if PREFACE_RE.match(para):
        return "chapter"
    if len(para) <= 80 and not para.endswith('.') and re.match(r'^[A-Z\d"\'(]', para):
        words = para.split()
        if 1 <= len(words) <= 10:
            if not re.search(r'\b(is|are|was|were|has|have|the|and|of|in|to|a)\b',
                             para.lower()):
                return "subhead"
    return "bodytext"


def extract_book(book: dict) -> list:
    """Extract and structure one PDF into segments."""
    pdf_path = os.path.join(PDF_DIR, book["pdf"])
    ext_path = os.path.join(EXT_DIR, f"{book['id']}.json")

    # Force re-extraction if cached file has only 2 segments (failed extraction)
    if os.path.exists(ext_path):
        with open(ext_path, encoding="utf-8") as f:
            cached = json.load(f)
        if len(cached) > 5:
            print(f"  [cache] {len(cached)} segments from {ext_path}")
            return cached
        else:
            print(f"  [cache stale — {len(cached)} segs] Re-extracting …")

    print(f"  [extract] {book['pdf']} …", end=" ", flush=True)
    raw = extract_raw(pdf_path)

    if not raw.strip():
        print("EMPTY — check PDF extractor installation")
        return [
            {"id": 1, "rend": "book",    "paranum": None,
             "pali": book["title"],  "pt": book["pt_title"], "en": "", "es": ""},
            {"id": 2, "rend": "subhead", "paranum": None,
             "pali": book["author"], "pt": book["author"],   "en": "", "es": ""},
        ]

    lines      = clean_lines(raw)
    paragraphs = lines_to_paragraphs(lines)

    segments = []
    sid = 1

    segments.append({"id": sid, "rend": "book",    "paranum": None,
                     "pali": book["title"],  "pt": book["pt_title"], "en": "", "es": ""})
    sid += 1
    segments.append({"id": sid, "rend": "subhead", "paranum": None,
                     "pali": book["author"], "pt": book["author"],   "en": "", "es": ""})
    sid += 1

    for para in paragraphs:
        if BOOK_TITLE_RE.match(para) or AUTHOR_LINE_RE.match(para):
            continue
        if re.search(r'(ISBN|copyright|Creative Commons|Zolag|Lulu|Printed|www\.)',
                     para, re.I):
            continue
        if re.match(r'\$Id:', para):
            continue

        rend = classify_paragraph(para)
        segments.append({"id": sid, "rend": rend, "paranum": None,
                         "pali": para, "pt": "", "en": "", "es": ""})
        sid += 1

    with open(ext_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    print(f"{len(segments)} segments → {ext_path}")
    return segments


# ──────────────────────────────────────────────
# Chunking and TOC
# ──────────────────────────────────────────────

def chunk_segments(segments: list) -> list:
    if len(segments) <= CHUNK_SIZE:
        return [segments]
    chunks  = []
    current = []
    for seg in segments:
        if len(current) >= CHUNK_SIZE and seg["rend"] in ("chapter", "subhead", "book"):
            chunks.append(current)
            current = []
        current.append(seg)
    if current:
        chunks.append(current)
    return chunks


def build_toc(segments: list) -> list:
    toc = []
    for seg in segments:
        if seg["rend"] in ("chapter", "subhead"):
            text = re.sub(r'<[^>]+>', '', seg["pali"]).strip()
            toc.append({"id": seg["id"], "rend": seg["rend"], "text": text})
    return toc


# ──────────────────────────────────────────────
# Write work to data/works/{id}/
# ──────────────────────────────────────────────

def write_work(book: dict, segments: list) -> dict:
    work_dir = os.path.join(DAT_DIR, book["id"])
    os.makedirs(work_dir, exist_ok=True)

    chunks   = chunk_segments(segments)
    toc      = build_toc(segments)
    part_key = "texto"

    if len(chunks) == 1:
        file_names = [f"{part_key}.json"]
    else:
        file_names = [f"{part_key}__{i}.json" for i in range(len(chunks))]

    chunk_starts = [ch[0]["id"] for ch in chunks]

    for fname, chunk in zip(file_names, chunks):
        out = os.path.join(work_dir, fname)
        with open(out, "w", encoding="utf-8") as f:
            json.dump(chunk, f, ensure_ascii=False, indent=2)
        print(f"    wrote {fname} ({len(chunk)} segs)")

    index = {
        "id":    book["id"],
        "title": book["title"],
        "parts": {
            part_key: {
                "label":       "Text",
                "files":       file_names,
                "toc":         toc,
                "count":       len(segments),
                "chunkStarts": chunk_starts,
            }
        }
    }
    with open(os.path.join(work_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"    index.json ({len(segments)} total segs, {len(chunks)} chunk(s))")
    return index


# ──────────────────────────────────────────────
# Patch manifest.json
# ──────────────────────────────────────────────

def patch_manifest(new_works: list):
    with open(MAN, encoding="utf-8") as f:
        manifest = json.load(f)

    existing_ids = {w["id"] for w in manifest["groups"].get("comentarios", [])}

    for index in new_works:
        work_entry = {
            "id":    index["id"],
            "title": index["title"],
            "parts": {
                pk: {
                    "label":       pd["label"],
                    "files":       pd["files"],
                    "toc":         pd["toc"],
                    "chunkStarts": pd["chunkStarts"],
                }
                for pk, pd in index["parts"].items()
            }
        }
        if index["id"] not in existing_ids:
            manifest["groups"].setdefault("comentarios", []).append(work_entry)
            existing_ids.add(index["id"])
            print(f"  [manifest] Added {index['id']}")
        else:
            for i, w in enumerate(manifest["groups"]["comentarios"]):
                if w["id"] == index["id"]:
                    manifest["groups"]["comentarios"][i] = work_entry
                    print(f"  [manifest] Updated {index['id']}")
                    break

    with open(MAN, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False)
    print(f"  [manifest] {os.path.getsize(MAN):,} bytes")


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    books_to_process = [b for b in BOOKS
                        if target is None or target in b["id"]]
    if not books_to_process:
        print(f"No book matched filter: {target}")
        sys.exit(1)

    new_works = []
    for book in books_to_process:
        print(f"\n=== {book['title']} ===")
        segments = extract_book(book)
        index    = write_work(book, segments)
        new_works.append(index)

    print(f"\n=== Patching manifest ===")
    patch_manifest(new_works)

    print(f"\nDone. {len(books_to_process)} book(s) integrated.")
    print("Next steps:")
    print("  python3 scripts/translate_books.py")
    print("  python3 scripts/build_search_index.py")
    print("  npm run build")


if __name__ == "__main__":
    main()
