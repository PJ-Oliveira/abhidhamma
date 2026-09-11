import json

manifest_path = "data/manifest.json"
with open(manifest_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

comentarios = data["groups"]["comentarios"]
# Desired order
desired_order = [
    "buddhism-in-daily-life",
    "the-buddhas-path",
    "introduction-to-the-abhidhamma",
    "abhidhamma-in-daily-life",
    "the-conditionality-of-life",
    "the-buddhist-teaching-on-physical-phenomena",
    "path-without-ownership"
]

# Create a dictionary of current items
items_by_id = {item["id"]: item for item in comentarios}

# Rebuild the list in the desired order
new_comentarios = []
for book_id in desired_order:
    if book_id in items_by_id:
        new_comentarios.append(items_by_id[book_id])
        del items_by_id[book_id]

# Append any remaining items that were not in the desired_order list
new_comentarios.extend(items_by_id.values())

# Save back to data
data["groups"]["comentarios"] = new_comentarios

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Manifest reordered successfully!")
