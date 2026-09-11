import re

with open("src/selection.ts", "r") as f:
    content = f.read()

# We need to extract the segId from segDiv
# Currently: const segDiv = node.closest(".seg");

seg_logic = """
  const segDiv = node.closest(".seg") as HTMLElement;
  if (!segDiv) { clearSelection(); return; }
  const currentSegId = segDiv.dataset.segId;
"""

content = re.sub(r'const segDiv = node.closest\("\.seg"\);\n\s*if \(\!segDiv\) \{ clearSelection\(\); return; \}', seg_logic, content)

# Header creation logic
header_logic = """  const closeBtn = document.createElement("button");
  closeBtn.className = "sp-close";
  closeBtn.textContent = "×";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.addEventListener("click", clearSelection);

  const linkBtn = document.createElement("button");
  linkBtn.className = "sp-link-btn";
  linkBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
  linkBtn.title = "Copy Link";
  linkBtn.style.cssText = "background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:4px;display:flex;align-items:center;margin-right:8px;";
  linkBtn.addEventListener("click", () => {
    const [baseHash] = window.location.hash.split('?');
    const newUrl = `${window.location.origin}${window.location.pathname}${baseHash}?seg=${currentSegId}`;
    navigator.clipboard.writeText(newUrl).then(() => {
      const origHtml = linkBtn.innerHTML;
      linkBtn.innerHTML = "✓";
      setTimeout(() => { linkBtn.innerHTML = origHtml; }, 2000);
    });
  });

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.appendChild(linkBtn);
  btnContainer.appendChild(closeBtn);

  header.appendChild(label);
  header.appendChild(btnContainer);"""

content = re.sub(r'  const closeBtn.*?header\.appendChild\(closeBtn\);', header_logic, content, flags=re.DOTALL)

with open("src/selection.ts", "w") as f:
    f.write(content)

