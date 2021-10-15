import { GlobalContextProvider } from './globalDataContext';
import { RegionContextProvider } from '@contexts/regionContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { GlobalStateContextProvider } from '@contexts/globalStateContext';
import { SourceRegionProvider } from '@contexts/sourceRegionContext';
import { useAuth } from '@contexts/authContext';

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (
        <GlobalContextProvider>
            <GlobalStateContextProvider>
                <SourceRegionProvider>
                    <RegionContextProvider>
                        <CategoriesContextProvider>
                            <ProductContextProvider>
                                {children}
                            </ProductContextProvider>
                        </CategoriesContextProvider>
                    </RegionContextProvider>
                </SourceRegionProvider>
            </GlobalStateContextProvider>
        </GlobalContextProvider>
    )
};
