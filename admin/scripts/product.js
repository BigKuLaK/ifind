const createCommands = require("./_createCommands");

createCommands({
  // Runs products publisher
  "publish-products": async (strapiInstance, args) => {
    console.log("Publishing products...".cyan);
    const publishedProducts = await strapiInstance.services.product.publishProducts(
      args.force ? true : false
    );
    console.log(` Published ${publishedProducts.length} products `.bgGreen.white.bold);
  },

  // Runs products fixer
  "fix-products": async (strapiInstance, args) => {
    console.log("Fixing products...".cyan);
    const fixedProducts = await strapiInstance.services.product.fixProducts(
      args.force ? true : false
    );
    console.log(` Fixed ${fixedProducts.length} products `.bgGreen.white.bold);
  },

  // Converts categories into category, following the update for Product schema
  "singularify-categories": async (strapiInstance) => {
    const products = await strapiInstance.services.product.find({
      _limit: 9999,
    });
    const totalProducts = products.length;
    let updatedCount = 0;

    // update each product
    for (const product of products) {
      try {
        await strapiInstance.query("product").update(
          { id: product.id },
          {
            category_temp: product.categories[0]
              ? product.categories[0].id
              : null,
          }
        );
        console.log(
          `[${++updatedCount} of ${totalProducts}] Updated category for product: [${
            product.id
          }] ${product.title}`.green
        );
      } catch (err) {
        console.error(
          err.message,
          `[${++updatedCount}} of ${totalProducts}] [${product.id}] ${
            product.title
          }`.red
        );
      }
    }

    console.log(" DONE ".bgGreen.white.bold);
  },

  // Assigns product.category_temp value into product.category following updates for Product schema
  "reference-category": async (strapiInstance) => {
    const products = await strapiInstance.services.product.find({
      _limit: 9999,
    });
    const totalProducts = products.length;
    let updatedCount = 0;

    // update each product
    for (const product of products) {
      try {
        await strapiInstance.query("product").update(
          { id: product.id },
          {
            category: product.category_temp || null,
          }
        );
        console.log(
          `[${++updatedCount} of ${totalProducts}] Updated category for product: [${
            product.id
          }] ${product.title}`.green
        );
      } catch (err) {
        console.error(
          err.message,
          `[${++updatedCount}} of ${totalProducts}] [${product.id}] ${
            product.title
          }`.red
        );
      }
    }

    console.log(" DONE ".bgGreen.white.bold);
  },
});
