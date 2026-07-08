#!/usr/bin/env bash
# Manual publish helper. NOT run automatically by CI or by any tooling —
# you run this yourself, locally, after `npm login`.
#
#   npm login
#   bash scripts/publish.sh
#
# It re-runs the full preflight (lint, typecheck, 100%-coverage test, build)
# before publishing, so a broken build can never reach npm. Aborts on the
# first failure (`set -e`) — nothing is published unless every check passes.
set -e

cd "$(dirname "$0")/.."

echo "==> Preflight: lint, typecheck, test (100% coverage), build"
npm run preflight

echo "==> Verifying npm auth (npm login must have been run already)"
npm whoami

echo "==> Package contents that will be published:"
npm pack --dry-run

read -r -p "Publish forgedata@$(node -p "require('./package.json').version") to npm now? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted. Nothing was published."
  exit 1
fi

npm publish --access public

echo "==> Published. Tag the release in git, e.g.:"
echo "    git tag v$(node -p "require('./package.json').version") && git push --tags"
