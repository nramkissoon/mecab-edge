import { Mapping } from "~/lib/mapping";
import { useSelectedWordMapping } from "./WordContext";

export const HighlightableWord = ({
  mapping,
  i,
}: {
  mapping: Mapping;
  i: number;
}) => {
  const { setSelectedWord, index } = useSelectedWordMapping();

  if (/\n+/.test(mapping.text)) {
    const numNewLines = mapping.text.split("\n").length;
    return (
      <>
        {Array.from({ length: numNewLines }).map((_, i) => (
          <br key={i} />
        ))}
      </>
    );
  }

  return (
    <span
      className={
        "px-[1px] text-xl hover:cursor-pointer hover:bg-indigo-700" +
        (index === i ? " bg-indigo-700" : "")
      }
      onClick={() => {
        setSelectedWord({
          index: i,
          mapping,
        });
      }}
    >
      {mapping.text}
    </span>
  );
};
