var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(env_prod){
    var output_options = {
        path: './dist/assets/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/assets/'
    };
    if(!env_prod){
        output_options.sourceMapFilename = 'maps/[name].js.map';
    }

    var plugins_options = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"), new ExtractTextPlugin('[name].css')];
    if(env_prod){
        plugins_options.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));

        plugins_options.push(new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }));
    }

    var postLoaders_options = [];
    if(env_prod) {
        postLoaders_options = [{
            loader: 'transform?envify'
        }];
    }

    return {
        entry: {
            main: './src/js/main.jsx',
            vendor: ['react', 'react-router', 'react-bootstrap', 'keymirror', 'flux', 'lodash', 'immutable', 'events', 'react-classset']
        },
        output: output_options,
        plugins: plugins_options,
        debug: !env_prod,
        devtool: (!env_prod)? 'source-map': null,
        module: {
            postLoaders: postLoaders_options,
            loaders: [{
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            }, {
                test: [
                    /\.\/components\/.*\.jsx$/
                ],
                loader: "react-router-proxy"
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")
            },{
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader")
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
            extensions: ['', '.js', '.jsx']
        }
    };
};