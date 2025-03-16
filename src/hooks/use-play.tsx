import {createContext, ReactNode, useContext, useState} from "react";
import {PlayContextType} from "../i18n/types";

const Context = createContext<PlayContextType | undefined>(undefined);

interface PlayProviderProps {
  children: ReactNode;
}

export const PlayProvider = ({ children }: PlayProviderProps) => {
  const [play, setPlay] = useState(false);
  const [end, setEnd] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  return (
    <Context.Provider
      value={{
        play,
        setPlay,
        end,
        setEnd,
        hasScroll,
        setHasScroll,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePlay = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("usePlay must be used within a PlayProvider");
  }

  return context;
};