'use strict';

const { fetchProductDetails, filterProductsWithProblems } = appRequire('helpers/product');
const { isAmazonLink } = appRequire('helpers/url');

const extractEndpointCategories = (categoryTree) => {
  const endpointCategories = [];

  categoryTree.forEach(category => {
    if ( category.children ) {
      endpointCategories.push(...extractEndpointCategories(category.children));
    }
    else {
      endpointCategories.push(category);
    }
  });

  return endpointCategories;
}

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async productComparisonList(language) {
    const categoryTree = await strapi.services.category.categoryTree(language);

    // Granchildren categories
    const endpointCategories = await extractEndpointCategories(categoryTree);

    // Ensure categories are sorted by order
    endpointCategories.sort((catA, catB) => catA.order >= catB.order ? 1 : -1);

    const productsLists = await Promise.all((
      endpointCategories.map(async (category) => (
        {
          category,
          products: await strapi.services.product.find({
            categories: [ category.id ],
            website_tab: 'product_comparison',
            _limit: 5,
            _sort: 'position:ASC',
          })
        }
      ))
    ));

    // Apply affiliate links


    return productsLists;
  },

  async getProductDetails(productID, language) {
    if ( productID ) {
      const productDetails = await fetchProductDetails(productID, language);
      return productDetails;
    }

    return '';
  },

  async addProductClick(productID) {
    if ( !productID ) {
      return null;
    }

    const matchedProduct = await this.findOne({ id: productID });

    if ( !matchedProduct ) {
      return null;
    }

    // Increment clicks count
    const clicks_count = Number(matchedProduct.clicks_count) + 1;

    // Update product
    await this.update({ id: productID }, {
      clicks_count,
      updateScope: {
        price: false,
        amazonDetails: false,
      }
    });

    return {
      id: productID,
      clicks_count
    };
  },

  async fixProducts() {
    const allProducts = await this.find();
    const productsWithProblems = filterProductsWithProblems(allProducts);

    return await Promise.all(
      // Extract and set fixed data for each product
      productsWithProblems.map(product => {
        const productChanges = product.product_changes || [];

        // Sort from recent changes
        productChanges.sort((changeA, changeB) => changeA.date_time >= changeB.date_time ? -1 : 1);

        // Fix amazon_url
        if ( !isAmazonLink(product.amazon_url) ) {
          const changeWithAmazonURL = productChanges.find(({ state }) => state && isAmazonLink(state.amazon_url));
          // Apply old valid amazon url
          if ( changeWithAmazonURL ) {
            product.amazon_url = changeWithAmazonURL.state.amazon_url;
          }
        }
        // Fix url_list
        if ( !product.url_list || !product.url_list.length ) {
          const changeWithURLList = productChanges.find(({ state }) => (
            state && state.url_list && state.url_list.length
          ));
          // Apply old url list if any
          if ( changeWithURLList ) {
            product.url_list = changeWithURLList.state.url_list
          }
        }

        // Only apply updates to selected properties
        return {
          id: product.id,
          amazon_url: product.amazon_url,
          url_list: product.url_list,
        };
      })
      // Then, save all these updated products,
      // Returning the full data for each product
      .map(async productUpdates => {
        const { id, ...productData } = productUpdates;

        // Prevent lifecycle from scraping
        productData.updateScope = {
          price: false,
          amazonDetails: false,
        }

        const result = await this.update({ id }, productData );
        return result;
      })
    );
  }
};
