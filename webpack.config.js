const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: {
    home: './index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    content: './dist',
    hot: true
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: 'index.html',
    //   filename: 'index.html',
    //   chunks: ['home']
    // }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/manifest.json')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new UglifyJSPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};