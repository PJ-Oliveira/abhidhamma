#!/usr/bin/env python3
"""Add chunkStarts (first segment ID of each chunk file) to all WorkParts in manifest.json."""
import json, os, re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE, "data")
WORKS_DIR = os.path.join(DATA_DIR, "works")
MANIFEST = os.path.join(DATA_DIR, "manifest.json")


def read_first_id(path: str) -> int:
    """Read the first segment id without loading the entire file."""
    with open(path, encoding="utf-8") as f:
        head = f.read(512)
    m = re.search(r'"id"\s*:\s*(\d+)', head)
    if m:
        return int(m.group(1))
    with open(path, encoding="utf-8") as f:
        return json.load(f)[0]["id"]


with open(MANIFEST, encoding="utf-8") as f:
    manifest = json.load(f)

updated = 0
for group_works in manifest["groups"].values():
    for work in group_works:
        work_dir = os.path.join(WORKS_DIR, work["id"])
        for part in work["parts"].values():
            starts = []
            for fname in part["files"]:
                path = os.path.join(work_dir, fname)
                starts.append(read_first_id(path))
            part["chunkStarts"] = starts
            updated += 1

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, separators=(",", ":"))

print(f"Patched {updated} parts with chunkStarts in manifest.json")
