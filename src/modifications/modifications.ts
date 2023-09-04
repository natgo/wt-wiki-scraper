import fs from "fs";
import { format } from "prettier";
import { AirVehicle, Economy, GroundVehicle, LangData, Mods, ShipVehicle } from "types";

import { Final, VehicleProps } from "../../data/types/final.schema";
import {
  BaseMod,
  ModClass,
  ModClassName,
  Modifications,
  VehicleMods,
  modClassName,
} from "../../data/types/modifications.schema";
import { langCsvToJSON } from "../csvJSON";
import { parseLang } from "../lang";

async function main(dev: boolean) {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/wpcost.blkx`,
      "utf-8",
    ),
  );

  const modification_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units_modifications.csv`,
      "utf-8",
    ),
  );

  const weaponry_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units_weaponry.csv`,
      "utf-8",
    ),
  );

  const final: Final = JSON.parse(
    fs.readFileSync(`./data/data/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );

  const modifications: Mods = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/modifications.blkx`,
      "utf-8",
    ),
  );

  const modFinal: Modifications = {
    army: [],
    aviation: [],
    helicopters: [],
    ship: [],
    boat: [],
  };

  final.army.forEach((element) => {
    const vehicleData: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    //const vehicleEconomy = economy[element.intname];
    const mods = modificationLoop(
      element,
      vehicleData,
      modifications,
      element,
      modification_lang,
      weaponry_lang,
    );
    if (mods) {
      modFinal.army.push(mods);
    }
  });
  final.aviation.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    //const vehicleEconomy = economy[element.intname];
    const mods = modificationLoop(
      element,
      vehicleData,
      modifications,
      element,
      modification_lang,
      weaponry_lang,
    );
    if (mods) {
      modFinal.aviation.push(mods);
    }
  });
  final.helicopters.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    //const vehicleEconomy = economy[element.intname];
    const mods = modificationLoop(
      element,
      vehicleData,
      modifications,
      element,
      modification_lang,
      weaponry_lang,
    );
    if (mods) {
      modFinal.helicopters.push(mods);
    }
  });

  final.ship.forEach((element) => {
    const vehicleData: ShipVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/ships/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    //const vehicleEconomy = economy[element.intname];
    const mods = modificationLoop(
      element,
      vehicleData,
      modifications,
      element,
      modification_lang,
      weaponry_lang,
    );
    if (mods) {
      modFinal.ship.push(mods);
    }
  });

  final.boat.forEach((element) => {
    const vehicleData: ShipVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/units/ships/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    //const vehicleEconomy = economy[element.intname];
    const mods = modificationLoop(
      element,
      vehicleData,
      modifications,
      element,
      modification_lang,
      weaponry_lang,
    );
    if (mods) {
      modFinal.boat.push(mods);
    }
  });

  fs.writeFileSync(
    `./data/data/${dev ? "modifications-dev" : "modifications"}.json`,
    await format(JSON.stringify(modFinal), { parser: "json" }),
  );
}

main(false);
main(true);

function modificationLoop(
  vehicle: VehicleProps,
  vehicleData: GroundVehicle | AirVehicle | ShipVehicle,
  modifications: Mods,
  element: VehicleProps,
  modification_lang: LangData[],
  weaponry_lang: LangData[],
): VehicleMods | undefined {
  if (!vehicleData.modifications) {
    console.log(`no mods on: ${vehicle.intname}`);
    return undefined;
  }

  const baseModArr: Record<ModClassName, BaseMod[][]> = {
    lth: [],
    armor: [],
    weapon: [],
    mobility: [],
    protection: [],
    firepower: [],
    primaryWeapon: [],
    secondaryWeapon: [],
    premiumMods: [],
    expendable: [],
    seakeeping: [],
    unsinkability: [],
  };
  Object.entries(baseModArr).forEach(([key]) => {
    baseModArr[modClassName.parse(key)].push([], [], [], []);
  });

  Object.entries(vehicleData.modifications).forEach(([key, value]) => {
    const gameMod = modifications.modifications[key];
    if (gameMod.image && gameMod.turn_it_off !== true) {
      const mod: BaseMod = {
        intname: key,
        displayname: parseLang(modification_lang, "modification/" + key)?.English,
        image: gameMod.image.split("#")[gameMod.image.split("#").length - 1],
        reqMod: gameMod.reqModification,
      };
      let rank = gameMod.tier;

      if (value.tier) {
        rank = value.tier;
      }
      if (value.reqModification) {
        mod.reqMod = value.reqModification;
      }
      if (value.image) {
        mod.image = value.image.split("#")[value.image.split("#").length - 1];
      }

      if (key.includes("_ammo_pack") && vehicle.type === "army") {
        const findMod = Object.values(modifications.modifications).filter((value) => {
          return value.reqModification === key && !value.tier;
        });
        if (findMod.length === 0) {
          throw new Error(`not found mod: ${key}`);
        }

        let displayname: string | undefined;

        vehicle.weapons?.cannon?.findIndex((element) => {
          if (!element || "dummy" in element) {
            return false;
          }

          const findShell = element.shells?.find((element) => {
            return findMod.find((modElement) => {
              return element.modname === modElement.effects?.additiveBulletMod;
            });
          });
          const findBelt = element.belts?.find((element) => {
            return findMod.find((modElement) => {
              return element.modname === modElement.effects?.additiveBulletMod;
            });
          });

          if (findShell) {
            displayname = findShell.name;
            return true;
          } else if (findBelt) {
            displayname = findBelt.name;
            return true;
          }
          return false;
        });

        vehicle.weapons?.machineGun?.findIndex((element) => {
          if (!element) {
            return false;
          }
          const findShell = element.shells?.find((element) => {
            return findMod.find((modElement) => {
              return element.modname === modElement.effects?.additiveBulletMod;
            });
          });
          const findBelt = element.belts?.find((element) => {
            return findMod.find((modElement) => {
              return element.modname === modElement.effects?.additiveBulletMod;
            });
          });

          if (findShell) {
            displayname = findShell.name;
            return true;
          } else if (findBelt) {
            displayname = findBelt.name;
            return true;
          }
          return false;
        });

        if (!displayname) {
          console.log(`no lang for: ${key}`);
        }

        mod.displayname = displayname;
      }

      if (key.endsWith("_belt_pack") && !mod.displayname) {
        if (!gameMod.caliber) {
          throw new Error(`${key} does not have caliber`);
        }

        if (key.endsWith("_turret_belt_pack")) {
          mod.displayname = `Turret ${gameMod.caliber} mm`;
        } else {
          mod.displayname = `Offensive ${gameMod.caliber} mm`;
        }
      } else if (key.endsWith("_new_gun") && !mod.displayname) {
        if (!gameMod.caliber) {
          throw new Error(`${key} does not have caliber`);
        }

        if (key.endsWith("_turret_new_gun")) {
          mod.displayname =
            gameMod.caliber >= 15
              ? `New ${gameMod.caliber} mm cannons (turret)`
              : `New ${gameMod.caliber} mm MGs (turret)`;
        } else {
          mod.displayname =
            gameMod.caliber >= 15
              ? `New ${gameMod.caliber} mm cannons`
              : `New ${gameMod.caliber} mm MGs`;
        }
      }

      if (!mod.displayname) {
        mod.displayname = parseLang(weaponry_lang, "modification/" + key)?.English;
      }

      if (!mod.displayname && rank) {
        console.log("no displayname for:", key);
      }

      if (value.modClass && rank) {
        baseModArr[modClassName.parse(value.modClass)][rank - 1].push(mod);
      } else if (gameMod.modClass && rank) {
        baseModArr[modClassName.parse(gameMod.modClass)][rank - 1].push(mod);
      }
    }
  });

  const finalModArr: ModClass = {};
  let anyExisit = false;
  Object.entries(baseModArr).forEach(([key, value]) => {
    let include = false;

    value.forEach((element) => {
      if (element.length !== 0) {
        include = true;
        anyExisit = true;
      }
    });

    if (include) {
      finalModArr[modClassName.parse(key)] = value;
    }
  });
  const out: VehicleMods = {
    intname: element.intname,
    mods: finalModArr,
  };
  if (anyExisit) {
    return out;
  }

  console.log(`modifications exsist but its empty on: ${vehicle.intname}`);
  return undefined;
}
