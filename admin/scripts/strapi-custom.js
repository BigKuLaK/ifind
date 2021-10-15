require('colors');
const fs = require('fs');
const path = require('path');
const { iconsList } = require('ifind-icons');
const args = require('minimist')(process.argv.slice(2));
const strapiNativeCommands = [
  'start',
  'build',
  'develop',
];

const adminRoot = path.resolve(__dirname, '../');
require(path.resolve(adminRoot, 'helpers/customGlobals'));

const strapi = require('strapi');

// Remove build and cache folders for build script on --watch-plugin
// This is necessary when building plugin
if ( process.argv.includes('watch-plugin') ) {
  const build = resolveApp('build');
  const cache = resolveApp('.cache');
  const rmOptions = { recursive: true, force: true };

  console.log('Removing build and cache folders...');
  fs.rmdirSync(build, rmOptions);
  fs.rmdirSync(cache, rmOptions);
}


/**
 * Ensure Category API's icon field is populated with the IFIND icons package
 */
const categoryModelSettingsFile = resolveApp('api/category/models/category.settings.json');
const categoryModelSettings = JSON.parse(fs.readFileSync(categoryModelSettingsFile).toString());
// Supply icon names as enum options,
// But change dashes into underscores so enumParser won't throw error
// just handle changing back to dash in the front-end
categoryModelSettings.attributes.icon.enum = iconsList.map(icon => icon.replace(/-/g, '_'));
// Write updated category model settings
fs.writeFileSync(categoryModelSettingsFile, JSON.stringify(categoryModelSettings, null, '  '));

/**
 * Creates a strapi instance using our configs, without serving admin panel
* @returns {Promise} - Passes loaded strapi instance
 */
const createStrapiInstance = () => (
  strapi({
    dir: adminRoot,
    serveAdminPanel: false,
  }).load()
);

if ( args._.some(command => strapiNativeCommands.includes(command)) ) {
  require('strapi/bin/strapi');
} else {
  module.exports = createStrapiInstance;
}

