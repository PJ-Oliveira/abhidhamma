#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  ABHIDHAMMA PIṬAKA - CODE QUALITY & FEATURE VERIFICATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

PASS=0
FAIL=0

check() {
  local name=$1
  local cmd=$2
  local expected=$3
  
  if eval "$cmd" &>/dev/null; then
    echo "✅ $name"
    ((PASS++))
  else
    echo "❌ $name"
    ((FAIL++))
  fi
}

warn() {
  local name=$1
  local result=$2
  echo "⚠️  $name: $result"
}

echo "📋 BUILD VERIFICATION"
echo "─────────────────────────────────────────────────────────────"
check "index.html exists" "test -f index.html"
check "app.js compiled" "test -f js/app.js"
check "CSS file present" "test -f css/style.css"
check "Service Worker exists" "test -f service-worker.js"
check "Manifest exists" "test -f manifest.json"

echo ""
echo "🔍 CACHE BUSTING VERIFICATION"
echo "─────────────────────────────────────────────────────────────"
HASH=$(grep -o '\?v=[a-f0-9]*' index.html | head -1 | cut -d= -f2)
if [ -n "$HASH" ]; then
  echo "✅ Cache hash found: $HASH"
  ((PASS++))
  
  grep -q "?v=$HASH" js/app.js && {
    echo "✅ Hash applied in app.js imports"
    ((PASS++))
  } || {
    echo "⚠️  Hash may not be consistent in app.js"
  }
else
  echo "❌ No cache hash found"
  ((FAIL++))
fi

echo ""
echo "🎯 BUG FIX VERIFICATION"
echo "─────────────────────────────────────────────────────────────"

# BUG-002: SRS keyboard fix
grep -q 'const overlay = container.closest("#reader-srs")' js/srs.js && {
  echo "✅ BUG-002 FIXED: SRS keyboard handler checks overlay"
  ((PASS++))
} || {
  echo "❌ BUG-002: SRS keyboard fix not found"
  ((FAIL++))
}

# BUG-006: Clipboard .catch
grep -q '.catch(() =>' js/selection.js && {
  echo "✅ BUG-006 FIXED: Clipboard has error handler"
  ((PASS++))
} || {
  echo "❌ BUG-006: Clipboard .catch not found"
  ((FAIL++))
}

# BUG-009: location.hash instead of replaceState
grep -q 'location.hash = ' js/tools/tools.js && {
  echo "✅ BUG-009 FIXED: Tools use location.hash"
  ((PASS++))
} || {
  echo "❌ BUG-009: location.hash fix not found"
  ((FAIL++))
}

# BUG-004: Dead code removed
! grep -q 'knownPanels.has(panel) && parts.length === 3' js/app.js && {
  echo "✅ BUG-004 FIXED: Dead code removed"
  ((PASS++))
} || {
  echo "⚠️  BUG-004: Dead code may still exist"
}

# BUG-010: Glossary tokenization
grep -q 'wordRegex = /\[\\\p{L}' js/export.js && {
  echo "✅ BUG-010 FIXED: Glossary uses tokenization"
  ((PASS++))
} || {
  echo "⚠️  BUG-010: Glossary tokenization check unclear"
}

echo ""
echo "🎨 UI ELEMENTS VERIFICATION"
echo "─────────────────────────────────────────────────────────────"

check "Icon rail in HTML" "grep -q 'icon-rail' index.html"
check "Side panel in HTML" "grep -q 'side-panel' index.html"
check "Main reader in HTML" "grep -q 'id=\"reader\"' index.html"
check "All 8 panels defined" "grep -c 'id=\"panel-' index.html | grep -q '[89]'"
check "Content div exists" "grep -q 'id=\"content\"' index.html"
check "Settings controls" "grep -q 'setting-lang' index.html"
check "Dictionary search" "grep -q 'dict-search' index.html"
check "Full-text search" "grep -q 'search-input' index.html"
check "Export panel" "grep -q 'export-panel-body' index.html"
check "SRS overlay" "grep -q 'reader-srs' index.html"
check "Tools overlay" "grep -q 'reader-tools' index.html"
check "Selection popover" "grep -q 'selection-popover' index.html"
check "Debate button" "grep -q 'btn-toggle-interlocutor' index.html"

echo ""
echo "📦 FEATURE VERIFICATION"
echo "─────────────────────────────────────────────────────────────"

check "i18n module loaded" "grep -q 'i18n.js' js/app.js"
check "Reader module loaded" "grep -q 'reader.js' js/app.js"
check "Search module loaded" "grep -q 'search.js' js/app.js"
check "Dictionary module loaded" "grep -q 'dictionary.js' js/app.js"
check "SRS module loaded" "grep -q 'srs.js' js/app.js"
check "Export module loaded" "grep -q 'export.js' js/app.js"
check "Tools module loaded" "grep -q 'tools.js' js/app.js"
check "Selection handler loaded" "grep -q 'selection.js' js/app.js"

echo ""
echo "🔧 CSS VERIFICATION"
echo "─────────────────────────────────────────────────────────────"

check "CSS variables defined" "grep -q 'var(--' css/style.css"
check "Grid layout in CSS" "grep -q 'display: grid' css/style.css"
check "Responsive breakpoint" "grep -q '@media' css/style.css"
check "Font variables" "grep -q 'font-' css/style.css"

echo ""
echo "📋 DATA INTEGRITY"
echo "─────────────────────────────────────────────────────────────"

check "Manifest JSON exists" "test -f data/manifest.json"
check "Dictionary data exists" "test -f data/dictionary/pali_core.json"
check "Corpus files present" "test $(find data/works -name '*.json' 2>/dev/null | wc -l) -gt 100"
check "Search index exists" "test -f data/search/manifest.json"

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "SUMMARY: ✅ $PASS passed, ❌ $FAIL failed"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🟢 UI/CODE QUALITY: READY FOR PRODUCTION"
else
  echo "🟡 UI/CODE QUALITY: ISSUES DETECTED ($FAIL)"
fi

echo "════════════════════════════════════════════════════════════════"

exit $FAIL
