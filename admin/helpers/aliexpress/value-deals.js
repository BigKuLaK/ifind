const path = require('path');
const browser = require('../browser');
const { getDetailsFromURL } = require('./api');

const VALUE_DEALS_PAGE_URL = 'https://www.aliexpress.com/campaign/wow/gcp/superdeal-g/index';
const PRODUCT_CARD_SELECTOR = 'div[spm]:not([utabtest])';
const PRODUCTS_CARDS_COUNT = 50;
const COOKIES = [
  {
    name: 'int_locale',
    value: 'en_US',
    url: VALUE_DEALS_PAGE_URL,
    domain: '.aliexpress.com',
    path: '/',
  },
  {
    name: 'aep_usuc_f',
    value: 'region=DE&c_tp=EUR',
    url: VALUE_DEALS_PAGE_URL,
    domain: '.aliexpress.com',
    path: '/',
  },
];

const getValueDeals = async () => {
  return new Promise(async (resolve, reject) => {
    const page = await browser.getPageInstance();

    await page.setCookie(...COOKIES);

    await page.setViewport({
      width: 1440,
      height: 900,
    });

    // Go to value deals page
    await page.goto(VALUE_DEALS_PAGE_URL);

    try {
      // Await for required selector
      await page.waitForSelector(PRODUCT_CARD_SELECTOR);

      // Ocassionally call page just to prevent it from closing due to idle state
      const keepAliveInterval = setInterval(() => {
        browser.getPageInstance();
      }, 5000);

      // Times out when page takes too long without reponse,
      // meaning there is no content being fetched
      const pageTimeout = setTimeout(() => {
        reject(new Error('Browser takes too long, page might not able to scrape elements.'));
      }, 30000);

      // Parse cards
      const cardsData = await page.evaluate((PRODUCT_CARD_SELECTOR, PRODUCTS_CARDS_COUNT) => {
        return new Promise(resolve => {
          const lastSection = document.querySelector('.rax-scrollview-webcontainer').lastElementChild;

          const interval = setInterval(() => {
            const [...productCards] = document.querySelectorAll(PRODUCT_CARD_SELECTOR);
            if ( productCards.length >= PRODUCTS_CARDS_COUNT ) {
              clearInterval(interval);
              resolve(productCards.map(card => {
                const [ href ] = card.getAttribute('href').split('?');
                return `https:${href}`;
              }));
            }
            else {
              lastSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }, 2000);
        });
      }, PRODUCT_CARD_SELECTOR, PRODUCTS_CARDS_COUNT);

      clearInterval(pageTimeout);
      clearInterval(keepAliveInterval);

      resolve(cardsData);
    }
    catch (err) {
      await page.screenshot({
        path: path.resolve(__dirname, 'aliexpress-value-deals.png'),
        fullPage: true,
      });
      console.error(err);
      reject(err);
    }
  });
}

module.exports = {
  getValueDeals,
};
