import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Mapping } from "~/lib/mapping";

type SelectedWordMappingContextType = {
  selectedWord: Mapping | null;
  setSelectedWord: Dispatch<
    SetStateAction<{ mapping: Mapping; index: number } | null>
  >;
  index: number;
};

const SelectedWordMappingContext =
  createContext<SelectedWordMappingContextType>({
    selectedWord: null,
    setSelectedWord: () => {},
    index: 0,
  });

export const useSelectedWordMapping = () => {
  const context = useContext(SelectedWordMappingContext);

  if (context === undefined) {
    throw new Error(
      "useSelectedWordMapping must be used within a SelectedWordMappingProvider",
    );
  }
  return context;
};

export const SelectedWordMappingProvider: FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
  const [selectedWord, setSelectedWord] = useState<{
    mapping: Mapping;
    index: number;
  } | null>(null);

  return (
    <SelectedWordMappingContext.Provider
      value={{
        selectedWord: selectedWord?.mapping ?? null,
        setSelectedWord,
        index: selectedWord?.index ?? -1,
      }}
    >
      {children}
    </SelectedWordMappingContext.Provider>
  );
};
