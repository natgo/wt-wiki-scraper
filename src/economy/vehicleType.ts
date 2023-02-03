import { UnitData } from "../types";

export function vehicleType(vehicleUnit: UnitData): {
  normal_type: string;
  extended_type: string[] | undefined;
} {
  let type = "";
  const ext_type: string[] = [];

  //aircraft
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

  //ground
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

  //aircraft
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

  //helicopter
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

  return { normal_type: type, extended_type: ext_type.length > 0 ? ext_type : undefined };
}
