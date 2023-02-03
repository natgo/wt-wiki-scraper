import fs from "fs";

import { AirVehicle, Sensor, Sensors, VehicleSensor, counterMeasures } from "../types";

export function sensors(
  vehicleData: AirVehicle,
  dev: boolean,
): {
  has_maw: true | undefined;
  has_lws: true | undefined;
  has_rwr: true | undefined;
  has_ircm: true | undefined;
  has_hirss: true | undefined;
} {
  let data = parseVehicleSensors(vehicleData.sensors, vehicleData.counterMeasures, dev);

  if (vehicleData.modifications) {
    Object.values(vehicleData.modifications).forEach((element) => {
      if (element.effects) {
        if (element.effects.counterMeasures) {
          if (Array.isArray(element.effects.counterMeasures.counterMeasure)) {
            element.effects.counterMeasures.counterMeasure.forEach((element) => {
              data = sensorFE(data, element, dev);
            });
          } else if (element.effects.counterMeasures.counterMeasure) {
            data = sensorFE(data, element.effects.counterMeasures.counterMeasure, dev);
          }
        }
        if (element.effects.sensors) {
          if (Array.isArray(element.effects.sensors.sensor)) {
            element.effects.sensors.sensor.forEach((element) => {
              data = sensorFE(data, element, dev);
            });
          } else if (element.effects.sensors.sensor) {
            data = sensorFE(data, element.effects.sensors.sensor, dev);
          }
        }
      }
    });

    if (
      vehicleData.modifications.MAW_system_heli_false_thermal_targets ||
      vehicleData.modifications.AMASE_heli_false_thermal_targets
    ) {
      data.maw = true;
    }

    if (vehicleData.modifications.heli_counterMeasures) {
      data.ircm = true;
    }
    if (vehicleData.modifications.heli_screen_exhaust_device) {
      data.hirss = true;
    }
  }

  return {
    has_maw: data.maw ? data.maw : undefined,
    has_lws: data.lws ? data.lws : undefined,
    has_rwr: data.rwr ? data.rwr : undefined,
    has_ircm: data.ircm ? data.ircm : undefined,
    has_hirss: data.hirss ? data.hirss : undefined,
  };
}

function parseVehicleSensors(
  sensors: Sensors | undefined,
  countermeasures: counterMeasures | undefined,
  dev: boolean,
): { maw: boolean; lws: boolean; rwr: boolean; ircm: boolean; hirss: boolean } {
  let data = {
    maw: false,
    lws: false,
    rwr: false,
    ircm: false,
    hirss: false,
  };

  if (Array.isArray(sensors?.sensor)) {
    sensors?.sensor.forEach((element) => {
      data = sensorFE(data, element, dev);
    });
  } else if (sensors?.sensor) {
    data = sensorFE(data, sensors.sensor, dev);
  }

  if (Array.isArray(countermeasures?.counterMeasure)) {
    countermeasures?.counterMeasure.forEach((element) => {
      data = sensorFE(data, element, dev);
    });
  } else if (countermeasures?.counterMeasure) {
    data = sensorFE(data, countermeasures?.counterMeasure, dev);
  }

  return data;
}

function sensorFE(
  data: { maw: boolean; lws: boolean; rwr: boolean; ircm: boolean; hirss: boolean },
  sensor: VehicleSensor,
  dev: boolean,
): { maw: boolean; lws: boolean; rwr: boolean; ircm: boolean; hirss: boolean } {
  const blk: Sensor = JSON.parse(
    fs.readFileSync(
      `./${
        dev ? "datamine-dev" : "War-Thunder-Datamine"
      }/aces.vromfs.bin_u/${sensor.blk.toLowerCase()}x`,
      "utf-8",
    ),
  );
  if (blk) {
    switch (blk.type) {
      case "mlws":
        data.maw = true;
        break;
      case "lws":
        data.lws = true;
        break;
      case "rwr":
        data.rwr = true;
        break;
      case "ircm":
        data.ircm = true;
        break;
    }
    console.log(blk.type);
  }

  return data;
}
