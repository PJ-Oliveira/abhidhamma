import json
import os

apps = [
    "/Users/pauloo/Desktop/abhidhamma/visuddhimagga",
    "/Users/pauloo/Desktop/abhidhamma/abhidhammatthasangaha"
]

with open("batch6.json", "r", encoding="utf-8") as f:
    new_entries = json.load(f)

for app in apps:
    dict_path = os.path.join(app, "src/data/paliDictionary.json")
    if os.path.exists(dict_path):
        with open(dict_path, "r", encoding="utf-8") as f:
            current_dict = json.load(f)
        
        # Deduplicate
        existing_palis = {item["pali"].lower() for item in current_dict}
        added_count = 0
        for entry in new_entries:
            if entry["pali"].lower() not in existing_palis:
                current_dict.append(entry)
                added_count += 1
                
        # Sort alphabetically
        current_dict.sort(key=lambda x: x["pali"].lower())
        
        with open(dict_path, "w", encoding="utf-8") as f:
            json.dump(current_dict, f, ensure_ascii=False, indent=2)
            
        print(f"Added {added_count} new words to {os.path.basename(app)}. Total words: {len(current_dict)}")
