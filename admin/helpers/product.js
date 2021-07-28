/**
  Use puppeteer to get the HTML contents of a page
  Use JSDOM to scrape the HTML for needed data

  TODO:
  Create separate services for amazon and ebay
 */
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { addURLParams } = require('./url');

const EBAY_GETITEM_ENDPOINT = 'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KirillKr-ifindilu-PRD-9afbfbe27-8527205b&siteid=0&version=967&IncludeSelector=Details&ItemID=';
const TIMEOUT = 60000;

const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}

const getProductDetails = async (productData, language, scrapePriceOnly = false) => {
  const productURL = productData.amazon_url;

  if ( !productURL ) {
    return null;
  }

  const scrapedData = {};

  const urlWithLanguage = addURLParams(productURL, { language });
  // Use english page in order to parse price without having to account for other currencies
  const englishPageURL = addURLParams(productURL, { language: 'en' });

  const browser = await startBrowser();

  await Promise.all([

    // Scrape amazon
    (async () => {
      const detailPage = await browser.newPage();
      const productSectionSelector = '#dp-container';
      const priceSelector = '#priceblock_ourprice, [data-action="show-all-offers-display"] .a-color-price';
      const imageSelector = '#landingImage[data-old-hires]';
      const titleSelector = '#title';

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
        return price && price[0].replace(',', '') || 0;
      });
    })(),

    // Scrape ebay price
    (async () => {
      const ebaySource = await strapi.services.source.findOne({
        name_contains: 'ebay'
      });

      if ( !ebaySource ) {
        return;
      }

      if ( !productData || !productData.url_list || !productData.url_list.length ) {
        return;
      }

      scrapedData.url_list = await Promise.all(productData.url_list.map(async urlData => {
        if ( Number(urlData.source) !== Number(ebaySource.id) || !urlData.url ) {
          return urlData;
        }

        // Extract ebay itemID
        const [ itemID ] = urlData.url.match(/[0-9]{9,12}/g) || [];

        if ( itemID ) {
          const res = await fetch(EBAY_GETITEM_ENDPOINT + itemID);
          const { Item } = await res.json();

          if ( Item && Item.CurrentPrice && Item.CurrentPrice.Value ) {
            urlData.price = Item.CurrentPrice.Value;
          }
        }

        return urlData;
      }));
    })(),

  ]);

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

  const productDetails = await getProductDetails(product, language);

  return {
    ...productDetails,
    id: productID,
  };
}


module.exports = {
  fetchProductDetails,
  getProductDetails,
};
