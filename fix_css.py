import sys

with open("css/style.css", "r", encoding="utf-8") as f:
    code = f.read()

mobile_css = """  .cet-comp-wrap {
    flex-direction: column;
  }"""

new_mobile_css = """  .cet-comp-wrap {
    flex-direction: column;
  }
  
  /* SRS Mobile tweaks */
  .srs-card {
    padding: 24px 20px;
  }
  .srs-headword {
    font-size: 36px;
  }
  .srs-card-wrap {
    min-height: 240px;
  }
  .srs-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
  .srs-btn-wrap {
    gap: 8px;
  }"""

if mobile_css in code:
    code = code.replace(mobile_css, new_mobile_css)
    with open("css/style.css", "w", encoding="utf-8") as f:
        f.write(code)
    print("Fixed mobile CSS")
else:
    print("Could not find the target CSS block")
