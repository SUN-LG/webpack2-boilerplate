const webpack = require('webpack')
const ProdConfig = require('./webpack.prod.conf.js')

webpack(ProdConfig, (err, stats) => {
  console.log(stats.toString({ chunks: false, color: true }))
})
