import re

with open("src/app.ts", "r") as f:
    content = f.read()

# Fix 634
old_parts = "const parts = hash.split('?')[0].split('/').filter(Boolean);"
new_parts = 'const parts = (hash.split("?")[0] || "").split("/").filter(Boolean);'
content = content.replace(old_parts, new_parts)

# Fix 641
old_has = """  if (knownPanels.has(parts[0])) {
    panel = parts.shift()!;
  }"""
new_has = """  if (parts[0] && knownPanels.has(parts[0])) {
    panel = parts.shift() as string;
  }"""
content = content.replace(old_has, new_has)

with open("src/app.ts", "w") as f:
    f.write(content)
