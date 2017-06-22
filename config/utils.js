const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const cssLoaders = function(options = {}) {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  function generateLoaders(loader, loderOptions) {
    const loaders = ['style-loader', cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loderOptions, {
          sourceMap: options.sourceMap
        })
      })
      loaders.push({
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [
            autoprefixer({
              browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
            })
          ]
        }
      })
    }

    if (options.extract) {
      loaders.shift()
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    }

    return loaders
  }

  return {
    css: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

const styleLoaders = function(options) {
  const output = []
  const loaders = cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

module.exports = {
  styleLoaders
}
