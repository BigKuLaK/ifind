import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  FunctionComponent,
} from "react";
import { useParams } from "react-router-dom";
import { useGQLFetch } from "../helpers/gqlFetch";

export interface I_LogEntry {
  date_time: string;
  type: string;
  message: string;
}
export interface I_BackgroundProcessRouteParam {
  backgroundProcess: string;
}
export interface I_BackgroundProcessProviderValues {
  name?: string;
  logs?: Array<I_LogEntry | never>;
  start?: () => void;
  stop?: () => void;
  refetch?: () => void;
}

export const getBackgroundProcessQuery = `
query GetBackgroundProcess (
  $backgroundProcess: String!
) {
  getBackgroundProcess ( backgroundProcess: $backgroundProcess ) {
    name
    logs {
      date_time
      message
      type
    }
  }
}
`;

export const BackgroundProcessContext = createContext({});

export const BackgroundProcessProvider: FunctionComponent = ({ children }) => {
  const { backgroundProcess }: I_BackgroundProcessRouteParam = useParams();
  const gqlFetch = useGQLFetch();

  const [logs, setLogs] = useState<I_LogEntry[]>([]);
  const [status, setStatus] = useState<string>("");
  const [name, setName] = useState<string>("");

  const fetchBackgroundProcess = useCallback(async () => {
    const data = await gqlFetch(getBackgroundProcessQuery, {
      backgroundProcess,
    });

    if (data?.getBackgroundProcess) {
      setLogs([...(data.getBackgroundProcess?.logs || [])]);
      setStatus(data.getBackgroundProcess?.status || "");
      setName(data.getBackgroundProcess?.name || "");
    }
  }, [backgroundProcess]);

  useEffect(() => {
    if (backgroundProcess) {
      fetchBackgroundProcess();
    }
  }, [backgroundProcess]);

  return (
    <BackgroundProcessContext.Provider
      value={
        {
          status,
          name,
          logs,
          refetch: fetchBackgroundProcess,
        } as I_BackgroundProcessProviderValues
      }
    >
      {children}
    </BackgroundProcessContext.Provider>
  );
};

export const useBackgroundProcess: () =>
  | I_BackgroundProcessProviderValues
  | {} = () => useContext(BackgroundProcessContext);
