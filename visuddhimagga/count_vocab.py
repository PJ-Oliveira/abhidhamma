import json
import re
import os

files = [
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/abhidhammatthasangaha/mula__0.json",
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/abhidhammavatara/mula__0.json",
    "/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/abhidhammavatara/tika__0.json"
]

dict_path = "/Users/pauloo/Desktop/abhidhamma/visuddhimagga/src/data/paliDictionary.json"

def clean_word(w):
    w = w.lower()
    w = re.sub(r'[^a-zāīūñṅṭḍṇḷṃ]', '', w)
    return w

all_words = set()
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for item in data:
                pali = item.get("pali", "")
                if pali:
                    # Remove HTML tags
                    pali = re.sub(r'<[^>]+>', ' ', pali)
                    words = pali.split()
                    for w in words:
                        cw = clean_word(w)
                        if len(cw) > 2:
                            all_words.add(cw)

# load existing dict
with open(dict_path, 'r', encoding='utf-8') as file:
    current_dict = json.load(file)
    dict_words = {clean_word(item["pali"]) for item in current_dict}

missing = all_words - dict_words
print(f"Total unique words in texts: {len(all_words)}")
print(f"Words already in dict: {len(dict_words)}")
print(f"Missing words to process: {len(missing)}")

# Save missing words to file for processing
with open('missing_vocab.txt', 'w', encoding='utf-8') as file:
    for w in sorted(list(missing)):
        file.write(w + '\n')
