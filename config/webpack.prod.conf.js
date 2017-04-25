const webpack = require('webpack')
const { resolve } = require('path')
const config = require('./config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  module: {

  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: resolve(__dirname, '..', config.build.assetsRoot),
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: resolve(__dirname, 'dist', 'css/[name].[contenthash].css')
    }),
    // new CopyWebpackPlugin([
    //   {
    //     from: resolve(__dirname, './static'),
    //     to: config.build.assetsSubDirectory,
    //     ignore: ['.*']
    //   }
    // ]),
    /**
    * HtmlWebpackPlugin插件，会根据模板html，重新输出index.html到'/'目录。
    *
    */
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    /**
    * CommonsChunkPlugin, 用于打包entry中重复的代码
    * names属性，指定重复代码打包到哪。
    * 这里我们将重复代码（也就是第三方库）打包进vendor
    * entry中有vendor项，所以第三方库会打包到entry中的vendor，并不是新生成的vendor。
    */
    /**
    * webpack运行时：
    * 为了最小化生成的文件大小，webpack 使用标识符而不是模块名称（就是讲模块名称例如react，映射为0, react-router, 映射为1......），在编译时会生成一个名为 chunk manifest对象，其中就存储着映射关系。chunk manifest就是运行时代码。
    * 而webpack会将运行时代码打包进应用的入口文件（即index.html中引用的入口文件）
    *
    * 由于运行时代码存在于vendor中，如果其他文件发生变化，运行时也就跟着变化，导致vendor变化。
    * 这样浏览器就不能缓存vendor了，也就失去了分离第三方库的意义。
    *
    * 不过可以通过以下方法解决：
    */
    /**
    * names属性可以是数组，此时相当于：
    * new webpack.optimize.CommonsChunkPlugin({
    *   names: 'vendor'
    * })，
    *
    * new webpack.optimize.CommonsChunkPlugin({
    *   names: 'manifest'
    * })
    *
    * 先将第三方库和运行时打包到vendor中，然后再将运行时打包到manifest中，这样就实现了运行时代码的分离。
    */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // this assumes your vendor imports exist in the node_modules directory
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest'
    }),
    new WebpackChunkHash()
    // 定义环境变量
    /**
     * 下面定义的变量，都会成为全局变量，可以直接在模块中使用。
     *
     */
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = webpackConfig
