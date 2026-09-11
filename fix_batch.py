import json
import sys

def get_leaks():
    return [
        ("abhidhamma-in-daily-life/texto__0.json", 18),
        ("abhidhamma-in-daily-life/texto__0.json", 704),
        ("abhidhammamatika/mula__1.json", 1796),
        ("abhidhammamatika/mula__2.json", 2303),
        ("abhidhammavatara/tika__2.json", 2118),
        ("abhidhammavatara/tika__2.json", 2206),
        ("buddhism-in-daily-life/texto__17.json", 298),
        ("dhammasangani/anutika.json", 46),
        ("kathavatthu/anutika.json", 246),
        ("path-without-ownership/texto.json", 21),
        ("path-without-ownership/texto.json", 119),
        ("path-without-ownership/texto.json", 579),
        ("path-without-ownership/texto.json", 630),
        ("path-without-ownership/texto.json", 631),
        ("patthana/anutika.json", 1164),
        ("the-buddhist-teaching-on-physical-phenomena/texto.json", 28),
        ("the-conditionality-of-life/texto__0.json", 37),
        ("vibhanga/attha__0.json", 568),
        ("vibhanga/attha__1.json", 1421),
        ("vibhanga/tika__0.json", 68),
        ("vibhanga/tika__0.json", 258),
        ("vibhanga/tika__1.json", 1308),
        ("vibhanga/tika__2.json", 1969),
        ("visuddhimagga/mula__0.json", 554),
        ("visuddhimagga/mula__2.json", 20),
        ("visuddhimagga/mula__2.json", 494),
        ("visuddhimagga/mula__3.json", 1484),
        ("visuddhimagga/tika__1.json", 16),
        ("visuddhimagga/tika__3.json", 1201),
        ("visuddhimagga/tika__3.json", 1646)
    ]

def print_leaks(start, end):
    leaks = get_leaks()[start:end]
    for path, seg_id in leaks:
        full_path = f"data/works/{path}"
        try:
            with open(full_path, "r") as f:
                data = json.load(f)
            for seg in data:
                if str(seg["id"]) == str(seg_id):
                    print(f"\n--- {full_path} ID: {seg_id} ---")
                    print(f"EN: {seg.get('en', '')}")
                    print(f"PALI: {seg.get('pali', '')}")
                    print(f"PT (Broken): {seg.get('pt', '')}")
        except Exception as e:
            print(f"Error {path}: {e}")

if __name__ == "__main__":
    s = int(sys.argv[1])
    e = int(sys.argv[2])
    print_leaks(s, e)
