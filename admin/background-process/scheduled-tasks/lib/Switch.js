const path = require('path');
const Switch = require('../../_lib/inc/Switch');

const baseDir = path.resolve(__dirname, '../');

module.exports = new Switch({ baseDir });
