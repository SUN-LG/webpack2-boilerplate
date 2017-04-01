module.exports = {
  build: {
    env: 'production',
    assetsRoot: 'dist',
    publicPath: '/',
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
    publicPath: '/assets/',
    devServer: {
      port: 8100,
      proxy: {
        '/api/auth/': {
          target: 'http://api.example.dev',
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      }
    }
  }
}
