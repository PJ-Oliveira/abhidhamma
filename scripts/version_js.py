"""Post-build script: stamps ?v=<hash> on all compiled JS imports.

Run after tsc: python3 scripts/version_js.py
Integrated via package.json "build" script.
"""
import re
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JS_DIR = ROOT / "js"
INDEX = ROOT / "index.html"

js_files = sorted(JS_DIR.rglob("*.js"))
h = hashlib.md5()
_strip_v = re.compile(rb'\?v=[a-f0-9]{8}')
for f in js_files:
    h.update(_strip_v.sub(b'', f.read_bytes()))
VERSION = h.hexdigest()[:8]

PAT = re.compile(r'((?:from|import)\s+")(\.\.?\/[^"?]+\.js)(?:\?v=[^"]*)?(")')

updated = 0
for js_file in js_files:
    original = js_file.read_text(encoding="utf-8")
    new_content = PAT.sub(rf'\1\2?v={VERSION}\3', original)
    if new_content != original:
        js_file.write_text(new_content, encoding="utf-8")
        updated += 1

html = INDEX.read_text(encoding="utf-8")
new_html = re.sub(
    r'(<script[^>]+src=")js/app\.js(?:\?v=[^"]*)?(")',
    rf'\1js/app.js?v={VERSION}\2',
    html,
)
new_html = re.sub(
    r'(<link[^>]+href=")css/style\.css(?:\?v=[^"]*)?(")',
    rf'\1css/style.css?v={VERSION}\2',
    new_html,
)
if new_html != html:
    INDEX.write_text(new_html, encoding="utf-8")

print(f"[version_js] v={VERSION}  ({updated} js files + index.html)")
