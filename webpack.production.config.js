var webpack = require("webpack");

var config = {
    entry: {
        main: './src/js/main.jsx'
    },
    output: {
        path: './dist/js/',
        filename: '[name].js',
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
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    module: {
        postLoaders: [{
            loader: 'transform?envify'
        }],
        loaders: [{
            test: /\.jsx$/,
            loader: 'jsx-loader?insertPragma=React.DOM&harmony'
        },{
            test: [
                /\.\/components\/.*\.jsx$/
            ],
            loader: "react-router-proxy"
        }, {
            test: /\.less$/,
            loader: "style!css!autoprefixer!less"
        }, {
            test: /\.woff$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.woff2$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.ttf$/,
            loader: "file-loader"
        }, {
            test: /\.eot$/,
            loader: "file-loader"
        }, {
            test: /\.svg$/,
            loader: "file-loader"
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?limit=8192'
        }],
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    }
};

module.exports = config;
