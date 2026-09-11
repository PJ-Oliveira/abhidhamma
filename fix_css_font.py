with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

font_face = """@font-face {
  font-family: 'Gentium Book Plus';
  src: url('../fonts/GentiumBookPlus-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('../fonts/GentiumBookPlus-Italic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}

"""

if "Gentium Book Plus" not in css:
    css = font_face + css

css = css.replace("font-family: Georgia, serif;", "font-family: 'Gentium Book Plus', Georgia, serif;")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("CSS updated with Gentium Book Plus!")
