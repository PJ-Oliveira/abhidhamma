import json
import glob
import os
import re

dir_path = "data/works/buddhism-in-daily-life"
files = glob.glob(os.path.join(dir_path, "texto__*.json"))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changed = False
    for item in data:
        if "pt" in item and item["pt"]:
            original = item["pt"]
            
            # Replace bold
            text = re.sub(r'<b>(.*?)</b>', r'**\1**', original)
            
            # Replace italics
            text = re.sub(r'<i>(.*?)</i>', r'*\1*', text)
            
            # Replace sup (footnotes)
            text = re.sub(r'<sup>(.*?)</sup>', r'(\1)', text)
            
            if text != original:
                item["pt"] = text
                changed = True
                
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {os.path.basename(filepath)}")

print("Done cleaning HTML tags.")
