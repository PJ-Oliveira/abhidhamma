import json
import os
import glob
import re

base_dir = '/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site'
book_dir = os.path.join(base_dir, 'data/works/buddhism-in-daily-life')

# Find all texto__*.json
chunks = []
for i in range(100):
    path = os.path.join(book_dir, f'texto__{i}.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            chunks.append((f'texto__{i}.json', data))

toc = []
chunk_starts = []
total_count = 0

for filename, data in chunks:
    chunk_starts.append(data[0]['id'])
    total_count += len(data)
    for seg in data:
        if seg.get('rend') in ('chapter', 'subhead'):
            # simple toc entry
            # strip html tags
            text = re.sub(r'<[^>]+>', '', seg.get('pali', ''))
            toc.append({
                "id": seg['id'],
                "rend": seg['rend'],
                "text": text.strip()
            })

# Also include the remaining raw texto.json for the untranslated parts?
# The UI might break if IDs overlap. The original texto.json has IDs from 1 to 332.
# Our chunks have IDs from 1 to 202.
# If we just serve the chunks, the book will end at chapter 10 for now. That is safer.
index = {
    "id": "buddhism-in-daily-life",
    "title": "Buddhism in Daily Life",
    "parts": {
        "texto": {
            "label": "Text",
            "files": [c[0] for c in chunks],
            "toc": toc,
            "count": total_count,
            "chunkStarts": chunk_starts
        }
    }
}

with open(os.path.join(book_dir, 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)
    
print("Updated index.json successfully.")

# Update manifest.json
manifest_path = os.path.join(base_dir, 'data/manifest.json')
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Find the book in comentarios and update parts
comentarios = manifest.get('groups', {}).get('comentarios', [])
for book in comentarios:
    if book.get('id') == 'buddhism-in-daily-life':
        book['parts'] = index['parts']
        break

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("Updated manifest.json successfully.")
