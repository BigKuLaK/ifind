import { gql } from "apollo-boost";

const getCategoryProducts = gql`
  query CategoryProducts($language: String, $categories: [ID]) {
    categoryProducts(language: $language, categories: $categories) {
      category {
        id
      }
      products {
        title
        category {
          id
        }
      }
    }
  }
`;

export default getCategoryProducts;
