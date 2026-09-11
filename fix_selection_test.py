import re

with open("tests/unit/selection.test.ts", "r") as f:
    content = f.read()

mock_dom = """
      <div id="content">
        <div class="seg" data-seg-id="123">
          <p>Some Pali text here to select.</p>
        </div>
      </div>
      <div id="selection-popover" class="selection-popover hidden"></div>
      <div id="reader-overlay"></div>
"""

content = content.replace("""      <div id="content">
        <div class="seg" data-seg-id="123">
          <p>Some Pali text here to select.</p>
        </div>
      </div>
      <div id="reader-overlay"></div>""", mock_dom)

# I also need to make sure handleMouseUp triggers, but JSDOM selectionchange is what I simulated! Wait, initSelectionHandler uses `mouseup` listener, not `selectionchange`!
# Ah! container.addEventListener("mouseup", (e) => void handleMouseUp(e));
# In my test I triggered `selectionchange`. Let's trigger `mouseup`.

content = content.replace("document.dispatchEvent(new Event('selectionchange'));", "document.getElementById('content')!.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));")

with open("tests/unit/selection.test.ts", "w") as f:
    f.write(content)
