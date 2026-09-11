import re

with open("src/app.ts", "r") as f:
    content = f.read()

# Replace all switchPanel(...) with switchPanel?.(...)
content = re.sub(r'switchPanel\((.*?)\)', r'switchPanel?.(\1)', content)

# But wait, the assignment switchPanel = (...) should NOT be replaced!
content = content.replace('switchPanel?. =', 'switchPanel =')
# Actually, the assignment is `switchPanel = (target: string, skipHashUpdate = false) => {`
# The regex r'switchPanel\((.*?)\)' only matches function calls. `switchPanel = (target)` does not match.

with open("src/app.ts", "w") as f:
    f.write(content)
