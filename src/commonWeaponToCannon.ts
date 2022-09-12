import fs from "fs";

import { Belt, Bullet, Shell, ShellBelt, TankCannon, Weapon, WeaponGround } from "./types";

export function CWToCannon(
  Weapon: WeaponGround,
  bullets: string[],
  langdata: { ID: string; English: string }[],
) {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  let nimi = "";

  langdata.forEach((langelement) => {
    if (langelement.ID === "weapons/" + name) {
      nimi = langelement.English;
    }
  });

  if (name === "dummy_weapon") {
    weapon_data = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/weapons/${name}.blkx`,
        "utf-8",
      ),
    );
  } else {
    weapon_data = JSON.parse(
      fs.readFileSync(
        `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/weapons/groundmodels_weapons/${name.toLowerCase()}.blkx`,
        "utf-8",
      ),
    );
  }

  const shells: Shell[] = [];
  const belts: ShellBelt[] = [];

  const weaponbullets: string[] = [];
  Object.entries(weapon_data).forEach(([key,value]) => {
    if (value instanceof Object && !Array.isArray(value)) {
      if (key === "overheat") {
        //d
      } else {
        bullets.forEach(element => {
          if (element === key) {
            weaponbullets.push(element);
          }
        });
      }
    }
  });

  weaponbullets.forEach((element) => {
    if (weapon_data[element]) {
      //d
    } else {
      switch (element) {
        case "76mm_AP_1942":
          element = "76mm_ussr_AP_1942";
          break;
        case "90mm_us_M82_m48":
          element = "90mm_us_M82_APCBC";
          break;
        case "76mm_APCR_1943":
          element = "76mm_ussr_APCR_1943";
          break;
        case "76mm_AP_1941":
          element = "76mm_ussr_AP_1941";
          break;
        case "76mm_HEAT_1944":
          // su76d
          element = "76mm_ussr_HEAT_1944";
          break;
        default:
          throw new Error(`nonexistent bullet: ${element} on weapon: ${name}`);
      }
    }

    if (Array.isArray(weapon_data[element].bullet)) {
      const belt: ShellBelt = {
        modname: element,
        shells: [],
      };
      weapon_data[element].bullet.forEach((weaponelement: Bullet) => {
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
      const weaponelement: Bullet = weapon_data[element].bullet;
      langdata.forEach((langelement) => {
        if (langelement.ID === weaponelement.bulletName && weaponelement.bulletName) {
          const shell: Shell = {
            modname: element,
            name: langelement.English,
            intname: weaponelement.bulletName,
          };
          shells.push(shell);
        }
      });
    }
    
  });

  // default shell
  if (
    shells.find((element) => {
      return element.intname === weapon_data.bullet.bulletName;
    })
  ) {
    //d
  } else {
    langdata.forEach((langelement) => {
      if (weapon_data.bullet && !Array.isArray(weapon_data.bullet)) {
        if (langelement.ID === weapon_data.bullet.bulletName && weapon_data.bullet.bulletName) {
          const shell: Shell = {
            modname: "default",
            name: langelement.English,
            intname: weapon_data.bullet.bulletName,
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

  const cannon: TankCannon = {
    intname: name,
    name: nimi,
    ammo: Weapon.bullets ? Weapon.bullets : 0,
    shells: shells.length > 0 ? shells : undefined,
    belts: belts.length > 0 ? belts : undefined,
    horizonalSpeed: Weapon.speedYaw,
    verticalSpeed: Weapon.speedPitch,
    horizonalLimit: Weapon.limits.yaw,
    verticalLimit: Weapon.limits.pitch,
    autoloader: Weapon.autoLoader,
    reload: 1 / weapon_data.shotFreq,
  };
  return cannon;
}
