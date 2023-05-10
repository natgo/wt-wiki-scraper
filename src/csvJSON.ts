import { LangData } from "./types";

/**
 * Converts Lang CSV to an array of language objects.
 *
 * @param {string} csv - The Lang CSV to convert.
 * @returns {LangData[]} An array of language objects.
 */
export function langCsvToJSON(csv: string): LangData[] {
  const lines = csv.split("\n");
  const result: LangData[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const currentline = lines[i]
      .split(";")
      .map((element) => element.substring(1, element.length - 1));
    const obj: LangData = {
      ID: currentline[0],
      English: currentline[1],
    };
    result.push(obj);
  }

  return result;
}
