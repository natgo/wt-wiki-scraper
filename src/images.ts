import axios, { AxiosResponse } from "axios";
import fs from "fs";
import https from "https";

import { Final, FinalProps } from "./types";

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

function imageLoop(vehicles:FinalProps[]) {
  const imquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=images&imlimit=max";
  const iiquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url";

  vehicles.forEach(async topelement => {
    if (!topelement.wikiname) {
      return;
    }

    const response: pageimages = await axios.get(
      `${imquery}&titles=${encodeURI(topelement.wikiname)}`,
    );
    Object.entries(response.data.query.pages).forEach(async (element) => {
      const images: { ns: number; title: string }[] = element[1].images;
      const match = images.find((value) => {
        return value.title.match(new RegExp("File:GarageImage.*.jpg|File:GarageImage.*.png", "gi"));
      });
      if (!match) {
        console.log(`no match for ${element[1].title}`);
        console.log(images);
      } else {
        const download: imageinforesponse = await axios.get(
          `${iiquery}&titles=${encodeURI(match.title)}&*`,
        );
        Object.entries(download.data.query.pages).forEach(async (element) => {
          if (element[1].imageinfo) {
            const downloadlink = element[1].imageinfo[0].url;
            https.get(downloadlink, function (res: { pipe: (arg0: fs.WriteStream) => void }) {
              res.pipe(fs.createWriteStream(`./garageimages/${topelement.intname}.jpg`));
            });
          } else {
            console.log(`no image for ${element[1].title}`);
          }
        });
      }
    });
  });
}

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./out/final.json", "utf-8"));

  imageLoop(final.aircraft);
  imageLoop(final.ground);
  imageLoop(final.helicopter);
}

main();
