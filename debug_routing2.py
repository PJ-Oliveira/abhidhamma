import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

content = content.replace(
    'expect(toolsPanel?.classList.contains("active")).toBe(true);',
    'console.log("TOOLS ACTIVE:", toolsPanel?.classList.contains("active"), toolsPanel?.className);\n      expect(toolsPanel?.classList.contains("active")).toBe(true);'
)

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)

