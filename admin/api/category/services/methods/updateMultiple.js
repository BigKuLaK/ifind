/**
 * Batch-updates multiple categories
 * @param {[CategoryInput]} categoriesInput
 * @returns {[Category]}
 */
module.exports = async (categoriesInput) => {
  const CategoryModel = await strapi.query("category").model;
  const updateDataList = categoriesInput.map(({ where, data }) => ({
    id: where.id,
    ...data,
  }));

  // Update each category
  // Bookshelf guide: https://bookshelfjs.org/api.html#Model-instance-save
  const updatedCategories = await Promise.all(
    updateDataList.map(async (newCategoryData) =>
      (await CategoryModel.forge(newCategoryData).save()).serialize()
    )
  );

  return updatedCategories;
};
