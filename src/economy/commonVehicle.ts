import {
  CountryName,
  Economy,
  FinalProps,
  LangData,
  Shop,
  ShopGroup,
  ShopItem,
  UnitData,
  namevehicle,
  premTypeSchema,
} from "../types";

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

function parseRangeColumn(
  intname: string,
  column: Record<string, ShopItem | ShopGroup>,
): ShopItem | undefined {
  let vehicle: ShopItem | undefined;
  Object.entries(column).forEach(([key, value]) => {
    if ("image" in value) {
      Object.entries(value).forEach(([key, value]) => {
        if (!(key === "image" || key === "reqAir")) {
          if (key === intname) {
            const value2 = value as ShopItem;
            vehicle = value2;
          }
        }
      });
    } else {
      if (key === intname) {
        const value2 = value as ShopItem;
        vehicle = value2;
      }
    }
  });
  return vehicle;
}

function findVehicleShop(
  intname: string,
  shopData: Shop,
  country: CountryName,
  shop: "army" | "aviation" | "helicopters" | "ships" | "boats",
): ShopItem | undefined {
  const shoprange = shopData[country][shop];
  if (!shoprange) {
    throw new Error(`no tree in ${shop} ${country}`);
  }
  let vehicle: ShopItem | undefined;
  if (!Array.isArray(shoprange.range)) {
    return parseRangeColumn(intname, shoprange.range);
  }

  shoprange.range.forEach((notelement) => {
    if (!vehicle) {
      vehicle = parseRangeColumn(intname, notelement);
    }
  });

  return vehicle;
}

export function commonVehicle(
  element: namevehicle,
  vehicleLang: LangData | undefined,
  vehicleEconomy: Economy,
  vehicleUnit: UnitData,
  shopData: Shop,
  shop: "army" | "aviation" | "helicopters" | "ships" | "boats",
): FinalProps {
  const shopVehicle = findVehicleShop(element.intname, shopData, vehicleEconomy.country, shop);

  let prem = "false";
  if (vehicleEconomy.costGold) {
    if (vehicleEconomy.gift) {
      if (vehicleEconomy.event) {
        prem = "event";
      } else {
        if (shopVehicle?.marketplaceItemdefId) {
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
    country: vehicleEconomy.country,
    operator_country: vehicleUnit.operatorCountry,
    rank: vehicleEconomy.rank,
    br: [
      br[vehicleEconomy.economicRankArcade],
      br[vehicleEconomy.economicRankHistorical],
      br[vehicleEconomy.economicRankSimulation],
    ],
    realbr: [
      vehicleEconomy.economicRankArcade,
      vehicleEconomy.economicRankHistorical,
      vehicleEconomy.economicRankSimulation,
    ],
    base_repair: [
      vehicleEconomy.repairCostArcade,
      vehicleEconomy.repairCostHistorical,
      vehicleEconomy.repairCostSimulation,
    ],
    rp_multiplyer: vehicleEconomy.expMul,
    sl_multiplyer: [
      vehicleEconomy.rewardMulArcade,
      vehicleEconomy.rewardMulHistorical,
      vehicleEconomy.rewardMulSimulation,
    ],
    sl_price: vehicleEconomy.value,
    reqRP: vehicleEconomy.reqExp,
    prem_type: premTypeSchema.parse(prem),
    marketplace: element.marketplace,
    store: element.store,
    event: vehicleEconomy.event ? vehicleEconomy.event : undefined,
    cost_gold: vehicleEconomy.costGold,
    hidden: vehicleEconomy.showOnlyWhenBought ? true : undefined,
    crew: vehicleEconomy.crewTotalCount,
  };

  return commonProps;
}
