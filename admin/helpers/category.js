/**
 * Retrieves target language label from a list of translated labels
 * @param {[ComponentTranslatableLabel]} categoryLabels - The translatable labels component items
 * @param {String} language - The target language code
 * @returns String
 */
const getTranslatedLabel = async (categoryLabels, language = "en") => {
  const [targetLanguage, englishLanguage] = await Promise.all([
    strapi.services.language.findOne({ code: language }),
    strapi.services.language.findOne({ code: "en" }),
  ]);

  const matchedLabel =
    categoryLabels.find(({ language }) => language.id === targetLanguage.id) ||
    categoryLabels.find(({ language }) => language.id === englishLanguage.id) ||
    categoryLabels[0];

  return matchedLabel ? matchedLabel.label : "";
};

/**
 * Updates products_count value for a given category
 * @param {ID} categoryID
 * @returns void
 */
const updateCategoryProductsCount = async (categoryID) => {
  const matchedCategory = await strapi.services.category.findOne({
    id: categoryID,
  });

  if (!matchedCategory) {
    return;
  }

  const products_count = matchedCategory.products.length;

  await strapi.services.category.update(
    { id: matchedCategory.id },
    { products_count }
  );
};

module.exports = {
  getTranslatedLabel,
  updateCategoryProductsCount,
};
