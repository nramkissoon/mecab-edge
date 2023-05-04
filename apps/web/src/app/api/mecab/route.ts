export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import { generateErrorMessage, ErrorMessageOptions } from "zod-error";
import { translate } from "~/lib/translations";
import {
  ApiOutput,
  EnglishOutput,
  JapaneseOutput,
  RawOutputSchema,
} from "~/lib/schema";

const errorOptions: ErrorMessageOptions = {
  delimiter: {
    error: "\n",
    component: " > ",
  },
  transform: ({ errorMessage, index }) =>
    `Error #${index + 1}: ${errorMessage}`,
};

const aws = new AwsClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
});

const vercelRegionToAWSRegionMap = {
  bom1: "ap-south-1",
  cdg1: "eu-west-2",
  lhr1: "eu-west-2",
  dub1: "eu-west-2",
  arn1: "eu-central-1",
  bru1: "eu-central-1",
  cpt1: "eu-central-1",
  fra1: "eu-central-1",
  gru1: "sa-east-1",
  iad1: "us-east-1",
  cle1: "us-east-1",
  hnd1: "ap-northeast-1",
  icn1: "ap-northeast-1",
  kix1: "ap-northeast-3",
  pdx1: "us-west-1",
  sfo1: "us-west-1",
  sin1: "ap-southeast-1",
  hkg1: "ap-southeast-1",
  syd1: "ap-southeast-2",
} as const;

const bodySchema = z.object({
  input: z
    .string()
    .max(300 * 1024, { message: "input must be less than 300KB in size" }),
  options: z.optional(
    z.union([
      z.object({
        format: z.literal("mecab-raw"),
      }),
      z.object({
        format: z.literal("pretty"),
        language: z.enum(["en", "jp"]),
      }),
    ]),
  ),
});

const rawOutputParserJp = (
  wordFields: (string | undefined)[],
): null | JapaneseOutput => {
  if (wordFields.length <= 8) return null;

  const parseField = (field: string | undefined) =>
    field === undefined || field === "*" ? null : field;

  return {
    表層形: parseField(wordFields[0]),
    品詞: parseField(wordFields[1]),
    品詞細分類1: parseField(wordFields[2]),
    品詞細分類2: parseField(wordFields[3]),
    品詞細分類3: parseField(wordFields[4]),
    活用形: parseField(wordFields[5]),
    活用型: parseField(wordFields[6]),
    原形: parseField(wordFields[7]),
    読み: parseField(wordFields[8]),
    発音: parseField(wordFields[9]),
  };
};

const rawOutputParserEn = (
  wordFields: (string | undefined)[],
): null | EnglishOutput => {
  if (wordFields.length <= 8) return null;

  const parseField = (field: string | undefined) =>
    field === undefined || field === "*" ? null : field;

  return {
    surface: parseField(wordFields[0]),
    partOfSpeech: translate(parseField(wordFields[1])),
    classification1: translate(parseField(wordFields[2])),
    classification2: translate(parseField(wordFields[3])),
    classification3: translate(parseField(wordFields[4])),
    conjugation: translate(parseField(wordFields[5])),
    inflection: translate(parseField(wordFields[6])),
    original: parseField(wordFields[7]),
    reading: parseField(wordFields[8]),
    pronunciation: parseField(wordFields[9]),
  };
};

export async function POST(request: NextRequest) {
  const region = request.geo?.region;

  let awsRegion = "us-east-1";

  if (region) {
    awsRegion =
      vercelRegionToAWSRegionMap[
        region as keyof typeof vercelRegionToAWSRegionMap
      ] ?? "us-east-1";
  }

  const url = `https://lambda.${awsRegion}.amazonaws.com/2015-03-31/functions/mecab-lambda/invocations`;

  const body = await request.json();

  const validationResult = bodySchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: generateErrorMessage(
          validationResult.error.issues,
          errorOptions,
        ),
      },
      { status: 400 },
    );
  }

  const options = validationResult.data.options;

  const response = await aws.fetch(url, { body: JSON.stringify(body) });
  const responseJson = await response.json();

  const { parseTime, result } = responseJson;

  const parsedRawOutput = RawOutputSchema.safeParse(result);
  if (!parsedRawOutput.success) {
    return NextResponse.json(undefined, { status: 500 });
  }

  const parsedParseTime = z.number().safeParse(parseTime);
  if (!parsedParseTime.success) {
    return NextResponse.json(undefined, { status: 500 });
  }

  // return the raw mecab output
  if (options === undefined || options?.format === "mecab-raw") {
    const output: ApiOutput = {
      parseTime: parsedParseTime.data,
      result: parsedRawOutput.data,
      format: "mecab-raw",
    };
    return NextResponse.json(output, { status: 200 });
  }

  const words = responseJson.result as string[][];
  const prettyResult:
    | { language: "jp"; parsed: (JapaneseOutput | null)[] }
    | { language: "en"; parsed: (EnglishOutput | null)[] } = {
    language: options.language,
    parsed: [],
  };
  // handle jp pretty printing
  if (prettyResult.language === "jp") {
    for (let wordFields of words) {
      const parsed = rawOutputParserJp(wordFields);
      prettyResult.parsed.push(parsed);
    }
  } else {
    // handle en pretty printing
    for (let wordFields of words) {
      const parsed = rawOutputParserEn(wordFields);
      prettyResult.parsed.push(parsed);
    }
  }

  const output: ApiOutput = {
    format: "pretty",
    result: prettyResult,
    parseTime: parsedParseTime.data,
  };

  return NextResponse.json(output, { status: 200 });
}
