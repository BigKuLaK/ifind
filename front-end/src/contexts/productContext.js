import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { apiSourceHandle } from '@config/adminApi'
import getProductDetailQuery from '@gql/getProductDetailQuery';
import incrementProductClickMutation from '@gql/incrementProductClickMutation';

import { locale } from '@config/locale';

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {
    const [ productDetail, setProductDetail ] = useState(null);
    const [
        fetchProductDetails,
        {
            // loading,
            error,
            data,
        }
    ] = useLazyQuery(getProductDetailQuery);
    const [
        mutationFunction,
        // { data: mutationData, loading, error },
    ] = useMutation(incrementProductClickMutation);

    const getProductDetails = useCallback(( productID ) => {
        fetchProductDetails({
            context: {
                apiSource: apiSourceHandle,
            },
            variables: { 
                id: productID,
                language: locale,
            }
        });
    }, [ fetchProductDetails ]);

    const incrementProductClick = useCallback((id) => {
        mutationFunction({
            variables: { id},
            context: {
                apiSource: apiSourceHandle,
            },
        });
    }, [ mutationFunction ]);

    useEffect(() => {
        setProductDetail(data?.productDetails);
    }, [ data ]);

    useEffect(() => {
        if ( error ) {
            console.warn(error);
        }
    }, [error])

    return (
        <ProductContext.Provider value={{
            productDetail,
            getProductDetails,
            incrementProductClick,
        }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProductDetail = () => {
    const context = useContext(ProductContext);
    return context;
}

// Export as default to be used in testing
export default ProductContext;