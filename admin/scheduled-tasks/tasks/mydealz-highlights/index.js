const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { addURLParams, removeURLParams } = require("../../../helpers/url");
const createAmazonScraper = require("../../../helpers/amazon/amazonProductScraper");
const { scapeProduct } = require("../../../helpers/ebay/product-scaper");
const ebayLink = require("../../../helpers/ebay/ebayLink");
const amazonLink = require("../../../helpers/amazon/amazonLink");
const createStrapiInstance = require("../../../scripts/strapi-custom");
const dealTypesConfig = require("../../../api/ifind/deal-types");

const MYDEAL_DEAL_ID = Object.entries(dealTypesConfig).find(
  ([dealID, dealTypeConfig]) => /mydealz/i.test(dealTypeConfig.site)
)[0];
const MYDEALZ_URL = "https://www.mydealz.de";
const MAX_PRODUCTS = 50;

const PRODUCT_CARD_SELECTOR = ".cept-thread-item";
const PRODUCT_MERCHANT_SELECTOR = ".cept-merchant-name";
const PRODUCT_DEAL_LINK_SELECTOR = ".cept-dealBtn";
const axios = require('axios').default;


let ebaySource, germanRegion;

const MERCHANTS_NAME_PATTERN = {
  amazon: /^amazon$/i,
  ebay: /^ebay$/i,
};

(async () => {

  try {
    const strapiInstance = await createStrapiInstance();
    [ebaySource, germanRegion] = await Promise.all([
      strapi.services.source.findOne({ name_contains: "ebay" }),
      strapi.services.region.findOne({ code: "de" }),
    ]);
    console.log("Getting Ebay Wow Offers...");
    // const offers = await getEbayWowOffers();
    let scrapedProducts = null
    await axios.post("http://164.90.181.113:3000/mydealz/getMyDealsProduct").then(
      (response) => {
        scrapedProducts = response.data.data;
      },
      (error) => {
        console.log(error);
      }
    );

    // Remove old products
    console.info(`Removing old products...`.cyan);
    const deletedProducts = await strapiInstance.services.product.delete({
      deal_type: "mydealz_highlights",
    });
    console.info(`Deleted ${deletedProducts.length} products(s)`.cyan);

    // Save new products
    console.log("Saving new products...".green);

    let saved = 0;

    for (const productData of scrapedProducts) {
      const newData = productData;

      try {
        await strapi.services.product.create(newData);
        console.info(
          `[ ${++saved} of ${scrapedProducts.length} ] Successfully saved: ${
            newData.title.bold
          }`.green
        );
      } catch (err) {
        console.error(err.data);
      }
    }

    console.log(" DONE ".bgGreen.white.bold);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
