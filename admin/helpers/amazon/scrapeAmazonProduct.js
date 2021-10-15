require("colors");
const path = require("path");
const fs = require("fs-extra");
const moment = require("moment");
const { JSDOM } = require("jsdom");

const { addURLParams } = require("../url");
// const proxiedRequest = require('./proxied-request');
const regularRequest = require("./regular-request");

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

const priceSelector = [
  "#price_inside_buybox",
  "#priceblock_ourprice",
  "#priceblock_dealprice",
  '[data-action="show-all-offers-display"] .a-color-price',
  "#usedOnlyBuybox .offer-price",
  "#olp_feature_div .a-color-price",
].join(",");
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
];

const scrapeAmazonProduct = async (
  productURL,
  language = "de",
  scrapePriceOnly = false
) => {
  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: "en" });

  // Scrape for all amazon details if applicable
  if (!scrapePriceOnly) {
    console.log(" - Fetching all details for product...".cyan);
    const responseBody = await regularRequest(urlWithLanguage);
    const detailPageHTML = responseBody;

    const dom = new JSDOM(detailPageHTML);
    const titleElement = dom.window.document.querySelector(titleSelector);
    const imageElement = dom.window.document.querySelector(imageSelector);
    const detailElement = dom.window.document.querySelector(detailSelector);

    // Select highres image from dynamic image data
    const imageData = (scrapedData.image = imageElement
      ? JSON.parse(imageElement.dataset.aDynamicImage) || {}
      : {});
    const highResImage = Object.entries(imageData).reduce(
      (selectedEntry, [url, dimensions]) =>
        !selectedEntry
          ? [url, dimensions]
          : dimensions[0] > selectedEntry[1][0]
          ? [url, dimensions]
          : selectedEntry,
      null
    );

    // Remove unnecessary elements from detail section
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

    // Apply scraped details
    scrapedData.title = titleElement
      ? titleElement.textContent.trim().replace(/\n/, "")
      : "";
    scrapedData.image = highResImage ? highResImage[0] : "";

    // Apply details_html
    scrapedData.details_html = detailElement.outerHTML
      .trim()
      .replace(/\n+/g, "\n");
  }

  // Go to english site for price and release_date
  console.log(" - Fetching price for product...".cyan);
  const englishPageHTML = await regularRequest(englishPageURL);
  const dom = new JSDOM(englishPageHTML);

  // Get the price
  const priceElement = dom.window.document.querySelector(priceSelector);
  const priceMatch = priceElement && priceElement.textContent.match(/[0-9.,]+/);

  // Product must be unavailable if there's no price parsed
  if (!priceMatch) {
    // Output file
    const [urlPath] = englishPageURL.split("?");
    const directoryTree = urlPath.replace(/^.+amazon[^/]+\//i, "").split("/");
    const dirPath = path.resolve(__dirname, "page-errors", ...directoryTree);
    fs.ensureDirSync(dirPath);
    fs.outputFileSync(path.resolve(dirPath, "index.html"), englishPageHTML);
    throw new Error(
      "Unable to parse price for the product from Amazon. Please make sure that it's currently available: " +
        englishPageURL.bold.gray,
      englishPageURL.bold.gray
    );
  }

  scrapedData.price = (priceMatch && priceMatch[0].replace(",", "")) || 0;

  // Get the release date if applicable
  if (!scrapePriceOnly) {
    const parsedReleaseDates = [
      // Some products have additional info table,
      (() => {
        const additionalInfoTable = dom.window.document.querySelector(
          additionalInfoTableSelector
        );
        if (!additionalInfoTable) return;
        const releaseDateRow = Array.from(additionalInfoTable.rows).find(
          (row) =>
            row.cells[0] &&
            /date first available/i.test(row.cells[0].textContent)
        );
        return releaseDateRow && releaseDateRow.cells[1]
          ? releaseDateRow.cells[1].textContent.trim()
          : "";
      })(),
      // Some products have details list
      (() => {
        const detailsListContainer =
          dom.window.document.querySelector(detailsListSelector);
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
      })(),
    ];

    const releaseDateString = parsedReleaseDates.find((date) => date);

    if (releaseDateString) {
      const [day, monthAbbrev, year] = releaseDateString.split(" ");
      const isoDate = [year, MONTHS.indexOf(monthAbbrev.substr(0, 3)), day];

      const releaseDateMoment = moment.utc(isoDate);
      const releaseDate = releaseDateMoment
        ? releaseDateMoment.toISOString()
        : "";

      if (releaseDate) {
        scrapedData.releaseDate = releaseDate;
      }
    }
  }

  return scrapedData;
};

module.exports = scrapeAmazonProduct;
