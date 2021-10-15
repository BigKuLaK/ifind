/**
 * Leverages Puppeteer
 */
require("colors");
const puppeteer = require("puppeteer");
const EventEmitter = require("events");

class Browser {
  constructor() {
    Browser.on("close", () => {
      this.page = null;
    });
  }

  async getBrowserInstance() {
    return await Browser.getInstance();
  }

  async getPageInstance() {
    this.resetPageIdleWatcher();

    if (!this.page) {
      const browser = await this.getBrowserInstance();
      this.page = await browser.newPage();
    }

    return this.page;
  }

  /**
   *
   * @param {String} url
   * @param {String} waitForSelector
   * @returns Page instance
   */
  async goTo(url, waitForSelector = "body") {
    const page = await this.getPageInstance();
    await page.goto(url);
    await page.waitForSelector(waitForSelector);
    return page;
  }

  async getHtml() {
    const page = await this.getPageInstance();
    const bodyHtml = await page.$eval("body", (el) => el.innerHTML);
    return bodyHtml;
  }

  // Watches for page idle
  // If this.getPageInstance or this.getBrowserInstance
  // have not been called around 1min, then this
  // invalidates the puppeteer Page instance to avoid memory leak
  async resetPageIdleWatcher() {
    Browser.resetBrowserIdleWatcher();

    if (this.pageIdleTimer) {
      clearTimeout(this.pageIdleTimer);
    }

    this.pageIdleTimer = setTimeout(async () => {
      console.log("Page has been idle, closing instance...".cyan);
      const page = await this.page;
      page.close(); // no need to await
      this.page = null;
    }, 1000 * 60);
  }
}

/**
 * Static props
 */
Browser.eventEmitter = new EventEmitter();

/**
 * Static methods
 */
Browser.on = function (event, callback) {
  this.eventEmitter.on(event, callback);
};

Browser.getInstance = async function () {
  this.resetBrowserIdleWatcher();

  if (!this.browser) {
    console.log("Creating a puppeteer browser instance...".cyan);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Browser instance created".cyan);
    this.browser = this.browser || browser;
  }

  return this.browser;
};

Browser.resetBrowserIdleWatcher = async function () {
  if (this.browserIdleTimer) {
    clearTimeout(this.browserIdleTimer);
  }

  this.browserIdleTimer = setTimeout(async () => {
    // Close browser instance if not accessed within 3 minutes
    console.log("Browser has been idle, closing instance...".cyan);
    const browser = await this.browser;
    browser.close(); // no need to await
    this.browser = null;
    this.eventEmitter.emit("close");
  }, 1000 * 60 * 3);
};

module.exports = new Browser();
