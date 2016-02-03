var path = require('path');

module.exports = {

  context: __dirname,

  entry: './example/src.jsx',

  output: {
    path: path.join(__dirname, 'example'),
    filename: 'index.js',
    publicPath: '/'
  },

  resolve: {
    root: path.join(__dirname, 'example'),
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: ['babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0,presets[]=stage-1'],
        exclude: /node_modules/
      }
    ]
  }
};
