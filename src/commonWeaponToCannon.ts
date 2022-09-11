import fs from "fs";
import { Shell, TankCannon, Weapon, WeaponGround } from "./types";

export function CWToCannon(Weapon:WeaponGround,bullets:string[],langdata:{ID:string,English:string}[]) {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length-1].replace(/\.blk/g,"");
  let weapon_data:Weapon;

  if (name === "dummy_weapon") {
    weapon_data = JSON.parse(fs.readFileSync(
      `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/weapons/${name}.blkx`,
      "utf-8",
    ));
  } else {
    weapon_data = JSON.parse(fs.readFileSync(
      `./War-Thunder-Datamine/aces.vromfs.bin_u/gamedata/weapons/groundmodels_weapons/${name.toLowerCase()}.blkx`,
      "utf-8",
    ));
  }

  const shells:Shell[] = [];
  bullets.forEach(element => {
    if (element.match(name.split("_")[0])) {
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
            throw new Error(`nonexsistant bullet: ${element} on weapon: ${name}`);
        }
      }
      langdata.forEach(langelement => {
        if (langelement.ID.match(weapon_data[element].bullet.bulletName)) {
          const shell:Shell = {
            modname: element,
            name: langelement.English,
            intname: weapon_data[element].bullet.bulletName
          };
          shells.push(shell);
        }
      });
    }
  });

  const cannon: TankCannon = {
    intname: name,
    ammo: Weapon.bullets ? Weapon.bullets : 0,
    shells: shells,
    horizonalSpeed: Weapon.speedYaw,
    verticalSpeed: Weapon.speedPitch,
    horizonalLimit: Weapon.limits.yaw,
    verticalLimit: Weapon.limits.pitch,
    autoloader: Weapon.autoLoader
  };
  return cannon;
}