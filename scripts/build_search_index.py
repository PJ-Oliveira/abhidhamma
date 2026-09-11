"""Builds a compact client-side inverted search index over all extracted
Abhidhamma segments (Pāli + EN/PT/ES translations).

Reads data/manifest.json + data/works/*/*.json (produced by extract_data.py)
and writes one shard per token-initial under data/search/shard_<key>.json,
plus data/search/manifest.json listing the shard keys. Sharding lets the
browser fetch only the slice of the index it needs for a given query
instead of one huge blob.

Each shard is {"postings": {token: [segIdx, ...]}, "segments": [posting, ...]}
where postings reference segments by index to avoid repeating the same
{workId, partKey, chunk, segId, snippet} object once per matching token.
"""
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
WORKS_DIR = DATA_DIR / "works"
OUT_DIR = DATA_DIR / "search"

TAG_RE = re.compile(r"<[^>]+>")
TOKEN_RE = re.compile(r"[^\W\d_]+", re.UNICODE)
MAX_POSTINGS_PER_TOKEN = 50
MIN_TOKEN_LEN = 3
SNIPPET_LEN = 90


def plain_text(html_or_text):
    if not html_or_text:
        return ""
    return TAG_RE.sub("", html_or_text)


def make_snippet(seg):
    pali = plain_text(seg.get("pali"))
    if pali:
        return pali[:SNIPPET_LEN]
    for lang in ("pt", "en", "es"):
        text = seg.get(lang)
        if text:
            return text[:SNIPPET_LEN]
    return ""


def tokens_of(seg):
    parts = [plain_text(seg.get("pali"))]
    for lang in ("en", "pt", "es"):
        parts.append(seg.get(lang) or "")
    text = " ".join(parts).lower()
    return {tok for tok in TOKEN_RE.findall(text) if len(tok) >= MIN_TOKEN_LEN}


def shard_key(token):
    ch = token[0]
    return ch if ch.isalpha() else "misc"


def main():
    manifest = json.loads((DATA_DIR / "manifest.json").read_text(encoding="utf-8"))

    # shard_key -> token -> list[int] (indices into that shard's segments list)
    shard_postings = defaultdict(lambda: defaultdict(list))
    # shard_key -> list[posting dict]
    shard_segments = defaultdict(list)
    # shard_key -> {posting-identity-tuple: segment index} for dedup within shard
    shard_seg_index = defaultdict(dict)
    capped_tokens = set()
    total_segments = 0

    for group_works in manifest["groups"].values():
        for work in group_works:
            work_id = work["id"]
            for part_key, part in work["parts"].items():
                for chunk_idx, file_name in enumerate(part["files"]):
                    chunk_path = WORKS_DIR / work_id / file_name
                    segments = json.loads(chunk_path.read_text(encoding="utf-8"))
                    for seg in segments:
                        total_segments += 1
                        snippet = make_snippet(seg)
                        if not snippet:
                            continue
                        identity = (work_id, part_key, chunk_idx, seg["id"])
                        for tok in tokens_of(seg):
                            key = shard_key(tok)
                            if (key, tok) in capped_tokens:
                                continue
                            seg_index = shard_seg_index[key].get(identity)
                            if seg_index is None:
                                seg_index = len(shard_segments[key])
                                shard_segments[key].append(
                                    {
                                        "workId": work_id,
                                        "partKey": part_key,
                                        "chunk": chunk_idx,
                                        "segId": seg["id"],
                                        "snippet": snippet,
                                    }
                                )
                                shard_seg_index[key][identity] = seg_index
                            bucket = shard_postings[key][tok]
                            if seg_index not in bucket:
                                bucket.append(seg_index)
                            if len(bucket) >= MAX_POSTINGS_PER_TOKEN:
                                capped_tokens.add((key, tok))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    shard_files = {}
    total_tokens = 0
    for key in sorted(shard_postings):
        payload = {
            "postings": shard_postings[key],
            "segments": shard_segments[key],
        }
        out_path = OUT_DIR / f"shard_{key}.json"
        out_path.write_text(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        shard_files[key] = out_path.name
        total_tokens += len(shard_postings[key])

    (OUT_DIR / "manifest.json").write_text(
        json.dumps({"shards": shard_files}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"{total_segments} segmentos processados")
    print(f"{total_tokens} tokens indexados em {len(shard_files)} fragmentos ({len(capped_tokens)} tokens atingiram o teto de {MAX_POSTINGS_PER_TOKEN})")
    total_size = sum((OUT_DIR / f).stat().st_size for f in shard_files.values())
    print(f"Tamanho total dos fragmentos: {total_size / 1_000_000:.1f} MB")


if __name__ == "__main__":
    main()
