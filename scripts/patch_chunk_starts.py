#!/usr/bin/env python3
"""Sync chunkStarts, count, and exact TOC chunk indices for all WorkParts in manifest.json."""
import json
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE, "data")
WORKS_DIR = os.path.join(DATA_DIR, "works")
MANIFEST = os.path.join(DATA_DIR, "manifest.json")
TAG_RE = re.compile(r"<[^>]+>")


def strip_text(s: str) -> str:
    return re.sub(r"\s+", " ", TAG_RE.sub("", s or "")).strip()


with open(MANIFEST, encoding="utf-8") as f:
    manifest = json.load(f)

updated = 0
toc_matched = 0
toc_unmatched = 0

for group_works in manifest["groups"].values():
    for work in group_works:
        work_dir = os.path.join(WORKS_DIR, work["id"])
        for part in work["parts"].values():
            starts = []
            total_count = 0
            # Build ordered list of (chunk_idx, seg_id, seg_rend, clean_pali)
            ordered_segs = []
            for c_idx, fname in enumerate(part["files"]):
                path = os.path.join(work_dir, fname)
                with open(path, encoding="utf-8") as cf:
                    segs = json.load(cf)
                total_count += len(segs)
                if segs:
                    starts.append(segs[0]["id"])
                for seg in segs:
                    ordered_segs.append((c_idx, seg["id"], seg.get("rend", ""), strip_text(seg.get("pali", ""))))

            part["chunkStarts"] = starts
            part["count"] = total_count

            # Match each TOC entry sequentially so multi-volume works with reset IDs (Yamaka, Paṭṭhāna)
            # resolve to their exact chunk index.
            cursor = 0
            for entry in part.get("toc", []):
                tid = entry["id"]
                ttext = strip_text(entry.get("text", ""))
                found_idx = None
                # Pass 1: exact id + matching text from cursor onward
                for i in range(cursor, len(ordered_segs)):
                    c_idx, sid, _rend, stext = ordered_segs[i]
                    if sid == tid and (not ttext or stext == ttext or ttext in stext or stext in ttext):
                        found_idx = i
                        break
                # Pass 2: exact id from cursor onward
                if found_idx is None:
                    for i in range(cursor, len(ordered_segs)):
                        if ordered_segs[i][1] == tid:
                            found_idx = i
                            break
                # Pass 3: exact id + matching text anywhere
                if found_idx is None:
                    for i, (_c_idx, sid, _rend, stext) in enumerate(ordered_segs):
                        if sid == tid and (not ttext or stext == ttext or ttext in stext):
                            found_idx = i
                            break
                if found_idx is not None:
                    entry["chunk"] = ordered_segs[found_idx][0]
                    cursor = found_idx + 1
                    toc_matched += 1
                else:
                    toc_unmatched += 1
            updated += 1

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"Patched {updated} parts; TOC entries matched={toc_matched}, unmatched={toc_unmatched}")
