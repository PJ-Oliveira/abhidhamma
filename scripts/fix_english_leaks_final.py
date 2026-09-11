import json, urllib.request

API_KEY = ""
with open(".env", "r") as f:
    for line in f:
        if line.startswith("GEMINI_API_KEY="):
            API_KEY = line.strip().split("=", 1)[1]

def call_gemini(text):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [{"parts": [{"text": text}]}],
        "systemInstruction": {"parts": [{"text": "Você é um tradutor especialista de textos Theravada para Português Brasileiro. Reescreva e conserte apenas o PT-BR. Use 'realidade' (nunca fenômeno), mantenha citta/cetasika/kamma, não use gerúndio PT-PT. Apenas retorne a string traduzida."}]},
        "generationConfig": {"temperature": 0.1}
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            return res_body["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(e)
        return None

leaks = [
    ("abhidhamma-in-daily-life/texto__0.json", 18),
    ("abhidhamma-in-daily-life/texto__0.json", 704),
    ("buddhism-in-daily-life/texto__17.json", 298),
    ("path-without-ownership/texto.json", 21),
    ("path-without-ownership/texto.json", 119),
    ("path-without-ownership/texto.json", 579),
    ("path-without-ownership/texto.json", 630),
    ("the-buddhist-teaching-on-physical-phenomena/texto.json", 28),
    ("the-conditionality-of-life/texto__0.json", 37),
    ("visuddhimagga/mula__2.json", 20),
    ("visuddhimagga/mula__3.json", 1484),
    ("visuddhimagga/tika__1.json", 16)
]

import time

for path, seg_id in leaks:
    full_path = f"data/works/{path}"
    try:
        with open(full_path, "r") as f:
            data = json.load(f)
            
        for seg in data:
            if str(seg["id"]) == str(seg_id):
                src = seg.get("en", "") or seg.get("pali", "")
                old_pt = seg.get("pt", "")
                print(f"Fixing {path}:{seg_id}...")
                new_pt = call_gemini(f"Traduza: {src}\n\nTradução atual que está cheia de erros de inglês/português:\n{old_pt}")
                if new_pt:
                    seg["pt"] = new_pt
                    print("Success!")
                    with open(full_path, "w") as f_out:
                        json.dump(data, f_out, ensure_ascii=False, indent=2)
                else:
                    print("Failed via API.")
                time.sleep(2)
    except Exception as e:
        pass
