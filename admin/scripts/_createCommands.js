const args = require("minimist")(process.argv.slice(2));
const strapi = require("./strapi-custom");

/**
 * Generates CLI commands
 * @param {Object} commandsMap - CLI commands mapped by parameter name
 */
module.exports = (commandsMap) => {
  // Ensure a command is given
  if (args._[0] in commandsMap) {
    (async () => {
      try {
        await strapi().then((strapiInstance) =>
          commandsMap[args._[0]](strapiInstance, args)
        );
      } catch (err) {
        console.error(err);
      }
      process.exit();
    })();
  }
};
