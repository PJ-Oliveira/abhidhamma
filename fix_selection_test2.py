import re

with open("tests/unit/selection.test.ts", "r") as f:
    content = f.read()

mock_range = """      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 20 }),
        startContainer: document.querySelector('.seg p'),
        commonAncestorContainer: document.querySelector('.seg p')
      })"""

content = content.replace("""      getRangeAt: () => ({
        getBoundingClientRect: () => ({ top: 100, left: 100, width: 50, height: 20 }),
        commonAncestorContainer: document.querySelector('.seg p')
      })""", mock_range)

with open("tests/unit/selection.test.ts", "w") as f:
    f.write(content)
