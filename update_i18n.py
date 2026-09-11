import re

with open("src/i18n.ts", "r") as f:
    content = f.read()

content = content.replace('dictFreq: "Ocorrências no corpus",', 'dictFreq: "Ocorrências no corpus",\n    copyLink: "Copiar link deste trecho",')
content = content.replace('dictFreq: "Occurrences in corpus",', 'dictFreq: "Occurrences in corpus",\n    copyLink: "Copy link to this excerpt",')
content = content.replace('dictFreq: "Ocurrencias en el corpus",', 'dictFreq: "Ocurrencias en el corpus",\n    copyLink: "Copiar enlace a este fragmento",')

with open("src/i18n.ts", "w") as f:
    f.write(content)
