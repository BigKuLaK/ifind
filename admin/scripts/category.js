const args = require("minimist")(process.argv.slice(2));
const strapi = require("./strapi-custom");
const createCommands = require("./_createCommands");

createCommands({
  'update-ascendants': async (strapiInstance) => {
    const categories = await strapiInstance.services.category.find({
      _limit: 9999,
    });

    strapi.categoryChangeUpdateProducts = false;
    strapi.categoryChangeUpdateAttributes = false;

    console.log(`Updating ascendants for ${categories.length} categories`.cyan);

    const categoriesWithUpdatedAscendants = categories.map(category => {
      // Clear current ascendants
      category.ascendants = [];

      // Walk through the ascendants
      let currentNode = category;
      while ( currentNode && currentNode.parent ) {
        category.ascendants.unshift(currentNode.parent.id);
        currentNode = categories.find(category => category.id == currentNode.parent.id);
      }

      return category;
    });

    let i = 0;
    for ( let category of categoriesWithUpdatedAscendants ) {
      try {
        await strapiInstance.services.category.update({
          id: category.id,
        }, {
          ascendants: category.ascendants,
        });
        console.log(`Updated ${i + 1} of ${categoriesWithUpdatedAscendants.length} [${category.id}] ${category.label_preview}`.green);
      } catch (err) {
        console.log(`Error while updating [${category.id}]:`, err);
      }

      i++;
    }

    console.log(` DONE `.bgGreen.white.bold);
  },

  "update-labels-json": async (strapiInstance) => {
    const categories = await strapiInstance.services.category.find({
      limit: 9999
    });

    strapi.categoryChangeUpdateProducts = false;
    strapi.categoryChangeUpdateAttributes = false;

    // update each category
    await Promise.all(
      categories.map(async (category) => {
        await strapiInstance.query("category").update(
          { id: category.id },
          {
            label_translations_json: JSON.stringify(category.label),
          }
        );
        console.log(
          `Updated labels for category: [${category.id}] ${category.label_preview}`
        );
      })
    );
  },

  "update-products-count": async (strapiInstance) => {
    console.log("Updating product counts for categories...".cyan);
    const updatedCategories =
      await strapiInstance.services.category.updateProductCounts();
    console.log(
      ` Updated ${updatedCategories.length} categories! `.bgGreen.white.bold
    );
    process.exit();
  }

});
