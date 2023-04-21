import fs from "fs";
import { format } from "prettier";

import { Final } from "./types";

async function main(dev: boolean) {
  const final: Final = JSON.parse(
    fs.readFileSync(`./out/${dev ? "final-dev" : "final"}.json`, "utf-8"),
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
    `./out/${dev ? "powertoweight-dev" : "powertoweight"}.json`,
    format(JSON.stringify(arr), { parser: "json" }),
  );
}

main(false);
main(true);
