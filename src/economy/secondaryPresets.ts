import {
  Cannon,
  FinalWeapon,
  FinalWeaponArray,
  FinalWeapons,
  WeaponNamePreset,
  WeaponPreset,
} from "../types";
import { weaponDisplayname } from "./weaponDisplayname";

export function DeepShit(
  element: WeaponPreset | WeaponNamePreset,
  weaponry_lang: { ID: string; English: string }[],
  dev: boolean,
): FinalWeapon | FinalWeapons | { name: string } {
  if ("Weapon" in element) {
    if (Array.isArray(element.Weapon)) {
      const weapon: FinalWeapons = {
        intname: element.name,
        iconType: element.iconType,
        reqModification: element.reqModification,
        weapons: WeaponArray(element.Weapon, weaponry_lang),
      };
      return weapon;
    } else {
      const type = typeSwitch(element.Weapon.trigger);
      if (type === null) {
        console.log(element, element.Weapon.trigger);
      }
      const weapon: FinalWeapon = {
        type: type,
        intname: element.name,
        ...weaponDisplayname(element, weaponry_lang, dev),
        iconType: element.iconType,
        reqModification: element.reqModification,
      };
      return weapon;
    }
  } else {
    return { name: element.name };
  }
}

export function WeaponArray(
  element: Cannon[],
  weaponry_lang: { ID: string; English: string }[],
): FinalWeaponArray[] {
  const weapons: FinalWeaponArray[] = [];
  element.forEach((element) => {
    const type = typeSwitch(element.trigger);
    if (type === null) {
      console.log(element, element.trigger, "deep");
    }
    weapons.push({
      type: type,
      displayname: weaponry_lang.find((botelement) => {
        const blk = element.blk.split("/");
        return (
          botelement.ID.toLowerCase() ===
          `weapons/${blk[blk.length - 1].split(".")[0].toLowerCase()}/short`
        );
      })?.English,
      bullets: element.bullets,
    });
  });
  return weapons;
}

export function typeSwitch(trigger: string) {
  let type:
    | "aam"
    | "agm"
    | "bomb"
    | "guided_bomb"
    | "torpedo"
    | "rocket"
    | "gun"
    | "countermeasures"
    | "fuel_tank"
    | "optics"
    | "targeting_pod"
    | "booster"
    | null = null;
  switch (trigger) {
    case "aam":
      type = "aam";
      break;
    case "atgm":
      type = "agm";
      break;
    case "rockets":
      type = "rocket";
      break;
    case "bombs":
      type = "bomb";
      break;
    case "guided bombs":
      type = "guided_bomb";
      break;
    case "torpedoes":
      type = "torpedo";
      break;
    case "machine gun":
      type = "gun";
      break;
    case "cannon":
      type = "gun";
      break;
    case "additional gun":
      type = "gun";
      break;
    case "countermeasures":
      type = "countermeasures";
      break;
    case "fuel tanks":
      type = "fuel_tank";
      break;
    case "gunner0":
      type = "optics";
      break;
    case "gunner1":
      type = "optics";
      break;
    case "targetingPod":
      type = "targeting_pod";
      break;
    case "boosters":
      type = "booster";
      break;
  }
  return type;
}
