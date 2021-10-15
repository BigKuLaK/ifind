import { createContext, useContext, useEffect, useState } from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import { locale } from '@config/locale';
import { apiSourceHandle } from '@config/adminApi';
import getCategoryProductsQuery from '@gql/getCategoryProductsQuery';

export const CategoryProductsContext = createContext({});

export const CategoryProductsContextProvider = ({ children }) => {
    const [ categories, setCategories ] = useState([]);
    const [ categoryProducts, setCategoryProducts ] = useState([]);
    const [
      loadCategoryProducts,
      {
        data,
        loading,
        // error,
        // refetch
      }
    ] = useLazyQuery(getCategoryProductsQuery, {
        variables: {
          language: locale,
          categories
        },
        context: {
            apiSource: apiSourceHandle,
        }
    });

    useEffect(() => {
        if (data?.categoryProducts) {
          setCategoryProducts(data.categoryProducts);
        }
    }, [data]);

    useEffect(() => {
      loadCategoryProducts();
    }, [ categories, loadCategoryProducts ]);

    return (
        <CategoryProductsContext.Provider value={{
          categoryProducts,
          getCategoryProducts: setCategories,
          loading
        }}>
            {children}
        </CategoryProductsContext.Provider>
    )
}

CategoryProductsContextProvider.providerName = 'CategoryProductsContextProvider';

export const useProductComparison = () => {
    const context = useContext(CategoryProductsContext);
    return context;
}

// Export as default to be used in testing
export default CategoryProductsContext;
