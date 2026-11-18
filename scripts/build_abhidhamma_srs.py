#!/usr/bin/env python3
"""Builds and strictly validates data/srs/abhidhamma_cards.json."""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from srs_chapters import (
    ch0_paramattha,
    ch1_citta,
    ch2_cetasika,
    ch3_pakinnaka,
    ch4_vithi,
    ch5_vithimutta,
    ch6_rupa_nibbana,
    ch7_samuccaya,
    ch8_paccaya,
    ch9_kammatthana,
    extra_memory_cards,
)

MODULES = [
    ch0_paramattha,
    ch1_citta,
    ch2_cetasika,
    ch3_pakinnaka,
    ch4_vithi,
    ch5_vithimutta,
    ch6_rupa_nibbana,
    ch7_samuccaya,
    ch8_paccaya,
    ch9_kammatthana,
]

LANGS = ("pt", "en", "es")


def validate_localized(obj, label: str):
    if not isinstance(obj, dict):
        raise ValueError(f"{label} must be dict")
    for lang in LANGS:
        val = obj.get(lang)
        if not isinstance(val, str) or not val.strip():
            raise ValueError(f"{label}.{lang} missing or empty")


def validate_dataset(chapters, cards):
    chapter_nums = [c["chapter"] for c in chapters]
    if chapter_nums != list(range(len(chapters))):
        raise ValueError(f"Chapters not sequential 0..N-1: {chapter_nums}")

    by_id = {}
    for card in cards:
        cid = card["id"]
        if cid in by_id:
            raise ValueError(f"Duplicate card ID: {cid}")
        if isinstance(card["paliTerm"], str):
            card["paliTerm"] = {lang: card["paliTerm"] for lang in LANGS}
        by_id[cid] = card
        validate_localized(card["paliTerm"], f"{cid}.paliTerm")
        validate_localized(card["categoryLabel"], f"{cid}.categoryLabel")
        validate_localized(card["prompt"], f"{cid}.prompt")
        validate_localized(card["answer"], f"{cid}.answer")
        if "mechanics" in card:
            validate_localized(card["mechanics"], f"{cid}.mechanics")
        if "mathStructure" in card:
            validate_localized(card["mathStructure"], f"{cid}.mathStructure")
        if "characteristics" in card:
            for k, v in card["characteristics"].items():
                validate_localized(v, f"{cid}.characteristics.{k}")
        if "checklist" in card:
            for idx, item in enumerate(card["checklist"]):
                validate_localized(item, f"{cid}.checklist[{idx}]")
        if "sequenceItems" in card:
            for idx, item in enumerate(card["sequenceItems"]):
                validate_localized(item, f"{cid}.sequenceItems[{idx}]")

        # Guard against Portuguese leaks in EN/ES
        en_leaks = re.findall(
            r"\b(não|são|estão|com|para|dos|das|nos|nas|sobre|através|apenas|além|enquanto|também|mesmo|outra|outro|quando|entre|porque|pois|então|assim|como|cada|toda|todo|todos|todas|sempre|nunca|pode|podem|possui|possuem|operação|condição|consciência|sensação|visão|ilusão|ódio|avidez|inquietação|preguiça|remorso|dúvida|compaixão|sabedoria|matéria|realidade|religação|advertência|impulsão|determinação|investigação|recepção|nascimento|morte|envelhecimento|apego|desejo|ignorância)\b",
            " ".join([card["paliTerm"]["en"], card["categoryLabel"]["en"], card["prompt"]["en"], card["answer"]["en"]]),
            re.I,
        )
        if en_leaks:
            raise ValueError(f"Portuguese leak in EN for {cid}: {en_leaks}")

    # Validate DAG & chapter ordering
    visiting = set()
    visited = set()

    def dfs(cid):
        if cid in visited:
            return
        if cid in visiting:
            raise ValueError(f"Cycle detected in requires at {cid}")
        visiting.add(cid)
        c = by_id[cid]
        for req in c["requires"]:
            if req not in by_id:
                raise ValueError(f"Missing prerequisite {req} in {cid}")
            if by_id[req]["chapter"] > c["chapter"]:
                raise ValueError(f"Prerequisite {req} in later chapter than {cid}")
            dfs(req)
        visiting.remove(cid)
        visited.add(cid)

    for cid in by_id:
        dfs(cid)

    # Exact canonical coverage assertions
    cittas = [c for c in cards if re.match(r"^c1\.citta_\d+$", c["id"])]
    cetasikas = [c for c in cards if re.match(r"^c2\.cet_\d+$", c["id"])]
    rupas = [c for c in cards if re.match(r"^c6\.rupa_\d+$", c["id"])]
    hetus = [c for c in cards if re.match(r"^c3\.hetu_\d+$", c["id"])]
    kiccas = [c for c in cards if re.match(r"^c3\.kicca_\d+$", c["id"])]
    dvaras = [c for c in cards if re.match(r"^c3\.dvara_\d+$", c["id"])]
    arammanas = [c for c in cards if re.match(r"^c3\.arammana_\d+$", c["id"])]
    vatthus = [c for c in cards if re.match(r"^c3\.vatthu_\d+$", c["id"])]
    nidanas = [c for c in cards if re.match(r"^c8\.ps_\d+$", c["id"])]
    patthana = [c for c in cards if re.match(r"^c8\.pat_\d+$", c["id"])]
    nibbana = [c for c in cards if re.match(r"^c6\.nibbana_\d+", c["id"])]

    assert len(cittas) == 89, f"Expected 89 cittas, got {len(cittas)}"
    assert len(cetasikas) == 52, f"Expected 52 cetasikas, got {len(cetasikas)}"
    assert len(rupas) == 28, f"Expected 28 rupas, got {len(rupas)}"
    assert len(hetus) == 6, f"Expected 6 hetus, got {len(hetus)}"
    assert len(kiccas) == 14, f"Expected 14 kiccas, got {len(kiccas)}"
    assert len(dvaras) == 6, f"Expected 6 dvaras, got {len(dvaras)}"
    assert len(arammanas) == 6, f"Expected 6 arammanas, got {len(arammanas)}"
    assert len(vatthus) == 6, f"Expected 6 vatthus, got {len(vatthus)}"
    assert len(nidanas) == 12, f"Expected 12 nidanas, got {len(nidanas)}"
    assert len(patthana) == 24, f"Expected 24 patthana conditions, got {len(patthana)}"
    assert len(nibbana) >= 4, f"Expected >= 4 nibbana cards, got {len(nibbana)}"

    for ch in chapters:
        ch_cards = [c for c in cards if c["chapter"] == ch["chapter"]]
        atoms = [c for c in ch_cards if c["tier"] == "atom"]
        houses = [c for c in ch_cards if c["tier"] == "house"]
        assert len(atoms) >= 1, f"Chapter {ch['chapter']} missing atom cards"
        assert len(houses) >= 1, f"Chapter {ch['chapter']} missing house cards"


def main():
    chapters = [m.CHAPTER_META for m in MODULES]
    cards = []
    for m in MODULES:
        cards.extend(m.build_cards())
    cards.extend(extra_memory_cards.build_cards())
    extra_memory_cards.attach_math_structures(cards)

    validate_dataset(chapters, cards)

    out_path = ROOT / "data" / "srs" / "abhidhamma_cards.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": 1,
        "chapters": chapters,
        "cards": cards,
    }
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Generated {out_path} successfully:")
    print(f"  Chapters: {len(chapters)}")
    print(f"  Total Cards: {len(cards)}")
    for ch in chapters:
        ch_cards = [c for c in cards if c["chapter"] == ch["chapter"]]
        a = sum(1 for c in ch_cards if c["tier"] == "atom")
        s = sum(1 for c in ch_cards if c["tier"] == "structure")
        h = sum(1 for c in ch_cards if c["tier"] == "house")
        print(f"    Ch.{ch['chapter']} ({ch['paliTitle']}): {len(ch_cards)} total (atom={a}, structure={s}, house={h})")


if __name__ == "__main__":
    main()
