module.exports = {
  build: {
    env: 'production',
    assetsRoot: 'dist',
    publicPath: '/',
    cssSourceMap: true,
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: 'development',
    publicPath: '/',
    cssSourceMap: false,
    port: 9000,
    autoOpenBrowser: true,
    // 是否启用缓存，来提升性能。 建议只有在有性能问题时，再开启
    cache: false,
    // devServer: {
    //   port: 8100,
    //   proxy: {
    //     '/api/auth/': {
    //       target: 'http://api.example.dev',
    //       changeOrigin: true,
    //       pathRewrite: { '^/api': '' }
    //     }
    //   }
    // }
  }
}
