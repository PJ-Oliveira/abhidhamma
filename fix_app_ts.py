import re

with open("src/app.ts", "r") as f:
    content = f.read()

# Fix switchPanel optional call in wireRouting
old_wire_routing = """    // Check panel switch
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (!activeBtn || activeBtn.dataset.panel !== route.panel) {
       if (switchPanel) switchPanel(route.panel, true);
    }"""
new_wire_routing = """    // Check panel switch
    const activeBtn = document.querySelector(".rail-btn.active") as HTMLElement;
    if (!activeBtn || activeBtn.dataset.panel !== route.panel) {
       switchPanel?.(route.panel, true);
    }"""
content = content.replace(old_wire_routing, new_wire_routing)

# Fix switchPanel in init
old_init = """  if (route) {
    if (switchPanel && route.panel !== "tipitaka") {
       switchPanel(route.panel, true);
    }
    if (route.workId && route.partKey && route.chunkIndex !== undefined) {
      await selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
    } else {"""
new_init = """  if (route) {
    if (route.panel !== "tipitaka") {
       switchPanel?.(route.panel, true);
    }
    if (route.workId && route.partKey && route.chunkIndex !== undefined) {
      await selectWork(route.workId as string, route.partKey as string, route.chunkIndex as number, route.segId);
    } else {"""
content = content.replace(old_init, new_init)

# Fix switchPanel declaration
content = content.replace(
    'let switchPanel: (target: string, skipHashUpdate?: boolean) => void;',
    'let switchPanel: ((target: string, skipHashUpdate?: boolean) => void) | undefined;'
)

with open("src/app.ts", "w") as f:
    f.write(content)
