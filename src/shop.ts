import fs from "fs";
import { format } from "prettier";

import { Final, VehicleProps } from "../data/types/final.schema";
import {
  FinalFinalShopRange,
  FinalRange,
  FinalShop,
  FinalShopGroup,
  FinalShopItem,
  FinalShopRange,
  finalShopSchema,
} from "../data/types/shop.schema";
import { langCsvToJSON } from "./csvJSON";
import { parseLang } from "./lang";
import {
  CountryName,
  LangData,
  NeedBuyToOpenNextInEra,
  Rank,
  Shop,
  ShopCountry,
  ShopGroup,
  ShopItem,
  country,
} from "./types";

function minMaxRank(
  army: FinalShopRange,
  column: Record<string, ShopItem | ShopGroup>,
  maxRank: number,
  final: VehicleProps[],
): { army: { max_rank: number; min_rank: number }; maxRank: number } {
  Object.entries(column).forEach(([key, value]) => {
    if (!("image" in value)) {
      const find = final.find((vehicle) => {
        return vehicle.intname === key;
      });

      if (find && find.rank < army.min_rank) {
        army.min_rank = find.rank;
      }

      if (find && find.rank > maxRank) {
        army.max_rank = find.rank;
        maxRank = find.rank;
      }
    }
  });
  return { army, maxRank };
}

function parseColumn(
  army: FinalShopRange,
  isPrem: boolean,
  column: Record<string, ShopItem | ShopGroup>,
  units_lang: LangData[],
  final: VehicleProps[],
  dev: boolean,
) {
  const range: Array<FinalShopItem | FinalShopGroup> = [];
  Object.entries(column).forEach(([key, value]) => {
    if ("image" in value) {
      const groupLang = parseLang(units_lang, "shop/group/" + key);
      if (!groupLang && !dev) {
        throw new Error(`no match in lang data to shop/group/${key}`);
      }

      const out: FinalShopGroup = {
        name: key,
        displayname: groupLang?.English || key,
        image: value.image.split("#")[2],
        reqAir: value.reqAir,
        vehicles: [],
      };
      Object.entries(value).forEach(([key, value]) => {
        if (!(key === "image" || key === "reqAir") && typeof value !== "string") {
          if (Array.isArray(value.reqAir)) {
            value.reqAir = "";
          }
          out.vehicles.push({
            name: key,
            rank: value.rank,
            reqAir: value.reqAir,
            gift: value.gift ? true : undefined,
            hidden: value.showOnlyWhenBought,
            marketplace: value.marketplaceItemdefId,
            event: value.event,
            clanVehicle: value.isClanVehicle,
          });
        }
      });
      range.push(out);
    } else {
      const find = final.find((vehicle) => {
        return vehicle.intname === key;
      });
      if (find && find.prem_type !== "false") {
        isPrem = true;
      }

      // h8k3
      if (Array.isArray(value.reqAir)) {
        value.reqAir = "";
      }

      const out: FinalShopItem = {
        name: key,
        rank: value.rank,
        reqAir: value.reqAir,
        gift: value.gift ? true : undefined,
        hidden: value.showOnlyWhenBought,
        marketplace: value.marketplaceItemdefId,
        event: value.event,
        clanVehicle: value.isClanVehicle,
      };
      range.push(out);
    }
  });
  if (!isPrem) {
    army.col_normal++;
  }

  army.range.push(range);

  return { army, isPrem };
}

