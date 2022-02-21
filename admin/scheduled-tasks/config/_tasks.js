const frequencies = require("./_frequencies");

module.exports = [
  // {
  //   id: "product-validator",
  //   name: "Product Validator",
  //   schedule: frequencies.daily,
  // },
  // {
  //   id: "product-price-updater",
  //   name: "Product Price Updater",
  //   schedule: frequencies.daily,
  // },
  {
    id: "amazon-lightning-offers",
    name: "Amazon Lightning Offers",
    schedule: frequencies.hourly,
    timeout_minutes: 120,
    meta: {
      deal_type: "amazon_flash_offers",
    },
  },
  {
    id: "ebay-wow-offers",
    name: "Ebay Wow Offers",
    schedule: frequencies.hourly,
    timeout_minutes: 120,
    meta: {
      deal_type: "ebay_wow_offers",
    },
  },
  {
    id: "aliexpress-value-deals",
    name: "AliExpress Super Value Deals",
    schedule: frequencies.hourly,
    timeout_minutes: 120,
    meta: {
      deal_type: "aliexpress_value_deals",
    },
  },
  // {
  //   id: "mydealz-highlights",
  //   name: "MyDealz Highlights",
  //   schedule: frequencies.hourly,
  //   timeout_minutes: 120,
  //   meta: {
  //     deal_type: "mydealz_highlights",
  //   },
  // },
];
