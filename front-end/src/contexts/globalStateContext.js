import { createContext, useState, useCallback } from 'react';

export const GlobalStateContext = createContext({});

export const GlobalStateContextProvider = ({ children }) => {

    const [activeCategory, setActiveCategory] = useState(null);
    const [focusedCategory, setFocusedCategory] = useState(0);

    const onCategoryClick = useCallback((id) => {
        setFocusedCategory(id);
    }, []);

    return (
        <GlobalStateContext.Provider value={{
            activeCategory: parseInt(activeCategory, 10),
            setActiveCategory,
            focusedCategory,
            onCategoryClick,
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
}