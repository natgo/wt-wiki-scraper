import axios from "axios";
import decomment from "decomment";
import fs from "fs";
import { format } from "prettier";

import { modernparse } from "./types";
import { Categorymembers, CategorymembersPart, ParsedPage, ParsedWikiPage } from "./wiki.types";

function cleanPages(output: CategorymembersPart[]) {
  output.forEach((element, i, array) => {
    if (
      element.pageid === 46 ||
      element.pageid === 3378 ||
      element.pageid === 66 ||
      element.pageid === 8019 ||
      element.pageid === 3421 ||
      element.pageid === 22858
    ) {
      array.splice(i, 1);
    }
  });

  return output;
}

async function getVehicles(baseQuery: string) {
  let cont = true;
  let contData: string | undefined;
  let categorymembers: CategorymembersPart[] = [];

  while (cont) {
    const response: Categorymembers = await axios.get(
      contData ? `${baseQuery}&cmcontinue='${contData}'` : baseQuery,
    );
    categorymembers = [...categorymembers, ...response.data.query.categorymembers];
    if (response.data.continue) {
      contData = response.data.continue.cmcontinue;
    } else {
      cont = false;
    }
  }
  const output = cleanPages(categorymembers);
  return output;
}

async function download(vehicles: CategorymembersPart[], type: string) {
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";
  const wikiparsequery =
    "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=wikitext";
  vehicles.forEach(async (element) => {
    try {
      const response: ParsedPage = await axios.get(parsequery + `&pageid=${element.pageid}`);
      const wikiresponse: ParsedWikiPage = await axios.get(
        wikiparsequery + `&pageid=${element.pageid}`,
      );
      //console.info(element.title);
      const out: modernparse = {
        title: response.data.parse.title,
        pageid: response.data.parse.pageid,
      };
      fs.writeFileSync(
        `./wikitext/${type}/${encodeURIComponent(element.title)}.json`,
        await format(JSON.stringify(out), { parser: "json" }),
      );
      fs.writeFileSync(
        `./wikitext-transpiled/${type}/${encodeURIComponent(element.title)}.md`,
        wikiresponse.data.parse.wikitext["*"],
      );
      fs.writeFileSync(
        `./wikitext-transpiled/${type}/${encodeURIComponent(element.title)}.html`,
        decomment(response.data.parse.text["*"]),
      );
    } catch (error) {
      throw new Error(JSON.stringify(element));
    }
  });
}

async function categorymembers(categorymembers: CategorymembersPart[]) {
  const wikiparsequery =
    "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=wikitext";
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";

  categorymembers.forEach(async (element) => {
    const wikiresponse: ParsedWikiPage = await axios.get(
      wikiparsequery + `&pageid=${element.pageid}`,
    );
    const response: ParsedPage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    const out: modernparse = {
      title: response.data.parse.title,
      pageid: response.data.parse.pageid,
    };
    fs.writeFileSync(
      `./techtree/ground/${encodeURIComponent(element.title)}.json`,
      await format(JSON.stringify(out), { parser: "json" }),
    );
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(element.title)}.md`,
      await format(wikiresponse.data.parse.wikitext["*"], { parser: "markdown" }),
    );
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(element.title)}.html`,
      await format(decomment(response.data.parse.text["*"]), { parser: "html" }),
    );
  });
}

async function getTechTree() {
  const groundQuery: Categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Ground_vehicles_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const aircraftQuery: Categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Aircraft_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const helicopterQuery: Categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Helicopters_by_country&cmlimit=max&format=json&cmtype=subcat",
  );

  await categorymembers(groundQuery.data.query.categorymembers);
  await categorymembers(aircraftQuery.data.query.categorymembers);
  await categorymembers(helicopterQuery.data.query.categorymembers);
}

async function main() {
  const airQuery =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AAviation&cmlimit=max&format=json&cmtype=page";
  const groundQuery =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AGround+vehicles&cmlimit=max&format=json&cmtype=page";
  const helicopterQuery =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AHelicopters&cmlimit=max&format=json&cmtype=page";
  const fleetQuery =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AFleet&cmlimit=max&format=json&cmtype=page";

  const aircraft = await getVehicles(airQuery);
  const ground = await getVehicles(groundQuery);
  const helicopter = await getVehicles(helicopterQuery);
  const fleet = await getVehicles(fleetQuery);

  // download all vehicle pages
  await download(aircraft, "aircraft");
  await download(ground, "ground");
  await download(helicopter, "helicopter");
  await download(fleet, "fleet");
  console.info("Downloading Wikitexts");

  getTechTree();
  console.info("Downloading Techtrees");
}

main();
