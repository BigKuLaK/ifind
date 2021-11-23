/* TODO: Remove scrapeAmazonProduct once this is implemented */
require('colors');
const moment = require('moment')
const createTorProxy = require('../tor-proxy');
const screenshotPageError = require('./screenshotPageError');
const { addURLParams } = require("../url");

const TOR_PROXY = createTorProxy();

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PRICE_SELECTOR = [
  "#dealsAccordionRow .a-color-price",
  "#apex_offerDisplay_desktop .a-text-price .a-offscreen",
  "#corePrice_desktop .a-price",
  "#corePrice_feature_div .a-text-price",
  "#price_inside_buybox",
  "#priceblock_dealprice",
  "#priceblock_ourprice",
  '[data-action="show-all-offers-display"] .a-color-price',
  "#usedOnlyBuybox .offer-price",
  "#olp_feature_div .a-color-price",
].join(",");
const ORIGINAL_PRICE_SELECTOR =
  '#corePrice_desktop .a-text-price[data-a-color="secondary"] > :first-child';
const DISCOUNT_SELECTOR = "#corePrice_feature_div";
const QUANTITY_AVAILABLE_PERCENT_SELECTOR = '[id^="dealStatusPercentage_"]';
const QUANTITY_AVAILABLE_DESCRIPTOR_SELECTOR = "#availability";

const imageSelector = "#landingImage[data-a-dynamic-image]";
const titleSelector = "#title";
const additionalInfoTableSelector = "#productDetails_detailBullets_sections1";
const detailsListSelector = "#detailBullets_feature_div";

const detailSelector = "#centerCol";
const selectorsToRemove = [
  "#title",
  "#mars-pav-widget",
  "#desktop_unifiedPrice",
  "#unifiedPrice_feature_div",
  "#averageCustomerReviews_feature_div",
  "#ask_feature_div",
  '#variation_configuration [role="radiogroup"]',
  '#variation_style_name [role="radiogroup"]',
  '#variation_color_name [role="radiogroup"]',
  "#productSupportAndReturnPolicy_feature_div",
  "#poToggleButton",
  "#alternativeOfferEligibilityMessaging_feature_div",
  "#valuePick_feature_div",
  "#olp_feature_div",
  "#seeMoreDetailsLink",
  "#HLCXComparisonJumplink_feature_div",
  ".caretnext",
  "#productAlert_feature_div",
  "#atfCenter16_feature_div",
  "style",
  "script",
  "#twister-plus-inline-twister-card",
  "#HLCXComparisonJumplink_feature_div",
];

class AmazonProductScraper {
  constructor() {
    this.createPageInstance();
  }

  /* Creates a new instance  */
  static async create() {
    return new AmazonProductScraper();
  }

  /* Creates a new instance of Puppeteer.Page and saves locally */
  async createPageInstance() {
    this.page = await TOR_PROXY.newPage();
  }

  /**
   * Scrapes details/price for a given product URL
   * @param {string} productURL
   * @param {string} language - The base language from where the other details will be scraped
   * @param {boolean} scrapePriceOnly - Whether to scrape price only or include other details
   */
  async scrapeProduct(
    productURL,
    language = "de",
    scrapePriceOnly = false,
  ) {
    /* Track time spent */
    const startTime = Date.now();

    /* Will contain scraped data */
    const scrapedData = {};

    // Scrape for all amazon details if applicable
    if (!scrapePriceOnly) {
      const scrapedDetails = await this.scrapeProductDetails(productURL, language);

      // Apply scraped details
      Object.entries(scrapedDetails).forEach(([key, value]) => {
        scrapedData[key] = value;
      });
    }

    // Scrape sale details:
    // price, price_original, discount_percent, quantity_available_percent, and release_date
    const scrapedSaleDetails = await this.scrapeSaleDetails(productURL);

    // Apply scraped sale details
    Object.entries(scrapedSaleDetails).forEach(([key, value]) => {
      scrapedData[key] = value;
    });

    const endTime = Date.now();
    const timeSpent = String(Number(((endTime - startTime) / 1000).toFixed(2)));
    console.info([
      `- Product scraper took`.green,
      timeSpent.green.bold,
      `seconds.`.green,
    ].join(' '));

    return scrapedData;
  }

