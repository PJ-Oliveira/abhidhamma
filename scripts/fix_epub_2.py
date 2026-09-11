import re

with open('src/export.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Remove the duplicates of if (fontReg.length > 0)...
bad_lines = """  if (fontReg.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
  if (fontIta.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });
"""
code = code.replace(bad_lines, "")

bad_lines_2 = """      if (fontReg.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Regular.ttf", data: fontReg });
  if (fontIta.length > 0) zipEntries.push({ name: "OEBPS/fonts/GentiumBookPlus-Italic.ttf", data: fontIta });
"""
code = code.replace(bad_lines_2, "")

with open('src/export.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Duplicates removed.")
