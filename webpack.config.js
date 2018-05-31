const { resolve } = require('path');

module.exports = {
  entry: resolve(__dirname, './src/index.js'),
  output: {
    path: resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader']
      },
    ]
  }
};