  /**
   * Scrapes for an amazon product's details:
   * @param {string} productURL - The original URL of the product
   */
  async scrapeProductDetails(productURL) {
    const urlWithLanguage = addURLParams(productURL);

    /* Ensure puppeteer page instance */
    if ( !this.page ) {
      this.page = await TOR_PROXY.newPage();
    }

    try {
      console.log(" - Fetching all details for product...".cyan);

      /*
        Go to page and wait for selector.
        If selector fails, retry using a different browser
      */
      let pageLoaded = false;
      let tries = 3;
      while ( !pageLoaded && tries ) {
        try {
          /* Go to product page */
          await this.page.goto(urlWithLanguage, { timeout: 60000 });

          /* Wait for selector */
          await this.page.waitForSelector(detailSelector, { timeout: 10000 });

          /* Flag page loaded */
          pageLoaded = true;
        }
        catch (err) {
          console.error(err.message);
          console.info(`Retrying...`.yellow);
          if ( --tries === 0 ) {
            throw new Error('Unable to fetch product detail page. Kindly ensure that page exists');
          } else {
            await TOR_PROXY.launchNewBrowser();
            this.page = await TOR_PROXY.newPage();
          }
        }
      }

      const {
        title,
        image,
        details_html
      } = await this.page.evaluate((
        titleSelector,
        imageSelector,
        detailSelector,
        selectorsToRemove,
      ) => {
        const titleElement = document.querySelector(titleSelector);
        const imageElement = document.querySelector(imageSelector);
        const detailElement = document.querySelector(detailSelector);

        // Select highres image from dynamic image data
        const imageData = imageElement
          ? JSON.parse(imageElement.dataset.aDynamicImage) || {}
          : {};
        const highResImage = Object.entries(imageData).reduce(
          (selectedEntry, [url, dimensions]) =>
            !selectedEntry
              ? [url, dimensions]
              : dimensions[0] > selectedEntry[1][0]
              ? [url, dimensions]
              : selectedEntry,
          null
        );

        /* Remove unnecessary elements from detail section */
        const allSelectorsToRemove = selectorsToRemove.join(",");
        [...detailElement.querySelectorAll(allSelectorsToRemove)].forEach(
          (element) => {
            try {
              element.remove();
            } catch (err) {
              /**/
            }
          }
        );

        /* Apply scraped details */
        return {
          title: titleElement
            ? titleElement.textContent.trim().replace(/\n/, "")
            : "",
          image: highResImage ? highResImage[0] : "",
          details_html: detailElement.outerHTML
            .trim()
            .replace(/\n+/g, "\n"),
        }
      }, titleSelector,imageSelector,detailSelector,selectorsToRemove);

      return {
        title,
        image,
        details_html
      }
    } catch (err) {
      await screenshotPageError(urlWithLanguage);
      throw err;
    }
  }

