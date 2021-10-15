import { useEffect, useState } from 'react';

import BasicPageTemplate from '@templates/BasicPage';
import { usePageData } from '@contexts/pageContext';
import { withComponentName, withProvider } from '@utilities/component';

const BasicPage = () => {
    const { data, loading } = usePageData();
    const [ pageData, setPageData ] = useState({});

    useEffect(() => {
        if ( data && data.data ) {
            setPageData(data.data);
        }
    }, [ data ]);

    return (
        <BasicPageTemplate title={ pageData.title || '' }>
            <div dangerouslySetInnerHTML={{ __html: loading ? 'Loading Page...' : pageData.body  }}></div>
        </BasicPageTemplate>
    )
};

export default withProvider('PageContextProvider')(withComponentName('BasicPage')(BasicPage));