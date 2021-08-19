const moment = require('moment');
const { compareProductChanges } = appRequire("helpers/productChanges");
const { getProductDetails } = appRequire("helpers/product");
const { applyCustomFormula } = appRequire("helpers/productAttribute");

const updateScopeDefault = {
  price: true,
  amazonDetails: true,
};

/**
 * Preprocesses product data from request, before create/save
 * @param {Product} data - Raw Product data from request
 * @param {ID} id
 * @returns {Product}
 */
module.exports = async (data, id) => {
  // Save admin_user for afterSave hook
  strapi.admin_user = data.admin_user;

  const matchedProduct = (await strapi.services.product.findOne({ id })) || {};

  // Set product update scope
  data.updateScope = {
    ...updateScopeDefault,
    ...data.updateScope,
  };

  // No need for additional scraped data if no price and details update needed
  // Use case: clicks_count update only
  if (!data.updateScope.price || !data.updateScope.amazonDetails) {
    return data;
  }

  const [productAttributes] = await Promise.all([
    strapi.services["product-attribute"].find(),
  ]);

  await Promise.all([
    // Add dynamic position if not yet given
    (async () => {
      if (!data.position) {
        const productsWithPositions = await strapi.services.product.find({
          position_gt: 0,
          id_ne: id,
          categories_contains:
            Array.isArray(data.categories) && data.categories.length
              ? data.categories[0]
              : null,
        });

        const takenPositions = productsWithPositions.map(
          (data) => data.position
        );
        let positionToTake = 1;

        // Determine available position
        while (takenPositions.includes(positionToTake)) {
          positionToTake++;
        }

        data.position = positionToTake;
      }
    })(),

    // Scrape other fields
    (async () => {
      // Using only image and title for checking
      // For some reason, details_html is not passed on update
      // TODO: Add admin UI option to select either priceOnly, amazonDetails, both or neither
      const scapePriceOnly = data.title && data.image && true;

      const productDetails = await getProductDetails(
        data,
        "de",
        scapePriceOnly
      );

      // Apply scraped data
      if (productDetails) {
        Object.entries(productDetails).forEach(([key, value]) => {
          data[key] = value;
        });
        // Temporary data
        data.releaseDate = productDetails.releaseDate;
      }
    })(),
  ]);

  // Recompute product attributes
  // Needs to come after the scraper in order to pickup the scraped data
  data.attrs_rating = (data.attrs_rating || []).map((attrRating) => {
    const matchedProductAttribute = productAttributes.find(
      ({ id }) => attrRating.product_attribute == id
    );

    if (matchedProductAttribute) {
      // Autofill release date if applicable
      if (/release/i.test(matchedProductAttribute.name) && data.releaseDate) {
        attrRating.use_custom_formula = true;
        attrRating.min = data.releaseDate;
        attrRating.max = moment.utc().subtract(3, "years").toISOString();
      }

      if (attrRating.use_custom_formula) {
        attrRating.rating = applyCustomFormula(
          attrRating,
          matchedProductAttribute,
          data
        );
      }
    }

    return attrRating;
  });

  // Remove temporary data
  delete data.updateScope;
  delete data.releaseDate;

  // Extract only changed data
  const changedData = compareProductChanges(matchedProduct, data);

  // Save temporary data for afterSave use
  strapi.productChangedData = changedData;

  return changedData;
};
