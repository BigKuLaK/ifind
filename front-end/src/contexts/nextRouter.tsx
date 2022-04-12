import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";

export const NextRouter = createContext<NextRouterContext>({
  params: {},
  pathName: "/",
  route: "",
});

export const NextRouterProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  const { query, route } = useRouter();
  const [params, setParams] = useState<AllPageParams>(query);
  const [pathName, setPathName] = useState<string>("/");
  const [currentRoute, setCurrentRoute] = useState<string>(route);

  useEffect(() => {
    setParams(query);
    setPathName(query?.asPath as string);
    setCurrentRoute(query?.route as string);
  }, [query]);

  return (
    <NextRouter.Provider
      value={{
        params,
        pathName,
        route: currentRoute,
      }}
    >
      {children}
    </NextRouter.Provider>
  );
};

export const useParams = () => {
  const { params } = useContext(NextRouter);
  return params;
};

export const useLocation = () => {
  const { pathName, route } = useContext(NextRouter);
  return {
    pathname: pathName,
    route,
  };
};
