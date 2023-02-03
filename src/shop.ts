import fs from "fs";
import { format } from "prettier";

import { langcsvJSON } from "./csvJSON";
import {
  CountryName,
  Final,
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
} from "./types";

function shopRangeFE(
  range: Record<string, ShopItem | ShopGroup>[],
  units_lang: LangData[],
  final: VehicleProps[],
  rank: NeedBuyToOpenNextInEra,
  country: CountryName,
  type: string,
) {
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
    const range: Array<FinalShopItem | FinalShopGroup> = [];
    Object.entries(element).forEach(([key, value]) => {
      if ("image" in value) {
        const groupLang = units_lang.find((lang) => {
          return lang.ID === "shop/group/" + key;
        });
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
        const find = final.find((element) => {
          return element.intname === key;
        });
        if (find && find.prem_type !== "false") {
          isPrem = true;
        }

        if (find && find.rank < army.min_rank) {
          army.min_rank = find.rank;
        }

        if (find && find.rank > maxRank) {
          army.max_rank = find.rank;
          maxRank = find.rank;
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

  return army;
}

async function main(dev: boolean) {
  const final: Final = JSON.parse(
    fs.readFileSync(`./out/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );

  const shopData: Shop = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/shop.blkx`,
      "utf-8",
    ),
  );

  const units_lang = langcsvJSON(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/lang.vromfs.bin_u/lang/units.csv`,
      "utf-8",
    ),
  );

  const rankData: Rank = JSON.parse(
    fs.readFileSync(
      `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/char.vromfs.bin_u/config/rank.blkx`,
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
    format(JSON.stringify(result), { parser: "json" }),
  );
}

main(false);
main(true);
