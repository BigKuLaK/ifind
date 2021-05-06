const StylelintPlugin = require('stylelint-webpack-plugin');

const options = {};

module.exports = {
    stylelintPlugin: new StylelintPlugin(options),
};