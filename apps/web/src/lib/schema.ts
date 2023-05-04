import { z } from "zod";

const stringOrNull = z.union([z.string(), z.null()]);

const EnglishOutput = z.object({
  surface: stringOrNull,
  partOfSpeech: stringOrNull,
  classification1: stringOrNull,
  classification2: stringOrNull,
  classification3: stringOrNull,
  conjugation: stringOrNull,
  inflection: stringOrNull,
  original: stringOrNull,
  reading: stringOrNull,
  pronunciation: stringOrNull,
});

const JapaneseOutput = z.object({
  表層形: stringOrNull,
  品詞: stringOrNull,
  品詞細分類1: stringOrNull,
  品詞細分類2: stringOrNull,
  品詞細分類3: stringOrNull,
  活用形: stringOrNull,
  活用型: stringOrNull,
  原形: stringOrNull,
  読み: stringOrNull,
  発音: stringOrNull,
});

export const RawOutputSchema = z.array(z.array(z.string()));

export type EnglishOutput = z.infer<typeof EnglishOutput>;
export type JapaneseOutput = z.infer<typeof JapaneseOutput>;

export const ApiOutputSchema = z.union([
  z.object({
    parseTime: z.number(),
    format: z.literal("mecab-raw"),
    result: RawOutputSchema,
  }),
  z.object({
    parseTime: z.number(),
    format: z.literal("pretty"),
    result: z.union([
      z.object({
        language: z.literal("en"),
        parsed: z.array(EnglishOutput.or(z.null())),
      }),
      z.object({
        language: z.literal("jp"),
        parsed: z.array(JapaneseOutput.or(z.null())),
      }),
    ]),
  }),
]);

export type ApiOutput = z.infer<typeof ApiOutputSchema>;
