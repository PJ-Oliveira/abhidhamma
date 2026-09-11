import re

with open("src/tools/tools.ts", "r") as f:
    content = f.read()

old_95 = """    if (parts[0] === "tools" && parts.length > 1 && parts[1]) {
       const requested = parts[1] as TabId;
       if (TABS.some(t => t.id === requested)) {
           switchTab(requested, true);
           return;
       }
    }"""
new_95 = """    const p1 = parts[1];
    if (parts[0] === "tools" && p1) {
       const requested = p1 as TabId;
       if (TABS.some(t => t.id === requested)) {
           switchTab(requested, true);
           return;
       }
    }"""
content = content.replace(old_95, new_95)

old_108 = """  if (parts[0] === "tools" && parts.length > 1 && parts[1] && TABS.some(t => t.id === parts[1])) {
      switchTab(parts[1] as TabId, true);
  } else {"""
new_108 = """  const p1_init = parts[1];
  if (parts[0] === "tools" && p1_init && TABS.some(t => t.id === p1_init)) {
      switchTab(p1_init as TabId, true);
  } else {"""
content = content.replace(old_108, new_108)

with open("src/tools/tools.ts", "w") as f:
    f.write(content)
