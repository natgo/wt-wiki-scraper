#!/bin/sh
set -e

sh ./clean.sh 
bun run build || true
bun run dist/src/wiki.js
bun run dist/src/vehicles.js

bun run prettier -w wikitext-transpiled/aircraft/*.html || true &
bun run prettier -w wikitext-transpiled/fleet/*.html || true &
bun run prettier -w wikitext-transpiled/ground/*.html || true &
bun run prettier -w wikitext-transpiled/helicopter/*.html || true &

wait

bun run dist/src/economy/economy.js
bun run dist/src/images.js
bun run dist/src/shop.js
bun run dist/src/modifications/modifications.js
bun run dist/src/scrape.js
