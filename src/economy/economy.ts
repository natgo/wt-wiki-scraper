import fs from "fs";
import { format } from "prettier";

import {
  Final,
  HelicopterOptics,
  aircraftTypeSchema,
  boatTypeSchema,
  groundTypeSchema,
  helicopterOpticsSchema,
  helicopterTypeSchema,
  shipTypeSchema,
} from "../../data/types/final.schema";
import { langCsvToJSON } from "../csvJSON";
import { parseLang } from "../lang";
import {
  AirVehicle,
  Economy,
  GroundVehicle,
  Mods,
  ShipVehicle,
  Shop,
  UnitData,
  namevehicles,
} from "../types";
import { commonVehicle } from "./commonVehicle";
import { drive, groundVehicle } from "./groundVehicle";
import { sensors } from "./sensors";
import { vehicleBallistic } from "./vehicleBallistic";
import { vehiclePreset } from "./vehiclePreset";
import { vehicleType } from "./vehicleType";

async function main(dev: boolean) {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/wpcost.blkx`,
      "utf-8",
    ),
  );
  const unitData: Record<string, UnitData> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/unittags.blkx`,
      "utf-8",
    ),
  );

  const vehicles: namevehicles = JSON.parse(
    fs.readFileSync(`./data/data/${dev ? "vehicles-dev" : "vehicles"}.json`, "utf-8"),
  );

  const weaponry_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units_weaponry.csv`,
      "utf-8",
    ),
  );

  const units_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units.csv`,
      "utf-8",
    ),
  );

  const modification_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units_modifications.csv`,
      "utf-8",
    ),
  );

  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const modifications: Mods = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/modifications.blkx`,
      "utf-8",
    ),
  );

  const final: Final = {
    version: fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/aces.vromfs.bin_u/version`,
      "utf-8",
    ),
    army: [],
    aviation: [],
    helicopters: [],
    ship: [],
    boat: [],
  };

  vehicles.ground.forEach((element) => {
    const vehicleData: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    final.army.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "army"),
      ...groundTypeSchema.parse(vehicleType(vehicleUnit, "ground")),
      type: "army",
      ...drive(vehicleData),
      ...groundVehicle(vehicleData, modifications, weaponry_lang, modification_lang, dev),
    });
  });
  vehicles.aviation.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    final.aviation.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "aviation"),
      ...aircraftTypeSchema.parse(vehicleType(vehicleUnit, "aircraft")),
      type: "aviation",
      ballistic_computer: vehicleBallistic(vehicleData),
      secondary_weapon_preset: vehiclePreset(vehicleData, weaponry_lang, dev),
    });
  });
  vehicles.helicopter.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    const sight =
      vehicleData.cockpit.sightInFov && vehicleData.cockpit.sightOutFov
        ? { zoomInFov: vehicleData.cockpit.sightInFov, zoomOutFov: vehicleData.cockpit.sightOutFov }
        : undefined;

    let optics: HelicopterOptics | undefined = {
      sight: sight ? { ...sight } : undefined,
    };
    if (vehicleData.modifications) {
      Object.values(vehicleData.modifications).forEach((value) => {
        if (value.effects?.nightVision) {
          if (sight) {
            optics = {
              pilot: {
                ir: value.effects.nightVision.pilotIr,
              },
              gunner: {
                ir: value.effects.nightVision.gunnerIr,
              },
              sight: {
                ...sight,
                thermal: value.effects.nightVision.sightThermal,
              },
            };
          } else {
            optics = {
              pilot: {
                ir: value.effects.nightVision.pilotIr,
              },
              gunner: {
                ir: value.effects.nightVision.gunnerIr,
              },
            };
          }
        }
      });
    }

    final.helicopters.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "helicopters"),
      ...helicopterTypeSchema.parse(vehicleType(vehicleUnit, "helicopter")),
      type: "helicopters",
      ...sensors(vehicleData, dev),
      optics: helicopterOpticsSchema.parse(optics),
      ballistic_computer: vehicleBallistic(vehicleData),
      secondary_weapon_preset: vehiclePreset(vehicleData, weaponry_lang, dev),
    });
  });
  vehicles.ships.forEach((element) => {
    const vehicleData: ShipVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/ships/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    final.ship.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "ships"),
      ...shipTypeSchema.parse(vehicleType(vehicleUnit, "ship")),
      type: "ship",
    });
  });
  vehicles.boats.forEach((element) => {
    const vehicleData: ShipVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/ships/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    final.boat.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "boats"),
      ...boatTypeSchema.parse(vehicleType(vehicleUnit, "boat")),
      type: "boat",
    });
  });

  fs.writeFileSync(
    `./data/data/${dev ? "final-dev" : "final"}.json`,
    format(JSON.stringify(final), { parser: "json" }),
  );
}

main(false);
main(true);
