import fs from "fs";
import { format } from "prettier";

import { langcsvJSON } from "./csvJSON";
import { parseLang } from "./lang";
import {
  CountryName,
  Final,
  FinalFinalShopRange,
  FinalRange,
  FinalShop,
  FinalShopGroup,
  FinalShopItem,
  FinalShopRange,
  LangData,
  NeedBuyToOpenNextInEra,
  Rank,
  Shop,
  ShopCountry,
  ShopGroup,
  ShopItem,
  VehicleProps,
  country,
  finalShopSchema,
} from "./types";

function shopRangeFE(
  range: Record<string, ShopItem | ShopGroup>[],
  units_lang: LangData[],
  final: VehicleProps[],
  rank: NeedBuyToOpenNextInEra,
  country: CountryName,
  type: string,
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

  rank[country][`needBuyToOpenNextInEra${type}1`];

  let maxRank = 0;
  let isPrem = false;

  range.forEach((element) => {
    Object.entries(element).forEach(([key, value]) => {
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
  });

  range.forEach((element) => {
    const range: Array<FinalShopItem | FinalShopGroup> = [];
    Object.entries(element).forEach(([key, value]) => {
      if ("image" in value) {
        const groupLang = parseLang(units_lang, "shop/group/" + key);
        if (!groupLang) {
          throw new Error(`no match in lang data to shop/group/${element.intname}`);
        }

        const out: FinalShopGroup = {
          name: key,
          displayname: groupLang.English,
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
  });

  // convert columns to rank columns
  const ranked: { rank: number; range: FinalRange[] }[] = [];

  for (let index = army.min_rank - 1; index < army.max_rank; index++) {
    const rank: { rank: number; range: FinalRange[] } = {
      rank: index + 1,
      range: [],
    };
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
      rank.range.push(range);
    });
    ranked.push(rank);
  }

  // precomputed drawArrow
  ranked.forEach((element, topindex, toparray) => {
    element.range.forEach((element, index) => {
      if (element.length === 0) {
        if (
          toparray[topindex - 1] &&
          toparray[topindex + 1] &&
          toparray[topindex + 1].range[index].length > 0
        ) {
          const next = toparray[topindex + 1].range[index][0];
          if (typeof next === "object" && next.reqAir !== "") {
            console.log(next.name);
            toparray[topindex].range[index] = "drawArrow";
            if (toparray[topindex - 1].range[index].length === 0) {
              toparray[topindex - 1].range[index] = "drawArrow";
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
    fs.readFileSync(`./out/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );

  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const units_lang = langcsvJSON(
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
        final.ground,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Tank",
      ),
      helicopters: shopRangeFE(
        value2.helicopters.range,
        units_lang,
        final.helicopter,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Helicopter",
      ),
      aviation: shopRangeFE(
        value2.aviation.range,
        units_lang,
        final.aircraft,
        rankData.needBuyToOpenNextInEra,
        country.parse(key),
        "Aircraft",
      ),
    };
  });

  fs.writeFileSync(
    `./out/${dev ? "shop-dev" : "shop"}.json`,
    format(JSON.stringify(finalShopSchema.parse(result)), { parser: "json" }),
  );
}

main(false);
main(true);
