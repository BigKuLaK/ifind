export const getGrandchildrenCategories = (categories) => {
    const grandChildrenCategories = [];

    categories.forEach((category) => {
        if (category.children) {
            grandChildrenCategories.push(
                ...getGrandchildrenCategories(category.children)
            );
        }
        else {
            grandChildrenCategories.push(category);
        }
    });

    return grandChildrenCategories;
};