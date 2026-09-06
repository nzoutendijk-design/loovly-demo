#!/usr/bin/env bash
# Builds the site and publishes dist/ to the gh-pages branch (served by GitHub Pages).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run bundle
touch dist/.nojekyll
REMOTE="$(git remote get-url origin)"
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git -c credential.helper='!gh auth git-credential' push -f "$REMOTE" gh-pages
rm -rf .git
echo "Deployed → https://nzoutendijk-design.github.io/loovly-demo/"
