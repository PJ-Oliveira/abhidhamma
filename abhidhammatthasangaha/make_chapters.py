import json
import os

source_file = "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/abhidhammatthasangaha/mula__0.json"
dest_dir = "src/data/chapters"

with open(source_file, "r", encoding="utf-8") as f:
    data = json.load(f)

chapters = []
current_chapter_segments = []
chapter_num = 0

for item in data:
    rend = item.get("rend", "")
    pali = item.get("pali", "")
    
    # Check for chapter start
    if rend == "chapter" and "vaṇṇanā" not in pali:
        if current_chapter_segments:
            chapters.append(current_chapter_segments)
        current_chapter_segments = []
        chapter_num += 1
        
    if chapter_num > 0:
        segment = {
            "id": f"abhm-{chapter_num}.{len(current_chapter_segments) + 1}",
            "pali": item.get("pali", ""),
            "translations": {
                "en": item.get("en", ""),
                "pt": item.get("pt", ""),
                "es": item.get("es", "")
            }
        }
        current_chapter_segments.append(segment)

if current_chapter_segments:
    chapters.append(current_chapter_segments)

print(f"Found {len(chapters)} chapters.")

# Only keep the first 9 chapters (the Mūla, ignoring commentary if any at the end)
chapters = chapters[:9]

# Delete old visuddhimagga chapters
os.system(f"rm {dest_dir}/ch*.json")

for i, chapter_data in enumerate(chapters):
    ch_num = i + 1
    ch_file = f"ch{ch_num:02d}.json"
    with open(os.path.join(dest_dir, ch_file), "w", encoding="utf-8") as f:
        json.dump(chapter_data, f, ensure_ascii=False, indent=2)
    print(f"Saved {ch_file} with {len(chapter_data)} segments.")

