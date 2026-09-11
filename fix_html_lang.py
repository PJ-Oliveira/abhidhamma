import re

with open("index.html", "r") as f:
    content = f.read()

replacements = {
    'lang="pt-BR"': 'lang="en"',
    'title="Dicionário"': 'title="Dictionary"',
    'title="Histórico"': 'title="History"',
    'title="Pesquisar"': 'title="Search"',
    'title="Configurações"': 'title="Settings"',
    'title="Exportar"': 'title="Export"',
    'title="Memorização Pāli"': 'title="Pāli Memorization"',
    '>Dicionário<': '>Dictionary<',
    '>Histórico<': '>History<',
    '>Pesquisar<': '>Search<',
    '>Config.<': '>Config<',
    '>Exportar<': '>Export<',
    '>Dicionário Pāli<': '>Pāli Dictionary<',
    'placeholder="Buscar palavra em Pāli…"': 'placeholder="Search Pāli word…"',
    '>Favoritos<': '>Bookmarks<',
    'placeholder="Pesquisar no Pāli, EN, PT ou ES…"': 'placeholder="Search in Pāli, EN, PT or ES…"',
    '>Idioma da tradução<': '>Translation Language<',
    '>Idioma da interface<': '>Interface Language<',
    '>Tamanho da fonte<': '>Font size<',
    '>Mostrar Pāli<': '>Show Pāli<',
    '>Mostrar Tradução<': '>Show Translation<',
    '>Ferramentas Analíticas<': '>Analytical Tools<',
    '📲 Instalar Aplicativo (Leitura Offline)': '📲 Install App (Offline Reading)'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open("index.html", "w") as f:
    f.write(content)
