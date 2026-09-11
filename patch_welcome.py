import re

with open("src/app.ts", "r") as f:
    content = f.read()

correct_welcome = """      el("content").innerHTML = `
        <div class="welcome">
          <img src="img/dhammacakka.webp" alt="Dhammacakka" class="welcome-img" />
          <h1 class="welcome-title">ABHIDHAMMA</h1>
          <p class="welcome-text">${t("welcomeBody", settings.uiLang)}</p>
        </div>`;"""

# Replace the first welcome block
content = re.sub(r'el\("content"\)\.innerHTML = `[^`]*<img src="img/dhammacakka.webp"[^`]*`;', correct_welcome, content)

# Replace the second welcome block
content = re.sub(r'el\("content"\)\.innerHTML = `[^`]*<img src="img/logo.png"[^`]*`;', correct_welcome, content)

with open("src/app.ts", "w") as f:
    f.write(content)
