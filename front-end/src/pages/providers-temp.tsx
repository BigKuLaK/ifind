import { PropsWithChildren, ReactNode } from "react";

import { NextRouterProvider } from "@contexts/nextRouter";

import { OffersSideNavProvider } from "../components/OffersSideNav/context";
import { VendorProvider } from "@contexts/vendorContext";
import { GlobalContextProvider } from "@contexts/globalDataContext";
import { RegionContextProvider } from "@contexts/regionContext";
import { ProductContextProvider } from "@contexts/productContext";
import { CategoriesContextProvider } from "@contexts/categoriesContext";
import { GlobalStateContextProvider } from "@contexts/globalStateContext";
import { SourceRegionProvider } from "@contexts/sourceRegionContext";
import { LanguagesProvider } from "@contexts/languagesContext";
import { OffersCategoriesProvider } from "@contexts/offersCategoriesContext";

export const Providers = ({ children }: PropsWithChildren<ReactNode>) => (
  <NextRouterProvider>
    <LanguagesProvider>
    {children}

    </LanguagesProvider>
  </NextRouterProvider>
);
