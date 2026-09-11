import json
import re

def fix_text(text):
    if not text:
        return text
    
    replacements = {
        r'\bcontrolo\b': 'controle',
        r'\b(F|f)acto\b': r'\1ato',
        r'\b(C|c)ontacto\b': r'\1ontato',
        r'\b(P|p)erspetiva\b': r'\1erspectiva',
        r'\bconnosco\b': 'conosco',
        r'\b(P|p)erceção\b': r'\1ercepção',
        r'\b(R|r)eceção\b': r'\1ecepção',
        r'\b(I|i)nfeção\b': r'\1nfecção',
        r'\b(E|e)spectador\b': r'\1spectador',
    }
    
    for pat, repl in replacements.items():
        text = re.sub(pat, repl, text)
        
    # Fix gerunds: estar + a + infinitive -> estar + gerund
    # verbs: fazer(fazendo), dizer(dizendo), pensar(pensando), falar(falando), trabalhar(trabalhando), tentar(tentando), acontecer(acontecendo), olhar(olhando), ver(vendo), observar(observando), procurar(procurando), ir(indo), vir(vindo)
    
    gerunds = {
        'fazer': 'fazendo', 'dizer': 'dizendo', 'pensar': 'pensando', 'falar': 'falando',
        'trabalhar': 'trabalhando', 'tentar': 'tentando', 'acontecer': 'acontecendo',
        'olhar': 'olhando', 'ver': 'vendo', 'observar': 'observando', 'procurar': 'procurando',
        'ir': 'indo', 'vir': 'vindo', 'surgir': 'surgindo', 'desperdiçar': 'desperdiçando',
        'controlar': 'controlando', 'mudar': 'mudando', 'compreender': 'compreendendo',
        'lidar': 'lidando', 'dar': 'dando', 'tomar': 'tomando', 'aprender': 'aprendendo',
        'desenvolver': 'desenvolvendo', 'praticar': 'praticando', 'experimentar': 'experimentando'
    }
    
    estar_forms = r'\b(estou|está|estamos|estão|estava|estavam|estive|esteve|estivemos|estiveram|estar|estarmos|estarem)\b'
    
    for inf, ger in gerunds.items():
        pattern = estar_forms + r'\s+a\s+' + inf + r'\b'
        text = re.sub(pattern, r'\1 ' + ger, text)
        
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
