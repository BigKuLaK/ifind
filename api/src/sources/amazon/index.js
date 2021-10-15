import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const BASE_URL = 'https://www.amazon.de';
const buildFullURL = (relativeURL) => `${BASE_URL}${relativeURL}`;
const buildBestSellersURL = (category) => buildFullURL(`/gp/bestsellers/${category || ''}`);


const startBrowser = async () => {
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
}


const getBestSellers = async (category, limit) => {
  const browser = await startBrowser();
  const page = await browser.newPage();
  const url = buildBestSellersURL(category);
  const itemsSelector = '#zg-ordered-list .a-list-item';

  await page.goto(url);
  await page.waitForSelector(itemsSelector);
  const items = await page.$$(itemsSelector);

  const itemsData = await Promise.all(items.slice(0, limit).map(async (item) => item.evaluate( (element, BASE_URL) => {
    const link = element.querySelector('a');
    const title = link.textContent.trim();
    const detailURL = `${link.href}`.replace(/(\?.*)$/, '');
    const imageElement = element.querySelector('img');
    const alt = imageElement.getAttribute('alt');
    const src = imageElement.getAttribute('src');

    return {
      // // id: String
      title,
      detailURL,
      image: {
        alt,
        sizes: {
          small: src.replace(/AC_UL200_SR200,200/, 'AC_UL500_SR500,500'),
          thumbnail: src.replace(/AC_UL200_SR200,200/, 'AC_UL800_SR800,800'),
          large: src.replace(/AC_UL200_SR200,200/, 'AC_UL120000_SR120000,120000'),
        }
      }
    }
  }, BASE_URL)));

  await browser.close();

  return itemsData;
}


const getProductDetail = async (productDetailURL) => {
  if ( !productDetailURL ) {
    return null;
  }

  const browser = await startBrowser();
  const page = await browser.newPage();
  const detailSelector = '#centerCol';

  await page.goto(productDetailURL);
  await page.waitForSelector(detailSelector);
  const detailsHTML = await page.$eval(detailSelector, detail => detail.outerHTML);

  await browser.close();

  return {
    detailURL: productDetailURL,
    detailsHTML: detailsHTML,
  };
}

export {
  getBestSellers,
  getProductDetail,
}