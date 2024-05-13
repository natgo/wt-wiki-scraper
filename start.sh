#!/bin/sh
set -e

sh ./clean.sh 
bun run build --noEmit || true
bun run src/wiki.ts
bun run src/vehicles.ts

bun run prettier -w wikitext-transpiled/aircraft/*.html || true &
bun run prettier -w wikitext-transpiled/fleet/*.html || true &
bun run prettier -w wikitext-transpiled/ground/*.html || true &
bun run prettier -w wikitext-transpiled/helicopter/*.html || true &

wait

bun run src/economy/economy.ts
bun run src/images.ts
bun run src/shop.ts
bun run src/modifications/modifications.ts
bun run src/scrape.ts