function shopRangeFE(
  range: Record<string, ShopItem | ShopGroup>[] | Record<string, ShopItem | ShopGroup>,
  units_lang: LangData[],
  final: VehicleProps[],
  rank: NeedBuyToOpenNextInEra,
  country: CountryName,
  type: string,
  dev: boolean,
): FinalFinalShopRange {
  const army: FinalShopRange = {
    col_normal: 0,
    min_rank: 9,
    max_rank: 0,
    needVehicles: [],
    range: [],
  };

  let i = 1;
  Object.entries(rank[country]).forEach(([key, value]) => {
    if (key === `needBuyToOpenNextInEra${type}${i}`) {
      army.needVehicles.push(value);
      i++;
    }
  });

  let maxRank = 0;
  let isPrem = false;

  if (!Array.isArray(range)) {
    const minMax = minMaxRank(army, range, maxRank, final);
    maxRank = minMax.maxRank;
    army.max_rank = minMax.army.max_rank;
    army.min_rank = minMax.army.min_rank;

    const parsed = parseColumn(army, isPrem, range, units_lang, final, dev);
    isPrem = parsed.isPrem;
    army.col_normal = parsed.army.col_normal;
    army.range = parsed.army.range;
  } else {
    range.forEach((element) => {
      const minMax = minMaxRank(army, element, maxRank, final);
      maxRank = minMax.maxRank;
      army.max_rank = minMax.army.max_rank;
      army.min_rank = minMax.army.min_rank;
    });

    range.forEach((element) => {
      const parsed = parseColumn(army, isPrem, element, units_lang, final, dev);
      isPrem = parsed.isPrem;
      army.col_normal = parsed.army.col_normal;
      army.range = parsed.army.range;
    });
  }

  // convert columns to rank columns
  const ranked: FinalRange[][] = [];

  if (army.min_rank > 1) {
    for (let index = 0; index < army.min_rank - 1; index++) {
      ranked.push([]);
    }
  }

  for (let index = army.min_rank - 1; index < army.max_rank; index++) {
    const rank: FinalRange[] = [];
    army.range.forEach((element) => {
      const range: FinalRange = [];
      element.forEach((element) => {
        if ("vehicles" in element) {
          if (element.vehicles[0].rank === index + 1) {
            range.push(element);
          }
        } else {
          if (element.rank === index + 1) {
            range.push(element);
          }
        }
      });
      rank.push(range);
    });
    ranked.push(rank);
  }

  // precomputed drawArrow
  ranked.forEach((element, topindex, toparray) => {
    element.forEach((element, index) => {
      if (element.length === 0) {
        if (
          toparray[topindex - 1] &&
          toparray[topindex + 1] &&
          toparray[topindex + 1][index].length > 0
        ) {
          const next = toparray[topindex + 1][index][0];
          if (typeof next === "object" && next.reqAir !== "") {
            console.log("gap + " + next.name);
            if (next.name === army.range[index][0].name) {
              return;
            }
            toparray[topindex][index] = "drawArrow";
            if (toparray[topindex - 1][index].length === 0) {
              toparray[topindex - 1][index] = "drawArrow";
            }
          }
        }
      }
    });
  });

  const output = { ...army, range: ranked };

  return output;
}

async function main(dev: boolean) {
  const final: Final = JSON.parse(
    fs.readFileSync(`./data/data/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );

  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const units_lang = langCsvToJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/lang.vromfs.bin_u/lang/units.csv`,
      "utf-8",
    ),
  );

  const rankData: Rank = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/rank.blkx`,
      "utf-8",
    ),
  );

  const result: FinalShop = {};

  Object.entries(shopData).forEach(([key, value]) => {
    const value2 = value as ShopCountry;

    result[key] = {
      army: shopRangeFE(
        value2.army.range,
        units_lang,
        final.army,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Tank",
        dev,
      ),
      helicopters: shopRangeFE(
        value2.helicopters.range,
        units_lang,
        final.helicopters,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Helicopter",
        dev,
      ),
      aviation: shopRangeFE(
        value2.aviation.range,
        units_lang,
        final.aviation,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Aircraft",
        dev,
      ),
      ship: value2.ships
        ? shopRangeFE(
            value2.ships.range,
            units_lang,
            final.ship,
            rankData.needBuyToOpenNextInEra,
            country.parse(key),
            "Ship",
            dev,
          )
        : undefined,
      boat: value2.boats
        ? shopRangeFE(
            value2.boats.range,
            units_lang,
            final.boat,
            rankData.needBuyToOpenNextInEra,
            country.parse(key),
            "Boat",
            dev,
          )
        : undefined,
    };
  });

  fs.writeFileSync(
    `./data/data/${dev ? "shop-dev" : "shop"}.json`,
    await format(JSON.stringify(finalShopSchema.parse(result)), { parser: "json" }),
  );
}

main(false);
main(true);
