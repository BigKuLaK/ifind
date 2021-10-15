import React, { useEffect } from 'react';

const GeneralTemplate = ({ children }: React.PropsWithChildren<any>) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {children}
        </>
    )
};

export default GeneralTemplate;
