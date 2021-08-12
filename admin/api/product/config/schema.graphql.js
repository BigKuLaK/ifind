module.exports = {
  definition: `
    type ProductDetails {
      id: ID
      details_html: String
      price: Float
      image: String
    }
    type ProductCategory {
      label: ComponentAtomsTranslateableLabel
      id: ID!
      order: Int
    }
    input ProductsListWhereParamInput {
      search: String
      category: ID
    }
    type ProductsListPayload {
      count: Int
      products: [Product]
    }
    type NaturalList {
      category: ProductCategory
      products: [Product]
    }
    type ProductClicksDetails {
      id: ID
      clicks_count: Int
    }
    type FixedProductsPayload {
      count: Int
      products: [Product]
    }
  `,
  query: `
    productDetails (id: ID!, language: String): ProductDetails
    productComparisonList (language: String!): [NaturalList]
    productsList (sort: String, limit: Int, start: Int, where: ProductsListWhereParamInput): ProductsListPayload
  `,
  mutation: `
    addProductClick (id: ID!): ProductClicksDetails
    fixProducts: FixedProductsPayload
    updateProductLinks: FixedProductsPayload
  `,
  resolver: {
    Query: {
      async productDetails(_, args) {
        const productDetails = await strapi.services.product.getProductDetails(args.id, args.language);
        return productDetails;
      },
      async productComparisonList(_, args) {
        const productComparisonList = await strapi.services.product.productComparisonList(args.language);
        return productComparisonList;
      },
      async productsList(_, args) {
        return await strapi.services.product.productsList(args);
      }
    },
    Mutation: {
      async addProductClick(_, args) {
        const updatedProductClicks = await strapi.services.product.addProductClick(args.id);
        return updatedProductClicks;
      },
      async fixProducts() {
        const updatedProducts = await strapi.services.product.fixProducts();
        return {
          count: updatedProducts.length,
          products: updatedProducts,
        }
      },
      async updateProductLinks() {
        const updatedProducts = await strapi.services.product.updateProductLinks();
        return {
          count: updatedProducts.length,
          products: updatedProducts,
        }
      }
    }
  }
};
