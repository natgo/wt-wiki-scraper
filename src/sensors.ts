import fs from "fs";

import { AirVehicle, Sensor } from "./types";

export function sensors(vehicleData: AirVehicle, dev: boolean) {
  let maw = false;
  let lws = false;
  let rwr = false;
  let ircm = false;
  let hirss = false;

  if (
    vehicleData.modifications.MAW_system_heli_false_thermal_targets ||
    vehicleData.modifications.AMASE_heli_false_thermal_targets
  ) {
    maw = true;
  }

  if (vehicleData.modifications.heli_counterMeasures) {
    ircm = true;
  }
  if (vehicleData.modifications.heli_screen_exhaust_device) {
    hirss = true;
  }

  if (Array.isArray(vehicleData.sensors?.sensor)) {
    vehicleData.sensors?.sensor.forEach((element) => {
      const path = element.blk.split("/");
      const blk: Sensor = JSON.parse(
        fs.readFileSync(
          `./${
            dev ? "datamine-dev" : "War-Thunder-Datamine"
          }/aces.vromfs.bin_u/gamedata/sensors/${path[path.length - 1].toLowerCase()}x`,
          "utf-8",
        ),
      );
      if (blk) {
        switch (blk.type) {
          case "mlws":
            maw = true;
            break;
          case "lws":
            lws = true;
            break;
          case "rwr":
            rwr = true;
            break;
        }
        console.log(blk.type);
      }
    });
  } else if (vehicleData.sensors?.sensor) {
    const path = vehicleData.sensors.sensor.blk.split("/");
    const blk: Sensor = JSON.parse(
      fs.readFileSync(
        `./${
          dev ? "datamine-dev" : "War-Thunder-Datamine"
        }/aces.vromfs.bin_u/gamedata/sensors/${path[path.length - 1].toLowerCase()}x`,
        "utf-8",
      ),
    );
    if (blk) {
      switch (blk.type) {
        case "mlws":
          maw = true;
          break;
        case "lws":
          lws = true;
          break;
        case "rwr":
          rwr = true;
          break;
      }
      console.log(blk.type);
    }
  }

  return {
    has_maw: maw ? maw : undefined,
    has_lws: lws ? lws : undefined,
    has_rwr: rwr ? rwr : undefined,
    has_ircm: ircm ? ircm : undefined,
    has_hirss: hirss ? hirss : undefined,
  };
}
