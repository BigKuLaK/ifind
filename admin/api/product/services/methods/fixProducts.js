const { filterProductsWithProblems } = appRequire("helpers/product");
const { isAmazonLink } = appRequire("helpers/amazon");

/**
 * Fixes all products in terms of missing URLs or price.
 * Traverses each product's change history, and retrieves necessary Details from them.
 * @returns [Product]
 */
module.exports = async (force = false) => {
  const allProducts = await strapi.services.product.find({ _limit: 99999 });
  const productsToUpdate = force ? allProducts : filterProductsWithProblems(allProducts);

  // Extract and set fixed data for each product
  const updatedProductsData = productsToUpdate.map((product) => {
    const productChanges = product.product_changes || [];

    // Sort from recent changes
    productChanges.sort((changeA, changeB) =>
      changeA.date_time >= changeB.date_time ? -1 : 1
    );

    // Fix amazon_url
    if (!isAmazonLink(product.amazon_url)) {
      const changeWithAmazonURL = productChanges.find(
        ({ state }) => state && isAmazonLink(state.amazon_url)
      );
      // Apply old valid amazon url
      if (changeWithAmazonURL) {
        product.amazon_url = changeWithAmazonURL.state.amazon_url;
      }
    }
    // Fix url_list
    if (!product.url_list || !product.url_list.length) {
      const changeWithURLList = productChanges.find(
        ({ state }) => state && state.url_list && state.url_list.length
      );
      // Apply old url list if any
      if (changeWithURLList) {
        product.url_list = changeWithURLList.state.url_list;
      }
    }
    // Fix attrs_rating
    if (!product.attrs_rating || !product.attrs_rating.length) {
      const changeWithAttrsRating = productChanges.find(
        ({ state }) => state && state.attrs_rating && state.attrs_rating.length
      );
      // Apply old url list if any
      if (changeWithAttrsRating) {
        product.attrs_rating = changeWithAttrsRating.state.attrs_rating.map(
          ({ id, ...attr_rating }) => attr_rating
        );
      }
    }

    // Only apply updates to selected properties
    return {
      id: product.id,
      amazon_url: product.amazon_url,
      url_list: product.url_list,
      attrs_rating: product.attrs_rating,
    };
  });

  // Then, save all these updated products,
  // Returning the full data for each product
  const savedProducts = [];

  for (const newData of updatedProductsData) {
    const { id, ...productData } = newData;

    try {
      strapi.productChangedData = productData;

      const result = await strapi.services.product.update({ id }, {
        ...productData,
        updateScope: {
          price: false,
          amazonDetails: false,
        }
      });
      const count = savedProducts.push(result);
      console.log(`Updated ${count} of ${updatedProductsData.length} [${id}]`.green.bold, result.title);
    } catch (err) {
      console.log(`Error in ${id}`.bgRed.white.bold, productData);
      console.error(err);
    }
  }

  return savedProducts;
};
