import { editProductInput } from './admin.graphql';

declare global {
  export interface QueryParamsBase {
    _limit ?: number;
  }

  export interface ProductQueryParams extends QueryParamsBase, editProductInput {}

}

export { }
