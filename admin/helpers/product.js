/**
 * Use puppeteer to get the HTML contents of a page
 * Use JSDOM to scrape the HTML for needed data
 */
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('./url');
const TIMEOUT = 60000;

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetails = async (productURL, language, scrapePriceOnly = false) => {
  if ( !productURL ) {
    return null;
  }

  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  const browser = await startBrowser();
  const detailPage = await browser.newPage();

  const productSectionSelector = '#dp-container';

  const detailSelector = '#centerCol';
  const selectorsToRemove = [
    '#title',
    '#desktop_unifiedPrice',
    '#productSupportAndReturnPolicy_feature_div',
    '#alternativeOfferEligibilityMessaging_feature_div',
    '#olp_feature_div',
    '#seeMoreDetailsLink',
    '#HLCXComparisonJumplink_feature_div',
    '.caretnext',
  ];
  const priceSelector = '#priceblock_ourprice, [data-action="show-all-offers-display"] .a-color-price';
  const imageSelector = '#landingImage[data-old-hires]';
  const titleSelector = '#title';

  // Scrape for all details if applicable
  if ( !scrapePriceOnly ) {
    await detailPage.goto(urlWithLanguage, { timeout: TIMEOUT })
    await detailPage.waitForSelector(productSectionSelector, { timeout: TIMEOUT });

    const detailPageHTML = await detailPage.$eval(productSectionSelector, detailContents => detailContents.outerHTML);

    console.log('Page parsed');

    const dom = new JSDOM(detailPageHTML);
    const titleElement = dom.window.document.querySelector(titleSelector);
    const imageElement = dom.window.document.querySelector(imageSelector);
    const detailElement = dom.window.document.querySelector(detailSelector);

    scrapedData.title = titleElement ? titleElement.textContent.trim() : '';
    scrapedData.image = imageElement && imageElement.getAttribute('data-old-hires');

    const allSelectorsToRemove = selectorsToRemove.join(',');
    [...detailElement.querySelectorAll(allSelectorsToRemove)].forEach(element => {
      try {
        element.remove();
      }
      catch (err) { /**/ }
    });
    scrapedData.details_html = detailElement.outerHTML;
  }

  // Go to english site for price
  await detailPage.goto(englishPageURL, { timeout: TIMEOUT })
  await detailPage.waitForSelector(priceSelector, { timeout: TIMEOUT });

  scrapedData.price = await detailPage.$eval(priceSelector, priceElement => {
    let price = priceElement && priceElement.textContent.match(/[0-9.,]+/);
    return price && price[0] || 0;
  });

  await browser.close();

  console.log('Contents queried.');

  return scrapedData;
}

/**
 * Fetches product details using google puppeteer
 * @param {ID} productID -  The product data matching Product type
 * @returns Object
 */
const fetchProductDetails = async (productID, language = 'en') => {
  if ( !productID ) return null;

  const product = await strapi.services.product.findOne({ id: productID });

  if ( !product ) return null;

  const amazonURL = product.amazon_url;

  if ( !amazonURL ) return null;

  const productDetails = await getProductDetails(amazonURL, language);
  return {
    ...productDetails,
    id: productID,
  };
}


module.exports = {
  fetchProductDetails,
  getProductDetails,
};
