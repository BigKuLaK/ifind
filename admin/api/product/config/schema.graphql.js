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
    type NaturalList {
      category: ProductCategory
      products: [Product]
    }
  `,
  query: `
    productDetails (id: ID!, language: String): ProductDetails
    productComparisonList (language: String!): [NaturalList]
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
      }
    }
  }
};
