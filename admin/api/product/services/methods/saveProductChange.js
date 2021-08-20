const moment = require("moment");
const productChangeSettings = appRequire(
  "api/product-change/models/product-change.settings.json"
);
const defaultChangeType = productChangeSettings.attributes.change_type.default;
const { getState, resetProductChangeParams } = appRequire("helpers/redux");

/**
 * Creates a new ProductChange entry following a product's update
 * @param {ID} id
 * @param {String} changeType - create|update|admin_update|publish|trash|category_post_update
 * @returns void
 */
module.exports = async (id, changeType) => {
  const { productChange } = getState();
  const { productChangeParams } = productChange;

  const date_time = moment.utc().toISOString();
  const admin_user = productChangeParams.admin_user;
  const state =
    typeof productChangeParams.state === "string"
      ? productChangeParams.state
      : JSON.stringify(productChangeParams.state);
  let change_type = changeType || productChangeParams.change_type;

  // Reset productChangeParams
  resetProductChangeParams();

  // No need to save to history if there's no changes
  if (!state) {
    return;
  }

  // Determine change_type
  if (changeType !== "create") {
    if ("status" in state) {
      change_type = "publish";
    }
  }

  await strapi.query("product-change").create({
    state,
    date_time,
    admin_user,
    product: id,
    change_type,
  });
};
