/**
 * This file is not part of original Strapi structure.
 * This is only to expose some modules that will be
 * needed by other external modules, such as the product-validator module
 */
require('./helpers/customGlobals');

module.exports = {

  /**
   * Expose Admin's Strapi instance loader
   */
  adminStrapi: require('./scripts/strapi-custom'),

  /**
   * Expose admin helpers
   */
  adminRequire: (adminRelativePath = '') => appRequire(adminRelativePath),

};
