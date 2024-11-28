const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const path = require('path');

const contentEntries = glob.sync('./src/content/*.ts').map((entry) => ('./' + entry));
const popupEntries = glob.sync('./src/popup/*.ts').map((entry) => ('./' + entry));

module.exports = {
  mode: 'production',
  entry: {
    content: contentEntries,
    popup: popupEntries,
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './manifest.json', to: 'manifest.json' },
        { from: './src/popup.html', to: 'popup.html' },
        { from: './icons', to: 'icons' },
        { from: './bootstrap', to: 'bootstrap' },
      ]
    })
  ]
};