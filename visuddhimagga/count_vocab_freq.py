import json
import re
import os
from collections import Counter

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

word_counts = Counter()
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for item in data:
                pali = item.get("pali", "")
                if pali:
                    pali = re.sub(r'<[^>]+>', ' ', pali)
                    words = pali.split()
                    for w in words:
                        cw = clean_word(w)
                        if len(cw) > 2:
                            word_counts[cw] += 1

with open(dict_path, 'r', encoding='utf-8') as file:
    current_dict = json.load(file)
    dict_words = {clean_word(item["pali"]) for item in current_dict}

missing = []
for word, count in word_counts.items():
    if word not in dict_words:
        missing.append((count, word))

missing.sort(reverse=True) # Highest frequency first

with open('missing_vocab_freq.txt', 'w', encoding='utf-8') as file:
    for count, word in missing:
        file.write(f"{count} {word}\n")

print(f"Total missing unique words: {len(missing)}")
print("Top 20 missing:")
for i in range(min(20, len(missing))):
    print(f"{missing[i][0]}: {missing[i][1]}")

