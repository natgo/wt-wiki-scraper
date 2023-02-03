import { Stabilizer, WeaponGround } from "../types";

export function stabilizer(Weapon: WeaponGround): Stabilizer | undefined {
  let stabilizer: Stabilizer | undefined = undefined;

  if (Weapon.gunStabilizer) {
    stabilizer = {
      horizontal: Weapon.gunStabilizer?.hasHorizontal
        ? Weapon.gunStabilizer?.hasHorizontal
        : undefined,
      vertical:
        !Weapon.gunStabilizer?.hasVerticalGunFreeMode && Weapon.gunStabilizer?.hasVertical
          ? Weapon.gunStabilizer?.hasVertical
          : undefined,
      shoulderStop: Weapon.gunStabilizer?.hasVerticalGunFreeMode
        ? Weapon.gunStabilizer?.hasVerticalGunFreeMode
        : undefined,
      horizontalSpeed:
        Weapon.gunStabilizer?.hasHorizontal && Weapon.gunStabilizer?.horizontalSpeedLimitKPH
          ? Weapon.gunStabilizer?.horizontalSpeedLimitKPH
          : undefined,
      verticalSpeed:
        (Weapon.gunStabilizer?.hasVerticalGunFreeMode || Weapon.gunStabilizer?.hasVertical) &&
        Weapon.gunStabilizer?.verticalSpeedLimitKPH
          ? Weapon.gunStabilizer?.verticalSpeedLimitKPH
          : undefined,
    };
  }

  return stabilizer ? stabilizer : undefined;
}
