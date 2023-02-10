# WT Wiki scraper
<p align="center">
  <a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
  <img alt="GitHub" src="https://img.shields.io/github/license/natgo/wt-wiki-scraper">
</p>

<p align="center">
  <a href="https://forthebadge.com/"><img src="https://forthebadge.com/images/badges/made-with-typescript.svg" alt="forthebadge"/></a>
  <a href="https://forthebadge.com/"><img src="https://forthebadge.com/images/badges/open-source.svg" alt="forthebadge"/></a>
</p>
War thunder wiki scraper and data collector

All the data in final.json comes from game files

### How does it work
1. The app starts by querying a public api on wiki.warthunder.com for vehicles and downloads all vehicle pages
2. Parses the internal vehicle name from wiki pages and combine them with internal gamedata
3. Reads from game files data for all vehicles and parses it to out/final.json 
4. Downloads all garageimages from wiki.warthunder.com and saves them to garageimages directory
5. Parses and creates shop.json from shop.blkx

## Development

Install dependencies:

```bash
pnpm install # or npm install
```

In order to run building in watch mode, run:

```bash
pnpm build --watch # or npm run build --watch
```


To prettify source code, run:

```bash
pnpm pretty # or npm run pretty
```

## Build

In order to do a build, run:

```bash
pnpm build # npm run build
```

# Running

Just run 

```bash
pnpm start # npm run start
```

the output will be in out/ directory

# Todo
- [ ] Add lint-staged
- [ ] Make a CI/CD pipeline to wt-app
- [x] Complete the scrape module
- [ ] Improve the file structure
- [x] Driver thermal
- [x] Add machineguns
