import re

with open("src/app.ts", "r") as f:
    content = f.read()

old_url = """  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");"""
new_url = """  const queryPart = location.hash.split('?')[1];
  const urlParams = new URLSearchParams(queryPart || "");"""
content = content.replace(old_url, new_url)

with open("src/app.ts", "w") as f:
    f.write(content)
