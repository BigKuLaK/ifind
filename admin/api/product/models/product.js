'use strict';

const { amazonLink, ebayLink } = appRequire('helpers/url');
const { getProductDetails } = appRequire('helpers/product');
const { applyCustomFormula } = appRequire('helpers/productAttribute');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processProductData = async (data, id) => {
  const [
    ebaySource,
    productAttributes,
  ] = await Promise.all([
    strapi.services.source.findOne({
      name_contains: 'ebay'
    }),
    strapi.services['product-attribute'].find(),
  ]);

  await Promise.all([

    // Add necessary params in the url
    (() => {
      if ( data && data.url_list && data.url_list.length ) {
        data.url_list = data.url_list.map(urlData => {
          if ( ebaySource && ebaySource.id && urlData.source == ebaySource.id ) {
            urlData.url = ebayLink(urlData.url);
          }

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
      // Using only image and title for checking
      // For some reason, details_html is not passed on update
      const scapePriceOnly = data.title && data.image && true;
      const productDetails = await getProductDetails(data, 'de', scapePriceOnly);

      if ( productDetails ) {
        data.title = productDetails.title ? productDetails.title.trim() : data.title;
        data.details_html = productDetails.details_html ? productDetails.details_html.trim() : data.details_html;
        data.price = productDetails.price ? productDetails.price : data.price;
        data.image = productDetails.image ? productDetails.image : data.image;
        data.url_list = productDetails.url_list ? productDetails.url_list : data.url_list;
      }
    })(),

    // Add Affiliate links
    (async() => {
      data.amazon_url = amazonLink(data.amazon_url);
    })(),
  ]);

  // Recompute product attributes
  // Needs to come after the scraper in order to pickup the scraped data
  data.attrs_rating = data.attrs_rating.map(attrRating => {
    if ( attrRating.use_custom_formula ) {
      const matchedProductAttribute = productAttributes.find(({ id }) => (
        attrRating.product_attribute == id
      ));

      attrRating.rating = applyCustomFormula(
        attrRating,
        matchedProductAttribute,
        data,
      )
    }

    return attrRating;
  });

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
