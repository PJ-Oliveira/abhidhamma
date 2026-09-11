import re

with open("src/tools/tools.ts", "r") as f:
    content = f.read()

# Revert my bad sed and put the correct one
content = re.sub(r'\(\.split\(\'\?\'\)\[0\] \|\| ""\)', r".split('?')[0]", content)

# Now fix it properly
old_line = "const parts = location.hash.replace(/^#\/?/, \"\").split('?')[0].split('/');"
new_line = "const parts = (location.hash.replace(/^#\/?/, \"\").split('?')[0] || \"\").split('/');"
content = content.replace(old_line, new_line)

with open("src/tools/tools.ts", "w") as f:
    f.write(content)
