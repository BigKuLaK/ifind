const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const sassRegex = /\.scss$/i;

const PROJECT_ROOT = process.cwd();

module.exports = {
  webpack: (config, webpack) => {

    // config.module.rules[0].include = [
    //   path.resolve(process.cwd(), 'plugins/_includes'),
    //   path.resolve(process.cwd(), 'node_modules'),
    // ];

    // SASS support.
    // Extracted from config/webpack.config.js
    config.module.rules.push({
      test: sassRegex,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            sourceMap: true,
          },
        },
        {
          // Options for PostCSS as we reference these options twice
          // Adds vendor prefixing based on your specified browser support in
          // package.json
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            postcssOptions: {
              ident: 'postcss',
              plugins: [
                // require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            },
            sourceMap: true,
          },
        },
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: true,
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
            sassOptions: {}
          },
        }
      ].filter(Boolean)
    });

    config.resolve = config.resolve || {};

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@plugins': path.resolve(PROJECT_ROOT, 'plugins'),
    }

    return config;
  },
};
