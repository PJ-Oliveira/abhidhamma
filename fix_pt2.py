import json
import re

def fix_text(text):
    if not text:
        return text
    
    # Catch any gerund in PT-PT: "estar + a + infinitive" -> "estar + gerund"
    # General regex for verbs: ending in ar, er, ir
    def replace_gerund(match):
        estar_verb = match.group(1)
        infinitive = match.group(2)
        
        if infinitive.endswith('ar'):
            gerund = infinitive[:-2] + 'ando'
        elif infinitive.endswith('er'):
            gerund = infinitive[:-2] + 'endo'
        elif infinitive.endswith('ir'):
            gerund = infinitive[:-2] + 'indo'
        elif infinitive.endswith('or'):
            gerund = infinitive[:-2] + 'ondo'
        else:
            return match.group(0) # fallback
            
        return f"{estar_verb} {gerund}"

    estar_forms = r'\b(estou|está|estamos|estão|estava|estavam|estive|esteve|estivemos|estiveram|estar|estarmos|estarem)\b'
    pattern = estar_forms + r'\s+a\s+([a-zçãõáéíóúâêô]+[aei]r)\b'
    
    text = re.sub(pattern, replace_gerund, text)
    
    return text

def main():
    with open('data/works/path-without-ownership/texto.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for item in data:
        if item.get('pt'):
            item['pt'] = fix_text(item['pt'])
            
    with open('data/works/path-without-ownership/texto.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    main()
