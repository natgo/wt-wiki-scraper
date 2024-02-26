import axios, { AxiosResponse } from "axios";
import fs from "fs";

import { Final, VehicleProps } from "../data/types/final.schema";

interface pageimages extends AxiosResponse {
  data: {
    batchcomplete: string;
    query: {
      pages: Record<number, pageimage>;
    };
  };
}

interface pageimage {
  pageid: number;
  ns: number;
  title: string;
  images: image[];
}

interface image {
  ns: number;
  title: string;
}

interface imageinforesponse extends AxiosResponse {
  data: {
    batchcomplete: string;
    query: {
      pages: Record<number, pageimageinfo>;
    };
  };
}

interface pageimageinfo {
  pageid: number;
  ns: number;
  title: string;
  imagerepository: string;
  imageinfo: imageinfo[];
}

interface imageinfo {
  url: string;
  descriptionurl: string;
  descriptionshorturl: string;
}

async function imageLoop(vehicles: VehicleProps[]) {
  const imquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=images&imlimit=max";
  const iiquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url";

  for (const topelement of vehicles) {
    if (!topelement.wikiname) {
      continue;
    }
    console.log(topelement.wikiname);

    const response: pageimages = await axios.get(
      `${imquery}&titles=${encodeURIComponent(topelement.wikiname)}`,
    );
    for (const element of Object.entries(response.data.query.pages)) {
      const images: image[] = element[1].images;
      const match = images.find((value) => {
        return value.title.match(
          new RegExp("File:GarageImage.*(?<!Blazer).jpg|File:GarageImage.*.png", "gi"),
        );
      });
      if (!match) {
        console.log(`no match for ${element[1].title}`);
        console.log(images);
      } else {
        const download: imageinforesponse = await axios.get(
          `${iiquery}&titles=${encodeURIComponent(match.title)}&*`,
        );
        for (const element of Object.entries(download.data.query.pages)) {
          if (element[1].imageinfo) {
            const downloadlink = element[1].imageinfo[0].url;
            fs.writeFileSync(
              `./garageimages/${topelement.intname}.jpg`,
              (await axios.get(downloadlink, { responseType: "arraybuffer" })).data,
            );
          } else {
            console.log(`no image for ${element[1].title}`);
          }
        }
      }
    }
  }
}

function main() {
  const final: Final = JSON.parse(fs.readFileSync("./data/data/final.json", "utf-8"));

  imageLoop(final.aviation);
  imageLoop(final.army);
  imageLoop(final.helicopters);
  imageLoop(final.ship);
  imageLoop(final.boat);
}

main();
