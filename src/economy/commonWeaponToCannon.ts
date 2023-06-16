import fs from "fs";
import { LangData, Weapon, WeaponGround } from "types";

import { Belt, Shell, ShellBelt, TankCannon } from "../../data/types/final.schema";
import { parseLang } from "../lang";
import { stabilizer } from "./stabilizer";

export function commonWeaponToCannon(
  Weapon: WeaponGround,
  bullets: { name: string; maxamount?: number }[],
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
  directory: "naval" | "ground",
): TankCannon {
  const name = Weapon.blk.split("/")[Weapon.blk.split("/").length - 1].replace(/\.blk/g, "");
  let weapon_data: Weapon;
  const enName = parseLang(weaponry_lang, "weapons/" + name)?.English;

  if (name === "dummy_weapon") {
    return {
      dummy: true,
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
      stabilizer: stabilizer(Weapon),
    };
  } else {
    weapon_data = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "datamine"
        }/aces.vromfs.bin_u/gamedata/weapons/${directory}models_weapons/${name.toLowerCase()}.blkx`,
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

  const defaultbullet = weapon_data.bullet ?? weapon_data.rocket ?? null;
  if (defaultbullet === null) {
    throw new Error("no default bullet");
  }

  // default shell
  if (
    !Array.isArray(defaultbullet) &&
    !weapon.shells.find((element) => {
      return element.intname === defaultbullet.bulletName;
    }) &&
    defaultbullet &&
    isCannon
  ) {
    const langFind = parseLang(weaponry_lang, defaultbullet.bulletName);
    if (langFind) {
      const shell: Shell = {
        modname: "default",
        type: defaultbullet.bulletType,
        name: langFind.English,
        intname: defaultbullet.bulletName,
      };
      weapon.shells.push(shell);
    }
  }

  // default belt
  if ((!isCannon || weapon.belts.length > 0) && defaultbullet) {
    const belt: ShellBelt = {
      modname: "default",
      name: "Default",
      shells: [],
    };
    if (Array.isArray(defaultbullet)) {
      defaultbullet.forEach((bulletelement) => {
        const langFind = parseLang(weaponry_lang, bulletelement.bulletName);
        const langFind2 = parseLang(weaponry_lang, bulletelement.bulletName + "/name");
        const shell: Belt = {
          type: bulletelement.bulletType,
          name: "",
          intname: bulletelement.bulletName ? bulletelement.bulletName : "default",
        };

        if (langFind && langFind.English) {
          shell.name = langFind.English;
        } else if (langFind2 && langFind2.English) {
          shell.name = langFind2.English;
        }

        belt.shells.push(shell);
      });
    } else {
      const langFind = parseLang(weaponry_lang, defaultbullet.bulletName);
      const langFind2 = parseLang(weaponry_lang, defaultbullet.bulletName + "/name");
      const shell: Belt = {
        type: defaultbullet.bulletType,
        name: "",
        intname: defaultbullet.bulletName ? defaultbullet.bulletName : "default",
      };

      if (langFind && langFind.English) {
        shell.name = langFind.English;
      } else if (langFind2 && langFind2.English) {
        shell.name = langFind2.English;
      }

      belt.shells.push(shell);
    }
    weapon.belts.push(belt);
  }

  let caliber;
  if (Array.isArray(defaultbullet)) {
    caliber = defaultbullet[0].caliber * 1000;
  } else {
    caliber = defaultbullet.caliber * 1000;
  }

  if (!caliber) {
    console.log(defaultbullet);
    console.log(name);

    throw new Error("no caliber");
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
    shotFreq: Weapon.shotFreq ? Weapon.shotFreq : weapon_data.shotFreq,
    reloadTime: Weapon.reloadTime ? Weapon.reloadTime : weapon_data.reloadTime,
    caliber: caliber,
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
        name: weaponLang(
          element.name,
          bullet[0].bulletType,
          bullet[0].bulletName,
          weaponry_lang,
          modification_lang,
          dev,
        ),
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
          type: bullet.bulletType,
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
          name: weaponLang(
            element.name,
            bullet.bulletType,
            bullet.bulletName,
            weaponry_lang,
            modification_lang,
            dev,
          ),
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
  bulletType: string,
  bulletName: string | undefined,
  weaponry_lang: LangData[],
  modification_lang: LangData[],
  dev: boolean,
): string {
  const langFindShort = parseLang(weaponry_lang, name + "/name/short");
  const bulletTypeFindShort = parseLang(weaponry_lang, bulletType + "/name/short");
  const langFind = weaponry_lang.find((langelement) => {
    return langelement.ID === name || langelement.ID === name + "/name";
  });
  const langFind2 = weaponry_lang.find((langelement) => {
    return langelement.ID === bulletName || langelement.ID === bulletName + "/name";
  });
  const modlangFind = modification_lang.find((langelement) => {
    return langelement.ID === name || langelement.ID === name + "/name";
  });

  if (!langFindShort && !langFind && !langFind2 && !modlangFind && !bulletTypeFindShort && !dev) {
    if (name.endsWith("_universal")) {
      return "Universal";
    }
    throw new Error(`no lang for ${name} bulletName: ${bulletName} bulletType: ${bulletType}`);
  }

  if (langFindShort && langFindShort.English) {
    return (name = langFindShort.English);
  } else if (langFind && langFind.English) {
    return (name = langFind.English);
  } else if (modlangFind && modlangFind.English) {
    return (name = modlangFind.English);
  } else if (langFind2 && langFind2.English) {
    return (name = langFind2.English);
  } else if (bulletTypeFindShort && bulletTypeFindShort.English) {
    return (name = bulletTypeFindShort.English);
  } else if (name.endsWith("_universal")) {
    return "Universal";
  } else if (!dev) {
    return "";
  } else {
    throw new Error(`no lang for: ${name} bullet: ${bulletName}`);
  }
}
