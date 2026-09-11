import json

# Fix path-without-ownership/texto.json:459
with open("data/works/path-without-ownership/texto.json", "r") as f:
    data = json.load(f)
for seg in data:
    if str(seg["id"]) == "459":
        seg["pt"] = seg["pt"].replace("algum consciência", "alguma consciência")
        seg["pt"] = seg["pt"].replace("Algum consciência", "Alguma consciência")
with open("data/works/path-without-ownership/texto.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Fix visuddhimagga/mula__2.json:545
with open("data/works/visuddhimagga/mula__2.json", "r") as f:
    data = json.load(f)
for seg in data:
    if str(seg["id"]) == "545":
        seg["pt"] = seg["pt"].replace("do consciência", "da consciência")
        seg["pt"] = seg["pt"].replace("Do consciência", "Da consciência")
with open("data/works/visuddhimagga/mula__2.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Fix yamaka/mula__8.json:3000
with open("data/works/yamaka/mula__8.json", "r") as f:
    data = json.load(f)
for seg in data:
    if str(seg["id"]) == "3000":
        seg["pt"] = "9"
with open("data/works/yamaka/mula__8.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Minor issues fixed!")
