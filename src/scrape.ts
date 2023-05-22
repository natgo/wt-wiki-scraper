import fs from "fs";
import { parseHTML } from "linkedom";
import { format } from "prettier";

import { Final } from "../data/types/final.schema";
import { Wiki, visibility } from "../data/types/wiki.schema";

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./data/data/final.json", "utf-8"));

  const vehicles: {
    ground: string[];
    aircraft: string[];
    helicopter: string[];
  } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  const scrape: Wiki = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  const ground = fs.readdirSync("./wikitext-transpiled/ground/").filter((value) => {
    return value.match(".html");
  });
  const aircraft = fs.readdirSync("./wikitext-transpiled/aircraft/").filter((value) => {
    return value.match(".html");
  });
  const helicopter = fs.readdirSync("./wikitext-transpiled/helicopter/").filter((value) => {
    return value.match(".html");
  });

  ground.forEach((element) => {
    vehicles.ground.push(fs.readFileSync(`./wikitext-transpiled/ground/${element}`, "utf-8"));
  });
  aircraft.forEach((element) => {
    vehicles.aircraft.push(fs.readFileSync(`./wikitext-transpiled/aircraft/${element}`, "utf-8"));
  });
  helicopter.forEach((element) => {
    vehicles.helicopter.push(
      fs.readFileSync(`./wikitext-transpiled/helicopter/${element}`, "utf-8"),
    );
  });

  vehicles.ground.forEach((element, index) => {
    const { document } = parseHTML(element);

    const intname = document.querySelector(".specs_card_main")?.attributes.item(1)?.value;
    const findFinal = final.army.find((value) => {
      return intname === value.intname;
    });
    if (!findFinal || !intname) {
      throw new Error(`no intname for ${intname} ${ground[index]}`);
    }

    const head = document.querySelectorAll(
      ".specs_info .specs_char .specs_char_block .specs_char_line.head",
    );

    // Visibility
    const vehicleVisibility = head[2].querySelector(".value")?.innerHTML.replace("&nbsp;%", "");
    if (!vehicleVisibility) {
      throw new Error("Visibility not found");
    }
    console.log(vehicleVisibility, intname);

    visibility.parse(parseFloat(vehicleVisibility));

    scrape.ground.push({
      intname: intname,
      visibility: parseFloat(vehicleVisibility),
    });
  });
  fs.writeFileSync("./data/data/wiki.json", format(JSON.stringify(scrape), { parser: "json" }));
}

main();
