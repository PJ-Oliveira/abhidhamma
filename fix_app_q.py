import re

with open("src/app.ts", "r") as f:
    content = f.read()

# Update Route interface to include `q?: string;`
old_route = """interface Route {
  panel: string;
  workId?: string;
  partKey?: string;
  chunkIndex?: number;
  segId?: number;
}"""
new_route = """interface Route {
  panel: string;
  workId?: string;
  partKey?: string;
  chunkIndex?: number;
  segId?: number;
  q?: string;
}"""
content = content.replace(old_route, new_route)

# Update parseHash to parse `q`
old_parse = """  const urlParams = new URLSearchParams(queryPart || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  return route;"""
new_parse = """  const urlParams = new URLSearchParams(queryPart || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  if (urlParams.has("q")) {
    route.q = urlParams.get("q")!;
  }
  return route;"""
content = content.replace(old_parse, new_parse)

# Update updateHash to preserve q?
# If we update the hash, and the panel is dictionary, we should grab the input value!
# But updateHash is generic. It's better to update it from the specific modules.

with open("src/app.ts", "w") as f:
    f.write(content)
