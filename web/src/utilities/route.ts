import {
  matchPath
} from "react-router";
import { routesExtraConfig } from "config/routes";
import { useLanguages } from "providers/languagesContext";
import { useCallback } from "react";

export const routeWithLanguage = (path: string) => `/:language${path}`;

export const useCurrentRouteMatch = () => {
  const [pathname, route] = ['',''];
  const params = {};

  return {
    params,
    path: route || '',
    url: pathname,
  }
};

export const useCurrentRouteConfig = () => {
  const location = {
    pathname: '/'
  };
  const matchedRouteConfig = routesExtraConfig.find(({ path }: RouteConfig) =>
    matchPath(location.pathname, {
      path,
    })
  );
  return matchedRouteConfig;
};

export const useLinkWithLanguage = () => {
  const { userLanguage } = useLanguages();
  return useCallback(
    (absoluteLink: string = "/") => `/${userLanguage}${absoluteLink}`,
    [userLanguage]
  );
};

export const useIsRouteMatch = () => {
  const currentRouteMatch = useCurrentRouteMatch();

  return (route: string = "/", omitLanguage: boolean = false): boolean =>
    currentRouteMatch?.path.replace(/\/$/, "") ===
    (omitLanguage
      ? route.replace(/\/$/, "")
      : routeWithLanguage(route).replace(/\/$/, ""));
};
