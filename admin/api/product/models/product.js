'use strict';

const { removeURLParams, amazonLink } = appRequire('helpers/url');
const { getProductDetails } = appRequire('helpers/product');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processProductData = async (data, id) => {
  await Promise.all([

    // Remove unnecessary params in the url
    (() => {
      if ( data && data.url_list && data.url_list.length ) {
        data.url_list = data.url_list.map(urlData => {
          urlData.url = removeURLParams(urlData.url);
          return urlData;
        });
      }
    })(),

    // Add dynamic position if not yet given
    (async() => {
      if ( !data.position ) {
        const productsWithPositions = await strapi.services.product.find({
          position_gt: 0,
          id_ne: id,
          categories_contains: Array.isArray(data.categories) && data.categories.length
                                ? data.categories[0] : null
        });

        const takenPositions = productsWithPositions.map(data => data.position);
        let positionToTake = 1;

        // Determine available position
        while ( takenPositions.includes(positionToTake) ) {
          positionToTake++;
        }

        data.position = positionToTake;
      }
    })(),

    // Scrape other fields
    (async() => {
      const productDetails = await getProductDetails(data.amazon_url, 'de');

      if ( productDetails ) {
        data.title = productDetails.title.trim();
        data.details_html = productDetails.details_html.trim();
        data.price = productDetails.price;
        data.image = productDetails.image;
      }
    })(),

    // Add Affiliate links
    (async() => {
      data.amazon_url = amazonLink(data.amazon_url);
    })(),
  ]);

  return data;
};

/**
 * TODO:
 * Figure out how to get updatedBy
 */
const saveProductChange = async (id, productData, datetime, updatedBy) => {
  await strapi.query('product-change').create({
    state: productData,
    date_time: datetime,
    product: id,
  });
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processProductData(data);
    },
    async beforeUpdate(params, data) {
      await processProductData(data, params.id);
    },
    async afterCreate(result, data) {
      await saveProductChange(result.id, data, result.created_at, result.created_by);
    },
    async afterUpdate(result, params, data) {
      await saveProductChange(result.id, data, result.updated_at, result.updated_by);
    }
  }
};
