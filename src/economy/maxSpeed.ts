import { VehiclePhys } from "types";

/**
 * Calculates the top speed of a specific gear for a ground vehicle.
 *
 * @param {VehiclePhys} phys - The `VehiclePhys` object representing the ground vehicle.
 * @param {number} gear - The gear to calculate the top speed for.
 * @returns {number} The top speed (in km/h) for the specified gear.
 * @export
 */
export function maxSpeed(phys: VehiclePhys, gear: number): number {
  return (
    ((phys.engine.maxRPM * phys.mechanics.driveGearRadius) /
      (phys.mechanics.mainGearRatio *
        phys.mechanics.sideGearRatio *
        phys.mechanics.gearRatios.ratio[gear])) *
    (0.12 * Math.PI)
  );
}
