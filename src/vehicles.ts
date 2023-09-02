import fs from "fs";
import { format } from "prettier";

import {
  Shop,
  ShopCountry,
  ShopGroup,
  ShopItem,
  ShopRange,
  modernparse,
  namevehicle,
  namevehicles,
} from "./types";

interface Wiki {
  intname: string;
  wikiname: string;
  marketplace?: string;
  store?: string;
}

function vehiclesLoop(vehicles: modernparse[], vehiclePages: string[]) {
  const wiki: Wiki[] = [];
  vehicles.forEach((element, index) => {
    const wikinameMatch = vehiclePages[index].match(/code\s?=\s?([^\n\s]*)/);
    const marketplaceMatch = vehiclePages[index].match(/markets?=\s?([^\n]*)/);
    const storeMatch = vehiclePages[index].match(/store?=\s?([^\n\s]*)/);

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
      console.log("no match for", element);
    }
  });

  return wiki;
}

function parseRangeColumn(column: Record<string, ShopItem | ShopGroup>, wiki: Wiki[]) {
  const result: namevehicle[] = [];

  Object.entries(column).forEach(([key, value]) => {
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

  return result;
}

function shopLoop(country: ShopRange | undefined, wiki: Wiki[]): namevehicle[] | undefined {
  const result: namevehicle[] = [];
  if (!country) {
    console.error("no tree for undefined");
    return;
  }

  if (!Array.isArray(country.range)) {
    result.push(...parseRangeColumn(country.range, wiki));
    return result;
  }

  country.range.forEach((element) => {
    result.push(...parseRangeColumn(element, wiki));
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
    fleet: modernparse[];
  } = {
    ground: [],
    aviation: [],
    helicopter: [],
    fleet: [],
  };

  const vehiclePages: {
    ground: string[];
    aviation: string[];
    helicopter: string[];
    fleet: string[];
  } = {
    ground: [],
    aviation: [],
    helicopter: [],
    fleet: [],
  };

  const ground = fs.readdirSync("./wikitext/ground/");
  const aircraft = fs.readdirSync("./wikitext/aircraft/");
  const helicopter = fs.readdirSync("./wikitext/helicopter/");
  const fleet = fs.readdirSync("./wikitext/fleet/");

  const groundPages = fs.readdirSync("./wikitext-transpiled/ground/").filter((value) => {
    return value.match(".md");
  });
  const aircraftPages = fs.readdirSync("./wikitext-transpiled/aircraft/").filter((value) => {
    return value.match(".md");
  });
  const helicopterPages = fs.readdirSync("./wikitext-transpiled/helicopter/").filter((value) => {
    return value.match(".md");
  });
  const fleetPages = fs.readdirSync("./wikitext-transpiled/fleet/").filter((value) => {
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
  fleet.forEach((element, i) => {
    vehicles.fleet.push(JSON.parse(fs.readFileSync(`./wikitext/fleet/${element}`, "utf-8")));
    vehiclePages.fleet.push(
      fs.readFileSync(`./wikitext-transpiled/fleet/${fleetPages[i]}`, "utf-8"),
    );
  });

  const wiki: {
    ground: Wiki[];
    aviation: Wiki[];
    helicopter: Wiki[];
    fleet: Wiki[];
  } = {
    ground: vehiclesLoop(vehicles.ground, vehiclePages.ground),
    aviation: vehiclesLoop(vehicles.aviation, vehiclePages.aviation),
    helicopter: vehiclesLoop(vehicles.helicopter, vehiclePages.helicopter),
    fleet: vehiclesLoop(vehicles.fleet, vehiclePages.fleet),
  };

  const result: namevehicles = {
    ground: [],
    aviation: [],
    helicopter: [],
    ships: [],
    boats: [],
  };

  Object.values(shopData).forEach((value) => {
    const value2 = value as ShopCountry;

    const army = shopLoop(value2.army, wiki.ground);
    if (army) {
      result.ground.push(...army);
    }

    const aviation = shopLoop(value2.aviation, wiki.aviation);
    if (aviation) {
      result.aviation.push(...aviation);
    }

    const helicopter = shopLoop(value2.helicopters, wiki.helicopter);
    if (helicopter) {
      result.helicopter.push(...helicopter);
    }

    const ships = shopLoop(value2.ships, wiki.fleet);
    if (ships) {
      result.ships.push(...ships);
    }

    const boats = shopLoop(value2.boats, wiki.fleet);
    if (boats) {
      result.boats.push(...boats);
    }
  });
  fs.writeFileSync(
    `./data/data/${dev ? "vehicles-dev" : "vehicles"}.json`,
    await format(JSON.stringify(result), { parser: "json" }),
  );
}

main(false);
main(true);
