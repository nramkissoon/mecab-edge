import { ApiOutput } from "./schema";

type PrettyApiOutput = Exclude<ApiOutput, { format: "mecab-raw" }>;

export type Mapping = {
  text: string;
  data: PrettyApiOutput["result"]["parsed"][number];
};

export const matchTextToApiOutput = (text: string, output: PrettyApiOutput) => {
  let cursor = 0;
  let mappings: Mapping[] = [];

  const result = output.result;

  if (result.language === "en") {
    for (let data of result.parsed) {
      if (data == null || data.surface == null) {
        continue;
      }
      const word = data.surface;
      const index = text.indexOf(word, cursor);
      if (cursor !== index) {
        // handle a null word prior.
        mappings.push({
          text: text.substring(cursor, index),
          data: null,
        });
      }

      mappings.push({
        text: word,
        data,
      });

      cursor = index + word.length;
    }
  }

  if (result.language === "jp") {
    for (let data of result.parsed) {
      if (data == null || data["表層形"] == null) {
        continue;
      }
      const word = data["表層形"];
      const index = text.indexOf(word, cursor);
      if (cursor !== index) {
        // handle a null word prior.
        mappings.push({
          text: text.substring(cursor, index),
          data: null,
        });
      }

      mappings.push({
        text: word,
        data,
      });

      cursor = index + word.length;
    }
  }

  if (cursor < text.length) {
    mappings.push({ text: text.substring(cursor), data: null });
  }

  return mappings;
};
