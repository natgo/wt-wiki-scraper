import { AirVehicle, LangData } from "types";

import {
  FinalWeapon,
  FinalWeapons,
  SecondaryWeaponPreset,
  secondaryWeaponPresetSchema,
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
    const slots: Array<{
      hidden?: boolean;
      slot: Array<FinalWeapons | FinalWeapon | { name: string }>;
    }> = [];

    vehicleData.WeaponSlots.WeaponSlot.forEach((topelement) => {
      const slot: Array<FinalWeapons | FinalWeapon | { name: string }> = [];
      if (Array.isArray(topelement.WeaponPreset)) {
        topelement.WeaponPreset.forEach((element) => {
          slot.push({ ...DeepShit(element, weaponry_lang, dev) });
        });
        slots.push({ hidden: topelement.order ? undefined : true, slot: slot });
      } else {
        if (!topelement.WeaponPreset) {
          slots.push({ slot: [] });
        } else if ("Weapon" in topelement.WeaponPreset) {
          if (Array.isArray(topelement.WeaponPreset.Weapon)) {
            const weapon: FinalWeapons = {
              intname: topelement.WeaponPreset.name,
              iconType: topelement.WeaponPreset.iconType,
              reqModification: topelement.WeaponPreset.reqModification,
              weapons: WeaponArray(topelement.WeaponPreset.Weapon, weaponry_lang),
            };
            slot.push(weapon);
            slots.push({ hidden: topelement.order ? undefined : true, slot: [weapon] });
          } else {
            const type = typeSwitch(topelement.WeaponPreset.Weapon.trigger);
            if (type === null) {
              console.log(topelement, topelement.WeaponPreset.Weapon.trigger);
            }
            const weapon: FinalWeapon = {
              type: type,
              intname: topelement.WeaponPreset.name,
              ...weaponDisplayname(topelement.WeaponPreset, weaponry_lang, dev),
              iconType: topelement.WeaponPreset.iconType,
              reqModification: topelement.WeaponPreset.reqModification,
            };
            slots.push({ hidden: topelement.order ? undefined : true, slot: [weapon] });
          }
        } else {
          slots.push({
            hidden: topelement.order ? undefined : true,
            slot: [{ name: topelement.WeaponPreset.name }],
          });
        }
      }
    });
    weaponPreset = {
      maxload: vehicleData.WeaponSlots.maxloadMass,
      maxloadLeft: vehicleData.WeaponSlots.maxloadMassLeftConsoles,
      maxloadRight: vehicleData.WeaponSlots.maxloadMassRightConsoles,
      maxDisbalance: vehicleData.WeaponSlots.maxDisbalance,
      weaponSlots: slots,
    };
  }
  return weaponPreset ? secondaryWeaponPresetSchema.parse(weaponPreset) : undefined;
}
