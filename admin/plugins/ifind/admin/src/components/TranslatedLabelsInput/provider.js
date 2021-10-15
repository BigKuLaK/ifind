import React, { useState, useEffect, useContext, createContext } from 'react';
import { useLanguages } from '../../providers/languageProvider';

export const TranslatedLabelsInputContext = createContext({});

export const TranslatedLabelsInputProvider = ({ children }) => {
  const languages = useLanguages();
  const [ usedLanguages, setUsedLanguages ] = useState([]) // language ids
  const [ availableLanguages, setAvailableLanguages ] = useState([]) // language ids

  useEffect(() => {
    const availableLanguages = languages.filter(language => (
      !usedLanguages.includes(language.id)
    )).map(({ id }) => id);

    setAvailableLanguages(availableLanguages);
  }, [ usedLanguages, languages ]);

  return (
    <TranslatedLabelsInputContext.Provider value={{
      availableLanguages,
      setUsedLanguages,
    }}>
      {children}
    </TranslatedLabelsInputContext.Provider>
  )
}

export const useTranslatedInput = () => useContext(TranslatedLabelsInputContext);