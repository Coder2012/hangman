const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const assetsFrom = path.resolve(__dirname, 'public/assets')
const assetsTo = 'assets'

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: 'dist',
    inline: true,
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hangman',
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new CopyWebpackPlugin([{ from: `${assetsFrom}`, to: `${assetsTo}` }]),
    new Dotenv(),
  ],
}
