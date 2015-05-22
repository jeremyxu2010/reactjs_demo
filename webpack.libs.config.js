var webpack = require("webpack");

var config = {
    entry: {
        libs: './src/js/libs.js'
    },
    output: {
        path: './dist/assets/',
        filename: '[name].js',
        sourceMapFilename: 'maps/[name].js.map',
        chunkFilename: '[name].js',
        publicPath: '/assets/'
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
        }],
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

module.exports = config;
