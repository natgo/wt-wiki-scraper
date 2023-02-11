import fs from "fs";
import { parseHTML } from "linkedom";
import { format } from "prettier";

import { Final, ScrapeFull, topSpeed, visibility } from "./types";

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

  const scrape: ScrapeFull = {
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
    const findFinal = final.ground.find((value) => {
      return intname === value.intname;
    });
    if (!findFinal || !intname) {
      throw new Error(`no intname for ${intname} ${ground[index]}`);
    }

    const indent = document.querySelectorAll(
      ".specs_info .specs_char .specs_char_block .specs_char_line.indent",
    );
    const head = document.querySelectorAll(
      ".specs_info .specs_char .specs_char_block .specs_char_line.head",
    );

    // Top speed
    let ab_top: number[] = [];
    let rb_top: number[] = [];
    let ab_stop = false;
    let rb_stop = false;

    indent.forEach((element) => {
      if (element.children[0].innerHTML === "AB" && !ab_stop) {
        ab_top = element.children[1].innerHTML
          .replaceAll(/\s/g, "")
          .replace("km/h", "")
          .split("/")
          .map((value) => {
            return parseFloat(value);
          });
        ab_stop = true;
      }
    });
    indent.forEach((element) => {
      if (element.children[0].innerHTML === "RB and SB" && !rb_stop) {
        rb_top = element.children[1].innerHTML
          .replaceAll(/\s/g, "")
          .replace("km/h", "")
          .split("/")
          .map((value) => {
            return parseFloat(value);
          });
        rb_stop = true;
      }
    });

    console.log(ab_top, ground[index]);
    console.log(rb_top, ground[index]);

    topSpeed.parse(ab_top);
    topSpeed.parse(rb_top);

    // Visibility
    const vehicleVisibility = head[2].querySelector(".value")?.innerHTML.replace("&nbsp;%", "");
    if (!vehicleVisibility) {
      throw new Error("Visibility not found");
    }
    console.log(vehicleVisibility);

    visibility.parse(parseFloat(vehicleVisibility));

    scrape.ground.push({
      intname: intname,
      ab_top_speed: ab_top,
      rb_top_speed: rb_top,
      visibility: parseFloat(vehicleVisibility),
    });
  });
  fs.writeFileSync("./out/wiki.json", format(JSON.stringify(scrape), { parser: "json" }));
}

main();
