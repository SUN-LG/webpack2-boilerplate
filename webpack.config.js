// const webpack = require('webpack')
// const { resolve } = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
// const WebpackChunkHash = require('webpack-chunk-hash')
//
// module.exports = (options = {}) => {
//   const pkgInfo = require('./package.json')
//   const config = require('./config/' + (process.env.CONFIG || options.config || 'default'))
//   return {
//     // 入口配置
//     entry: {
//       index: './src/index',
//       /**
//       * vendor 用于存储第三方库
//       * 为什么不直接把第三方库，直接罗列在这，而是使用vendor.js文件？
//       * 使用vendor.js可以在增加第三方库的时候，不用修改配置文件，直接在vendor.js中import就可以了
//       */
//       /**
//       * 在没有CommonsChunkPlugin时，entry配置的最后一项，会作为应用的入口文件
//       * 如果存在CommonsChunkPlugin，那么最后一个由CommonsChunkPlugin打包出来的文件作为应用入口文件。
//       */
//       vendor: './src/vendor'
//     },
//     output: {
//       // path 打包之后输出的目录
//       path: resolve(__dirname, 'dist'),
//       /**
//       * filename 根据entry项配置，打包输出的文件名
//       * entry有几个输入项，就会打包出几个文件。
//       */
//       /**
//       * chunkhash 是指根据文件内容生产的哈希值
//       * 文件内容不变，哈希值就不会变，所以可以使用chunkhash配合浏览器缓存
//       */
//       filename: options.dev ? '[name].js' : '[chunkhash].[name].js',
//       // 应用发布时的路径，决定了index.html中入口文件的rul。
//       publicPath: '/assets/',
//       // chunkFilename 代码分割时，产生的chunk文件的名字
//       chunkFilename: '[chunkhash].[id].js'
//     },
//     module: {
//       // rules 当import或require模块时，根据文件类型匹配loader。
//       rules: [
//         {
//           test: /\.js$/,
//           exclude: /node_modules/,
//           use: ['babel-loader', 'eslint-loader']
//         },
//         {
//           test: /\.html$/,
//           use: [
//             {
//               loader: 'html-loader',
//               options: {
//                 /* html-loader，支持attrs选项，表示什么标签的什么属性需要调用webpack的loader进行打包.
//                 比如<img>标签的src属性, webpack会把<img>引用的图片打包, 然后src的属性值替换为打包后的路径.
//                 如果html-loader不指定attrs参数, 默认值是img:src
//                 */
//                 attrs: ['img:src'],
//                 /*
//                 root项，支持定义根目录
//                 将根目录定义为src，<img src="/favicon.png">, 然后就会顺利的找到src下的favicon.png
//                  */
//                 root: resolve(__dirname, 'src')
//               }
//             }
//           ]
//         },
//         {
//           test: /\.css$/,
//           // 使用post-css的autoprefixer，自动给css添加前缀。
//           use: ['style-loader', 'css-loader', 'postcss-loader']
//         },
//         {
//           test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
//           use: [
//             {
//               loader: 'url-loader',
//               options: {
//                 limit: 10000
//               }
//             }
//           ]
//         }
//       ]
//     },
//     plugins: [
//       /**
//       * HtmlWebpackPlugin插件，会根据模板html，重新输出index.html到'/'目录。
//       *
//       */
//       new HtmlWebpackPlugin({
//         template: './src/index.html'
//       }),
//       /**
//       * CommonsChunkPlugin, 用于打包entry中重复的代码
//       * names属性，指定重复代码打包到哪。
//       * 这里我们将重复代码（也就是第三方库）打包进vendor
//       * entry中有vendor项，所以第三方库会打包到entry中的vendor，并不是新生成的vendor。
//       */
//       /**
//       * webpack运行时：
//       * 为了最小化生成的文件大小，webpack 使用标识符而不是模块名称（就是讲模块名称例如react，映射为0, react-router, 映射为1......），在编译时会生成一个名为 chunk manifest对象，其中就存储着映射关系。chunk manifest就是运行时代码。
//       * 而webpack会将运行时代码打包进应用的入口文件（即index.html中引用的入口文件）
//       *
//       * 由于运行时代码存在于vendor中，如果其他文件发生变化，运行时也就跟着变化，导致vendor变化。
//       * 这样浏览器就不能缓存vendor了，也就失去了分离第三方库的意义。
//       *
//       * 不过可以通过以下方法解决：
//       */
//       /**
//       * names属性可以是数组，此时相当于：
//       * new webpack.optimize.CommonsChunkPlugin({
//       *   names: 'vendor'
//       * })，
//       *
//       * new webpack.optimize.CommonsChunkPlugin({
//       *   names: 'manifest'
//       * })
//       *
//       * 先将第三方库和运行时打包到vendor中，然后再将运行时打包到manifest中，这样就实现了运行时代码的分离。
//       */
//       new webpack.optimize.CommonsChunkPlugin({
//         names: ['vendor', 'manifest'],
//         minChunks: Infinity
//       }),
//       new ChunkManifestPlugin({
//         filename: 'chunk-manifest.json',
//         manifestVariable: 'webpackManifest'
//       }),
//       new WebpackChunkHash(),
//       // 定义环境变量
//       /**
//        * 下面定义的变量，都会成为全局变量，可以直接在模块中使用。
//        *
//        */
//       new webpack.DefinePlugin({
//         DEBUG: Boolean(options.dev),
//         VERSION: JSON.stringify(pkgInfo.version),
//         CONFIG: JSON.stringify(config.runtimeConfig)
//       })
//     ],
//     /**
//      * resolve 定义别名
//      *
//      */
//     resolve: {
//       alias: {
//         /*
//         将src目录定义为 ~ ,这样在模块中import其他模块时，如果模块的相对路径很深，那就可以使用 ~
//         比如：a中引用b
//           import b from '../../../components/b'
//         可以使用 ~ 来简化
//           import b from '~/components/b'
//         */
//         '~': resolve(__dirname, 'src')
//       }
//     },
//     devServer: config.devServer ? {
//       /**
//       * port 开发服务器的端口
//       * contentBase属性，服务器提供静态资源的路径，默认是服务器根目录。
//       */
//       port: config.devServer.port,
//       proxy: config.devServer.proxy,
//       /**
//       * historyApiFallback用来配置页面的重定向
//       * 对应spa应用，访问任何路径都应该返回index.html
//       */
//       historyApiFallback: {
//         // index 指index.html在/assets/目录下
//         index: '/assets/'
//       },
//       // 开发环境运行其他电脑访问
//       host: '0.0.0.0'
//     } : undefined,
//     performance: {
//       // 当打包的chunk大于250k时，webpack会发出警告，开发环境下关闭该警告。
//       hints: options.dev ? false : 'warning'
//     }
//   }
// }

module.exports = (options = {}) => {
  const dev = options.dev
  return dev ? require('./config/webpack.dev.config.js') : require('./config/webpack.prod.conf.js')
}
