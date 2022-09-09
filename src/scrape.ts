import { load } from "cheerio";
import fs from "fs";

import { Final } from "./types";

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./out/final.json", "utf-8"));

  const vehicles: {
    ground: string[];
    aircraft: string[];
    helicopter: string[];
  } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  const ground = fs.readdirSync("./wikitext-transpiled/ground/");
  ground.forEach((element) => {
    vehicles.ground.push(fs.readFileSync(`./wikitext-transpiled/ground/${element}`, "utf-8"));
  });
  const aircraft = fs.readdirSync("./wikitext-transpiled/aircraft/");
  aircraft.forEach((element) => {
    vehicles.aircraft.push(fs.readFileSync(`./wikitext-transpiled/aircraft/${element}`, "utf-8"));
  });
  const helicopter = fs.readdirSync("./wikitext-transpiled/helicopter/");
  helicopter.forEach((element) => {
    vehicles.helicopter.push(
      fs.readFileSync(`./wikitext-transpiled/helicopter/${element}`, "utf-8"),
    );
  });
  const $ = load(vehicles.ground[7]);
  const indent = $(".specs_info .specs_char .specs_char_block .specs_char_line.indent");
  const head = $(".specs_info .specs_char .specs_char_block .specs_char_line.head");
  console.log(indent.children(".name").first().next().text());
  indent.children(".name").each((i, el) => {
    if ($(el).text() === "Turret") {
      console.log($(el).next(".value").text());
    }
  });
  head.children(".name").each((i, el) => {
    if ($(el).text() === "Visibility") {
      console.log($(el).next(".value").text());
    }
  });
  head.children(".name").each((i, el) => {
    if ($(el).text() === "Speed") {
      console.log($(indent[i]).children(".value").html());
    }
  });
}

main();
