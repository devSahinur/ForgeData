#!/usr/bin/env bash
# Run after `npm run build`: bash examples/cli-usage.sh
set -e

node dist/cli.js --help
echo "---"
node dist/cli.js list --module color
echo "---"
node dist/cli.js generate person.fullName --seed 42
echo "---"
node dist/cli.js generate internet.email --count 3 --seed 42
echo "---"
node dist/cli.js generate location.country --locale ja --json
