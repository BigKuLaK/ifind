const moment = require('moment');

const daysAgo = (dateTimeUTC = '') => {
  const today = moment.utc();
  const millisecondsAgo = today.valueOf() - moment.utc(dateTimeUTC).valueOf();
  const _daysAgo = Math.floor(millisecondsAgo / 1000 / 60 / 60 / 24);
  return !isNaN(_daysAgo) ? _daysAgo : 0;
}

/**
 * Computes for a product attribute rating using a custom formula
 * @param {object} ratingData - {min, max}
 * @param {object} attributeData - ProductAttribute data
 * @param {object} productData - The product data
 * @returns number
 */
 const applyCustomFormula = (
    ratingData = {},
    attributeData = {},
    productData = {},
  ) => {

  let { min, max } = ratingData;
  const { custom_formula, data_type } = attributeData;
  let value = attributeData.product_prop && attributeData.product_prop !== 'none' ?
                productData[attributeData.product_prop] || null :
                null;

  if ( !custom_formula ) {
    return 0;
  }

  // If attribute maps to a product field,
  // The corresponding product field must have a value
  // Otherwise just return 0 rating
  if ( attributeData.product_prop && attributeData.product_prop !== 'none' && !value ) {
    return 0;
  }

  // For date_time data type,
  // Convert into number of days from today
  if ( data_type === 'date_time' ) {
    min = min ? daysAgo(min) : min;
    max = max ? daysAgo(max) : max;
    value = value ? daysAgo(value) : value;
  }

  // Substitute custom_formula
  const formulaWithData = Object.entries({ min, max, value }).reduce((updatedFormula, [ key, data ]) => (
    updatedFormula.replace(new RegExp(key, 'g'), data)
  ), custom_formula);

  // Evaluate substituted custom_formula string
  let computedRating = 0;
  try {
    computedRating = eval(formulaWithData);
  } catch (err) {
    throw new Error(`Error in custom formula for ${attributeData.name}: ${err.message}`);
  }

  // Ensure rating is >= 0 and <= 10 and is not NaN
  if ( isNaN(computedRating) || computedRating <= 0 ) {
    return 0;
  }
  else if ( computedRating >= 10 ) {
    return 10
  }

  // Round to a single decimal place.
  return Number(computedRating.toFixed(1));
}

const compareAttributeChanges = (originalAttribute, changedAtrribute) => {
  const hasChanges = Object.entries(changedAtrribute).some(([objectKey]) => {
    switch (objectKey) {
      case 'min':
      case 'max':
        // Min/Max for release is autopopulated, so check if custom_formula is used
        if ( /release/i.test(originalAttribute.product_attribute.name) ) {
          return changedAtrribute.use_custom_formula !== originalAttribute.use_custom_formula;
        }
        // Else, just normally check for changes
        return changedAtrribute[objectKey] != originalAttribute[objectKey];
      case 'enabled':
      case 'factor':
      case 'points':
      case 'rating':
      case 'use_custom_formula':
        return changedAtrribute[objectKey] != originalAttribute[objectKey];
      default :;
        return false;
    }
  });

  const attrChanges = hasChanges ? changedAtrribute : null;

  return attrChanges;
}


module.exports = {
  applyCustomFormula,
  compareAttributeChanges,
};
