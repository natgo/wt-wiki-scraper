import {
  UnitData,
  aircraftTypeSchema,
  boatTypeSchema,
  groundTypeSchema,
  shipTypeSchema,
  vehicleTypesSchema,
} from "../types";

export function vehicleType(
  vehicleUnit: UnitData,
  types: "ground" | "aircraft" | "helicopter" | "ship" | "boat",
) {
  let type = "";
  const ext_type: string[] = [];

  if (types === "aircraft") {
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
      case vehicleUnit.tags.type_strike_ucav:
        type = "type_strike_ucav";
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

    return aircraftTypeSchema.parse({
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
    });
  }

  //ground
  if (types === "ground") {
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

    return groundTypeSchema.parse({
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
    });
  }

  //helicopter
  if (types === "helicopter") {
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
  }

  //ship
  if (types === "ship") {
    switch (true) {
      case vehicleUnit.tags.type_battlecruiser:
        type = "type_battlecruiser";
        break;
      case vehicleUnit.tags.type_battleship:
        type = "type_battleship";
        break;
      case vehicleUnit.tags.type_frigate:
        type = "type_frigate";
        break;
      case vehicleUnit.tags.type_light_cruiser:
        type = "type_light_cruiser";
        break;
      case vehicleUnit.tags.type_heavy_cruiser:
        type = "type_heavy_cruiser";
        break;
      case vehicleUnit.tags.type_destroyer:
        type = "type_destroyer";
        break;
    }

    return shipTypeSchema.parse({
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
    });
  }

  //boat
  if (types === "boat") {
    switch (true) {
      case vehicleUnit.tags.type_barge:
        type = "type_barge";
        break;
      case vehicleUnit.tags.type_boat:
        type = "type_boat";
        break;
      case vehicleUnit.tags.type_frigate:
        type = "type_frigate";
        break;
    }
    if (vehicleUnit.tags.type_heavy_boat) {
      ext_type.push("type_heavy_boat");
    }
    if (vehicleUnit.tags.type_armored_boat) {
      ext_type.push("type_armored_boat");
    }
    if (vehicleUnit.tags.type_torpedo_boat) {
      ext_type.push("type_torpedo_boat");
    }
    if (vehicleUnit.tags.type_gun_boat) {
      ext_type.push("type_gun_boat");
    }
    if (vehicleUnit.tags.type_naval_ferry_barge) {
      ext_type.push("type_naval_ferry_barge");
    }
    if (vehicleUnit.tags.type_naval_aa_ferry) {
      ext_type.push("type_naval_aa_ferry");
    }
    if (vehicleUnit.tags.type_torpedo_gun_boat) {
      ext_type.push("type_torpedo_gun_boat");
    }
    if (vehicleUnit.tags.type_minelayer) {
      ext_type.push("type_minelayer");
    }
    if (vehicleUnit.tags.type_submarine_chaser) {
      ext_type.push("type_submarine_chaser");
    }
    if (vehicleUnit.tags.type_frigate && type !== "type_frigate") {
      ext_type.push("type_frigate");
    }
    return boatTypeSchema.parse({
      normal_type: type,
      extended_type: ext_type.length > 0 ? ext_type : undefined,
    });
  }

  return vehicleTypesSchema.parse({
    normal_type: type,
    extended_type: ext_type.length > 0 ? ext_type : undefined,
  });
}
