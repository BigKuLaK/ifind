const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('../config/paths');

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = {
  "stories": [
    "../src/sb/**/*.stories.js",
    "../src/sb/**/*.stories.mdx",
    "../src/**/**/stories/*.stories.js",
    "../src/**/**/stories/*.stories.mdx",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    const isEnvDevelopment = configType === 'DEVELOPMENT';
    const isEnvProduction = configType === 'PRODUCTION';
    
    if ( configType === 'PRODUCTION' ) {
      // Disable minimize which causes build fail on terserplugin
      config.optimization = {
        minimize: false,
        minimizer: [],
      };
    }

    const cssRegex = /\.css$/;
    const sassRegex = /\.(scss|sass)$/;

    // Add our webpack aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      ...paths.webpackAliases,
    };

    // SASS support.
    // Extracted from config/webpack.config.js
    config.module.rules.push({
      test: sassRegex,
      use: [
        require.resolve('style-loader'),
        isEnvProduction && {
          loader: MiniCssExtractPlugin.loader,
          // css is located in `static/css`, use '../../' to locate index.html folder
          // in production `paths.publicUrlOrPath` can be a relative path
          options: paths.publicUrlOrPath.startsWith('.')
            ? { publicPath: '../../' }
            : {},
        },
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            sourceMap: isEnvProduction
              ? shouldUseSourceMap
              : isEnvDevelopment,
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
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
            ],
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          },
        },
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve('sass-loader'),
          options: {
            sourceMap: true,
            sassOptions: {
              includePaths: [
                paths.appSrc
              ],
            }
          },
        }
      ].filter(Boolean)
    });

    config.plugins.push(...[
        isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        })
      ].filter(Boolean)
    );

    // Testing config
    // require('fs').createWriteStream('config.json');
    // require('fs').writeFileSync('config.json', JSON.stringify(config.module.rules, null, '  '));
    // process.exit();

    // Return the altered config
    return config;
  },
}
