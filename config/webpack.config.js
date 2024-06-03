const CopyPlugin = require('copy-webpack-plugin');
const GenerateJsonFromJsPlugin = require('generate-json-from-js-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const { join } = require('path');
const { inDev } = require("./helpers");

dotenv.config();

const browsers = [
  'chrome'
];

const Root = join(__dirname, '..');
const Source = join(Root, 'src');
const Dist = join(Root, 'dist');

const Public = join(Root, 'public');
const Background = join(Source, 'background');
const Content = join(Source, 'content');
const SidePanel = join(Source, 'sidePanel');
const Lib = join(Source, 'lib');
const Options = join(Source, 'options');

const config = {
  mode: process.env.NODE_ENV,
  target: 'web',
  devtool: inDev() ? 'source-map' : undefined,
  entry: {
    background: join(Background, 'index.ts'),
    content: join(Content, 'index.tsx'),
    app: join(SidePanel, 'index.tsx')
  },
  module: { rules: require('./rules') },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
    alias: {
      lib: Lib,
      background: Background,
      sidePanel: SidePanel,
      content: Content,
      assets: Public,
      options: Options,
      ...require('./aliases')
    }
  },
  plugins: [
    ...require('./plugins'),
    new HtmlWebpackPlugin(
        {
          inject: 'body',
          template: join(SidePanel, 'index.html'),
          filename: 'assets/sidePanel.html',
          chunks: ['app']
        }),
    ...browsers.map(browser => new GenerateJsonFromJsPlugin({
          path: join(__dirname, 'manifest', `${browser}.js`),
          filename: 'manifest.json',
          options: {
            replacer: (key, value) => {
              switch (key) {
                case 'extension_pages':
                  return value.replace(/\s+/g, ' ');
                default:
                  return value;
              }
            }
          }
    })),
    new CopyPlugin({
      patterns: [
        {
          from: Public,
          to: 'assets'
        }
      ]
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/].*[\\/]/,
          name: 'assets/vendor',
          chunks: chunk => chunk.name !== "background"
        }
      }
    }
  }
};

const buildConfig = browser => ({
  ...config,
  name: browser,
  output: {
    path: join(Dist, browser),
    filename: '[name].js',
    publicPath: process.env.EXTENSION_PUBLIC_PATH
  }
});

module.exports = buildConfig(process.env.BROWSER || 'chrome');

