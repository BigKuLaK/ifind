const { getBestSellers, getProductDetail } = require('@sources/amazon');

module.exports = {
    Query: {
        bestSellers: async (parent, args) => {
            return await getBestSellers(args.category, args.limit);
        },
        productDetail: async (parent, args) => {
            return await getProductDetail(args.productDetailURL);
        }
    },
};