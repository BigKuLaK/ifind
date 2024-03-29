const fetch = require("node-fetch");
const ApiClient = require("./nodejs").ApiClient;
const { appKey, appSecret, tracking_id } = require("./config");

var client = new ApiClient({
  appkey: appKey,
  appsecret: appSecret,
  REST_URL: "http://gw.api.taobao.com/router/rest",
  // 'REST_URL':'https://eco.taobao.com/router/rest',
});

const getDetailsFromURL = async (productURL) => {
  const actualProductURL = await getAffiliateLinkRedirect(productURL);
  const productID = parseIdFromURL(actualProductURL);

  if (!productID) {
    return null;
  }

  const [productDetailsResponse, affiliateLinkResponse] = await Promise.all([
    // Get Product details
    getProductDetails(productID),

    // Get affiliate link
    generateAffiliateLink(actualProductURL),
  ]);

  const data = {};

  if (
    productDetailsResponse &&
    productDetailsResponse.resp_result &&
    productDetailsResponse.resp_result.resp_code == 200 &&
    productDetailsResponse.resp_result.result.current_record_count
  ) {
    const {
      product_title,
      target_app_sale_price,
      target_app_sale_price_currency,
      product_main_image_url,
      target_original_price,
      discount,
    } = productDetailsResponse.resp_result.result.products.product[0];
    data.title = product_title;
    data.image = product_main_image_url;
    data.price = target_app_sale_price;
    data.currency = target_app_sale_price_currency;
    data.price_original = target_original_price;
    data.discount_percent = String(discount).replace('%','');
  } else {
    throw new Error(
      `Unable to get details for the AliExpress Link. The product link might be non-affiliate, please select another link.`
    );
  }

  if (
    affiliateLinkResponse &&
    affiliateLinkResponse.resp_result &&
    affiliateLinkResponse.resp_result.resp_code == 200 &&
    affiliateLinkResponse.resp_result.result.total_result_count
  ) {
    data.affiliateLink =
      affiliateLinkResponse.resp_result.result.promotion_links.promotion_link[0].promotion_link;
  } else {
    throw new Error(
      `Unable to get affiliate link for the AliExpress Link. The product link might be non-affiliate, please select another link.`
    );
  }

  return data;
};

// This will follow the redirect in case an affiliate shortlink is provided, thus returning the actual product detail URL.
// If an actual product detail URL is provided, it will be returned as is.
const getAffiliateLinkRedirect = async (link) => {
  return fetch(link, {
    redirect: "follow",
  }).then(({ url }) => url);
};

const parseIdFromURL = (productURL) => {
  const [baseURL] = productURL.split("?");
  const [productID] = baseURL.match(/(?<=item\/)\d+/) || [];
  return productID || null;
};

const getProductDetails = async (
  productID,
  target_currency = "EUR",
  country = "DE"
) => {
  return sendAPIRequest("aliexpress.affiliate.productdetail.get", {
    product_ids: productID,
    target_currency,
    country,
    tracking_id,
    format: "json",
    symplify: true,
    fields: "target_app_sale_price,target_app_sale_price_currency,target_original_price,discount",
  });
};

const generateAffiliateLink = async (productURL) => {
  return sendAPIRequest("aliexpress.affiliate.link.generate", {
    source_values: productURL,
    promotion_link_type: 0,
    tracking_id,
  });
};

const sendAPIRequest = async (method, parameters) =>
  new Promise((resolve, reject) => {
    client.execute(method, parameters, function (error, response) {
      if (!error) resolve(response);
      else reject(error);
    });
  });

module.exports = {
  getDetailsFromURL,
};
