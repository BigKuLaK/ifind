import React, { memo } from "react";
import { FunctionComponent } from "react";

import { DragAndDropProvider } from "./dragAndDropProvider";
import { AuthContextProvider } from "./authProvider";
import { CategoriesListingProvider } from "./categoriesListingProvider";
import { SourceRegionProvider } from "./sourceRegionProvider";
import { GlobalContextProvider } from "./globalProvider";
import { AdminUserProvider } from "./adminUserProvider";
import { LanguageProvider } from "./languageProvider";
import { ProductAttributesProvider } from "./productAttributesProvider";
import { TagsProvider } from "./tagsProvider";

interface Props {
  children: Array<any>;
}

const Providers: FunctionComponent<Props> = ({ children }: Props) => {
  return (
    <GlobalContextProvider>
      <AuthContextProvider>
        <AdminUserProvider>
          <LanguageProvider>
            <SourceRegionProvider>
              <TagsProvider>
                <ProductAttributesProvider>
                  <CategoriesListingProvider>
                    <DragAndDropProvider>{children}</DragAndDropProvider>
                  </CategoriesListingProvider>
                </ProductAttributesProvider>
              </TagsProvider>
            </SourceRegionProvider>
          </LanguageProvider>
        </AdminUserProvider>
      </AuthContextProvider>
    </GlobalContextProvider>
  );
};

export default memo(Providers);
