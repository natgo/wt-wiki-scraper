#!/bin/sh
set -e

sh ./clean.sh 
pnpm tsc || true
node dist/src/wiki.js
node dist/src/vehicles.js

pnpm prettier -w wikitext-transpiled/aircraft/*.html || true &
pnpm prettier -w wikitext-transpiled/fleet/*.html || true &
pnpm prettier -w wikitext-transpiled/ground/*.html || true &
pnpm prettier -w wikitext-transpiled/helicopter/*.html || true &

wait

node dist/src/economy/economy.js
node dist/src/images.js
node dist/src/shop.js
node dist/src/modifications/modifications.js
node dist/src/scrape.js
