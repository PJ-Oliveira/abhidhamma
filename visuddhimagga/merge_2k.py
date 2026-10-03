import json
import os
import glob

apps = [
    "/Users/pauloo/Desktop/abhidhamma/visuddhimagga",
    "/Users/pauloo/Desktop/abhidhamma/abhidhammatthasangaha"
]

new_entries = []
for out_file in glob.glob("out2k_*.json"):
    try:
        with open(out_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            new_entries.extend(data)
    except Exception as e:
        pass

if not new_entries:
    print("Nenhum arquivo 2k processado ainda.")
    exit(0)

for app in apps:
    dict_path = os.path.join(app, "src/data/paliDictionary.json")
    if os.path.exists(dict_path):
        with open(dict_path, "r", encoding="utf-8") as f:
            current_dict = json.load(f)
        
        existing_palis = {item["pali"].lower() for item in current_dict}
        added_count = 0
        for entry in new_entries:
            pali = entry.get("pali", "").strip()
            if not pali: continue
            if pali.lower() not in existing_palis:
                current_dict.append(entry)
                added_count += 1
                
        current_dict.sort(key=lambda x: x["pali"].lower())
        
        with open(dict_path, "w", encoding="utf-8") as f:
            json.dump(current_dict, f, ensure_ascii=False, indent=2)
            
        print(f"Added {added_count} new words to {os.path.basename(app)}. Total words: {len(current_dict)}")
