const dealTypes = appRequire('api/ifind/deal-types');

module.exports = async () => {
  const sources = await strapi.services.source.find();

  const productsByDeals = await Promise.all(
    Object.entries(dealTypes).map(async ([dealTypeKey, { site, label }]) => {
      const products = await strapi.services.product.find({
        deal_type: dealTypeKey,
        _limit: 20,
        _sort: "id:DESC",
      });

      const source = sources.find(({ name }) => (new RegExp(site, 'i')).test(name));

      return {
        deal_type: {
          name: dealTypeKey,
          label,
          source,
        },
        products,
      };
    })
  );

  return productsByDeals;
};
