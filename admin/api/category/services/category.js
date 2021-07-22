'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */


const processCategory = async (rawCategory, language = null) => {
  /**
  Process label

  Label logic:
    1. If there is/are label entries
      1.1. If language is given, get label with matching language
      1.2 Get english label
      1.3 Get first label
    2. Use empty label
   */
  rawCategory.label = rawCategory.label ?
    rawCategory.label.find(label => language && label.language && label.language.code === language.code)
    || rawCategory.label.find(label => label.language && label.language.code === 'en')
    || rawCategory.label[0]
    : '';

  const processedCategory = await strapi.services.category.prepopulateProductAttributes(rawCategory);

  return processedCategory;
};


module.exports = {
  async categoryTree(language = null) {
    // Will use to select label for categories
    const matchedLanguage = await strapi.services.language.findOne({
      code: language,
    });

    // Get categories sorted by order
    // ensures children are in order
    const matchedCategories = await this.find({
      _sort: 'order:ASC',
      _limit: 1000,
    }) || [];

    // Build categoryTree object
    const categoryTree = {};
    const byId = matchedCategories.reduce(( all, category) => ({
      ...all,
      [category.id]: category,
    }), {});

    await Promise.all(matchedCategories.map(async (category) => {

      const processedCategory = await processCategory(category, matchedLanguage);

      // Check if category has existing parent
      if ( processedCategory.parent && processedCategory.parent.id in byId ) {
        // Append to the parent's children
        byId[processedCategory.parent.id].children = byId[processedCategory.parent.id].children || [];
        byId[processedCategory.parent.id].children.push(processedCategory);
      }
      // Treat this category as a root
      else {
        categoryTree[category.id] = processedCategory;
        processedCategory.depth = 0;
        // Remove non-existing parent prop to avoid confusion
        delete processedCategory.parent;
      }
    }));

    // Convert categoryTree into array
    const categoryTreeArray = Object.values(categoryTree);

    // Re-sort root categories
    categoryTreeArray.sort((catA, catB) => catA.order >= catB.order ? 1 : -1);

    return categoryTreeArray;
  },

  async prepopulateProductAttributes(category) {
    // Get product attributes
    const productAttributes = await strapi.services['product-attribute'].getCommon();

    // Map to existing category's product_attributes settings
    const catProdAttrsList = productAttributes.map(productAttribute => {
      const matchedCatAttr = category.product_attrs.find(({ product_attribute }) => (
        productAttribute.id === (product_attribute && product_attribute.id)
      ));

      // Update existing
      if ( matchedCatAttr ) {
        return {
          id: matchedCatAttr.id,
          product_attribute: productAttribute,
          label_preview: `${productAttribute.name} (${matchedCatAttr.factor})`,
          factor: matchedCatAttr.factor,
        }
      }
      // Add new
      else {
        return {
          product_attribute: productAttribute,
          label_preview: `${productAttribute.name} (1)`,
          factor: 1,
        };
      }
    });

    // Sort according to factor in descending order
    catProdAttrsList.sort((attrA, attrB) => (
      attrA.factor > attrB.factor ? -1 : 1
    ));

    // // Replace with updated attributes
    category.product_attrs = catProdAttrsList;

    return category;
  }
};
