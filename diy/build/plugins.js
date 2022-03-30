const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const plugins = [];

plugins.push(
  new HtmlWebpackPlugin({
    filename: `index.html`,
    template: path.resolve(__dirname, '../src', `index.ejs`),
    inject: true,
    chunks: ['common', 'index'],
    favicon: './diy/src/assets/img/favicon.ico',
    title: '首页',
    path: 'index',
    minify: {
      collapseWhitespace: true
    }
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[hash:8].css',
    chunkFilename: '[id].css',
  }),
  new optimizeCss({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardComments: {
        removeAll: true
      }
    },
    canPrint: true
  }),
  // new TransfromAssets()
)

module.exports = plugins;
