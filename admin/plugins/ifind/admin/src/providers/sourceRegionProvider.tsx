import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
  ReactNode,
} from "react";
import { useQuery } from "../helpers/query";

const sourcesRegionsQuery = `
  query {
    sources {
      id
      name
      regions {
        id
        name
        code
      }
    }
    regions {
      id
      name
      code
    }
  }
`;

export interface I_SourceRegionContext {
  sources?: { [key: string]: any }[];
  regions?: { [key: string]: any }[];
  loading?: boolean;
}

export const SourceRegionContext = createContext<I_SourceRegionContext>({});

export const SourceRegionProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  const [sources, setSources] = useState<{ [key: string]: any }[]>([]);
  const [regions, setRegions] = useState<{ [key: string]: any }[]>([]);
  const { data, loading, error } = useQuery(sourcesRegionsQuery);

  useEffect(() => {
    if (data?.sources) {
      setSources(data?.sources || []);
    }
    if (data?.regions) {
      setRegions(data?.regions || []);
    }
  }, [data]);

  return (
    <SourceRegionContext.Provider value={{ sources, regions, loading }}>
      {children}
    </SourceRegionContext.Provider>
  );
};

export const useSourceRegion = () => {
  return useContext(SourceRegionContext);
};
