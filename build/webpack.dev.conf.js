var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
//启动热加载功能
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])//合并'./webpack.base.conf'里的entry入口
})

                //合并'./webpack.base.conf'
module.exports = merge(baseWebpackConfig, {
  module: {
    //对cssLoader进行编译
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',//开发调试
  plugins: [
    new webpack.DefinePlugin({//把开发中 process.env 替换成 ‘./config’文件下的  dev.env  作用对运行开发时进行判断
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),//热加载插件
    new webpack.NoEmitOnErrorsPlugin(),//编译出错时，跳过编译出错的代码，使编译后运行的包不发生错误
    // https://github.com/ampedandwired/html-webpack-plugin

    new HtmlWebpackPlugin({
      filename: 'index.html',//编译后生产的文件名
      template: 'index.html',//指处理更目录的index.html 最后处理完还是 同名index.html
      inject: true//指打包后的js css 自动添加到这个html文件里
    }),
    new FriendlyErrorsPlugin()// 用于更友好地输出webpack的警告、错误等信息
  ]
})
