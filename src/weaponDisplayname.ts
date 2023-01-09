import fs from "fs";

import { Container, WeaponPreset } from "./types";

export function weaponDisplayname(
  weaponPreset: WeaponPreset,
  langdata: { ID: string; English: string }[],
  dev: boolean,
): { displayname: string; bullets?: number } | undefined {
  if (weaponPreset && "Weapon" in weaponPreset && !Array.isArray(weaponPreset.Weapon)) {
    const blk = weaponPreset.Weapon.blk.split("/");
    const displayname = langdata.find((element) => {
      return element.ID === `weapons/${blk[blk.length - 1].split(".")[0]}/short`;
    });

    if (displayname?.English) {
      return { displayname: displayname.English };
    }

    const displayname2 = langdata.find((element) => {
      return element.ID === `weapons/${blk[blk.length - 1].split(".")[0]}`;
    });

    if (displayname2?.English) {
      return { displayname: displayname2.English };
    }

    if (blk.slice(2).join("/").split(".")[0] === "dummy_weapon") {
      return undefined;
    }

    const weaponData: Container = JSON.parse(
      fs.readFileSync(
        `./${dev ? "datamine-dev" : "War-Thunder-Datamine"}/aces.vromfs.bin_u/gamedata/weapons/${blk
          .slice(2)
          .join("/")
          .split(".")[0]
          .toLowerCase()}.blkx`,
        "utf-8",
      ),
    );

    if ("blk" in weaponData) {
      const containerblk = weaponData.blk.split("/");

      const containerName = langdata.find((element) => {
        return (
          element.ID === `weapons/${containerblk[containerblk.length - 1].split(".")[0]}/short`
        );
      });

      if (containerName?.English) {
        return { displayname: containerName.English, bullets: weaponData.amountPerTier };
      }

      const containerData: Container = JSON.parse(
        fs.readFileSync(
          `./${
            dev ? "datamine-dev" : "War-Thunder-Datamine"
          }/aces.vromfs.bin_u/gamedata/weapons/${containerblk
            .slice(2)
            .join("/")
            .split(".")[0]
            .toLowerCase()}.blkx`,
          "utf-8",
        ),
      );
      if ("blk" in containerData) {
        const container2blk = containerData.blk.split("/");

        const container2data = langdata.find((element) => {
          return (
            element.ID === `weapons/${container2blk[container2blk.length - 1].split(".")[0]}/short`
          );
        });

        if (container2data?.English) {
          return { displayname: container2data.English, bullets: weaponData.amountPerTier };
        }
      }
    }
  }

  return undefined;
}
