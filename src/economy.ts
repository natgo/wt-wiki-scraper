import fs from "fs";

import { CWToCannon } from "./commonWeaponToCannon";
import { langcsvJSON } from "./csvJSON";
import {
  AirVehicle,
  Economy,
  Final,
  GroundVehicle,
  NightVision,
  Sights,
  TankCannon,
  TankWeapons,
  UnitData,
  savedparse,
} from "./types";

async function main() {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/wpcost.blkx", "utf-8"),
  );
  const unitData: Record<string, UnitData> = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/unittags.blkx", "utf-8"),
  );

  const vehicles: {
    ground: savedparse[];
    aircraft: savedparse[];
    helicopter: savedparse[];
  } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  const names: {
    ground: { wikiname: string; intname: string }[];
    aircraft: { wikiname: string; intname: string }[];
    helicopter: { wikiname: string; intname: string }[];
  } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };

  const ground = fs.readdirSync("./wikitext/ground/");
  ground.forEach((element) => {
    vehicles.ground.push(JSON.parse(fs.readFileSync(`./wikitext/ground/${element}`, "utf-8")));
  });
  const aircraft = fs.readdirSync("./wikitext/aircraft/");
  aircraft.forEach((element) => {
    vehicles.aircraft.push(JSON.parse(fs.readFileSync(`./wikitext/aircraft/${element}`, "utf-8")));
  });
  const helicopter = fs.readdirSync("./wikitext/helicopter/");
  helicopter.forEach((element) => {
    vehicles.helicopter.push(
      JSON.parse(fs.readFileSync(`./wikitext/helicopter/${element}`, "utf-8")),
    );
  });

  vehicles.ground.forEach((element) => {
    const match = element.text["*"].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      names.ground.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(element.title + element.pageid);
    }
  });
  vehicles.aircraft.forEach((element) => {
    const match = element.text["*"].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      names.aircraft.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(element.title + element.pageid);
    }
  });
  vehicles.helicopter.forEach((element) => {
    const match = element.text["*"].match(/data-code=".*"/g);
    if (match) {
      const splitmatch = match[0].split("=")[1];
      names.helicopter.push({
        intname: splitmatch.substring(1, splitmatch.length - 1),
        wikiname: element.title,
      });
    } else {
      console.log(element.title + element.pageid);
    }
  });

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

  const final: Final = {
    updated: new Date(),
    ground: [],
    aircraft: [],
    helicopter: [],
  };
  names.ground.forEach((element) => {
    const vehicle: GroundVehicle = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/units/tankmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    switch (true) {
      case unitData[element.intname].tags.type_light_tank:
        type = "type_light_tank";
        break;
      case unitData[element.intname].tags.type_medium_tank:
        type = "type_medium_tank";
        break;
      case unitData[element.intname].tags.type_heavy_tank:
        type = "type_heavy_tank";
        break;
      case unitData[element.intname].tags.type_tank_destroyer:
        type = "type_tank_destroyer";
        if (unitData[element.intname].tags.type_missile_tank) {
          ext_type.push("type_missile_tank");
        }
        break;
      case unitData[element.intname].tags.type_spaa:
        type = "type_spaa";
        break;
    }
    if (economy[element.intname].costGold) {
      if (economy[element.intname].gift) {
        prem = "store";
      } else {
        prem = "gold";
      }
    } else {
      if (economy[element.intname].researchType) {
        prem = "squad";
      } else {
        if (economy[element.intname].event) {
          prem = "event";
        }
      }
    }

    console.log(element.wikiname);

    let night: NightVision = {};
    const bullets: { name: string; maxamount?: number }[] = [];
    Object.entries(vehicle.modifications).forEach(([key, value]) => {
      if (value.effects?.nightVision) {
        night = value.effects.nightVision;
      }
      if (key.match(/^(\d{2}|\d{3})mm_.*(?<!ammo_pack)$/g)) {
        bullets.push({ name: key, maxamount: value.maxToRespawn });
      }
    });

    let gearsF = 0;
    let gearsB = 0;
    if (vehicle.VehiclePhys.mechanics.gearRatios.ratio) {
      vehicle.VehiclePhys.mechanics.gearRatios.ratio.forEach((element) => {
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
      vehicle.VehiclePhys.mechanics.gearRatios.ratio.forEach((element, i, array) => {
        if (element + array[array.length - i - 1] === 0) {
          synchro++;
        }
      });
      if ((synchro - 1) / 2 === gearsB) {
        has_synchro = true;
      }
    }

    let era = false;
    Object.entries(vehicle.DamageParts).forEach(([, value]) => {
      const armor = value.armorClass as string;
      if (armor && armor.match(/ERA_|era_/g)) {
        era = true;
      }
    });

    let composite = false;
    Object.entries(vehicle.DamageParts).forEach(([key]) => {
      if (key.match(/composite|inner_armor/g)) {
        composite = true;
      }
    });

    const weapons: TankWeapons = {
      cannon: [],
      machineGun: [],
    };

    if (Array.isArray(vehicle.commonWeapons.Weapon)) {
      vehicle.commonWeapons.Weapon.forEach((element) => {
        if (element.trigger === "gunner0" || element.triggerGroup === "secondary") {
          weapons.cannon?.push(CWToCannon(element, bullets, weaponry_lang));
        }
      });
    } else {
      const Weapon = vehicle.commonWeapons.Weapon;
      if (Weapon.trigger === "gunner0" || Weapon.triggerGroup === "secondary") {
        weapons.cannon?.push(CWToCannon(Weapon, bullets, weaponry_lang));
      }
    }

    console.log(weapons);

    let laser = false;
    if (
      vehicle.modifications.modern_tank_laser_rangefinder ||
      vehicle.modifications.laser_rangefinder_lws
    ) {
      laser = true;
    }

    const sights: Sights = {
      gunner: {
        zoomInFov: vehicle.cockpit.zoomInFov,
        zoomOutFov: vehicle.cockpit.zoomOutFov,
      },
    };
    if (vehicle.commanderView) {
      sights.commander = {
        zoomInFov: vehicle.commanderView.zoomInFov,
        zoomOutFov: vehicle.commanderView.zoomOutFov,
      };
    }
    if (night.gunnerThermal) {
      sights.gunner.gunnerThermal = night.gunnerThermal;
    } else if (night.gunnerIr) {
      sights.gunner.gunnerIr = night.gunnerIr;
    }
    if (night.commanderViewThermal && sights.commander) {
      sights.commander.commanderViewThermal = night.commanderViewThermal;
    } else if (night.commanderViewIr && sights.commander) {
      sights.commander.commanderViewIr = night.commanderViewIr;
    }
    if (night.driverIr) {
      sights.driver = { driverIr: night.driverIr };
    }

    final.ground.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: economy[element.intname].country,
      rank: economy[element.intname].rank,
      ab_br: br[economy[element.intname].economicRankArcade],
      ab_realbr: economy[element.intname].economicRankArcade,
      rb_br: br[economy[element.intname].economicRankHistorical],
      rb_realbr: economy[element.intname].economicRankHistorical,
      sb_br: br[economy[element.intname].economicRankSimulation],
      sb_realbr: economy[element.intname].economicRankSimulation,
      base_ab_repair: economy[element.intname].repairCostArcade,
      base_rb_repair: economy[element.intname].repairCostHistorical,
      base_sb_repair: economy[element.intname].repairCostSimulation,
      rp_multiplyer: economy[element.intname].expMul,
      ab_sl_multiplyer: economy[element.intname].rewardMulArcade,
      rb_sl_multiplyer: economy[element.intname].rewardMulHistorical,
      sb_sl_multiplyer: economy[element.intname].rewardMulSimulation,
      sl_price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
      mass: vehicle.VehiclePhys.Mass.Empty + vehicle.VehiclePhys.Mass.Fuel,
      horsepower: vehicle.VehiclePhys.engine.horsePowers,
      prem_type: prem,
      cost_gold: economy[element.intname].costGold,
      hidden: economy[element.intname].showOnlyWhenBought ? true : undefined,
      crew: economy[element.intname].crewTotalCount,
      gears_forward: gearsF,
      gears_backward: gearsB,
      type: "tank",
      hydro_suspension: vehicle.VehiclePhys.movableSuspension ? true : undefined,
      can_float: vehicle.VehiclePhys.floats ? true : undefined,
      has_synchro: has_synchro ? true : undefined,
      has_neutral: vehicle.VehiclePhys.mechanics.neutralGearRatio ? true : undefined,
      has_dozer: vehicle.modifications.tank_bulldozer_blade ? true : undefined,
      has_smoke: vehicle.modifications.tank_smoke_screen_system_mod ? true : undefined,
      has_ess: vehicle.modifications.tank_engine_smoke_screen_system ? true : undefined,
      has_lws: vehicle.modifications.laser_rangefinder_lws ? true : undefined,
      has_era: era ? true : undefined,
      has_composite: composite ? true : undefined,
      laser_range: laser ? true : undefined,
      optics: sights,
      weapons: weapons,
    });
  });
  names.aircraft.forEach((element) => {
    const vehicle: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    switch (true) {
      case unitData[element.intname].tags.type_fighter:
        type = "type_fighter";
        break;
      case unitData[element.intname].tags.type_bomber:
        type = "type_bomber";
        break;
      case unitData[element.intname].tags.type_assault:
        type = "type_assault";
        break;
    }
    if (unitData[element.intname].tags.type_jet_fighter) {
      ext_type.push("type_jet_fighter");
    }
    if (unitData[element.intname].tags.type_jet_bomber) {
      ext_type.push("type_jet_bomber");
    }
    if (unitData[element.intname].tags.type_longrange_bomber) {
      ext_type.push("type_longrange_bomber");
    }
    if (unitData[element.intname].tags.type_frontline_bomber) {
      ext_type.push("type_frontline_bomber");
    }
    if (unitData[element.intname].tags.type_hydroplane) {
      ext_type.push("type_hydroplane");
    }
    if (unitData[element.intname].tags.type_naval_aircraft) {
      ext_type.push("type_naval_aircraft");
    }
    if (unitData[element.intname].tags.type_torpedo) {
      ext_type.push("type_torpedo_bomber");
    }
    if (unitData[element.intname].tags.type_dive_bomber) {
      ext_type.push("type_dive_bomber");
    }
    if (unitData[element.intname].tags.type_interceptor) {
      ext_type.push("type_interceptor");
    }
    if (unitData[element.intname].tags.type_aa_fighter) {
      ext_type.push("type_aa_fighter");
    }
    if (unitData[element.intname].tags.type_light_bomber) {
      ext_type.push("type_light_bomber");
    }
    if (economy[element.intname].costGold) {
      if (economy[element.intname].gift) {
        prem = "store";
      } else {
        prem = "gold";
      }
    } else {
      if (economy[element.intname].researchType) {
        prem = "squad";
      } else {
        if (economy[element.intname].event) {
          prem = "event";
        }
      }
    }

    final.aircraft.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: economy[element.intname].country,
      rank: economy[element.intname].rank,
      ab_br: br[economy[element.intname].economicRankArcade],
      ab_realbr: economy[element.intname].economicRankArcade,
      rb_br: br[economy[element.intname].economicRankHistorical],
      rb_realbr: economy[element.intname].economicRankHistorical,
      sb_br: br[economy[element.intname].economicRankSimulation],
      sb_realbr: economy[element.intname].economicRankSimulation,
      base_ab_repair: economy[element.intname].repairCostArcade,
      base_rb_repair: economy[element.intname].repairCostHistorical,
      base_sb_repair: economy[element.intname].repairCostSimulation,
      rp_multiplyer: economy[element.intname].expMul,
      ab_sl_multiplyer: economy[element.intname].rewardMulArcade,
      rb_sl_multiplyer: economy[element.intname].rewardMulHistorical,
      sb_sl_multiplyer: economy[element.intname].rewardMulSimulation,
      sl_price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
      prem_type: prem,
      cost_gold: economy[element.intname].costGold,
      hidden: economy[element.intname].showOnlyWhenBought ? true : undefined,
      crew: economy[element.intname].crewTotalCount,
      type: "aircraft",
    });
  });
  names.helicopter.forEach((element) => {
    const vehicle: AirVehicle = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/flightmodels/${element.intname.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
    let prem = "false";
    let type = "";
    const ext_type: string[] = [];
    if (unitData[element.intname].tags.type_attack_helicopter) {
      type = "type_attack_helicopter";
      if (unitData[element.intname].tags.type_utility_helicopter) {
        ext_type.push("type_attack_helicopter", "type_utility_helicopter");
      }
    } else {
      if (unitData[element.intname].tags.type_utility_helicopter) {
        type = "type_utility_helicopter";
      }
    }
    if (economy[element.intname].costGold) {
      if (economy[element.intname].gift) {
        prem = "store";
      } else {
        prem = "gold";
      }
    } else {
      if (economy[element.intname].researchType) {
        prem = "squad";
      } else {
        if (economy[element.intname].event) {
          prem = "event";
        }
      }
    }

    final.helicopter.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
      country: economy[element.intname].country,
      rank: economy[element.intname].rank,
      ab_br: br[economy[element.intname].economicRankArcade],
      ab_realbr: economy[element.intname].economicRankArcade,
      rb_br: br[economy[element.intname].economicRankHistorical],
      rb_realbr: economy[element.intname].economicRankHistorical,
      sb_br: br[economy[element.intname].economicRankSimulation],
      sb_realbr: economy[element.intname].economicRankSimulation,
      base_ab_repair: economy[element.intname].repairCostArcade,
      base_rb_repair: economy[element.intname].repairCostHistorical,
      base_sb_repair: economy[element.intname].repairCostSimulation,
      rp_multiplyer: economy[element.intname].expMul,
      ab_sl_multiplyer: economy[element.intname].rewardMulArcade,
      rb_sl_multiplyer: economy[element.intname].rewardMulHistorical,
      sb_sl_multiplyer: economy[element.intname].rewardMulSimulation,
      sl_price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
      prem_type: prem,
      cost_gold: economy[element.intname].costGold,
      hidden: economy[element.intname].showOnlyWhenBought ? true : undefined,
      crew: economy[element.intname].crewTotalCount,
      type: "helicopter",
    });
  });
  fs.writeFileSync("./out/final.json", JSON.stringify(final));
}

main();
