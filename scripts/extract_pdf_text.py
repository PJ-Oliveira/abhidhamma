#!/usr/bin/env python3
"""Extract text from PDF files using ghostscript and parse into structured paragraphs."""
import subprocess, re, json, os, sys, tempfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = BASE
OUT_DIR = os.path.join(BASE, "scripts", "extracted")
os.makedirs(OUT_DIR, exist_ok=True)

BOOKS = [
    {"id": "buddhism-in-daily-life",                    "pdf": "Buddhism-in-Daily-Life.pdf",                    "title": "Buddhism in Daily Life",                    "author": "Nina van Gorkom"},
    {"id": "the-buddhas-path",                           "pdf": "The-Buddhas-Path.pdf",                          "title": "The Buddha's Path",                         "author": "Nina van Gorkom"},
    {"id": "introduction-to-the-abhidhamma",             "pdf": "Introduction-to-the-Abhidhamma.pdf",            "title": "Introduction to the Abhidhamma",            "author": "Nina van Gorkom"},
    {"id": "the-conditionality-of-life",                 "pdf": "The-Conditionality-of-Life.pdf",                "title": "The Conditionality of Life",                "author": "Nina van Gorkom"},
    {"id": "the-buddhist-teaching-on-physical-phenomena","pdf": "The-Buddhist-Teaching-on-Physical-Phenomena.pdf","title": "The Buddhist Teaching on Physical Phenomena","author": "Nina van Gorkom"},
    {"id": "path-without-ownership",                     "pdf": "path-without-ownership.pdf",                   "title": "Path Without Ownership",                    "author": "Rob Kirkpatrick"},
]

# Patterns to identify and strip
PAGE_NUM_RE      = re.compile(r'^\s*\d+\s*$')
HEADER_FOOTER_RE = re.compile(r'^\s*(Buddhism in Daily Life|The Buddha\'?s? Path|Introduction to the Abhidhamma|The Conditionality of Life|The Buddhist Teaching|Path [Ww]ithout Ownership|Nina van Gorkom|Rob Kirkpatrick|Zolag \d+)\s*$', re.I)

# Chapter heading patterns
CHAPTER_NUM_RE   = re.compile(r'^\s*(\d{1,2})\s+([A-Z][^\n]{2,80})\s*$')
PREFACE_RE       = re.compile(r'^\s*(Preface|Foreword|Introduction|Conclusion|Glossary|Bibliography|Notes|References|Appendix.*|Questions?)\s*$', re.I)
AUTHOR_LINE_RE   = re.compile(r'^\s*(Nina van Gorkom|Rob Kirkpatrick)\s*$', re.I)
BOOK_TITLE_RE    = re.compile(r'^\s*(Buddhism in Daily Life|The Buddha\'?s? Path|Introduction to the Abhidhamma|The Conditionality of Life|The Buddhist Teaching on Physical Phenomena|Path [Ww]ithout Ownership)\s*$', re.I)

def extract_raw(pdf_path: str) -> str:
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as tmp:
        tmp_path = tmp.name
    subprocess.run([
        "gs", "-dNOPAUSE", "-dBATCH", "-sDEVICE=txtwrite",
        f"-sOutputFile={tmp_path}", pdf_path
    ], capture_output=True)
    with open(tmp_path, encoding="utf-8", errors="replace") as f:
        text = f.read()
    os.unlink(tmp_path)
    return text

def clean_lines(raw: str) -> list[str]:
    lines = raw.splitlines()
    cleaned = []
    for line in lines:
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

def lines_to_paragraphs(lines: list[str]) -> list[dict]:
    """Merge lines into paragraphs, identifying headings."""
    paragraphs = []
    current_lines = []

    def flush():
        if not current_lines:
            return
        text = " ".join(l for l in current_lines if l)
        text = re.sub(r'\s+', ' ', text).strip()
        if text:
            paragraphs.append(text)
        current_lines.clear()

    i = 0
    while i < len(lines):
        line = lines[i]
        if line == "":
            flush()
        else:
            current_lines.append(line)
        i += 1
    flush()
    return paragraphs

def classify_paragraph(para: str) -> str:
    """Return rend: book / chapter / subhead / bodytext."""
    if BOOK_TITLE_RE.match(para):
        return "book"
    if AUTHOR_LINE_RE.match(para):
        return "subhead"
    if CHAPTER_NUM_RE.match(para):
        return "chapter"
    if PREFACE_RE.match(para):
        return "chapter"
    # Short lines that look like headings (under 60 chars, title case, no period)
    if len(para) <= 80 and not para.endswith('.') and re.match(r'^[A-Z\d"\'(]', para) and para.isupper() == False:
        words = para.split()
        if 1 <= len(words) <= 10:
            # Check it's not a sentence fragment
            if not re.search(r'\b(is|are|was|were|has|have|the|and|of|in|to|a)\b', para.lower()):
                return "subhead"
    return "bodytext"

def structure_book(paragraphs: list[str], book: dict) -> list[dict]:
    """Convert paragraphs to segment records with classification."""
    segments = []
    seg_id = 1

    # Always start with book title
    segments.append({"id": seg_id, "rend": "book", "paranum": None,
                      "pali": book["title"], "pt": "", "en": "", "es": ""})
    seg_id += 1
    segments.append({"id": seg_id, "rend": "subhead", "paranum": None,
                      "pali": book["author"], "pt": book["author"], "en": "", "es": ""})
    seg_id += 1

    seen_first_chapter = False
    for para in paragraphs:
        # Skip title page noise
        if BOOK_TITLE_RE.match(para):
            continue
        if AUTHOR_LINE_RE.match(para):
            continue
        # Skip copyright/ISBN/license boilerplate
        if re.search(r'(ISBN|copyright|Creative Commons|Zolag|Lulu|Printed|www\.)', para, re.I):
            continue
        if re.match(r'\$Id:', para):
            continue

        rend = classify_paragraph(para)

        # Skip table of contents (before first real chapter)
        if not seen_first_chapter and rend in ("chapter",):
            seen_first_chapter = True
        elif not seen_first_chapter and rend == "bodytext":
            # Allow preface bodytext even before chapter
            pass

        segments.append({"id": seg_id, "rend": rend, "paranum": None,
                         "pali": para, "pt": "", "en": "", "es": ""})
        seg_id += 1

    return segments

def process_book(book: dict):
    pdf_path = os.path.join(PDF_DIR, book["pdf"])
    print(f"Extracting: {book['pdf']}...", flush=True)
    raw = extract_raw(pdf_path)
    lines = clean_lines(raw)
    paragraphs = lines_to_paragraphs(lines)
    segments = structure_book(paragraphs, book)
    out_path = os.path.join(OUT_DIR, f"{book['id']}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)
    print(f"  -> {len(segments)} segments saved to {out_path}", flush=True)
    return segments

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    for book in BOOKS:
        if target and book["id"] != target:
            continue
        process_book(book)
    print("Done.")
