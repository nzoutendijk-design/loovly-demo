#!/usr/bin/env bash
# Builds the site and publishes dist/ to the gh-pages branch (served by GitHub Pages).
# Previous hashed bundles are kept so a visitor holding a cached index.html (Pages caches it
# for 10 minutes) keeps working until their cache refreshes.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run bundle
touch dist/.nojekyll
REMOTE="$(git remote get-url origin)"
PREV="$(mktemp -d)"
if git clone -q --depth 1 -b gh-pages "$REMOTE" "$PREV" 2>/dev/null; then
  cp -n "$PREV"/assets/index-*.js "$PREV"/assets/index-*.css dist/assets/ 2>/dev/null || true
fi
rm -rf "$PREV"
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git -c credential.helper='!gh auth git-credential' push -f "$REMOTE" gh-pages
rm -rf .git
echo "Deployed → https://nzoutendijk-design.github.io/loovly-demo/"
