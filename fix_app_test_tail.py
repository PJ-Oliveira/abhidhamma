import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

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

    // 12. Test Routing to sub-tabs (Tools -> Patthana)
    window.location.hash = "#/tools/patthana";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    
    const toolsPanel = document.getElementById("panel-tools");
    expect(toolsPanel?.classList.contains("active")).toBe(true);
    const patthanaBtn = document.querySelector('.tools-tab-btn[data-tab="patthana"]');
    expect(patthanaBtn?.classList.contains("active")).toBe(true);
    
    // 13. Test Routing to dictionary with query (also covers simple search in common_pali.json!)
    window.location.hash = "#/dictionary?q=ca";
    window.dispatchEvent(new Event("hashchange"));
    await new Promise(r => setTimeout(r, 150));
    
    const dictPanel2 = document.getElementById("panel-dictionary");
    expect(dictPanel2?.classList.contains("active")).toBe(true);
    const dictInput2 = document.getElementById("dict-search") as HTMLInputElement;
    expect(dictInput2.value).toBe("ca");
    // Also test it found the simple result
    const simpleEntry = document.querySelector('.dict-entry:not(.dict-entry-core)');
    expect(simpleEntry).not.toBeNull();
    
    // 14. Test Desktop sidePanel behavior (Expand)
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    const srsBtn2 = document.querySelector('.rail-btn[data-panel="srs"]') as HTMLButtonElement;
    srsBtn2.click();
    await new Promise(r => setTimeout(r, 50));
    const sidePanel = document.getElementById("side-panel");
    expect(sidePanel?.classList.contains("collapsed")).toBe(false);
    
    // 15. Test Mobile sidePanel behavior (Collapse)
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    sidePanel?.classList.remove("collapsed"); // reset
    srsBtn2.click();
    await new Promise(r => setTimeout(r, 50));
    expect(sidePanel?.classList.contains("collapsed")).toBe(true);
"""

end_it_idx = content.rfind("  });\n});")
if end_it_idx != -1:
    content = content[:end_it_idx] + to_inject + "\n  });\n});"

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
