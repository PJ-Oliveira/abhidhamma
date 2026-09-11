# Deployment Instructions

## Prerequisites
- Git configured with SSH or HTTPS
- Access to GitHub repository
- Node.js 18+ and npm installed

## Pre-Deployment Checklist

```bash
# 1. Verify repository state
git status

# 2. Pull latest changes from main
git pull origin main

# 3. Run final test suite
npm test

# 4. Build production assets
npm run build

# 5. Verify build output
ls -lh js/app.js
grep "?v=" index.html
```

## Deploy Steps

### Option A: Using npm script (if configured)
```bash
npm run deploy
```

### Option B: Manual GitHub Pages deployment

**If using gh-pages branch:**
```bash
# Build project
npm run build

# Copy dist files to gh-pages branch
git checkout gh-pages
cp -r js/ css/ data/ img/ fonts/ index.html manifest.json service-worker.js .nojekyll .
git add -A
git commit -m "Deploy: build hash aa3e8f1f - bug fixes (SRS keyboard, clipboard .catch, tools nav)"
git push origin gh-pages
git checkout main
```

**If using main/master with docs/ folder:**
```bash
npm run build
git add js/ css/ index.html service-worker.js
git commit -m "Deploy: build hash aa3e8f1f - all bug fixes verified"
git push origin main
```

## Post-Deployment Verification

1. **Visit deployed URL** (GitHub Pages or custom domain)
2. **Verify assets loaded:**
   - DevTools → Network tab
   - Check all JS/CSS have new hash `aa3e8f1f`
   
3. **Test key functionality:**
   - [ ] Open a text, use keyboard (SRS shortcuts should work)
   - [ ] Try copying a link segment (should show ✓ or ✗)
   - [ ] Navigate tools and use browser Back button
   - [ ] Search and export a PDF
   
4. **Check Service Worker:**
   - DevTools → Application → Service Workers
   - Should show registered and active
   - Clear site data to test offline mode
   
5. **Verify offline capability:**
   - Open DevTools → Network → Offline
   - Reload page - app should still be usable
   - Try reading a previously accessed text

## Rollback (if needed)

```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Or reset to previous state
git reset --hard <previous-commit>
git push origin main --force-with-lease
```

## Cache Invalidation

If users report stale content:

1. **Browser cache:** Users can do Ctrl+Shift+R (hard refresh)
2. **Service Worker cache:** 
   - Increment `CACHE_NAME` in `service-worker.js` (v8 → v9)
   - Deploy new version
   - Users will auto-update on next visit

## Monitoring

- [ ] Check GitHub Actions deployment logs
- [ ] Monitor browser console for errors (user feedback)
- [ ] Test from multiple browsers/devices
- [ ] Verify search index works after deployment
- [ ] Check PWA installation prompt appears

## Support

If deployment fails:
- Check git log for recent changes
- Verify all files in `data/` are present (226 files, 227 MB)
- Ensure TypeScript build completed successfully
- Check GitHub Pages settings (branch/folder)

