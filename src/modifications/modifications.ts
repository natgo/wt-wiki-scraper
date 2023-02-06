import fs from "fs";
import { format } from "prettier";

import { langcsvJSON } from "../csvJSON";
import { parseLang } from "../lang";
import {
  AirVehicle,
  BaseMod,
  Economy,
  Final,
  GroundVehicle,
  LangData,
  ModClass,
  ModClassName,
  Modifications,
  Mods,
  VehicleMods,
  VehicleProps,
  modClassName,
} from "../types";

async function main(dev: boolean) {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/wpcost.blkx`,
      "utf-8",
    ),
  );

  const modification_lang = langcsvJSON(
    fs.readFileSync(
      `./${
        dev ? "datamine-dev" : "War-Thunder-Datamine"
      }/lang.vromfs.bin_u/lang/units_modifications.csv`,
      "utf-8",
    ),
  );

  const final: Final = JSON.parse(
    fs.readFileSync(`./out/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );

  const modifications: Mods = JSON.parse(
    fs.readFileSync(
      `./${
        dev ? "datamine-dev" : "War-Thunder-Datamine"
      }/char.vromfs.bin_u/config/modifications.blkx`,
      "utf-8",
    ),
  );

  const modFinal: Modifications = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  final.ground.forEach((element) => {
    const vehicleData: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];

    console.log(element.intname);

    modFinal.ground.push(
      modificationLoop(element, vehicleData, modifications, element, modification_lang),
    );
  });
  final.aircraft.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];

    console.log(element.intname);

    modFinal.aircraft.push(
      modificationLoop(element, vehicleData, modifications, element, modification_lang),
    );
  });
  final.helicopter.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];

    console.log(element.intname);

    modFinal.helicopter.push(
      modificationLoop(element, vehicleData, modifications, element, modification_lang),
    );
  });
  fs.writeFileSync(
    `./out/${dev ? "modifications-dev" : "modifications"}.json`,
    format(JSON.stringify(modFinal), { parser: "json" }),
  );
}

main(false);
main(true);

function modificationLoop(
  vehicle: VehicleProps,
  vehicleData: GroundVehicle | AirVehicle,
  modifications: Mods,
  element: VehicleProps,
  langdata: LangData[],
) {
  if (!vehicleData.modifications) {
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
    expendables: [],
    seakeeping: [],
    unsinkability: [],
  };
  Object.entries(baseModArr).forEach(([key]) => {
    baseModArr[modClassName.parse(key)].push([], [], [], []);
  });

  Object.entries(vehicleData.modifications).forEach(([key, value]) => {
    const gameMod = modifications.modifications[key];
    if (gameMod.tier && gameMod.image && gameMod.turn_it_off !== true) {
      const mod: BaseMod = {
        intname: key,
        displayname: parseLang(langdata, "modification/" + key)?.English,
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

      if (key.includes("_ammo_pack") && vehicle.type === "tank") {
        const findMod = Object.values(modifications.modifications).find((value) => {
          return value.reqModification === key && !value.tier;
        });
        if (!findMod) {
          throw new Error(`not found mod: ${key}`);
        }

        let displayname: string | undefined;

        vehicle.weapons?.cannon?.find((element) => {
          const findShell = element?.shells?.find((element) => {
            return element.modname === findMod.effects?.additiveBulletMod;
          })?.name;
          const findBelt = element?.belts?.find((element) => {
            return element.modname === findMod.effects?.additiveBulletMod;
          })?.name;

          if (findShell) {
            displayname = findShell;
            return true;
          } else if (findBelt) {
            displayname = findBelt;
            return true;
          }
          return false;
        });

        if (!displayname) {
          console.log(findMod.effects?.additiveBulletMod);
          throw new Error(`no lang for: ${key}`);
        }

        mod.displayname = displayname;
      }

      if (value.modClass) {
        baseModArr[modClassName.parse(value.modClass)][rank - 1].push(mod);
      } else if (gameMod.modClass) {
        baseModArr[modClassName.parse(gameMod.modClass)][rank - 1].push(mod);
      } else {
        console.log("no modclass:", gameMod);
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
  return undefined;
}
