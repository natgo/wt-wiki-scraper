import { AxiosResponse } from "axios";

export interface Categorymembers extends AxiosResponse {
  data: {
    batchcomplete: string;
    continue?: { cmcontinue: string; continue: string };
    limits: { categorymembers: number };
    query: {
      categorymembers: CategorymembersPart[];
    };
  };
}

export interface ParsedPage extends AxiosResponse {
  data: {
    parse: SavedParse;
  };
}

export interface ParsedWikiPage extends AxiosResponse {
  data: {
    parse: SavedWikiParse;
  };
}

export interface SavedWikiParse {
  title: string;
  pageid: number;
  wikitext: {
    "*": string;
  };
}

export interface SavedParse {
  title: string;
  pageid: number;
  text: {
    "*": string;
  };
}

export interface CategorymembersPart {
  pageid: number;
  ns: number;
  title: string;
}
