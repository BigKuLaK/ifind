import React, { useEffect, useState, useContext, createContext } from 'react';

import { useGQLFetch } from '../helpers/gqlFetch';

const languageQuery = `
query GetLanguages {
  languages {
    id
    code
    name
  }
}
`

export const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const [ languages, setLanguages ] = useState([]);

  useEffect(() => {
    gqlFetch(languageQuery)
    .then(data => {
      if ( data?.languages ) {
        setLanguages(data.languages);
      }
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <LanguageContext.Provider value={{ languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguages = () => {
  const { languages } = useContext(LanguageContext);
  return languages;
}