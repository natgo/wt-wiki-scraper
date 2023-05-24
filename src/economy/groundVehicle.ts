import { GroundVehicle, LangData, Mods } from "types";

import { NightVision, Sights, TankWeapons, opticIr } from "../../data/types/final.schema";
import { commonWeaponToCannon } from "./commonWeaponToCannon";
import { machineGun } from "./machineGun";
import { maxSpeed } from "./maxSpeed";

export function groundVehicle(
  vehicleData: GroundVehicle,
  modifications: Mods,
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
) {
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
              "ground",
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
            "ground",
          );
          gun ? weapons.cannon?.push(gun) : null;
        }
      } else if (element.triggerGroup === "coaxial" || element.triggerGroup === "machinegun") {
        const gun = machineGun(element, bullets, weaponry_lang, modification_lang, dev, "ground");
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
      const weapon = commonWeaponToCannon(
        Weapon,
        bullets,
        weaponry_lang,
        modification_lang,
        dev,
        "ground",
      );
      if (weapon) {
        weapons.cannon?.push(weapon);
      }
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

  return {
    has_smoke: vehicleData.modifications.tank_smoke_screen_system_mod ? true : undefined,
    has_ess: vehicleData.modifications.tank_engine_smoke_screen_system ? true : undefined,
    has_lws: lws ? true : undefined,
    has_era: era ? true : undefined,
    has_composite: composite ? true : undefined,
    has_laser_range: laser ? true : undefined,
    has_range: range ? true : undefined,
    optics: sights,
    weapons: weapons.machineGun?.length !== 0 ? weapons : { cannon: weapons.cannon },
  };
}

export function drive(vehicleData: GroundVehicle) {
  if (vehicleData.VehiclePhys) {
    const phys = vehicleData.VehiclePhys;

    let gearsF = 0;
    let gearsB = 0;
    if (phys.mechanics.gearRatios.ratio) {
      phys.mechanics.gearRatios.ratio.forEach((element) => {
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
      phys.mechanics.gearRatios.ratio.forEach((element, i, array) => {
        if (element + array[array.length - i - 1] === 0) {
          synchro++;
        }
      });
      if ((synchro - 1) / 2 === gearsB) {
        has_synchro = true;
      }
    }

    const speedAB = [
      maxSpeed(phys, phys.mechanics.gearRatios.ratio.length - 1) * 1.1,
      maxSpeed(phys, 0) * 1.1,
    ];
    const speedRB = [maxSpeed(phys, phys.mechanics.gearRatios.ratio.length - 1), maxSpeed(phys, 0)];

    return {
      mass: phys.Mass.Empty + phys.Mass.Fuel,
      horsepower: phys.engine.horsePowers,
      gears_forward: gearsF,
      gears_backward: gearsB,
      maxSpeedAB: speedAB,
      maxSpeedRB: speedRB,
      hydro_suspension: phys.movableSuspension ? true : undefined,
      can_float: phys.floats ? true : undefined,
      has_synchro: has_synchro ? true : undefined,
      has_neutral: phys.mechanics.neutralGearRatio ? true : undefined,
      has_dozer: vehicleData.modifications.tank_bulldozer_blade ? true : undefined,
    };
  }
  return undefined;
}
