const webpack = require("webpack");
const process = require('process');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PUBLIC_PATH='/assets/';
const OUTPUT_DIRECTORY = __dirname + `/public/${PUBLIC_PATH}`;

const BABEL_PRESET = {
  loader: 'babel-loader',
  options: {
    presets: ['es2015']
  }
};

module.exports = {
    entry: {
      app: "./app/index.js",
      style: "./app/stylesheets/style.scss"
    },
    output: {
        path: OUTPUT_DIRECTORY,
        filename: `[name].js`,
        publicPath: PUBLIC_PATH,
    },
    module: {
      rules: [
        {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
        {
        test: /\.js$/,
        exclude: /node_modules/,
        use : {
        loader: "babel-loader",
        },
      },
        {
          test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
          loader: "file-loader",
          query: {
            context: './app/assets',
            name: "[name].[ext]"
          }
        }
      ]
    },
    plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css' ,
      chunkFilename: '[id].css' ,
    })
  ]
};

