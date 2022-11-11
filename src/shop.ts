import fs from "fs";
import { format } from "prettier";

import { langcsvJSON } from "./csvJSON";
import {
  Final,
  FinalShop,
  FinalShopGroup,
  FinalShopItem,
  FinalShopRange,
  Shop,
  ShopCountry,
} from "./types";

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./out/final.json", "utf-8"));
  const shopData: Shop = JSON.parse(
    fs.readFileSync("./War-Thunder-Datamine/char.vromfs.bin_u/config/shop.blkx", "utf-8"),
  );
  const units_lang = langcsvJSON(
    fs.readFileSync("./War-Thunder-Datamine/lang.vromfs.bin_u/lang/units.csv", "utf-8"),
  );

  const result: FinalShop = {};

  Object.entries(shopData).forEach(([key, value]) => {
    const value2 = value as ShopCountry;

    const army: FinalShopRange = {
      col_normal: 0,
      min_rank: 9,
      max_rank: 0,
      range: [],
    };
    const helicopters: FinalShopRange = {
      col_normal: 0,
      min_rank: 9,
      max_rank: 0,
      range: [],
    };
    const aviation: FinalShopRange = {
      col_normal: 0,
      min_rank: 9,
      max_rank: 0,
      range: [],
    };

    let armyMaxRank = 0;
    let aviationMaxRank = 0;
    let helicoptersMaxRank = 0;

    let armyIsPrem = false;
    let aviationIsPrem = false;
    let helicoptersIsPrem = false;

    value2.army.range.forEach((element) => {
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
          const find = final.ground.find((element) => {
            return element.intname === key;
          });
          if (find && find.prem_type !== "false") {
            armyIsPrem = true;
          }

          if (find && find.rank < army.min_rank) {
            army.min_rank = find.rank;
          }

          if (find && find.rank > armyMaxRank) {
            army.max_rank = find.rank;
            armyMaxRank = find.rank;
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
      if (!armyIsPrem) {
        army.col_normal++;
      }

      army.range.push(range);
    });

    value2.aviation.range.forEach((element) => {
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
          const find = final.aircraft.find((element) => {
            return element.intname === key;
          });
          if (find && find.prem_type !== "false") {
            aviationIsPrem = true;
          }

          if (find && find.rank < aviation.min_rank) {
            aviation.min_rank = find.rank;
          }

          if (find && find.rank > aviationMaxRank) {
            aviation.max_rank = find.rank;
            aviationMaxRank = find.rank;
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
      if (!aviationIsPrem) {
        aviation.col_normal++;
      }

      aviation.range.push(range);
    });

    value2.helicopters.range.forEach((element) => {
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
          const find = final.helicopter.find((element) => {
            return element.intname === key;
          });
          if (find && find.prem_type !== "false") {
            helicoptersIsPrem = true;
          }

          if (find && find.rank < helicopters.min_rank) {
            helicopters.min_rank = find.rank;
          }

          if (find && find.rank > helicoptersMaxRank) {
            helicopters.max_rank = find.rank;
            helicoptersMaxRank = find.rank;
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
      if (!helicoptersIsPrem) {
        helicopters.col_normal++;
      }

      helicopters.range.push(range);
    });

    result[key] = {
      army: army,
      helicopters: helicopters,
      aviation: aviation,
    };
  });
  fs.writeFileSync("./out/shop.json", format(JSON.stringify(result), { parser: "json" }));
}

main();
