import re

with open("index.html", "r") as f:
    content = f.read()

replacements = {
    'Mostrar tradução': 'Show translation',
    'Memorização Pāli': 'Pāli Memorization',
    'Visualizando no painel principal →': 'Viewing in main panel →',
    'Recolher painel': 'Collapse panel'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open("index.html", "w") as f:
    f.write(content)
