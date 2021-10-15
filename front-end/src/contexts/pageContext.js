import { useParams } from 'react-router-dom';
import { createContext, useContext } from 'react';
import { useQuery } from "@apollo/react-hooks";

import pageBySlugQuery from '@gql/pageBySlugQuery';
import { locale as language } from '@config/locale';
import { apiSourceHandle } from '@config/adminApi'

export const PageContext = createContext({});

export const PageContextProvider = ({ children }) => {
    const { slug } = useParams();
    const {
        loading,
        error,
        data
    } = useQuery(pageBySlugQuery, {
        variables: { slug, language },
        context: {
            apiSource: apiSourceHandle,
        }
    });

    return (
        <PageContext.Provider value={{loading, error, data: data?.pageBySlug}}>
            {children}
        </PageContext.Provider>
    )
}

// Supply a name in order to check for it outside
PageContextProvider.providerName = 'PageContextProvider';

export const usePageData = () => {
    const context = useContext(PageContext);
    return context;
}

// Export as default to be used in testing
export default PageContext;