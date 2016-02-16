var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  entry: {
    bragi: './src/bragi.js',
    docs: './src/docs.js'
  },
  output: {
    path: './bundle',
    publicPath: '',
    filename: './[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {test: /\.js?$/, loader: 'babel', exclude: /node_modules/},
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file?name=[name].[ext]?[hash]'
      }
    ]
  },
  vue: {
    loaders: {
      scss: 'style!css!sass'
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  externals: {
    "jquery": "jQuery",
    "d3": "d3"
  },
  plugins: [
    new ExtractTextPlugin('./[name].css'),
    new CommonsChunkPlugin('bragi', './bragi.js')
  ],
  devtool: '#source-map'
};
