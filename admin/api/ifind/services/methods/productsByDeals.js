const dealTypes = appRequire("api/ifind/deal-types");
const offersCategories = appRequire("api/ifind/offers-categories");
const axios = require('axios').default;
const https = require('https');
var request = require('request');
var agentOptions;
var agent;
'use strict';

agentOptions = {
  host: 'https://script.ifindilu.de'
, port: '443'
, path: '/'
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

const PRODUCTS_PER_PAGE = 999999;

module.exports = async ({ deal_type = "", start = 0, offer_category = "" }) => {
  const sources = await strapi.services.source.find();
  // const scheduledTasks = await strapi.scheduledTasks.list();
  // const scheduledTasks = null
    // await axios.post("https://script.ifindilu.de/task/getTaskList")
    //   .then((response) => {
    //      scheduledTasks = response.data.tasks
    //   })
    //   .catch((err) => console.log("error ", err.message))
    // request({
    //   url: "https://script.ifindilu.de/task/getTaskList"
    // , method: 'POST'
    // , agent: agent
    // }, function (err, resp, body) {
    //   // ...
    //   // scheduledTasks = resp.data.tasks
    //   console.log("response : ", resp);
    //   if(err) console.log("Error : err");
    // });
    const scheduledTasks = [
      
          {
              "id": "amazon-lightning-offers",
              "name": "Amazon Lightning Offers",
              "schedule": 3600000,
              "next_run": 1653918361169,
              "status": null,
              "last_run": 1653914761273,
              "timeout_minutes": 120,
              "meta": {
                  "deal_type": "amazon_flash_offers",
                  "deal_merchant": "amazon"
              }
          },
          {
              "id": "ebay-wow-offers",
              "name": "Ebay Wow Offers",
              "schedule": 3600000,
              "next_run": 1653915645644,
              "status": null,
              "last_run": 1653908517158,
              "timeout_minutes": 120,
              "meta": {
                  "deal_type": "ebay_wow_offers",
                  "deal_merchant": "ebay"
              }
          },
          {
              "id": "aliexpress-value-deals",
              "name": "AliExpress Super Value Deals",
              "schedule": 3600000,
              "next_run": 1653918171097,
              "status": null,
              "last_run": 1653914571195,
              "timeout_minutes": 120,
              "meta": {
                  "deal_type": "aliexpress_value_deals",
                  "deal_merchant": "aliexpress"
              }
          },
          {
              "id": "mydealz-highlights",
              "name": "MyDealz Highlights",
              "schedule": 3600000,
              "next_run": 1653918779358,
              "status": null,
              "last_run": 1653915183882,
              "timeout_minutes": 120,
              "meta": {
                  "deal_type": "mydealz_highlights"
              }
          }
        ]

  const defaultOffersCategory = Object.keys(offersCategories).find(
    (categoryKey) => offersCategories[categoryKey].isDefault
  );
  const offerCategory = offer_category
    ? offersCategories[offer_category]
    : offersCategories[defaultOffersCategory];
  const selectedDealTypes = offerCategory
    ? offerCategory.dealTypes.reduce((dealTypesMap, dealTypeKey) => {
        dealTypesMap[dealTypeKey] = dealTypes[dealTypeKey];
        return dealTypesMap;
      }, {})
    : null;

  console.log({ offerCategory });

  if (!selectedDealTypes) {
    return null;
  }

  const productsByDeals = await Promise.all(
    Object.entries(selectedDealTypes)
      .filter(([dealTypeKey]) => (deal_type ? dealTypeKey === deal_type : true))
      .map(async ([dealTypeKey, { site, label, nav_label, nav_icon }]) => {
        const [products, total_products] = await Promise.all([
          strapi.services.product.find({
            deal_type: dealTypeKey,
            _limit: PRODUCTS_PER_PAGE,
            _start: start,
            _sort:
              "deal_quantity_available_percent:ASC,quantity_available_percent:ASC",
          }),
          strapi.services.product.count({
            deal_type: dealTypeKey,
          }),
        ]);

        const source = sources.find(({ name }) =>
          new RegExp(site, "i").test(name)
        );

        // Get last run data from scheduled task
        const matchedScheduledTask = scheduledTasks.find(
          ({ meta }) => meta && meta.deal_type === dealTypeKey
        );

        const last_run = matchedScheduledTask
          ? matchedScheduledTask.last_run
          : null;

        return {
          deal_type: {
            name: dealTypeKey,
            label,
            source,
            last_run,
            nav_label,
            nav_icon,
          },
          products,
          total_products,
        };
      })
  );

  return productsByDeals;
};
