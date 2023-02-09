import { LangData } from "./types";

export function parseLang(langdata: LangData[], name: string | undefined): LangData | undefined {
  if (name === undefined) {
    return undefined;
  }

  const data = langdata.find((element) => {
    return element.ID.toLowerCase() === name.toLowerCase();
  });
  return data;
}
