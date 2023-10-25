import { AirVehicle, LangData, WeaponSlot } from "types";

import {
  FinalWeapon,
  FinalWeaponSlot,
  FinalWeapons,
  SecondaryWeaponPreset,
} from "../../data/types/final.schema";
import { DeepShit, WeaponArray, typeSwitch } from "./secondaryPresets";
import { weaponDisplayname } from "./weaponDisplayname";

export function vehiclePreset(
  vehicleData: AirVehicle,
  weaponry_lang: LangData[],
  dev: boolean,
): SecondaryWeaponPreset | undefined {
  let weaponPreset: SecondaryWeaponPreset | undefined = undefined;
  if (vehicleData.WeaponSlots) {
    const slots: FinalWeaponSlot[] = [];

    if (Array.isArray(vehicleData.WeaponSlots.WeaponSlot)) {
      vehicleData.WeaponSlots.WeaponSlot.forEach((element) => {
        slots.push(somethingWeaponSlot(element, weaponry_lang, dev));
      });
    } else {
      slots.push(somethingWeaponSlot(vehicleData.WeaponSlots.WeaponSlot, weaponry_lang, dev));
    }

    weaponPreset = {
      maxload: vehicleData.WeaponSlots.maxloadMass,
      maxloadLeft: vehicleData.WeaponSlots.maxloadMassLeftConsoles,
      maxloadRight: vehicleData.WeaponSlots.maxloadMassRightConsoles,
      maxDisbalance: vehicleData.WeaponSlots.maxDisbalance,
      weaponSlots: slots,
    };
  }
  return weaponPreset ? weaponPreset : undefined;
}

function somethingWeaponSlot(slot: WeaponSlot, weaponry_lang: LangData[], dev: boolean) {
  let finalSlot: FinalWeaponSlot;
  const tempSlot: Array<FinalWeapons | FinalWeapon | { name: string }> = [];

  if (Array.isArray(slot.WeaponPreset)) {
    slot.WeaponPreset.forEach((element) => {
      tempSlot.push({ ...DeepShit(element, weaponry_lang, dev) });
    });
    finalSlot = {
      hidden: slot.tier ? undefined : slot.order && slot.index !== 0 ? undefined : true,
      slot: tempSlot,
    };
  } else {
    if (!slot.WeaponPreset) {
      finalSlot = { slot: [] };
    } else if ("Weapon" in slot.WeaponPreset) {
      if (Array.isArray(slot.WeaponPreset.Weapon)) {
        const weapon: FinalWeapons = {
          intname: slot.WeaponPreset.name,
          iconType: slot.WeaponPreset.iconType,
          reqModification: slot.WeaponPreset.reqModification,
          weapons: WeaponArray(slot.WeaponPreset.Weapon, weaponry_lang),
        };
        tempSlot.push(weapon);
        finalSlot = { hidden: slot.order ? undefined : true, slot: [weapon] };
      } else {
        const type = typeSwitch(slot.WeaponPreset.Weapon.trigger);
        if (type === null) {
          console.log(slot, slot.WeaponPreset.Weapon.trigger);
        }
        const weapon: FinalWeapon = {
          type: type,
          intname: slot.WeaponPreset.name,
          ...weaponDisplayname(slot.WeaponPreset, weaponry_lang, dev),
          iconType: slot.WeaponPreset.iconType,
          reqModification: slot.WeaponPreset.reqModification,
        };
        finalSlot = { hidden: slot.order ? undefined : true, slot: [weapon] };
      }
    } else {
      finalSlot = {
        hidden: slot.order ? undefined : true,
        slot: [{ name: slot.WeaponPreset.name }],
      };
    }
  }

  return finalSlot;
}
