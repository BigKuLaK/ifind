import { createContext, useState, useContext } from 'react';

export const RegionContext = createContext({});

export const RegionContextProvider = ({ children }) => {
    //  TODO: use localStorage once FE region selection is implemented
    const [ region ] = useState('de');

    return (
        <RegionContext.Provider value={{ region }}>
            {children}
        </RegionContext.Provider>
    );
};

RegionContextProvider.providerName = 'RegionContextProvider';

export const useRegion = () => {
    const context = useContext(RegionContext);
    return context;
}