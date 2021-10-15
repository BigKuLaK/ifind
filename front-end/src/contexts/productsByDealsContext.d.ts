declare interface ProductsByDealsContextProviderProps {
  children?: JSX.Element;
}

declare interface ProductsByDeal {
  deal_type: DealType;
  products: Product[];
}

declare interface ProductsByDealsValues {
  loading?: boolean;
  error?: ApolloError;
  productsByDeals?: ProductsByDeal[];
}

declare interface DealTypeConfig {
  site: string;
  label: string;
}

declare interface DealTypeMap {
  [dealKey: string]: DealTypeConfig;
}
