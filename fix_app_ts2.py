import re

with open("src/app.ts", "r") as f:
    content = f.read()

old_select = """      } else {
         void selectWork(route.workId, route.partKey, route.chunkIndex, route.segId);
      }"""
new_select = """      } else {
         void selectWork(route.workId as string, route.partKey as string, route.chunkIndex as number, route.segId);
      }"""
content = content.replace(old_select, new_select)

with open("src/app.ts", "w") as f:
    f.write(content)
