/**
 * Created by chenmao on 2017/6/28.
 */
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config=require('./config');
var px2rem = require('postcss-px2rem');

module.exports = {
    entry:  {
        main: path.resolve(__dirname,'app/main.js'),
        vendor: ['react','react-dom','react-router','redux','react-redux','redux-thunk','redux-immutable','immutable','fastclick','lodash']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath:'/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader?cacheDirectory',
                exclude: /node_modules/
             },
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader"]
                })
            },
            {
                test:/\.less$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","postcss-loader","less-loader"]
                })
             },
            {
                // 解析图片，小于8kb的转换成base64
                // 注意配种中的name,就是生成到了images文件夹下
                test: /\.(png|jpg)$/,
                exclude: /node_modules/,
                use: ['url-loader?limit=8192&name=images/[hash:8].[name].[ext]']
                //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
            },
            {
                test: /\.(eot|woff|ttf|woff2|gif|appcache|gif)(\?|$)/, // 解析各种非图片文件
                exclude: /node_modules/,
                use: ['file-loader?name=[name].[ext]']
            },
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.(svg)$/i,
                use: 'svg-sprite-loader',
                include: [
                    require.resolve('antd-mobile').replace(/warn\.js$/, ''),// 1. 属于 antd-mobile 内置 svg 文件
                    path.resolve(__dirname, 'app/images')// 2. 自己私人的 svg 存放目录
                ]
            }
         ]
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: [ '.web.js', '.js', '.json','.less']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [
                        require('autoprefixer')({
                            browsers: ['last 10 versions','ie>=8','>1% in CN']
                        }),
                        px2rem({remUnit: 75})
                    ];
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename:'common.js'

        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件,生产模式下就不需要
        new webpack.ProvidePlugin({
            _:'lodash',
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
         }),
        new ExtractTextPlugin("styles/[name].css")
    ],
    devServer: {
          colors: true,
          historyApiFallback: true,
          inline: true,
          hot: false,
        host:'172.22.200.86'
    }
};
