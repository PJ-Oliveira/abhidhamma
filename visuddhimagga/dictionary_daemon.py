import json
import os
import time
import re

try:
    from google import genai
    from google.genai import types
except ImportError:
    os.system("pip install google-genai pydantic")
    from google import genai
    from google.genai import types

from pydantic import BaseModel
from typing import List, Dict

class DictionaryEntry(BaseModel):
    pali: str
    en: str
    pt: str
    es: str
    grammar: str

class DictionaryBatch(BaseModel):
    entries: List[DictionaryEntry]

apps = [
    "/Users/pauloo/Desktop/abhidhamma/visuddhimagga",
    "/Users/pauloo/Desktop/abhidhamma/abhidhammatthasangaha"
]

def load_missing_words():
    with open("missing_vocab_freq.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()
    words = []
    for line in lines:
        parts = line.strip().split()
        if len(parts) == 2:
            words.append(parts[1])
    return words

def append_to_dictionaries(entries_dict):
    for app in apps:
        dict_path = os.path.join(app, "src/data/paliDictionary.json")
        if os.path.exists(dict_path):
            with open(dict_path, "r", encoding="utf-8") as f:
                current_dict = json.load(f)
            
            existing_palis = {item["pali"].lower() for item in current_dict}
            added = False
            for entry in entries_dict:
                if entry["pali"].lower() not in existing_palis:
                    current_dict.append({
                        "pali": entry["pali"],
                        "meaning": {
                            "en": entry["en"],
                            "pt": entry["pt"],
                            "es": entry["es"]
                        },
                        "grammar": entry["grammar"]
                    })
                    added = True
            
            if added:
                current_dict.sort(key=lambda x: x["pali"].lower())
                with open(dict_path, "w", encoding="utf-8") as f:
                    json.dump(current_dict, f, ensure_ascii=False, indent=2)

def run_daemon(api_key):
    client = genai.Client(api_key=api_key)
    words = load_missing_words()
    
    # Check what is already translated in case we resume
    dict_path = os.path.join(apps[0], "src/data/paliDictionary.json")
    with open(dict_path, "r", encoding="utf-8") as f:
        current_dict = json.load(f)
    existing_palis = {item["pali"].lower() for item in current_dict}
    
    words_to_process = [w for w in words if w not in existing_palis]
    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Daemon iniciado. Faltam {len(words_to_process)} palavras.")
    
    batch_size = 20
    
    while words_to_process:
        batch = words_to_process[:batch_size]
        prompt = f"You are a Theravada Abhidhamma expert. Translate these Pali words into highly scholarly English, Brazilian Portuguese, and Spanish, and identify their grammar. Return JSON. Words:\n{', '.join(batch)}"
        
        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=DictionaryBatch,
                    temperature=0.1
                )
            )
            
            result = json.loads(response.text)
            append_to_dictionaries(result["entries"])
            
            words_to_process = words_to_process[batch_size:]
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Processado lote de {len(batch)} palavras. Restam: {len(words_to_process)}")
            time.sleep(2) # Respiro para a API
            
        except Exception as e:
            err_str = str(e)
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] ERRO: {err_str}")
            if "429" in err_str or "quota" in err_str.lower() or "exhausted" in err_str.lower():
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Quota excedida. Dormindo por 6 horas...")
                time.sleep(21600)
            else:
                print("Erro desconhecido. Tentando novamente o mesmo lote em 60 segundos...")
                time.sleep(60)

if __name__ == "__main__":
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("ERRO: GEMINI_API_KEY não definida.")
        exit(1)
    run_daemon(key)
