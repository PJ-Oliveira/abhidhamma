lines = open('tests/unit/app.test.ts').read().splitlines()
while lines[-1].strip() == '' or lines[-1].strip() == '});' or lines[-1].strip() == '}' or 'click some export' in lines[-1] or 'const epubBtn' in lines[-1] or 'await new Promise' in lines[-1] or 'const exportBtn' in lines[-1] or 'Export Panel' in lines[-1] or 'prevBtn' in lines[-1] or 'nextBtn' in lines[-1] or 'Reader Navigation' in lines[-1]:
    lines.pop()

code = """
    // 8. Reader Navigation
    const nextBtn = document.getElementById('next-chunk') as HTMLButtonElement;
    if (nextBtn) nextBtn.click();
    await new Promise(r => setTimeout(r, 100));
    const prevBtn = document.getElementById('prev-chunk') as HTMLButtonElement;
    if (prevBtn) prevBtn.click();
    await new Promise(r => setTimeout(r, 100));

    // 9. Export Panel
    const exportBtn = document.querySelector('[data-panel="export"]') as HTMLElement;
    if (exportBtn) exportBtn.click();
    const epubBtn = document.querySelector('.export-btn') as HTMLElement;
    if (epubBtn) epubBtn.click();
    await new Promise(r => setTimeout(r, 100));
  });
});
"""
with open('tests/unit/app.test.ts', 'w') as f:
    f.write('\n'.join(lines) + '\n' + code)
