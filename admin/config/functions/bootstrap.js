// const WebSocketServer = require('../../websocket/server');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
  // https://github.com/strapi/strapi/issues/5869#issuecomment-619508153
  // process.nextTick(() =>{
  //   const webSocketServer = new WebSocketServer;
  //   webSocketServer.init(strapi.server);
  // });
};
