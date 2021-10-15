const webSocketServer = require('./server');

console.log('hook is required');

module.exports = async strapi => {
  const hook = {
    /**
     * Default options
     */

    defaults: {
      // config object
    },

    /**
     * Initialize the hook
     */

    async initialize() {
      // await someAsyncCode()
      // const settings = {...this.defaults, ...strapi.config.hook.settings.**};

      console.log('hook');
      webSocketServer.init(strapi.server);
    },
  };

  return hook;
};

