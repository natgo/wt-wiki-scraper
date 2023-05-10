import { LangData } from "./types";

/**
 * Parses language data to find a language object with the specified ID.
 *
 * @param {LangData[]} langdata - The array of language data to search through.
 * @param {string | undefined} id - The ID of the language object to find.
 * @returns {LangData | undefined} The language object with the specified ID, or undefined if not found.
 */
export function parseLang(langdata: LangData[], id: string | undefined): LangData | undefined {
  if (id === undefined) {
    return undefined;
  }

  return langdata.find((element) => element.ID.toLowerCase() === id.toLowerCase());
}
