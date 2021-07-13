'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const processCategoryData = async data => {
  const productAttributes = await strapi.services['product-attribute'].getCommon();

  if ( data.label && data.label.length ) {
    const englishLanguage = await strapi.services.language.findOne({ code: 'en' });
    const englishLabel = data.label.find(label => label.language == englishLanguage.id);
    const selectedLabel = englishLabel || data.label[0];
    data.label_preview = selectedLabel.label;
  }

  if ( data.product_attrs && data.product_attrs.length ) {
    data.product_attrs.forEach(catProductAttr => {
      const matchedProductAttr = productAttributes.find(({ id }) => id === catProductAttr.product_attribute);
      catProductAttr.label_preview = `${matchedProductAttr.name} (${catProductAttr.factor})`
    });
  }
}

const afterSave = async (data) => {
  const totalAttrsPoints = data.product_attrs.reduce((sum, attrData) => (
    sum + (attrData.factor * 10)
  ), 0);

  // Update ratings for related products
  Promise.all(data.products.map(async (productData) => {
    let totalProductPoints = 0;

    const updatedProductAttrs = productData.attrs_rating.map(attrRating => {
      const matchedAttribute = data.product_attrs.find(({ product_attribute }) => (
        product_attribute.id === attrRating.product_attribute.id
      ));

      const newPoints = matchedAttribute.factor * attrRating.rating;
      totalProductPoints += newPoints;

      return {
        id: attrRating.id,
        points: newPoints,
        factor: matchedAttribute.factor,
      };
    });

    const final_rating = totalProductPoints / totalAttrsPoints * 10;

    // Save product
    await strapi.query('product').update({ id: productData.id }, {
      attrs_rating: updatedProductAttrs,
      final_rating,
    });
  }));
}

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      await processCategoryData(data);
    },
    async beforeUpdate(params, data) {
      await processCategoryData(data);
    },
    async afterFindOne(result, params, populate) {
      return await strapi.services.category.prepopulateProductAttributes(result);
    },
    async afterCreate(result) {
      // Consider update ratings computations for each related products
      afterSave(result);
    },
    async afterUpdate(result, params, data) {
      // Consider update ratings computations for each related products
      afterSave(result);
    }
  }
};
