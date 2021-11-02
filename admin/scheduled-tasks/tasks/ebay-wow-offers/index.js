const createStrapiInstance = require("../../../scripts/strapi-custom");
const getEbayWowOffers = require("../../../helpers/ebay/wow-offers");
const ebayLink = require("../../../helpers/ebay/ebayLink");

const EBAY_DEAL_TYPE = "ebay_wow_offers";

(async () => {
  try {
    console.log("Getting Ebay Wow Offers...");
    const offers = await getEbayWowOffers();

    const strapi = await createStrapiInstance();
    const [ebaySource, germanRegion] = await Promise.all([
      strapi.services.source.findOne({ name_contains: "ebay" }),
      strapi.services.region.findOne({ code: "de" }),
    ]);

    // Remove old products
    console.log("Removing old products...".green);
    const deletedProducts = await strapi.services.product.delete({
      deal_type: EBAY_DEAL_TYPE,
    });
    console.log(`Deleted ${deletedProducts.length} product(s).`.cyan);

    console.log("Saving new products...");
    let savedProducts = 0;

    for (const offer of offers) {
      // Add strapi-specific data
      const newProduct = {
        website_tab: 'home',
        deal_type: EBAY_DEAL_TYPE,
        title: offer.title,
        image: offer.image,
        url_list: [
          {
            source: ebaySource.id,
            region: germanRegion.id,
            url: ebayLink(offer.url),
            price: offer.price,
            price_original: offer.price_original,
            discount_percent: offer.discount_percent,
            quantity_total: offer.quantity_total,
            quantity_available: offer.quantity_total - offer.quantity_sold,
          },
        ],
      };

      await strapi.services.product.create(newProduct);
      console.log(
        `[ ${++savedProducts} of ${offers.length} ] Saved new product: ${
          newProduct.title
        }`.green
      );
    }

    console.log(" DONE ".bgGreen.white.bold);
    process.exit();
  } catch (err) {
    console.error(err, err.data);
    process.exit();
  }
})();