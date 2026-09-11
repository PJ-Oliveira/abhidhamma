import json, re, collections, glob, os

WORKS_DIR = "data/works"
TAG_RE = re.compile(r"</?[a-zA-Z][^>]*>")
TOKEN_RE = re.compile(r"[^\W\d_]+", re.UNICODE)

counter = collections.Counter()
files = sorted(glob.glob(os.path.join(WORKS_DIR, "**", "*.json"), recursive=True))
print(f"scanning {len(files)} chunk files under {WORKS_DIR}")

for fp in files:
    if os.path.basename(fp) == "index.json":
        continue
    with open(fp, encoding="utf-8") as f:
        segs = json.load(f)
    for seg in segs:
        pali = TAG_RE.sub(" ", seg.get("pali") or "")
        for tok in TOKEN_RE.findall(pali):
            counter[tok.lower()] += 1

print(f"total distinct surface forms: {len(counter)}")
print(f"total token occurrences: {sum(counter.values())}")

top = counter.most_common(600)
with open("pali_word_freq.tsv", "w", encoding="utf-8") as out:
    for w, c in top:
        out.write(f"{w}\t{c}\n")
print("wrote top 600 to pali_word_freq.tsv")
for w, c in top[:60]:
    print(f"{c:6d}  {w}")
