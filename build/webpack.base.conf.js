var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir) //当前项目的根目录 如：my-project
}

module.exports = {
  entry: {
    app: './src/main.js'//编译入口文件 指向 src下的main.js
  },
  output: {
    path: config.build.assetsRoot,//config文件下index.js中build下assetsRoot
    filename: '[name].js',//[name]对应 entry 下的key 名字，最后输出也是如:app
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],//自动补全后缀名
    alias: {//提供一些别名  也就是 简称
      'src': path.resolve(__dirname, '../src'),
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [//根据后缀名 匹配不同的文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')] //include:指 对当前指点的文件进行检查   exclude:排除这些文件检查 如 exclue:/node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,//limit:当图片小于10KB的时候  会打包成 base64的图片
          name: utils.assetsPath('img/[name].[hash:7].[ext]')//ext为扩展名
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
