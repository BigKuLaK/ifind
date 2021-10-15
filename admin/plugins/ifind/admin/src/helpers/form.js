/**
  USAGE

  const rules = {
    title: validationRules.required('Please provide a title'),
    price: [
      validationRules.number('Please provide a number'),
      validationRules.greaterThan(0)('Price must be more than 0'),
    ]
  }
 */
export const validationRules = {
  required: (message) => (value) => (
    (
      !Boolean(value) || (Array.isArray(value) && !value.length)
    ) && (message || 'Field is required')
  ),
  number: (message) => (value) => (
    // isNaN(null) returns true, so String(value) is needed
    isNaN(String(value)) && (message || 'Field must be a number')
  ),
  greaterThan: (threshold = 0, message) => (value = 0) => (
    Number(value) <= Number(threshold) && (message || `Field must be greater than ${threshold}`)
  ),
  oneOf: (options = [], message) => (value) => (
    !(Array.isArray(options) && options.includes(value)) && (message || 'Field must be one of the options')
  ),
  url: (message) => (value = '') => (
    !(/^https?:\/\/.+/.test(String(value))) && (message || 'Field must be a URL')
  ),

  // Allows one error message for multiple rules
  set: (rules = [], message) => value => rules.some(rule => rule(value)) && (message || 'Field does not meet validation rules.')
};

/**
  USAGE

  const validationResult = validateData(productData, rules)

  @param {object} data - the data to check against
  @param {object} validationRules - Rules defined using validationRules above
 */
export const validateData = (data, validationRules = {}) => {
  const validationErrors = {};

  Object.entries(validationRules).forEach(([ field, rules ]) => {
    const ruleCheckers = Array.isArray(rules) ? rules : [ rules ];

    const fieldErrors = ruleCheckers.map(ruleChecker => (
      ruleChecker(data[field])
    )).filter(Boolean);

    if ( fieldErrors.length ) {
      validationErrors[field] = fieldErrors;
    }
  });

  return {
    success: Object.keys(validationErrors).length ? false : true,
    errors: validationErrors,
  };
};