import re

with open("src/tools/tools.ts", "r") as f:
    content = f.read()

old_95 = """    if (parts[0] === "tools" && parts[1]) {
       const requested = parts[1] as TabId;"""
new_95 = """    if (parts[0] === "tools" && parts.length > 1 && parts[1]) {
       const requested = parts[1] as TabId;"""
content = content.replace(old_95, new_95)

old_108 = """  if (parts[0] === "tools" && parts[1] && TABS.some(t => t.id === parts[1])) {
      switchTab(parts[1] as TabId, true);"""
new_108 = """  if (parts[0] === "tools" && parts.length > 1 && parts[1] && TABS.some(t => t.id === parts[1])) {
      switchTab(parts[1] as TabId, true);"""
content = content.replace(old_108, new_108)

with open("src/tools/tools.ts", "w") as f:
    f.write(content)
