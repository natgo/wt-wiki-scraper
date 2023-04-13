import axios, { AxiosResponse } from "axios";
import decomment from "decomment";
import fs from "fs";
import { format } from "prettier";

import { modernparse } from "./types";

interface categorymembers extends AxiosResponse {
  data: {
    batchcomplete: string;
    continue?: { cmcontinue: string; continue: string };
    limits: { categorymembers: number };
    query: {
      categorymembers: categorymemberspart[];
    };
  };
}

interface parsedpage extends AxiosResponse {
  data: {
    parse: savedparse;
  };
}

interface parsedwikipage extends AxiosResponse {
  data: {
    parse: savedwikiparse;
  };
}

interface savedwikiparse {
  title: string;
  pageid: number;
  wikitext: {
    "*": string;
  };
}

interface savedparse {
  title: string;
  pageid: number;
  text: {
    "*": string;
  };
}

interface categorymemberspart {
  pageid: number;
  ns: number;
  title: string;
}

function cleanPages(output: categorymemberspart[]) {
  output.forEach((element, i, array) => {
    if (
      element.pageid === 46 ||
      element.pageid === 3378 ||
      element.pageid === 66 ||
      element.pageid === 8019 ||
      element.pageid === 3421
    ) {
      array.splice(i, 1);
    }
  });

  return output;
}

async function getVehicles(baseQuery: string) {
  let cont = true;
  let contData: string | undefined = undefined;
  let categorymembers: categorymemberspart[] = [];

  while (cont) {
    const response: categorymembers = await axios.get(
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

async function download(vehicles: categorymemberspart[], type: string) {
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";
  const wikiparsequery =
    "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=wikitext";
  vehicles.forEach(async (element) => {
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    const wikiresponse: parsedwikipage = await axios.get(
      wikiparsequery + `&pageid=${element.pageid}`,
    );
    //console.info(element.title);
    const out: modernparse = {
      title: response.data.parse.title,
      pageid: response.data.parse.pageid,
    };
    fs.writeFileSync(
      `./wikitext/${type}/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(out), { parser: "json" }),
    );
    fs.writeFileSync(
      `./wikitext-transpiled/${type}/${encodeURIComponent(element.title)}.md`,
      wikiresponse.data.parse.wikitext["*"],
    );
    fs.writeFileSync(
      `./wikitext-transpiled/${type}/${encodeURIComponent(element.title)}.html`,
      decomment(response.data.parse.text["*"]),
    );
  });
}

async function categorymembers(categorymembers: categorymemberspart[]) {
  const wikiparsequery =
    "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=wikitext";
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";

  categorymembers.forEach(async (element) => {
    const wikiresponse: parsedwikipage = await axios.get(
      wikiparsequery + `&pageid=${element.pageid}`,
    );
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    const out: modernparse = {
      title: response.data.parse.title,
      pageid: response.data.parse.pageid,
    };
    fs.writeFileSync(
      `./techtree/ground/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(out), { parser: "json" }),
    );
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(element.title)}.md`,
      format(wikiresponse.data.parse.wikitext["*"], { parser: "markdown" }),
    );
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(element.title)}.html`,
      format(decomment(response.data.parse.text["*"]), { parser: "html" }),
    );
  });
}

async function getTechTree() {
  const groundQuery: categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Ground_vehicles_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const aircraftQuery: categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Aircraft_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const helicopterQuery: categorymembers = await axios.get(
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

  // no boat?
  getTechTree();
  console.info("Downloading Techtrees");
}

main();
