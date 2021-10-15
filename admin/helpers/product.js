/**
  Use puppeteer to get the HTML contents of a page
  Use JSDOM to scrape the HTML for needed data

  TODO:
  Create separate services for amazon and ebay
 */
const { isAmazonLink } = require("./amazon");
const { scrapeAmazonProduct, amazonLink } = require("./amazon");
const { getDetailsFromURL: getEbayDetails, ebayLink } = require("./ebay");
const { getDetailsFromURL: getAliExpressDetails } = require("./aliexpress");

const getProductDetails = async (
  productData,
  language,
  scrapePriceOnly = false
) => {
  const productURL = productData.amazon_url;
  const scrapedData = {};

  if (!productURL) {
    return null;
  }

  await Promise.all([
    // Scrape amazon
    (async () => {
      const scrapedDetails = await scrapeAmazonProduct(
        productURL,
        "de",
        scrapePriceOnly
      );
      Object.entries(scrapedDetails).forEach(([key, value]) => {
        scrapedData[key] = value;
      });

      // Apply amazon affiliate link
      scrapedData.amazon_url = amazonLink(productData.amazon_url);
    })(),

    // Scrape other sites data
    (async () => {
      if (
        !productData ||
        !productData.url_list ||
        !productData.url_list.length
      ) {
        return;
      }

      const [ebaySource, aliExpressSource] = await Promise.all([
        strapi.services.source.findOne({ name_contains: "ebay" }),
        strapi.services.source.findOne({ name_contains: "ali" }),
      ]);

      // Prepare to save product issues
      scrapedData.product_issues = productData.product_issues || {};

      scrapedData.url_list = await Promise.all(
        productData.url_list.map(async (urlData) => {
          // Scrapte EBAY details
          if (Number(urlData.source) == Number(ebaySource.id) && urlData.url) {
            const ebayProductDetails = await getEbayDetails(urlData.url);
            if (ebayProductDetails) {
              urlData.price = ebayProductDetails.price || urlData.price || "";
              urlData.url = ebayLink(urlData.url);

              scrapedData.product_issues.ebay_link_invalid = false;
            } else {
              // Ebay URL is invalid
              scrapedData.product_issues.ebay_link_invalid = true;
            }
          }
          // Scrape ALIEXPRESS details
          else if (
            Number(urlData.source) == Number(aliExpressSource.id) &&
            urlData.url
          ) {
            const aliExpressProductDetails = await getAliExpressDetails(
              urlData.url
            );
            if (aliExpressProductDetails) {
              urlData.price =
                aliExpressProductDetails.price || urlData.price || "";
              urlData.url =
                aliExpressProductDetails.affiliateLink || urlData.url || "";

              scrapedData.product_issues.aliexpress_link_invalid = false;
            } else {
              // AliExpress URL is invalid
              scrapedData.product_issues.aliexpress_link_invalid = true;
            }
          }

          return urlData;
        })
      );
    })(),
  ]);

  console.log("Contents queried.");

  return scrapedData;
};

/**
 * Fetches product details using google puppeteer
 * @param {ID} productID -  The product data matching Product type
 * @returns Object
 */
const fetchProductDetails = async (productID, language = "en") => {
  if (!productID) return null;

  const product = await strapi.services.product.findOne({ id: productID });

  if (!product) return null;

  const amazonURL = product.amazon_url;

  if (!amazonURL) return null;

  const productDetails = await getProductDetails(product, language);

  return {
    ...productDetails,
    id: productID,
  };
};

const filterProductsWithProblems = (products) => {
  return products.filter((product) => {
    const productChanges = product.product_changes || [];

    // Check amazon_url
    if (
      !isAmazonLink(product.amazon_url) &&
      productChanges.some(
        ({ state }) => state && isAmazonLink(state.amazon_url)
      )
    ) {
      return true;
    }

    // Check url_list
    // Check if url_list is provided before but was removed unknowingly
    if (
      (!product.url_list || !product.url_list.length) &&
      productChanges.some(
        ({ state }) => state && state.url_list && state.url_list.length
      )
    ) {
      return true;
    }

    // Check attrs_rating
    // Each product should have attrs_rating as it's being supplied by default
    if ( hasInvalidRating(product) ) {
      return true;
    }

    // Check title and details_html for unnecessary newlines
    if ( product.title.match(/\n/) || product.details_html.match(/\n+/g) ) {
      return true;
    }
  });
};

// Checks if a given product has invalid Product Attribute Rating
const hasInvalidRating = (product) => (
  !product.attrs_rating ||
  !product.attrs_rating.length ||
  product.attrs_rating.some(attr_rating => (
    !attr_rating ||
    !attr_rating.product_attribute
  ))
);

module.exports = {
  fetchProductDetails,
  getProductDetails,
  filterProductsWithProblems,
  hasInvalidRating,
};
