import re

with open("tests/unit/app.test.ts", "r") as f:
    content = f.read()

test_addition = """
    // 10. i18n Switch Test
    const settingsBtn = document.querySelector('[data-panel="settings"]') as HTMLElement;
    if (settingsBtn) settingsBtn.click();
    
    const uiLangSel = document.getElementById('setting-ui-lang') as HTMLSelectElement;
    if (uiLangSel) {
      // switch to pt
      uiLangSel.value = 'pt';
      uiLangSel.dispatchEvent(new Event('change'));
      await new Promise(r => setTimeout(r, 100));
      // verify it didn't crash
      expect(document.body.innerHTML.length).toBeGreaterThan(0);
      
      // switch back to en
      uiLangSel.value = 'en';
      uiLangSel.dispatchEvent(new Event('change'));
      await new Promise(r => setTimeout(r, 100));
    }
  });
});
"""

content = content.replace("  });\n});", test_addition)

with open("tests/unit/app.test.ts", "w") as f:
    f.write(content)
