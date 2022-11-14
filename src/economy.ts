import fs from "fs";
import { format } from "prettier";

import { CWToCannon } from "./commonWeaponToCannon";
import { langcsvJSON } from "./csvJSON";
import {
  AirVehicle,
  Economy,
  Final,
  GroundVehicle,
  NightVision,
  Shop,
  ShopItem,
  Sights,
  TankWeapons,
  UnitData,
  namevehicles,
} from "./types";

async function main() {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/wpcost.blkx", "utf-8"),
  );
  const unitData: Record<string, UnitData> = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/unittags.blkx", "utf-8"),
  );

  const vehicles: namevehicles = JSON.parse(fs.readFileSync("./out/vehicles.json", "utf-8"));

  const br = [
    "1.0",
    "1.3",
    "1.7",
    "2.0",
    "2.3",
    "2.7",
    "3.0",
    "3.3",
    "3.7",
    "4.0",
    "4.3",
    "4.7",
    "5.0",
    "5.3",
    "5.7",
    "6.0",
    "6.3",
    "6.7",
    "7.0",
    "7.3",
    "7.7",
    "8.0",
    "8.3",
    "8.7",
    "9.0",
    "9.3",
    "9.7",
    "10.0",
    "10.3",
    "10.7",
    "11.0",
    "11.3",
  ];

  const weaponry_lang = langcsvJSON(
    fs.readFileSync("./War-Thunder-Datamine/lang.vromfs.bin_u/lang/units_weaponry.csv", "utf-8"),
  );

  const units_lang = langcsvJSON(
    fs.readFileSync("./War-Thunder-Datamine/lang.vromfs.bin_u/lang/units.csv", "utf-8"),
  );

  const shopData: Shop = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/shop.blkx", "utf-8"),
  );

  const final: Final = {
    updated: new Date(),
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  vehicles.ground.forEach((element) => {
    const vehicleData: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = units_lang.find((lang) => {
      return lang.ID === element.intname + "_shop";
    });

    let marketplace: number | undefined;
    shopData[vehicleEconomy.country].army.range.forEach((notelement) => {
      Object.entries(notelement).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir")) {
              if (key === element.intname) {
                const value2 = value as ShopItem;
                marketplace = value2.marketplaceItemdefId;
              }
            }
          });
        } else {
          if (key === element.intname) {
            const value2 = value as ShopItem;
            marketplace = value2.marketplaceItemdefId;
          }
        }
      });
    });

    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    switch (true) {
      case vehicleUnit.tags.type_light_tank:
        type = "type_light_tank";
        break;
      case vehicleUnit.tags.type_medium_tank:
        type = "type_medium_tank";
        break;
      case vehicleUnit.tags.type_heavy_tank:
        type = "type_heavy_tank";
        break;
      case vehicleUnit.tags.type_tank_destroyer:
        type = "type_tank_destroyer";
        if (vehicleUnit.tags.type_missile_tank) {
          ext_type.push("type_missile_tank");
        }
        break;
      case vehicleUnit.tags.type_spaa:
        type = "type_spaa";
        break;
    }

    if (vehicleEconomy.costGold) {
      if (vehicleEconomy.gift) {
        if (vehicleEconomy.event) {
          prem = "event";
        } else {
          if (marketplace) {
            prem = "marketplace";
          } else {
            prem = "store";
          }
        }
      } else {
        prem = "gold";
      }
    } else {
      if (vehicleEconomy.researchType) {
        prem = "squad";
      } else {
        if (vehicleEconomy.event) {
          prem = "event";
        }
      }
    }

    let night: NightVision = {};
    const bullets: { name: string; maxamount?: number }[] = [];
    Object.entries(vehicleData.modifications).forEach(([key, value]) => {
      if (value.effects?.nightVision) {
        night = value.effects.nightVision;
      }
      if (key.match(/^(\d{2}|\d{3})mm_.*(?<!ammo_pack)$/g)) {
        bullets.push({ name: key, maxamount: value.maxToRespawn });
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
          element.triggerGroup === "secondary"
        ) {
          if (element.dummy) {
            if (element.emitter === "bone_gun_01") {
              weapons.cannon?.push(CWToCannon(element, bullets, weaponry_lang));
            }
          } else {
            weapons.cannon?.push(CWToCannon(element, bullets, weaponry_lang));
          }
        }
      });
    } else {
      const Weapon = vehicleData.commonWeapons.Weapon;
      if (
        Weapon.trigger === "gunner0" ||
        Weapon.triggerGroup === "primary" ||
        Weapon.triggerGroup === "secondary"
      ) {
        weapons.cannon?.push(CWToCannon(Weapon, bullets, weaponry_lang));
      }
    }

    console.log(weapons);

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
      sights.gunner.ir = night.gunnerIr;
    }

    if (night.commanderViewThermal && sights.commander) {
      sights.commander.thermal = night.commanderViewThermal;
    } else if (night.commanderViewIr && sights.commander) {
      sights.commander.ir = night.commanderViewIr;
    }

    if (night.driverThermal && sights.driver) {
      sights.driver.thermal = night.driverThermal;
    } else if (night.driverIr && sights.driver) {
      sights.driver.ir = night.driverIr;
    }

    final.ground.push({
      intname: element.intname,
      wikiname: element.wikiname,
      displayname: vehicleLang?.English ? vehicleLang.English : undefined,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: vehicleEconomy.country,
      operator_country: vehicleUnit.operatorCountry,
      rank: vehicleEconomy.rank,
      ab_br: br[vehicleEconomy.economicRankArcade],
      ab_realbr: vehicleEconomy.economicRankArcade,
      rb_br: br[vehicleEconomy.economicRankHistorical],
      rb_realbr: vehicleEconomy.economicRankHistorical,
      sb_br: br[vehicleEconomy.economicRankSimulation],
      sb_realbr: vehicleEconomy.economicRankSimulation,
      base_ab_repair: vehicleEconomy.repairCostArcade,
      base_rb_repair: vehicleEconomy.repairCostHistorical,
      base_sb_repair: vehicleEconomy.repairCostSimulation,
      rp_multiplyer: vehicleEconomy.expMul,
      ab_sl_multiplyer: vehicleEconomy.rewardMulArcade,
      rb_sl_multiplyer: vehicleEconomy.rewardMulHistorical,
      sb_sl_multiplyer: vehicleEconomy.rewardMulSimulation,
      sl_price: vehicleEconomy.value,
      reqRP: vehicleEconomy.reqExp,
      mass: vehicleData.VehiclePhys.Mass.Empty + vehicleData.VehiclePhys.Mass.Fuel,
      horsepower: vehicleData.VehiclePhys.engine.horsePowers,
      prem_type: prem,
      marketplace: marketplace,
      event: vehicleEconomy.event ? vehicleEconomy.event : undefined,
      cost_gold: vehicleEconomy.costGold,
      hidden: vehicleEconomy.showOnlyWhenBought ? true : undefined,
      crew: vehicleEconomy.crewTotalCount,
      gears_forward: gearsF,
      gears_backward: gearsB,
      type: "tank",
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
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = units_lang.find((lang) => {
      return lang.ID === element.intname + "_shop";
    });

    let marketplace: number | undefined;
    shopData[vehicleEconomy.country].aviation.range.forEach((notelement) => {
      Object.entries(notelement).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir")) {
              if (key === element.intname) {
                const value2 = value as ShopItem;
                marketplace = value2.marketplaceItemdefId;
              }
            }
          });
        } else {
          if (key === element.intname) {
            const value2 = value as ShopItem;
            marketplace = value2.marketplaceItemdefId;
          }
        }
      });
    });

    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    switch (true) {
      case vehicleUnit.tags.type_fighter:
        type = "type_fighter";
        break;
      case vehicleUnit.tags.type_bomber:
        type = "type_bomber";
        break;
      case vehicleUnit.tags.type_assault:
        type = "type_assault";
        break;
    }
    if (vehicleUnit.tags.type_jet_fighter) {
      ext_type.push("type_jet_fighter");
    }
    if (vehicleUnit.tags.type_jet_bomber) {
      ext_type.push("type_jet_bomber");
    }
    if (vehicleUnit.tags.type_longrange_bomber) {
      ext_type.push("type_longrange_bomber");
    }
    if (vehicleUnit.tags.type_frontline_bomber) {
      ext_type.push("type_frontline_bomber");
    }
    if (vehicleUnit.tags.type_hydroplane) {
      ext_type.push("type_hydroplane");
    }
    if (vehicleUnit.tags.type_naval_aircraft) {
      ext_type.push("type_naval_aircraft");
    }
    if (vehicleUnit.tags.type_torpedo) {
      ext_type.push("type_torpedo_bomber");
    }
    if (vehicleUnit.tags.type_dive_bomber) {
      ext_type.push("type_dive_bomber");
    }
    if (vehicleUnit.tags.type_interceptor) {
      ext_type.push("type_interceptor");
    }
    if (vehicleUnit.tags.type_aa_fighter) {
      ext_type.push("type_aa_fighter");
    }
    if (vehicleUnit.tags.type_light_bomber) {
      ext_type.push("type_light_bomber");
    }

    if (vehicleEconomy.costGold) {
      if (vehicleEconomy.gift) {
        if (vehicleEconomy.event) {
          prem = "event";
        } else {
          if (marketplace) {
            prem = "marketplace";
          } else {
            prem = "store";
          }
        }
      } else {
        prem = "gold";
      }
    } else {
      if (vehicleEconomy.researchType) {
        prem = "squad";
      } else {
        if (vehicleEconomy.event) {
          prem = "event";
        }
      }
    }

    final.aircraft.push({
      intname: element.intname,
      wikiname: element.wikiname,
      displayname: vehicleLang?.English ? vehicleLang.English : undefined,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: vehicleEconomy.country,
      operator_country: vehicleUnit.operatorCountry,
      rank: vehicleEconomy.rank,
      ab_br: br[vehicleEconomy.economicRankArcade],
      ab_realbr: vehicleEconomy.economicRankArcade,
      rb_br: br[vehicleEconomy.economicRankHistorical],
      rb_realbr: vehicleEconomy.economicRankHistorical,
      sb_br: br[vehicleEconomy.economicRankSimulation],
      sb_realbr: vehicleEconomy.economicRankSimulation,
      base_ab_repair: vehicleEconomy.repairCostArcade,
      base_rb_repair: vehicleEconomy.repairCostHistorical,
      base_sb_repair: vehicleEconomy.repairCostSimulation,
      rp_multiplyer: vehicleEconomy.expMul,
      ab_sl_multiplyer: vehicleEconomy.rewardMulArcade,
      rb_sl_multiplyer: vehicleEconomy.rewardMulHistorical,
      sb_sl_multiplyer: vehicleEconomy.rewardMulSimulation,
      sl_price: vehicleEconomy.value,
      reqRP: vehicleEconomy.reqExp,
      marketplace: marketplace,
      prem_type: prem,
      event: vehicleEconomy.event ? vehicleEconomy.event : undefined,
      cost_gold: vehicleEconomy.costGold,
      hidden: vehicleEconomy.showOnlyWhenBought ? true : undefined,
      crew: vehicleEconomy.crewTotalCount,
      type: "aircraft",
    });
  });
  vehicles.helicopter.forEach((element) => {
    const vehicleData: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    const vehicleEconomy = economy[element.intname];
    const vehicleUnit = unitData[element.intname];
    const vehicleLang = units_lang.find((lang) => {
      return lang.ID === element.intname + "_shop";
    });

    let marketplace: number | undefined;
    shopData[vehicleEconomy.country].helicopters.range.forEach((notelement) => {
      Object.entries(notelement).forEach(([key, value]) => {
        if ("image" in value) {
          Object.entries(value).forEach(([key, value]) => {
            if (!(key === "image" || key === "reqAir")) {
              if (key === element.intname) {
                const value2 = value as ShopItem;
                marketplace = value2.marketplaceItemdefId;
              }
            }
          });
        } else {
          if (key === element.intname) {
            const value2 = value as ShopItem;
            marketplace = value2.marketplaceItemdefId;
          }
        }
      });
    });

    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    if (vehicleUnit.tags.type_attack_helicopter) {
      type = "type_attack_helicopter";
      if (vehicleUnit.tags.type_utility_helicopter) {
        ext_type.push("type_utility_helicopter");
      }
    } else {
      if (vehicleUnit.tags.type_utility_helicopter) {
        type = "type_utility_helicopter";
      }
    }

    if (vehicleEconomy.costGold) {
      if (vehicleEconomy.gift) {
        if (vehicleEconomy.event) {
          prem = "event";
        } else {
          if (marketplace) {
            prem = "marketplace";
          } else {
            prem = "store";
          }
        }
      } else {
        prem = "gold";
      }
    } else {
      if (vehicleEconomy.researchType) {
        prem = "squad";
      } else {
        if (vehicleEconomy.event) {
          prem = "event";
        }
      }
    }

    final.helicopter.push({
      intname: element.intname,
      wikiname: element.wikiname,
      displayname: vehicleLang?.English ? vehicleLang.English : undefined,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: vehicleEconomy.country,
      operator_country: vehicleUnit.operatorCountry,
      rank: vehicleEconomy.rank,
      ab_br: br[vehicleEconomy.economicRankArcade],
      ab_realbr: vehicleEconomy.economicRankArcade,
      rb_br: br[vehicleEconomy.economicRankHistorical],
      rb_realbr: vehicleEconomy.economicRankHistorical,
      sb_br: br[vehicleEconomy.economicRankSimulation],
      sb_realbr: vehicleEconomy.economicRankSimulation,
      base_ab_repair: vehicleEconomy.repairCostArcade,
      base_rb_repair: vehicleEconomy.repairCostHistorical,
      base_sb_repair: vehicleEconomy.repairCostSimulation,
      rp_multiplyer: vehicleEconomy.expMul,
      ab_sl_multiplyer: vehicleEconomy.rewardMulArcade,
      rb_sl_multiplyer: vehicleEconomy.rewardMulHistorical,
      sb_sl_multiplyer: vehicleEconomy.rewardMulSimulation,
      sl_price: vehicleEconomy.value,
      reqRP: vehicleEconomy.reqExp,
      prem_type: prem,
      marketplace: marketplace,
      event: vehicleEconomy.event ? vehicleEconomy.event : undefined,
      cost_gold: vehicleEconomy.costGold,
      hidden: vehicleEconomy.showOnlyWhenBought ? true : undefined,
      crew: vehicleEconomy.crewTotalCount,
      type: "helicopter",
    });
  });
  fs.writeFileSync("./out/final.json", format(JSON.stringify(final), { parser: "json" }));
}

main();
