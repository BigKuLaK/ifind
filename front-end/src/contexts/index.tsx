import { OffersSideNavProvider } from "../components/OffersSideNav/context";
import { VendorProvider } from "./vendorContext";
import { GlobalContextProvider } from "./globalDataContext";
import { RegionContextProvider } from "./regionContext";
import { ProductContextProvider } from "./productContext";
import { CategoriesContextProvider } from "./categoriesContext";
import { GlobalStateContextProvider } from "./globalStateContext";
import { SourceRegionProvider } from "./sourceRegionContext";
import { LanguagesProvider } from "./languagesContext";
import { OffersCategoriesProvider } from "./offersCategoriesContext";
import { NextRouterProvider } from "./nextRouter";
import { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren<React.ReactNode>) => {
  return (
    <NextRouterProvider>
      <LanguagesProvider>
        <VendorProvider>
          <GlobalContextProvider>
            <GlobalStateContextProvider>
              <OffersSideNavProvider>
                <SourceRegionProvider>
                  <RegionContextProvider>
                    <CategoriesContextProvider>
                      <OffersCategoriesProvider>
                        <ProductContextProvider>
                          {children}
                        </ProductContextProvider>
                      </OffersCategoriesProvider>
                    </CategoriesContextProvider>
                  </RegionContextProvider>
                </SourceRegionProvider>
              </OffersSideNavProvider>
            </GlobalStateContextProvider>
          </GlobalContextProvider>
        </VendorProvider>
      </LanguagesProvider>
    </NextRouterProvider>
  );
};
