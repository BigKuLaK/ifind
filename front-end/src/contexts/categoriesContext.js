import { createContext, useEffect, useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { apiSourceHandle } from '@config/adminApi';
import getCategoryTree from '@gql/getCategoryTreeQuery';
import { useAuth } from './authContext';
import { useRegion } from './regionContext';
import { locale as language } from '@config/locale';

export const CategoriesContext = createContext({});

export const CategoriesContextProvider = ({ children }) => {
    const { region } = useRegion();
    const [ categoryTree, setCategoryTree ] = useState([]);
    const { token } = useAuth();
    const {
        data,
        // loading,
        // error
    } = useQuery(getCategoryTree, {
        variables: { region, language },
        context: {
            apiSource: apiSourceHandle,
            token
        }
    });

    useEffect(() => {
        if ( data?.categoryTree ) {
            setCategoryTree(data.categoryTree);
        }
    }, [ data ]);


    return (
        <CategoriesContext.Provider value={{ categoryTree }}>
            {children}
        </CategoriesContext.Provider>
    )
}

export const useCategoryTree = () => {
    const { categoryTree } = useContext(CategoriesContext);
    return categoryTree;
}

// Export as default to be used in testing
export default CategoriesContext;