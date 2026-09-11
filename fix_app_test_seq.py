import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

# Strip out my previous describe block
start_idx = content.find("  describe(\"Routing and Responsiveness (Desktop/Mobile)\"")
if start_idx != -1:
    content = content[:start_idx] + "});\n"
    
# Now append the logic into the first test block
to_inject = """
    // --- Routing and Responsiveness Tests (Sequential) ---
    // 6. Test Routing to sub-tabs (Tools -> Patthana)
    window.location.hash = "#/tools/patthana";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    
    const toolsPanel = document.getElementById("panel-tools");
    expect(toolsPanel?.classList.contains("active")).toBe(true);
    const patthanaBtn = document.querySelector('.tools-tab-btn[data-tab="patthana"]');
    expect(patthanaBtn?.classList.contains("active")).toBe(true);
    
    // 7. Test Routing to dictionary with query
    window.location.hash = "#/dictionary?q=kamma";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    
    const dictPanel = document.getElementById("panel-dictionary");
    expect(dictPanel?.classList.contains("active")).toBe(true);
    const dictInput = document.getElementById("dict-search") as HTMLInputElement;
    expect(dictInput.value).toBe("kamma");
    
    // 8. Test Desktop sidePanel behavior (Expand)
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    const srsBtn = document.querySelector('.rail-btn[data-panel="srs"]') as HTMLButtonElement;
    srsBtn.click();
    await new Promise(r => setTimeout(r, 50));
    const sidePanel = document.getElementById("side-panel");
    expect(sidePanel?.classList.contains("collapsed")).toBe(false);
    
    // 9. Test Mobile sidePanel behavior (Collapse)
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    sidePanel?.classList.remove("collapsed"); // reset
    srsBtn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(sidePanel?.classList.contains("collapsed")).toBe(true);
"""

# Find the end of the FIRST and ONLY `it` block inside the first describe block.
# The original file ended with:
#     await new Promise(r => setTimeout(r, 50));
#   });
# });
end_it_idx = content.rfind("  });\n});")
if end_it_idx != -1:
    content = content[:end_it_idx] + to_inject + "\n  });\n});"

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
