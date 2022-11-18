import fs from "fs";
import { format } from "prettier";

import { Final } from "./types";

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./out/final.json", "utf-8"));
  const arr: { ptow: number; name: string }[] = [];
  final.ground.forEach((element) => {
    arr.push({ ptow: element.horsepower / (element.mass / 1000), name: element.intname });
  });
  arr.sort((a, b) => {
    return b.ptow - a.ptow;
  });
  fs.writeFileSync("./out/powertoweight.json", format(JSON.stringify(arr), { parser: "json" }));
}

main();
