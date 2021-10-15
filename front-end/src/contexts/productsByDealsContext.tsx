import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import productsByDealsQuery from "@gql/productsByDealsQuery";

export const ProductsByDealsContext = createContext<ProductsByDealsValues>({});

export const ProductsByDealsContextProvider = ({
  children,
}: ProductsByDealsContextProviderProps) => {
  const [productsByDeals, setProductsByDeals] = useState<ProductsByDeal[]>([]);
  const { loading, error, data } = useQuery(productsByDealsQuery);

  useEffect(() => {
    console.log({ data });
    setProductsByDeals(data?.productsByDeals || []);
  }, [data]);

  return (
    <ProductsByDealsContext.Provider
      value={{
        loading,
        error,
        productsByDeals,
      }}
    >
      {children}
    </ProductsByDealsContext.Provider>
  );
};

// Supply a name in order to check for it outside
ProductsByDealsContextProvider.providerName = "ProductsByDealsContextProvider";

export const useProductsByDeals = () => useContext(ProductsByDealsContext);

// Export as default to be used in testing
export default ProductsByDealsContext;
