import fs from "fs";

import { AirVehicle, Economy, GroundVehicle, UnitData } from "./types";

interface savedwikiparse {
  title: string;
  pageid: number;
  wikitext: {
    "*": string;
  };
}

interface FinalProps {
  intname: string;
  wikiname: string;
  normal_type: string;
  extended_type: string;
  country: string;
  rank: number;
  price: number;
  reqRP: number;
  ab_br: string;
  ab_realbr: number;
  rb_br: string;
  rb_realbr: number;
  sb_br: string;
  sb_realbr: number;
  base_ab_repair: number;
  base_rb_repair: number;
  base_sb_repair: number;
  rp_multiplyer: number;
  ab_sl_multiplyer: number;
  rb_sl_multiplyer: number;
  sb_sl_multiplyer: number;
}

interface GroundProps extends FinalProps {
  mass: number;
  horsepower: number;
}

async function main() {
  const economy: Record<string, Economy> = JSON.parse(
    fs.readFileSync("./economy/wpcost.blkx", "utf-8"),
  );
  const unitData: Record<string, UnitData> = JSON.parse(
    fs.readFileSync("./economy/unittags.blkx", "utf-8"),
  );

  const vehicles: {
    ground: savedwikiparse[];
    aircraft: savedwikiparse[];
    helicopter: savedwikiparse[];
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
    const match = element.wikitext["*"].match(/Specs-Card.*\n.code\s?=\s?.*/g);
    if (match) {
      if (match[0].split("=")[1][0] === " ") {
        names.ground.push({
          intname: match[0].split("=")[1].substring(1),
          wikiname: element.title,
        });
      } else {
        names.ground.push({ intname: match[0].split("=")[1], wikiname: element.title });
      }
    } else {
      console.log(element.title + element.pageid);
    }
  });
  vehicles.aircraft.forEach((element) => {
    const match = element.wikitext["*"].match(/Specs-Card.*\n.code\s?=\s?.*/g);
    if (match) {
      if (match[0].split("=")[1][0] === " ") {
        names.aircraft.push({
          intname: match[0].split("=")[1].substring(1),
          wikiname: element.title,
        });
      } else {
        names.aircraft.push({ intname: match[0].split("=")[1], wikiname: element.title });
      }
    } else {
      console.log(element.title + element.pageid);
    }
  });
  vehicles.helicopter.forEach((element) => {
    const match = element.wikitext["*"].match(/Specs-Card.*\n.code\s?=\s?.*/g);
    if (match) {
      if (match[0].split("=")[1][0] === " ") {
        names.helicopter.push({
          intname: match[0].split("=")[1].substring(1),
          wikiname: element.title,
        });
      } else {
        names.helicopter.push({ intname: match[0].split("=")[1], wikiname: element.title });
      }
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
  const final: {
    ground: GroundProps[];
    aircraft: FinalProps[];
    helicopter: FinalProps[];
  } = {
    ground: [],
    aircraft: [],
    helicopter: [],
  };
  names.ground.forEach((element) => {
    const vehicle: GroundVehicle = JSON.parse(
      fs.readFileSync(`./tankmodels/${element.intname.toLowerCase()}.blkx`, "utf-8"),
    );
    let type = "";
    let ext_type = "";
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
      type = "type_destroyer_tank";
      if (unitData[element.intname].tags.type_missile_tank) {
        ext_type = "type_missile_tank";
      }
      break;
    case unitData[element.intname].tags.type_spaa:
      type = "type_spaa_tank";
      break;
    }
    final.ground.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: type,
      extended_type: ext_type,
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
      price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
      mass: vehicle.VehiclePhys.Mass.Empty + vehicle.VehiclePhys.Mass.Fuel,
      horsepower: vehicle.VehiclePhys.engine.horsePowers,
    });
  });
  names.aircraft.forEach((element) => {
    const vehicle: AirVehicle = JSON.parse(
      fs.readFileSync(`./flightmodels/${element.intname.toLowerCase()}.blkx`, "utf-8"),
    );
    //cont
    final.aircraft.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: vehicle.fightAiBehaviour,
      extended_type: vehicle.fightAiBehaviour,
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
      price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
    });
  });
  names.helicopter.forEach((element) => {
    const vehicle: AirVehicle = JSON.parse(
      fs.readFileSync(`./flightmodels/${element.intname.toLowerCase()}.blkx`, "utf-8"),
    );
    final.aircraft.push({
      intname: element.intname,
      wikiname: element.wikiname,
      normal_type: vehicle.fightAiBehaviour,
      extended_type: vehicle.fightAiBehaviour,
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
      price: economy[element.intname].value,
      reqRP: economy[element.intname].reqExp,
    });
  });
  console.log(final.ground);
}
main();
