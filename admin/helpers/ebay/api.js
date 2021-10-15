const fetch = require("node-fetch");
const { appId } = require("./config");
const { toSearchParams } = require("../url");
const token = require("./token");

const BASE_URL = "https://open.api.ebay.com/shopping";
const params = {
  responseencoding: "JSON",
  siteid: 0,
  version: 967,
  appId: appId,
};

const getDetailsFromURL = async (productURL) => {
  // Extract ebay itemID
  const [itemID] = productURL.match(/[0-9]{9,12}/g) || [];

  if (itemID) {
    const accessToken = await token.getToken();
    const requestParams = {
      ...params,
      callname: "GetSingleItem",
      ItemID: itemID,
      IncludeSelector: "Details",
    };
    const headers = {
      "X-EBAY-API-IAF-TOKEN": accessToken,
    };
    const res = await fetch(BASE_URL + toSearchParams(requestParams), {
      headers,
    });
    const data = await res.json();
    const { Item, Errors } = data;

    if ( Errors ) {
      console.error(Errors[0]);
    }

    if (Item) {
      const data = {};

      if (Item && Item.CurrentPrice && Item.CurrentPrice.Value) {
        data.price = Item.CurrentPrice.Value;
      }

      return data;
    } else {
      return null;
    }
  }

  return null;
};

module.exports = {
  getDetailsFromURL,
};
