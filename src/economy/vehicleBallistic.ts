import { AirVehicle } from "types";

import { BallisticComputer } from "../../data/types/final.schema";

export function vehicleBallistic(vehicleData: AirVehicle): BallisticComputer | undefined {
  let ballistic: BallisticComputer | undefined = undefined;
  if (
    vehicleData.haveCCIPForGun ||
    vehicleData.haveCCIPForRocket ||
    vehicleData.haveCCIPForBombs ||
    vehicleData.haveCCRPForBombs
  ) {
    ballistic = {
      ccip_guns: vehicleData.haveCCIPForGun ? true : undefined,
      ccip_rockets: vehicleData.haveCCIPForRocket ? true : undefined,
      ccip_bombs: vehicleData.haveCCIPForBombs ? true : undefined,
      ccrp_bombs: vehicleData.haveCCRPForBombs ? true : undefined,
    };
  }
  return ballistic ? ballistic : undefined;
}
