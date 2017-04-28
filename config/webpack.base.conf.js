const { resolve } = require('path')
const config = require('./config')

const rootPath = resolve(__dirname, '..')
const src = resolve(rootPath, 'src')

module.exports = {
  // 入口配置
  entry: {
    index: resolve(src, 'index')
    /**
    * vendor 用于存储第三方库
    * 为什么不直接把第三方库，直接罗列在这，而是使用vendor.js文件？
    * 使用vendor.js可以在增加第三方库的时候，不用修改配置文件，直接在vendor.js中import就可以了
    */
    /**
    * 在没有CommonsChunkPlugin时，entry配置的最后一项，会作为应用的入口文件
    * 如果存在CommonsChunkPlugin，那么最后一个由CommonsChunkPlugin打包出来的文件作为应用入口文件。
    */
    // 改为隐式提取第三方库文件，所以本行注释掉了。
    // vendor: './src/vendor'
  },
  output: {
    // path 打包之后输出的目录
    path: resolve(rootPath, 'dist'),
    /**
    * filename 根据entry项配置，打包输出的文件名
    * entry有几个输入项，就会打包出几个文件。
    */
    /**
    * chunkhash 是指根据文件内容生产的哈希值
    * 文件内容不变，哈希值就不会变，所以可以使用chunkhash配合浏览器缓存
    */
    filename: '[name].js',
    // 应用发布时的路径，决定了index.html中入口文件的rul。
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.publicPath
      : config.dev.publicPath,
    // chunkFilename 代码分割时，产生的chunk文件的名字
    chunkFilename: '[chunkhash].[id].js'
  },
  module: {
    // rules 当import或require模块时，根据文件类型匹配loader。
    rules: [
      {
        test: /\.js$/,
        include: [src, resolve(rootPath, 'test')],
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              /* html-loader，支持attrs选项，表示什么标签的什么属性需要调用webpack的loader进行打包.
              比如<img>标签的src属性, webpack会把<img>引用的图片打包, 然后src的属性值替换为打包后的路径.
              如果html-loader不指定attrs参数, 默认值是img:src
              */
              attrs: ['img:src']
              /*
              root项，支持定义根目录
              将根目录定义为src，<img src="/favicon.png">, 然后就会顺利的找到src下的favicon.png
              */
              // root: resolve(rootPath, 'src')
            }
          }
        ]
      },
      {
        // test: /\.scss$/,
        // // 使用post-css的autoprefixer，自动给css添加前缀。
        // use: ['style-loader', 'css-loader', 'sass-loader']
        // use: ExtractTextPlugin.extract({
        //   use: ['css-loader', 'postcss-loader', 'sass-loader'],
        //   fallback: 'style-loader'
        // })
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
              // TODO: 将图片等资源生产到img/下
            }
          }
        ]
      }
    ]
  },
  /**
  * resolve 定义别名
  *
  */
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      /*
      将src目录定义为 ~ ,这样在模块中import其他模块时，如果模块的相对路径很深，那就可以使用 ~
      比如：a中引用b
      import b from '../../../components/b'
      可以使用 ~ 来简化
      import b from '~/components/b'
      */
      '~': resolve(rootPath, 'src')
    }
  }
}
