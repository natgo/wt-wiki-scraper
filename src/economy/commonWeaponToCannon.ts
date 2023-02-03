import fs from "fs";

import {
  Belt,
  Bullet,
  LangData,
  Shell,
  ShellBelt,
  TankCannon,
  Weapon,
  WeaponGround,
} from "../types";
import { stabilizer } from "./stabilizer";

export function commonWeaponToCannon(
  Weapon: WeaponGround,
  bullets: { name: string; maxamount?: number }[],
  langdata: LangData[],
  dev: boolean,
): TankCannon | undefined {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  const enName = langdata.find((langelement) => {
    return langelement.ID === "weapons/" + name;
  })?.English;

  if (name === "dummy_weapon") {
    weapon_data = {};
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

  const shells: Shell[] = [];
  const belts: ShellBelt[] = [];

  const weaponbullets: { name: string; maxamount?: number }[] = [];
  Object.entries(weapon_data).forEach(([key, value]) => {
    if (value instanceof Object && !Array.isArray(value)) {
      if (key === "overheat") {
        //d
      } else {
        bullets.forEach((element) => {
          if (element.name === key) {
            weaponbullets.push(element);
          }
        });
      }
    }
  });

  weaponbullets.forEach((element) => {
    if (weapon_data[element.name]) {
      //d
    } else {
      switch (element.name) {
        case "76mm_AP_1942":
          element.name = "76mm_ussr_AP_1942";
          break;
        case "90mm_us_M82_m48":
          element.name = "90mm_us_M82_APCBC";
          break;
        case "76mm_APCR_1943":
          element.name = "76mm_ussr_APCR_1943";
          break;
        case "76mm_AP_1941":
          element.name = "76mm_ussr_AP_1941";
          break;
        case "76mm_HEAT_1944":
          // su76d
          element.name = "76mm_ussr_HEAT_1944";
          break;
        default:
          throw new Error(`nonexistent bullet: ${element} on weapon: ${name}`);
      }
    }
    const bullet = weapon_data[element.name].bullet;
    if (Array.isArray(bullet)) {
      const belt: ShellBelt = {
        modname: element.name,
        shells: [],
        modmaxamount: element.maxamount,
        maxamount: weapon_data[element.name].bulletsCartridge
          ? weapon_data[element.name].bulletsCartridge
          : undefined,
      };
      bullet.forEach((weaponelement: Bullet) => {
        langdata.forEach((langelement) => {
          if (langelement.ID === weaponelement.bulletName && weaponelement.bulletName) {
            const shell: Belt = {
              name: langelement.English,
              intname: weaponelement.bulletName,
            };
            belt.shells.push(shell);
          }
        });
      });
      belts.push(belt);
    } else {
      const weaponelement = bullet;
      langdata.forEach((langelement) => {
        if (langelement.ID === weaponelement.bulletName && weaponelement.bulletName) {
          const shell: Shell = {
            modname: element.name,
            name: langelement.English,
            intname: weaponelement.bulletName,
            modmaxamount: element.maxamount,
            maxamount: weapon_data[element.name].bulletsCartridge
              ? weapon_data[element.name].bulletsCartridge
              : undefined,
          };
          shells.push(shell);
        }
      });
    }
  });

  const weaponbullet = weapon_data.bullet;

  // default shell
  if (
    !Array.isArray(weaponbullet) &&
    shells.find((element) => {
      return element.intname === weaponbullet.bulletName;
    })
  ) {
    //d
  } else {
    langdata.forEach((langelement) => {
      if (weaponbullet && !Array.isArray(weaponbullet)) {
        if (langelement.ID === weaponbullet.bulletName && weaponbullet.bulletName) {
          const shell: Shell = {
            modname: "default",
            name: langelement.English,
            intname: weaponbullet.bulletName,
          };
          shells.push(shell);
        }
      }
    });
  }

  // default belt
  if (belts.length > 0) {
    const belt: ShellBelt = {
      modname: "default",
      shells: [],
    };
    langdata.forEach((langelement) => {
      if (Array.isArray(weapon_data.bullet)) {
        weapon_data.bullet.forEach((element) => {
          if (langelement.ID === element.bulletName && element.bulletName) {
            const shell: Belt = {
              name: langelement.English,
              intname: element.bulletName,
            };
            belt.shells.push(shell);
          }
        });
      }
    });
    belts.push(belt);
  }

  const stab = stabilizer(Weapon);

  const cannon: TankCannon = {
    intname: name,
    displayname: enName?enName:"",
    secondary: Weapon.triggerGroup === "secondary" ? true : undefined,
    ammo: Weapon.bullets ? Weapon.bullets : 0,
    shells: shells.length > 0 ? shells : undefined,
    belts: belts.length > 0 ? belts : undefined,
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
    autoloader: Weapon.autoLoader,
    stabilizer: stab,
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
