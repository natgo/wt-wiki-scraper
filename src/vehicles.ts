import fs from "fs";
import { format } from "prettier";

import { Shop, ShopCountry, ShopRange, modernparse, namevehicle, namevehicles } from "./types";

interface Wiki {
  intname: string;
  wikiname: string;
  marketplace?: string;
  store?: string;
}

function vehiclesLoop(vehicles: modernparse[], vehiclePages: string[]) {
  const wiki: Wiki[] = [];
  vehicles.forEach((element, index) => {
    const wikinameMatch = vehiclePages[index].match(/code\s?=\s?([^\n]*)/);
    const marketplaceMatch = vehiclePages[index].match(/markets?=\s?([^\n]*)/);
    const storeMatch = vehiclePages[index].match(/store?=\s?([^\n]*)/);

    if (wikinameMatch) {
      if (marketplaceMatch) {
        wiki.push({
          intname: wikinameMatch[1],
          wikiname: element.title,
          marketplace: marketplaceMatch[1],
        });
      } else {
        if (storeMatch) {
          wiki.push({
            intname: wikinameMatch[1],
            wikiname: element.title,
            store: storeMatch[1],
          });
        } else {
          wiki.push({
            intname: wikinameMatch[1],
            wikiname: element.title,
          });
        }
      }
    } else {
      console.log(`no match for "${element.title}" pageid: ${element.pageid}`);
    }
  });

  return wiki;
}

function shopLoop(country: ShopRange, wiki: Wiki[]) {
  const result: namevehicle[] = [];
  country.range.forEach((element) => {
    Object.entries(element).forEach(([key, value]) => {
      if ("image" in value) {
        Object.entries(value).forEach(([key, value]) => {
          if (!(key === "image" || key === "reqAir") && typeof value !== "string") {
            const wikifind = wiki.find((element) => {
              return element.intname === key;
            });
            result.push({ intname: key, ...wikifind });
          }
        });
      } else {
        const wikifind = wiki.find((element) => {
          return element.intname === key;
        });
        result.push({ intname: key, ...wikifind });
      }
    });
  });
  return result;
}

async function main(dev: boolean) {
  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const vehicles: {
    ground: modernparse[];
    aviation: modernparse[];
    helicopter: modernparse[];
  } = {
    ground: [],
    aviation: [],
    helicopter: [],
  };

  const vehiclePages: {
    ground: string[];
    aviation: string[];
    helicopter: string[];
  } = {
    ground: [],
    aviation: [],
    helicopter: [],
  };

  const ground = fs.readdirSync("./wikitext/ground/");
  const aircraft = fs.readdirSync("./wikitext/aircraft/");
  const helicopter = fs.readdirSync("./wikitext/helicopter/");

  const groundPages = fs.readdirSync("./wikitext-transpiled/ground/").filter((value) => {
    return value.match(".md");
  });
  const aircraftPages = fs.readdirSync("./wikitext-transpiled/aircraft/").filter((value) => {
    return value.match(".md");
  });
  const helicopterPages = fs.readdirSync("./wikitext-transpiled/helicopter/").filter((value) => {
    return value.match(".md");
  });

  ground.forEach((element, i) => {
    vehicles.ground.push(JSON.parse(fs.readFileSync(`./wikitext/ground/${element}`, "utf-8")));
    vehiclePages.ground.push(
      fs.readFileSync(`./wikitext-transpiled/ground/${groundPages[i]}`, "utf-8"),
    );
  });
  aircraft.forEach((element, i) => {
    vehicles.aviation.push(JSON.parse(fs.readFileSync(`./wikitext/aircraft/${element}`, "utf-8")));
    vehiclePages.aviation.push(
      fs.readFileSync(`./wikitext-transpiled/aircraft/${aircraftPages[i]}`, "utf-8"),
    );
  });
  helicopter.forEach((element, i) => {
    vehicles.helicopter.push(
      JSON.parse(fs.readFileSync(`./wikitext/helicopter/${element}`, "utf-8")),
    );
    vehiclePages.helicopter.push(
      fs.readFileSync(`./wikitext-transpiled/helicopter/${helicopterPages[i]}`, "utf-8"),
    );
  });

  const wiki: {
    ground: Wiki[];
    aviation: Wiki[];
    helicopter: Wiki[];
  } = {
    ground: vehiclesLoop(vehicles.ground, vehiclePages.ground),
    aviation: vehiclesLoop(vehicles.aviation, vehiclePages.aviation),
    helicopter: vehiclesLoop(vehicles.helicopter, vehiclePages.helicopter),
  };

  const result: namevehicles = {
    ground: [],
    aviation: [],
    helicopter: [],
  };

  Object.values(shopData).forEach((value) => {
    const value2 = value as ShopCountry;

    result.ground.push(...shopLoop(value2.army, wiki.ground));
    result.aviation.push(...shopLoop(value2.aviation, wiki.aviation));
    result.helicopter.push(...shopLoop(value2.helicopters, wiki.helicopter));
  });
  fs.writeFileSync(
    `./out/${dev ? "vehicles-dev" : "vehicles"}.json`,
    format(JSON.stringify(result), { parser: "json" }),
  );
}

main(false);
main(true);
