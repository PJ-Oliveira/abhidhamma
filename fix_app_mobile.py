import sys

with open("src/app.ts", "r", encoding="utf-8") as f:
    code = f.read()

old_logic = """      if (btn.classList.contains("active") && !sidePanel.classList.contains("collapsed")) {
        doCollapse();
        return;
      }
      doExpand();
      buttons.forEach((b) => b.classList.toggle("active", b === btn));"""

new_logic = """      const isMobile = window.innerWidth <= 600;
      const isFullscreen = target && FULLSCREEN_PANELS.has(target);

      if (btn.classList.contains("active") && !sidePanel.classList.contains("collapsed")) {
        doCollapse();
        return;
      }
      
      if (isMobile && isFullscreen) {
        if (!sidePanel.classList.contains("collapsed")) doCollapse();
      } else {
        doExpand();
      }

      buttons.forEach((b) => b.classList.toggle("active", b === btn));"""

if old_logic in code:
    code = code.replace(old_logic, new_logic)
    with open("src/app.ts", "w", encoding="utf-8") as f:
        f.write(code)
    print("Fixed logic inside src/app.ts")
else:
    print("Could not find the target code in src/app.ts")
