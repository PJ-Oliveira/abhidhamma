import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

# We will inject the new tests at the end of the file before the final "});"

tests_to_add = """
  describe("Routing and Responsiveness (Desktop/Mobile)", () => {
    
    it("should handle deep linking to specific panels and sub-tabs", async () => {
      // Setup URL to point to a sub-tool
      window.location.hash = "#/tools/patthana";
      window.dispatchEvent(new Event("hashchange"));
      await new Promise((r) => setTimeout(r, 100)); // allow async logic
      
      const toolsPanel = document.getElementById("panel-tools");
      expect(toolsPanel?.classList.contains("active")).toBe(true);
      
      const patthanaBtn = document.querySelector('.tools-tab-btn[data-tab="patthana"]');
      expect(patthanaBtn?.classList.contains("active")).toBe(true);
      
      const mindmapBtn = document.querySelector('.tools-tab-btn[data-tab="mindmap"]');
      expect(mindmapBtn?.classList.contains("active")).toBe(false);
    });

    it("should extract query parameters for dictionary searches", async () => {
      window.location.hash = "#/dictionary?q=kamma";
      window.dispatchEvent(new Event("hashchange"));
      await new Promise((r) => setTimeout(r, 100));
      
      const dictPanel = document.getElementById("panel-dictionary");
      expect(dictPanel?.classList.contains("active")).toBe(true);
      
      const dictInput = document.getElementById("dict-search") as HTMLInputElement;
      expect(dictInput.value).toBe("kamma");
    });

    it("should adapt sidePanel behavior for Desktop view", async () => {
      // Simulate Desktop
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
      
      const srsBtn = document.querySelector('.rail-btn[data-panel="srs"]') as HTMLButtonElement;
      const sidePanel = document.getElementById("side-panel");
      
      // Click a fullscreen panel on desktop should NOT collapse the side panel natively (unless logic specifically handles it, actually let's test what wireIconRail does)
      // wireIconRail: if (isMobile && isFullscreen) { doCollapse() } else { doExpand() }
      srsBtn.click();
      await new Promise((r) => setTimeout(r, 50));
      
      // On desktop, it should EXPAND (or stay expanded)
      expect(sidePanel?.classList.contains("collapsed")).toBe(false);
    });

    it("should adapt sidePanel behavior for Mobile/Tablet view", async () => {
      // Simulate Mobile
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
      
      const srsBtn = document.querySelector('.rail-btn[data-panel="srs"]') as HTMLButtonElement;
      const sidePanel = document.getElementById("side-panel");
      
      // Remove collapsed just in case
      sidePanel?.classList.remove("collapsed");
      
      // Click a fullscreen panel on mobile
      srsBtn.click();
      await new Promise((r) => setTimeout(r, 50));
      
      // On mobile, clicking a fullscreen panel (SRS) should COLLAPSE the side panel to give room!
      expect(sidePanel?.classList.contains("collapsed")).toBe(true);
      
      // Restore desktop
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    });

  });
"""

# Insert before the last two lines which should be `  });\n});` or `});`
content = content.replace("  });\n});", "  });\n" + tests_to_add + "\n});")

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
