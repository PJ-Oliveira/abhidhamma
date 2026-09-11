import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

to_inject = """
    // 10. Test Dictionary Simple Search
    window.location.hash = "#/dictionary?q=ca";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    const simpleEntry = document.querySelector('.dict-entry:not(.dict-entry-core)');
    expect(simpleEntry).not.toBeNull();
"""

end_it_idx = content.rfind("  });\n});")
if end_it_idx != -1:
    content = content[:end_it_idx] + to_inject + "\n  });\n});"

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
