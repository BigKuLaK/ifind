const fetch = require('node-fetch');
const {
  clientId,
  clientSecret,
  redirectUri,
} = require('./config');
const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
  clientId,
  clientSecret,
  redirectUri,
});

const CURRENT_TOKEN = Symbol();
const CURRENT_TOKEN_EXPIRY = Symbol();

const getNewToken = async () => {
  const response = await ebayAuthToken.getApplicationToken('PRODUCTION');
  const tokenData = JSON.parse(response);
  return tokenData;
};

// (async () => {
//   const response = await ebayAuthToken.getApplicationToken('PRODUCTION');
//   const tokenData = JSON.parse(response);
//   const { access_token } = tokenData;

//   console.log(tokenData);

//   const req = await fetch('https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KirillKr-ifindilu-PRD-9afbfbe27-8527205b&siteid=0&version=967&IncludeSelector=Details&ItemID=223840934857', {
//     headers: {
//       'X-EBAY-API-IAF-TOKEN': access_token,
//     }
//   });

// })();

module.exports = {
  // Currently fetched token
  [CURRENT_TOKEN]: null,

  // Current token's datetime expiration
  [CURRENT_TOKEN_EXPIRY]: null,

  // Get new token
  async getToken() {
    const now = Date.now();

    if ( !this[CURRENT_TOKEN] || now <= this[CURRENT_TOKEN_EXPIRY] ) {
      await this._getNewToken();
    }

    return this[CURRENT_TOKEN];
  },

  async _getNewToken() {
    const now = Date.now();
    const { access_token, expires_in } = await getNewToken();

    this[CURRENT_TOKEN] = access_token;
    // Subtract 10s from actual expiration
    // Allows us to fetch just before the token expires
    this[CURRENT_TOKEN_EXPIRY] = now + ((expires_in - 10) * 1000);
  }
}
