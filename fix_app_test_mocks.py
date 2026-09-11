import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

srs_mock = """      if (urlStr.includes('data/srs/pali_vocab.json')) {
        return {
          ok: true,
          json: async () => ([
            { id: "1", pali: "kamma", pt: "ação", en: "action", es: "acción", pos: "n." }
          ])
        } as any;
      }
"""

if "data/srs/pali_vocab.json" not in content:
    content = content.replace("return { ok: true, json: async () => ({}) } as any;", srs_mock + "\n      return { ok: true, json: async () => ({}) } as any;")

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
