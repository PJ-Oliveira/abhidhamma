with open("src/app.ts", "r") as f:
    content = f.read()

old = """  let segId: number | undefined = undefined;
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) segId = s;
  }
  
  return { workId, partKey, chunkIndex: Number(chunk), segId };"""

new = """  const route: Route = { workId, partKey, chunkIndex: Number(chunk) };
  const urlParams = new URLSearchParams(location.hash.split('?')[1] || "");
  if (urlParams.has("seg")) {
    const s = parseInt(urlParams.get("seg")!, 10);
    if (!isNaN(s)) route.segId = s;
  }
  return route;"""

content = content.replace(old, new)

with open("src/app.ts", "w") as f:
    f.write(content)
