import fs from "fs";

import { parseLang } from "../lang";
import { Belt, LangData, Shell, ShellBelt, TankCannon, Weapon, WeaponGround } from "../types";
import { stabilizer } from "./stabilizer";

export function commonWeaponToCannon(
  Weapon: WeaponGround,
  bullets: { name: string; maxamount?: number }[],
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
): TankCannon | undefined {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  const enName = parseLang(weaponry_lang, "weapons/" + name)?.English;

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

  let isCannon = true;
  if (weapon_data.cannon === false || weapon_data.maxDeltaAngleVertical === undefined) {
    isCannon = false;
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
    isCannon,
    dev,
  );

  const weaponbullet = weapon_data.bullet;

  // default shell
  if (
    !Array.isArray(weaponbullet) &&
    weapon.shells.find((element) => {
      return element.intname === weaponbullet.bulletName;
    })
  ) {
    //d
  } else {
    weaponry_lang.forEach((langelement) => {
      if (weaponbullet && !Array.isArray(weaponbullet)) {
        if (langelement.ID === weaponbullet.bulletName) {
          const shell: Shell = {
            modname: "default",
            name: langelement.English,
            intname: weaponbullet.bulletName,
          };
          weapon.shells.push(shell);
        }
      }
    });
  }

  // default belt
  if (weapon.belts.length > 0) {
    const belt: ShellBelt = {
      modname: "default",
      name: "Default",
      shells: [],
    };
    if (Array.isArray(weapon_data.bullet)) {
      weapon_data.bullet.forEach((bulletelement) => {
        const langFind = weaponry_lang.find((langelement) => {
          return (
            langelement.ID === bulletelement.bulletName ||
            langelement.ID === bulletelement.bulletName + "/name"
          );
        });
        const shell: Belt = {
          type: bulletelement.bulletType,
          name: langFind?.English,
          intname: bulletelement.bulletName ? bulletelement.bulletName : "default",
        };
        belt.shells.push(shell);
      });
    }
    weapon.belts.push(belt);
  }

  const stab = stabilizer(Weapon);

  const cannon: TankCannon = {
    intname: name,
    displayname: enName ? enName : "",
    secondary: Weapon.triggerGroup === "secondary" ? true : undefined,
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

export function weaponbulletsLoop(
  weaponbullets: {
    name: string;
    maxamount?: number | undefined;
  }[],
  weapon_data: Weapon,
  name: string,
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  isCannon: boolean,
  dev: boolean,
): { shells: Shell[]; belts: ShellBelt[] } {
  const shells: Shell[] = [];
  const belts: ShellBelt[] = [];

  weaponbullets.forEach((element) => {
    const bullet = weapon_data[element.name].bullet;
    if (!bullet) {
      throw new Error(`nonexistent bullet: ${element} on weapon: ${name}`);
    }

    if (Array.isArray(bullet)) {
      const belt: ShellBelt = {
        modname: element.name,
        name: weaponLang(element.name, bullet[0].bulletName, weaponry_lang, modification_lang, dev),
        shells: [],
        modmaxamount: element.maxamount,
        maxamount: weapon_data[element.name].bulletsCartridge
          ? weapon_data[element.name].bulletsCartridge
          : undefined,
      };

      bullet.forEach((weaponelement) => {
        const langFind = weaponry_lang.find((langelement) => {
          return (
            langelement.ID === weaponelement.bulletName ||
            langelement.ID === weaponelement.bulletName + "/name"
          );
        });
        const shell: Belt = {
          type: weaponelement.bulletType,
          name: langFind?.English,
          intname: weaponelement.bulletName ? weaponelement.bulletName : element.name,
        };
        belt.shells.push(shell);
      });
      belts.push(belt);
    } else {
      if (isCannon) {
        const langFind = weaponry_lang.find((langelement) => {
          return langelement.ID === element.name || langelement.ID === element.name + "/name";
        });
        const langFind2 = weaponry_lang.find((langelement) => {
          return (
            langelement.ID === bullet.bulletName || langelement.ID === bullet.bulletName + "/name"
          );
        });
        const modlangFind = modification_lang.find((langelement) => {
          return langelement.ID === element.name || langelement.ID === element.name + "/name";
        });
        if (!langFind && !langFind2 && !modlangFind && !dev) {
          console.log(element.name, bullet.bulletName);
          throw new Error(`no lang for ${element.name}`);
        }

        const shell: Shell = {
          modname: element.name,
          name: "",
          intname: bullet.bulletName,
          modmaxamount: element.maxamount,
          maxamount: weapon_data[element.name].bulletsCartridge
            ? weapon_data[element.name].bulletsCartridge
            : undefined,
        };

        if (langFind2 && langFind2.English) {
          shell.name = langFind2.English;
        } else if (langFind && langFind.English) {
          shell.name = langFind.English;
        } else if (modlangFind && modlangFind.English) {
          shell.name = modlangFind.English;
        }

        shells.push(shell);
      } else {
        const belt: ShellBelt = {
          modname: element.name,
          name: weaponLang(element.name, bullet.bulletName, weaponry_lang, modification_lang, dev),
          shells: [],
          modmaxamount: element.maxamount,
          maxamount: weapon_data[element.name].bulletsCartridge
            ? weapon_data[element.name].bulletsCartridge
            : undefined,
        };

        const beltLangFind = weaponry_lang.find((langelement) => {
          return (
            langelement.ID === bullet.bulletName || langelement.ID === bullet.bulletName + "/name"
          );
        });
        const shell: Belt = {
          type: bullet.bulletType,
          name: beltLangFind?.English,
          intname: bullet.bulletName ? bullet.bulletName : element.name,
        };
        belt.shells.push(shell);
        belts.push(belt);
      }
    }
  });

  return { shells, belts };
}

function weaponLang(
  name: string,
  bulletName: string | undefined,
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
): string {
  const langFind = weaponry_lang.find((langelement) => {
    return langelement.ID === name || langelement.ID === name + "/name";
  });
  const langFind2 = weaponry_lang.find((langelement) => {
    return langelement.ID === bulletName || langelement.ID === bulletName + "/name";
  });
  const modlangFind = modification_lang.find((langelement) => {
    return langelement.ID === name || langelement.ID === name + "/name";
  });

  if (name === "152mm_football_jump") {
    return "";
  }

  if (!langFind && !langFind2 && !modlangFind && !dev) {
    if (name.endsWith("_universal")) {
      return "Universal";
    }
    throw new Error(`no lang for ${name}`);
  }

  if (langFind && langFind.English) {
    return (name = langFind.English);
  } else if (modlangFind && modlangFind.English) {
    return (name = modlangFind.English);
  } else if (langFind2 && langFind2.English) {
    return (name = langFind2.English);
  } else if (name.endsWith("_universal")) {
    return "Universal";
  } else if (!dev) {
    return "";
  } else {
    throw new Error(`no lang for: ${name} bullet: ${bulletName}`);
  }
}
