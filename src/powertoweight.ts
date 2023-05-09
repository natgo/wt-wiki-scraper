import fs from "fs";
import { format } from "prettier";

import { Final } from "../data/types/final.schema";

async function main(dev: boolean) {
  const final: Final = JSON.parse(
    fs.readFileSync(`./data/data/${dev ? "final-dev" : "final"}.json`, "utf-8"),
  );
  const arr: { ptow: number; name: string }[] = [];
  final.ground.forEach((element) => {
    if (element.horsepower && element.mass) {
      arr.push({ ptow: element.horsepower / (element.mass / 1000), name: element.intname });
    }
  });
  arr.sort((a, b) => {
    return b.ptow - a.ptow;
  });
  fs.writeFileSync(
    `./data/data/${dev ? "powertoweight-dev" : "powertoweight"}.json`,
    format(JSON.stringify(arr), { parser: "json" }),
  );
}

main(false);
main(true);
