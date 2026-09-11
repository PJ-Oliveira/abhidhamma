import re

with open("src/export.ts", "r") as f:
    content = f.read()

new_css = """const EPUB_CSS = `
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Regular.ttf');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Gentium Book Plus';
  src: url('fonts/GentiumBookPlus-Italic.ttf');
  font-weight: normal;
  font-style: italic;
}
body {
  font-family: 'Gentium Book Plus', Georgia, serif;
  font-size: 1.1em;
  line-height: 1.6;
  margin: 5% 5%;
  color: #111;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
}
h1 { text-align: center; font-size: 1.8em; border-bottom: 2px solid #333; padding-bottom: 0.4em; margin-bottom: 1em; hyphens: none; }
h2 { font-size: 1.4em; margin-top: 2em; padding-top: 0.5em; border-top: 1px solid #ccc; hyphens: none; }
h3 { font-size: 1.2em; margin-top: 1.2em; hyphens: none; }
h4 { font-size: 1em; font-style: italic; margin-top: 1em; }
p { margin: 0.8em 0; }
p.centre { text-align: center; }
p.glossary .line.pali { font-weight: 700; }
blockquote { margin: 1em 5%; font-style: italic; }
.pali { font-style: italic; color: #333; margin-bottom: 0.2em; }
.en, .pt, .es { margin-top: 0.1em; margin-bottom: 0.4em; }
.back-to-toc { display: block; text-align: center; margin-top: 2em; font-size: 0.9em; text-decoration: none; color: #555; border-top: 1px dashed #ccc; padding-top: 1em; }
.toc-header h1 { margin-bottom: 0.5em; border-bottom: none; }
.toc-header h2 { font-size: 1.3em; margin-top: 1.5em; border-top: none; }
.toc-short, .toc-mid { list-style-type: none; padding-left: 0; }
.toc-short li, .toc-mid li { margin-bottom: 0.5em; }
.toc-mid ol { list-style-type: disc; padding-left: 1.5em; margin-top: 0.3em; }
`;"""

# regex replace
content = re.sub(r'const EPUB_CSS = `.*?`;', new_css, content, flags=re.DOTALL)

with open("src/export.ts", "w") as f:
    f.write(content)
