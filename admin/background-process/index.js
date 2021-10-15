require('colors');
require("../helpers/customGlobals");

const path = require("path");
const { existsSync } = require("fs-extra");
const args = require("minimist")(process.argv.slice(2));

const backgroundProcessesRoot = path.resolve(__dirname);

const [backgroundProcessName] = args._;
const backgroundProcessPath = path.resolve(
  backgroundProcessesRoot,
  backgroundProcessName
);

// Start supplied background process name if exists
if (existsSync(backgroundProcessPath)) {
  console.log('Booting up background process...'.cyan);
  const backgroundProcess = require(backgroundProcessPath);
  backgroundProcess.init();
}
