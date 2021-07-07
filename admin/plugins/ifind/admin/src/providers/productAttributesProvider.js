import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

const producttAttributesQuery = `
query GetProductsAttributes {
  productAttributes {
    id
    name
  }
}
`;

export const ProductAttributesContext = createContext({});

export const ProductAttributesProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const [ productAttributes, setProductAttributes ] = useState(null);

  useEffect(() => {
    gqlFetch(producttAttributesQuery)
    .then(data => setProductAttributes(data?.productAttributes))
    .catch(err => console.error(err));
  }, []);

  return (
    <ProductAttributesContext.Provider value={{
      productAttributes
    }}>
      {children}
    </ProductAttributesContext.Provider>
  )
};

export const useProductAttributes = () => {
  return useContext(ProductAttributesContext);
}