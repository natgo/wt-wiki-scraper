import fs from "fs";
import { format } from "prettier";

import { Shop, ShopCountry, namevehicles, modernparse } from "./types";

async function main() {
  const shopData: Shop = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/shop.blkx", "utf-8"),
  );

  const result: namevehicles = {
    ground: [],
    aviation: [],
    helicopter: [],
  };

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

  const wiki: {
    ground: { wikiname: string; intname: string }[];
    aviation: { wikiname: string; intname: string }[];
    helicopter: { wikiname: string; intname: string }[];
  } = {
    ground: [],
    aviation: [],
    helicopter: [],
  };

  const ground = fs.readdirSync("./wikitext/ground/");
  const groundPages = fs.readdirSync("./wikitext-transpiled/ground/");
  ground.forEach((element, i) => {
    vehicles.ground.push(JSON.parse(fs.readFileSync(`./wikitext/ground/${element}`, "utf-8")));
    vehiclePages.ground.push(
      fs.readFileSync(`./wikitext-transpiled/ground/${groundPages[i]}`, "utf-8"),
    );
  });
  const aircraft = fs.readdirSync("./wikitext/aircraft/");
  const aircraftPages = fs.readdirSync("./wikitext-transpiled/aircraft/");
  aircraft.forEach((element, i) => {
    vehicles.aviation.push(JSON.parse(fs.readFileSync(`./wikitext/aircraft/${element}`, "utf-8")));
    vehiclePages.aviation.push(
      fs.readFileSync(`./wikitext-transpiled/aircraft/${aircraftPages[i]}`, "utf-8"),
    );
  });
  const helicopter = fs.readdirSync("./wikitext/helicopter/");
  const helicopterPages = fs.readdirSync("./wikitext-transpiled/helicopter/");
  helicopter.forEach((element, i) => {
    vehicles.helicopter.push(
      JSON.parse(fs.readFileSync(`./wikitext/helicopter/${element}`, "utf-8")),
    );
    vehiclePages.helicopter.push(
      fs.readFileSync(`./wikitext-transpiled/helicopter/${helicopterPages[i]}`, "utf-8"),
    );
  });

  vehicles.ground.forEach((element, i) => {
    const match = vehiclePages.ground[i].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      wiki.ground.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(`no match for "${element.title}" pageid: ${element.pageid}`);
    }
  });
  vehicles.aviation.forEach((element, i) => {
    const match = vehiclePages.aviation[i].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      wiki.aviation.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(`no match for "${element.title}" pageid: ${element.pageid}`);
    }
  });
  vehicles.helicopter.forEach((element, i) => {
    const match = vehiclePages.helicopter[i].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      wiki.helicopter.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(`no match for "${element.title}" pageid: ${element.pageid}`);
    }
  });

  Object.entries(shopData).forEach(([key, value]) => {
    const value2 = value as ShopCountry;

    value2.army.range.forEach((element) => {
      Object.entries(element).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir") && typeof value !== "string") {
              const wikifind = wiki.ground.find((element)=>{
                return element.intname === key;
              });
              result.ground.push({ intname: key, wikiname:wikifind?.wikiname });
            }
          });
        } else {
          const wikifind = wiki.ground.find((element)=>{
            return element.intname === key;
          });
          result.ground.push({ intname: key, wikiname:wikifind?.wikiname });
        }
      });
    });

    value2.aviation.range.forEach((element) => {
      Object.entries(element).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir") && typeof value !== "string") {
              const wikifind = wiki.aviation.find((element)=>{
                return element.intname === key;
              });
              result.aviation.push({ intname: key, wikiname:wikifind?.wikiname });
            }
          });
        } else {
          const wikifind = wiki.aviation.find((element)=>{
            return element.intname === key;
          });
          result.aviation.push({ intname: key, wikiname:wikifind?.wikiname });
        }
      });
    });

    value2.helicopters.range.forEach((element) => {
      Object.entries(element).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir") && typeof value !== "string") {
              const wikifind = wiki.helicopter.find((element)=>{
                return element.intname === key;
              });
              result.helicopter.push({ intname: key, wikiname:wikifind?.wikiname });
            }
          });
        } else {
          const wikifind = wiki.helicopter.find((element)=>{
            return element.intname === key;
          });
          result.helicopter.push({ intname: key, wikiname:wikifind?.wikiname });
        }
      });
    });
  });
  fs.writeFileSync("./out/vehicles.json", format(JSON.stringify(result), { parser: "json" }));
}

main();
