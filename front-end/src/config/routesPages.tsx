import Home from "@pages/Home";
import Offers from "@pages/Offers"
import ProductComparison from "@pages/ProductComparison";
import Findtube from "@pages/Findtube";
import Gifts from "@pages/Gifts";
import Blog from "@pages/Blog";
import Contact from "@pages/Contact";
import AGB from "@pages/AGB";
import Impressum from "@pages/Impressum";
import DataProtection from "@pages/DataProtection";
import AboutUs from "@pages/AboutUs";

import { PageContextProvider } from "@contexts/pageContext";
import { ProductComparisonContextProvider } from "@contexts/productComparisonContext";

/**
 * Dynamic route pages
 */
import BasicPage from "@pages/BasicPage";

import routes, { dynamicRoutes } from "./routes";

export const pages = [
  Home,
  Offers,
  ProductComparison,
  Gifts,
  Findtube,
  Blog,
  Contact,
  AGB,
  Impressum,
  DataProtection,
  AboutUs,
];

export const dynamicPages: (ComponentWithProvider | null)[] = [BasicPage];

const providers = [PageContextProvider, ProductComparisonContextProvider];

const wrapWithProvider = (PageComponent?: ComponentWithProvider) => {
  if (PageComponent?.provider) {
    const MatchedProvider = providers.find(
      (provider) => provider.providerName === PageComponent.provider
    );
    if (MatchedProvider) {
      return () => (
        <MatchedProvider>
          <PageComponent />
        </MatchedProvider>
      );
    }
  }
  return PageComponent || null;
};

export default routes.map((route) => ({
  ...route,
  component:
    wrapWithProvider(
      pages.find((page) => page?.componentName === route.componentName) || undefined
    ) || pages.find((page) => page?.componentName === route.componentName),
}));

export const dynamicRoutePages = dynamicRoutes.map((route) => ({
  ...route,
  component: wrapWithProvider(
    dynamicPages.find((page) => page?.componentName === route.componentName) || undefined
  ),
}));
