import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

content = content.replace('window.dispatchEvent(new Event("hashchange"));', 'console.log("hashchange dispatched", window.location.hash);\n      window.dispatchEvent(new Event("hashchange"));')

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)

