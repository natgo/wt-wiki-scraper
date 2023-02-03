import { LangData } from "./types";

export function langcsvJSON(csv: string): LangData[] {
  const lines = csv.split("\n");
  const result: LangData[] = [];
  const headers = lines[0].split(";");

  headers.forEach((element, i, array) => {
    if (element === '"<ID|readonly|noverify>"') {
      element = '"<ID>"';
    }
    array[i] = element.substring(2, element.length - 2);
  });

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const obj = { ID: "string", English: "string" };
    const currentline = lines[i].split(";");

    currentline.forEach((element, i, array) => {
      if (element.length > 0) {
        array[i] = element.substring(1, element.length - 1);
      }
    });

    for (let j = 0; j < headers.length; j++) {
      obj.ID = currentline[0];
      obj.English = currentline[1];
    }
    result.push(obj);
  }
  return result;
}
