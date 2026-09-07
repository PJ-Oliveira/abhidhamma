import json

with open("/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/buddhism-in-daily-life/texto__10.json", "r") as f:
    data = json.load(f)

# Fix 191
data[1]['pt'] = data[1]['pt'].replace("haverão condições", "haverá condições")

# Fix 192
data[2]['pt'] = data[2]['pt'].replace("O sofrimento qual todos vivenciamos é inevitável enquanto houverem condições.", "O sofrimento que todos vivenciamos é inevitável enquanto houver condições.")
data[2]['pt'] = data[2]['pt'].replace("que houvera ela mesma perdido", "que ela mesma havia perdido")

# Fix 201
data[11]['pt'] = "Achamos que está frio demais, quente demais, tarde demais para estar atento (mindful)? Sempre queremos fazer algo além de estar atentos ao momento presente. Nosso objetivo mais elevado na vida é desfrutar das coisas que podem ser experienciadas pelos sentidos? É a riqueza, o conforto físico, a companhia de parentes e amigos? As pessoas esquecem que nada disso dura. Elas esquecem que, assim que nascemos, temos idade suficiente para morrer. Os que são sábios, contudo, enxergam a impermanência de todas as coisas condicionadas. No Theragāthā (Canto II, 145) lemos que Vītasoka, enquanto o seu cabelo era cortado pelo barbeiro, olhou no espelho e viu alguns cabelos grisalhos. Ele foi lembrado da realidade e desenvolveu insight. Enquanto estava sentado ali, ele atingiu a iluminação. Nós lemos:"

# Fix 202
data[12]['pt'] = "“Agora deixe que me barbeie!”, assim veio o barbeiro.\nDele tomei o espelho e, nele\nRefletido, a mim mesmo encarei e pensei:\n“Fútil para perdurar é este corpo que se mostra.”\n(Assim pensando na fonte que cega a nossa visão)\nA escuridão de meu espírito derreteu-se em luz,\nCompletamente despidas foram as vestes (das corrupções).\nAgora já não há mais retorno à existência."

with open("/Users/pauloo/Desktop/abhidhamma-ai-agente and book translations/abhidhamma-pitaka-trilingue-site/data/works/buddhism-in-daily-life/texto__10.json", "w", encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("texto__10.json fixed")
