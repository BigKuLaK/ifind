const { gql } = require('apollo-server-express');

// Non-queryable types
const nonQueryTypes = [
  require('./Image'),
];

// Queryable types
const queryTypes = [
  require('./Product'),
];

module.exports = gql`
  type Query { 
    products: [Product]
    bestSellers(category: String!, limit: Int!): [Product]
    productDetail(productDetailURL: String!): Product
  }
  ${nonQueryTypes.join('\n')}
  ${queryTypes.join('\n')}
`;