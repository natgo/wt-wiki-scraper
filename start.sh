#!/bin/sh
set -e

sh ./clean.sh 
pnpm tsc || true
node dist/wiki.js
node dist/vehicles.js

pnpm prettier -w wikitext-transpiled/aircraft/*.html || true &
pnpm prettier -w wikitext-transpiled/fleet/*.html || true &
pnpm prettier -w wikitext-transpiled/ground/*.html || true &
pnpm prettier -w wikitext-transpiled/helicopter/*.html || true &

wait

node dist/economy/economy.js
node dist/images.js
node dist/shop.js
node dist/modifications/modifications.js
node dist/scrape.js
