import fs from "fs";

import { parseLang } from "../lang";
import { GenericGun, LangData, Weapon, WeaponGround } from "../types";
import { weaponbulletsLoop } from "./commonWeaponToCannon";

export function machineGun(
  Weapon: WeaponGround,
  bullets: { name: string; maxamount?: number }[],
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
): GenericGun | undefined {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  const enName = parseLang(weaponry_lang, "weapons/" + name)?.English;

  if (name === "dummy_weapon") {
    return undefined;
  } else {
    weapon_data = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/weapons/groundmodels_weapons/${name.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
  }

  const weaponbullets: { name: string; maxamount?: number }[] = [];
  Object.entries(weapon_data).forEach(([key, value]) => {
    if (value instanceof Object && !Array.isArray(value)) {
      if (!(key === "overheat")) {
        bullets.forEach((element) => {
          if (element.name === key) {
            weaponbullets.push(element);
          }
        });
      }
    }
  });

  const weapon = weaponbulletsLoop(
    weaponbullets,
    weapon_data,
    name,
    weaponry_lang,
    modification_lang,
    false,
    dev,
  );

  const cannon: GenericGun = {
    intname: name,
    displayname: enName ? enName : "",
    ammo: Weapon.bullets ? Weapon.bullets : 0,
    shells: weapon.shells.length > 0 ? weapon.shells : undefined,
    belts: weapon.belts.length > 0 ? weapon.belts : undefined,
    horizonalSpeed:
      Weapon.parkInDeadzone || Weapon.speedYaw === 0 || Weapon.speedPitch === 0
        ? "primary"
        : Weapon.speedYaw,
    verticalSpeed:
      Weapon.parkInDeadzone || Weapon.speedYaw === 0 || Weapon.speedPitch === 0
        ? "primary"
        : Weapon.speedPitch,
    horizonalLimit:
      Weapon.parkInDeadzone || Weapon.speedYaw === 0 || Weapon.speedPitch === 0
        ? "primary"
        : Weapon.limits.yaw,
    verticalLimit:
      Weapon.parkInDeadzone || Weapon.speedYaw === 0 || Weapon.speedPitch === 0
        ? "primary"
        : Weapon.limits.pitch,
    shotFreq: weapon_data.shotFreq,
    caliber: parseFloat(
      Weapon.blk
        .split("/")
        [Weapon.blk.split("/").length - 1].split("_")[0]
        .substring(0, Weapon.blk.split("_")[0].length - 2),
    ),
  };
  return cannon;
}
