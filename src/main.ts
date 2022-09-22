import axios, { AxiosResponse } from "axios";
import decomment from "decomment";
import fs from "fs";
import { check, format } from "prettier";

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

async function getGroundVehicles() {
  const query =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AGround+vehicles&cmlimit=max&format=json&cmtype=page";

  const response: categorymembers = await axios.get(query);
  if (response.data.continue) {
    const response2: categorymembers = await axios.get(
      query + `&cmcontinue='${response.data.continue.cmcontinue}'`,
    );
    return response.data.query.categorymembers.concat(response2.data.query.categorymembers);
  } else {
    return response.data.query.categorymembers;
  }
}

async function getAircraft() {
  const query =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AAviation&cmlimit=max&format=json&cmtype=page";

  const response: categorymembers = await axios.get(query);
  if (response.data.continue) {
    const response2: categorymembers = await axios.get(
      query + `&cmcontinue='${response.data.continue.cmcontinue}'`,
    );
    return response.data.query.categorymembers.concat(response2.data.query.categorymembers);
  } else {
    return response.data.query.categorymembers;
  }
}

async function getHelicopters() {
  const query =
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category%3AHelicopters&cmlimit=max&format=json&cmtype=page";

  const response: categorymembers = await axios.get(query);
  if (response.data.continue) {
    const response2: categorymembers = await axios.get(
      query + `&cmcontinue='${response.data.continue.cmcontinue}'`,
    );
    return response.data.query.categorymembers.concat(response2.data.query.categorymembers);
  } else {
    return response.data.query.categorymembers;
  }
}

function downloand(vehicles: categorymemberspart[], type: string) {
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";
  vehicles.forEach(async (element) => {
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    console.info(element.title);
    const out: modernparse = {
      title: response.data.parse.title,
      pageid: response.data.parse.pageid,
    };
    fs.writeFileSync(
      `./wikitext/${type}/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(out), { parser: "json" }),
    );
    fs.writeFileSync(
      `./wikitext-transpiled/${type}/${encodeURIComponent(element.title)}.html`,
      decomment(response.data.parse.text["*"]),
    );
  });
}

async function getTechTree() {
  const parsequery = "https://wiki.warthunder.com/api.php?action=parse&format=json&prop=text";
  const groundQuery: categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Ground_vehicles_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const aircraftQuery: categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Aircraft_by_country&cmlimit=max&format=json&cmtype=subcat",
  );
  const helicopterQuery: categorymembers = await axios.get(
    "https://wiki.warthunder.com/api.php?action=query&list=categorymembers&cmtitle=Category:Helicopters_by_country&cmlimit=max&format=json&cmtype=subcat",
  );

  groundQuery.data.query.categorymembers.forEach(async (element) => {
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    fs.writeFileSync(
      `./techtree/ground/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(response.data.parse), { parser: "json" }),
    );
  });
  aircraftQuery.data.query.categorymembers.forEach(async (element) => {
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    fs.writeFileSync(
      `./techtree/aircraft/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(response.data.parse), { parser: "json" }),
    );
  });
  helicopterQuery.data.query.categorymembers.forEach(async (element) => {
    const response: parsedpage = await axios.get(parsequery + `&pageid=${element.pageid}`);
    fs.writeFileSync(
      `./techtree/helicopter/${encodeURIComponent(element.title)}.json`,
      format(JSON.stringify(response.data.parse), { parser: "json" }),
    );
  });
}

function transpile(techtree: { ground: string[]; aircraft: string[]; helicopter: string[] }) {
  techtree.ground.forEach((element) => {
    const parsed: savedparse = JSON.parse(element);
    const vehicle = decomment(parsed.text["*"]);
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(parsed.title)}.html`,
      format(vehicle, { parser: "html" }),
    );
  });
  techtree.aircraft.forEach((element) => {
    const parsed: savedparse = JSON.parse(element);
    const vehicle = decomment(parsed.text["*"]);
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(parsed.title)}.html`,
      format(vehicle, { parser: "html" }),
    );
  });
  techtree.helicopter.forEach((element) => {
    const parsed: savedparse = JSON.parse(element);
    const vehicle = decomment(parsed.text["*"]);
    fs.writeFileSync(
      `./parsed/${encodeURIComponent(parsed.title)}.html`,
      format(vehicle, { parser: "html" }),
    );
  });
}

async function main() {

  const aircraft = await getAircraft();
  const ground = await getGroundVehicles();
  const helicopter = await getHelicopters();

  //download all vehicle pages
  downloand(aircraft, "aircraft");
  downloand(ground, "ground");
  downloand(helicopter, "helicopter");
  console.info("Downloading Wikitexts");

  getTechTree();
  console.info("Downloading Techtrees");

  const techtree: { ground: string[]; aircraft: string[]; helicopter: string[] } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };
  const groundTechtree = fs.readdirSync("./techtree/ground/");
  groundTechtree.forEach((element) => {
    techtree.ground.push(fs.readFileSync(`./techtree/ground/${element}`, "utf-8"));
  });
  const aircraftTechtree = fs.readdirSync("./techtree/aircraft/");
  aircraftTechtree.forEach((element) => {
    techtree.aircraft.push(fs.readFileSync(`./techtree/aircraft/${element}`, "utf-8"));
  });
  const helicopterTechtree = fs.readdirSync("./techtree/helicopter/");
  helicopterTechtree.forEach((element) => {
    techtree.helicopter.push(fs.readFileSync(`./techtree/helicopter/${element}`, "utf-8"));
  });
  transpile(techtree);

}
main();
