import json, os, urllib.request, urllib.error
import re
import time

API_KEY = ""
with open(".env", "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            API_KEY = line.strip().split("=", 1)[1]

def call_gemini(text, system_instruction=""):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [{"parts": [{"text": text}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {"temperature": 0.1}
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            return res_body["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return None

leaks = [
    ("abhidhamma-in-daily-life/texto__0.json", 18),
    ("abhidhamma-in-daily-life/texto__0.json", 704),
    ("buddhism-in-daily-life/texto__17.json", 298),
    ("dhammasangani/anutika.json", 46),
    ("kathavatthu/anutika.json", 246),
    ("path-without-ownership/texto.json", 21),
    ("path-without-ownership/texto.json", 119),
    ("path-without-ownership/texto.json", 579),
    ("path-without-ownership/texto.json", 630),
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

english_leak = re.compile(r"\b(the|and|is|are|of|in|to|that|this|which|with|for)\b", re.IGNORECASE)
sys_prompt = """
Você é um tradutor especialista do Abhidhamma Theravada para o Português Brasileiro (PT-BR).
Regras estritas:
1. Mantenha títulos de livros (ex: The Way of Mindfulness) em inglês se já estiverem assim. Mas traduza o resto.
2. 'Dhamma' como realidade ontológica deve ser 'realidade' (nunca 'fenômeno').
3. 'Bhavaṅga' não é 'subconsciente'.
4. 'Citta' (consciência), 'Cetasika' (fator mental), 'Kamma' (nunca karma).
5. O texto deve ser PT-BR culto, sem gerúndios de Portugal ('está a fazer'), usando 'está fazendo'.
6. Traduza O CONTEÚDO PARA PORTUGUÊS. 
Retorne APENAS o texto traduzido final, sem aspas extras ou explicações.
"""

files_to_update = {}

for path, seg_id in leaks:
    full_path = os.path.join("data/works", path)
    if full_path not in files_to_update:
        with open(full_path, "r", encoding="utf-8") as f:
            files_to_update[full_path] = json.load(f)
            
    data = files_to_update[full_path]
    for seg in data:
        if str(seg["id"]) == str(seg_id):
            source_text = seg.get("en", "") or seg.get("pali", "")
            current_pt = seg.get("pt", "")
            
            # check if it actually has english leaks (excluding "for")
            words = current_pt.split()
            eng_matches = [w for w in words if english_leak.fullmatch(w.strip(".,;!?()[]\"\'")) and w.strip(".,;!?()[]\"\'").lower() != "for"]
            if len(eng_matches) == 0:
                print(f"Skipping {path}:{seg_id} (False Positive)")
                continue
                
            prompt = f"Traduza o seguinte texto para Português Brasileiro.\nTexto original:\n{source_text}\n\nTradução atual quebrada:\n{current_pt}"
            print(f"Translating {path}:{seg_id}...")
            new_pt = call_gemini(prompt, sys_prompt)
            if new_pt:
                seg["pt"] = new_pt
                print(f" -> Success.")
                time.sleep(15)
            else:
                print(" -> FAILED.")
                time.sleep(5)

for full_path, data in files_to_update.items():
    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("All English Leaks processed!")
