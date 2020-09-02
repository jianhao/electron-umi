import { defineConfig } from 'umi'
import routes from './routes'

export default defineConfig({
  routes,
  outputPath: '../dist',
  // publicPath: process.env.NODE_ENV === 'production' ? '/' : './', // script、link等资源引入路径
  chainWebpack: config => {
    config.target('electron-renderer')
  }, // 针对 electron 编译， 参考：https://webpack.js.org/configuration/target/#string
  proxy: {
    '/api': {
      target: 'https://XXX.net',
      changeOrigin: true,
    },
  },
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    hmr: true,
  },
})
