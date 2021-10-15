/**
 * Strapi's config:export doesn't include view configurations,
 * So we create our own to include them.
 *
 * Strapi's config:restore picks up these additional configs just fine.
 */

require('colors');
const path = require('path');
const glob = require('glob');
const strapi = require('strapi');
const mysql = require('mysql');
const fs = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));

const projectRoot = process.cwd();
const outputFile = args.f || args.file || 'config-dump.json';

const resolveApp = relativePath => path.resolve(projectRoot, relativePath);

const {
  host,
  port,
  database,
  username,
  password,
} = strapi().config.database.connections.default.settings;

const connection = mysql.createConnection({
  user: username,
  host,
  password,
  database,
  port,
});

connection.connect();

// Build keys to select from core_store
const keys = [
  'plugin_content_manager_configuration_content_types::plugins::users-permissions.user',
];
const models = glob.sync(resolveApp('api/*')).map(modelPath => modelPath.split('/').pop());
const components = glob.sync(resolveApp('components/**/*.json')).reduce((all, componentFilePath) => {
  const [ componentFile, category ] = componentFilePath.replace(/\..+$/i, '').split('/').reverse();

  all[category] = all[category] || [];
  all[category].push(componentFile);
  return all;
}, {});

models.forEach(modelName => {
  keys.push(`plugin_content_manager_configuration_content_types::application::${modelName}.${modelName}`);
  keys.push(`model_def_application::${modelName}.${modelName}`);
});

Object.entries(components).forEach(([ category, componentNames ]) => {
  componentNames.forEach(componentName => {
    keys.push(`plugin_content_manager_configuration_components::${category}.${componentName}`);
    keys.push(`model_def_${category}.${componentName}`);
  });
});

const query = `SELECT * from core_store WHERE core_store.key IN (${keys.map(key => `"${key}"`).join(',')})`;

connection.query(query, function (error, results, fields) {
  if (error) throw error;
  connection.end();

  const items = results.map(result => {
    delete result.id;
    return result;
  });

  try {
    fs.outputFileSync(resolveApp(outputFile), JSON.stringify(items, null, ''));
    console.table(keys);
    console.info(`Exported ${keys.length} key(s)`.green);
    console.info(`Dump file: ${outputFile.cyan}`);
  }
  catch (err) {
    console.error(err);
  };

});
