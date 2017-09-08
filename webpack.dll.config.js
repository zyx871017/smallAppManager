var path = require("path");
var webpack = require('webpack');

var vendors = [
  'react',
  'react-dom',
  'material-ui',
  'react-router-dom',
  'react-avatar-editor',
  'redux',
  'react-redux'
];

module.exports = {
  entry: {
    vendor: vendors
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'Dll.js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', 'manifest.json'),
      name: '[name]_[hash]',
      context: __dirname
    })
  ]
}