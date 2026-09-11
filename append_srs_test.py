import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

# Mock the SRS data
srs_mock = """      if (urlStr.includes('data/srs/pali_vocab.json')) {
        return {
          ok: true,
          json: async () => ([
            { id: "1", pali: "kamma", pt: "ação", en: "action", es: "acción", pos: "n." }
          ])
        } as any;
      }
"""
content = content.replace("return { ok: true, json: async () => ({}) } as any;", srs_mock + "\n      return { ok: true, json: async () => ({}) } as any;")


to_inject = """
    // 11. Test SRS logic & Keyboard shortcuts
    window.location.hash = "#/srs";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    const srsPanel = document.getElementById("panel-srs");
    expect(srsPanel?.classList.contains("active")).toBe(true);
    
    // Simulate space bar to flip
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await new Promise(r => setTimeout(r, 50));
    
    // Simulate '4' to rate easy
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '4' }));
    await new Promise(r => setTimeout(r, 50));
"""

end_it_idx = content.rfind("  });\n});")
if end_it_idx != -1:
    content = content[:end_it_idx] + to_inject + "\n  });\n});"

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
