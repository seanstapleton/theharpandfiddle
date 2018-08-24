const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: './public/js/index.js',
    'menu-loader': './public/js/menu-loader.js',
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'public/js/dist'),
  },
  mode: 'development',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.ProvidePlugin({
      moment: 'moment',
    }),
  ],
};
