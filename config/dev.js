const path = require('path')
const express = require('express')
const webpack = require('webpack')
const opn = require('opn')
const webpackConfig = require('./webpack.dev.config.js')
const config = require('./config.js')
const url = 'http://localhost:' + config.dev.port

const app = express()

const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath
  // quiet: true
})
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

// TODO: auto reload home page
// 出自vue-cli，当index.html发生变化时，reload page
// compiler.plugin('compilation', compilation => {
//   compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// serve static assets
const staticPath = path.posix.join(config.dev.publicPath, 'static')
app.use(staticPath, express.static('./static'))

// TODO: proxy

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

module.exports = app.listen(config.dev.port, error => {
  if (error) {
    return console.log(error)
  }
  console.log('listening at port' + config.dev.port)
  // when env is testing, don't open browser
  if (config.dev.autoOpenBrowser && process.env.NODE_ENV !== 'testing') opn(url)
})

// TODO: test config
