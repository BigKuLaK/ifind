const path = require('path');
const EventEmitter = require('events');
const Task = require('../../lib/Task');
const BackgroundProcessSwitch = require('../../../_lib/inc/Switch');

const productValidatorPath = path.resolve(__dirname, '../../../product-validator');

/**
 * This only triggers the Product Validator to run
 * This does not intend to intialize a separate instance
 * of the ProductValidator
 */
class ProductValidatorTask extends Task {
  constructor(rawData) {
    super(rawData);
  }
}

module.exports = ProductValidatorTask;
