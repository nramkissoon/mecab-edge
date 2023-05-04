import { SVGProps, useMemo, useState } from "react";
import { useSelectedWordMapping } from "./WordContext";
import { Button } from "./Button";
import { Mapping } from "~/lib/mapping";
import { EnglishOutput, JapaneseOutput } from "~/lib/schema";
import { useToast } from "./UseToast";

const ClipboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="lucide lucide-clipboard-copy"
    {...props}
  >
    <rect width={8} height={4} x={8} y={2} rx={1} ry={1} />
    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4M21 14H11" />
    <path d="m15 10-4 4 4 4" />
  </svg>
);

export const MecabDataViewer = ({ mappings }: { mappings: Mapping[] }) => {
  const [mode, setMode] = useState<"word" | "full">("word");
  const { selectedWord } = useSelectedWordMapping();
  const { toast } = useToast();
  return (
    <>
      <div className="sticky top-0 flex justify-between gap-5 bg-slate-900/90 px-5 py-3">
        <div className="flex gap-5">
          <Button
            className={
              "h-fit w-[70px] rounded-full bg-transparent py-1 text-slate-400  hover:bg-indigo-600 hover:text-white" +
              (mode === "word" ? " bg-indigo-600 text-white" : "")
            }
            onClick={() => setMode("word")}
          >
            Word
          </Button>
          <Button
            className={
              "h-fit w-[70px] rounded-full bg-transparent py-1 text-slate-400  hover:bg-indigo-600 hover:text-white" +
              (mode === "full" ? " bg-indigo-600 text-white" : "")
            }
            onClick={() => setMode("full")}
          >
            JSON
          </Button>
        </div>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border-transparent bg-slate-600 p-1 duration-100 hover:bg-slate-700"
          onClick={() => {
            if (mode === "word") {
              navigator.clipboard.writeText(JSON.stringify(selectedWord?.data));
              toast({
                title: "Copied to clipboard!",
              });
            } else {
              navigator.clipboard.writeText(JSON.stringify(mappings, null, 2));
              toast({
                title: "Copied to clipboard!",
              });
            }
          }}
        >
          <ClipboardIcon />
        </button>
      </div>
      <div className="h-full px-4 py-4">
        {mode === "word" && <WordData />}
        {mode === "full" && (
          <div className="flex flex-col gap-2">
            <pre className="text-slate-200">
              {JSON.stringify(mappings, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

const WordData = () => {
  const { selectedWord } = useSelectedWordMapping();

  if (!selectedWord) {
    return <div className="text-slate-400">Select a word from the text.</div>;
  }

  // @ts-ignore
  if (selectedWord.data?.surface !== undefined) {
    const data = selectedWord.data as EnglishOutput;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-slate-400">Word in text:</span>
          <span className="text-slate-200">{selectedWord?.text}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Part of speech:</span>
          <span className="text-slate-200">{data.partOfSpeech}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Classification 1:</span>
          <span className="text-slate-200">{data.classification1}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Classification 2:</span>
          <span className="text-slate-200">{data.classification2}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Classification 1:</span>
          <span className="text-slate-200">{data.classification3}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Conjugation:</span>
          <span className="text-slate-200">{data.conjugation}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Inflection:</span>
          <span className="text-slate-200">{data.inflection}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Original:</span>
          <span className="text-slate-200">{data.original}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Reading:</span>
          <span className="text-slate-200">{data.reading}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">Pronunciation:</span>
          <span className="text-slate-200">{data.pronunciation}</span>
        </div>
      </div>
    );
  } else {
    const data = selectedWord.data as JapaneseOutput;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-slate-400">表層形:</span>
          <span className="text-slate-200">{data.表層形}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">品詞:</span>
          <span className="text-slate-200">{data.品詞}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">品詞細分類1:</span>
          <span className="text-slate-200">{data.品詞細分類1}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">品詞細分類2:</span>
          <span className="text-slate-200">{data.品詞細分類2}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">品詞細分類3:</span>
          <span className="text-slate-200">{data.品詞細分類3}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">活用形:</span>
          <span className="text-slate-200">{data.活用形}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">活用型:</span>
          <span className="text-slate-200">{data.活用型}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">原形:</span>
          <span className="text-slate-200">{data.原形}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">読み:</span>
          <span className="text-slate-200">{data.読み}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-400">発音:</span>
          <span className="text-slate-200">{data.発音}</span>
        </div>
      </div>
    );
  }
};
