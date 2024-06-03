const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  new webpack.DefinePlugin(Object.keys(process.env).reduce((accum, key) => {
    if (key.startsWith('REACT_APP_') || key.startsWith('NODE_')) {
      return { ...accum, [`process.env.${key}`]: JSON.stringify(process.env[key]) };
    }

    return accum;
  }, {})),
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[name].[chunkhash].chunk.css'
  })
];