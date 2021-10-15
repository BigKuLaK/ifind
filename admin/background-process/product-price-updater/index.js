require("colors");
const path = require("path");

require("../../helpers/customGlobals");

const adminStrapi = appRequire("scripts/strapi-custom");
const { isAmazonLink, scrapeAmazonProduct } = appRequire("helpers/amazon");
const { getDetailsFromURL: getDetailsFromEbayURL } = appRequire("helpers/ebay");
const { getDetailsFromURL: getDetailsFromAliExppressURL } =
  appRequire("helpers/aliexpress");

const BackgroundProcess = require("../_lib/BackgroundProcess");

const RUNNING_STATUS = Symbol();

class ProductPriceUpdater extends BackgroundProcess {
  constructor() {
    super({
      baseDir: path.resolve(__dirname),
    });

    this[RUNNING_STATUS] = false;
  }

  onSwitchStart() {
    if (this[RUNNING_STATUS]) {
      return;
    }

    this.logger.log("Starting Price Updater");

    this[RUNNING_STATUS] = true;

    new Promise((resolve, reject) => {
      return this.updatePrices().then(resolve).catch(reject);
    }).catch((err) => {
      console.log("Validator start error", err);
    });
  }

  onSwitchStop() {
    // Stop validator
    if (this.running) {
      this.cancel();
    } else {
      this.stop();
    }
  }

  onSwitchError() {
    // Stop validator
    this.stop();
  }

  cancel() {
    this.emit("cancel");
  }

  stop() {
    this.logger.log("Stopping Price Updater");

    if (this[RUNNING_STATUS]) {
      this[RUNNING_STATUS] = false;
      this.emit("stop");
    }
  }

  handleError(err) {
    if (err.message === "cancel") {
      if (this.running) {
        this.logger.log("Price Updater Cancelled");
      }
      this.stop();
    } else {
      this.logger.log(
        `${err.message} ${`STACK`.black.bold} ==> ${err.stack.gray}`,
        "ERROR"
      );
      this.switch.error();
    }
  }

  get running() {
    return this[RUNNING_STATUS];
  }

  async updatePrices() {
    new Promise(this.startCancellableUpdater.bind(this)).catch(
      this.handleError.bind(this)
    );
  }

  async startCancellableUpdater(resolve, reject) {
    this.on("cancel", () => {
      // Throw an error in order to cancel current validation process
      reject(new Error("cancel"));
    });

    const strapi = await adminStrapi();

    const queryParams = {
      _limit: 9999,
      _sort: "id:desc",
    };

    const sources = await strapi.services.source.find();
    const foundProducts = await strapi.services.product.find(queryParams);

    // Sources
    const ebaySource = sources.find(({ name }) => /ebay/i.test(name));
    const aliexpressSource = sources.find(({ name }) => /ali/i.test(name));

    this.logger.log(
      `Running price updater on ${foundProducts.length} product(s)...`.cyan
    );

    for (let i = 0; i < foundProducts.length && this.running; i++) {
      const product = foundProducts[i];
      const productUpdates = {};

      this.logger.log(
        `[ ${i + 1} of ${foundProducts.length} ]`.cyan.bold +
          ` Updating - [${String(product.id).bold}] ${product.title}`
      );

      // Scrape amazon price
      if (!isAmazonLink(product.amazon_url)) {
        console.error(
          `Invalid amazon url for [ ${product.id} ] - ${product.title}`
        );
      } else {
        try {
          const scrapedDetails = await scrapeAmazonProduct(
            product.amazon_url,
            "en",
            true
          );

          if (scrapedDetails && scrapedDetails.price) {
            productUpdates.price = Number(scrapedDetails.price);
          }
        } catch (err) {
          this.logger.log(err.stack, "ERROR");
        }
      }

      // Scrape price for other URLs
      if (product.url_list && product.url_list.length) {
        productUpdates.url_list = [];

        for (const urlData of product.url_list) {
          // Get old data
          const urlDataUpdate = {
            id: urlData.id,
            source: urlData.source.id,
            price: urlData.price,
          };

          switch (urlData.source.id) {
            // Get Ebay Price
            case ebaySource.id:
              const ebayDetails = await getDetailsFromEbayURL(urlData.url);

              if ( ebayDetails && ebayDetails.price ) {
                urlDataUpdate.price = Number(ebayDetails.price);
              }
              break;

            // Get AliExpress Price
            case aliexpressSource.id:
              try {
                const aliExpressDetails = await getDetailsFromAliExppressURL(
                  urlData.url
                );
                if ( aliExpressDetails && aliExpressDetails.price ) {
                  urlDataUpdate.price = Number(aliExpressDetails.price);
                }
              } catch (err) {
                this.logger.log('AliEpress error: Product link is non-affiliate'.red, 'ERROR');
              }
              break;
          }

          productUpdates.url_list.push(urlDataUpdate);
        }
      }

      // Save amazon price update as well as url_list updates
      await strapi.services.product.updateProduct(
        product.id,
        productUpdates,
        { price: false, amazonDetails: false },
        { change_type: "price_updater_results" }
      );

      this.logger.log(" DONE ".bold.green);

    }

    this.logger.log(" DONE ".bgGreen.white.bold);
    this.switch.stop();
  }
}

ProductPriceUpdater.backgroundProcessName = "Product Price Updater";

const productPriceUpdater = new ProductPriceUpdater();

module.exports = productPriceUpdater;
