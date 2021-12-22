declare type AdditionalInfoOption = 'stocks_available' | 'rating';

declare interface ProductDealCardProps extends Partial<Product> {
  onClick?: (product: Product) => void;
  additional_info?: AdditionalInfoOption
}

declare interface ProductDealCardComponent
  extends React.FunctionComponent<ProductDealCardProps> {}
