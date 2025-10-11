const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin'); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const htmlFiles = fs.globSync('*.html', { cwd: __dirname });

module.exports = {
    entry: './crrlib.js',
    output: {
        filename: 'crr.bundle.js',
        path: path.resolve(__dirname, 'gh-pages', 'javascripts'),
        publicPath: '/javascripts/',
        library: 'crr'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        ...htmlFiles.map(file =>
            new HtmlWebpackPlugin({
                    template: `./${file}`,
                    filename: path.resolve(__dirname, 'gh-pages', file),
                    inject: 'body',
                    scriptLoading: 'blocking',
                    alwaysWriteToDisk: true,
            })
        ),
        new HtmlWebpackHarddiskPlugin(),
        new MiniCssExtractPlugin({
            filename: '../stylesheets/crr.bundle.css'
        })
    ],
    devServer: {
        hot: true,
        open: true,
        port: 9000,
        static: path.join(__dirname, 'gh-pages'),
    }
};