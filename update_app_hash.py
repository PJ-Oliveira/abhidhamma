import re

with open("src/app.ts", "r") as f:
    content = f.read()

# Update Route interface
old_route = """interface Route {
  workId: string;
  partKey: string;
  chunkIndex: number;
}"""

new_route = """interface Route {
  workId: string;
  partKey: string;
  chunkIndex: number;
  segId?: number;
}"""

content = content.replace(old_route, new_route)

# Update parseHash
old_parse = """function parseHash(): Route | null {
  const match = location.hash.match(/^#\/([^/]+)\/([^/]+)\/(\d+)/);
  if (!match) return null;
  const [, workId, partKey, chunk] = match;
  if (!workId || !partKey || !chunk) return null;
  return { workId, partKey, chunkIndex: Number(chunk) };
}"""

new_parse = """function parseHash(): Route | null {
  const match = location.hash.match(/^#\/([^/?]+)\/([^/?]+)\/(\d+)/);
  if (!match) return null;
  const [, workId, partKey, chunk] = match;
  if (!workId || !partKey || !chunk) return null;
  
  let segId: number | undefined = undefined;
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) segId = s;
  }
  
  return { workId, partKey, chunkIndex: Number(chunk), segId };
}"""

content = content.replace(old_parse, new_parse)

# Update wireRouting
old_wire = """function wireRouting(): void {
  window.addEventListener("hashchange", () => {
    const route = parseHash();
    if (route) void selectWork(route.workId, route.partKey, route.chunkIndex);
  });
}"""

new_wire = """function wireRouting(): void {
  window.addEventListener("hashchange", () => {
    const route = parseHash();
    if (route) void selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
  });
}"""

content = content.replace(old_wire, new_wire)

with open("src/app.ts", "w") as f:
    f.write(content)
