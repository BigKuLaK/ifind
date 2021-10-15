const path = require('path');
const Logger = require('../../_lib/inc/Logger');

const baseDir = path.resolve(__dirname, '../');

module.exports = new Logger({ baseDir });
