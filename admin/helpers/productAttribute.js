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

  console.log({ custom_formula });

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
  const computedRating = eval(formulaWithData);

  // Ensure rating is >= 0 and <= 10
  if ( computedRating <= 0 ) {
    return 0;
  }
  else if ( computedRating >= 10 ) {
    return 10
  }

  return computedRating;
}

module.exports = {
  applyCustomFormula
};
