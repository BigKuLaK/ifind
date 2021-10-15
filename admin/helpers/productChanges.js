const { compareAttributeChanges } = require('./productAttribute');

/**
 * Compares original product data against changed product data,
 * @return {object} product data containing only changed properties
 */
const compareProductChanges = (originalData, changedData) => {
  // Get changes
  const changesList = Object.entries(changedData).filter(([formKey]) => {
    switch (formKey) {
      case 'categories':
        const originalCategories = originalData.categories || [];
        const changedCategories = changedData.categories || [];
        return (
          (originalCategories.length !== changedCategories.length) ||
          (
            (originalCategories[0].id && changedCategories[0]) &&
            originalCategories[0].id != changedCategories[0]
          )
        );
      case 'url_list':
        const originalUrlList = originalData.url_list || [];
        const changedUrlList = changedData.url_list || [];
        return (
          // Check if urls count is changed
          (originalUrlList.length !== changedUrlList.length)
          // Check if all items are the same
          || (
            changedUrlList.some((changedURLData, index) => {
              const originalURLData = originalUrlList[index];
              return (
                originalURLData.price != changedURLData.price ||
                originalURLData.region.id != changedURLData.region ||
                originalURLData.source.id != changedURLData.source ||
                originalURLData.url != changedURLData.url
              )
            })
          )
        );
      case 'attrs_rating':
          const originalAttrsRating = originalData.attrs_rating || [];
          const changedAttrsRating = changedData.attrs_rating || [];

          return (
            // Check if count has changed
            (originalAttrsRating.length !== changedAttrsRating.length) ||
            // Check if each item has changed
            (
              originalAttrsRating.some(originalAttrRating => {
                const matchedChangedRating = changedAttrsRating.find(({ id }) => id == originalAttrRating.id);

                // Attribute must have been removed on change
                if ( !matchedChangedRating ) { return true; }
                return compareAttributeChanges(originalAttrRating, matchedChangedRating);
              })
            )
          )
      case 'title':
      case 'website_tab':
      case 'price':
      case 'image':
      case 'amazon_url':
      case 'position':
      case 'final_rating':
      case 'details_html':
      case 'clicks_count':
      case 'status':
        return changedData[formKey] != originalData[formKey];
      default:;
    }

    return false;
  });

  const changes = changesList.length ? (
    changesList.reduce((changesObj, [ key, value ]) => {
      changesObj[key] = value;
      return changesObj;
    }, {})
  ) : null;

  return changes;
}

module.exports = {
  compareProductChanges
};
