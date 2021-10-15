import { createContext, useContext, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { locale } from '@config/locale';
import { tags as amazonTags, amazonURLPattern } from '@config/amazon';
import globalDataQuery from '@gql/globalDataQuery';
import { apiSourceHandle } from '@config/adminApi'
import { useAuth } from '@contexts/authContext';
import { addURLParams } from '@utilities/url';

/**
 * This context should contain global data:
 * - Site data (contact infos, logo, etc.)
 * - Navigation items ?
 * - Footer items ?
 */
const GlobalContext = createContext({});

export const GlobalContextProvider = ({ children }) => {
    const { token } = useAuth();
    const {
        // loading,
        // error,
        data: globalData
    } = useQuery(globalDataQuery, {
        variables: { language: locale },
        context: {
            apiSource: apiSourceHandle,
            token
        }
    });

    const withAmazonTags = useCallback((url = '') => (
        amazonURLPattern.test(url)
            ? addURLParams(url, amazonTags)
            : url
    ), []);

    return (
        <GlobalContext.Provider value={{
            contactInfo: globalData?.contactDetail,
            footerSetting: globalData?.footerSettingsByLanguage,
            socialNetwork: globalData?.socialNetwork,
            withAmazonTags,
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalData = () => {
    const context = useContext(GlobalContext);
    return context;
}

// Export as default to be used in testing
export default GlobalContext;