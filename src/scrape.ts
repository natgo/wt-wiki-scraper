import fs from "fs";
import { parseHTML } from "linkedom";

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

  vehicles.ground.forEach((element) => {
    const { document } = parseHTML(element);
    const indent = document.querySelectorAll(
      ".specs_info .specs_char .specs_char_block .specs_char_line.indent",
    );
    const head = document.querySelectorAll(
      ".specs_info .specs_char .specs_char_block .specs_char_line.head",
    );
    // AB Top speed
    const ab_top = indent[2]
      .querySelector(".value")
      ?.innerHTML.replaceAll(/\s/g, "")
      .replace("km/h", "")
      .split("/");
    console.log(ab_top);
    // RB Top speed
    const rb_top = indent[3]
      .querySelector(".value")
      ?.innerHTML.replaceAll(/\s/g, "")
      .replace("km/h", "")
      .split("/");
    console.log(rb_top);
    // Visibility
    const visibility = head[2].querySelector(".value")?.innerHTML.replace("&nbsp;%", "");
    console.log(visibility);
  });
}

main();
