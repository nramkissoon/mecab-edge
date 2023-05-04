"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { Label } from "~/components/Label";
import { RadioGroup, RadioGroupItem } from "~/components/RadioGroup";
import { useQuery } from "@tanstack/react-query";
import { ApiOutput } from "~/lib/schema";
import { Mapping, matchTextToApiOutput } from "~/lib/mapping";
import { HighlightableWord } from "~/components/HighlightableWord";
import { useSelectedWordMapping } from "~/components/WordContext";
import { Textarea } from "~/components/TextArea";
import { ScrollArea } from "~/components/ScrollArea";
import { MecabDataViewer } from "~/components/MecabDataViewer";

const useMecab = (input: string, language: "en" | "jp") => {
  const queryKey = ["mecab", language, input];
  const { isLoading, isError, data, refetch, ...rest } = useQuery<
    Exclude<ApiOutput, { format: "mecab-raw" }>
  >(
    queryKey,
    async () => {
      const res = await fetch("/api/mecab", {
        method: "POST",
        body: JSON.stringify({
          input,
          options: {
            language,
            format: "pretty",
          },
        }),
      });
      return await res.json();
    },
    { enabled: false },
  );

  const mappings = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }
    if (data) {
      const mappings = matchTextToApiOutput(input, data);
      return mappings;
    }
  }, [data]);
  return { ...rest, isLoading, isError, data, mappings, callApi: refetch };
};

const BottomSection = ({ mappings }: { mappings: Mapping[] }) => {
  const outputSectionRef = useRef<HTMLDivElement>(null);
  const scrollToOutputSection = () => {
    outputSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToOutputSection();
  }, []);

  return (
    <div className="flex gap-5 pt-5" ref={outputSectionRef}>
      <div className="w-1/2">
        {mappings.map((mapping, i) => (
          <HighlightableWord key={i} mapping={mapping} i={i} />
        ))}
      </div>
      <div className="sticky right-0 top-5 h-[95vh] w-1/2 self-start rounded-md border border-slate-800">
        <ScrollArea className="h-full">
          <MecabDataViewer mappings={mappings} />
        </ScrollArea>
      </div>
    </div>
  );
};

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<"en" | "jp">("en");

  const { callApi, mappings, isLoading, isError } = useMecab(input, language);

  const { setSelectedWord } = useSelectedWordMapping();

  const inputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 1024 * 300) {
      setInputError("Input is too long.");
      setInput(e.target.value);
      setSubmitDisabled(true);
      return;
    }
    setInput(e.target.value);
    setInputError(null);
    if (e.target.value.length > 0) {
      setSubmitDisabled(false);
      return;
    } else {
      setSubmitDisabled(true);
      return;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-5 px-8">
      <section className="flex h-screen w-full flex-col items-center justify-center gap-5">
        <h1 className="text-primary text-4xl font-bold tracking-wide">
          Parse Japanese with MeCab
        </h1>
        <div className="flex gap-3">
          Output language:
          <RadioGroup defaultValue="en" className="flex gap-5">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="en"
                id="en"
                checked={language === "en"}
                onClick={() => setLanguage("en")}
              />
              <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="jp"
                id="jp"
                checked={language === "jp"}
                onClick={() => setLanguage("jp")}
              />
              <Label htmlFor="jp">日本語</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-3">
          <Textarea
            className="scrollbar scrollbar-thumb-slate-800 scrollbar-track-slate-900 min-h-[300px] w-full resize-none"
            value={input}
            placeholder="ここに日本語を入力して..."
            onChange={inputOnChange}
          />
          <div className="flex w-full justify-between gap-5">
            <div className="flex gap-5">
              <Button
                className="text-primary w-fit bg-slate-600 hover:bg-slate-700"
                onClick={() => {
                  setInput("");
                  setInputError(null);
                  setSubmitDisabled(true);
                }}
              >
                Clear
              </Button>
              <Button
                className="text-primary w-fit bg-slate-600 hover:bg-slate-700"
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    setInput(text);
                    setInputError(null);
                    setSubmitDisabled(false);
                  });
                }}
              >
                Paste
              </Button>
            </div>
            <Button
              className="text-primary w-fit bg-indigo-600 hover:bg-indigo-700"
              disabled={submitDisabled}
              onClick={async () => {
                setSubmitDisabled(true);
                setSelectedWord(null);
                await callApi();
                setSubmitDisabled(false);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="text-red-500">{inputError}</div>
        {isError && <div className="text-red-500">An error occurred.</div>}
      </section>
      {mappings && mappings.length > 0 && <BottomSection mappings={mappings} />}
    </main>
  );
}
