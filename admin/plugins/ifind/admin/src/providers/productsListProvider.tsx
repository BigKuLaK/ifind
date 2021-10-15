import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
} from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "../helpers/query";
import { useGQLFetch } from "../helpers/gqlFetch";
import { getSearchParams, useSearchParams } from "../helpers/url";

import { I_Product } from "./productProvider";

export interface I_ProductListProviderValues {
  products?: I_Product[];
  loading?: boolean;
  deleteProducts?: (productIDs: any) => Promise<void>;
  refresh?: () => {};
  searchTerm?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  totalPages?: number;
  status?: string;
  tab?: string;
  dealType?: string;
}

export interface I_ListOptions extends I_ProductListProviderValues {
  category?: string;
  search?: string;
}

export type T_ProductWhereFilterKeys =
  | "category"
  | "search"
  | "status"
  | "website_tab"
  | "deal_type";

const ProductFragment = `
fragment ProductFragment on Product {
  id
  title
  image
  position
  amazon_url
  deal_type
  url_list {
    source { id  }
    region { id }
    url
  }
  created_at
  updated_at
  source {
    id
  }
  region {
    id
  }
  category {
    id
    label {
      label
      language {
        code
      }
    }
  }
}
`;

const productsListQuery = `
  ${ProductFragment}
  query ProductsList (
    $limit: Int!
    $start: Int!
    $sort: String!
    $where: ProductsListWhereParamInput
    ) {
      productsList (
        limit: $limit
        start: $start
        sort: $sort
        where: $where
        ) {
          count
          products {
            ... ProductFragment
          }
        }
      }
  `;
const _deleteProductsMutation = (productIDs: number[]) => `
mutation DeleteProducts {
  ${productIDs.map(
    (id) => `
      deleteProduct${id}: deleteProduct (
        input: {
          where: { id: ${id}}
        }
      ) {
        product {
          id
        }
      }
    `
  )}
}
`;

export const ProductsListContext = createContext<I_ProductListProviderValues>(
  {}
);

export const ProductsListProvider = memo(({ children }) => {
  const gqlFetch = useGQLFetch();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [requestTimeout, setRequestTimeout] = useState<number>();
  const [searchTerm, setSearchTerm] = useState(searchParams.search);
  const [status, setStatus] = useState(searchParams.status);
  const [tab, setTab] = useState(searchParams.tab);
  const [dealType, setDealType] = useState(searchParams.deal_type);

  const [listOptions, setListOptions] = useState<I_ListOptions>({
    sortBy: searchParams?.sort_by || "id", // Product field
    sortOrder: searchParams?.order || "desc", // desc|asc
    pageSize: Number(searchParams?.page_size || 10),
    page: Number(searchParams?.page || 1),
    category: searchParams?.category || "",
    search: searchParams?.search || "",
    status: searchParams?.status || "published",
    tab: searchParams?.tab || "product_comparison",
    dealType: searchParams?.deal_type || "",
  });

  const [totalPages, setTotalPages] = useState(1);
  const [queryOptions, setQueryOptions] = useState<{
    query: string | null;
    variables: { [key: string]: any };
  }>({
    query: null,
    variables: {},
  });

  const [products, setProducts] = useState<I_Product[]>([]);

  const buildQueryVars = useCallback(
    ({
      sortBy,
      sortOrder,
      pageSize,
      page,
      category,
      search,
      status,
      website_tab,
      deal_type,
    }) => {
      const limit = pageSize;
      const start = pageSize * (page - 1);
      const sort = `${sortBy}:${sortOrder}`;
      const where: { [key: string]: string } = {
        category,
        search,
        status,
        website_tab,
      };

      if (website_tab === "home") {
        where.deal_type = deal_type;
      }

      return { limit, start, sort, where };
    },
    []
  );

  const refresh = useCallback(() => {
    clearTimeout(requestTimeout);

    setRequestTimeout(
      window.setTimeout(async () => {
        setLoading(true);
        const data = await gqlFetch(queryOptions.query, queryOptions.variables);

        if (data?.productsList) {
          setProductsListData(data.productsList);
        }
        setLoading(false);
      }, 300)
    );
  }, [queryOptions, requestTimeout]);

  const deleteProducts = useCallback((productIDs) => {
    return gqlFetch(_deleteProductsMutation(productIDs)).then((data) =>
      console.log({ data })
    );
  }, []);

  const setProductsListData = useCallback(
    ({ products, count }) => {
      setProducts(products);

      // Compute pagination
      setTotalPages(
        Math.ceil((count || 0) / (listOptions?.pageSize || 1)) || 1
      );
    },
    [listOptions, searchTerm]
  );

  // Update queryVars on change of sortBy, sortOrder, pageSize, page
  useEffect(() => {
    const variables = buildQueryVars({
      sortBy: listOptions.sortBy,
      sortOrder: listOptions.sortOrder,
      pageSize: listOptions.pageSize,
      page: listOptions.page,
      category: listOptions.category,
      search: listOptions.search,
      status: listOptions.status,
      website_tab: listOptions.tab,
      deal_type: listOptions.dealType,
    });
    const query = productsListQuery;

    setQueryOptions({ query, variables });
  }, [listOptions]);

  useEffect(() => {
    refresh();
  }, [queryOptions]);

  useEffect(() => {
    setListOptions({
      page: Number(searchParams?.page || 1),
      pageSize: Number(searchParams?.page_size || 10),
      sortBy: searchParams?.sort_by || "id",
      sortOrder: searchParams?.order || "desc",
      category: searchParams?.category || "",
      search: searchParams?.search || "",
      status: searchParams?.status || "published",
      tab: searchParams?.tab || "product_comparison",
      dealType: searchParams?.deal_type || "",
    });
    setSearchTerm(searchParams.search);
    setStatus(searchParams.status);
  }, [searchParams]);

  return (
    <ProductsListContext.Provider
      value={
        {
          products,
          // Values
          page: listOptions.page,
          pageSize: listOptions.pageSize,
          sortBy: listOptions.sortBy,
          sortOrder: listOptions.sortOrder,
          status: listOptions.status,
          tab: listOptions.tab,
          dealType: listOptions.dealType,
          totalPages,
          // Additionals
          loading,
          refresh,
          deleteProducts,
        } as I_ProductListProviderValues
      }
    >
      {children}
    </ProductsListContext.Provider>
  );
});

export const useProductsList = () => {
  return useContext(ProductsListContext);
};
