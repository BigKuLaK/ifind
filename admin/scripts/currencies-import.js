/**
 * Imports currencies defined in helpers/currencies into the database
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
 const TABLE_NAME = 'currencies';

 const resolveApp = relativePath => path.resolve(projectRoot, relativePath);

 const {
   host,
   port,
   database,
   username,
   password,
 } = strapi().config.database.connections.default.settings;

 const currencies = require(resolveApp('helpers/currencies'));

 const connection = mysql.createConnection({
   user: username,
   host,
   password,
   database,
   port,
 });

 connection.connect();

// Some entries have multiple symbols delimited by slash (/),
// Create individual entries for each symbol
 const currenciesList = currencies.reduce((all, currency) => ([
   ...all,
   ...currency.symbol.split(/\s*\/\s*/).map(symbol => ({
     name: currency.name,
     code: currency.code,
     symbol,
     label_preview: `${symbol} - ${currency.name}`
   }))
 ]), []);

 const callQuery = (query, values = null) => new Promise(resolve => {
  connection.query({
    sql: query,
    values,
  }, function (error, result, fields) {
    if (error) throw error;
    resolve(result);
  });
 });

 (async () => {

  // Filter out existing currency symbols
  const existingQuery = `SELECT * from ${TABLE_NAME} WHERE ${TABLE_NAME}.label_preview IN (${currenciesList.map(({ label_preview }) => `"${label_preview}"`).join(',')})`;
  const existing = await callQuery(existingQuery);
  const existingSymbols = existing.map(exists => exists.symbol);
  const toInsert = currenciesList.filter(currency => !existingSymbols.includes(currency.symbol));
  const values = toInsert.map(currency => Object.values(currency));
  let inserted = 0;

  // console.log({ values });
  while ( values.length ) {
    const entryValues = values.shift();

    try {
      const result = await callQuery(`INSERT INTO ${TABLE_NAME} (name, code, symbol, label_preview) VALUES (?);`, [entryValues]);
      console.log(`Inserted: ${entryValues.join(', ')}`);
      inserted++;
    }
    catch (err) {
      console.warn(err);
    }
  }

  connection.end();

  console.log(`Total inserted currencie(s): ${inserted}`);

 })();
