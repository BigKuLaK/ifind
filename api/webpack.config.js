/**
 * TODO:
 * Add ESLint
 */

const path = require('path');
const nodeExternals = require('webpack-node-externals');

const appRoot = process.cwd();
const resolveApp = (relativePath = '') => path.resolve(appRoot, relativePath);

const { port } = require('./src/config');
const isProduction = process.env.CI === 'true';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  // watch: true,
  entry: {
    server: resolveApp('src/server.js'),
  },
  target: 'node',
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  externals: [nodeExternals()],
  stats: {
    errorDetails: true
  },
  resolve: {
    alias: {
      '@types': resolveApp('src/types'),
      '@resolvers': resolveApp('src/resolvers'),
      '@sources': resolveApp('src/sources'),
    }
  },
  // devServer: {
  //   index: resolveApp('dist/server.js'),
  //   port,
  // }
};