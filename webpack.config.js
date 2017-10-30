const path = require('path');
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
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/manifest.json')
    }),
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