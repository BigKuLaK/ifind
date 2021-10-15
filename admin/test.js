const fetch = require('node-fetch');
const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: 'KirillKr-ifindilu-PRD-9afbfbe27-8527205b',
    clientSecret: 'PRD-afbfbe270089-d729-4240-bbc8-e3b8',
    redirectUri: 'https://www.ifindilu.com',
});

(async () => {
  const { access_token } = await ebayAuthToken.getApplicationToken('PRODUCTION');

  const req = await fetch('https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=KirillKr-ifindilu-PRD-9afbfbe27-8527205b&siteid=0&version=967&IncludeSelector=Details&ItemID=223840934857', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  });

  console.log(await req.json());


})();


