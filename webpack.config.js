var webpack = require("webpack");

var config = {
    entry: {
        main: './src/js/main.jsx'
    },
    output: {
        path: './dist/js/',
        filename: '[name].js',
        sourceMapFilename: 'maps/[name].js.map',
        publicPath: '/js/'
    },
    externals: {
      'react': 'window.libs.React',
      'react-router': 'window.libs.ReactRouter',
      'react-bootstrap': 'window.libs.ReactBootstrap',
      'keymirror': 'window.libs.keyMirror',
      'flux': 'window.libs.Flux',
      'lodash': 'window.libs._',
      'immutable': 'window.libs.Immutable',
      'events': 'window.libs.Events',
      'react-classset': 'window.libs.classSet'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.jsx$/,
            loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        },{
            test: [
                /\.\/components\/.*\.jsx$/
            ],
            loader: "react-router-proxy"
        }],
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

module.exports = config;
