const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')
const utils = require('./utils')
const { resolve } = require('path')
const rootPath = resolve(__dirname, '..')
const src = resolve(rootPath, 'src')

// 添加hot-reload到每一个entry chunk
Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = [
    'eventsource-polyfill',
    'webpack-hot-middleware/client?reload=true',
    'webpack/hot/only-dev-server'
  ].concat(baseWebpackConfig.entry[name])
})

const isCacheTurnOn = config.dev.cache
// https://doc.webpack-china.org/loaders/cache-loader/
const cacheConfig = {
  test: /\.jsx?$/,
  include: [src, resolve(rootPath, 'test')],
  use: [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: resolve(rootPath, '.cache')
      }
    },
    'babel-loader',
    'eslint-loader'
  ]
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }).push(
      isCacheTurnOn ? cacheConfig : []
    )
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.ejs',
      inject: true
    }),
    new webpack.DefinePlugin({
    })
  ],
  // devServer: config.dev.devServer ? {
  //   /**
  //   * port 开发服务器的端口
  //   * contentBase属性，服务器提供静态资源的路径，默认是服务器根目录。
  //   */
  //   port: config.dev.devServer.port,
  //   proxy: config.dev.devServer.proxy,
  //   /**
  //   * historyApiFallback用来配置页面的重定向
  //   * 对应spa应用，访问任何路径都应该返回index.html
  //   */
  //   historyApiFallback: {
  //     // index 指index.html在/assets/目录下
  //     index: '/assets/'
  //   },
  //   // 开发环境运行其他电脑访问
  //   host: '0.0.0.0'
  // } : undefined,
  performance: {
    // 当打包的chunk大于250k时，webpack会发出警告，开发环境下关闭该警告。
    hints: config.dev ? false : 'warning'
  }
})

module.exports = webpackConfig