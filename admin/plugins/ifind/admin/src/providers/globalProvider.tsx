import React, { createContext, useState, useContext } from "react";

export interface I_GlobalProviderProps
  extends React.PropsWithChildren<JSX.Element> {}

export interface I_GlobalProviderContext {
  isLoading?: boolean;
  setIsLoading?: (isLoading: boolean) => any;
}

export const GlobalContext = createContext<I_GlobalProviderContext>({});

export const GlobalContextProvider = ({ children }: I_GlobalProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalContext.Provider value={{ isLoading, setIsLoading } as I_GlobalProviderContext}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
