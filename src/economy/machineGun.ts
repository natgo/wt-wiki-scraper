import fs from "fs";

import { parseLang } from "../lang";
import { GenericGun, LangData, Shell, ShellBelt, Weapon, WeaponGround } from "../types";

export function machineGun(
  Weapon: WeaponGround,
  bullets: { name: string; maxamount?: number }[],
  langdata: LangData[],
  dev: boolean,
): GenericGun | undefined {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  const enName = parseLang(langdata, "weapons/" + name)?.English;

  if (name === "dummy_weapon") {
    return undefined;
  } else {
    weapon_data = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/weapons/groundmodels_weapons/${name.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const shells: Shell[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const belts: ShellBelt[] = [];

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

  const cannon: GenericGun = {
    intname: name,
    displayname: enName ? enName : "",
    ammo: Weapon.bullets ? Weapon.bullets : 0,
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
