import { gql } from "apollo-boost";

const getProductComparisonList = gql`
query ProductComparisonList(
  $language: String
  $root: ID
) {
    productComparisonList(
      language: $language
      root: $root
    ) {
        category {
            id
            label
            order
            created_at
        }
        products {
            id
            title
            amazon_url
            price
            image
            created_at
        }
    }
}
`;

export default getProductComparisonList;
