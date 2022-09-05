import fs from "fs";
import { load } from "cheerio";


import { Final, savedparse } from "./types";

async function main() {
  const final: Final = JSON.parse(
    fs.readFileSync("./out/final.json", "utf-8"),
  );

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
  const type = $(".specs_info .specs_char .specs_char_block .specs_char_line.indent");
  console.log(type.children(".name").first())
  type.children(".name").each((i,el)=> {
    //console.log(el);
    if ($(this).text() === "Turret") {
      const selectedText = $(this).text();
      console.log($(this).next(".value").text());
    }
  });
  //console.log(type.children(".name").next(".value").html());
}

main();