  /*
    Scrapes for an amazon product's sale details:
    price, discount_percent, price_original, quantity_available_percent, and release_date
  */
  async scrapeSaleDetails (productURL) {

    /* Ensure puppeteer page instance */
    if ( !this.page ) {
      this.page = await TOR_PROXY.newPage();
    }

    // Use english page in order to parse price without having to account for other currencies
    const englishPageURL = addURLParams(productURL, { language: "en" });

    console.log(" - Fetching price for product...".cyan);
    let priceMatch,
      originalPriceMatch,
      discountPercentMatch,
      quantityAvailablePercentMatch,
      releaseDate;

    /* Try fetching product page for price */
    let tries = 3;
    let productPageFetched = false;
    while (!productPageFetched && tries) {
      try {
        /* Go to product page */
        await this.page.goto(englishPageURL, { timeout: 60000 });

        /* Wait for price selector */
        await this.page.waitForSelector(PRICE_SELECTOR, { timeout: 10000 });

        /* Flag page fetched */
        productPageFetched = true;
      }
      catch (err) {
        console.error(err.message);
        console.info(`Retrying...`.yellow);
        if ( --tries === 0 ) {
          throw new Error('Unable to fetch product price page. Kindly ensure that product is available.');
        } else {
          await TOR_PROXY.launchNewBrowser();
          this.page = await TOR_PROXY.newPage();
        }
      }
    }

    /* Parse page content for elements containing the price details */
    [
      priceMatch,
      originalPriceMatch,
      discountPercentMatch,
      quantityAvailablePercentMatch,
    ] = await this.page.$eval(
      PRICE_SELECTOR,
      (
        priceElement,
        ORIGINAL_PRICE_SELECTOR,
        DISCOUNT_SELECTOR,
        QUANTITY_AVAILABLE_PERCENT_SELECTOR,
        QUANTITY_AVAILABLE_DESCRIPTOR_SELECTOR
      ) => {
        const priceMatch = priceElement.textContent.match(/[0-9.,]+/);
        const originalPriceElement = document.querySelector(
          ORIGINAL_PRICE_SELECTOR
        );
        const discountPercentElement =
          document.querySelector(DISCOUNT_SELECTOR);
        const quantityAvailablePercentElement = document.querySelector(
          QUANTITY_AVAILABLE_PERCENT_SELECTOR
        );
        const quantityAvailableDescriptorElement = document.querySelector(
          QUANTITY_AVAILABLE_DESCRIPTOR_SELECTOR
        );

        // Parse availability percent
        let availabilityContent;
        let availabilityPercentMatch = null;
        if (quantityAvailablePercentElement) {
          availabilityPercentMatch =
            quantityAvailablePercentElement.textContent.match(/[0-9.,]+/);
        } else if (quantityAvailableDescriptorElement) {
          availabilityContent =
            quantityAvailableDescriptorElement.textContent.trim();

          if (availabilityContent) {
            // Matches "In Stock"
            if (/^in stock/i.test(availabilityContent)) {
              availabilityPercentMatch = ["0"];
            }
            // Matches "Only {NUMBER} left in stock."
            else if (/\d+\s+in stock/i.test(availabilityContent)) {
              availabilityPercentMatch = availabilityContent.match(/\d+/i);
            } else {
              availabilityPercentMatch = null;
            }
          } else {
            availabilityPercentMatch = null;
          }
        }

        return [
          priceMatch,
          originalPriceElement
            ? originalPriceElement.textContent.match(/[0-9.,]+/)
            : null,
          discountPercentElement
            ? discountPercentElement.textContent.match(/[0-9]+(?=\s*%)/)
            : null,
          availabilityPercentMatch,
          availabilityContent,
        ];
      },
      ORIGINAL_PRICE_SELECTOR,
      DISCOUNT_SELECTOR,
      QUANTITY_AVAILABLE_PERCENT_SELECTOR,
      QUANTITY_AVAILABLE_DESCRIPTOR_SELECTOR
    );

    // Product might not be unavailable if there's no price parsed
    if (!priceMatch) {
      // Output file
      await screenshotPageError(englishPageURL, this.page);
      throw new Error(
        "Unable to parse price for the product from Amazon. Please make sure that it's currently available: " +
          englishPageURL.bold.gray,
        englishPageURL.bold.gray
      );
    }

    // Get the release date
    const parsedReleaseDates = await Promise.all([
      // Some products have additional info table,
      this.page.evaluate((additionalInfoTableSelector) => {
        const additionalInfoTable = document.querySelector(
          additionalInfoTableSelector
        );
        if (!additionalInfoTable) return;
        const releaseDateRow = Array.from(additionalInfoTable.rows).find(
          (row) =>
            row.cells[0] && /date first available/i.test(row.cells[0].textContent)
        );
        return releaseDateRow && releaseDateRow.cells[1]
          ? releaseDateRow.cells[1].textContent.trim()
          : "";
      }, additionalInfoTableSelector),

      // Some products have details list
      this.page.evaluate((detailsListSelector) => {
        const detailsListContainer = document.querySelector(detailsListSelector);
        if (!detailsListContainer) return;
        const releaseDateItemText = [
          ...detailsListContainer.querySelectorAll(".a-list-item"),
        ]
          .map((listItem) => listItem.textContent)
          .find((textContent) => /date first available/i.test(textContent));
        const dateMatch = releaseDateItemText
          ? releaseDateItemText.match(/[0-9]+[^0-9]+[0-9]{4}/i)
          : null;
        return dateMatch ? dateMatch[0] : null;
      }, detailsListSelector),
    ]);

    const releaseDateString = parsedReleaseDates.find((date) => date);

    if (releaseDateString) {
      const [day, monthAbbrev, year] = releaseDateString.split(" ");
      const isoDate = [year, MONTHS.indexOf(monthAbbrev.substr(0, 3)), day];

      const releaseDateMoment = moment.utc(isoDate);
      releaseDate = releaseDateMoment
        ? releaseDateMoment.toISOString().replace(/\.\d+Z$/, "")
        : "";
    }

    // Apply prices and discount data
    return {
      price: Number((priceMatch && priceMatch[0].replace(",", "")) || 0),
      discount_percent: Number(
        (discountPercentMatch && discountPercentMatch[0]) || null
      ),
      price_original: Number(
        (originalPriceMatch && originalPriceMatch[0]) || null
      ),
      quantity_available_percent: quantityAvailablePercentMatch
        ? 100 - Number(quantityAvailablePercentMatch[0])
        : null,
      release_date: releaseDate,
    };
  }

  /* Cleanup browser instance. Ideally, this should be called when done with the scraper */
  async close() {
    if ( this.page ) {
      const browser = await this.page.browser();
      await browser.close();
    }
  }
}

module.exports = async () => await AmazonProductScraper.create();
