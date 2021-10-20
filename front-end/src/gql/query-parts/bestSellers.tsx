const bestSellers = (category: string, limit = 5) => `
    bestSellers(category: "${category}", limit: ${limit} ) {
        title
        detailURL
        image {
            sizes {
                small
            }
        }
    }
`;

export default bestSellers;
