import { Economy, FinalProps, Shop, ShopItem, UnitData, namevehicle } from "../types";
import { vehicleType } from "./vehicleType";

const br = [
  "1.0",
  "1.3",
  "1.7",
  "2.0",
  "2.3",
  "2.7",
  "3.0",
  "3.3",
  "3.7",
  "4.0",
  "4.3",
  "4.7",
  "5.0",
  "5.3",
  "5.7",
  "6.0",
  "6.3",
  "6.7",
  "7.0",
  "7.3",
  "7.7",
  "8.0",
  "8.3",
  "8.7",
  "9.0",
  "9.3",
  "9.7",
  "10.0",
  "10.3",
  "10.7",
  "11.0",
  "11.3",
  "11.7",
  "12.0",
  "12.3",
  "12.7",
  "13.0",
];

export function commonVehicle(
  element: namevehicle,
  vehicleLang:
    | {
        ID: string;
        English: string;
      }
    | undefined,
  vehicleEconomy: Economy,
  vehicleUnit: UnitData,
  shopData: Shop,
  shop: "army" | "aviation" | "helicopters",
) {
  let marketplace: number | undefined;
  shopData[vehicleEconomy.country][shop].range.forEach((notelement) => {
    Object.entries(notelement).forEach(([key, value]) => {
      if ("image" in value) {
        Object.entries(value).forEach(([key, value]) => {
          if (!(key === "image" || key === "reqAir")) {
            if (key === element.intname) {
              const value2 = value as ShopItem;
              marketplace = value2.marketplaceItemdefId;
            }
          }
        });
      } else {
        if (key === element.intname) {
          const value2 = value as ShopItem;
          marketplace = value2.marketplaceItemdefId;
        }
      }
    });
  });

  let prem = "false";
  if (vehicleEconomy.costGold) {
    if (vehicleEconomy.gift) {
      if (vehicleEconomy.event) {
        prem = "event";
      } else {
        if (marketplace) {
          prem = "marketplace";
        } else {
          prem = "store";
        }
      }
    } else {
      prem = "gold";
    }
  } else {
    if (vehicleEconomy.researchType) {
      prem = "squad";
    } else {
      if (vehicleEconomy.event) {
        prem = "event";
      }
    }
  }

  const commonProps: FinalProps = {
    intname: element.intname,
    wikiname: element.wikiname,
    displayname: vehicleLang?.English ? vehicleLang.English : undefined,
    ...vehicleType(vehicleUnit),
    country: vehicleEconomy.country,
    operator_country: vehicleUnit.operatorCountry,
    rank: vehicleEconomy.rank,
    br: [br[vehicleEconomy.economicRankArcade],br[vehicleEconomy.economicRankHistorical],br[vehicleEconomy.economicRankSimulation]],
    realbr: [vehicleEconomy.economicRankArcade,vehicleEconomy.economicRankHistorical,vehicleEconomy.economicRankSimulation],
    base_repair: [vehicleEconomy.repairCostArcade,vehicleEconomy.repairCostHistorical,vehicleEconomy.repairCostSimulation],
    rp_multiplyer: vehicleEconomy.expMul,
    sl_multiplyer: [vehicleEconomy.rewardMulArcade,vehicleEconomy.rewardMulHistorical,vehicleEconomy.rewardMulSimulation],
    sl_price: vehicleEconomy.value,
    reqRP: vehicleEconomy.reqExp,
    prem_type: prem,
    marketplace: element.marketplace,
    store: element.store,
    event: vehicleEconomy.event ? vehicleEconomy.event : undefined,
    cost_gold: vehicleEconomy.costGold,
    hidden: vehicleEconomy.showOnlyWhenBought ? true : undefined,
    crew: vehicleEconomy.crewTotalCount,
  };

  return commonProps;
}
