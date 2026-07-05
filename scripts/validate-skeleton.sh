#!/usr/bin/env bash
# Six local build assertions for the subfolio-astro-docs walking skeleton
# (Phase 1, plan 01-01). Run AFTER `npm run build`. Exits non-zero if any of
# assertions 1-5 fail. Assertion 6 (preview) is a documented manual smoke check.
#
# NOTE: the unprefixed-link assertion greps dist/index.html ONLY (never this
# scripts/ dir), so the grep pattern below cannot self-invalidate.
set -uo pipefail

DIST="dist"
BASE_SEG="subfolio-astro-docs"
fail=0

pass() { printf 'PASS: %s\n' "$1"; }
bad()  { printf 'FAIL: %s\n' "$1"; fail=1; }

# 1. .nojekyll landed in the build output (D-06 — else GitHub Pages' Jekyll
#    strips _astro/ and pagefind/).
[ -f "$DIST/.nojekyll" ] && pass ".nojekyll present" || bad ".nojekyll missing"

# 2. landing -> docs link is base-prefixed.
grep -q 'href="/subfolio-astro-docs/docs/"' "$DIST/index.html" \
  && pass "landing->docs link is base-prefixed" \
  || bad "landing->docs link missing or unprefixed"

# 3. no unprefixed internal /docs link leaked into the landing HTML.
if grep -Eq 'href="/docs' "$DIST/index.html"; then
  bad "found unprefixed /docs link in dist/index.html"
else
  pass "no unprefixed /docs link"
fi

# 4. docs stub page built (Starlight rendered it via docsLoader).
[ -f "$DIST/docs/index.html" ] && pass "docs stub page built" || bad "docs page missing"

# 5. Pagefind search index built during `astro build` (SITE-04).
[ -f "$DIST/pagefind/pagefind.js" ] && pass "pagefind index built" || bad "pagefind missing"

# 6. Preview smoke check — documented, run separately (Pagefind + render only
#    work under build+preview, never `astro dev` — RESEARCH Pitfall 4):
printf 'NOTE: assertion 6 (manual) — run `npm run preview`, then:\n'
printf '      curl -s http://localhost:4321/%s/ | grep "View the Docs"\n' "$BASE_SEG"

if [ "$fail" -ne 0 ]; then
  echo "RESULT: FAIL (one or more of assertions 1-5 failed)"
  exit 1
fi
echo "RESULT: PASS (assertions 1-5 green)"
