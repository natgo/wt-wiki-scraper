import axios from "axios";
import fs from "fs";
import https from "https";

import { Final } from "./types";

async function main() {
  const final: Final = JSON.parse(fs.readFileSync("./out/final.json", "utf-8"));

  const imquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=images&imlimit=max";
  const iiquery =
    "https://wiki.warthunder.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url";

  final.aircraft.forEach(async (element) => {
    const response = await axios.get(`${imquery}&titles=${encodeURI(element.wikiname)}`);
    Object.entries(response.data.query.pages).forEach(async (element) => {
      const images: { ns: number; title: string }[] = element[1].images;
      const match = images.find((value) => {
        return value.title.match(new RegExp("File:GarageImage.*.jpg|File:GarageImage.*.png", "gi"));
      });
      if (!match) {
        console.log(`no match ${element[1].title}`);
        console.log(images);
      } else {
        const download = await axios.get(`${iiquery}&titles=${encodeURI(match.title)}&*`);
        Object.entries(download.data.query.pages).forEach(async (element) => {
          if (element[1].imageinfo) {
            const downloadlink = element[1].imageinfo[0].url;
            https.get(downloadlink, function (res: { pipe: (arg0: fs.WriteStream) => void }) {
              res.pipe(fs.createWriteStream(`./garageimages/${element[1].title}`));
            });
          }
        });
      }
    });
  });

  final.ground.forEach(async (element) => {
    const response = await axios.get(`${imquery}&titles=${encodeURI(element.wikiname)}`);
    Object.entries(response.data.query.pages).forEach(async (element) => {
      const images: { ns: number; title: string }[] = element[1].images;
      const match = images.find((value) => {
        return value.title.match(new RegExp("File:GarageImage.*.jpg|File:GarageImage.*.png", "gi"));
      });
      if (!match) {
        console.log(`no match ${element[1].title}`);
        console.log(images);
      } else {
        const download = await axios.get(`${iiquery}&titles=${encodeURI(match.title)}&*`);
        Object.entries(download.data.query.pages).forEach(async (element) => {
          if (element[1].imageinfo) {
            const downloadlink = element[1].imageinfo[0].url;
            https.get(downloadlink, function (res: { pipe: (arg0: fs.WriteStream) => void }) {
              res.pipe(fs.createWriteStream(`./garageimages/${element[1].title}`));
            });
          }
        });
      }
    });
  });

  final.helicopter.forEach(async (element) => {
    const response = await axios.get(`${imquery}&titles=${encodeURI(element.wikiname)}`);
    Object.entries(response.data.query.pages).forEach(async (element) => {
      const images: { ns: number; title: string }[] = element[1].images;
      const match = images.find((value) => {
        return value.title.match(new RegExp("File:GarageImage.*.jpg|File:GarageImage.*.png", "gi"));
      });
      if (!match) {
        console.log(`no match ${element[1].title}`);
        console.log(images);
      } else {
        const download = await axios.get(`${iiquery}&titles=${encodeURI(match.title)}&*`);
        Object.entries(download.data.query.pages).forEach(async (element) => {
          if (element[1].imageinfo) {
            const downloadlink = element[1].imageinfo[0].url;
            https.get(downloadlink, function (res: { pipe: (arg0: fs.WriteStream) => void }) {
              res.pipe(fs.createWriteStream(`./garageimages/${element[1].title}`));
            });
          }
        });
      }
    });
  });
}

main();
