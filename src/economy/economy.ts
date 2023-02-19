import fs from "fs";
import { format } from "prettier";

import { langcsvJSON } from "../csvJSON";
import { parseLang } from "../lang";
import {
  AirVehicle,
  Economy,
  Final,
  GroundVehicle,
  HelicopterOptics,
  Mods,
  NightVision,
  Shop,
  Sights,
  TankWeapons,
  UnitData,
  helicopterOpticsSchema,
  namevehicles,
  opticIr,
} from "../types";
import { commonVehicle } from "./commonVehicle";
import { commonWeaponToCannon } from "./commonWeaponToCannon";
import { machineGun } from "./machineGun";
import { sensors } from "./sensors";
import { vehicleBallistic } from "./vehicleBallistic";
import { vehiclePreset } from "./vehiclePreset";

async function main(dev: boolean) {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/wpcost.blkx`,
      "utf-8",
    ),
  );
  const unitData: Record<string, UnitData> = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/unittags.blkx`,
      "utf-8",
    ),
  );

  const vehicles: namevehicles = JSON.parse(
    fs.readFileSync(`./out/${dev ? "vehicles-dev" : "vehicles"}.json`, "utf-8"),
  );

  const weaponry_lang = langcsvJSON(
    fs.readFileSync(
      `./${
        dev ? "datamine-dev" : "War-Thunder-Datamine"
      }/lang.vromfs.bin_u/lang/units_weaponry.csv`,
      "utf-8",
    ),
  );

  const units_lang = langcsvJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/lang.vromfs.bin_u/lang/units.csv`,
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

  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const modifications: Mods = JSON.parse(
    fs.readFileSync(
      `./${
        dev ? "datamine-dev" : "War-Thunder-Datamine"
      }/char.vromfs.bin_u/config/modifications.blkx`,
      "utf-8",
    ),
  );

  const final: Final = {
    version: fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/aces.vromfs.bin_u/version`,
      "utf-8",
    ),
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  vehicles.ground.forEach((element) => {
    const vehicleData: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    let night: NightVision = {};
    const bullets: { name: string; maxamount?: number }[] = [];
    Object.entries(vehicleData.modifications).forEach(([key, value]) => {
      const mod = Object.entries(modifications.modifications).find(([findkey]) => {
        return findkey === key;
      });
      if (!mod) {
        throw new Error(`Modification: ${key} not found in modifications.blk`);
      }

      if (value.effects?.nightVision) {
        night = value.effects.nightVision;
      }
      if (key.match(/^.+?mm_.*(?<!ammo_pack)$/g)) {
        if (!mod[1].effects?.additiveBulletMod) {
          throw new Error(`Modification ${mod[0]} doest not add a bullet`);
        }
        bullets.push({ name: mod[1].effects.additiveBulletMod, maxamount: value.maxToRespawn });
      }
    });

    let gearsF = 0;
    let gearsB = 0;
    if (vehicleData.VehiclePhys.mechanics.gearRatios.ratio) {
      vehicleData.VehiclePhys.mechanics.gearRatios.ratio.forEach((element) => {
        if (element > 0) {
          gearsF++;
        } else if (element < 0) {
          gearsB++;
        }
      });
    }

    let synchro = 0;
    let has_synchro = false;
    if (gearsB === gearsF) {
      vehicleData.VehiclePhys.mechanics.gearRatios.ratio.forEach((element, i, array) => {
        if (element + array[array.length - i - 1] === 0) {
          synchro++;
        }
      });
      if ((synchro - 1) / 2 === gearsB) {
        has_synchro = true;
      }
    }

    let era = false;
    Object.entries(vehicleData.DamageParts).forEach(([, value]) => {
      const armor = value.armorClass as string;
      if (armor && armor.match(/ERA_|era_/g)) {
        era = true;
      }
    });

    let composite = false;
    Object.entries(vehicleData.DamageParts).forEach(([key]) => {
      if (key.match(/composite|inner_armor/g)) {
        composite = true;
      }
    });

    const weapons: TankWeapons = {
      cannon: [],
      machineGun: [],
    };

    if (Array.isArray(vehicleData.commonWeapons.Weapon)) {
      vehicleData.commonWeapons.Weapon.forEach((element) => {
        if (
          element.trigger === "gunner0" ||
          element.triggerGroup === "primary" ||
          element.triggerGroup === "secondary" ||
          element.triggerGroup === "special"
        ) {
          if (element.dummy) {
            if (element.emitter === "bone_gun_01") {
              const gun = commonWeaponToCannon(
                element,
                bullets,
                weaponry_lang,
                modification_lang,
                dev,
              );
              gun ? weapons.cannon?.push(gun) : null;
            }
          } else {
            const gun = commonWeaponToCannon(
              element,
              bullets,
              weaponry_lang,
              modification_lang,
              dev,
            );
            gun ? weapons.cannon?.push(gun) : null;
          }
        } else if (element.triggerGroup === "coaxial" || element.triggerGroup === "machinegun") {
          const gun = machineGun(element, bullets, weaponry_lang, modification_lang, dev);
          gun ? weapons.machineGun?.push(gun) : null;
        }
      });
    } else {
      const Weapon = vehicleData.commonWeapons.Weapon;
      if (
        Weapon.trigger === "gunner0" ||
        Weapon.triggerGroup === "primary" ||
        Weapon.triggerGroup === "secondary"
      ) {
        weapons.cannon?.push(
          commonWeaponToCannon(Weapon, bullets, weaponry_lang, modification_lang, dev),
        );
      }
    }

    let range = false;

    if (vehicleData.modifications.tank_rangefinder) {
      range = true;
    }

    let laser = false;
    if (
      vehicleData.modifications.modern_tank_laser_rangefinder ||
      vehicleData.modifications.laser_rangefinder_lws
    ) {
      laser = true;
    }

    let lws = false;
    if (
      vehicleData.modifications.laser_rangefinder_ircm_lws_t_90a ||
      vehicleData.modifications.laser_rangefinder_lws
    ) {
      lws = true;
    }

    const sights: Sights = {
      gunner: {
        zoomInFov: vehicleData.cockpit.zoomInFov,
        zoomOutFov: vehicleData.cockpit.zoomOutFov,
      },
    };

    if (vehicleData.commanderView) {
      sights.commander = {
        zoomInFov: vehicleData.commanderView.zoomInFov,
        zoomOutFov: vehicleData.commanderView.zoomOutFov,
      };
    }

    if (night.driverIr || night.driverThermal) {
      sights.driver = {};
    }

    if (night.gunnerThermal) {
      sights.gunner.thermal = night.gunnerThermal;
    } else if (night.gunnerIr) {
      sights.gunner.ir = opticIr.parse(night.gunnerIr);
    }

    if (night.commanderViewThermal && sights.commander) {
      sights.commander.thermal = night.commanderViewThermal;
    } else if (night.commanderViewIr && sights.commander) {
      sights.commander.ir = opticIr.parse(night.commanderViewIr);
    }

    if (night.driverThermal && sights.driver) {
      sights.driver.thermal = night.driverThermal;
    } else if (night.driverIr && sights.driver) {
      sights.driver.ir = opticIr.parse(night.driverIr);
    }

    final.ground.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "army"),
      type: "ground",
      mass: vehicleData.VehiclePhys.Mass.Empty + vehicleData.VehiclePhys.Mass.Fuel,
      horsepower: vehicleData.VehiclePhys.engine.horsePowers,
      gears_forward: gearsF,
      gears_backward: gearsB,
      hydro_suspension: vehicleData.VehiclePhys.movableSuspension ? true : undefined,
      can_float: vehicleData.VehiclePhys.floats ? true : undefined,
      has_synchro: has_synchro ? true : undefined,
      has_neutral: vehicleData.VehiclePhys.mechanics.neutralGearRatio ? true : undefined,
      has_dozer: vehicleData.modifications.tank_bulldozer_blade ? true : undefined,
      has_smoke: vehicleData.modifications.tank_smoke_screen_system_mod ? true : undefined,
      has_ess: vehicleData.modifications.tank_engine_smoke_screen_system ? true : undefined,
      has_lws: lws ? true : undefined,
      has_era: era ? true : undefined,
      has_composite: composite ? true : undefined,
      has_laser_range: laser ? true : undefined,
      has_range: range ? true : undefined,
      optics: sights,
      weapons: weapons,
    });
  });
  vehicles.aviation.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = parseLang(units_lang, element.intname + "_shop");
    console.log(element.intname);

    final.aircraft.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "aviation"),
      type: "aircraft",
      ballistic_computer: vehicleBallistic(vehicleData),
      secondary_weapon_preset: vehiclePreset(vehicleData, weaponry_lang, dev),
    });
  });
  vehicles.helicopter.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
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

    final.helicopter.push({
      ...commonVehicle(element, vehicleLang, vehicleEconomy, vehicleUnit, shopData, "helicopters"),
      type: "helicopter",
      ...sensors(vehicleData, dev),
      optics: helicopterOpticsSchema.parse(optics),
      ballistic_computer: vehicleBallistic(vehicleData),
      secondary_weapon_preset: vehiclePreset(vehicleData, weaponry_lang, dev),
    });
  });
  fs.writeFileSync(
    `./out/${dev ? "final-dev" : "final"}.json`,
    format(JSON.stringify(final), { parser: "json" }),
  );
}

main(false);
main(true);
